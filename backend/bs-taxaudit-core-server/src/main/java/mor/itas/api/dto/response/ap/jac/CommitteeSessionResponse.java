package mor.itas.api.dto.response.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Response DTO for committee session details
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommitteeSessionResponse {
    
    private UUID sessionId;
    private String sessionName;
    private String agenda;
    private LocalDateTime scheduledDate;
    private String location;
    private String status;  // SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
    private List<SessionAttendeeResponse> attendees;
    private OffsetDateTime actualStartTime;
    private OffsetDateTime actualEndTime;
}
