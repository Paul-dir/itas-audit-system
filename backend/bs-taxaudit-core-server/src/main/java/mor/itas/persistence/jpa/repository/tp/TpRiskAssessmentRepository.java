package mor.itas.persistence.jpa.repository.tp;

import mor.itas.persistence.jpa.entity.tp.TpRiskAssessmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TpRiskAssessmentRepository extends JpaRepository<TpRiskAssessmentEntity, UUID> {
    Optional<TpRiskAssessmentEntity> findByAuditCaseId(UUID auditCaseId);
}
