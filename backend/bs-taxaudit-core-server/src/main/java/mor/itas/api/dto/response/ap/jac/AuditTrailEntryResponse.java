package mor.itas.api.dto.response.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

/**
 * Response DTO for single audit trail entry
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditTrailEntryResponse {
    
    private UUID logId;
    private UUID actorId;
    private String actorName;
    private String actionType;
    private Map<String, Object> beforeState;
    private Map<String, Object> afterState;
    private String actionReason;
    private OffsetDateTime actionTimestamp;
    private String actionHash;
}
