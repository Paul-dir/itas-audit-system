package mor.itas.application.port.inboundport.ap;

import java.util.UUID;

/**
 * RequestPlanAmendmentPort - Inbound Port
 * 
 * Defines the contract for requesting plan amendments.
 */
public interface RequestPlanAmendmentPort {
    
    /**
     * Request amendments to a plan
     * 
     * @param planId the plan ID
     * @param feedback the director's feedback/requirements
     * @param directorId the director's user ID
     */
    void requestAmendment(UUID planId, String feedback, String directorId);
}
