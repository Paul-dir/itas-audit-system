package mor.itas.persistence.mapper.ap;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import mor.itas.domain.model.ap.AnnualAuditPlan;
import mor.itas.domain.model.ap.PlanAllocation;
import mor.itas.persistence.jpa.entity.ap.AnnualAuditPlanEntity;
import mor.itas.persistence.jpa.entity.ap.PlanAllocationEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class AnnualAuditPlanMapper {

    @Autowired
    private ObjectMapper objectMapper;

    public AnnualAuditPlanEntity toEntity(AnnualAuditPlan domain) {
        if (domain == null) return null;
        AnnualAuditPlanEntity entity = new AnnualAuditPlanEntity();
        entity.setId(domain.getId());
        entity.setYear(domain.getPlanYear());
        entity.setName(domain.getPlanName());
        entity.setStatus(domain.getStatus() != null ? 
            mor.itas.persistence.jpa.entity.ap.PlanStatusEnum.valueOf(domain.getStatus().name()) : 
            mor.itas.persistence.jpa.entity.ap.PlanStatusEnum.DRAFT);
        entity.setCreatedAt(domain.getCreatedAt().toInstant().atOffset(java.time.ZoneOffset.UTC));
        entity.setCreatedBy(domain.getCreatedBy());

        // Store distribution data directly as Map (Hibernate will handle JSON serialization)
        if (domain.getDistribution() != null) {
            entity.setDistribution(domain.getDistribution());
        }

        entity.setEstimatedRevenue(domain.getEstimatedRevenue());
        entity.setEstimatedRevenueDistribution(domain.getEstimatedRevenueDistribution());

        List<PlanAllocationEntity> allocationEntities = domain.getAllocations().stream().map(a -> {
            PlanAllocationEntity ae = new PlanAllocationEntity();
            ae.setId(a.getId());
            ae.setAnnualPlan(entity);
            ae.setTaxCenterCode(a.getTaxCenterCode());
            ae.setRegionCode(a.getRegionCode());  // ✅ CRITICAL: Must set region code!
            ae.setProposedCount(a.getProposedCount());
            ae.setTcAdjustedCount(a.getTcAdjustedCount());
            ae.setTcJustification(a.getTcJustification());
            ae.setTcFeedbackSubmitted(a.getTcFeedbackSubmitted());
            ae.setEstimatedRevenue(a.getEstimatedRevenue());
            ae.setRevenueByAuditType(a.getRevenueByAuditType());
            ae.setCreatedAt(a.getCreatedAt().toInstant().atOffset(java.time.ZoneOffset.UTC));
            return ae;
        }).collect(Collectors.toList());

        entity.setAmendmentComment(domain.getAmendmentComment());
        entity.setAllocations(allocationEntities);
        return entity;
    }

    public AnnualAuditPlan toDomain(AnnualAuditPlanEntity entity) {
        if (entity == null) return null;
        List<PlanAllocation> allocations = entity.getAllocations().stream().map(ae -> {
            PlanAllocation allocation = new PlanAllocation(
                ae.getId(), 
                entity.getId(), 
                ae.getTaxCenterCode(), 
                ae.getRegionCode(),      // Add region code
                ae.getProposedCount()
            );
            // Set additional fields
            allocation.setTcAdjustedCount(ae.getTcAdjustedCount());
            allocation.setTcJustification(ae.getTcJustification());
            allocation.setTcFeedbackSubmitted(ae.getTcFeedbackSubmitted());
            allocation.setEstimatedRevenue(ae.getEstimatedRevenue());
            allocation.setRevenueByAuditType(ae.getRevenueByAuditType());
            allocation.setCreatedAt(ae.getCreatedAt());
            return allocation;
        }).collect(Collectors.toList());

        AnnualAuditPlan plan = new AnnualAuditPlan(entity.getId(), entity.getYear(), entity.getName(), 
            entity.getCreatedBy());
        plan.setStatus(mor.itas.domain.model.ap.PlanStatus.valueOf(entity.getStatus().name()));
        plan.setAmendmentComment(entity.getAmendmentComment());
        
        // Assign distribution from entity (Hibernate handles JSON deserialization)
        if (entity.getDistribution() != null) {
            plan.setDistribution(entity.getDistribution());
        }
        
        plan.setEstimatedRevenue(entity.getEstimatedRevenue());
        plan.setEstimatedRevenueDistribution(entity.getEstimatedRevenueDistribution());

        // Add each allocation to the plan
        for (PlanAllocation allocation : allocations) {
            plan.addAllocation(allocation);
        }
        return plan;
    }
}
