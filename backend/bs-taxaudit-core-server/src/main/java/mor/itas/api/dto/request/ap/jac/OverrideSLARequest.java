package mor.itas.api.dto.request.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for chairperson to override SLA deadline
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OverrideSLARequest {
    
    @Min(value = 1, message = "Extension must be at least 1 business day")
    @Max(value = 30, message = "Extension cannot exceed 30 business days")
    private Integer extensionBusinessDays;
    
    @NotBlank(message = "Reason for SLA override is required")
    private String reason;
}
