package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.CommitteeAuditLogEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Repository interface for CommitteeAuditLog entity.
 */
@Repository
public interface CommitteeAuditLogRepository extends JpaRepository<CommitteeAuditLogEntity, UUID> {

    Page<CommitteeAuditLogEntity> findByCommitteeCaseEntityCaseIdOrderByActionTimestampDesc(UUID caseId, Pageable pageable);

    Page<CommitteeAuditLogEntity> findByActorIdOrderByActionTimestampDesc(UUID actorId, Pageable pageable);

    @Query("""
        SELECT a FROM CommitteeAuditLogEntity a 
        WHERE a.actionTimestamp >= :startDate 
        AND a.actionTimestamp <= :endDate 
        ORDER BY a.actionTimestamp DESC
        """)
    Page<CommitteeAuditLogEntity> findByActionTimestampBetween(
        @Param("startDate") OffsetDateTime startDate,
        @Param("endDate") OffsetDateTime endDate,
        Pageable pageable);

    @Query("""
        SELECT a FROM CommitteeAuditLogEntity a 
        WHERE a.actionType = :actionType 
        ORDER BY a.actionTimestamp DESC
        """)
    Page<CommitteeAuditLogEntity> findByActionType(
        @Param("actionType") String actionType, Pageable pageable);

    @Query("""
        SELECT a FROM CommitteeAuditLogEntity a 
        WHERE a.actionType IN :actionTypes 
        ORDER BY a.actionTimestamp DESC
        """)
    Page<CommitteeAuditLogEntity> findByActionTypeIn(
        @Param("actionTypes") List<String> actionTypes,
        Pageable pageable);

    @Query("""
        SELECT a FROM CommitteeAuditLogEntity a 
        WHERE a.committeeCaseEntity.caseId = :caseId AND a.actionType = :actionType 
        ORDER BY a.actionTimestamp DESC
        """)
    Page<CommitteeAuditLogEntity> findByCaseIdAndActionType(
        @Param("caseId") UUID caseId,
        @Param("actionType") String actionType,
        Pageable pageable);

    long countByCommitteeCaseEntityCaseId(UUID caseId);

    long countByActionType(String actionType);

    long countByActorId(UUID actorId);

    @Query("""
        SELECT a FROM CommitteeAuditLogEntity a 
        WHERE a.committeeCaseEntity.caseId = :caseId 
        ORDER BY a.actionTimestamp DESC 
        LIMIT 1
        """)
    CommitteeAuditLogEntity findLatestAuditLogByCaseId(@Param("caseId") UUID caseId);

    @Query("""
        SELECT a FROM CommitteeAuditLogEntity a 
        WHERE a.committeeCaseEntity.caseId = :caseId 
        AND a.actionTimestamp >= :startDate 
        AND a.actionTimestamp <= :endDate 
        ORDER BY a.actionTimestamp DESC
        """)
    List<CommitteeAuditLogEntity> findByCaseIdAndTimestampRange(
        @Param("caseId") UUID caseId,
        @Param("startDate") OffsetDateTime startDate,
        @Param("endDate") OffsetDateTime endDate);

    @Query("""
        SELECT a FROM CommitteeAuditLogEntity a
        WHERE (:actionType IS NULL OR a.actionType = :actionType)
        AND (:actorId IS NULL OR a.actorId = :actorId)
        AND (:taxCenter IS NULL OR :taxCenter = '' OR a.committeeCaseEntity.taxCenter = :taxCenter)
        ORDER BY a.actionTimestamp DESC
        """)
    Page<CommitteeAuditLogEntity> findGlobalLogs(
        @Param("actionType") String actionType,
        @Param("actorId") UUID actorId,
        @Param("taxCenter") String taxCenter,
        Pageable pageable);
}
