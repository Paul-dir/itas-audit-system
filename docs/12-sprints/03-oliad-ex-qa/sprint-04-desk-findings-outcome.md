# Sprint 04: Desk Audit Findings & Outcome

**Objective:** Allow the auditor to conclude the Desk Audit by recording the calculated discrepancy and recommending closure or escalation.

**Developer:** Oliad
**Cluster Prefix:** `ex_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 04 (Vertical Slice).
> - **Database:** Add outcome columns to `ex_desk_audit_details`.
> - **Domain:** Calculate total discrepancy.
> - **Frontend:** Provide a form to input tax line discrepancies.

---

## 2. Database Implementation
1. **Flyway Script (`V2_2__ex_desk_outcome.sql`):**
   - Create `ex_desk_audit_details` if not exists, and add `total_discrepancy_etb`, `recommended_action`, `auditor_notes`.

---

## 3. Backend Implementation
1. **Domain Models:**
   - Add `recordOutcome(discrepancyAmount, action)` to `DeskAuditDetails`.
2. **Application API:**
   - Implement `POST /api/v1/ex/cases/{caseId}/desk/outcome`.

---

## 4. Frontend Implementation
1. **UI Components:**
   - Add a `<FindingsAndOutcome />` tab.
   - Provide inputs for the Auditor to log the specific tax codes (e.g., VAT, PIT) where discrepancies were found and calculate the `total_discrepancy_etb`.
