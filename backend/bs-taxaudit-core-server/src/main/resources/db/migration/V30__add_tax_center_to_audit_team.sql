-- V30: Add tax_center column to t_audit_team and backfill from team leader's assigned location
ALTER TABLE t_audit_team ADD COLUMN IF NOT EXISTS tax_center VARCHAR(100);

-- Backfill from t_user based on team_leader_id
UPDATE t_audit_team t
SET tax_center = u.assigned_location
FROM t_user u
WHERE t.team_leader_id = u.user_id
  AND t.tax_center IS NULL;

-- Create index for tax_center filtering
CREATE INDEX IF NOT EXISTS idx_audit_team_tax_center ON t_audit_team(tax_center);
