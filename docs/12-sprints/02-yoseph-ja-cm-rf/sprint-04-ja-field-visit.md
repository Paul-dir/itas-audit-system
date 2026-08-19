# Sprint 04: JA Entry Conference & Field Visit Coordination

**Objective:** Implement the Entry Conference workflow (Tasks 76-80) where the committee coordinates and conducts the formal opening meeting with the taxpayer, documenting discussion, internal controls, and premises inspection.

**Developer:** Yoseph
**Cluster Prefix:** `ja_`
**ITAS Tasks:** 76-80 (Auditor: Schedule meeting, send invitations, record minutes, upload evidence, submit for approval)

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 04 (Entry Conference Workflow).
>
> **Database Schema:**
> - Create `ja_entry_conferences` table: `id`, `committee_id`, `scheduled_date`, `scheduled_time`, `venue`, `taxpayer_name`, `tin`, `status` (SCHEDULED, INVITATION_SENT, CONDUCTED, DOCUMENTED)
> - Create `ja_entry_conference_participants` table: `id`, `conference_id`, `participant_id`, `role` (AUDITOR, TAXPAYER_REP, OBSERVER), `attendance_status` (INVITED, CONFIRMED, ATTENDED, ABSENT)
> - Create `ja_entry_conference_minutes` table: `id`, `conference_id`, `discussion_summary`, `internal_controls_notes`, `premises_inspection_notes`, `recorded_by`, `recorded_at`
> - Create `ja_entry_conference_evidence` table: `id`, `conference_id`, `file_type` (AUDIO, PHOTO, DOCUMENT), `dms_reference_id`, `uploaded_by`, `uploaded_at`
>
> **Backend Service:**
> - Create `EntryConferenceService` with methods:
>   - Schedule conference (Task 76): Set date, time, venue, taxpayer details
>   - Send formal invitation to taxpayer (Task 77): Generate and send notification email
>   - Record conference minutes (Task 78): Document discussions, internal controls observations, premises inspection findings
>   - Upload evidence (Task 79): Store audio recordings, photos, attendance sheets with DMS
>   - Get conference details (GET method): Retrieve full conference record with minutes and evidence
> - Integrate with `NotificationPort` to send formal taxpayer invitations
> - Integrate with `DmsPort` for evidence file storage and retrieval
>
> **REST Endpoints:**
> - `POST /api/v1/ja/committees/{committeeId}/entry-conference` - Schedule entry conference
> - `POST /api/v1/ja/conferences/{conferenceId}/send-invitation` - Send formal invitation to taxpayer
> - `PUT /api/v1/ja/conferences/{conferenceId}/minutes` - Record minutes (discussion, controls, inspection)
> - `POST /api/v1/ja/conferences/{conferenceId}/evidence` - Upload evidence files
> - `GET /api/v1/ja/conferences/{conferenceId}` - Get conference details with minutes and evidence
>
> **Frontend Components:**
> - Page `<EntryConferenceWorkspace />` - Manage entry conference scheduling and documentation
> - Component `<ConferenceScheduler />` - Calendar interface to select date/time/venue
> - Component `<ParticipantList />` - Show all committee members attending with status
> - Component `<MinutesRecorder />` - Form to document discussion, internal controls, inspection observations
> - Component `<EvidenceUploader />` - Upload and display photos, audio recordings, attendance sheets
>
> **Security & Audit Trail:**
> - Extract `X-Actor-Id` header for recorded_by field
> - Log all entry conference actions (scheduled, invited, conducted, documented)
> - Track evidence file uploads with uploader identity and timestamp
>
> **Key Business Logic:**
> - Entry Conference is the formal opening with taxpayer - must be officially invited
> - Minutes documentation captures the committee's assessment of internal controls
> - Evidence creates forensic record (audio recordings, dated photos, signed attendance)
> - Completion of entry conference marks transition from planning to fieldwork phase

---

## 2. Success Criteria

- ✅ Entry conference can be scheduled with date, time, venue, and taxpayer details
- ✅ Formal invitations sent to taxpayer email with meeting particulars
- ✅ Committee members can record minutes (discussion summary, internal controls notes, premises inspection notes)
- ✅ Evidence files (audio, photos) can be uploaded and associated with conference
- ✅ All participants tracked with attendance confirmation status
- ✅ Conference records submitted to Team Leader for approval and sign-off
- ✅ API returns 201 Created for conference scheduling
- ✅ All entry conference actions audited with timestamps and actor IDs
