package mor.itas.domain.exception;

/**
 * Exception thrown when attempting to acquire a case that is already owned by another member
 * Indicates the case is locked for checkout and cannot be assigned to a new member
 */
public class CaseAlreadyOwnedException extends CommitteeCaseException {

    public CaseAlreadyOwnedException(String message) {
        super(message);
    }

    public CaseAlreadyOwnedException(String message, Throwable cause) {
        super(message, cause);
    }
}
