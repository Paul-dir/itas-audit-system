# Sprint 03: JA External Data Sharing

**Objective:** Implement a mechanism for the Joint Audit committee to securely share massive evidence files across departments using the mock DMS.

**Developer:** Yoseph
**Cluster Prefix:** `ja_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 03 (Vertical Slice).
> - **Backend:** Integrate the `DmsPort`.
> - **Frontend:** Build a shared file repository view.

---

## 2. Database Implementation
1. **Flyway Script (`V5_2__ja_evidence.sql`):**
   - Create `ja_shared_evidence` (`id`, `committee_id`, `dms_reference_id`, `uploaded_by_jurisdiction`).

---

## 3. Backend Implementation
1. **Integration Port:**
   - Inject the `DmsPort`.
2. **Application API:**
   - Implement `POST /api/v1/ja/cases/{caseId}/evidence`.

---

## 4. Frontend Implementation
1. **UI Components:**
   - Build `<SharedEvidenceVault />`.
   - Allow members to upload files. Tag each file visually with the `jurisdiction_department` of the uploader so it is clear which agency provided the data.
