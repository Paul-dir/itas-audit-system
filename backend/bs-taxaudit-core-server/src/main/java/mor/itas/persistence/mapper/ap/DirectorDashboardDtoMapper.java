package mor.itas.persistence.mapper.ap;

import mor.itas.api.dto.response.ap.PendingPlanDto;
import mor.itas.domain.model.ap.AnnualAuditPlan;
import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;

/**
 * DirectorDashboardDtoMapper - Mapper
 * 
 * Maps domain entities to DTOs for Director Dashboard responses.
 */
@Component
public class DirectorDashboardDtoMapper {
    
    /**
     * Map AnnualAuditPlan to PendingPlanDto for list view
     * 
     * @param plan the domain plan
     * @return the DTO
     */
    public PendingPlanDto toPendingPlanDto(AnnualAuditPlan plan) {
        if (plan == null) {
            return null;
        }
        
        // Build distribution from allocations
        // For Phase A, we'll return an empty map since full distribution
        // is in a separate detailed view
        Map<String, Map<String, Integer>> distribution = new HashMap<>();
        
        return PendingPlanDto.builder()
            .id(plan.getId().toString())
            .name(plan.getPlanName())
            .year(plan.getPlanYear())
            .status(plan.getStatus().name())
            .totalCases(100L)  // Will be calculated properly in full implementation
            .createdAt(plan.getCreatedAt())
            .createdBy(plan.getCreatedBy())
            .distribution(distribution)
            .description("")  // Will be added in full implementation
            .build();
    }
}
