package mor.itas.api.dto.response.ap;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * AllocationResponseDto - Response DTO
 * 
 * Response after allocating a plan to tax centers or updating an allocation.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AllocationResponseDto {
    
    @JsonProperty("allocationId")
    private String allocationId;
    
    @JsonProperty("planId")
    private String planId;
    
    @JsonProperty("regionId")
    private String regionId;
    
    @JsonProperty("taxCenterId")
    private String taxCenterId;
    
    @JsonProperty("message")
    private String message;
    
    @JsonProperty("success")
    private Boolean success;
}
