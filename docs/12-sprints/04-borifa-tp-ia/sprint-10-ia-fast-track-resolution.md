# Sprint 10: IA Fast-Track Resolution

**Objective:** Implement Rule 13, allowing the case to be instantly closed if the taxpayer agrees and pays immediately.

**Developer:** Borifa
**Cluster Prefix:** `ia_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 10 (Vertical Slice).
> - **Domain:** Enforce **Rule 13**. Bypass standard EX/TP heavy review chains. Transition immediately to `AWAITING_CM_CLOSURE`.

---

## 2. Backend Implementation
1. **Domain Models:**
   - Implement `fastTrackResolve()`.
2. **Application API:**
   - Implement `POST /api/v1/ia/cases/{caseId}/fast-track`.

---

## 3. Frontend Implementation
1. **UI Components:**
   - Build a `<FastTrackResolutionPanel />`.
   - Include a checkbox: "Taxpayer has agreed and provided proof of payment". Submitting this bypasses the Team Leader completely.
