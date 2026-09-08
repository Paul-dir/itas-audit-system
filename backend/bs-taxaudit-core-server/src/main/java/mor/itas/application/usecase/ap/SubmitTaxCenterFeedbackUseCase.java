package mor.itas.application.usecase.ap;

import mor.itas.application.port.inboundport.ap.SubmitTaxCenterFeedbackPort;
import mor.itas.application.port.outboundport.repositoryport.ap.AnnualAuditPlanRepository;
import mor.itas.domain.model.ap.AnnualAuditPlan;
import mor.itas.domain.model.ap.PlanStatus;
import mor.itas.domain.model.ap.TaxCenterFeedback;
import mor.itas.domain.service.ap.TaxCenterFeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * SubmitTaxCenterFeedbackUseCase - Use Case
 * 
 * Implements SubmitTaxCenterFeedbackPort.
 * 
 * Processes Tax Center capacity feedback submission.
 * 
 * Flow:
 * 1. Validate plan exists and is in proper state
 * 2. Validate feedback inputs
 * 3. Create feedback domain objects (one per audit type)
 * 4. Store feedback
 * 5. Update plan status to indicate feedback received
 */
@Service
@RequiredArgsConstructor
public class SubmitTaxCenterFeedbackUseCase implements SubmitTaxCenterFeedbackPort {
    
    private final AnnualAuditPlanRepository repository;
    private final TaxCenterFeedbackService feedbackService;
    
    // Mock storage for tax center feedback (in real implementation, use repository)
    private static final Map<String, List<TaxCenterFeedback>> feedbackStorage = new HashMap<>();
    
    @Override
    public void submitFeedback(
            UUID planId,
            String taxCenterId,
            String regionId,
            Map<String, Map<String, Object>> feedbackByAuditType,
            String submittedBy) {
        
        // Validate plan exists
        AnnualAuditPlan plan = repository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));
        
        // Validate plan status
        PlanStatus status = plan.getStatus();
        if (!isValidStatusForFeedbackSubmission(status.name())) {
            throw new IllegalStateException(
                "Cannot submit feedback for plan in status: " + status + ". " +
                "Plan must be in ALLOCATED or AWAITING_REGIONAL_FEEDBACK status."
            );
        }
        
        // Validate feedback input
        if (feedbackByAuditType == null || feedbackByAuditType.isEmpty()) {
            throw new IllegalArgumentException("Feedback by audit type is required");
        }
        
        // Create feedback domain objects
        List<TaxCenterFeedback> feedbacks = new ArrayList<>();
        
        for (Map.Entry<String, Map<String, Object>> entry : feedbackByAuditType.entrySet()) {
            String auditTypeId = entry.getKey();
            Map<String, Object> feedbackData = entry.getValue();
            
            // Extract feedback details
            Integer requestedCount = getIntValue(feedbackData, "requested");
            Integer acceptedCount = getIntValue(feedbackData, "accepted");
            String justification = (String) feedbackData.get("justification");
            
            @SuppressWarnings("unchecked")
            Map<String, Object> details = (Map<String, Object>) feedbackData.get("details");
            
            // Create feedback using domain service
            TaxCenterFeedback feedback = feedbackService.createFeedback(
                taxCenterId,
                regionId,
                auditTypeId,
                requestedCount,
                acceptedCount,
                justification,
                details,
                submittedBy
            );
            
            feedbacks.add(feedback);
        }
        
        // Store feedback (mock implementation)
        String feedbackKey = planId + ":" + taxCenterId;
        feedbackStorage.put(feedbackKey, feedbacks);
    }
    
    /**
     * Check if plan is in valid status for feedback submission
     */
    private boolean isValidStatusForFeedbackSubmission(String status) {
        return "ALLOCATED".equals(status) ||
               "AWAITING_REGIONAL_FEEDBACK".equals(status);
    }
    
    /**
     * Extract integer value from map, handling different value types
     */
    private Integer getIntValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null) {
            return null;
        }
        if (value instanceof Integer) {
            return (Integer) value;
        }
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        throw new IllegalArgumentException("Expected integer for key: " + key);
    }
    
    /**
     * Retrieve stored feedback for a plan and tax center
     */
    public static List<TaxCenterFeedback> getFeedback(UUID planId, String taxCenterId) {
        String feedbackKey = planId + ":" + taxCenterId;
        return feedbackStorage.getOrDefault(feedbackKey, new ArrayList<>());
    }
    
    /**
     * Retrieve all feedback for a plan across all tax centers
     */
    public static List<TaxCenterFeedback> getAllFeedbackForPlan(UUID planId) {
        List<TaxCenterFeedback> allFeedback = new ArrayList<>();
        
        feedbackStorage.forEach((key, feedbacks) -> {
            if (key.startsWith(planId.toString() + ":")) {
                allFeedback.addAll(feedbacks);
            }
        });
        
        return allFeedback;
    }
}
