package mor.itas.api.dto.response.ap;

import java.util.List;
import java.util.Map;

/**
 * CreatePlanResponse - Response DTO for plan creation with pre-filled risk data
 * Includes plan details + risk-based case distribution that can be reviewed and overridden
 */
public class CreatePlanResponse {

    private String id;
    private Integer planYear;
    private String planName;
    private String status;
    private String createdBy;
    private String createdAt;
    
    // Risk-based defaults (pre-filled from Risk Engine)
    private RiskBasedDefaults riskBasedDefaults;
    
    // User's regional allocations
    private List<RegionalAllocationResponse> regionalAllocations;
    private List<TaxCenterAllocationResponse> taxCenterAllocations;
    private Integer version;

    public CreatePlanResponse() {
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public RiskBasedDefaults getRiskBasedDefaults() {
        return riskBasedDefaults;
    }

    public void setRiskBasedDefaults(RiskBasedDefaults riskBasedDefaults) {
        this.riskBasedDefaults = riskBasedDefaults;
    }

    public List<RegionalAllocationResponse> getRegionalAllocations() {
        return regionalAllocations;
    }

    public void setRegionalAllocations(List<RegionalAllocationResponse> regionalAllocations) {
        this.regionalAllocations = regionalAllocations;
    }

    public List<TaxCenterAllocationResponse> getTaxCenterAllocations() {
        return taxCenterAllocations;
    }

    public void setTaxCenterAllocations(List<TaxCenterAllocationResponse> taxCenterAllocations) {
        this.taxCenterAllocations = taxCenterAllocations;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    /**
     * RiskBasedDefaults - Pre-filled values from Risk Engine
     * Shows recommended case distribution by region and audit type
     */
    public static class RiskBasedDefaults {
        private String source; // "Risk Engine"
        private String message; // "Pre-filled from Risk Estimates. Values below are based on risk engine recommendations. Edit any cell to override."
        private Integer totalCases; // Total recommended cases
        private List<CaseDistributionByRegion> caseDistributionTable;
        private Map<String, Integer> suggestedQuotas; // Tax center specific quotas

        public RiskBasedDefaults() {
        }

        public RiskBasedDefaults(String source, String message, Integer totalCases,
                                 List<CaseDistributionByRegion> caseDistributionTable,
                                 Map<String, Integer> suggestedQuotas) {
            this.source = source;
            this.message = message;
            this.totalCases = totalCases;
            this.caseDistributionTable = caseDistributionTable;
            this.suggestedQuotas = suggestedQuotas;
        }

        // Getters and Setters
        public String getSource() {
            return source;
        }

        public void setSource(String source) {
            this.source = source;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public Integer getTotalCases() {
            return totalCases;
        }

        public void setTotalCases(Integer totalCases) {
            this.totalCases = totalCases;
        }

        public List<CaseDistributionByRegion> getCaseDistributionTable() {
            return caseDistributionTable;
        }

        public void setCaseDistributionTable(List<CaseDistributionByRegion> caseDistributionTable) {
            this.caseDistributionTable = caseDistributionTable;
        }

        public Map<String, Integer> getSuggestedQuotas() {
            return suggestedQuotas;
        }

        public void setSuggestedQuotas(Map<String, Integer> suggestedQuotas) {
            this.suggestedQuotas = suggestedQuotas;
        }
    }

    /**
     * CaseDistributionByRegion - Row in the case distribution table
     * Shows breakdown by audit type (Desk, Field, Joint, Transfer Pricing, Comprehensive, Issue)
     */
    public static class CaseDistributionByRegion {
        private String region;
        private String regionName;
        private Integer desk; // Desk Audit
        private Integer field; // Field Audit
        private Integer joint; // Joint Audit
        private Integer tprice; // Transfer Pricing
        private Integer comp; // Comprehensive
        private Integer issue; // Issue Audit
        private Integer total;

        public CaseDistributionByRegion() {
        }

        public CaseDistributionByRegion(String region, String regionName, Integer desk, Integer field,
                                        Integer joint, Integer tprice, Integer comp, Integer issue) {
            this.region = region;
            this.regionName = regionName;
            this.desk = desk;
            this.field = field;
            this.joint = joint;
            this.tprice = tprice;
            this.comp = comp;
            this.issue = issue;
            this.total = desk + field + joint + tprice + comp + issue;
        }

        // Getters and Setters
        public String getRegion() {
            return region;
        }

        public void setRegion(String region) {
            this.region = region;
        }

        public String getRegionName() {
            return regionName;
        }

        public void setRegionName(String regionName) {
            this.regionName = regionName;
        }

        public Integer getDesk() {
            return desk;
        }

        public void setDesk(Integer desk) {
            this.desk = desk;
        }

        public Integer getField() {
            return field;
        }

        public void setField(Integer field) {
            this.field = field;
        }

        public Integer getJoint() {
            return joint;
        }

        public void setJoint(Integer joint) {
            this.joint = joint;
        }

        public Integer getTprice() {
            return tprice;
        }

        public void setTprice(Integer tprice) {
            this.tprice = tprice;
        }

        public Integer getComp() {
            return comp;
        }

        public void setComp(Integer comp) {
            this.comp = comp;
        }

        public Integer getIssue() {
            return issue;
        }

        public void setIssue(Integer issue) {
            this.issue = issue;
        }

        public Integer getTotal() {
            return total;
        }

        public void setTotal(Integer total) {
            this.total = total;
        }
    }

    /**
     * RegionalAllocationResponse - User's regional allocation
     */
    public static class RegionalAllocationResponse {
        private String id;
        private String planId;
        private String regionCode;
        private Integer proposedCount;
        private Boolean tcFeedbackSubmitted;
        private Integer effectiveCount;
        private String createdAt;
        private String allocationType;

        public RegionalAllocationResponse() {
        }

        // Getters and Setters
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getPlanId() {
            return planId;
        }

        public void setPlanId(String planId) {
            this.planId = planId;
        }

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

        public Boolean getTcFeedbackSubmitted() {
            return tcFeedbackSubmitted;
        }

        public void setTcFeedbackSubmitted(Boolean tcFeedbackSubmitted) {
            this.tcFeedbackSubmitted = tcFeedbackSubmitted;
        }

        public Integer getEffectiveCount() {
            return effectiveCount;
        }

        public void setEffectiveCount(Integer effectiveCount) {
            this.effectiveCount = effectiveCount;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public String getAllocationType() {
            return allocationType;
        }

        public void setAllocationType(String allocationType) {
            this.allocationType = allocationType;
        }
    }

    /**
     * TaxCenterAllocationResponse - Tax center specific allocation
     */
    public static class TaxCenterAllocationResponse {
        private String id;
        private String allocationId;
        private String taxCenterCode;
        private Integer allocatedAudits;

        public TaxCenterAllocationResponse() {
        }

        // Getters and Setters
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getAllocationId() {
            return allocationId;
        }

        public void setAllocationId(String allocationId) {
            this.allocationId = allocationId;
        }

        public String getTaxCenterCode() {
            return taxCenterCode;
        }

        public void setTaxCenterCode(String taxCenterCode) {
            this.taxCenterCode = taxCenterCode;
        }

        public Integer getAllocatedAudits() {
            return allocatedAudits;
        }

        public void setAllocatedAudits(Integer allocatedAudits) {
            this.allocatedAudits = allocatedAudits;
        }
    }
}
