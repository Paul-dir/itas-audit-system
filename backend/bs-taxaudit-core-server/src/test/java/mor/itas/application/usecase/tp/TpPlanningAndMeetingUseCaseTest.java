package mor.itas.application.usecase.tp;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import mor.itas.persistence.jpa.entity.tp.TpAuditPlanEntity;
import mor.itas.persistence.jpa.entity.tp.TpPlanningMeetingEntity;
import mor.itas.persistence.jpa.repository.ap.ApAuditCaseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TpPlanningAndMeetingUseCaseTest {

    @Mock
    private ApAuditCaseRepository auditCaseRepository;

    @InjectMocks
    private TpAuditPlanUseCase auditPlanUseCase;

    @InjectMocks
    private TpPlanningMeetingUseCase planningMeetingUseCase;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private UUID caseId;
    private ApAuditCaseEntity auditCase;

    @BeforeEach
    void setUp() {
        caseId = UUID.randomUUID();
        auditCase = new ApAuditCaseEntity();
        auditCase.setId(caseId);
        auditCase.setCaseNumber("TP-2026-0088");
        auditCase.setTpCurrentPhase("PLANNING");
    }

    @Test
    @DisplayName("Should successfully create and save a new TP Audit Plan (Form FR-04.5.1)")
    void shouldSaveNewAuditPlan() {
        when(auditCaseRepository.findById(caseId)).thenReturn(Optional.of(auditCase));

        ObjectNode materiality = objectMapper.createObjectNode().put("materialityFloor", 5000000);
        ObjectNode research = objectMapper.createObjectNode().put("sector", "Textile Manufacturing");
        ObjectNode sampling = objectMapper.createObjectNode().put("method", "STRATIFIED").put("budgetHours", 480);
        ObjectNode procedures = objectMapper.createObjectNode().put("subPageCompleted", 5);

        auditPlanUseCase.saveAuditPlan(
                caseId,
                "Verify arm's length intercompany pricing under Directive No. 43/2015",
                "FY 2020 - FY 2024",
                materiality,
                research,
                sampling,
                procedures,
                "AUDITOR_007"
        );

        ArgumentCaptor<ApAuditCaseEntity> captor = ArgumentCaptor.forClass(ApAuditCaseEntity.class);
        verify(auditCaseRepository, times(1)).save(captor.capture());

        ApAuditCaseEntity savedCase = captor.getValue();
        assertThat(savedCase.getTpCurrentPhase()).isEqualTo("PLANNING");
        assertThat(savedCase.getTpAuditPlan()).isNotNull();

        TpAuditPlanEntity plan = savedCase.getTpAuditPlan();
        assertThat(plan.getObjective()).contains("arm's length");
        assertThat(plan.getScope()).isEqualTo("FY 2020 - FY 2024");
        assertThat(plan.getStatus()).isEqualTo("DRAFT");
        assertThat(plan.getCreatedBy()).isEqualTo("AUDITOR_007");
    }

    @Test
    @DisplayName("Should approve TP Audit Plan and update case phase to PLANNING_APPROVAL")
    void shouldApproveAuditPlan() {
        TpAuditPlanEntity existingPlan = TpAuditPlanEntity.builder()
                .auditCase(auditCase)
                .status("DRAFT")
                .createdBy("AUDITOR_007")
                .build();
        auditCase.setTpAuditPlan(existingPlan);

        when(auditCaseRepository.findById(caseId)).thenReturn(Optional.of(auditCase));

        auditPlanUseCase.approveAuditPlan(caseId, "Approved by Audit Committee", "CHAIR_ABEBE");

        ArgumentCaptor<ApAuditCaseEntity> captor = ArgumentCaptor.forClass(ApAuditCaseEntity.class);
        verify(auditCaseRepository, times(1)).save(captor.capture());

        ApAuditCaseEntity savedCase = captor.getValue();
        assertThat(savedCase.getTpCurrentPhase()).isEqualTo("PLANNING_APPROVAL");
        assertThat(savedCase.getTpAuditPlan().getStatus()).isEqualTo("APPROVED");
        assertThat(savedCase.getTpAuditPlan().getApprovedBy()).isEqualTo("CHAIR_ABEBE");
    }

    @Test
    @DisplayName("Should record Entry Conference meeting details and participants")
    void shouldRecordMeetingDetails() {
        when(auditCaseRepository.findById(caseId)).thenReturn(Optional.of(auditCase));

        OffsetDateTime scheduledDate = OffsetDateTime.now().plusDays(7);
        ObjectNode participants = objectMapper.createObjectNode()
                .put("taxpayer", "CFO & Tax Counsel")
                .put("committee", "Chair & Lead Senior Auditor");

        planningMeetingUseCase.recordMeetingDetails(
                caseId,
                scheduledDate,
                participants,
                "Review audit scope and issue IDR-01 document request",
                "AUDITOR_007"
        );

        ArgumentCaptor<ApAuditCaseEntity> captor = ArgumentCaptor.forClass(ApAuditCaseEntity.class);
        verify(auditCaseRepository, times(1)).save(captor.capture());

        ApAuditCaseEntity savedCase = captor.getValue();
        assertThat(savedCase.getTpPlanningMeeting()).isNotNull();
        TpPlanningMeetingEntity meeting = savedCase.getTpPlanningMeeting();
        assertThat(meeting.getScheduledDate()).isEqualTo(scheduledDate);
        assertThat(meeting.getAgenda()).contains("IDR-01");
    }

    @Test
    @DisplayName("Should record meeting decision APPROVED and transition case phase to FIELD_WORK")
    void shouldRecordMeetingDecisionAndTransitionToFieldwork() {
        TpPlanningMeetingEntity meeting = TpPlanningMeetingEntity.builder()
                .auditCase(auditCase)
                .recordedBy("AUDITOR_007")
                .build();
        auditCase.setTpPlanningMeeting(meeting);

        when(auditCaseRepository.findById(caseId)).thenReturn(Optional.of(auditCase));

        planningMeetingUseCase.recordMeetingDecision(
                caseId,
                "APPROVED",
                "Taxpayer agreed to Entry Conference terms and IDR-01 timeline.",
                "CHAIR_ABEBE"
        );

        ArgumentCaptor<ApAuditCaseEntity> captor = ArgumentCaptor.forClass(ApAuditCaseEntity.class);
        verify(auditCaseRepository, times(1)).save(captor.capture());

        ApAuditCaseEntity savedCase = captor.getValue();
        assertThat(savedCase.getTpCurrentPhase()).isEqualTo("FIELD_WORK");
        assertThat(savedCase.getTpPlanningMeeting().getDecision()).isEqualTo("APPROVED");
    }

    @Test
    @DisplayName("Should throw Exception when recording decision on non-existent case")
    void shouldThrowWhenCaseNotFound() {
        when(auditCaseRepository.findById(caseId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> planningMeetingUseCase.recordMeetingDecision(caseId, "APPROVED", "Notes", "USER"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Case not found");
    }
}
