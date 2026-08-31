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
@Table(name = "tp_field_work_data")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TpFieldWorkDataEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "audit_case_id", nullable = false)
    private ApAuditCaseEntity auditCase;

    @Column(name = "audit_case_id", insertable = false, updatable = false)
    private UUID auditCaseId;

    @Column(name = "accounting_methods", columnDefinition = "TEXT")
    private String accountingMethods;

    @Column(name = "accounting_findings", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode accountingFindings;

    @Column(name = "transaction_trails", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode transactionTrails;

    @Column(name = "sample_selections", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode sampleSelections;

    @Column(name = "information_requests", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode informationRequests;

    @Column(name = "fact_statement", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode factStatement;

    @Column(name = "fact_statement_status", length = 50)
    @Builder.Default
    private String factStatementStatus = "DRAFT";

    @Column(name = "fact_statement_version")
    @Builder.Default
    private Integer factStatementVersion = 1;

    @Column(name = "structured_discussions", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode structuredDiscussions;

    @Column(name = "status", length = 50)
    @Builder.Default
    private String status = "IN_PROGRESS";

    @Column(name = "created_by", length = 255)
    private String createdBy;

    @Column(name = "updated_by", length = 255)
    private String updatedBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
