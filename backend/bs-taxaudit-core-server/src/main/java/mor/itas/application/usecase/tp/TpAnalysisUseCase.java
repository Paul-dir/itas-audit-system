package mor.itas.application.usecase.tp;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import mor.itas.persistence.jpa.entity.tp.TpAnalysisDataEntity;
import mor.itas.persistence.jpa.repository.ap.ApAuditCaseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service @RequiredArgsConstructor @Slf4j
public class TpAnalysisUseCase {

    private final ApAuditCaseRepository auditCaseRepository;

    @Transactional
    public void saveRatioAnalysis(UUID caseId, JsonNode data, String userId) {
        ApAuditCaseEntity c = getCase(caseId);
        TpAnalysisDataEntity a = getOrCreate(c, userId);
        a.setRatioAnalyses(data); a.setUpdatedBy(userId);
        c.setTpAnalysisData(a); auditCaseRepository.save(c);
    }

    @Transactional
    public void saveCostExpenseSelections(UUID caseId, JsonNode data, String userId) {
        ApAuditCaseEntity c = getCase(caseId);
        TpAnalysisDataEntity a = getOrCreate(c, userId);
        a.setCostExpenseSelections(data); a.setUpdatedBy(userId);
        c.setTpAnalysisData(a); auditCaseRepository.save(c);
    }

    @Transactional
    public void saveBenchmarkComparisons(UUID caseId, JsonNode data, String userId) {
        ApAuditCaseEntity c = getCase(caseId);
        TpAnalysisDataEntity a = getOrCreate(c, userId);
        a.setBenchmarkComparisons(data); a.setUpdatedBy(userId);
        c.setTpAnalysisData(a); auditCaseRepository.save(c);
    }

    @Transactional
    public void saveCrossBorderAssessments(UUID caseId, JsonNode data, String userId) {
        ApAuditCaseEntity c = getCase(caseId);
        TpAnalysisDataEntity a = getOrCreate(c, userId);
        a.setCrossBorderAssessments(data); a.setUpdatedBy(userId);
        c.setTpAnalysisData(a); auditCaseRepository.save(c);
    }

    @Transactional
    public void saveCustomsValuationMatches(UUID caseId, JsonNode data, String userId) {
        ApAuditCaseEntity c = getCase(caseId);
        TpAnalysisDataEntity a = getOrCreate(c, userId);
        a.setCustomsValuationMatches(data); a.setUpdatedBy(userId);
        c.setTpAnalysisData(a); auditCaseRepository.save(c);
    }

    @Transactional
    public void saveTpMethodSelection(UUID caseId, String method, JsonNode detail, String userId) {
        ApAuditCaseEntity c = getCase(caseId);
        TpAnalysisDataEntity a = getOrCreate(c, userId);
        a.setSelectedTpMethod(method); a.setMethodSelection(detail); a.setUpdatedBy(userId);
        c.setTpAnalysisData(a); auditCaseRepository.save(c);
    }

    @Transactional
    public void saveArmsLengthAnalysis(UUID caseId, JsonNode detail, BigDecimal rangeMin,
            BigDecimal rangeMax, BigDecimal taxpayerResult,
            BigDecimal varianceAmount, BigDecimal variancePct, String userId) {
        ApAuditCaseEntity c = getCase(caseId);
        TpAnalysisDataEntity a = getOrCreate(c, userId);
        a.setArmsLengthAnalysis(detail);
        a.setArmsLengthRangeMin(rangeMin); a.setArmsLengthRangeMax(rangeMax);
        a.setTaxpayerActualResult(taxpayerResult);
        a.setVarianceAmount(varianceAmount); a.setVariancePercentage(variancePct);
        a.setUpdatedBy(userId);
        c.setTpAnalysisData(a); auditCaseRepository.save(c);
    }

    @Transactional
    public void transitionToReport(UUID caseId, String userId) {
        ApAuditCaseEntity c = getCase(caseId);
        if (c.getTpAnalysisData() == null || c.getTpAnalysisData().getSelectedTpMethod() == null) {
            throw new IllegalStateException("TP Method Selection must be complete before REPORT phase");
        }
        c.getTpAnalysisData().setStatus("COMPLETED");
        c.setTpCurrentPhase("REPORT");
        auditCaseRepository.save(c);
    }

    private TpAnalysisDataEntity getOrCreate(ApAuditCaseEntity c, String userId) {
        TpAnalysisDataEntity a = c.getTpAnalysisData();
        if (a == null) a = TpAnalysisDataEntity.builder().auditCase(c).createdBy(userId).build();
        return a;
    }

    private ApAuditCaseEntity getCase(UUID caseId) {
        return auditCaseRepository.findById(caseId)
                .orElseThrow(() -> new IllegalArgumentException("Case not found: " + caseId));
    }
}
