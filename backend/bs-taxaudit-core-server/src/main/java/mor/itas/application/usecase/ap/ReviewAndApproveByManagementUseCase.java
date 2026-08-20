package mor.itas.application.usecase.ap;

import mor.itas.application.port.inboundport.ap.ReviewAndApproveByManagementPort;
import mor.itas.application.port.outboundport.repositoryport.ap.AnnualAuditPlanRepository;
import mor.itas.domain.model.ap.AnnualAuditPlan;
import mor.itas.domain.model.ap.PlanStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * ReviewAndApproveByManagementUseCase - Use Case
 * 
 * Implements ReviewAndApproveByManagementPort.
 * 
 * Senior Management reviews and approves final plan.
 * 
 * Flow:
 * 1. Validate plan exists
 * 2. Validate plan is in proper state
 * 3. APPROVE: Plan status → FINAL_APPROVED (ready for distribution)
 * 4. REJECT: Plan status → AMENDMENT_REQUIRED (back to Director)
 */
@Service
@RequiredArgsConstructor
public class ReviewAndApproveByManagementUseCase implements ReviewAndApproveByManagementPort {
    
    private final AnnualAuditPlanRepository repository;
    
    // Mock storage for management decisions
    private static final Map<String, Map<String, Object>> managementDecisions = new HashMap<>();
    
    @Override
    public void reviewAndApprove(
            UUID planId,
            String decision,
            String managementId,
            String managementComment) {
        
        // Validate plan exists
        AnnualAuditPlan plan = repository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));
        
        // Validate plan status
        PlanStatus status = plan.getStatus();
        if (!isValidStatusForManagementReview(status.name())) {
            throw new IllegalStateException(
                "Cannot review plan in status: " + status + ". " +
                "Plan must be in AWAITING_MANAGEMENT_APPROVAL status."
            );
        }
        
        // Validate decision
        if (!("APPROVE".equalsIgnoreCase(decision) || "REJECT".equalsIgnoreCase(decision))) {
            throw new IllegalArgumentException(
                "Invalid decision. Must be APPROVE or REJECT. Got: " + decision
            );
        }
        
        // Store management decision
        Map<String, Object> decisionData = new HashMap<>();
        decisionData.put("planId", planId.toString());
        decisionData.put("decision", decision.toUpperCase());
        decisionData.put("decidedBy", managementId);
        decisionData.put("decidedAt", java.time.LocalDateTime.now().toString());
        decisionData.put("managementComment", managementComment != null ? managementComment : "");
        
        if ("APPROVE".equalsIgnoreCase(decision)) {
            decisionData.put("status", "FINAL_APPROVED");
            decisionData.put("message", "Plan approved by Senior Management. Ready for distribution.");
        } else {
            decisionData.put("status", "AMENDMENT_REQUIRED");
            decisionData.put("message", "Plan rejected by Senior Management. Sent back for re-amendment.");
        }
        
        managementDecisions.put(planId.toString(), decisionData);
    }
    
    /**
     * Check if plan is in valid status for management review
     */
    private boolean isValidStatusForManagementReview(String status) {
        return "AWAITING_MANAGEMENT_APPROVAL".equals(status);
    }
    
    /**
     * Retrieve management decision
     */
    public static Map<String, Object> getManagementDecision(UUID planId) {
        return managementDecisions.getOrDefault(planId.toString(), new HashMap<>());
    }
}
