package mor.itas.persistence.repository.ap;

import mor.itas.application.port.outboundport.repositoryport.ap.AnnualAuditPlanRepositoryPort;
import mor.itas.domain.model.ap.AnnualAuditPlan;
import mor.itas.domain.model.ap.PlanStatus;
import mor.itas.persistence.jpa.entity.ap.AnnualAuditPlanEntity;
import mor.itas.persistence.jpa.entity.ap.PlanStatusEnum;
import mor.itas.persistence.jpa.repository.ap.AnnualAuditPlanJpaRepository;
import mor.itas.persistence.mapper.ap.PlanMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * AnnualAuditPlanRepositoryImpl - Repository implementation for Annual Audit Plans
 * Implements AnnualAuditPlanRepositoryPort using Spring Data JPA
 */
@Component
public class AnnualAuditPlanRepositoryImpl implements AnnualAuditPlanRepositoryPort {

    @Autowired
    private AnnualAuditPlanJpaRepository jpaRepository;

    @Autowired
    private PlanMapper planMapper;

    @Override
    public AnnualAuditPlan save(AnnualAuditPlan plan) {
        AnnualAuditPlanEntity entity = planMapper.toEntity(plan);
        AnnualAuditPlanEntity saved = jpaRepository.save(entity);
        return planMapper.toDomain(saved);
    }

    @Override
    public Optional<AnnualAuditPlan> findById(UUID planId) {
        return jpaRepository.findById(planId)
            .map(planMapper::toDomain);
    }

    @Override
    public List<AnnualAuditPlan> findAll() {
        return jpaRepository.findAll()
            .stream()
            .map(planMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public List<AnnualAuditPlan> findByStatus(PlanStatus status) {
        PlanStatusEnum statusEnum = PlanStatusEnum.valueOf(status.name());
        return jpaRepository.findByStatus(statusEnum)
            .stream()
            .map(planMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public List<AnnualAuditPlan> findByYear(Integer year) {
        return jpaRepository.findByYear(year)
            .stream()
            .map(planMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public List<AnnualAuditPlan> findByStatusAndYear(PlanStatus status, Integer year) {
        PlanStatusEnum statusEnum = PlanStatusEnum.valueOf(status.name());
        return jpaRepository.findByStatusAndYear(statusEnum, year)
            .stream()
            .map(planMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public List<AnnualAuditPlan> findPendingDirectorApproval() {
        return findByStatus(PlanStatus.SUBMITTED_TO_DIRECTOR);
    }

    @Override
    public List<AnnualAuditPlan> findPendingRegionalApproval() {
        return findByStatus(PlanStatus.SUBMITTED_TO_REGIONAL);
    }

    @Override
    public List<AnnualAuditPlan> findSentToTaxCenters() {
        return findByStatus(PlanStatus.SENT_TO_TAX_CENTERS);
    }

    @Override
    public void delete(UUID planId) {
        jpaRepository.deleteById(planId);
    }

    @Override
    public long count() {
        return jpaRepository.count();
    }

    @Override
    public boolean existsByYear(Integer year) {
        return jpaRepository.findByYear(year).size() > 0;
    }

    @Override
    public boolean existsByYearAndName(Integer year, String name) {
        return jpaRepository.findByYearAndName(year, name).isPresent();
    }
}
