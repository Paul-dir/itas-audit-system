package mor.itas.persistence.jpa.entity.ap;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * ApRegionalFeedbackEntity - JPA Entity for ap_regional_feedback table
 * Stores feedback submitted by regional directors
 */
@Entity
@Table(name = "ap_regional_feedback", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"plan_id", "region_id"}, name = "unique_regional_feedback")
}, indexes = {
    @Index(name = "idx_ap_regional_feedback_plan_id", columnList = "plan_id"),
    @Index(name = "idx_ap_regional_feedback_region", columnList = "region_id")
})
public class ApRegionalFeedbackEntity {

    @Id
    private UUID id = UUID.randomUUID();

    @Column(nullable = false, name = "plan_id")
    private UUID planId;

    @Column(nullable = false, length = 64, name = "region_id")
    private String regionId;

    @Column(columnDefinition = "TEXT", name = "feedback_text")
    private String feedbackText;

    @Column(length = 64, name = "submitted_by")
    private String submittedBy;

    @Column(name = "submitted_at")
    private OffsetDateTime submittedAt;

    @Column(nullable = false, name = "is_overridden")
    private Boolean isOverridden = false;

    @Column(columnDefinition = "TEXT", name = "override_comment")
    private String overrideComment;

    @Column(length = 64, name = "override_by")
    private String overrideBy;

    @Column(name = "override_at")
    private OffsetDateTime overrideAt;

    @Column(nullable = false, name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    // Constructors
    public ApRegionalFeedbackEntity() {
    }

    public ApRegionalFeedbackEntity(UUID planId, String regionId) {
        this.planId = planId;
        this.regionId = regionId;
        this.isOverridden = false;
        this.createdAt = OffsetDateTime.now();
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

    public String getFeedbackText() {
        return feedbackText;
    }

    public void setFeedbackText(String feedbackText) {
        this.feedbackText = feedbackText;
    }

    public String getSubmittedBy() {
        return submittedBy;
    }

    public void setSubmittedBy(String submittedBy) {
        this.submittedBy = submittedBy;
    }

    public OffsetDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(OffsetDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public Boolean getIsOverridden() {
        return isOverridden;
    }

    public void setIsOverridden(Boolean overridden) {
        isOverridden = overridden;
    }

    public String getOverrideComment() {
        return overrideComment;
    }

    public void setOverrideComment(String overrideComment) {
        this.overrideComment = overrideComment;
    }

    public String getOverrideBy() {
        return overrideBy;
    }

    public void setOverrideBy(String overrideBy) {
        this.overrideBy = overrideBy;
    }

    public OffsetDateTime getOverrideAt() {
        return overrideAt;
    }

    public void setOverrideAt(OffsetDateTime overrideAt) {
        this.overrideAt = overrideAt;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
