# Backend API Requirements - Extracted from Frontend Logic

**Strategy:** Frontend has working business logic with localStorage. We extract that logic and implement exact endpoints in backend. Frontend then calls backend instead of localStorage.

---

## Frontend Actions → Backend Endpoints Mapping

The frontend's `AppContext.actions` shows all operations. We map each to a backend endpoint.

### 1. Plan Creation & Status Management

#### ✅ 1.1 Create Plan
**Frontend:** `actions.createPlan(data)`
**Current Backend:** ✅ Already working
```bash
POST /api/v1/backoffice/ap/plans
Request: { planYear, planName, createdBy }
Response: { id, planYear, planName, status: 'DRAFT', allocations, createdAt, createdBy }
```

---

#### ❌ 1.2 Submit Plan to Director
**Frontend:** `actions.submitToDirector(planId, actorId)`
**Expected Behavior:** Change status from DRAFT → SUBMITTED_TO_DIRECTOR, add timeline entry

**Needed Endpoint:**
```bash
POST /api/v1/backoffice/ap/plans/{planId}/submit
Request: { actorId }
Response: { id, status: 'SUBMITTED_TO_DIRECTOR', timeline: [...] }
Business Logic:
- Verify current status is DRAFT
- Update status to SUBMITTED_TO_DIRECTOR
- Add timeline entry: { status: 'SUBMITTED_TO_DIRECTOR', actor: actorId, comment: 'Submitted for director review', timestamp }
- Persist to database
```

---

#### ❌ 1.3 Director Approve Plan
**Frontend:** `actions.approvePlan(planId, actorId, comment)`
**Expected Behavior:** Change status to DIRECTOR_APPROVED, store director comment

**Needed Endpoint:**
```bash
POST /api/v1/backoffice/ap/plans/{planId}/approve
Request: { actorId, directorComment }
Response: { id, status: 'DIRECTOR_APPROVED', directorComment, timeline: [...] }
Business Logic:
- Verify role is DIRECTOR
- Update status to DIRECTOR_APPROVED
- Store directorComment
- Add timeline entry
```

---

#### ❌ 1.4 Director Request Revision
**Frontend:** `actions.requestRevision(planId, actorId, comment)`
**Expected Behavior:** Change status to REVISION_REQUESTED, track revision count

**Needed Endpoint:**
```bash
POST /api/v1/backoffice/ap/plans/{planId}/request-revision
Request: { actorId, revisionComment }
Response: { id, status: 'REVISION_REQUESTED', revisions: [{comment, timestamp, by, type: 'revision'}], timeline: [...] }
Business Logic:
- Verify role is DIRECTOR
- Update status to REVISION_REQUESTED
- Add to revisions array
- Add timeline entry
```

---

#### ❌ 1.5 Send Plan to Regions for Feedback
**Frontend:** `actions.sendToRegions(planId, actorId)`
**Expected Behavior:** Change status to AWAITING_REGIONAL_FEEDBACK

**Needed Endpoint:**
```bash
POST /api/v1/backoffice/ap/plans/{planId}/send-to-regions
Request: { actorId }
Response: { id, status: 'AWAITING_REGIONAL_FEEDBACK', timeline: [...] }
Business Logic:
- Update status to AWAITING_REGIONAL_FEEDBACK
- Add timeline entry: 'Sent to all regions for feedback'
```

---

### 2. Regional Feedback Collection

#### ❌ 2.1 Submit Regional Feedback
**Frontend:** `actions.submitRegionalFeedback(planId, regionId, feedbackText, taxCenterAllocations, actorId)`
**Expected Behavior:** Store regional feedback, aggregate from all regions

**Needed Endpoint:**
```bash
POST /api/v1/backoffice/ap/plans/{planId}/regions/{regionId}/feedback
Request: {
  actorId,
  feedbackText,
  taxCenterAllocations: {
    "TC-ADDIS-01": { desk_audit: 50, field_audit: 30 },
    "TC-ADDIS-02": { desk_audit: 40, field_audit: 35 }
  }
}
Response: {
  id,
  status: 'FEEDBACK_COLLECTED' (if all regions submitted),
  regionalFeedback: {
    [regionId]: { feedback, taxCenterAllocations, submittedAt, submittedBy }
  },
  timeline: [...]
}
Business Logic:
- Store feedback for that region
- Check if ALL regions have submitted
- If yes: status → FEEDBACK_COLLECTED
- Track which regions auto-filled vs submitted
```

---

