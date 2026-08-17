# Sprint 08: Case Closure Review Inbox

**Objective:** Implement the initial entry point for the Case Management (CM) cluster, allowing Tax Center Managers to view cases that are awaiting final sign-off.

**Developer:** Yoseph
**Cluster Prefix:** `cm_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 05 (Vertical Slice).
> - **Database:** Work in `V8__cm_rf_tables.sql`.
> - **Frontend:** Restrict to `ROLE_TC_MANAGER` and enforce Tax Center row-level security.

---

## 2. Database Implementation
1. **Flyway Script (`V8__cm_rf_tables.sql`):**
   - Create `cm_case_closures` (`id`, `audit_case_id`, `status`).

---

## 3. Backend Implementation
1. **Domain Models:**
   - Create the `CaseClosure` Aggregate Root.
2. **Application API:**
   - Implement `GET /api/v1/cm/closures`.
   - Ensure the query filters for cases where `tax_center_code` matches the current `X-Actor-Id`'s location.

---

## 4. Frontend Implementation
1. **UI Components (`src/features/cm/`):**
   - Build `<ClosureReviewInbox />`.
   - Display a data table of cases waiting for closure (e.g., cases approved by the Team Leader in the EX cluster).
