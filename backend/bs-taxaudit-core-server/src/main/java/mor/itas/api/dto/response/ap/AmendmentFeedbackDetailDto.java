package mor.itas.api.dto.response.ap;

import lombok.*;
import java.util.Map;

/**
 * AmendmentFeedbackDetailDto - Response DTO
 * 
 * Represents the Director's amendment request with regional feedback details.
 * 
 * Fields:
 * - planId: The plan ID
 * - amendmentRound: Which amendment round (1, 2, 3...)
 * - directorMessage: Message from Director
 * - directorComment: Detailed comment on what needs to change
 * - regionalFeedback: Regional capacity constraints organized by region
 * - requestedChanges: Specific suggestions for changes (optional)
 */
@Builder
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class AmendmentFeedbackDetailDto {
    
    private String planId;
    private Integer amendmentRound;
    
    private String directorMessage;
    private String directorComment;
    
    // Regional feedback organized by region
    // {
    //   "AA": {
    //     "regionName": "Addis Ababa",
    //     "totalRequested": 14000,
    //     "totalCapacity": 12800,
    //     "totalGap": -1200,
    //     "gapPercentage": 8.6,
    //     "feedback": { audit type breakdown }
    //   },
    //   ...
    // }
    private Map<String, Object> regionalFeedback;
    
    private Map<String, Object> requestedChanges;
}
