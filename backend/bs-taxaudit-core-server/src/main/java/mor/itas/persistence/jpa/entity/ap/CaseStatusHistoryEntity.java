package mor.itas.persistence.jpa.entity.ap;

import lombok.*;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "t_case_status_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CaseStatusHistoryEntity {

    @Id
    private UUID historyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    private CommitteeCaseEntity committeeCaseEntity;

    @Column(name = "old_status", length = 50)
    private String oldStatus;

    @Column(name = "new_status", nullable = false, length = 50)
    private String newStatus;

    @Column(name = "transition_reason", columnDefinition = "TEXT")
    private String transitionReason;

    @Column(nullable = false)
    private UUID transitionedBy;

    @Column(name = "transitioned_at", nullable = false, updatable = false)
    private OffsetDateTime transitionedAt;

    @PrePersist
    protected void onCreate() {
        if (historyId == null) {
            historyId = UUID.randomUUID();
        }
        if (transitionedAt == null) {
            transitionedAt = OffsetDateTime.now();
        }
    }
}
