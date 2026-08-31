package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.RegionalFeedbackEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * RegionalFeedbackRepository - Data access for regional feedback
 * 
 * Tracks regional director feedback submissions on plans.
 * ONE-TIME submission per region per plan (enforced by unique constraint).
 */
@Repository
public interface RegionalFeedbackRepository extends JpaRepository<RegionalFeedbackEntity, UUID> {

    /**
     * Find feedback for a specific plan and region
     * Returns Optional (one-time only - should have at most 1 record)
     */
    Optional<RegionalFeedbackEntity> findByPlanIdAndRegionId(UUID planId, String regionId);

    /**
     * Find all feedback for a plan across all regions
     */
    List<RegionalFeedbackEntity> findByPlanId(UUID planId);

    /**
     * Find all feedback submitted by a specific director
     */
    List<RegionalFeedbackEntity> findBySubmittedBy(String regionalDirectorId);

    /**
     * Count feedback submissions for a plan
     */
    long countByPlanId(UUID planId);
}
