package mor.itas.domain.aggregate.ap;

import mor.itas.domain.aggregate.AggregateRoot;
import mor.itas.domain.model.ap.PlanAllocation;

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
    private String directorComment;
    private String seniorComment;
    private String amendmentComment;
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
        this.directorComment = null;
        this.seniorComment = null;
        this.amendmentComment = null;
    }

    public AnnualAuditPlan(UUID id, Integer planYear, String planName, String status, OffsetDateTime createdAt, String createdBy, List<PlanAllocation> allocations) {
        this.id = id;
        this.planYear = planYear;
        this.planName = planName;
        this.status = status;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.allocations = new ArrayList<>(allocations);
        this.directorComment = null;
        this.seniorComment = null;
        this.amendmentComment = null;
    }

    public void addAllocation(String taxCenterCode, Integer count) {
        this.allocations.add(new PlanAllocation(this.id, taxCenterCode, count));
    }

    public UUID getId() { return id; }
    public Integer getPlanYear() { return planYear; }
    public String getPlanName() { return planName; }
    public String getStatus() { return status; }
    public String getDirectorComment() { return directorComment; }
    public String getSeniorComment() { return seniorComment; }
    public String getAmendmentComment() { return amendmentComment; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public String getCreatedBy() { return createdBy; }
    public List<PlanAllocation> getAllocations() { return Collections.unmodifiableList(allocations); }

    // Setters for domain operations
    public void setStatus(String status) { this.status = status; }
    public void setDirectorComment(String directorComment) { this.directorComment = directorComment; }
    public void setSeniorComment(String seniorComment) { this.seniorComment = seniorComment; }
    public void setAmendmentComment(String amendmentComment) { this.amendmentComment = amendmentComment; }
}
