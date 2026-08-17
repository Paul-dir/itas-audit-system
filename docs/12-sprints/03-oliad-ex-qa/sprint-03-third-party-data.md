# Sprint 03: Third-Party Data Integration (Mock)

**Objective:** Allow the Desk Auditor to fetch mocked third-party data (e.g., Customs Declarations, Bank transactions) for comparison against tax filings.

**Developer:** Oliad
**Cluster Prefix:** `ex_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 03 (Vertical Slice).
> - **Backend:** Create a `ThirdPartyDataPort`.
> - **Domain:** Provide a mechanism to attach these 3rd party findings to the `DeskAuditDetails`.

---

## 2. Backend Implementation
1. **Integration Port:**
   - Create `ThirdPartyDataPort` with a Mock Adapter. For TIN `111`, return 3 fake Customs Declarations. For TIN `222`, return fake Bank Interest data.
2. **Application API:**
   - Implement `GET /api/v1/ex/cases/{caseId}/third-party-data`.

---

## 3. Frontend Implementation
1. **UI Components:**
   - Inside the `<DeskAuditWorkspace />`, add a `<ThirdPartyDataPanel />`.
   - Add a button "Fetch Customs Data". Display the resulting JSON data in a formatted table so the auditor can compare it to the taxpayer's declared income.
