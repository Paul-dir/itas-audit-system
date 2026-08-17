# Sprint 01: Audit Execution Planning (Materiality)

**Objective:** Allow the assigned auditor to define the materiality threshold and overall scope before a Desk or Comprehensive audit formally begins.

**Developer:** Oliad
**Cluster Prefix:** `ex_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 01 (Vertical Slice) for the EX cluster.
> - **Database:** Work in `V2__ex_execution_tables.sql` defining `ex_audit_plans`.
> - **Backend:** Enforce Row-Level Security: Only the assigned auditor (`X-Actor-Id` matches `assigned_auditor_id` in AP cases) can create this plan.
> - **Frontend:** Build the UI strictly in `src/features/ex`.

---

## 2. Database Implementation
1. **Flyway Script (`V2__ex_execution_tables.sql`):**
   - Create `ex_audit_plans` (`id`, `audit_case_id`, `materiality_threshold`, `scope_description`, `status`).

---

## 3. Backend Implementation
1. **Domain Models:**
   - Create the `ExAuditPlan` Aggregate Root.
2. **Application API:**
   - Implement `POST /api/v1/ex/cases/{caseId}/plan`. 
   - Fetch the case from the `AuditCaseRepositoryPort` (mocked port to AP cluster). If `X-Actor-Id` != assigned auditor, throw `403 Forbidden`.

---

## 4. Frontend Implementation
1. **UI Components:**
   - Build `<AuditPlanningForm />` allowing the input of the Materiality Threshold (numeric ETB) and the Scope (rich text).
