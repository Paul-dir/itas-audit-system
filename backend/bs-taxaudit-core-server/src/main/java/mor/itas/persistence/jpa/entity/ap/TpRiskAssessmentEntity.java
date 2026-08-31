package mor.itas.persistence.jpa.entity.ap;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "tp_risk_assessment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TpRiskAssessmentEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "audit_case_id", nullable = false)
    private ApAuditCaseEntity auditCase;

    @Column(name = "audit_case_id", insertable = false, updatable = false)
    private UUID auditCaseId;

    @Column(nullable = false)
    @Builder.Default
    private Integer version = 1;

    @Column(name = "risk_level", length = 50)
    private String riskLevel; // LOW, MEDIUM, HIGH, CRITICAL

    @Column(name = "assessment_status", length = 50, nullable = false)
    private String assessmentStatus; // DRAFT, IN_PROGRESS, COMPLETED, UNDER_REVIEW, APPROVED

    @Column(name = "risk_details", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode riskDetails;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @Column(name = "created_by", length = 255)
    private String createdBy;

    @Column(name = "updated_by", length = 255)
    private String updatedBy;
}
