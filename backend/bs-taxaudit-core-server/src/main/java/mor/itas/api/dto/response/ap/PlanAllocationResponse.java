package mor.itas.api.dto.response.ap;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

/**
 * PlanAllocationResponse - Response DTO for Plan Allocation
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanAllocationResponse {
    
    private UUID id;
    private String taxCenterCode;
    private Integer proposedCount;
    private Integer tcAdjustedCount;
    private String tcJustification;
    private Boolean tcFeedbackSubmitted;
}
