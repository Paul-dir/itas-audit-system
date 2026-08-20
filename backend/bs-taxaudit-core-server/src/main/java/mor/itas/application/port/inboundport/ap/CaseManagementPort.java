package mor.itas.application.port.inboundport.ap;

import mor.itas.domain.model.ap.AuditCase;
import java.util.List;
import java.util.UUID;

/**
 * Case Management Inbound Port (Driving Port)
 * 
 * Defines the contract for all case management operations.
 * REST Controllers depend on this interface, not on use cases directly.
 * This is the boundary between external world (API) and application.
 * 
 * Hexagonal/DDD: Inbound port = Use case interface exposed to the outside world
 */
public interface CaseManagementPort {

    // ==================== CASE GENERATION ====================

    /**
     * Generate audit cases from finalized plan
     */
    List<AuditCase> generateCasesForPlan(UUID planId, String actorId);

    // ==================== CASE QUERIES ====================

    /**
     * Get case by ID
     */
    AuditCase getCaseById(UUID caseId);

    /**
     * Get all cases for a specific plan
     */
    List<AuditCase> getCasesForPlan(UUID planId);

    /**
     * Get cases filtered by status
     */
    List<AuditCase> getCasesByStatus(String status);

    /**
     * Get cases assigned to a specific auditor
     */
    List<AuditCase> getCasesForAuditor(String auditorId);

    /**
     * Get cases assigned to a specific team leader
     */
    List<AuditCase> getCasesForTeamLeader(String teamLeaderId);

    // ==================== CASE ASSIGNMENT ====================

    /**
     * Assign case to team leader
     */
    AuditCase assignCaseToTeamLeader(UUID caseId, String teamLeaderId);

    /**
     * Assign case to auditor
     */
    AuditCase assignCaseToAuditor(UUID caseId, String auditorId);

    // ==================== CASE STATUS ====================

    /**
     * Update case status
     */
    AuditCase updateCaseStatus(UUID caseId, String newStatus);
}
