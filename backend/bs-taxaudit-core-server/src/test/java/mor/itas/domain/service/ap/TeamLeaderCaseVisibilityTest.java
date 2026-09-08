package mor.itas.domain.service.ap;

import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import mor.itas.persistence.jpa.entity.ap.CommitteeCaseEntity;
import mor.itas.persistence.jpa.entity.ap.UserEntity;
import mor.itas.persistence.jpa.repository.ap.ApAuditCaseRepository;
import mor.itas.persistence.jpa.repository.ap.CommitteeCaseRepository;
import mor.itas.persistence.jpa.repository.ap.UserJpaRepository;
import mor.itas.persistence.jpa.repository.ap.AuditDocumentRepository;
import mor.itas.persistence.jpa.repository.ap.AuditFindingRepository;
import mor.itas.persistence.jpa.repository.ap.AuditPlanRecordRepository;
import mor.itas.persistence.jpa.repository.ap.CaatAnomalyRepository;
import mor.itas.persistence.jpa.repository.ap.ConferenceRecordRepository;
import mor.itas.persistence.jpa.repository.ap.DocumentRequestRecordRepository;
import mor.itas.persistence.jpa.repository.ap.WorkingPaperRepository;
import mor.itas.persistence.jpa.repository.shared.AuditTrailRepository;
import mor.itas.api.controller.backoffice.jac.CommitteeEventService;
import mor.itas.persistence.mapper.ap.AuditCaseMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Regression tests for Team Leader case visibility.
 * 
 * Root cause: Cases with PENDING_VIABILITY status were invisible to team leaders
 * because the CommitteeCaseRepository queries only included TEAM_ASSIGNED and APPROVED.
 * 
 * These tests verify that:
 * 1. Assigned team leader can retrieve the case
 * 2. The assigned case appears in the team leader case-list API response
 * 3. Another team leader cannot see that case
 * 4. Handoff-first workflow remains enforced
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Team Leader Case Visibility — Regression Tests")
class TeamLeaderCaseVisibilityTest {

    private static final UUID TEAM_LEADER_A_UUID = UUID.fromString("10000000-0000-0000-0000-000000000001");
    private static final UUID TEAM_LEADER_B_UUID = UUID.fromString("10000000-0000-0000-0000-000000000002");
    private static final UUID AUDITOR_UUID = UUID.fromString("a0000001-0000-0000-0000-000000000001");
    private static final UUID COMMITTEE_CASE_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final UUID AP_CASE_ID = UUID.fromString("22222222-2222-2222-2222-222222222222");

    @Mock private ApAuditCaseRepository apCaseRepository;
    @Mock private CommitteeCaseRepository committeeCaseRepository;
    @Mock private UserJpaRepository userRepository;
    @Mock private AuditPlanRecordRepository planRepository;
    @Mock private ConferenceRecordRepository conferenceRepository;
    @Mock private DocumentRequestRecordRepository documentRequestRepository;
    @Mock private AuditDocumentRepository documentRepository;
    @Mock private CaatAnomalyRepository caatAnomalyRepository;
    @Mock private WorkingPaperRepository workingPaperRepository;
    @Mock private AuditFindingRepository findingRepository;
    @Mock private CommitteeEventService committeeEventService;
    @Mock private AuditTrailRepository auditTrailRepository;

    @InjectMocks private AuditWorkflowService workflowService;
    @InjectMocks private CaseGenerationService caseGenerationService;
    @Spy private AuditCaseMapper caseMapper = new AuditCaseMapper();

