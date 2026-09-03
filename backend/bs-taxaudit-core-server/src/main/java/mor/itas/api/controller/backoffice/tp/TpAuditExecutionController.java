package mor.itas.api.controller.backoffice.tp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mor.itas.api.dto.request.tp.*;
import mor.itas.application.usecase.tp.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * TP Audit Execution REST Controller — all phases under /tp sub-package.
 * Base: /api/v1/backoffice/tp/cases/{caseId}
 */
@RestController
@RequestMapping("/api/v1/backoffice/tp/cases/{caseId}")
@RequiredArgsConstructor
@Slf4j
public class TpAuditExecutionController {

    private final TpRiskAssessmentUseCase riskAssessmentUseCase;
    private final TpWorkingHypothesisUseCase workingHypothesisUseCase;
    private final TpAuditPlanUseCase auditPlanUseCase;
    private final TpPlanningMeetingUseCase planningMeetingUseCase;
    private final TpFieldWorkUseCase fieldWorkUseCase;
    private final TpAnalysisUseCase analysisUseCase;
    private final TpAuditReportUseCase auditReportUseCase;
    private final TpNoticeAndObjectionUseCase noticeAndObjectionUseCase;

    // ── Phase 1: Risk Assessment ─────────────────────────────────────────────

    @PostMapping("/risk-assessment")
    public ResponseEntity<Void> submitRiskAssessment(
            @PathVariable UUID caseId,
            @RequestBody TpRiskAssessmentRequest req,
            @RequestHeader("X-Actor-Id") String actorId) {
        riskAssessmentUseCase.saveRiskAssessment(caseId, req.getRiskLevel(), req.getRiskDetails(), req.getComments(), actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/working-hypothesis")
    public ResponseEntity<Void> submitWorkingHypothesis(
            @PathVariable UUID caseId,
            @RequestBody TpWorkingHypothesisRequest req,
            @RequestHeader("X-Actor-Id") String actorId) {
        workingHypothesisUseCase.saveWorkingHypothesis(caseId,
                req.getHypothesisDescription(), req.getIdentifiedIssue(),
                req.getEconomicRationale(), req.getRevenueAtRisk(), req.getCalculationDetails(), actorId);
        return ResponseEntity.ok().build();
    }

    // ── Phase 2: Planning ────────────────────────────────────────────────────

    @PostMapping("/audit-plan")
    public ResponseEntity<Void> submitAuditPlan(
            @PathVariable UUID caseId,
            @RequestBody TpAuditPlanRequest req,
            @RequestHeader("X-Actor-Id") String actorId) {
        auditPlanUseCase.saveAuditPlan(caseId, req.getObjective(), req.getScope(),
                req.getMaterialityDetails(), req.getIndustryResearch(),
                req.getSamplingMethod(), req.getPlannedProcedures(), actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/planning-meeting")
    public ResponseEntity<Void> recordPlanningMeeting(
            @PathVariable UUID caseId,
            @RequestBody TpPlanningMeetingRequest req,
            @RequestHeader("X-Actor-Id") String actorId) {
        planningMeetingUseCase.recordMeetingDetails(caseId, req.getScheduledDate(), req.getParticipants(), req.getAgenda(), actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/planning-meeting/decision")
    public ResponseEntity<Void> recordMeetingDecision(
            @PathVariable UUID caseId,
            @RequestBody TpMeetingDecisionRequest req,
            @RequestHeader("X-Actor-Id") String actorId) {
        planningMeetingUseCase.recordMeetingDecision(caseId, req.getDecision(), req.getDiscussionNotes(), actorId);
        return ResponseEntity.ok().build();
    }

    // ── Phase 3: Field Work ──────────────────────────────────────────────────

    @PostMapping("/field-work/accounting")
    public ResponseEntity<Void> saveAccountingAssessment(@PathVariable UUID caseId, @RequestBody TpFieldWorkRequest req, @RequestHeader("X-Actor-Id") String actorId) {
        fieldWorkUseCase.saveAccountingAssessment(caseId, req.getAccountingMethods(), req.getData(), actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/field-work/transaction-trails")
    public ResponseEntity<Void> saveTransactionTrails(@PathVariable UUID caseId, @RequestBody TpFieldWorkRequest req, @RequestHeader("X-Actor-Id") String actorId) {
        fieldWorkUseCase.saveTransactionTrails(caseId, req.getData(), actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/field-work/sample-selections")
    public ResponseEntity<Void> saveSampleSelections(@PathVariable UUID caseId, @RequestBody TpFieldWorkRequest req, @RequestHeader("X-Actor-Id") String actorId) {
        fieldWorkUseCase.saveSampleSelections(caseId, req.getData(), actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/field-work/information-requests")
    public ResponseEntity<Void> saveInformationRequests(@PathVariable UUID caseId, @RequestBody TpFieldWorkRequest req, @RequestHeader("X-Actor-Id") String actorId) {
        fieldWorkUseCase.saveInformationRequest(caseId, req.getData(), actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/field-work/fact-statement")
    public ResponseEntity<Void> saveFactStatement(@PathVariable UUID caseId, @RequestBody TpFieldWorkRequest req, @RequestHeader("X-Actor-Id") String actorId) {
        int v = req.getFactStatementVersion() != null ? req.getFactStatementVersion() : 1;
        String s = req.getFactStatementStatus() != null ? req.getFactStatementStatus() : "DRAFT";
        fieldWorkUseCase.saveFactStatement(caseId, req.getData(), v, s, actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/field-work/structured-discussions")
    public ResponseEntity<Void> saveStructuredDiscussions(@PathVariable UUID caseId, @RequestBody TpFieldWorkRequest req, @RequestHeader("X-Actor-Id") String actorId) {
        fieldWorkUseCase.saveStructuredDiscussion(caseId, req.getData(), actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/field-work/complete")
    public ResponseEntity<Void> completeFieldWork(@PathVariable UUID caseId, @RequestHeader("X-Actor-Id") String actorId) {
        fieldWorkUseCase.transitionToAnalysis(caseId, actorId);
        return ResponseEntity.ok().build();
    }

    // ── Phase 4: Analysis ────────────────────────────────────────────────────

    @PostMapping("/analysis/ratios")
    public ResponseEntity<Void> saveRatioAnalysis(@PathVariable UUID caseId, @RequestBody TpAnalysisRequest req, @RequestHeader("X-Actor-Id") String actorId) {
        analysisUseCase.saveRatioAnalysis(caseId, req.getData(), actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/analysis/benchmarks")
    public ResponseEntity<Void> saveBenchmarks(@PathVariable UUID caseId, @RequestBody TpAnalysisRequest req, @RequestHeader("X-Actor-Id") String actorId) {
        analysisUseCase.saveBenchmarkComparisons(caseId, req.getData(), actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/analysis/cross-border")
    public ResponseEntity<Void> saveCrossBorder(@PathVariable UUID caseId, @RequestBody TpAnalysisRequest req, @RequestHeader("X-Actor-Id") String actorId) {
        analysisUseCase.saveCrossBorderAssessments(caseId, req.getData(), actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/analysis/customs-valuation")
    public ResponseEntity<Void> saveCustomsValuation(@PathVariable UUID caseId, @RequestBody TpAnalysisRequest req, @RequestHeader("X-Actor-Id") String actorId) {
        analysisUseCase.saveCustomsValuationMatches(caseId, req.getData(), actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/analysis/method-selection")
    public ResponseEntity<Void> saveTpMethodSelection(@PathVariable UUID caseId, @RequestBody TpAnalysisRequest req, @RequestHeader("X-Actor-Id") String actorId) {
        analysisUseCase.saveTpMethodSelection(caseId, req.getSelectedTpMethod(), req.getData(), actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/analysis/arms-length")
    public ResponseEntity<Void> saveArmsLength(@PathVariable UUID caseId, @RequestBody TpAnalysisRequest req, @RequestHeader("X-Actor-Id") String actorId) {
        analysisUseCase.saveArmsLengthAnalysis(caseId, req.getData(),
                req.getArmsLengthRangeMin(), req.getArmsLengthRangeMax(),
                req.getTaxpayerActualResult(), req.getVarianceAmount(), req.getVariancePercentage(), actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/analysis/complete")
    public ResponseEntity<Void> completeAnalysis(@PathVariable UUID caseId, @RequestHeader("X-Actor-Id") String actorId) {
        analysisUseCase.transitionToReport(caseId, actorId);
        return ResponseEntity.ok().build();
    }

    // ── Phase 5: Report ──────────────────────────────────────────────────────

    @PostMapping("/report/draft")
    public ResponseEntity<UUID> draftReport(@PathVariable UUID caseId, @RequestBody TpAuditReportDraftRequest req, @RequestHeader("X-Actor-Id") String actorId) {
        return ResponseEntity.ok(auditReportUseCase.draftReport(caseId,
                req.getExecutiveSummary(), req.getAuditBackground(), req.getScope(),
                req.getProceduresPerformed(), req.getFindingsAndConclusions(),
                req.getIssuesAnalyzed(), req.getComplianceAssessment(), actorId));
    }

    @PostMapping("/report/{reportId}/submit-for-team-leader-review")
    public ResponseEntity<Void> submitForTLReview(@PathVariable UUID caseId, @PathVariable UUID reportId, @RequestHeader("X-Actor-Id") String actorId) {
        auditReportUseCase.submitForTeamLeaderReview(reportId, actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/report/{reportId}/team-leader-review")
    public ResponseEntity<Void> teamLeaderReview(@PathVariable UUID caseId, @PathVariable UUID reportId, @RequestBody TpReportReviewRequest req, @RequestHeader("X-Actor-Id") String actorId) {
        auditReportUseCase.recordTeamLeaderReview(reportId, req.getDecision(), req.getComments(), actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/report/{reportId}/submit-for-process-owner-review")
    public ResponseEntity<Void> submitForPOReview(@PathVariable UUID caseId, @PathVariable UUID reportId, @RequestHeader("X-Actor-Id") String actorId) {
        auditReportUseCase.submitForProcessOwnerReview(reportId, actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/report/{reportId}/process-owner-review")
    public ResponseEntity<Void> processOwnerReview(@PathVariable UUID caseId, @PathVariable UUID reportId, @RequestBody TpReportReviewRequest req, @RequestHeader("X-Actor-Id") String actorId) {
        auditReportUseCase.recordProcessOwnerReview(reportId, req.getDecision(), req.getComments(), actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/report/{reportId}/submit-for-final-approval")
    public ResponseEntity<Void> submitForFinalApproval(@PathVariable UUID caseId, @PathVariable UUID reportId, @RequestHeader("X-Actor-Id") String actorId) {
        auditReportUseCase.submitForFinalApproval(reportId, actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/report/{reportId}/final-approval")
    public ResponseEntity<Void> finalApproval(@PathVariable UUID caseId, @PathVariable UUID reportId, @RequestBody TpReportReviewRequest req, @RequestHeader("X-Actor-Id") String actorId) {
        auditReportUseCase.recordFinalApproval(reportId, req.getDecision(), req.getComments(), actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/report/{reportId}/taxpayer-response")
    public ResponseEntity<Void> taxpayerReportResponse(@PathVariable UUID caseId, @PathVariable UUID reportId, @RequestBody TpTaxpayerReportResponseRequest req, @RequestHeader("X-Actor-Id") String actorId) {
        auditReportUseCase.recordTaxpayerResponse(reportId, req.getAction(), req.getResponseDetail(), actorId);
        return ResponseEntity.ok().build();
    }

    // ── Phase 6: Notice ──────────────────────────────────────────────────────

    @PostMapping("/notice/generate")
    public ResponseEntity<UUID> generateNotice(@PathVariable UUID caseId, @RequestBody TpNoticeGenerationRequest req, @RequestHeader("X-Actor-Id") String actorId) {
        return ResponseEntity.ok(noticeAndObjectionUseCase.generateNotice(caseId,
                req.getTaxpayerName(), req.getTin(), req.getAuditPeriod(),
                req.getIssuesSummary(), req.getProposedAdjustmentsSummary(),
                req.getAssessedPrincipalTax(), req.getPenalties(), req.getInterest(),
                req.getIssueDate(), req.getResponseDeadline(), req.getDeliveryMethod(), actorId));
    }

    @PostMapping("/notice/{noticeId}/issue")
    public ResponseEntity<Void> issueNotice(@PathVariable UUID caseId, @PathVariable UUID noticeId, @RequestParam String deliveryStatus, @RequestHeader("X-Actor-Id") String actorId) {
        noticeAndObjectionUseCase.issueNotice(noticeId, deliveryStatus, actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/notice/{noticeId}/returned")
    public ResponseEntity<Void> markReturned(@PathVariable UUID caseId, @PathVariable UUID noticeId, @RequestParam String returnedReason, @RequestParam(required = false) String actionPlanDetails, @RequestHeader("X-Actor-Id") String actorId) {
        noticeAndObjectionUseCase.markNoticeReturned(noticeId, returnedReason, actionPlanDetails, actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/notice/{noticeId}/acknowledge")
    public ResponseEntity<Void> acknowledgeNotice(@PathVariable UUID caseId, @PathVariable UUID noticeId, @RequestHeader("X-Actor-Id") String actorId) {
        noticeAndObjectionUseCase.acknowledgeNotice(noticeId, actorId);
        return ResponseEntity.ok().build();
    }

    // ── Phase 7: Objection ───────────────────────────────────────────────────

    @PostMapping("/objections")
    public ResponseEntity<UUID> submitObjection(@PathVariable UUID caseId, @RequestBody TpObjectionRequest req, @RequestHeader("X-Actor-Id") String actorId) {
        return ResponseEntity.ok(noticeAndObjectionUseCase.submitObjection(caseId,
                req.getNoticeId(), req.getTaxpayerId(), req.getNoticeProvisionReferenced(),
                req.getFactualExplanation(), req.getLegalArguments(), req.getDisputedTpAnalysisSections(), actorId));
    }

    @PostMapping("/objections/{objectionId}/review")
    public ResponseEntity<Void> reviewObjection(@PathVariable UUID caseId, @PathVariable UUID objectionId, @RequestBody TpObjectionReviewRequest req, @RequestHeader("X-Actor-Id") String actorId) {
        noticeAndObjectionUseCase.reviewObjection(objectionId, req.getReviewResult(), req.getAdjustedAssessmentAmount(), req.getReviewComments(), actorId);
        return ResponseEntity.ok().build();
    }

    // ── Phase 8: Closure ─────────────────────────────────────────────────────

    @PostMapping("/close")
    public ResponseEntity<Void> closeCase(@PathVariable UUID caseId, @RequestHeader("X-Actor-Id") String actorId) {
        noticeAndObjectionUseCase.closeCase(caseId, actorId);
        return ResponseEntity.ok().build();
    }
}
