package mor.itas.api.dto.response.ap;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

/**
 * RiskAnalysisResponse - Response DTO for Risk Analysis
 * 
 * Maps domain RiskAnalysis aggregate to API response.
 * This is the main response object returned by GET /api/v1/planning/risk-analysis
 * 
 * Contains:
 * - National-level risk aggregates
 * - Regional-level breakdown
 * - Pre-computed plan defaults for case distribution
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskAnalysisResponse {
    
    @JsonProperty("source")
    private String source;  // "live" or "estimated"
    
    @JsonProperty("lastUpdated")
    private OffsetDateTime lastUpdated;
    
    @JsonProperty("national")
    private NationalRiskDataDto national;
    
    @JsonProperty("byRegion")
    private List<RegionalRiskDataDto> byRegion;
    
    /**
     * planDefaults: Pre-computed case distribution for plan creation
     * Structure: { regionId: { auditTypeId: caseCount } }
     * Example: { "AA": { "desk_audit": 59, "field_audit": 39, ... }, ... }
     */
    @JsonProperty("planDefaults")
    private Map<String, Map<String, Integer>> planDefaults;
}
