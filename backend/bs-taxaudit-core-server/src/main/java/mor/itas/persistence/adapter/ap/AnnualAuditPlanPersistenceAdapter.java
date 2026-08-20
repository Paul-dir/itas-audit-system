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
    public java.util.List<AnnualAuditPlan> findAll() {
        return jpaRepository.findAll().stream().map(mapper::toDomain).collect(java.util.stream.Collectors.toList());
    }

    @Override
    public AnnualAuditPlan update(AnnualAuditPlan plan) {
        AnnualAuditPlanEntity entity = mapper.toEntity(plan);
        AnnualAuditPlanEntity updatedEntity = jpaRepository.save(entity);
        return mapper.toDomain(updatedEntity);
    }

    @Override
    public java.util.List<AnnualAuditPlan> findByStatus(String status) {
        mor.itas.persistence.jpa.entity.ap.PlanStatusEnum statusEnum = 
            mor.itas.persistence.jpa.entity.ap.PlanStatusEnum.valueOf(status);
        return jpaRepository.findByStatus(statusEnum).stream().map(mapper::toDomain).collect(java.util.stream.Collectors.toList());
    }

    @Override
    public java.util.List<AnnualAuditPlan> findByYear(Integer year) {
        return jpaRepository.findByYear(year).stream().map(mapper::toDomain).collect(java.util.stream.Collectors.toList());
    }

    @Override
    public java.util.List<AnnualAuditPlan> findByStatusAndYear(String status, Integer year) {
        mor.itas.persistence.jpa.entity.ap.PlanStatusEnum statusEnum = 
            mor.itas.persistence.jpa.entity.ap.PlanStatusEnum.valueOf(status);
        return jpaRepository.findByStatusAndYear(statusEnum, year).stream().map(mapper::toDomain).collect(java.util.stream.Collectors.toList());
    }
}
