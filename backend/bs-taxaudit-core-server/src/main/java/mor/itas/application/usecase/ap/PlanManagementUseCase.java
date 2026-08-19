package mor.itas.application.usecase.ap;

import mor.itas.application.port.outboundport.repositoryport.ap.AnnualAuditPlanRepositoryPort;
import mor.itas.application.port.outboundport.repositoryport.ap.PlanAuditLogRepositoryPort;
import mor.itas.domain.model.ap.AnnualAuditPlan;
import mor.itas.domain.model.ap.PlanAllocation;
import mor.itas.domain.model.ap.PlanAuditLog;
import mor.itas.domain.model.ap.PlanStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * PlanManagementUseCase - Handles all plan operations for the 4-level approval workflow
 * Regional-level allocations: Planning Team creates regional, Regional Director divides into tax centers
 */
@Service
public class PlanManagementUseCase {

    @Autowired
    private AnnualAuditPlanRepositoryPort planRepository;

    @Autowired
    private PlanAuditLogRepositoryPort auditLogRepository;

    /**
     * LEVEL 1: Planning Team creates plan with regional allocations
     */
    @Transactional
    public AnnualAuditPlan createPlanWithRegionalAllocations(
        Integer planYear,
        String planName,
        List<RegionalAllocationDto> regionalAllocations,
        String actorId) {

        // Create plan
        AnnualAuditPlan plan = new AnnualAuditPlan(
            UUID.randomUUID(),
            planYear,
            planName,
            actorId
        );

        // Add regional allocations (one per region)
        for (RegionalAllocationDto regional : regionalAllocations) {
            PlanAllocation allocation = new PlanAllocation(
                UUID.randomUUID(),
                plan.getId(),
                null,                      // tax_center_code = NULL for regional
                regional.getRegionCode(),
                regional.getProposedCount()
            );
            plan.addAllocation(allocation);
        }

        // Save plan
        AnnualAuditPlan savedPlan = planRepository.save(plan);

        // Log action
        PlanAuditLog log = PlanAuditLog.createPlan(savedPlan.getId(), actorId);
        auditLogRepository.save(log);

        return savedPlan;
    }

