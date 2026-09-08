package mor.itas.api.dto.response.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Response DTO for individual vote in voting history
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoteHistoryResponse {
    
    private UUID voteId;
    private UUID memberId;
    private String memberName;
    private String voteOption;  // APPROVE, REJECT, MORE_INFO
    private String reasoning;
    private OffsetDateTime votedAt;
}
