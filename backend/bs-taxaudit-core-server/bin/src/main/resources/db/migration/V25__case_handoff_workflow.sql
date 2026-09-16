-- V25: Case Handoff and Auditor Assignment Workflow
-- Creates tables and schema modifications to support handoff workflow:
-- chairperson → team_leader → auditor assignment chain

-- ============================================================================
-- 1. case_handoff Table
-- Records when a case is handed off from chairperson to team leader
-- ============================================================================
CREATE TABLE IF NOT EXISTS case_handoff (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id             UUID        NOT NULL UNIQUE,
    team_leader_id      UUID        NOT NULL,
    assigned_by_id      UUID        NOT NULL,  -- chairperson who performed handoff
    assignment_date     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    assignment_reason   TEXT,
    status              VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE, CANCELLED, SUPERSEDED
    cancelled_at        TIMESTAMPTZ,
    cancelled_by_id     UUID,
    cancellation_reason TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_handoff_case FOREIGN KEY (case_id) REFERENCES ap_audit_cases(id) ON DELETE CASCADE,
    CONSTRAINT fk_handoff_team_leader FOREIGN KEY (team_leader_id) REFERENCES users(id),
    CONSTRAINT fk_handoff_assigned_by FOREIGN KEY (assigned_by_id) REFERENCES users(id)
);

-- Indexes for case_handoff table
CREATE INDEX idx_case_handoff_case_id ON case_handoff(case_id);
CREATE INDEX idx_case_handoff_team_leader ON case_handoff(team_leader_id);
CREATE INDEX idx_case_handoff_status ON case_handoff(status);
CREATE INDEX idx_case_handoff_created_at ON case_handoff(created_at);

-- ============================================================================
-- 2. case_auditor_assignment Table
-- Records when a team leader assigns an auditor to execute a case
-- ============================================================================
CREATE TABLE IF NOT EXISTS case_auditor_assignment (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id             UUID        NOT NULL,
    auditor_id          UUID        NOT NULL,
    assigned_by_id      UUID        NOT NULL,  -- team leader who performed assignment
    assigned_date       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status              VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE, SUPERSEDED, CANCELLED
    superseded_at       TIMESTAMPTZ,
    superseded_by_id    UUID,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_auditor_assign_case FOREIGN KEY (case_id) REFERENCES ap_audit_cases(id) ON DELETE CASCADE,
    CONSTRAINT fk_auditor_assign_auditor FOREIGN KEY (auditor_id) REFERENCES users(id),
    CONSTRAINT fk_auditor_assign_assigned_by FOREIGN KEY (assigned_by_id) REFERENCES users(id),
    CONSTRAINT uk_case_auditor_active UNIQUE(case_id) WHERE status = 'ACTIVE'
);

-- Indexes for case_auditor_assignment table
CREATE INDEX idx_auditor_assign_case ON case_auditor_assignment(case_id);
CREATE INDEX idx_auditor_assign_auditor ON case_auditor_assignment(auditor_id);
CREATE INDEX idx_auditor_assign_status ON case_auditor_assignment(status);

-- ============================================================================
-- 3. team_members Table
-- Tracks membership relationship: which auditors belong to which team leader
-- Supports auditor team assignment validation (C2 bug fix)
-- ============================================================================
CREATE TABLE IF NOT EXISTS team_members (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_leader_id  UUID        NOT NULL,
    auditor_id      UUID        NOT NULL,
    joined_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    left_at         TIMESTAMPTZ,
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_team_leader FOREIGN KEY (team_leader_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_team_auditor FOREIGN KEY (auditor_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_team_membership UNIQUE(team_leader_id, auditor_id)
);

-- Compound index for active member queries: (team_leader_id, is_active, left_at)
-- Optimizes: SELECT * WHERE team_leader_id = ? AND is_active = true AND left_at IS NULL
CREATE INDEX idx_team_members_team_leader ON team_members(team_leader_id, is_active, left_at);

-- Index for reverse lookups: which teams does an auditor belong to
CREATE INDEX idx_team_members_auditor ON team_members(auditor_id, team_leader_id);

-- Filtered index for active members only (C3 bug fix: empty team detection)
-- Optimizes: COUNT(*) WHERE team_leader_id = ? AND is_active = true AND left_at IS NULL
CREATE INDEX idx_team_members_active ON team_members(team_leader_id) WHERE is_active = true AND left_at IS NULL;

-- ============================================================================
-- 4. Alter ap_audit_cases Table
-- Add handoff-related columns to track team leader and auditor assignments
-- ============================================================================

-- Column: assigned_team_leader_id
-- Stores which team leader this case was handed off to
-- Used for authorization: only assigned team leader can access/modify
ALTER TABLE ap_audit_cases ADD COLUMN IF NOT EXISTS assigned_team_leader_id UUID REFERENCES users(id);

-- Column: handoff_date
-- Timestamp when case was handed off from chairperson to team leader
ALTER TABLE ap_audit_cases ADD COLUMN IF NOT EXISTS handoff_date TIMESTAMPTZ;

-- Column: handoff_reason
-- Reason provided by chairperson during handoff
ALTER TABLE ap_audit_cases ADD COLUMN IF NOT EXISTS handoff_reason TEXT;

-- Column: assigned_auditor_id
-- Stores which auditor is executing this case
-- Set when team leader performs auditor assignment
ALTER TABLE ap_audit_cases ADD COLUMN IF NOT EXISTS assigned_auditor_id UUID REFERENCES users(id);

-- Index on assigned_team_leader_id for filtering cases by team leader
CREATE INDEX IF NOT EXISTS idx_ap_cases_team_leader ON ap_audit_cases(assigned_team_leader_id);

-- Index on assigned_auditor_id for filtering cases by auditor
CREATE INDEX IF NOT EXISTS idx_ap_cases_auditor ON ap_audit_cases(assigned_auditor_id);
