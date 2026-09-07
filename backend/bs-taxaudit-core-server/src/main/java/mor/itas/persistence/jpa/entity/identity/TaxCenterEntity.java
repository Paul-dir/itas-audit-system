package mor.itas.persistence.jpa.entity.identity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "tax_centers", indexes = {
    @Index(name = "idx_tax_centers_code", columnList = "code"),
    @Index(name = "idx_tax_centers_region", columnList = "region_id")
})
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TaxCenterEntity {

    @Id
    @Column(columnDefinition = "UUID")
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @Column(nullable = false, unique = true, length = 64)
    private String code;

    @Column(name = "region_id", nullable = false, columnDefinition = "UUID")
    private UUID regionId;

    @Column(nullable = false, length = 256)
    private String name;

    @Column(nullable = false, name = "is_active")
    @Builder.Default
    private boolean active = true;

    @Column(nullable = false, name = "created_at")
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private OffsetDateTime updatedAt = OffsetDateTime.now();
}
