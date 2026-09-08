package mor.itas.persistence.jpa.entity.ap;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "t_auditor_nomination")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditorNominationEntity {

    @Id
    private UUID nominationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    private CommitteeCaseEntity committeeCaseEntity;

    @Column(nullable = false)
    private UUID nominatedAuditorId;

    @Column(nullable = false)
    private UUID nominatingMemberId;

    /**
     * Role of the nominated person: 'AUDITOR' or 'TEAM_LEADER'
     */
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String role = "AUDITOR";

    /**
     * Whether this nomination has been selected/appointed by the chairperson.
     * Only applicable for TEAM_LEADER role nominations.
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean selected = false;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String justification;

    @CreationTimestamp
    @Column(name = "nominated_at", nullable = false, updatable = false)
    private OffsetDateTime nominatedAt;

    @Version
    private Long version;

    @PrePersist
    protected void onCreate() {
        if (nominationId == null) {
            nominationId = UUID.randomUUID();
        }
    }
}
