package mor.itas.domain.model.ap;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * RegionalFeedback - Domain Model for regional feedback on plans
 * Stores feedback from regional directors with optional director overrides
 */
public class RegionalFeedback {
    private UUID id;
    private UUID planId;
    private String regionId;
    private String feedbackText;
    private String submittedBy;
    private OffsetDateTime submittedAt;
    private Boolean isOverridden;
    private String overrideComment;
    private String overrideBy;
    private OffsetDateTime overrideAt;
    private OffsetDateTime createdAt;

    // Constructors
    public RegionalFeedback() {
    }

    public RegionalFeedback(UUID planId, String regionId) {
        this.id = UUID.randomUUID();
        this.planId = planId;
        this.regionId = regionId;
        this.isOverridden = false;
        this.createdAt = OffsetDateTime.now();
    }

    public RegionalFeedback(UUID planId, String regionId, String feedbackText, 
                           String submittedBy, OffsetDateTime submittedAt) {
        this.id = UUID.randomUUID();
        this.planId = planId;
        this.regionId = regionId;
        this.feedbackText = feedbackText;
        this.submittedBy = submittedBy;
        this.submittedAt = submittedAt;
        this.isOverridden = false;
        this.createdAt = OffsetDateTime.now();
    }

    public RegionalFeedback(UUID id, UUID planId, String regionId, String feedbackText,
                           String submittedBy, OffsetDateTime submittedAt, Boolean isOverridden,
                           String overrideComment, String overrideBy, OffsetDateTime overrideAt,
                           OffsetDateTime createdAt) {
        this.id = id;
        this.planId = planId;
        this.regionId = regionId;
        this.feedbackText = feedbackText;
        this.submittedBy = submittedBy;
        this.submittedAt = submittedAt;
        this.isOverridden = isOverridden;
        this.overrideComment = overrideComment;
        this.overrideBy = overrideBy;
        this.overrideAt = overrideAt;
        this.createdAt = createdAt;
    }

    // Business Methods
    public void override(String comment, String directorId) {
        this.isOverridden = true;
        this.overrideComment = comment;
        this.overrideBy = directorId;
        this.overrideAt = OffsetDateTime.now();
    }

    public boolean hasBeenSubmitted() {
        return submittedAt != null && submittedBy != null;
    }

    // Getters
    public UUID getId() { return id; }
    public UUID getPlanId() { return planId; }
    public String getRegionId() { return regionId; }
    public String getFeedbackText() { return feedbackText; }
    public String getSubmittedBy() { return submittedBy; }
    public OffsetDateTime getSubmittedAt() { return submittedAt; }
    public Boolean getIsOverridden() { return isOverridden; }
    public String getOverrideComment() { return overrideComment; }
    public String getOverrideBy() { return overrideBy; }
    public OffsetDateTime getOverrideAt() { return overrideAt; }
    public OffsetDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setId(UUID id) { this.id = id; }
    public void setPlanId(UUID planId) { this.planId = planId; }
    public void setRegionId(String regionId) { this.regionId = regionId; }
    public void setFeedbackText(String feedbackText) { this.feedbackText = feedbackText; }
    public void setSubmittedBy(String submittedBy) { this.submittedBy = submittedBy; }
    public void setSubmittedAt(OffsetDateTime submittedAt) { this.submittedAt = submittedAt; }
    public void setIsOverridden(Boolean overridden) { isOverridden = overridden; }
    public void setOverrideComment(String overrideComment) { this.overrideComment = overrideComment; }
    public void setOverrideBy(String overrideBy) { this.overrideBy = overrideBy; }
    public void setOverrideAt(OffsetDateTime overrideAt) { this.overrideAt = overrideAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
