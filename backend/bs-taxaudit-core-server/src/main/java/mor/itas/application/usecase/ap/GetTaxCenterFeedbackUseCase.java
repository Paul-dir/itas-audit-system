package mor.itas.application.usecase.ap;

import mor.itas.application.port.inboundport.ap.GetTaxCenterFeedbackPort;
import mor.itas.application.port.outboundport.repositoryport.ap.AnnualAuditPlanRepository;
import mor.itas.domain.model.ap.AnnualAuditPlan;
import mor.itas.domain.model.ap.PlanStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * GetTaxCenterFeedbackUseCase - Use Case
 * 
 * Implements GetTaxCenterFeedbackPort.
 * 
 * Retrieves all tax center feedback submitted for a region.
 * 
 * Flow:
 * 1. Validate plan exists
 * 2. Validate plan is in proper state
 * 3. Retrieve all tax center feedback for the region
 * 4. Return to Regional Director
 */
@Service
@RequiredArgsConstructor
public class GetTaxCenterFeedbackUseCase implements GetTaxCenterFeedbackPort {
    
    private final AnnualAuditPlanRepository repository;
    
    @Override
    public List<Map<String, Object>> getTaxCenterFeedback(UUID planId, String regionId) {
        // Load plan
        AnnualAuditPlan plan = repository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));
        
        // Validate plan status
        PlanStatus status = plan.getStatus();
        if (!isValidStatusForFeedbackReview(status.name())) {
            throw new IllegalStateException(
                "Cannot get feedback for plan in status: " + status + ". " +
                "Plan must be in ALLOCATED or AWAITING_DIRECTOR_REVIEW status."
            );
        }
        
        // Retrieve tax center feedback from Phase C
        List<Map<String, Object>> feedbackList = retrieveStoredFeedback(planId, regionId);
        
        return feedbackList;
    }
    
    /**
     * Check if plan is in valid status for feedback review
     */
    private boolean isValidStatusForFeedbackReview(String status) {
        return "ALLOCATED".equals(status) ||
               "AWAITING_DIRECTOR_REVIEW".equals(status) ||
               "AWAITING_REGIONAL_FEEDBACK".equals(status);
    }
    
    /**
     * Retrieve feedback stored by Phase C (SubmitTaxCenterFeedbackUseCase)
     * 
     * Mock implementation: retrieve from static storage
     */
    private List<Map<String, Object>> retrieveStoredFeedback(UUID planId, String regionId) {
        List<Map<String, Object>> feedbackList = new ArrayList<>();
        
        // Get all tax centers in this region
        List<String> taxCentersInRegion = getTaxCentersForRegion(regionId);
        
        // For each tax center, retrieve their feedback from Phase C storage
        for (String taxCenterId : taxCentersInRegion) {
            Map<String, Object> tcFeedback = getStoredTaxCenterFeedback(planId, taxCenterId, regionId);
            if (tcFeedback != null) {
                feedbackList.add(tcFeedback);
            }
        }
        
        return feedbackList;
    }
    
    /**
     * Get tax centers in a specific region
     */
    private List<String> getTaxCentersForRegion(String regionId) {
        return switch (regionId) {
            case "AA" -> List.of("TC-AA-01", "TC-AA-02", "TC-AA-03", "TC-AA-04");
            case "AB" -> List.of("TC-OR-01");
            default -> new ArrayList<>();
        };
    }
    
    /**
     * Get stored feedback for a tax center
     * 
     * Calls SubmitTaxCenterFeedbackUseCase.getFeedback() to retrieve stored feedback
     */
    private Map<String, Object> getStoredTaxCenterFeedback(UUID planId, String taxCenterId, String regionId) {
        // Call SubmitTaxCenterFeedbackUseCase to get feedback
        List<Object> feedbacks = SubmitTaxCenterFeedbackUseCase.getFeedback(planId, taxCenterId)
            .stream()
            .map(f -> (Object) f)
            .toList();
        
        if (feedbacks.isEmpty()) {
            return null;
        }
        
        // Build feedback map
        Map<String, Object> tcFeedback = new HashMap<>();
        tcFeedback.put("taxCenterId", taxCenterId);
        tcFeedback.put("regionId", regionId);
        
        // Organize feedback by audit type
        Map<String, Map<String, Object>> feedbackByAuditType = new HashMap<>();
        
        for (Object feedbackObj : feedbacks) {
            @SuppressWarnings("unchecked")
            Map<String, Object> feedback = (Map<String, Object>) feedbackObj;
            
            // This is simplified - in real implementation would convert TaxCenterFeedback object
            // For now, return structured feedback
            feedbackByAuditType.put("feedback_" + System.currentTimeMillis(), feedback);
        }
        
        tcFeedback.put("feedbackByAuditType", feedbackByAuditType);
        
        return tcFeedback;
    }
}
