package mor.itas.domain.model.ap;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

/**
 * PlanReviewDecision - Value Object
 * 
 * Represents a director's decision on a plan review:
 * - APPROVED: Plan proceeds to implementation
 * - REJECTED: Plan is rejected and sent back
 * - AMENDMENT_REQUESTED: Plan needs amendments with feedback
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanReviewDecision {
    
    private String planId;
    
    private PlanDecisionType decisionType;
    
    /**
     * Comment/feedback from director
     * For REJECTED: reason for rejection
     * For AMENDMENT_REQUESTED: specific feedback and requirements
     */
    private String directorComment;
    
    /**
     * Additional structured feedback
     * For AMENDMENT_REQUESTED: regional capacity constraints, etc.
     */
    private String feedbackDetails;
    
    private OffsetDateTime decidedAt;
    
    private String decidedBy;
    
    /**
     * Amendment round number (1st, 2nd, etc.)
     */
    private Integer amendmentRound;
}
