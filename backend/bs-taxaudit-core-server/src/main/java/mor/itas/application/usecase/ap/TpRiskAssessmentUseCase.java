package mor.itas.application.usecase.ap;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import mor.itas.persistence.jpa.entity.ap.TpRiskAssessmentEntity;
import mor.itas.persistence.jpa.repository.ap.ApAuditCaseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TpRiskAssessmentUseCase {

    private final ApAuditCaseRepository auditCaseRepository;

    @Transactional
    public void saveRiskAssessment(UUID caseId, String riskLevel, JsonNode riskDetails, String comments, String currentUserId) {
        log.info("Saving TP Risk Assessment for case: {}", caseId);
        
        ApAuditCaseEntity auditCase = auditCaseRepository.findById(caseId)
                .orElseThrow(() -> new IllegalArgumentException("Case not found"));

        if (!"TRANSFER_PRICING".equals(auditCase.getAuditType())) {
            throw new IllegalStateException("Case is not a Transfer Pricing audit");
        }

        TpRiskAssessmentEntity assessment = auditCase.getTpRiskAssessment();
        if (assessment == null) {
            assessment = TpRiskAssessmentEntity.builder()
                    .auditCase(auditCase)
                    .assessmentStatus("DRAFT")
                    .createdBy(currentUserId)
                    .build();
        }

        assessment.setRiskLevel(riskLevel);
        assessment.setRiskDetails(riskDetails);
        assessment.setComments(comments);
        assessment.setUpdatedBy(currentUserId);
        
        // If transitioning from ASSIGNED_TO_TEAM_LEADER, update phase
        if ("ASSIGNED_TO_TEAM_LEADER".equals(auditCase.getStatus())) {
            auditCase.setStatus("DETAILED_RISK_ASSESSMENT");
        }

        auditCase.setTpRiskAssessment(assessment);
        auditCaseRepository.save(auditCase);
    }
}
