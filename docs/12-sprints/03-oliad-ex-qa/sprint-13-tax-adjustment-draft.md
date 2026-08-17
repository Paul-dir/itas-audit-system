# Sprint 13: Comp Audit Tax Adjustment Draft

**Objective:** Allow the auditor to aggregate all findings from the CAAT run, Query Sheets, and Field Visit into a formal Draft Tax Adjustment.

**Developer:** Oliad
**Cluster Prefix:** `ex_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 09 (Vertical Slice).
> - **Backend:** Calculate the total tax adjustment and separate the principal tax from the penalty calculations.

---

## 2. Database Implementation
1. **Flyway Script (`V3_3__ex_comp_adjustments.sql`):**
   - Add `proposed_principal_etb` and `proposed_penalty_etb` to `ex_comprehensive_audit_details`.

---

## 3. Backend Implementation
1. **Domain Models:**
   - Add `draftAdjustment(principal, penalty)` to the Comprehensive Audit aggregate.
2. **Application API:**
   - Implement `PUT /api/v1/ex/cases/{caseId}/comprehensive/adjustments`.

---

## 4. Frontend Implementation
1. **UI Components:**
   - Build `<AdjustmentDraftForm />`.
   - Display a summary of all anomalies found earlier in the workflow to help the auditor justify the financial figures entered.
