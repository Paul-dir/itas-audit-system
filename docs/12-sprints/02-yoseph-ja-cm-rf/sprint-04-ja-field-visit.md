# Sprint 04: JA Field Visit Coordination

**Objective:** Coordinate complex multi-department field visits where representatives from Customs, Federal Tax, and Regional authorities visit the MNE simultaneously.

**Developer:** Yoseph
**Cluster Prefix:** `ja_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint XX (Vertical Slice).
> - **Database:** Add field visit scheduling to the JA cluster.
> - **Frontend:** Provide a shared calendar UI for the committee.

---

## 2. Backend Implementation
1. **Application API:**
   - Implement `POST /api/v1/ja/cases/{caseId}/field-visits`.
   - The API must broadcast an internal notification (via mock port) to all committee members when a date is proposed.

---

## 3. Frontend Implementation
1. **UI Components:**
   - Build `<JointFieldVisitScheduler />`.
   - Embed a calendar component allowing the Lead Auditor to propose a date. Other members can click "Acknowledge" or "Propose New Time".
