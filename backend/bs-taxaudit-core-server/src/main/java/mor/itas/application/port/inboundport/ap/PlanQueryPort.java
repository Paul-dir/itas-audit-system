package mor.itas.application.port.inboundport.ap;

import mor.itas.domain.aggregate.ap.AnnualAuditPlan;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Plan Query Inbound Port (Driving Port)
 * 
 * Defines the contract for all plan read/query operations.
 * REST Controllers depend on this interface, not on use cases directly.
 * This is the boundary between external world (API) and application.
 * 
 * Hexagonal/DDD: Inbound port = Use case interface exposed to the outside world
 */
public interface PlanQueryPort {

    /**
     * Get plan by ID
     */
    AnnualAuditPlan getPlanById(UUID planId);

    /**
     * Get all plans with optional status filter
     */
    List<AnnualAuditPlan> getPlans(String statusFilter, Integer fiscalYearFilter, int page, int size);

    /**
     * Get plan statistics
     */
    Map<String, Long> getPlanStatistics();
}
