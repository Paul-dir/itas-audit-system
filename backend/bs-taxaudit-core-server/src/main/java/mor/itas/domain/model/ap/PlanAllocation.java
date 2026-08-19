package mor.itas.domain.model.ap;

import java.time.OffsetDateTime;
import java.util.UUID;

public class PlanAllocation {
    private UUID id;
    private UUID planId;
    private String taxCenterCode;
    private Integer proposedCount;
    
    // Sprint 2: Local Feedback Fields
    private Integer tcAdjustedCount;
    private String tcJustification;
    private Boolean tcFeedbackSubmitted;
    
    private OffsetDateTime createdAt;

    public PlanAllocation(UUID planId, String taxCenterCode, Integer proposedCount) {
        this.id = UUID.randomUUID();
        this.planId = planId;
        this.taxCenterCode = taxCenterCode;
        this.proposedCount = proposedCount;
        this.tcFeedbackSubmitted = false;
        this.createdAt = OffsetDateTime.now();
    }

    public PlanAllocation(UUID id, UUID planId, String taxCenterCode, Integer proposedCount,
                          Integer tcAdjustedCount, String tcJustification, Boolean tcFeedbackSubmitted,
                          OffsetDateTime createdAt) {
        this.id = id;
        this.planId = planId;
        this.taxCenterCode = taxCenterCode;
        this.proposedCount = proposedCount;
        this.tcAdjustedCount = tcAdjustedCount;
        this.tcJustification = tcJustification;
        this.tcFeedbackSubmitted = tcFeedbackSubmitted != null ? tcFeedbackSubmitted : false;
        this.createdAt = createdAt;
    }

    public void submitLocalFeedback(Integer count, String justification) {
        if (count != null && !count.equals(this.proposedCount)) {
            if (justification == null || justification.trim().isEmpty()) {
                throw new IllegalArgumentException("Justification is required when proposing a different count.");
            }
        }
        
        this.tcAdjustedCount = count;
        this.tcJustification = justification;
        this.tcFeedbackSubmitted = true;
    }

    public UUID getId() { return id; }
    public UUID getPlanId() { return planId; }
    public String getTaxCenterCode() { return taxCenterCode; }
    public Integer getProposedCount() { return proposedCount; }
    
    public Integer getTcAdjustedCount() { return tcAdjustedCount; }
    public String getTcJustification() { return tcJustification; }
    public Boolean getTcFeedbackSubmitted() { return tcFeedbackSubmitted; }
    
    public OffsetDateTime getCreatedAt() { return createdAt; }
}
