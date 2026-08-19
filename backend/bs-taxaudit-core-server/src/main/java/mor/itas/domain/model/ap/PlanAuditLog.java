package mor.itas.domain.model.ap;

import java.time.OffsetDateTime;
import java.util.*;

/**
 * PlanAuditLog - Tracks all changes and state transitions for an Annual Audit Plan
 * Provides complete audit trail for compliance and debugging
 */
public class PlanAuditLog {
    
    private UUID id;
    private UUID planId;
    private String action;           // e.g., "SUBMITTED_TO_DIRECTOR", "APPROVED_BY_DIRECTOR"
    private String actorId;          // User who performed the action
    private String actorRole;        // User's role (PLANNING_TEAM, DIRECTOR, REGIONAL_DIRECTOR, etc.)
    private String reason;           // Optional reason/comment for the action
    private Map<String, String> changedFields;  // Fields that changed, old value → new value
    private OffsetDateTime createdAt;
    
    // Constructors
    public PlanAuditLog() {
        this.changedFields = new HashMap<>();
    }
    
    public PlanAuditLog(UUID planId, String action, String actorId, String actorRole) {
        this.id = UUID.randomUUID();
        this.planId = planId;
        this.action = action;
        this.actorId = actorId;
        this.actorRole = actorRole;
        this.createdAt = OffsetDateTime.now();
        this.changedFields = new HashMap<>();
    }
    
    public PlanAuditLog(UUID planId, String action, String actorId, String actorRole, String reason) {
        this(planId, action, actorId, actorRole);
        this.reason = reason;
    }
    
    // Static factory methods for common actions
    
    public static PlanAuditLog createPlan(UUID planId, String actorId) {
        return new PlanAuditLog(planId, "PLAN_CREATED", actorId, "PLANNING_TEAM", "Plan created by Planning Team");
    }
    
    public static PlanAuditLog submitToDirector(UUID planId, String actorId) {
        return new PlanAuditLog(planId, "SUBMITTED_TO_DIRECTOR", actorId, "PLANNING_TEAM", 
                               "Submitted to Director for approval");
    }
    
    public static PlanAuditLog approvedByDirector(UUID planId, String actorId, String reason) {
        return new PlanAuditLog(planId, "APPROVED_BY_DIRECTOR", actorId, "DIRECTOR", reason);
    }
    
    public static PlanAuditLog adjustedByDirector(UUID planId, String actorId, Integer oldCount, Integer newCount) {
        PlanAuditLog log = new PlanAuditLog(planId, "ALLOCATION_ADJUSTED_BY_DIRECTOR", actorId, "DIRECTOR");
        log.changedFields.put("count", oldCount + " → " + newCount);
        return log;
    }
    
    public static PlanAuditLog submittedToRegional(UUID planId, String actorId) {
        return new PlanAuditLog(planId, "SUBMITTED_TO_REGIONAL", actorId, "DIRECTOR", 
                               "Submitted to Regional Directors for approval");
    }
    
    public static PlanAuditLog approvedByRegional(UUID planId, String actorId, String reason) {
        return new PlanAuditLog(planId, "APPROVED_BY_REGIONAL", actorId, "REGIONAL_DIRECTOR", reason);
    }
    
    public static PlanAuditLog adjustedByRegional(UUID planId, String actorId, Integer oldCount, Integer newCount) {
        PlanAuditLog log = new PlanAuditLog(planId, "ALLOCATION_ADJUSTED_BY_REGIONAL", actorId, "REGIONAL_DIRECTOR");
        log.changedFields.put("count", oldCount + " → " + newCount);
        return log;
    }
    
    public static PlanAuditLog sentToTaxCenters(UUID planId, String actorId) {
        return new PlanAuditLog(planId, "SENT_TO_TAX_CENTERS", actorId, "DIRECTOR", 
                               "Plan sent to Tax Centers for feedback");
    }
    
    public static PlanAuditLog feedbackSubmittedByTaxCenter(UUID planId, String actorId, Integer oldCount, Integer newCount) {
        PlanAuditLog log = new PlanAuditLog(planId, "TAX_CENTER_FEEDBACK_SUBMITTED", actorId, "TAX_CENTER_MANAGER");
        log.changedFields.put("count", oldCount + " → " + newCount);
        return log;
    }
    
    public static PlanAuditLog planFinalized(UUID planId, String actorId) {
        return new PlanAuditLog(planId, "PLAN_FINALIZED", actorId, "DIRECTOR", 
                               "Plan finalized and ready for case cascade");
    }
    
    // Methods
    
    public void addChangedField(String fieldName, String oldValue, String newValue) {
        this.changedFields.put(fieldName, oldValue + " → " + newValue);
    }
    
    public void addChangedField(String fieldName, String change) {
        this.changedFields.put(fieldName, change);
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
        return "PlanAuditLog{" +
                "id=" + id +
                ", planId=" + planId +
                ", action='" + action + '\'' +
                ", actorId='" + actorId + '\'' +
                ", actorRole='" + actorRole + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
