# Sprint 16: QA Cryptographic Selection Algorithm

**Objective:** Implement the random sampling algorithm (Rule 10) to automatically select 5% of closed cases for Quality Assurance review.

**Developer:** Oliad
**Cluster Prefix:** `qa_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 12 (Vertical Slice).
> - **Database:** Switch to `V7__qa_tables.sql` defining `qa_reviews`.
> - **Domain:** Implement the UUID modulo 100 algorithm.

---

## 2. Database Implementation
1. **Flyway Script (`V7__qa_tables.sql`):**
   - Create `qa_reviews` (`id`, `audit_case_id`, `selected_at`, `status`).

---

## 3. Backend Implementation
1. **Domain Logic:**
   - Implement `QaSelectionService`. When the CM cluster fires a `CaseClosedEvent`, this service catches it, hashes the `audit_case_id` UUID, and if `hash % 100 < 5`, it saves a new `qa_reviews` entity.
2. **Application API:**
   - Implement `GET /api/v1/qa/selections`.

---

## 4. Frontend Implementation
1. **UI Components:**
   - Build `<QaSelectionInbox />` for `ROLE_QA_REVIEWER`.
