package mor.itas.domain.model.ap;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * PlanTimeline - Domain Model representing a status change event
 * Business logic layer for timeline entries
 */
public class PlanTimeline {
    private UUID id;
    private UUID planId;
    private String status;
    private String actorId;
    private String comment;
    private OffsetDateTime eventTimestamp;
    private OffsetDateTime createdAt;

    // Constructors
    public PlanTimeline() {
    }

    public PlanTimeline(UUID planId, String status, String actorId, String comment, OffsetDateTime eventTimestamp) {
        this.id = UUID.randomUUID();
        this.planId = planId;
        this.status = status;
        this.actorId = actorId;
        this.comment = comment;
        this.eventTimestamp = eventTimestamp;
        this.createdAt = OffsetDateTime.now();
    }

    public PlanTimeline(UUID id, UUID planId, String status, String actorId, String comment, 
                       OffsetDateTime eventTimestamp, OffsetDateTime createdAt) {
        this.id = id;
        this.planId = planId;
        this.status = status;
        this.actorId = actorId;
        this.comment = comment;
        this.eventTimestamp = eventTimestamp;
        this.createdAt = createdAt;
    }

    // Getters
    public UUID getId() { return id; }
    public UUID getPlanId() { return planId; }
    public String getStatus() { return status; }
    public String getActorId() { return actorId; }
    public String getComment() { return comment; }
    public OffsetDateTime getEventTimestamp() { return eventTimestamp; }
    public OffsetDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setId(UUID id) { this.id = id; }
    public void setPlanId(UUID planId) { this.planId = planId; }
    public void setStatus(String status) { this.status = status; }
    public void setActorId(String actorId) { this.actorId = actorId; }
    public void setComment(String comment) { this.comment = comment; }
    public void setEventTimestamp(OffsetDateTime eventTimestamp) { this.eventTimestamp = eventTimestamp; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
