package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.AuditPlanRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface AuditPlanRecordRepository extends JpaRepository<AuditPlanRecordEntity, UUID> {
    
    // Existing queries
    List<AuditPlanRecordEntity> findByCaseIdOrderByCreatedAtDesc(UUID caseId);
    AuditPlanRecordEntity findFirstByCaseIdAndStatusOrderByCreatedAtDesc(UUID caseId, String status);
    
    // ═════════════════════════════════════════════════════════════════════
    // NEW: Team Lead Plan Visibility Queries (Added in V3_9)
    // ═════════════════════════════════════════════════════════════════════
    
    /**
     * Find all plans for a team leader filtered by status.
     * Ordered by creation date (newest first).
     */
    List<AuditPlanRecordEntity> findByTeamLeadIdAndStatusOrderByCreatedAtDesc(
        String teamLeadId, String status);
    
    /**
     * Find all pending plans (SUBMITTED or REVISION_REQUESTED) for a team leader.
     * Most common query pattern for team leader dashboard.
     */
    @Query("""
        SELECT p FROM AuditPlanRecordEntity p 
        WHERE p.teamLeadId = :teamLeadId 
        AND p.status IN ('SUBMITTED', 'REVISION_REQUESTED')
        ORDER BY p.createdAt DESC
    """)
    List<AuditPlanRecordEntity> findPendingPlansForTeamLeader(
        @Param("teamLeadId") String teamLeadId);
    
    /**
     * Find all reviewed plans (APPROVED, REJECTED) for a team leader.
     * Ordered by review timestamp.
     */
    List<AuditPlanRecordEntity> findByTeamLeadIdAndReviewedByOrderByReviewTimestampDesc(
        String teamLeadId, String reviewedBy);
    
    /**
     * Count pending plans for team leader (for dashboard metric).
     */
    @Query("""
        SELECT COUNT(p) FROM AuditPlanRecordEntity p 
        WHERE p.teamLeadId = :teamLeadId 
        AND p.status IN ('SUBMITTED', 'REVISION_REQUESTED')
    """)
    long countPendingPlansForTeamLeader(@Param("teamLeadId") String teamLeadId);
}
