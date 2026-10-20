package mor.itas.api.dto.request.tp;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class TpWorkingHypothesisRequest {
    private String hypothesisDescription;
    private String identifiedIssue;
    private String economicRationale;
    private BigDecimal revenueAtRisk;
    private JsonNode calculationDetails;
}
