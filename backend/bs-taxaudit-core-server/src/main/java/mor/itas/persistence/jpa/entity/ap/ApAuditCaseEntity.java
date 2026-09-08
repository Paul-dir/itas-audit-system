package mor.itas.persistence.jpa.entity.ap;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * ApAuditCaseEntity - JPA Entity for ap_audit_cases table
 * Represents audit cases generated from finalized annual audit plans
 */
@Entity
@Table(name = "ap_audit_cases", indexes = {
    @Index(name = "idx_ap_audit_cases_plan_id", columnList = "plan_id"),
    @Index(name = "idx_ap_audit_cases_status", columnList = "status"),
    @Index(name = "idx_ap_audit_cases_auditor", columnList = "assigned_auditor_id"),
    @Index(name = "idx_ap_audit_cases_team_leader", columnList = "assigned_team_leader_id"),
    @Index(name = "idx_ap_audit_cases_case_number", columnList = "case_number")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApAuditCaseEntity {

    @Id
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @Column(nullable = false, name = "plan_id")
    private UUID planId;

    @Column(name = "allocation_id")
    private UUID allocationId;

    @Column(nullable = false, length = 32, name = "case_number", unique = true)
    private String caseNumber;

    @Column(nullable = false, length = 64, name = "taxpayer_id")
    private String taxpayerId;

    @Column(length = 128, name = "taxpayer_name")
    private String taxpayerName;

    @Column(length = 32, name = "audit_type")
    private String auditType;

    @Column(length = 16, name = "risk_priority")
    private String riskPriority;

    @Column(name = "risk_score")
    private Integer riskScore;

    @Column(length = 32, name = "segment")
    private String segment;

    @Column(nullable = false, length = 32, name = "status")
    @Builder.Default
    private String status = "PENDING_ASSIGNMENT";

    @Column(length = 64, name = "assigned_team_leader_id")
    private String assignedTeamLeaderId;

    @Column(length = 64, name = "assigned_auditor_id")
    private String assignedAuditorId;

    @Column(name = "handoff_at")
    private OffsetDateTime handoffAt;

    @Column(length = 64, name = "handoff_by")
    private String handoffBy;

    @Column(name = "handoff_comment", columnDefinition = "TEXT")
    private String handoffComment;

    @Column(name = "assigned_at")
    private OffsetDateTime assignedAt;

    @Column(length = 64, name = "assigned_by")
    private String assignedBy;

    @Column(nullable = false, length = 64, name = "created_by")
    private String createdBy;

    @Column(nullable = false, name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "started_at")
    private OffsetDateTime startedAt;

    @Column(name = "completed_at")
    private OffsetDateTime completedAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

}