#### ❌ 2.2 Override Regional Feedback (Director)
**Frontend:** `actions.overrideRegionalFeedback(planId, regionId, overriddenAllocations, comment, actorId)`
**Expected Behavior:** Director can override a region's feedback

**Needed Endpoint:**
```bash
POST /api/v1/backoffice/ap/plans/{planId}/regions/{regionId}/override
Request: {
  actorId,
  overriddenAllocations: { "TC-ADDIS-01": 100, ... },
  overrideComment
}
Response: {
  regionalFeedback[regionId]: {
    isOverridden: true,
    overriddenAt,
    overriddenBy,
    overrideComment,
    taxCenterAllocations
  }
}
Business Logic:
- Verify role is DIRECTOR
- Override the regional allocations
- Mark as overridden with timestamp and who did it
- Store reason
```

---

#### ✅ 2.3 Submit Tax Center Feedback
**Frontend:** `actions.submitTaxCenterFeedback(planId, regionId, taxCenterId, feedbackText, adjustedAllocation, actorId)`
**Current Backend:** ✅ Already working
```bash
PATCH /api/v1/backoffice/ap/plans/{planId}/allocations/{allocationId}/feedback
Request: { tcAdjustedCount, tcJustification }
Response: { id, allocations: [{ tcAdjustedCount, tcJustification, tcFeedbackSubmitted: true }] }
```

---

### 3. Amendment Cycle

#### ❌ 3.1 Send Amendment to Planning Team
**Frontend:** `actions.sendAmendmentToPlanningTeam(planId, actorId, comment)`
**Expected Behavior:** After feedback collected, director sends back for amendment

**Needed Endpoint:**
```bash
POST /api/v1/backoffice/ap/plans/{planId}/amendment
Request: { actorId, amendmentComment }
Response: {
  status: 'AMENDMENT_REQUIRED',
  amendmentComment,
  revisions: [..., { comment, type: 'amendment', timestamp, by: actorId }]
}
Business Logic:
- Update status to AMENDMENT_REQUIRED
- Store amendment comment
- Add to revisions array
```

---

#### ❌ 3.2 Submit Amended Plan to Senior Management
**Frontend:** `actions.submitToSeniorMgmt(planId, actorId)`
**Expected Behavior:** After amendments, director submits to senior management

**Needed Endpoint:**
```bash
POST /api/v1/backoffice/ap/plans/{planId}/submit-to-senior
Request: { actorId }
Response: { status: 'SUBMITTED_TO_SENIOR_MGMT', timeline: [...] }
```

---

### 4. Senior Management Approval

#### ❌ 4.1 Senior Management Approve
**Frontend:** `actions.approveBySenior(planId, actorId, comment)`
**Expected Behavior:** Senior management approves plan

**Needed Endpoint:**
```bash
POST /api/v1/backoffice/ap/plans/{planId}/senior-approve
Request: { actorId, seniorComment }
Response: { status: 'SENIOR_MGMT_APPROVED', seniorComment, timeline: [...] }
```

---

#### ❌ 4.2 Senior Management Reject
**Frontend:** `actions.rejectBySenior(planId, actorId, comment)`
**Expected Behavior:** Senior management rejects plan

**Needed Endpoint:**
```bash
POST /api/v1/backoffice/ap/plans/{planId}/senior-reject
Request: { actorId, rejectComment }
Response: {
  status: 'SENIOR_MGMT_REJECTED',
  revisions: [..., { comment, type: 'senior_rejection', timestamp, by: actorId }]
}
```

---

### 5. Plan Finalization & Regional Deployment

#### ❌ 5.1 Send Approved Plan to Regions
**Frontend:** `actions.sendApprovedToRegions(planId, actorId)`
**Expected Behavior:** After senior approval, send to regions for deployment

**Needed Endpoint:**
```bash
POST /api/v1/backoffice/ap/plans/{planId}/send-approved-to-regions
Request: { actorId }
Response: { status: 'APPROVED_TO_REGIONS', timeline: [...] }
```

---

#### ❌ 5.2 Regional Director Deploys to Tax Centers
**Frontend:** `actions.deployToTaxCenters(planId, regionId, actorId)`
**Expected Behavior:** Regional director deploys plan to their tax centers

**Needed Endpoint:**
```bash
POST /api/v1/backoffice/ap/plans/{planId}/regions/{regionId}/deploy
Request: { actorId }
Response: {
  status: 'FINALIZED' (if all regions deployed) OR 'APPROVED_TO_REGIONS',
  regionalDeployments: {
    [regionId]: { deployedAt, deployedBy, status: 'DEPLOYED' }
  },
  timeline: [...]
}
Business Logic:
- Mark region as deployed
- Check if ALL regions have deployed
- If yes: status → FINALIZED, trigger case generation
- Add timeline entry
```

