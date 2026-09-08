package mor.itas.api.dto.response.ap;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;
import java.util.Map;

/**
 * PendingPlanDto - Response DTO
 * 
 * Used to list plans awaiting director review.
 * Contains summary information for the director dashboard list view.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PendingPlanDto {
    
    @JsonProperty("id")
    private String id;
    
    @JsonProperty("name")
    private String name;
    
    @JsonProperty("year")
    private Integer year;
    
    @JsonProperty("status")
    private String status;
    
    /**
     * Total number of cases in the plan
     */
    @JsonProperty("totalCases")
    private Long totalCases;
    
    @JsonProperty("createdAt")
    private OffsetDateTime createdAt;
    
    @JsonProperty("createdBy")
    private String createdBy;
    
    /**
     * Plan distribution by region and audit type
     * Structure: { regionId: { auditTypeId: caseCount } }
     */
    @JsonProperty("distribution")
    private Map<String, Map<String, Integer>> distribution;
    
    /**
     * Summary of the plan for quick review
     */
    @JsonProperty("description")
    private String description;
}
