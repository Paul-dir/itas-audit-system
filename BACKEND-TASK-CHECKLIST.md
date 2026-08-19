# Backend Implementation Task Checklist

**Phase 1: Database Schema (Complete First)**

## Flyway Migrations

### ✅ Create File:
```
backend/bs-taxaudit-core-server/src/main/resources/db/migration/V6__ap_planning_workflow.sql
```

**Contents:** Copy entire SQL script from `IMPLEMENTATION-ROADMAP.md` section "Phase 1: Database Schema & Entities"

**What it creates:**
- ap_plan_timeline (tracks status changes)
- ap_plan_revisions (tracks amendments/rejections)
- ap_regional_feedback (regional feedback collection)
- ap_regional_deployments (regional deployment tracking)
- ap_audit_cases (audit cases generated from plans)
- Columns added to ap_annual_audit_plans

---

## Phase 2: JPA Entities & Repositories

### ❌ Create Files:

```
backend/bs-taxaudit-core-server/src/main/java/mor/itas/persistence/jpa/entity/ap/
├── ApPlanTimelineEntity.java
├── ApPlanRevisionEntity.java
├── ApRegionalFeedbackEntity.java
├── ApRegionalDeploymentEntity.java
└── ApAuditCaseEntity.java
```

### ❌ Create Repositories:

```
backend/bs-taxaudit-core-server/src/main/java/mor/itas/persistence/jpa/repository/ap/
├── ApPlanTimelineRepository.java
├── ApPlanRevisionRepository.java
├── ApRegionalFeedbackRepository.java
├── ApRegionalDeploymentRepository.java
└── ApAuditCaseRepository.java
```

### ❌ Create Domain Models:

```
backend/bs-taxaudit-core-server/src/main/java/mor/itas/domain/model/ap/
├── PlanTimeline.java
├── PlanRevision.java
├── RegionalFeedback.java
├── RegionalDeployment.java
└── AuditCase.java
```

### ❌ Create Mappers:

```
backend/bs-taxaudit-core-server/src/main/java/mor/itas/persistence/mapper/ap/
├── PlanTimelineMapper.java
├── PlanRevisionMapper.java
├── RegionalFeedbackMapper.java
├── RegionalDeploymentMapper.java
└── AuditCaseMapper.java
```

---

## Phase 3: Services

### ❌ Create Files:

```
backend/bs-taxaudit-core-server/src/main/java/mor/itas/application/service/ap/
├── PlanStatusTransitionService.java        (handles status changes)
├── RegionalFeedbackService.java            (handles feedback aggregation)
├── CaseGenerationService.java              (generates cases from plan)
├── AmendmentCycleService.java             (handles amendment workflow)
└── SeniorManagementService.java            (handles senior approval)
```

**Key Methods in Each Service:**

**PlanStatusTransitionService:**
- `submitToDirector(planId, actorId)`
- `approvePlan(planId, actorId, comment)`
- `requestRevision(planId, actorId, comment)`
- `sendToRegions(planId, actorId)`
- `sendAmendmentToPlanningTeam(planId, actorId, comment)`
- `sendApprovedToRegions(planId, actorId)`

**RegionalFeedbackService:**
- `submitRegionalFeedback(planId, regionId, feedbackText, tcAllocations, actorId)`
- `overrideRegionalFeedback(planId, regionId, allocations, comment, actorId)`
- `deployToTaxCenters(planId, regionId, actorId)`

**CaseGenerationService:**
- `generateCasesForPlan(planId, actorId) : List<AuditCase>`

**AmendmentCycleService:**
- `submitToSeniorMgmt(planId, actorId)`

**SeniorManagementService:**
- `approveBySenior(planId, actorId, comment)`
- `rejectBySenior(planId, actorId, comment)`

---

## Phase 4: Controllers & Endpoints

### ❌ Create Files:

```
backend/bs-taxaudit-core-server/src/main/java/mor/itas/api/controller/backoffice/ap/
├── PlanWorkflowController.java            (status transitions)
├── RegionalFeedbackController.java        (feedback collection)
├── CaseManagementController.java          (case operations)
└── PlanQueryController.java               (read endpoints)
```

**Endpoints to Create (26 total):**

### PlanWorkflowController (11 endpoints)
```
POST   /api/v1/backoffice/ap/plans/{planId}/submit
POST   /api/v1/backoffice/ap/plans/{planId}/approve
POST   /api/v1/backoffice/ap/plans/{planId}/request-revision
POST   /api/v1/backoffice/ap/plans/{planId}/send-to-regions
POST   /api/v1/backoffice/ap/plans/{planId}/amendment
POST   /api/v1/backoffice/ap/plans/{planId}/submit-to-senior
POST   /api/v1/backoffice/ap/plans/{planId}/senior-approve
POST   /api/v1/backoffice/ap/plans/{planId}/senior-reject
POST   /api/v1/backoffice/ap/plans/{planId}/send-approved-to-regions
POST   /api/v1/backoffice/ap/plans/{planId}/finalize
GET    /api/v1/backoffice/ap/plans/stats
```

