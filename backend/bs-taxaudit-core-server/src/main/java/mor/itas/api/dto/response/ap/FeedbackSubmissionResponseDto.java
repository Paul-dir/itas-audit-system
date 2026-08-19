package mor.itas.api.dto.response.ap;

import lombok.*;

/**
 * FeedbackSubmissionResponseDto - Response DTO
 * 
 * Response after Tax Center submits feedback.
 * 
 * Fields:
 * - planId: The plan ID
 * - taxCenterId: The tax center ID
 * - message: Confirmation message
 * - success: Operation success flag
 */
@Builder
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class FeedbackSubmissionResponseDto {
    
    private String planId;
    private String taxCenterId;
    private String message;
    private Boolean success;
}
