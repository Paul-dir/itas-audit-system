package mor.itas.application.port.inboundport.ap;

import java.util.UUID;

/**
 * ResubmitAmendedPlanPort - Inbound Port
 * 
 * Contract for Planning Team to resubmit amended plan to Director.
 * 
 * Use Cases:
 * - Planning Team submits amended plan after editing
 * - Director can then APPROVE or REQUEST ANOTHER AMENDMENT
 * - Supports multiple amendment rounds
 */
@FunctionalInterface
public interface ResubmitAmendedPlanPort {
    
    /**
     * Resubmit amended plan to Director
     * 
     * @param planId the plan ID
     * @param amendmentRound which amendment round being submitted
     * @param planningTeamComments optional comments from planning team
     * @param planningTeamId who is resubmitting
     * @throws IllegalArgumentException if plan not found
     * @throws IllegalStateException if plan not in proper state
     */
    void resubmitAmendedPlan(
        UUID planId,
        Integer amendmentRound,
        String planningTeamComments,
        String planningTeamId);
}
