package mor.itas.domain.model.ap;

import java.time.OffsetDateTime;
import java.util.*;
import java.math.BigDecimal;
import com.fasterxml.jackson.databind.JsonNode;

/**
 * AnnualAuditPlan Domain Model - Represents an annual audit plan through 4-level approval workflow
 * 
 * Workflow:
 * 1. Planning Team creates plan (DRAFT)
 * 2. Planning Team submits to Director (SUBMITTED_TO_DIRECTOR)
 * 3. Director approves (DIRECTOR_APPROVED)
 * 4. Director submits to Regional Directors (SUBMITTED_TO_REGIONAL)
 * 5. Regional Director approves (REGIONAL_APPROVED)
 * 6. Director sends to Tax Centers (SENT_TO_TAX_CENTERS)
 * 7. Tax Centers submit feedback (TC_FEEDBACK_SUBMITTED)
 * 8. Plan finalized (FINALIZED)
 */
public class AnnualAuditPlan {
    
    private UUID id;
    private Integer planYear;
    private String planName;
    private PlanStatus status;
    
    // Planning Team fields
    private String createdBy;
    private OffsetDateTime createdAt;
    
    // Director approval fields
    private String submittedToDirectorBy;
    private OffsetDateTime submittedToDirectorAt;
    private String directorApprovedBy;
    private OffsetDateTime directorApprovedAt;
    private String directorApprovalReason;
    
    // Regional Director approval fields
    private String submittedToRegionalBy;
    private OffsetDateTime submittedToRegionalAt;
    private String regionalDirectorApprovedBy;
    private OffsetDateTime regionalDirectorApprovedAt;
    private String regionalDirectorApprovalReason;
    
    // Tax Center phase
    private OffsetDateTime sentToTaxCenterAt;
    
    // Distribution data (audit type breakdown by region)
    private Map<String, Map<String, Integer>> distribution;
    private OffsetDateTime sentToRegionsAt;
    private List<PlanAllocation> allocations;
    
    // Amendment
    private String amendmentComment;
    
    // Metadata
    private OffsetDateTime updatedAt;
    private Long version;

    // Revenue
    private BigDecimal estimatedRevenue;
    private JsonNode estimatedRevenueDistribution;

    // Constructors
    public AnnualAuditPlan() {
        this.allocations = new ArrayList<>();
    }
    
    public AnnualAuditPlan(UUID id, Integer planYear, String planName, String createdBy) {
        this.id = id;
        this.planYear = planYear;
        this.planName = planName;
        this.status = PlanStatus.DRAFT;
        this.createdBy = createdBy;
        this.createdAt = OffsetDateTime.now();
        this.allocations = new ArrayList<>();
        this.version = 0L;
    }
    
    // Business Logic Methods
    
    /**
     * Planning Team submits plan to Director
     */
    public void submitToDirector(String actorId) throws UnauthorizedException {
        if (status != PlanStatus.DRAFT) {
            throw new IllegalStateException("Plan must be in DRAFT status to submit to Director");
        }
        this.submittedToDirectorBy = actorId;
        this.submittedToDirectorAt = OffsetDateTime.now();
        this.status = PlanStatus.SUBMITTED_TO_DIRECTOR;
        this.updatedAt = OffsetDateTime.now();
    }
    
    /**
     * Director approves plan
     */
    public void approveByDirector(String actorId, String reason) throws UnauthorizedException {
        if (status != PlanStatus.SUBMITTED_TO_DIRECTOR) {
            throw new IllegalStateException("Plan must be SUBMITTED_TO_DIRECTOR to approve");
        }
        this.directorApprovedBy = actorId;
        this.directorApprovedAt = OffsetDateTime.now();
        this.directorApprovalReason = reason;
        this.status = PlanStatus.DIRECTOR_APPROVED;
        this.updatedAt = OffsetDateTime.now();
    }
    
    /**
     * Director submits plan to Regional Directors
     */
    public void submitToRegionalDirectors(String actorId) throws UnauthorizedException {
        if (status != PlanStatus.DIRECTOR_APPROVED) {
            throw new IllegalStateException("Plan must be DIRECTOR_APPROVED to submit to Regional");
        }
        this.submittedToRegionalBy = actorId;
        this.submittedToRegionalAt = OffsetDateTime.now();
        this.status = PlanStatus.SUBMITTED_TO_REGIONAL;
        this.updatedAt = OffsetDateTime.now();
    }
    
    /**
     * Regional Director approves plan
     */
    public void approveByRegionalDirector(String actorId, String reason) throws UnauthorizedException {
        if (status != PlanStatus.SUBMITTED_TO_REGIONAL) {
            throw new IllegalStateException("Plan must be SUBMITTED_TO_REGIONAL to approve");
        }
        this.regionalDirectorApprovedBy = actorId;
        this.regionalDirectorApprovedAt = OffsetDateTime.now();
        this.regionalDirectorApprovalReason = reason;
        this.status = PlanStatus.REGIONAL_APPROVED;
        this.updatedAt = OffsetDateTime.now();
    }
    
