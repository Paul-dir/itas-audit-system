-- ====================================================================
-- V3_0__jac_committee_cases.sql
-- Joint Audit Committee: Committee Cases & Status History
-- ====================================================================
-- Defines the primary aggregate root for committee case management.
-- Tracks case lifecycle from intake through transfer to execution workspace.
-- Includes case context (taxpayer, risk), status tracking, ownership, and decisions.
-- ====================================================================

CREATE TABLE t_committee_case (
    case_id UUID PRIMARY KEY,
    original_case_id UUID NOT NULL,
    case_code VARCHAR(50),
    taxpayer_id UUID NOT NULL,
    taxpayer_name VARCHAR(255) NOT NULL,
    tax_id_number VARCHAR(50) NOT NULL UNIQUE,
    segment VARCHAR(50),
    industry VARCHAR(100),
    risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_priority VARCHAR(20),
    risk_criteria JSONB,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_VOTES',
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    committee_deadline TIMESTAMP NOT NULL,
    extended_deadline TIMESTAMP,
    extension_count INTEGER DEFAULT 0,
    current_owner_id UUID,
    ownership_acquired_at TIMESTAMP,
    decision VARCHAR(50),
    decision_date TIMESTAMP,
    decision_reason TEXT,
    chairperson_id UUID,
    handoff_record_id UUID,
    handoff_date TIMESTAMP,
    created_by UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0,
    UNIQUE(original_case_id, case_code)
);

CREATE INDEX idx_committee_case_status ON t_committee_case(status);
CREATE INDEX idx_committee_case_taxpayer ON t_committee_case(taxpayer_id);
CREATE INDEX idx_committee_case_deadline ON t_committee_case(committee_deadline);
CREATE INDEX idx_committee_case_owner ON t_committee_case(current_owner_id);
CREATE INDEX idx_committee_case_chairperson ON t_committee_case(chairperson_id);
CREATE INDEX idx_committee_case_created ON t_committee_case(created_date);

-- Add table and column comments for documentation
COMMENT ON TABLE t_committee_case IS 'Joint Audit Committee: Primary aggregate tracking high-risk cases awaiting committee review';
COMMENT ON COLUMN t_committee_case.case_id IS 'Unique identifier for the committee case (UUID)';
COMMENT ON COLUMN t_committee_case.original_case_id IS 'Reference to the originating risk-engine case';
COMMENT ON COLUMN t_committee_case.case_code IS 'Unique execution code assigned after committee approval (null until approved)';
COMMENT ON COLUMN t_committee_case.status IS 'Case status: PENDING_VOTES → TEAM_ASSIGNED → PENDING_VIABILITY → APPROVED/REJECTED';
COMMENT ON COLUMN t_committee_case.created_date IS 'Timestamp when case was first added to committee (set by risk-engine)';
COMMENT ON COLUMN t_committee_case.committee_deadline IS 'SLA deadline for committee decision (from risk-engine)';
COMMENT ON COLUMN t_committee_case.extended_deadline IS 'Extended deadline if SLA was overridden by chairperson';
COMMENT ON COLUMN t_committee_case.extension_count IS 'Number of times SLA was extended (max 3)';
COMMENT ON COLUMN t_committee_case.current_owner_id IS 'Committee member who currently has case checked out (null if released)';
COMMENT ON COLUMN t_committee_case.ownership_acquired_at IS 'Timestamp when current member took ownership';
COMMENT ON COLUMN t_committee_case.decision IS 'Committee decision: APPROVED, REJECTED, PENDING';
COMMENT ON COLUMN t_committee_case.chairperson_id IS 'Chairperson who approved/rejected the case';
COMMENT ON COLUMN t_committee_case.version IS 'Version number for optimistic locking';

-- ====================================================================
-- Case Status History for Audit Trail
-- ====================================================================
-- Immutable audit trail recording all status transitions.
-- Enables compliance, debugging, and audit trail requirements.
-- ====================================================================

CREATE TABLE t_case_status_history (
    history_id UUID PRIMARY KEY,
    case_id UUID NOT NULL REFERENCES t_committee_case(case_id) ON DELETE CASCADE,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    transition_reason TEXT,
    transitioned_by UUID NOT NULL,
    transitioned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_case_status_history_case ON t_case_status_history(case_id);
CREATE INDEX idx_case_status_history_time ON t_case_status_history(transitioned_at);

-- Add table and column comments for documentation
COMMENT ON TABLE t_case_status_history IS 'Joint Audit Committee: Immutable audit trail recording all case status transitions';
COMMENT ON COLUMN t_case_status_history.history_id IS 'Unique identifier for this audit entry (UUID)';
COMMENT ON COLUMN t_case_status_history.case_id IS 'Foreign key reference to t_committee_case';
COMMENT ON COLUMN t_case_status_history.old_status IS 'Previous status (null for initial creation)';
COMMENT ON COLUMN t_case_status_history.new_status IS 'New status after transition';
COMMENT ON COLUMN t_case_status_history.transition_reason IS 'Reason/justification for the status change';
COMMENT ON COLUMN t_case_status_history.transitioned_by IS 'Actor (user/system) who triggered the transition';
COMMENT ON COLUMN t_case_status_history.transitioned_at IS 'Timestamp when transition occurred';

-- ====================================================================
-- Rollback Script
-- ====================================================================
-- DROP INDEX IF EXISTS idx_case_status_history_time;
-- DROP INDEX IF EXISTS idx_case_status_history_case;
-- DROP TABLE IF EXISTS t_case_status_history;
-- DROP INDEX IF EXISTS idx_committee_case_created;
-- DROP INDEX IF EXISTS idx_committee_case_chairperson;
-- DROP INDEX IF EXISTS idx_committee_case_owner;
-- DROP INDEX IF EXISTS idx_committee_case_deadline;
-- DROP INDEX IF EXISTS idx_committee_case_taxpayer;
-- DROP INDEX IF EXISTS idx_committee_case_status;
-- DROP TABLE IF EXISTS t_committee_case;
