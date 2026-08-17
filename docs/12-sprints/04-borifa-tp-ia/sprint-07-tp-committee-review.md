# Sprint 07: TP Committee Review

**Objective:** The Federal TP Committee reviews the complex TP execution and approves it for closure.

**Developer:** Borifa
**Cluster Prefix:** `tp_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 07 (Vertical Slice).
> - **Backend:** Enforce Row-Level Security: Only members of the `assigned_committee_id` can approve this case.

---

## 2. Backend Implementation
1. **Application API:**
   - Implement `POST /api/v1/tp/cases/{caseId}/approve`.
   - Validate `X-Actor-Id` against the committee members.

---

## 3. Frontend Implementation
1. **UI Components:**
   - Build `<TpCommitteeReviewInbox />`.
   - Show a read-only consolidation of the FAR analysis, Method Selection, Comparables, and the IQR calculation.
