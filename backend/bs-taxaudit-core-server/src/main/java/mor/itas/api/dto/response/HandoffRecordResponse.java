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
public class HandoffRecordResponse {
    private UUID handoffId;
    private UUID caseId;
    private UUID teamLeaderId;
    private String caseNumber;
    private String status;
    private OffsetDateTime assignmentDate;
    private String assignmentReason;
}
