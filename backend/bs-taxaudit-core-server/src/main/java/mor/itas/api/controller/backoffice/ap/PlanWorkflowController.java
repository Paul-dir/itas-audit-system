package mor.itas.api.controller.backoffice.ap;

import mor.itas.domain.aggregate.ap.AnnualAuditPlan;
import mor.itas.application.port.inboundport.ap.PlanWorkflowPort;
import mor.itas.application.port.inboundport.ap.CaseManagementPort;
import mor.itas.api.dto.mapper.ApResponseDtoMapper;
import mor.itas.api.dto.response.ap.PlanResponse;
import mor.itas.api.dto.response.ap.GenericResponse;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

/**
 * Plan Workflow REST Controller
 * 
 * REST Adapter for Plan Workflow use cases.
 * Depends on inbound ports, converts domain objects to response DTOs.
 * This is the driving adapter - converts HTTP to domain operations and back to DTOs.
 * 
 * Hexagonal/DDD: REST Controller → Inbound Port → Use Case → Domain Services
 */
@RestController
@RequestMapping("/api/v1/backoffice/ap/plans")
@RequiredArgsConstructor
public class PlanWorkflowController {

    private final PlanWorkflowPort planWorkflowPort;
    private final CaseManagementPort caseManagementPort;
    private final ApResponseDtoMapper dtoMapper;

    // ==================== PLAN STATUS TRANSITIONS ====================

    /**
     * 1.2 Submit plan from Planning Team to Director for review
     * Status: DRAFT → SUBMITTED_TO_DIRECTOR
     */
    @PostMapping("/{planId}/submit")
    public ResponseEntity<GenericResponse<PlanResponse>> submitToDirector(
            @PathVariable UUID planId,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = planWorkflowPort.submitToDirector(planId, actorId);
        PlanResponse response = dtoMapper.toPlanResponse(plan);
        return ResponseEntity.ok(GenericResponse.success(response));
    }

    /**
     * 1.3 Director approves the plan
     * Status: SUBMITTED_TO_DIRECTOR → DIRECTOR_APPROVED
     */
    @PostMapping("/{planId}/approve")
    public ResponseEntity<GenericResponse<PlanResponse>> approvePlan(
            @PathVariable UUID planId,
            @RequestBody CommentRequest request,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = planWorkflowPort.approvePlan(planId, actorId, request.getComment());
        PlanResponse response = dtoMapper.toPlanResponse(plan);
        return ResponseEntity.ok(GenericResponse.success(response));
    }

    /**
     * 1.4 Director requests revision of the plan
     * Status: SUBMITTED_TO_DIRECTOR → REVISION_REQUESTED
     */
    @PostMapping("/{planId}/request-revision")
    public ResponseEntity<GenericResponse<PlanResponse>> requestRevision(
            @PathVariable UUID planId,
            @RequestBody CommentRequest request,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = planWorkflowPort.requestRevision(planId, actorId, request.getComment());
        PlanResponse response = dtoMapper.toPlanResponse(plan);
        return ResponseEntity.ok(GenericResponse.success(response));
    }

    /**
     * 1.5 Send plan to all regions for feedback collection
     * Status: DIRECTOR_APPROVED → AWAITING_REGIONAL_FEEDBACK
     */
    @PostMapping("/{planId}/send-to-regions")
    public ResponseEntity<GenericResponse<PlanResponse>> sendToRegions(
            @PathVariable UUID planId,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = planWorkflowPort.sendToRegions(planId, actorId);
        PlanResponse response = dtoMapper.toPlanResponse(plan);
        return ResponseEntity.ok(GenericResponse.success(response));
    }

    // ==================== REGIONAL FEEDBACK WORKFLOW ====================

