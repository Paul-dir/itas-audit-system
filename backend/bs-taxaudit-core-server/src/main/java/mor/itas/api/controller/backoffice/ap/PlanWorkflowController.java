package mor.itas.api.controller.backoffice.ap;

import jakarta.validation.Valid;
import mor.itas.api.dto.request.ap.ApprovalRequest;
import mor.itas.api.dto.request.ap.CreatePlanRequest;
import mor.itas.api.dto.request.ap.DivideAllocationRequest;
import mor.itas.api.dto.request.ap.SubmitTaxCenterFeedbackRequest;
import mor.itas.api.dto.response.ap.AllocationResponse;
import mor.itas.api.dto.response.ap.AuditLogResponse;
import mor.itas.api.dto.response.ap.PlanResponse;
import mor.itas.api.dto.response.ap.CreatePlanResponse;
import mor.itas.application.port.outboundport.riskengine.RiskEnginePort;
import mor.itas.domain.valueobject.RiskDistribution;
import mor.itas.api.mapper.ap.PlanResponseMapper;
import mor.itas.application.usecase.ap.PlanManagementUseCase;
import mor.itas.domain.model.ap.AnnualAuditPlan;
import mor.itas.domain.model.ap.PlanAllocation;
import mor.itas.domain.model.ap.PlanAuditLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.ArrayList;

/**
 * PlanWorkflowController - REST API for Annual Audit Plan workflow
 * Implements 4-level approval workflow with regional allocations
 * 
 * Endpoints:
 * 1. Planning Team: Create plan, submit to Director
 * 2. Director: Approve, route forward, send to Tax Centers
 * 3. Regional Director: Approve, divide regional into tax centers
 * 4. Tax Center Manager: Submit feedback
 */
@RestController
@RequestMapping("/api/v1/backoffice/ap/plans/workflow")
public class PlanWorkflowController {

    @Autowired
    private PlanManagementUseCase planManagementUseCase;

    @Autowired
    private PlanResponseMapper responseMapper;

    @Autowired
    private RiskEnginePort riskEnginePort;

    // ============= LEVEL 1: Planning Team =============

