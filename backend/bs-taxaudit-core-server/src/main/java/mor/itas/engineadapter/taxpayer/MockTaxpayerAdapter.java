package mor.itas.engineadapter.taxpayer;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

/**
 * MockTaxpayerAdapter - Smart taxpayer generation
 *
 * APPROACH: 30,000 lightweight IDs per tax center (for plan allocation matching)
 *           + 500 real detailed profiles per tax center (for actual case creation)
 *
 * When the risk engine classifies, only the 500 real profiles get full risk scores.
 * The remaining 29,500 get synthetic risk scores for counting purposes.
 */
@Component
@Profile("mock")
public class MockTaxpayerAdapter {

    // All taxpayers (including lightweight ones)
    private static final Map<String, Map<String, Object>> TAXPAYERS = new LinkedHashMap<>();
    // Only detailed taxpayers (the 500 per tax center)
    private static final Map<String, List<Map<String, Object>>> DETAILED_TAXPAYERS = new HashMap<>();

    private static final int DETAILED_PER_TC = 500;

    private static final String[] PREFIXES = {"Prime", "Global", "National", "Imperial", "Royal", "Elite",
        "United", "Alpha", "Beta", "Sigma", "Zenith", "Apex", "Nova", "Delta", "Omega",
        "Phoenix", "Summit", "Crest", "Pinnacle", "Vanguard"};
    private static final String[] SUFFIXES = {"Trading", "Industries", "Corporation", "Services", "Company",
        "Ltd", "Group", "Enterprises", "Solutions", "Hub", "PLC", "Factory",
        "Export", "Import", "Cooperative", "SC", "Bank", "Insurance", "Brewery", "Hotel"};
    private static final String[] BUSINESS_TYPES = {"Individual", "Company", "Partnership", "Cooperative"};
    private static final String[] COMPLIANCE = {"Compliant", "Non-Compliant", "Mixed", "New"};
    private static final String[] OPERATING = {"Active", "Suspended", "Closed", "Dormant"};

    private static volatile boolean initialized = false;

    private static synchronized void ensureInitialized() {
        if (!initialized) {
            initializeTaxpayers();
            initialized = true;
        }
    }

    private static void initializeTaxpayers() {
        Map<String, Integer> taxCenterQuotas = new LinkedHashMap<>();
        taxCenterQuotas.put("TC-AA-01", 30000);
        taxCenterQuotas.put("TC-AA-02", 25000);
        taxCenterQuotas.put("TC-AA-03", 22000);
        taxCenterQuotas.put("TC-AA-04", 18000);
        taxCenterQuotas.put("TC-AB-01", 10000);
        taxCenterQuotas.put("TC-AB-02", 8000);
        taxCenterQuotas.put("TC-AB-03", 6000);
        taxCenterQuotas.put("TC-BA-01", 15000);
        taxCenterQuotas.put("TC-BA-02", 12000);
        taxCenterQuotas.put("TC-BA-03", 10000);
        taxCenterQuotas.put("TC-BB-01", 15000);
        taxCenterQuotas.put("TC-BB-02", 12000);
        taxCenterQuotas.put("TC-BB-03", 10000);
        taxCenterQuotas.put("TC-CA-01", 8000);
        taxCenterQuotas.put("TC-CA-02", 6000);
        taxCenterQuotas.put("TC-SO-01", 5000);

        String[] sectors = {"Manufacturing", "Trade", "Services", "Agriculture", "Technology",
            "Transportation", "Construction", "Wholesale", "Retail", "Finance",
            "Healthcare", "Education", "Hospitality", "Energy", "Real Estate",
            "Telecommunications", "Mining", "Import/Export", "Pharmaceuticals", "Textiles"};

        int globalId = 1;

        for (Map.Entry<String, Integer> entry : taxCenterQuotas.entrySet()) {
            String taxCenter = entry.getKey();
            int quota = entry.getValue();
            List<Map<String, Object>> detailed = new ArrayList<>();

            for (int i = 1; i <= quota; i++) {
                String tin = String.format("ETH%06d", globalId);
                boolean isDetailed = i <= DETAILED_PER_TC;

                Map<String, Object> taxpayer;
                if (isDetailed) {
                    taxpayer = createDetailedTaxpayer(globalId, tin, taxCenter, sectors);
                    detailed.add(taxpayer);
                } else {
                    taxpayer = createLightweightTaxpayer(globalId, tin, taxCenter, sectors);
                }

                TAXPAYERS.put(tin, taxpayer);
                globalId++;
            }

            DETAILED_TAXPAYERS.put(taxCenter, detailed);
        }
    }

