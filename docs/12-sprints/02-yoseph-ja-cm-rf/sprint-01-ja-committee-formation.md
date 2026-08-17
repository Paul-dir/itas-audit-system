# Sprint 01: JA Committee Formation

**Objective:** Implement the initial setup for a Joint Audit where highly complex cases are assigned to a federal committee rather than a single auditor.

**Developer:** Yoseph
**Cluster Prefix:** `ja_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 01 (Vertical Slice).
> - **Database:** Work in `V5__ja_tables.sql`.
> - **Backend:** Ensure the Joint Audit uses `CommitteeDelegationService` logic.
> - **Frontend:** Restrict access to `ROLE_JA_COMMITTEE`.

---

## 2. Database Implementation
1. **Flyway Script (`V5__ja_tables.sql`):**
   - Create `ja_committees` (`id`, `audit_case_id`, `lead_auditor_id`, `status`).

---

## 3. Backend Implementation
1. **Domain Models:**
   - Create the `JointAuditCommittee` Aggregate Root.
2. **Application API:**
   - Implement `POST /api/v1/ja/cases/{caseId}/committee`. 
   - Establish the committee and set the `lead_auditor_id` to the `X-Actor-Id` initiating the request.

---

## 4. Frontend Implementation
1. **UI Components:**
   - Build `<JointAuditWorkspace />`.
   - Build a `<CommitteeBuilder />` header component showing the Lead Auditor and the current status of the committee.