    /**
     * LEVEL 1: Planning Team submits to Director
     */
    @Transactional
    public AnnualAuditPlan submitToDirector(UUID planId, String actorId) {
        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));

        if (!plan.canBeSubmittedByPlanningTeam()) {
            throw new IllegalStateException("Plan cannot be submitted in status: " + plan.getStatus());
        }

        plan.submitToDirector(actorId);
        AnnualAuditPlan saved = planRepository.save(plan);

        // Log action
        PlanAuditLog log = PlanAuditLog.submitToDirector(saved.getId(), actorId);
        auditLogRepository.save(log);

        return saved;
    }

    /**
     * LEVEL 2: Director approves and routes forward (NO allocation changes)
     */
    @Transactional
    public AnnualAuditPlan approveByDirector(UUID planId, String actorId, String reason) {
        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));

        if (!plan.canBeApprovedByDirector()) {
            throw new IllegalStateException("Plan cannot be approved in status: " + plan.getStatus());
        }

        plan.approveByDirector(actorId, reason);
        AnnualAuditPlan saved = planRepository.save(plan);

        // Log action
        PlanAuditLog log = PlanAuditLog.approvedByDirector(saved.getId(), actorId, reason);
        auditLogRepository.save(log);

        return saved;
    }

    /**
     * LEVEL 2: Director submits to Regional Directors
     */
    @Transactional
    public AnnualAuditPlan submitToRegionalDirectors(UUID planId, String actorId) {
        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));

        if (!plan.canBeSubmittedToRegionalByDirector()) {
            throw new IllegalStateException("Plan cannot be submitted to Regional in status: " + plan.getStatus());
        }

        plan.submitToRegionalDirectors(actorId);
        AnnualAuditPlan saved = planRepository.save(plan);

        // Log action
        PlanAuditLog log = PlanAuditLog.submittedToRegional(saved.getId(), actorId);
        auditLogRepository.save(log);

        return saved;
    }

    /**
     * LEVEL 3: Regional Director approves regional allocations
     */
    @Transactional
    public AnnualAuditPlan approveByRegionalDirector(UUID planId, String actorId, String reason) {
        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));

        if (!plan.canBeApprovedByRegionalDirector()) {
            throw new IllegalStateException("Plan cannot be approved in status: " + plan.getStatus());
        }

        plan.approveByRegionalDirector(actorId, reason);
        AnnualAuditPlan saved = planRepository.save(plan);

        // Log action
        PlanAuditLog log = PlanAuditLog.approvedByRegional(saved.getId(), actorId, reason);
        auditLogRepository.save(log);

        return saved;
    }

    /**
     * LEVEL 3: Regional Director divides regional allocation into tax center allocations
     */
    @Transactional
    public AnnualAuditPlan divideRegionalAllocationIntoTaxCenters(
        UUID planId,
        String regionCode,
        List<TaxCenterAllocationDto> tcAllocations,
        String actorId) {

        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));

        // Get regional allocation for this region
        PlanAllocation regionalAllocation = plan.getAllocations()
            .stream()
            .filter(a -> a.isRegionalAllocation() && a.getRegionCode().equals(regionCode))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Regional allocation not found for region: " + regionCode));

        int totalDivided = 0;
        int proposedTotal = regionalAllocation.getProposedCount();

        // Create tax center allocations
        for (TaxCenterAllocationDto tcDto : tcAllocations) {
            PlanAllocation tcAllocation = new PlanAllocation(
                UUID.randomUUID(),
                plan.getId(),
                tcDto.getTaxCenterCode(),   // NOW set tax_center_code
                regionCode,
                tcDto.getAuditCount()
            );
            plan.addAllocation(tcAllocation);
            totalDivided += tcDto.getAuditCount();

            // Log tax center allocation creation
            PlanAuditLog log = new PlanAuditLog(
                plan.getId(),
                "TAX_CENTER_ALLOCATION_CREATED",
                actorId,
                "REGIONAL_DIRECTOR",
                "Divided from regional allocation"
            );
            auditLogRepository.save(log);
        }

        // Validate division sum
        if (totalDivided != proposedTotal) {
            throw new IllegalArgumentException(
                String.format("Tax center allocations sum (%d) does not match regional allocation (%d)",
                    totalDivided, proposedTotal)
            );
        }

        // Mark regional allocation as divided
        regionalAllocation.divideBetweenTaxCenters(totalDivided, "Divided into " + tcAllocations.size() + " tax centers");

        AnnualAuditPlan saved = planRepository.save(plan);

        // Log action
        PlanAuditLog log = new PlanAuditLog(
            saved.getId(),
            "REGIONAL_DIVIDED_INTO_TAX_CENTERS",
            actorId,
            "REGIONAL_DIRECTOR",
            "Divided regional allocation for " + regionCode
        );
        auditLogRepository.save(log);

        return saved;
    }

    /**
     * LEVEL 2: Director sends plan to Tax Centers
     */
    @Transactional
    public AnnualAuditPlan sendToTaxCenters(UUID planId, String actorId) {
        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));

        if (!plan.canBeSentToTaxCentersByDirector()) {
            throw new IllegalStateException("Plan cannot be sent to Tax Centers in status: " + plan.getStatus());
        }

        plan.sendToTaxCenters(actorId);
        AnnualAuditPlan saved = planRepository.save(plan);

        // Log action
        PlanAuditLog log = PlanAuditLog.sentToTaxCenters(saved.getId(), actorId);
        auditLogRepository.save(log);

        return saved;
    }

    /**
     * LEVEL 4: Tax Center Manager provides feedback
     */
    @Transactional
    public AnnualAuditPlan submitTaxCenterFeedback(
        UUID planId,
        String taxCenterCode,
        Integer adjustedCount,
        String justification,
        String actorId) {

        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));

        if (!plan.canReceiveTaxCenterFeedback()) {
            throw new IllegalStateException("Plan cannot receive feedback in status: " + plan.getStatus());
        }

        // Get tax center allocation
        PlanAllocation tcAllocation = plan.getAllocations()
            .stream()
            .filter(a -> a.isTaxCenterAllocation() && a.getTaxCenterCode().equals(taxCenterCode))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Tax center allocation not found: " + taxCenterCode));

        // Submit feedback
        tcAllocation.submitFeedback(adjustedCount, justification);

        AnnualAuditPlan saved = planRepository.save(plan);

        // Log action
        PlanAuditLog log = PlanAuditLog.feedbackSubmittedByTaxCenter(saved.getId(), actorId, 
            tcAllocation.getProposedCount(), adjustedCount);
        auditLogRepository.save(log);

        return saved;
    }

    /**
     * Record all tax centers have submitted feedback
     */
    @Transactional
    public AnnualAuditPlan recordAllTaxCenterFeedbackSubmitted(UUID planId, String actorId) {
        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));

        plan.recordTaxCenterFeedbackSubmitted(actorId);
        AnnualAuditPlan saved = planRepository.save(plan);

        // Log action
        PlanAuditLog log = new PlanAuditLog(saved.getId(), "TC_FEEDBACK_SUBMITTED", actorId, "DIRECTOR");
        auditLogRepository.save(log);

        return saved;
    }

    /**
     * Finalize plan
     */
    @Transactional
    public AnnualAuditPlan finalizePlan(UUID planId, String actorId) {
        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));

        plan.finalize(actorId);
        AnnualAuditPlan saved = planRepository.save(plan);

        // Log action
        PlanAuditLog log = PlanAuditLog.planFinalized(saved.getId(), actorId);
        auditLogRepository.save(log);

        return saved;
    }

    /**
     * Get plan by ID
     */
    @Transactional(readOnly = true)
    public AnnualAuditPlan getPlanById(UUID planId) {
        return planRepository.findById(planId)
            .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));
    }

    /**
     * Get all regional allocations for a plan
     */
    @Transactional(readOnly = true)
    public List<PlanAllocation> getRegionalAllocations(UUID planId) {
        AnnualAuditPlan plan = getPlanById(planId);
        return plan.getAllocations()
            .stream()
            .filter(PlanAllocation::isRegionalAllocation)
            .toList();
    }

    /**
     * Get all tax center allocations for a plan
     */
    @Transactional(readOnly = true)
    public List<PlanAllocation> getTaxCenterAllocations(UUID planId) {
        AnnualAuditPlan plan = getPlanById(planId);
        return plan.getAllocations()
            .stream()
            .filter(PlanAllocation::isTaxCenterAllocation)
            .toList();
    }

    /**
     * Get tax center allocations for a specific region
     */
    @Transactional(readOnly = true)
    public List<PlanAllocation> getTaxCenterAllocationsByRegion(UUID planId, String regionCode) {
        AnnualAuditPlan plan = getPlanById(planId);
        return plan.getAllocations()
            .stream()
            .filter(a -> a.isTaxCenterAllocation() && a.getRegionCode().equals(regionCode))
            .toList();
    }

    /**
     * Get audit log for a plan
     */
    @Transactional(readOnly = true)
    public List<PlanAuditLog> getPlanAuditLog(UUID planId) {
        return auditLogRepository.findByPlanIdOrderByCreatedAtDesc(planId);
    }

    // DTOs for API requests
    public static class RegionalAllocationDto {
        private String regionCode;
        private Integer proposedCount;

        public RegionalAllocationDto(String regionCode, Integer proposedCount) {
            this.regionCode = regionCode;
            this.proposedCount = proposedCount;
        }

        public String getRegionCode() { return regionCode; }
        public Integer getProposedCount() { return proposedCount; }
    }

    public static class TaxCenterAllocationDto {
        private String taxCenterCode;
        private Integer auditCount;

        public TaxCenterAllocationDto(String taxCenterCode, Integer auditCount) {
            this.taxCenterCode = taxCenterCode;
            this.auditCount = auditCount;
        }

        public String getTaxCenterCode() { return taxCenterCode; }
        public Integer getAuditCount() { return auditCount; }
    }
}
