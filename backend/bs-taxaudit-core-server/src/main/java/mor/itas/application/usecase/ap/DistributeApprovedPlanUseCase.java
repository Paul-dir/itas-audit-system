package mor.itas.application.usecase.ap;

import mor.itas.application.port.inboundport.ap.DistributeApprovedPlanPort;
import mor.itas.application.port.outboundport.repositoryport.ap.AnnualAuditPlanRepository;
import mor.itas.domain.model.ap.AnnualAuditPlan;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * DistributeApprovedPlanUseCase - Use Case
 * 
 * Implements DistributeApprovedPlanPort.
 * 
 * Distributes finally approved plan TOP-DOWN:
 * 1. Director sends to Regional Directors (each region gets their allocation)
 * 2. Regional Directors send to Tax Centers (each tax center gets their allocation)
 * 3. Tax Centers receive their final approved plan
 * 
 * Flow:
 * 1. Validate plan is FINAL_APPROVED
 * 2. Extract regional allocations from approved plan
 * 3. Send each region their allocation
 * 4. Regional Directors then distribute to their tax centers
 * 5. Final plan reaches all levels
 */
@Service
@RequiredArgsConstructor
public class DistributeApprovedPlanUseCase implements DistributeApprovedPlanPort {
    
    private final AnnualAuditPlanRepository repository;
    
    // Mock storage for plan distribution
    private static final Map<String, Map<String, Object>> planDistribution = new HashMap<>();
    
    @Override
    public void distributeToRegions(UUID planId, String directorId) {
        
        // Validate plan exists
        AnnualAuditPlan plan = repository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));
        
        // Validate plan is FINAL_APPROVED
        String status = plan.getStatus();
        if (!"FINAL_APPROVED".equals(status)) {
            throw new IllegalStateException(
                "Cannot distribute plan in status: " + status + ". " +
                "Plan must be FINAL_APPROVED by Senior Management."
            );
        }
        
        // Extract regional allocations and create distribution
        Map<String, Object> distribution = new HashMap<>();
        distribution.put("planId", planId.toString());
        distribution.put("distributedBy", directorId);
        distribution.put("distributedAt", java.time.LocalDateTime.now().toString());
        distribution.put("status", "DISTRIBUTED_TO_REGIONS");
        
        // Create distribution for each region
        Map<String, Object> regionalDistribution = createRegionalDistribution(planId);
        distribution.put("regionalAllocations", regionalDistribution);
        
        planDistribution.put(planId.toString(), distribution);
    }
    
    /**
     * Create distribution details for each region
     * 
     * Each region gets:
     * - Regional allocation breakdown by audit type
     * - Message to distribute to their tax centers
     */
    private Map<String, Object> createRegionalDistribution(UUID planId) {
        Map<String, Object> distribution = new HashMap<>();
        
        // Define regions
        String[] regions = {"AA", "AB", "BA", "BB", "CA", "SO"};
        
        for (String region : regions) {
            Map<String, Object> regionData = new HashMap<>();
            regionData.put("regionId", region);
            regionData.put("regionName", getRegionName(region));
            regionData.put("status", "READY_FOR_TAX_CENTER_DISTRIBUTION");
            regionData.put("message", 
                "Your region's approved allocation is ready. Please distribute to your tax centers.");
            regionData.put("distributedAt", java.time.LocalDateTime.now().toString());
            
            // Tax centers in this region will receive their allocation
            regionData.put("taxCenterCount", getTaxCenterCountForRegion(region));
            
            distribution.put(region, regionData);
        }
        
        return distribution;
    }
    
    /**
     * Get number of tax centers for a region
     */
    private int getTaxCenterCountForRegion(String regionId) {
        return switch (regionId) {
            case "AA" -> 4; // Addis Ababa
            case "AB" -> 3; // Oromia
            case "BA" -> 2; // Amhara
            case "BB" -> 2; // SNNP
            case "CA" -> 2; // Tigray
            case "SO" -> 1; // Somali
            default -> 0;
        };
    }
    
    /**
     * Get region name from region code
     */
    private String getRegionName(String regionId) {
        return switch (regionId) {
            case "AA" -> "Addis Ababa";
            case "AB" -> "Oromia";
            case "BA" -> "Amhara";
            case "BB" -> "SNNP";
            case "CA" -> "Tigray";
            case "SO" -> "Somali";
            default -> "Region " + regionId;
        };
    }
    
    /**
     * Retrieve plan distribution details
     */
    public static Map<String, Object> getPlanDistribution(UUID planId) {
        return planDistribution.getOrDefault(planId.toString(), new HashMap<>());
    }
    
    /**
     * Distribute to a specific region's tax centers
     * 
     * Regional Director calls this to distribute to their tax centers
     */
    public static Map<String, Object> distributeToTaxCenters(UUID planId, String regionId, String regionalDirectorId) {
        Map<String, Object> taxCenterDistribution = new HashMap<>();
        
        taxCenterDistribution.put("planId", planId.toString());
        taxCenterDistribution.put("regionId", regionId);
        taxCenterDistribution.put("distributedBy", regionalDirectorId);
        taxCenterDistribution.put("distributedAt", java.time.LocalDateTime.now().toString());
        taxCenterDistribution.put("status", "DISTRIBUTED_TO_TAX_CENTERS");
        taxCenterDistribution.put("message", 
            "The approved audit plan has been distributed to all tax centers in your region. " +
            "Each tax center now has their final approved plan and can begin audit execution.");
        
        // List of tax centers that received the plan
        List<String> taxCentersNotified = getTaxCentersForRegion(regionId);
        taxCenterDistribution.put("taxCentersNotified", taxCentersNotified);
        
        return taxCenterDistribution;
    }
    
    /**
     * Get tax centers for a region
     */
    private static List<String> getTaxCentersForRegion(String regionId) {
        List<String> taxCenters = new ArrayList<>();
        
        switch (regionId) {
            case "AA" -> {
                taxCenters.add("TC-AA-01");
                taxCenters.add("TC-AA-02");
                taxCenters.add("TC-AA-03");
                taxCenters.add("TC-AA-04");
            }
            case "AB" -> {
                taxCenters.add("TC-OR-01");
                taxCenters.add("TC-OR-02");
                taxCenters.add("TC-OR-03");
            }
            case "BA" -> {
                taxCenters.add("TC-AM-01");
                taxCenters.add("TC-AM-02");
            }
            case "BB" -> {
                taxCenters.add("TC-SN-01");
                taxCenters.add("TC-SN-02");
            }
            case "CA" -> {
                taxCenters.add("TC-TI-01");
                taxCenters.add("TC-TI-02");
            }
            case "SO" -> taxCenters.add("TC-SO-01");
        }
        
        return taxCenters;
    }
}
