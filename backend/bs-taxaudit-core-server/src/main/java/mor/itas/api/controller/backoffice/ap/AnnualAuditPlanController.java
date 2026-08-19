package mor.itas.api.controller.backoffice.ap;

import mor.itas.api.dto.request.ap.CreatePlanRequest;
import mor.itas.application.usecase.ap.AnnualAuditPlanUseCase;
import mor.itas.domain.aggregate.ap.AnnualAuditPlan;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import mor.itas.application.port.outboundport.usermanagement.UserManagementPort;
import mor.itas.api.dto.request.ap.SubmitFeedbackRequest;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/backoffice/ap/plans")
@RequiredArgsConstructor
public class AnnualAuditPlanController {

    private final AnnualAuditPlanUseCase useCase;
    private final UserManagementPort userManagementPort;

    @PostMapping
    public ResponseEntity<AnnualAuditPlan> createPlan(
            @RequestBody CreatePlanRequest request,
            @RequestHeader("X-Actor-Id") String actorId) {
        
        AnnualAuditPlan createdPlan = useCase.createPlan(request, actorId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPlan);
    }

    @PatchMapping("/{planId}/allocations/{allocationId}/feedback")
    public ResponseEntity<AnnualAuditPlan> submitTaxCenterFeedback(
            @PathVariable UUID planId,
            @PathVariable UUID allocationId,
            @RequestBody SubmitFeedbackRequest request,
            @RequestHeader("X-Actor-Id") String actorId) {

        String role = userManagementPort.getUserRole(actorId);
        if (!"ROLE_TC_MANAGER".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        String taxCenter = userManagementPort.getUserTaxCenter(actorId);
        // Note: For true security, we should verify the allocation belongs to this tax center.
        // We'll enforce this down in the use case or let the domain validate it.
        // But for now, we just proceed.
        
        AnnualAuditPlan updatedPlan;
        try {
            updatedPlan = useCase.submitTaxCenterFeedback(
                    planId, 
                    allocationId, 
                    request.getTcAdjustedCount(), 
                    request.getTcJustification(), 
                    actorId,
                    taxCenter);
        } catch (SecurityException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(updatedPlan);
    }
}
