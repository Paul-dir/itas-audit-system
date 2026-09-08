package mor.itas.persistence.jpa.entity.ap;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "t_audit_finding", indexes = {
    @Index(name = "idx_finding_case_id", columnList = "case_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditFindingEntity {

    @Id
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @Column(name = "case_id", nullable = false)
    private UUID caseId;

    @Column(nullable = false, length = 256)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 64)
    private String category;

    @Column(length = 32)
    private String severity; // HIGH, MEDIUM, LOW

    @Column(name = "created_by", nullable = false, length = 64)
    private String createdBy;

    @Column(length = 32)
    private String status; // DRAFT, SUBMITTED, APPROVED, REVISION_REQUESTED, CONCLUDED

    // Team Leader approval
    @Column(name = "approved_by")
    private String approvedBy;

    @Column(name = "approved_at")
    private OffsetDateTime approvedAt;

    @Column(columnDefinition = "TEXT")
    private String revisionNotes;

    // Taxpayer response (step 10)
    @Column(name = "response_type", length = 32)
    private String responseType; // AGREED, DISPUTED, PARTIALLY_AGREED

    @Column(columnDefinition = "TEXT")
    private String taxpayerExplanation;

    @Column(columnDefinition = "TEXT")
    private String taxpayerEvidence;

    @Column(name = "responded_at")
    private OffsetDateTime respondedAt;

    // Conclusion (step 11)
    @Column(columnDefinition = "TEXT")
    private String conclusion;

    @Column(name = "concluded_by", length = 64)
    private String concludedBy;

    @Column(name = "concluded_at")
    private OffsetDateTime concludedAt;

    @Column(name = "final_amount", precision = 15, scale = 2)
    private java.math.BigDecimal finalAmount;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (id == null) id = UUID.randomUUID();
        if (createdAt == null) createdAt = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
