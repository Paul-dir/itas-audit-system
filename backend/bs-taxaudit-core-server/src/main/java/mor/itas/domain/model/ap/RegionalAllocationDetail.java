package mor.itas.domain.model.ap;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * RegionalAllocationDetail - Value Object
 * 
 * Represents a regional director's allocation of a plan to tax centers.
 * Contains the breakdown of audit types across all tax centers in a region.
 * 
 * Example:
 * Region: Addis Ababa (AA)
 * Plan allocated: desk: 4200, field: 2800, joint: 1400, etc.
 * 
 * Allocation to tax centers:
 * TC-AA-01: desk: 1000, field: 800, joint: 400, ...
 * TC-AA-02: desk: 1200, field: 900, joint: 350, ...
 * TC-AA-03: desk: 900, field: 700, joint: 400, ...
 * TC-AA-04: desk: 1100, field: 400, joint: 250, ...
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegionalAllocationDetail {
    
    /**
     * Region code (AA, AB, BA, BB, CA, SO)
     */
    private String regionId;
    
    /**
     * Allocation by audit type for this region
     * Structure: { auditTypeId: count }
     * Example: { "desk_audit": 4200, "field_audit": 2800, ... }
     */
    private Map<String, Integer> allocationByAuditType;
    
    /**
     * Tax center level breakdown
     * Structure: { taxCenterId: { auditTypeId: count } }
     * Example: {
     *   "TC-AA-01": { "desk_audit": 1000, "field_audit": 800, ... },
     *   "TC-AA-02": { "desk_audit": 1200, "field_audit": 900, ... },
     *   ...
     * }
     */
    private Map<String, Map<String, Integer>> taxCenterAllocations;
    
    /**
     * Total allocation across all tax centers and audit types
     */
    private Long totalAllocated;
    
    /**
     * Status: ALLOCATED, FEEDBACK_PENDING, ACCEPTED
     */
    private String status;
}
