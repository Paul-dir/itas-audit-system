package mor.itas.application.usecase.tp;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import mor.itas.persistence.jpa.entity.tp.TpWorkingHypothesisEntity;
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
class TpWorkingHypothesisUseCaseTest {

    @Mock
    private ApAuditCaseRepository auditCaseRepository;

    @InjectMocks
    private TpWorkingHypothesisUseCase workingHypothesisUseCase;

    private UUID caseId;
    private ObjectNode calculationDetails;

    @BeforeEach
    void setUp() {
        caseId = UUID.randomUUID();
        ObjectMapper objectMapper = new ObjectMapper();
        calculationDetails = objectMapper.createObjectNode();
        calculationDetails.put("subPageCompleted", 5);
        calculationDetails.put("auditScope", "FY 2020 - FY 2024");
    }

    @Test
    @DisplayName("Should create new working hypothesis when case exists without existing hypothesis")
    void saveWorkingHypothesis_NewHypothesis() {
        ApAuditCaseEntity auditCase = new ApAuditCaseEntity(UUID.randomUUID(), "TP-2026-001", "ETH001", "TRANSFER_PRICING", 100, "AUDITOR-001");
        auditCase.setId(caseId);

        when(auditCaseRepository.findById(caseId)).thenReturn(Optional.of(auditCase));

        workingHypothesisUseCase.saveWorkingHypothesis(
                caseId,
                "Taxpayer shifted profit to offshore management entity",
                "Management Fees Erosion",
                "Substance mismatch under OECD guidelines",
                new BigDecimal("59397000.00"),
                calculationDetails,
                "AUDITOR-001"
        );

        ArgumentCaptor<ApAuditCaseEntity> captor = ArgumentCaptor.forClass(ApAuditCaseEntity.class);
        verify(auditCaseRepository).save(captor.capture());

        ApAuditCaseEntity savedCase = captor.getValue();
        assertThat(savedCase).isNotNull();
        assertThat(savedCase.getTpWorkingHypothesis()).isNotNull();
        
        TpWorkingHypothesisEntity hypothesis = savedCase.getTpWorkingHypothesis();
        assertThat(hypothesis.getHypothesisDescription()).isEqualTo("Taxpayer shifted profit to offshore management entity");
        assertThat(hypothesis.getIdentifiedIssue()).isEqualTo("Management Fees Erosion");
        assertThat(hypothesis.getEconomicRationale()).isEqualTo("Substance mismatch under OECD guidelines");
        assertThat(hypothesis.getRevenueAtRisk()).isEqualByComparingTo("59397000.00");
        assertThat(hypothesis.getStatus()).isEqualTo("DRAFT");
        assertThat(hypothesis.getCreatedBy()).isEqualTo("AUDITOR-001");
        assertThat(hypothesis.getUpdatedBy()).isEqualTo("AUDITOR-001");
    }

    @Test
    @DisplayName("Should update existing working hypothesis when present")
    void saveWorkingHypothesis_ExistingHypothesis() {
        TpWorkingHypothesisEntity existingHypothesis = TpWorkingHypothesisEntity.builder()
                .status("DRAFT")
                .createdBy("AUDITOR-001")
                .hypothesisDescription("Old Description")
                .build();

        ApAuditCaseEntity auditCase = new ApAuditCaseEntity(UUID.randomUUID(), "TP-2026-001", "ETH001", "TRANSFER_PRICING", 100, "AUDITOR-001");
        auditCase.setId(caseId);
        auditCase.setTpWorkingHypothesis(existingHypothesis);

        when(auditCaseRepository.findById(caseId)).thenReturn(Optional.of(auditCase));

        workingHypothesisUseCase.saveWorkingHypothesis(
                caseId,
                "Updated Working Hypothesis Description",
                "Updated Issue",
                "Updated Rationale",
                new BigDecimal("75000000.00"),
                calculationDetails,
                "AUDITOR-002"
        );

        ArgumentCaptor<ApAuditCaseEntity> captor = ArgumentCaptor.forClass(ApAuditCaseEntity.class);
        verify(auditCaseRepository).save(captor.capture());

        TpWorkingHypothesisEntity updated = captor.getValue().getTpWorkingHypothesis();
        assertThat(updated.getHypothesisDescription()).isEqualTo("Updated Working Hypothesis Description");
        assertThat(updated.getIdentifiedIssue()).isEqualTo("Updated Issue");
        assertThat(updated.getEconomicRationale()).isEqualTo("Updated Rationale");
        assertThat(updated.getRevenueAtRisk()).isEqualByComparingTo("75000000.00");
        assertThat(updated.getUpdatedBy()).isEqualTo("AUDITOR-002");
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when audit case does not exist")
    void saveWorkingHypothesis_CaseNotFound() {
        when(auditCaseRepository.findById(caseId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> workingHypothesisUseCase.saveWorkingHypothesis(
                caseId,
                "Desc",
                "Issue",
                "Rationale",
                BigDecimal.TEN,
                calculationDetails,
                "AUDITOR-001"
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Case not found");

        verify(auditCaseRepository, never()).save(any());
    }
}
