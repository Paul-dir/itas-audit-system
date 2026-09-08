package mor.itas.application.usecase.ap;

import mor.itas.application.port.inboundport.ap.RequestPlanAmendmentPort;
import mor.itas.domain.service.ap.PlanApprovalService;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

/**
 * RequestPlanAmendmentUseCase - Application Use Case
 * 
 * Implements RequestPlanAmendmentPort.
 * Handles the business logic for requesting plan amendments from the planning team.
 */
@Component
public class RequestPlanAmendmentUseCase implements RequestPlanAmendmentPort {
    
    private final PlanApprovalService planApprovalService;
    
    public RequestPlanAmendmentUseCase(PlanApprovalService planApprovalService) {
        this.planApprovalService = planApprovalService;
    }
    
    @Override
    @Transactional
    public void requestAmendment(UUID planId, String feedback, String directorId) {
        planApprovalService.requestAmendment(planId, feedback, directorId);
    }
}
