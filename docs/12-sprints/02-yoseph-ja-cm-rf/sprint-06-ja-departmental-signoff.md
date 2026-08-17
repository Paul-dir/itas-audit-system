# Sprint 06: JA Departmental Pre-Signoff

**Objective:** Ensure every individual jurisdiction/department officially locks their findings before the Lead Auditor executes the final consolidation.

**Developer:** Yoseph
**Cluster Prefix:** `ja_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint XX (Vertical Slice).
> - **Backend:** A Consolidated Finding cannot be submitted unless all jurisdictions have a `pre_signoff_status = TRUE`.

---

## 2. Backend Implementation
1. **Domain Models:**
   - Add `submitJurisdictionSignoff(actorId)` to the committee aggregate.
2. **Application API:**
   - Implement `POST /api/v1/ja/cases/{caseId}/members/signoff`.

---

## 3. Frontend Implementation
1. **UI Components:**
   - Build `<DepartmentalLockPanel />`.
   - Each committee member sees a "Lock My Findings" button. The Lead Auditor sees a checklist of which departments have locked their work and which are still pending.
