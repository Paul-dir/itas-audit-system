package mor.itas.api.dto.request.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for nominating auditor for joint audit team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NominateAuditorRequest {
    
    @NotNull(message = "Auditor ID is required")
    private String auditorId;
    
    @NotBlank(message = "Justification is required")
    @Size(max = 1000, message = "Justification must not exceed 1000 characters")
    private String justification;

    /**
     * Role of the nomination: 'AUDITOR' or 'TEAM_LEADER'
     * Defaults to 'AUDITOR' for backward compatibility.
     */
    private String role;
}
