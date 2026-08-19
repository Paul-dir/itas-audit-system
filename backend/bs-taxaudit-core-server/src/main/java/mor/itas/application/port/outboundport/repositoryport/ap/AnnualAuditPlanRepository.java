package mor.itas.application.port.outboundport.repositoryport.ap;

import mor.itas.domain.model.ap.AnnualAuditPlan;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * AnnualAuditPlanRepository - Outbound Port (Repository Pattern)
 * Defines persistence operations for annual audit plans
 */
public interface AnnualAuditPlanRepository {

    /**
     * Save a new annual audit plan
     * @param plan the plan to save
     * @return the saved plan
     */
    AnnualAuditPlan save(AnnualAuditPlan plan);

    /**
     * Find a plan by ID
     * @param id the plan ID
     * @return optional containing the plan if found
     */
    Optional<AnnualAuditPlan> findById(UUID id);

    /**
     * Update an existing plan
     * @param plan the plan to update
     * @return the updated plan
     */
    AnnualAuditPlan update(AnnualAuditPlan plan);

    /**
     * Find all plans by status
     * @param status the plan status
     * @return list of plans with matching status
     */
    List<AnnualAuditPlan> findByStatus(String status);

    /**
     * Find all plans by fiscal year
     * @param year the fiscal year
     * @return list of plans for that year
     */
    List<AnnualAuditPlan> findByYear(Integer year);

    /**
     * Find all plans by status and year
     * @param status the plan status
     * @param year the fiscal year
     * @return list of plans matching both criteria
     */
    List<AnnualAuditPlan> findByStatusAndYear(String status, Integer year);
}
