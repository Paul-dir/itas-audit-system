# Implementation Roadmap: Frontend → Backend Extraction

## The Strategy

```
Frontend (Working ✅)           Backend (To Build ⚠️)
├─ Business Logic              ├─ Extract same logic
├─ Status Flows                ├─ Persist to DB
├─ Timeline Tracking           ├─ Add API endpoints
├─ Feedback Aggregation        └─ Serve via REST
└─ Case Generation             
     ↓                              ↓
  localStorage                   PostgreSQL
     ↓                              ↓
  Frontend State                Backend Services
     ↓                              ↓
  UI Components              REST Endpoints
                                   ↓
                              Frontend API Calls
```

**Key Point:** Frontend is the source of truth for business logic. Backend just needs to replicate it with persistence.

---

## Phase 1: Database Schema & Entities

### Create Flyway Migration: `V6__ap_planning_workflow.sql`

```sql
-- Timeline tracking for plan status transitions
CREATE TABLE ap_plan_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id) ON DELETE CASCADE,
    status VARCHAR(64) NOT NULL,
    actor_id VARCHAR(64) NOT NULL,
    comment TEXT,
    event_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_plan_timeline_plan_id ON ap_plan_timeline(plan_id);

-- Revision tracking (amendments, rejections, etc)
CREATE TABLE ap_plan_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    revision_type VARCHAR(32),  -- 'revision', 'amendment', 'senior_rejection', etc
    created_by VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_plan_revisions_plan_id ON ap_plan_revisions(plan_id);

-- Update ap_annual_audit_plans to add comment fields
ALTER TABLE ap_annual_audit_plans ADD COLUMN director_comment TEXT;
ALTER TABLE ap_annual_audit_plans ADD COLUMN senior_comment TEXT;
ALTER TABLE ap_annual_audit_plans ADD COLUMN amendment_comment TEXT;

-- Regional feedback collection
CREATE TABLE ap_regional_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id) ON DELETE CASCADE,
    region_id VARCHAR(64) NOT NULL,
    feedback_text TEXT,
    submitted_by VARCHAR(64),
    submitted_at TIMESTAMPTZ,
    is_overridden BOOLEAN DEFAULT FALSE,
    override_comment TEXT,
    override_by VARCHAR(64),
    override_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_regional_feedback UNIQUE(plan_id, region_id)
);
CREATE INDEX idx_regional_feedback_plan_id ON ap_regional_feedback(plan_id);

-- Regional deployment tracking
CREATE TABLE ap_regional_deployments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id) ON DELETE CASCADE,
    region_id VARCHAR(64) NOT NULL,
    deployed_by VARCHAR(64) NOT NULL,
    deployed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(32) DEFAULT 'DEPLOYED',
    CONSTRAINT unique_regional_deployment UNIQUE(plan_id, region_id)
);
CREATE INDEX idx_regional_deployments_plan_id ON ap_regional_deployments(plan_id);

-- Audit cases generated from finalized plans
CREATE TABLE ap_audit_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id) ON DELETE CASCADE,
    allocation_id UUID REFERENCES ap_plan_allocations(id),
    case_number VARCHAR(32) UNIQUE NOT NULL,
    taxpayer_id VARCHAR(64) NOT NULL,
    audit_type VARCHAR(32),
    risk_score INTEGER,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING_ASSIGNMENT',
    assigned_team_leader_id VARCHAR(64),
    assigned_auditor_id VARCHAR(64),
    created_by VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);
CREATE INDEX idx_audit_cases_plan_id ON ap_audit_cases(plan_id);
CREATE INDEX idx_audit_cases_status ON ap_audit_cases(status);
CREATE INDEX idx_audit_cases_auditor ON ap_audit_cases(assigned_auditor_id);
```

---

## Phase 2: Domain Models

### Create JPA Entities to Map to Tables

**Files to Create:**
- `src/main/java/mor/itas/persistence/jpa/entity/ap/ApPlanTimelineEntity.java`
- `src/main/java/mor/itas/persistence/jpa/entity/ap/ApPlanRevisionEntity.java`
- `src/main/java/mor/itas/persistence/jpa/entity/ap/ApRegionalFeedbackEntity.java`
- `src/main/java/mor/itas/persistence/jpa/entity/ap/ApRegionalDeploymentEntity.java`
- `src/main/java/mor/itas/persistence/jpa/entity/ap/ApAuditCaseEntity.java`

