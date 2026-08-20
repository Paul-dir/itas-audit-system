package mor.itas.api.controller.backoffice.ap;

import mor.itas.api.dto.response.ap.GenericResponse;
import mor.itas.api.dto.response.ap.PendingPlanDto;
import mor.itas.api.dto.response.ap.PlanDecisionResponse;
import mor.itas.application.port.inboundport.ap.GetPendingPlansPort;
import mor.itas.application.port.inboundport.ap.ApprovePlanPort;
import mor.itas.application.port.inboundport.ap.RejectPlanPort;
import mor.itas.application.port.inboundport.ap.RequestPlanAmendmentPort;
import mor.itas.domain.model.ap.AnnualAuditPlan;
import mor.itas.persistence.mapper.ap.DirectorDashboardDtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * DirectorDashboardController - REST Controller for Director Role
 * 
 * Provides endpoints for Director Dashboard:
 * - View pending plans awaiting review
 * - Approve plans
 * - Reject plans
 * - Request amendments
 * 
 * Hexagonal/DDD: REST Adapter → Inbound Ports → Use Cases → Domain Services
 */
@RestController
@RequestMapping("/api/v1/backoffice/ap")
@RequiredArgsConstructor
public class DirectorDashboardController {

    private final GetPendingPlansPort getPendingPlansPort;
    private final ApprovePlanPort approvePlanPort;
    private final RejectPlanPort rejectPlanPort;
    private final RequestPlanAmendmentPort requestAmendmentPort;
    private final DirectorDashboardDtoMapper dtoMapper;

    /**
     * Get all plans pending director review
     * 
     * Endpoint: GET /api/v1/backoffice/ap/plans/pending-director-review
     * 
     * Returns a list of plans in SUBMITTED_TO_DIRECTOR status,
     * ready for the director to review and make decisions on.
     * 
     * @return GenericResponse wrapping list of PendingPlanDto
     */
    @GetMapping("/plans/pending-director-review")
    public ResponseEntity<GenericResponse<List<PendingPlanDto>>> getPendingPlans() {
        try {
            List<AnnualAuditPlan> plans = getPendingPlansPort.getPendingPlans();
            
            List<PendingPlanDto> dtos = plans.stream()
                .map(dtoMapper::toPendingPlanDto)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(GenericResponse.success(dtos, dtos.size(), (long) dtos.size()));
        } catch (Exception e) {
            return ResponseEntity.ok(GenericResponse.error(
                "PENDING_PLANS_ERROR",
                "Failed to retrieve pending plans: " + e.getMessage()
            ));
        }
    }

