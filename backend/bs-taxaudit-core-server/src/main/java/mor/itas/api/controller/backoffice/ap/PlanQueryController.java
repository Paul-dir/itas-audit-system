package mor.itas.api.controller.backoffice.ap;

import mor.itas.application.port.inboundport.ap.PlanQueryPort;
import mor.itas.domain.aggregate.ap.AnnualAuditPlan;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Plan Query REST Controller
 * 
 * REST Adapter for Plan Query use cases.
 * Depends on inbound ports (PlanQueryPort), not directly on use cases.
 * This is the driving adapter - converts HTTP to domain operations.
 * 
 * Hexagonal/DDD: REST Controller is an adapter that uses inbound ports
 */
@RestController
@RequestMapping("/api/v1/backoffice/ap/plans")
@RequiredArgsConstructor
public class PlanQueryController {

    private final PlanQueryPort planQueryPort;

    /**
     * 7.1 Get all plans with optional filters
     */
    @GetMapping
    public ResponseEntity<GetPlansResponse> getPlans(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String fiscalYear,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        List<AnnualAuditPlan> plans = planQueryPort.getPlans(status, 
            fiscalYear != null ? Integer.parseInt(fiscalYear) : null, page, size);
        
        return ResponseEntity.ok(new GetPlansResponse(plans.size(), plans.size(), plans));
    }

    /**
     * 7.2 Get plan by ID
     */
    @GetMapping("/{planId}")
    public ResponseEntity<AnnualAuditPlan> getPlanById(@PathVariable UUID planId) {
        AnnualAuditPlan plan = planQueryPort.getPlanById(planId);
        return ResponseEntity.ok(plan);
    }

    /**
     * 7.7 Get plan statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getPlanStatistics() {
        Map<String, Long> stats = planQueryPort.getPlanStatistics();
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
}
