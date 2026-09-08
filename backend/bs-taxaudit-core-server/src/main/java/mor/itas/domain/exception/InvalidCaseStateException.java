package mor.itas.domain.exception;

/**
 * Exception thrown when case is not in valid state for requested operation
 */
public class InvalidCaseStateException extends CommitteeCaseException {

    private final String currentState;
    private final String requiredState;
    private final String operation;

    public InvalidCaseStateException(String currentState, String requiredState, String operation) {
        super(String.format("Cannot %s case in state '%s'. Required state: '%s'", 
                operation, currentState, requiredState));
        this.currentState = currentState;
        this.requiredState = requiredState;
        this.operation = operation;
    }

    public String getCurrentState() {
        return currentState;
    }

    public String getRequiredState() {
        return requiredState;
    }

    public String getOperation() {
        return operation;
    }
}
