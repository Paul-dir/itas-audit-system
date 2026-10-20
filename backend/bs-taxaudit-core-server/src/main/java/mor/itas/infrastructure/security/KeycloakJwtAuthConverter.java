package mor.itas.infrastructure.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mor.itas.persistence.jpa.entity.identity.UserEntity;
import mor.itas.persistence.jpa.repository.identity.UserRepository;
import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Converts a Keycloak JWT into an ITAS-aware authentication token.
 *
 * Strategy:
 * 1. Extract the Keycloak 'sub' claim (user's unique ID in Keycloak).
 * 2. Look up the corresponding local UserEntity by keycloak_user_id.
 * 3. If found, build authorities from the local ITAS role/permission model
 *    (takes precedence — ITAS controls fine-grained permissions, not Keycloak).
 * 4. If NOT found (first login or sync pending), fall back to Keycloak realm_access roles.
 * 5. Wrap in an ItasPrincipal so controllers can call principal.hasPermission("REPORT_APPROVE").
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class KeycloakJwtAuthConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public AbstractAuthenticationToken convert(@NonNull Jwt jwt) {
        String keycloakSub = jwt.getSubject();
        String preferredUsername = jwt.getClaimAsString("preferred_username");

        Set<GrantedAuthority> authorities;
        String userId = keycloakSub;
        String fullName = jwt.getClaimAsString("name");
        String orgUnitId = null;
        String username = preferredUsername != null ? preferredUsername : keycloakSub;

        // Attempt to resolve ITAS local user by Keycloak sub
        Optional<UserEntity> localUser = userRepository.findByKeycloakUserId(keycloakSub);

        if (localUser.isPresent()) {
            UserEntity user = localUser.get();
            if (!user.isActive()) {
                log.warn("Keycloak user '{}' maps to disabled ITAS user. Access denied.", keycloakSub);
                return new JwtAuthenticationToken(jwt, Collections.emptyList());
            }
            userId = user.getId().toString();
            fullName = user.getFullName();
            orgUnitId = user.getOrgUnitId() != null ? user.getOrgUnitId().toString() : null;
            username = user.getUsername();
            authorities = buildFromLocalUser(user);
            log.debug("Authenticated ITAS user '{}' with {} authorities", username, authorities.size());
        } else {
            // Fallback: user exists in Keycloak but not yet synced to ITAS DB.
            // Grant only Keycloak realm roles (no fine-grained permissions yet).
            log.warn("No local ITAS user found for Keycloak sub '{}'. Granting Keycloak roles only.", keycloakSub);
            authorities = extractKeycloakRoles(jwt);
        }

        ItasPrincipal principal = new ItasPrincipal(userId, username, "", fullName, orgUnitId, authorities);
        final String resolvedUsername = username;
        return new JwtAuthenticationToken(jwt, authorities) {
            @Override
            public Object getPrincipal() { return principal; }
            @Override
            public String getName() { return resolvedUsername; }
        };
    }

    private Set<GrantedAuthority> buildFromLocalUser(UserEntity user) {
        Set<GrantedAuthority> authorities = user.getRoles().stream()
            .filter(r -> r.isActive())
            .map(r -> new SimpleGrantedAuthority("ROLE_" + r.getCode()))
            .collect(Collectors.toSet());
        // Fine-grained permission authorities
        user.getAllPermissionCodes().stream()
            .map(code -> (GrantedAuthority) new SimpleGrantedAuthority("PERM_" + code))
            .forEach(authorities::add);
        return authorities;
    }

    @SuppressWarnings("unchecked")
    private Set<GrantedAuthority> extractKeycloakRoles(Jwt jwt) {
        // Keycloak puts realm roles under realm_access.roles
        Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
        if (realmAccess == null) return Collections.emptySet();
        List<String> roles = (List<String>) realmAccess.getOrDefault("roles", Collections.emptyList());
        return roles.stream()
            .map(r -> new SimpleGrantedAuthority("ROLE_" + r.toUpperCase()))
            .collect(Collectors.toSet());
    }
}
