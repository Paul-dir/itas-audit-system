package mor.itas.persistence.jpa.entity.ap;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "t_working_paper", indexes = {
    @Index(name = "idx_wp_case_id", columnList = "case_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkingPaperEntity {

    @Id
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @Column(name = "case_id", nullable = false)
    private UUID caseId;

    @Column(nullable = false, length = 256)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 64)
    private String createdBy;

    @Column(length = 32)
    private String status; // DRAFT, SUBMITTED

    @Column(columnDefinition = "TEXT")
    private String evidenceSummary;

    @Column(name = "evidence_file_url", columnDefinition = "TEXT")
    private String evidenceFileUrl;

    @Column(name = "evidence_file_name", length = 256)
    private String evidenceFileName;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (id == null) id = UUID.randomUUID();
        if (createdAt == null) createdAt = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
