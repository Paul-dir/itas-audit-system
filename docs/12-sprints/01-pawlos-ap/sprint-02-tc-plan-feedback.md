# Sprint 02: Tax Center Plan Feedback

**Objective:** Allow Tax Center Managers to view their specific allocation and propose adjustments based on local reality.

**Developer:** Pawlos
**Cluster Prefix:** `ap_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 02 (Vertical Slice).
> - **Database:** Add feedback columns to `ap_plan_allocations`.
> - **Backend:** Ensure the original `proposed_count` is NEVER overwritten.
> - **Frontend:** Restrict access to `ROLE_TC_MANAGER` and enforce row-level security so they only see their own Tax Center.

---

## 2. Database Implementation
1. **Flyway Script (`V1_1__ap_tc_feedback.sql`):**
   - ALTER TABLE `ap_plan_allocations` ADD COLUMN `tc_adjusted_count INT`.
   - ALTER TABLE `ap_plan_allocations` ADD COLUMN `tc_justification TEXT`.
   - ALTER TABLE `ap_plan_allocations` ADD COLUMN `tc_feedback_submitted BOOLEAN DEFAULT FALSE`.

---

## 3. Backend Implementation
1. **Domain Models:**
   - Add `submitLocalFeedback(count, justification)` method to the `PlanAllocation` entity. Enforce that justification cannot be null if the count differs from the proposal.
2. **Application API:**
   - Implement `PATCH /api/v1/ap/plans/{planId}/allocations/{id}/feedback`.
   - Enforce Security: Extract `X-Actor-Id`, resolve their Tax Center, and throw `403 Forbidden` if they try to edit another TC's allocation.

---

## 4. Frontend Implementation
1. **Redux / State:**
   - Add `submitFeedback` mutation to `apApi.js`.
2. **UI Components:**
   - Build `<TaxCenterFeedbackWorkspace />`.
   - Display a read-only view of the `proposed_count`.
   - Provide an input box for `tc_adjusted_count` and a required text area for `tc_justification`.
