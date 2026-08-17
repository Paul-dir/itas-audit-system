package mor.itas.domain.aggregate.ap;

import java.time.OffsetDateTime;
import java.util.UUID;

public class PlanAllocation {
    private UUID id;
    private UUID planId;
    private String taxCenterCode;
    private Integer proposedCount;
    private OffsetDateTime createdAt;

    public PlanAllocation(UUID planId, String taxCenterCode, Integer proposedCount) {
        this.id = UUID.randomUUID();
        this.planId = planId;
        this.taxCenterCode = taxCenterCode;
        this.proposedCount = proposedCount;
        this.createdAt = OffsetDateTime.now();
    }

    public PlanAllocation(UUID id, UUID planId, String taxCenterCode, Integer proposedCount, OffsetDateTime createdAt) {
        this.id = id;
        this.planId = planId;
        this.taxCenterCode = taxCenterCode;
        this.proposedCount = proposedCount;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public UUID getPlanId() { return planId; }
    public String getTaxCenterCode() { return taxCenterCode; }
    public Integer getProposedCount() { return proposedCount; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}
