package mor.itas.api.dto.response.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Response DTO for handoff record to execution workspace
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HandoffRecordResponse {
    
    private UUID handoffRecordId;
    private UUID committeeCaseId;
    private String caseCode;
    private UUID teamLeadId;
    private String teamLeadName;
    private List<AuditorProfileResponse> teamMembers;
    private String committeeSummary;
    private String keyFindings;
    private String decision;  // APPROVED, REJECTED
    private OffsetDateTime handoffDate;
    private String deliveryStatus;
}