---

#### ❌ 5.3 Finalize Plan (Direct - Legacy)
**Frontend:** `actions.finalizePlan(planId, actorId)`
**Expected Behavior:** Direct finalization (backward compat)

**Needed Endpoint:**
```bash
POST /api/v1/backoffice/ap/plans/{planId}/finalize
Request: { actorId }
Response: { status: 'FINALIZED', timeline: [...], cases: [...] }
Business Logic:
- Update status to FINALIZED
- Trigger case generation from allocations
- Return created cases
```

---

### 6. Case Management

#### ❌ 6.1 Generate Cases from Plan
**Frontend:** `generateCases(planId, distribution, regionalFeedback)` → dispatch ADD_CASES
**Expected Behavior:** When plan finalized, create audit cases

**Needed Endpoint:**
```bash
POST /api/v1/backoffice/ap/plans/{planId}/generate-cases
Request: { actorId }
Response: {
  cases: [
    {
      id, planId, caseNumber, taxCenterId, taxpayerId, auditType,
      riskScore, status: 'PENDING_ASSIGNMENT', createdAt
    }
  ]
}
Business Logic:
- For each allocation with approved quota, create that many cases
- Pull taxpayer data from Risk Engine
- Set audit_type based on risk profile
- Status = PENDING_ASSIGNMENT
- Generate unique case number
```

---

#### ❌ 6.2 Assign Case to Team Leader
**Frontend:** `actions.assignCaseToTeamLeader(caseId, teamLeaderId)`
**Expected Behavior:** Assign case to a team leader

**Needed Endpoint:**
```bash
POST /api/v1/backoffice/ap/cases/{caseId}/assign-team-leader
Request: { actorId, teamLeaderId }
Response: { id, assignedTeamLeader: teamLeaderId, status: 'ASSIGNED', assignedAt, timeline: [...] }
```

---

#### ❌ 6.3 Assign Case to Auditor
**Frontend:** `actions.assignCaseToAuditor(caseId, auditorId)`
**Expected Behavior:** Assign case from Team Leader to specific Auditor

**Needed Endpoint:**
```bash
POST /api/v1/backoffice/ap/cases/{caseId}/assign-auditor
Request: { actorId, auditorId }
Response: { id, assignedAuditor: auditorId, status: 'IN_PROGRESS', startDate, timeline: [...] }
```

---

#### ❌ 6.4 Update Case Status
**Frontend:** `actions.updateCaseStatus(caseId, status, notes)`
**Expected Behavior:** Update case status as work progresses

**Needed Endpoint:**
```bash
PATCH /api/v1/backoffice/ap/cases/{caseId}/status
Request: { status, notes }
Response: { id, status, notes, ..., completedDate (if COMPLETED), timeline: [...] }
```

---

### 7. Read/Fetch Endpoints

#### ❌ 7.1 Get All Plans (with filters)
**Frontend:** `planService.getPlans(filters)`
**Needed Endpoint:**
```bash
GET /api/v1/backoffice/ap/plans?status=DRAFT&region=ADDIS&fiscalYear=2024
Response: { data: [plans], count, total }
```

---

#### ❌ 7.2 Get Plan by ID
**Frontend:** `planService.getPlanById(planId)` + `actions.getPlan(id)`
**Needed Endpoint:**
```bash
GET /api/v1/backoffice/ap/plans/{planId}
Response: { id, year, name, status, allocations, timeline, regionalFeedback, ... }
```

---

#### ❌ 7.3 Get Plans for Region
**Frontend:** `planService.getPlansForRegion(region)`
**Needed Endpoint:**
```bash
GET /api/v1/backoffice/ap/plans/region/{region}
Response: { data: [plans], count }
```

---

#### ❌ 7.4 Get Cases for Plan
**Frontend:** `selectors.getCasesForPlan(planId)`
**Needed Endpoint:**
```bash
GET /api/v1/backoffice/ap/plans/{planId}/cases
Response: { data: [cases], count }
```

---

#### ❌ 7.5 Get Cases for Tax Center
**Frontend:** `selectors.getCasesForTaxCenter(tc)`
**Needed Endpoint:**
```bash
GET /api/v1/backoffice/ap/cases?taxCenter={tc}
Response: { data: [cases], count }
```

---

