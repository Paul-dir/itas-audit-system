package mor.itas.persistence.jpa.repository.tp;

import mor.itas.persistence.jpa.entity.tp.TpWorkingHypothesisEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TpWorkingHypothesisRepository extends JpaRepository<TpWorkingHypothesisEntity, UUID> {
    Optional<TpWorkingHypothesisEntity> findByAuditCaseId(UUID auditCaseId);
}
