package mor.itas.persistence.jpa.entity.tp;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.*;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "tp_phase_gates")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TpPhaseGateEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "audit_case_id", nullable = false)
    private ApAuditCaseEntity auditCase;

    @Column(name = "audit_case_id", insertable = false, updatable = false)
    private UUID auditCaseId;

    @Column(name = "phase_id", length = 50, nullable = false)
    private String phaseId;

    @Column(length = 50, nullable = false)
    @Builder.Default
    private String status = "DRAFT"; // DRAFT, SUBMITTED_FOR_REVIEW, APPROVED, REVISION_REQUESTED

    @Column(name = "sub_steps_completed", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode subStepsCompleted;

    @Column(name = "sub_step_data", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode subStepData;

    @Column(name = "submitted_at")
    private OffsetDateTime submittedAt;

    @Column(name = "submitted_by", length = 100)
    private String submittedBy;

    @Column(name = "reviewed_at")
    private OffsetDateTime reviewedAt;

    @Column(name = "reviewed_by", length = 100)
    private String reviewedBy;

    @Column(name = "reviewer_role", length = 50)
    private String reviewerRole;

    @Column(name = "review_decision", length = 50)
    private String reviewDecision;

    @Column(name = "review_comments", columnDefinition = "TEXT")
    private String reviewComments;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