### RegionalFeedbackController (3 endpoints)
```
POST   /api/v1/backoffice/ap/plans/{planId}/regions/{regionId}/feedback
POST   /api/v1/backoffice/ap/plans/{planId}/regions/{regionId}/override
POST   /api/v1/backoffice/ap/plans/{planId}/regions/{regionId}/deploy
```

### CaseManagementController (5 endpoints)
```
POST   /api/v1/backoffice/ap/plans/{planId}/generate-cases
POST   /api/v1/backoffice/ap/cases/{caseId}/assign-team-leader
POST   /api/v1/backoffice/ap/cases/{caseId}/assign-auditor
PATCH  /api/v1/backoffice/ap/cases/{caseId}/status
GET    /api/v1/backoffice/ap/cases/{caseId}
```

### PlanQueryController (7 endpoints)
```
GET    /api/v1/backoffice/ap/plans
GET    /api/v1/backoffice/ap/plans/{planId}
GET    /api/v1/backoffice/ap/plans/region/{region}
GET    /api/v1/backoffice/ap/plans/{planId}/cases
GET    /api/v1/backoffice/ap/plans/{planId}/timeline
GET    /api/v1/backoffice/ap/cases?taxCenter={tc}
GET    /api/v1/backoffice/ap/cases?assignedAuditor={auditorId}
```

---

## Phase 5: Testing & Verification

### ✅ Test Scripts to Create:

```
test/
├── curl-tests.sh                          (bash script with all curl commands)
└── postman-collection.json               (Postman collection for testing)
```

**Key Test Scenarios:**
1. Create plan → Submit to director → Approve
2. Send to regions → Collect feedback → Deploy
3. Finalize → Generate cases
4. Status transitions are validated
5. Timeline entries created correctly
6. Regional feedback aggregation works

---

## Phase 6: Frontend Integration

### ✅ Update Files:

```
frontend/back-office-ui/src/
├── context/AppContext.jsx
├── features/ap/services/planService.js
└── features/ap/services/caseService.js
```

**Changes:**
- Remove localStorage calls
- Keep API service layer
- Update endpoints to call backend
- No UI changes needed

---

## Implementation Order (Recommended)

```
1. Database (V6 migration)
   ↓
2. JPA Entities + Repositories
   ↓
3. Domain Models + Mappers
   ↓
4. Services (start with PlanStatusTransitionService)
   ↓
5. Controllers (one controller at a time)
   ↓
6. Test each endpoint with curl
   ↓
7. Frontend integration
```

---

## Build & Deploy

### Step 1: Create Migration
```bash
# Create file with SQL from IMPLEMENTATION-ROADMAP.md
touch backend/.../db/migration/V6__ap_planning_workflow.sql
```

### Step 2: Build Backend
```bash
cd backend/bs-taxaudit-core-server
mvn clean package -DskipTests
```

### Step 3: Run Application
```bash
java -jar target/bs-taxaudit-core-server-1.0.0-SNAPSHOT.jar
# Migration runs automatically via Flyway
```

### Step 4: Verify Database
```bash
# Connect to PostgreSQL
psql -U postgres -d itas_audit_system -c "\dt ap_*"
# Should see all new tables
```

### Step 5: Test Endpoints
```bash
# Run curl tests
bash test/curl-tests.sh

# Or use Postman with collection
# Load: test/postman-collection.json
```

---

## Success Criteria Checklist

- [ ] V6 migration created and runs without errors
- [ ] All 5 JPA entities created with @Entity annotations
- [ ] All 5 repositories extend JpaRepository
- [ ] All 5 services injected into controllers
- [ ] All 26 endpoints return 200 OK status
- [ ] Database persists data correctly
- [ ] Timeline entries created for each status change
- [ ] Regional feedback aggregated properly
- [ ] Cases generated with correct data
- [ ] Frontend can call backend APIs
- [ ] Full workflow end-to-end working

---

## Files Reference

**See for SQL:**
- IMPLEMENTATION-ROADMAP.md → Section "Phase 1: Database Schema & Entities"

**See for Code Examples:**
- IMPLEMENTATION-ROADMAP.md → Sections "Phase 3", "Phase 4", "Phase 5"

**See for Endpoint Requirements:**
- BACKEND-API-REQUIREMENTS.md → All 26 endpoints with examples

**See for Overall Strategy:**
- APPROACH-SUMMARY.md

---

## Ready? Start with:

1. Open `IMPLEMENTATION-ROADMAP.md`
2. Copy SQL migration script
3. Create `V6__ap_planning_workflow.sql`
4. Run `mvn clean package`
5. Start Phase 2: JPA entities

**Estimated Time: 18 hours for complete implementation**

---

**Branch:** `feature/pawlos-sprint-01-ap-bootstrap`
**Commit regularly!** Each phase should be a commit.
