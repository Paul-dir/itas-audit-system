package mor.itas.persistence.jpa.entity.ap;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * DirectorApprovalEntity - Tracks director's approval/rejection/amendment decisions
 * 
 * Records what decision the director made on a plan and when.
 * This is separate from the plan status to maintain clean audit trail.
 */
@Entity
@Table(name = "ap_director_approvals")
public class DirectorApprovalEntity {

    @Id
    private UUID id = UUID.randomUUID();

    @Column(name = "plan_id", nullable = false)
    private UUID planId;

    @Column(name = "director_id", nullable = false, length = 64)
    private String directorId;

    @Column(name = "decision", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private DirectorDecisionEnum decision;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "approved_at", nullable = false)
    private OffsetDateTime approvedAt = OffsetDateTime.now();

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @Version
    private Long version = 0L;

    // Constructors
    public DirectorApprovalEntity() {
    }

    public DirectorApprovalEntity(UUID planId, String directorId, DirectorDecisionEnum decision) {
        this.planId = planId;
        this.directorId = directorId;
        this.decision = decision;
        this.approvedAt = OffsetDateTime.now();
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

    public String getDirectorId() {
        return directorId;
    }

    public void setDirectorId(String directorId) {
        this.directorId = directorId;
    }

    public DirectorDecisionEnum getDecision() {
        return decision;
    }

    public void setDecision(DirectorDecisionEnum decision) {
        this.decision = decision;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public OffsetDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(OffsetDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    // Enum for director decisions
    public enum DirectorDecisionEnum {
        APPROVED,
        REJECTED,
        AMENDMENT_REQUIRED
    }
}
