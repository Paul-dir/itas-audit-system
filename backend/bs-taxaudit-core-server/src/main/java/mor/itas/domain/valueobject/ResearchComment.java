package mor.itas.domain.valueobject;

import lombok.*;
import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Immutable value object for research comment (supports threading)
 */
@Data
@AllArgsConstructor
@Builder
public class ResearchComment {

    private UUID commentId;
    private UUID noteId;
    private UUID authorId;
    private String content;
    private Optional<UUID> repliedToCommentId;  // For threading
    private OffsetDateTime createdAt;

    /**
     * Research comment equality based on comment ID
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ResearchComment)) return false;
        ResearchComment that = (ResearchComment) o;
        return commentId != null && commentId.equals(that.commentId);
    }

    @Override
    public int hashCode() {
        return commentId != null ? commentId.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "ResearchComment{" +
                "commentId=" + commentId +
                ", noteId=" + noteId +
                ", authorId=" + authorId +
                ", createdAt=" + createdAt +
                '}';
    }
}
