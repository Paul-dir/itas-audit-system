package mor.itas.api.dto.response.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Response DTO for research comment with threading support
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResearchCommentResponse {
    
    private UUID commentId;
    private UUID authorId;
    private String authorName;
    private String content;
    private UUID repliedToCommentId;  // Null if not a reply
    private OffsetDateTime createdAt;
}