**Domain Models:**
- `src/main/java/mor/itas/domain/model/ap/PlanTimeline.java`
- `src/main/java/mor/itas/domain/model/ap/PlanRevision.java`
- `src/main/java/mor/itas/domain/model/ap/RegionalFeedback.java`
- `src/main/java/mor/itas/domain/model/ap/AuditCase.java`

---

## Phase 3: Implement Core Services

### 3.1 Plan Status Transitions Service

**Location:** `src/main/java/mor/itas/application/service/ap/PlanStatusTransitionService.java`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class PlanStatusTransitionService {
    private final AnnualAuditPlanRepository planRepository;
    private final ApPlanTimelineRepository timelineRepository;
    private final ApPlanRevisionRepository revisionRepository;

    // EXTRACTED FROM FRONTEND: submitToDirector
    public AnnualAuditPlan submitToDirector(UUID planId, String actorId) {
        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new EntityNotFoundException("Plan not found"));
        
        // Verify current status is DRAFT
        if (!PlanStatus.DRAFT.equals(plan.getStatus())) {
            throw new IllegalStateException("Can only submit DRAFT plans");
        }
        
        // Update status
        plan.setStatus(PlanStatus.SUBMITTED_TO_DIRECTOR);
        plan = planRepository.save(plan);
        
        // Add timeline entry (EXTRACTED from frontend timeline function)
        addTimelineEntry(planId, PlanStatus.SUBMITTED_TO_DIRECTOR, actorId, 
                        "Submitted for director review");
        
        return plan;
    }

    // EXTRACTED FROM FRONTEND: approvePlan
    public AnnualAuditPlan approvePlan(UUID planId, String actorId, String comment) {
        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new EntityNotFoundException("Plan not found"));
        
        // Verify role (extract from headers in controller)
        // Only DIRECTOR can approve
        
        plan.setStatus(PlanStatus.DIRECTOR_APPROVED);
        plan.setDirectorComment(comment);
        plan = planRepository.save(plan);
        
        addTimelineEntry(planId, PlanStatus.DIRECTOR_APPROVED, actorId, 
                        comment != null ? comment : "Approved");
        
        return plan;
    }

    // EXTRACTED FROM FRONTEND: requestRevision
    public AnnualAuditPlan requestRevision(UUID planId, String actorId, String comment) {
        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new EntityNotFoundException("Plan not found"));
        
        plan.setStatus(PlanStatus.REVISION_REQUESTED);
        plan.setDirectorComment(comment);
        plan = planRepository.save(plan);
        
        addTimelineEntry(planId, PlanStatus.REVISION_REQUESTED, actorId, comment);
        addRevisionEntry(planId, comment, "revision", actorId);
        
        return plan;
    }

    // EXTRACTED FROM FRONTEND: sendToRegions
    public AnnualAuditPlan sendToRegions(UUID planId, String actorId) {
        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new EntityNotFoundException("Plan not found"));
        
        plan.setStatus(PlanStatus.AWAITING_REGIONAL_FEEDBACK);
        plan = planRepository.save(plan);
        
        addTimelineEntry(planId, PlanStatus.AWAITING_REGIONAL_FEEDBACK, actorId,
                        "Sent to all regions for feedback");
        
        return plan;
    }

    // Helper to add timeline entry (from frontend timeline function)
    private void addTimelineEntry(UUID planId, PlanStatus status, String actorId, String comment) {
        ApPlanTimelineEntity entry = new ApPlanTimelineEntity();
        entry.setPlanId(planId);
        entry.setStatus(status.name());
        entry.setActorId(actorId);
        entry.setComment(comment);
        entry.setEventTimestamp(OffsetDateTime.now());
        timelineRepository.save(entry);
    }

    // Helper to add revision entry
    private void addRevisionEntry(UUID planId, String comment, String type, String actorId) {
        ApPlanRevisionEntity revision = new ApPlanRevisionEntity();
        revision.setPlanId(planId);
        revision.setComment(comment);
        revision.setRevisionType(type);
        revision.setCreatedBy(actorId);
        revisionRepository.save(revision);
    }
}
```

---

## Phase 4: Implement Regional Feedback Service

### Regional Feedback Aggregation (From Frontend)

**Location:** `src/main/java/mor/itas/application/service/ap/RegionalFeedbackService.java`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class RegionalFeedbackService {
    private final ApRegionalFeedbackRepository feedbackRepository;
    private final AnnualAuditPlanRepository planRepository;
    private final PlanStatusTransitionService statusService;

    // EXTRACTED FROM FRONTEND: submitRegionalFeedback
    public AnnualAuditPlan submitRegionalFeedback(UUID planId, String regionId, 
                                                  String feedbackText, Map<String, Integer> tcAllocations,
                                                  String actorId) {
        // Store feedback for this region
        ApRegionalFeedbackEntity feedback = new ApRegionalFeedbackEntity();
        feedback.setPlanId(planId);
        feedback.setRegionId(regionId);
        feedback.setFeedbackText(feedbackText);
        feedback.setSubmittedBy(actorId);
        feedback.setSubmittedAt(OffsetDateTime.now());
        feedbackRepository.save(feedback);
        
        // Check if ALL regions have submitted
        // (EXTRACTED from frontend: "if hasAtLeastOneFeedback")
        List<ApRegionalFeedbackEntity> allFeedback = feedbackRepository.findByPlanId(planId);
        List<String> allRegions = getAllRegions(); // Get from constants
        
        boolean allRegionsSubmitted = allRegions.stream()
            .allMatch(region -> allFeedback.stream()
                .anyMatch(f -> f.getRegionId().equals(region)));
        
        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new EntityNotFoundException("Plan not found"));
        
        if (allRegionsSubmitted) {
            plan.setStatus(PlanStatus.FEEDBACK_COLLECTED);
            plan = planRepository.save(plan);
        }
        
        return plan;
    }

    // EXTRACTED FROM FRONTEND: overrideRegionalFeedback
    public void overrideRegionalFeedback(UUID planId, String regionId, 
                                         Map<String, Integer> overriddenAllocations,
                                         String comment, String actorId) {
        ApRegionalFeedbackEntity feedback = feedbackRepository
            .findByPlanIdAndRegionId(planId, regionId)
            .orElseThrow(() -> new EntityNotFoundException("Feedback not found"));
        
        feedback.setIsOverridden(true);
        feedback.setOverrideComment(comment);
        feedback.setOverrideBy(actorId);
        feedback.setOverrideAt(OffsetDateTime.now());
        feedbackRepository.save(feedback);
    }
}
```

