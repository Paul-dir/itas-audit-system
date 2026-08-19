package mor.itas.application.port.inboundport.ap;

import java.util.UUID;

/**
 * ReviewAndApproveByManagementPort - Inbound Port
 * 
 * Contract for Senior Management to review and approve plan.
 * 
 * Use Cases:
 * - Senior Management reviews plan
 * - APPROVE: Plan finalized and ready for distribution
 * - REJECT: Send back to Director for re-amendment
 */
@FunctionalInterface
public interface ReviewAndApproveByManagementPort {
    
    /**
     * Approve plan by Senior Management
     * 
     * @param planId the plan ID
     * @param decision APPROVE or REJECT
     * @param managementId who is making the decision
     * @param managementComment final comments
     * @throws IllegalArgumentException if plan not found
     * @throws IllegalStateException if plan not in proper state
     */
    void reviewAndApprove(
        UUID planId,
        String decision,
        String managementId,
        String managementComment);
}
