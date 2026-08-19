package mor.itas.persistence.jpa.entity.ap;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * PlanAuditLogEntity - JPA Entity for ap_plan_audit_logs table
 * Immutable audit trail - tracks all changes and state transitions
 */
@Entity
@Table(name = "ap_plan_audit_logs")
public class PlanAuditLogEntity {

    @Id
    private UUID id = UUID.randomUUID();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private AnnualAuditPlanEntity annualPlan;

    @Column(nullable = false, length = 64, name = "action")
    private String action;

    @Column(nullable = false, length = 64, name = "actor_id")
    private String actorId;

    @Column(nullable = false, length = 64, name = "actor_role")
    private String actorRole;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "changed_fields", columnDefinition = "jsonb")
    private Map<String, String> changedFields = new HashMap<>();

    @Column(nullable = false, name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    // Constructors
    public PlanAuditLogEntity() {
    }

    public PlanAuditLogEntity(UUID id, AnnualAuditPlanEntity annualPlan, String action, 
                             String actorId, String actorRole) {
        this.id = id;
        this.annualPlan = annualPlan;
        this.action = action;
        this.actorId = actorId;
        this.actorRole = actorRole;
        this.createdAt = OffsetDateTime.now();
        this.changedFields = new HashMap<>();
    }

    public PlanAuditLogEntity(UUID id, AnnualAuditPlanEntity annualPlan, String action, 
                             String actorId, String actorRole, String reason) {
        this(id, annualPlan, action, actorId, actorRole);
        this.reason = reason;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public AnnualAuditPlanEntity getAnnualPlan() {
        return annualPlan;
    }

    public void setAnnualPlan(AnnualAuditPlanEntity annualPlan) {
        this.annualPlan = annualPlan;
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
        return "PlanAuditLogEntity{" +
                "id=" + id +
                ", action='" + action + '\'' +
                ", actorId='" + actorId + '\'' +
                ", actorRole='" + actorRole + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
