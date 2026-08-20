package mor.itas.persistence.mapper.ap;

import mor.itas.domain.model.ap.PlanAuditLog;
import mor.itas.persistence.jpa.entity.ap.PlanAuditLogEntity;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.HashMap;

/**
 * PlanAuditLogMapper - Converts between PlanAuditLog domain model and JPA entity
 */
@Component
public class PlanAuditLogMapper {

    /**
     * Convert JPA entity to domain model
     */
    public PlanAuditLog toDomain(PlanAuditLogEntity entity) {
        if (entity == null) {
            return null;
        }

        PlanAuditLog log = new PlanAuditLog(
            entity.getAnnualPlan().getId(),
            entity.getAction(),
            entity.getActorId(),
            entity.getActorRole(),
            entity.getReason()
        );

        log.setId(entity.getId());
        log.setChangedFields(entity.getChangedFields() != null ? entity.getChangedFields() : new HashMap<>());
        log.setCreatedAt(entity.getCreatedAt());

        return log;
    }

    /**
     * Convert domain model to JPA entity
     */
    public PlanAuditLogEntity toEntity(PlanAuditLog domain, Object planEntity) {
        if (domain == null) {
            return null;
        }

        PlanAuditLogEntity entity = new PlanAuditLogEntity();
        entity.setId(domain.getId());
        entity.setAnnualPlan((mor.itas.persistence.jpa.entity.ap.AnnualAuditPlanEntity) planEntity);
        entity.setAction(domain.getAction());
        entity.setActorId(domain.getActorId());
        entity.setActorRole(domain.getActorRole());
        entity.setReason(domain.getReason());
        entity.setChangedFields(domain.getChangedFields() != null ? domain.getChangedFields() : new HashMap<>());
        entity.setCreatedAt(domain.getCreatedAt() != null ? domain.getCreatedAt() : OffsetDateTime.now());

        return entity;
    }
}
