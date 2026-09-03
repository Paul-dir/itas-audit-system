package mor.itas.persistence.jpa.entity.tp;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.*;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "tp_objection")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TpObjectionEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "audit_case_id", nullable = false)
    private ApAuditCaseEntity auditCase;

    @Column(name = "audit_case_id", insertable = false, updatable = false)
    private UUID auditCaseId;

    @Column(name = "notice_id")
    private UUID noticeId;

    @Column(name = "taxpayer_id", length = 64)
    private String taxpayerId;

    @Column(name = "objection_date")
    private OffsetDateTime objectionDate;

    @Column(name = "status", length = 50, nullable = false)
    @Builder.Default
    private String status = "SUBMITTED";

    @Column(name = "notice_provision_referenced", columnDefinition = "TEXT")
    private String noticeProvisionReferenced;

    @Column(name = "factual_explanation", columnDefinition = "TEXT")
    private String factualExplanation;

    @Column(name = "legal_arguments", columnDefinition = "TEXT")
    private String legalArguments;

    @Column(name = "supporting_evidence_refs", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode supportingEvidenceRefs;

    @Column(name = "disputed_tp_analysis_sections", columnDefinition = "TEXT")
    private String disputedTpAnalysisSections;

    @Column(name = "reviewer_id", length = 255)
    private String reviewerId;

    @Column(name = "reviewed_at")
    private OffsetDateTime reviewedAt;

    @Column(name = "review_result", length = 100)
    private String reviewResult;

    @Column(name = "adjusted_assessment_amount", precision = 18, scale = 2)
    private BigDecimal adjustedAssessmentAmount;

    @Column(name = "review_comments", columnDefinition = "TEXT")
    private String reviewComments;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
