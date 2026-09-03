package mor.itas.domain.model.issue;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mor.itas.domain.valueobject.issue.FollowUpDecisionType;
import mor.itas.domain.valueobject.issue.IssueAuditPhase;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Issue Audit Domain Entity / Extension for the central Audit aggregate root (when auditType = ISSUE).
 * Strictly implements FR-04.6-01 through FR-04.6-07 statutory requirements.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IssueAuditCase {

    private UUID caseId;
    private String caseNumber;
    private String taxpayerId;
    private String taxpayerName;
    private String tin;
    private String sector;

    @Builder.Default
    private IssueAuditPhase currentPhase = IssueAuditPhase.NOTIFICATION;

    private String assignedAuditorId;
    private String teamLeaderId;
    private String processOwnerId;
    private String directorId;

    // FR-04.6-01: Notification record
    private Boolean notificationRequired;
    private Boolean notificationSent;
    private LocalDateTime notificationDate;
    private String notificationRecipientChannel;

    // FR-04.6-02: Selection Data & Identified Issue
    private String identifiedIssue; // Tax type / Key noncompliance area
    private String selectionRationale;

    @Builder.Default
    private List<SelectedTransactionArea> selectedTransactionAreas = new ArrayList<>();

    // FR-04.6-03: Evidence Records
    @Builder.Default
    private List<EvidenceRecord> evidenceRecords = new ArrayList<>();

    // FR-04.6-04: Field Visit Findings
    private Boolean fieldVisitRequired;

    @Builder.Default
    private List<FieldVisitFinding> fieldVisitFindings = new ArrayList<>();

    // FR-04.6-05 to 07: Report & Multi-Level Review Chain
    private Integer reportVersion;
    private String reportStatus; // DRAFT, SUBMITTED_TO_TL, TL_APPROVED, PO_APPROVED, FINALIZED, REFERRED
    private String reportTitle;
    private String reportSummary;
    private Double totalAdjustedAmount;
    private String teamLeaderComments;
    private String processOwnerComments;
    private String directorComments;

    // FR-04.6-07: Follow-up decision
    private FollowUpDecisionType followUpDecision;
    private LocalDateTime decisionDate;
    private String referralReferenceNumber;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SelectedTransactionArea {
        private String id;
        private String issueTaxType;
        private String transactionDescription;
        private String rationale;
        private String selectingAuditorId;
        private LocalDateTime selectionDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EvidenceRecord {
        private String id;
        private String source; // INTERNAL, THIRD_PARTY, AUDITEE_UPLOADED
        private String transactionAreaId;
        private String documentReference;
        private String dateObtained;
        private String auditorComments;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FieldVisitFinding {
        private String id;
        private String location;
        private String visitDate;
        private String observations;
        private String transactionAreaId;
        private String supportingEvidenceRef;
    }
}
