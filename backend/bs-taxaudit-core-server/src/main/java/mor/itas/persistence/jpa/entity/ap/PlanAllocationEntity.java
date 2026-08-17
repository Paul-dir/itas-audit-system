package mor.itas.persistence.jpa.entity.ap;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "ap_plan_allocations")
@Getter
@Setter
public class PlanAllocationEntity {
    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private AnnualAuditPlanEntity plan;

    @Column(name = "tax_center_code", nullable = false)
    private String taxCenterCode;

    @Column(name = "proposed_count", nullable = false)
    private Integer proposedCount;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;
}
