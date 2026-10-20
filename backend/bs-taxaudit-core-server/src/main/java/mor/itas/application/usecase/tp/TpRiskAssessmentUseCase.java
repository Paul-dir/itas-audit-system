package mor.itas.application.usecase.tp;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import mor.itas.persistence.jpa.entity.tp.TpRiskAssessmentEntity;
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
        ApAuditCaseEntity auditCase = getValidTpCase(caseId);

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

        if ("ASSIGNED_TO_TEAM_LEADER".equals(auditCase.getStatus()) || "ASSIGNED_TO_COMMITTEE".equals(auditCase.getStatus())) {
            auditCase.setStatus("IN_PROGRESS");
        }
        auditCase.setTpCurrentPhase("DETAILED_RISK_ASSESSMENT");
        auditCase.setTpRiskAssessment(assessment);
        auditCaseRepository.save(auditCase);
    }

    private ApAuditCaseEntity getValidTpCase(UUID caseId) {
        ApAuditCaseEntity c = auditCaseRepository.findById(caseId)
                .orElseThrow(() -> new IllegalArgumentException("Case not found: " + caseId));
        if (!"TRANSFER_PRICING".equals(c.getAuditType())) {
            throw new IllegalStateException("Case is not a Transfer Pricing audit");
        }
        return c;
    }
}
