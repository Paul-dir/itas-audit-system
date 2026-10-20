package mor.itas.persistence.jpa.entity.identity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_organizational_assignments", indexes = {
    @Index(name = "idx_uoa_user", columnList = "user_id"),
    @Index(name = "idx_uoa_tc", columnList = "tax_center_id")
})
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserOrganizationalAssignmentEntity {

    @Id
    @Column(columnDefinition = "UUID")
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @Column(name = "user_id", nullable = false, columnDefinition = "UUID")
    private UUID userId;

    @Column(name = "region_id", nullable = false, columnDefinition = "UUID")
    private UUID regionId;

    @Column(name = "tax_center_id", nullable = false, columnDefinition = "UUID")
    private UUID taxCenterId;

    @Column(name = "audit_type_id", columnDefinition = "UUID")
    private UUID auditTypeId;

    @Column(name = "committee_id", columnDefinition = "UUID")
    private UUID committeeId;

    @Column(name = "team_id", columnDefinition = "UUID")
    private UUID teamId;

    @Column(name = "team_leader_id", columnDefinition = "UUID")
    private UUID teamLeaderId;

    @Column(name = "role_code", nullable = false, length = 64)
    private String roleCode;

    @Column(nullable = false, length = 32)
    @Builder.Default
    private String status = "ACTIVE";

    @Column(name = "effective_from", nullable = false)
    @Builder.Default
    private OffsetDateTime effectiveFrom = OffsetDateTime.now();

    @Column(name = "effective_to")
    private OffsetDateTime effectiveTo;

    @Column(nullable = false, name = "created_at")
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private OffsetDateTime updatedAt = OffsetDateTime.now();
}
