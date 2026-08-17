package mor.itas.domain.aggregate.ap;

import mor.itas.domain.aggregate.AggregateRoot;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

public class AnnualAuditPlan extends AggregateRoot {
    private UUID id;
    private Integer planYear;
    private String planName;
    private String status;
    private OffsetDateTime createdAt;
    private String createdBy;
    private List<PlanAllocation> allocations;

    public AnnualAuditPlan(Integer planYear, String planName, String createdBy) {
        this.id = UUID.randomUUID();
        this.planYear = planYear;
        this.planName = planName;
        this.status = "DRAFT";
        this.createdAt = OffsetDateTime.now();
        this.createdBy = createdBy;
        this.allocations = new ArrayList<>();
    }

    public AnnualAuditPlan(UUID id, Integer planYear, String planName, String status, OffsetDateTime createdAt, String createdBy, List<PlanAllocation> allocations) {
        this.id = id;
        this.planYear = planYear;
        this.planName = planName;
        this.status = status;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.allocations = new ArrayList<>(allocations);
    }

    public void addAllocation(String taxCenterCode, Integer count) {
        this.allocations.add(new PlanAllocation(this.id, taxCenterCode, count));
    }

    public UUID getId() { return id; }
    public Integer getPlanYear() { return planYear; }
    public String getPlanName() { return planName; }
    public String getStatus() { return status; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public String getCreatedBy() { return createdBy; }
    public List<PlanAllocation> getAllocations() { return Collections.unmodifiableList(allocations); }
}
