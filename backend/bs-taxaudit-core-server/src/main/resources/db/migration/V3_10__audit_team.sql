-- ====================================================================
-- V3_9__audit_team.sql
-- Audit Team formation and capacity tracking
-- ====================================================================
-- Stores teams formed during auditor nomination process.
-- Teams consist of a team leader and nominated auditors.
-- Teams have capacity limits for concurrent case assignments.
-- ====================================================================

CREATE TABLE t_audit_team (
    team_id UUID PRIMARY KEY,
    team_leader_id UUID NOT NULL,
    team_leader_name VARCHAR(255) NOT NULL,
    auditor_ids TEXT NOT NULL DEFAULT '[]',
    auditor_names TEXT DEFAULT '[]',
    capacity INTEGER NOT NULL DEFAULT 5,
    current_cases INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    description VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

CREATE INDEX idx_audit_team_leader ON t_audit_team(team_leader_id);
CREATE INDEX idx_audit_team_active ON t_audit_team(active);
CREATE INDEX idx_audit_team_capacity ON t_audit_team(capacity, current_cases);

COMMENT ON TABLE t_audit_team IS 'Audit teams formed during auditor nomination - tracks team composition and case capacity';
COMMENT ON COLUMN t_audit_team.team_leader_id IS 'UUID of the team leader';
COMMENT ON COLUMN t_audit_team.auditor_ids IS 'JSON array of auditor UUIDs in this team';
COMMENT ON COLUMN t_audit_team.capacity IS 'Maximum concurrent cases this team can handle';
COMMENT ON COLUMN t_audit_team.current_cases IS 'Current number of active cases assigned to this team';
