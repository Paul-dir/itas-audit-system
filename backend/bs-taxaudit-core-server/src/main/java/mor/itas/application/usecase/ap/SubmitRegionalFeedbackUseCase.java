package mor.itas.application.usecase.ap;

import mor.itas.application.port.inboundport.ap.SubmitRegionalFeedbackPort;
import mor.itas.application.port.outboundport.repositoryport.ap.AnnualAuditPlanRepository;
import mor.itas.domain.model.ap.AnnualAuditPlan;
import mor.itas.domain.service.ap.RegionalFeedbackAggregationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * SubmitRegionalFeedbackUseCase - Use Case
 * 
 * Implements SubmitRegionalFeedbackPort.
 * 
 * Processes Regional Director's aggregated feedback submission.
 * 
 * Flow:
 * 1. Validate plan exists and is in proper state
 * 2. Validate aggregated feedback
 * 3. Store aggregated feedback
 * 4. Update plan status to indicate feedback received
 */
@Service
@RequiredArgsConstructor
public class SubmitRegionalFeedbackUseCase implements SubmitRegionalFeedbackPort {
    
    private final AnnualAuditPlanRepository repository;
    private final RegionalFeedbackAggregationService aggregationService;
    
    // Mock storage for regional feedback (in real implementation, use repository)
    private static final Map<String, Map<String, Map<String, Object>>> regionalFeedbackStorage = new HashMap<>();
    
    @Override
    public void submitAggregatedFeedback(
            UUID planId,
            String regionId,
            Map<String, Map<String, Object>> aggregatedFeedback,
            String regionalDirectorId) {
        
        // Validate plan exists
        AnnualAuditPlan plan = repository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));
        
        // Validate plan status
        String status = plan.getStatus();
        if (!isValidStatusForFeedbackSubmission(status)) {
            throw new IllegalStateException(
                "Cannot submit feedback for plan in status: " + status + ". " +
                "Plan must be in ALLOCATED or AWAITING_DIRECTOR_REVIEW status."
            );
        }
        
        // Validate feedback input
        if (aggregatedFeedback == null || aggregatedFeedback.isEmpty()) {
            throw new IllegalArgumentException("Aggregated feedback cannot be empty");
        }
        
        // Validate all audit types present
        validateAuditTypesPresent(aggregatedFeedback);
        
        // Store aggregated feedback
        String feedbackKey = planId + ":" + regionId;
        regionalFeedbackStorage.put(feedbackKey, aggregatedFeedback);
    }
    
    /**
     * Check if plan is in valid status for feedback submission
     */
    private boolean isValidStatusForFeedbackSubmission(String status) {
        return "ALLOCATED".equals(status) ||
               "AWAITING_DIRECTOR_REVIEW".equals(status) ||
               "AWAITING_REGIONAL_FEEDBACK".equals(status);
    }
    
    /**
     * Validate that all required audit types are present in aggregated feedback
     */
    private void validateAuditTypesPresent(Map<String, Map<String, Object>> aggregatedFeedback) {
        String[] requiredAuditTypes = {
            "desk_audit",
            "field_audit",
            "joint_audit",
            "transfer_pricing",
            "comprehensive",
            "issue_audit"
        };
        
        for (String auditType : requiredAuditTypes) {
            if (!aggregatedFeedback.containsKey(auditType)) {
                throw new IllegalArgumentException(
                    "Missing aggregated data for audit type: " + auditType
                );
            }
        }
    }
    
    /**
     * Retrieve stored regional feedback for a plan and region
     */
    public static Map<String, Map<String, Object>> getRegionalFeedback(UUID planId, String regionId) {
        String feedbackKey = planId + ":" + regionId;
        return regionalFeedbackStorage.getOrDefault(feedbackKey, new HashMap<>());
    }
    
    /**
     * Retrieve all regional feedback for a plan across all regions
     */
    public static Map<String, Map<String, Map<String, Object>>> getAllRegionalFeedback(UUID planId) {
        Map<String, Map<String, Map<String, Object>>> allFeedback = new HashMap<>();
        
        regionalFeedbackStorage.forEach((key, feedback) -> {
            if (key.startsWith(planId.toString() + ":")) {
                String regionId = key.substring(planId.toString().length() + 1);
                allFeedback.put(regionId, feedback);
            }
        });
        
        return allFeedback;
    }
}
