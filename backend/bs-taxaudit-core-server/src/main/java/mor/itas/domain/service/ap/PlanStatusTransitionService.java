package mor.itas.domain.service.ap;

import mor.itas.domain.model.ap.AnnualAuditPlan;
import mor.itas.domain.model.ap.PlanTimeline;
import mor.itas.domain.model.ap.PlanRevision;
import mor.itas.application.port.outboundport.repositoryport.ap.AnnualAuditPlanRepository;
import mor.itas.persistence.jpa.entity.ap.ApPlanTimelineEntity;
import mor.itas.persistence.jpa.entity.ap.ApPlanRevisionEntity;
import mor.itas.persistence.jpa.repository.ap.ApPlanTimelineRepository;
import mor.itas.persistence.jpa.repository.ap.ApPlanRevisionRepository;
import mor.itas.persistence.mapper.ap.PlanTimelineMapper;
import mor.itas.persistence.mapper.ap.PlanRevisionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * PlanStatusTransitionService - Handles all plan status transitions
 * Extracted from frontend AppContext business logic
 */
@Service
@RequiredArgsConstructor
@Transactional
public class PlanStatusTransitionService {

    private final AnnualAuditPlanRepository planRepository;
    private final ApPlanTimelineRepository timelineRepository;
    private final ApPlanRevisionRepository revisionRepository;
    private final PlanTimelineMapper timelineMapper;
    private final PlanRevisionMapper revisionMapper;

    // ==================== SPRINT 03: Director Actions ====================

