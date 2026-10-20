package mor.itas.persistence.jpa.entity.identity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "permissions")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PermissionEntity {

    @Id
    @Column(columnDefinition = "UUID")
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @Column(nullable = false, unique = true, length = 128)
    private String code;

    private String description;

    @Column(length = 64)
    private String module;

    @Column(name = "created_at")
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
