package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.AdvisoryVotingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for AdvisoryVoting entity.
 */
@Repository
public interface AdvisoryVotingRepository extends JpaRepository<AdvisoryVotingEntity, UUID> {

    Optional<AdvisoryVotingEntity> findByCommitteeCaseEntityCaseId(UUID caseId);

    List<AdvisoryVotingEntity> findByStatus(String status);

    @Query("""
        SELECT v FROM AdvisoryVotingEntity v 
        WHERE v.votingStartedAt BETWEEN :startDate AND :endDate
        ORDER BY v.votingStartedAt DESC
        """)
    List<AdvisoryVotingEntity> findByVotingStartedAtBetween(
        @Param("startDate") OffsetDateTime startDate,
        @Param("endDate") OffsetDateTime endDate);

    // Duplicate of findByCommitteeCaseEntityCaseId - removed to prevent method signature conflict

    long countByStatus(String status);

    @Query("""
        SELECT v FROM AdvisoryVotingEntity v 
        WHERE v.status = 'OPEN'
        ORDER BY v.votingStartedAt DESC
        """)
    List<AdvisoryVotingEntity> findOpenVotingSessions();

    @Query("""
        SELECT v FROM AdvisoryVotingEntity v 
        WHERE v.status = 'CLOSED' 
        AND v.votingClosedAt <= :closedBeforeDate
        ORDER BY v.votingClosedAt DESC
        """)
    List<AdvisoryVotingEntity> findClosedVotingSessionsBefore(@Param("closedBeforeDate") OffsetDateTime closedBeforeDate);
}
