package mor.itas.persistence.jpa.repository.identity;

import mor.itas.persistence.jpa.entity.identity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    Optional<UserEntity> findByUsername(String username);
    Optional<UserEntity> findByEmail(String email);
    /** Used by KeycloakJwtAuthConverter to resolve ITAS user from Keycloak sub claim. */
    Optional<UserEntity> findByKeycloakUserId(String keycloakUserId);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    @Query("SELECT u FROM UserEntity u JOIN u.roles r JOIN r.permissions p " +
           "WHERE u.id = :userId AND p.code = :permissionCode AND u.active = true")
    Optional<UserEntity> findByIdAndPermission(UUID userId, String permissionCode);
}
