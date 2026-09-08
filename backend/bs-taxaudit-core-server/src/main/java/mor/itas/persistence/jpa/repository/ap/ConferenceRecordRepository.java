package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.ConferenceRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ConferenceRecordRepository extends JpaRepository<ConferenceRecordEntity, UUID> {
    List<ConferenceRecordEntity> findByCaseIdOrderByCreatedAtDesc(UUID caseId);
    ConferenceRecordEntity findFirstByCaseIdOrderByCreatedAtDesc(UUID caseId);
}
