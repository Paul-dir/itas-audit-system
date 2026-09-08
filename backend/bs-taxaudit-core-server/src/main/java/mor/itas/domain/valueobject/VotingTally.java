package mor.itas.domain.valueobject;

import lombok.*;
import java.time.OffsetDateTime;

/**
 * Immutable value object for voting tally and outcome
 */
@Data
@AllArgsConstructor
@Builder
public class VotingTally {

    private Integer approveCount;
    private Integer rejectCount;
    private Integer moreInfoCount;
    private Integer totalVotesCast;
    private Double consensusPercentage;
    private VotingOutcome outcome;
    private OffsetDateTime calculatedAt;

    /**
     * Voting outcome enumeration
     */
    public enum VotingOutcome {
        PASSED("Case passed consensus threshold"),
        FAILED("Case failed consensus threshold"),
        INCONCLUSIVE("Insufficient votes for determination");

        private final String description;

        VotingOutcome(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    /**
     * Calculate consensus percentage from vote counts
     */
    public static Double calculateConsensusPercentage(Integer approveCount, Integer totalVotes) {
        if (totalVotes == null || totalVotes == 0) {
            return 0.0;
        }
        return (double) (approveCount != null ? approveCount : 0) / totalVotes * 100;
    }

    /**
     * Determine voting outcome based on consensus threshold
     */
    public static VotingOutcome determineOutcome(Double consensusPercentage, Integer threshold) {
        if (consensusPercentage == null || threshold == null) {
            return VotingOutcome.INCONCLUSIVE;
        }
        if (consensusPercentage >= threshold) {
            return VotingOutcome.PASSED;
        } else {
            return VotingOutcome.FAILED;
        }
    }

    @Override
    public String toString() {
        return "VotingTally{" +
                "approveCount=" + approveCount +
                ", rejectCount=" + rejectCount +
                ", moreInfoCount=" + moreInfoCount +
                ", totalVotesCast=" + totalVotesCast +
                ", consensusPercentage=" + consensusPercentage +
                ", outcome=" + outcome +
                '}';
    }
}
