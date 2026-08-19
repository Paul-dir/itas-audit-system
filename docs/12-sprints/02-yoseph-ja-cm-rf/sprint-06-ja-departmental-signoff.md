# Sprint 06: JA Departmental Pre-Signoff & Consolidated Findings Gate

**Objective:** Implement the critical gate where each department formally locks their findings before Lead Auditor can consolidate, ensuring accountability and preventing post-consensus modifications. Once signed, findings are immutable.

**Developer:** Yoseph
**Cluster Prefix:** `ja_`
**ITAS Tasks:** 52, 54, 56-61 (Team Leader: Approve/return findings, generate report, apply digital signature, submit)

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 06 (Departmental Lockdown Gate).
>
> **Database Schema:**
> - Add `ja_committees`: `all_jurisdictions_locked` (BOOLEAN), `all_jurisdictions_locked_at` (TIMESTAMPTZ)
> - Create `ja_finding_signoffs` table: `id`, `committee_id`, `jurisdiction`, `signoff_by`, `signed_at`, ensure UNIQUE constraint (committee_id, jurisdiction)
> - Create `ja_consolidated_reports` table: `id`, `committee_id`, `generated_at`, `report_text`, `status` (DRAFT, GENERATED, SIGNED, SUBMITTED), `signed_by`, `signed_at`
>
> **Backend Service:**
> - Create `JointAuditFinalSubmissionService` with methods:
>   - Submit jurisdiction signoff (Task 52): Record when each department locks their findings
>   - Check all jurisdictions locked: Validate all committee members have signed off
>   - Generate consolidated report (Task 57): Auto-merge all jurisdiction findings once all signed
>   - Apply digital signature (Task 60): Sign report with Lead Auditor credentials and timestamp
>   - Submit to Committee (Task 61): Change status to SUBMITTED_TO_COMMITTEE
> - Business rule: Cannot generate consolidated report unless ALL jurisdictions have signed (pre-signoff gate)
> - Rule 9 Enforcement: Once report is SIGNED, no further modifications allowed
>
> **REST Endpoints:**
> - `POST /api/v1/ja/committees/{committeeId}/members/{jurisdiction}/signoff` - Submit jurisdiction signoff
> - `GET /api/v1/ja/committees/{committeeId}/signoff-status` - Check which jurisdictions have signed
> - `POST /api/v1/ja/committees/{committeeId}/consolidated-report/generate` - Generate consolidated report (only if all signed)
> - `POST /api/v1/ja/reports/{reportId}/sign` - Apply digital signature
> - `POST /api/v1/ja/reports/{reportId}/submit` - Submit to Committee
>
> **Frontend Components:**
> - Component `<DepartmentalLockPanel />` - Each committee member sees "Lock My Findings" button
> - Component `<SignoffStatusChecklist />` - Lead Auditor sees real-time checklist of which departments have signed
> - Component `<ReportGenerationGate />` - Show "Generate Consolidated Report" button only when all jurisdictions signed
> - Component `<DigitalSignatureBadge />` - Display signed report with Lead Auditor name and signature timestamp
>
> **Access Control:**
> - Each jurisdiction member can only submit their own signoff
> - Only Lead Auditor can generate consolidated report and apply signature
> - Anyone with committee access can view signoff status
>
> **Key Business Logic:**
> - Each jurisdiction must formally sign off on their findings
> - Lead Auditor cannot consolidate until ALL jurisdictions locked
> - Digital signature is immutable proof of Lead Auditor approval
> - Consolidated report becomes the official case outcome
>
> **Rule 9 Compliance:**
> - Once report is SIGNED, case becomes immutable (no modifications in Execution World)
> - All modifications must happen before signature

---

## 2. Success Criteria

- ✅ Each jurisdiction can submit formal signoff of their findings
- ✅ Lead Auditor cannot generate consolidated report until ALL jurisdictions signed (gate)
> ✅ Signoff status clearly displayed: "2/3 Jurisdictions Signed" with live countdown
- ✅ Consolidated report auto-generated from all jurisdiction findings once locked
- ✅ Digital signature applied and immutable (cannot be modified after signing)
- ✅ Report submitted to Committee with full audit trail
- ✅ Rule 9 enforcement: Signed reports are read-only in downstream systems
