# Sprint 06: TP Adjustment Proposal

**Objective:** Allow the TP auditor to draft the final financial adjustment based on the median of the Arm's Length range.

**Developer:** Borifa
**Cluster Prefix:** `tp_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 06 (Vertical Slice).
> - **Domain:** If the taxpayer margin falls outside the IQR, the proposed adjustment must mathematically bridge the gap between their margin and the Median of the IQR.

---

## 2. Database Implementation
1. **Flyway Script (`V4_5__tp_adjustment.sql`):**
   - Add `proposed_tp_adjustment_etb` to `tp_far_profiles`.

---

## 3. Backend Implementation
1. **Domain Models:**
   - Add `draftAdjustment(adjustmentEtb)` to the Aggregate.
2. **Application API:**
   - Implement `PUT /api/v1/tp/cases/{caseId}/adjustments`.

---

## 4. Frontend Implementation
1. **UI Components:**
   - Build `<TpAdjustmentDraftForm />`.
   - Pre-fill the adjustment amount based on the Math difference from Sprint 05. Allow the auditor to add text justification before submitting.
