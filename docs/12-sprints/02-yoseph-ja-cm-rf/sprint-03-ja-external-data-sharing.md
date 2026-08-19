# Sprint 03: JA Collaborative Research Notes (Tasks 14-17)

**Objective:** Implement the collaborative research workspace where Joint Audit Committee members from multiple jurisdictions can post, discuss, and attach evidence files with jurisdiction attribution for audit trail.

**Developer:** Yoseph
**Cluster Prefix:** `ja_`
**ITAS Tasks:** 14-17 (Committee Member: Add research notes, reply to notes, view attachments, chronological feed)

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 03 (Collaborative Workspace).
>
> **Database Schema:**
> - Create `ja_research_notes` table: `id`, `committee_id`, `author_id`, `author_jurisdiction`, `subject`, `content`, `created_at`, `parent_note_id` (for threaded replies)
> - Create `ja_research_attachments` table: `id`, `note_id`, `file_name`, `file_size_bytes`, `mime_type`, `dms_reference_id`, `uploaded_by`, `uploaded_at`
> - Key insight: Each note is tagged with `author_jurisdiction` so it's clear which department contributed (audit trail)
>
> **Backend Service:**
> - Create `JointAuditResearchService` with methods:
>   - Add research note (Task 14)
>   - Attach evidence file to note (Task 14)
>   - Get all notes for committee in chronological order (Task 17)
>   - Reply to note by parent_note_id (Task 15)
> - Integrate with `DmsPort` (mock Document Management System) for file storage
> - Enforce: Extract `X-Actor-Jurisdiction` header for jurisdiction attribution
>
> **REST Endpoints:**
> - `POST /api/v1/ja/committees/{committeeId}/research/notes` - Post research note
> - `POST /api/v1/ja/committees/{committeeId}/research/notes/{noteId}/attachments` - Attach file
> - `GET /api/v1/ja/committees/{committeeId}/research/notes` - Get chronological feed
> - `POST /api/v1/ja/committees/{committeeId}/research/notes/{parentNoteId}/replies` - Reply to note
>
> **Frontend Components:**
> - Component `<ResearchNotesFeed />` - Display threaded conversation with jurisdiction badges
> - Component `<AddResearchNoteForm />` - Form to post new note (Chairperson/Members only)
> - Show author jurisdiction next to each note: "Posted by [auditor-id] from [FEDERAL_CUSTOMS]"
> - Display attachments with file size and download links
> - Threading: Show replies indented under parent note
>
> **Key Insight:**
> - Unlike individual auditor notes, JA research is collaborative and multi-jurisdiction
> - Jurisdiction attribution ensures accountability: "which department said this?"
