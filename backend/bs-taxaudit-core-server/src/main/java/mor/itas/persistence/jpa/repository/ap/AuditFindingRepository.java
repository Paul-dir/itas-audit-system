package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.AuditFindingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface AuditFindingRepository extends JpaRepository<AuditFindingEntity, UUID> {
    List<AuditFindingEntity> findByCaseIdOrderByCreatedAtDesc(UUID caseId);
    int countByCaseIdAndStatus(UUID caseId, String status);
}
