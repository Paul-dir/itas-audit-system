package mor.itas.persistence.jpa.entity.ap;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "t_document_request_record", indexes = {
    @Index(name = "idx_doc_req_case_id", columnList = "case_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentRequestRecordEntity {

    @Id
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @Column(name = "case_id", nullable = false)
    private UUID caseId;

    @Column(nullable = false, length = 128)
    private String documentType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "requested_by", nullable = false, length = 64)
    private String requestedBy;

    @Column(name = "due_date")
    private OffsetDateTime dueDate;

    @Column(length = 32)
    private String status; // PENDING, UPLOADED, VERIFIED, REJECTED, FOLLOW_UP

    @Column(columnDefinition = "TEXT")
    private String followUpMessage;

    @Column(name = "follow_up_count")
    @Builder.Default
    private Integer followUpCount = 0;

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
