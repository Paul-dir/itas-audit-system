package mor.itas.application.usecase.tp;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import mor.itas.persistence.jpa.entity.tp.TpFieldWorkDataEntity;
import mor.itas.persistence.jpa.repository.ap.ApAuditCaseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TpFieldWorkUseCaseTest {

    @Mock
    private ApAuditCaseRepository auditCaseRepository;

    @InjectMocks
    private TpFieldWorkUseCase fieldWorkUseCase;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private UUID caseId;
    private ApAuditCaseEntity auditCase;

    @BeforeEach
    void setUp() {
        caseId = UUID.randomUUID();
        auditCase = new ApAuditCaseEntity();
        auditCase.setId(caseId);
        auditCase.setCaseNumber("TP-2026-0088");
        auditCase.setTpCurrentPhase("FIELD_WORK");
    }

    @Test
    @DisplayName("Should successfully save field work accounting findings and document gathering logs")
    void shouldSaveAccountingAssessment() {
        when(auditCaseRepository.findById(caseId)).thenReturn(Optional.of(auditCase));

        ObjectNode findings = objectMapper.createObjectNode()
                .put("glAccount5400", "75,000,000 ETB Management Fees Vouched")
                .put("glAccount5410", "42,500,000 ETB Royalties Vouched");

        fieldWorkUseCase.saveAccountingAssessment(
                caseId,
                "ACCRUAL_ACCORDING_TO_DIR_43_2015",
                findings,
                "AUDITOR_007"
        );

        ArgumentCaptor<ApAuditCaseEntity> captor = ArgumentCaptor.forClass(ApAuditCaseEntity.class);
        verify(auditCaseRepository, times(1)).save(captor.capture());

        ApAuditCaseEntity savedCase = captor.getValue();
        assertThat(savedCase.getTpFieldWorkData()).isNotNull();
        TpFieldWorkDataEntity fw = savedCase.getTpFieldWorkData();
        assertThat(fw.getAccountingMethods()).isEqualTo("ACCRUAL_ACCORDING_TO_DIR_43_2015");
        assertThat(fw.getAccountingFindings().get("glAccount5400").asText()).contains("75,000,000");
    }

    @Test
    @DisplayName("Should successfully save versioned Fact Statement (Form TP-FR-04.4) and document register")
    void shouldSaveFactStatement() {
        when(auditCaseRepository.findById(caseId)).thenReturn(Optional.of(auditCase));

        ObjectNode factData = objectMapper.createObjectNode()
                .put("agreedFacts", "Routine manufacturing confirmed; zero local R&D")
                .put("disputedFacts", "80% management fees fail benefit test");

        fieldWorkUseCase.saveFactStatement(
                caseId,
                factData,
                1,
                "SUBMITTED_TO_TAXPAYER",
                "AUDITOR_007"
        );

        ArgumentCaptor<ApAuditCaseEntity> captor = ArgumentCaptor.forClass(ApAuditCaseEntity.class);
        verify(auditCaseRepository, times(1)).save(captor.capture());

        ApAuditCaseEntity savedCase = captor.getValue();
        TpFieldWorkDataEntity fw = savedCase.getTpFieldWorkData();
        assertThat(fw.getFactStatementVersion()).isEqualTo(1);
        assertThat(fw.getFactStatementStatus()).isEqualTo("SUBMITTED_TO_TAXPAYER");
        assertThat(fw.getFactStatement().get("agreedFacts").asText()).contains("Routine manufacturing");
    }

    @Test
    @DisplayName("Should transition case phase to ANALYSIS after Fact Statement completion")
    void shouldTransitionToAnalysis() {
        TpFieldWorkDataEntity fw = TpFieldWorkDataEntity.builder()
                .auditCase(auditCase)
                .factStatement(objectMapper.createObjectNode().put("status", "VALIDATED"))
                .build();
        auditCase.setTpFieldWorkData(fw);

        when(auditCaseRepository.findById(caseId)).thenReturn(Optional.of(auditCase));

        fieldWorkUseCase.transitionToAnalysis(caseId, "AUDITOR_007");

        ArgumentCaptor<ApAuditCaseEntity> captor = ArgumentCaptor.forClass(ApAuditCaseEntity.class);
        verify(auditCaseRepository, times(1)).save(captor.capture());

        ApAuditCaseEntity savedCase = captor.getValue();
        assertThat(savedCase.getTpCurrentPhase()).isEqualTo("ANALYSIS");
        assertThat(savedCase.getTpFieldWorkData().getStatus()).isEqualTo("COMPLETED");
    }

    @Test
    @DisplayName("Should throw Exception when attempting transition without Fact Statement")
    void shouldThrowWhenTransitioningWithoutFactStatement() {
        when(auditCaseRepository.findById(caseId)).thenReturn(Optional.of(auditCase));

        assertThatThrownBy(() -> fieldWorkUseCase.transitionToAnalysis(caseId, "AUDITOR_007"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Fact Statement must be completed");
    }
}