    /**
     * 2.1 Submit regional feedback for a plan
     * Aggregates feedback and updates plan status if all regions have submitted
     */
    @PostMapping("/{planId}/regions/{regionId}/feedback")
    public ResponseEntity<GenericResponse<PlanResponse>> submitRegionalFeedback(
            @PathVariable UUID planId,
            @PathVariable String regionId,
            @RequestBody RegionalFeedbackRequest request,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = planWorkflowPort.submitRegionalFeedback(
            planId, regionId, request.getFeedbackText(), actorId);
        PlanResponse response = dtoMapper.toPlanResponse(plan);
        return ResponseEntity.ok(GenericResponse.success(response));
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
        planWorkflowPort.overrideRegionalFeedback(planId, regionId, request.getOverrideComment(), actorId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all feedback for a plan
     */
    @GetMapping("/{planId}/feedback")
    public ResponseEntity<GenericResponse<Object>> getFeedbackByPlan(@PathVariable UUID planId) {
        // TODO: Implement feedback retrieval in use case
        return ResponseEntity.ok(GenericResponse.success(List.of()));
    }

    // ==================== AMENDMENT CYCLE ====================

    /**
     * 3.1 Send amendment back to planning team after feedback collection
     * Status: FEEDBACK_COLLECTED → AMENDMENT_REQUIRED
     */
    @PostMapping("/{planId}/amendment")
    public ResponseEntity<GenericResponse<PlanResponse>> sendAmendmentToPlanningTeam(
            @PathVariable UUID planId,
            @RequestBody CommentRequest request,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = planWorkflowPort.sendAmendmentToPlanningTeam(planId, actorId, request.getComment());
        PlanResponse response = dtoMapper.toPlanResponse(plan);
        return ResponseEntity.ok(GenericResponse.success(response));
    }

    // ==================== SENIOR MANAGEMENT APPROVAL ====================

    /**
     * 3.2 Submit amended plan to senior management for approval
     * Status: AMENDMENT_REQUIRED → SUBMITTED_TO_SENIOR_MGMT
     */
    @PostMapping("/{planId}/submit-to-senior")
    public ResponseEntity<GenericResponse<PlanResponse>> submitToSeniorMgmt(
            @PathVariable UUID planId,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = planWorkflowPort.submitToSeniorMgmt(planId, actorId);
        PlanResponse response = dtoMapper.toPlanResponse(plan);
        return ResponseEntity.ok(GenericResponse.success(response));
    }

    /**
     * 4.1 Senior management approves the plan
     * Status: SUBMITTED_TO_SENIOR_MGMT → SENIOR_MGMT_APPROVED
     */
    @PostMapping("/{planId}/senior-approve")
    public ResponseEntity<GenericResponse<PlanResponse>> approveBySenior(
            @PathVariable UUID planId,
            @RequestBody CommentRequest request,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = planWorkflowPort.approveBySenior(planId, actorId, request.getComment());
        PlanResponse response = dtoMapper.toPlanResponse(plan);
        return ResponseEntity.ok(GenericResponse.success(response));
    }

    /**
     * 4.2 Senior management rejects the plan
     * Status: SUBMITTED_TO_SENIOR_MGMT → SENIOR_MGMT_REJECTED
     */
    @PostMapping("/{planId}/senior-reject")
    public ResponseEntity<GenericResponse<PlanResponse>> rejectBySenior(
            @PathVariable UUID planId,
            @RequestBody CommentRequest request,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = planWorkflowPort.rejectBySenior(planId, actorId, request.getComment());
        PlanResponse response = dtoMapper.toPlanResponse(plan);
        return ResponseEntity.ok(GenericResponse.success(response));
    }

    /**
     * 5.1 Send approved plan to regions for deployment
     * Status: SENIOR_MGMT_APPROVED → APPROVED_TO_REGIONS
     */
    @PostMapping("/{planId}/send-approved-to-regions")
    public ResponseEntity<GenericResponse<PlanResponse>> sendApprovedToRegions(
            @PathVariable UUID planId,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = planWorkflowPort.sendApprovedToRegions(planId, actorId);
        PlanResponse response = dtoMapper.toPlanResponse(plan);
        return ResponseEntity.ok(GenericResponse.success(response));
    }

    /**
     * 5.2 Regional director deploys plan to their tax centers
     * Status: APPROVED_TO_REGIONS → FINALIZED (when all regions deployed)
     */
    @PostMapping("/{planId}/regions/{regionId}/deploy")
    public ResponseEntity<GenericResponse<PlanResponse>> deployToTaxCenters(
            @PathVariable UUID planId,
            @PathVariable String regionId,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = planWorkflowPort.deployToTaxCenters(planId, regionId, actorId);
        PlanResponse response = dtoMapper.toPlanResponse(plan);
        return ResponseEntity.ok(GenericResponse.success(response));
    }

    /**
     * 5.3 Finalize plan directly (legacy path)
     * Status: Any → FINALIZED
     */
    @PostMapping("/{planId}/finalize")
    public ResponseEntity<GenericResponse<PlanResponse>> finalizePlan(
            @PathVariable UUID planId,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = planWorkflowPort.finalizePlan(planId, actorId);
        PlanResponse response = dtoMapper.toPlanResponse(plan);
        return ResponseEntity.ok(GenericResponse.success(response));
    }

    // ==================== CASE GENERATION ====================

    /**
     * 6.1 Generate audit cases from finalized plan
     * Creates one case per approved quota in the plan's allocations
     */
    @PostMapping("/{planId}/generate-cases")
    public ResponseEntity<GenericResponse<Object>> generateCases(
            @PathVariable UUID planId,
            @RequestHeader("X-Actor-Id") String actorId) {
        var cases = caseManagementPort.generateCasesForPlan(planId, actorId);
        var casesResponse = cases.stream()
            .map(dtoMapper::toAuditCaseResponse)
            .toList();
        return ResponseEntity.ok(GenericResponse.success(casesResponse, casesResponse.size(), (long) casesResponse.size()));
    }

    /**
     * Get all cases for a plan
     */
    @GetMapping("/{planId}/cases")
    public ResponseEntity<GenericResponse<Object>> getCasesForPlan(@PathVariable UUID planId) {
        var cases = caseManagementPort.getCasesForPlan(planId);
        var casesResponse = cases.stream()
            .map(dtoMapper::toAuditCaseResponse)
            .toList();
        return ResponseEntity.ok(GenericResponse.success(casesResponse, casesResponse.size(), (long) casesResponse.size()));
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
}
