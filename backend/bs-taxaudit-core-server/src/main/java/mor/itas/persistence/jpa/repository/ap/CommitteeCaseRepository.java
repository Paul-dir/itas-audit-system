package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.CommitteeCaseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for CommitteeCase entity.
 * 
 * Provides query methods for committee case lifecycle management, including case lookup,
 * status filtering, deadline enforcement, and ownership tracking.
 */
@Repository
public interface CommitteeCaseRepository extends JpaRepository<CommitteeCaseEntity, UUID> {

    /**
     * Find a committee case by its unique case code.
     * 
     * @param caseCode the unique case code
     * @return Optional containing the case if found
     */
    Optional<CommitteeCaseEntity> findByCaseCode(String caseCode);

    /**
     * Find all committee cases with a specific status.
     * Supports dashboard filtering and status-based queries.
     * 
     * @param status the case status (e.g., PENDING_VOTES, PENDING_VIABILITY, APPROVED)
     * @return List of cases with the specified status
     */
    List<CommitteeCaseEntity> findByStatus(String status);

    /**
     * Find cases for dashboard filtering by status and risk priority.
     * 
     * @param status the case status
     * @param riskPriority the risk priority level (High, Medium, Low)
     * @param pageable pagination parameters
     * @return Page of cases matching the criteria
     */
    Page<CommitteeCaseEntity> findByStatusAndRiskPriority(String status, String riskPriority, Pageable pageable);

    /**
     * Find all cases assigned to a specific taxpayer.
     * Supports taxpayer-specific case portfolio view.
     * 
     * @param taxpayerId the taxpayer's unique identifier
     * @return List of cases for the taxpayer
     */
    List<CommitteeCaseEntity> findByTaxpayerId(UUID taxpayerId);

    /**
     * Find cases with deadline before the specified date.
     * Used for SLA checks and deadline escalation.
     * 
     * @param deadline the deadline threshold
     * @return List of overdue cases
     */
    List<CommitteeCaseEntity> findByCommitteeDeadlineBeforeOrderByCommitteeDeadlineAsc(OffsetDateTime deadline);

    /**
     * Find cases owned by a specific committee member.
     * Supports ownership lookups and member's case portfolio.
     * 
     * @param ownerId the owner member's unique identifier
     * @return List of cases owned by the member
     */
    List<CommitteeCaseEntity> findByCurrentOwnerId(UUID ownerId);

    /**
     * Find cases by a list of case IDs.
     * Supports batch operations and multi-case queries.
     * 
     * @param caseIds list of case IDs to retrieve
     * @return List of cases matching the provided IDs
     */
    List<CommitteeCaseEntity> findByCaseIdIn(List<UUID> caseIds);

    /**
     * Find a case by its original case ID from the risk engine.
     * Used for case intake and mapping.
     * 
     * @param originalCaseId the original case ID from risk-engine
     * @return Optional containing the case if found
     */
    Optional<CommitteeCaseEntity> findByOriginalCaseId(UUID originalCaseId);

    /**
     * Find cases by code and status combination.
     * 
     * @param caseCode the unique case code
     * @param status the case status
     * @return Optional containing the case if found
     */
    @Query("SELECT c FROM CommitteeCaseEntity c WHERE c.caseCode = :caseCode AND c.status = :status")
    Optional<CommitteeCaseEntity> findByCaseCodeAndStatus(
        @Param("caseCode") String caseCode, @Param("status") String status);

    /**
     * Find cases owned by a specific member with pagination.
     * 
     * @param memberId the owner member's unique identifier
     * @param pageable pagination parameters
     * @return Page of cases owned by the member
     */
    @Query("SELECT c FROM CommitteeCaseEntity c WHERE c.currentOwnerId = :memberId")
    Page<CommitteeCaseEntity> findCasesOwnedBy(@Param("memberId") UUID memberId, Pageable pageable);

    /**
     * Count cases by status.
     * Used for dashboard summary metrics.
     * 
     * @param status the case status
     * @return count of cases with the specified status
     */
    @Query("""
        SELECT COUNT(c) FROM CommitteeCaseEntity c 
        WHERE c.status = :status
        """)
    long countByStatus(@Param("status") String status);

    /**
     * Find all overdue cases.
     * Used for SLA escalation and monitoring.
     * 
     * @return List of overdue cases
     */
    @Query("""
        SELECT c FROM CommitteeCaseEntity c 
        WHERE c.committeeDeadline < CURRENT_TIMESTAMP 
        AND c.extendedDeadline IS NULL 
        ORDER BY c.committeeDeadline ASC
        """)
    List<CommitteeCaseEntity> findOverdueCases();

