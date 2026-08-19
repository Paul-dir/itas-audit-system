# Sprint 07: JA Consolidated Findings Submission to Committee

**Objective:** Implement the final submission workflow where the Lead Auditor consolidates all multi-jurisdiction findings into one unified audit report with consolidated tax adjustments, then submits to the Joint Audit Committee for final approval.

**Developer:** Yoseph
**Cluster Prefix:** `ja_`
**ITAS Tasks:** 56-61 (Team Leader: View report status, generate report, edit summary, view adjustments table, apply signature, submit)

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 07 (Consolidated Findings).
>
> **Database Schema:**
> - Add `ja_consolidated_reports`: `consolidated_principal_etb`, `consolidated_penalty_etb`, `executive_summary`, `adjustments_detail`
> - Create `ja_adjustment_summary` table: `id`, `report_id`, `tax_type`, `total_principal_etb`, `total_penalty_etb`, `count_of_findings`
> - All amounts in ETB (Ethiopian Birr)
>
> **Backend Service:**
> - Create methods:
>   - Generate consolidated report (Task 57): Auto-compile from all approved findings, calculate total adjustments
>   - Edit executive summary (Task 58): Allow Lead Auditor to add narrative commentary
>   - Get adjustments table (Task 59): Return summary table of total principal + penalties by tax type
>   - Apply digital signature (Task 60): Sign with Lead Auditor credentials and timestamp
>   - Submit to Committee (Task 61): Mark report as SUBMITTED and notify Committee
> - Calculate totals: Sum all individual jurisdiction findings to get consolidated principal and penalty amounts
> - Compile side-by-side comparison: Show original findings from each jurisdiction before consolidation
>
> **REST Endpoints:**
> - `POST /api/v1/ja/committees/{committeeId}/consolidated-report` - Generate consolidated report
> - `PUT /api/v1/ja/reports/{reportId}/executive-summary` - Edit executive summary
> - `GET /api/v1/ja/reports/{reportId}/adjustments-table` - Get summary of all adjustments
> - `POST /api/v1/ja/reports/{reportId}/apply-signature` - Apply digital signature
> - `POST /api/v1/ja/reports/{reportId}/submit-to-committee` - Submit for Committee approval
>
> **Frontend Components:**
> - Page `<ConsolidatedReportWorkspace />` - Display full consolidated report
> - Component `<ReportStatusIndicator />` - Show status (DRAFT, GENERATED, SIGNED, SUBMITTED)
> - Component `<AdjustmentsSummaryTable />` - Display totals by tax type: Tax Type | Jurisdiction Count | Total Principal ETB | Total Penalty ETB
> - Component `<ExecutiveSummaryEditor />` - Rich text editor for narrative commentary
> - Component `<ConsolidatedFindingsDetail />` - Read-only view of all individual findings with jurisdiction attribution
> - Component `<DigitalSignaturePanel />` - Signature confirmation with Lead Auditor name and timestamp
>
> **Display Requirements:**
> - Show all findings from each jurisdiction in read-only format with jurisdiction badge
> - Clear breakdown: "Federal Customs: 3 findings, $50,000 | Regional Tax: 2 findings, $30,000 | Total: 5 findings, $80,000"
> - Adjustments table includes tax type summary for VAT, CIT, Withholding, Transfer Pricing, etc.
> - Executive summary field for narrative context about key findings
>
> **Key Insight:**
> - Consolidation is not averaging or weighting - it's summing all findings
> - Each jurisdiction's findings are clearly attributed and visible
> - Lead Auditor's role is to compile, not to override or re-negotiate
> - Final report is the official output to Committee with immutable audit trail

---

## 2. Success Criteria

- ✅ Consolidated report auto-generated from all locked jurisdiction findings
- ✅ Adjustments table shows totals by tax type with clear line-item breakdown
- ✅ Executive summary can be edited with narrative commentary
- ✅ Digital signature applied with Lead Auditor identity and timestamp
- ✅ Report status transitions: DRAFT → GENERATED → SIGNED → SUBMITTED
- ✅ Side-by-side comparison shows each jurisdiction's contribution
- ✅ Final report submitted to Committee with full metadata
- ✅ All changes audited with timestamps and actor IDs
