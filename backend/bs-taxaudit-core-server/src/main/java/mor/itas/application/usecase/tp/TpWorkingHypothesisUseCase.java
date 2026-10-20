package mor.itas.application.usecase.tp;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import mor.itas.persistence.jpa.entity.tp.TpWorkingHypothesisEntity;
import mor.itas.persistence.jpa.repository.ap.ApAuditCaseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TpWorkingHypothesisUseCase {

    private final ApAuditCaseRepository auditCaseRepository;

    @Transactional
    public void saveWorkingHypothesis(UUID caseId, String hypothesisDescription,
                                      String identifiedIssue, String economicRationale,
                                      BigDecimal revenueAtRisk, JsonNode calculationDetails,
                                      String currentUserId) {
        log.info("Saving TP Working Hypothesis for case: {}", caseId);
        ApAuditCaseEntity auditCase = auditCaseRepository.findById(caseId)
                .orElseThrow(() -> new IllegalArgumentException("Case not found: " + caseId));

        TpWorkingHypothesisEntity hypothesis = auditCase.getTpWorkingHypothesis();
        if (hypothesis == null) {
            hypothesis = TpWorkingHypothesisEntity.builder()
                    .auditCase(auditCase)
                    .status("DRAFT")
                    .createdBy(currentUserId)
                    .build();
        }

        hypothesis.setHypothesisDescription(hypothesisDescription);
        hypothesis.setIdentifiedIssue(identifiedIssue);
        hypothesis.setEconomicRationale(economicRationale);
        hypothesis.setRevenueAtRisk(revenueAtRisk);
        hypothesis.setCalculationDetails(calculationDetails);
        hypothesis.setUpdatedBy(currentUserId);

        auditCase.setTpWorkingHypothesis(hypothesis);
        auditCaseRepository.save(auditCase);
    }
}
