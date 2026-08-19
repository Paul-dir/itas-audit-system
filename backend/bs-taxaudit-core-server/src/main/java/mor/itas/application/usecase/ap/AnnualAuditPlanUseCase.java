package mor.itas.application.usecase.ap;

import mor.itas.api.dto.request.ap.CreatePlanRequest;
import mor.itas.domain.model.ap.AnnualAuditPlan;
import mor.itas.application.port.outboundport.repositoryport.ap.AnnualAuditPlanRepository;
import mor.itas.application.port.outboundport.riskengine.RiskEnginePort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnnualAuditPlanUseCase {

    private final AnnualAuditPlanRepository repository;
    private final RiskEnginePort riskEnginePort;

    @Transactional
    public AnnualAuditPlan createPlan(CreatePlanRequest request, String actorId) {
        AnnualAuditPlan plan = new AnnualAuditPlan(request.getYear(), request.getName(), actorId);

        Map<String, Integer> quotas = riskEnginePort.fetchSuggestedQuotas();
        quotas.forEach(plan::addAllocation);

        return repository.save(plan);
    }

    @Transactional
    public AnnualAuditPlan submitTaxCenterFeedback(java.util.UUID planId, java.util.UUID allocationId, Integer adjustedCount, String justification, String actorId, String userTaxCenter) {
        AnnualAuditPlan plan = repository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found with id: " + planId));
        
        mor.itas.domain.model.ap.PlanAllocation allocation = plan.getAllocations().stream()
            .filter(a -> a.getId().equals(allocationId))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Allocation not found with id: " + allocationId));
            
        // Security check: Tax Center Manager can only edit their own allocation
        if (!allocation.getTaxCenterCode().equals(userTaxCenter)) {
            throw new SecurityException("User does not have permission to edit feedback for tax center: " + allocation.getTaxCenterCode());
        }
            
        allocation.submitLocalFeedback(adjustedCount, justification);
        
        return repository.update(plan);
    }
}
