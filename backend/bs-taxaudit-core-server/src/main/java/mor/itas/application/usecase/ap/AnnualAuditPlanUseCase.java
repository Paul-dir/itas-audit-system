package mor.itas.application.usecase.ap;

import mor.itas.api.dto.request.ap.CreatePlanRequest;
import mor.itas.domain.aggregate.ap.AnnualAuditPlan;
import mor.itas.application.port.outboundport.repositoryport.ap.AnnualAuditPlanRepository;
import mor.itas.application.port.outboundport.risk.RiskEnginePort;
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
        AnnualAuditPlan plan = new AnnualAuditPlan(request.getPlanYear(), request.getPlanName(), actorId);

        Map<String, Integer> quotas = riskEnginePort.fetchSuggestedQuotas();
        quotas.forEach(plan::addAllocation);

        return repository.save(plan);
    }
}
