package mor.itas.api.dto.response.ap;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * RegionalFeedbackResponse - Response DTO for Regional Feedback
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegionalFeedbackResponse {
    
    private UUID id;
    private String regionId;
    private String feedbackText;
    private String submittedBy;
    private OffsetDateTime submittedAt;
    private Boolean isOverridden;
    private String overrideComment;
    private String overrideBy;
    private OffsetDateTime overrideAt;
    private OffsetDateTime createdAt;
}
