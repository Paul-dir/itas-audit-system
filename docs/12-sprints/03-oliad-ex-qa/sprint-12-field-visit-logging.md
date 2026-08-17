# Sprint 12: Field Visit Evidence Logging

**Objective:** Provide a mobile-friendly interface for the Comprehensive Auditor to log notes and photographic evidence while physically at the taxpayer's premises.

**Developer:** Oliad
**Cluster Prefix:** `ex_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 08 (Vertical Slice).
> - **Database:** Add field visit columns.
> - **Backend:** Connect to `DmsPort`.

---

## 2. Database Implementation
1. **Flyway Script (`V3_2__ex_field_visits.sql`):**
   - ALTER TABLE `ex_comprehensive_audit_details` ADD COLUMN `field_visit_notes TEXT`, `field_visit_date TIMESTAMPTZ`.

---

## 3. Backend Implementation
1. **Application API:**
   - Implement `POST /api/v1/ex/cases/{caseId}/comprehensive/field-visit`.

---

## 4. Frontend Implementation
1. **UI Components:**
   - Build `<FieldVisitLogger />`.
   - Ensure the CSS is responsive (Tailwind `md:` classes) so it works well on a tablet.
   - Include the `<EvidenceUploader />` component from Sprint 02 to attach photos to the field visit log.
