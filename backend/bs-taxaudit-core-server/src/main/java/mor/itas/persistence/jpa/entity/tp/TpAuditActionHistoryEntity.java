package mor.itas.persistence.jpa.entity.tp;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.*;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Immutable, append-only audit action history for TP cases.
 *
 * CRITICAL: This table is NEVER updated after insert. Every change to a TP
 * audit case must produce a new row. This ensures the government revenue
 * authority has an unalterable, court-admissible record of all actions.
 *
 * Statutory basis: "maintain history of audit actions undertaken for the taxpayer
 * along with details: date, assigned auditor, status, outcome"
 * Also: "maintain record of all changes to taxpayer records for audit purposes"
 */
@Entity
@Table(name = "tp_audit_action_history")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TpAuditActionHistoryEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "audit_case_id", nullable = false, updatable = false)
    private ApAuditCaseEntity auditCase;

    @Column(name = "audit_case_id", insertable = false, updatable = false)
    private UUID auditCaseId;

    @Column(name = "action_type", length = 100, nullable = false, updatable = false)
    private String actionType;
    // e.g. RISK_ASSESSMENT_SAVED, IDR_ISSUED, IDR_APPROVED, FIELD_VISIT_LOGGED,
    //      FACT_STATEMENT_SENT, ANALYSIS_COMPLETED, REPORT_DRAFTED, TL_REVIEW_APPROVED,
    //      PO_REVIEW_APPROVED, NOTICE_GENERATED, NOTICE_ISSUED, OBJECTION_SUBMITTED,
    //      OBJECTION_REVIEWED, FRAUD_REFERRED, CASE_CLOSED

    @Column(name = "action_phase", length = 100, updatable = false)
    private String actionPhase;
    // RISK_ASSESSMENT | HYPOTHESIS | PLANNING | PLANNING_MEETING | FIELD_WORK |
    // ANALYSIS | REPORT | NOTICE | OBJECTION | CLOSURE

    @Column(name = "actor_id", length = 255, nullable = false, updatable = false)
    private String actorId;

    @Column(name = "actor_role", length = 100, updatable = false)
    private String actorRole;                    // AUDITOR | TEAM_LEADER | PROCESS_OWNER | TAXPAYER | SYSTEM

    @Column(name = "summary", columnDefinition = "TEXT", nullable = false, updatable = false)
    private String summary;                      // Human-readable one-line description

    @Column(name = "detail", columnDefinition = "jsonb", updatable = false)
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode detail;                     // Full technical detail for forensic review

    @Column(name = "before_status", length = 100, updatable = false)
    private String beforeStatus;

    @Column(name = "after_status", length = 100, updatable = false)
    private String afterStatus;

    @Column(name = "reference_id", updatable = false)
    private UUID referenceId;                    // Related entity ID (notice, objection, etc.)

    @Column(name = "reference_type", length = 100, updatable = false)
    private String referenceType;                // TP_NOTICE | TP_OBJECTION | TP_IDR | TP_REPORT

    @Column(name = "action_timestamp", nullable = false, updatable = false)
    private OffsetDateTime actionTimestamp;      // Precise moment of action — never null
}
