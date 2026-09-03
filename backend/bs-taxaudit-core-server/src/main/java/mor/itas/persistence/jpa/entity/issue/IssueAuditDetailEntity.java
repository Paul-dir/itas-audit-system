package mor.itas.persistence.jpa.entity.issue;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "issue_audit_details")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IssueAuditDetailEntity {

    @Id
    private UUID id = UUID.randomUUID();

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "audit_case_id", nullable = false, unique = true)
    private ApAuditCaseEntity auditCase;

    @Column(name = "current_phase", length = 64)
    private String currentPhase;

    @Column(name = "notification_required")
    private Boolean notificationRequired;

    @Column(name = "notification_sent")
    private Boolean notificationSent;

    @Column(name = "notification_date")
    private OffsetDateTime notificationDate;

    @Column(name = "notification_recipient_channel", length = 256)
    private String notificationRecipientChannel;

    @Column(name = "identified_issue", length = 512)
    private String identifiedIssue;

    @Column(name = "selection_rationale", columnDefinition = "TEXT")
    private String selectionRationale;

    @Column(name = "field_visit_required")
    private Boolean fieldVisitRequired;

    @Column(name = "report_version")
    private Integer reportVersion;

    @Column(name = "report_status", length = 64)
    private String reportStatus;

    @Column(name = "report_title", length = 256)
    private String reportTitle;

    @Column(name = "report_summary", columnDefinition = "TEXT")
    private String reportSummary;

    @Column(name = "total_adjusted_amount")
    private Double totalAdjustedAmount;

    @Column(name = "team_leader_comments", columnDefinition = "TEXT")
    private String teamLeaderComments;

    @Column(name = "process_owner_comments", columnDefinition = "TEXT")
    private String processOwnerComments;

    @Column(name = "director_comments", columnDefinition = "TEXT")
    private String directorComments;

    @Column(name = "follow_up_decision", length = 64)
    private String followUpDecision;

    @Column(name = "decision_date")
    private OffsetDateTime decisionDate;

    @Column(name = "referral_reference_number", length = 128)
    private String referralReferenceNumber;

    @Column(name = "selection_data_json", columnDefinition = "TEXT")
    private String selectionDataJson;

    @Column(name = "evidence_data_json", columnDefinition = "TEXT")
    private String evidenceDataJson;

    @Column(name = "field_visit_findings_json", columnDefinition = "TEXT")
    private String fieldVisitFindingsJson;
}
