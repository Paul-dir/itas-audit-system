package mor.itas.application.port.inboundport.ap;

import java.util.Map;
import java.util.UUID;

/**
 * AllocateToTaxCentersPort - Inbound Port
 * 
 * Defines the contract for allocating a regional plan to tax centers.
 */
public interface AllocateToTaxCentersPort {
    
    /**
     * Allocate a plan to tax centers in a region
     * 
     * @param planId the plan ID
     * @param regionId the region code
     * @param taxCenterAllocations allocation by tax center and audit type
     *        Structure: { taxCenterId: { auditTypeId: count } }
     * @param regionalDirectorId the regional director's user ID
     */
    void allocateToTaxCenters(
        UUID planId,
        String regionId,
        Map<String, Map<String, Integer>> taxCenterAllocations,
        String regionalDirectorId);
}
