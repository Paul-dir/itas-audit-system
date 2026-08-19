package mor.itas.api.controller.backoffice.ap;

import jakarta.validation.Valid;
import mor.itas.api.dto.request.ap.ApprovalRequest;
import mor.itas.api.dto.request.ap.CreatePlanRequest;
import mor.itas.api.dto.request.ap.DivideAllocationRequest;
import mor.itas.api.dto.request.ap.SubmitTaxCenterFeedbackRequest;
import mor.itas.api.dto.response.ap.AllocationResponse;
import mor.itas.api.dto.response.ap.AuditLogResponse;
import mor.itas.api.dto.response.ap.PlanResponse;
import mor.itas.api.mapper.ap.PlanResponseMapper;
import mor.itas.application.usecase.ap.PlanManagementUseCase;
import mor.itas.domain.model.ap.AnnualAuditPlan;
import mor.itas.domain.model.ap.PlanAllocation;
import mor.itas.domain.model.ap.PlanAuditLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * PlanWorkflowController - REST API for Annual Audit Plan workflow
 * Implements 4-level approval workflow with regional allocations
 * 
 * Endpoints:
 * 1. Planning Team: Create plan, submit to Director
 * 2. Director: Approve, route forward, send to Tax Centers
 * 3. Regional Director: Approve, divide regional into tax centers
 * 4. Tax Center Manager: Submit feedback
 */
@RestController
@RequestMapping("/api/v1/backoffice/ap/plans")
public class PlanWorkflowController {

    @Autowired
    private PlanManagementUseCase planManagementUseCase;

    @Autowired
    private PlanResponseMapper responseMapper;

    // ============= LEVEL 1: Planning Team =============

    /**
     * Create plan with regional allocations
     * POST /api/v1/backoffice/ap/plans
     */
    @PostMapping
    public ResponseEntity<PlanResponse> createPlan(
        @Valid @RequestBody CreatePlanRequest request,
        @RequestHeader(value = "X-Actor-Id", required = true) String actorId) {

        // Convert request DTOs to use case DTOs
        List<PlanManagementUseCase.RegionalAllocationDto> regionalAllocations = request.getRegionalAllocations()
            .stream()
            .map(r -> new PlanManagementUseCase.RegionalAllocationDto(r.getRegionCode(), r.getProposedCount()))
            .toList();

        AnnualAuditPlan plan = planManagementUseCase.createPlanWithRegionalAllocations(
            request.getPlanYear(),
            request.getPlanName(),
            regionalAllocations,
            actorId
        );

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(responseMapper.toPlanResponse(plan));
    }

    /**
     * Submit plan to Director
     * POST /api/v1/backoffice/ap/plans/{planId}/submit-to-director
     */
    @PostMapping("/{planId}/submit-to-director")
    public ResponseEntity<PlanResponse> submitToDirector(
        @PathVariable UUID planId,
        @RequestHeader(value = "X-Actor-Id", required = true) String actorId) {

        AnnualAuditPlan plan = planManagementUseCase.submitToDirector(planId, actorId);
        return ResponseEntity.ok(responseMapper.toPlanResponse(plan));
    }

    // ============= LEVEL 2: Director =============

    /**
     * Approve plan by Director
     * POST /api/v1/backoffice/ap/plans/{planId}/approve-by-director
     */
    @PostMapping("/{planId}/approve-by-director")
    public ResponseEntity<PlanResponse> approveByDirector(
        @PathVariable UUID planId,
        @Valid @RequestBody ApprovalRequest request,
        @RequestHeader(value = "X-Actor-Id", required = true) String actorId) {

        AnnualAuditPlan plan = planManagementUseCase.approveByDirector(
            planId,
            actorId,
            request.getReason()
        );

        return ResponseEntity.ok(responseMapper.toPlanResponse(plan));
    }

