# Sprint 17: QA Scorecard Submission

**Objective:** Allow the QA Reviewer to evaluate the auditor's methodology and submit the final scorecard.

**Developer:** Oliad
**Cluster Prefix:** `qa_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 13 (Vertical Slice).
> - **Database:** Define the findings scorecard.

---

## 2. Database Implementation
1. **Flyway Script (`V7_1__qa_scorecard.sql`):**
   - Create `qa_findings` (`id`, `qa_review_id`, `methodology_score`, `defect_description`).

---

## 3. Backend Implementation
1. **Application API:**
   - Implement `POST /api/v1/qa/reviews/{reviewId}/scorecard`.

---

## 4. Frontend Implementation
1. **UI Components:**
   - Build `<QaScorecardForm />`.
   - Provide a 1-5 rating input for methodology, documentation, and compliance. 
