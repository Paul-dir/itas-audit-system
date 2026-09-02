package mor.itas.application.usecase.tp;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import mor.itas.persistence.jpa.entity.tp.TpAuditPlanEntity;
import mor.itas.persistence.jpa.repository.ap.ApAuditCaseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TpAuditPlanUseCase {

    private final ApAuditCaseRepository auditCaseRepository;

    @Transactional
    public void saveAuditPlan(UUID caseId, String objective, String scope,
                              JsonNode materialityDetails, JsonNode industryResearch,
                              JsonNode samplingMethod, JsonNode plannedProcedures,
                              String currentUserId) {
        log.info("Saving TP Audit Plan for case: {}", caseId);
        ApAuditCaseEntity auditCase = auditCaseRepository.findById(caseId)
                .orElseThrow(() -> new IllegalArgumentException("Case not found: " + caseId));

        TpAuditPlanEntity plan = auditCase.getTpAuditPlan();
        if (plan == null) {
            plan = TpAuditPlanEntity.builder()
                    .auditCase(auditCase)
                    .status("DRAFT")
                    .createdBy(currentUserId)
                    .build();
        }

        plan.setObjective(objective);
        plan.setScope(scope);
        plan.setMaterialityDetails(materialityDetails);
        plan.setIndustryResearch(industryResearch);
        plan.setSamplingMethod(samplingMethod);
        plan.setPlannedProcedures(plannedProcedures);
        plan.setUpdatedBy(currentUserId);

        auditCase.setTpCurrentPhase("PLANNING");
        auditCase.setTpAuditPlan(plan);
        auditCaseRepository.save(auditCase);
    }

    @Transactional
    public void approveAuditPlan(UUID caseId, String comments, String currentUserId) {
        log.info("Process Owner approving TP Audit Plan for case: {}", caseId);
        ApAuditCaseEntity auditCase = auditCaseRepository.findById(caseId)
                .orElseThrow(() -> new IllegalArgumentException("Case not found: " + caseId));

        TpAuditPlanEntity plan = auditCase.getTpAuditPlan();
        if (plan != null) {
            plan.setStatus("APPROVED");
            plan.setApprovedBy(currentUserId);
            plan.setApprovedAt(java.time.OffsetDateTime.now());
        }

        auditCase.setTpCurrentPhase("PLANNING_APPROVAL");
        auditCaseRepository.save(auditCase);
    }
}
