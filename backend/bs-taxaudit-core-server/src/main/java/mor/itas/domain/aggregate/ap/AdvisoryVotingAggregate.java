package mor.itas.domain.aggregate.ap;

import mor.itas.domain.exception.DuplicateVoteException;
import mor.itas.domain.exception.InvalidVotingStateException;
import mor.itas.domain.event.ap.VoteCast;
import mor.itas.domain.valueobject.CommitteeVote;
import mor.itas.domain.valueobject.VoteOption;
import mor.itas.domain.valueobject.VotingTally;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.*;

/**
 * Advisory Voting Aggregate Root
 * Manages voting for a committee case
 * Enforces one-vote-per-member business rule
 */
@Data
@AllArgsConstructor
@Builder
public class AdvisoryVotingAggregate {

    private UUID votingId;
    private UUID committeeCaseId;
    @Builder.Default
    private Map<UUID, CommitteeVote> votes = new HashMap<>();  // memberId -> vote
    private VotingStatus status;
    private Integer consensusThreshold;  // Default: 60
    private OffsetDateTime votingStartedAt;
    private OffsetDateTime votingClosedAt;
    @Builder.Default
    private List<CommitteeAuditLogEntry> voteAuditLog = new ArrayList<>();
    @Builder.Default
    private List<Object> uncommittedEvents = new ArrayList<>();

    public enum VotingStatus {
        OPEN("Voting is open for members"),
        CLOSED("Voting has been closed");

        private final String description;

        VotingStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    /**
     * Cast a vote from a committee member
     * Enforces one-vote-per-member
     */
    public void castVote(UUID memberId, VoteOption option, String reasoning) {
        if (status != VotingStatus.OPEN) {
            throw new InvalidVotingStateException(status.name(), "cast vote");
        }

        if (votes.containsKey(memberId)) {
            throw new DuplicateVoteException(memberId.toString(), committeeCaseId.toString());
        }

        CommitteeVote vote = CommitteeVote.builder()
                .voterId(memberId)
                .option(option)
                .reasoning(reasoning)
                .votedAt(OffsetDateTime.now())
                .build();

        votes.put(memberId, vote);
        raiseEvent(new VoteCast(committeeCaseId, memberId, option, reasoning));
    }

    /**
     * Check if member has already voted
     */
    public boolean hasVoted(UUID memberId) {
        return votes.containsKey(memberId);
    }

    /**
     * Get vote from member
     */
    public Optional<CommitteeVote> getVote(UUID memberId) {
        return Optional.ofNullable(votes.get(memberId));
    }

    /**
     * Close voting phase
     */
    public void closeVoting() {
        if (status != VotingStatus.OPEN) {
            throw new InvalidVotingStateException(status.name(), "close voting");
        }
        this.status = VotingStatus.CLOSED;
        this.votingClosedAt = OffsetDateTime.now();
    }

    /**
     * Reopen voting (for research requests)
     */
    public void reopenVoting() {
        if (status != VotingStatus.CLOSED) {
            throw new InvalidVotingStateException(status.name(), "reopen voting");
        }
        this.status = VotingStatus.OPEN;
        this.votingClosedAt = null;
    }

    /**
     * Calculate voting tally
     */
    public VotingTally getTally() {
        int approveCount = 0;
        int rejectCount = 0;
        int moreInfoCount = 0;

        for (CommitteeVote vote : votes.values()) {
            switch (vote.getOption()) {
                case APPROVE:
                    approveCount++;
                    break;
                case REJECT:
                    rejectCount++;
                    break;
                case MORE_INFO:
                    moreInfoCount++;
                    break;
            }
        }

        int totalVotesCast = votes.size();
        Double consensusPercentage = VotingTally.calculateConsensusPercentage(approveCount, totalVotesCast);
        VotingTally.VotingOutcome outcome = VotingTally.determineOutcome(consensusPercentage, consensusThreshold);

        return VotingTally.builder()
                .approveCount(approveCount)
                .rejectCount(rejectCount)
                .moreInfoCount(moreInfoCount)
                .totalVotesCast(totalVotesCast)
                .consensusPercentage(consensusPercentage)
                .outcome(outcome)
                .calculatedAt(OffsetDateTime.now())
                .build();
    }

    /**
     * Check if consensus has been reached
     */
    public boolean hasConsensus() {
        VotingTally tally = getTally();
        return tally.getOutcome() == VotingTally.VotingOutcome.PASSED;
    }

    /**
     * Determine voting outcome
     */
    public VotingTally.VotingOutcome getOutcome() {
        return getTally().getOutcome();
    }

    /**
     * Get all votes
     */
    public Collection<CommitteeVote> getAllVotes() {
        return Collections.unmodifiableCollection(votes.values());
    }

    /**
     * Raise domain event
     */
    public void raiseEvent(Object event) {
        this.uncommittedEvents.add(event);
    }

    /**
     * Get and clear uncommitted events
     */
    public List<Object> getUncommittedEvents() {
        return new ArrayList<>(this.uncommittedEvents);
    }

    public void clearUncommittedEvents() {
        this.uncommittedEvents.clear();
    }

    @Data
    @AllArgsConstructor
    public static class DomainEvent {
        private UUID aggregateId;
        private OffsetDateTime occurredAt;

        public DomainEvent(UUID aggregateId) {
            this.aggregateId = aggregateId;
            this.occurredAt = OffsetDateTime.now();
        }
    }

    @Data
    @AllArgsConstructor
    public static class CommitteeAuditLogEntry {
        private UUID logId;
        private UUID votingId;
        private UUID actorId;
        private String actionType;
        private Map<String, Object> beforeState;
        private Map<String, Object> afterState;
        private OffsetDateTime actionTimestamp;
    }
}
