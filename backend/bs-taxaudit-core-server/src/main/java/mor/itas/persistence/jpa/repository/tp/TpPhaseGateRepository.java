package mor.itas.persistence.jpa.repository.tp;

import mor.itas.persistence.jpa.entity.tp.TpPhaseGateEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TpPhaseGateRepository extends JpaRepository<TpPhaseGateEntity, UUID> {
    List<TpPhaseGateEntity> findByAuditCaseIdOrderByCreatedAtAsc(UUID auditCaseId);
    Optional<TpPhaseGateEntity> findByAuditCaseIdAndPhaseId(UUID auditCaseId, String phaseId);
}
