# Sprint 08: Case Closure Review Inbox (CM Cluster Entry Point)

**Objective:** Implement the initial entry point for the Case Management (CM) cluster, allowing Tax Center Managers to view cases that have completed audits and are awaiting final closure sign-off.

**Developer:** Yoseph
**Cluster Prefix:** `cm_` (Case Management)
**ITAS Tasks:** Task 35-39 (Team Leader: Dashboard, workload view, pending approvals)

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 08 (CM Cluster Entry - Closure Inbox).
>
> **Database Schema:**
> - Create `cm_case_closures` table: `id`, `audit_case_id`, `status` (PENDING_REVIEW, APPROVED_BY_LEADER, AWAITING_MANAGER_SIGNOFF, CLOSED), `created_at`
> - Add fields: `submitted_by_team_leader`, `submitted_at`, `manager_reviewed_at`, `review_notes`
> - Row-level security: Filter by tax_center_code
>
> **Backend Service:**
> - Create `CaseClosureService` with methods:
>   - Get closure inbox: Query cases where status = AWAITING_MANAGER_SIGNOFF and tax_center_code matches current user
>   - Get closure detail: Retrieve full case information including findings and adjustments
> - Enforce: Extract X-Actor-Id and resolve their tax_center_code, filter results accordingly
>
> **REST Endpoints:**
> - `GET /api/v1/cm/closures` - Get pending closure cases for current tax center
> - `GET /api/v1/cm/closures/{closureId}` - Get case closure details (findings, adjustments, team leader notes)
> - `GET /api/v1/cm/closures?status=PENDING_REVIEW` - Filter by status
>
> **Frontend Components:**
> - Page `<CaseClosureWorkspace />` - Main CM workspace (restricted to ROLE_TAX_CENTER_MANAGER)
> - Component `<ClosureReviewInbox />` - Data table showing: Case ID | Taxpayer Name | TIN | Status | Submitted Date | Total Adjustment ETB
> - Component `<CaseClosureCard />` - Expandable card showing case summary (approved findings, adjustments, team leader's certification)
> - Filter options: By status (PENDING, APPROVED, CLOSED), date range, tax type
> - Sorting: By submission date (newest first), total adjustment (highest first)
>
> **Access Control:**
> - ROLE_TAX_CENTER_MANAGER: Can only see cases from their own tax center (row-level security)
> - Data table shows only AWAITING_MANAGER_SIGNOFF status initially
> - View tax center details from X-Actor-Id header
>
> **Key Insight:**
> - CM cluster is the final administrative phase
> - Tax Center Manager reviews Team Leader's certified findings
> - This inbox is the entry point showing cases ready for closure
> - Next sprint implements the actual sign-off action

---

## 2. Success Criteria

- ✅ Tax Center Manager can view cases awaiting their closure sign-off
- ✅ Row-level security enforced: Only see cases from own tax center
- ✅ Inbox displays case summary with findings and adjustments
- ✅ Cases filtered by status with date sorting
- ✅ API returns only cases where tax_center_code matches user's location
- ✅ Case closure card shows Team Leader's certification and findings
- ✅ 401 Forbidden if user tries to view other tax center's cases
