package mor.itas.api.dto.request.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

/**
 * Request DTO for chairperson to create committee session
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCommitteeSessionRequest {
    
    @NotBlank(message = "Session name is required")
    private String sessionName;
    
    @NotBlank(message = "Agenda is required")
    private String agenda;
    
    private LocalDateTime scheduledDate;
    
    private String location;
}
