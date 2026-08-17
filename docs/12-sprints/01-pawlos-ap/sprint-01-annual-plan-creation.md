# Sprint 01: Annual Plan Creation

**Objective:** Implement the foundation of the Annual Audit Plan, allowing the Planning Team to define target quotas based on mocked Risk Engine indicators.

**Developer:** Pawlos
**Cluster Prefix:** `ap_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 01 (Vertical Slice).
> - **Database:** Prefix tables with `ap_`.
> - **Backend:** Mock the `RiskEnginePort`.
> - **Frontend:** Work strictly in `src/features/ap`. Only `ROLE_PROCESS_OWNER` can access this view.

---

## 2. Database Implementation
1. **Flyway Script (`V1__ap_annual_plan.sql`):**
   - Create `ap_annual_audit_plans` (`id`, `plan_year`, `plan_name`, `status`, `created_at`).
   - Create `ap_plan_allocations` (`id`, `plan_id`, `tax_center_code`, `proposed_count`).
   - Define a Foreign Key from allocations to the plan.

---

## 3. Backend Implementation
1. **Domain Models:**
   - Create the `AnnualAuditPlan` Aggregate Root.
   - Create the `PlanAllocation` Entity.
2. **Integration Port:**
   - Create `RiskEnginePort` interface.
   - Create `MockRiskEngineAdapter` that returns hardcoded risk quotas per Tax Center.
3. **Application API:**
   - Implement `POST /api/v1/ap/plans`. This service must call the mock Risk Engine to populate the initial `PlanAllocation` rows automatically when the plan is created.

---

## 4. Frontend Implementation
1. **Redux / State:**
   - Create `apApi.js` using RTK Query. Add `createPlan` mutation.
2. **UI Components:**
   - Build `<PlanCreationDashboard />`.
   - Build a Form requesting `Year` and `Name`.
   - Upon submission, display the newly created plan's generated allocations in a data table.
