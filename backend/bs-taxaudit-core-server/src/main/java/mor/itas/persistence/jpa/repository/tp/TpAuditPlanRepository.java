package mor.itas.persistence.jpa.repository.tp;

import mor.itas.persistence.jpa.entity.tp.TpAuditPlanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TpAuditPlanRepository extends JpaRepository<TpAuditPlanEntity, UUID> {
    Optional<TpAuditPlanEntity> findByAuditCaseId(UUID auditCaseId);
}
