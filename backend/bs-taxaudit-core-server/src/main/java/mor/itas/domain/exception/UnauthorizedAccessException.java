package mor.itas.domain.exception;

/**
 * Exception thrown when a user lacks required role or permission for a committee operation
 * Indicates the user does not have authority to perform the requested action
 */
public class UnauthorizedAccessException extends CommitteeCaseException {

    public UnauthorizedAccessException(String message) {
        super(message);
    }

    public UnauthorizedAccessException(String message, Throwable cause) {
        super(message, cause);
    }
}
