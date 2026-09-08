package mor.itas.api.dto.request.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for casting an advisory vote on a committee case
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CastVoteRequest {
    
    @NotNull(message = "Vote option is required")
    private String voteOption;  // APPROVE, REJECT, MORE_INFO
    
    @Size(min = 0, max = 1000, message = "Reasoning must be between 0 and 1000 characters")
    private String reasoning;
}
