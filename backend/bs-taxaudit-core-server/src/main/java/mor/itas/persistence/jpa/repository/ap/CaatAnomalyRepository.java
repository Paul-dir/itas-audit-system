package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.CaatAnomalyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface CaatAnomalyRepository extends JpaRepository<CaatAnomalyEntity, UUID> {
    List<CaatAnomalyEntity> findByCaseIdOrderByCreatedAtDesc(UUID caseId);
}
