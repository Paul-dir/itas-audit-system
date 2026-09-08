package mor.itas.domain.event.ap;

import mor.itas.domain.valueobject.VoteOption;
import lombok.*;
import java.util.UUID;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class VoteCast extends DomainEvent {
    private UUID memberId;
    private VoteOption voteOption;
    private String reasoning;

    public VoteCast(UUID aggregateId, UUID memberId, VoteOption voteOption, String reasoning) {
        super(aggregateId);
        this.memberId = memberId;
        this.voteOption = voteOption;
        this.reasoning = reasoning;
    }
}
