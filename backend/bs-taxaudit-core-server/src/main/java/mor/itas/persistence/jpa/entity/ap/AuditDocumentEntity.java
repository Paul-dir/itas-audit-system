package mor.itas.persistence.jpa.entity.ap;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "t_audit_document", indexes = {
    @Index(name = "idx_audit_doc_case_id", columnList = "case_id"),
    @Index(name = "idx_audit_doc_request_id", columnList = "request_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditDocumentEntity {

    @Id
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @Column(name = "case_id", nullable = false)
    private UUID caseId;

    @Column(name = "request_id")
    private UUID requestId;

    @Column(nullable = false, length = 256)
    private String fileName;

    @Column(length = 128)
    private String contentType;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(columnDefinition = "TEXT")
    private String fileUrl;

    @Column(name = "uploaded_by", nullable = false, length = 64)
    private String uploadedBy;

    @Column(length = 32)
    private String status; // UPLOADED, VERIFIED, REJECTED

    @Column(name = "verified_by")
    private String verifiedBy;

    @Column(name = "verified_at")
    private OffsetDateTime verifiedAt;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (id == null) id = UUID.randomUUID();
        if (createdAt == null) createdAt = OffsetDateTime.now();
    }
}
