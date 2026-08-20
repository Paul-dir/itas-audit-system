package mor.itas.application.port.outboundport.repositoryport.ap;

import mor.itas.domain.model.ap.PlanTimeline;
import java.util.List;
import java.util.UUID;

/**
 * Plan Timeline Repository Port (Driven Port)
 * 
 * Defines contract for persisting plan timeline events.
 * Domain services depend on this interface.
 * 
 * Hexagonal/DDD: Outbound port = Interface to external systems (database, services)
 */
public interface PlanTimelinePort {

    /**
     * Save a timeline entry
     */
    PlanTimeline save(PlanTimeline timeline);

    /**
     * Get all timeline entries for a plan
     */
    List<PlanTimeline> findByPlanId(UUID planId);
}
