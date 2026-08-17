package mor.itas.application.port.outboundport.repositoryport.ap;

import mor.itas.domain.aggregate.ap.AnnualAuditPlan;
import java.util.Optional;
import java.util.UUID;

public interface AnnualAuditPlanRepository {
    AnnualAuditPlan save(AnnualAuditPlan plan);
    Optional<AnnualAuditPlan> findById(UUID id);
}