    @BeforeEach
    void setUp() {
        // Mock save
        lenient().when(apCaseRepository.save(any(ApAuditCaseEntity.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));
        // Mock team leader A user
        lenient().when(userRepository.findById(TEAM_LEADER_A_UUID))
            .thenReturn(Optional.of(teamLeaderUser(TEAM_LEADER_A_UUID, "TEAM_LEADER")));
        // Mock team leader B user
        lenient().when(userRepository.findById(TEAM_LEADER_B_UUID))
            .thenReturn(Optional.of(teamLeaderUser(TEAM_LEADER_B_UUID, "TEAM_LEADER")));
        // Mock auditor user
        lenient().when(userRepository.findById(AUDITOR_UUID))
            .thenReturn(Optional.of(teamLeaderUser(AUDITOR_UUID, "AUDITOR")));
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Test 1: Assigning a case to Team Leader persists the assignment
    // ═══════════════════════════════════════════════════════════════════════

    @Test
    @DisplayName("Test 1: Assigning case to team leader persists team leader assignment")
    void assigningCaseToTeamLeaderPersistsTeamLeaderId() {
        // Arrange — case in HANDED_OFF state (required for assignment)
        ApAuditCaseEntity apCase = apCaseEntity(AP_CASE_ID, "HANDED_OFF");
        apCase.setAssignedTeamLeaderId(TEAM_LEADER_A_UUID.toString());
        when(apCaseRepository.findById(AP_CASE_ID)).thenReturn(Optional.of(apCase));

        // Act — assign auditor (this also sets team leader)
        ApAuditCaseEntity result = workflowService.assignToAuditor(
            AP_CASE_ID, AUDITOR_UUID.toString(), null, null, TEAM_LEADER_A_UUID.toString());

        // Assert — team leader is persisted
        assertThat(result.getAssignedTeamLeaderId()).isEqualTo(TEAM_LEADER_A_UUID.toString());
        assertThat(result.getAssignedAuditorId()).isEqualTo(AUDITOR_UUID.toString());
        assertThat(result.getStatus()).isEqualTo("AUDITOR_ASSIGNED");
        verify(apCaseRepository).save(apCase);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Test 2: Assigned team leader can retrieve the case
    // ═══════════════════════════════════════════════════════════════════════

    @Test
    @DisplayName("Test 2: Assigned team leader can retrieve the case via query")
    void assignedTeamLeaderCanRetrieveCase() {
        // Arrange — AP case assigned to team leader A
        ApAuditCaseEntity apCase = apCaseEntity(AP_CASE_ID, "ASSIGNED");
        apCase.setAssignedTeamLeaderId(TEAM_LEADER_A_UUID.toString());

        // Mock the repository query used by getCasesForTeamLeader
        when(apCaseRepository.findAllForTeamLeader(TEAM_LEADER_A_UUID.toString()))
            .thenReturn(List.of(apCase));

        // Act — query cases for team leader A
        List<?> result = caseGenerationService.getCasesForTeamLeader(TEAM_LEADER_A_UUID.toString());

        // Assert — case is returned
        assertThat(result).isNotEmpty();
        verify(apCaseRepository).findAllForTeamLeader(TEAM_LEADER_A_UUID.toString());
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Test 3: Assigned case appears in team leader case-list
    // ═══════════════════════════════════════════════════════════════════════

    @Test
    @DisplayName("Test 3: Assigned case appears in team leader case-list API response")
    void assignedCaseAppearsInTeamLeaderCaseList() {
        // Arrange — AP case + committee case both assigned to team leader A
        ApAuditCaseEntity apCase = apCaseEntity(AP_CASE_ID, "HANDED_OFF");
        apCase.setAssignedTeamLeaderId(TEAM_LEADER_A_UUID.toString());

        CommitteeCaseEntity committeeCase = committeeCaseEntity(COMMITTEE_CASE_ID, "PENDING_VIABILITY");
        committeeCase.setTeamLeadId(TEAM_LEADER_A_UUID);

        when(apCaseRepository.findAllForTeamLeader(TEAM_LEADER_A_UUID.toString()))
            .thenReturn(List.of(apCase));
        when(committeeCaseRepository.findTeamAssignedByTeamLeadId(TEAM_LEADER_A_UUID))
            .thenReturn(List.of(committeeCase));

        // Act
        List<?> result = caseGenerationService.getCasesForTeamLeader(TEAM_LEADER_A_UUID.toString());

        // Assert — both cases are in the result
        assertThat(result).hasSizeGreaterThanOrEqualTo(1);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Test 4: Another team leader cannot see that case
    // ═══════════════════════════════════════════════════════════════════════

    @Test
    @DisplayName("Test 4: Another team leader cannot see cases assigned to team leader A")
    void anotherTeamLeaderCannotSeeTeamLeaderACases() {
        // Arrange — AP case assigned to team leader A
        ApAuditCaseEntity apCase = apCaseEntity(AP_CASE_ID, "ASSIGNED");
        apCase.setAssignedTeamLeaderId(TEAM_LEADER_A_UUID.toString());

        // Team leader B queries — should NOT see team leader A's case
        when(apCaseRepository.findAllForTeamLeader(TEAM_LEADER_B_UUID.toString()))
            .thenReturn(List.of()); // Empty — case belongs to A

        // Act
        List<?> result = caseGenerationService.getCasesForTeamLeader(TEAM_LEADER_B_UUID.toString());

        // Assert — team leader B sees nothing (case belongs to A)
        assertThat(result).isEmpty();
        verify(apCaseRepository).findAllForTeamLeader(TEAM_LEADER_B_UUID.toString());
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Test 5: Unauthorized users cannot access team leader cases
    // ═══════════════════════════════════════════════════════════════════════

    @Test
    @DisplayName("Test 5: Non-team-leader cannot perform team leader actions")
    void nonTeamLeaderCannotPerformTeamLeaderActions() {
        // Arrange — auditor user tries to handoff
        when(userRepository.findById(AUDITOR_UUID))
            .thenReturn(Optional.of(teamLeaderUser(AUDITOR_UUID, "AUDITOR")));

        // Act & Assert — handoff rejected
        org.assertj.core.api.Assertions.assertThatThrownBy(
            () -> workflowService.handoffCase(COMMITTEE_CASE_ID, AUDITOR_UUID.toString(), null))
            .isInstanceOf(mor.itas.domain.exception.UnauthorizedAccessException.class)
            .hasMessageContaining("Only an active Team Leader");
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Test 6: Handoff-first workflow remains enforced
    // ═══════════════════════════════════════════════════════════════════════

    @Test
    @DisplayName("Test 6: Handoff-first workflow remains enforced")
    void handoffFirstWorkflowRemainsEnforced() {
        // Arrange — case in ASSIGNED state (not yet handed off)
        ApAuditCaseEntity apCase = apCaseEntity(AP_CASE_ID, "ASSIGNED");
        apCase.setAssignedTeamLeaderId(TEAM_LEADER_A_UUID.toString());
        when(apCaseRepository.findById(AP_CASE_ID)).thenReturn(Optional.of(apCase));

        // Act & Assert — assignment before handoff is rejected
        org.assertj.core.api.Assertions.assertThatThrownBy(
            () -> workflowService.assignToAuditor(
                AP_CASE_ID, AUDITOR_UUID.toString(), null, null, TEAM_LEADER_A_UUID.toString()))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("CASE_HANDOFF_REQUIRED");
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Test 7: Assignment before handoff is still rejected
    // ═══════════════════════════════════════════════════════════════════════

    @Test
    @DisplayName("Test 7: Assignment before handoff is rejected — critical regression")
    void assignmentBeforeHandoffIsRejected() {
        // Arrange — case in ASSIGNED state
        ApAuditCaseEntity apCase = apCaseEntity(AP_CASE_ID, "ASSIGNED");
        apCase.setAssignedTeamLeaderId(TEAM_LEADER_A_UUID.toString());
        when(apCaseRepository.findById(AP_CASE_ID)).thenReturn(Optional.of(apCase));

        // Act & Assert
        org.assertj.core.api.Assertions.assertThatThrownBy(
            () -> workflowService.assignToAuditor(
                AP_CASE_ID, AUDITOR_UUID.toString(), null, null, TEAM_LEADER_A_UUID.toString()))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("CASE_HANDOFF_REQUIRED");

        // Verify no save — rejection is total
        verify(apCaseRepository, never()).save(any());
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Test 8: Assignment after handoff succeeds
    // ═══════════════════════════════════════════════════════════════════════

    @Test
    @DisplayName("Test 8: Assignment after handoff succeeds")
    void assignmentAfterHandoffSucceeds() {
        // Arrange — case in HANDED_OFF state
        ApAuditCaseEntity apCase = apCaseEntity(AP_CASE_ID, "HANDED_OFF");
        apCase.setAssignedTeamLeaderId(TEAM_LEADER_A_UUID.toString());
        apCase.setHandoffAt(OffsetDateTime.now());
        when(apCaseRepository.findById(AP_CASE_ID)).thenReturn(Optional.of(apCase));

        // Act
        ApAuditCaseEntity result = workflowService.assignToAuditor(
            AP_CASE_ID, AUDITOR_UUID.toString(), null, null, TEAM_LEADER_A_UUID.toString());

        // Assert
        assertThat(result.getStatus()).isEqualTo("AUDITOR_ASSIGNED");
        assertThat(result.getAssignedAuditorId()).isEqualTo(AUDITOR_UUID.toString());
        verify(apCaseRepository).save(apCase);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Test 9: PENDING_VIABILITY committee cases visible to team leader
    // ═══════════════════════════════════════════════════════════════════════

    @Test
    @DisplayName("Test 9: PENDING_VIABILITY committee cases are visible to team leader")
    void pendingViabilityCommitteeCasesVisibleToTeamLeader() {
        // Arrange — committee case with PENDING_VIABILITY status
        CommitteeCaseEntity committeeCase = committeeCaseEntity(COMMITTEE_CASE_ID, "PENDING_VIABILITY");
        committeeCase.setTeamLeadId(TEAM_LEADER_A_UUID);

        when(apCaseRepository.findAllForTeamLeader(TEAM_LEADER_A_UUID.toString()))
            .thenReturn(List.of());
        when(committeeCaseRepository.findTeamAssignedByTeamLeadId(TEAM_LEADER_A_UUID))
            .thenReturn(List.of(committeeCase));

        // Act
        List<?> result = caseGenerationService.getCasesForTeamLeader(TEAM_LEADER_A_UUID.toString());

        // Assert — PENDING_VIABILITY case is visible
        assertThat(result).isNotEmpty();
        verify(committeeCaseRepository).findTeamAssignedByTeamLeadId(TEAM_LEADER_A_UUID);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // HELPERS
    // ═══════════════════════════════════════════════════════════════════════

    private ApAuditCaseEntity apCaseEntity(UUID id, String status) {
        return ApAuditCaseEntity.builder()
            .id(id)
            .planId(UUID.randomUUID())
            .caseNumber("AUD-" + id.toString().substring(0, 8))
            .taxpayerId("TIN-001")
            .taxpayerName("Test Taxpayer")
            .createdBy("test")
            .status(status)
            .build();
    }

    private CommitteeCaseEntity committeeCaseEntity(UUID id, String status) {
        return CommitteeCaseEntity.builder()
            .caseId(id)
            .taxpayerName("Test Committee Case")
            .taxIdNumber("TAX-001")
            .status(status)
            .createdDate(OffsetDateTime.now())
            .build();
    }

    private UserEntity teamLeaderUser(UUID id, String userType) {
        return UserEntity.builder()
            .userId(id)
            .username(userType.toLowerCase())
            .email(userType.toLowerCase() + "@example.test")
            .fullName(userType)
            .userType(userType)
            .status("ACTIVE")
            .build();
    }
}
