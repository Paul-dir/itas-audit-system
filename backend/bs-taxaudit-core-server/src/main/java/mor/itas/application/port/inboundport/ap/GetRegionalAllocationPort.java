package mor.itas.application.port.inboundport.ap;

import mor.itas.domain.model.ap.RegionalAllocationDetail;

import java.util.UUID;

/**
 * GetRegionalAllocationPort - Inbound Port
 * 
 * Defines the contract for retrieving regional allocation data.
 */
public interface GetRegionalAllocationPort {
    
    /**
     * Get regional allocation for a specific plan
     * 
     * @param planId the plan ID
     * @return the regional allocation details
     */
    RegionalAllocationDetail getRegionalAllocation(UUID planId);
}
