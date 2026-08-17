# Sprint 02: JA Jurisdiction Enforcement

**Objective:** Implement Rule 12, ensuring a Joint Audit legally includes representatives from at least two distinct departments or tax jurisdictions.

**Developer:** Yoseph
**Cluster Prefix:** `ja_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 02 (Vertical Slice).
> - **Database:** Create the members table.
> - **Domain:** Enforce **Rule 12**. The audit cannot transition to `IN_PROGRESS` unless distinct jurisdictions >= 2.

---

## 2. Database Implementation
1. **Flyway Script (`V5_1__ja_committee_members.sql`):**
   - Create `ja_committee_members` (`id`, `committee_id`, `member_actor_id`, `jurisdiction_department`).

---

## 3. Backend Implementation
1. **Domain Models:**
   - Add `addMember(actorId, jurisdiction)` to the Aggregate.
   - Override the start-audit method to count distinct `jurisdiction_department` strings. If < 2, throw `IllegalStateException`.
2. **Application API:**
   - Implement `POST /api/v1/ja/cases/{caseId}/members`.

---

## 4. Frontend Implementation
1. **UI Components:**
   - Add a member selection form to the `<CommitteeBuilder />`.
   - The "Start Audit" button must be visually disabled (and show a tooltip) until the backend confirms the jurisdiction rule is satisfied.
