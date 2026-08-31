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
@Table(name = "tp_working_hypothesis")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TpWorkingHypothesisEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "audit_case_id", nullable = false)
    private ApAuditCaseEntity auditCase;

    @Column(name = "audit_case_id", insertable = false, updatable = false)
    private UUID auditCaseId;

    @Column(name = "hypothesis_description", columnDefinition = "TEXT")
    private String hypothesisDescription;

    @Column(name = "identified_issue", columnDefinition = "TEXT")
    private String identifiedIssue;

    @Column(name = "economic_rationale", columnDefinition = "TEXT")
    private String economicRationale;

    @Column(name = "revenue_at_risk", precision = 19, scale = 2)
    private BigDecimal revenueAtRisk;

    @Column(length = 10)
    @Builder.Default
    private String currency = "ETB";

    @Column(length = 50, nullable = false)
    private String status; // DRAFT, SUBMITTED, APPROVED, UNDER_REVIEW

    @Column(name = "calculation_details", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode calculationDetails;

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
