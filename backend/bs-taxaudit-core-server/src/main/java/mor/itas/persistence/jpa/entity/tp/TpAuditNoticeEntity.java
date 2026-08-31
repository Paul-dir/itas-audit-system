package mor.itas.persistence.jpa.entity.tp;

import jakarta.persistence.*;
import lombok.*;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "tp_audit_notice")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TpAuditNoticeEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "audit_case_id", nullable = false)
    private ApAuditCaseEntity auditCase;

    @Column(name = "audit_case_id", insertable = false, updatable = false)
    private UUID auditCaseId;

    @Column(name = "notice_reference_number", length = 100, unique = true)
    private String noticeReferenceNumber;

    @Column(name = "status", length = 50, nullable = false)
    @Builder.Default
    private String status = "DRAFT";

    @Column(name = "issue_date")
    private LocalDate issueDate;

    @Column(name = "response_deadline")
    private LocalDate responseDeadline;

    @Column(name = "taxpayer_name", length = 256)
    private String taxpayerName;

    @Column(name = "tin", length = 64)
    private String tin;

    @Column(name = "audit_period", length = 100)
    private String auditPeriod;

    @Column(name = "issues_summary", columnDefinition = "TEXT")
    private String issuesSummary;

    @Column(name = "proposed_adjustments_summary", columnDefinition = "TEXT")
    private String proposedAdjustmentsSummary;

    @Column(name = "assessed_principal_tax", precision = 18, scale = 2)
    private BigDecimal assessedPrincipalTax;

    @Column(name = "penalties", precision = 18, scale = 2)
    private BigDecimal penalties;

    @Column(name = "interest", precision = 18, scale = 2)
    private BigDecimal interest;

    @Column(name = "total_assessment_amount", precision = 18, scale = 2)
    private BigDecimal totalAssessmentAmount;

    @Column(name = "delivery_method", length = 50)
    private String deliveryMethod;

    @Column(name = "delivery_status", length = 50)
    private String deliveryStatus;

    @Column(name = "delivery_timestamp")
    private OffsetDateTime deliveryTimestamp;

    @Column(name = "returned_reason", columnDefinition = "TEXT")
    private String returnedReason;

    @Column(name = "action_plan_details", columnDefinition = "TEXT")
    private String actionPlanDetails;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
