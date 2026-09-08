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
    private String taxpayerName;
    private String auditType;
    private String riskPriority;
    private Integer riskScore;
    private String segment;
    private String status;
    private String assignedTeamLeaderId;
    private String assignedTeamLeaderName;
    private String assignedAuditorId;
    private String assignedAuditorName;
    private OffsetDateTime handoffAt;
    private String handoffBy;
    private String handoffComment;
    private OffsetDateTime assignedAt;
    private String assignedBy;
    private String createdBy;
    private OffsetDateTime createdAt;
    private OffsetDateTime startedAt;
    private OffsetDateTime completedAt;
    private OffsetDateTime updatedAt;
}
