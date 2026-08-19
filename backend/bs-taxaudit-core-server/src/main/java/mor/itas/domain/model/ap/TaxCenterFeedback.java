package mor.itas.domain.model.ap;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * TaxCenterFeedback - Domain Model
 * 
 * Represents capacity feedback submitted by a Tax Center Manager.
 * 
 * Contains:
 * - Allocation details (what was requested)
 * - Capacity details (what they can actually do)
 * - Justification (why they can't do more)
 * - Submission details (who, when)
 * 
 * Immutable value object following DDD principles.
 */
@Builder
@Getter
@EqualsAndHashCode
@ToString
public class TaxCenterFeedback {
    
    private final String taxCenterId;
    private final String regionId;
    private final String auditTypeId;
    
    // What was requested by Regional Director
    private final Integer requestedCount;
    
    // What Tax Center can actually do (capacity)
    private final Integer acceptedCount;
    
    // Why they can't do more (qualitative feedback)
    private final String justification;
    
    // Detailed feedback (optional JSON with structured details)
    private final Map<String, Object> feedbackDetails;
    
    // Who submitted and when
    private final String submittedBy;
    private final LocalDateTime submittedAt;
    
    // Status of feedback
    private final String status; // SUBMITTED, REVIEWED, INCORPORATED
    
    // For reconstruction from DB
    public TaxCenterFeedback(
            String taxCenterId,
            String regionId,
            String auditTypeId,
            Integer requestedCount,
            Integer acceptedCount,
            String justification,
            Map<String, Object> feedbackDetails,
            String submittedBy,
            LocalDateTime submittedAt,
            String status) {
        
        this.taxCenterId = taxCenterId;
        this.regionId = regionId;
        this.auditTypeId = auditTypeId;
        this.requestedCount = requestedCount;
        this.acceptedCount = acceptedCount;
        this.justification = justification;
        this.feedbackDetails = feedbackDetails;
        this.submittedBy = submittedBy;
        this.submittedAt = submittedAt;
        this.status = status;
    }
    
    /**
     * Calculate the gap between requested and accepted
     * 
     * @return delta = acceptedCount - requestedCount (usually negative)
     */
    public Integer calculateDelta() {
        if (acceptedCount == null || requestedCount == null) {
            return null;
        }
        return acceptedCount - requestedCount;
    }
    
    /**
     * Check if feedback indicates capacity constraint
     * 
     * @return true if accepted < requested
     */
    public boolean hasCapacityGap() {
        return acceptedCount != null && requestedCount != null && acceptedCount < requestedCount;
    }
    
    /**
     * Get gap percentage
     * 
     * @return percentage by which capacity falls short of request
     */
    public Double getGapPercentage() {
        if (requestedCount == null || requestedCount == 0) {
            return 0.0;
        }
        return (double) (requestedCount - acceptedCount) / requestedCount * 100;
    }
}