---

## Phase 5: Implement Plan Finalization & Case Generation

### Case Generation (From Frontend's generateCases)

**Location:** `src/main/java/mor/itas/application/service/ap/CaseGenerationService.java`

```java
@Service
@RequiredArgsConstructor
@Transactional
public class CaseGenerationService {
    private final ApAuditCaseRepository caseRepository;
    private final AnnualAuditPlanRepository planRepository;
    private final ApPlanAllocationRepository allocationRepository;
    private final RiskEnginePort riskEnginePort;

    // EXTRACTED FROM FRONTEND: generateCases (from finalizePlan)
    public List<AuditCase> generateCasesForPlan(UUID planId, String actorId) {
        AnnualAuditPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new EntityNotFoundException("Plan not found"));
        
        List<AuditCase> generatedCases = new ArrayList<>();
        List<PlanAllocation> allocations = allocationRepository.findByPlanId(planId);
        
        // For each allocation with approved quota (EXTRACTED from frontend logic)
        for (PlanAllocation allocation : allocations) {
            // Determine count: use tcAdjustedCount if provided, else use proposedCount
            int caseCount = allocation.getTcAdjustedCount() != null 
                ? allocation.getTcAdjustedCount() 
                : allocation.getProposedCount();
            
            // Create that many cases
            for (int i = 0; i < caseCount; i++) {
                // Pull taxpayer data from Risk Engine
                TaxpayerData taxpayer = riskEnginePort.getNextTaxpayerForAllocation(
                    allocation.getTaxCenterCode());
                
                AuditCase auditCase = new AuditCase();
                auditCase.setPlanId(planId);
                auditCase.setAllocationId(allocation.getId());
                auditCase.setCaseNumber(generateCaseNumber(planId, allocation.getTaxCenterCode(), i));
                auditCase.setTaxpayerId(taxpayer.getId());
                auditCase.setAuditType(taxpayer.getRiskProfile().getAuditType());
                auditCase.setRiskScore(taxpayer.getRiskScore());
                auditCase.setStatus(CaseStatus.PENDING_ASSIGNMENT);
                auditCase.setCreatedBy(actorId);
                
                AuditCase saved = caseRepository.save(auditCase);
                generatedCases.add(saved);
            }
        }
        
        return generatedCases;
    }

    private String generateCaseNumber(UUID planId, String taxCenter, int index) {
        return String.format("CASE-%s-%s-%04d", 
            planId.toString().substring(0, 8).toUpperCase(),
            taxCenter,
            index + 1);
    }
}
```