    /**
     * Get Pre-filled Plan Data with Risk Recommendations
     * GET /api/v1/backoffice/ap/plans/pre-filled-data
     * Returns case distribution table pre-filled from Risk Engine that can be reviewed and overridden
     */
    @GetMapping("/pre-filled-data")
    public ResponseEntity<Map<String, Object>> getPreFilledPlanData(
            @RequestHeader(value = "X-Actor-Id", required = true) String actorId) {
        
        // Get risk-based recommendations from Risk Engine
        Map<String, Integer> suggestedQuotas = riskEnginePort.fetchSuggestedQuotas();
        Map<String, RiskDistribution> regionalRisks = riskEnginePort.getRiskDistributionByRegion();
        Map<String, Double> auditTypeDistribution = riskEnginePort.getRecommendedAuditTypeDistribution();
        
        // Build case distribution table
        List<Map<String, Object>> caseDistributionTable = new ArrayList<>();
        Map<String, String> regionNames = Map.of(
            "AA", "Addis Ababa",
            "BA", "Amhara (Bahir Dar)",
            "BB", "Oromia",
            "AB", "Dire Dawa",
            "CA", "SNNPR",
            "SO", "Somalia"
        );
        
        int totalCases = 0;
        
        for (String region : new String[]{"AA", "BA", "BB", "AB", "CA", "SO"}) {
            RiskDistribution risk = regionalRisks.get(region);
            if (risk != null) {
                long regionalTotal = risk.critical() + risk.high() + risk.medium() + risk.low();
                
                // Calculate distribution by audit type based on percentages
                int desk = (int)(regionalTotal * 0.35);
                int field = (int)(regionalTotal * 0.25);
                int joint = (int)(regionalTotal * 0.15);
                int tprice = (int)(regionalTotal * 0.08);
                int comp = (int)(regionalTotal * 0.12);
                int issue = (int)(regionalTotal * 0.05);
                int regionTotal = desk + field + joint + tprice + comp + issue;
                
                totalCases += regionTotal;
                
                Map<String, Object> row = new LinkedHashMap<>();
                row.put("region", region);
                row.put("regionName", regionNames.get(region));
                row.put("desk", desk);
                row.put("field", field);
                row.put("joint", joint);
                row.put("tprice", tprice);
                row.put("comp", comp);
                row.put("issue", issue);
                row.put("total", regionTotal);
                
                caseDistributionTable.add(row);
            }
        }
        
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("riskBasedDefaults", Map.of(
            "source", "Risk Engine",
            "message", "Pre-filled from Risk Estimates. Values below are based on risk engine recommendations. Edit any cell to override.",
            "totalCases", totalCases,
            "caseDistributionTable", caseDistributionTable,
            "suggestedQuotas", suggestedQuotas
        ));
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get Risk Analysis Dashboard
     * GET /api/v1/backoffice/ap/plans/risk-analysis/dashboard
     * Shows national aggregate, regional breakdown, audit types, and risk levels
     */
    @GetMapping("/risk-analysis/dashboard")
    public ResponseEntity<Map<String, Object>> getRiskAnalysisDashboard(
            @RequestHeader(value = "X-Actor-Id", required = true) String actorId) {
        
        // Get national risk distribution
        Map<String, Integer> nationalRiskCounts = new HashMap<>();
        nationalRiskCounts.put("critical", 21_500);
        nationalRiskCounts.put("high", 79_980);
        nationalRiskCounts.put("medium", 149_640);
        nationalRiskCounts.put("low", 178_880);
        Long totalAudits = 21_500L + 79_980L + 149_640L + 178_880L;
        
        // Calculate percentages
        Double criticalPct = (21_500.0 / totalAudits) * 100;
        Double highPct = (79_980.0 / totalAudits) * 100;
        Double mediumPct = (149_640.0 / totalAudits) * 100;
        Double lowPct = (178_880.0 / totalAudits) * 100;
        
        Map<String, Object> dashboard = new LinkedHashMap<>();
        
        // National Level
        Map<String, Object> national = new LinkedHashMap<>();
        national.put("totalTaxpayers", 5_200_000L);
        national.put("totalRiskyTaxpayers", 430_000L);
        national.put("totalAuditsRequired", totalAudits);
        national.put("riskPercentage", String.format("%.2f%%", (430_000.0 / 5_200_000.0) * 100));
        national.put("riskLevelBreakdown", nationalRiskCounts);
        national.put("riskLevelPercentages", Map.of(
            "critical", String.format("%.2f%%", criticalPct),
            "high", String.format("%.2f%%", highPct),
            "medium", String.format("%.2f%%", mediumPct),
            "low", String.format("%.2f%%", lowPct)
        ));
        dashboard.put("nationalAggregate", national);
        
        // Regional Breakdown
        Map<String, Object> regional = new LinkedHashMap<>();
        
        // Region AA
        Map<String, Object> aa = new LinkedHashMap<>();
        aa.put("regionCode", "AA");
        aa.put("regionName", "Addis Ababa");
        aa.put("taxpayers", 1_200_000L);
        aa.put("riskyTaxpayers", 86_000L);
        aa.put("auditsRequired", 4_300 + 15_996 + 29_928 + 35_776);
        aa.put("riskLevelBreakdown", Map.of("critical", 4_300, "high", 15_996, "medium", 29_928, "low", 35_776));
        regional.put("AA", aa);
        
        // Region BA
        Map<String, Object> ba = new LinkedHashMap<>();
        ba.put("regionCode", "BA");
        ba.put("regionName", "Amhara (Bahir Dar)");
        ba.put("taxpayers", 800_000L);
        ba.put("riskyTaxpayers", 64_500L);
        ba.put("auditsRequired", 3_225 + 11_997 + 22_446 + 26_832);
        ba.put("riskLevelBreakdown", Map.of("critical", 3_225, "high", 11_997, "medium", 22_446, "low", 26_832));
        regional.put("BA", ba);
        
        // Region BB
        Map<String, Object> bb = new LinkedHashMap<>();
        bb.put("regionCode", "BB");
        bb.put("regionName", "Oromia");
        bb.put("taxpayers", 1_000_000L);
        bb.put("riskyTaxpayers", 64_500L);
        bb.put("auditsRequired", 3_225 + 11_997 + 22_446 + 26_832);
        bb.put("riskLevelBreakdown", Map.of("critical", 3_225, "high", 11_997, "medium", 22_446, "low", 26_832));
        regional.put("BB", bb);
        
        // Region AB
        Map<String, Object> ab = new LinkedHashMap<>();
        ab.put("regionCode", "AB");
        ab.put("regionName", "Dire Dawa");
        ab.put("taxpayers", 400_000L);
        ab.put("riskyTaxpayers", 19_350L);
        ab.put("auditsRequired", 968 + 3_599 + 6_734 + 8_050);
        ab.put("riskLevelBreakdown", Map.of("critical", 968, "high", 3_599, "medium", 6_734, "low", 8_050));
        regional.put("AB", ab);
        
        // Region CA
        Map<String, Object> ca = new LinkedHashMap<>();
        ca.put("regionCode", "CA");
        ca.put("regionName", "SNNPR");
        ca.put("taxpayers", 500_000L);
        ca.put("riskyTaxpayers", 21_520L);
        ca.put("auditsRequired", 1_075 + 4_198 + 7_857 + 9_391);
        ca.put("riskLevelBreakdown", Map.of("critical", 1_075, "high", 4_198, "medium", 7_857, "low", 9_391));
        regional.put("CA", ca);
        
        // Region SO
        Map<String, Object> so = new LinkedHashMap<>();
        so.put("regionCode", "SO");
        so.put("regionName", "Somalia");
        so.put("taxpayers", 300_000L);
        so.put("riskyTaxpayers", 21_520L);
        so.put("auditsRequired", 1_075 + 4_198 + 7_857 + 9_391);
        so.put("riskLevelBreakdown", Map.of("critical", 1_075, "high", 4_198, "medium", 7_857, "low", 9_391));
        regional.put("SO", so);
        
        dashboard.put("regionalBreakdown", regional);
        
        // Audit Type Distribution
        Map<String, Object> auditTypes = new LinkedHashMap<>();
        auditTypes.put("DESK_AUDIT", Map.of("percentage", 35.0, "suggestedCount", (long)(totalAudits * 0.35)));
        auditTypes.put("FIELD_AUDIT", Map.of("percentage", 25.0, "suggestedCount", (long)(totalAudits * 0.25)));
        auditTypes.put("JOINT_AUDIT", Map.of("percentage", 15.0, "suggestedCount", (long)(totalAudits * 0.15)));
        auditTypes.put("TRANSFER_PRICING", Map.of("percentage", 8.0, "suggestedCount", (long)(totalAudits * 0.08)));
        auditTypes.put("COMPREHENSIVE", Map.of("percentage", 12.0, "suggestedCount", (long)(totalAudits * 0.12)));
        auditTypes.put("ISSUE_AUDIT", Map.of("percentage", 5.0, "suggestedCount", (long)(totalAudits * 0.05)));
        dashboard.put("auditTypeDistribution", auditTypes);
        
        // Risk Level Distribution
        Map<String, Object> riskDistribution = new LinkedHashMap<>();
        riskDistribution.put("critical", Map.of("count", 21_500, "percentage", criticalPct));
        riskDistribution.put("high", Map.of("count", 79_980, "percentage", highPct));
        riskDistribution.put("medium", Map.of("count", 149_640, "percentage", mediumPct));
        riskDistribution.put("low", Map.of("count", 178_880, "percentage", lowPct));
        dashboard.put("riskLevelDistribution", riskDistribution);
        
        return ResponseEntity.ok(dashboard);
    }
    @PostMapping
    public ResponseEntity<PlanResponse> createPlan(
        @Valid @RequestBody CreatePlanRequest request,
        @RequestHeader(value = "X-Actor-Id", required = true) String actorId) {

        // Convert request DTOs to use case DTOs
        List<PlanManagementUseCase.RegionalAllocationDto> regionalAllocations = request.getRegionalAllocations()
            .stream()
            .map(r -> new PlanManagementUseCase.RegionalAllocationDto(r.getRegionCode(), r.getProposedCount()))
            .toList();

        AnnualAuditPlan plan = planManagementUseCase.createPlanWithRegionalAllocations(
            request.getPlanYear(),
            request.getPlanName(),
            regionalAllocations,
            request.getDistribution(),  // Pass distribution data
            actorId
        );

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(responseMapper.toPlanResponse(plan));
    }

    /**
     * Submit plan to Director
     * POST /api/v1/backoffice/ap/plans/{planId}/submit-to-director
     */
    @PostMapping("/{planId}/submit-to-director")
    public ResponseEntity<PlanResponse> submitToDirector(
        @PathVariable UUID planId,
        @RequestHeader(value = "X-Actor-Id", required = true) String actorId) throws Exception {

        AnnualAuditPlan plan = planManagementUseCase.submitToDirector(planId, actorId);
        return ResponseEntity.ok(responseMapper.toPlanResponse(plan));
    }

    // ============= LEVEL 2: Director =============

    /**
     * Approve plan by Director
     * POST /api/v1/backoffice/ap/plans/{planId}/approve-by-director
     */
    @PostMapping("/{planId}/approve-by-director")
    public ResponseEntity<PlanResponse> approveByDirector(
        @PathVariable UUID planId,
        @Valid @RequestBody ApprovalRequest request,
        @RequestHeader(value = "X-Actor-Id", required = true) String actorId) throws Exception {

        AnnualAuditPlan plan = planManagementUseCase.approveByDirector(
            planId,
            actorId,
            request.getReason()
        );

        return ResponseEntity.ok(responseMapper.toPlanResponse(plan));
    }

    /**
     * Submit plan to Regional Directors
     * POST /api/v1/backoffice/ap/plans/{planId}/submit-to-regional
     */
    @PostMapping("/{planId}/submit-to-regional")
    public ResponseEntity<PlanResponse> submitToRegional(
        @PathVariable UUID planId,
        @RequestHeader(value = "X-Actor-Id", required = true) String actorId) throws Exception {

        AnnualAuditPlan plan = planManagementUseCase.submitToRegionalDirectors(planId, actorId);
        return ResponseEntity.ok(responseMapper.toPlanResponse(plan));
    }

    /**
     * Send plan to Tax Centers
     * POST /api/v1/backoffice/ap/plans/{planId}/send-to-tax-centers
     */
    @PostMapping("/{planId}/send-to-tax-centers")
    public ResponseEntity<PlanResponse> sendToTaxCenters(
        @PathVariable UUID planId,
        @RequestHeader(value = "X-Actor-Id", required = true) String actorId) throws Exception {

        AnnualAuditPlan plan = planManagementUseCase.sendToTaxCenters(planId, actorId);
        return ResponseEntity.ok(responseMapper.toPlanResponse(plan));
    }

    // ============= LEVEL 3: Regional Director =============

    /**
     * Approve plan by Regional Director
     * POST /api/v1/backoffice/ap/plans/{planId}/approve-by-regional
     */
    @PostMapping("/{planId}/approve-by-regional")
    public ResponseEntity<PlanResponse> approveByRegional(
        @PathVariable UUID planId,
        @Valid @RequestBody ApprovalRequest request,
        @RequestHeader(value = "X-Actor-Id", required = true) String actorId) throws Exception {

        AnnualAuditPlan plan = planManagementUseCase.approveByRegionalDirector(
            planId,
            actorId,
            request.getReason()
        );

        return ResponseEntity.ok(responseMapper.toPlanResponse(plan));
    }

    /**
     * Divide regional allocation into tax center allocations
     * POST /api/v1/backoffice/ap/plans/{planId}/divide-allocations
     */
    @PostMapping("/{planId}/divide-allocations")
    public ResponseEntity<PlanResponse> divideAllocations(
        @PathVariable UUID planId,
        @Valid @RequestBody DivideAllocationRequest request,
        @RequestHeader(value = "X-Actor-Id", required = true) String actorId) {

        // Convert request DTOs to use case DTOs
        List<PlanManagementUseCase.TaxCenterAllocationDto> tcAllocations = request.getTaxCenterAllocations()
            .stream()
            .map(t -> new PlanManagementUseCase.TaxCenterAllocationDto(t.getTaxCenterCode(), t.getAuditCount()))
            .toList();

        AnnualAuditPlan plan = planManagementUseCase.divideRegionalAllocationIntoTaxCenters(
            planId,
            request.getRegionCode(),
            tcAllocations,
            actorId
        );

        return ResponseEntity.ok(responseMapper.toPlanResponse(plan));
    }

    // ============= LEVEL 4: Tax Center Manager =============

    /**
     * Submit tax center feedback
     * PATCH /api/v1/backoffice/ap/plans/{planId}/allocations/{taxCenterCode}/feedback
     */
    @PatchMapping("/{planId}/allocations/{taxCenterCode}/feedback")
    public ResponseEntity<PlanResponse> submitTaxCenterFeedback(
        @PathVariable UUID planId,
        @PathVariable String taxCenterCode,
        @Valid @RequestBody SubmitTaxCenterFeedbackRequest request,
        @RequestHeader(value = "X-Actor-Id", required = true) String actorId) {

        AnnualAuditPlan plan = planManagementUseCase.submitTaxCenterFeedback(
            planId,
            taxCenterCode,
            request.getAdjustedCount(),
            request.getJustification(),
            actorId
        );

        return ResponseEntity.ok(responseMapper.toPlanResponse(plan));
    }

    // ============= FINALIZATION =============

    /**
     * Record all tax centers have submitted feedback
     * POST /api/v1/backoffice/ap/plans/{planId}/mark-feedback-complete
     */
    @PostMapping("/{planId}/mark-feedback-complete")
    public ResponseEntity<PlanResponse> markFeedbackComplete(
        @PathVariable UUID planId,
        @RequestHeader(value = "X-Actor-Id", required = true) String actorId) {

        AnnualAuditPlan plan = planManagementUseCase.recordAllTaxCenterFeedbackSubmitted(planId, actorId);
        return ResponseEntity.ok(responseMapper.toPlanResponse(plan));
    }

    /**
     * Finalize plan
     * POST /api/v1/backoffice/ap/plans/{planId}/finalize
     */
    @PostMapping("/{planId}/finalize")
    public ResponseEntity<PlanResponse> finalizePlan(
        @PathVariable UUID planId,
        @RequestHeader(value = "X-Actor-Id", required = true) String actorId) {

        AnnualAuditPlan plan = planManagementUseCase.finalizePlan(planId, actorId);
        return ResponseEntity.ok(responseMapper.toPlanResponse(plan));
    }

    // ============= ERROR HANDLING =============

    /**
     * Handle bean validation errors (from @Valid, @NotBlank, @Positive, etc.)
     */
    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            org.springframework.web.bind.MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getAllErrors().stream()
            .map(error -> error.getDefaultMessage())
            .findFirst()
            .orElse("Validation failed");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ErrorResponse("VALIDATION_ERROR", message));
    }

    /**
     * Handle validation errors
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ErrorResponse("INVALID_INPUT", ex.getMessage()));
    }

    /**
     * Handle state transition errors
     */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalState(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(new ErrorResponse("INVALID_STATE", ex.getMessage()));
    }

    /**
     * Handle not found errors
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse("INTERNAL_ERROR", ex.getMessage()));
    }

    /**
     * Error response DTO
     */
    public static class ErrorResponse {
        private String code;
        private String message;

        public ErrorResponse(String code, String message) {
            this.code = code;
            this.message = message;
        }

        public String getCode() {
            return code;
        }

        public String getMessage() {
            return message;
        }
    }
}

