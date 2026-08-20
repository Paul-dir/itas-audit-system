package mor.itas.application.port.inboundport.ap;

import java.util.UUID;

/**
 * ApprovePlanPort - Inbound Port
 * 
 * Defines the contract for approving plans.
 */
public interface ApprovePlanPort {
    
    /**
     * Approve a plan
     * 
     * @param planId the plan ID
     * @param directorId the director's user ID
     */
    void approvePlan(UUID planId, String directorId);
}
