# Sprint 03: TP Method Selection

**Objective:** Allow the TP auditor to officially select and justify the Transfer Pricing method to be applied to the related-party transactions.

**Developer:** Borifa
**Cluster Prefix:** `tp_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 03 (Vertical Slice).
> - **Database:** Store the selected method (e.g., TNMM, CUP).
> - **Domain:** The selected method dictates the required fields in future sprints.

---

## 2. Database Implementation
1. **Flyway Script (`V4_2__tp_method_selection.sql`):**
   - Add `tp_method` and `method_justification` to `tp_far_profiles` (or a dedicated execution table).

---

## 3. Backend Implementation
1. **Application API:**
   - Implement `PUT /api/v1/tp/cases/{caseId}/method`.
   - Validate that `tp_method` is one of `[CUP, RESALE_MINUS, COST_PLUS, TNMM, PROFIT_SPLIT]`.

---

## 4. Frontend Implementation
1. **UI Components:**
   - Build `<TpMethodSelector />`.
   - Use a radio button group for the 5 OECD methods. Upon selection, dynamically show a "Justification for Rejection of Other Methods" mandatory text area.
