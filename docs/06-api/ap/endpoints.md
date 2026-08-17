# AP Cluster Endpoints

**Owner:** Pawlos
**Prefix:** `/api/v1/ap`

---

## 1. Annual Audit Plan

### 1.1 Create Plan
`POST /api/v1/ap/plans`
- **Desc:** Creates a new annual plan in DRAFT status.
- **Body:** `{ "year": 2026, "name": "FY2026 National Plan" }`
- **Response:** `201 Created`

### 1.2 Get Plan
`GET /api/v1/ap/plans/{id}`
- **Desc:** Retrieves the plan and its allocation tree.

### 1.3 Submit Override
`POST /api/v1/ap/plans/{id}/allocations/{allocationId}/override`
- **Desc:** Submits an override for a specific allocation node.
- **Body:** `{ "overrideCount": 50, "level": "REGIONAL", "reason": "High risk sector" }`

### 1.4 Confirm Deployment (Fan-in Gate)
`POST /api/v1/ap/plans/{id}/allocations/{allocationId}/confirm`
- **Desc:** Tax center confirms deployment of their target numbers.

---

## 2. Audit Cases

### 2.1 Get Cases
`GET /api/v1/ap/cases`
- **Query Params:** `?tin=123&status=SELECTED_FOR_AUDIT&taxCenterCode=TC-01`
- **Response:** Paginated list of cases.

### 2.2 Get Case Detail
`GET /api/v1/ap/cases/{id}`
- **Response:** Full case details (does not include EX/TP specific data, those must be queried from their respective cluster APIs).

### 2.3 Assign Case
`POST /api/v1/ap/cases/{id}/assign`
- **Desc:** Assigns an auditor and team leader to a case (Standard Delegation).
- **Body:** `{ "auditorId": "aud_123", "teamLeaderId": "tl_456" }`

### 2.4 Reassign Case
`POST /api/v1/ap/cases/{id}/reassign`
- **Desc:** Reassigns a case with a mandatory reason.
- **Body:** `{ "newAuditorId": "aud_999", "reason": "Previous auditor on leave" }`
