# PAWLOS AP (Annual Audit Plan) Cluster — Sprint Overview

## Cluster Purpose

The **Pawlos AP (Annual Audit Plan)** cluster represents the **foundational planning phase** of the ITAS Joint Audit System. This cluster precedes the Committee World and Execution World, establishing the annual audit strategy and tax center allocations that drive all downstream audit activities.

**Developer:** Pawlos  
**Cluster Prefix:** `ap_`  
**Scope:** Annual planning, risk engine integration, quota allocation, and feedback consolidation

---

## Cluster Architecture

```
PAWLOS AP CLUSTER (Annual Audit Planning)
├── Sprint 01: Annual Plan Creation (Vertical Slice)
├── Sprint 02: Tax Center Feedback
├── Sprint 03: Director Override & Plan Adjustments
├── Sprint 04: Plan Finalization & Case Cascade
├── Sprint 05: Case Cascade Engine (Automated Distribution)
├── Sprint 06: Manual Case Referrals (Ad-hoc Reassignment)
├── Sprint 07: Case Routing & Assignment (Team Assignment)
└── Sprint 08: Auditor Capacity Enforcement (Resource Constraints)

DOWNSTREAM → Committee World (Yoseph JA-CM-RF Cluster)
           → Execution World (Execution Cluster)
```

---

## Sprint-by-Sprint Breakdown

### **Sprint 01: Annual Plan Creation** ✅

**Objective:** Implement the foundation of the Annual Audit Plan, allowing the Planning Team to define target quotas based on Risk Engine indicators.

**Status:** Backend API working, domain models implemented

**Deliverables:**
- `AnnualAuditPlan` Aggregate Root
- `PlanAllocation` Entity (per Tax Center)
- `RiskEnginePort` integration (mocked)
- `POST /api/v1/backoffice/ap/plans` endpoint
- Frontend plan creation form

**Database Tables:**
- `ap_annual_audit_plans` (id, plan_year, plan_name, status, created_at, created_by)
- `ap_plan_allocations` (id, plan_id, tax_center_code, proposed_count, created_at)

**Key Business Logic:**
- When plan is created, automatically fetch suggested quotas from Risk Engine
- Each tax center receives an allocation based on risk profile
- Status: DRAFT → SUBMITTED → APPROVED → FINALIZED

**Success Criteria:**
- ✅ Plan created with auto-populated allocations
- ✅ Risk engine quotas returned in response
- ✅ Data persisted to database correctly
- ✅ Frontend displays created plan with allocations

---

### **Sprint 02: Tax Center Feedback** 📋

**Objective:** Enable Tax Center Managers to review proposed quotas and submit adjusted counts with justification.

**Deliverables:**
- `PATCH /api/v1/backoffice/ap/plans/{planId}/allocations/{allocationId}/feedback` endpoint
- Tax Center Manager role-based access control
- Feedback tracking: `tc_adjusted_count`, `tc_justification`, `tc_feedback_submitted`

**Frontend Components:**
- Allocation details page with feedback form
- Feedback history/audit trail display

**Business Rules:**
- Only ROLE_TC_MANAGER can submit feedback
- Feedback must include justification if count differs from proposed
- Track submission timestamp and submitting user

**Status:** In development

---

### **Sprint 03: Director Override** 📋

**Objective:** Allow Director/Senior Management to override plan allocations for strategic reasons.

**Deliverables:**
- Director approval workflow
- Override reason tracking
- Plan adjustment history

**Business Rules:**
- Director can increase/decrease any allocation with mandatory reason
- Overrides create audit trail entry
- Email notification to affected Tax Centers

**Status:** To be implemented

---

### **Sprint 04: Plan Finalization & Case Cascade** 📋

**Objective:** Finalize the annual plan and trigger automatic case creation/assignment based on allocations.

**Deliverables:**
- Plan status finalization workflow
- Cascade engine initialization
- Audit case creation from allocations

**Case Cascade Logic:**
- For each allocation with approved quota, create that many `AuditCase` records
- Distribute cases across tax center's audit teams based on capacity
- Set initial case status to PENDING_ASSIGNMENT

**Status:** To be implemented

---

### **Sprint 05: Case Cascade Engine** 📋

**Objective:** Implement sophisticated automated case distribution logic considering auditor capacity, specialization, and workload.

**Deliverables:**
- Capacity-aware case distribution algorithm
- Auditor specialization/expertise matching
- Load balancing across team members

**Business Rules:**
- Cases distributed to auditors with available capacity
- Prefer matching auditor specialization to case type (TP, RA, FD, etc.)
- Prevent single auditor overload

**Status:** To be implemented

---

### **Sprint 06: Manual Case Referrals** 📋

**Objective:** Enable ad-hoc reassignment of cases after automated cascade.

**Deliverables:**
- `POST /api/v1/ap/cases/{caseId}/reassign` endpoint
- Manual reassignment UI with auditor picker
- Reassignment audit trail

**Business Rules:**
- Team Leader can manually reassign cases
- Provide reason for manual reassignment
- Track all manual changes with user and timestamp

**Status:** To be implemented

---

### **Sprint 07: Case Routing & Assignment** 📋

**Objective:** Formalize case assignment workflow with acceptance/rejection logic.

**Deliverables:**
- Case assignment notification system
- Auditor acceptance/decline workflow
- Escalation if auditor declines

**Business Rules:**
- Cases assigned to auditors
- Auditor can accept or decline with reason
- Declined cases escalate to Team Leader for reallocation

