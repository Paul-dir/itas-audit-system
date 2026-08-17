package mor.itas.persistence.adapter.ap;

import mor.itas.domain.aggregate.ap.AnnualAuditPlan;
import mor.itas.application.port.outboundport.repositoryport.ap.AnnualAuditPlanRepository;
import mor.itas.persistence.jpa.entity.ap.AnnualAuditPlanEntity;
import mor.itas.persistence.jpa.repository.ap.AnnualAuditPlanJpaRepository;
import mor.itas.persistence.mapper.ap.AnnualAuditPlanMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AnnualAuditPlanPersistenceAdapter implements AnnualAuditPlanRepository {

    private final AnnualAuditPlanJpaRepository jpaRepository;
    private final AnnualAuditPlanMapper mapper;

    @Override
    public AnnualAuditPlan save(AnnualAuditPlan plan) {
        AnnualAuditPlanEntity entity = mapper.toEntity(plan);
        AnnualAuditPlanEntity savedEntity = jpaRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    @Override
    public Optional<AnnualAuditPlan> findById(UUID id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }
}
