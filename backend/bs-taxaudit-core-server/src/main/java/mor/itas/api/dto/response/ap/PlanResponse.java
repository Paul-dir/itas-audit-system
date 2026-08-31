package mor.itas.api.dto.response.ap;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * PlanResponse - Response DTO for Annual Audit Plan
 * Complete view of plan with all allocations and metadata
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PlanResponse {

    private UUID id;
    private Integer planYear;
    private String planName;
    private String status;
    
    // Planning Team Phase
    private String createdBy;
    private OffsetDateTime createdAt;
    
    // Director Approval Phase
    private String submittedToDirectorBy;
    private OffsetDateTime submittedToDirectorAt;
    private String directorApprovedBy;
    private OffsetDateTime directorApprovedAt;
    private String directorApprovalReason;
    
    // Regional Director Approval Phase
    private String submittedToRegionalBy;
    private OffsetDateTime submittedToRegionalAt;
    private String regionalDirectorApprovedBy;
    private OffsetDateTime regionalDirectorApprovedAt;
    private String regionalDirectorApprovalReason;
    
    // Tax Center Phase
    private OffsetDateTime sentToTaxCenterAt;
    private OffsetDateTime updatedAt;
    
    // Allocations
    private List<AllocationResponse> regionalAllocations;
    private List<AllocationResponse> taxCenterAllocations;
    
    // Distribution data (audit type breakdown by region)
    private Map<String, Map<String, Integer>> distribution;

    // Amendment
    private String amendmentComment;

    // Regional feedback (submitted regions + defaults for pending)
    private Map<String, Object> regionalFeedback;

    // Metadata
    private Long version;

    // Constructors
    public PlanResponse() {
    }

    public PlanResponse(UUID id, Integer planYear, String planName, String status, String createdBy) {
        this.id = id;
        this.planYear = planYear;
        this.planName = planName;
        this.status = status;
        this.createdBy = createdBy;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
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

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getSubmittedToDirectorBy() {
        return submittedToDirectorBy;
    }

    public void setSubmittedToDirectorBy(String submittedToDirectorBy) {
        this.submittedToDirectorBy = submittedToDirectorBy;
    }

    public OffsetDateTime getSubmittedToDirectorAt() {
        return submittedToDirectorAt;
    }

    public void setSubmittedToDirectorAt(OffsetDateTime submittedToDirectorAt) {
        this.submittedToDirectorAt = submittedToDirectorAt;
    }

    public String getDirectorApprovedBy() {
        return directorApprovedBy;
    }

    public void setDirectorApprovedBy(String directorApprovedBy) {
        this.directorApprovedBy = directorApprovedBy;
    }

    public OffsetDateTime getDirectorApprovedAt() {
        return directorApprovedAt;
    }

    public void setDirectorApprovedAt(OffsetDateTime directorApprovedAt) {
        this.directorApprovedAt = directorApprovedAt;
    }

    public String getDirectorApprovalReason() {
        return directorApprovalReason;
    }

    public void setDirectorApprovalReason(String directorApprovalReason) {
        this.directorApprovalReason = directorApprovalReason;
    }

    public String getSubmittedToRegionalBy() {
        return submittedToRegionalBy;
    }

    public void setSubmittedToRegionalBy(String submittedToRegionalBy) {
        this.submittedToRegionalBy = submittedToRegionalBy;
    }

    public OffsetDateTime getSubmittedToRegionalAt() {
        return submittedToRegionalAt;
    }

    public void setSubmittedToRegionalAt(OffsetDateTime submittedToRegionalAt) {
        this.submittedToRegionalAt = submittedToRegionalAt;
    }

    public String getRegionalDirectorApprovedBy() {
        return regionalDirectorApprovedBy;
    }

    public void setRegionalDirectorApprovedBy(String regionalDirectorApprovedBy) {
        this.regionalDirectorApprovedBy = regionalDirectorApprovedBy;
    }

    public OffsetDateTime getRegionalDirectorApprovedAt() {
        return regionalDirectorApprovedAt;
    }

    public void setRegionalDirectorApprovedAt(OffsetDateTime regionalDirectorApprovedAt) {
        this.regionalDirectorApprovedAt = regionalDirectorApprovedAt;
    }

    public String getRegionalDirectorApprovalReason() {
        return regionalDirectorApprovalReason;
    }

    public void setRegionalDirectorApprovalReason(String regionalDirectorApprovalReason) {
        this.regionalDirectorApprovalReason = regionalDirectorApprovalReason;
    }

    public OffsetDateTime getSentToTaxCenterAt() {
        return sentToTaxCenterAt;
    }

    public void setSentToTaxCenterAt(OffsetDateTime sentToTaxCenterAt) {
        this.sentToTaxCenterAt = sentToTaxCenterAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<AllocationResponse> getRegionalAllocations() {
        return regionalAllocations;
    }

    public void setRegionalAllocations(List<AllocationResponse> regionalAllocations) {
        this.regionalAllocations = regionalAllocations;
    }

    public List<AllocationResponse> getTaxCenterAllocations() {
        return taxCenterAllocations;
    }

    public void setTaxCenterAllocations(List<AllocationResponse> taxCenterAllocations) {
        this.taxCenterAllocations = taxCenterAllocations;
    }

    public Map<String, Map<String, Integer>> getDistribution() {
        return distribution;
    }

    public void setDistribution(Map<String, Map<String, Integer>> distribution) {
        this.distribution = distribution;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public String getAmendmentComment() {
        return amendmentComment;
    }

    public void setAmendmentComment(String amendmentComment) {
        this.amendmentComment = amendmentComment;
    }

    public Map<String, Object> getRegionalFeedback() {
        return regionalFeedback;
    }

    public void setRegionalFeedback(Map<String, Object> regionalFeedback) {
        this.regionalFeedback = regionalFeedback;
    }
}
