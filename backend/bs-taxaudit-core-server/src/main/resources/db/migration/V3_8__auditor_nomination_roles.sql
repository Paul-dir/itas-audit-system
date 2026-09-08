-- ====================================================================
-- V3_8__auditor_nomination_roles.sql
-- Add role and selected fields to support team leader nominations
-- ====================================================================
-- Extends auditor nominations to distinguish between AUDITOR and
-- TEAM_LEADER nominations. The 'selected' flag tracks whether the
-- chairperson has appointed a nominated team leader.
-- ====================================================================

-- Add role column (default 'AUDITOR' for existing rows)
ALTER TABLE t_auditor_nomination ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'AUDITOR';

-- Add selected flag (default false)
ALTER TABLE t_auditor_nomination ADD COLUMN selected BOOLEAN NOT NULL DEFAULT FALSE;

-- Index for querying team leader nominations
CREATE INDEX idx_auditor_nomination_role ON t_auditor_nomination(role);
CREATE INDEX idx_auditor_nomination_selected ON t_auditor_nomination(selected);

-- Comments
COMMENT ON COLUMN t_auditor_nomination.role IS 'Role of the nominated person: AUDITOR or TEAM_LEADER';
COMMENT ON COLUMN t_auditor_nomination.selected IS 'Whether this nomination has been selected/appointed by the chairperson (only for TEAM_LEADER role)';
