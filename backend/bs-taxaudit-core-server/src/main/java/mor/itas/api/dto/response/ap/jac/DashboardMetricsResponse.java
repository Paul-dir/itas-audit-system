package mor.itas.api.dto.response.ap.jac;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for committee dashboard metrics
 * Provides comprehensive overview for dashboard page
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardMetricsResponse {
    
    // Core metrics
    private Integer totalCases;
    private Integer totalPortfolioCases;
    private Integer pendingVotes;
    private Integer teamAssigned;
    private Integer pendingViability;
    private Integer approvedCases;
    private Integer rejectedCases;
    private Integer overdueCount;
    private Double averageDecisionDaysRemaining;
    private List<String> upcomingDeadlines;
    
    // Chairperson actions
    @JsonProperty("chairpersonAction")
    private ChairpersonActionMetrics chairpersonAction;
    
    // Advisory votes
    private Integer advisoryVotesPending;
    private Integer criticalSLAWarnings;
    
    // Risk priority distribution
    @JsonProperty("riskPriority")
    private RiskPriorityMetrics riskPriority;
    
    // Office segment distribution
    @JsonProperty("officeSegment")
    private OfficeSegmentMetrics officeSegment;
    
    // Activity stream
    private List<ActivityStreamItem> activityStream;
    
    /**
     * Chairperson action metrics
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChairpersonActionMetrics {
        private Integer count;
        private String status;
    }
    
    /**
     * Risk priority distribution
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RiskPriorityMetrics {
        private Integer highThreat;
        private Integer mediumThreat;
        private Integer lowThreat;
        private Integer totalCases;
    }
    
    /**
     * Office segment distribution
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OfficeSegmentMetrics {
        private Double ltoPercentage;
        private Integer ltoDossiers;
        private Double mtoPercentage;
        private Integer mtoDossiers;
        private Double stoPercentage;
        private Integer stoDossiers;
        private String slaHealthIndex;
    }
    
    /**
     * Activity stream item
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ActivityStreamItem {
        private String initials;
        private String advisor;
        private String action;
        private String timestamp;
        private String caseReference;
    }
}
