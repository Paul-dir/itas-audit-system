package mor.itas.persistence.jpa.entity.ap;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * RegionalFeedbackEntity - JPA Entity for Regional Feedback
 * 
 * Stores regional director feedback submissions on annual audit plans.
 * ONE-TIME ONLY per region per plan (enforced by unique constraint).
 * 
 * Table: ap_regional_feedback
 * - Tracks aggregated feedback from regional directors
 * - Stores full plan information and analysis
 * - Can be overridden by Director (with audit trail)
 */
@Entity
@Table(
    name = "ap_regional_feedback",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "unique_regional_feedback",
            columnNames = {"plan_id", "region_id"}
        )
    },
    indexes = {
        @Index(name = "idx_ap_regional_feedback_plan_id", columnList = "plan_id"),
        @Index(name = "idx_ap_regional_feedback_region", columnList = "region_id")
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegionalFeedbackEntity {

    @Id
    @Column(name = "id")
    private UUID id;

    /**
     * Reference to the annual audit plan
     * ONE submission per plan per region
     */
    @Column(name = "plan_id", nullable = false)
    private UUID planId;

    /**
     * Region code (e.g., "AA" for Addis Ababa)
     */
    @Column(name = "region_id", nullable = false, length = 64)
    private String regionId;

    /**
     * Aggregated feedback as JSON text
     * Contains: desk_audit, joint_audit, issue_audit, comprehensive, transfer_pricing
     * Each with: totalRequested, totalCapacity, totalGap, gapPercentage, taxCenterFeedbacks
     */
    @Column(name = "feedback_text", columnDefinition = "TEXT")
    private String feedbackText;

    /**
     * Who submitted this feedback
     */
    @Column(name = "submitted_by", length = 64)
    private String submittedBy;

    /**
     * When feedback was submitted
     */
    @Column(name = "submitted_at")
    private OffsetDateTime submittedAt;

    /**
     * Whether this feedback was overridden by Director
     */
    @Column(name = "is_overridden")
    @Builder.Default
    private Boolean isOverridden = false;

    /**
     * Director's override comment (if overridden)
     */
    @Column(name = "override_comment", columnDefinition = "TEXT")
    private String overrideComment;

    /**
     * Who overrode this feedback
     */
    @Column(name = "override_by", length = 64)
    private String overrideBy;

    /**
     * When feedback was overridden
     */
    @Column(name = "override_at")
    private OffsetDateTime overrideAt;

    /**
     * When record was created
     */
    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
