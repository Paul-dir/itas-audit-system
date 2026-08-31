package mor.itas.application.usecase.tp;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import mor.itas.persistence.jpa.entity.tp.TpFieldWorkDataEntity;
import mor.itas.persistence.jpa.repository.ap.ApAuditCaseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TpFieldWorkUseCase {

    private final ApAuditCaseRepository auditCaseRepository;

    @Transactional
    public void saveAccountingAssessment(UUID caseId, String accountingMethods, JsonNode findings, String userId) {
        log.info("Saving TP Accounting Assessment for case: {}", caseId);
        ApAuditCaseEntity c = getCase(caseId);
        TpFieldWorkDataEntity fw = getOrCreate(c, userId);
        fw.setAccountingMethods(accountingMethods);
        fw.setAccountingFindings(findings);
        fw.setUpdatedBy(userId);
        c.setTpFieldWorkData(fw);
        auditCaseRepository.save(c);
    }

    @Transactional
    public void saveTransactionTrails(UUID caseId, JsonNode data, String userId) {
        ApAuditCaseEntity c = getCase(caseId);
        TpFieldWorkDataEntity fw = getOrCreate(c, userId);
        fw.setTransactionTrails(data);
        fw.setUpdatedBy(userId);
        c.setTpFieldWorkData(fw);
        auditCaseRepository.save(c);
    }

    @Transactional
    public void saveSampleSelections(UUID caseId, JsonNode data, String userId) {
        ApAuditCaseEntity c = getCase(caseId);
        TpFieldWorkDataEntity fw = getOrCreate(c, userId);
        fw.setSampleSelections(data);
        fw.setUpdatedBy(userId);
        c.setTpFieldWorkData(fw);
        auditCaseRepository.save(c);
    }

    @Transactional
    public void saveInformationRequest(UUID caseId, JsonNode data, String userId) {
        ApAuditCaseEntity c = getCase(caseId);
        TpFieldWorkDataEntity fw = getOrCreate(c, userId);
        fw.setInformationRequests(data);
        fw.setUpdatedBy(userId);
        c.setTpFieldWorkData(fw);
        auditCaseRepository.save(c);
    }

    @Transactional
    public void saveFactStatement(UUID caseId, JsonNode data, int version, String status, String userId) {
        ApAuditCaseEntity c = getCase(caseId);
        TpFieldWorkDataEntity fw = getOrCreate(c, userId);
        fw.setFactStatement(data);
        fw.setFactStatementVersion(version);
        fw.setFactStatementStatus(status);
        fw.setUpdatedBy(userId);
        c.setTpFieldWorkData(fw);
        auditCaseRepository.save(c);
    }

    @Transactional
    public void saveStructuredDiscussion(UUID caseId, JsonNode data, String userId) {
        ApAuditCaseEntity c = getCase(caseId);
        TpFieldWorkDataEntity fw = getOrCreate(c, userId);
        fw.setStructuredDiscussions(data);
        fw.setUpdatedBy(userId);
        c.setTpFieldWorkData(fw);
        auditCaseRepository.save(c);
    }

    @Transactional
    public void transitionToAnalysis(UUID caseId, String userId) {
        ApAuditCaseEntity c = getCase(caseId);
        if (c.getTpFieldWorkData() == null || c.getTpFieldWorkData().getFactStatement() == null) {
            throw new IllegalStateException("Fact Statement must be completed before transitioning to ANALYSIS");
        }
        c.getTpFieldWorkData().setStatus("COMPLETED");
        c.setTpCurrentPhase("ANALYSIS");
        auditCaseRepository.save(c);
    }

    private TpFieldWorkDataEntity getOrCreate(ApAuditCaseEntity c, String userId) {
        TpFieldWorkDataEntity fw = c.getTpFieldWorkData();
        if (fw == null) {
            fw = TpFieldWorkDataEntity.builder().auditCase(c).createdBy(userId).build();
        }
        return fw;
    }

    private ApAuditCaseEntity getCase(UUID caseId) {
        return auditCaseRepository.findById(caseId)
                .orElseThrow(() -> new IllegalArgumentException("Case not found: " + caseId));
    }
}
