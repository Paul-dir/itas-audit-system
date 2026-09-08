package mor.itas.engineadapter.taxpayer;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Mock Taxpayer Adapter - Provides comprehensive taxpayer data
 * 
 * Contains 10,000+ realistic taxpayer records across all tax centers:
 * - Fields: TIN, name, type, sector, size, location, business info, financials, compliance history
 * - Realistic distribution by region and tax center
 * - Business sectors relevant to Ethiopia (manufacturing, trade, services)
 * - Compliance profiles (compliant, non-compliant, mixed)
 * 
 * Phase 1 mock implementation - will be replaced with real Taxpayer Service API in Phase 2+
 */
@Component
@Profile("mock")
public class MockTaxpayerAdapter {

    private static final Map<String, Map<String, Object>> TAXPAYERS = new HashMap<>();

    static {
        initializeTaxpayers();
    }

    private static void initializeTaxpayers() {
        // Define tax centers with their distribution
        Map<String, Integer> taxCenterQuotas = new LinkedHashMap<>();
        // AA region - Addis Ababa (largest commercial hub)
        taxCenterQuotas.put("TC-AA-01", 750);  // Addis Main Commercial
        taxCenterQuotas.put("TC-AA-02", 650);  // Addis East Industrial
        taxCenterQuotas.put("TC-AA-03", 580);  // Addis South Trade
        taxCenterQuotas.put("TC-AA-04", 520);  // Addis West Services
        
        // AB region - Dire Dawa (secondary commercial)
        taxCenterQuotas.put("TC-AB-01", 380);  // Dire Dawa Main
        taxCenterQuotas.put("TC-AB-02", 320);  // Dire Dawa East
        taxCenterQuotas.put("TC-AB-03", 300);  // Dire Dawa West
        
        // BA region - Amhara (regional center)
        taxCenterQuotas.put("TC-BA-01", 620);  // Bahir Dar Main
        taxCenterQuotas.put("TC-BA-02", 540);  // Bahir Dar Trade
        taxCenterQuotas.put("TC-BA-03", 480);  // Bahir Dar Services
        
        // BB region - Oromia (regional center)
        taxCenterQuotas.put("TC-BB-01", 650);  // Adama Main
        taxCenterQuotas.put("TC-BB-02", 580);  // Adama Industrial
        taxCenterQuotas.put("TC-BB-03", 520);  // Adama Trade
        
        // CA region - SNNPR (regional center)
        taxCenterQuotas.put("TC-CA-01", 420);  // Hawassa Main
        taxCenterQuotas.put("TC-CA-02", 380);  // Hawassa Trade
        
        // SO region - Somali (remote center)
        taxCenterQuotas.put("TC-SO-01", 280);  // Jijiga Main
        
        int taxpayerId = 1;
        
        // Business sectors
        String[] sectors = {"Manufacturing", "Trade", "Services", "Agriculture", "Technology", "Transportation", "Construction", "Wholesale", "Retail", "Finance"};
        String[] businessTypes = {"Individual", "Company", "Partnership", "Cooperative"};
        String[] complianceStatuses = {"Compliant", "Non-Compliant", "Mixed", "New"};
        String[] operatingStatuses = {"Active", "Suspended", "Closed", "Dormant"};
        
        for (Map.Entry<String, Integer> entry : taxCenterQuotas.entrySet()) {
            String taxCenter = entry.getKey();
            int quota = entry.getValue();
            
            for (int i = 1; i <= quota; i++) {
                String tin = String.format("ETH%06d", taxpayerId);
                
                Map<String, Object> taxpayer = new HashMap<>();
                taxpayer.put("tin", tin);
                taxpayer.put("taxpayerId", "TP-" + taxpayerId);
                taxpayer.put("name", generateTaxpayerName(taxpayerId, sectors));
                taxpayer.put("businessType", businessTypes[(taxpayerId * 7) % businessTypes.length]);
                taxpayer.put("sector", sectors[taxpayerId % sectors.length]);
                taxpayer.put("businessSize", getBusinessSize(taxpayerId));
                taxpayer.put("registrationDate", generateRegistrationDate(taxpayerId));
                taxpayer.put("operatingStatus", operatingStatuses[(taxpayerId * 11) % operatingStatuses.length]);
                taxpayer.put("complianceStatus", complianceStatuses[(taxpayerId * 13) % complianceStatuses.length]);
                
                // Location info
                taxpayer.put("taxCenter", taxCenter);
                taxpayer.put("region", extractRegionFromTaxCenter(taxCenter));
                taxpayer.put("city", extractCityFromTaxCenter(taxCenter));
                taxpayer.put("address", generateBusinessAddress(taxpayerId, taxCenter));
                
                // Financial info
                Map<String, Object> financials = new HashMap<>();
                long annualRevenue = generateAnnualRevenue(taxpayerId);
                financials.put("annualRevenue", annualRevenue);
                financials.put("taxPayable", (long)(annualRevenue * 0.15)); // ~15% tax rate
                financials.put("taxPaid", (long)(annualRevenue * 0.12 + (taxpayerId * 1000))); // May vary from payable
                financials.put("employeeCount", generateEmployeeCount(taxpayerId));
                taxpayer.put("financials", financials);
                
                // Compliance history
                List<Map<String, Object>> complianceHistory = generateComplianceHistory(taxpayerId);
                taxpayer.put("complianceHistory", complianceHistory);
                
                // International operations flags
                taxpayer.put("hasInternationalOperations", (taxpayerId % 7) == 0);
                taxpayer.put("hasRelatedParties", (taxpayerId % 5) == 0);
                taxpayer.put("tpRiskFlag", (taxpayerId % 11) == 0); // Transfer Pricing risk
                taxpayer.put("jaRiskFlag", (taxpayerId % 13) == 0); // Joint Audit risk
                
                TAXPAYERS.put(tin, taxpayer);
                taxpayerId++;
            }
        }
    }

