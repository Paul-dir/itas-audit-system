package mor.itas.persistence.jpa.entity.ap;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

/**
 * PlanAllocationEntity - JPA Entity for ap_plan_allocations table
 */
@Entity
@Table(name = "ap_plan_allocations")
public class PlanAllocationEntity {

    @Id
    private UUID id = UUID.randomUUID();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "annual_plan_id", nullable = false)
    private AnnualAuditPlanEntity annualPlan;

    @Column(nullable = false, length = 64, name = "tax_center_code")
    private String taxCenterCode;

    @Column(nullable = false, name = "proposed_count")
    private Integer proposedCount;

    @Column(nullable = false, name = "created_at")
    private Instant createdAt = Instant.now();

    @Column(nullable = false, name = "updated_at")
    private Instant updatedAt = Instant.now();

    // Constructors
    public PlanAllocationEntity() {
    }

    public PlanAllocationEntity(UUID id, AnnualAuditPlanEntity annualPlan, String taxCenterCode, Integer proposedCount, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.annualPlan = annualPlan;
        this.taxCenterCode = taxCenterCode;
        this.proposedCount = proposedCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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

    public Integer getProposedCount() {
        return proposedCount;
    }

    public void setProposedCount(Integer proposedCount) {
        this.proposedCount = proposedCount;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
