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
        
        AuditCase domain = new AuditCase(
            entity.getId(),
            entity.getPlanId(),
            entity.getAllocationId(),
            entity.getCaseNumber(),
            entity.getTaxpayerId(),
            entity.getTaxpayerName(),
            entity.getAuditType(),
            entity.getRiskPriority(),
            entity.getRiskScore(),
            entity.getSegment(),
            entity.getStatus(),
            entity.getAssignedTeamLeaderId(),
            entity.getAssignedAuditorId(),
            entity.getCreatedBy(),
            entity.getCreatedAt(),
            entity.getStartedAt(),
            entity.getCompletedAt(),
            entity.getUpdatedAt()
        );
        // Map handoff and assignment fields
        domain.setHandoffAt(entity.getHandoffAt());
        domain.setHandoffBy(entity.getHandoffBy());
        domain.setHandoffComment(entity.getHandoffComment());
        domain.setAssignedAt(entity.getAssignedAt());
        domain.setAssignedBy(entity.getAssignedBy());
        return domain;
    }

    public ApAuditCaseEntity toEntity(AuditCase domain) {
        if (domain == null) return null;
        
        ApAuditCaseEntity entity = new ApAuditCaseEntity();
        entity.setId(domain.getId());
        entity.setPlanId(domain.getPlanId());
        entity.setAllocationId(domain.getAllocationId());
        entity.setCaseNumber(domain.getCaseNumber());
        entity.setTaxpayerId(domain.getTaxpayerId());
        entity.setTaxpayerName(domain.getTaxpayerName());
        entity.setAuditType(domain.getAuditType());
        entity.setRiskPriority(domain.getRiskPriority());
        entity.setRiskScore(domain.getRiskScore());
        entity.setSegment(domain.getSegment());
        entity.setStatus(domain.getStatus());
        entity.setAssignedTeamLeaderId(domain.getAssignedTeamLeaderId());
        entity.setAssignedAuditorId(domain.getAssignedAuditorId());
        entity.setHandoffAt(domain.getHandoffAt());
        entity.setHandoffBy(domain.getHandoffBy());
        entity.setHandoffComment(domain.getHandoffComment());
        entity.setAssignedAt(domain.getAssignedAt());
        entity.setAssignedBy(domain.getAssignedBy());
        entity.setCreatedBy(domain.getCreatedBy());
        entity.setCreatedAt(domain.getCreatedAt());
        entity.setStartedAt(domain.getStartedAt());
        entity.setCompletedAt(domain.getCompletedAt());
        entity.setUpdatedAt(domain.getUpdatedAt());
        
        return entity;
    }
}
