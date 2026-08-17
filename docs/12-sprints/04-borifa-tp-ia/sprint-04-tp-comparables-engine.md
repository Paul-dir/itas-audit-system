# Sprint 04: Comparables Engine Integration

**Objective:** Integrate the external database (mocked) to pull Arm's Length financial data of comparable independent companies.

**Developer:** Borifa
**Cluster Prefix:** `tp_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 04 (Vertical Slice).
> - **Backend:** Create `ComparablesEnginePort` to mock fetching data from external providers (e.g., Bureau van Dijk / Orbis).

---

## 2. Database Implementation
1. **Flyway Script (`V4_3__tp_comparables.sql`):**
   - Create `tp_comparables_data` (`id`, `audit_case_id`, `company_name`, `financial_year`, `profit_indicator_value`).

---

## 3. Backend Implementation
1. **Integration Port:**
   - Create `ComparablesEnginePort` and `MockComparablesAdapter`.
   - Return 5 fake independent companies with mocked PLI (Profit Level Indicator) percentages (e.g., `[4.5%, 5.1%, 6.0%, 7.2%, 8.0%]`).
2. **Application API:**
   - Implement `GET /api/v1/tp/cases/{caseId}/comparables/fetch`.

---

## 4. Frontend Implementation
1. **UI Components:**
   - Build `<ComparablesDataViewer />`.
   - Render a data table showing the 5 comparable companies pulled from the mock engine. Include checkboxes allowing the auditor to "Reject" specific comparables (qualitative rejection).
