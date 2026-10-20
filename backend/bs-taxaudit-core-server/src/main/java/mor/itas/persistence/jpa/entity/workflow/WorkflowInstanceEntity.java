package mor.itas.persistence.jpa.entity.workflow;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "workflow_instances")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class WorkflowInstanceEntity {

    @Id
    @Column(columnDefinition = "UUID")
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @Column(name = "definition_id", nullable = false, columnDefinition = "UUID")
    private UUID definitionId;

    @Column(name = "case_id", nullable = false, columnDefinition = "UUID")
    private UUID caseId;

    @Column(name = "artifact_id", nullable = false, columnDefinition = "UUID")
    private UUID artifactId;

    @Column(name = "artifact_type", nullable = false, length = 128)
    private String artifactType;

    @Column(name = "current_step_id", columnDefinition = "UUID")
    private UUID currentStepId;

    @Column(name = "current_step_number")
    private Integer currentStepNumber;

    @Column(nullable = false, length = 64)
    @Builder.Default
    private String status = "IN_PROGRESS";  // IN_PROGRESS | COMPLETED | RETURNED | REJECTED

    @Column(name = "initiated_by", nullable = false, length = 64)
    private String initiatedBy;

    @Column(name = "started_at", nullable = false)
    @Builder.Default
    private OffsetDateTime startedAt = OffsetDateTime.now();

    @Column(name = "completed_at")
    private OffsetDateTime completedAt;

    @Column(nullable = false)
    @Builder.Default
    private Integer version = 1;
}
