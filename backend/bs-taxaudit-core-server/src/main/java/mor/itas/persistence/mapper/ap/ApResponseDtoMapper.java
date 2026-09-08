package mor.itas.persistence.mapper.ap;

import mor.itas.domain.model.ap.AnnualAuditPlan;
import mor.itas.domain.model.ap.AuditCase;
import mor.itas.domain.model.ap.PlanAllocation;
import mor.itas.api.dto.response.ap.AllocationResponse;
import mor.itas.api.dto.response.ap.AuditCaseResponse;
import mor.itas.api.dto.response.ap.PlanResponse;
import mor.itas.persistence.jpa.entity.ap.UserEntity;
import mor.itas.persistence.jpa.repository.ap.UserJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * ApResponseDtoMapper - Maps domain models to response DTOs
 * 
 * Separates internal domain models from external API contracts.
 * Removes references to non-existent domain classes.
 */
@Component
@RequiredArgsConstructor
public class ApResponseDtoMapper {

    private final UserJpaRepository userRepository;

    public PlanResponse toPlanResponse(AnnualAuditPlan plan) {
        if (plan == null) return null;
        
        PlanResponse response = new PlanResponse();
        response.setId(plan.getId());
        response.setPlanYear(plan.getPlanYear());
        response.setPlanName(plan.getPlanName());
        response.setStatus(plan.getStatus().name());
        response.setCreatedBy(plan.getCreatedBy());
        response.setCreatedAt(plan.getCreatedAt());
        response.setVersion(plan.getVersion());
        
        // Set distribution data
        response.setDistribution(plan.getDistribution());
        
        // Separate allocations into regional and tax center
        List<AllocationResponse> regionalAllocations = plan.getAllocations().stream()
            .filter(a -> a.getTaxCenterCode() == null)
            .map(this::toPlanAllocationResponse)
            .toList();
        
        List<AllocationResponse> taxCenterAllocations = plan.getAllocations().stream()
            .filter(a -> a.getTaxCenterCode() != null)
            .map(this::toPlanAllocationResponse)
            .toList();
        
        response.setRegionalAllocations(regionalAllocations);
        response.setTaxCenterAllocations(taxCenterAllocations);
        
        return response;
    }

    public AllocationResponse toPlanAllocationResponse(PlanAllocation allocation) {
        if (allocation == null) return null;
        
        AllocationResponse response = new AllocationResponse();
        response.setId(allocation.getId());
        response.setRegionCode(allocation.getRegionCode());
        response.setTaxCenterCode(allocation.getTaxCenterCode());
        response.setProposedCount(allocation.getProposedCount());
        response.setEffectiveCount(allocation.getEffectiveCount());
        response.setTcAdjustedCount(allocation.getTcAdjustedCount());
        response.setTcJustification(allocation.getTcJustification());
        response.setTcFeedbackSubmitted(allocation.getTcFeedbackSubmitted());
        
        // Determine allocation type
        if (allocation.getTaxCenterCode() == null) {
            response.setAllocationType("REGIONAL");
        } else {
            response.setAllocationType("TAX_CENTER");
        }
        
        return response;
    }

    public AuditCaseResponse toAuditCaseResponse(AuditCase auditCase) {
        if (auditCase == null) return null;
        
        return AuditCaseResponse.builder()
            .id(auditCase.getId())
            .planId(auditCase.getPlanId())
            .allocationId(auditCase.getAllocationId())
            .caseNumber(auditCase.getCaseNumber())
            .taxpayerId(auditCase.getTaxpayerId())
            .taxpayerName(auditCase.getTaxpayerName())
            .auditType(auditCase.getAuditType())
            .riskPriority(auditCase.getRiskPriority())
            .riskScore(auditCase.getRiskScore())
            .segment(auditCase.getSegment())
            .status(auditCase.getStatus())
            .assignedTeamLeaderId(auditCase.getAssignedTeamLeaderId())
            .assignedTeamLeaderName(resolveUserName(auditCase.getAssignedTeamLeaderId()))
            .assignedAuditorId(auditCase.getAssignedAuditorId())
            .assignedAuditorName(resolveUserName(auditCase.getAssignedAuditorId()))
            .handoffAt(auditCase.getHandoffAt())
            .handoffBy(auditCase.getHandoffBy())
            .handoffComment(auditCase.getHandoffComment())
            .assignedAt(auditCase.getAssignedAt())
            .assignedBy(auditCase.getAssignedBy())
            .createdBy(auditCase.getCreatedBy())
            .createdAt(auditCase.getCreatedAt())
            .startedAt(auditCase.getStartedAt())
            .completedAt(auditCase.getCompletedAt())
            .updatedAt(auditCase.getUpdatedAt())
            .build();
    }

    /**
     * Resolve a user's full name from their ID.
     * Handles UUID IDs, usernames, and frontend-format IDs (e.g. 'u-tl-aa1a').
     */
    private String resolveUserName(String userId) {
        if (userId == null || userId.isBlank()) return null;
        // 1. Try UUID lookup
        try {
            java.util.UUID uuid = java.util.UUID.fromString(userId);
            return userRepository.findById(uuid)
                    .map(UserEntity::getFullName)
                    .orElse(null);
        } catch (IllegalArgumentException ignored) { }
        // 2. Try username lookup
        return userRepository.findByUsername(userId)
                .map(UserEntity::getFullName)
                .orElse(userId); // Return raw ID as fallback
    }
}
