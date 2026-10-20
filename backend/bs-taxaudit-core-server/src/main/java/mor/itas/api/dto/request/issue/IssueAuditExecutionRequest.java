package mor.itas.api.dto.request.issue;

import lombok.Data;
import java.util.List;

@Data
public class IssueAuditExecutionRequest {
    private String action; // NOTIFY, SELECT_TRANSACTIONS, GATHER_EVIDENCE, RECORD_FIELD_VISIT, DRAFT_REPORT, SUBMIT_TO_TL, REVIEW_TL, REVIEW_PO, DECISION_DIRECTOR
    private String identifiedIssue;
    private Boolean notificationRequired;
    private Boolean notificationSent;
    private String notificationRecipientChannel;
    
    private List<SelectedTransactionDto> selectedTransactions;
    private List<EvidenceRecordDto> evidenceRecords;
    private List<FieldVisitFindingDto> fieldVisitFindings;
    
    private String reportTitle;
    private String reportSummary;
    private Double totalAdjustedAmount;
    
    private String decision; // APPROVED, REJECTED, REPORT_FINALIZED, FRAUD_REFERRAL, COMPREHENSIVE_AUDIT_REFERRAL
    private String comments;

    @Data
    public static class SelectedTransactionDto {
        private String id;
        private String issueTaxType;
        private String transactionDescription;
        private String rationale;
    }

    @Data
    public static class EvidenceRecordDto {
        private String id;
        private String source;
        private String transactionAreaId;
        private String documentReference;
        private String dateObtained;
        private String auditorComments;
    }

    @Data
    public static class FieldVisitFindingDto {
        private String id;
        private String location;
        private String visitDate;
        private String observations;
        private String transactionAreaId;
        private String supportingEvidenceRef;
    }
}
