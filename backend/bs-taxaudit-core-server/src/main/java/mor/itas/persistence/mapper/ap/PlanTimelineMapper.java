package mor.itas.persistence.mapper.ap;

import mor.itas.domain.model.ap.PlanTimeline;
import mor.itas.persistence.jpa.entity.ap.ApPlanTimelineEntity;
import org.springframework.stereotype.Component;

/**
 * PlanTimelineMapper - Converts between JPA entity and domain model
 */
@Component
public class PlanTimelineMapper {

    public PlanTimeline toDomain(ApPlanTimelineEntity entity) {
        if (entity == null) return null;
        
        return new PlanTimeline(
            entity.getId(),
            entity.getPlanId(),
            entity.getStatus(),
            entity.getActorId(),
            entity.getComment(),
            entity.getEventTimestamp(),
            entity.getCreatedAt()
        );
    }

    public ApPlanTimelineEntity toEntity(PlanTimeline domain) {
        if (domain == null) return null;
        
        ApPlanTimelineEntity entity = new ApPlanTimelineEntity();
        entity.setId(domain.getId());
        entity.setPlanId(domain.getPlanId());
        entity.setStatus(domain.getStatus());
        entity.setActorId(domain.getActorId());
        entity.setComment(domain.getComment());
        entity.setEventTimestamp(domain.getEventTimestamp());
        entity.setCreatedAt(domain.getCreatedAt());
        
        return entity;
    }
}
