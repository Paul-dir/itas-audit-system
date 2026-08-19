package mor.itas.application.port.outboundport.repositoryport.ap;

import mor.itas.domain.model.ap.RegionalDeployment;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Regional Deployment Repository Port (Driven Port)
 * 
 * Defines contract for persisting regional deployment tracking.
 * Domain services depend on this interface.
 * 
 * Hexagonal/DDD: Outbound port = Interface to external systems (database, services)
 */
public interface RegionalDeploymentPort {

    /**
     * Save a deployment entry
     */
    RegionalDeployment save(RegionalDeployment deployment);

    /**
     * Get deployment for a plan and region
     */
    Optional<RegionalDeployment> findByPlanIdAndRegionId(UUID planId, String regionId);

    /**
     * Get all deployments for a plan
     */
    List<RegionalDeployment> findByPlanId(UUID planId);

    /**
     * Count deployments for a plan
     */
    long countByPlanId(UUID planId);

    /**
     * Check if all regions have deployed
     */
    boolean haveAllRegionsDeployed(UUID planId);
}
