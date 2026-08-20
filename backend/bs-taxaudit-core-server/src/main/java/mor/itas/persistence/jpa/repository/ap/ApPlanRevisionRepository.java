package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.ApPlanRevisionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ApPlanRevisionRepository extends JpaRepository<ApPlanRevisionEntity, UUID> {
    List<ApPlanRevisionEntity> findByPlanIdOrderByCreatedAtDesc(UUID planId);
}
