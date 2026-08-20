package mor.itas.persistence.mapper.ap;

import mor.itas.domain.model.ap.RegionalFeedback;
import mor.itas.persistence.jpa.entity.ap.ApRegionalFeedbackEntity;
import org.springframework.stereotype.Component;

/**
 * RegionalFeedbackMapper - Converts between JPA entity and domain model
 */
@Component
public class RegionalFeedbackMapper {

    public RegionalFeedback toDomain(ApRegionalFeedbackEntity entity) {
        if (entity == null) return null;
        
        return new RegionalFeedback(
            entity.getId(),
            entity.getPlanId(),
            entity.getRegionId(),
            entity.getFeedbackText(),
            entity.getSubmittedBy(),
            entity.getSubmittedAt(),
            entity.getIsOverridden(),
            entity.getOverrideComment(),
            entity.getOverrideBy(),
            entity.getOverrideAt(),
            entity.getCreatedAt()
        );
    }

    public ApRegionalFeedbackEntity toEntity(RegionalFeedback domain) {
        if (domain == null) return null;
        
        ApRegionalFeedbackEntity entity = new ApRegionalFeedbackEntity();
        entity.setId(domain.getId());
        entity.setPlanId(domain.getPlanId());
        entity.setRegionId(domain.getRegionId());
        entity.setFeedbackText(domain.getFeedbackText());
        entity.setSubmittedBy(domain.getSubmittedBy());
        entity.setSubmittedAt(domain.getSubmittedAt());
        entity.setIsOverridden(domain.getIsOverridden());
        entity.setOverrideComment(domain.getOverrideComment());
        entity.setOverrideBy(domain.getOverrideBy());
        entity.setOverrideAt(domain.getOverrideAt());
        entity.setCreatedAt(domain.getCreatedAt());
        
        return entity;
    }
}
