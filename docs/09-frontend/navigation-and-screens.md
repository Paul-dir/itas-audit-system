# Navigation and Screens

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This document defines the Role-Based dynamic sidebar mapping and the primary screens for each workspace.

---

## 1. Dynamic Sidebar Mappings by Role

The Left Sidebar automatically filters its menu items based on the Keycloak JWT roles. Here is the strict mapping of what each role sees:

### 1.1 Process Owner (`ROLE_PROCESS_OWNER`) / Planning Team
*   **Dashboard:** Overview of national metrics and risks.
*   **Audit Plans:** Workspace to generate and view the Annual Audit Plan.
*   **Risk Analysis:** Access to Risk Engine scores and heatmaps.
*   **Referrals:** Triage internal/external audit requests.

### 1.2 National / Regional Director (`ROLE_DIRECTOR`)
*   **Dashboard:** Roll-up metrics of audit yield and coverage.
*   **Plan Approvals:** Workspace to review, override, and approve `ap_annual_audit_plans`.
*   **Case Approvals:** Workspace to review escalated fraud or complex cases.
*   **Reports:** Access to event-sourced management reports.

### 1.3 Tax Center Manager (`ROLE_TC_MANAGER`)
*   **Dashboard:** Local tax center workload and yield.
*   **Plan Feedback:** Interface to adjust local case targets and submit justifications.
*   **Resource Management:** View auditor capacity and skill availability.

### 1.4 Team Leader (`ROLE_TEAM_LEADER`)
*   **Dashboard:** Team workload and SLA tracking.
*   **Case Assignment:** Workspace to route specific cases to auditors based on skills.
*   **Review Inbox:** Review draft audit reports, evidence, and exit conference notes.

### 1.5 Tax Auditor (`ROLE_AUDITOR`)
*   **My Cases:** The primary workspace showing `ASSIGNED` and `IN_PROGRESS` cases.
*   **Execution Workspace:** Opens when a case is clicked (Desk, Comp, TP, Issue tabs).
*   **Working Papers:** DMS upload interface for evidence.
*   **Notices:** Generate query sheets and assessment notices.

---

## 2. The Main Workspace Views

When a menu item is clicked, the Main Workspace updates. Based on the provided design concepts, workspaces utilize standard layout patterns:

### 2.1 The List / Dashboard Pattern
Used for viewing collections (e.g., Audit Plans list).
- **Header:** Title, Quick Stats (e.g., Total Cases).
- **Toolbar:** Filters, Search, "Create" Primary Button.
- **Data Table:** Columns for ID, Name, Count, Status (using color-coded pill badges), Date.
- **Action Column:** "View", "Edit", or "Approve" context actions.

### 2.2 The Detailed Execution Pattern
Used when an Auditor clicks into a specific `AuditCase`.
- **Top Context Bar:** Taxpayer Name, TIN, Case Status, SLA Timer.
- **Horizontal Tabs:** 
  - `Profile`: Taxpayer registration details.
  - `Plan`: Materiality and Sampling configuration.
  - `Evidence`: File uploads and Third-party matches.
  - `Findings`: Working hypotheses and outcome drafts.
  - `Timeline`: History from the `shared_audit_trail_entries`.

### 2.3 The Right Panel (Contextual)
The right panel provides supplementary information without navigating away:
- In the **Planning** view: Shows Audit Types breakdown and skill availability.
- In the **Assignment** view: Shows the selected Auditor's current active case count and max capacity.
- In the **Execution** view: Shows Risk Engine indicators specific to the taxpayer.
