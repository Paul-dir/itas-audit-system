package mor.itas.persistence.repository.ap;

import mor.itas.application.port.outboundport.repositoryport.ap.PlanAuditLogRepositoryPort;
import mor.itas.domain.model.ap.PlanAuditLog;
import mor.itas.persistence.jpa.entity.ap.PlanAuditLogEntity;
import mor.itas.persistence.jpa.repository.ap.PlanAuditLogJpaRepository;
import mor.itas.persistence.jpa.repository.ap.AnnualAuditPlanJpaRepository;
import mor.itas.persistence.mapper.ap.PlanAuditLogMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * PlanAuditLogRepositoryImpl - Repository implementation for Plan Audit Logs
 * Implements PlanAuditLogRepositoryPort using Spring Data JPA
 * Audit logs are write-once (immutable) - database enforces this with triggers
 */
@Component
public class PlanAuditLogRepositoryImpl implements PlanAuditLogRepositoryPort {

    @Autowired
    private PlanAuditLogJpaRepository jpaRepository;

    @Autowired
    private PlanAuditLogMapper auditLogMapper;

    @Autowired
    private AnnualAuditPlanJpaRepository planJpaRepository;

    @Override
    public PlanAuditLog save(PlanAuditLog auditLog) {
        // Fetch the plan entity to link with audit log
        var planEntity = planJpaRepository.findById(auditLog.getPlanId())
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + auditLog.getPlanId()));

        PlanAuditLogEntity entity = auditLogMapper.toEntity(auditLog, planEntity);
        PlanAuditLogEntity saved = jpaRepository.save(entity);
        return auditLogMapper.toDomain(saved);
    }

    @Override
    public Optional<PlanAuditLog> findById(UUID auditLogId) {
        return jpaRepository.findById(auditLogId)
            .map(auditLogMapper::toDomain);
    }

    @Override
    public List<PlanAuditLog> findByPlanIdOrderByCreatedAtDesc(UUID planId) {
        return jpaRepository.findByAnnualPlanIdOrderByCreatedAtDesc(planId)
            .stream()
            .map(auditLogMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public List<PlanAuditLog> findByPlanIdAndActionOrderByCreatedAtDesc(UUID planId, String action) {
        return jpaRepository.findByAnnualPlanIdAndActionOrderByCreatedAtDesc(planId, action)
            .stream()
            .map(auditLogMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public long countByPlanId(UUID planId) {
        return jpaRepository.countByAnnualPlanId(planId);
    }
}
