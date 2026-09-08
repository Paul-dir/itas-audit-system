package mor.itas.application.usecase.ap;

import mor.itas.api.dto.request.ap.jac.AppointTeamLeadRequest;
import mor.itas.api.dto.response.ap.jac.TeamAssignmentResponse;
import mor.itas.api.mapper.ap.CommitteeCaseJacMapper;
import mor.itas.domain.service.ap.AuditTrailService;
import mor.itas.persistence.jpa.entity.ap.CommitteeCaseEntity;
import mor.itas.persistence.jpa.repository.ap.CommitteeCaseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit test for AppointTeamLeadUseCase — verifies string-to-UUID conversion logic.
 *
 * Before the fix, the DTO's auditorId was UUID type, which caused Spring to reject
 * non-UUID strings (like seed-data IDs "u-tl-aa1c") with a 400 error.
 *
 * After the fix, auditorId is String, and the use case converts it to UUID:
 *   - Valid UUID strings → parsed directly
 *   - Non-UUID strings → deterministic UUID via UUID.nameUUIDFromBytes()
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AppointTeamLeadUseCase — String ID Conversion Unit Tests")
class AppointTeamLeadUseCaseTest {

    @Mock
    private CommitteeCaseRepository caseRepository;

    @Mock
    private AuditTrailService auditTrailService;

    @InjectMocks
    private AppointTeamLeadUseCase useCase;

    private CommitteeCaseEntity testCase;

    @BeforeEach
    void setUp() {
        testCase = CommitteeCaseEntity.builder()
            .caseId(UUID.randomUUID())
            .originalCaseId(UUID.randomUUID())
            .taxpayerId(UUID.randomUUID())
            .taxpayerName("Test Taxpayer")
            .taxIdNumber("TAX12345")
            .riskScore(75)
            .riskPriority("High")
            .status("TEAM_ASSIGNED")
            .createdDate(java.time.OffsetDateTime.now())
            .committeeDeadline(java.time.OffsetDateTime.now().plusDays(7))
            .createdBy(UUID.randomUUID())
            .build();
    }

    // ── toUUID conversion tests ─────────────────────────────────────────

    @Nested
    @DisplayName("String-to-UUID conversion")
    class StringToUuidConversion {

        @Test
        @DisplayName("Valid UUID string is parsed directly")
        void toUUID_validUuidString_parsedDirectly() throws Exception {
            // Arrange
            String uuidString = "a0000001-0000-0000-0000-000000000001";
            when(caseRepository.findById(any(UUID.class))).thenReturn(Optional.of(testCase));

            AppointTeamLeadRequest request = new AppointTeamLeadRequest(uuidString, "Senior auditor");

            // Act
            TeamAssignmentResponse response = useCase.execute(testCase.getCaseId(), request);

            // Assert — the use case should have saved the case with the UUID
            verify(caseRepository).save(testCase);
            assertThat(testCase.getChairpersonId()).isEqualTo(UUID.fromString(uuidString));
        }

        @Test
        @DisplayName("Seed-data string ID is converted to deterministic UUID")
        void toUUID_seedDataId_convertedToDeterministicUuid() throws Exception {
            // Arrange — this is the exact bug scenario
            String seedId = "u-tl-aa1c";
            UUID expectedUuid = UUID.nameUUIDFromBytes(seedId.getBytes());

            when(caseRepository.findById(any(UUID.class))).thenReturn(Optional.of(testCase));

            AppointTeamLeadRequest request = new AppointTeamLeadRequest(seedId, "Appointed by chairperson");

            // Act
            TeamAssignmentResponse response = useCase.execute(testCase.getCaseId(), request);

            // Assert — seed ID converted to deterministic UUID
            verify(caseRepository).save(testCase);
            assertThat(testCase.getChairpersonId()).isEqualTo(expectedUuid);
        }

        @Test
        @DisplayName("Different seed IDs produce different UUIDs")
        void toUUID_differentSeedIds_produceDifferentUuids() {
            String id1 = "u-tl-aa1a";
            String id2 = "u-tl-aa1c";

            UUID uuid1 = UUID.nameUUIDFromBytes(id1.getBytes());
            UUID uuid2 = UUID.nameUUIDFromBytes(id2.getBytes());

            assertThat(uuid1).isNotEqualTo(uuid2);
        }

        @Test
        @DisplayName("Same seed ID always produces the same UUID (deterministic)")
        void toUUID_sameSeedId_alwaysProducesSameUuid() {
            String seedId = "u-tl-aa1c";

            UUID first = UUID.nameUUIDFromBytes(seedId.getBytes());
            UUID second = UUID.nameUUIDFromBytes(seedId.getBytes());

            assertThat(first).isEqualTo(second);
        }

        @Test
        @DisplayName("Hyphenated string ID is converted to deterministic UUID")
        void toUUID_hyphenatedStringId_convertedToUuid() throws Exception {
            String externalId = "AUD-2024-AA-001";
            UUID expectedUuid = UUID.nameUUIDFromBytes(externalId.getBytes());

            when(caseRepository.findById(any(UUID.class))).thenReturn(Optional.of(testCase));

            AppointTeamLeadRequest request = new AppointTeamLeadRequest(externalId, "External auditor");

            useCase.execute(testCase.getCaseId(), request);

            assertThat(testCase.getChairpersonId()).isEqualTo(expectedUuid);
        }

        @Test
        @DisplayName("Null auditor ID throws IllegalArgumentException")
        void toUUID_nullId_throwsIllegalArgument() {
            when(caseRepository.findById(any(UUID.class))).thenReturn(Optional.of(testCase));

            AppointTeamLeadRequest request = new AppointTeamLeadRequest(null, "Reason");

            assertThatThrownBy(() -> useCase.execute(testCase.getCaseId(), request))
                .isInstanceOf(IllegalArgumentException.class);
        }
    }

    // ── State validation tests ──────────────────────────────────────────

    @Nested
    @DisplayName("Case state validation")
    class CaseStateValidation {

        @Test
        @DisplayName("TEAM_ASSIGNED state is accepted and transitions to PENDING_VIABILITY")
        void execute_teamAssignedState_accepted() throws Exception {
            testCase.setStatus("TEAM_ASSIGNED");
            when(caseRepository.findById(any(UUID.class))).thenReturn(Optional.of(testCase));

            AppointTeamLeadRequest request = new AppointTeamLeadRequest("u-tl-aa1c", "Valid appointment");
            useCase.execute(testCase.getCaseId(), request);

            // After team lead appointment, case moves to PENDING_VIABILITY
            assertThat(testCase.getStatus()).isEqualTo("PENDING_VIABILITY");
        }

        @Test
        @DisplayName("PENDING_VOTES state is rejected")
        void execute_pendingVotesState_rejected() {
            testCase.setStatus("PENDING_VOTES");
            when(caseRepository.findById(any(UUID.class))).thenReturn(Optional.of(testCase));

            AppointTeamLeadRequest request = new AppointTeamLeadRequest("u-tl-aa1c", "Invalid");

            assertThatThrownBy(() -> useCase.execute(testCase.getCaseId(), request))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("TEAM_ASSIGNED");
        }

        @Test
        @DisplayName("CLOSED state is rejected")
        void execute_closedState_rejected() {
            testCase.setStatus("CLOSED");
            when(caseRepository.findById(any(UUID.class))).thenReturn(Optional.of(testCase));

            AppointTeamLeadRequest request = new AppointTeamLeadRequest("u-tl-aa1c", "Invalid");

            assertThatThrownBy(() -> useCase.execute(testCase.getCaseId(), request))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("TEAM_ASSIGNED");
        }
    }
}
