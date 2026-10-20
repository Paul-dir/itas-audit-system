package mor.itas.persistence.jpa.entity.identity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "organizational_units", indexes = {
    @Index(name = "idx_org_units_parent", columnList = "parent_id"),
    @Index(name = "idx_org_units_type",   columnList = "unit_type"),
    @Index(name = "idx_org_units_code",   columnList = "code")
})
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class OrganizationalUnitEntity {

    @Id
    @Column(columnDefinition = "UUID")
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @Column(nullable = false, unique = true, length = 64)
    private String code;

    @Column(nullable = false, length = 256)
    private String name;

    @Column(nullable = false, name = "unit_type", length = 64)
    private String unitType;   // NATIONAL, REGIONAL, BRANCH, DEPARTMENT, TAX_CENTER

    @Column(name = "parent_id", columnDefinition = "UUID")
    private UUID parentId;

    @Column(name = "is_active")
    @Builder.Default
    private boolean active = true;

    @Column(name = "created_at")
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
