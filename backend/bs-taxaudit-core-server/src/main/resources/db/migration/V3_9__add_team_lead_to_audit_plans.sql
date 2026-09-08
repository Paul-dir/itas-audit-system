-- ═══════════════════════════════════════════════════════════════════════════
-- Migration V3_9: Add Team Lead Fields to Audit Plan Records
-- Purpose: Enable team leaders to see audit plans submitted by auditors
-- Date: 2026-09-05
-- Note: Wrapped in DO block because the table is created by Hibernate DDL,
--       not by an earlier Flyway migration.
-- ═══════════════════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 't_audit_plan_record') THEN
    -- Add team lead and review fields to t_audit_plan_record
    ALTER TABLE t_audit_plan_record
    ADD COLUMN IF NOT EXISTS team_lead_id VARCHAR(255),
    ADD COLUMN IF NOT EXISTS reviewed_by VARCHAR(255),
    ADD COLUMN IF NOT EXISTS review_timestamp TIMESTAMP,
    ADD COLUMN IF NOT EXISTS review_comments TEXT,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_plan_team_lead_status
      ON t_audit_plan_record(team_lead_id, status);

    CREATE INDEX IF NOT EXISTS idx_plan_created_at_desc
      ON t_audit_plan_record(created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_plan_team_lead_pending
      ON t_audit_plan_record(team_lead_id)
      WHERE status IN ('SUBMITTED', 'REVISION_REQUESTED');

    -- Add comments documenting the new fields
    COMMENT ON COLUMN t_audit_plan_record.team_lead_id IS 'References the team lead assigned to the audit case (from ApAuditCaseEntity.assignedTeamLeaderId)';
    COMMENT ON COLUMN t_audit_plan_record.reviewed_by IS 'ID of team lead who reviewed this plan';
    COMMENT ON COLUMN t_audit_plan_record.review_timestamp IS 'When the team lead reviewed this plan';
    COMMENT ON COLUMN t_audit_plan_record.review_comments IS 'Reason for approval/rejection/revision request';
    COMMENT ON COLUMN t_audit_plan_record.created_at IS 'When the plan was submitted by the auditor';
  END IF;
END $$;
