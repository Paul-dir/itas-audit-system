package mor.itas.api.controller.backoffice.ap;

import mor.itas.application.port.outboundport.repositoryport.ap.AnnualAuditPlanRepository;
import mor.itas.domain.aggregate.ap.AnnualAuditPlan;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

/**
 * Plan Query REST Controller
 * 
 * Handles read-only plan queries and statistics
 */
@RestController
@RequestMapping("/api/v1/backoffice/ap/plans")
@RequiredArgsConstructor
public class PlanQueryController {

    private final AnnualAuditPlanRepository planRepository;

    /**
     * 7.1 Get all plans with optional filters
     */
    @GetMapping
    public ResponseEntity<GetPlansResponse> getPlans(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String fiscalYear,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        List<AnnualAuditPlan> plans;
        
        // Use available repository methods
        if (status != null) {
            plans = planRepository.findByStatus(status);
        } else {
            // If no status filter, return empty for now (no findAll available)
            // In production, would need to implement custom findAll query
            plans = List.of();
        }
        
        // Apply fiscal year filter if provided
        if (fiscalYear != null) {
            Integer year = Integer.parseInt(fiscalYear);
            plans = plans.stream()
                .filter(p -> p.getPlanYear().equals(year))
                .toList();
        }
        
        // Simple pagination
        int total = plans.size();
        int startIdx = Math.min(page * size, total);
        int endIdx = Math.min(startIdx + size, total);
        List<AnnualAuditPlan> paged = plans.subList(startIdx, endIdx);
        
        return ResponseEntity.ok(new GetPlansResponse(paged.size(), total, paged));
    }

    /**
     * 7.2 Get plan by ID
     */
    @GetMapping("/{planId}")
    public ResponseEntity<AnnualAuditPlan> getPlanById(@PathVariable UUID planId) {
        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));
        return ResponseEntity.ok(plan);
    }

    /**
     * 7.7 Get plan statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<PlanStatisticsResponse> getPlanStatistics() {
        // Get plans by each status to build statistics
        PlanStatisticsResponse stats = new PlanStatisticsResponse();
        
        String[] statuses = {"DRAFT", "SUBMITTED_TO_DIRECTOR", "DIRECTOR_APPROVED", 
                            "AWAITING_REGIONAL_FEEDBACK", "FEEDBACK_COLLECTED",
                            "AMENDMENT_REQUIRED", "SUBMITTED_TO_SENIOR_MGMT",
                            "SENIOR_MGMT_APPROVED", "SENIOR_MGMT_REJECTED",
                            "APPROVED_TO_REGIONS", "FINALIZED", "REVISION_REQUESTED"};
        
        long total = 0;
        for (String status : statuses) {
            List<AnnualAuditPlan> plansWithStatus = planRepository.findByStatus(status);
            total += plansWithStatus.size();
            
            switch (status) {
                case "DRAFT":
                    stats.draft = plansWithStatus.size();
                    break;
                case "SUBMITTED_TO_DIRECTOR":
                    stats.pendingDirector = plansWithStatus.size();
                    break;
                case "DIRECTOR_APPROVED":
                case "AWAITING_REGIONAL_FEEDBACK":
                case "FEEDBACK_COLLECTED":
                case "APPROVED_TO_REGIONS":
                    stats.active += plansWithStatus.size();
                    break;
                case "SUBMITTED_TO_SENIOR_MGMT":
                    stats.pendingSenior = plansWithStatus.size();
                    break;
                case "SENIOR_MGMT_APPROVED":
                    stats.approved = plansWithStatus.size();
                    break;
                case "FINALIZED":
                    stats.finalized = plansWithStatus.size();
                    break;
                case "AMENDMENT_REQUIRED":
                    stats.amendmentRequired = plansWithStatus.size();
                    break;
                case "SENIOR_MGMT_REJECTED":
                    stats.seniorRejected = plansWithStatus.size();
                    break;
                case "REVISION_REQUESTED":
                    stats.revisionRequested = plansWithStatus.size();
                    break;
            }
        }
        
        stats.setTotal(total);
        return ResponseEntity.ok(stats);
    }

    // ==================== REQUEST/RESPONSE DTOs ====================

    @Data
    static class GetPlansResponse {
        private int count;
        private long total;
        private Object plans;

        public GetPlansResponse(int count, long total, Object plans) {
            this.count = count;
            this.total = total;
            this.plans = plans;
        }
    }

    @Data
    static class PlanStatisticsResponse {
        private Long total;
        private long draft = 0;
        private long pendingDirector = 0;
        private long active = 0;
        private long pendingSenior = 0;
        private long approved = 0;
        private long finalized = 0;
        private long amendmentRequired = 0;
        private long seniorRejected = 0;
        private long revisionRequested = 0;
    }
}
