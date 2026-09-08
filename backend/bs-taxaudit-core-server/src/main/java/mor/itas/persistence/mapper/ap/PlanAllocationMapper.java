package mor.itas.persistence.mapper.ap;

import mor.itas.domain.model.ap.PlanAllocation;
import mor.itas.persistence.jpa.entity.ap.PlanAllocationEntity;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

/**
 * PlanAllocationMapper - Converts between domain and JPA entities
 * Handles regional and tax center allocations
 */
@Component
public class PlanAllocationMapper {

    /**
     * Convert JPA entity to domain model
     */
    public PlanAllocation toDomain(PlanAllocationEntity entity) {
        if (entity == null) {
            return null;
        }

        PlanAllocation allocation = new PlanAllocation();
        allocation.setId(entity.getId());
        allocation.setPlanId(entity.getAnnualPlan().getId());
        allocation.setTaxCenterCode(entity.getTaxCenterCode());
        allocation.setRegionCode(entity.getRegionCode());
        allocation.setProposedCount(entity.getProposedCount());
        allocation.setRegionalDividedCount(entity.getRegionalDividedCount());
        allocation.setRegionalDivisionReason(entity.getRegionalDivisionReason());
        allocation.setTcAdjustedCount(entity.getTcAdjustedCount());
        allocation.setTcJustification(entity.getTcJustification());
        allocation.setTcFeedbackSubmitted(entity.getTcFeedbackSubmitted());
        allocation.setTcFeedbackSubmittedAt(entity.getTcFeedbackSubmittedAt());
        allocation.setCreatedAt(entity.getCreatedAt());
        allocation.setUpdatedAt(entity.getUpdatedAt());

        return allocation;
    }

    /**
     * Convert domain model to JPA entity
     */
    public PlanAllocationEntity toEntity(PlanAllocation domain, Object planEntity) {
        if (domain == null) {
            return null;
        }

        PlanAllocationEntity entity = new PlanAllocationEntity();
        entity.setId(domain.getId());
        entity.setAnnualPlan((mor.itas.persistence.jpa.entity.ap.AnnualAuditPlanEntity) planEntity);
        entity.setTaxCenterCode(domain.getTaxCenterCode());
        entity.setRegionCode(domain.getRegionCode());
        entity.setProposedCount(domain.getProposedCount());
        entity.setRegionalDividedCount(domain.getRegionalDividedCount());
        entity.setRegionalDivisionReason(domain.getRegionalDivisionReason());
        entity.setTcAdjustedCount(domain.getTcAdjustedCount());
        entity.setTcJustification(domain.getTcJustification());
        entity.setTcFeedbackSubmitted(domain.getTcFeedbackSubmitted());
        entity.setTcFeedbackSubmittedAt(domain.getTcFeedbackSubmittedAt());
        entity.setCreatedAt(domain.getCreatedAt() != null ? domain.getCreatedAt() : OffsetDateTime.now());
        entity.setUpdatedAt(domain.getUpdatedAt());

        return entity;
    }
}
