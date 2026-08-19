package mor.itas.api.dto.response.ap;

import lombok.*;

/**
 * RegionalFeedbackSubmissionResponseDto - Response DTO
 * 
 * Response after Regional Director submits aggregated feedback.
 * 
 * Fields:
 * - planId: The plan ID
 * - regionId: The region ID
 * - message: Confirmation message
 * - success: Operation success flag
 */
@Builder
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class RegionalFeedbackSubmissionResponseDto {
    
    private String planId;
    private String regionId;
    private String message;
    private Boolean success;
}
