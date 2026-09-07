package mor.itas.api.controller.backoffice.ap;

import mor.itas.api.dto.response.ap.GenericResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * PlanningConfigController — REST controller for dynamic audit planning & resource configuration.
 * 
 * Allows the Audit Planning Team to configure:
 * 1. Audit Types (name, effort hours per case, complexity, revenue per case, governance routing)
 * 2. Auditor Capacity & Available Resources (annual working days, daily hours, direct productive ratio)
 * 3. Configurable Regions (Add / Remove / Edit regions) & Nested Tax Centers (optional per region)
 * 4. Effort Estimation & Multipliers (complexity multipliers, contingency buffer)
 */
@RestController
@RequestMapping("/api/v1/backoffice/ap/config/planning")
@CrossOrigin(origins = "*")
public class PlanningConfigController {

    private final Map<String, Object> currentConfig = new ConcurrentHashMap<>();

    public PlanningConfigController() {
        initDefaultConfig();
    }

    private synchronized void initDefaultConfig() {
        currentConfig.clear();

        // 1. Audit Types
        List<Map<String, Object>> auditTypes = new ArrayList<>();
        auditTypes.add(createAuditType("desk_audit", "Desk Audit", "Desk", 40, "Low", 150000L, "TEAM_LEADER", "blue", "Remote audit using taxpayer electronic records & ITAS cross-matching"));
        auditTypes.add(createAuditType("field_audit", "Field Audit", "Field", 120, "Medium", 350000L, "TEAM_LEADER", "green", "Comprehensive on-site audit with physical premises verification"));
        auditTypes.add(createAuditType("joint_audit", "Joint Audit", "Joint", 160, "High", 750000L, "COMMITTEE", "purple", "Cross-directorate coordinated audit with Customs and Regional offices"));
        auditTypes.add(createAuditType("transfer_pricing", "Transfer Pricing", "TP", 80, "High", 1500000L, "COMMITTEE", "orange", "Specialized cross-border intercompany transaction & BEPS examination"));
        auditTypes.add(createAuditType("comprehensive", "Comprehensive", "Comp", 200, "Very High", 1000000L, "TEAM_LEADER", "red", "Full-scope statutory corporate income tax, VAT, and excise audit"));
        auditTypes.add(createAuditType("issue_audit", "Issue Audit", "Issue", 50, "Medium", 250000L, "TEAM_LEADER", "teal", "Targeted single-issue or specific risk transaction examination"));
        currentConfig.put("auditTypes", auditTypes);

        // 2. Capacity & Resource Parameters
        Map<String, Object> capacity = new LinkedHashMap<>();
        capacity.put("workingDaysPerYear", 220);
        capacity.put("hoursPerDay", 8.0);
        capacity.put("directProductiveRatio", 0.75); // 75% on active audit cases
        capacity.put("annualTrainingDays", 5);
        capacity.put("annualLeaveDays", 20);
        
        // Regional Headcount Matrix
        Map<String, Integer> regionalHeadcount = new LinkedHashMap<>();
        regionalHeadcount.put("federal_level", 120);
        regionalHeadcount.put("addis_ababa", 600);
        regionalHeadcount.put("oromia", 400);
        regionalHeadcount.put("amhara", 250);
        regionalHeadcount.put("dire_dawa", 50);
        regionalHeadcount.put("snnpr", 80);
        regionalHeadcount.put("somali", 100);
        regionalHeadcount.put("sidama", 100);
        capacity.put("regionalHeadcount", regionalHeadcount);
        currentConfig.put("capacity", capacity);

        // 3. Configurable Regions with Optional Nested Tax Centers
        List<Map<String, Object>> regions = new ArrayList<>();
        regions.add(createRegion("federal_level", "Federal Level (LTO)", "FED", 120, 150000L, Arrays.asList(
            createTaxCenter("federal-lto1", "Federal Large Taxpayers Office 1", "FED-LTO1"),
            createTaxCenter("federal-lto2", "Federal Large Taxpayers Office 2", "FED-LTO2")
        )));
        regions.add(createRegion("addis_ababa", "Addis Ababa", "AA", 600, 2500000L, Arrays.asList(
            createTaxCenter("addis_ababa-tc1", "Addis Ababa TC1", "AA-TC1"),
            createTaxCenter("addis_ababa-tc2", "Addis Ababa TC2", "AA-TC2"),
            createTaxCenter("addis_ababa-tc3", "Addis Ababa TC3", "AA-TC3")
        )));
        regions.add(createRegion("oromia", "Oromia", "BB", 400, 1300000L, Arrays.asList(
            createTaxCenter("oromia-tc1", "Oromia TC1", "BB-TC1"),
            createTaxCenter("oromia-tc2", "Oromia TC2", "BB-TC2"),
            createTaxCenter("oromia-tc3", "Oromia TC3", "BB-TC3")
        )));
        regions.add(createRegion("amhara", "Amhara", "BA", 250, 750000L, Arrays.asList(
            createTaxCenter("amhara-tc1", "Amhara TC1", "BA-TC1"),
            createTaxCenter("amhara-tc2", "Amhara TC2", "BA-TC2"),
            createTaxCenter("amhara-tc3", "Amhara TC3", "BA-TC3")
        )));
        regions.add(createRegion("dire_dawa", "Dire Dawa", "AB", 50, 100000L, Arrays.asList(
            createTaxCenter("dire_dawa-tc1", "Dire Dawa TC1", "AB-TC1"),
            createTaxCenter("dire_dawa-tc2", "Dire Dawa TC2", "AB-TC2"),
            createTaxCenter("dire_dawa-tc3", "Dire Dawa TC3", "AB-TC3")
        )));
        regions.add(createRegion("snnpr", "SNNPR", "CA", 80, 280000L, Arrays.asList(
            createTaxCenter("snnpr-tc1", "SNNPR TC1", "CA-TC1"),
            createTaxCenter("snnpr-tc2", "SNNPR TC2", "CA-TC2"),
            createTaxCenter("snnpr-tc3", "SNNPR TC3", "CA-TC3")
        )));
        regions.add(createRegion("somali", "Somali", "SO", 100, 200000L, Arrays.asList(
            createTaxCenter("somali-tc1", "Somali TC1", "SO-TC1"),
            createTaxCenter("somali-tc2", "Somali TC2", "SO-TC2"),
            createTaxCenter("somali-tc3", "Somali TC3", "SO-TC3")
        )));
        regions.add(createRegion("sidama", "Sidama", "SI", 100, 350000L, new ArrayList<>()));
        currentConfig.put("regions", regions);

        // 4. Effort Estimation & Multipliers
        Map<String, Object> effortEstimation = new LinkedHashMap<>();
        Map<String, Double> complexityMultipliers = new LinkedHashMap<>();
        complexityMultipliers.put("Low", 0.85);
        complexityMultipliers.put("Medium", 1.0);
        complexityMultipliers.put("High", 1.35);
        complexityMultipliers.put("Very High", 1.70);
        effortEstimation.put("complexityMultipliers", complexityMultipliers);
        effortEstimation.put("contingencyBufferPercentage", 15); // 15% buffer
        effortEstimation.put("travelOverheadHoursPerFieldCase", 16);
        currentConfig.put("effortEstimation", effortEstimation);

        // Metadata
        currentConfig.put("lastUpdated", OffsetDateTime.now().toString());
        currentConfig.put("updatedBy", "SYSTEM_DEFAULT");
        currentConfig.put("version", 1);
    }

