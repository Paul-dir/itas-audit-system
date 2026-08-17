# Sprint 10: Query Sheet Management (RFI)

**Objective:** Allow the Comprehensive Auditor to officially request missing information from the taxpayer via a Query Sheet.

**Developer:** Oliad
**Cluster Prefix:** `ex_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 07 (Vertical Slice).
> - **Database:** Create `ex_query_sheets`.
> - **Backend:** Must integrate with `NotificationEnginePort`.
> - **Frontend:** Form to generate and send the RFI.

---

## 2. Database Implementation
1. **Flyway Script (`V3_1__ex_query_sheets.sql`):**
   - Create `ex_query_sheets` (`id`, `audit_case_id`, `requested_documents`, `due_date`, `status`).

---

## 3. Backend Implementation
1. **Integration Port:**
   - Create `NotificationEnginePort` mock to simulate sending an SMS/Email to the taxpayer.
2. **Application API:**
   - Implement `POST /api/v1/ex/cases/{caseId}/comprehensive/queries`.

---

## 4. Frontend Implementation
1. **UI Components:**
   - Build `<QuerySheetManager />`.
   - Include a form specifying the requested documents and a deadline date picker.
   - Show a historical log of previously sent query sheets and their statuses.
