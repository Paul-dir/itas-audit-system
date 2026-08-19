package mor.itas.api.dto.response.ap;

import lombok.*;
import java.util.Map;

/**
 * AmendedPlanDto - Response DTO
 * 
 * Represents the amended plan submitted back to Director.
 * 
 * Fields:
 * - planId: The plan ID
 * - amendmentRound: Which amendment round
 * - plannedChanges: What was changed (region × audit type → new count)
 * - changeSummary: Total changes and percentages
 * - planningTeamComments: Optional comments from planning team
 * - status: Current status (PENDING_DIRECTOR_REVIEW)
 */
@Builder
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class AmendedPlanDto {
    
    private String planId;
    private Integer amendmentRound;
    
    // Changes made: {regionId: {auditTypeId: newCount}}
    private Map<String, Map<String, Integer>> plannedChanges;
    
    // Summary of changes
    // {
    //   "totalOld": 100000,
    //   "totalNew": 98000,
    //   "totalDelta": -2000,
    //   "percentageChange": -2.0
    // }
    private Map<String, Object> changeSummary;
    
    private String planningTeamComments;
    private String submittedBy;
    private String submittedAt;
    private String status; // SUBMITTED_TO_DIRECTOR
}
