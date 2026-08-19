package mor.itas.application.port.outboundport.repositoryport.ap;

import mor.itas.domain.model.ap.PlanRevision;
import java.util.List;
import java.util.UUID;

/**
 * Plan Revision Repository Port (Driven Port)
 * 
 * Defines contract for persisting plan revisions/amendments.
 * Domain services depend on this interface.
 * 
 * Hexagonal/DDD: Outbound port = Interface to external systems (database, services)
 */
public interface PlanRevisionPort {

    /**
     * Save a revision entry
     */
    PlanRevision save(PlanRevision revision);

    /**
     * Get all revisions for a plan
     */
    List<PlanRevision> findByPlanId(UUID planId);

    /**
     * Get revisions filtered by type
     */
    List<PlanRevision> findByPlanIdAndType(UUID planId, String revisionType);
}
