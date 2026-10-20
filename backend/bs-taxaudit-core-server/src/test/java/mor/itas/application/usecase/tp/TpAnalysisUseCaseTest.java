package mor.itas.application.usecase.tp;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import mor.itas.persistence.jpa.entity.tp.TpAnalysisDataEntity;
import mor.itas.persistence.jpa.repository.ap.ApAuditCaseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TpAnalysisUseCaseTest {

    @Mock
    private ApAuditCaseRepository auditCaseRepository;

    @InjectMocks
    private TpAnalysisUseCase tpAnalysisUseCase;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private UUID caseId;
    private ApAuditCaseEntity auditCase;
    private String testUser;

    @BeforeEach
    void setUp() {
        caseId = UUID.randomUUID();
        testUser = "USR-AUDITOR-01";

        auditCase = new ApAuditCaseEntity();
        auditCase.setId(caseId);
        auditCase.setCaseNumber("TP-2026-8801");
        auditCase.setTpCurrentPhase("ANALYSIS");
    }

    @Test
    @DisplayName("Should save TP method selection and rationale detail")
    void shouldSaveTpMethodSelection() {
        when(auditCaseRepository.findById(caseId)).thenReturn(Optional.of(auditCase));

        ObjectNode detail = objectMapper.createObjectNode();
        detail.put("method", "TNMM");
        detail.put("pli", "Operating Margin (EBIT / Net Turnover)");
        detail.put("testedParty", "Ethiopian Subsidiary (Addis Plant)");

        tpAnalysisUseCase.saveTpMethodSelection(caseId, "TNMM", detail, testUser);

        ArgumentCaptor<ApAuditCaseEntity> captor = ArgumentCaptor.forClass(ApAuditCaseEntity.class);
        verify(auditCaseRepository, times(1)).save(captor.capture());

        ApAuditCaseEntity savedCase = captor.getValue();
        TpAnalysisDataEntity analysis = savedCase.getTpAnalysisData();
        assertThat(analysis).isNotNull();
        assertThat(analysis.getSelectedTpMethod()).isEqualTo("TNMM");
        assertThat(analysis.getMethodSelection().get("pli").asText()).isEqualTo("Operating Margin (EBIT / Net Turnover)");
    }

    @Test
    @DisplayName("Should save arm's length statistical interquartile range (IQR) analysis and total tax adjustment")
    void shouldSaveArmsLengthAnalysis() {
        when(auditCaseRepository.findById(caseId)).thenReturn(Optional.of(auditCase));

        ObjectNode detail = objectMapper.createObjectNode();
        detail.put("comparablesCount", 14);
        detail.put("iqrMedian", 6.80);
        detail.put("multiYearTotal", 185000000);

        tpAnalysisUseCase.saveArmsLengthAnalysis(
                caseId,
                detail,
                new BigDecimal("4.10"),
                new BigDecimal("9.45"),
                new BigDecimal("1.90"),
                new BigDecimal("185000000.00"),
                new BigDecimal("4.90"),
                testUser
        );

        ArgumentCaptor<ApAuditCaseEntity> captor = ArgumentCaptor.forClass(ApAuditCaseEntity.class);
        verify(auditCaseRepository).save(captor.capture());

        TpAnalysisDataEntity analysis = captor.getValue().getTpAnalysisData();
        assertThat(analysis.getArmsLengthRangeMin()).isEqualByComparingTo("4.10");
        assertThat(analysis.getArmsLengthRangeMax()).isEqualByComparingTo("9.45");
        assertThat(analysis.getTaxpayerActualResult()).isEqualByComparingTo("1.90");
        assertThat(analysis.getVarianceAmount()).isEqualByComparingTo("185000000.00");
    }

    @Test
    @DisplayName("Should transition audit case phase from ANALYSIS to REPORT upon completion")
    void shouldTransitionToReportPhase() {
        TpAnalysisDataEntity existingAnalysis = new TpAnalysisDataEntity();
        existingAnalysis.setAuditCase(auditCase);
        existingAnalysis.setSelectedTpMethod("TNMM");
        existingAnalysis.setStatus("IN_PROGRESS");
        auditCase.setTpAnalysisData(existingAnalysis);

        when(auditCaseRepository.findById(caseId)).thenReturn(Optional.of(auditCase));

        tpAnalysisUseCase.transitionToReport(caseId, testUser);

        ArgumentCaptor<ApAuditCaseEntity> captor = ArgumentCaptor.forClass(ApAuditCaseEntity.class);
        verify(auditCaseRepository).save(captor.capture());

        ApAuditCaseEntity savedCase = captor.getValue();
        assertThat(savedCase.getTpCurrentPhase()).isEqualTo("REPORT");
        assertThat(savedCase.getTpAnalysisData().getStatus()).isEqualTo("COMPLETED");
    }

    @Test
    @DisplayName("Should throw IllegalStateException if transitioning to REPORT without method selection")
    void shouldFailTransitionIfMethodNotSelected() {
        when(auditCaseRepository.findById(caseId)).thenReturn(Optional.of(auditCase));

        assertThatThrownBy(() -> tpAnalysisUseCase.transitionToReport(caseId, testUser))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("TP Method Selection must be complete");
    }
}
