# Sprint 05: JA Dispute Resolution & Multi-Jurisdiction Alignment

**Objective:** Implement conflict resolution mechanism where multiple audit jurisdictions may have differing tax interpretations. Disputes must be formally documented and resolved by Lead Auditor before consolidated findings can be submitted.

**Developer:** Yoseph
**Cluster Prefix:** `ja_`
**ITAS Tasks:** 50-55 (Team Leader: View findings list, view detail, approve/reject/return, request evidence)

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 05 (Dispute Resolution).
>
> **Database Schema:**
> - Create `ja_jurisdictional_disputes` table: `id`, `committee_id`, `finding_subject`, `originating_jurisdiction`, `challenging_jurisdiction`, `dispute_description`, `status` (OPEN, ESCALATED, RESOLVED), `created_at`, `resolution_comment`, `resolved_by`, `resolved_at`
> - Add validation: Cannot have duplicate disputes for same finding from same jurisdictions
>
> **Backend Service:**
> - Create `DisputeResolutionService` with methods:
>   - Raise dispute (Task 50/54): Any jurisdiction can formally raise objection to another's tax treatment
>   - Get open disputes: List all unresolved disputes for lead auditor review
>   - Resolve dispute: Lead auditor documents binding resolution comment
>   - Check dispute status: Validate no open disputes before allowing consolidated findings submission
> - Enforce: Consolidated findings cannot be submitted if any disputes remain OPEN status
>
> **REST Endpoints:**
> - `POST /api/v1/ja/committees/{committeeId}/disputes` - Raise jurisdictional dispute
> - `GET /api/v1/ja/committees/{committeeId}/disputes` - List all disputes with status filtering
> - `PUT /api/v1/ja/disputes/{disputeId}/resolve` - Resolve dispute (Lead Auditor only)
> - `GET /api/v1/ja/committees/{committeeId}/disputes/status` - Check if all disputes resolved
>
> **Frontend Components:**
> - Component `<DisputeRaisingForm />` - Allow any committee member to raise formal dispute
> - Component `<DisputeBoard />` - Display all disputes with status (OPEN, RESOLVED)
> - Component `<DisputeResolutionPanel />` - Lead Auditor interface to resolve disputes with mandatory comment
> - Show validation error if trying to consolidate findings with open disputes
>
> **Business Rules:**
> - A dispute documents: which jurisdiction raised it, which was challenged, what the disagreement is
> - Lead Auditor resolution is binding and must be documented in writing
> - All disputes must be resolved before consolidated findings can proceed
>
> **Key Insight:**
> - Multi-jurisdiction committees may interpret tax law differently
> - Disputes ensure all disagreements are formally documented and resolved
> - Resolution becomes part of audit trail and justification for final tax treatment

---

## 2. Success Criteria

- ✅ Any jurisdiction can formally raise a dispute with another department
- ✅ Disputes clearly identify originating vs. challenging jurisdiction
- ✅ Lead Auditor can view all open disputes and must resolve each with comment
- ✅ Cannot submit consolidated findings if disputes remain OPEN
- ✅ All disputes logged with originating/challenging jurisdictions for audit trail
- ✅ Resolution comments documented and attached to case record
