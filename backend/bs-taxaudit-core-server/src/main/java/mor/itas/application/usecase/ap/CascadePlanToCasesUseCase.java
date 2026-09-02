package mor.itas.application.usecase.ap;

import mor.itas.application.port.outboundport.taxpayer.TaxpayerPort;
import mor.itas.application.port.outboundport.usermanagement.UserManagementPort;
import mor.itas.persistence.jpa.entity.ap.*;
import mor.itas.persistence.jpa.repository.ap.*;

import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.JsonNode;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * CascadePlanToCasesUseCase
 *
 * Converts plan allocations into actual audit cases.
 *
 * Key behaviors:
 * 1. Idempotent: deletes existing cases for this plan before re-creating
 * 2. Auto-assigns team leaders by audit type:
 *    - DESK_AUDIT     → Desk Team Leaders (round-robin across 3 TLs)
 *    - COMPREHENSIVE   → Comprehensive Team Leaders (round-robin across 2 TLs)
 *    - ISSUE_AUDIT     → QA Team Leaders (round-robin across 2 TLs)
 *    - JOINT_AUDIT     → JA Committee Members (round-robin, NOT team leaders)
 *    - TRANSFER_PRICING → TP Committee Members (round-robin, NOT team leaders)
 * 3. One taxpayer = one case per plan year per tax center (duplicate prevention)
 */
@Service
@RequiredArgsConstructor
public class CascadePlanToCasesUseCase {

    private final AnnualAuditPlanJpaRepository planRepository;
    private final PlanAllocationRepository allocationRepository;
    private final ApAuditCaseRepository auditCaseRepository;
    private final RegionalDeploymentRepository deploymentRepository;
    private final TaxpayerPort taxpayerPort;
    private final UserManagementPort userManagementPort;

    // Audit type ID mapping (frontend → backend)
    private static final Map<String, String> AUDIT_TYPE_MAP = Map.of(
        "desk_audit", "DESK_AUDIT",
        "joint_audit", "JOINT_AUDIT",
        "transfer_pricing", "TRANSFER_PRICING",
        "comprehensive", "COMPREHENSIVE_AUDIT",
        "comprehensive_audit", "COMPREHENSIVE_AUDIT",
        "issue_audit", "ISSUE_AUDIT"
    );

    // Mapping from backend audit type → team leader audit type code
    // JOINT_AUDIT and TRANSFER_PRICING use committee members, not team leaders
    private static final Map<String, String> TL_AUDIT_TYPE_MAP = Map.of(
        "DESK_AUDIT", "DESK",
        "COMPREHENSIVE_AUDIT", "COMP",
        "ISSUE_AUDIT", "QA"
    );

    // These audit types use committee members instead of team leaders
    private static final Set<String> COMMITTEE_AUDIT_TYPES = Set.of("JOINT_AUDIT", "TRANSFER_PRICING");

    /**
     * Cascade all allocations for a plan into audit cases (no filter)
     */
    @Transactional
    public Map<String, Object> cascade(UUID planId, String actorId) {
        return cascade(planId, actorId, null);
    }

