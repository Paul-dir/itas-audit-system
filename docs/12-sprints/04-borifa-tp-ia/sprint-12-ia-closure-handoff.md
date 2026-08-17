# Sprint 12: IA Closure Hand-off

**Objective:** Finalize the Issue Audit by integrating with the CM cluster logic to cleanly post the single-issue liability to the ledger.

**Developer:** Borifa
**Cluster Prefix:** `ia_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 12 (Vertical Slice).
> - **Backend:** Ensure the Issue aggregate outputs the same standard event format expected by the `CaseManagementService` in Sprint 05 (Yoseph).

---

## 2. Backend Implementation
1. **Application API:**
   - Map the `ia_issue_details.identified_penalty_etb` to the generic DTO required by the CM closure inbox.

---

## 3. Frontend Implementation
1. **UI Components:**
   - Ensure the Local Tax Center Manager can see the Fast-Tracked IA cases in their `cm_` inbox for final ledger sign-off alongside the heavy EX cases.
