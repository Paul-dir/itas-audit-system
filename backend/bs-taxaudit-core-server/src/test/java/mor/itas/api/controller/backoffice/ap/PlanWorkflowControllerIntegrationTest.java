package mor.itas.api.controller.backoffice.ap;

import com.fasterxml.jackson.databind.ObjectMapper;
import mor.itas.api.dto.request.ap.ApprovalRequest;
import mor.itas.api.dto.request.ap.CreatePlanRequest;
import mor.itas.api.dto.request.ap.DivideAllocationRequest;
import mor.itas.api.dto.request.ap.SubmitTaxCenterFeedbackRequest;
import mor.itas.api.dto.response.ap.AllocationResponse;
import mor.itas.api.dto.response.ap.PlanResponse;
import mor.itas.application.port.outboundport.repositoryport.ap.AnnualAuditPlanRepositoryPort;
import mor.itas.application.port.outboundport.repositoryport.ap.PlanAuditLogRepositoryPort;
import mor.itas.domain.model.ap.AnnualAuditPlan;
import mor.itas.domain.model.ap.PlanStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * PlanWorkflowControllerIntegrationTest - Integration tests for complete 4-level workflow
 * Tests the entire Annual Audit Plan lifecycle from creation to finalization
 * Uses Testcontainers with PostgreSQL for database testing
 */
