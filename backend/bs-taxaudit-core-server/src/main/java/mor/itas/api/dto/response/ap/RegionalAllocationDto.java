package mor.itas.api.dto.response.ap;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

/**
 * RegionalAllocationDto - Response DTO
 * 
 * Used to display regional allocation for a plan.
 * Shows how a region's allocation is distributed to tax centers.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegionalAllocationDto {
    
    @JsonProperty("planId")
    private String planId;
    
    @JsonProperty("regionId")
    private String regionId;
    
    @JsonProperty("regionName")
    private String regionName;
    
    /**
     * Regional level allocation by audit type
     * Structure: { auditTypeId: count }
     */
    @JsonProperty("allocationByAuditType")
    private Map<String, Integer> allocationByAuditType;
    
    /**
     * Total allocation for this region
     */
    @JsonProperty("totalAllocation")
    private Long totalAllocation;
    
    /**
     * Tax centers and their allocations
     * Structure: { taxCenterId: { auditTypeId: count } }
     */
    @JsonProperty("taxCenterAllocations")
    private Map<String, Map<String, Integer>> taxCenterAllocations;
    
    @JsonProperty("status")
    private String status;  // ALLOCATED, FEEDBACK_PENDING, ACCEPTED
}
