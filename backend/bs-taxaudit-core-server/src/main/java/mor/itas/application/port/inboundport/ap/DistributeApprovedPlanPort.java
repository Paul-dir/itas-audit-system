package mor.itas.application.port.inboundport.ap;

import java.util.UUID;

/**
 * DistributeApprovedPlanPort - Inbound Port
 * 
 * Contract for distributing approved plan TOP-DOWN:
 * 1. Director sends approved plan to Regional Directors
 * 2. Regional Directors distribute to Tax Centers
 * 3. Tax Centers receive their final allocated plan
 * 
 * Use Cases:
 * - Plan distribution cascade (top-to-bottom)
 * - Each level sends to lower level
 */
@FunctionalInterface
public interface DistributeApprovedPlanPort {
    
    /**
     * Distribute approved plan to regional directors
     * 
     * @param planId the plan ID
     * @param directorId who is sending
     * @throws IllegalArgumentException if plan not found
     * @throws IllegalStateException if plan not in proper state
     */
    void distributeToRegions(UUID planId, String directorId);
}
