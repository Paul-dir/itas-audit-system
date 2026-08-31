package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.DirectorApprovalEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * DirectorApprovalRepository - Data access for director approval decisions
 */
@Repository
public interface DirectorApprovalRepository extends JpaRepository<DirectorApprovalEntity, UUID> {

    /**
     * Find the latest approval decision for a plan
     */
    Optional<DirectorApprovalEntity> findByPlanId(UUID planId);

    /**
     * Find all approvals by a specific director
     */
    List<DirectorApprovalEntity> findByDirectorId(String directorId);

    /**
     * Find all approvals for a plan (should be 0 or 1 per the constraint)
     */
    @Query("SELECT da FROM DirectorApprovalEntity da WHERE da.planId = :planId ORDER BY da.approvedAt DESC")
    List<DirectorApprovalEntity> findAllByPlanIdOrderByApprovedAtDesc(@Param("planId") UUID planId);

    /**
     * Check if a plan has been approved
     */
    @Query("SELECT CASE WHEN COUNT(da) > 0 THEN TRUE ELSE FALSE END " +
           "FROM DirectorApprovalEntity da WHERE da.planId = :planId AND da.decision = 'APPROVED'")
    boolean isApproved(@Param("planId") UUID planId);
}
