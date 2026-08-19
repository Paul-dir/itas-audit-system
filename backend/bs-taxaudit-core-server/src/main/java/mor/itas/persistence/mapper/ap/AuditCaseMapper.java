package mor.itas.persistence.mapper.ap;

import mor.itas.domain.model.ap.AuditCase;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import org.springframework.stereotype.Component;

/**
 * AuditCaseMapper - Converts between JPA entity and domain model
 */
@Component
public class AuditCaseMapper {

    public AuditCase toDomain(ApAuditCaseEntity entity) {
        if (entity == null) return null;
        
        return new AuditCase(
            entity.getId(),
            entity.getPlanId(),
            entity.getAllocationId(),
            entity.getCaseNumber(),
            entity.getTaxpayerId(),
            entity.getAuditType(),
            entity.getRiskScore(),
            entity.getStatus(),
            entity.getAssignedTeamLeaderId(),
            entity.getAssignedAuditorId(),
            entity.getCreatedBy(),
            entity.getCreatedAt(),
            entity.getStartedAt(),
            entity.getCompletedAt(),
            entity.getUpdatedAt()
        );
    }

    public ApAuditCaseEntity toEntity(AuditCase domain) {
        if (domain == null) return null;
        
        ApAuditCaseEntity entity = new ApAuditCaseEntity();
        entity.setId(domain.getId());
        entity.setPlanId(domain.getPlanId());
        entity.setAllocationId(domain.getAllocationId());
        entity.setCaseNumber(domain.getCaseNumber());
        entity.setTaxpayerId(domain.getTaxpayerId());
        entity.setAuditType(domain.getAuditType());
        entity.setRiskScore(domain.getRiskScore());
        entity.setStatus(domain.getStatus());
        entity.setAssignedTeamLeaderId(domain.getAssignedTeamLeaderId());
        entity.setAssignedAuditorId(domain.getAssignedAuditorId());
        entity.setCreatedBy(domain.getCreatedBy());
        entity.setCreatedAt(domain.getCreatedAt());
        entity.setStartedAt(domain.getStartedAt());
        entity.setCompletedAt(domain.getCompletedAt());
        entity.setUpdatedAt(domain.getUpdatedAt());
        
        return entity;
    }
}
