package mor.itas.api.dto.mapper;

import mor.itas.domain.aggregate.ap.AnnualAuditPlan;
import mor.itas.domain.model.ap.*;
import mor.itas.api.dto.response.ap.*;
import org.springframework.stereotype.Component;

/**
 * ApResponseDtoMapper - Maps domain models to response DTOs
 * 
 * Separates internal domain models from external API contracts.
 * All controllers use this mapper to convert domain objects to DTOs.
 */
@Component
public class ApResponseDtoMapper {

    public PlanResponse toPlanResponse(AnnualAuditPlan plan) {
        if (plan == null) return null;
        
        return PlanResponse.builder()
            .id(plan.getId())
            .year(plan.getPlanYear())
            .name(plan.getPlanName())
            .status(plan.getStatus())
            .directorComment(plan.getDirectorComment())
            .seniorComment(plan.getSeniorComment())
            .amendmentComment(plan.getAmendmentComment())
            .createdAt(plan.getCreatedAt())
            .createdBy(plan.getCreatedBy())
            .allocations(plan.getAllocations().stream()
                .map(this::toPlanAllocationResponse)
                .toList())
            .build();
    }

    public PlanAllocationResponse toPlanAllocationResponse(PlanAllocation allocation) {
        if (allocation == null) return null;
        
        return PlanAllocationResponse.builder()
            .id(allocation.getId())
            .taxCenterCode(allocation.getTaxCenterCode())
            .proposedCount(allocation.getProposedCount())
            .tcAdjustedCount(allocation.getTcAdjustedCount())
            .tcJustification(allocation.getTcJustification())
            .tcFeedbackSubmitted(allocation.getTcFeedbackSubmitted())
            .build();
    }

    public PlanTimelineResponse toPlanTimelineResponse(PlanTimeline timeline) {
        if (timeline == null) return null;
        
        return PlanTimelineResponse.builder()
            .id(timeline.getId())
            .status(timeline.getStatus())
            .actorId(timeline.getActorId())
            .comment(timeline.getComment())
            .eventTimestamp(timeline.getEventTimestamp())
            .createdAt(timeline.getCreatedAt())
            .build();
    }

    public RegionalFeedbackResponse toRegionalFeedbackResponse(RegionalFeedback feedback) {
        if (feedback == null) return null;
        
        return RegionalFeedbackResponse.builder()
            .id(feedback.getId())
            .regionId(feedback.getRegionId())
            .feedbackText(feedback.getFeedbackText())
            .submittedBy(feedback.getSubmittedBy())
            .submittedAt(feedback.getSubmittedAt())
            .isOverridden(feedback.getIsOverridden())
            .overrideComment(feedback.getOverrideComment())
            .overrideBy(feedback.getOverrideBy())
            .overrideAt(feedback.getOverrideAt())
            .createdAt(feedback.getCreatedAt())
            .build();
    }

    public RegionalDeploymentResponse toRegionalDeploymentResponse(RegionalDeployment deployment) {
        if (deployment == null) return null;
        
        return RegionalDeploymentResponse.builder()
            .id(deployment.getId())
            .regionId(deployment.getRegionId())
            .deployedBy(deployment.getDeployedBy())
            .deployedAt(deployment.getDeployedAt())
            .status(deployment.getStatus())
            .build();
    }

    public AuditCaseResponse toAuditCaseResponse(AuditCase auditCase) {
        if (auditCase == null) return null;
        
        return AuditCaseResponse.builder()
            .id(auditCase.getId())
            .planId(auditCase.getPlanId())
            .allocationId(auditCase.getAllocationId())
            .caseNumber(auditCase.getCaseNumber())
            .taxpayerId(auditCase.getTaxpayerId())
            .auditType(auditCase.getAuditType())
            .riskScore(auditCase.getRiskScore())
            .status(auditCase.getStatus())
            .assignedTeamLeaderId(auditCase.getAssignedTeamLeaderId())
            .assignedAuditorId(auditCase.getAssignedAuditorId())
            .createdBy(auditCase.getCreatedBy())
            .createdAt(auditCase.getCreatedAt())
            .startedAt(auditCase.getStartedAt())
            .completedAt(auditCase.getCompletedAt())
            .updatedAt(auditCase.getUpdatedAt())
            .build();
    }
}
