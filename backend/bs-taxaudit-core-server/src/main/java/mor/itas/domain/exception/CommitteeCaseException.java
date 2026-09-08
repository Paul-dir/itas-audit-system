package mor.itas.domain.exception;

/**
 * Base exception for all committee case domain exceptions
 */
public class CommitteeCaseException extends RuntimeException {

    public CommitteeCaseException(String message) {
        super(message);
    }

    public CommitteeCaseException(String message, Throwable cause) {
        super(message, cause);
    }
}