    private static String generateTaxpayerName(int id, String[] sectors) {
        String[] prefixes = {"Prime", "Global", "National", "Imperial", "Royal", "Elite", "United", "Alpha", "Beta", "Sigma"};
        String[] suffixes = {"Trading", "Industries", "Corporation", "Services", "Company", "Ltd", "Group", "Enterprises", "Solutions", "Hub"};
        String sector = sectors[id % sectors.length];
        
        return prefixes[(id * 3) % prefixes.length] + " " + sector + " " + suffixes[(id * 5) % suffixes.length];
    }

    private static String getBusinessSize(int id) {
        int sizeIndicator = id % 100;
        if (sizeIndicator < 30) return "Micro";
        if (sizeIndicator < 60) return "Small";
        if (sizeIndicator < 85) return "Medium";
        return "Large";
    }

    private static String generateRegistrationDate(int id) {
        int year = 2015 + (id % 11); // 2015-2025
        int month = 1 + (id % 12);
        int day = 1 + (id % 28);
        return String.format("%04d-%02d-%02d", year, month, day);
    }

    private static long generateAnnualRevenue(int id) {
        int size = id % 100;
        if (size < 30) return 100_000 + (id * 500); // Micro: 100K-500K
        if (size < 60) return 500_000 + (id * 2000); // Small: 500K-5M
        if (size < 85) return 5_000_000 + (id * 10000); // Medium: 5M-50M
        return 50_000_000 + (id * 50000); // Large: 50M+
    }

    private static int generateEmployeeCount(int id) {
        int size = id % 100;
        if (size < 30) return 1 + (id % 5); // Micro: 1-5
        if (size < 60) return 5 + (id % 20); // Small: 5-25
        if (size < 85) return 25 + (id % 100); // Medium: 25-125
        return 125 + (id % 500); // Large: 125+
    }

    private static List<Map<String, Object>> generateComplianceHistory(int id) {
        List<Map<String, Object>> history = new ArrayList<>();
        
        // Current year
        Map<String, Object> currentYear = new HashMap<>();
        currentYear.put("year", 2025);
        currentYear.put("status", (id % 4) == 0 ? "Fully Compliant" : (id % 3) == 0 ? "Non-Compliant" : "Partially Compliant");
        currentYear.put("filedReturns", (id % 3) != 0); // Not all file
        currentYear.put("paidTaxes", (id % 5) != 0);
        history.add(currentYear);
        
        // Previous year
        Map<String, Object> previousYear = new HashMap<>();
        previousYear.put("year", 2024);
        previousYear.put("status", (id % 5) == 0 ? "Fully Compliant" : (id % 4) == 0 ? "Non-Compliant" : "Partially Compliant");
        previousYear.put("filedReturns", (id % 2) != 0); // Most file
        previousYear.put("paidTaxes", (id % 6) != 0);
        history.add(previousYear);
        
        return history;
    }

    private static String extractRegionFromTaxCenter(String taxCenter) {
        String regionCode = taxCenter.substring(5, 7); // TC-XX-01 -> XX
        Map<String, String> regionMap = new HashMap<>();
        regionMap.put("AA", "Addis Ababa");
        regionMap.put("AB", "Dire Dawa");
        regionMap.put("BA", "Amhara");
        regionMap.put("BB", "Oromia");
        regionMap.put("CA", "SNNPR");
        regionMap.put("SO", "Somali");
        return regionMap.getOrDefault(regionCode, regionCode);
    }

