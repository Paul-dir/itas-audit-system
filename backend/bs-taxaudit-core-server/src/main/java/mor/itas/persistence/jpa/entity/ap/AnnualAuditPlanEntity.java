package mor.itas.persistence.jpa.entity.ap;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * AnnualAuditPlanEntity - JPA Entity for ap_annual_audit_plans table
 * Tracks the 4-level approval workflow: Planning Team → Director → Regional Director → Tax Centers
 */
@Entity
@Table(name = "ap_annual_audit_plans")
public class AnnualAuditPlanEntity {

    @Id
    private UUID id = UUID.randomUUID();

    @Column(nullable = false, name = "plan_year")
    private Integer year;

    @Column(nullable = false, length = 256, name = "plan_name")
    private String name;

    @Column(nullable = false, name = "status")
    @Enumerated(EnumType.STRING)
    private PlanStatusEnum status = PlanStatusEnum.DRAFT;

    // Planning Team Phase
    @Column(nullable = false, length = 64, name = "created_by")
    private String createdBy;

    @Column(nullable = false, name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    // Director Approval Phase
    @Column(name = "submitted_to_director_by", length = 64)
    private String submittedToDirectorBy;

    @Column(name = "submitted_to_director_at")
    private OffsetDateTime submittedToDirectorAt;

    @Column(name = "director_approved_by", length = 64)
    private String directorApprovedBy;

    @Column(name = "director_approved_at")
    private OffsetDateTime directorApprovedAt;

    @Column(name = "director_approval_reason")
    private String directorApprovalReason;

    // Regional Director Approval Phase
    @Column(name = "submitted_to_regional_by", length = 64)
    private String submittedToRegionalBy;

    @Column(name = "submitted_to_regional_at")
    private OffsetDateTime submittedToRegionalAt;

    @Column(name = "regional_director_approved_by", length = 64)
    private String regionalDirectorApprovedBy;

    @Column(name = "regional_director_approved_at")
    private OffsetDateTime regionalDirectorApprovedAt;

    @Column(name = "regional_director_approval_reason")
    private String regionalDirectorApprovalReason;

    // Tax Center Phase
    @Column(name = "sent_to_tax_center_at")
    private OffsetDateTime sentToTaxCenterAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @Version
    private Long version = 0L;

    @OneToMany(mappedBy = "annualPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlanAllocationEntity> allocations = new ArrayList<>();

    // Constructors
    public AnnualAuditPlanEntity() {
    }

    public AnnualAuditPlanEntity(UUID id, Integer year, String name, String createdBy) {
        this.id = id;
        this.year = year;
        this.name = name;
        this.createdBy = createdBy;
        this.status = PlanStatusEnum.DRAFT;
        this.createdAt = OffsetDateTime.now();
        this.allocations = new ArrayList<>();
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public PlanStatusEnum getStatus() {
        return status;
    }

    public void setStatus(PlanStatusEnum status) {
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

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public List<PlanAllocationEntity> getAllocations() {
        return allocations;
    }

    public void setAllocations(List<PlanAllocationEntity> allocations) {
        this.allocations = allocations;
    }

    public void addAllocation(PlanAllocationEntity allocation) {
        allocations.add(allocation);
        allocation.setAnnualPlan(this);
    }
}
