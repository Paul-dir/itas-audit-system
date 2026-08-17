# Sprint 16: TC Manager Local Dashboard

**Objective:** Provide a filtered, localized version of the reporting dashboard for Tax Center Managers.

**Developer:** Yoseph
**Cluster Prefix:** `rf_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 13 (Vertical Slice).
> - **Frontend:** Enforce Row-Level Security in the UI calls. Restrict to `ROLE_TC_MANAGER`.

---

## 2. Frontend Implementation
1. **UI Components:**
   - Build `<LocalReportingDashboard />`.
   - This component reuses the exact same Bar and Pie charts, but forces the `?taxCenterCode=` query parameter based on the logged-in user's profile, ensuring they only see their local analytics.
