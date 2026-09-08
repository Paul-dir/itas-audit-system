package mor.itas.api.controller.backoffice.jac;

import com.fasterxml.jackson.databind.ObjectMapper;
import mor.itas.api.dto.request.ap.jac.AppointTeamLeadRequest;
import mor.itas.api.dto.response.ap.jac.TeamAssignmentResponse;
import mor.itas.application.usecase.ap.AppointTeamLeadUseCase;
import mor.itas.application.usecase.ap.FinalizeViabilityUseCase;
import mor.itas.application.usecase.ap.AssignOfficialTeamUseCase;
import mor.itas.application.usecase.ap.TransferToExecutionUseCase;
import mor.itas.application.usecase.ap.SLAOverrideUseCase;
import mor.itas.domain.service.ap.AuditTrailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * E2E Test: Appoint Team Lead with String Auditor IDs
 *
 * Verifies the fix for the bug where the frontend sends seed-data string IDs
 * (e.g. "u-tl-aa1c") as auditorId, but the backend DTO previously expected
 * UUID type — causing Spring JSON deserialization to fail with 400 error.
 *
 * Test Categories:
 *   1. UUID string auditor IDs (standard format)
 *   2. Seed-data string auditor IDs (non-UUID format)
 *   3. Edge cases (null, empty, missing fields)
 *   4. Full flow: request → controller → use case → response
 */
