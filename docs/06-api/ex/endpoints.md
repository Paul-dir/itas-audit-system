# EX Cluster Endpoints

**Owner:** Oliad
**Prefix:** `/api/v1/ex`

---

## 1. Execution Audit Plans

### 1.1 Create/Submit Plan
`POST /api/v1/ex/cases/{caseId}/plan`
- **Desc:** Creates or submits the detailed execution plan (materiality, scope) for a Desk/Comp case.
- **Body:** `{ "materialityThreshold": 50000.00, "scopeDescription": "VAT for 2025" }`
- **Response:** `201 Created`

### 1.2 Get Plan
`GET /api/v1/ex/cases/{caseId}/plan`

---

## 2. Desk Audit

### 2.1 Record Evidence
`POST /api/v1/ex/cases/{caseId}/desk/evidence`
- **Body:** `{ "sourceType": "INTERNAL", "sourceReference": "doc_123" }`

### 2.2 Complete Desk Audit
`POST /api/v1/ex/cases/{caseId}/desk/complete`
- **Desc:** Submits outcome and escalation recommendation.
- **Body:** `{ "outcome": "BIG_ISSUE", "escalationRecommendation": "Needs field visit" }`

### 2.3 Escalate to Comprehensive
`POST /api/v1/ex/cases/{caseId}/desk/escalate`
- **Desc:** Director explicitly escalates a Desk audit to Comprehensive. Inherits evidence.

---

## 3. Comprehensive Audit

### 3.1 Trigger CAAT Run
`POST /api/v1/ex/cases/{caseId}/comprehensive/caat`
- **Desc:** Triggers the internal CAAT engine for analytics.

### 3.2 Add Query Sheet
`POST /api/v1/ex/cases/{caseId}/comprehensive/queries`
- **Body:** `{ "responseDueAt": "2026-09-01T00:00:00Z", "requestedDocuments": "Bank statements" }`

### 3.3 Submit Execution Report
`POST /api/v1/ex/cases/{caseId}/comprehensive/report`
- **Desc:** Finalizes execution and submits for TL review.
