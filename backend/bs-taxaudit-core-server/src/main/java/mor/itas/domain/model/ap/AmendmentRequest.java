package mor.itas.domain.model.ap;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.Map;

/**
 * AmendmentRequest - Value Object
 * 
 * Represents a director's request for amendments to a plan.
 * Contains the feedback and requirements for the planning team to address.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmendmentRequest {
    
    private String planId;
    
    /**
     * Amendment round number (1, 2, 3, etc.)
     */
    private Integer amendmentRound;
    
    /**
     * Director's comment explaining why amendments are needed
     */
    private String directorComment;
    
    /**
     * Structured feedback from regional directors
     * Example: {
     *   "AA": {
     *     "desk_audit": { "requested": 4200, "capacity": 3730, "reason": "Limited auditors" },
     *     ...
     *   },
     *   ...
     * }
     */
    private Map<String, Object> regionalFeedback;
    
    /**
     * Summary of what changed from previous round
     */
    private String changeSummary;
    
    private OffsetDateTime requestedAt;
    
    private String requestedBy;
    
    /**
     * Status: PENDING, PLANNED, COMPLETED
     */
    private String status;
}
