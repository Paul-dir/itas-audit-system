package mor.itas.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Mock Authentication Filter for local development.
 * Injects a fake authenticated user with ALL roles into the SecurityContext
 * so that @PreAuthorize annotations on controllers work without Keycloak.
 *
 * The actor ID is taken from the X-Actor-Id header if present, otherwise defaults to "mock-user-001".
 */
@Component
@Profile("mock")
public class MockAuthenticationFilter extends OncePerRequestFilter {

    private static final List<SimpleGrantedAuthority> ALL_AUTHORITIES = List.of(
            new SimpleGrantedAuthority("ROLE_COMMITTEE_MEMBER"),
            new SimpleGrantedAuthority("ROLE_CHAIRPERSON"),
            new SimpleGrantedAuthority("ROLE_PLANNING_TEAM"),
            new SimpleGrantedAuthority("ROLE_AUDIT_DIRECTOR"),
            new SimpleGrantedAuthority("ROLE_REGIONAL_DIRECTOR"),
            new SimpleGrantedAuthority("ROLE_SENIOR_MANAGEMENT"),
            new SimpleGrantedAuthority("ROLE_TAX_CENTER_MANAGER"),
            new SimpleGrantedAuthority("ROLE_TEAM_LEADER"),
            new SimpleGrantedAuthority("ROLE_AUDITOR")
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Use X-Actor-Id header as the username, or default
        String actorId = request.getHeader("X-Actor-Id");
        if (actorId == null || actorId.isBlank()) {
            actorId = "mock-user-001";
        }

        // Create an authenticated principal with all roles
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(actorId, null, ALL_AUTHORITIES);

        SecurityContextHolder.getContext().setAuthentication(auth);

        // Store actor ID in ThreadLocal for downstream use
        mor.itas.observability.audit.ActorContextHolder.setActorId(actorId);

        try {
            filterChain.doFilter(request, response);
        } finally {
            mor.itas.observability.audit.ActorContextHolder.clear();
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Only apply to /api paths
        return !request.getRequestURI().startsWith("/api");
    }
}
