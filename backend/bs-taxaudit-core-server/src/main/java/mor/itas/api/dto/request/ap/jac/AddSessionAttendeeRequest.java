package mor.itas.api.dto.request.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import java.util.UUID;

/**
 * Request DTO for adding attendees to committee session
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddSessionAttendeeRequest {
    
    @NotEmpty(message = "Member list cannot be empty")
    private List<UUID> memberIds;
}
