package mor.itas.application.port.inboundport.tp;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.UUID;

public interface TpAuditExecutionUseCasePort {
    void saveRiskAssessment(UUID caseId, String riskLevel, JsonNode riskDetails, String comments, String actorId);
    void saveWorkingHypothesis(UUID caseId, String hypothesisDescription, String identifiedIssue, String economicRationale, Double revenueAtRisk, JsonNode calculationDetails, String actorId);
}
