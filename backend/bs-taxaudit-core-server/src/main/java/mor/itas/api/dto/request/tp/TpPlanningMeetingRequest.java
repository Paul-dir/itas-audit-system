package mor.itas.api.dto.request.tp;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class TpPlanningMeetingRequest {
    private OffsetDateTime scheduledDate;
    private JsonNode participants;
    private String agenda;
}
