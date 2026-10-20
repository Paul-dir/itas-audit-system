package mor.itas.persistence.jpa.repository.tp;

import mor.itas.persistence.jpa.entity.tp.TpAnalysisDataEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TpAnalysisDataRepository extends JpaRepository<TpAnalysisDataEntity, UUID> {
    Optional<TpAnalysisDataEntity> findByAuditCaseId(UUID auditCaseId);
}
