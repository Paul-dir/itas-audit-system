# Sprint 10: Ledger Engine Integration

**Objective:** Automatically post the finalized tax liabilities to the mocked external Ledger Engine immediately upon closure.

**Developer:** Yoseph
**Cluster Prefix:** `cm_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 07 (Vertical Slice).
> - **Backend:** Create the `LedgerEnginePort`.
> - **Domain:** The port must be called synchronously during the `signOffClosure` transaction.

---

## 2. Database Implementation
1. **Flyway Script (`V8_2__cm_ledger_receipt.sql`):**
   - Add `ledger_receipt_id` to `cm_case_closures`.

---

## 3. Backend Implementation
1. **Integration Port:**
   - Create `LedgerEnginePort` and `MockLedgerAdapter`. The adapter should `log.info` the ETB amount and return a mock receipt string like `REC-999888`.
2. **Domain Service:**
   - Update the Closure Service to invoke the Ledger Port and save the receipt ID.

---

## 4. Frontend Implementation
1. **UI Components:**
   - Upon successful sign-off in the UI, dynamically render the `<LedgerReceiptBadge />` showing the user the `REC-999888` ID returned by the backend.
