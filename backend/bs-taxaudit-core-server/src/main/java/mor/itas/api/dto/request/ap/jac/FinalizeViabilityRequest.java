package mor.itas.api.dto.request.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for chairperson to finalize case viability
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinalizeViabilityRequest {
    
    @NotNull(message = "Decision is required")
    private String decision;  // APPROVED, REJECTED
    
    @NotBlank(message = "Reason is required")
    private String reason;
    
    @Size(min = 10, message = "Digital signature must be at least 10 characters")
    private String digitalSignature;
}
