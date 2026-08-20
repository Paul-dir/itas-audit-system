package mor.itas.api.controller.backoffice.ap;

import mor.itas.application.port.inboundport.ap.PlanQueryPort;
import mor.itas.domain.model.ap.AnnualAuditPlan;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import mor.itas.persistence.mapper.ap.ApResponseDtoMapper;
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
     * 7.3 Get regional allocations for a plan
     */
    @GetMapping("/{planId}/regional-allocations")
    public ResponseEntity<GenericResponse<Object>> getRegionalAllocations(@PathVariable UUID planId) {
        List<?> allocations = planQueryPort.getRegionalAllocations(planId);
        return ResponseEntity.ok(GenericResponse.success(allocations));
    }

    /**
     * 7.4 Get tax center allocations for a plan
     */
    @GetMapping("/{planId}/tax-center-allocations")
    public ResponseEntity<GenericResponse<Object>> getTaxCenterAllocations(@PathVariable UUID planId) {
        List<?> allocations = planQueryPort.getTaxCenterAllocations(planId);
        return ResponseEntity.ok(GenericResponse.success(allocations));
    }

    /**
     * 7.5 Get tax center allocations by region
     */
    @GetMapping("/{planId}/tax-center-allocations/region/{regionCode}")
    public ResponseEntity<GenericResponse<Object>> getTaxCenterAllocationsByRegion(
            @PathVariable UUID planId,
            @PathVariable String regionCode) {
        List<?> allocations = planQueryPort.getTaxCenterAllocationsByRegion(planId, regionCode);
        return ResponseEntity.ok(GenericResponse.success(allocations));
    }

    /**
     * 7.6 Get audit log for a plan
     */
    @GetMapping("/{planId}/audit-log")
    public ResponseEntity<GenericResponse<Object>> getAuditLog(@PathVariable UUID planId) {
        List<?> auditLog = planQueryPort.getAuditLog(planId);
        return ResponseEntity.ok(GenericResponse.success(auditLog));
    }

    /**
     * 7.7 Get plan statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<GenericResponse<Object>> getPlanStatistics() {
        Map<String, Long> stats = planQueryPort.getPlanStatistics();
        return ResponseEntity.ok(GenericResponse.success(stats));
    }

    /**
     * 7.8 Get plans for a specific region (Regional Director view)
     * Only returns plans with allocations for that region
     */
    @GetMapping("/region/{regionCode}")
    public ResponseEntity<GenericResponse<Object>> getPlansByRegion(
            @PathVariable String regionCode) {
        
        List<AnnualAuditPlan> plans = planQueryPort.getPlansByRegion(regionCode);
        
        var plansResponse = plans.stream()
            .map(dtoMapper::toPlanResponse)
            .toList();
        
        return ResponseEntity.ok(GenericResponse.success(plansResponse, plansResponse.size(), (long) plansResponse.size()));
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