    /**
     * Director sends plan to Tax Centers for feedback
     */
    public void sendToTaxCenters(String actorId) throws UnauthorizedException {
        if (status != PlanStatus.REGIONAL_APPROVED) {
            throw new IllegalStateException("Plan must be REGIONAL_APPROVED to send to Tax Centers");
        }
        this.sentToTaxCenterAt = OffsetDateTime.now();
        this.status = PlanStatus.SENT_TO_TAX_CENTERS;
        this.updatedAt = OffsetDateTime.now();
    }
    
    /**
     * Record that Tax Centers have submitted feedback
     */
    public void recordTaxCenterFeedbackSubmitted(String actorId) {
        if (status != PlanStatus.SENT_TO_TAX_CENTERS) {
            throw new IllegalStateException("Plan must be SENT_TO_TAX_CENTERS");
        }
        this.status = PlanStatus.TC_FEEDBACK_SUBMITTED;
        this.updatedAt = OffsetDateTime.now();
    }
    
    /**
     * Finalize plan - ready for case cascade
     */
    public void finalize(String actorId) {
        if (status != PlanStatus.TC_FEEDBACK_SUBMITTED) {
            throw new IllegalStateException("Plan must be TC_FEEDBACK_SUBMITTED to finalize");
        }
        this.status = PlanStatus.FINALIZED;
        this.updatedAt = OffsetDateTime.now();
    }
    
    // Authorization Checks
    
    public boolean canBeSubmittedByPlanningTeam() {
        return status == PlanStatus.DRAFT
            || status == PlanStatus.AMENDMENT_REQUIRED
            || status == PlanStatus.SENIOR_MGMT_REJECTED;
    }
    
    public boolean canBeApprovedByDirector() {
        return status == PlanStatus.SUBMITTED_TO_DIRECTOR;
    }
    
    public boolean canBeSubmittedToRegionalByDirector() {
        return status == PlanStatus.DIRECTOR_APPROVED
            || status == PlanStatus.SUBMITTED_TO_DIRECTOR
            || status == PlanStatus.SUBMITTED_TO_REGIONAL
            || status == PlanStatus.REGIONAL_APPROVED
            || status == PlanStatus.SENT_TO_TAX_CENTERS
            || status == PlanStatus.TC_FEEDBACK_SUBMITTED
            || status == PlanStatus.FINALIZED;
    }
    
    public boolean canBeApprovedByRegionalDirector() {
        return status == PlanStatus.SUBMITTED_TO_REGIONAL;
    }
    
    public boolean canBeSentToTaxCentersByDirector() {
        return status == PlanStatus.REGIONAL_APPROVED;
    }
    
    public boolean canReceiveTaxCenterFeedback() {
        return status == PlanStatus.SENT_TO_TAX_CENTERS;
    }
    
    public boolean isInApprovalPhase() {
        return status == PlanStatus.SUBMITTED_TO_DIRECTOR || 
               status == PlanStatus.SUBMITTED_TO_REGIONAL;
    }
    
    // Allocation Management
    
    public void addAllocation(PlanAllocation allocation) {
        if (allocation == null) {
            throw new IllegalArgumentException("Allocation cannot be null");
        }
        this.allocations.add(allocation);
    }
    
    public Optional<PlanAllocation> getAllocation(UUID allocationId) {
        return allocations.stream()
            .filter(a -> a.getId().equals(allocationId))
            .findFirst();
    }
    
    public List<PlanAllocation> getAllocations() {
        return new ArrayList<>(allocations);
    }
    
    public int getTotalProposedCount() {
        return allocations.stream()
            .mapToInt(PlanAllocation::getEffectiveCount)
            .sum();
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
    
    public PlanStatus getStatus() {
        return status;
    }
    
    public void setStatus(PlanStatus status) {
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
    
    public Map<String, Map<String, Integer>> getDistribution() {
        return distribution;
    }
    
    public void setDistribution(Map<String, Map<String, Integer>> distribution) {
        this.distribution = distribution;
    }
    
    public OffsetDateTime getSentToRegionsAt() {
        return sentToRegionsAt;
    }
    
    public void setSentToRegionsAt(OffsetDateTime sentToRegionsAt) {
        this.sentToRegionsAt = sentToRegionsAt;
    }
    
    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
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

    public BigDecimal getEstimatedRevenue() {
        return estimatedRevenue;
    }

    public void setEstimatedRevenue(BigDecimal estimatedRevenue) {
        this.estimatedRevenue = estimatedRevenue;
    }

    public JsonNode getEstimatedRevenueDistribution() {
        return estimatedRevenueDistribution;
    }

    public void setEstimatedRevenueDistribution(JsonNode estimatedRevenueDistribution) {
        this.estimatedRevenueDistribution = estimatedRevenueDistribution;
    }

    @Override
    public String toString() {
        return "AnnualAuditPlan{" +
                "id=" + id +
                ", planYear=" + planYear +
                ", planName='" + planName + '\'' +
                ", status=" + status +
                ", createdBy='" + createdBy + '\'' +
                ", createdAt=" + createdAt +
                ", allocations=" + allocations.size() +
                '}';
    }
}

class UnauthorizedException extends Exception {
    public UnauthorizedException(String message) {
        super(message);
    }
}
