package mor.itas.api.dto.response.ap;

import lombok.*;
import java.util.List;
import java.util.Map;

/**
 * RegionalFeedbackAggregateDto - Response DTO
 * 
 * Represents aggregated feedback for a region (all tax centers combined).
 * 
 * Fields:
 * - regionId: The region identifier
 * - regionName: Human-readable region name
 * - aggregatedByAuditType: Aggregated feedback by audit type
 * - totalRequested: Total cases requested for the region
 * - totalCapacity: Total capacity across all tax centers
 * - totalGap: totalCapacity - totalRequested (usually negative)
 * - gapPercentage: Gap as percentage of requested
 * - regionalAnalysis: Regional director's qualitative analysis
 * - submittedBy: Who submitted
 * - submittedAt: When submitted
 */
@Builder
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class RegionalFeedbackAggregateDto {
    
    private String regionId;
    private String regionName;
    
    // Aggregated data by audit type
    // Example:
    // {
    //   "desk_audit": {
    //     "totalRequested": 4200,
    //     "totalCapacity": 3800,
    //     "totalGap": -400,
    //     "gapPercentage": 9.5,
    //     "taxCenterFeedbacks": [...]
    //   },
    //   ...
    // }
    private Map<String, Object> aggregatedByAuditType;
    
    private Long totalRequested;
    private Long totalCapacity;
    private Long totalGap;
    private Double gapPercentage;
    
    // Regional analysis text (why there are gaps)
    // Example: "Limited budgets, seasonal constraints, training gaps"
    private String regionalAnalysis;
    
    private String submittedBy;
    private String submittedAt;
    private String status; // SUBMITTED, REVIEWED, DIRECTOR_REVIEWED
}
