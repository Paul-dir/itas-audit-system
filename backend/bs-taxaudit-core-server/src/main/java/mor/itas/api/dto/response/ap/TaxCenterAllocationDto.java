package mor.itas.api.dto.response.ap;

import lombok.*;
import java.util.Map;

/**
 * TaxCenterAllocationDto - Response DTO
 * 
 * Represents a Tax Center's allocation for viewing before feedback submission.
 * 
 * Fields:
 * - taxCenterId: The Tax Center identifier
 * - regionId: The region this tax center belongs to
 * - allocationByAuditType: Map of audit type → allocated count
 * - totalAllocation: Sum of all allocations
 * - status: Allocation status (ALLOCATED, FEEDBACK_PENDING, ACCEPTED)
 */
@Builder
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class TaxCenterAllocationDto {
    
    private String taxCenterId;
    private String regionId;
    private String regionName;
    
    // Map of auditTypeId → count
    // Example: {"desk_audit": 1000, "field_audit": 800, "joint_audit": 400, ...}
    private Map<String, Integer> allocationByAuditType;
    
    private Long totalAllocation;
    private String status; // ALLOCATED, FEEDBACK_PENDING, ACCEPTED
}
