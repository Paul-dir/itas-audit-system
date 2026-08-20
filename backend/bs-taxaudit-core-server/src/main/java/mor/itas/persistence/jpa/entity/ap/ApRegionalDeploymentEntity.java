package mor.itas.persistence.jpa.entity.ap;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * ApRegionalDeploymentEntity - JPA Entity for ap_regional_deployments table
 * Tracks when regional directors deploy plans to their tax centers
 */
@Entity
@Table(name = "ap_regional_deployments", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"plan_id", "region_id"}, name = "unique_regional_deployment")
}, indexes = {
    @Index(name = "idx_ap_regional_deployments_plan_id", columnList = "plan_id")
})
public class ApRegionalDeploymentEntity {

    @Id
    private UUID id = UUID.randomUUID();

    @Column(nullable = false, name = "plan_id")
    private UUID planId;

    @Column(nullable = false, length = 64, name = "region_id")
    private String regionId;

    @Column(nullable = false, length = 64, name = "deployed_by")
    private String deployedBy;

    @Column(nullable = false, name = "deployed_at")
    private OffsetDateTime deployedAt = OffsetDateTime.now();

    @Column(length = 32, name = "status")
    private String status = "DEPLOYED";

    // Constructors
    public ApRegionalDeploymentEntity() {
    }

    public ApRegionalDeploymentEntity(UUID planId, String regionId, String deployedBy) {
        this.planId = planId;
        this.regionId = regionId;
        this.deployedBy = deployedBy;
        this.deployedAt = OffsetDateTime.now();
        this.status = "DEPLOYED";
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
