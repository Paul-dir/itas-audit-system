package mor.itas.domain.model.ap;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * PlanAllocation Entity - Represents allocation at regional and tax center levels
 * 
 * TWO-LEVEL ALLOCATION STRUCTURE (Regional-Level, NOT National):
 * 1. REGIONAL ALLOCATIONS (Planning Team creates these):
 *    - planId, regionCode, proposedCount (from Risk Engine)
 *    - Director approves but does NOT modify
 * 
 * 2. TAX CENTER ALLOCATIONS (Regional Director creates these):
 *    - planId, taxCenterCode, regionCode, proposedCount (from regional allocation)
 *    - Regional Director divides regional allocations into tax center allocations
 *    - Tax Center Manager provides feedback
 * 
 * Director role: Routes/approves allocations, does NOT divide or adjust counts
 * Regional Director role: Divides regional allocations into tax center allocations for their region only
 * Tax Center Manager role: Provides feedback on their tax center's allocation
 */
public class PlanAllocation {
    
    private UUID id;
    private UUID planId;
    private String taxCenterCode;      // e.g., "TC-AA-01"
    private String regionCode;         // e.g., "AA"
    
    // Original proposed count from Risk Engine (NEVER CHANGES)
    private Integer proposedCount;
    
    // Regional Director adjustments (creates tax center allocations by dividing regional allocation)
    private Integer regionalDividedCount;     // Total divided to tax centers (should sum to proposedCount)
    private String regionalDivisionReason;
    
    // Tax Center feedback (ONLY at tax center allocation level)
    private Integer tcAdjustedCount;
    private String tcJustification;
    private Boolean tcFeedbackSubmitted;
    private OffsetDateTime tcFeedbackSubmittedAt;
    
    // Metadata
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    
    // Constructors
    public PlanAllocation() {
        this.tcFeedbackSubmitted = false;
    }
    
    public PlanAllocation(UUID id, UUID planId, String taxCenterCode, String regionCode, 
                         Integer proposedCount) {
        this.id = id;
        this.planId = planId;
        this.taxCenterCode = taxCenterCode;
        this.regionCode = regionCode;
        this.proposedCount = proposedCount;
        this.tcFeedbackSubmitted = false;
        this.createdAt = OffsetDateTime.now();
    }
    
    // Business Logic Methods
    
    /**
     * Regional Director divides regional allocation into tax center allocations
     * This is called when creating tax center allocations from a regional allocation
     */
    public void divideBetweenTaxCenters(Integer totalDividedCount, String reason) {
        if (totalDividedCount == null) {
            throw new IllegalArgumentException("Total divided count cannot be null");
        }
        if (!totalDividedCount.equals(proposedCount) && 
            (reason == null || reason.isBlank())) {
            throw new IllegalArgumentException("Reason required when dividing allocation between tax centers");
        }
        this.regionalDividedCount = totalDividedCount;
        this.regionalDivisionReason = reason;
        this.updatedAt = OffsetDateTime.now();
    }
    
    /**
     * Tax Center submits feedback with justification (only at tax center level)
     */
    public void submitFeedback(Integer adjustedCount, String justification) {
        if (adjustedCount == null) {
            throw new IllegalArgumentException("Adjusted count cannot be null");
        }
        // For tax center allocations, compare against proposed count (no intermediate adjustments)
        if (!adjustedCount.equals(proposedCount) && 
            (justification == null || justification.isBlank())) {
            throw new IllegalArgumentException("Justification required when adjusting count");
        }
        this.tcAdjustedCount = adjustedCount;
        this.tcJustification = justification;
        this.tcFeedbackSubmitted = true;
        this.tcFeedbackSubmittedAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
    }
    
    // Effective Count Calculations
    
    /**
     * Get effective count (no intermediate adjustments, only tax center feedback)
     */
    public Integer getEffectiveCount() {
        return tcAdjustedCount != null ? tcAdjustedCount : proposedCount;
    }
    
    /**
     * Get final approved count (alias for getEffectiveCount)
     */
    public Integer getFinalCount() {
        return getEffectiveCount();
    }
    
    // Authorization Checks
    
    /**
     * Check if this is a regional allocation (no tax center code)
     */
    public boolean isRegionalAllocation() {
        return taxCenterCode == null || taxCenterCode.isBlank();
    }
    
    /**
     * Check if this is a tax center allocation
     */
    public boolean isTaxCenterAllocation() {
        return taxCenterCode != null && !taxCenterCode.isBlank();
    }
    
    /**
     * Check if this allocation belongs to the given tax center
     */
    public boolean canEditByTaxCenter(String taxCenterCode) {
        return this.taxCenterCode != null && this.taxCenterCode.equals(taxCenterCode);
    }
    
    /**
     * Check if this allocation is in the given region (for Regional Director to divide)
     */
    public boolean canEditByRegional(String regionCode) {
        return this.regionCode.equals(regionCode);
    }
    
    public boolean hasRegionalDivision() {
        return regionalDividedCount != null;
    }
    
    public boolean hasTaxCenterFeedback() {
        return tcFeedbackSubmitted;
    }
    
    // Getters and Setters
    
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public UUID getPlanId() {
        return planId;
    }
    
    public void setPlanId(UUID planId) {
        this.planId = planId;
    }
    
    public String getTaxCenterCode() {
        return taxCenterCode;
    }
    
    public void setTaxCenterCode(String taxCenterCode) {
        this.taxCenterCode = taxCenterCode;
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
    
    public Integer getRegionalDividedCount() {
        return regionalDividedCount;
    }
    
    public void setRegionalDividedCount(Integer regionalDividedCount) {
        this.regionalDividedCount = regionalDividedCount;
    }
    
    public String getRegionalDivisionReason() {
        return regionalDivisionReason;
    }
    
    public void setRegionalDivisionReason(String regionalDivisionReason) {
        this.regionalDivisionReason = regionalDivisionReason;
    }
    
    public Integer getTcAdjustedCount() {
        return tcAdjustedCount;
    }
    
    public void setTcAdjustedCount(Integer tcAdjustedCount) {
        this.tcAdjustedCount = tcAdjustedCount;
    }
    
    public String getTcJustification() {
        return tcJustification;
    }
    
    public void setTcJustification(String tcJustification) {
        this.tcJustification = tcJustification;
    }
    
    public Boolean getTcFeedbackSubmitted() {
        return tcFeedbackSubmitted;
    }
    
    public void setTcFeedbackSubmitted(Boolean tcFeedbackSubmitted) {
        this.tcFeedbackSubmitted = tcFeedbackSubmitted;
    }
    
    public OffsetDateTime getTcFeedbackSubmittedAt() {
        return tcFeedbackSubmittedAt;
    }
    
    public void setTcFeedbackSubmittedAt(OffsetDateTime tcFeedbackSubmittedAt) {
        this.tcFeedbackSubmittedAt = tcFeedbackSubmittedAt;
    }
    
    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    @Override
    public String toString() {
        return "PlanAllocation{" +
                "id=" + id +
                ", taxCenterCode='" + taxCenterCode + '\'' +
                ", regionCode='" + regionCode + '\'' +
                ", proposedCount=" + proposedCount +
                ", effectiveCount=" + getEffectiveCount() +
                ", tcFeedbackSubmitted=" + tcFeedbackSubmitted +
                '}';
    }
}
