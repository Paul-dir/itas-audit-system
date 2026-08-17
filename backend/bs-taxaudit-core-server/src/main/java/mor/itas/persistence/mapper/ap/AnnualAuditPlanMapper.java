package mor.itas.persistence.mapper.ap;

import mor.itas.domain.aggregate.ap.AnnualAuditPlan;
import mor.itas.domain.aggregate.ap.PlanAllocation;
import mor.itas.persistence.jpa.entity.ap.AnnualAuditPlanEntity;
import mor.itas.persistence.jpa.entity.ap.PlanAllocationEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class AnnualAuditPlanMapper {

    public AnnualAuditPlanEntity toEntity(AnnualAuditPlan domain) {
        if (domain == null) return null;
        AnnualAuditPlanEntity entity = new AnnualAuditPlanEntity();
        entity.setId(domain.getId());
        entity.setPlanYear(domain.getPlanYear());
        entity.setPlanName(domain.getPlanName());
        entity.setStatus(domain.getStatus());
        entity.setCreatedAt(domain.getCreatedAt());
        entity.setCreatedBy(domain.getCreatedBy());

        List<PlanAllocationEntity> allocationEntities = domain.getAllocations().stream().map(a -> {
            PlanAllocationEntity ae = new PlanAllocationEntity();
            ae.setId(a.getId());
            ae.setPlan(entity);
            ae.setTaxCenterCode(a.getTaxCenterCode());
            ae.setProposedCount(a.getProposedCount());
            ae.setCreatedAt(a.getCreatedAt());
            return ae;
        }).collect(Collectors.toList());

        entity.setAllocations(allocationEntities);
        return entity;
    }

    public AnnualAuditPlan toDomain(AnnualAuditPlanEntity entity) {
        if (entity == null) return null;
        List<PlanAllocation> allocations = entity.getAllocations().stream().map(ae -> 
            new PlanAllocation(ae.getId(), entity.getId(), ae.getTaxCenterCode(), ae.getProposedCount(), ae.getCreatedAt())
        ).collect(Collectors.toList());

        return new AnnualAuditPlan(
            entity.getId(),
            entity.getPlanYear(),
            entity.getPlanName(),
            entity.getStatus(),
            entity.getCreatedAt(),
            entity.getCreatedBy(),
            allocations
        );
    }
}
