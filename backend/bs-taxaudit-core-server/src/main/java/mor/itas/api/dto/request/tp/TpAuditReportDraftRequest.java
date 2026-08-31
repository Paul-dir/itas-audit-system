package mor.itas.api.dto.request.tp;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;

@Data
public class TpAuditReportDraftRequest {
    private String executiveSummary;
    private String auditBackground;
    private String scope;
    private String proceduresPerformed;
    private String findingsAndConclusions;
    private JsonNode issuesAnalyzed;
    private String complianceAssessment;
}
