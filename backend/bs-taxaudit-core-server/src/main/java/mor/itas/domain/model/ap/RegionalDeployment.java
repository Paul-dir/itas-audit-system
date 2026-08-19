package mor.itas.domain.model.ap;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * RegionalDeployment - Domain Model for regional deployment tracking
 * Tracks when regions deploy approved plans to their tax centers
 */
public class RegionalDeployment {
    private UUID id;
    private UUID planId;
    private String regionId;
    private String deployedBy;
    private OffsetDateTime deployedAt;
    private String status;

    // Constructors
    public RegionalDeployment() {
    }

    public RegionalDeployment(UUID planId, String regionId, String deployedBy) {
        this.id = UUID.randomUUID();
        this.planId = planId;
        this.regionId = regionId;
        this.deployedBy = deployedBy;
        this.deployedAt = OffsetDateTime.now();
        this.status = "DEPLOYED";
    }

    public RegionalDeployment(UUID id, UUID planId, String regionId, String deployedBy, 
                             OffsetDateTime deployedAt, String status) {
        this.id = id;
        this.planId = planId;
        this.regionId = regionId;
        this.deployedBy = deployedBy;
        this.deployedAt = deployedAt;
        this.status = status;
    }

    // Business Methods
    public boolean isDeployed() {
        return "DEPLOYED".equals(status) && deployedAt != null;
    }

    // Getters
    public UUID getId() { return id; }
    public UUID getPlanId() { return planId; }
    public String getRegionId() { return regionId; }
    public String getDeployedBy() { return deployedBy; }
    public OffsetDateTime getDeployedAt() { return deployedAt; }
    public String getStatus() { return status; }

    // Setters
    public void setId(UUID id) { this.id = id; }
    public void setPlanId(UUID planId) { this.planId = planId; }
    public void setRegionId(String regionId) { this.regionId = regionId; }
    public void setDeployedBy(String deployedBy) { this.deployedBy = deployedBy; }
    public void setDeployedAt(OffsetDateTime deployedAt) { this.deployedAt = deployedAt; }
    public void setStatus(String status) { this.status = status; }
}
