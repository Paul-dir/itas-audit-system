package mor.itas.api.dto.response.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Response DTO for session attendee information
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionAttendeeResponse {
    
    private UUID attendeeId;
    private UUID memberId;
    private String memberName;
    private String attendanceStatus;  // CONFIRMED, DECLINED, PENDING
    private OffsetDateTime confirmedAt;
    private OffsetDateTime attendedAt;
}
