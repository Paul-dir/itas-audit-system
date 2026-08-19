package mor.itas.persistence.mapper.ap;

import mor.itas.domain.model.ap.AnnualAuditPlan;
import mor.itas.domain.model.ap.PlanAllocation;
import mor.itas.api.dto.response.ap.AllocationResponse;
import mor.itas.api.dto.response.ap.PlanResponse;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * ApResponseDtoMapper - Maps domain models to response DTOs
 * 
 * Separates internal domain models from external API contracts.
 * Removes references to non-existent domain classes.
 */
@Component
public class ApResponseDtoMapper {

    public PlanResponse toPlanResponse(AnnualAuditPlan plan) {
        if (plan == null) return null;
        
        PlanResponse response = new PlanResponse();
        response.setId(plan.getId());
        response.setPlanYear(plan.getPlanYear());
        response.setPlanName(plan.getPlanName());
        response.setStatus(plan.getStatus().name());
        response.setCreatedBy(plan.getCreatedBy());
        response.setCreatedAt(plan.getCreatedAt());
        response.setVersion(plan.getVersion());
        
        // Separate allocations into regional and tax center
        List<AllocationResponse> regionalAllocations = plan.getAllocations().stream()
            .filter(a -> a.getTaxCenterCode() == null)
            .map(this::toPlanAllocationResponse)
            .toList();
        
        List<AllocationResponse> taxCenterAllocations = plan.getAllocations().stream()
            .filter(a -> a.getTaxCenterCode() != null)
            .map(this::toPlanAllocationResponse)
            .toList();
        
        response.setRegionalAllocations(regionalAllocations);
        response.setTaxCenterAllocations(taxCenterAllocations);
        
        return response;
    }

    public AllocationResponse toPlanAllocationResponse(PlanAllocation allocation) {
        if (allocation == null) return null;
        
        AllocationResponse response = new AllocationResponse();
        response.setId(allocation.getId());
        response.setRegionCode(allocation.getRegionCode());
        response.setTaxCenterCode(allocation.getTaxCenterCode());
        response.setProposedCount(allocation.getProposedCount());
        response.setEffectiveCount(allocation.getEffectiveCount());
        response.setTcAdjustedCount(allocation.getTcAdjustedCount());
        response.setTcJustification(allocation.getTcJustification());
        response.setTcFeedbackSubmitted(allocation.getTcFeedbackSubmitted());
        
        // Determine allocation type
        if (allocation.getTaxCenterCode() == null) {
            response.setAllocationType("REGIONAL");
        } else {
            response.setAllocationType("TAX_CENTER");
        }
        
        return response;
    }
}