@Testcontainers
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@DisplayName("Plan Workflow Integration Tests")
public class PlanWorkflowControllerIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine")
        .withDatabaseName("itas_audit_test")
        .withUsername("itas_test")
        .withPassword("test_password");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AnnualAuditPlanRepositoryPort planRepository;

    @Autowired
    private PlanAuditLogRepositoryPort auditLogRepository;

    private UUID planId;
    private String planningTeamId = "PT-001";
    private String directorId = "DIR-001";
    private String regionalDirectorId = "RD-AA-001";
    private String taxCenterManagerId = "TCM-AA-01";

    @BeforeEach
    void setUp() {
        // Clear repositories
        planRepository.findAll().forEach(p -> planRepository.delete(p.getId()));
    }

    // ============= LEVEL 1: Planning Team Tests =============

    @Test
    @DisplayName("Test 1: Planning Team creates plan with regional allocations")
    void test_1_createPlanWithRegionalAllocations() throws Exception {
        // Arrange
        CreatePlanRequest request = new CreatePlanRequest(
            2026,
            "2026 Annual Audit Plan",
            List.of(
                new CreatePlanRequest.RegionalAllocationRequest("AA", 500),
                new CreatePlanRequest.RegionalAllocationRequest("BB", 300),
                new CreatePlanRequest.RegionalAllocationRequest("CC", 200)
            )
        );

        // Act
        MvcResult result = mockMvc.perform(post("/api/v1/backoffice/ap/plans")
            .header("X-Actor-Id", planningTeamId)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andReturn();

        // Assert
        PlanResponse response = objectMapper.readValue(
            result.getResponse().getContentAsString(),
            PlanResponse.class
        );
        
        planId = response.getId();
        
        assertThat(response).isNotNull();
        assertThat(response.getPlanYear()).isEqualTo(2026);
        assertThat(response.getPlanName()).isEqualTo("2026 Annual Audit Plan");
        assertThat(response.getStatus()).isEqualTo("DRAFT");
        assertThat(response.getCreatedBy()).isEqualTo(planningTeamId);
        assertThat(response.getRegionalAllocations()).hasSize(3);
        assertThat(response.getTaxCenterAllocations()).isEmpty();

        // Verify in database
        AnnualAuditPlan savedPlan = planRepository.findById(planId).orElseThrow();
        assertThat(savedPlan.getStatus()).isEqualTo(PlanStatus.DRAFT);
        assertThat(savedPlan.getAllocations()).hasSize(3);
    }

    @Test
    @DisplayName("Test 2: Planning Team submits to Director")
    void test_2_submitToDirector() throws Exception {
        // Setup: Create plan first
        test_1_createPlanWithRegionalAllocations();

        // Act
        MvcResult result = mockMvc.perform(post("/api/v1/backoffice/ap/plans/{planId}/submit-to-director", planId)
            .header("X-Actor-Id", planningTeamId))
            .andExpect(status().isOk())
            .andReturn();

        // Assert
        PlanResponse response = objectMapper.readValue(
            result.getResponse().getContentAsString(),
            PlanResponse.class
        );
        
        assertThat(response.getStatus()).isEqualTo("SUBMITTED_TO_DIRECTOR");
        assertThat(response.getSubmittedToDirectorBy()).isEqualTo(planningTeamId);
        assertThat(response.getSubmittedToDirectorAt()).isNotNull();

        // Verify in database
        AnnualAuditPlan savedPlan = planRepository.findById(planId).orElseThrow();
        assertThat(savedPlan.getStatus()).isEqualTo(PlanStatus.SUBMITTED_TO_DIRECTOR);
    }

    // ============= LEVEL 2: Director Tests =============

    @Test
    @DisplayName("Test 3: Director approves plan (NO modifications)")
    void test_3_directorApprovesPlan() throws Exception {
        // Setup
        test_2_submitToDirector();

        // Arrange
        ApprovalRequest approvalRequest = new ApprovalRequest("Approved for regional review");

        // Act
        MvcResult result = mockMvc.perform(post("/api/v1/backoffice/ap/plans/{planId}/approve-by-director", planId)
            .header("X-Actor-Id", directorId)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(approvalRequest)))
            .andExpect(status().isOk())
            .andReturn();

        // Assert
        PlanResponse response = objectMapper.readValue(
            result.getResponse().getContentAsString(),
            PlanResponse.class
        );
        
        assertThat(response.getStatus()).isEqualTo("DIRECTOR_APPROVED");
        assertThat(response.getDirectorApprovedBy()).isEqualTo(directorId);
        assertThat(response.getDirectorApprovalReason()).isEqualTo("Approved for regional review");
        assertThat(response.getRegionalAllocations()).hasSize(3);  // NO changes

        // Verify in database
        AnnualAuditPlan savedPlan = planRepository.findById(planId).orElseThrow();
        assertThat(savedPlan.getStatus()).isEqualTo(PlanStatus.DIRECTOR_APPROVED);
    }

    @Test
    @DisplayName("Test 4: Director routes to Regional Directors")
    void test_4_directorRoutesToRegional() throws Exception {
        // Setup
        test_3_directorApprovesPlan();

        // Act
        MvcResult result = mockMvc.perform(post("/api/v1/backoffice/ap/plans/{planId}/submit-to-regional", planId)
            .header("X-Actor-Id", directorId))
            .andExpect(status().isOk())
            .andReturn();

        // Assert
        PlanResponse response = objectMapper.readValue(
            result.getResponse().getContentAsString(),
            PlanResponse.class
        );
        
        assertThat(response.getStatus()).isEqualTo("SUBMITTED_TO_REGIONAL");
        assertThat(response.getSubmittedToRegionalBy()).isEqualTo(directorId);
        assertThat(response.getSubmittedToRegionalAt()).isNotNull();

        // Verify in database
        AnnualAuditPlan savedPlan = planRepository.findById(planId).orElseThrow();
        assertThat(savedPlan.getStatus()).isEqualTo(PlanStatus.SUBMITTED_TO_REGIONAL);
    }

    // ============= LEVEL 3: Regional Director Tests =============

    @Test
    @DisplayName("Test 5: Regional Director approves allocations")
    void test_5_regionalDirectorApproves() throws Exception {
        // Setup
        test_4_directorRoutesToRegional();

        // Arrange
        ApprovalRequest approvalRequest = new ApprovalRequest("Region AA allocations approved");

        // Act
        MvcResult result = mockMvc.perform(post("/api/v1/backoffice/ap/plans/{planId}/approve-by-regional", planId)
            .header("X-Actor-Id", regionalDirectorId)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(approvalRequest)))
            .andExpect(status().isOk())
            .andReturn();

        // Assert
        PlanResponse response = objectMapper.readValue(
            result.getResponse().getContentAsString(),
            PlanResponse.class
        );
        
        assertThat(response.getStatus()).isEqualTo("REGIONAL_APPROVED");
        assertThat(response.getRegionalDirectorApprovedBy()).isEqualTo(regionalDirectorId);
        assertThat(response.getRegionalDirectorApprovalReason()).isEqualTo("Region AA allocations approved");

        // Verify in database
        AnnualAuditPlan savedPlan = planRepository.findById(planId).orElseThrow();
        assertThat(savedPlan.getStatus()).isEqualTo(PlanStatus.REGIONAL_APPROVED);
    }

    @Test
    @DisplayName("Test 6: Regional Director divides regional into tax center allocations")
    void test_6_regionalDividesAllocations() throws Exception {
        // Setup
        test_5_regionalDirectorApproves();

        // Arrange - Regional allocation is 500 for region AA
        DivideAllocationRequest divideRequest = new DivideAllocationRequest(
            "AA",
            List.of(
                new DivideAllocationRequest.TaxCenterAllocationRequest("TC-AA-01", 250),
                new DivideAllocationRequest.TaxCenterAllocationRequest("TC-AA-02", 250)
            )
        );

        // Act
        MvcResult result = mockMvc.perform(post("/api/v1/backoffice/ap/plans/{planId}/divide-allocations", planId)
            .header("X-Actor-Id", regionalDirectorId)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(divideRequest)))
            .andExpect(status().isOk())
            .andReturn();

        // Assert
        PlanResponse response = objectMapper.readValue(
            result.getResponse().getContentAsString(),
            PlanResponse.class
        );
        
        assertThat(response.getTaxCenterAllocations()).hasSize(2);
        
        AllocationResponse tc1 = response.getTaxCenterAllocations().stream()
            .filter(a -> a.getTaxCenterCode().equals("TC-AA-01"))
            .findFirst()
            .orElseThrow();
        
        assertThat(tc1.getProposedCount()).isEqualTo(250);
        assertThat(tc1.getAllocationType()).isEqualTo("TAX_CENTER");
        assertThat(tc1.getEffectiveCount()).isEqualTo(250);

        // Verify in database
        AnnualAuditPlan savedPlan = planRepository.findById(planId).orElseThrow();
        assertThat(savedPlan.getAllocations()).hasSize(5);  // 3 regional + 2 tax centers
    }

    @Test
    @DisplayName("Test 7: Validation - Division sum must equal regional proposed count")
    void test_7_divisionSumValidation() throws Exception {
        // Setup
        test_5_regionalDirectorApproves();

        // Arrange - Incorrect sum (250 + 200 = 450, but regional is 500)
        DivideAllocationRequest invalidRequest = new DivideAllocationRequest(
            "AA",
            List.of(
                new DivideAllocationRequest.TaxCenterAllocationRequest("TC-AA-01", 250),
                new DivideAllocationRequest.TaxCenterAllocationRequest("TC-AA-02", 200)
            )
        );

        // Act & Assert
        mockMvc.perform(post("/api/v1/backoffice/ap/plans/{planId}/divide-allocations", planId)
            .header("X-Actor-Id", regionalDirectorId)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(invalidRequest)))
            .andExpect(status().isBadRequest())
            .andReturn();
    }

    // ============= LEVEL 4: Tax Center Manager Tests =============

    @Test
    @DisplayName("Test 8: Tax Center Manager provides feedback")
    void test_8_taxCenterProvidesFeedback() throws Exception {
        // Setup
        test_6_regionalDividesAllocations();
        
        // First, director sends to tax centers
        mockMvc.perform(post("/api/v1/backoffice/ap/plans/{planId}/send-to-tax-centers", planId)
            .header("X-Actor-Id", directorId))
            .andExpect(status().isOk());

        // Arrange - TC-AA-01 has 250, manager reduces to 240
        SubmitTaxCenterFeedbackRequest feedbackRequest = new SubmitTaxCenterFeedbackRequest(
            240,
            "2 auditors on leave in September"
        );

        // Act
        MvcResult result = mockMvc.perform(patch(
            "/api/v1/backoffice/ap/plans/{planId}/allocations/{taxCenterCode}/feedback",
            planId, "TC-AA-01")
            .header("X-Actor-Id", taxCenterManagerId)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(feedbackRequest)))
            .andExpect(status().isOk())
            .andReturn();

        // Assert
        PlanResponse response = objectMapper.readValue(
            result.getResponse().getContentAsString(),
            PlanResponse.class
        );
        
        AllocationResponse tc1 = response.getTaxCenterAllocations().stream()
            .filter(a -> a.getTaxCenterCode().equals("TC-AA-01"))
            .findFirst()
            .orElseThrow();
        
        assertThat(tc1.getTcAdjustedCount()).isEqualTo(240);
        assertThat(tc1.getTcJustification()).isEqualTo("2 auditors on leave in September");
        assertThat(tc1.getTcFeedbackSubmitted()).isTrue();
        assertThat(tc1.getEffectiveCount()).isEqualTo(240);  // Final count
    }

    // ============= FINALIZATION Tests =============

    @Test
    @DisplayName("Test 9: Complete workflow: DRAFT → FINALIZED")
    void test_9_completeWorkflow() throws Exception {
        // Setup: Full workflow up to tax center feedback
        test_8_taxCenterProvidesFeedback();

        // Finalize plan
        MvcResult result = mockMvc.perform(post("/api/v1/backoffice/ap/plans/{planId}/finalize", planId)
            .header("X-Actor-Id", directorId))
            .andExpect(status().isOk())
            .andReturn();

        // Assert
        PlanResponse response = objectMapper.readValue(
            result.getResponse().getContentAsString(),
            PlanResponse.class
        );
        
        assertThat(response.getStatus()).isEqualTo("FINALIZED");
        
        // Verify in database
        AnnualAuditPlan finalPlan = planRepository.findById(planId).orElseThrow();
        assertThat(finalPlan.getStatus()).isEqualTo(PlanStatus.FINALIZED);
    }

    // ============= QUERY Tests =============

    @Test
    @DisplayName("Test 10: Query - Get plan by ID with all allocations")
    void test_10_getPlanById() throws Exception {
        // Setup
        test_8_taxCenterProvidesFeedback();

        // Act
        MvcResult result = mockMvc.perform(get("/api/v1/backoffice/ap/plans/{planId}", planId)
            .header("X-Actor-Id", planningTeamId))
            .andExpect(status().isOk())
            .andReturn();

        // Assert
        PlanResponse response = objectMapper.readValue(
            result.getResponse().getContentAsString(),
            PlanResponse.class
        );
        
        assertThat(response.getId()).isEqualTo(planId);
        assertThat(response.getRegionalAllocations()).hasSize(3);
        assertThat(response.getTaxCenterAllocations()).hasSize(2);
    }

    @Test
    @DisplayName("Test 11: Query - Get audit log with all actions")
    void test_11_getAuditLog() throws Exception {
        // Setup
        test_9_completeWorkflow();

        // Act
        MvcResult result = mockMvc.perform(get("/api/v1/backoffice/ap/plans/{planId}/audit-log", planId)
            .header("X-Actor-Id", planningTeamId))
            .andExpect(status().isOk())
            .andReturn();

        // Assert
        String responseContent = result.getResponse().getContentAsString();
        assertThat(responseContent).contains("PLAN_CREATED");
        assertThat(responseContent).contains("SUBMITTED_TO_DIRECTOR");
        assertThat(responseContent).contains("APPROVED_BY_DIRECTOR");
        assertThat(responseContent).contains("SUBMITTED_TO_REGIONAL");
        assertThat(responseContent).contains("APPROVED_BY_REGIONAL");
        assertThat(responseContent).contains("PLAN_FINALIZED");
    }

    // ============= SECURITY & VALIDATION Tests =============

    @Test
    @DisplayName("Test 12: Validation - Empty plan name fails")
    void test_12_validationEmptyPlanName() throws Exception {
        // Arrange
        CreatePlanRequest request = new CreatePlanRequest(
            2026,
            "",  // Invalid: empty name
            List.of(
                new CreatePlanRequest.RegionalAllocationRequest("AA", 500)
            )
        );

        // Act & Assert
        mockMvc.perform(post("/api/v1/backoffice/ap/plans")
            .header("X-Actor-Id", planningTeamId)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Test 13: Validation - Negative proposed count fails")
    void test_13_validationNegativeCount() throws Exception {
        // Arrange
        CreatePlanRequest request = new CreatePlanRequest(
            2026,
            "2026 Plan",
            List.of(
                new CreatePlanRequest.RegionalAllocationRequest("AA", -100)  // Invalid: negative
            )
        );

        // Act & Assert
        mockMvc.perform(post("/api/v1/backoffice/ap/plans")
            .header("X-Actor-Id", planningTeamId)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Test 14: State transition - Cannot approve plan twice")
    void test_14_stateTransitionValidation() throws Exception {
        // Setup
        test_3_directorApprovesPlan();

        // Arrange - Try to approve again
        ApprovalRequest approvalRequest = new ApprovalRequest("Try to approve again");

        // Act & Assert - Should fail with 409 CONFLICT
        mockMvc.perform(post("/api/v1/backoffice/ap/plans/{planId}/approve-by-director", planId)
            .header("X-Actor-Id", directorId)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(approvalRequest)))
            .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("Test 15: Audit trail - All actions recorded")
    void test_15_auditTrailTracking() throws Exception {
        // Setup
        test_9_completeWorkflow();

        // Verify audit logs exist
        var auditLogs = auditLogRepository.findByPlanIdOrderByCreatedAtDesc(planId);
        
        assertThat(auditLogs).isNotEmpty();
        
        // Verify specific actions are logged
        var actions = auditLogs.stream()
            .map(log -> log.getAction())
            .toList();
        
        assertThat(actions).contains(
            "PLAN_CREATED",
            "SUBMITTED_TO_DIRECTOR",
            "APPROVED_BY_DIRECTOR",
            "SUBMITTED_TO_REGIONAL",
            "APPROVED_BY_REGIONAL"
        );
    }
}
