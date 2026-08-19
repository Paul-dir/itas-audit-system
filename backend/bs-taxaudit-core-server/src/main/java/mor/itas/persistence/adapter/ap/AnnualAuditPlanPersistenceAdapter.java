package mor.itas.persistence.adapter.ap;

import mor.itas.domain.model.ap.AnnualAuditPlan;
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

    @Override
    public AnnualAuditPlan update(AnnualAuditPlan plan) {
        AnnualAuditPlanEntity entity = mapper.toEntity(plan);
        AnnualAuditPlanEntity updatedEntity = jpaRepository.save(entity);
        return mapper.toDomain(updatedEntity);
    }

    @Override
    public java.util.List<AnnualAuditPlan> findByStatus(String status) {
        return jpaRepository.findByStatus(status).stream().map(mapper::toDomain).collect(java.util.stream.Collectors.toList());
    }

    @Override
    public java.util.List<AnnualAuditPlan> findByYear(Integer year) {
        return jpaRepository.findByYear(year).stream().map(mapper::toDomain).collect(java.util.stream.Collectors.toList());
    }

    @Override
    public java.util.List<AnnualAuditPlan> findByStatusAndYear(String status, Integer year) {
        return jpaRepository.findByStatusAndYear(status, year).stream().map(mapper::toDomain).collect(java.util.stream.Collectors.toList());
    }
}
