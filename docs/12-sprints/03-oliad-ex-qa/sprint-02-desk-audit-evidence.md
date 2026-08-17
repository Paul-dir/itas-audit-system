# Sprint 02: Desk Audit Evidence Upload

**Objective:** Implement the initial evidence collection phase for Desk Audits, integrating with the mocked Document Management System (DMS).

**Developer:** Oliad
**Cluster Prefix:** `ex_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 02 (Vertical Slice).
> - **Database:** Create `ex_desk_audit_evidence`.
> - **Backend:** You MUST use the `DmsPort` to simulate saving files. Do not write raw bytes to Postgres.
> - **Frontend:** Build a file uploader that pushes documents to the API.

---

## 2. Database Implementation
1. **Flyway Script (`V2_1__ex_desk_evidence.sql`):**
   - Create `ex_desk_audit_evidence` (`id`, `audit_case_id`, `dms_reference_id`, `document_type`, `uploaded_at`).

---

## 3. Backend Implementation
1. **Domain Models:**
   - Create the `DeskAuditDetails` Aggregate. Add the `uploadEvidence(referenceId, type)` method.
2. **Integration Port:**
   - Create `DmsPort` and `MockDmsAdapter` that logs the upload and returns a random UUID representing the file storage reference.
3. **Application API:**
   - Implement `POST /api/v1/ex/cases/{caseId}/desk/evidence` accepting `multipart/form-data`.

---

## 4. Frontend Implementation
1. **UI Components:**
   - Build the `<DeskAuditWorkspace />` with an `<EvidenceUploader />` component supporting drag-and-drop.
