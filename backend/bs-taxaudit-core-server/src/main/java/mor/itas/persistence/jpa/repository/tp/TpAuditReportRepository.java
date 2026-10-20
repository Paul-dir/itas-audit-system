package mor.itas.persistence.jpa.repository.tp;

import mor.itas.persistence.jpa.entity.tp.TpAuditReportEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TpAuditReportRepository extends JpaRepository<TpAuditReportEntity, UUID> {
    List<TpAuditReportEntity> findByAuditCaseIdOrderByVersionDesc(UUID auditCaseId);

    @Query("SELECT r FROM TpAuditReportEntity r WHERE r.auditCaseId = :auditCaseId ORDER BY r.version DESC LIMIT 1")
    Optional<TpAuditReportEntity> findLatestByAuditCaseId(UUID auditCaseId);
}
