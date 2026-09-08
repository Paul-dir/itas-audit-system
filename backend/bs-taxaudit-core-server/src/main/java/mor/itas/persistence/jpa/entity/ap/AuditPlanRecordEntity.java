package mor.itas.persistence.jpa.entity.ap;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "t_audit_plan_record", indexes = {
    @Index(name = "idx_audit_plan_case_id", columnList = "case_id"),
    @Index(name = "idx_plan_team_lead_status", columnList = "team_lead_id, status"),
    @Index(name = "idx_plan_created_at_desc", columnList = "created_at DESC")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditPlanRecordEntity {

    @Id
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @Column(name = "case_id", nullable = false)
    private UUID caseId;

    @Column(nullable = false, length = 64)
    private String submittedBy;
    
    // ═══════════════════════════════════════════════════════════════════
    // NEW: Team Lead Visibility Fields (Added in V3_9)
    // ═══════════════════════════════════════════════════════════════════
    
    @Column(name = "team_lead_id", length = 255)
    private String teamLeadId;  // From case.assignedTeamLeaderId
    
    @Column(name = "reviewed_by", length = 255)
    private String reviewedBy;  // Team lead who approved/rejected
    
    @Column(name = "review_timestamp")
    private OffsetDateTime reviewTimestamp;  // When team lead reviewed
    
    @Column(name = "review_comments", columnDefinition = "TEXT")
    private String reviewComments;  // Reason for decision

    @Column(columnDefinition = "TEXT")
    private String scope;

    @Column(columnDefinition = "TEXT")
    private String objectives;

    @Column(columnDefinition = "TEXT")
    private String methodology;

    @Column(columnDefinition = "TEXT")
    private String timeline;

    @Column(columnDefinition = "TEXT")
    private String resourcePlan;

    @Column(length = 32)
    private String status; // DRAFT, SUBMITTED, APPROVED, REVISION_REQUESTED, REJECTED

    @Column(columnDefinition = "TEXT")
    private String revisionNotes;

    @Column(name = "approved_by")
    private String approvedBy;

    @Column(name = "approved_at")
    private OffsetDateTime approvedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (id == null) id = UUID.randomUUID();
        if (createdAt == null) createdAt = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
