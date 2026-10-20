package mor.itas.persistence.jpa.entity.ap;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * RegionalPlanAccessEntity - Controls which regions can access which plans
 * 
 * Materialized view of regional access permissions.
 * Used for permission checks and filtering when regions fetch plans.
 * Regions can only see plans they have an active access record for.
 */
@Entity
@Table(name = "ap_regional_plan_access")
public class RegionalPlanAccessEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "plan_id", nullable = false)
    private UUID planId;

    @Column(name = "region_code", nullable = false, length = 10)
    private String regionCode;

    @Column(name = "access_granted_at", nullable = false)
    private OffsetDateTime accessGrantedAt = OffsetDateTime.now();

    @Column(name = "access_expires_at")
    private OffsetDateTime accessExpiresAt;

    @Column(name = "reason", length = 100)
    private String reason;  // 'DIRECTOR_SENT', 'SENIOR_APPROVED', etc.

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    // Constructors
    public RegionalPlanAccessEntity() {
    }

    public RegionalPlanAccessEntity(UUID planId, String regionCode) {
        this.planId = planId;
        this.regionCode = regionCode;
        this.accessGrantedAt = OffsetDateTime.now();
    }

    public RegionalPlanAccessEntity(UUID planId, String regionCode, String reason) {
        this.planId = planId;
        this.regionCode = regionCode;
        this.reason = reason;
        this.accessGrantedAt = OffsetDateTime.now();
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

    public String getRegionCode() {
        return regionCode;
    }

    public void setRegionCode(String regionCode) {
        this.regionCode = regionCode;
    }

    public OffsetDateTime getAccessGrantedAt() {
        return accessGrantedAt;
    }

    public void setAccessGrantedAt(OffsetDateTime accessGrantedAt) {
        this.accessGrantedAt = accessGrantedAt;
    }

    public OffsetDateTime getAccessExpiresAt() {
        return accessExpiresAt;
    }

    public void setAccessExpiresAt(OffsetDateTime accessExpiresAt) {
        this.accessExpiresAt = accessExpiresAt;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Helper method to check if access is active
    public boolean isActive() {
        return accessExpiresAt == null || accessExpiresAt.isAfter(OffsetDateTime.now());
    }
}
