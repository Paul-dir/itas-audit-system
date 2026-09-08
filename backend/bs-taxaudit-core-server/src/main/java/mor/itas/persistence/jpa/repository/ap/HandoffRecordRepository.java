package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.HandoffRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for HandoffRecord entity.
 * 
 * Manages handoff records that snapshot committee decisions for cases
 * being transferred to the Execution Workspace, with case code uniqueness
 * enforcement and lookup capabilities.
 */
@Repository
public interface HandoffRecordRepository extends JpaRepository<HandoffRecordEntity, UUID> {

    /**
     * Find a handoff record by its unique handoff ID.
     * 
     * @param handoffId the handoff record ID
     * @return Optional containing the handoff record if found
     */
    Optional<HandoffRecordEntity> findByHandoffId(UUID handoffId);

    /**
     * Find a handoff record by the execution case code.
     * Used to lookup cases by their execution code.
     * 
     * @param caseCode the unique execution case code
     * @return Optional containing the handoff record if found
     */
    Optional<HandoffRecordEntity> findByCaseCode(String caseCode);

    /**
     * Find a handoff record by the original committee case ID.
     * Used to retrieve handoff information for a committee case.
     * 
     * @param caseId the committee case ID
     * @return Optional containing the handoff record if found
     */
    @Query("""
        SELECT h FROM HandoffRecordEntity h 
        WHERE h.committeeCaseEntity.caseId = :caseId
        """)
    Optional<HandoffRecordEntity> findByCaseId(@Param("caseId") UUID caseId);

    /**
     * Check if a case code already exists.
     * Used to ensure uniqueness of case codes before generation.
     * 
     * @param caseCode the unique execution case code
     * @return true if the code exists, false otherwise
     */
    boolean existsByCaseCode(String caseCode);

    /**
     * Count handoff records by case ID.
     * Used to verify a case has been handed off (should be 0 or 1).
     * 
     * @param caseId the committee case ID
     * @return count of handoff records for the case
     */
    @Query("""
        SELECT COUNT(h) FROM HandoffRecordEntity h 
        WHERE h.committeeCaseEntity.caseId = :caseId
        """)
    long countByCaseId(@Param("caseId") UUID caseId);

    /**
     * Check if a handoff record exists for a committee case.
     * Used to verify case transfer completion.
     * 
     * @param caseId the committee case ID
     * @return true if a handoff record exists for the case
     */
    @Query("""
        SELECT EXISTS(
            SELECT 1 FROM HandoffRecordEntity h 
            WHERE h.committeeCaseEntity.caseId = :caseId
        )
        """)
    boolean existsByCaseId(@Param("caseId") UUID caseId);

    /**
     * Find handoff record by execution case ID.
     * Used to track case transfer to execution workspace.
     * 
     * @param executionCaseId the execution workspace case ID
     * @return Optional containing the handoff record if found
     */
    @Query("""
        SELECT h FROM HandoffRecordEntity h 
        WHERE h.executionCaseId = :executionCaseId
        """)
    Optional<HandoffRecordEntity> findByExecutionCaseId(@Param("executionCaseId") UUID executionCaseId);

    /**
     * Find handoff records after a specific date.
     * Used to track handoffs after a specific date, ordered by most recent first.
     * 
     * @param handoffDate the handoff date threshold
     * @return list of handoff records ordered by handoff date descending
     */
    @Query("""
        SELECT h FROM HandoffRecordEntity h 
        WHERE h.handoffDate >= :handoffDate
        ORDER BY h.handoffDate DESC
        """)
    List<HandoffRecordEntity> findByHandoffDateGreaterThanOrEqualOrderByHandoffDateDesc(@Param("handoffDate") OffsetDateTime handoffDate);

    /**
     * Count handoff records by team lead ID.
     * Used to track a team lead's assigned cases.
     * 
     * @param teamLeadId the team lead's unique identifier
     * @return count of handoff records with the specified team lead
     */
    long countByTeamLeadId(UUID teamLeadId);
}
