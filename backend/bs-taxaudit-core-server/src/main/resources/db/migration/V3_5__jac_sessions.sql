-- ====================================================================
-- V3_5__jac_sessions.sql
-- Joint Audit Committee: Committee Sessions & Attendance
-- ====================================================================
-- Defines tables for formal committee sessions where members meet to
-- review cases and make collective decisions.
--
-- Key Features:
--   - t_committee_session: Scheduled committee meetings with agenda and status
--   - t_session_attendee: Tracks member attendance, confirmation, and participation
--   - Session status progression: SCHEDULED -> IN_PROGRESS -> COMPLETED or CANCELLED
--   - Actual vs planned duration tracking for audit
--   - Version field enables optimistic locking
-- ====================================================================

CREATE TABLE t_committee_session (
    session_id UUID PRIMARY KEY,
    session_name VARCHAR(255) NOT NULL,
    agenda TEXT,
    scheduled_date TIMESTAMP NOT NULL,
    location VARCHAR(255),
    virtual_meeting_link VARCHAR(500),
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    session_minutes TEXT,
    actual_start_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    chairperson_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    version BIGINT DEFAULT 0
);

CREATE TABLE t_session_attendee (
    attendee_id UUID PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES t_committee_session(session_id) ON DELETE CASCADE,
    member_id UUID NOT NULL,
    attendance_status VARCHAR(50) CHECK (attendance_status IN ('INVITED', 'CONFIRMED', 'DECLINED', 'NO_RESPONSE', 'ATTENDED', 'ABSENT')),
    confirmed_at TIMESTAMP,
    attended_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- ====================================================================
-- Indexes for Query Performance
-- ====================================================================
CREATE INDEX idx_committee_session_date ON t_committee_session(scheduled_date);
CREATE INDEX idx_committee_session_status ON t_committee_session(status);
CREATE INDEX idx_committee_session_chairperson ON t_committee_session(chairperson_id);
CREATE INDEX idx_committee_session_created ON t_committee_session(created_at);
CREATE INDEX idx_session_attendee_session ON t_session_attendee(session_id);
CREATE INDEX idx_session_attendee_member ON t_session_attendee(member_id);
CREATE INDEX idx_session_attendee_status ON t_session_attendee(attendance_status);

-- ====================================================================
-- Table & Column Documentation
-- ====================================================================
COMMENT ON TABLE t_committee_session IS 'Joint Audit Committee: Formal committee sessions for scheduled reviews and collective decision-making with agenda, attendance tracking, and minutes';
COMMENT ON COLUMN t_committee_session.session_id IS 'Unique identifier for the committee session (UUID)';
COMMENT ON COLUMN t_committee_session.session_name IS 'Name/title of the session (e.g., "Quarterly Audit Review - Q3 2024")';
COMMENT ON COLUMN t_committee_session.agenda IS 'Agenda items to be discussed during the session - formatted text with key discussion points';
COMMENT ON COLUMN t_committee_session.scheduled_date IS 'Planned date and time for the session start (e.g., 2024-03-15 10:00:00)';
COMMENT ON COLUMN t_committee_session.location IS 'Physical location or conference room for in-person sessions (null if virtual only)';
COMMENT ON COLUMN t_committee_session.virtual_meeting_link IS 'URL/link for virtual meeting platform (e.g., Zoom, Teams) - null if in-person only';
COMMENT ON COLUMN t_committee_session.status IS 'Session status: SCHEDULED (upcoming), IN_PROGRESS (currently active), COMPLETED (finished), CANCELLED (cancelled due to circumstances)';
COMMENT ON COLUMN t_committee_session.session_minutes IS 'Official minutes documenting decisions, action items, and attendees - populated after session completion';
COMMENT ON COLUMN t_committee_session.actual_start_time IS 'Actual timestamp when session started (populated when status changes to IN_PROGRESS)';
COMMENT ON COLUMN t_committee_session.actual_end_time IS 'Actual timestamp when session ended (populated when status changes to COMPLETED)';
COMMENT ON COLUMN t_committee_session.chairperson_id IS 'UUID of the chairperson who is leading/conducting the session';
COMMENT ON COLUMN t_committee_session.created_at IS 'Timestamp when session was created (auto-populated with CURRENT_TIMESTAMP)';
COMMENT ON COLUMN t_committee_session.updated_at IS 'Timestamp of last update to session details (e.g., status change, minutes added)';
COMMENT ON COLUMN t_committee_session.version IS 'Version number for optimistic locking in JPA';

COMMENT ON TABLE t_session_attendee IS 'Joint Audit Committee: Session attendance tracking - records which members were invited, confirmed, and actually attended';
COMMENT ON COLUMN t_session_attendee.attendee_id IS 'Unique identifier for this attendance record (UUID)';
COMMENT ON COLUMN t_session_attendee.session_id IS 'Foreign key reference to t_committee_session (with CASCADE delete)';
COMMENT ON COLUMN t_session_attendee.member_id IS 'UUID of the committee member (from user-management-service)';
COMMENT ON COLUMN t_session_attendee.attendance_status IS 'Status progression: INVITED -> (CONFIRMED|DECLINED|NO_RESPONSE) -> (ATTENDED|ABSENT). Used to track RSVP and actual participation.';
COMMENT ON COLUMN t_session_attendee.confirmed_at IS 'Timestamp when member confirmed attendance (null if not confirmed)';
COMMENT ON COLUMN t_session_attendee.attended_at IS 'Timestamp when member actually attended/checked in (null if absent)';
COMMENT ON COLUMN t_session_attendee.created_at IS 'Timestamp when invitation was sent/record created (auto-populated)';
COMMENT ON COLUMN t_session_attendee.updated_at IS 'Timestamp of last status update (e.g., confirmation, check-in)';
COMMENT ON COLUMN t_session_attendee.version IS 'Version number for optimistic locking in JPA';

-- ====================================================================
-- Rollback Script
-- ====================================================================
-- DROP INDEX IF EXISTS idx_session_attendee_status;
-- DROP INDEX IF EXISTS idx_session_attendee_member;
-- DROP INDEX IF EXISTS idx_session_attendee_session;
-- DROP INDEX IF EXISTS idx_committee_session_created;
-- DROP INDEX IF EXISTS idx_committee_session_chairperson;
-- DROP INDEX IF EXISTS idx_committee_session_status;
-- DROP INDEX IF EXISTS idx_committee_session_date;
-- DROP TABLE IF EXISTS t_session_attendee;
-- DROP TABLE IF EXISTS t_committee_session;
