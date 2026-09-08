package mor.itas.persistence.jpa.entity.ap;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.*;

@Entity
@Table(name = "t_research_note")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResearchNoteEntity {

    @Id
    private UUID noteId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    private CommitteeCaseEntity committeeCaseEntity;

    @Column(nullable = false)
    private UUID authorId;

    @Column(name = "author_name", length = 200)
    private String authorName;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @Version
    private Long version;

    @OneToMany(mappedBy = "noteEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResearchCommentEntity> comments = new ArrayList<>();

    @OneToMany(mappedBy = "noteEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResearchAttachmentEntity> attachments = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (noteId == null) {
            noteId = UUID.randomUUID();
        }
    }
}
