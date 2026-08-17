package mor.itas.api.controller.backoffice.ap;

import mor.itas.api.dto.request.ap.CreatePlanRequest;
import mor.itas.application.usecase.ap.AnnualAuditPlanUseCase;
import mor.itas.domain.aggregate.ap.AnnualAuditPlan;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/backoffice/ap/plans")
@RequiredArgsConstructor
public class AnnualAuditPlanController {

    private final AnnualAuditPlanUseCase useCase;

    @PostMapping
    public ResponseEntity<AnnualAuditPlan> createPlan(
            @RequestBody CreatePlanRequest request,
            @RequestHeader("X-Actor-Id") String actorId) {
        
        AnnualAuditPlan createdPlan = useCase.createPlan(request, actorId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPlan);
    }
}
