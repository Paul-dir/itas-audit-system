package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.RegionalTcDeploymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * RegionalTcDeploymentRepository - Data access for regional tax center deployments
 * 
 * Tracks when regional directors deploy plans to their tax centers
 */
@Repository
public interface RegionalTcDeploymentRepository extends JpaRepository<RegionalTcDeploymentEntity, UUID> {

    /**
     * Find all deployments for a plan
     */
    List<RegionalTcDeploymentEntity> findByPlanId(UUID planId);

    /**
     * Find deployments for specific region
     */
    List<RegionalTcDeploymentEntity> findByRegionId(String regionId);

    /**
     * Find specific deployment by plan and region
     */
    Optional<RegionalTcDeploymentEntity> findByPlanIdAndRegionId(UUID planId, String regionId);

    /**
     * Delete deployments for a specific plan and region using a JPQL query
     * Used to allow regional director to re-distribute plans
     * Must use @Modifying to execute DELETE in transaction
     */
    @Modifying
    @Query("DELETE FROM RegionalTcDeploymentEntity d WHERE d.planId = :planId AND d.regionId = :regionId")
    void deleteByPlanIdAndRegionId(@Param("planId") UUID planId, @Param("regionId") String regionId);
}