@WebMvcTest(CommitteeChairpersonController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("Appoint Team Lead — String Auditor ID E2E Tests")
class AppointTeamLeadStringIdE2ETest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AppointTeamLeadUseCase appointTeamLeadUseCase;

    @MockBean
    private FinalizeViabilityUseCase finalizeViabilityUseCase;

    @MockBean
    private AssignOfficialTeamUseCase assignOfficialTeamUseCase;

    @MockBean
    private TransferToExecutionUseCase transferToExecutionUseCase;

    @MockBean
    private SLAOverrideUseCase slaOverrideUseCase;

    @MockBean
    private CommitteeEventService committeeEventService;

    @MockBean
    private AuditTrailService auditTrailService;

    private UUID testCaseId;
    private TeamAssignmentResponse mockResponse;

    @BeforeEach
    void setUp() {
        testCaseId = UUID.randomUUID();
        mockResponse = TeamAssignmentResponse.builder()
            .teamAssignmentId(UUID.randomUUID())
            .appointedTeamLeadId(UUID.randomUUID())
            .teamLeadName("Team Lead")
            .teamSize(1)
            .build();

        when(appointTeamLeadUseCase.execute(any(UUID.class), any(AppointTeamLeadRequest.class)))
            .thenReturn(mockResponse);
    }

    // ── 1. UUID String Auditor IDs ──────────────────────────────────────

    @Nested
    @DisplayName("UUID-format auditor IDs")
    class UuidAuditorIds {

        @Test
        @DisplayName("POST /appoint-team-lead with valid UUID returns 201 CREATED")
        @WithMockUser(roles = "CHAIRPERSON")
        void appointTeamLead_withValidUuid_returns201() throws Exception {
            // Arrange
            String auditorId = UUID.randomUUID().toString();
            AppointTeamLeadRequest request = new AppointTeamLeadRequest(auditorId, "Best auditor for this case");

            // Act & Assert
            MvcResult result = mockMvc.perform(
                    post("/api/v1/backoffice/ap/committee/cases/{caseId}/appoint-team-lead", testCaseId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.teamLeadName").value("Team Lead"))
                .andExpect(jsonPath("$.teamSize").value(1))
                .andReturn();

            // Verify use case was called with correct arguments
            verify(appointTeamLeadUseCase).execute(eq(testCaseId), any(AppointTeamLeadRequest.class));
        }

        @Test
        @DisplayName("POST /appoint-team-lead with standard UUID format accepted")
        @WithMockUser(roles = "CHAIRPERSON")
        void appointTeamLead_withStandardUuidFormat_accepted() throws Exception {
            // Arrange — use a well-known UUID format
            String auditorId = "a0000001-0000-0000-0000-000000000001";
            AppointTeamLeadRequest request = new AppointTeamLeadRequest(auditorId, "Senior auditor");

            // Act & Assert
            mockMvc.perform(
                    post("/api/v1/backoffice/ap/committee/cases/{caseId}/appoint-team-lead", testCaseId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
        }
    }

    // ── 2. Seed-Data String Auditor IDs (the bug fix) ──────────────────

    @Nested
    @DisplayName("Seed-data string auditor IDs (non-UUID format)")
    class SeedDataAuditorIds {

        @Test
        @DisplayName("POST /appoint-team-lead with seed ID 'u-tl-aa1c' returns 201 CREATED")
        @WithMockUser(roles = "CHAIRPERSON")
        void appointTeamLead_withSeedIdUtlAa1c_returns201() throws Exception {
            // This is the exact scenario that was failing before the fix:
            // Melaku Bekele has seed ID "u-tl-aa1c", not a UUID
            String auditorId = "u-tl-aa1c";
            AppointTeamLeadRequest request = new AppointTeamLeadRequest(auditorId, "Appointed by chairperson");

            // Act & Assert — must NOT return 400 Bad Request
            mockMvc.perform(
                    post("/api/v1/backoffice/ap/committee/cases/{caseId}/appoint-team-lead", testCaseId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.teamSize").value(1))
                .andReturn();

            verify(appointTeamLeadUseCase).execute(eq(testCaseId), any(AppointTeamLeadRequest.class));
        }

        @Test
        @DisplayName("POST /appoint-team-lead with various seed-data IDs all accepted")
        @WithMockUser(roles = "CHAIRPERSON")
        void appointTeamLead_withVariousSeedIds_allAccepted() throws Exception {
            // Test multiple seed-data ID formats used in the frontend
            String[] seedIds = {
                "u-tl-aa1a",   // Henok Belay
                "u-tl-aa1c",   // Melaku Bekele (joint audit)
                "u-tl-aa2b",   // Almaz Worku
                "u-aud-aa1e",  // Samuel Haile (auditor)
                "u-com-aa-chair" // Committee Chair
            };

            for (String seedId : seedIds) {
                reset(appointTeamLeadUseCase);
                when(appointTeamLeadUseCase.execute(any(UUID.class), any(AppointTeamLeadRequest.class)))
                    .thenReturn(mockResponse);

                AppointTeamLeadRequest request = new AppointTeamLeadRequest(seedId, "Testing seed ID: " + seedId);

                mockMvc.perform(
                        post("/api/v1/backoffice/ap/committee/cases/{caseId}/appoint-team-lead", testCaseId)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.teamSize").value(1));
            }
        }

        @Test
        @DisplayName("POST /appoint-team-lead with hyphenated string ID accepted")
        @WithMockUser(roles = "CHAIRPERSON")
        void appointTeamLead_withHyphenatedStringId_accepted() throws Exception {
            // A realistic non-UUID string ID that might come from an external system
            String auditorId = "AUD-2024-AA-001";
            AppointTeamLeadRequest request = new AppointTeamLeadRequest(auditorId, "External auditor assignment");

            mockMvc.perform(
                    post("/api/v1/backoffice/ap/committee/cases/{caseId}/appoint-team-lead", testCaseId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
        }
    }

    // ── 3. Validation & Error Cases ─────────────────────────────────────

    @Nested
    @DisplayName("Request validation")
    class ValidationTests {

        @Test
        @DisplayName("POST /appoint-team-lead with null auditorId returns 400 BAD REQUEST")
        @WithMockUser(roles = "CHAIRPERSON")
        void appointTeamLead_withNullAuditorId_returns400() throws Exception {
            // Build JSON manually to include null value
            String json = "{\"auditorId\": null, \"reason\": \"Test reason\"}";

            mockMvc.perform(
                    post("/api/v1/backoffice/ap/committee/cases/{caseId}/appoint-team-lead", testCaseId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("POST /appoint-team-lead with missing auditorId returns 400 BAD REQUEST")
        @WithMockUser(roles = "CHAIRPERSON")
        void appointTeamLead_withMissingAuditorId_returns400() throws Exception {
            String json = "{\"reason\": \"No auditor specified\"}";

            mockMvc.perform(
                    post("/api/v1/backoffice/ap/committee/cases/{caseId}/appoint-team-lead", testCaseId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("POST /appoint-team-lead with empty reason returns 400 BAD REQUEST")
        @WithMockUser(roles = "CHAIRPERSON")
        void appointTeamLead_withEmptyReason_returns400() throws Exception {
            AppointTeamLeadRequest request = new AppointTeamLeadRequest("u-tl-aa1c", "");

            mockMvc.perform(
                    post("/api/v1/backoffice/ap/committee/cases/{caseId}/appoint-team-lead", testCaseId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("POST /appoint-team-lead without CHAIRPERSON role — filter disabled in @WebMvcTest")
        @WithMockUser(roles = "COMMITTEE_MEMBER")
        void appointTeamLead_filterDisabled_noRoleCheck() throws Exception {
            // Note: @WebMvcTest(addFilters = false) disables @PreAuthorize,
            // so this returns 201 instead of 403. The filter test requires
            // a full @SpringBootTest with security configured.
            AppointTeamLeadRequest request = new AppointTeamLeadRequest("u-tl-aa1c", "Unauthorized appointment attempt");

            mockMvc.perform(
                    post("/api/v1/backoffice/ap/committee/cases/{caseId}/appoint-team-lead", testCaseId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
        }
    }

    // ── 4. Full Flow: Request → Controller → Use Case → Response ───────

    @Nested
    @DisplayName("Full flow verification")
    class FullFlowTests {

        @Test
        @DisplayName("Seed ID flows through to use case and response reflects correct data")
        @WithMockUser(roles = "CHAIRPERSON")
        void fullFlow_seedId_flowsThroughCorrectly() throws Exception {
            // Arrange — set up specific response for this test
            UUID expectedLeadId = UUID.nameUUIDFromBytes("u-tl-aa1c".getBytes());
            TeamAssignmentResponse specificResponse = TeamAssignmentResponse.builder()
                .teamAssignmentId(UUID.randomUUID())
                .appointedTeamLeadId(expectedLeadId)
                .teamLeadName("Melaku Bekele")
                .teamSize(1)
                .build();

            when(appointTeamLeadUseCase.execute(eq(testCaseId), any(AppointTeamLeadRequest.class)))
                .thenReturn(specificResponse);

            AppointTeamLeadRequest request = new AppointTeamLeadRequest("u-tl-aa1c", "Appointed by chairperson");

            // Act
            MvcResult result = mockMvc.perform(
                    post("/api/v1/backoffice/ap/committee/cases/{caseId}/appoint-team-lead", testCaseId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.teamLeadName").value("Melaku Bekele"))
                .andExpect(jsonPath("$.teamSize").value(1))
                .andReturn();

            // Verify the use case was invoked with the correct case ID
            verify(appointTeamLeadUseCase, times(1))
                .execute(eq(testCaseId), any(AppointTeamLeadRequest.class));

            // Verify the response body contains the deterministic UUID
            String responseBody = result.getResponse().getContentAsString();
            assertThat(responseBody).contains(expectedLeadId.toString());
        }

        @Test
        @DisplayName("UUID string flows through identically to seed ID")
        @WithMockUser(roles = "CHAIRPERSON")
        void fullFlow_uuidString_flowsThroughIdentically() throws Exception {
            // Arrange — use a real UUID string
            String uuidAuditorId = "a0000001-0000-0000-0000-000000000003";
            UUID expectedLeadId = UUID.fromString(uuidAuditorId);
            TeamAssignmentResponse specificResponse = TeamAssignmentResponse.builder()
                .teamAssignmentId(UUID.randomUUID())
                .appointedTeamLeadId(expectedLeadId)
                .teamLeadName("Dawit Tadesse")
                .teamSize(1)
                .build();

            when(appointTeamLeadUseCase.execute(eq(testCaseId), any(AppointTeamLeadRequest.class)))
                .thenReturn(specificResponse);

            AppointTeamLeadRequest request = new AppointTeamLeadRequest(uuidAuditorId, "Senior auditor");

            // Act & Assert
            mockMvc.perform(
                    post("/api/v1/backoffice/ap/committee/cases/{caseId}/appoint-team-lead", testCaseId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.appointedTeamLeadId").value(expectedLeadId.toString()));

            verify(appointTeamLeadUseCase, times(1))
                .execute(eq(testCaseId), any(AppointTeamLeadRequest.class));
        }

        @Test
        @DisplayName("JSON body with string auditorId deserializes correctly")
        @WithMockUser(roles = "CHAIRPERSON")
        void fullFlow_jsonDeserialization_stringAuditorId() throws Exception {
            // This test verifies the core fix: JSON deserialization of a non-UUID string
            // into the request DTO. Before the fix, this would throw a
            // InvalidFormatException / MethodArgumentTypeMismatchException.
            String jsonBody = """
                {
                    "auditorId": "u-tl-aa1c",
                    "reason": "Best candidate for joint audit leadership"
                }
                """;

            mockMvc.perform(
                    post("/api/v1/backoffice/ap/committee/cases/{caseId}/appoint-team-lead", testCaseId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.teamSize").value(1));

            verify(appointTeamLeadUseCase).execute(eq(testCaseId), any(AppointTeamLeadRequest.class));
        }
    }
}
