# Sprint 07: Comprehensive Bank Reconciliation

**Objective:** Expand the Comprehensive Audit to include a dedicated module for matching taxpayer-declared ledgers against mocked external banking data.

**Developer:** Oliad
**Cluster Prefix:** `ex_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 14 (Vertical Slice).
> - **Backend:** Integrate the `ThirdPartyDataPort` specifically for Bank Statements.
> - **Frontend:** Build a side-by-side reconciliation grid.

---

## 2. Backend Implementation
1. **Application API:**
   - Implement `GET /api/v1/ex/cases/{caseId}/comprehensive/bank-reconciliation`.
   - The service fetches the taxpayer's uploaded ledger and the bank's mock data, running a naive matching algorithm to highlight unmatched deposits.

---

## 3. Frontend Implementation
1. **UI Components:**
   - Build `<BankReconciliationGrid />`.
   - Display a two-column view (Ledger vs Bank). Unmatched rows are highlighted in red for the auditor's review.
