package mor.itas.api.dto.response.ap;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * NationalRiskDataDto - Response DTO for National Risk Data
 * 
 * Maps domain NationalRiskData to API response.
 * Contains national-level aggregates of taxpayer and risk statistics.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NationalRiskDataDto {
    
    @JsonProperty("totalTaxpayers")
    private Long totalTaxpayers;
    
    @JsonProperty("totalRisky")
    private Long totalRisky;
    
    @JsonProperty("percentRisky")
    private BigDecimal percentRisky;
    
    @JsonProperty("byRiskLevel")
    private Map<String, RiskLevelDataDto> byRiskLevel;
    
    @JsonProperty("byAuditType")
    private List<AuditTypeDistributionDto> byAuditType;
}
