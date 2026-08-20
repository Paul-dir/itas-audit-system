package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.ApPlanTimelineEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ApPlanTimelineRepository extends JpaRepository<ApPlanTimelineEntity, UUID> {
    List<ApPlanTimelineEntity> findByPlanIdOrderByEventTimestampDesc(UUID planId);
}
