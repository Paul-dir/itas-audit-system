package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.AuditDocumentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface AuditDocumentRepository extends JpaRepository<AuditDocumentEntity, UUID> {
    List<AuditDocumentEntity> findByCaseIdOrderByCreatedAtDesc(UUID caseId);
    List<AuditDocumentEntity> findByRequestId(UUID requestId);
}
