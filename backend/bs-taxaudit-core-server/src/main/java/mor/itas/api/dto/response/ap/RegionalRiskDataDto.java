package mor.itas.api.dto.response.ap;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

/**
 * RegionalRiskDataDto - Response DTO for Regional Risk Data
 * 
 * Maps domain RegionalRiskData to API response.
 * Contains risk statistics for a specific region.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegionalRiskDataDto {
    
    @JsonProperty("id")
    private String id;  // region code
    
    @JsonProperty("name")
    private String name;
    
    @JsonProperty("code")
    private String code;
    
    @JsonProperty("totalTaxpayers")
    private Long totalTaxpayers;
    
    @JsonProperty("totalRisky")
    private Long totalRisky;
    
    @JsonProperty("percentRisky")
    private BigDecimal percentRisky;
    
    @JsonProperty("byAuditType")
    private List<AuditTypeDistributionDto> byAuditType;
}
