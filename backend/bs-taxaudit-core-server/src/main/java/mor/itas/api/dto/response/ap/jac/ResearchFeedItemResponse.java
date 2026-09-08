package mor.itas.api.dto.response.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Response DTO for research feed item
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResearchFeedItemResponse {
    private UUID id;
    private String type;
    private String content;
    private String authorName;
    private OffsetDateTime createdAt;
}
