package mor.itas.domain.valueobject;

import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Immutable value object representing a vote cast by a committee member
 */
@Data
@AllArgsConstructor
@Builder
public class CommitteeVote {

    private UUID voterId;
    private VoteOption option;
    private String reasoning;
    private OffsetDateTime votedAt;
    private String voterRole;

    /**
     * Vote equality is based on voterId (one vote per member per case)
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CommitteeVote)) return false;
        CommitteeVote that = (CommitteeVote) o;
        return voterId != null && voterId.equals(that.voterId);
    }

    @Override
    public int hashCode() {
        return voterId != null ? voterId.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "CommitteeVote{" +
                "voterId=" + voterId +
                ", option=" + option +
                ", votedAt=" + votedAt +
                '}';
    }
}
