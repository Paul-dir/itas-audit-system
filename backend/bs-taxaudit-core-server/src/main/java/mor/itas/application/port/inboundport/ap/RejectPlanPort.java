package mor.itas.application.port.inboundport.ap;

import java.util.UUID;

/**
 * RejectPlanPort - Inbound Port
 * 
 * Defines the contract for rejecting plans.
 */
public interface RejectPlanPort {
    
    /**
     * Reject a plan
     * 
     * @param planId the plan ID
     * @param reason the rejection reason
     * @param directorId the director's user ID
     */
    void rejectPlan(UUID planId, String reason, String directorId);
}
