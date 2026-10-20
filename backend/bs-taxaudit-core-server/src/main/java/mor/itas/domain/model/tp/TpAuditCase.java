package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import mor.itas.domain.exception.tp.InvalidTpPhaseTransitionException;
import mor.itas.domain.exception.tp.TpPrerequisiteNotMetException;
import mor.itas.domain.valueobject.AuditType;
import mor.itas.domain.valueobject.*;
import mor.itas.domain.valueobject.tp.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Domain Aggregate Root representing a Transfer Pricing Audit Case.
 * Operates on auditType = TRANSFER_PRICING and encapsulates full TP lifecycle state & rules.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpAuditCase {

    private String caseId;
    private String taxpayerId;
    private String taxpayerName;
    private String tin;
    
    @Builder.Default
    private AuditType auditType = AuditType.TRANSFER_PRICING;
    
    @Builder.Default
    private TpAuditPhase currentPhase = TpAuditPhase.DETAILED_RISK_ASSESSMENT;
    
    @Builder.Default
    private TpAuditStatus currentStatus = TpAuditStatus.ASSIGNED;
    
    private String assignedTeamId;
    private String leadAuditorId;
    private String processOwnerId;
    private String taxCenterCode;
    private String regionCode;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;

    // Aggregate Child Entities & Data
    private TpRiskAssessment riskAssessment;
    private TpWorkingHypothesis workingHypothesis;
    private TpPlanningMeeting planningMeeting;
    private TpMateriality materiality;
    private TpIndustryResearch industryResearch;
    private TpAuditSampling auditSampling;
    private TpAuditPlan auditPlan;
    private TpAccountingAssessment accountingAssessment;

    @Builder.Default
    private List<TpTransactionAuditTrail> transactionAuditTrails = new ArrayList<>();

    @Builder.Default
    private List<TpSampleSelection> sampleSelections = new ArrayList<>();

    @Builder.Default
    private List<TpInformationRequest> informationRequests = new ArrayList<>();

    @Builder.Default
    private List<TpTaxpayerResponse> taxpayerResponses = new ArrayList<>();

    @Builder.Default
    private List<TpFactStatement> factStatements = new ArrayList<>();

    @Builder.Default
    private List<TpStructuredDiscussion> structuredDiscussions = new ArrayList<>();

    @Builder.Default
    private List<TpRatioAnalysis> ratioAnalyses = new ArrayList<>();

    @Builder.Default
    private List<TpCostExpenseSelection> costExpenseSelections = new ArrayList<>();

    @Builder.Default
    private List<TpBenchmarkComparison> benchmarkComparisons = new ArrayList<>();

    @Builder.Default
    private List<TpCrossBorderAssessment> crossBorderAssessments = new ArrayList<>();

    @Builder.Default
    private List<TpCustomsValuationMatch> customsValuationMatches = new ArrayList<>();

    @Builder.Default
    private List<TpMethodSelection> methodSelections = new ArrayList<>();

    @Builder.Default
    private List<TpArmsLengthAnalysis> armsLengthAnalyses = new ArrayList<>();

    @Builder.Default
    private List<TpAuditReport> auditReports = new ArrayList<>();

    private TpAuditNotice auditNotice;

    @Builder.Default
    private List<TpObjection> objections = new ArrayList<>();

    @Builder.Default
    private List<TpFraudInvestigationReferral> fraudReferrals = new ArrayList<>();

    @Builder.Default
    private List<TpAuditHistoryLog> historyLogs = new ArrayList<>();

    // Domain Business Methods

    /**
     * Transitions the audit case to the target phase after validating workflow prerequisites.
     */
    public void transitionToPhase(TpAuditPhase targetPhase, String userId, String userRole) {
        validatePhaseSequence(targetPhase);
        validatePhaseTransitionPrerequisites(targetPhase);

        TpAuditPhase oldPhase = this.currentPhase;
        this.currentPhase = targetPhase;
        this.updatedAt = LocalDateTime.now();

        recordHistoryLog(
                TpActionType.UPDATE,
                "Phase transitioned from " + oldPhase + " to " + targetPhase,
                userId,
                userRole,
                "TpAuditCase",
                this.caseId,
                "SUCCESS"
        );
    }

    /**
     * Enforces valid phase sequence rules.
     */
    private void validatePhaseSequence(TpAuditPhase targetPhase) {
        if (targetPhase == this.currentPhase) {
            return;
        }

        switch (this.currentPhase) {
            case DETAILED_RISK_ASSESSMENT:
                if (targetPhase != TpAuditPhase.PLANNING) {
                    throw new InvalidTpPhaseTransitionException("Cannot transition from DETAILED_RISK_ASSESSMENT directly to " + targetPhase);
                }
                break;
            case PLANNING:
                if (targetPhase != TpAuditPhase.PLANNING_APPROVAL) {
                    throw new InvalidTpPhaseTransitionException("Cannot transition from PLANNING directly to " + targetPhase);
                }
                break;
            case PLANNING_APPROVAL:
                if (targetPhase != TpAuditPhase.FIELD_WORK && targetPhase != TpAuditPhase.DETAILED_RISK_ASSESSMENT) {
                    throw new InvalidTpPhaseTransitionException("PLANNING_APPROVAL can only transition to FIELD_WORK or return to DETAILED_RISK_ASSESSMENT");
                }
                break;
            case FIELD_WORK:
                if (targetPhase != TpAuditPhase.ANALYSIS) {
                    throw new InvalidTpPhaseTransitionException("Cannot transition from FIELD_WORK directly to " + targetPhase);
                }
                break;
            case ANALYSIS:
                if (targetPhase != TpAuditPhase.REPORT) {
                    throw new InvalidTpPhaseTransitionException("Cannot transition from ANALYSIS directly to " + targetPhase);
                }
                break;
            case REPORT:
                if (targetPhase != TpAuditPhase.REPORT_APPROVAL) {
                    throw new InvalidTpPhaseTransitionException("Cannot transition from REPORT directly to " + targetPhase);
                }
                break;
            case REPORT_APPROVAL:
                if (targetPhase != TpAuditPhase.NOTICE && targetPhase != TpAuditPhase.REPORT) {
                    throw new InvalidTpPhaseTransitionException("REPORT_APPROVAL can transition to NOTICE or return to REPORT for revisions");
                }
                break;
            case NOTICE:
                if (targetPhase != TpAuditPhase.ASSESSMENT) {
                    throw new InvalidTpPhaseTransitionException("Cannot transition from NOTICE directly to " + targetPhase);
                }
                break;
            case ASSESSMENT:
                if (targetPhase != TpAuditPhase.TAXPAYER_RESPONSE && targetPhase != TpAuditPhase.REVIEW_OR_INVESTIGATION) {
                    throw new InvalidTpPhaseTransitionException("ASSESSMENT must transition to TAXPAYER_RESPONSE or REVIEW_OR_INVESTIGATION");
                }
                break;
            case TAXPAYER_RESPONSE:
                if (targetPhase != TpAuditPhase.REVIEW_OR_INVESTIGATION && targetPhase != TpAuditPhase.COMPLETION) {
                    throw new InvalidTpPhaseTransitionException("TAXPAYER_RESPONSE can transition to REVIEW_OR_INVESTIGATION or COMPLETION");
                }
                break;
            case REVIEW_OR_INVESTIGATION:
                if (targetPhase != TpAuditPhase.COMPLETION) {
                    throw new InvalidTpPhaseTransitionException("REVIEW_OR_INVESTIGATION must transition to COMPLETION");
                }
                break;
            case COMPLETION:
                if (targetPhase != TpAuditPhase.CLOSED_SUCCESSFULLY) {
                    throw new InvalidTpPhaseTransitionException("COMPLETION can only transition to CLOSED_SUCCESSFULLY");
                }
                break;
            case CLOSED_SUCCESSFULLY:
                throw new InvalidTpPhaseTransitionException("Case is closed and cannot transition to any further phase");
        }
    }

    /**
     * Validates that all domain conditions and required entities are present before transitioning to a phase.
     */
    public void validatePhaseTransitionPrerequisites(TpAuditPhase targetPhase) {
        switch (targetPhase) {
            case PLANNING:
                if (this.riskAssessment == null || this.riskAssessment.getStatus() != TpRiskAssessmentStatus.COMPLETED && this.riskAssessment.getStatus() != TpRiskAssessmentStatus.APPROVED) {
                    throw new TpPrerequisiteNotMetException("Completed Risk Assessment is required before transitioning to PLANNING");
                }
                if (this.workingHypothesis == null) {
                    throw new TpPrerequisiteNotMetException("Working Hypothesis is required before transitioning to PLANNING");
                }
                break;
            case PLANNING_APPROVAL:
                if (this.auditPlan == null || this.auditPlan.getStatus() != TpAuditPlanStatus.SUBMITTED_FOR_REVIEW) {
                    throw new TpPrerequisiteNotMetException("Submitted Audit Plan is required for PLANNING_APPROVAL");
                }
                break;
            case FIELD_WORK:
                if (this.planningMeeting == null || this.planningMeeting.getDecision() != TpMeetingDecision.APPROVED) {
                    throw new TpPrerequisiteNotMetException("Approved Planning Meeting decision is required before FIELD_WORK");
                }
                if (this.auditPlan == null || this.auditPlan.getStatus() != TpAuditPlanStatus.APPROVED) {
                    throw new TpPrerequisiteNotMetException("Approved Audit Plan is required before FIELD_WORK");
                }
                break;
            case ANALYSIS:
                if (this.factStatements == null || this.factStatements.isEmpty()) {
                    throw new TpPrerequisiteNotMetException("Fact Statement is required before transitioning to ANALYSIS");
                }
                break;
            case REPORT:
                if (this.methodSelections == null || this.methodSelections.isEmpty()) {
                    throw new TpPrerequisiteNotMetException("TP Method Selection is required before drafting REPORT");
                }
                if (this.armsLengthAnalyses == null || this.armsLengthAnalyses.isEmpty()) {
                    throw new TpPrerequisiteNotMetException("Arm's Length Analysis is required before drafting REPORT");
                }
                break;
            case NOTICE:
                if (this.auditReports == null || this.auditReports.isEmpty()) {
                    throw new TpPrerequisiteNotMetException("Audit Report must exist before NOTICE");
                }
                TpAuditReport latestReport = getLatestReport();
                if (latestReport == null || latestReport.getStatus() != TpAuditReportStatus.FULLY_APPROVED) {
                    throw new TpPrerequisiteNotMetException("Fully approved Audit Report is required before NOTICE generation");
                }
                break;
            case CLOSED_SUCCESSFULLY:
                if (this.currentPhase != TpAuditPhase.COMPLETION) {
                    throw new TpPrerequisiteNotMetException("Case must be in COMPLETION phase before closing successfully");
                }
                break;
            default:
                break;
        }
    }

    /**
     * Gets the latest version of the audit report.
     */
    public TpAuditReport getLatestReport() {
        if (auditReports == null || auditReports.isEmpty()) {
            return null;
        }
        return auditReports.stream()
                .max((r1, r2) -> Integer.compare(r1.getVersion(), r2.getVersion()))
                .orElse(null);
    }

    /**
     * Creates and attaches a Fraud Investigation Referral record and updates status.
     */
    public TpFraudInvestigationReferral triggerFraudReferral(TpReferralReason reason, String findingDescription, String referringUserId, String userRole) {
        TpFraudInvestigationReferral referral = TpFraudInvestigationReferral.builder()
                .referralId(UUID.randomUUID().toString())
                .caseId(this.caseId)
                .reason(reason)
                .findingDescription(findingDescription)
                .referralDate(LocalDateTime.now())
                .referringUserId(referringUserId)
                .status(TpReferralStatus.PENDING)
                .build();

        if (this.fraudReferrals == null) {
            this.fraudReferrals = new ArrayList<>();
        }
        this.fraudReferrals.add(referral);
        this.currentStatus = TpAuditStatus.REFERRED_TO_FRAUD_INVESTIGATION;
        this.updatedAt = LocalDateTime.now();

        recordHistoryLog(
                TpActionType.REFER,
                "Triggered Fraud Investigation Referral due to: " + reason,
                referringUserId,
                userRole,
                "TpFraudInvestigationReferral",
                referral.getReferralId(),
                "REFERRED"
        );

        return referral;
    }

    /**
     * Appends an entry to the append-only history log.
     */
    public void recordHistoryLog(TpActionType action, String description, String userId, String userRole, String entityType, String entityId, String outcome) {
        if (this.historyLogs == null) {
            this.historyLogs = new ArrayList<>();
        }
        TpAuditHistoryLog log = TpAuditHistoryLog.builder()
                .eventId(UUID.randomUUID().toString())
                .caseId(this.caseId)
                .timestamp(LocalDateTime.now())
                .userId(userId)
                .userRole(userRole)
                .actionType(action)
                .actionDescription(description)
                .actionOutcome(outcome)
                .relatedEntityType(entityType)
                .relatedEntityId(entityId)
                .build();
        this.historyLogs.add(log);
    }

    /**
     * Finalizes audit closure after validating prerequisites.
     */
    public void closeAudit(String userId, String userRole) {
        validatePhaseTransitionPrerequisites(TpAuditPhase.CLOSED_SUCCESSFULLY);
        this.currentPhase = TpAuditPhase.CLOSED_SUCCESSFULLY;
        this.currentStatus = TpAuditStatus.CLOSED;
        this.completedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();

        recordHistoryLog(
                TpActionType.CLOSE,
                "TP Audit case closed successfully",
                userId,
                userRole,
                "TpAuditCase",
                this.caseId,
                "CLOSED"
        );
    }
}
