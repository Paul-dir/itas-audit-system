package mor.itas.api.dto.response.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

/**
 * Response DTO for team assignment information
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamAssignmentResponse {
    
    private UUID teamAssignmentId;
    private UUID appointedTeamLeadId;
    private String teamLeadName;
    private List<AuditorNominationResponse> nominations;
    private List<AuditorProfileResponse> officialTeam;
    private Integer teamSize;
}
