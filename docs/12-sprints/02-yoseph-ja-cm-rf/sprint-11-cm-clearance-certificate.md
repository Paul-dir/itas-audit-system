# Sprint 11: Taxpayer Clearance Certificate

**Objective:** Generate a clearance certificate or formal notification for the taxpayer proving the audit is concluded.

**Developer:** Yoseph
**Cluster Prefix:** `cm_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 08 (Vertical Slice).
> - **Backend:** Integrate the `NotificationEnginePort` from Sprint 00.

---

## 2. Backend Implementation
1. **Application API:**
   - Implement `POST /api/v1/cm/closures/{closureId}/certificate`.
   - The service formats a basic text template and invokes `NotificationEnginePort.sendToTaxpayer()`.

---

## 3. Frontend Implementation
1. **UI Components:**
   - Add a "Send Clearance Notification" button to the closed case view.
   - Show a success toast when the API responds.
