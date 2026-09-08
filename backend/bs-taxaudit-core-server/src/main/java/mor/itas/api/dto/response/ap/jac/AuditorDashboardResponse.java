package mor.itas.api.dto.response.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * AuditorDashboardResponse - DTO for auditor dashboard overview
 * Contains metrics and case summaries for the auditor's workspace
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditorDashboardResponse {

    private long totalAssigned;
    private long inProgress;
    private long completed;
    private long pendingDocuments;
    private long overdueFindings;
    private long totalAuditDays;

    private List<AuditorCaseSummary> activeCases;
    private List<AuditorCaseSummary> recentCompleted;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuditorCaseSummary {
        private String caseId;
        private String caseNumber;
        private String taxpayerName;
        private String taxpayerId;
        private String auditType;
        private String riskPriority;
        private Integer riskScore;
        private String status;
        private String currentStep;
        private Integer workflowProgress; // 0-100 percent
        private String assignedTeamLeaderId;
        private String assignedDate;
        private String dueDate;
        private Integer daysRemaining;
        private List<WorkflowStepProgress> steps;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WorkflowStepProgress {
        private String stepId;
        private String stepName;
        private String status; // pending, in_progress, completed
        private String completedAt;
    }
}
