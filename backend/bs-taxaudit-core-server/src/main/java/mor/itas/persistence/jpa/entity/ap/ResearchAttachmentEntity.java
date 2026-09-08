package mor.itas.persistence.jpa.entity.ap;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "t_research_attachment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResearchAttachmentEntity {

    @Id
    private UUID attachmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "note_id", nullable = false)
    private ResearchNoteEntity noteEntity;

    @Column(nullable = false, length = 255)
    private String filePath;

    @Column(nullable = false, length = 255)
    private String fileName;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "file_type", length = 50)
    private String fileType;

    @Column(nullable = false)
    private UUID uploadedBy;

    @CreationTimestamp
    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private OffsetDateTime uploadedAt;

    @PrePersist
    protected void onCreate() {
        if (attachmentId == null) {
            attachmentId = UUID.randomUUID();
        }
    }
}
