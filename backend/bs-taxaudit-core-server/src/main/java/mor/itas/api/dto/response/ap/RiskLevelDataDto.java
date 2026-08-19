package mor.itas.api.dto.response.ap;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * RiskLevelDataDto - Response DTO for Risk Level Distribution
 * 
 * Maps domain RiskLevel data to API response.
 * Represents the count and percentage of taxpayers at a specific risk level.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskLevelDataDto {
    
    @JsonProperty("level")
    private String level;  // critical, high, medium, low
    
    @JsonProperty("count")
    private Long count;
    
    @JsonProperty("pct")
    private BigDecimal percentage;
}