---

## Phase 6: Controller Implementation

### Create API Endpoints

**Location:** `src/main/java/mor/itas/api/controller/backoffice/ap/PlanWorkflowController.java`

```java
@RestController
@RequestMapping("/api/v1/backoffice/ap/plans")
@RequiredArgsConstructor
public class PlanWorkflowController {
    private final PlanStatusTransitionService transitionService;
    private final RegionalFeedbackService feedbackService;
    private final CaseGenerationService caseGenerationService;

    // Endpoint: 1.2 Submit to Director
    @PostMapping("/{planId}/submit")
    public ResponseEntity<AnnualAuditPlan> submitToDirector(
            @PathVariable UUID planId,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = transitionService.submitToDirector(planId, actorId);
        return ResponseEntity.ok(plan);
    }

    // Endpoint: 1.3 Director Approve
    @PostMapping("/{planId}/approve")
    public ResponseEntity<AnnualAuditPlan> approvePlan(
            @PathVariable UUID planId,
            @RequestBody ApproveRequest request,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = transitionService.approvePlan(planId, actorId, request.getComment());
        return ResponseEntity.ok(plan);
    }

    // Endpoint: 1.4 Request Revision
    @PostMapping("/{planId}/request-revision")
    public ResponseEntity<AnnualAuditPlan> requestRevision(
            @PathVariable UUID planId,
            @RequestBody RevisionRequest request,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = transitionService.requestRevision(planId, actorId, request.getComment());
        return ResponseEntity.ok(plan);
    }

    // Endpoint: 1.5 Send to Regions
    @PostMapping("/{planId}/send-to-regions")
    public ResponseEntity<AnnualAuditPlan> sendToRegions(
            @PathVariable UUID planId,
            @RequestHeader("X-Actor-Id") String actorId) {
        AnnualAuditPlan plan = transitionService.sendToRegions(planId, actorId);
        return ResponseEntity.ok(plan);
    }

    // ... more endpoints following same pattern
}
```

---

## Implementation Checklist

### Phase 1: Database & Schema ✅
- [ ] Create Flyway migration `V6__ap_planning_workflow.sql`
- [ ] Run migration locally
- [ ] Verify tables created

### Phase 2: JPA Entities & Mappers
- [ ] Create 5 JPA entity classes
- [ ] Create 5 domain model classes
- [ ] Create 5 mappers
- [ ] Create 5 repository interfaces

### Phase 3: Services
- [ ] PlanStatusTransitionService (6 methods for phase 1 endpoints)
- [ ] RegionalFeedbackService (2 methods for regional feedback)
- [ ] CaseGenerationService (case creation logic)

### Phase 4: Controllers
- [ ] PlanWorkflowController (20+ endpoints)
- [ ] Add proper error handling
- [ ] Add role-based authorization

### Phase 5: Testing
- [ ] Test each endpoint with curl
- [ ] Verify database persistence
- [ ] Verify timeline creation
- [ ] Verify status transitions

### Phase 6: Frontend Connection
- [ ] Remove localStorage calls from AppContext
- [ ] Update API service to call backend endpoints
- [ ] Test full workflow end-to-end

---

## Next Immediate Action

1. Create Flyway migration file
2. Create JPA entities for timeline and feedback
3. Implement PlanStatusTransitionService
4. Create first 5 workflow endpoints
5. Test with curl commands

**This ensures 100% alignment between frontend logic and backend implementation.**
