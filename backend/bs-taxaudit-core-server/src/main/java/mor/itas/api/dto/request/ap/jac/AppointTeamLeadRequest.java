package mor.itas.api.dto.request.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for chairperson to appoint team leader
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointTeamLeadRequest {
    
    @NotNull(message = "Auditor ID is required")
    private String auditorId;
    
    @NotBlank(message = "Reason is required")
    private String reason;
}
