package mor.itas.persistence.mapper.ap;

import mor.itas.domain.model.ap.RegionalDeployment;
import mor.itas.persistence.jpa.entity.ap.ApRegionalDeploymentEntity;
import org.springframework.stereotype.Component;

/**
 * RegionalDeploymentMapper - Converts between JPA entity and domain model
 */
@Component
public class RegionalDeploymentMapper {

    public RegionalDeployment toDomain(ApRegionalDeploymentEntity entity) {
        if (entity == null) return null;
        
        return new RegionalDeployment(
            entity.getId(),
            entity.getPlanId(),
            entity.getRegionId(),
            entity.getDeployedBy(),
            entity.getDeployedAt(),
            entity.getStatus()
        );
    }

    public ApRegionalDeploymentEntity toEntity(RegionalDeployment domain) {
        if (domain == null) return null;
        
        ApRegionalDeploymentEntity entity = new ApRegionalDeploymentEntity();
        entity.setId(domain.getId());
        entity.setPlanId(domain.getPlanId());
        entity.setRegionId(domain.getRegionId());
        entity.setDeployedBy(domain.getDeployedBy());
        entity.setDeployedAt(domain.getDeployedAt());
        entity.setStatus(domain.getStatus());
        
        return entity;
    }
}
