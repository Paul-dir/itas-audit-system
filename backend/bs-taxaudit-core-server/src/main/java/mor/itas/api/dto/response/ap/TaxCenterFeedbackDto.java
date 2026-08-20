package mor.itas.api.dto.response.ap;

import lombok.*;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * TaxCenterFeedbackDto - Response DTO
 * 
 * Represents Tax Center feedback on their allocation capacity.
 * 
 * Fields:
 * - auditTypeId: The audit type this feedback is for
 * - requestedCount: What Regional Director requested
 * - acceptedCount: What Tax Center can actually do (capacity)
 * - justification: Why they can't do more
 * - delta: acceptedCount - requestedCount (usually negative)
 * - gapPercentage: How much short of request (%)
 * - feedbackDetails: Optional structured details
 * - submittedBy: Who submitted
 * - submittedAt: When submitted
 * - status: SUBMITTED, REVIEWED, INCORPORATED
 */
@Builder
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class TaxCenterFeedbackDto {
    
    private String taxCenterId;
    private String regionId;
    private String auditTypeId;
    
    private Integer requestedCount;
    private Integer acceptedCount;
    private Integer delta;
    private Double gapPercentage;
    
    private String justification;
    private Map<String, Object> feedbackDetails;
    
    private String submittedBy;
    private LocalDateTime submittedAt;
    private String status; // SUBMITTED, REVIEWED, INCORPORATED
}
