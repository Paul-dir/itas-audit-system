# Sprint 12: Audit Trail Event Sourcing (CQRS)

**Objective:** Implement the background logic that projects raw events from the `shared_audit_trail_entries` into fast, read-only analytics tables for the RF cluster.

**Developer:** Yoseph
**Cluster Prefix:** `rf_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 09 (Vertical Slice).
> - **Database:** Create `rf_case_metrics`.
> - **Backend:** Do NOT run heavy JOINs on operational tables. You must read from `shared_audit_trail_entries`.

---

## 2. Database Implementation
1. **Flyway Script (`V8_3__rf_case_metrics.sql`):**
   - Create `rf_case_metrics` (`audit_case_id`, `created_at`, `closed_at`, `duration_days`, `tax_center_code`).

---

## 3. Backend Implementation
1. **Background Job:**
   - Implement `@Scheduled` or `@EventListener` that scans new `shared_audit_trail_entries` (e.g., action = `CLOSED`), calculates the `duration_days` from the `CREATED` event, and upserts into `rf_case_metrics`.
