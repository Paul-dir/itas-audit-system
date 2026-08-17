# Sprint 05: Case Cascade & Auto-Generation

**Objective:** Once the plan is approved, automatically generate the specific taxpayer `AuditCase` records to fulfill the finalized numerical quotas.

**Developer:** Pawlos
**Cluster Prefix:** `ap_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 05 (Vertical Slice).
> - **Database:** Create the `ap_audit_cases` table.
> - **Backend:** Iterate over the finalized plan allocations and call the `RiskEnginePort` to fetch the exact number of high-risk TINs needed. 
> - **Domain:** Enforce **Rule 11 (Source Tracking)**. The generated cases must have `source = RISK_ENGINE`.

---

## 2. Database Implementation
1. **Flyway Script (`V1_4__ap_audit_cases.sql`):**
   - Create `ap_audit_cases` (`id`, `plan_id`, `tin`, `tax_center_code`, `audit_type`, `status`, `source`, `created_at`).

---

## 3. Backend Implementation
1. **Domain Models:**
   - Create the `AuditCase` Aggregate Root with initial state `SELECTED_FOR_AUDIT`.
2. **Application API / Service:**
   - Implement `CaseCascadeService.generateCasesForPlan(planId)`.
   - For a Tax Center with a `finalCount` of 50, call `RiskEnginePort.getHighRiskTaxpayers(taxCenter, 50)`.
   - Save 50 `AuditCase` entities.
   - Expose `GET /api/v1/ap/cases` to list the generated cases.

---

## 4. Frontend Implementation
1. **UI Components:**
   - Build `<CaseSelectionDashboard />` for the `ROLE_PROCESS_OWNER`.
   - Display a data table of all generated `AuditCases`. Include a filter for Tax Center and Audit Type.
