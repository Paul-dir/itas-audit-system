package mor.itas.api.dto.request.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for transferring approved case to execution workspace
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransferToExecutionRequest {
    
    @NotBlank(message = "Summary is required")
    private String summary;
    
    @NotBlank(message = "Key findings are required")
    private String keyFindings;
}
