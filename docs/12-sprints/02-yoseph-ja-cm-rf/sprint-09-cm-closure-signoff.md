# Sprint 09: Closure Sign-Off & Immutability (Rule 9)

**Objective:** Implement the formal sign-off interface where Tax Center Manager finalizes a case, applying their digital signature and permanently closing the case. Once closed (Rule 9), no other system component can modify the case data.

**Developer:** Yoseph
**Cluster Prefix:** `cm_`
**ITAS Rule:** Rule 9 - Case Immutability After Closure

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 09 (Immutability Gate).
>
> **Database Schema:**
> - Add to `cm_case_closures`: `manager_signature_id` (VARCHAR), `signed_off_at` (TIMESTAMPTZ), `closure_finalized` (BOOLEAN)
> - Create `cm_closure_audit_log` for all sign-off attempts and actions
>
> **Backend Service:**
> - Create methods:
>   - Sign off closure (mark as CLOSED): Extract X-Actor-Id as signing manager
>   - Validate no open disputes (call Dispute service)
>   - Validate all jurisdictions signed (call JA service if TP case)
>   - Apply immutability flag: Once CLOSED, case is read-only in all upstream systems
> - Enforce Rule 9: Any attempt to modify a CLOSED case returns 403 Forbidden with message "Case is closed and immutable"
> - Log all sign-off attempts (successes and rejections) for compliance
>
> **REST Endpoints:**
> - `POST /api/v1/cm/closures/{closureId}/sign-off` - Sign off and close case
> - `GET /api/v1/cm/closures/{closureId}/immutability-status` - Check if case is closed/immutable
> - `GET /api/v1/cm/audit-log?case_id={caseId}` - View all sign-off audit trail
>
> **Frontend Components:**
> - Component `<ClosureSignOffPanel />` - Read-only display of case findings with large red "Finalize and Close Case" button
> - Component `<SignOffConfirmationModal />` - Warning message: "This action is FINAL. Once signed, this case cannot be modified. Do you want to proceed?"
> - Component `<ClosureSignedBadge />` - Display after successful sign-off showing Manager name and signature timestamp
> - Show countdown: "You have 5 actions remaining before case becomes immutable"
>
> **Business Logic:**
> - Tax Center Manager must review all findings and adjustments before signing
> - Sign-off is the final act - creates immutable historical record
> - After closure: JA committee cannot modify, Team Leader cannot modify, Auditors cannot modify
> - Provides audit trail for compliance review
>
> **Error Handling:**
> - If disputes still open: "Cannot close case: Disputes still pending from [Federal Customs, Regional Tax]"
> - If not all jurisdictions signed (TP case): "Cannot close case: [Regional Tax Authority] has not signed off"
> - Validation errors prevent sign-off with clear guidance
>
> **Key Insight:**
> - Rule 9 makes cases immutable after closure
> - Sign-off is the hardstop: prevents all further modifications
> - Creates legally defensible historical record for tax authority

---

## 2. Success Criteria

- ✅ Tax Center Manager can review case findings before sign-off
- ✅ Confirmation modal prevents accidental closure
- ✅ Digital signature applied with manager identity and timestamp
- ✅ Case status changes to CLOSED with immutability flag set
- ✅ All subsequent modification attempts blocked with 403 Forbidden
- ✅ Audit log captures all sign-off attempts and results
- ✅ Signed badge displays confirming case is closed
- ✅ Rule 9 enforced across all systems: JA, EX, Team Leader cannot modify closed cases
