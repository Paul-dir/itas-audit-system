# Sprint 09: Closure Sign-Off & Immutability

**Objective:** Implement the core business logic (Rule 09) that permanently freezes a case once the Tax Center Manager signs off.

**Developer:** Yoseph
**Cluster Prefix:** `cm_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 06 (Vertical Slice).
> - **Backend:** Enforce **Rule 09**. Once `status = CLOSED`, no other endpoint (EX or TP) can modify the case data.
> - **Frontend:** Provide the formal sign-off interface.

---

## 2. Database Implementation
1. **Flyway Script (`V8_1__cm_signoff.sql`):**
   - Add `manager_signature_id` and `signed_off_at` to `cm_case_closures`.

---

## 3. Backend Implementation
1. **Domain Models:**
   - Implement `signOffClosure(managerId)`.
2. **Application API:**
   - Implement `POST /api/v1/cm/closures/{closureId}/sign-off`.

---

## 4. Frontend Implementation
1. **UI Components:**
   - Build `<ClosureSignOffPanel />`.
   - Display a read-only summary of the findings (pulled from EX/TP).
   - Add a large, red "Finalize and Close Case" button that triggers a confirmation modal before submission.
