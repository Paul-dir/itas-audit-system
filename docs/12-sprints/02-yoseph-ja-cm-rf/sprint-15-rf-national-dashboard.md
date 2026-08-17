# Sprint 15: National Reporting Dashboard

**Objective:** Combine the cycle time and yield charts into a master dashboard for the National Director.

**Developer:** Yoseph
**Cluster Prefix:** `rf_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 12 (Vertical Slice).
> - **Frontend:** Restrict to `ROLE_NATIONAL_DIRECTOR`.

---

## 2. Frontend Implementation
1. **UI Components:**
   - Build `<NationalReportingDashboard />`.
   - Arrange the Bar Chart and Pie Chart in a responsive CSS Grid.
   - Add a date-range filter that passes `?startDate=X&endDate=Y` query params to the RF APIs.
