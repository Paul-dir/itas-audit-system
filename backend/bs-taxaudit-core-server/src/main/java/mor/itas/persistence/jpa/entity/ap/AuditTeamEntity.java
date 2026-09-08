package mor.itas.persistence.jpa.entity.ap;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.*;

/**
 * JPA Entity for Audit Teams
 * Stores teams formed during auditor nomination process.
 * Teams consist of a team leader and nominated auditors.
 * Teams have capacity limits for concurrent case assignments.
 */
@Entity
@Table(name = "t_audit_team")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditTeamEntity {

    @Id
    private UUID teamId;

    @Column(nullable = false)
    private UUID teamLeaderId;

    @Column(nullable = false, length = 255)
    private String teamLeaderName;

    /**
     * JSON array of auditor IDs in this team
     */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String auditorIds;

    /**
     * JSON array of auditor names for display
     */
    @Column(columnDefinition = "TEXT")
    private String auditorNames;

    /**
     * Maximum number of concurrent cases this team can handle
     */
    @Column(nullable = false)
    @Builder.Default
    private Integer capacity = 5;

    /**
     * Current number of active cases assigned to this team
     */
    @Column(nullable = false)
    @Builder.Default
    private Integer currentCases = 0;

    /**
     * Whether this team is currently active and available for assignment
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    /**
     * Optional description or specialty of the team
     */
    @Column(length = 500)
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @Version
    private Long version;

    @PrePersist
    protected void onCreate() {
        if (teamId == null) {
            teamId = UUID.randomUUID();
        }
    }

    /**
     * Check if team has reached its capacity limit
     */
    public boolean isAtCapacity() {
        return currentCases >= capacity;
    }

    /**
     * Increment the current case count
     */
    public void incrementCases() {
        this.currentCases = Math.min(this.currentCases + 1, this.capacity);
    }

    /**
     * Decrement the current case count
     */
    public void decrementCases() {
        this.currentCases = Math.max(this.currentCases - 1, 0);
    }
}
