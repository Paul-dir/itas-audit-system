package mor.itas.domain.exception;

import lombok.Getter;
import java.util.UUID;

/**
 * Exception thrown when auditor is not a member of the team leader's team
 * Bug condition C2: Prevents cross-team auditor assignments
 */
@Getter
public class AuditorNotInTeamException extends RuntimeException {

    private final UUID teamLeaderId;
    private final UUID auditorId;

    public AuditorNotInTeamException(String message, UUID teamLeaderId, UUID auditorId) {
        super(message);
        this.teamLeaderId = teamLeaderId;
        this.auditorId = auditorId;
    }

    public AuditorNotInTeamException(String message, UUID teamLeaderId, UUID auditorId, Throwable cause) {
        super(message, cause);
        this.teamLeaderId = teamLeaderId;
        this.auditorId = auditorId;
    }
}
