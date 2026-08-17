# Sprint 14: Financial Yield Read Model

**Objective:** Expose the CQRS read model for financial tax yield (adjustments vs penalties).

**Developer:** Yoseph
**Cluster Prefix:** `rf_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 11 (Vertical Slice).
> - **Database:** Add yield columns to `rf_case_metrics`.
> - **Backend:** Expose yield aggregation endpoints.

---

## 2. Database Implementation
1. **Flyway Script (`V8_4__rf_yield_metrics.sql`):**
   - Add `principal_yield_etb` and `penalty_yield_etb` to `rf_case_metrics`.

---

## 3. Backend Implementation
1. **Application API:**
   - Implement `GET /api/v1/rf/reports/financial-yield`.
   - Return total yields grouped by `audit_type`.

---

## 4. Frontend Implementation
1. **UI Components:**
   - Build a Pie Chart component mapping Audit Types (Desk vs Comp vs TP) to Total ETB Generated.
