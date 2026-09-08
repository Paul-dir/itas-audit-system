package mor.itas.api.dto.response.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Response DTO for research note with comments
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResearchNoteResponse {
    
    private UUID noteId;
    private UUID authorId;
    private String authorName;
    private String category;  // OBSERVATION, QUESTION, INVESTIGATION, RECOMMENDATION
    private String content;
    private Integer attachmentCount;
    private List<ResearchCommentResponse> comments;
    private OffsetDateTime createdAt;
    private OffsetDateTime lastModifiedAt;
}
