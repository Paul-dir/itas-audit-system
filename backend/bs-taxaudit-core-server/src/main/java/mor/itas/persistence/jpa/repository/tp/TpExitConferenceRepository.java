package mor.itas.persistence.jpa.repository.tp;

import mor.itas.persistence.jpa.entity.tp.TpExitConferenceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TpExitConferenceRepository extends JpaRepository<TpExitConferenceEntity, UUID> {
    Optional<TpExitConferenceEntity> findByAuditCaseId(UUID auditCaseId);
}
