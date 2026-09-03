package mor.itas.persistence.jpa.repository.tp;

import mor.itas.persistence.jpa.entity.tp.TpObjectionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TpObjectionRepository extends JpaRepository<TpObjectionEntity, UUID> {
    List<TpObjectionEntity> findByAuditCaseIdOrderByCreatedAtDesc(UUID auditCaseId);
}
