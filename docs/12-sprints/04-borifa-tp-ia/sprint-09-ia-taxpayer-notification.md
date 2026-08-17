# Sprint 09: IA Taxpayer Notification

**Objective:** Automatically send the single-issue discrepancy notice to the taxpayer.

**Developer:** Borifa
**Cluster Prefix:** `ia_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 09 (Vertical Slice).
> - **Backend:** Integrate the `NotificationEnginePort`.

---

## 2. Backend Implementation
1. **Integration Port:**
   - Inject `NotificationEnginePort`.
2. **Application API:**
   - Implement `POST /api/v1/ia/cases/{caseId}/notify`.
   - The service must log the exact timestamp the notification was dispatched, as the taxpayer has 30 days to respond.

---

## 3. Frontend Implementation
1. **UI Components:**
   - In the Issue view, add a "Send Notice" button. Upon success, display a 30-day countdown timer for taxpayer response.
