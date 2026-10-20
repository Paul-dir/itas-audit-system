package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * JPA Repository for t_user table.
 * Replaces MockUserRepository with persistent DB storage.
 */
@Repository
public interface UserJpaRepository extends JpaRepository<UserEntity, UUID> {

    Optional<UserEntity> findByUsername(String username);

    Optional<UserEntity> findByEmail(String email);

    List<UserEntity> findByUserType(String userType);

    List<UserEntity> findByStatus(String status);

    List<UserEntity> findByAssignedLocation(String assignedLocation);

    /**
     * Find team leaders filtered by audit type and/or tax center.
     * Used by the committee auditor nomination endpoint.
     */
    @Query("SELECT u FROM ApUserEntity u WHERE u.userType = 'TEAM_LEADER' " +
           "AND (:auditType IS NULL OR u.auditType = :auditType) " +
           "AND (:taxCenter IS NULL OR u.assignedLocation = :taxCenter) " +
           "AND u.status = 'ACTIVE'")
    List<UserEntity> findTeamLeaders(
            @Param("auditType") String auditType,
            @Param("taxCenter") String taxCenter);

    /**
     * Find auditors filtered by audit type and/or tax center.
     */
    @Query("SELECT u FROM ApUserEntity u WHERE u.userType = 'AUDITOR' " +
           "AND (:auditType IS NULL OR u.auditType = :auditType) " +
           "AND (:taxCenter IS NULL OR u.assignedLocation = :taxCenter) " +
           "AND u.status = 'ACTIVE'")
    List<UserEntity> findAuditors(
            @Param("auditType") String auditType,
            @Param("taxCenter") String taxCenter);

    /**
     * Find users by type and audit type.
     */
    List<UserEntity> findByUserTypeAndAuditType(String userType, String auditType);

    /**
     * Count active users by type.
     */
    long countByUserTypeAndStatus(String userType, String status);
}
