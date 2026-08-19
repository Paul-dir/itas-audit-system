package mor.itas.persistence.mapper.ap;

import mor.itas.domain.model.ap.AnnualAuditPlan;
import mor.itas.domain.model.ap.PlanAllocation;
import mor.itas.domain.model.ap.PlanStatus;
import mor.itas.persistence.jpa.entity.ap.AnnualAuditPlanEntity;
import mor.itas.persistence.jpa.entity.ap.PlanAllocationEntity;
import mor.itas.persistence.jpa.entity.ap.PlanStatusEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * PlanMapper - Converts between AnnualAuditPlan domain model and JPA entity
 * Handles regional-level allocations and 4-level approval workflow
 */
@Component
public class PlanMapper {

    @Autowired
    private PlanAllocationMapper allocationMapper;

    /**
     * Convert JPA entity to domain model
     */
    public AnnualAuditPlan toDomain(AnnualAuditPlanEntity entity) {
        if (entity == null) {
            return null;
        }

        AnnualAuditPlan plan = new AnnualAuditPlan(
            entity.getId(),
            entity.getYear(),
            entity.getName(),
            entity.getCreatedBy()
        );

        // Map status
        if (entity.getStatus() != null) {
            plan.setStatus(PlanStatus.valueOf(entity.getStatus().name()));
        }

        // Map Planning Team phase
        plan.setCreatedAt(entity.getCreatedAt());

        // Map Director approval phase
        plan.setSubmittedToDirectorBy(entity.getSubmittedToDirectorBy());
        plan.setSubmittedToDirectorAt(entity.getSubmittedToDirectorAt());
        plan.setDirectorApprovedBy(entity.getDirectorApprovedBy());
        plan.setDirectorApprovedAt(entity.getDirectorApprovedAt());
        plan.setDirectorApprovalReason(entity.getDirectorApprovalReason());

        // Map Regional Director approval phase
        plan.setSubmittedToRegionalBy(entity.getSubmittedToRegionalBy());
        plan.setSubmittedToRegionalAt(entity.getSubmittedToRegionalAt());
        plan.setRegionalDirectorApprovedBy(entity.getRegionalDirectorApprovedBy());
        plan.setRegionalDirectorApprovedAt(entity.getRegionalDirectorApprovedAt());
        plan.setRegionalDirectorApprovalReason(entity.getRegionalDirectorApprovalReason());

        // Map Tax Center phase
        plan.setSentToTaxCenterAt(entity.getSentToTaxCenterAt());

        // Map metadata
        plan.setUpdatedAt(entity.getUpdatedAt());
        plan.setVersion(entity.getVersion());

        // Map allocations (regional and tax center)
        if (entity.getAllocations() != null) {
            List<PlanAllocation> allocations = entity.getAllocations()
                .stream()
                .map(allocationMapper::toDomain)
                .collect(Collectors.toList());
            allocations.forEach(plan::addAllocation);
        }

        return plan;
    }

    /**
     * Convert domain model to JPA entity
     */
    public AnnualAuditPlanEntity toEntity(AnnualAuditPlan domain) {
        if (domain == null) {
            return null;
        }

        AnnualAuditPlanEntity entity = new AnnualAuditPlanEntity();
        entity.setId(domain.getId());
        entity.setYear(domain.getPlanYear());
        entity.setName(domain.getPlanName());

        // Map status
        if (domain.getStatus() != null) {
            entity.setStatus(PlanStatusEnum.valueOf(domain.getStatus().name()));
        }

        // Map Planning Team phase
        entity.setCreatedBy(domain.getCreatedBy());
        entity.setCreatedAt(domain.getCreatedAt() != null ? domain.getCreatedAt() : OffsetDateTime.now());

        // Map Director approval phase
        entity.setSubmittedToDirectorBy(domain.getSubmittedToDirectorBy());
        entity.setSubmittedToDirectorAt(domain.getSubmittedToDirectorAt());
        entity.setDirectorApprovedBy(domain.getDirectorApprovedBy());
        entity.setDirectorApprovedAt(domain.getDirectorApprovedAt());
        entity.setDirectorApprovalReason(domain.getDirectorApprovalReason());

        // Map Regional Director approval phase
        entity.setSubmittedToRegionalBy(domain.getSubmittedToRegionalBy());
        entity.setSubmittedToRegionalAt(domain.getSubmittedToRegionalAt());
        entity.setRegionalDirectorApprovedBy(domain.getRegionalDirectorApprovedBy());
        entity.setRegionalDirectorApprovedAt(domain.getRegionalDirectorApprovedAt());
        entity.setRegionalDirectorApprovalReason(domain.getRegionalDirectorApprovalReason());

        // Map Tax Center phase
        entity.setSentToTaxCenterAt(domain.getSentToTaxCenterAt());

        // Map metadata
        entity.setUpdatedAt(domain.getUpdatedAt());
        entity.setVersion(domain.getVersion());

        // Map allocations
        if (domain.getAllocations() != null) {
            List<PlanAllocationEntity> allocationEntities = domain.getAllocations()
                .stream()
                .map(a -> allocationMapper.toEntity(a, entity))
                .collect(Collectors.toList());
            entity.setAllocations(allocationEntities);
        }

        return entity;
    }
}
