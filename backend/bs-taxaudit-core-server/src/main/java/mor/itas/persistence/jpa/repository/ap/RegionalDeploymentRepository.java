package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.RegionalDeploymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * RegionalDeploymentRepository - Data access for regional plan deployments
 * 
 * Tracks which regions have received which plans from the director.
 * This controls regional access to plans.
 */
@Repository
public interface RegionalDeploymentRepository extends JpaRepository<RegionalDeploymentEntity, UUID> {

    /**
     * Find all deployments for a specific plan
     */
    List<RegionalDeploymentEntity> findByPlanId(UUID planId);

    /**
     * Find deployment for a specific plan and region
     */
    Optional<RegionalDeploymentEntity> findByPlanIdAndRegionCode(UUID planId, String regionCode);

    /**
     * Find all plans deployed to a specific region
     */
    List<RegionalDeploymentEntity> findByRegionCode(String regionCode);

    /**
     * Find all plans deployed by a specific director
     */
    List<RegionalDeploymentEntity> findByDirectorId(String directorId);

    /**
     * Find all deployments for a plan that have been acknowledged by region
     */
    @Query("SELECT rd FROM RegionalDeploymentEntity rd WHERE rd.planId = :planId AND rd.acknowledgedAt IS NOT NULL")
    List<RegionalDeploymentEntity> findAcknowledgedDeploymentsByPlanId(@Param("planId") UUID planId);

    /**
     * Check if a plan has been deployed to all required regions
     */
    @Query("SELECT COUNT(rd) FROM RegionalDeploymentEntity rd WHERE rd.planId = :planId")
    long countDeploymentsForPlan(@Param("planId") UUID planId);

    /**
     * Find plans accessible to a specific region that haven't been acknowledged yet
     */
    @Query("SELECT rd FROM RegionalDeploymentEntity rd WHERE rd.regionCode = :regionCode AND rd.acknowledgedAt IS NULL " +
           "ORDER BY rd.sentAt DESC")
    List<RegionalDeploymentEntity> findUnacknowledgedDeploymentsForRegion(@Param("regionCode") String regionCode);

    @Modifying
    @Query(value = "DELETE FROM ap_regional_deployments WHERE plan_id = :planId", nativeQuery = true)
    int deleteByPlanIdNative(@Param("planId") UUID planId);
}