    private Map<String, Object> createAuditType(String id, String name, String shortName, int effortPerCase, 
                                                String complexity, long revenuePerCase, String governanceRouting, 
                                                String color, String description) {
        Map<String, Object> type = new LinkedHashMap<>();
        type.put("id", id);
        type.put("name", name);
        type.put("shortName", shortName);
        type.put("effortPerCase", effortPerCase);
        type.put("complexity", complexity);
        type.put("revenuePerCase", revenuePerCase);
        type.put("governanceRouting", governanceRouting); // "TEAM_LEADER" or "COMMITTEE"
        type.put("color", color);
        type.put("description", description);
        type.put("active", true);
        return type;
    }

    private Map<String, Object> createRegion(String id, String name, String code, int headcount, long taxpayers, List<Map<String, String>> taxCenters) {
        Map<String, Object> reg = new LinkedHashMap<>();
        reg.put("id", id);
        reg.put("name", name);
        reg.put("code", code);
        reg.put("headcount", headcount);
        reg.put("taxpayers", taxpayers);
        reg.put("taxCenters", taxCenters != null ? new ArrayList<>(taxCenters) : new ArrayList<>());
        reg.put("active", true);
        return reg;
    }

    private Map<String, String> createTaxCenter(String id, String name, String shortName) {
        Map<String, String> tc = new LinkedHashMap<>();
        tc.put("id", id);
        tc.put("name", name);
        tc.put("shortName", shortName);
        return tc;
    }

    /**
     * GET /api/v1/backoffice/ap/config/planning
     */
    @GetMapping
    public ResponseEntity<GenericResponse<Map<String, Object>>> getPlanningConfig() {
        return ResponseEntity.ok(GenericResponse.success(new LinkedHashMap<>(currentConfig)));
    }

    /**
     * PUT /api/v1/backoffice/ap/config/planning
     */
    @PutMapping
    public ResponseEntity<GenericResponse<Map<String, Object>>> updatePlanningConfig(@RequestBody Map<String, Object> newConfig) {
        if (newConfig == null || newConfig.isEmpty()) {
            return ResponseEntity.badRequest().body(GenericResponse.error("INVALID_CONFIG", "Configuration payload cannot be empty"));
        }

        synchronized (this) {
            if (newConfig.containsKey("auditTypes")) {
                currentConfig.put("auditTypes", newConfig.get("auditTypes"));
            }
            if (newConfig.containsKey("capacity")) {
                currentConfig.put("capacity", newConfig.get("capacity"));
            }
            if (newConfig.containsKey("regions")) {
                currentConfig.put("regions", newConfig.get("regions"));
            }
            if (newConfig.containsKey("effortEstimation")) {
                currentConfig.put("effortEstimation", newConfig.get("effortEstimation"));
            }

            int prevVersion = (int) currentConfig.getOrDefault("version", 1);
            currentConfig.put("version", prevVersion + 1);
            currentConfig.put("lastUpdated", OffsetDateTime.now().toString());
            currentConfig.put("updatedBy", newConfig.getOrDefault("updatedBy", "Planning Team"));
        }

        return ResponseEntity.ok(GenericResponse.success(new LinkedHashMap<>(currentConfig)));
    }

    /**
     * POST /api/v1/backoffice/ap/config/planning/reset
     */
    @PostMapping("/reset")
    public ResponseEntity<GenericResponse<Map<String, Object>>> resetPlanningConfig() {
        initDefaultConfig();
        return ResponseEntity.ok(GenericResponse.success(new LinkedHashMap<>(currentConfig)));
    }
}
