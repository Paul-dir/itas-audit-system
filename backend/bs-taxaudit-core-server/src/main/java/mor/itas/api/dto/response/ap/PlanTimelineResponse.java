package mor.itas.api.dto.response.ap;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * PlanTimelineResponse - Response DTO for Plan Timeline Event
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanTimelineResponse {
    
    private UUID id;
    private String status;
    private String actorId;
    private String comment;
    private OffsetDateTime eventTimestamp;
    private OffsetDateTime createdAt;
}
