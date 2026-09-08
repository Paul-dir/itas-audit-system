package mor.itas.persistence.jpa.entity.ap;

import lombok.*;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "t_voting_tally")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VotingTallyEntity {

    @Id
    private UUID tallyId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voting_id", nullable = false, unique = true)
    private AdvisoryVotingEntity votingEntity;

    @Column(name = "approve_count")
    private Integer approveCount;

    @Column(name = "reject_count")
    private Integer rejectCount;

    @Column(name = "more_info_count")
    private Integer moreInfoCount;

    @Column(name = "total_votes_cast")
    private Integer totalVotesCast;

    @Column(name = "consensus_percentage", precision = 5, scale = 2)
    private BigDecimal consensusPercentage;

    @Column(name = "voting_outcome", length = 50)
    private String votingOutcome;

    @Column(name = "calculated_at", updatable = false)
    private OffsetDateTime calculatedAt;

    @PrePersist
    protected void onCreate() {
        if (tallyId == null) {
            tallyId = UUID.randomUUID();
        }
        if (calculatedAt == null) {
            calculatedAt = OffsetDateTime.now();
        }
    }
}
