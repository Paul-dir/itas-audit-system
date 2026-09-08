package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.WorkingPaperEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface WorkingPaperRepository extends JpaRepository<WorkingPaperEntity, UUID> {
    List<WorkingPaperEntity> findByCaseIdOrderByCreatedAtDesc(UUID caseId);
}
