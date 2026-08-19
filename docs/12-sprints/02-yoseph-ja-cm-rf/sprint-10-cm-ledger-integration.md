# Sprint 10: Ledger Engine Integration & Revenue Recording

**Objective:** Automatically post the finalized tax liabilities to the external Ledger Engine immediately upon case closure, creating the official tax authority revenue record.

**Developer:** Yoseph
**Cluster Prefix:** `cm_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 10 (Ledger Integration).
>
> **Integration Port:**
> - Create `LedgerEnginePort` interface with method: `recordTaxAdjustment(tin, principal_etb, penalty_etb) -> ledger_receipt_id`
> - Create `MockLedgerAdapter` that returns mock receipt like "REC-20260819-001234"
> - Port is called synchronously during closure sign-off transaction
>
> **Database Schema:**
> - Add to `cm_case_closures`: `ledger_receipt_id` (VARCHAR), `ledger_posted_at` (TIMESTAMPTZ)
> - Create `cm_ledger_sync_log` table: `id`, `case_id`, `ledger_receipt_id`, `principal_etb`, `penalty_etb`, `posted_at`, `sync_status`
>
> **Backend Service:**
> - Update `ClosureSignOffService`:
>   - During sign-off transaction:
>     1. Validate case can be closed
>     2. Invoke LedgerEnginePort with consolidated principal and penalty amounts
>     3. Receive ledger_receipt_id
>     4. Save receipt_id to case_closures table
>     5. Log transaction to sync log
>   - If Ledger Port fails: Rollback transaction, prevent closure, display error
>
> **REST Endpoints:**
> - `GET /api/v1/cm/closures/{closureId}/ledger-receipt` - Get ledger receipt ID
> - `GET /api/v1/cm/ledger-sync-log?date_from=X&date_to=Y` - Query sync log for reconciliation
>
> **Frontend Components:**
> - Component `<LedgerReceiptBadge />` - Display after successful sign-off showing receipt ID (e.g., "REC-20260819-001234")
> - Component `<LedgerSyncStatus />` - Show "Posted to Ledger" with checkmark and timestamp
> - Show receipt in success message: "Case closed successfully. Ledger Receipt: REC-20260819-001234"
>
> **Transaction Safety:**
> - Ledger posting is synchronous (not fire-and-forget)
> - If Ledger Port returns error, entire sign-off transaction fails
> - Retry logic: If Ledger temporarily unavailable, manager can retry sign-off
> - All ledger posting attempts logged for reconciliation
>
> **Key Insight:**
> - Ledger posting completes the audit cycle
> - Receipt becomes official proof that tax authority recorded the adjustment
> - Integration creates definitive link between case and ledger records
> - Sync log enables reconciliation and audit trails

---

## 2. Success Criteria

- ✅ Ledger Engine called during case closure with principal and penalty amounts
- ✅ Receipt ID returned and saved to case_closures table
- ✅ Ledger receipt badge displayed in UI after successful posting
- ✅ All ledger transactions logged for audit trail and reconciliation
- ✅ If Ledger fails, entire sign-off transaction rolled back
- ✅ Retry capability if Ledger temporarily unavailable
- ✅ API endpoints provide ledger receipt and sync log queries
