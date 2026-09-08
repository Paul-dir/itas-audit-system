package mor.itas.domain.valueobject;

import lombok.*;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Immutable value object for research note
 */
@Data
@AllArgsConstructor
@Builder
public class ResearchNote {

    private UUID noteId;
    private UUID committeeCaseId;
    private UUID authorId;
    private String category;  // OBSERVATION, QUESTION, INVESTIGATION, RECOMMENDATION
    private String content;
    private List<String> attachmentPaths;
    private List<ResearchComment> comments;
    private OffsetDateTime createdAt;
    private OffsetDateTime lastModifiedAt;

    /**
     * Research note equality based on note ID
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ResearchNote)) return false;
        ResearchNote that = (ResearchNote) o;
        return noteId != null && noteId.equals(that.noteId);
    }

    @Override
    public int hashCode() {
        return noteId != null ? noteId.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "ResearchNote{" +
                "noteId=" + noteId +
                ", committeeCaseId=" + committeeCaseId +
                ", category='" + category + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
