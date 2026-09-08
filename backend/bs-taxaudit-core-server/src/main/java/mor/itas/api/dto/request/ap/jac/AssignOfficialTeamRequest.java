package mor.itas.api.dto.request.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.util.List;

/**
 * Request DTO for chairperson to assign official audit team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignOfficialTeamRequest {
    
    @NotEmpty(message = "Auditor list cannot be empty")
    @Size(min = 2, max = 5, message = "Team must have between 2 and 5 members")
    private List<String> auditorIds;
    
    @Min(value = 0, message = "Team lead index must be non-negative")
    @Max(value = 4, message = "Team lead index must be less than 5")
    private Integer teamLeadIndex;
}
