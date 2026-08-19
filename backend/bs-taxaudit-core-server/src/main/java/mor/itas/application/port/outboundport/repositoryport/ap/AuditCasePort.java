package mor.itas.application.port.outboundport.repositoryport.ap;

import mor.itas.domain.model.ap.AuditCase;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Audit Case Repository Port (Driven Port)
 * 
 * Defines contract for persisting audit cases.
 * Domain services depend on this interface.
 * 
 * Hexagonal/DDD: Outbound port = Interface to external systems (database, services)
 */
public interface AuditCasePort {

    /**
     * Save an audit case
     */
    AuditCase save(AuditCase auditCase);

    /**
     * Get case by ID
     */
    Optional<AuditCase> findById(UUID caseId);

    /**
     * Get all cases for a plan
     */
    List<AuditCase> findByPlanId(UUID planId);

    /**
     * Get cases by status
     */
    List<AuditCase> findByStatus(String status);

    /**
     * Get cases assigned to an auditor
     */
    List<AuditCase> findByAssignedAuditorId(String auditorId);

    /**
     * Get cases assigned to a team leader
     */
    List<AuditCase> findByAssignedTeamLeaderId(String teamLeaderId);
}
