package mor.itas.domain.model.ap;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * PlanRevision - Domain Model representing a plan revision/amendment
 * Tracks amendments, rejections, and comments
 */
public class PlanRevision {
    private UUID id;
    private UUID planId;
    private String comment;
    private String revisionType;  // 'revision', 'amendment', 'senior_rejection', etc
    private String createdBy;
    private OffsetDateTime createdAt;

    // Constructors
    public PlanRevision() {
    }

    public PlanRevision(UUID planId, String comment, String revisionType, String createdBy) {
        this.id = UUID.randomUUID();
        this.planId = planId;
        this.comment = comment;
        this.revisionType = revisionType;
        this.createdBy = createdBy;
        this.createdAt = OffsetDateTime.now();
    }

    public PlanRevision(UUID id, UUID planId, String comment, String revisionType, 
                       String createdBy, OffsetDateTime createdAt) {
        this.id = id;
        this.planId = planId;
        this.comment = comment;
        this.revisionType = revisionType;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    // Getters
    public UUID getId() { return id; }
    public UUID getPlanId() { return planId; }
    public String getComment() { return comment; }
    public String getRevisionType() { return revisionType; }
    public String getCreatedBy() { return createdBy; }
    public OffsetDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setId(UUID id) { this.id = id; }
    public void setPlanId(UUID planId) { this.planId = planId; }
    public void setComment(String comment) { this.comment = comment; }
    public void setRevisionType(String revisionType) { this.revisionType = revisionType; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
