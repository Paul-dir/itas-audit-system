# Sprint 07: JA Consolidated Findings

**Objective:** Allow the Joint Audit lead to merge the separate findings of the various jurisdictions into one consolidated tax adjustment.

**Developer:** Yoseph
**Cluster Prefix:** `ja_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 04 (Vertical Slice).
> - **Database:** Add consolidated findings columns.
> - **Frontend:** Build the final adjustment form for the JA workflow.

---

## 2. Database Implementation
1. **Flyway Script (`V5_3__ja_consolidated_findings.sql`):**
   - Add `consolidated_principal_etb` and `consolidated_penalty_etb` to `ja_committees`.

---

## 3. Backend Implementation
1. **Domain Models:**
   - Add `submitConsolidatedFindings(principal, penalty)` to the Aggregate.
2. **Application API:**
   - Implement `PUT /api/v1/ja/cases/{caseId}/findings`.

---

## 4. Frontend Implementation
1. **UI Components:**
   - Build `<ConsolidatedFindingsForm />`.
   - Display a read-only table of the independent jurisdictional notes, followed by the input fields for the final consolidated numbers.
