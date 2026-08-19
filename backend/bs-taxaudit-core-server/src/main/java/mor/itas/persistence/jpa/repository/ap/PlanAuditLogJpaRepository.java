package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.PlanAuditLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * PlanAuditLogJpaRepository - Spring Data JPA Repository for audit logs
 * Provides immutable audit trail for Annual Audit Plans
 */
@Repository
public interface PlanAuditLogJpaRepository extends JpaRepository<PlanAuditLogEntity, UUID> {
    
    /**
     * Find all audit logs for a plan, ordered by creation date descending
     */
    List<PlanAuditLogEntity> findByAnnualPlanIdOrderByCreatedAtDesc(UUID planId);
    
    /**
     * Find all audit logs for a plan by action type
     */
    List<PlanAuditLogEntity> findByAnnualPlanIdAndActionOrderByCreatedAtDesc(UUID planId, String action);
    
    /**
     * Count audit logs for a plan
     */
    long countByAnnualPlanId(UUID planId);
}
