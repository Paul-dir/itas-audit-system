package mor.itas.domain.exception;

/**
 * Exception thrown when auditor is not found in the system
 */
public class AuditorNotFoundException extends RuntimeException {

    public AuditorNotFoundException(String message) {
        super(message);
    }

    public AuditorNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
