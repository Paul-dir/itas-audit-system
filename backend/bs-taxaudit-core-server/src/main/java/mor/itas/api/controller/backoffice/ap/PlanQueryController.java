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
import mor.itas.api.dto.mapper.ApResponseDtoMapper;
import mor.itas.api.dto.response.ap.PlanResponse;
import mor.itas.api.dto.response.ap.GenericResponse;

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
    private final ApResponseDtoMapper dtoMapper;

    /**
     * 7.1 Get all plans with optional filters
     */
    @GetMapping
    public ResponseEntity<GenericResponse<Object>> getPlans(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String fiscalYear,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        List<AnnualAuditPlan> plans = planQueryPort.getPlans(status, 
            fiscalYear != null ? Integer.parseInt(fiscalYear) : null, page, size);
        
        var plansResponse = plans.stream()
            .map(dtoMapper::toPlanResponse)
            .toList();
        
        return ResponseEntity.ok(GenericResponse.success(plansResponse, plansResponse.size(), (long) plansResponse.size()));
    }

    /**
     * 7.2 Get plan by ID
     */
    @GetMapping("/{planId}")
    public ResponseEntity<GenericResponse<PlanResponse>> getPlanById(@PathVariable UUID planId) {
        AnnualAuditPlan plan = planQueryPort.getPlanById(planId);
        PlanResponse response = dtoMapper.toPlanResponse(plan);
        return ResponseEntity.ok(GenericResponse.success(response));
    }

    /**
     * 7.7 Get plan statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<GenericResponse<Object>> getPlanStatistics() {
        Map<String, Long> stats = planQueryPort.getPlanStatistics();
        return ResponseEntity.ok(GenericResponse.success(stats));
    }

    // ==================== REQUEST DTOs ====================

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
