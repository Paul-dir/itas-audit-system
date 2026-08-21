# Plan Routing to Regional Directors - Implementation Plan

## Current Status
✅ Database tables exist for regional feedback and deployments
✅ Backend endpoints partially implemented
❌ Frontend doesn't use real backend data (uses localStorage)
❌ Regional filtering not implemented on frontend
❌ Database persistence for frontend data missing

## Workflow Overview

```
Planning Team Creates Plan
         ↓
    [DRAFT STATUS]
         ↓
  Submit to Director
         ↓
    [SUBMITTED_TO_DIRECTOR]
         ↓
  Director Reviews & Approves
         ↓
    [DIRECTOR_APPROVED]
         ↓
  Route to ALL Regional Directors
  (each region sees ONLY their allocated cases)
         ↓
    [AWAITING_REGIONAL_FEEDBACK]
         ↓
  Regions Review & Submit Feedback
         ↓
    [FEEDBACK_COLLECTED]
         ↓
  Director Reviews Regional Feedback
         ↓
    [FINAL_APPROVED]
         ↓
  Plans Active for Case Generation
```

## Database Tables Involved

### 1. `ap_annual_audit_plans`
```sql
- id: UUID (primary key)
- plan_year: INT
- plan_name: VARCHAR(256)
- status: VARCHAR(32) -- DRAFT, SUBMITTED_TO_DIRECTOR, DIRECTOR_APPROVED, etc
- director_comment: TEXT
- senior_comment: TEXT
- amendment_comment: TEXT
- created_by: VARCHAR(64)
- created_at: TIMESTAMPTZ
```

### 2. `ap_plan_allocations`
```sql
- id: UUID
- annual_plan_id: UUID (FK to plans)
- tax_center_code: VARCHAR(64) -- identifies region + tax center
- proposed_count: INT -- number of cases
```

### 3. `ap_regional_feedback`
```sql
- id: UUID
- plan_id: UUID (FK to plans)
- region_id: VARCHAR(64) -- identifies region
- feedback_text: TEXT
- submitted_by: VARCHAR(64) -- regional director ID
- submitted_at: TIMESTAMPTZ
```

### 4. `ap_regional_deployments`
```sql
- id: UUID
- plan_id: UUID (FK to plans)
- region_id: VARCHAR(64)
- deployed_by: VARCHAR(64)
- deployed_at: TIMESTAMPTZ
```

## Backend Endpoints Needed

### 1. GET Regional Plans for Director
```
GET /api/v1/backoffice/ap/plans/by-status?status=DIRECTOR_APPROVED
Response: List of plans approved by director, ready to send to regions
```

### 2. GET Plans for Regional Director
```
GET /api/v1/backoffice/ap/plans/for-region/{regionId}
Response: Only plans allocated to this region
```

### 3. POST Route Plan to Regions
```
POST /api/v1/backoffice/ap/plans/{planId}/route-to-regions
Body: { "regions": ["region-addis", "region-oromia"] }
Response: Plan status changed, ap_regional_deployments created
```

### 4. GET Regional Allocations for Plan
```
GET /api/v1/backoffice/ap/plans/{planId}/regional-allocations
Response: {
  "planId": "...",
  "regions": [
    {
      "regionId": "region-addis",
      "allocations": [
        { "taxCenterCode": "tc-aa-1", "count": 50 },
        { "taxCenterCode": "tc-aa-2", "count": 45 }
      ]
    }
  ]
}
```

### 5. POST Submit Regional Feedback
```
POST /api/v1/backoffice/ap/plans/{planId}/regional-feedback
Body: {
  "regionId": "region-addis",
  "feedback": "Approved. Tax centers ready to execute.",
  "allocations": { "tc-aa-1": 50, "tc-aa-2": 45 }
}
Response: Feedback saved to ap_regional_feedback table
```

## Frontend Changes Needed

