package mor.itas.persistence.mapper.ap;

import mor.itas.domain.model.ap.PlanRevision;
import mor.itas.persistence.jpa.entity.ap.ApPlanRevisionEntity;
import org.springframework.stereotype.Component;

/**
 * PlanRevisionMapper - Converts between JPA entity and domain model
 */
@Component
public class PlanRevisionMapper {

    public PlanRevision toDomain(ApPlanRevisionEntity entity) {
        if (entity == null) return null;
        
        return new PlanRevision(
            entity.getId(),
            entity.getPlanId(),
            entity.getComment(),
            entity.getRevisionType(),
            entity.getCreatedBy(),
            entity.getCreatedAt()
        );
    }

    public ApPlanRevisionEntity toEntity(PlanRevision domain) {
        if (domain == null) return null;
        
        ApPlanRevisionEntity entity = new ApPlanRevisionEntity();
        entity.setId(domain.getId());
        entity.setPlanId(domain.getPlanId());
        entity.setComment(domain.getComment());
        entity.setRevisionType(domain.getRevisionType());
        entity.setCreatedBy(domain.getCreatedBy());
        entity.setCreatedAt(domain.getCreatedAt());
        
        return entity;
    }
}
