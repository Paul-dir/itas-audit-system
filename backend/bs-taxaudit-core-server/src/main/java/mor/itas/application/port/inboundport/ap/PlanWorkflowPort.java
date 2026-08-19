package mor.itas.application.port.inboundport.ap;

import mor.itas.domain.aggregate.ap.AnnualAuditPlan;
import java.util.UUID;

/**
 * Plan Workflow Inbound Port (Driving Port)
 * 
 * Defines the contract for all plan workflow operations.
 * REST Controllers depend on this interface, not on use cases directly.
 * This is the boundary between external world (API) and application.
 * 
 * Hexagonal/DDD: Inbound port = Use case interface exposed to the outside world
 */
public interface PlanWorkflowPort {

    // ==================== PLAN STATUS TRANSITIONS ====================

    /**
     * Submit plan from Planning Team to Director for review
     */
    AnnualAuditPlan submitToDirector(UUID planId, String actorId);

    /**
     * Director approves the plan
     */
    AnnualAuditPlan approvePlan(UUID planId, String actorId, String comment);

    /**
     * Director requests revision of the plan
     */
    AnnualAuditPlan requestRevision(UUID planId, String actorId, String comment);

    /**
     * Send plan to all regions for feedback collection
     */
    AnnualAuditPlan sendToRegions(UUID planId, String actorId);

    /**
     * Send amendment back to planning team after feedback collection
     */
    AnnualAuditPlan sendAmendmentToPlanningTeam(UUID planId, String actorId, String comment);

    /**
     * Submit amended plan to senior management for approval
     */
    AnnualAuditPlan submitToSeniorMgmt(UUID planId, String actorId);

    /**
     * Senior management approves the plan
     */
    AnnualAuditPlan approveBySenior(UUID planId, String actorId, String comment);

    /**
     * Senior management rejects the plan
     */
    AnnualAuditPlan rejectBySenior(UUID planId, String actorId, String comment);

    /**
     * Send approved plan to regions for deployment
     */
    AnnualAuditPlan sendApprovedToRegions(UUID planId, String actorId);

    /**
     * Finalize plan directly (legacy path)
     */
    AnnualAuditPlan finalizePlan(UUID planId, String actorId);

    // ==================== REGIONAL FEEDBACK ====================

    /**
     * Submit regional feedback for a plan
     */
    AnnualAuditPlan submitRegionalFeedback(UUID planId, String regionId, String feedbackText, String actorId);

    /**
     * Director overrides regional feedback
     */
    void overrideRegionalFeedback(UUID planId, String regionId, String overrideComment, String actorId);

    /**
     * Regional director deploys plan to their tax centers
     */
    AnnualAuditPlan deployToTaxCenters(UUID planId, String regionId, String actorId);
}
