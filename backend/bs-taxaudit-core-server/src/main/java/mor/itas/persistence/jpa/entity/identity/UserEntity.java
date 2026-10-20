package mor.itas.persistence.jpa.entity.identity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.*;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_users_username", columnList = "username"),
    @Index(name = "idx_users_email",    columnList = "email"),
    @Index(name = "idx_users_org_unit", columnList = "org_unit_id")
})
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserEntity {

    @Id
    @Column(columnDefinition = "UUID")
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @Column(nullable = false, unique = true, length = 64)
    private String username;

    @Column(nullable = false, unique = true, length = 256)
    private String email;

    @Column(nullable = false, name = "full_name", length = 256)
    private String fullName;

    /** Keycloak JWT 'sub' claim — links this record to the IdP identity. */
    @Column(name = "keycloak_user_id", unique = true, length = 256)
    private String keycloakUserId;

    @Column(name = "employee_id", length = 64)
    private String employeeId;

    @Column(name = "org_unit_id", columnDefinition = "UUID")
    private UUID orgUnitId;

    @Column(nullable = false, name = "is_active")
    @Builder.Default
    private boolean active = true;

    @Column(name = "last_login_at")
    private OffsetDateTime lastLoginAt;

    // No password stored — Keycloak manages authentication.

    @Column(name = "failed_login_count")
    @Builder.Default
    private int failedLoginCount = 0;

    @Column(name = "locked_until")
    private OffsetDateTime lockedUntil;

    @Column(nullable = false, name = "created_at")
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns        = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Builder.Default
    private Set<RoleEntity> roles = new HashSet<>();

    /** Convenience: collect all permission codes from all roles. */
    public Set<String> getAllPermissionCodes() {
        Set<String> perms = new HashSet<>();
        for (RoleEntity role : roles) {
            for (PermissionEntity perm : role.getPermissions()) {
                perms.add(perm.getCode());
            }
        }
        return perms;
    }
}
