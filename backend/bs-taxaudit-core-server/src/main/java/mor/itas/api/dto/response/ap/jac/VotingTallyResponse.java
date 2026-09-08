package mor.itas.api.dto.response.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Response DTO for voting tally and consensus information
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VotingTallyResponse {
    
    private UUID votingId;
    private Integer approveCount;
    private Integer rejectCount;
    private Integer moreInfoCount;
    private Integer totalVotesCast;
    private Double consensusPercentage;
    private String outcome;  // PASSED, FAILED, INCONCLUSIVE
    private OffsetDateTime votingStartedAt;
}