    /**
     * Create a full-detail taxpayer with financials, compliance history, risk flags, estimated revenue
     */
    private static Map<String, Object> createDetailedTaxpayer(int id, String tin, String taxCenter, String[] sectors) {
        Map<String, Object> tp = new HashMap<>();
        tp.put("tin", tin);
        tp.put("taxpayerId", "TP-" + id);
        tp.put("name", generateName(id, sectors));
        tp.put("businessType", BUSINESS_TYPES[id % BUSINESS_TYPES.length]);
        tp.put("sector", sectors[id % sectors.length]);
        tp.put("businessSize", getBusinessSize(id));
        tp.put("registrationDate", String.format("%04d-%02d-%02d", 2010 + (id % 16), 1 + (id % 12), 1 + (id % 28)));
        tp.put("operatingStatus", OPERATING[(id * 11) % OPERATING.length]);
        tp.put("complianceStatus", COMPLIANCE[(id * 13) % COMPLIANCE.length]);
        tp.put("taxCenter", taxCenter);
        tp.put("region", taxCenter.substring(3, 5));
        tp.put("city", taxCenter.substring(3, 5));

        long annualRevenue = genRevenue(id);
        Map<String, Object> financials = new HashMap<>();
        financials.put("annualRevenue", annualRevenue);
        financials.put("taxPayable", (long)(annualRevenue * 0.15));
        financials.put("taxPaid", (long)(annualRevenue * 0.12));
        financials.put("employeeCount", genEmployees(id));
        tp.put("financials", financials);
        tp.put("estimatedRevenue", genEstRevenue(annualRevenue, id));

        tp.put("complianceHistory", genHistory(id));
        tp.put("hasInternationalOperations", (id % 7) == 0);
        tp.put("hasRelatedParties", (id % 5) == 0);
        tp.put("tpRiskFlag", (id % 11) == 0);
        tp.put("jaRiskFlag", (id % 13) == 0);

        // Run risk classification on detailed taxpayer
        Map<String, Object> risk = classifyRisk(tp);
        tp.put("recommendedAuditType", risk.get("auditType"));
        tp.put("riskScore", risk.get("riskScore"));
        tp.put("riskLevel", risk.get("riskLevel"));
        tp.put("riskReason", risk.get("reason"));

        return tp;
    }

    /**
     * Create a lightweight taxpayer - just enough fields for the risk engine to classify
     */
    private static Map<String, Object> createLightweightTaxpayer(int id, String tin, String taxCenter, String[] sectors) {
        Map<String, Object> tp = new HashMap<>();
        tp.put("tin", tin);
        tp.put("taxpayerId", "TP-" + id);
        tp.put("name", generateName(id, sectors));
        tp.put("sector", sectors[id % sectors.length]);
        tp.put("taxCenter", taxCenter);
        tp.put("region", taxCenter.substring(3, 5));
        tp.put("annualRevenue", genRevenue(id));
        tp.put("estimatedRevenue", genEstRevenue(genRevenue(id), id));
        tp.put("employeeCount", genEmployees(id));
        tp.put("businessSize", getBusinessSize(id));
        tp.put("complianceStatus", COMPLIANCE[(id * 13) % COMPLIANCE.length]);
        tp.put("hasInternationalOperations", (id % 7) == 0);
        tp.put("hasRelatedParties", (id % 5) == 0);
        tp.put("tpRiskFlag", (id % 11) == 0);
        tp.put("jaRiskFlag", (id % 13) == 0);

        // Quick risk classification without full compliance history
        String auditType;
        int riskScore;
        if ((id % 11) == 0 || genRevenue(id) > 100_000_000) {
            auditType = "transfer_pricing";
            riskScore = 50 + (id % 50);
        } else if ((id % 13) == 0 || getBusinessSize(id).equals("Large")) {
            auditType = "joint_audit";
            riskScore = 40 + (id % 30);
        } else if ("Non-Compliant".equals(COMPLIANCE[(id * 13) % COMPLIANCE.length])) {
            auditType = "comprehensive";
            riskScore = 35 + (id % 25);
        } else if ((id % 3) == 0) {
            auditType = "issue_audit";
            riskScore = 20 + (id % 15);
        } else {
            auditType = "desk_audit";
            riskScore = 5 + (id % 20);
        }
        String riskLevel = riskScore >= 50 ? "CRITICAL" : riskScore >= 35 ? "HIGH" : riskScore >= 20 ? "MEDIUM" : "LOW";

        tp.put("recommendedAuditType", auditType);
        tp.put("riskScore", riskScore);
        tp.put("riskLevel", riskLevel);

        return tp;
    }

    /**
     * Full risk classification using compliance history (for detailed taxpayers)
     */
    private static Map<String, Object> classifyRisk(Map<String, Object> tp) {
        int riskScore = 0;
        String auditType = "desk_audit";
        List<String> reasons = new ArrayList<>();

        boolean hasTP = Boolean.TRUE.equals(tp.get("tpRiskFlag"));
        boolean hasIntOps = Boolean.TRUE.equals(tp.get("hasInternationalOperations"));
        boolean hasRelated = Boolean.TRUE.equals(tp.get("hasRelatedParties"));
        long revenue = genRevenue(((String) tp.get("taxpayerId")).replace("TP-", "").hashCode());

        if (hasTP || (hasIntOps && hasRelated)) { riskScore += 40; reasons.add("TP risk"); }
        if (revenue > 50_000_000) { riskScore += 20; reasons.add("High revenue"); }

        boolean hasJA = Boolean.TRUE.equals(tp.get("jaRiskFlag"));
        boolean isLarge = "Large".equals(tp.get("businessSize"));
        if (hasJA || isLarge) { riskScore += 30; reasons.add("JA risk"); }

        boolean isNonComp = "Non-Compliant".equals(tp.get("complianceStatus"));
        if (isNonComp) { riskScore += 25; reasons.add("Non-compliant"); }

        if (riskScore >= 50 && (hasTP || revenue > 50_000_000)) auditType = "transfer_pricing";
        else if (riskScore >= 40 && (hasJA || isLarge)) auditType = "joint_audit";
        else if (riskScore >= 35 && isNonComp) auditType = "comprehensive";
        else if (riskScore >= 20) auditType = "issue_audit";
        else { auditType = "desk_audit"; riskScore = Math.max(riskScore, 5); }

        String level = riskScore >= 50 ? "CRITICAL" : riskScore >= 35 ? "HIGH" : riskScore >= 20 ? "MEDIUM" : "LOW";
        return Map.of("auditType", auditType, "riskScore", riskScore, "riskLevel", level,
            "reason", reasons.isEmpty() ? "Standard" : String.join("; ", reasons));
    }

