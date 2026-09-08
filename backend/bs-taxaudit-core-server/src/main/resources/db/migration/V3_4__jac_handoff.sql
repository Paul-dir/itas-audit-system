-- ====================================================================
-- V3_4__jac_handoff.sql
-- Joint Audit Committee: Handoff Records & Team Members
-- ====================================================================
-- Defines tables for the handoff process where approved committee cases
-- transition to the Execution Workspace with finalized team assignments.
-- 
-- Key Features:
--   - t_handoff_record: Snapshot of committee decision and approval details
--   - t_handoff_team_member: Tracks auditors assigned to the execution team
--   - case_code: Unique execution identifier guaranteed by unique constraint
--   - Cascade delete ensures referential integrity
--   - Version field enables optimistic locking
-- ====================================================================

CREATE TABLE t_handoff_record (
    handoff_id UUID PRIMARY KEY,
    case_id UUID NOT NULL UNIQUE REFERENCES t_committee_case(case_id) ON DELETE CASCADE,
    case_code VARCHAR(50) NOT NULL UNIQUE,
    execution_case_id UUID,
    team_lead_id UUID NOT NULL,
    committee_summary TEXT,
    key_findings TEXT,
    decision VARCHAR(50) NOT NULL CHECK (decision IN ('APPROVED', 'REJECTED')),
    handoff_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    delivered_at TIMESTAMP,
    version BIGINT DEFAULT 0
);

CREATE TABLE t_handoff_team_member (
    member_id UUID PRIMARY KEY,
    handoff_id UUID NOT NULL REFERENCES t_handoff_record(handoff_id) ON DELETE CASCADE,
    auditor_id UUID NOT NULL,
    role VARCHAR(50),
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- ====================================================================
-- Indexes for Query Performance
-- ====================================================================
CREATE INDEX idx_handoff_record_case ON t_handoff_record(case_id);
CREATE INDEX idx_handoff_record_code ON t_handoff_record(case_code);
CREATE INDEX idx_handoff_record_team_lead ON t_handoff_record(team_lead_id);
CREATE INDEX idx_handoff_record_date ON t_handoff_record(handoff_date);
CREATE INDEX idx_handoff_team_member_handoff ON t_handoff_team_member(handoff_id);
CREATE INDEX idx_handoff_team_member_auditor ON t_handoff_team_member(auditor_id);

-- ====================================================================
-- Table & Column Documentation
-- ====================================================================
COMMENT ON TABLE t_handoff_record IS 'Joint Audit Committee: Handoff records representing approved cases transitioning to Execution Workspace. Captures committee decisions, team assignments, and execution case linkage.';
COMMENT ON COLUMN t_handoff_record.handoff_id IS 'Unique identifier for the handoff record (UUID)';
COMMENT ON COLUMN t_handoff_record.case_id IS 'Foreign key reference to t_committee_case - unique constraint ensures one handoff per case';
COMMENT ON COLUMN t_handoff_record.case_code IS 'Unique execution case code (format: JAC-{YYYY}-{SEQ}) - globally unique, traceable, and used as identifier in Execution Workspace';
COMMENT ON COLUMN t_handoff_record.execution_case_id IS 'UUID of corresponding case in Execution Workspace after transfer (populated after handoff delivery confirmation)';
COMMENT ON COLUMN t_handoff_record.team_lead_id IS 'UUID of the auditor appointed as team lead by chairperson - leads the execution phase';
COMMENT ON COLUMN t_handoff_record.committee_summary IS 'Summary of committee findings, research, and rationale for approval';
COMMENT ON COLUMN t_handoff_record.key_findings IS 'Key issues identified during committee review that should be prioritized in execution phase';
COMMENT ON COLUMN t_handoff_record.decision IS 'Committee decision snapshot - must be APPROVED (only approved cases have handoff records) or REJECTED';
COMMENT ON COLUMN t_handoff_record.handoff_date IS 'Timestamp when handoff record was created (auto-populated with CURRENT_TIMESTAMP)';
COMMENT ON COLUMN t_handoff_record.created_by IS 'UUID of chairperson who initiated the handoff';
COMMENT ON COLUMN t_handoff_record.delivered_at IS 'Timestamp when Execution Workspace confirmed receipt (null until confirmed)';
COMMENT ON COLUMN t_handoff_record.version IS 'Version number for optimistic locking in JPA';

COMMENT ON TABLE t_handoff_team_member IS 'Joint Audit Committee: Team member assignments for handoff - links auditors to handoff records with role information';
COMMENT ON COLUMN t_handoff_team_member.member_id IS 'Unique identifier for the team member assignment (UUID)';
COMMENT ON COLUMN t_handoff_team_member.handoff_id IS 'Foreign key reference to t_handoff_record (with CASCADE delete to maintain referential integrity)';
COMMENT ON COLUMN t_handoff_team_member.auditor_id IS 'UUID of the auditor assigned to this execution team (from user-management-service)';
COMMENT ON COLUMN t_handoff_team_member.role IS 'Role of auditor in team (e.g., PRIMARY, SUPPORT, or null for standard member)';
COMMENT ON COLUMN t_handoff_team_member.assigned_at IS 'Timestamp when auditor was assigned to team (auto-populated with CURRENT_TIMESTAMP)';
COMMENT ON COLUMN t_handoff_team_member.version IS 'Version number for optimistic locking in JPA';

-- ====================================================================
-- Rollback Script
-- ====================================================================
-- DROP INDEX IF EXISTS idx_handoff_team_member_auditor;
-- DROP INDEX IF EXISTS idx_handoff_team_member_handoff;
-- DROP INDEX IF EXISTS idx_handoff_record_date;
-- DROP INDEX IF EXISTS idx_handoff_record_team_lead;
-- DROP INDEX IF EXISTS idx_handoff_record_code;
-- DROP INDEX IF EXISTS idx_handoff_record_case;
-- DROP TABLE IF EXISTS t_handoff_team_member;
-- DROP TABLE IF EXISTS t_handoff_record;
