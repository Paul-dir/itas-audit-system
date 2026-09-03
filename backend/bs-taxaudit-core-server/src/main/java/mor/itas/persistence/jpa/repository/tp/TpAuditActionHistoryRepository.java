package mor.itas.persistence.jpa.repository.tp;

import mor.itas.persistence.jpa.entity.tp.TpAuditActionHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface TpAuditActionHistoryRepository extends JpaRepository<TpAuditActionHistoryEntity, UUID> {
    List<TpAuditActionHistoryEntity> findByAuditCaseIdOrderByActionTimestampAsc(UUID auditCaseId);
    List<TpAuditActionHistoryEntity> findByAuditCaseIdAndActionPhaseOrderByActionTimestampAsc(UUID auditCaseId, String phase);
    List<TpAuditActionHistoryEntity> findByActorIdOrderByActionTimestampDesc(String actorId);
}
