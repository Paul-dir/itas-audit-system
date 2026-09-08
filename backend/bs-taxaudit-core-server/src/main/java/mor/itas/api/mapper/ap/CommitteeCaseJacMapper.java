package mor.itas.api.mapper.ap;

import mor.itas.api.dto.response.ap.jac.CommitteeCaseResponse;
import mor.itas.persistence.jpa.entity.ap.CommitteeCaseEntity;
import mor.itas.persistence.jpa.repository.ap.UserJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Mapper for committee case entity to response DTO
 */
@Component
@RequiredArgsConstructor
public class CommitteeCaseJacMapper {

    private final UserJpaRepository userRepository;
    
    public CommitteeCaseResponse toResponse(CommitteeCaseEntity entity) {
        return toResponse(entity, null);
    }

    /**
     * Map entity to response DTO, optionally computing userOwnsCase.
     * @param entity     the JPA entity
     * @param currentUserId the currently authenticated user's ID (may be null)
     */
    public CommitteeCaseResponse toResponse(CommitteeCaseEntity entity, java.util.UUID currentUserId) {
        if (entity == null) {
            return null;
        }

        boolean owns = currentUserId != null && currentUserId.equals(entity.getCurrentOwnerId());

        return CommitteeCaseResponse.builder()
            .committeeCaseId(entity.getCaseId())
            .id(entity.getCaseId())
            .caseCode(entity.getCaseCode())
            .taxpayerName(entity.getTaxpayerName())
            .taxIdNumber(entity.getTaxIdNumber())
            .segment(entity.getSegment())
            .industry(entity.getIndustry())
            .description(entity.getDescription())
            .businessType(entity.getBusinessType())
            .totalAmount(entity.getTotalAmount())
            .assessmentScore(entity.getAssessmentScore())
            .address(entity.getAddress())
            .city(entity.getCity())
            .region(entity.getRegion())
            .taxCenter(entity.getTaxCenter())
            .complianceIssues(entity.getComplianceIssues())
            .riskIndicators(
                entity.getRiskIndicators() != null
                    ? entity.getRiskIndicators().stream()
                        .map(m -> mor.itas.api.dto.response.ap.jac.RiskIndicatorResponse.builder()
                            .id((String) m.get("id"))
                            .name((String) m.get("name"))
                            .weight(m.get("weight") instanceof Number ? ((Number) m.get("weight")).doubleValue() : null)
                            .description((String) m.get("description"))
                            .source((String) m.get("source"))
                            .severity((String) m.get("severity"))
                            .build())
                        .toList()
                    : null
            )
            .representatives(
                entity.getRepresentatives() != null
                    ? entity.getRepresentatives().stream()
                        .map(m -> mor.itas.api.dto.response.ap.jac.RepresentativeResponse.builder()
                            .name(m.get("name"))
                            .title(m.get("title"))
                            .build())
                        .toList()
                    : null
            )
            .riskScore(entity.getRiskScore())
            .riskPriority(entity.getRiskPriority())
            .status(entity.getStatus())
            .createdDate(entity.getCreatedDate())
            .committeeDeadline(entity.getCommitteeDeadline())
            .extendedDeadline(entity.getExtendedDeadline())
            .extensionCount(entity.getExtensionCount())
            .currentOwnerId(entity.getCurrentOwnerId())
            .teamLeadId(entity.getTeamLeadId())
            .teamLeadName(resolveUserName(entity.getTeamLeadId()))
            .userOwnsCase(owns)
            .decision(entity.getDecision())
            .decisionDate(entity.getDecisionDate())
            .decisionReason(entity.getDecisionReason())
            .build();
    }

    private String resolveUserName(java.util.UUID userId) {
        if (userId == null) return null;
        return userRepository.findById(userId)
            .map(u -> u.getFullName())
            .orElse(null);
    }
}