    /**
     * Approve a plan
     * 
     * Endpoint: POST /api/v1/backoffice/ap/plans/{planId}/approve
     * 
     * Approves a plan submitted by the planning team.
     * Plan status transitions: SUBMITTED_TO_DIRECTOR → DIRECTOR_APPROVED
     * Plan can now proceed to regional allocation.
     * 
     * @param planId the plan ID
     * @return GenericResponse with decision result
     */
    @PostMapping("/plans/{planId}/approve")
    public ResponseEntity<GenericResponse<PlanDecisionResponse>> approvePlan(
        @PathVariable String planId) {
        
        try {
            UUID planUUID = UUID.fromString(planId);
            String directorId = "DIRECTOR_001"; // TODO: Get from security context
            
            approvePlanPort.approvePlan(planUUID, directorId);
            
            PlanDecisionResponse response = PlanDecisionResponse.builder()
                .planId(planId)
                .decision("APPROVED")
                .message("Plan approved successfully and ready for regional allocation")
                .success(true)
                .build();
            
            return ResponseEntity.ok(GenericResponse.success(response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(GenericResponse.error(
                "PLAN_NOT_FOUND",
                "Plan not found: " + e.getMessage()
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.ok(GenericResponse.error(
                "INVALID_PLAN_STATUS",
                "Cannot approve plan: " + e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(GenericResponse.error(
                "APPROVAL_ERROR",
                "Failed to approve plan: " + e.getMessage()
            ));
        }
    }

    /**
     * Reject a plan
     * 
     * Endpoint: POST /api/v1/backoffice/ap/plans/{planId}/reject
     * 
     * Rejects a plan submitted by the planning team with a reason.
     * Plan status transitions: SUBMITTED_TO_DIRECTOR → DIRECTOR_REJECTED
     * Plan is sent back to planning team for revision.
     * 
     * @param planId the plan ID
     * @param body contains: reason (string)
     * @return GenericResponse with decision result
     */
    @PostMapping("/plans/{planId}/reject")
    public ResponseEntity<GenericResponse<PlanDecisionResponse>> rejectPlan(
        @PathVariable String planId,
        @RequestBody Map<String, String> body) {
        
        try {
            String reason = body.get("reason");
            if (reason == null || reason.trim().isEmpty()) {
                return ResponseEntity.ok(GenericResponse.error(
                    "MISSING_REASON",
                    "Rejection reason is required"
                ));
            }
            
            UUID planUUID = UUID.fromString(planId);
            String directorId = "DIRECTOR_001"; // TODO: Get from security context
            
            rejectPlanPort.rejectPlan(planUUID, reason, directorId);
            
            PlanDecisionResponse response = PlanDecisionResponse.builder()
                .planId(planId)
                .decision("REJECTED")
                .message("Plan rejected. Reason: " + reason)
                .success(true)
                .build();
            
            return ResponseEntity.ok(GenericResponse.success(response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(GenericResponse.error(
                "PLAN_NOT_FOUND",
                "Plan not found: " + e.getMessage()
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.ok(GenericResponse.error(
                "INVALID_PLAN_STATUS",
                "Cannot reject plan: " + e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(GenericResponse.error(
                "REJECTION_ERROR",
                "Failed to reject plan: " + e.getMessage()
            ));
        }
    }

    /**
     * Request amendments to a plan
     * 
     * Endpoint: POST /api/v1/backoffice/ap/plans/{planId}/request-amendment
     * 
     * Requests amendments to a plan with detailed feedback.
     * Plan status transitions: SUBMITTED_TO_DIRECTOR → AMENDMENT_REQUIRED
     * Plan is sent back to planning team to address feedback.
     * 
     * Feedback can include:
     * - Regional capacity constraints (from tax center feedback)
     * - Specific areas that need adjustment
     * - Updated targets and strategies
     * 
     * @param planId the plan ID
     * @param body contains: feedback (string) with amendment details
     * @return GenericResponse with decision result
     */
    @PostMapping("/plans/{planId}/request-amendment")
    public ResponseEntity<GenericResponse<PlanDecisionResponse>> requestAmendment(
        @PathVariable String planId,
        @RequestBody Map<String, String> body) {
        
        try {
            String feedback = body.get("feedback");
            if (feedback == null || feedback.trim().isEmpty()) {
                return ResponseEntity.ok(GenericResponse.error(
                    "MISSING_FEEDBACK",
                    "Amendment feedback is required"
                ));
            }
            
            UUID planUUID = UUID.fromString(planId);
            String directorId = "DIRECTOR_001"; // TODO: Get from security context
            
            requestAmendmentPort.requestAmendment(planUUID, feedback, directorId);
            
            PlanDecisionResponse response = PlanDecisionResponse.builder()
                .planId(planId)
                .decision("AMENDMENT_REQUESTED")
                .message("Amendment feedback sent to planning team")
                .success(true)
                .build();
            
            return ResponseEntity.ok(GenericResponse.success(response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(GenericResponse.error(
                "PLAN_NOT_FOUND",
                "Plan not found: " + e.getMessage()
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.ok(GenericResponse.error(
                "INVALID_PLAN_STATUS",
                "Cannot request amendment: " + e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(GenericResponse.error(
                "AMENDMENT_REQUEST_ERROR",
                "Failed to request amendment: " + e.getMessage()
            ));
        }
    }
}
