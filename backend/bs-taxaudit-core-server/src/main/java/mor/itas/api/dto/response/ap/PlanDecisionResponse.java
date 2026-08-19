package mor.itas.api.dto.response.ap;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * PlanDecisionResponse - Response DTO
 * 
 * Response after a director makes a decision on a plan
 * (approve, reject, or request amendment).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanDecisionResponse {
    
    @JsonProperty("planId")
    private String planId;
    
    @JsonProperty("decision")
    private String decision;  // APPROVED, REJECTED, AMENDMENT_REQUESTED
    
    @JsonProperty("message")
    private String message;
    
    @JsonProperty("success")
    private Boolean success;
}
