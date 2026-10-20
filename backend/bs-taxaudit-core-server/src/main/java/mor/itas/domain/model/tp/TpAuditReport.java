package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mor.itas.domain.valueobject.tp.TpAuditReportStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpAuditReport {
    private String reportId;
    private String caseId;
    @Builder.Default
    private int version = 1;
    @Builder.Default
    private TpAuditReportStatus status = TpAuditReportStatus.DRAFT;
    
    private String executiveSummary;
    private String caseReference;
    private String auditBackground;
    private String scope;
    private String proceduresPerformed;
    private String factsAndCircumstancesSummary;
    
    @Builder.Default
    private List<TpReportIssueDetail> issuesAnalyzed = new ArrayList<>();
    
    private String findingsAndConclusions;
    private String complianceAssessment;
    
    // Sequential Review Chain
    private TpReviewDetail teamLeaderReview;
    private TpReviewDetail processOwnerReview;
    private TpReviewDetail authorizedOfficialReview;
    
    private TpExitConference exitConference;
    private TpReportTaxpayerResponse taxpayerResponse;
    private String authorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TpReportIssueDetail {
        private String issueId;
        private String issueName;
        private String description;
        private String appliedMethod;
        private String armLengthRangeSummary;
        private String taxpayerActualValue;
        private String varianceSummary;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TpReviewDetail {
        private String reviewerId;
        private String reviewerRole; // TEAM_LEADER, PROCESS_OWNER, AUTHORIZED_OFFICIAL
        private String decision; // APPROVE, REQUEST_REVISIONS, REJECT
        private String comments;
        private LocalDateTime reviewedAt;
        private int reportVersionReviewed;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TpExitConference {
        private LocalDateTime meetingDate;
        
        @Builder.Default
        private List<String> taxpayerRepresentatives = new ArrayList<>();
        
        @Builder.Default
        private List<String> auditTeamMembers = new ArrayList<>();
        
        private String discussionNotes;
        private String taxpayerComments;
        private String auditorResponses;
        private String agreementsAndDisagreements;
        private String actionItems;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TpReportTaxpayerResponse {
        private String action; // SIGN, OBJECT, NO_RESPONSE
        private String electronicSignatureRef;
        private String objectionRationale;
        private LocalDateTime responseTimestamp;
    }
}
