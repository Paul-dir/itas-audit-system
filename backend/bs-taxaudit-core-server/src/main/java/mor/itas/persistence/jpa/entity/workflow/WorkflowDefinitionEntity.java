package mor.itas.persistence.jpa.entity.workflow;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "workflow_definitions")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class WorkflowDefinitionEntity {

    @Id
    @Column(columnDefinition = "UUID")
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @Column(nullable = false, unique = true, length = 64)
    private String code;     // AUDIT_REPORT, INFO_REQUEST, WORKING_HYPOTHESIS, AUDIT_PLAN

    @Column(nullable = false, length = 128)
    private String name;

    private String description;

    @Column(name = "audit_type", length = 32)
    @Builder.Default
    private String auditType = "TRANSFER_PRICING";

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;

    @Column(nullable = false)
    @Builder.Default
    private Integer version = 1;

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
