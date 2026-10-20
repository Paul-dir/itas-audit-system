package mor.itas.persistence.jpa.repository.tp;

import mor.itas.persistence.jpa.entity.tp.TpInformationRequestLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface TpInformationRequestLogRepository extends JpaRepository<TpInformationRequestLogEntity, UUID> {
    List<TpInformationRequestLogEntity> findByAuditCaseIdOrderByCreatedAtDesc(UUID auditCaseId);
    List<TpInformationRequestLogEntity> findByAuditCaseIdAndStatus(UUID auditCaseId, String status);

    /**
     * For the overdue-monitoring scheduled job: finds all ISSUED requests
     * whose deadline has passed and are not yet marked overdue.
     */
    @Query("SELECT e FROM TpInformationRequestLogEntity e WHERE e.status = 'ISSUED' AND e.deadlineDate < :today AND e.isOverdue = false")
    List<TpInformationRequestLogEntity> findOverdueRequests(LocalDate today);
}
