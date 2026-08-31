package mor.itas.api.controller.backoffice.ap;

import mor.itas.api.dto.response.ap.GenericResponse;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import mor.itas.persistence.jpa.entity.ap.PlanAllocationEntity;
import mor.itas.persistence.jpa.repository.ap.ApAuditCaseRepository;
import mor.itas.persistence.jpa.repository.ap.PlanAllocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * TaxCenterCasesController - Returns audit cases for a specific tax center
 * 
 * After the plan → case cascade, this endpoint provides the cases
 * that belong to a specific tax center, grouped by audit type with risk scores.
 */
@RestController
@RequestMapping("/api/v1/backoffice/ap/tax-center")
@RequiredArgsConstructor
public class TaxCenterCasesController {
    
    private final ApAuditCaseRepository auditCaseRepository;
    private final PlanAllocationRepository allocationRepository;
    
    /**
     * Get all audit cases for a tax center
     * 
     * Endpoint: GET /api/v1/backoffice/ap/tax-center/cases?taxCenterCode=TC-AA-01
     */
    @GetMapping("/cases")
    public ResponseEntity<GenericResponse<Map<String, Object>>> getTaxCenterCases(
        @RequestParam String taxCenterCode,
        @RequestParam(defaultValue = "200") int limit,
        @RequestParam(defaultValue = "0") int offset) {
        
        try {
            // Find all allocations for this tax center to get plan IDs
            List<PlanAllocationEntity> allocations = allocationRepository.findByTaxCenterCode(taxCenterCode);
            
            if (allocations.isEmpty()) {
                Map<String, Object> emptyResult = new HashMap<>();
                emptyResult.put("taxCenterCode", taxCenterCode);
                emptyResult.put("totalCases", 0);
                emptyResult.put("casesByAuditType", Map.of());
                emptyResult.put("cases", List.of());
                emptyResult.put("status", "NO_ALLOCATIONS");
                return ResponseEntity.ok(GenericResponse.success(emptyResult));
            }
            
            // Collect all plan IDs for this tax center
            Set<UUID> planIds = allocations.stream()
                .map(a -> a.getAnnualPlan().getId())
                .collect(Collectors.toSet());
            
            // Fetch all cases for these plans
            List<ApAuditCaseEntity> allCases = new ArrayList<>();
            for (UUID planId : planIds) {
                allCases.addAll(auditCaseRepository.findByPlanId(planId));
            }
            
            // Filter to this tax center's cases using allocation IDs
            Set<UUID> allocationIds = allocations.stream()
                .map(PlanAllocationEntity::getId)
                .collect(Collectors.toSet());
            
            List<ApAuditCaseEntity> tcCases = allCases.stream()
                .filter(c -> allocationIds.contains(c.getAllocationId()))
                .collect(Collectors.toList());
            
            // Group by audit type
            Map<String, List<Map<String, Object>>> casesByAuditType = new LinkedHashMap<>();
            Map<String, Integer> countByAuditType = new LinkedHashMap<>();
            
            for (ApAuditCaseEntity c : tcCases) {
                String auditType = c.getAuditType() != null ? c.getAuditType() : "UNKNOWN";
                
                Map<String, Object> caseData = new LinkedHashMap<>();
                caseData.put("id", c.getId().toString());
                caseData.put("caseNumber", c.getCaseNumber());
                caseData.put("taxpayerId", c.getTaxpayerId());
                caseData.put("auditType", auditType);
                caseData.put("riskScore", c.getRiskScore());
                caseData.put("status", c.getStatus());
                caseData.put("assignedAuditorId", c.getAssignedAuditorId());
                caseData.put("assignedTeamLeaderId", c.getAssignedTeamLeaderId());
                caseData.put("createdAt", c.getCreatedAt() != null ? c.getCreatedAt().toString() : null);
                
                casesByAuditType.computeIfAbsent(auditType, k -> new ArrayList<>()).add(caseData);
                countByAuditType.merge(auditType, 1, Integer::sum);
            }
            
            // Group by audit type and sort each by risk score
            Map<String, List<ApAuditCaseEntity>> byType = tcCases.stream()
                .collect(Collectors.groupingBy(
                    c -> c.getAuditType() != null ? c.getAuditType() : "UNKNOWN",
                    LinkedHashMap::new,
                    Collectors.toList()
                ));
            byType.values().forEach(list -> 
                list.sort(Comparator.comparing(ApAuditCaseEntity::getRiskScore).reversed()));
            
            // Interleave: take proportional sample from each audit type for balanced display
            int paginatedTotal = tcCases.size();
            List<ApAuditCaseEntity> paginated = new ArrayList<>();
            if (limit > 0 && paginatedTotal > 0) {
                // Calculate how many per type to fill 'limit' results proportionally
                Map<String, Integer> perTypeLimit = new LinkedHashMap<>();
                int remaining = limit;
                for (Map.Entry<String, List<ApAuditCaseEntity>> e : byType.entrySet()) {
                    int share = (int) Math.ceil((double) e.getValue().size() / paginatedTotal * limit);
                    perTypeLimit.put(e.getKey(), Math.min(share, e.getValue().size()));
                    remaining -= perTypeLimit.get(e.getKey());
                }
                // Distribute remainder to largest groups
                for (String type : byType.keySet()) {
                    if (remaining <= 0) break;
                    int canAdd = Math.min(remaining, byType.get(type).size() - perTypeLimit.getOrDefault(type, 0));
                    perTypeLimit.merge(type, canAdd, Integer::sum);
                    remaining -= canAdd;
                }
                // True round-robin interleaving across audit types
                List<List<ApAuditCaseEntity>> typeLists = new ArrayList<>(byType.values());
                int[] idx = new int[typeLists.size()];
                while (paginated.size() < limit) {
                    boolean added = false;
                    for (int t = 0; t < typeLists.size(); t++) {
                        if (paginated.size() >= limit) break;
                        if (idx[t] < typeLists.get(t).size()) {
                            paginated.add(typeLists.get(t).get(idx[t]++));
                            added = true;
                        }
                    }
                    if (!added) break;
                }
            }
            int end = Math.min(offset + limit, paginatedTotal);
            if (offset > 0 && offset < paginated.size()) {
                paginated = new ArrayList<>(paginated.subList(offset, Math.min(offset + limit, paginated.size())));
            } else if (limit < paginated.size()) {
                paginated = new ArrayList<>(paginated.subList(0, limit));
            }
            
            // Build response
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("taxCenterCode", taxCenterCode);
            result.put("planIds", planIds.stream().map(UUID::toString).collect(Collectors.toList()));
            result.put("totalCases", paginatedTotal);
            result.put("casesByAuditType", countByAuditType);
            result.put("offset", offset);
            result.put("limit", limit);
            result.put("hasMore", end < paginatedTotal);
            result.put("cases", paginated.stream()
                .map(c -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("caseNumber", c.getCaseNumber());
                    m.put("taxpayerId", c.getTaxpayerId());
                    m.put("auditType", c.getAuditType());
                    m.put("riskScore", c.getRiskScore());
                    m.put("status", c.getStatus());
                    m.put("estimatedRevenue", c.getEstimatedRevenue());
                    // Extract plan year from case number (format: YEAR-REGION-TC-SEQ)
                    String cn = c.getCaseNumber();
                    m.put("planYear", cn != null && cn.contains("-") ? cn.substring(0, cn.indexOf("-")) : null);
                    return m;
                })
                .collect(Collectors.toList()));
            result.put("status", tcCases.isEmpty() ? "NO_CASES" : "CASES_READY");
            result.put("message", tcCases.isEmpty()
                ? "No cases yet. Run plan cascade first."
                : tcCases.size() + " audit cases ready for assignment");
            
            return ResponseEntity.ok(GenericResponse.success(result));
            
        } catch (Exception e) {
            return ResponseEntity.ok(GenericResponse.error("ERROR", "Failed to fetch cases: " + e.getMessage()));
        }
    }
}
