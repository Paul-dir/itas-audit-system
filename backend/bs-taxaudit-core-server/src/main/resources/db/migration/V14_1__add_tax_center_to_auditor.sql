-- V14: Add tax_center to t_auditor so committee can filter auditors by their tax center
-- Auditors are assigned to tax centers via t_user.assigned_location.
-- We add the same column to t_auditor for fast search without JOIN.

ALTER TABLE t_auditor ADD COLUMN IF NOT EXISTS tax_center VARCHAR(100);

-- Populate tax_center from t_user for all existing auditors
UPDATE t_auditor SET tax_center = (
    SELECT u.assigned_location FROM t_user u
    WHERE u.user_id = t_auditor.auditor_id
      AND u.user_type = 'AUDITOR'
      AND u.assigned_location IS NOT NULL
    LIMIT 1
);

-- Index for fast committee tax-center filtering
CREATE INDEX IF NOT EXISTS idx_auditor_tax_center ON t_auditor(tax_center);
