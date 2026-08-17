# Sprint 04: The Fan-in Gate & Deployment

**Objective:** Ensure the plan cannot be finalized until all required approvals are met, and then distribute the final targets.

**Developer:** Pawlos
**Cluster Prefix:** `ap_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 04 (Vertical Slice).
> - **Backend:** Implement **Rule 16** (The Fan-in Gate).
> - **Domain:** A state transition exception must be thrown if the gate rules are violated.

---

## 2. Database Implementation
1. **Flyway Script (`V1_3__ap_deployment.sql`):**
   - ALTER TABLE `ap_annual_audit_plans` ADD COLUMN `deployment_date TIMESTAMPTZ`.

---

## 3. Backend Implementation
1. **Domain Models:**
   - Implement `confirmDeployment()` on the `AnnualAuditPlan` aggregate.
   - **The Fan-in Gate Logic:** Iterate over all `allocations`. If `tc_feedback_submitted == false` for ANY allocation, throw an `IllegalStateException` ("Cannot deploy plan: Tax Center X has not submitted feedback").
2. **Application API:**
   - Implement `POST /api/v1/ap/plans/{planId}/deploy`.

---

## 4. Frontend Implementation
1. **UI Components:**
   - In `<DirectorReviewDashboard />`, add a primary "Deploy National Plan" button.
   - If the API returns the 422 Unprocessable Fan-in Gate error (RFC 7807), catch the error and display an alert banner listing exactly which Tax Centers are holding up the deployment.
