package mor.itas.persistence.jpa.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * TeamMember - JPA Entity for team_members table
 * Tracks membership relationship: which auditors belong to which team leader
 * Supports auditor team assignment validation (C2 bug fix)
 * Used for preventing cross-team auditor assignments
 */
@Entity
@Table(name = "team_members", indexes = {
    @Index(name = "idx_team_members_team_leader", columnList = "team_leader_id, is_active, left_at"),
    @Index(name = "idx_team_members_auditor", columnList = "auditor_id, team_leader_id"),
    @Index(name = "idx_team_members_active", columnList = "team_leader_id")
}, uniqueConstraints = {
    @UniqueConstraint(name = "uk_team_membership", columnNames = {"team_leader_id", "auditor_id"})
})
@Getter
@Setter
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class TeamMember {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "team_leader_id", nullable = false)
    private UUID teamLeaderId;
    
    @Column(name = "auditor_id", nullable = false)
    private UUID auditorId;
    
    @Column(name = "joined_at", nullable = false)
    private OffsetDateTime joinedAt;
    
    @Column(name = "left_at")
    private OffsetDateTime leftAt;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
    
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;
    
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
        joinedAt = OffsetDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
