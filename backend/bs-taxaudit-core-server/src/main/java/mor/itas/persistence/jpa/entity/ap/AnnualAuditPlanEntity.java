package mor.itas.persistence.jpa.entity.ap;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "ap_annual_audit_plans")
@Getter
@Setter
public class AnnualAuditPlanEntity {
    @Id
    private UUID id;

    @Column(name = "plan_year", nullable = false)
    private Integer planYear;

    @Column(name = "plan_name", nullable = false)
    private String planName;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "created_by", nullable = false)
    private String createdBy;

    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlanAllocationEntity> allocations;
}
