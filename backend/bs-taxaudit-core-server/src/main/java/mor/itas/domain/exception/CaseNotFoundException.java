package mor.itas.domain.exception;

/**
 * Exception thrown when case is not found in the system
 */
public class CaseNotFoundException extends RuntimeException {

    public CaseNotFoundException(String message) {
        super(message);
    }

    public CaseNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
