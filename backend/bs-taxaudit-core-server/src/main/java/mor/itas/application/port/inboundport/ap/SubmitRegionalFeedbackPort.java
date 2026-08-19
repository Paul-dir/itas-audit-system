package mor.itas.application.port.inboundport.ap;

import java.util.Map;
import java.util.UUID;

/**
 * SubmitRegionalFeedbackPort - Inbound Port
 * 
 * Contract for Regional Director to submit aggregated feedback to Director.
 * 
 * Use Cases:
 * - Regional Director aggregates all tax center feedback
 * - Regional Director submits aggregated feedback with analysis to Director
 */
@FunctionalInterface
public interface SubmitRegionalFeedbackPort {
    
    /**
     * Submit aggregated regional feedback
     * 
     * @param planId the plan ID
     * @param regionId the region ID
     * @param aggregatedFeedback aggregated feedback data by audit type
     * @param regionalDirectorId who submitted
     * @throws IllegalArgumentException if plan or region not found
     * @throws IllegalStateException if plan not in proper state
     * @throws IllegalArgumentException if feedback validation fails
     */
    void submitAggregatedFeedback(
        UUID planId,
        String regionId,
        Map<String, Map<String, Object>> aggregatedFeedback,
        String regionalDirectorId);
}
