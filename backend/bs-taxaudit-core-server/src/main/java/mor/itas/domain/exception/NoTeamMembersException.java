package mor.itas.domain.exception;

/**
 * Exception thrown when team leader has no active team members
 * Bug condition C3: Prevents NPE and invalid assignments with empty teams
 */
public class NoTeamMembersException extends RuntimeException {

    public NoTeamMembersException(String message) {
        super(message);
    }

    public NoTeamMembersException(String message, Throwable cause) {
        super(message, cause);
    }
}
