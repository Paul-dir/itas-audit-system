package mor.itas.application.port.inboundport.ap;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * GetTaxCenterFeedbackPort - Inbound Port
 * 
 * Contract for Regional Director to retrieve all tax center feedback for a region.
 * 
 * Use Cases:
 * - Regional Director views all tax center feedback submitted
 * - Used before aggregating and submitting regional feedback to Director
 */
@FunctionalInterface
public interface GetTaxCenterFeedbackPort {
    
    /**
     * Get all tax center feedback for a region
     * 
     * @param planId the plan ID
     * @param regionId the region ID
     * @return list of feedback by tax center (each containing all audit types)
     * @throws IllegalArgumentException if plan or region not found
     * @throws IllegalStateException if invalid state
     */
    List<Map<String, Object>> getTaxCenterFeedback(UUID planId, String regionId);
}
