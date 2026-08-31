package mor.itas.api.dto.request.tp;

import lombok.Data;

@Data
public class TpMeetingDecisionRequest {
    private String decision;       // APPROVED, RETURN_FOR_REVISION, REJECT
    private String discussionNotes;
}
