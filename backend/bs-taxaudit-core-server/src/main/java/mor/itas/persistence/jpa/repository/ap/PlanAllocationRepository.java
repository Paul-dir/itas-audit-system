package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.PlanAllocationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * PlanAllocationRepository - Data access for plan allocations
 * 
 * Handles both:
 * - Regional allocations: tax_center_code IS NULL
 * - Tax center allocations: tax_center_code IS NOT NULL
 */
@Repository
public interface PlanAllocationRepository extends JpaRepository<PlanAllocationEntity, UUID> {

    /**
     * Delete all tax center allocations for a plan+region
     * Used when regional director re-distributes allocations
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM PlanAllocationEntity p WHERE p.annualPlan.id = :planId AND p.regionCode = :regionCode AND p.taxCenterCode IS NOT NULL")
    void deleteByPlanIdAndRegionCodeAndTaxCenterCodeNotNull(
        @Param("planId") UUID planId,
        @Param("regionCode") String regionCode);

    /**
     * Find all allocations for a specific tax center
     * Used by tax center dashboard to show what was allocated to them
     */
    List<PlanAllocationEntity> findByTaxCenterCode(String taxCenterCode);

    /**
     * Find all allocations for a plan across all tax centers
     */
    List<PlanAllocationEntity> findByAnnualPlanId(UUID planId);

    /**
     * Find allocations by plan and region (for both regional and tax center level)
     */
    List<PlanAllocationEntity> findByAnnualPlanIdAndRegionCode(UUID planId, String regionCode);

    /**
     * Find allocation for a specific tax center in a plan
     */
    List<PlanAllocationEntity> findByAnnualPlanIdAndTaxCenterCode(UUID planId, String taxCenterCode);
}
