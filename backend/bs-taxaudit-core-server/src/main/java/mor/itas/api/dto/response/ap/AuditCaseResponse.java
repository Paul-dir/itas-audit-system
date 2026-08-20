package mor.itas.api.dto.response.ap;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * AuditCaseResponse - Response DTO for Audit Case
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditCaseResponse {
    
    private UUID id;
    private UUID planId;
    private UUID allocationId;
    private String caseNumber;
    private String taxpayerId;
    private String auditType;
    private Integer riskScore;
    private String status;
    private String assignedTeamLeaderId;
    private String assignedTeamLeaderName;
    private String assignedAuditorId;
    private String assignedAuditorName;
    private String createdBy;
    private OffsetDateTime createdAt;
    private OffsetDateTime startedAt;
    private OffsetDateTime completedAt;
    private OffsetDateTime updatedAt;
}
