package mor.itas.application.usecase.ap;

import mor.itas.application.port.inboundport.ap.SubmitToSeniorManagementPort;
import mor.itas.application.port.outboundport.repositoryport.ap.AnnualAuditPlanRepository;
import mor.itas.domain.model.ap.AnnualAuditPlan;
import mor.itas.domain.model.ap.PlanStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * SubmitToSeniorManagementUseCase - Use Case
 * 
 * Implements SubmitToSeniorManagementPort.
 * 
 * Director submits final amended plan to Senior Management for approval.
 * 
 * Flow:
 * 1. Validate plan exists and is in proper state
 * 2. Store submission to management
 * 3. Update plan status to AWAITING_MANAGEMENT_APPROVAL
 */
@Service
@RequiredArgsConstructor
public class SubmitToSeniorManagementUseCase implements SubmitToSeniorManagementPort {
    
    private final AnnualAuditPlanRepository repository;
    
    // Mock storage for management submissions
    private static final Map<String, Map<String, Object>> managementSubmissions = new HashMap<>();
    
    @Override
    public void submitToSeniorManagement(
            UUID planId,
            String directorId,
            String directorComment) {
        
        // Validate plan exists
        AnnualAuditPlan plan = repository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));
        
        // Validate plan status - should be SUBMITTED_TO_DIRECTOR (after amendment)
        PlanStatus status = plan.getStatus();
        if (!isValidStatusForManagementSubmission(status.name())) {
            throw new IllegalStateException(
                "Cannot submit to management. Plan status: " + status + ". " +
                "Plan must be SUBMITTED_TO_DIRECTOR (after amendment) or DIRECTOR_APPROVED"
            );
        }
        
        // Store management submission
        Map<String, Object> submission = new HashMap<>();
        submission.put("planId", planId.toString());
        submission.put("submittedBy", directorId);
        submission.put("submittedAt", java.time.LocalDateTime.now().toString());
        submission.put("directorComment", directorComment != null ? directorComment : "");
        submission.put("status", "AWAITING_MANAGEMENT_APPROVAL");
        
        managementSubmissions.put(planId.toString(), submission);
    }
    
    /**
     * Check if plan is in valid status for management submission
     */
    private boolean isValidStatusForManagementSubmission(String status) {
        return "SUBMITTED_TO_DIRECTOR".equals(status) ||
               "DIRECTOR_APPROVED".equals(status);
    }
    
    /**
     * Retrieve management submission details
     */
    public static Map<String, Object> getManagementSubmission(UUID planId) {
        return managementSubmissions.getOrDefault(planId.toString(), new HashMap<>());
    }
}
