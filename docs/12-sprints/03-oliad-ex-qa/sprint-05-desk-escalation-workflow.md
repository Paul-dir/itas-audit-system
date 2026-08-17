# Sprint 05: Desk to Comp Escalation Workflow

**Objective:** Implement Rule 01, forcing an escalation to Comprehensive Audit to require Team Leader approval if the discrepancy exceeds 100,000 ETB.

**Developer:** Oliad
**Cluster Prefix:** `ex_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 05 (Vertical Slice).
> - **Backend:** Implement **Rule 01**.
> - **Domain:** If `total_discrepancy_etb` > 100,000 and the action is `ESCALATE`, the case status must change to `AWAITING_TL_REVIEW`, not `COMPREHENSIVE_AUDIT`.

---

## 2. Backend Implementation
1. **Domain Models:**
   - Implement the `escalateToComprehensive()` method. Check the 100k threshold. If exceeded, require the `WorkflowEnginePort` to initiate an approval process.
2. **Application API:**
   - Implement `POST /api/v1/ex/cases/{caseId}/desk/escalate`.

---

## 3. Frontend Implementation
1. **UI Components:**
   - In the `<FindingsAndOutcome />` tab, if the user clicks "Escalate", run a pre-check.
   - If the discrepancy is > 100,000 ETB, pop up a modal: "High Value Escalation. Mandatory Team Leader Approval required. Please provide justification."
   - Route the case to the Team Leader's inbox upon submission.
