package mor.itas.api.dto.response.ap;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * PlanResponse - Response DTO for Annual Audit Plan
 * 
 * Separates external API contract from internal domain model.
 * Only exposes fields needed by frontend clients.
 * Follows DTO pattern for API responses.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanResponse {
    
    private UUID id;
    
    @JsonProperty("planYear")
    private Integer year;
    
    @JsonProperty("planName")
    private String name;
    
    private String status;
    private String directorComment;
    private String seniorComment;
    private String amendmentComment;
    private OffsetDateTime createdAt;
    private String createdBy;
    
    // Related data (from nested entities)
    private List<PlanAllocationResponse> allocations;
    private List<PlanTimelineResponse> timeline;
    private List<RegionalFeedbackResponse> regionalFeedback;
    private List<RegionalDeploymentResponse> deployments;
    
    // Metadata
    private int caseCount;
    private String currentPhase;
    private String lastUpdatedBy;
    private OffsetDateTime lastUpdatedAt;
}
