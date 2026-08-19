package mor.itas.application.port.inboundport.ap;

import java.util.Map;
import java.util.UUID;

/**
 * GetAmendmentFeedbackPort - Inbound Port
 * 
 * Contract for Planning Team to retrieve amendment request from Director.
 * 
 * Use Cases:
 * - Planning Team views Director's feedback request for amendments
 * - Shows regional capacity constraints that triggered amendment request
 * - Used before editing plan allocations
 */
@FunctionalInterface
public interface GetAmendmentFeedbackPort {
    
    /**
     * Get amendment request with regional feedback
     * 
     * @param planId the plan ID
     * @return amendment feedback map with regional capacity constraints
     * @throws IllegalArgumentException if plan not found
     * @throws IllegalStateException if no amendment request exists
     */
    Map<String, Object> getAmendmentFeedback(UUID planId);
}
