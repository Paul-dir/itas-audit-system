# Sprint 11: Third-Party Summons (Legal)

**Objective:** Allow the Comprehensive Auditor to escalate a Query Sheet (RFI) into a formal Legal Summons if the taxpayer or a 3rd party refuses to cooperate.

**Developer:** Oliad
**Cluster Prefix:** `ex_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 15 (Vertical Slice).
> - **Database:** Add summons tracking to `ex_query_sheets`.

---

## 2. Backend Implementation
1. **Domain Models:**
   - Add `escalateToSummons()` on the Query Sheet entity, changing its status to `LEGAL_SUMMONS_ISSUED`.
2. **Application API:**
   - Implement `POST /api/v1/ex/cases/{caseId}/comprehensive/queries/{queryId}/summons`.

---

## 3. Frontend Implementation
1. **UI Components:**
   - In the `<QuerySheetManager />`, if a query is past its `due_date`, reveal a red "Issue Legal Summons" button.