    /**
     * Submit plan to Regional Directors
     * POST /api/v1/backoffice/ap/plans/{planId}/submit-to-regional
     */
    @PostMapping("/{planId}/submit-to-regional")
    public ResponseEntity<PlanResponse> submitToRegional(
        @PathVariable UUID planId,
        @RequestHeader(value = "X-Actor-Id", required = true) String actorId) {

        AnnualAuditPlan plan = planManagementUseCase.submitToRegionalDirectors(planId, actorId);
        return ResponseEntity.ok(responseMapper.toPlanResponse(plan));
    }

    /**
     * Send plan to Tax Centers
     * POST /api/v1/backoffice/ap/plans/{planId}/send-to-tax-centers
     */
    @PostMapping("/{planId}/send-to-tax-centers")
    public ResponseEntity<PlanResponse> sendToTaxCenters(
        @PathVariable UUID planId,
        @RequestHeader(value = "X-Actor-Id", required = true) String actorId) {

        AnnualAuditPlan plan = planManagementUseCase.sendToTaxCenters(planId, actorId);
        return ResponseEntity.ok(responseMapper.toPlanResponse(plan));
    }

    // ============= LEVEL 3: Regional Director =============

    /**
     * Approve plan by Regional Director
     * POST /api/v1/backoffice/ap/plans/{planId}/approve-by-regional
     */
    @PostMapping("/{planId}/approve-by-regional")
    public ResponseEntity<PlanResponse> approveByRegional(
        @PathVariable UUID planId,
        @Valid @RequestBody ApprovalRequest request,
        @RequestHeader(value = "X-Actor-Id", required = true) String actorId) {

        AnnualAuditPlan plan = planManagementUseCase.approveByRegionalDirector(
            planId,
            actorId,
            request.getReason()
        );

        return ResponseEntity.ok(responseMapper.toPlanResponse(plan));
    }

    /**
     * Divide regional allocation into tax center allocations
     * POST /api/v1/backoffice/ap/plans/{planId}/divide-allocations
     */
    @PostMapping("/{planId}/divide-allocations")
    public ResponseEntity<PlanResponse> divideAllocations(
        @PathVariable UUID planId,
        @Valid @RequestBody DivideAllocationRequest request,
        @RequestHeader(value = "X-Actor-Id", required = true) String actorId) {

        // Convert request DTOs to use case DTOs
        List<PlanManagementUseCase.TaxCenterAllocationDto> tcAllocations = request.getTaxCenterAllocations()
            .stream()
            .map(t -> new PlanManagementUseCase.TaxCenterAllocationDto(t.getTaxCenterCode(), t.getAuditCount()))
            .toList();

        AnnualAuditPlan plan = planManagementUseCase.divideRegionalAllocationIntoTaxCenters(
            planId,
            request.getRegionCode(),
            tcAllocations,
            actorId
        );

        return ResponseEntity.ok(responseMapper.toPlanResponse(plan));
    }

    // ============= LEVEL 4: Tax Center Manager =============

    /**
     * Submit tax center feedback
     * PATCH /api/v1/backoffice/ap/plans/{planId}/allocations/{taxCenterCode}/feedback
     */
    @PatchMapping("/{planId}/allocations/{taxCenterCode}/feedback")
    public ResponseEntity<PlanResponse> submitTaxCenterFeedback(
        @PathVariable UUID planId,
        @PathVariable String taxCenterCode,
        @Valid @RequestBody SubmitTaxCenterFeedbackRequest request,
        @RequestHeader(value = "X-Actor-Id", required = true) String actorId) {

        AnnualAuditPlan plan = planManagementUseCase.submitTaxCenterFeedback(
            planId,
            taxCenterCode,
            request.getAdjustedCount(),
            request.getJustification(),
            actorId
        );

        return ResponseEntity.ok(responseMapper.toPlanResponse(plan));
    }

    // ============= FINALIZATION =============

    /**
     * Record all tax centers have submitted feedback
     * POST /api/v1/backoffice/ap/plans/{planId}/mark-feedback-complete
     */
    @PostMapping("/{planId}/mark-feedback-complete")
    public ResponseEntity<PlanResponse> markFeedbackComplete(
        @PathVariable UUID planId,
        @RequestHeader(value = "X-Actor-Id", required = true) String actorId) {

        AnnualAuditPlan plan = planManagementUseCase.recordAllTaxCenterFeedbackSubmitted(planId, actorId);
        return ResponseEntity.ok(responseMapper.toPlanResponse(plan));
    }

