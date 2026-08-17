# Sprint 06: Comp Audit CAAT Integration

**Objective:** Implement the Comprehensive Audit phase where the auditor triggers the Computer-Assisted Audit Techniques (CAAT) engine to analyze taxpayer ledgers.

**Developer:** Oliad
**Cluster Prefix:** `ex_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 06 (Vertical Slice).
> - **Database:** Create `ex_comprehensive_audit_details`.
> - **Backend:** Integrate the `CaatEnginePort` mock.
> - **Frontend:** Build the anomaly display panel.

---

## 2. Database Implementation
1. **Flyway Script (`V3__ex_comprehensive_audit.sql`):**
   - Create `ex_comprehensive_audit_details` (`audit_case_id`, `caat_run_date`, `field_visit_required`).

---

## 3. Backend Implementation
1. **Integration Port:**
   - Create `CaatEnginePort` and `MockCaatAdapter` returning JSON anomalies (e.g., "Duplicate Invoice: #1002").
2. **Application API:**
   - Implement `POST /api/v1/ex/cases/{caseId}/comprehensive/caat`.

---

## 4. Frontend Implementation
1. **UI Components:**
   - Build `<ComprehensiveWorkspace />`.
   - Build `<CaatResultsPanel />` displaying the mock anomalies in an actionable checklist so the auditor can flag them for review.
