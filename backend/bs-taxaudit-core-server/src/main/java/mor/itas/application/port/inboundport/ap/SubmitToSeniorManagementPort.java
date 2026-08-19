package mor.itas.application.port.inboundport.ap;

import java.util.UUID;

/**
 * SubmitToSeniorManagementPort - Inbound Port
 * 
 * Contract for Director to submit final amended plan to Senior Management.
 * 
 * Use Cases:
 * - Director submits finalized plan to Senior Management
 * - Senior Management reviews and makes final approval decision
 */
@FunctionalInterface
public interface SubmitToSeniorManagementPort {
    
    /**
     * Submit plan to Senior Management for final approval
     * 
     * @param planId the plan ID
     * @param directorId who is submitting
     * @param directorComment Director's final recommendation
     * @throws IllegalArgumentException if plan not found
     * @throws IllegalStateException if plan not in proper state
     */
    void submitToSeniorManagement(
        UUID planId,
        String directorId,
        String directorComment);
}
