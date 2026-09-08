package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.CommitteeVoteEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for CommitteeVote entity.
 */
@Repository
public interface CommitteeVoteRepository extends JpaRepository<CommitteeVoteEntity, UUID> {

    List<CommitteeVoteEntity> findByVotingEntityVotingIdOrderByVotedAtAsc(UUID votingId);

    Optional<CommitteeVoteEntity> findByVotingEntityVotingIdAndMemberId(UUID votingId, UUID memberId);

    Optional<CommitteeVoteEntity> findByCommitteeCaseEntityCaseIdAndMemberId(UUID caseId, UUID memberId);

    List<CommitteeVoteEntity> findByCommitteeCaseEntityCaseIdOrderByVotedAtAsc(UUID caseId);

    Page<CommitteeVoteEntity> findByCommitteeCaseEntityCaseIdOrderByVotedAtDesc(UUID caseId, Pageable pageable);

    List<CommitteeVoteEntity> findByMemberId(UUID memberId);

    Optional<CommitteeVoteEntity> findByCommitteeCaseEntityCaseIdAndVotingEntityVotingIdAndMemberId(UUID caseId, UUID votingId, UUID memberId);

    @Query("""
        SELECT EXISTS(
            SELECT 1 FROM CommitteeVoteEntity v 
            WHERE v.votingEntity.votingId = :votingId AND v.memberId = :memberId
        )
        """)
    boolean existsByVotingIdAndMemberId(@Param("votingId") UUID votingId, @Param("memberId") UUID memberId);

    @Query("""
        SELECT COUNT(v) FROM CommitteeVoteEntity v 
        WHERE v.votingEntity.votingId = :votingId
        """)
    long countVotesByVotingId(@Param("votingId") UUID votingId);

    @Query("""
        SELECT COUNT(v) FROM CommitteeVoteEntity v 
        WHERE v.votingEntity.votingId = :votingId 
        AND v.voteOption = :voteOption
        """)
    long countVotesByVotingIdAndOption(
        @Param("votingId") UUID votingId, 
        @Param("voteOption") String voteOption);

    @Query("""
        SELECT EXISTS(
            SELECT 1 FROM CommitteeVoteEntity v 
            WHERE v.committeeCaseEntity.caseId = :caseId AND v.memberId = :memberId
        )
        """)
    boolean hasMemberVoted(@Param("caseId") UUID caseId, @Param("memberId") UUID memberId);

    long countByCommitteeCaseEntityCaseId(UUID caseId);

    long countByCommitteeCaseEntityCaseIdAndVoteOption(UUID caseId, String voteOption);

    /**
     * Bulk count votes grouped by case ID.
     * Returns Object[] arrays: [caseId, totalVotes, approveCount]
     * Used by the list view to compute voting status without N+1 queries.
     */
    @Query("""
        SELECT v.committeeCaseEntity.caseId, COUNT(v),
               SUM(CASE WHEN v.voteOption = 'APPROVE' THEN 1 ELSE 0 END)
        FROM CommitteeVoteEntity v
        WHERE v.committeeCaseEntity.caseId IN :caseIds
        GROUP BY v.committeeCaseEntity.caseId
        """)
    List<Object[]> countVotesGroupByCaseId(@Param("caseIds") List<UUID> caseIds);
}
