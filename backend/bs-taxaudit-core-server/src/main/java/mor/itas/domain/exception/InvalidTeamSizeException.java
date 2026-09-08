package mor.itas.domain.exception;

/**
 * Exception thrown when team size is outside valid range (2-5 members)
 */
public class InvalidTeamSizeException extends CommitteeCaseException {

    private final int attemptedSize;
    private final int minimumSize;
    private final int maximumSize;

    public InvalidTeamSizeException(int attemptedSize, int minimumSize, int maximumSize) {
        super(String.format("Team size %d is invalid. Must be between %d and %d members", 
                attemptedSize, minimumSize, maximumSize));
        this.attemptedSize = attemptedSize;
        this.minimumSize = minimumSize;
        this.maximumSize = maximumSize;
    }

    public int getAttemptedSize() {
        return attemptedSize;
    }

    public int getMinimumSize() {
        return minimumSize;
    }

    public int getMaximumSize() {
        return maximumSize;
    }
}
