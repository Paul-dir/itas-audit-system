package mor.itas.application.port.outboundport.repositoryport.ap;

import mor.itas.domain.model.ap.RegionalFeedback;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Regional Feedback Repository Port (Driven Port)
 * 
 * Defines contract for persisting regional feedback.
 * Domain services depend on this interface.
 * 
 * Hexagonal/DDD: Outbound port = Interface to external systems (database, services)
 */
public interface RegionalFeedbackPort {

    /**
     * Save a regional feedback entry
     */
    RegionalFeedback save(RegionalFeedback feedback);

    /**
     * Get feedback for a plan and region
     */
    Optional<RegionalFeedback> findByPlanIdAndRegionId(UUID planId, String regionId);

    /**
     * Get all feedback for a plan
     */
    List<RegionalFeedback> findByPlanId(UUID planId);

    /**
     * Check if all regions have submitted feedback
     */
    boolean hasAllRegionsFeedback(UUID planId);
}
