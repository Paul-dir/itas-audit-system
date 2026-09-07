package mor.itas.persistence.jpa.repository.identity;

import mor.itas.persistence.jpa.entity.identity.UserOrganizationalAssignmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserOrganizationalAssignmentRepository extends JpaRepository<UserOrganizationalAssignmentEntity, UUID> {

    @Query("SELECT u FROM UserOrganizationalAssignmentEntity u WHERE u.userId = :userId AND u.status = :status")
    Optional<UserOrganizationalAssignmentEntity> findByUserIdAndStatus(@Param("userId") UUID userId, @Param("status") String status);

    List<UserOrganizationalAssignmentEntity> findByTaxCenterIdAndStatus(UUID taxCenterId, String status);

    List<UserOrganizationalAssignmentEntity> findByTaxCenterIdAndRoleCodeAndStatus(UUID taxCenterId, String roleCode, String status);
}
