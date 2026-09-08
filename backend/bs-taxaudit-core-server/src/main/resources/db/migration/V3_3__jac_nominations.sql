-- ====================================================================
-- V3_3__jac_nominations.sql
-- Joint Audit Committee: Auditor Nominations
-- ====================================================================
-- Defines table for auditor nominations where committee members suggest
-- suitable auditors for the joint audit team.
-- Supports multiple nominations per case, with justification for each.
-- Links to committee cases and tracks nominating members.
-- ====================================================================

CREATE TABLE t_auditor_nomination (
    nomination_id UUID PRIMARY KEY,
    case_id UUID NOT NULL REFERENCES t_committee_case(case_id) ON DELETE CASCADE,
    nominated_auditor_id UUID NOT NULL,
    nominating_member_id UUID NOT NULL,
    justification TEXT NOT NULL,
    nominated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

CREATE INDEX idx_auditor_nomination_case ON t_auditor_nomination(case_id);
CREATE INDEX idx_auditor_nomination_auditor ON t_auditor_nomination(nominated_auditor_id);
CREATE INDEX idx_auditor_nomination_nominator ON t_auditor_nomination(nominating_member_id);
CREATE INDEX idx_auditor_nomination_timestamp ON t_auditor_nomination(nominated_at);

-- Add table and column comments for documentation
COMMENT ON TABLE t_auditor_nomination IS 'Joint Audit Committee: Auditor nominations where committee members suggest qualified auditors for the joint audit team';
COMMENT ON COLUMN t_auditor_nomination.nomination_id IS 'Unique identifier for the nomination (UUID)';
COMMENT ON COLUMN t_auditor_nomination.case_id IS 'Foreign key reference to t_committee_case - identifies the case for which auditor is being nominated';
COMMENT ON COLUMN t_auditor_nomination.nominated_auditor_id IS 'UUID of the auditor being nominated (from user-management-service). Multiple nominations of the same auditor are allowed.';
COMMENT ON COLUMN t_auditor_nomination.nominating_member_id IS 'UUID of the committee member who made the nomination - enables tracking of who nominated each auditor';
COMMENT ON COLUMN t_auditor_nomination.justification IS 'Text explanation of why this auditor is suitable for the joint audit team - may reference expertise, experience, or availability';
COMMENT ON COLUMN t_auditor_nomination.nominated_at IS 'Timestamp when the nomination was submitted (auto-populated with CURRENT_TIMESTAMP)';
COMMENT ON COLUMN t_auditor_nomination.version IS 'Version number for optimistic locking in JPA';

-- ====================================================================
-- Rollback Script
-- ====================================================================
-- DROP INDEX IF EXISTS idx_auditor_nomination_timestamp;
-- DROP INDEX IF EXISTS idx_auditor_nomination_nominator;
-- DROP INDEX IF EXISTS idx_auditor_nomination_auditor;
-- DROP INDEX IF EXISTS idx_auditor_nomination_case;
-- DROP TABLE IF EXISTS t_auditor_nomination;

