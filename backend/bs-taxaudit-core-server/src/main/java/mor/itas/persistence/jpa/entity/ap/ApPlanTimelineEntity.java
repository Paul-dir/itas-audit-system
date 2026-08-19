package mor.itas.persistence.jpa.entity.ap;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * ApPlanTimelineEntity - JPA Entity for ap_plan_timeline table
 * Tracks all status transitions for audit trail
 */
@Entity
@Table(name = "ap_plan_timeline", indexes = {
    @Index(name = "idx_ap_plan_timeline_plan_id", columnList = "plan_id")
})
public class ApPlanTimelineEntity {

    @Id
    private UUID id = UUID.randomUUID();

    @Column(nullable = false, name = "plan_id")
    private UUID planId;

    @Column(nullable = false, length = 64, name = "status")
    private String status;

    @Column(nullable = false, length = 64, name = "actor_id")
    private String actorId;

    @Column(columnDefinition = "TEXT", name = "comment")
    private String comment;

    @Column(nullable = false, name = "event_timestamp")
    private OffsetDateTime eventTimestamp;

    @Column(nullable = false, name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    // Constructors
    public ApPlanTimelineEntity() {
    }

    public ApPlanTimelineEntity(UUID planId, String status, String actorId, String comment, OffsetDateTime eventTimestamp) {
        this.planId = planId;
        this.status = status;
        this.actorId = actorId;
        this.comment = comment;
        this.eventTimestamp = eventTimestamp;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getActorId() {
        return actorId;
    }

    public void setActorId(String actorId) {
        this.actorId = actorId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public OffsetDateTime getEventTimestamp() {
        return eventTimestamp;
    }

    public void setEventTimestamp(OffsetDateTime eventTimestamp) {
        this.eventTimestamp = eventTimestamp;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
