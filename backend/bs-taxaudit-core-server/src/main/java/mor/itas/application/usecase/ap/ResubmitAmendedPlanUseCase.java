package mor.itas.application.usecase.ap;

import mor.itas.application.port.inboundport.ap.ResubmitAmendedPlanPort;
import mor.itas.application.port.outboundport.repositoryport.ap.AnnualAuditPlanRepository;
import mor.itas.domain.model.ap.AnnualAuditPlan;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * ResubmitAmendedPlanUseCase - Use Case
 * 
 * Implements ResubmitAmendedPlanPort.
 * 
 * Processes Planning Team's resubmission of amended plan.
 * 
 * Flow:
 * 1. Validate plan exists and is in proper state
 * 2. Mark plan as ready for Director review
 * 3. Store submission details
 * 4. Update plan status to SUBMITTED_TO_DIRECTOR again
 */
@Service
@RequiredArgsConstructor
public class ResubmitAmendedPlanUseCase implements ResubmitAmendedPlanPort {
    
    private final AnnualAuditPlanRepository repository;
    
    // Mock storage for resubmission tracking
    private static final Map<String, Map<String, Object>> resubmissionTracking = new HashMap<>();
    
    @Override
    public void resubmitAmendedPlan(
            UUID planId,
            Integer amendmentRound,
            String planningTeamComments,
            String planningTeamId) {
        
        // Validate plan exists
        AnnualAuditPlan plan = repository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));
        
        // Validate plan status
        String status = plan.getStatus();
        if (!isValidStatusForResubmission(status)) {
            throw new IllegalStateException(
                "Cannot resubmit plan in status: " + status + ". " +
                "Plan must be in AMENDMENT_REQUIRED status."
            );
        }
        
        // Store resubmission tracking
        Map<String, Object> tracking = new HashMap<>();
        tracking.put("planId", planId.toString());
        tracking.put("amendmentRound", amendmentRound);
        tracking.put("planningTeamComments", planningTeamComments != null ? planningTeamComments : "");
        tracking.put("submittedBy", planningTeamId);
        tracking.put("submittedAt", java.time.LocalDateTime.now().toString());
        tracking.put("status", "SUBMITTED_TO_DIRECTOR");
        
        // Store tracking
        String trackingKey = planId + ":" + amendmentRound;
        resubmissionTracking.put(trackingKey, tracking);
        
        // In real implementation, would update plan.status to SUBMITTED_TO_DIRECTOR
        // and increment plan revision
    }
    
    /**
     * Check if plan is in valid status for resubmission
     */
    private boolean isValidStatusForResubmission(String status) {
        return "AMENDMENT_REQUIRED".equals(status);
    }
    
    /**
     * Retrieve resubmission tracking
     */
    public static Map<String, Object> getResubmissionTracking(UUID planId, Integer amendmentRound) {
        String trackingKey = planId + ":" + amendmentRound;
        return resubmissionTracking.getOrDefault(trackingKey, new HashMap<>());
    }
}
