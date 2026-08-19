package mor.itas.persistence.jpa.entity.ap;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * ApPlanRevisionEntity - JPA Entity for ap_plan_revisions table
 * Tracks amendments, rejections, and comments on plan revisions
 */
@Entity
@Table(name = "ap_plan_revisions", indexes = {
    @Index(name = "idx_ap_plan_revisions_plan_id", columnList = "plan_id")
})
public class ApPlanRevisionEntity {

    @Id
    private UUID id = UUID.randomUUID();

    @Column(nullable = false, name = "plan_id")
    private UUID planId;

    @Column(nullable = false, columnDefinition = "TEXT", name = "comment")
    private String comment;

    @Column(length = 32, name = "revision_type")
    private String revisionType;  // 'revision', 'amendment', 'senior_rejection', etc

    @Column(nullable = false, length = 64, name = "created_by")
    private String createdBy;

    @Column(nullable = false, name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    // Constructors
    public ApPlanRevisionEntity() {
    }

    public ApPlanRevisionEntity(UUID planId, String comment, String revisionType, String createdBy) {
        this.planId = planId;
        this.comment = comment;
        this.revisionType = revisionType;
        this.createdBy = createdBy;
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

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getRevisionType() {
        return revisionType;
    }

    public void setRevisionType(String revisionType) {
        this.revisionType = revisionType;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
