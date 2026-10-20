package mor.itas.api.dto.request.ap;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;
import java.util.Map;
import java.math.BigDecimal;

/**
 * CreatePlanRequest - Request DTO for creating an Annual Audit Plan
 * Planning Team creates plan with regional allocations (NOT tax center allocations)
 */
public class CreatePlanRequest {

    @NotNull(message = "Plan year is required")
    @Positive(message = "Plan year must be positive")
    private Integer planYear;

    @NotBlank(message = "Plan name is required")
    private String planName;

    @NotEmpty(message = "At least one regional allocation is required")
    @Valid
    private List<RegionalAllocationRequest> regionalAllocations;

    // Distribution breakdown by region and audit type
    // Format: { "addis_ababa": { "desk_audit": 30000, "joint_audit": 12000, ... }, ... }
    private Map<String, Map<String, Integer>> distribution;

    @NotNull(message = "Estimated revenue is required")
    @Positive(message = "Estimated revenue must be positive")
    private BigDecimal estimatedRevenue;

    // Constructors
    public CreatePlanRequest() {
    }

    public CreatePlanRequest(Integer planYear, String planName, List<RegionalAllocationRequest> regionalAllocations) {
        this.planYear = planYear;
        this.planName = planName;
        this.regionalAllocations = regionalAllocations;
    }

    public CreatePlanRequest(Integer planYear, String planName, List<RegionalAllocationRequest> regionalAllocations, Map<String, Map<String, Integer>> distribution, BigDecimal estimatedRevenue) {
        this.planYear = planYear;
        this.planName = planName;
        this.regionalAllocations = regionalAllocations;
        this.distribution = distribution;
        this.estimatedRevenue = estimatedRevenue;
    }

    // Getters and Setters
    public Integer getPlanYear() {
        return planYear;
    }

    public void setPlanYear(Integer planYear) {
        this.planYear = planYear;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public List<RegionalAllocationRequest> getRegionalAllocations() {
        return regionalAllocations;
    }

    public void setRegionalAllocations(List<RegionalAllocationRequest> regionalAllocations) {
        this.regionalAllocations = regionalAllocations;
    }

    public Map<String, Map<String, Integer>> getDistribution() {
        return distribution;
    }

    public void setDistribution(Map<String, Map<String, Integer>> distribution) {
        this.distribution = distribution;
    }

    public BigDecimal getEstimatedRevenue() {
        return estimatedRevenue;
    }

    public void setEstimatedRevenue(BigDecimal estimatedRevenue) {
        this.estimatedRevenue = estimatedRevenue;
    }

    @Override
    public String toString() {
        return "CreatePlanRequest{" +
                "planYear=" + planYear +
                ", planName='" + planName + '\'' +
                ", regionalAllocations=" + regionalAllocations +
                '}';
    }

    /**
     * RegionalAllocationRequest - Nested DTO for regional allocations
     */
    public static class RegionalAllocationRequest {
        @NotBlank(message = "Region code is required")
        private String regionCode;

        @NotNull(message = "Proposed count is required")
        @Positive(message = "Proposed count must be positive")
        private Integer proposedCount;

        // Constructors
        public RegionalAllocationRequest() {
        }

        public RegionalAllocationRequest(String regionCode, Integer proposedCount) {
            this.regionCode = regionCode;
            this.proposedCount = proposedCount;
        }

        // Getters and Setters
        public String getRegionCode() {
            return regionCode;
        }

        public void setRegionCode(String regionCode) {
            this.regionCode = regionCode;
        }

        public Integer getProposedCount() {
            return proposedCount;
        }

        public void setProposedCount(Integer proposedCount) {
            this.proposedCount = proposedCount;
        }

        @Override
        public String toString() {
            return "RegionalAllocationRequest{" +
                    "regionCode='" + regionCode + '\'' +
                    ", proposedCount=" + proposedCount +
                    '}';
        }
    }
}
