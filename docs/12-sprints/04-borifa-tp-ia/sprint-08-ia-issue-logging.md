# Sprint 08: IA Issue Logging

**Objective:** Initiate a fast-track Issue Audit by defining the single specific discrepancy (e.g., Missing VAT receipt).

**Developer:** Borifa
**Cluster Prefix:** `ia_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 08 (Vertical Slice).
> - **Database:** Work in `V6__ia_tables.sql`.
> - **Domain:** Issue Audits are strictly limited to one topic.

---

## 2. Database Implementation
1. **Flyway Script (`V6__ia_tables.sql`):**
   - Create `ia_issue_details` (`id`, `audit_case_id`, `issue_category`, `issue_description`, `identified_penalty_etb`).

---

## 3. Backend Implementation
1. **Application API:**
   - Implement `POST /api/v1/ia/cases/{caseId}/issues`.

---

## 4. Frontend Implementation
1. **UI Components (`src/features/ia/`):**
   - Build `<IssueLoggingForm />`.
   - Provide a dropdown for `issue_category` (e.g., VAT, PIT, WHT) and a numeric input for the strict penalty amount.
