package mor.itas.application.usecase.ap;

import mor.itas.application.port.inboundport.ap.PlanQueryPort;
import mor.itas.application.port.outboundport.repositoryport.ap.AnnualAuditPlanRepository;
import mor.itas.domain.model.ap.AnnualAuditPlan;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Plan Query Use Case
 * 
 * Implements PlanQueryPort inbound interface.
 * Provides read-only operations for querying plans and statistics.
 * 
 * Hexagonal/DDD: Implements inbound port, uses repository port for data access
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlanQueryUseCase implements PlanQueryPort {

    private final AnnualAuditPlanRepository planRepository;

    @Override
    public AnnualAuditPlan getPlanById(UUID planId) {
        return planRepository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));
    }

    @Override
    public List<AnnualAuditPlan> getPlans(String statusFilter, Integer fiscalYearFilter, int page, int size) {
        List<AnnualAuditPlan> plans;

        if (statusFilter != null) {
            plans = planRepository.findByStatus(statusFilter);
        } else {
            // If no status filter, return empty for now (no findAll available)
            plans = List.of();
        }

        // Apply fiscal year filter if provided
        if (fiscalYearFilter != null) {
            plans = plans.stream()
                .filter(p -> p.getPlanYear().equals(fiscalYearFilter))
                .toList();
        }

        // Simple pagination
        int total = plans.size();
        int startIdx = Math.min(page * size, total);
        int endIdx = Math.min(startIdx + size, total);
        return plans.subList(startIdx, endIdx);
    }

    @Override
    public Map<String, Long> getPlanStatistics() {
        Map<String, Long> stats = new HashMap<>();

        String[] statuses = {"DRAFT", "SUBMITTED_TO_DIRECTOR", "DIRECTOR_APPROVED",
                            "AWAITING_REGIONAL_FEEDBACK", "FEEDBACK_COLLECTED",
                            "AMENDMENT_REQUIRED", "SUBMITTED_TO_SENIOR_MGMT",
                            "SENIOR_MGMT_APPROVED", "SENIOR_MGMT_REJECTED",
                            "APPROVED_TO_REGIONS", "FINALIZED", "REVISION_REQUESTED"};

        long total = 0;
        for (String status : statuses) {
            List<AnnualAuditPlan> plansWithStatus = planRepository.findByStatus(status);
            long count = plansWithStatus.size();
            total += count;
            stats.put(status, count);
        }

        stats.put("total", total);
        return stats;
    }
}