### 1. Director Dashboard - Approve & Route Plans
```javascript
// Load plans from backend
GET /api/v1/backoffice/ap/plans/by-status?status=DIRECTOR_APPROVED

// Button: "Route to Regions"
POST /api/v1/backoffice/ap/plans/{planId}/route-to-regions

// Update status locally from DIRECTOR_APPROVED → AWAITING_REGIONAL_FEEDBACK
```

### 2. Regional Director Dashboard - View Plans
```javascript
// Load ONLY regional plans from backend
GET /api/v1/backoffice/ap/plans/for-region/{regionId}

// Display regional allocations
GET /api/v1/backoffice/ap/plans/{planId}/regional-allocations

// Show feedback form
POST /api/v1/backoffice/ap/plans/{planId}/regional-feedback
```

### 3. Replace localStorage with Backend Calls
Currently: Plans loaded from `storage.get(STORE_KEYS.PLANS, SEED_PLANS)`

Replace with: Fetch from backend based on user role and region

```javascript
// For Director
fetch('/api/v1/backoffice/ap/plans/by-status?status=DIRECTOR_APPROVED')

// For Regional Director
fetch('/api/v1/backoffice/ap/plans/for-region/region-addis')

// For Tax Center Manager
fetch('/api/v1/backoffice/ap/plans/for-tax-center/tc-aa-1')
```

## Implementation Steps

### Phase 1: Backend - Implement Missing Endpoints (1-2 days)
1. Create method to get plans by status
2. Create method to filter plans by region
3. Implement route-to-regions endpoint
4. Implement regional-allocations endpoint
5. Enhance submit-feedback endpoint to save allocations
6. Add response DTOs for all endpoints

### Phase 2: Database - Add Queries
1. Query to find regional allocations for a plan
2. Query to extract region from tax_center_code
3. Query to fetch plans for specific region

### Phase 3: Frontend - Replace localStorage with API Calls
1. Update DirectorDashboard to fetch from backend
2. Update RegionalDashboard to fetch from backend
3. Update plan submission flow to use API
4. Update regional feedback flow to use API
5. Remove localStorage dependency (except login session)

### Phase 4: Testing
1. Director approves plan
2. System automatically routes to regions
3. Each region sees only their plans
4. Region submits feedback
5. Feedback appears in database

## Example Plan Flow

**Initial State (Planning Team Creates):**
```javascript
{
  "id": "plan-001",
  "name": "FY2026 National Plan",
  "status": "DRAFT",
  "allocations": {
    "region-addis": { "total": 95, "taxCenters": { "tc-aa-1": 50, "tc-aa-2": 45 } },
    "region-oromia": { "total": 80, "taxCenters": { "tc-or-1": 80 } }
  }
}
```

**After Director Approval + Routing:**
```javascript
// ap_regional_deployments created for each region:
{
  "plan_id": "plan-001",
  "region_id": "region-addis",
  "deployed_by": "director-001",
  "deployed_at": "2026-08-21T10:00:00Z"
},
{
  "plan_id": "plan-001",
  "region_id": "region-oromia",
  "deployed_by": "director-001",
  "deployed_at": "2026-08-21T10:00:00Z"
}

// Plan status: AWAITING_REGIONAL_FEEDBACK
```

**Regional Director Views Plan:**
```
GET /api/v1/backoffice/ap/plans/for-region/region-addis
Response: Only shows plan-001 with Addis Ababa allocations
```

**Regional Director Submits Feedback:**
```
POST /api/v1/backoffice/ap/plans/plan-001/regional-feedback
{
  "regionId": "region-addis",
  "feedback": "Approved. Ready to execute.",
  "allocations": { "tc-aa-1": 50, "tc-aa-2": 45 }
}

// Saves to ap_regional_feedback table
// When all regions submit, status changes to FEEDBACK_COLLECTED
```

## Notes
- Tax center codes contain region info: `tc-{region-short}-{number}` (e.g., `tc-aa-1` = Addis Ababa TC 1)
- Regional deployments track routing for audit purposes
- Regional feedback is separate from plan allocations (can be different)
- All changes must be persisted in database, not localStorage

