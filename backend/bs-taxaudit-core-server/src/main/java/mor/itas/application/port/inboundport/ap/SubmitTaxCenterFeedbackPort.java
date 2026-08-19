package mor.itas.application.port.inboundport.ap;

import java.util.Map;
import java.util.UUID;

/**
 * SubmitTaxCenterFeedbackPort - Inbound Port
 * 
 * Contract for Tax Center to submit capacity feedback on their allocation.
 * 
 * Use Cases:
 * - Tax Center assesses their capacity
 * - Submits feedback with requested vs accepted counts
 * - Provides justification for gaps
 */
@FunctionalInterface
public interface SubmitTaxCenterFeedbackPort {
    
    /**
     * Submit feedback for a tax center allocation
     * 
     * @param planId the plan ID
     * @param taxCenterId the tax center ID
     * @param regionId the region ID
     * @param feedbackByAuditType map of auditTypeId → {requested, accepted, justification}
     * @param submittedBy who submitted (Tax Center Manager ID)
     * @throws IllegalArgumentException if plan or tax center not found
     * @throws IllegalStateException if plan not in proper state
     * @throws IllegalArgumentException if feedback validation fails
     */
    void submitFeedback(
        UUID planId,
        String taxCenterId,
        String regionId,
        Map<String, Map<String, Object>> feedbackByAuditType,
        String submittedBy);
}
