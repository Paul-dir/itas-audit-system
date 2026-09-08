package mor.itas.api.dto.response.ap;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * AllocationResponse - Response DTO for Plan Allocations
 * Represents both regional and tax center allocations
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AllocationResponse {

    private UUID id;
    private UUID planId;
    private String taxCenterCode;       // NULL for regional, set for tax center
    private String regionCode;
    private Integer proposedCount;
    
    // Regional Director Division (only for regional allocations)
    private Integer regionalDividedCount;
    private String regionalDivisionReason;
    
    // Tax Center Feedback
    private Integer tcAdjustedCount;
    private String tcJustification;
    private Boolean tcFeedbackSubmitted;
    private OffsetDateTime tcFeedbackSubmittedAt;
    
    // Effective count (proposed or adjusted)
    private Integer effectiveCount;
    
    // Metadata
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    
    // Type indicators
    private String allocationType;       // "REGIONAL" or "TAX_CENTER"

    // Constructors
    public AllocationResponse() {
    }

    public AllocationResponse(UUID id, UUID planId, String regionCode, Integer proposedCount) {
        this.id = id;
        this.planId = planId;
        this.regionCode = regionCode;
        this.proposedCount = proposedCount;
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

    public Integer getEffectiveCount() {
        return effectiveCount;
    }

    public void setEffectiveCount(Integer effectiveCount) {
        this.effectiveCount = effectiveCount;
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

    public String getAllocationType() {
        return allocationType;
    }

    public void setAllocationType(String allocationType) {
        this.allocationType = allocationType;
    }
}
