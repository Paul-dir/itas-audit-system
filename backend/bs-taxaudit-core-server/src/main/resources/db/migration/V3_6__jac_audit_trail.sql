-- ====================================================================
-- V3_6__jac_audit_trail.sql
-- Joint Audit Committee: Immutable Audit Trail & 7-Year Retention
-- ====================================================================
-- Defines immutable audit trail tables for comprehensive governance and
-- legal compliance. All committee actions are permanently logged with
-- cryptographic integrity verification.
--
-- Key Features:
--   - t_committee_audit_log: Immutable operational log (enforced by triggers)
--   - t_committee_audit_log_archive: 7+ year archival for cold storage
--   - JSONB before/after state tracking for forensic analysis
--   - SHA-256 hash for integrity verification and tampering detection
--   - Triggers prevent UPDATE/DELETE operations on logs
--   - Indexes for efficient querying by case, actor, timestamp
--   - Archive strategy supports compliance with legal retention requirements
-- ====================================================================

CREATE TABLE t_committee_audit_log (
    log_id UUID PRIMARY KEY,
    case_id UUID NOT NULL REFERENCES t_committee_case(case_id) ON DELETE CASCADE,
    actor_id UUID NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    before_state JSONB,
    after_state JSONB,
    action_reason TEXT,
    action_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    action_hash VARCHAR(64),
    ip_address VARCHAR(45)
);

