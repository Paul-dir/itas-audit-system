package mor.itas.persistence.jpa.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * CaseAuditorAssignment - JPA Entity for case_auditor_assignment table
 * Records when a team leader assigns a specific auditor to execute a case
 * Part of the workflow: Chairperson (APPROVED) → Team Leader (TEAM_ASSIGNED) → Auditor (AUDITOR_ASSIGNED)
 */
@Entity
@Table(name = "case_auditor_assignment", indexes = {
    @Index(name = "idx_auditor_assign_case", columnList = "case_id"),
    @Index(name = "idx_auditor_assign_auditor", columnList = "auditor_id"),
    @Index(name = "idx_auditor_assign_status", columnList = "status")
})
@Getter
@Setter
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class CaseAuditorAssignment {
    
    @Id
    @Builder.Default
    private UUID id = UUID.randomUUID();
    
    @Column(name = "case_id", nullable = false)
    private UUID caseId;
    
    @Column(name = "auditor_id", nullable = false)
    private UUID auditorId;
    
    @Column(name = "assigned_by_id", nullable = false)
    private UUID assignedById;
    
    @Column(name = "assigned_date", nullable = false)
    private OffsetDateTime assignedDate;
    
    @Column(name = "status", nullable = false)
    private String status;  // ACTIVE, SUPERSEDED, CANCELLED
    
    @Column(name = "superseded_at")
    private OffsetDateTime supersededAt;
    
    @Column(name = "superseded_by_id")
    private UUID supersededById;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        if (id == null) id = UUID.randomUUID();
        if (assignedDate == null) assignedDate = OffsetDateTime.now();
    }
}
