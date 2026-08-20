package mor.itas.application.port.outboundport.repositoryport.ap;

import mor.itas.domain.model.ap.AnnualAuditPlan;
import mor.itas.domain.model.ap.PlanStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * AnnualAuditPlanRepositoryPort - Outbound port for Annual Audit Plan persistence
 * Defines contract for accessing and persisting Annual Audit Plans
 */
public interface AnnualAuditPlanRepositoryPort {

    /**
     * Save or update an Annual Audit Plan
     */
    AnnualAuditPlan save(AnnualAuditPlan plan);

    /**
     * Find plan by ID
     */
    Optional<AnnualAuditPlan> findById(UUID planId);

    /**
     * Find all plans
     */
    List<AnnualAuditPlan> findAll();

    /**
     * Find plans by status
     */
    List<AnnualAuditPlan> findByStatus(PlanStatus status);

    /**
     * Find plans by year
     */
    List<AnnualAuditPlan> findByYear(Integer year);

    /**
     * Find plans by status and year
     */
    List<AnnualAuditPlan> findByStatusAndYear(PlanStatus status, Integer year);

    /**
     * Find plans pending Director approval
     */
    List<AnnualAuditPlan> findPendingDirectorApproval();

    /**
     * Find plans pending Regional Director approval
     */
    List<AnnualAuditPlan> findPendingRegionalApproval();

    /**
     * Find plans sent to Tax Centers
     */
    List<AnnualAuditPlan> findSentToTaxCenters();

    /**
     * Delete plan by ID
     */
    void delete(UUID planId);

    /**
     * Count total plans
     */
    long count();

    /**
     * Check if a plan already exists for the given year
     * Year is unique - only one plan per year allowed
     */
    boolean existsByYear(Integer year);

    /**
     * Check if a plan already exists for the given year and name
     */
    boolean existsByYearAndName(Integer year, String name);
}
