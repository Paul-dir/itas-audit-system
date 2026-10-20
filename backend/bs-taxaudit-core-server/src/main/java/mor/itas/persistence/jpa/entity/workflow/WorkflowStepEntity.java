package mor.itas.persistence.jpa.entity.workflow;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "workflow_steps")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class WorkflowStepEntity {

    @Id
    @Column(columnDefinition = "UUID")
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @Column(name = "definition_id", nullable = false, columnDefinition = "UUID")
    private UUID definitionId;

    @Column(name = "step_number", nullable = false)
    private Integer stepNumber;

    @Column(name = "step_name", nullable = false, length = 128)
    private String stepName;

    private String description;

    @Column(name = "assigned_role", nullable = false, length = 64)
    private String assignedRole;

    @Column(name = "required_permission", length = 64)
    private String requiredPermission;

    @Column(name = "sla_hours")
    @Builder.Default
    private Integer slaHours = 48;

    @Column(name = "can_return", nullable = false)
    @Builder.Default
    private boolean canReturn = true;

    @Column(name = "can_reject", nullable = false)
    @Builder.Default
    private boolean canReject = true;
}
