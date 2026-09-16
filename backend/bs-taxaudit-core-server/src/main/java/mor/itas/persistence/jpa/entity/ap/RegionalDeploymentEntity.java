package mor.itas.persistence.jpa.entity.ap;

import jakarta.persistence.*;
import org.hibernate.type.SqlTypes;
import org.hibernate.annotations.JdbcTypeCode;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

/**
 * RegionalDeploymentEntity - Tracks sending plans to regions
 * 
 * When director sends an approved plan to a region, a record is created here.
 * This controls regional access - regions can only see plans they have a deployment record for.
 */
@Entity
@Table(name = "ap_regional_deployments")
public class RegionalDeploymentEntity {

    @Id
    private UUID id = UUID.randomUUID();

    @Column(name = "plan_id", nullable = false)
    private UUID planId;

    @Column(name = "region_code", nullable = false, length = 10)
    private String regionCode;

    @Column(name = "director_id", nullable = false, length = 64)
    private String directorId;

    @Column(name = "sent_at", nullable = false)
    private OffsetDateTime sentAt = OffsetDateTime.now();

    @Column(name = "deployment_note", columnDefinition = "TEXT")
    private String deploymentNote;

    // Region receives plan data in this structure
    @Column(name = "region_allocated_cases")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Integer> regionAllocatedCases;  // { audit_type: count }

    // Revenue tracking at regional level
    @Column(name = "estimated_revenue")
    private Long estimatedRevenue;

    @Column(name = "revenue_by_audit_type")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Long> revenueByAuditType;  // { DESK_AUDIT: 50000, ... }

    // Region status tracking
    @Column(name = "received_at")
    private OffsetDateTime receivedAt;

    @Column(name = "acknowledged_by", length = 64)
    private String acknowledgedBy;

    @Column(name = "acknowledged_at")
    private OffsetDateTime acknowledgedAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @Column(name = "region_id", length = 64)
    private String regionId;

    @Column(name = "deployed_by", length = 64)
    private String deployedBy;

    @Column(name = "deployed_at")
    private OffsetDateTime deployedAt = OffsetDateTime.now();

    @Column(name = "status", length = 32)
    private String status = "SENT_TO_REGIONS";

    @Version
    private Long version = 0L;

    // Constructors
    public RegionalDeploymentEntity() {
    }

    public RegionalDeploymentEntity(UUID planId, String regionCode, String directorId) {
        this.planId = planId;
        this.regionCode = regionCode;
        this.regionId = regionCode;
        this.directorId = directorId;
        this.deployedBy = directorId;
        this.sentAt = OffsetDateTime.now();
        this.deployedAt = this.sentAt;
        this.status = "SENT_TO_REGIONS";
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

    public String getDirectorId() {
        return directorId;
    }

    public void setDirectorId(String directorId) {
        this.directorId = directorId;
    }

    public OffsetDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(OffsetDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public String getDeploymentNote() {
        return deploymentNote;
    }

    public void setDeploymentNote(String deploymentNote) {
        this.deploymentNote = deploymentNote;
    }

    public Map<String, Integer> getRegionAllocatedCases() {
        return regionAllocatedCases;
    }

    public void setRegionAllocatedCases(Map<String, Integer> regionAllocatedCases) {
        this.regionAllocatedCases = regionAllocatedCases;
    }

    public Long getEstimatedRevenue() {
        return estimatedRevenue;
    }

    public void setEstimatedRevenue(Long estimatedRevenue) {
        this.estimatedRevenue = estimatedRevenue;
    }

    public Map<String, Long> getRevenueByAuditType() {
        return revenueByAuditType;
    }

    public void setRevenueByAuditType(Map<String, Long> revenueByAuditType) {
        this.revenueByAuditType = revenueByAuditType;
    }

    public OffsetDateTime getReceivedAt() {
        return receivedAt;
    }

    public void setReceivedAt(OffsetDateTime receivedAt) {
        this.receivedAt = receivedAt;
    }

    public String getAcknowledgedBy() {
        return acknowledgedBy;
    }

    public void setAcknowledgedBy(String acknowledgedBy) {
        this.acknowledgedBy = acknowledgedBy;
    }

    public OffsetDateTime getAcknowledgedAt() {
        return acknowledgedAt;
    }

    public void setAcknowledgedAt(OffsetDateTime acknowledgedAt) {
        this.acknowledgedAt = acknowledgedAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public String getRegionId() {
        return regionId;
    }

    public void setRegionId(String regionId) {
        this.regionId = regionId;
    }

    public String getDeployedBy() {
        return deployedBy;
    }

    public void setDeployedBy(String deployedBy) {
        this.deployedBy = deployedBy;
    }

    public OffsetDateTime getDeployedAt() {
        return deployedAt;
    }

    public void setDeployedAt(OffsetDateTime deployedAt) {
        this.deployedAt = deployedAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
