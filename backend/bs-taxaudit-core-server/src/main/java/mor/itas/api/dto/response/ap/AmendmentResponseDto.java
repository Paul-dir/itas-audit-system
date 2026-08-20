package mor.itas.api.dto.response.ap;

import lombok.*;

/**
 * AmendmentResponseDto - Response DTO
 * 
 * Response after Planning Team submits amended plan.
 * 
 * Fields:
 * - planId: The plan ID
 * - amendmentRound: Which amendment round
 * - message: Confirmation message
 * - success: Operation success flag
 */
@Builder
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class AmendmentResponseDto {
    
    private String planId;
    private Integer amendmentRound;
    private String message;
    private Boolean success;
}