    /**
     * Find cases with pagination and sorting by status.
     * 
     * @param status the case status
     * @param pageable pagination parameters
     * @return Page of cases with the specified status
     */
    Page<CommitteeCaseEntity> findByStatus(String status, Pageable pageable);

    /**
     * Find cases by deadline range for temporal queries.
     * 
     * @param startDate the start of the deadline range
     * @param endDate the end of the deadline range
     * @return List of cases with deadlines in the specified range
     */
    @Query("""
        SELECT c FROM CommitteeCaseEntity c 
        WHERE c.committeeDeadline BETWEEN :startDate AND :endDate
        ORDER BY c.committeeDeadline ASC
        """)
    List<CommitteeCaseEntity> findByCommitteeDeadlineBetween(
        @Param("startDate") OffsetDateTime startDate,
        @Param("endDate") OffsetDateTime endDate);

    @Query("""
        SELECT COUNT(c) FROM CommitteeCaseEntity c 
        WHERE (:taxCenter IS NULL OR :taxCenter = '' OR c.taxCenter = :taxCenter)
        """)
    long countByTaxCenter(@Param("taxCenter") String taxCenter);

    @Query("""
        SELECT COUNT(c) FROM CommitteeCaseEntity c 
        WHERE c.status = :status
        AND (:taxCenter IS NULL OR :taxCenter = '' OR c.taxCenter = :taxCenter)
        """)
    long countByStatusAndTaxCenter(@Param("status") String status, @Param("taxCenter") String taxCenter);

    @Query("""
        SELECT c FROM CommitteeCaseEntity c 
        WHERE c.committeeDeadline < CURRENT_TIMESTAMP 
        AND c.extendedDeadline IS NULL
        AND (:taxCenter IS NULL OR :taxCenter = '' OR c.taxCenter = :taxCenter)
        ORDER BY c.committeeDeadline ASC
        """)
    List<CommitteeCaseEntity> findOverdueCasesByTaxCenter(@Param("taxCenter") String taxCenter);

    @Query("""
        SELECT c FROM CommitteeCaseEntity c 
        WHERE c.committeeDeadline BETWEEN :startDate AND :endDate
        AND (:taxCenter IS NULL OR :taxCenter = '' OR c.taxCenter = :taxCenter)
        ORDER BY c.committeeDeadline ASC
        """)
    List<CommitteeCaseEntity> findByCommitteeDeadlineBetweenAndTaxCenter(
        @Param("startDate") OffsetDateTime startDate,
        @Param("endDate") OffsetDateTime endDate,
        @Param("taxCenter") String taxCenter);

    @Query("""
        SELECT c FROM CommitteeCaseEntity c
        WHERE (:status IS NULL OR :status = '' OR c.status = :status)
        AND (:riskPriority IS NULL OR :riskPriority = '' OR c.riskPriority = :riskPriority)
        AND (:taxpayerName IS NULL OR :taxpayerName = '' OR LOWER(c.taxpayerName) LIKE LOWER(CONCAT('%', :taxpayerName, '%')))
        AND (:segment IS NULL OR :segment = '' OR c.segment = :segment)
        AND (:taxCenter IS NULL OR :taxCenter = '' OR c.taxCenter = :taxCenter)
        """)
    Page<CommitteeCaseEntity> searchCases(
        @Param("status") String status,
        @Param("riskPriority") String riskPriority,
        @Param("taxpayerName") String taxpayerName,
        @Param("segment") String segment,
        @Param("taxCenter") String taxCenter,
        Pageable pageable);

    /**
     * Find cases for a specific team leader.
     * Used by team leader dashboard to see incoming cases before execution transfer.
     * Includes TEAM_ASSIGNED, APPROVED, and PENDING_VIABILITY (after team lead appointment).
     */
    @Query("""
        SELECT c FROM CommitteeCaseEntity c
        WHERE c.status IN ('TEAM_ASSIGNED', 'APPROVED', 'PENDING_VIABILITY')
        AND c.teamLeadId = :teamLeadId
        ORDER BY c.createdDate DESC
        """)
    List<CommitteeCaseEntity> findTeamAssignedByTeamLeadId(@Param("teamLeadId") UUID teamLeadId);

    /**
     * Find cases assigned to a team leader (incoming).
     * Includes TEAM_ASSIGNED, APPROVED, and PENDING_VIABILITY.
     */
    @Query("""
        SELECT c FROM CommitteeCaseEntity c
        WHERE c.status IN ('TEAM_ASSIGNED', 'APPROVED', 'PENDING_VIABILITY')
        AND c.teamLeadId IS NOT NULL
        ORDER BY c.createdDate DESC
        """)
    List<CommitteeCaseEntity> findAllTeamAssigned();
}
