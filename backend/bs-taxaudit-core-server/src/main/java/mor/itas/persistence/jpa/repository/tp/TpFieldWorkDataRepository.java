package mor.itas.persistence.jpa.repository.tp;

import mor.itas.persistence.jpa.entity.tp.TpFieldWorkDataEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TpFieldWorkDataRepository extends JpaRepository<TpFieldWorkDataEntity, UUID> {
    Optional<TpFieldWorkDataEntity> findByAuditCaseId(UUID auditCaseId);
}
