# Sprint 06: Manual Case Referrals

**Objective:** Allow internal and external departments to manually request an audit on a taxpayer, bypassing the annual auto-generation process.

**Developer:** Pawlos
**Cluster Prefix:** `ap_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 06 (Vertical Slice).
> - **Database:** Add the `ap_case_referrals` table.
> - **Backend:** A referral must be triaged. If approved, it generates a new `AuditCase` with `source = INTERNAL_REFERRAL`.
> - **Frontend:** Build the inbox where the Process Owner can review and approve these requests.

---

## 2. Database Implementation
1. **Flyway Script (`V1_5__ap_case_referrals.sql`):**
   - Create `ap_case_referrals` (`id`, `tin`, `requesting_department`, `reason`, `status`, `created_at`).

---

## 3. Backend Implementation
1. **Domain Models:**
   - Create the `CaseReferral` entity.
   - Implement `approveReferral()`, which outputs a new `AuditCase` entity.
2. **Application API:**
   - Implement `POST /api/v1/ap/referrals` (Submit referral).
   - Implement `POST /api/v1/ap/referrals/{id}/approve` (Triage decision).

---

## 4. Frontend Implementation
1. **UI Components:**
   - Build `<ReferralInbox />`.
   - Provide a form for users to submit a new referral.
   - Provide an approval queue for the `ROLE_PROCESS_OWNER` to view the `reason`, click "Approve", and select the `audit_type` (Desk/Comp/TP/Issue) before the `AuditCase` is officially generated.
