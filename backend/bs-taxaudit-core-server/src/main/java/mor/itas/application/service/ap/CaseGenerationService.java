package mor.itas.application.service.ap;

import mor.itas.domain.aggregate.ap.AnnualAuditPlan;
import mor.itas.domain.model.ap.AuditCase;
import mor.itas.domain.model.ap.PlanAllocation;
import mor.itas.application.port.outboundport.repositoryport.ap.AnnualAuditPlanRepository;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import mor.itas.persistence.jpa.repository.ap.ApAuditCaseRepository;
import mor.itas.persistence.mapper.ap.AuditCaseMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * CaseGenerationService - Generates audit cases from finalized plans
 * Extracted from frontend's generateCases() logic
 */
@Service
@RequiredArgsConstructor
@Transactional
public class CaseGenerationService {

    private final ApAuditCaseRepository caseRepository;
    private final AnnualAuditPlanRepository planRepository;
    private final AuditCaseMapper caseMapper;

    /**
     * Generate audit cases from a finalized plan
     * Creates one case per quota in the plan's allocations
     */
    public List<AuditCase> generateCasesForPlan(UUID planId, String actorId) {
        // Verify plan exists and is finalized
        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));

        if (!plan.getStatus().equals("FINALIZED")) {
            throw new IllegalStateException("Can only generate cases from FINALIZED plans. Current: " + plan.getStatus());
        }

        List<AuditCase> generatedCases = new ArrayList<>();
        List<PlanAllocation> allocations = plan.getAllocations();
        
        // Mock audit types (extracted from frontend)
        String[] auditTypes = {"DESK", "FIELD", "JOINT", "TPRICE", "COMP", "ISSUE"};

        // For each allocation, create cases equal to the approved quota
        for (PlanAllocation allocation : allocations) {
            // Determine count: use tcAdjustedCount if submitted, else use proposedCount
            int caseCount = allocation.getTcAdjustedCount() != null 
                ? allocation.getTcAdjustedCount() 
                : allocation.getProposedCount();

            String taxCenter = allocation.getTaxCenterCode();

            // Create individual cases
            for (int i = 0; i < caseCount; i++) {
                // Generate mock taxpayer data (phase 1 - will call real service in phase 2)
                String mockTin = String.format("TIN-%s-%05d", taxCenter, i + 1);
                String auditType = auditTypes[i % auditTypes.length];
                int riskScore = 30 + (i % 70);  // Random risk score between 30-100

                // Create case entity
                ApAuditCaseEntity caseEntity = new ApAuditCaseEntity();
                caseEntity.setPlanId(planId);
                caseEntity.setAllocationId(allocation.getId());
                caseEntity.setCaseNumber(generateCaseNumber(planId, taxCenter, i));
                caseEntity.setTaxpayerId(mockTin);
                caseEntity.setAuditType(auditType);
                caseEntity.setRiskScore(riskScore);
                caseEntity.setStatus("PENDING_ASSIGNMENT");
                caseEntity.setCreatedBy(actorId);

                // Save and convert to domain model
                ApAuditCaseEntity saved = caseRepository.save(caseEntity);
                generatedCases.add(caseMapper.toDomain(saved));
            }
        }

        return generatedCases;
    }

    /**
     * Get all cases for a plan
     */
    public List<AuditCase> getCasesForPlan(UUID planId) {
        return caseRepository.findByPlanId(planId).stream()
            .map(caseMapper::toDomain)
            .toList();
    }

    /**
     * Get cases by status
     */
    public List<AuditCase> getCasesByStatus(String status) {
        return caseRepository.findByStatus(status).stream()
            .map(caseMapper::toDomain)
            .toList();
    }

    /**
     * Get cases assigned to auditor
     */
    public List<AuditCase> getCasesForAuditor(String auditorId) {
        return caseRepository.findByAssignedAuditorId(auditorId).stream()
            .map(caseMapper::toDomain)
            .toList();
    }

    /**
     * Get cases assigned to team leader
     */
    public List<AuditCase> getCasesForTeamLeader(String teamLeaderId) {
        return caseRepository.findByAssignedTeamLeaderId(teamLeaderId).stream()
            .map(caseMapper::toDomain)
            .toList();
    }

    /**
     * Get single case by ID
     */
    public AuditCase getCaseById(UUID caseId) {
        return caseRepository.findById(caseId)
            .map(caseMapper::toDomain)
            .orElseThrow(() -> new IllegalArgumentException("Case not found: " + caseId));
    }

    /**
     * Assign case to team leader
     */
    public AuditCase assignCaseToTeamLeader(UUID caseId, String teamLeaderId) {
        ApAuditCaseEntity caseEntity = caseRepository.findById(caseId)
            .orElseThrow(() -> new IllegalArgumentException("Case not found: " + caseId));

        if (!caseEntity.getStatus().equals("PENDING_ASSIGNMENT")) {
            throw new IllegalStateException("Can only assign cases in PENDING_ASSIGNMENT status. Current: " + caseEntity.getStatus());
        }

        caseEntity.setAssignedTeamLeaderId(teamLeaderId);
        caseEntity.setStatus("ASSIGNED");
        ApAuditCaseEntity saved = caseRepository.save(caseEntity);

        return caseMapper.toDomain(saved);
    }

    /**
     * Assign case to auditor
     */
    public AuditCase assignCaseToAuditor(UUID caseId, String auditorId) {
        ApAuditCaseEntity caseEntity = caseRepository.findById(caseId)
            .orElseThrow(() -> new IllegalArgumentException("Case not found: " + caseId));

        if (!caseEntity.getStatus().equals("ASSIGNED")) {
            throw new IllegalStateException("Case must be assigned to team leader first. Current: " + caseEntity.getStatus());
        }

        caseEntity.setAssignedAuditorId(auditorId);
        caseEntity.setStatus("IN_PROGRESS");
        caseEntity.setStartedAt(java.time.OffsetDateTime.now());
        ApAuditCaseEntity saved = caseRepository.save(caseEntity);

        return caseMapper.toDomain(saved);
    }

    /**
     * Update case status
     */
    public AuditCase updateCaseStatus(UUID caseId, String newStatus) {
        ApAuditCaseEntity caseEntity = caseRepository.findById(caseId)
            .orElseThrow(() -> new IllegalArgumentException("Case not found: " + caseId));

        if (newStatus.equals("COMPLETED")) {
            caseEntity.setCompletedAt(java.time.OffsetDateTime.now());
        }

        caseEntity.setStatus(newStatus);
        caseEntity.setUpdatedAt(java.time.OffsetDateTime.now());
        ApAuditCaseEntity saved = caseRepository.save(caseEntity);

        return caseMapper.toDomain(saved);
    }

    /**
     * Generate unique case number
     * Format: CASE-{planIdPrefix}-{taxCenter}-{sequentialNumber}
     */
    private String generateCaseNumber(UUID planId, String taxCenter, int index) {
        String planPrefix = planId.toString().substring(0, 8).toUpperCase();
        return String.format("CASE-%s-%s-%04d", planPrefix, taxCenter, index + 1);
    }
}
