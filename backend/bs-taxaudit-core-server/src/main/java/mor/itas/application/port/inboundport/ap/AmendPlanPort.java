package mor.itas.application.port.inboundport.ap;

import java.util.Map;
import java.util.UUID;

/**
 * AmendPlanPort - Inbound Port
 * 
 * Contract for Planning Team to edit and amend plan allocations.
 * 
 * Use Cases:
 * - Planning Team edits plan allocations based on Director's feedback
 * - Can adjust any region × audit type allocation
 * - Must maintain reasonable strategy and validation
 */
@FunctionalInterface
public interface AmendPlanPort {
    
    /**
     * Amend plan allocations
     * 
     * @param planId the plan ID
     * @param amendmentRound which amendment round (1, 2, 3, etc.)
     * @param plannedChanges map of region/auditType → newCount
     * @param planningTeamId who is amending
     * @throws IllegalArgumentException if plan not found
     * @throws IllegalStateException if plan not in proper state
     * @throws IllegalArgumentException if validation fails
     */
    void amendPlan(
        UUID planId,
        Integer amendmentRound,
        Map<String, Map<String, Integer>> plannedChanges,
        String planningTeamId);
}
