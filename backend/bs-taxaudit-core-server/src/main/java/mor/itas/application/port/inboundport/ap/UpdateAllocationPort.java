package mor.itas.application.port.inboundport.ap;

import java.util.UUID;

/**
 * UpdateAllocationPort - Inbound Port
 * 
 * Defines the contract for updating tax center allocations.
 */
public interface UpdateAllocationPort {
    
    /**
     * Update a tax center's allocation for a specific audit type
     * 
     * @param allocationId the allocation ID
     * @param auditTypeId the audit type
     * @param newCount the new case count
     * @param regionalDirectorId the regional director's user ID
     */
    void updateAllocation(
        UUID allocationId,
        String auditTypeId,
        Integer newCount,
        String regionalDirectorId);
}