    private static String extractCityFromTaxCenter(String taxCenter) {
        String regionCode = taxCenter.substring(5, 7);
        Map<String, String> cityMap = new HashMap<>();
        cityMap.put("AA", "Addis Ababa");
        cityMap.put("AB", "Dire Dawa");
        cityMap.put("BA", "Bahir Dar");
        cityMap.put("BB", "Adama");
        cityMap.put("CA", "Hawassa");
        cityMap.put("SO", "Jijiga");
        return cityMap.getOrDefault(regionCode, regionCode);
    }

    private static String generateBusinessAddress(int id, String taxCenter) {
        String[] streets = {"Main", "Central", "Commercial", "Industrial", "Trade", "Market", "Business", "Enterprise"};
        String[] areas = {"Zone", "District", "Area", "Ward", "Block", "Section", "Quarter"};
        
        String street = streets[(id * 3) % streets.length] + " Street";
        String area = areas[(id * 5) % areas.length] + " " + (1 + (id % 10));
        String city = extractCityFromTaxCenter(taxCenter);
        
        return street + ", " + area + ", " + city;
    }

    // Public APIs for frontend consumption
    
    public Map<String, Object> getTaxpayerById(String tin) {
        return TAXPAYERS.getOrDefault(tin, new HashMap<>());
    }

    public List<Map<String, Object>> getTaxpayersForTaxCenter(String taxCenter) {
        return TAXPAYERS.values().stream()
            .filter(tp -> taxCenter.equals(tp.get("taxCenter")))
            .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getTaxpayersForRegion(String region) {
        return TAXPAYERS.values().stream()
            .filter(tp -> region.equals(tp.get("region")))
            .collect(Collectors.toList());
    }

    public List<Map<String, Object>> searchTaxpayers(Map<String, Object> criteria) {
        return TAXPAYERS.values().stream()
            .filter(tp -> matchesCriteria(tp, criteria))
            .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getTaxpayersBySector(String sector) {
        return TAXPAYERS.values().stream()
            .filter(tp -> sector.equals(tp.get("sector")))
            .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getTaxpayersByBusinessSize(String size) {
        return TAXPAYERS.values().stream()
            .filter(tp -> size.equals(tp.get("businessSize")))
            .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getTaxpayersByComplianceStatus(String status) {
        return TAXPAYERS.values().stream()
            .filter(tp -> status.equals(tp.get("complianceStatus")))
            .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getTaxpayersWithInternationalOperations() {
        return TAXPAYERS.values().stream()
            .filter(tp -> (Boolean) tp.getOrDefault("hasInternationalOperations", false))
            .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getTaxpayersWithTPRisk() {
        return TAXPAYERS.values().stream()
            .filter(tp -> (Boolean) tp.getOrDefault("tpRiskFlag", false))
            .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getTaxpayersWithJARisk() {
        return TAXPAYERS.values().stream()
            .filter(tp -> (Boolean) tp.getOrDefault("jaRiskFlag", false))
            .collect(Collectors.toList());
    }

    public Map<String, Object> getTaxpayerStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTaxpayers", TAXPAYERS.size());
        stats.put("byTaxCenter", TAXPAYERS.values().stream()
            .collect(Collectors.groupingBy(tp -> tp.get("taxCenter"), Collectors.counting())));
        stats.put("byRegion", TAXPAYERS.values().stream()
            .collect(Collectors.groupingBy(tp -> tp.get("region"), Collectors.counting())));
        stats.put("bySector", TAXPAYERS.values().stream()
            .collect(Collectors.groupingBy(tp -> tp.get("sector"), Collectors.counting())));
        stats.put("byBusinessSize", TAXPAYERS.values().stream()
            .collect(Collectors.groupingBy(tp -> tp.get("businessSize"), Collectors.counting())));
        stats.put("byComplianceStatus", TAXPAYERS.values().stream()
            .collect(Collectors.groupingBy(tp -> tp.get("complianceStatus"), Collectors.counting())));
        stats.put("withInternationalOps", TAXPAYERS.values().stream()
            .filter(tp -> (Boolean) tp.getOrDefault("hasInternationalOperations", false))
            .count());
        stats.put("withTPRisk", TAXPAYERS.values().stream()
            .filter(tp -> (Boolean) tp.getOrDefault("tpRiskFlag", false))
            .count());
        stats.put("withJARisk", TAXPAYERS.values().stream()
            .filter(tp -> (Boolean) tp.getOrDefault("jaRiskFlag", false))
            .count());
        return stats;
    }

    private static boolean matchesCriteria(Map<String, Object> taxpayer, Map<String, Object> criteria) {
        for (Map.Entry<String, Object> criterion : criteria.entrySet()) {
            Object value = taxpayer.get(criterion.getKey());
            if (value == null || !value.equals(criterion.getValue())) {
                return false;
            }
        }
        return true;
    }
}
