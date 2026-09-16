package mor.itas.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditorAssignmentResponse {
    private UUID assignmentId;
    private UUID caseId;
    private UUID auditorId;
    private String auditorName;
    private String auditorCode;
    private String caseNumber;
    private String status;
    private OffsetDateTime assignedDate;
}
