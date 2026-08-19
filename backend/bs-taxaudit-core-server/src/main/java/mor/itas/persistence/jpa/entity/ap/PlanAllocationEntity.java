package mor.itas.persistence.jpa.entity.ap;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * PlanAllocationEntity - JPA Entity for ap_plan_allocations table
 * Supports both regional and tax center allocations in same table:
 * - Regional Allocations: tax_center_code IS NULL, region_code is set
 * - Tax Center Allocations: tax_center_code IS NOT NULL, region_code is set
 */
@Entity
@Table(name = "ap_plan_allocations")
public class PlanAllocationEntity {

    @Id
    private UUID id = UUID.randomUUID();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private AnnualAuditPlanEntity annualPlan;

    @Column(name = "tax_center_code", length = 64)
    private String taxCenterCode;      // NULL for regional allocations, set for tax center allocations

    @Column(nullable = false, length = 10, name = "region_code")
    private String regionCode;

    @Column(nullable = false, name = "proposed_count")
    private Integer proposedCount;

    // Regional Director Division (only used when creating tax center allocations from regional)
    @Column(name = "regional_divided_count")
    private Integer regionalDividedCount;

    @Column(name = "regional_division_reason", columnDefinition = "TEXT")
    private String regionalDivisionReason;

    // Tax Center Feedback (only at tax center allocation level)
    @Column(name = "tc_adjusted_count")
    private Integer tcAdjustedCount;

    @Column(name = "tc_justification", columnDefinition = "TEXT")
    private String tcJustification;

    @Column(name = "tc_feedback_submitted", nullable = false)
    private Boolean tcFeedbackSubmitted = false;

    @Column(name = "tc_feedback_submitted_at")
    private OffsetDateTime tcFeedbackSubmittedAt;

    @Column(nullable = false, name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    // Constructors
    public PlanAllocationEntity() {
    }

    public PlanAllocationEntity(UUID id, AnnualAuditPlanEntity annualPlan, String taxCenterCode, 
                               String regionCode, Integer proposedCount) {
        this.id = id;
        this.annualPlan = annualPlan;
        this.taxCenterCode = taxCenterCode;
        this.regionCode = regionCode;
        this.proposedCount = proposedCount;
        this.tcFeedbackSubmitted = false;
        this.createdAt = OffsetDateTime.now();
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public AnnualAuditPlanEntity getAnnualPlan() {
        return annualPlan;
    }

    public void setAnnualPlan(AnnualAuditPlanEntity annualPlan) {
        this.annualPlan = annualPlan;
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

    // Helper methods
    public boolean isRegionalAllocation() {
        return taxCenterCode == null || taxCenterCode.isBlank();
    }

    public boolean isTaxCenterAllocation() {
        return taxCenterCode != null && !taxCenterCode.isBlank();
    }
}
