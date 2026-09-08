-- ====================================================================
-- V3_2__jac_research.sql
-- Joint Audit Committee: Research Workspace
-- ====================================================================
-- Defines tables for collaborative research workspace where committee members
-- can add notes, observations, and questions about cases.
-- Includes support for categorized notes, threaded comments, and attachments.
-- ====================================================================

CREATE TABLE t_research_note (
    note_id UUID PRIMARY KEY,
    case_id UUID NOT NULL REFERENCES t_committee_case(case_id) ON DELETE CASCADE,
    author_id UUID NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('OBSERVATION', 'QUESTION', 'INVESTIGATION', 'RECOMMENDATION')),
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    version BIGINT DEFAULT 0
);

CREATE TABLE t_research_comment (
    comment_id UUID PRIMARY KEY,
    note_id UUID NOT NULL REFERENCES t_research_note(note_id) ON DELETE CASCADE,
    author_id UUID NOT NULL,
    content TEXT NOT NULL,
    replied_to_comment_id UUID REFERENCES t_research_comment(comment_id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

CREATE TABLE t_research_attachment (
    attachment_id UUID PRIMARY KEY,
    note_id UUID NOT NULL REFERENCES t_research_note(note_id) ON DELETE CASCADE,
    file_path VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(50),
    uploaded_by UUID NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_research_note_case ON t_research_note(case_id);
CREATE INDEX idx_research_note_author ON t_research_note(author_id);
CREATE INDEX idx_research_comment_note ON t_research_comment(note_id);
CREATE INDEX idx_research_comment_replied_to ON t_research_comment(replied_to_comment_id);
CREATE INDEX idx_research_attachment_note ON t_research_attachment(note_id);

-- Add table and column comments for documentation
COMMENT ON TABLE t_research_note IS 'Joint Audit Committee: Research notes in collaborative workspace where members add observations and analysis';
COMMENT ON COLUMN t_research_note.note_id IS 'Unique identifier for the research note (UUID)';
COMMENT ON COLUMN t_research_note.case_id IS 'Foreign key reference to t_committee_case';
COMMENT ON COLUMN t_research_note.author_id IS 'Committee member who created the note (UUID)';
COMMENT ON COLUMN t_research_note.category IS 'Note category: OBSERVATION, QUESTION, INVESTIGATION, RECOMMENDATION';
COMMENT ON COLUMN t_research_note.content IS 'The actual note content/text';
COMMENT ON COLUMN t_research_note.created_at IS 'Timestamp when note was created (auto-populated)';
COMMENT ON COLUMN t_research_note.updated_at IS 'Timestamp of last modification (if any)';
COMMENT ON COLUMN t_research_note.version IS 'Version number for optimistic locking';

COMMENT ON TABLE t_research_comment IS 'Joint Audit Committee: Comments on research notes, supports threading via self-referential FK';
COMMENT ON COLUMN t_research_comment.comment_id IS 'Unique identifier for the comment (UUID)';
COMMENT ON COLUMN t_research_comment.note_id IS 'Foreign key reference to t_research_note (parent note)';
COMMENT ON COLUMN t_research_comment.author_id IS 'Committee member who created the comment (UUID)';
COMMENT ON COLUMN t_research_comment.content IS 'The comment text';
COMMENT ON COLUMN t_research_comment.replied_to_comment_id IS 'Self-referential FK for threaded conversations (null for top-level comments). Enables multi-level replies and comment threading';
COMMENT ON COLUMN t_research_comment.created_at IS 'Timestamp when comment was created (auto-populated)';
COMMENT ON COLUMN t_research_comment.version IS 'Version number for optimistic locking';

COMMENT ON TABLE t_research_attachment IS 'Joint Audit Committee: File attachments associated with research notes';
COMMENT ON COLUMN t_research_attachment.attachment_id IS 'Unique identifier for the attachment (UUID)';
COMMENT ON COLUMN t_research_attachment.note_id IS 'Foreign key reference to t_research_note';
COMMENT ON COLUMN t_research_attachment.file_path IS 'Path/location where file is stored in document management system';
COMMENT ON COLUMN t_research_attachment.file_name IS 'Original filename';
COMMENT ON COLUMN t_research_attachment.file_size IS 'File size in bytes';
COMMENT ON COLUMN t_research_attachment.file_type IS 'MIME type of the file (e.g., application/pdf)';
COMMENT ON COLUMN t_research_attachment.uploaded_by IS 'User who uploaded the attachment (UUID)';
COMMENT ON COLUMN t_research_attachment.uploaded_at IS 'Timestamp when attachment was uploaded (auto-populated)';

-- ====================================================================
-- Rollback Script
-- ====================================================================
-- DROP INDEX IF EXISTS idx_research_attachment_note;
-- DROP INDEX IF EXISTS idx_research_comment_replied_to;
-- DROP INDEX IF EXISTS idx_research_comment_note;
-- DROP INDEX IF EXISTS idx_research_note_author;
-- DROP INDEX IF EXISTS idx_research_note_case;
-- DROP TABLE IF EXISTS t_research_attachment;
-- DROP TABLE IF EXISTS t_research_comment;
-- DROP TABLE IF EXISTS t_research_note;
