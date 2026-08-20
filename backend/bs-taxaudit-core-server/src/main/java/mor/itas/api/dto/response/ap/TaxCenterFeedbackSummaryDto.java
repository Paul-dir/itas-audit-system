package mor.itas.api.dto.response.ap;

import lombok.*;
import java.util.List;
import java.util.Map;

/**
 * TaxCenterFeedbackSummaryDto - Response DTO
 * 
 * Represents a summary of all tax center feedback for a region before aggregation.
 * 
 * Fields:
 * - taxCenterId: The tax center identifier
 * - regionId: The region
 * - feedbackByAuditType: Individual feedback for each audit type
 * - totalRequested: Total across all audit types
 * - totalCapacity: Total capacity
 * - totalGap: totalCapacity - totalRequested
 * - gapPercentage: Gap as percentage
 */
@Builder
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class TaxCenterFeedbackSummaryDto {
    
    private String taxCenterId;
    private String regionId;
    
    // Feedback organized by audit type
    // Example:
    // {
    //   "desk_audit": {
    //     "requested": 1000,
    //     "accepted": 830,
    //     "delta": -170,
    //     "gapPercentage": 17,
    //     "justification": "Training gap"
    //   },
    //   ...
    // }
    private Map<String, Object> feedbackByAuditType;
    
    private Integer totalRequested;
    private Integer totalCapacity;
    private Integer totalGap;
    private Double gapPercentage;
}
