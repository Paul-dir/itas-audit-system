# Sprint 03: Director Overrides

**Objective:** Allow National/Regional Directors to review TC feedback and explicitly override targets, preparing the plan for finalization.

**Developer:** Pawlos
**Cluster Prefix:** `ap_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 03 (Vertical Slice).
> - **Database:** Add override columns.
> - **Backend:** Implement **Rule 15** (Overrides must be tracked separately from Proposals and TC Adjustments).
> - **Frontend:** Restrict to `ROLE_DIRECTOR`. Provide a holistic view of all Tax Centers.

---

## 2. Database Implementation
1. **Flyway Script (`V1_2__ap_director_overrides.sql`):**
   - ALTER TABLE `ap_plan_allocations` ADD COLUMN `director_override_count INT`.
   - ALTER TABLE `ap_plan_allocations` ADD COLUMN `director_override_reason TEXT`.

---

## 3. Backend Implementation
1. **Domain Models:**
   - Add `applyDirectorOverride(count, reason)` method to the `PlanAllocation` entity.
2. **Application API:**
   - Implement `PATCH /api/v1/ap/plans/{planId}/allocations/{id}/override`.
   - The API must calculate the `finalCount` (which resolves to `director_override_count` if present, else `tc_adjusted_count` if present, else `proposed_count`).

---

## 4. Frontend Implementation
1. **UI Components:**
   - Build `<DirectorReviewDashboard />`.
   - Render a master table showing: TC Name | Proposed | TC Adjusted | TC Justification | Director Override.
   - Implement an inline-edit feature to apply the override without leaving the table view.
