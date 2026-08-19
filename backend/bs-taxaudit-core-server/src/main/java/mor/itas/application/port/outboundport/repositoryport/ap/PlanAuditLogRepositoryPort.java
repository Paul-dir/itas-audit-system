package mor.itas.application.port.outboundport.repositoryport.ap;

import mor.itas.domain.model.ap.PlanAuditLog;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * PlanAuditLogRepositoryPort - Outbound port for Plan Audit Log persistence
 * Defines contract for accessing audit logs (write-once, read-many)
 */
public interface PlanAuditLogRepositoryPort {

    /**
     * Save audit log entry (append-only)
     */
    PlanAuditLog save(PlanAuditLog auditLog);

    /**
     * Find audit log by ID
     */
    Optional<PlanAuditLog> findById(UUID auditLogId);

    /**
     * Find all audit logs for a plan, ordered by creation date descending
     */
    List<PlanAuditLog> findByPlanIdOrderByCreatedAtDesc(UUID planId);

    /**
     * Find audit logs for a plan by action type
     */
    List<PlanAuditLog> findByPlanIdAndActionOrderByCreatedAtDesc(UUID planId, String action);

    /**
     * Count audit logs for a plan
     */
    long countByPlanId(UUID planId);
}
