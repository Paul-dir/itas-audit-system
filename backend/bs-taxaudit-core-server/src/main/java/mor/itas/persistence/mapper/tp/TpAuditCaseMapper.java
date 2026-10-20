package mor.itas.persistence.mapper.tp;

import mor.itas.domain.model.tp.TpAuditCase;
import mor.itas.domain.valueobject.AuditType;
import mor.itas.domain.valueobject.tp.TpAuditPhase;
import mor.itas.domain.valueobject.tp.TpAuditStatus;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import org.springframework.stereotype.Component;

@Component
public class TpAuditCaseMapper {

    public TpAuditCase toDomain(ApAuditCaseEntity entity) {
        if (entity == null) return null;
        return TpAuditCase.builder()
                .caseId(entity.getId() != null ? entity.getId().toString() : null)
                .taxpayerName(entity.getTaxpayerName())
                .tin(entity.getTaxpayerId())
                .auditType(AuditType.TRANSFER_PRICING)
                .currentStatus(entity.getStatus() != null ? TpAuditStatus.valueOf(entity.getStatus()) : TpAuditStatus.ASSIGNED)
                .currentPhase(entity.getTpCurrentPhase() != null ? TpAuditPhase.valueOf(entity.getTpCurrentPhase()) : TpAuditPhase.DETAILED_RISK_ASSESSMENT)
                .build();
    }

    public ApAuditCaseEntity toEntity(TpAuditCase domain) {
        if (domain == null) return null;
        ApAuditCaseEntity entity = new ApAuditCaseEntity();
        if (domain.getCaseId() != null) {
            entity.setId(java.util.UUID.fromString(domain.getCaseId()));
        }
        entity.setTaxpayerName(domain.getTaxpayerName());
        entity.setTaxpayerId(domain.getTin());
        entity.setAuditType(domain.getAuditType() != null ? domain.getAuditType().name() : "TRANSFER_PRICING");
        entity.setStatus(domain.getCurrentStatus() != null ? domain.getCurrentStatus().name() : "ASSIGNED");
        entity.setTpCurrentPhase(domain.getCurrentPhase() != null ? domain.getCurrentPhase().name() : "DETAILED_RISK_ASSESSMENT");
        return entity;
    }
}


