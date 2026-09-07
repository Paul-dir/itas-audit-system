package mor.itas.persistence.jpa.entity.workflow;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Runtime workflow task — one record per approval step per workflow instance.
 * Every approval action in the system (report review, plan approval, IDR approval, etc.)
 * creates a WorkflowTaskEntity so the system has a complete audit trail of who did what.
 */
@Entity
@Table(name = "workflow_tasks", indexes = {
    @Index(name = "idx_wt_assigned_user", columnList = "assigned_to_user_id"),
    @Index(name = "idx_wt_assigned_role", columnList = "assigned_to_role"),
    @Index(name = "idx_wt_status",        columnList = "status"),
    @Index(name = "idx_wt_case",          columnList = "case_id")
})
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class WorkflowTaskEntity {

    @Id
    @Column(columnDefinition = "UUID")
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @Column(name = "instance_id", nullable = false, columnDefinition = "UUID")
    private UUID instanceId;

    @Column(name = "step_id", nullable = false, columnDefinition = "UUID")
    private UUID stepId;

    @Column(name = "case_id", nullable = false, columnDefinition = "UUID")
    private UUID caseId;

    @Column(name = "artifact_id", nullable = false, columnDefinition = "UUID")
    private UUID artifactId;

    @Column(name = "artifact_type", nullable = false, length = 128)
    private String artifactType;    // AUDIT_REPORT, INFO_REQUEST, AUDIT_PLAN, WORKING_HYPOTHESIS

    @Column(name = "task_title", nullable = false, length = 256)
    private String taskTitle;

    @Column(name = "task_description")
    private String taskDescription;

    /** Specific user assignment (optional — role assignment is the primary routing). */
    @Column(name = "assigned_to_user_id", length = 64)
    private String assignedToUserId;

    /** Role-level routing — any user with this role in scope can act. */
    @Column(name = "assigned_to_role", nullable = false, length = 64)
    private String assignedToRole;

    @Column(name = "assigned_to_org_unit_id", columnDefinition = "UUID")
    private UUID assignedToOrgUnitId;

    @Column(nullable = false, length = 64)
    @Builder.Default
    private String status = "PENDING";
    // PENDING | COMPLETED | RETURNED | REJECTED | CANCELLED | ESCALATED

    @Column(nullable = false, length = 16)
    @Builder.Default
    private String priority = "NORMAL";

    @Column(name = "due_at")
    private OffsetDateTime dueAt;

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "completed_at")
    private OffsetDateTime completedAt;

    @Column(name = "completed_by", length = 64)
    private String completedBy;

    @Column(length = 64)
    private String decision;   // APPROVED | RETURNED | REJECTED

    private String comments;

    @Column(name = "return_reason")
    private String returnReason;   // mandatory when decision = RETURNED

    @Column(name = "version_reviewed")
    private Integer versionReviewed;

    @Column(name = "escalated_at")
    private OffsetDateTime escalatedAt;

    @Column(name = "escalation_reason")
    private String escalationReason;
}
