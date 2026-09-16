package mor.itas.persistence.jpa.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * CaseHandoff - JPA Entity for case_handoff table
 * Records when a case is handed off from chairperson to team leader
 * Part of the workflow: Chairperson (APPROVED) → Team Leader (TEAM_ASSIGNED) → Auditor (AUDITOR_ASSIGNED)
 */
@Entity
@Table(name = "case_handoff", indexes = {
    @Index(name = "idx_case_handoff_case_id", columnList = "case_id"),
    @Index(name = "idx_case_handoff_team_leader", columnList = "team_leader_id"),
    @Index(name = "idx_case_handoff_status", columnList = "status"),
    @Index(name = "idx_case_handoff_created_at", columnList = "created_at")
})
@Getter
@Setter
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class CaseHandoff {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "case_id", nullable = false, unique = true)
    private UUID caseId;
    
    @Column(name = "team_leader_id", nullable = false)
    private UUID teamLeaderId;
    
    @Column(name = "assigned_by_id", nullable = false)
    private UUID assignedById;
    
    @Column(name = "assignment_date", nullable = false)
    private OffsetDateTime assignmentDate;
    
    @Column(name = "assignment_reason")
    private String assignmentReason;
    
    @Column(name = "status", nullable = false)
    private String status;  // ACTIVE, CANCELLED, SUPERSEDED
    
    @Column(name = "cancelled_at")
    private OffsetDateTime cancelledAt;
    
    @Column(name = "cancelled_by_id")
    private UUID cancelledById;
    
    @Column(name = "cancellation_reason")
    private String cancellationReason;
    
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;
    
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
        assignmentDate = OffsetDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
