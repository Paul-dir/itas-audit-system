package mor.itas.api.dto.response.ap;

import lombok.*;
import java.util.Map;

/**
 * PlanDistributionDto - Response DTO
 * 
 * Response for approved plan distribution.
 * 
 * Fields:
 * - planId: The plan ID
 * - status: Distribution status
 * - message: Confirmation message
 * - regionalAllocations: Breakdown by region
 * - success: Operation success flag
 */
@Builder
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class PlanDistributionDto {
    
    private String planId;
    private String status;
    private String message;
    private Map<String, Object> regionalAllocations;
    private Boolean success;
}
