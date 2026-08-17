# Sprint 13: Cycle Time Metrics Read Model

**Objective:** Expose the CQRS read model for case duration to the frontend.

**Developer:** Yoseph
**Cluster Prefix:** `rf_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 10 (Vertical Slice).
> - **Backend:** Query `rf_case_metrics` to calculate averages.

---

## 2. Backend Implementation
1. **Application API:**
   - Implement `GET /api/v1/rf/reports/cycle-times`.
   - Return aggregation data (e.g., average duration per Tax Center).

---

## 3. Frontend Implementation
1. **UI Components (`src/features/rf/`):**
   - Install `recharts` (if not already present).
   - Build a Bar Chart component mapping Tax Centers to Average Duration Days.
