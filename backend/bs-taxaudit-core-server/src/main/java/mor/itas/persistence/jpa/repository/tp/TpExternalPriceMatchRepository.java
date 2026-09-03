package mor.itas.persistence.jpa.repository.tp;

import mor.itas.persistence.jpa.entity.tp.TpExternalPriceMatchEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface TpExternalPriceMatchRepository extends JpaRepository<TpExternalPriceMatchEntity, UUID> {
    List<TpExternalPriceMatchEntity> findByAuditCaseIdOrderByGeneratedAtDesc(UUID auditCaseId);
    List<TpExternalPriceMatchEntity> findByAuditCaseIdAndDiscrepancyFlagTrue(UUID auditCaseId);
    List<TpExternalPriceMatchEntity> findByAuditCaseIdAndValidationStatus(UUID auditCaseId, String validationStatus);
}
