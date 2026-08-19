# Backend vs Frontend Implementation Status

**Key Principle:** Frontend is ONLY a UI layer. ALL data and logic comes from Backend API. NO localStorage, NO seed data, NO frontend business logic.

---

## Backend Implementation Status (Sprint 01-08)

### ✅ Sprint 01: Annual Plan Creation

**Endpoints Implemented:**
- ✅ `POST /api/v1/backoffice/ap/plans` - Create annual plan with auto-populated allocations

**What it does:**
- Accepts: `{ planYear, planName, createdBy }`
- Returns: Full plan object with allocations from Risk Engine
- Database: Saves to `ap_annual_audit_plans` and `ap_plan_allocations` tables

**Request Example:**
```bash
curl -X POST http://localhost:8080/api/v1/backoffice/ap/plans \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: user-001" \
  -d '{"planYear": 2024, "planName": "2024 Annual Plan"}'
```

**Response:**
```json
{
  "id": "57767e1c-9e8a-434d-b0ec-093a4d8b29f9",
  "planYear": 2024,
  "planName": "2024 Annual Plan",
  "status": "DRAFT",
  "createdAt": "2026-08-19T08:32:36.810386196Z",
  "createdBy": "user-001",
  "allocations": [
    {
      "id": "1c6a9417-199c-473d-952d-93fbd757ec6c",
      "planId": "57767e1c-9e8a-434d-b0ec-093a4d8b29f9",
      "taxCenterCode": "TC-ADDIS-02",
      "proposedCount": 120,
      "tcAdjustedCount": null,
      "tcJustification": null,
      "tcFeedbackSubmitted": false,
      "createdAt": "2026-08-19T08:32:36.810773892Z"
    },
    ...
  ]
}
```

---

### ✅ Sprint 02: Tax Center Feedback

**Endpoints Implemented:**
- ✅ `PATCH /api/v1/backoffice/ap/plans/{planId}/allocations/{allocationId}/feedback` - Submit TC feedback

**What it does:**
- Accepts: `{ tcAdjustedCount, tcJustification }`
- Only ROLE_TC_MANAGER can call (checked via X-Actor-Id header)
- Updates allocation with feedback
- Returns: Updated plan object

**Request Example:**
```bash
curl -X PATCH http://localhost:8080/api/v1/backoffice/ap/plans/57767e1c-9e8a-434d-b0ec-093a4d8b29f9/allocations/1c6a9417-199c-473d-952d-93fbd757ec6c/feedback \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: tc-manager-001" \
  -d '{"tcAdjustedCount": 100, "tcJustification": "Our capacity is only 100 cases"}'
```

---

### 📋 Sprint 03: Director Override

**Status:** ❌ NOT IMPLEMENTED

**Needed Endpoint:**
- `POST /api/v1/backoffice/ap/plans/{planId}/override` - Director override of allocations

**What it should do:**
- Only ROLE_DIRECTOR can call
- Accept: `{ allocationId, overriddenCount, overrideReason }`
- Update allocation with director override
- Track who overrode and when

---

### 📋 Sprint 04: Plan Finalization & Case Cascade

**Status:** ❌ NOT IMPLEMENTED

**Needed Endpoints:**
- `POST /api/v1/backoffice/ap/plans/{planId}/finalize` - Finalize plan
- `POST /api/v1/backoffice/ap/plans/{planId}/cascade` - Trigger case creation from allocations

**What it should do:**
- Finalize plan status to FINALIZED
- Create `AuditCase` records (one per quota allocation)
- Each case gets: taxpayer from Risk Engine, audit_type, risk_score, status=PENDING_ASSIGNMENT
- Return list of created cases

---

### 📋 Sprint 05-08: Advanced Features

**Status:** ❌ NOT IMPLEMENTED

**Needed Endpoints:**
- Case cascade engine (Sprint 05)
- Manual case referrals (Sprint 06)
- Case routing & assignment (Sprint 07)
- Auditor capacity enforcement (Sprint 08)

---

## Frontend Implementation Status

### ❌ CURRENT STATE: Using localStorage & Seed Data

