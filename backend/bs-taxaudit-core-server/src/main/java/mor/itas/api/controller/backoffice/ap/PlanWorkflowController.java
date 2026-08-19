package mor.itas.api.controller.backoffice.ap;

import mor.itas.domain.aggregate.ap.AnnualAuditPlan;
import mor.itas.domain.model.ap.PlanTimeline;
import mor.itas.domain.model.ap.RegionalFeedback;
import mor.itas.application.service.ap.PlanStatusTransitionService;
import mor.itas.application.service.ap.RegionalFeedbackService;
import mor.itas.application.service.ap.CaseGenerationService;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

/**
 * Plan Workflow REST Controller
 * 
 * Handles all plan status transitions and feedback collection workflows
 * Extracted from frontend AppContext business logic
 */
@RestController
@RequestMapping("/api/v1/backoffice/ap/plans")
@RequiredArgsConstructor
public class PlanWorkflowController {

    private final PlanStatusTransitionService transitionService;
    private final RegionalFeedbackService feedbackService;
    private final CaseGenerationService caseGenerationService;

    // ==================== PLAN STATUS TRANSITIONS ====================

    /**
     * 1.2 Submit plan from Planning Team to Director for review
     * Status: DRAFT → SUBMITTED_TO_DIRECTOR
     */
    @PostMapping("/{planId}/submit")
    public ResponseEntity<AnnualAuditPlan> submitToDirector(
            @PathVariable UUID planId,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = transitionService.submitToDirector(planId, actorId);
        return ResponseEntity.ok(plan);
    }

    /**
     * 1.3 Director approves the plan
     * Status: SUBMITTED_TO_DIRECTOR → DIRECTOR_APPROVED
     */
    @PostMapping("/{planId}/approve")
    public ResponseEntity<AnnualAuditPlan> approvePlan(
            @PathVariable UUID planId,
            @RequestBody CommentRequest request,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = transitionService.approvePlan(planId, actorId, request.getComment());
        return ResponseEntity.ok(plan);
    }

    /**
     * 1.4 Director requests revision of the plan
     * Status: SUBMITTED_TO_DIRECTOR → REVISION_REQUESTED
     */
    @PostMapping("/{planId}/request-revision")
    public ResponseEntity<AnnualAuditPlan> requestRevision(
            @PathVariable UUID planId,
            @RequestBody CommentRequest request,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = transitionService.requestRevision(planId, actorId, request.getComment());
        return ResponseEntity.ok(plan);
    }

    /**
     * 1.5 Send plan to all regions for feedback collection
     * Status: DIRECTOR_APPROVED → AWAITING_REGIONAL_FEEDBACK
     */
    @PostMapping("/{planId}/send-to-regions")
    public ResponseEntity<AnnualAuditPlan> sendToRegions(
            @PathVariable UUID planId,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = transitionService.sendToRegions(planId, actorId);
        return ResponseEntity.ok(plan);
    }

    // ==================== REGIONAL FEEDBACK WORKFLOW ====================

    /**
     * 2.1 Submit regional feedback for a plan
     * Aggregates feedback and updates plan status if all regions have submitted
     */
    @PostMapping("/{planId}/regions/{regionId}/feedback")
    public ResponseEntity<AnnualAuditPlan> submitRegionalFeedback(
            @PathVariable UUID planId,
            @PathVariable String regionId,
            @RequestBody RegionalFeedbackRequest request,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = feedbackService.submitRegionalFeedback(
            planId, regionId, request.getFeedbackText(), actorId);
        return ResponseEntity.ok(plan);
    }