    private static long genEstRevenue(long annualRevenue, int id) {
        double rate;
        int f = id % 10;
        if (f < 2) rate = 0.02;
        else if (f < 5) rate = 0.05;
        else if (f < 8) rate = 0.10;
        else rate = 0.18;
        return (long)(annualRevenue * rate);
    }

    // ── Lookup methods ──

    public Map<String, Object> getTaxpayerById(String tin) { ensureInitialized(); return TAXPAYERS.get(tin); }

    public List<Map<String, Object>> getTaxpayersForTaxCenter(String taxCenter) {
        ensureInitialized();
        return TAXPAYERS.values().stream()
            .filter(tp -> taxCenter.equals(tp.get("taxCenter")))
            .collect(Collectors.toList());
    }

    /** Get only the 500 detailed taxpayers for a tax center (for actual case creation) */
    public List<Map<String, Object>> getDetailedTaxpayersForTaxCenter(String taxCenter) {
        ensureInitialized();
        return DETAILED_TAXPAYERS.getOrDefault(taxCenter, Collections.emptyList());
    }

    public List<Map<String, Object>> getTaxpayersForRegion(String region) {
        ensureInitialized();
        return TAXPAYERS.values().stream()
            .filter(tp -> region.equals(tp.get("region")))
            .collect(Collectors.toList());
    }

    public List<Map<String, Object>> searchTaxpayers(Map<String, Object> criteria) {
        ensureInitialized();
        return TAXPAYERS.values().stream()
            .filter(tp -> {
                for (var e : criteria.entrySet()) {
                    if (!Objects.equals(tp.get(e.getKey()), e.getValue())) return false;
                }
                return true;
            }).collect(Collectors.toList());
    }

    public int getTotalTaxpayerCount() { ensureInitialized(); return TAXPAYERS.size(); }

    public Map<String, Integer> getTaxCenterCounts() {
        ensureInitialized();
        Map<String, Integer> counts = new HashMap<>();
        for (Map<String, Object> tp : TAXPAYERS.values()) {
            counts.merge((String) tp.get("taxCenter"), 1, Integer::sum);
        }
        return counts;
    }

    // ── Generation helpers ──

    private static long genRevenue(int id) {
        long lid = (long) id;
        int s = id % 100;
        if (s < 25) return 50_000L + lid * 300;
        if (s < 50) return 1_000_000L + lid * 1_000;
        if (s < 80) return 10_000_000L + lid * 5_000;
        return 100_000_000L + lid * 100_000;
    }

    private static int genEmployees(int id) {
        int s = id % 100;
        if (s < 25) return 1 + (id % 5);
        if (s < 50) return 5 + (id % 25);
        if (s < 80) return 25 + (id % 150);
        return 150 + (id % 800);
    }

    private static String getBusinessSize(int id) {
        int s = id % 100;
        if (s < 25) return "Micro";
        if (s < 50) return "Small";
        if (s < 80) return "Medium";
        return "Large";
    }

    private static String generateName(int id, String[] sectors) {
        return PREFIXES[(id * 3) % PREFIXES.length] + " " + sectors[id % sectors.length] + " " +
            SUFFIXES[(id * 5) % SUFFIXES.length];
    }

    private static List<Map<String, Object>> genHistory(int id) {
        List<Map<String, Object>> h = new ArrayList<>();
        Map<String, Object> y25 = new HashMap<>();
        y25.put("year", 2025);
        y25.put("status", (id % 4) == 0 ? "Fully Compliant" : (id % 3) == 0 ? "Non-Compliant" : "Partially Compliant");
        y25.put("filedReturns", (id % 3) != 0);
        y25.put("paidTaxes", (id % 5) != 0);
        h.add(y25);
        Map<String, Object> y24 = new HashMap<>();
        y24.put("year", 2024);
        y24.put("status", (id % 5) == 0 ? "Fully Compliant" : (id % 4) == 0 ? "Non-Compliant" : "Partially Compliant");
        y24.put("filedReturns", (id % 4) != 0);
        y24.put("paidTaxes", (id % 6) != 0);
        h.add(y24);
        return h;
    }
}
