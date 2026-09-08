package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.DocumentRequestRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface DocumentRequestRecordRepository extends JpaRepository<DocumentRequestRecordEntity, UUID> {
    List<DocumentRequestRecordEntity> findByCaseIdOrderByCreatedAtDesc(UUID caseId);
}
