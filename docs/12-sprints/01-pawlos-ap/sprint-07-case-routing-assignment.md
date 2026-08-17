# Sprint 07: Auditor Assignment & Routing

**Objective:** Implement the assignment board where Team Leaders route the generated `AuditCases` to specific auditors or committees based on the audit type.

**Developer:** Pawlos
**Cluster Prefix:** `ap_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 07 (Vertical Slice).
> - **Database:** Add assignment columns to `ap_audit_cases`.
> - **Backend:** Enforce the Routing Rules. TP/Joint cases go to `CommitteeDelegationService` (null tax center). Desk/Comp/Issue cases go to `StandardDelegationService`.
> - **Frontend:** Provide the assignment board for Team Leaders.

---

## 2. Database Implementation
1. **Flyway Script (`V1_6__ap_case_assignments.sql`):**
   - ALTER TABLE `ap_audit_cases` ADD COLUMN `assigned_team_leader_id VARCHAR(64)`.
   - ALTER TABLE `ap_audit_cases` ADD COLUMN `assigned_auditor_id VARCHAR(64)`.
   - ALTER TABLE `ap_audit_cases` ADD COLUMN `assigned_committee_id VARCHAR(64)`.

---

## 3. Backend Implementation
1. **Domain Models:**
   - Implement `assignAuditor(auditorId)` inside the `AuditCase` aggregate. This changes the status from `SELECTED_FOR_AUDIT` to `ASSIGNED`.
2. **Application API:**
   - Implement `POST /api/v1/ap/cases/{id}/assign`.
   - The service checks the `audit_type`. If `TP`, it forces assignment to a Committee ID. If `DESK`, it forces assignment to an Auditor ID.

---

## 4. Frontend Implementation
1. **UI Components:**
   - Build `<AssignmentBoard />` restricted to `ROLE_TEAM_LEADER` and `ROLE_PROCESS_OWNER`.
   - Show a list of unassigned cases. 
   - When a user selects a Desk Audit case, render a dropdown containing a list of Auditors.
   - When a user selects a TP case, render a dropdown containing a list of Committees.