#### ❌ 7.6 Get Cases for Auditor
**Frontend:** `selectors.getCasesForAuditor(auditorId)`
**Needed Endpoint:**
```bash
GET /api/v1/backoffice/ap/cases?assignedAuditor={auditorId}
Response: { data: [cases], count }
```

---

#### ❌ 7.7 Get Plan Statistics
**Frontend:** `selectors.getPlanStats()`
**Needed Endpoint:**
```bash
GET /api/v1/backoffice/ap/plans/stats
Response: {
  total, draft, pendingDirector, active, pendingSenior, finalized,
  amendmentRequired, seniorRejected
}
```

---

## Status Transitions Implemented in Frontend

```
DRAFT
  ↓ submitToDirector
SUBMITTED_TO_DIRECTOR ←→ REVISION_REQUESTED
  ↓ approvePlan
DIRECTOR_APPROVED
  ↓ sendToRegions
AWAITING_REGIONAL_FEEDBACK
  ↓ (feedback arrives)
FEEDBACK_COLLECTED
  ↓ sendAmendmentToPlanningTeam (if needed)
AMENDMENT_REQUIRED ← (back to planning team)
  ↓ submitToSeniorMgmt
SUBMITTED_TO_SENIOR_MGMT ←→ SENIOR_MGMT_REJECTED
  ↓ approveBySenior
SENIOR_MGMT_APPROVED
  ↓ sendApprovedToRegions
APPROVED_TO_REGIONS
  ↓ deployToTaxCenters (per region)
FINALIZED ← (once all regions deployed)
```

---

## Implementation Priority

### Phase 1: Critical (Must Have First)
1. ❌ Submit plan to director
2. ❌ Director approve/request-revision
3. ❌ Send to regions for feedback
4. ❌ Submit regional feedback
5. ❌ Deploy to regions → Finalize
6. ❌ Generate cases

### Phase 2: Important (Next)
1. ❌ Senior management approval flow
2. ❌ Amendment cycle
3. ❌ Case assignment
4. ❌ Case status updates

### Phase 3: Nice-to-Have
1. ❌ Read endpoints (GET plans, cases)
2. ❌ Statistics/dashboard endpoints

---

## Database Schema Needed

### `ap_plans_timeline`
```sql
CREATE TABLE ap_plans_timeline (
  id UUID PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id),
  status VARCHAR(32) NOT NULL,
  actor_id VARCHAR(64) NOT NULL,
  comment TEXT,
  timestamp TIMESTAMPTZ NOT NULL,
  INDEX (plan_id)
);
```

### `ap_plans_revisions`
```sql
CREATE TABLE ap_plans_revisions (
  id UUID PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id),
  comment TEXT NOT NULL,
  revision_type VARCHAR(32),  -- 'revision', 'amendment', 'senior_rejection'
  created_by VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  INDEX (plan_id)
);
```

### Update `ap_annual_audit_plans`
```sql
ALTER TABLE ap_annual_audit_plans ADD COLUMN director_comment TEXT;
ALTER TABLE ap_annual_audit_plans ADD COLUMN senior_comment TEXT;
ALTER TABLE ap_annual_audit_plans ADD COLUMN amendment_comment TEXT;
```

### `ap_regional_feedback`
```sql
CREATE TABLE ap_regional_feedback (
  id UUID PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id),
  region_id VARCHAR(64) NOT NULL,
  feedback TEXT,
  submitted_by VARCHAR(64),
  submitted_at TIMESTAMPTZ,
  is_overridden BOOLEAN DEFAULT FALSE,
  override_comment TEXT,
  UNIQUE(plan_id, region_id),
  INDEX (plan_id)
);
```

### `ap_audit_cases`
```sql
CREATE TABLE ap_audit_cases (
  id UUID PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id),
  allocation_id UUID REFERENCES ap_plan_allocations(id),
  case_number VARCHAR(32) UNIQUE NOT NULL,
  taxpayer_id VARCHAR(64) NOT NULL,
  audit_type VARCHAR(32),
  risk_score INTEGER,
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING_ASSIGNMENT',
  assigned_team_leader_id VARCHAR(64),
  assigned_auditor_id VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL,
  created_by VARCHAR(64) NOT NULL,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  INDEX (plan_id, status)
);
```

---

## Summary

**Total Endpoints Needed:** 26 endpoints (18 POST/PATCH, 8 GET)
**Currently Implemented:** 2 endpoints
**Need to Implement:** 24 endpoints

**Extracted from:** Frontend AppContext + PlanService logic
**Frontend:** No changes needed - will call backend instead of localStorage
**Backend:** Implement these endpoints with exact business logic from frontend
