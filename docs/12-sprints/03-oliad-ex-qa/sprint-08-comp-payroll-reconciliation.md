# Sprint 08: Comp Audit Payroll Reconciliation

**Objective:** Cross-check the taxpayer's declared PAYE (Pay As You Earn) employee tax against the mocked national pension/social security database.

**Developer:** Oliad
**Cluster Prefix:** `ex_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint XX (Vertical Slice).
> - **Backend:** Inject a `PensionDatabasePort` mock.

---

## 2. Backend Implementation
1. **Integration Port:**
   - Create `PensionDatabasePort`. Mock a response showing the total number of registered employees for the TIN.
2. **Application API:**
   - Implement `GET /api/v1/ex/cases/{caseId}/comprehensive/payroll-check`.

---

## 3. Frontend Implementation
1. **UI Components:**
   - Build `<PayrollReconciliationPanel />`.
   - Compare the taxpayer's declared employee count against the Pension Database. If a discrepancy exists (e.g., "Ghost Employees"), highlight it for a penalty adjustment.
