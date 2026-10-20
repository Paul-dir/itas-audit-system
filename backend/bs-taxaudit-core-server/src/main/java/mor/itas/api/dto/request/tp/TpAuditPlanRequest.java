package mor.itas.api.dto.request.tp;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;

@Data
public class TpAuditPlanRequest {
    private String objective;
    private String scope;
    private JsonNode materialityDetails;
    private JsonNode industryResearch;
    private JsonNode samplingMethod;
    private JsonNode plannedProcedures;
}
