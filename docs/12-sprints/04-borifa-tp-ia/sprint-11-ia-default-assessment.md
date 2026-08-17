# Sprint 11: IA Default Assessment

**Objective:** Automatically generate a default assessment if the 30-day taxpayer response window expires.

**Developer:** Borifa
**Cluster Prefix:** `ia_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 11 (Vertical Slice).
> - **Backend:** This must be an automated background job, not a manual UI click.

---

## 2. Backend Implementation
1. **Domain Logic:**
   - Create an `@Scheduled` job `DefaultAssessmentJob`.
   - It scans `ia_issue_details` where `status = NOTIFIED` and `currentDate > notifiedAt + 30 days`.
   - For all matching cases, it transitions the state to `DEFAULT_ASSESSMENT_GENERATED` and pushes it to the CM closure inbox.

---

## 3. Frontend Implementation
1. **UI Components:**
   - Add a badge to the Issue Workspace showing cases that were resolved via "Default Assessment" vs "Fast Track".
