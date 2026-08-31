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

    // Region status tracking
    @Column(name = "received_at")
    private OffsetDateTime receivedAt;

    @Column(name = "acknowledged_by", length = 64)
    private String acknowledgedBy;

    @Column(name = "acknowledged_at")
    private OffsetDateTime acknowledgedAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @Version
    private Long version = 0L;

    // Constructors
    public RegionalDeploymentEntity() {
    }

    public RegionalDeploymentEntity(UUID planId, String regionCode, String directorId) {
        this.planId = planId;
        this.regionCode = regionCode;
        this.directorId = directorId;
        this.sentAt = OffsetDateTime.now();
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
}
