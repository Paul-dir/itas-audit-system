# Sprint 08: Auditor Capacity Enforcement

**Objective:** Enforce workforce management constraints to prevent Team Leaders from overburdening individual auditors.

**Developer:** Pawlos
**Cluster Prefix:** `ap_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 08 (Vertical Slice).
> - **Backend:** Mock the `WorkforceEnginePort` which tracks auditor capacity limits.
> - **Domain:** Throw a Business Rule Violation if an assignment exceeds capacity without an explicit override reason.
> - **Frontend:** Display live capacity meters in the UI.

---

## 2. Backend Implementation
1. **Integration Port:**
   - Create `WorkforceEnginePort`.
   - Create `MockWorkforceAdapter` that returns hardcoded capacity data (e.g., "Auditor A has 8/10 cases. Auditor B has 10/10 cases").
2. **Domain Logic:**
   - In the Assignment Service, before calling `case.assignAuditor()`, query the `WorkforceEnginePort`. If current active cases >= max capacity, and no `overrideReason` is provided in the JSON body, throw an `IllegalStateException`.
3. **Application API:**
   - Update `POST /api/v1/ap/cases/{id}/assign` to accept the optional `overrideReason`.

---

## 3. Frontend Implementation
1. **UI Components:**
   - In the `<AssignmentBoard />`, add a Right-hand Context Panel.
   - When the Team Leader highlights an Auditor in the dropdown, the Right Panel must query the `WorkforceEnginePort` and show a progress bar (e.g., 8/10 cases).
   - If the bar is full (red), dynamically display a required text box: "Capacity limit reached. Provide override justification."
