package mor.itas.api.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HandoffToTeamLeaderRequest {
    
    @NotNull(message = "teamLeaderId is required")
    private UUID teamLeaderId;
    
    @NotBlank(message = "assignmentReason cannot be blank")
    private String assignmentReason;
}
