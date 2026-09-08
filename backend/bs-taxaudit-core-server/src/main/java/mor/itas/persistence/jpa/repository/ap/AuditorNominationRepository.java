package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.AuditorNominationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository interface for AuditorNomination entity.
 * 
 * Manages auditor nominations for committee cases, supporting nomination lookup,
 * auditor history tracking, and duplicate detection.
 */
@Repository
public interface AuditorNominationRepository extends JpaRepository<AuditorNominationEntity, UUID> {

    /**
     * Find all nominations for a specific committee case.
     * Returns nominations ordered by nomination date.
     * 
     * @param caseId the committee case ID
     * @return List of all nominations for the case
     */
    @Query("""
        SELECT n FROM AuditorNominationEntity n 
        WHERE n.committeeCaseEntity.caseId = :caseId 
        ORDER BY n.nominatedAt ASC
        """)
    List<AuditorNominationEntity> findByCaseIdOrderByNominatedAtAsc(@Param("caseId") UUID caseId);

    /**
     * Find all nominations for a specific auditor.
     * Used to retrieve audit history and nomination count for an auditor.
     * 
     * @param auditorId the auditor's unique identifier
     * @return List of all nominations for the auditor across all cases
     */
    List<AuditorNominationEntity> findByNominatedAuditorId(UUID auditorId);

    /**
     * Find top nominated auditors for a specific case.
     * Used to identify most-suggested auditors for team formation.
     * 
     * @param caseId the committee case ID
     * @return List of auditors grouped and ordered by nomination count (descending)
     */
    @Query("""
        SELECT n FROM AuditorNominationEntity n 
        WHERE n.committeeCaseEntity.caseId = :caseId 
        GROUP BY n.nominatedAuditorId 
        ORDER BY COUNT(n) DESC
        """)
    List<AuditorNominationEntity> findTopNominatedAuditors(@Param("caseId") UUID caseId);

    /**
     * Count nominations for a specific case.
     * Used for statistics and analytics.
     * 
     * @param caseId the committee case ID
     * @return count of nominations for the case
     */
    @Query("""
        SELECT COUNT(n) FROM AuditorNominationEntity n 
        WHERE n.committeeCaseEntity.caseId = :caseId
        """)
    long countByCaseId(@Param("caseId") UUID caseId);

    /**
     * Count nominations for a specific auditor.
     * Used to track auditor's overall nomination history.
     * 
     * @param auditorId the auditor's unique identifier
     * @return count of total nominations for the auditor
     */
    long countByNominatedAuditorId(UUID auditorId);

    /**
     * Check if a specific auditor has been nominated for a case.
     * Used to prevent or track duplicate nominations.
     * 
     * @param caseId the committee case ID
     * @param auditorId the auditor's unique identifier
     * @return true if the auditor has been nominated for the case, false otherwise
     */
    @Query("""
        SELECT EXISTS(
            SELECT 1 FROM AuditorNominationEntity n 
            WHERE n.committeeCaseEntity.caseId = :caseId AND n.nominatedAuditorId = :auditorId
        )
        """)
    boolean existsByCaseIdAndNominatedAuditorId(
        @Param("caseId") UUID caseId,
        @Param("auditorId") UUID auditorId);

    /**
     * Count nominations for a specific case and auditor combination.
     * Used for duplicate detection and nomination analytics.
     * 
     * @param caseId the committee case ID
     * @param auditorId the auditor's unique identifier
     * @return count of nominations matching the criteria
     */
    @Query("""
        SELECT COUNT(n) FROM AuditorNominationEntity n 
        WHERE n.committeeCaseEntity.caseId = :caseId AND n.nominatedAuditorId = :auditorId
        """)
    long countByCaseIdAndNominatedAuditorId(
        @Param("caseId") UUID caseId, 
        @Param("auditorId") UUID auditorId);

    /**
     * Find all nominations by a specific member (nominator).
     * Used to track nominations made by a particular member.
     * 
     * @param nominatingMemberId the nominating committee member ID
     * @return List of nominations made by the member
     */
    List<AuditorNominationEntity> findByNominatingMemberId(UUID nominatingMemberId);

    /**
     * Find all team leader nominations for a specific case.
     * Used by chairperson to view and select team leaders.
     * 
     * @param caseId the committee case ID
     * @return List of team leader nominations ordered by nomination date
     */
    @Query("""
        SELECT n FROM AuditorNominationEntity n 
        WHERE n.committeeCaseEntity.caseId = :caseId AND n.role = 'TEAM_LEADER'
        ORDER BY n.nominatedAt ASC
        """)
    List<AuditorNominationEntity> findTeamLeaderNominationsByCaseId(@Param("caseId") UUID caseId);

    /**
     * Find selected team leader for a specific case.
     * Returns the team leader nominated by committee members that was selected by the chairperson.
     * 
     * @param caseId the committee case ID
     * @return the selected team leader nomination, or null
     */
    @Query("""
        SELECT n FROM AuditorNominationEntity n 
        WHERE n.committeeCaseEntity.caseId = :caseId AND n.role = 'TEAM_LEADER' AND n.selected = true
        """)
    AuditorNominationEntity findSelectedTeamLeaderByCaseId(@Param("caseId") UUID caseId);

    /**
     * Find all auditor (non-team-leader) nominations for a specific case.
     * Returns auditors nominated by committee members for a specific team leader's team.
     * 
     * @param caseId the committee case ID
     * @return List of auditor nominations ordered by nomination date
     */
    @Query("""
        SELECT n FROM AuditorNominationEntity n 
        WHERE n.committeeCaseEntity.caseId = :caseId AND n.role = 'AUDITOR'
        ORDER BY n.nominatedAt ASC
        """)
    List<AuditorNominationEntity> findAuditorNominationsByCaseId(@Param("caseId") UUID caseId);

    /**
     * Find nominations for a case made by a specific member.
     * 
     * @param caseId the committee case ID
     * @param nominatingMemberId the nominating committee member ID
     * @return List of nominations made by the member for the case
     */
    @Query("""
        SELECT n FROM AuditorNominationEntity n 
        WHERE n.committeeCaseEntity.caseId = :caseId AND n.nominatingMemberId = :nominatingMemberId
        """)
    List<AuditorNominationEntity> findByCaseIdAndNominatingMemberId(
        @Param("caseId") UUID caseId, 
        @Param("nominatingMemberId") UUID nominatingMemberId);
}
