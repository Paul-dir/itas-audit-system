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
@Table(name = "tp_audit_report")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TpAuditReportEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "audit_case_id", nullable = false)
    private ApAuditCaseEntity auditCase;

    @Column(name = "audit_case_id", insertable = false, updatable = false)
    private UUID auditCaseId;

    @Column(nullable = false)
    @Builder.Default
    private Integer version = 1;

    @Column(name = "status", length = 100, nullable = false)
    @Builder.Default
    private String status = "DRAFT";

    @Column(name = "executive_summary", columnDefinition = "TEXT")
    private String executiveSummary;

    @Column(name = "audit_background", columnDefinition = "TEXT")
    private String auditBackground;

    @Column(name = "scope", columnDefinition = "TEXT")
    private String scope;

    @Column(name = "procedures_performed", columnDefinition = "TEXT")
    private String proceduresPerformed;

    @Column(name = "findings_and_conclusions", columnDefinition = "TEXT")
    private String findingsAndConclusions;

    @Column(name = "issues_analyzed", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode issuesAnalyzed;

    @Column(name = "compliance_assessment", columnDefinition = "TEXT")
    private String complianceAssessment;

    @Column(name = "team_leader_review", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode teamLeaderReview;

    @Column(name = "process_owner_review", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode processOwnerReview;

    @Column(name = "authorized_official_review", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode authorizedOfficialReview;

    @Column(name = "exit_conference", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode exitConference;

    @Column(name = "taxpayer_response", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode taxpayerResponse;

    @Column(name = "author_id", length = 255)
    private String authorId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
