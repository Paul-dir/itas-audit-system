package mor.itas.persistence.jpa.entity.ap;

import lombok.*;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "t_committee_vote", uniqueConstraints = {@UniqueConstraint(columnNames = {"case_id", "member_id"})})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommitteeVoteEntity {

    @Id
    private UUID voteId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voting_id", nullable = false)
    private AdvisoryVotingEntity votingEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    private CommitteeCaseEntity committeeCaseEntity;

    @Column(nullable = false)
    private UUID memberId;

    @Column(nullable = false, length = 20)
    private String voteOption;

    @Column(columnDefinition = "TEXT")
    private String reasoning;

    @Column(name = "voted_at", nullable = false, updatable = false)
    private OffsetDateTime votedAt;

    @Version
    private Long version;

    @PrePersist
    protected void onCreate() {
        if (voteId == null) {
            voteId = UUID.randomUUID();
        }
        if (votedAt == null) {
            votedAt = OffsetDateTime.now();
        }
    }
}
