package mor.itas.domain.exception;

/**
 * Exception thrown when voting operation is invalid for current voting state
 */
public class InvalidVotingStateException extends CommitteeCaseException {

    private final String currentVotingState;
    private final String operation;

    public InvalidVotingStateException(String currentVotingState, String operation) {
        super(String.format("Cannot %s while voting is in '%s' state", operation, currentVotingState));
        this.currentVotingState = currentVotingState;
        this.operation = operation;
    }

    public String getCurrentVotingState() {
        return currentVotingState;
    }

    public String getOperation() {
        return operation;
    }
}
