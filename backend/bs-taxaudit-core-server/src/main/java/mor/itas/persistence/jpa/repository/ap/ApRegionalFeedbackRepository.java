package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.ApRegionalFeedbackEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApRegionalFeedbackRepository extends JpaRepository<ApRegionalFeedbackEntity, UUID> {
    List<ApRegionalFeedbackEntity> findByPlanId(UUID planId);
    
    Optional<ApRegionalFeedbackEntity> findByPlanIdAndRegionId(UUID planId, String regionId);
    
    List<ApRegionalFeedbackEntity> findByRegionId(String regionId);
}