    /**
     * Finalize plan
     * POST /api/v1/backoffice/ap/plans/{planId}/finalize
     */
    @PostMapping("/{planId}/finalize")
    public ResponseEntity<PlanResponse> finalizePlan(
        @PathVariable UUID planId,
        @RequestHeader(value = "X-Actor-Id", required = true) String actorId) {

        AnnualAuditPlan plan = planManagementUseCase.finalizePlan(planId, actorId);
        return ResponseEntity.ok(responseMapper.toPlanResponse(plan));
    }

    // ============= QUERIES =============

    /**
     * Get plan by ID
     * GET /api/v1/backoffice/ap/plans/{planId}
     */
    @GetMapping("/{planId}")
    public ResponseEntity<PlanResponse> getPlanById(@PathVariable UUID planId) {
        AnnualAuditPlan plan = planManagementUseCase.getPlanById(planId);
        return ResponseEntity.ok(responseMapper.toPlanResponse(plan));
    }

    /**
     * Get regional allocations for a plan
     * GET /api/v1/backoffice/ap/plans/{planId}/regional-allocations
     */
    @GetMapping("/{planId}/regional-allocations")
    public ResponseEntity<List<AllocationResponse>> getRegionalAllocations(@PathVariable UUID planId) {
        List<PlanAllocation> allocations = planManagementUseCase.getRegionalAllocations(planId);
        return ResponseEntity.ok(responseMapper.toAllocationResponses(allocations));
    }

    /**
     * Get tax center allocations for a plan
     * GET /api/v1/backoffice/ap/plans/{planId}/tax-center-allocations
     */
    @GetMapping("/{planId}/tax-center-allocations")
    public ResponseEntity<List<AllocationResponse>> getTaxCenterAllocations(@PathVariable UUID planId) {
        List<PlanAllocation> allocations = planManagementUseCase.getTaxCenterAllocations(planId);
        return ResponseEntity.ok(responseMapper.toAllocationResponses(allocations));
    }

    /**
     * Get tax center allocations by region
     * GET /api/v1/backoffice/ap/plans/{planId}/regions/{regionCode}/allocations
     */
    @GetMapping("/{planId}/regions/{regionCode}/allocations")
    public ResponseEntity<List<AllocationResponse>> getTaxCenterAllocationsByRegion(
        @PathVariable UUID planId,
        @PathVariable String regionCode) {

        List<PlanAllocation> allocations = planManagementUseCase.getTaxCenterAllocationsByRegion(planId, regionCode);
        return ResponseEntity.ok(responseMapper.toAllocationResponses(allocations));
    }

    /**
     * Get audit log for a plan
     * GET /api/v1/backoffice/ap/plans/{planId}/audit-log
     */
    @GetMapping("/{planId}/audit-log")
    public ResponseEntity<List<AuditLogResponse>> getAuditLog(@PathVariable UUID planId) {
        List<PlanAuditLog> auditLogs = planManagementUseCase.getPlanAuditLog(planId);
        return ResponseEntity.ok(responseMapper.toAuditLogResponses(auditLogs));
    }

    // ============= ERROR HANDLING =============

    /**
     * Handle validation errors
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ErrorResponse("INVALID_INPUT", ex.getMessage()));
    }

    /**
     * Handle state transition errors
     */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalState(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(new ErrorResponse("INVALID_STATE", ex.getMessage()));
    }

    /**
     * Handle not found errors
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse("INTERNAL_ERROR", ex.getMessage()));
    }

    /**
     * Error response DTO
     */
    public static class ErrorResponse {
        private String code;
        private String message;

        public ErrorResponse(String code, String message) {
            this.code = code;
            this.message = message;
        }

        public String getCode() {
            return code;
        }

        public String getMessage() {
            return message;
        }
    }
}
