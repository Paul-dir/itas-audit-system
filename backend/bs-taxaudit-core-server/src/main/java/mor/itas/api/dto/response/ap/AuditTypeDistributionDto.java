package mor.itas.api.dto.response.ap;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * AuditTypeDistributionDto - Response DTO for Audit Type Distribution
 * 
 * Maps domain AuditTypeDistribution to API response.
 * Represents the count and percentage of cases for a specific audit type.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditTypeDistributionDto {
    
    @JsonProperty("id")
    private String auditTypeId;
    
    @JsonProperty("name")
    private String auditTypeName;
    
    @JsonProperty("count")
    private Long count;
    
    @JsonProperty("pct")
    private BigDecimal percentage;
}
