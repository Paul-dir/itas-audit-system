package mor.itas.api.dto.request.tp;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;

@Data
public class TpRiskAssessmentRequest {
    private String riskLevel;
    private JsonNode riskDetails;
    private String comments;
}
