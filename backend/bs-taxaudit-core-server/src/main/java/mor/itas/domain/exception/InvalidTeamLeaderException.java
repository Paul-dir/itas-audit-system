package mor.itas.domain.exception;

/**
 * Exception thrown when team leader is not found or lacks required role
 */
public class InvalidTeamLeaderException extends RuntimeException {

    public InvalidTeamLeaderException(String message) {
        super(message);
    }

    public InvalidTeamLeaderException(String message, Throwable cause) {
        super(message, cause);
    }
}
