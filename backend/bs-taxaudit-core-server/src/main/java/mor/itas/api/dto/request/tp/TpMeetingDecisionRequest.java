package mor.itas.api.dto.request.tp;

import lombok.Data;

@Data
public class TpMeetingDecisionRequest {
    private String decision; // CONTINUE, DISCONTINUE, RETURN_FOR_DATA
    private String discussionNotes;
    private String meetingMinutes;
    private String attendees;
    private String mandateDirectives;
    private String targetFiscalYears;
    private Integer statutoryDeadlineDays;
    private String assignedTeamLeaderId;
}

