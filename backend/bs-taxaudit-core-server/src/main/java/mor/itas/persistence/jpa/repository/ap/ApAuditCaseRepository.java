package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Repository
public interface ApAuditCaseRepository extends JpaRepository<ApAuditCaseEntity, UUID> {

    // ── By plan ──────────────────────────────────────────────────────────────
    List<ApAuditCaseEntity> findByPlanId(UUID planId);

    List<ApAuditCaseEntity> findByPlanIdAndStatus(UUID planId, String status);

    @Query("SELECT ac FROM ApAuditCaseEntity ac WHERE ac.planId = :planId AND ac.auditType = :auditType")
    List<ApAuditCaseEntity> findByPlanIdAndAuditType(@Param("planId") UUID planId,
                                                     @Param("auditType") String auditType);

    // ── By tax center ─────────────────────────────────────────────────────────
    List<ApAuditCaseEntity> findByTaxCenterCode(String taxCenterCode);

    List<ApAuditCaseEntity> findByTaxCenterCodeAndStatus(String taxCenterCode, String status);

    List<ApAuditCaseEntity> findByTaxCenterCodeAndAuditType(String taxCenterCode, String auditType);

    int countByTaxCenterCode(String taxCenterCode);

    // ── By status ─────────────────────────────────────────────────────────────
    List<ApAuditCaseEntity> findByStatus(String status);

    int countByPlanIdAndStatus(UUID planId, String status);

    // ── By team leader / committee member ─────────────────────────────────────
    List<ApAuditCaseEntity> findByAssignedTeamLeaderId(String teamLeaderId);

    List<ApAuditCaseEntity> findByAssignedTeamLeaderIdAndStatus(String teamLeaderId, String status);

    List<ApAuditCaseEntity> findByAssignedTeamLeaderIdAndTaxCenterCode(String teamLeaderId,
                                                                        String taxCenterCode);

    // ── By auditor ────────────────────────────────────────────────────────────
    List<ApAuditCaseEntity> findByAssignedAuditorId(String auditorId);

    List<ApAuditCaseEntity> findByAssignedAuditorIdAndStatus(String auditorId, String status);

    // ── Existence checks ──────────────────────────────────────────────────────
    @Query("SELECT COUNT(ac) > 0 FROM ApAuditCaseEntity ac WHERE ac.planId = :planId AND ac.taxpayerId = :taxpayerId")
    boolean existsByPlanIdAndTaxpayerId(@Param("planId") UUID planId,
                                        @Param("taxpayerId") String taxpayerId);

    // ── Bulk delete (idempotent cascade) ──────────────────────────────────────
    @Modifying
    @Transactional
    @Query("DELETE FROM ApAuditCaseEntity ac WHERE ac.planId = :planId")
    int deleteByPlanId(@Param("planId") UUID planId);

    // ── Stat queries ──────────────────────────────────────────────────────────
    @Query("SELECT ac.auditType, COUNT(ac) FROM ApAuditCaseEntity ac WHERE ac.taxCenterCode = :taxCenterCode GROUP BY ac.auditType")
    List<Object[]> countByTaxCenterCodeGroupedByAuditType(@Param("taxCenterCode") String taxCenterCode);

    @Query("SELECT ac.status, COUNT(ac) FROM ApAuditCaseEntity ac WHERE ac.taxCenterCode = :taxCenterCode GROUP BY ac.status")
    List<Object[]> countByTaxCenterCodeGroupedByStatus(@Param("taxCenterCode") String taxCenterCode);
}