    /**
     * 2.2 Director overrides regional feedback
     * Allows director to modify allocations from a specific region
     */
    @PostMapping("/{planId}/regions/{regionId}/override")
    public ResponseEntity<Void> overrideRegionalFeedback(
            @PathVariable UUID planId,
            @PathVariable String regionId,
            @RequestBody OverrideFeedbackRequest request,
            @RequestHeader("X-Actor-Id") String actorId) {
        feedbackService.overrideRegionalFeedback(planId, regionId, request.getOverrideComment(), actorId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all feedback for a plan
     */
    @GetMapping("/{planId}/feedback")
    public ResponseEntity<List<RegionalFeedback>> getFeedbackByPlan(@PathVariable UUID planId) {
        List<RegionalFeedback> feedback = feedbackService.getFeedbackByPlanId(planId);
        return ResponseEntity.ok(feedback);
    }

    // ==================== AMENDMENT CYCLE ====================

    /**
     * 3.1 Send amendment back to planning team after feedback collection
     * Status: FEEDBACK_COLLECTED → AMENDMENT_REQUIRED
     */
    @PostMapping("/{planId}/amendment")
    public ResponseEntity<AnnualAuditPlan> sendAmendmentToPlanningTeam(
            @PathVariable UUID planId,
            @RequestBody CommentRequest request,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = transitionService.sendAmendmentToPlanningTeam(planId, actorId, request.getComment());
        return ResponseEntity.ok(plan);
    }

    // ==================== SENIOR MANAGEMENT APPROVAL ====================

    /**
     * 3.2 Submit amended plan to senior management for approval
     * Status: AMENDMENT_REQUIRED → SUBMITTED_TO_SENIOR_MGMT
     */
    @PostMapping("/{planId}/submit-to-senior")
    public ResponseEntity<AnnualAuditPlan> submitToSeniorMgmt(
            @PathVariable UUID planId,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = transitionService.submitToSeniorMgmt(planId, actorId);
        return ResponseEntity.ok(plan);
    }

    /**
     * 4.1 Senior management approves the plan
     * Status: SUBMITTED_TO_SENIOR_MGMT → SENIOR_MGMT_APPROVED
     */
    @PostMapping("/{planId}/senior-approve")
    public ResponseEntity<AnnualAuditPlan> approveBySenior(
            @PathVariable UUID planId,
            @RequestBody CommentRequest request,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = transitionService.approveBySenior(planId, actorId, request.getComment());
        return ResponseEntity.ok(plan);
    }

    /**
     * 4.2 Senior management rejects the plan
     * Status: SUBMITTED_TO_SENIOR_MGMT → SENIOR_MGMT_REJECTED
     */
    @PostMapping("/{planId}/senior-reject")
    public ResponseEntity<AnnualAuditPlan> rejectBySenior(
            @PathVariable UUID planId,
            @RequestBody CommentRequest request,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = transitionService.rejectBySenior(planId, actorId, request.getComment());
        return ResponseEntity.ok(plan);
    }

    // ==================== REGIONAL DEPLOYMENT & FINALIZATION ====================

    /**
     * 5.1 Send approved plan to regions for deployment
     * Status: SENIOR_MGMT_APPROVED → APPROVED_TO_REGIONS
     */
    @PostMapping("/{planId}/send-approved-to-regions")
    public ResponseEntity<AnnualAuditPlan> sendApprovedToRegions(
            @PathVariable UUID planId,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = transitionService.sendApprovedToRegions(planId, actorId);
        return ResponseEntity.ok(plan);
    }

    /**
     * 5.2 Regional director deploys plan to their tax centers
     * Status: APPROVED_TO_REGIONS → FINALIZED (when all regions deployed)
     */
    @PostMapping("/{planId}/regions/{regionId}/deploy")
    public ResponseEntity<AnnualAuditPlan> deployToTaxCenters(
            @PathVariable UUID planId,
            @PathVariable String regionId,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = feedbackService.deployToTaxCenters(planId, regionId, actorId);
        return ResponseEntity.ok(plan);
    }

    /**
     * 5.3 Finalize plan directly (legacy path)
     * Status: Any → FINALIZED
     */
    @PostMapping("/{planId}/finalize")
    public ResponseEntity<AnnualAuditPlan> finalizePlan(
            @PathVariable UUID planId,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = transitionService.finalizePlan(planId, actorId);
        return ResponseEntity.ok(plan);
    }

    // ==================== CASE GENERATION ====================

    /**
     * 6.1 Generate audit cases from finalized plan
     * Creates one case per approved quota in the plan's allocations
     */
    @PostMapping("/{planId}/generate-cases")
    public ResponseEntity<CaseGenerationResponse> generateCases(
            @PathVariable UUID planId,
            @RequestHeader("X-Actor-Id") String actorId) {
        var cases = caseGenerationService.generateCasesForPlan(planId, actorId);
        return ResponseEntity.ok(new CaseGenerationResponse(cases.size(), cases));
    }

    /**
     * Get all cases for a plan
     */
    @GetMapping("/{planId}/cases")
    public ResponseEntity<GetCasesResponse> getCasesForPlan(@PathVariable UUID planId) {
        var cases = caseGenerationService.getCasesForPlan(planId);
        return ResponseEntity.ok(new GetCasesResponse(cases.size(), cases));
    }

    // ==================== REQUEST/RESPONSE DTOs ====================

    @Data
    static class CommentRequest {
        private String comment;
    }

    @Data
    static class RegionalFeedbackRequest {
        private String feedbackText;
    }

    @Data
    static class OverrideFeedbackRequest {
        private String overrideComment;
    }

    @Data
    static class CaseGenerationResponse {
        private int count;
        private Object cases;

        public CaseGenerationResponse(int count, Object cases) {
            this.count = count;
            this.cases = cases;
        }
    }

    @Data
    static class GetCasesResponse {
        private int count;
        private Object cases;

        public GetCasesResponse(int count, Object cases) {
            this.count = count;
            this.cases = cases;
        }
    }
}
