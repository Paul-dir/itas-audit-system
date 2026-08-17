# Sprint 01: TP Risk Assessment (MNE Selection)

**Objective:** Allow the Federal TP Committee to select Multinational Enterprises (MNEs) for audit by capturing a snapshot of the exact financial ratios that triggered the risk.

**Developer:** Borifa
**Cluster Prefix:** `tp_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 01 (Vertical Slice).
> - **Database:** Work in `V4__tp_audit_tables.sql`.
> - **Domain:** Enforce **Rule 02 (Reproducibility)** by saving the financial ratios as a `JSONB` snapshot.

---

## 2. Database Implementation
1. **Flyway Script (`V4__tp_audit_tables.sql`):**
   - Create `tp_risk_assessments` (`id`, `audit_case_id`, `mne_group_name`, `financial_ratios_snapshot`, `status`).

---

## 3. Backend Implementation
1. **Domain Models:**
   - Create the `TpRiskAssessment` Aggregate Root.
2. **Application API:**
   - Implement `POST /api/v1/tp/cases/{caseId}/assessments`. 
   - The JSON body must include the raw financial ratios (e.g., EBIT margins), which the service maps to the `JSONB` column.

---

## 4. Frontend Implementation
1. **UI Components (`src/features/tp/`):**
   - Build `<TpRiskAssessmentForm />` restricted to `ROLE_JA_COMMITTEE` (or TP equivalent).
   - Provide a dynamic key-value input form to capture the financial ratios used to justify the audit.
