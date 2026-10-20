package mor.itas.api.controller.backoffice.identity;

import lombok.RequiredArgsConstructor;
import mor.itas.infrastructure.security.ItasPrincipal;
import mor.itas.persistence.jpa.entity.identity.UserEntity;
import mor.itas.persistence.jpa.repository.identity.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Identity API — provides the authenticated user's profile and permissions.
 * GET /api/v1/users/me  — used by the frontend on login to resolve role/permissions.
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UsersMeController {

    private final UserRepository userRepository;

    /**
     * Returns the currently authenticated user's profile including:
     * - ITAS user metadata (id, name, orgUnit)
     * - All role codes
     * - All permission codes (used by the frontend usePermission() hook)
     */
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(
            @AuthenticationPrincipal ItasPrincipal principal) {

        List<String> roles = principal.getAuthorities().stream()
            .filter(a -> a.getAuthority().startsWith("ROLE_"))
            .map(a -> a.getAuthority().substring(5))
            .collect(Collectors.toList());

        List<String> permissions = principal.getAuthorities().stream()
            .filter(a -> a.getAuthority().startsWith("PERM_"))
            .map(a -> a.getAuthority().substring(5))
            .collect(Collectors.toList());

        UserProfileResponse response = UserProfileResponse.builder()
            .id(principal.getUserId())
            .username(principal.getUsername())
            .fullName(principal.getFullName())
            .orgUnitId(principal.getOrgUnitId())
            .roles(roles)
            .permissions(permissions)
            .build();

        return ResponseEntity.ok(response);
    }

    /** Returns a list of all active users (used for team assignment dropdowns). */
    @GetMapping
    @PreAuthorize("hasAuthority('PERM_USER_MANAGE') or hasAuthority('PERM_CASE_ASSIGN')")
    public ResponseEntity<List<UserSummaryResponse>> listUsers() {
        List<UserSummaryResponse> users = userRepository.findAll().stream()
            .filter(UserEntity::isActive)
            .map(u -> UserSummaryResponse.builder()
                .id(u.getId().toString())
                .username(u.getUsername())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .orgUnitId(u.getOrgUnitId() != null ? u.getOrgUnitId().toString() : null)
                .roles(u.getRoles().stream().map(r -> r.getCode()).collect(Collectors.toList()))
                .build())
            .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    // ── DTOs ─────────────────────────────────────────────────────────────────

    @lombok.Data @lombok.Builder
    public static class UserProfileResponse {
        private String id;
        private String username;
        private String fullName;
        private String orgUnitId;
        private List<String> roles;
        private List<String> permissions;
    }

    @lombok.Data @lombok.Builder
    public static class UserSummaryResponse {
        private String id;
        private String username;
        private String fullName;
        private String email;
        private String orgUnitId;
        private List<String> roles;
    }
}