**Status:** To be implemented

---

### **Sprint 08: Auditor Capacity Enforcement** 📋

**Objective:** Enforce resource constraints and prevent overallocation.

**Deliverables:**
- Auditor capacity model (max cases per period)
- Workload validation before assignment
- Capacity alerts and warnings

**Business Rules:**
- Each auditor has maximum active cases (configurable)
- Cannot assign beyond capacity
- Show available capacity in assignment UI
- Queue cases if all auditors at capacity

**Status:** To be implemented

---

## ITAS Alignment

The AP cluster does **not directly map to ITAS roles**, as ITAS focuses on the Committee World and Execution World. However, the AP cluster sets up the foundation:

| Phase | ITAS World | ITAS Roles | AP Role |
| :--- | :--- | :--- | :--- |
| **Annual Planning** | Pre-Committee | Planning Team, Director | Planning Owner, Tax Center Managers, Director |
| **Committee Phase** | Committee World | Committee Member, Chairperson | — (Yoseph JA-CM-RF) |
| **Execution Phase** | Execution World | Team Leader, Auditor | — (Execution Cluster) |

---

## Database Schema Overview

### `ap_annual_audit_plans`
```sql
CREATE TABLE ap_annual_audit_plans (
    id UUID PRIMARY KEY,
    plan_year INTEGER NOT NULL,
    plan_name VARCHAR(256) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',  -- DRAFT, SUBMITTED, APPROVED, FINALIZED
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(64) NOT NULL,
    updated_at TIMESTAMPTZ,
    version BIGINT DEFAULT 0
);
```

### `ap_plan_allocations`
```sql
CREATE TABLE ap_plan_allocations (
    id UUID PRIMARY KEY,
    plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id),
    tax_center_code VARCHAR(64) NOT NULL,
    proposed_count INTEGER NOT NULL,           -- From Risk Engine
    tc_adjusted_count INTEGER,                 -- From Tax Center feedback (Sprint 02)
    tc_justification TEXT,                     -- Tax Center's reason for adjustment
    tc_feedback_submitted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);
```

### `ap_audit_cases` (Created in Sprint 04)
```sql
CREATE TABLE ap_audit_cases (
    id UUID PRIMARY KEY,
    allocation_id UUID NOT NULL REFERENCES ap_plan_allocations(id),
    plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id),
    taxpayer_id VARCHAR(64) NOT NULL,           -- From Risk Engine
    case_number VARCHAR(32) UNIQUE,
    audit_type VARCHAR(32) NOT NULL,            -- TP, RA, FD, MA, etc.
    risk_score INTEGER,                         -- Risk level 0-100
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING_ASSIGNMENT',
    assigned_auditor_id VARCHAR(64),            -- After Sprint 05-07
    assigned_team_id UUID,                      -- After assignment
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(64) NOT NULL
);
```

---

## Technology Stack

- **Backend:** Spring Boot 3.x, Hibernate, PostgreSQL
- **Frontend:** React 19, Vite, Tailwind CSS, RTK Query
- **Architecture:** Hexagonal (Ports & Adapters)
- **Security:** X-Actor-Id header (mock profile for local dev)

---

## Development Workflow

1. **Local Testing:** Frontend on http://localhost:5173, Backend on http://localhost:8080
2. **Database:** PostgreSQL with Flyway migrations in `backend/.../db/migration/`
3. **Git:** Feature branch `feature/pawlos-sprint-01-ap-bootstrap`
4. **Build:** `mvn clean package -DskipTests` (Java) + `npm run build` (React)

---

## Key Files by Sprint

| Sprint | Backend Domain | Controller | Frontend Components |
| :--- | :--- | :--- | :--- |
| 01 | `AnnualAuditPlan`, `PlanAllocation` | `AnnualAuditPlanController` | `CreatePlanModal`, `PlanAllocationList` |
| 02 | `PlanAllocation.submitLocalFeedback()` | `PATCH /.../{allocationId}/feedback` | `FeedbackForm`, `AllocationDetail` |
| 03 | Director override logic | `POST /.../override` | `DirectorApprovalUI` |
| 04+ | `AuditCase`, cascade engine | Cascade service | Case distribution UI |

---

## Current Implementation Status

### ✅ Completed
- Sprint 01 domain models and persistence
- Risk Engine integration (mocked)
- Plan creation API endpoint
- JSON mapping fix for request DTO
- Database schema creation (Flyway)

### 🚧 In Progress
- Frontend plan creation UI
- Feedback submission workflow

### 📋 Planned
- Sprints 03-08
- Case cascade engine
- Auditor capacity constraints
- Assignment workflows

---

## Next Steps

1. **Finish Sprint 01 Frontend:** Complete plan creation UI and display
2. **Implement Sprint 02:** Tax Center feedback workflow
3. **Build Sprint 03-04:** Director override and case cascade trigger
4. **Develop Sprints 05-08:** Advanced case distribution and capacity management
5. **Integration Testing:** End-to-end flow from plan creation to case assignment
6. **Deploy to Main:** Once sprints 01-02 are stable and tested

---

## Contact & Support

**Cluster Owner:** Pawlos  
**Git Branch:** `feature/pawlos-sprint-01-ap-bootstrap`  
**Documentation:** See individual sprint files in `docs/12-sprints/01-pawlos-ap/`  

For questions about AP cluster architecture or tasks, refer to the respective sprint documentation files.