**Problem:**
```javascript
// AppContext.jsx uses localStorage instead of backend
const seeded = storage.get(STORE_KEYS.SEEDED);
storage.set(STORE_KEYS.USERS, SEED_USERS);  // ❌ Local seed data
storage.set(STORE_KEYS.PLANS, SEED_PLANS);  // ❌ Local seed data
```

**Result:**
- Frontend has its own "database" in localStorage
- No real data from backend
- Multiple sources of truth (frontend + backend)
- Changes don't persist properly
- Can't scale or share data between users

---

### ✅ What Frontend SHOULD Do

**Architecture:**
```
Frontend UI (React components)
     ↓
API Service Layer (calls backend only)
     ↓
Backend REST API
     ↓
Database
```

**For each action:**
1. Frontend UI calls API service
2. API service makes HTTP request to backend
3. Backend processes and returns data
4. Frontend displays the data
5. **NO localStorage, NO state mutations, NO seed data**

---

## What Needs to be Done

### Phase 1: Clean Frontend Architecture (Required First)

**Steps:**
1. Remove all localStorage logic from AppContext
2. Replace SEED_PLANS, SEED_USERS, SEED_CASES with API calls
3. Create API service for each domain (PlanService, CaseService, UserService)
4. API services call backend endpoints only
5. Frontend state = what's returned from backend (nothing else)

**Example new AppContext:**
```javascript
// Instead of localStorage, fetch from backend
useEffect(() => {
  // Fetch plans from backend
  fetch('/api/v1/backoffice/ap/plans')
    .then(r => r.json())
    .then(plans => dispatch({ type: 'LOAD_PLANS', payload: plans }))
}, [])
```

### Phase 2: Implement Missing Backend Endpoints (Sprint 03-08)

**Priority Order:**
1. Sprint 03: Director Override endpoint
2. Sprint 04: Plan Finalization & Case Cascade endpoints
3. Sprint 05: Case distribution algorithm
4. Sprint 06: Manual reassignment
5. Sprint 07: Assignment workflows
6. Sprint 08: Capacity enforcement

### Phase 3: Connect Frontend to New Endpoints

Once backend has the endpoints, frontend calls them and displays results.

---

## Current API Endpoints Summary

| Sprint | HTTP Method | Endpoint | Status | Notes |
|--------|------------|----------|--------|-------|
| 01 | POST | `/api/v1/backoffice/ap/plans` | ✅ Done | Create plan with auto-populated allocations |
| 02 | PATCH | `/api/v1/backoffice/ap/plans/{planId}/allocations/{allocationId}/feedback` | ✅ Done | Submit Tax Center feedback |
| 03 | POST | `/api/v1/backoffice/ap/plans/{planId}/override` | ❌ Missing | Director override |
| 04 | POST | `/api/v1/backoffice/ap/plans/{planId}/finalize` | ❌ Missing | Finalize plan |
| 04 | POST | `/api/v1/backoffice/ap/plans/{planId}/cascade` | ❌ Missing | Trigger case creation |
| 05 | POST | `/api/v1/backoffice/ap/cases/distribute` | ❌ Missing | Smart case distribution |
| 06 | POST | `/api/v1/backoffice/ap/cases/{caseId}/reassign` | ❌ Missing | Manual reassignment |
| 07 | POST | `/api/v1/backoffice/ap/cases/{caseId}/assign` | ❌ Missing | Auditor assignment |
| 08 | GET | `/api/v1/backoffice/ap/auditors/capacity` | ❌ Missing | Check auditor capacity |

---

## Frontend Should Only Display

✅ What comes from backend:
- Plans fetched via API
- Allocations from backend
- User data from backend
- Case data from backend
- All state = real data from backend

❌ What should NOT be in frontend:
- localStorage
- Seed data
- Business logic (case generation, status transitions, etc.)
- Local "calculations" that differ from backend
- Form data that doesn't get saved to backend

---

## Recommendation

**Immediate Action:**
1. Clean up AppContext to remove localStorage completely
2. Implement missing backend endpoints (Sprint 03-04 critical)
3. Update frontend to fetch real data from backend APIs
4. Test with actual backend responses, not seed data

This ensures:
- Single source of truth (backend database)
- Real-time data consistency
- Scalable to multiple users
- Proper audit trail and tracking
- Backend-driven business logic