    /**
     * Submit plan from Planning Team to Director for review
     * Status: DRAFT → SUBMITTED_TO_DIRECTOR
     */
    public AnnualAuditPlan submitToDirector(UUID planId, String actorId) {
        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));

        if (!plan.getStatus().equals("DRAFT")) {
            throw new IllegalStateException("Can only submit DRAFT plans. Current status: " + plan.getStatus());
        }

        // Update status
        plan.setStatus("SUBMITTED_TO_DIRECTOR");
        plan = planRepository.save(plan);

        // Add timeline entry
        addTimelineEntry(planId, "SUBMITTED_TO_DIRECTOR", actorId, "Submitted for director review");

        return plan;
    }

    /**
     * Director approves the plan
     * Status: SUBMITTED_TO_DIRECTOR → DIRECTOR_APPROVED
     */
    public AnnualAuditPlan approvePlan(UUID planId, String actorId, String comment) {
        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));

        if (!plan.getStatus().equals("SUBMITTED_TO_DIRECTOR") && !plan.getStatus().equals("REVISION_REQUESTED")) {
            throw new IllegalStateException("Cannot approve plan in status: " + plan.getStatus());
        }

        plan.setStatus("DIRECTOR_APPROVED");
        plan.setDirectorComment(comment);
        plan = planRepository.save(plan);

        addTimelineEntry(planId, "DIRECTOR_APPROVED", actorId, comment != null ? comment : "Approved");

        return plan;
    }

    /**
     * Director requests revision of the plan
     * Status: SUBMITTED_TO_DIRECTOR → REVISION_REQUESTED
     */
    public AnnualAuditPlan requestRevision(UUID planId, String actorId, String comment) {
        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));

        if (!plan.getStatus().equals("SUBMITTED_TO_DIRECTOR")) {
            throw new IllegalStateException("Can only request revision from SUBMITTED_TO_DIRECTOR status");
        }

        plan.setStatus("REVISION_REQUESTED");
        plan.setDirectorComment(comment);
        plan = planRepository.save(plan);

        addTimelineEntry(planId, "REVISION_REQUESTED", actorId, comment);
        addRevisionEntry(planId, comment, "revision", actorId);

        return plan;
    }

    // ==================== SPRINT 04: Regional Feedback ====================

    /**
     * Send plan to all regions for feedback collection
     * Status: DIRECTOR_APPROVED → AWAITING_REGIONAL_FEEDBACK
     */
    public AnnualAuditPlan sendToRegions(UUID planId, String actorId) {
        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));

        if (!plan.getStatus().equals("DIRECTOR_APPROVED")) {
            throw new IllegalStateException("Can only send DIRECTOR_APPROVED plans to regions. Current status: " + plan.getStatus());
        }

        plan.setStatus("AWAITING_REGIONAL_FEEDBACK");
        plan = planRepository.save(plan);

        addTimelineEntry(planId, "AWAITING_REGIONAL_FEEDBACK", actorId, "Sent to all regions for feedback");

        return plan;
    }

    /**
     * Send amendment back to planning team after feedback collection
     * Status: FEEDBACK_COLLECTED → AMENDMENT_REQUIRED
     */
    public AnnualAuditPlan sendAmendmentToPlanningTeam(UUID planId, String actorId, String comment) {
        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));

        if (!plan.getStatus().equals("FEEDBACK_COLLECTED")) {
            throw new IllegalStateException("Can only send amendments from FEEDBACK_COLLECTED status");
        }

        plan.setStatus("AMENDMENT_REQUIRED");
        plan.setAmendmentComment(comment);
        plan = planRepository.save(plan);

        addTimelineEntry(planId, "AMENDMENT_REQUIRED", actorId, comment);
        addRevisionEntry(planId, comment, "amendment", actorId);

        return plan;
    }

    // ==================== SPRINT 05: Senior Management ====================

    /**
     * Submit amended plan to senior management for approval
     * Status: AMENDMENT_REQUIRED → SUBMITTED_TO_SENIOR_MGMT
     */
    public AnnualAuditPlan submitToSeniorMgmt(UUID planId, String actorId) {
        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));

        if (!plan.getStatus().equals("AMENDMENT_REQUIRED") && !plan.getStatus().equals("DIRECTOR_APPROVED")) {
            throw new IllegalStateException("Can only submit plans in AMENDMENT_REQUIRED or DIRECTOR_APPROVED status. Current: " + plan.getStatus());
        }

        plan.setStatus("SUBMITTED_TO_SENIOR_MGMT");
        plan = planRepository.save(plan);

        addTimelineEntry(planId, "SUBMITTED_TO_SENIOR_MGMT", actorId, "Submitted for senior management approval");

        return plan;
    }

    /**
     * Senior management approves the plan
     * Status: SUBMITTED_TO_SENIOR_MGMT → SENIOR_MGMT_APPROVED
     */
    public AnnualAuditPlan approveBySenior(UUID planId, String actorId, String comment) {
        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));

        if (!plan.getStatus().equals("SUBMITTED_TO_SENIOR_MGMT")) {
            throw new IllegalStateException("Only plans in SUBMITTED_TO_SENIOR_MGMT status can be approved. Current: " + plan.getStatus());
        }

        plan.setStatus("SENIOR_MGMT_APPROVED");
        plan.setSeniorComment(comment);
        plan = planRepository.save(plan);

        addTimelineEntry(planId, "SENIOR_MGMT_APPROVED", actorId, comment != null ? comment : "Approved");

        return plan;
    }

    /**
     * Senior management rejects the plan
     * Status: SUBMITTED_TO_SENIOR_MGMT → SENIOR_MGMT_REJECTED
     */
    public AnnualAuditPlan rejectBySenior(UUID planId, String actorId, String comment) {
        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));

        if (!plan.getStatus().equals("SUBMITTED_TO_SENIOR_MGMT")) {
            throw new IllegalStateException("Only plans in SUBMITTED_TO_SENIOR_MGMT status can be rejected");
        }

        plan.setStatus("SENIOR_MGMT_REJECTED");
        plan.setSeniorComment(comment);
        plan = planRepository.save(plan);

        addTimelineEntry(planId, "SENIOR_MGMT_REJECTED", actorId, comment);
        addRevisionEntry(planId, comment, "senior_rejection", actorId);

        return plan;
    }

    /**
     * Send approved plan to regions for deployment
     * Status: SENIOR_MGMT_APPROVED → APPROVED_TO_REGIONS
     */
    public AnnualAuditPlan sendApprovedToRegions(UUID planId, String actorId) {
        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));

        if (!plan.getStatus().equals("SENIOR_MGMT_APPROVED")) {
            throw new IllegalStateException("Only SENIOR_MGMT_APPROVED plans can be sent to regions. Current: " + plan.getStatus());
        }

        plan.setStatus("APPROVED_TO_REGIONS");
        plan = planRepository.save(plan);

        addTimelineEntry(planId, "APPROVED_TO_REGIONS", actorId, "Approved plan sent to all regions - awaiting regional deployment");

        return plan;
    }

    /**
     * Finalize plan directly (legacy path)
     * Status: Any → FINALIZED
     */
    public AnnualAuditPlan finalizePlan(UUID planId, String actorId) {
        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));

        plan.setStatus("FINALIZED");
        plan = planRepository.save(plan);

        addTimelineEntry(planId, "FINALIZED", actorId, "Plan finalized");

        return plan;
    }

    // ==================== Helper Methods ====================

    /**
     * Add timeline entry for audit trail
     */
    private void addTimelineEntry(UUID planId, String status, String actorId, String comment) {
        ApPlanTimelineEntity entry = new ApPlanTimelineEntity(
            planId,
            status,
            actorId,
            comment,
            OffsetDateTime.now()
        );
        timelineRepository.save(entry);
    }

    /**
     * Add revision entry for tracking amendments/rejections
     */
    private void addRevisionEntry(UUID planId, String comment, String type, String actorId) {
        ApPlanRevisionEntity revision = new ApPlanRevisionEntity(
            planId,
            comment,
            type,
            actorId
        );
        revisionRepository.save(revision);
    }
}
