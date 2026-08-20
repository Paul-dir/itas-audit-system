package mor.itas.application.port.inboundport.ap;

import mor.itas.domain.model.ap.RegionalAllocationDetail;

import java.util.UUID;

/**
 * GetTaxCenterAllocationPort - Inbound Port
 * 
 * Contract for Tax Center to retrieve their allocation from Regional Director.
 * 
 * Use Cases:
 * - Tax Center views what they've been allocated
 * - Shows by audit type (desk: 1000, field: 800, etc.)
 * - Used before submitting feedback
 */
@FunctionalInterface
public interface GetTaxCenterAllocationPort {
    
    /**
     * Get tax center's allocation for a plan
     * 
     * @param planId the plan ID
     * @param taxCenterId the tax center ID
     * @return allocation details
     * @throws IllegalArgumentException if allocation not found
     * @throws IllegalStateException if invalid state
     */
    RegionalAllocationDetail getTaxCenterAllocation(UUID planId, String taxCenterId);
}
