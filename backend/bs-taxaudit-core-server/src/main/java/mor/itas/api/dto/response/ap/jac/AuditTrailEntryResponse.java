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
    private String caseId;
    private String entityId;
    private String entityType; // "PLAN", "AUDIT_CASE", "COMMITTEE", "SYSTEM"
    private String category;   // "PLANNING & STRATEGY", "AUDIT EXECUTION", "GOVERNANCE & COMMITTEE"
    private String actorId;
    private String actorName;
    private String actorRole;
    private String actionType;
    private String description;
    private Map<String, Object> beforeState;
    private Map<String, Object> afterState;
    private String actionReason;
    private OffsetDateTime actionTimestamp;
    private String actionHash;

    public static class AuditTrailEntryResponseBuilder {
        public AuditTrailEntryResponseBuilder actorId(UUID uuid) {
            this.actorId = uuid != null ? uuid.toString() : null;
            return this;
        }

        public AuditTrailEntryResponseBuilder actorId(String str) {
            this.actorId = str;
            return this;
        }

        public AuditTrailEntryResponseBuilder caseId(UUID uuid) {
            this.caseId = uuid != null ? uuid.toString() : null;
            return this;
        }

        public AuditTrailEntryResponseBuilder caseId(String str) {
            this.caseId = str;
            return this;
        }
    }
}
