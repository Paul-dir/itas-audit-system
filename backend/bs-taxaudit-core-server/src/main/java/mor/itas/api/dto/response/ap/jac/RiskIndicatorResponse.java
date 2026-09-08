package mor.itas.api.dto.response.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for a risk indicator on a committee case.
 * Maps to the structured risk indicator objects from auditConfig.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskIndicatorResponse {

    private String id;
    private String name;
    private Double weight;
    private String description;
    private String source;
    private String severity; // HIGH, MEDIUM, LOW
}
