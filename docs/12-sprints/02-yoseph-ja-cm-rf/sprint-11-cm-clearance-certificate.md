# Sprint 11: Clearance Certificate & Tax Ledger Receipt

**Objective:** Generate a tax clearance certificate for cases where audit findings resulted in no adjustments (zero liability change), providing taxpayer with proof of clearance.

**Developer:** Yoseph
**Cluster Prefix:** `cm_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 11 (Clearance Certificates).
>
> **Database Schema:**
> - Add to `cm_case_closures`: `clearance_certificate_generated` (BOOLEAN), `clearance_certificate_id` (VARCHAR), `is_clearance_case` (BOOLEAN)
> - Cases where total_principal_etb = 0 AND total_penalty_etb = 0 are marked as `is_clearance_case = TRUE`
>
> **Backend Service:**
> - Create `ClearanceCertificateService` with methods:
>   - Check if case is clearance case (zero adjustments)
>   - Generate clearance certificate: Create formal document with case details, taxpayer name, TIN, audit period, statement of no findings
>   - Sign clearance certificate with Tax Center Manager signature
>   - Return certificate as PDF or XML for export
>
> **REST Endpoints:**
> - `POST /api/v1/cm/closures/{closureId}/generate-certificate` - Generate clearance certificate (if applicable)
> - `GET /api/v1/cm/closures/{closureId}/clearance-certificate` - Retrieve certificate
> - `GET /api/v1/cm/clearance-certificates?date_from=X&date_to=Y` - Query clearance certificates by date range
>
> **Frontend Components:**
> - Component `<ClearanceCertificatePanel />` - Show if case is clearance case with "Generate Certificate" button
> - Component `<CertificatePreview />` - Display generated certificate with: Taxpayer name, TIN, audit period, "NO FINDINGS" statement, Tax Center seal
> - Component `<CertificateDownload />` - PDF download button with certificate number and date
>
> **Business Logic:**
> - Only cases with zero total adjustments are clearance cases
> - Certificate provides taxpayer proof of audit completion with no liability
> - Useful for loans, permits, or other documentation requiring tax compliance proof
> - Certificate is formal document suitable for official filing
>
> **Key Insight:**
> - Clearance certificates are distinct from regular case closures
> - Provide taxpayer with formal proof of clean audit
> - Enhance taxpayer relations for compliant businesses

---

## 2. Success Criteria

- ✅ Cases with zero total adjustments identified as clearance cases
- ✅ Clearance certificate can be generated with formal content
- ✅ Certificate includes: Taxpayer details, audit period, official statement, Tax Center seal
- ✅ Certificate can be downloaded as PDF
- ✅ Certificate signed with Tax Center Manager signature
- ✅ Query endpoint for clearance certificates by date range
- ✅ Certificate number and generation date tracked