-- ====================================================================
-- Archive Table for 7-Year Retention & Cold Storage
-- ====================================================================
-- Mirrors the structure of t_committee_audit_log for archival.
-- Audit entries older than 7 years are moved here via scheduled jobs.
-- Archive table uses same indexes and is also immutable.
-- ====================================================================
CREATE TABLE t_committee_audit_log_archive (
    log_id UUID PRIMARY KEY,
    case_id UUID NOT NULL,
    actor_id UUID NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    before_state JSONB,
    after_state JSONB,
    action_reason TEXT,
    action_timestamp TIMESTAMP NOT NULL,
    action_hash VARCHAR(64),
    ip_address VARCHAR(45),
    archived_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- Indexes for Efficient Audit Trail Queries
-- ====================================================================
-- Primary access patterns:
--   1. By case_id: Find all actions for a specific case
--   2. By timestamp range: Compliance queries for date ranges
--   3. By actor_id: Find all actions by a specific user
--   4. By action_type: Find specific event types
CREATE INDEX idx_committee_audit_log_case ON t_committee_audit_log(case_id);
CREATE INDEX idx_committee_audit_log_time ON t_committee_audit_log(action_timestamp);
CREATE INDEX idx_committee_audit_log_actor ON t_committee_audit_log(actor_id);
CREATE INDEX idx_committee_audit_log_action ON t_committee_audit_log(action_type);

CREATE INDEX idx_committee_audit_log_archive_case ON t_committee_audit_log_archive(case_id);
CREATE INDEX idx_committee_audit_log_archive_time ON t_committee_audit_log_archive(action_timestamp);
CREATE INDEX idx_committee_audit_log_archive_actor ON t_committee_audit_log_archive(actor_id);
CREATE INDEX idx_committee_audit_log_archive_action ON t_committee_audit_log_archive(action_type);

-- ====================================================================
-- Immutability Enforcement: Triggers & Functions
-- ====================================================================
-- PostgreSQL triggers prevent any modification to audit logs.
-- Attempting to UPDATE or DELETE raises an exception.
-- This is the primary enforcement mechanism (database-level).
-- Application-level checks provide defense-in-depth.
-- ====================================================================

CREATE OR REPLACE FUNCTION prevent_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Audit logs are immutable and cannot be modified or deleted. Violation: % operation on log_id: %', TG_OP, NEW.log_id;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE TRIGGER prevent_update_audit_log
    BEFORE UPDATE ON t_committee_audit_log
    FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_modification();

CREATE TRIGGER prevent_delete_audit_log
    BEFORE DELETE ON t_committee_audit_log
    FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_modification();

CREATE TRIGGER prevent_update_audit_log_archive
    BEFORE UPDATE ON t_committee_audit_log_archive
    FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_modification();

CREATE TRIGGER prevent_delete_audit_log_archive
    BEFORE DELETE ON t_committee_audit_log_archive
    FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_modification();

-- ====================================================================
-- Table & Column Documentation
-- ====================================================================
COMMENT ON TABLE t_committee_audit_log IS 'Joint Audit Committee: Immutable operational audit log recording ALL committee actions for governance, compliance, and forensic analysis. 7-year legal retention enforced. Operations: INSERT only (triggers prevent UPDATE/DELETE).';
COMMENT ON COLUMN t_committee_audit_log.log_id IS 'Unique identifier for this audit log entry (UUID)';
COMMENT ON COLUMN t_committee_audit_log.case_id IS 'Foreign key reference to t_committee_case - identifies which case this action relates to';
COMMENT ON COLUMN t_committee_audit_log.actor_id IS 'UUID of the user/actor who performed the action (from user-management-service). Enables tracking of who did what.';
COMMENT ON COLUMN t_committee_audit_log.action_type IS 'Type of action performed (e.g., VOTE_CAST, RESEARCH_NOTE_ADDED, TEAM_ASSIGNED, VIABILITY_FINALIZED, SLA_OVERRIDDEN, etc.)';
COMMENT ON COLUMN t_committee_audit_log.before_state IS 'JSONB snapshot of the entity state BEFORE the action (enables before/after comparison and rollback simulation)';
COMMENT ON COLUMN t_committee_audit_log.after_state IS 'JSONB snapshot of the entity state AFTER the action (enables forensic analysis of what changed)';
COMMENT ON COLUMN t_committee_audit_log.action_reason IS 'Justification or context for the action (e.g., SLA override reason, vote reasoning, etc.)';
COMMENT ON COLUMN t_committee_audit_log.action_timestamp IS 'Precise UTC timestamp when the action occurred (auto-populated, NOT NULL, used for time-series queries)';
COMMENT ON COLUMN t_committee_audit_log.action_hash IS 'SHA-256 hash of log entry for cryptographic integrity verification and tampering detection';
COMMENT ON COLUMN t_committee_audit_log.ip_address IS 'IP address of the client/actor performing the action (for audit trail completeness and security analysis)';

COMMENT ON TABLE t_committee_audit_log_archive IS 'Joint Audit Committee: Archive of audit logs older than 7 years. Mirrors t_committee_audit_log structure. Also immutable (UPDATE/DELETE prevented by triggers). Cold storage for long-term retention and compliance.';
COMMENT ON COLUMN t_committee_audit_log_archive.archived_at IS 'Timestamp when this entry was moved to archive (populated during archival job)';

COMMENT ON FUNCTION prevent_audit_log_modification() IS 'PostgreSQL function that prevents any modification to audit log tables. Raises exception on UPDATE or DELETE attempt. Enforces immutability at database level.';

-- ====================================================================
-- Rollback Script
-- ====================================================================
-- DROP TRIGGER IF EXISTS prevent_delete_audit_log_archive ON t_committee_audit_log_archive;
-- DROP TRIGGER IF EXISTS prevent_update_audit_log_archive ON t_committee_audit_log_archive;
-- DROP TRIGGER IF EXISTS prevent_delete_audit_log ON t_committee_audit_log;
-- DROP TRIGGER IF EXISTS prevent_update_audit_log ON t_committee_audit_log;
-- DROP FUNCTION IF EXISTS prevent_audit_log_modification();
-- DROP INDEX IF EXISTS idx_committee_audit_log_archive_action;
-- DROP INDEX IF EXISTS idx_committee_audit_log_archive_actor;
-- DROP INDEX IF EXISTS idx_committee_audit_log_archive_time;
-- DROP INDEX IF EXISTS idx_committee_audit_log_archive_case;
-- DROP INDEX IF EXISTS idx_committee_audit_log_action;
-- DROP INDEX IF EXISTS idx_committee_audit_log_actor;
-- DROP INDEX IF EXISTS idx_committee_audit_log_time;
-- DROP INDEX IF EXISTS idx_committee_audit_log_case;
-- DROP TABLE IF EXISTS t_committee_audit_log_archive;
-- DROP TABLE IF EXISTS t_committee_audit_log;
