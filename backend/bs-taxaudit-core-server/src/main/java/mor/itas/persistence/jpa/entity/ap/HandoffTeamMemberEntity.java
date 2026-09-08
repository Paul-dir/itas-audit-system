package mor.itas.persistence.jpa.entity.ap;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "t_handoff_team_member")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HandoffTeamMemberEntity {

    @Id
    private UUID memberId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "handoff_id", nullable = false)
    private HandoffRecordEntity handoffRecordEntity;

    @Column(nullable = false)
    private UUID auditorId;

    @Column(length = 50)
    private String role;

    @CreationTimestamp
    @Column(name = "assigned_at", nullable = false, updatable = false)
    private OffsetDateTime assignedAt;

    @PrePersist
    protected void onCreate() {
        if (memberId == null) {
            memberId = UUID.randomUUID();
        }
    }
}
