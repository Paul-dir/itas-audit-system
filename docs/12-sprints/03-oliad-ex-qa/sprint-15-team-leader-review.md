# Sprint 15: Team Leader Review

**Objective:** The Team Leader reviews the comprehensive audit execution and either approves it for closure or sends it back to the auditor for rework.

**Developer:** Oliad
**Cluster Prefix:** `ex_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 11 (Vertical Slice).
> - **Backend:** Enforce Row-Level Security: Only the `assigned_team_leader_id` can approve.
> - **Frontend:** Restrict to `ROLE_TEAM_LEADER`.

---

## 2. Backend Implementation
1. **Application API:**
   - Implement `POST /api/v1/ex/cases/{caseId}/comprehensive/approve`.
   - Check `X-Actor-Id` against the case's TL ID.

---

## 3. Frontend Implementation
1. **UI Components:**
   - Build `<TeamLeaderReviewInbox />`.
   - Show a read-only consolidation of Sprints 06 through 10.
   - Provide "Approve" and "Request Rework" buttons.
