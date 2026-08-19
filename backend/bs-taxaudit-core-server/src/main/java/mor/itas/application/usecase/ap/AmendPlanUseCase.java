package mor.itas.application.usecase.ap;

import mor.itas.application.port.inboundport.ap.AmendPlanPort;
import mor.itas.application.port.outboundport.repositoryport.ap.AnnualAuditPlanRepository;
import mor.itas.domain.model.ap.AnnualAuditPlan;
import mor.itas.domain.service.ap.PlanAmendmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * AmendPlanUseCase - Use Case
 * 
 * Implements AmendPlanPort.
 * 
 * Processes Planning Team's plan amendments.
 * 
 * Flow:
 * 1. Validate plan exists and is in proper state
 * 2. Validate amendment changes
 * 3. Apply amendments to plan
 * 4. Store amendment history
 */
@Service
@RequiredArgsConstructor
public class AmendPlanUseCase implements AmendPlanPort {
    
    private final AnnualAuditPlanRepository repository;
    private final PlanAmendmentService amendmentService;
    
    // Mock storage for amendment history
    private static final Map<String, java.util.List<Map<String, Object>>> amendmentHistory = new HashMap<>();
    
    @Override
    public void amendPlan(
            UUID planId,
            Integer amendmentRound,
            Map<String, Map<String, Integer>> plannedChanges,
            String planningTeamId) {
        
        // Validate plan exists
        AnnualAuditPlan plan = repository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));
        
        // Validate plan status
        String status = plan.getStatus();
        if (!isValidStatusForAmendment(status)) {
            throw new IllegalStateException(
                "Cannot amend plan in status: " + status + ". " +
                "Plan must be in AMENDMENT_REQUIRED status."
            );
        }
        
        // Validate amendment changes
        amendmentService.validateAmendmentChanges(plannedChanges);
        
        // Create amendment history entry
        Map<String, Object> historyEntry = amendmentService.createAmendmentHistoryEntry(
            amendmentRound,
            plannedChanges,
            planningTeamId
        );
        
        // Store amendment in history
        String planKey = planId.toString();
        amendmentHistory.computeIfAbsent(planKey, k -> new java.util.ArrayList<>())
            .add(historyEntry);
    }
    
    /**
     * Check if plan is in valid status for amendment
     */
    private boolean isValidStatusForAmendment(String status) {
        return "AMENDMENT_REQUIRED".equals(status);
    }
    
    /**
     * Retrieve amendment history for a plan
     */
    public static java.util.List<Map<String, Object>> getAmendmentHistory(UUID planId) {
        String planKey = planId.toString();
        return amendmentHistory.getOrDefault(planKey, new java.util.ArrayList<>());
    }
}
