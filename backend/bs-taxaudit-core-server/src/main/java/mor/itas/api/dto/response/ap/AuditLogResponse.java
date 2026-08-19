package mor.itas.api.dto.response.ap;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

/**
 * AuditLogResponse - Response DTO for Plan Audit Logs
 * Immutable audit trail entry showing what changed and who did it
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuditLogResponse {

    private UUID id;
    private UUID planId;
    private String action;              // e.g., "PLAN_CREATED", "SUBMITTED_TO_DIRECTOR"
    private String actorId;             // User ID
    private String actorRole;           // "PLANNING_TEAM", "DIRECTOR", etc.
    private String reason;              // Optional reason/comment
    private Map<String, String> changedFields;  // Fields that changed
    private OffsetDateTime createdAt;

    // Constructors
    public AuditLogResponse() {
    }

    public AuditLogResponse(UUID id, UUID planId, String action, String actorId, String actorRole, OffsetDateTime createdAt) {
        this.id = id;
        this.planId = planId;
        this.action = action;
        this.actorId = actorId;
        this.actorRole = actorRole;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getPlanId() {
        return planId;
    }

    public void setPlanId(UUID planId) {
        this.planId = planId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getActorId() {
        return actorId;
    }

    public void setActorId(String actorId) {
        this.actorId = actorId;
    }

    public String getActorRole() {
        return actorRole;
    }

    public void setActorRole(String actorRole) {
        this.actorRole = actorRole;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Map<String, String> getChangedFields() {
        return changedFields;
    }

    public void setChangedFields(Map<String, String> changedFields) {
        this.changedFields = changedFields;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "AuditLogResponse{" +
                "id=" + id +
                ", action='" + action + '\'' +
                ", actorId='" + actorId + '\'' +
                ", actorRole='" + actorRole + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