    /**
     * Cascade with optional audit type filter.
     * If auditTypes is non-null, only create cases for those types.
     * This operation is idempotent: existing cases for this plan are deleted first.
     */
    @Transactional
    public Map<String, Object> cascade(UUID planId, String actorId, List<String> auditTypeFilter) {
        // Normalize filter to uppercase backend names
        Set<String> allowedTypes = null;
        if (auditTypeFilter != null && !auditTypeFilter.isEmpty()) {
            allowedTypes = new HashSet<>();
            for (String at : auditTypeFilter) {
                String mapped = AUDIT_TYPE_MAP.getOrDefault(at.toLowerCase(), at.toUpperCase());
                allowedTypes.add(mapped);
            }
            System.err.println("=== CASCADE FILTER: only creating cases for: " + allowedTypes);
        }

        AnnualAuditPlanEntity plan = planRepository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));

        // ── Step 1: Delete existing cases for this plan (idempotent) ──
        long deletedCount = auditCaseRepository.deleteByPlanId(planId);
        auditCaseRepository.flush();  // Force the DELETE to execute before new inserts
        System.err.println("🗑️ Deleted " + deletedCount + " existing cases for plan " + planId);

        // Get all tax center allocations for this plan
        List<PlanAllocationEntity> allocations = allocationRepository.findByAnnualPlanId(planId);

        if (allocations.isEmpty()) {
            throw new IllegalStateException("No tax center allocations found. Deploy to regions and distribute to tax centers first.");
        }

        int totalCasesCreated = 0;
        Map<String, Integer> casesByTaxCenter = new LinkedHashMap<>();
        Map<String, Integer> casesByAuditType = new LinkedHashMap<>();
        Map<String, Integer> casesByTeamLeader = new LinkedHashMap<>();
        AtomicInteger caseNumberCounter = new AtomicInteger(1);

        // Revenue tracking: allocationId → auditType → revenue
        Map<UUID, Map<String, Long>> allocationRevenueByType = new HashMap<>();
        // Regional revenue: regionCode → auditType → revenue
        Map<String, Map<String, Long>> regionalRevenueByType = new HashMap<>();

        // ── Step 2: Pre-load team leaders and committee members per tax center ──
        // Structure: taxCenterCode → auditType → List<userId>
        Map<String, Map<String, List<String>>> teamLeaderCache = new HashMap<>();
        Map<String, List<String>> committeeCache = new HashMap<>();

        for (PlanAllocationEntity allocation : allocations) {
            String tcCode = allocation.getTaxCenterCode();
            if (tcCode == null || tcCode.isEmpty()) continue;

            // Map to backend code for team leader lookup: AA-TC1 → AA-01
            String tlCode = mapToFrontendTcCode(tcCode);

            // Load team leaders for this tax center
            Map<String, List<String>> tcLeaders = new HashMap<>();

            // DESK team leaders
            tcLeaders.put("DESK_AUDIT", getTeamLeaderIds(tlCode, "DESK"));
            // COMPREHENSIVE team leaders
            tcLeaders.put("COMPREHENSIVE_AUDIT", getTeamLeaderIds(tlCode, "COMP"));
            // ISSUE → QA team leaders
            tcLeaders.put("ISSUE_AUDIT", getTeamLeaderIds(tlCode, "QA"));

            teamLeaderCache.put(tcCode, tcLeaders);
        }

        // Load committee members
        committeeCache.put("JOINT_AUDIT", getCommitteeMemberIds("JOINT_AUDIT"));
        committeeCache.put("TRANSFER_PRICING", getCommitteeMemberIds("TRANSFER_PRICING"));

        System.err.println("=== TEAM LEADER CACHE ===");
        for (var tcEntry : teamLeaderCache.entrySet()) {
            for (var atEntry : tcEntry.getValue().entrySet()) {
                System.err.println("  " + tcEntry.getKey() + " / " + atEntry.getKey() + " → " + atEntry.getValue().size() + " leaders");
            }
        }
        for (var ce : committeeCache.entrySet()) {
            System.err.println("  COMMITTEE " + ce.getKey() + " → " + ce.getValue().size() + " members");
        }

        // ── Step 3: Create cases per tax center ──
        for (PlanAllocationEntity allocation : allocations) {
            String taxCenterCode = allocation.getTaxCenterCode();
            String regionCode = allocation.getRegionCode();

            if (taxCenterCode == null || taxCenterCode.isEmpty()) continue;

            // Map frontend code to backend code: addis_ababa-tc1 -> TC-AA-01, AA-TC1 -> TC-AA-01
            String backendTaxCenterCode = taxCenterCode;
            if (taxCenterCode.toLowerCase().startsWith("addis_ababa-tc")) {
                int num = Integer.parseInt(taxCenterCode.substring("addis_ababa-tc".length()));
                backendTaxCenterCode = String.format("TC-AA-%02d", num);
            } else if (taxCenterCode.toLowerCase().startsWith("amhara-tc") || taxCenterCode.toLowerCase().startsWith("ba-tc")) {
                int num = Integer.parseInt(taxCenterCode.replaceAll("[^0-9]", ""));
                backendTaxCenterCode = String.format("TC-BA-%02d", num);
            } else if (taxCenterCode.toLowerCase().startsWith("oromia-tc") || taxCenterCode.toLowerCase().startsWith("bb-tc")) {
                int num = Integer.parseInt(taxCenterCode.replaceAll("[^0-9]", ""));
                backendTaxCenterCode = String.format("TC-BB-%02d", num);
            } else if (!taxCenterCode.startsWith("TC-")) {
                String[] parts = taxCenterCode.split("-TC");
                if (parts.length == 2) {
                    backendTaxCenterCode = String.format("TC-%s-%02d", parts[0], Integer.parseInt(parts[1]));
                }
            }
            System.err.println("=== CASCADE DEBUG: taxCenterCode=" + taxCenterCode + " -> backendCode=" + backendTaxCenterCode);

            // Parse the audit type breakdown from the allocation
            Map<String, Integer> auditTypeBreakdown = parseAuditTypeBreakdown(allocation);

            if (auditTypeBreakdown.isEmpty()) {
                System.err.println("⚠️ No audit type breakdown for " + taxCenterCode + ", using total");
                int total = allocation.getProposedCount();
                auditTypeBreakdown = new LinkedHashMap<>();
                auditTypeBreakdown.put("desk_audit", (int)(total * 0.35));
                auditTypeBreakdown.put("joint_audit", (int)(total * 0.15));
                auditTypeBreakdown.put("transfer_pricing", (int)(total * 0.10));
                auditTypeBreakdown.put("comprehensive", (int)(total * 0.20));
                auditTypeBreakdown.put("issue_audit", (int)(total * 0.20));
            }

            // Fetch taxpayers for this tax center
            List<Map<String, Object>> taxpayers;
            try {
                taxpayers = taxpayerPort.getTaxpayersForTaxCenter(backendTaxCenterCode);
            } catch (Exception e) {
                System.err.println("⚠️ Failed to fetch taxpayers for " + backendTaxCenterCode + ": " + e.getMessage());
                continue;
            }

            if (taxpayers == null || taxpayers.isEmpty()) {
                System.err.println("⚠️ No taxpayers found for " + backendTaxCenterCode);
                continue;
            }

            // Group taxpayers by recommended audit type
            Map<String, List<Map<String, Object>>> taxpayersByType = new HashMap<>();
            for (Map<String, Object> tp : taxpayers) {
                if (tp == null || !(tp instanceof Map)) continue;
                String recType = (String) tp.getOrDefault("recommendedAuditType", "desk_audit");
                taxpayersByType.computeIfAbsent(recType, k -> new ArrayList<>()).add(tp);
            }

            // Sort each group by risk score (highest first)
            taxpayersByType.values().forEach(list ->
                list.sort((a, b) -> ((Integer) b.getOrDefault("riskScore", 0))
                    .compareTo((Integer) a.getOrDefault("riskScore", 0)))
            );

            int tcCasesCreated = 0;

            // Per tax center round-robin indices for team leaders (per audit type)
            Map<String, Integer> tlRoundRobin = new HashMap<>();

            // For each audit type in the allocation, create cases
            for (Map.Entry<String, Integer> entry : auditTypeBreakdown.entrySet()) {
                String auditType = entry.getKey();
                int requiredCases = entry.getValue();

                if (requiredCases <= 0) continue;

                // If audit type filter is set, skip types not in the filter
                String backendType = AUDIT_TYPE_MAP.getOrDefault(auditType, auditType.toUpperCase());
                if (allowedTypes != null && !allowedTypes.contains(backendType)) {
                    continue;
                }

                // Get taxpayers recommended for this audit type
                List<Map<String, Object>> candidates = new ArrayList<>(taxpayersByType.getOrDefault(auditType, new ArrayList<>()));

                // If not enough candidates, pull from desk_audit pool
                if (candidates.size() < requiredCases) {
                    List<Map<String, Object>> deskPool = taxpayersByType.getOrDefault("desk_audit", new ArrayList<>());
                    for (Map<String, Object> tp : deskPool) {
                        if (candidates.size() >= requiredCases) break;
                        if (!candidates.contains(tp)) {
                            candidates.add(tp);
                        }
                    }
                }

                int casesToCreate = Math.min(requiredCases, candidates.size());

                // Get the right assignees for this audit type
                List<String> assigneeIds;
                boolean isCommittee = COMMITTEE_AUDIT_TYPES.contains(backendType);
                if (isCommittee) {
                    assigneeIds = committeeCache.getOrDefault(backendType, new ArrayList<>());
                } else {
                    assigneeIds = teamLeaderCache
                        .getOrDefault(taxCenterCode, Collections.emptyMap())
                        .getOrDefault(backendType, new ArrayList<>());
                }

                if (assigneeIds.isEmpty()) {
                    System.err.println("⚠️ No team leaders/committee found for " + backendType + " in " + taxCenterCode);
                }

                for (int i = 0; i < casesToCreate; i++) {
                    Map<String, Object> taxpayer = candidates.get(i);
                    String tin = (String) taxpayer.getOrDefault("tin", "UNKNOWN");

                    ApAuditCaseEntity caseEntity = new ApAuditCaseEntity();
                    caseEntity.setId(UUID.randomUUID());
                    caseEntity.setPlanId(planId);
                    caseEntity.setAllocationId(allocation.getId());

                    // ── Denormalize TC and region for direct queries ──
                    caseEntity.setTaxCenterCode(backendTaxCenterCode);
                    caseEntity.setRegionCode(regionCode != null ? regionCode : "");

                    caseEntity.setCaseNumber(generateCaseNumber(plan, regionCode, backendTaxCenterCode, caseNumberCounter));
                    caseEntity.setTaxpayerId(tin);

                    // ── Denormalize taxpayer display fields ──
                    Object nameObj = taxpayer.get("name");
                    if (nameObj == null) nameObj = taxpayer.get("businessName");
                    if (nameObj == null) nameObj = taxpayer.get("taxpayerName");
                    caseEntity.setTaxpayerName(nameObj != null ? nameObj.toString() : tin);

                    Object sectorObj = taxpayer.get("sector");
                    if (sectorObj == null) sectorObj = taxpayer.get("businessSector");
                    caseEntity.setSector(sectorObj != null ? sectorObj.toString() : "Unknown");

                    caseEntity.setAuditType(backendType);
                    caseEntity.setRiskScore((Integer) taxpayer.getOrDefault("riskScore", 0));
                    Object estRev = taxpayer.get("estimatedRevenue");
                    if (estRev instanceof Number) caseEntity.setEstimatedRevenue(((Number) estRev).longValue());
                    caseEntity.setCreatedBy(actorId != null ? actorId : "SYSTEM");
                    caseEntity.setCreatedAt(OffsetDateTime.now());
                    caseEntity.setUpdatedAt(OffsetDateTime.now());

                    // ── All cases start as PENDING_ASSIGNMENT ──
                    // Manual or explicit assignment happens after case creation via Case Management / Committee UI
                    caseEntity.setAssignedTeamLeaderId(null);
                    caseEntity.setAssignedAuditorId(null);
                    caseEntity.setStatus(ApAuditCaseEntity.STATUS_PENDING_ASSIGNMENT);

                    // Save to database
                    auditCaseRepository.save(caseEntity);
                    tcCasesCreated++;
                    totalCasesCreated++;

                    casesByAuditType.merge(backendType, 1, Integer::sum);

                    // ── Revenue tracking ──
                    long caseRevenue = caseEntity.getEstimatedRevenue() != null ? caseEntity.getEstimatedRevenue() : 0L;
                    if (caseRevenue > 0) {
                        allocationRevenueByType
                            .computeIfAbsent(allocation.getId(), k -> new HashMap<>())
                            .merge(backendType, caseRevenue, Long::sum);
                        regionalRevenueByType
                            .computeIfAbsent(regionCode != null ? regionCode : "UNKNOWN", k -> new HashMap<>())
                            .merge(backendType, caseRevenue, Long::sum);
                    }
                }
            }

            casesByTaxCenter.put(taxCenterCode, tcCasesCreated);
            System.err.println("✅ " + taxCenterCode + ": " + tcCasesCreated + " cases created from " + taxpayers.size() + " taxpayers");
        }

        // ── Update allocations with revenue data ──
        for (PlanAllocationEntity allocation : allocations) {
            Map<String, Long> revByType = allocationRevenueByType.getOrDefault(allocation.getId(), Collections.emptyMap());
            if (!revByType.isEmpty()) {
                long totalRev = revByType.values().stream().mapToLong(Long::longValue).sum();
                allocation.setEstimatedRevenue(java.math.BigDecimal.valueOf(totalRev));
                try {
                    com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                    allocation.setRevenueByAuditType(mapper.valueToTree(revByType));
                } catch (Exception e) {
                    System.err.println("⚠️ Failed to serialize revenue by audit type: " + e.getMessage());
                }
                allocationRepository.save(allocation);
                System.err.println("💰 Allocation " + allocation.getTaxCenterCode() + " revenue: " + totalRev + " ETB (" + revByType + ")");
            }
        }

        // ── Update regional deployments with revenue data ──
        for (Map.Entry<String, Map<String, Long>> regionEntry : regionalRevenueByType.entrySet()) {
            String regionCode = regionEntry.getKey();
            Map<String, Long> revByType = regionEntry.getValue();
            long totalRev = revByType.values().stream().mapToLong(Long::longValue).sum();
            try {
                var deploymentOpt = deploymentRepository.findByPlanIdAndRegionCode(planId, regionCode);
                if (deploymentOpt.isPresent()) {
                    var deployment = deploymentOpt.get();
                    deployment.setEstimatedRevenue(totalRev);
                    deployment.setRevenueByAuditType(revByType);
                    deploymentRepository.save(deployment);
                    System.err.println("💰 Regional deployment " + regionCode + " revenue: " + totalRev + " ETB");
                }
            } catch (Exception e) {
                System.err.println("⚠️ Failed to update regional deployment for " + regionCode + ": " + e.getMessage());
            }
        }

        // Update plan status to FINALIZED if cases were created
        if (totalCasesCreated > 0) {
            plan.setStatus(PlanStatusEnum.FINALIZED);
            plan.setUpdatedAt(OffsetDateTime.now());
            planRepository.save(plan);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("planId", planId.toString());
        result.put("planName", plan.getName());
        result.put("planYear", plan.getYear());
        result.put("previousCasesDeleted", deletedCount);
        result.put("totalCasesCreated", totalCasesCreated);
        result.put("casesByTaxCenter", casesByTaxCenter);
        result.put("casesByAuditType", casesByAuditType);
        result.put("casesByTeamLeader", casesByTeamLeader);
        result.put("taxCentersProcessed", casesByTaxCenter.size());
        result.put("status", totalCasesCreated > 0 ? "FINALIZED" : "NO_CASES_CREATED");
        result.put("message", totalCasesCreated > 0
            ? "Plan cascaded to " + totalCasesCreated + " audit cases across " + casesByTaxCenter.size() + " tax centers with team leader assignments"
            : "No cases could be created. Check tax center allocations and taxpayer data.");

        return result;
    }

    /**
     * Get team leader IDs for a tax center and audit type
     * Tax center code for team leaders: AA-01 format (not TC-AA-01)
     */
    private List<String> getTeamLeaderIds(String tlTaxCenterCode, String auditTypeCode) {
        try {
            List<Map<String, Object>> leaders = userManagementPort.getTeamLeaders(tlTaxCenterCode, auditTypeCode);
            return leaders.stream()
                .map(m -> (String) m.get("userId"))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("⚠️ Failed to get team leaders for " + tlTaxCenterCode + "/" + auditTypeCode + ": " + e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * Get committee member IDs for Joint Audit or Transfer Pricing
     */
    private List<String> getCommitteeMemberIds(String auditType) {
        try {
            List<Map<String, Object>> members = userManagementPort.getCommitteeMembers(auditType);
            return members.stream()
                .map(m -> (String) m.get("userId"))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("⚠️ Failed to get committee members for " + auditType + ": " + e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * Map backend tax center code (AA-TC1) to team leader lookup format (AA-01)
     */
    private String mapToFrontendTcCode(String taxCenterCode) {
        // AA-TC1 → AA-01
        // AA-TC2 → AA-02
        if (taxCenterCode.contains("-TC")) {
            String[] parts = taxCenterCode.split("-TC");
            if (parts.length == 2) {
                return parts[0] + "-" + String.format("%02d", Integer.parseInt(parts[1]));
            }
        }
        return taxCenterCode;
    }

    /**
     * Parse audit type breakdown from allocation's JSON field
     */
    private Map<String, Integer> parseAuditTypeBreakdown(PlanAllocationEntity allocation) {
        Map<String, Integer> breakdown = new LinkedHashMap<>();

        try {
            JsonNode auditTypeJson = allocation.getAllocationByAuditType();
            if (auditTypeJson != null && !auditTypeJson.isNull() && auditTypeJson.isObject()) {
                auditTypeJson.fields().forEachRemaining(entry -> {
                    try {
                        breakdown.put(entry.getKey(), entry.getValue().asInt());
                    } catch (Exception e) {
                        // Skip non-integer values
                    }
                });
            }
        } catch (Exception e) {
            System.err.println("⚠️ Failed to parse audit type breakdown: " + e.getMessage());
        }

        return breakdown;
    }

    /**
     * Generate a globally unique case number: YEAR-PLANSHORT-REGION-TC-NNNN
     * PLANSHORT is first 8 chars of plan UUID to avoid cross-plan conflicts
     */
    private String generateCaseNumber(AnnualAuditPlanEntity plan, String region, String taxCenter, AtomicInteger counter) {
        String year = String.valueOf(plan.getYear());
        String planShort = plan.getId().toString().substring(0, 8);
        String seq = String.format("%04d", counter.getAndIncrement());
        return year + "-" + planShort + "-" + region + "-" + taxCenter + "-" + seq;
    }
}
