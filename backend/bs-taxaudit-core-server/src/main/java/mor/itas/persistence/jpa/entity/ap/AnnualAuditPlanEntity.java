package mor.itas.persistence.jpa.entity.ap;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * AnnualAuditPlanEntity - JPA Entity for ap_annual_audit_plans table
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

    @Column(nullable = false, length = 32)
    private String status = "DRAFT";

    @Column(nullable = false, length = 64, name = "created_by")
    private String createdBy;

    @Column(nullable = false, name = "created_at")
    private Instant createdAt = Instant.now();

    @Column(nullable = false, name = "updated_at")
    private Instant updatedAt = Instant.now();

    @Version
    private Long version = 0L;

    @OneToMany(mappedBy = "annualPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlanAllocationEntity> allocations = new ArrayList<>();

    // Constructors
    public AnnualAuditPlanEntity() {
    }

    public AnnualAuditPlanEntity(UUID id, Integer year, String name, String status, String createdBy, Instant createdAt, Instant updatedAt, Long version, List<PlanAllocationEntity> allocations) {
        this.id = id;
        this.year = year;
        this.name = name;
        this.status = status;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.version = version;
        this.allocations = allocations != null ? allocations : new ArrayList<>();
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
