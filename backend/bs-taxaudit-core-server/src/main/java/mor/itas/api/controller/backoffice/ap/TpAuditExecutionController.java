package mor.itas.api.controller.backoffice.ap;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mor.itas.api.dto.request.tp.TpAuditPlanRequest;
import mor.itas.api.dto.request.tp.TpRiskAssessmentRequest;
import mor.itas.api.dto.request.tp.TpWorkingHypothesisRequest;
import mor.itas.application.usecase.ap.TpAuditPlanUseCase;
import mor.itas.application.usecase.ap.TpRiskAssessmentUseCase;
import mor.itas.application.usecase.ap.TpWorkingHypothesisUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/backoffice/ap/cases/{caseId}/tp")
@RequiredArgsConstructor
@Slf4j
public class TpAuditExecutionController {

    private final TpRiskAssessmentUseCase tpRiskAssessmentUseCase;
    private final TpWorkingHypothesisUseCase tpWorkingHypothesisUseCase;
    private final TpAuditPlanUseCase tpAuditPlanUseCase;

    @PostMapping("/risk-assessment")
    public ResponseEntity<Void> submitRiskAssessment(
            @PathVariable UUID caseId,
            @RequestBody TpRiskAssessmentRequest request,
            @RequestHeader("X-Actor-Id") String actorId) {
        
        log.info("Received request to submit TP Risk Assessment for case: {} from actor: {}", caseId, actorId);
        tpRiskAssessmentUseCase.saveRiskAssessment(
                caseId, 
                request.getRiskLevel(), 
                request.getRiskDetails(), 
                request.getComments(), 
                actorId);
        
        return ResponseEntity.ok().build();
    }

    @PostMapping("/working-hypothesis")
    public ResponseEntity<Void> submitWorkingHypothesis(
            @PathVariable UUID caseId,
            @RequestBody TpWorkingHypothesisRequest request,
            @RequestHeader("X-Actor-Id") String actorId) {
        
        log.info("Received request to submit TP Working Hypothesis for case: {} from actor: {}", caseId, actorId);
        tpWorkingHypothesisUseCase.saveWorkingHypothesis(
                caseId, 
                request.getHypothesisDescription(), 
                request.getIdentifiedIssue(), 
                request.getEconomicRationale(), 
                request.getRevenueAtRisk(), 
                request.getCalculationDetails(), 
                actorId);
        
        return ResponseEntity.ok().build();
    }

    @PostMapping("/audit-plan")
    public ResponseEntity<Void> submitAuditPlan(
            @PathVariable UUID caseId,
            @RequestBody TpAuditPlanRequest request,
            @RequestHeader("X-Actor-Id") String actorId) {
        
        log.info("Received request to submit TP Audit Plan for case: {} from actor: {}", caseId, actorId);
        tpAuditPlanUseCase.saveAuditPlan(
                caseId, 
                request.getObjective(), 
                request.getScope(), 
                request.getMaterialityDetails(), 
                request.getIndustryResearch(), 
                request.getSamplingMethod(), 
                request.getPlannedProcedures(), 
                actorId);
        
        return ResponseEntity.ok().build();
    }
}
