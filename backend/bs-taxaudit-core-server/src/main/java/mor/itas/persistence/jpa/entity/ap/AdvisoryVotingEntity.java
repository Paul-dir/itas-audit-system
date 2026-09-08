package mor.itas.persistence.jpa.entity.ap;

import lombok.*;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.*;

@Entity
@Table(name = "t_advisory_voting")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdvisoryVotingEntity {

    @Id
    private UUID votingId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false, unique = true)
    private CommitteeCaseEntity committeeCaseEntity;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(name = "consensus_threshold")
    private Integer consensusThreshold;

    @Column(name = "voting_started_at", nullable = false, updatable = false)
    private OffsetDateTime votingStartedAt;

    @Column(name = "voting_closed_at")
    private OffsetDateTime votingClosedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @OneToMany(mappedBy = "votingEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CommitteeVoteEntity> votes = new ArrayList<>();

    @OneToOne(mappedBy = "votingEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private VotingTallyEntity votingTally;

    @PrePersist
    protected void onCreate() {
        if (votingId == null) {
            votingId = UUID.randomUUID();
        }
        if (votingStartedAt == null) {
            votingStartedAt = OffsetDateTime.now();
        }
        if (createdAt == null) {
            createdAt = OffsetDateTime.now();
        }
    }
}
