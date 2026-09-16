package mor.itas.domain.exception;

import lombok.Getter;

/**
 * Exception thrown when case is in an invalid state for the requested operation
 */
@Getter
public class InvalidCaseStateException extends RuntimeException {

    private final String currentStatus;

    public InvalidCaseStateException(String message, String currentStatus) {
        super(message);
        this.currentStatus = currentStatus;
    }

    public InvalidCaseStateException(String message, String currentStatus, Throwable cause) {
        super(message, cause);
        this.currentStatus = currentStatus;
    }
}
