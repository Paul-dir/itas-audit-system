# Sprint 02: TP Functional Analysis (FAR)

**Objective:** Implement the FAR (Functions, Assets, Risks) profiling form where the auditor documents the MNE's operational structure.

**Developer:** Borifa
**Cluster Prefix:** `tp_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 02 (Vertical Slice).
> - **Database:** Add FAR columns to the TP tables.
> - **Frontend:** Build the complex FAR profiling workspace.

---

## 2. Database Implementation
1. **Flyway Script (`V4_1__tp_far_analysis.sql`):**
   - Create `tp_far_profiles` (`id`, `audit_case_id`, `functions_performed`, `assets_employed`, `risks_assumed`).

---

## 3. Backend Implementation
1. **Application API:**
   - Implement `POST /api/v1/tp/cases/{caseId}/far-profiles`.

---

## 4. Frontend Implementation
1. **UI Components:**
   - Build `<FarAnalysisWorkspace />`.
   - Implement three rich-text editors (Functions, Assets, Risks) so the TP auditor can comprehensively describe the MNE's local entity profile.
