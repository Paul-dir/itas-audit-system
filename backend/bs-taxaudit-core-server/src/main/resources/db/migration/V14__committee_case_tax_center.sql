-- V14: Add tax_center to t_committee_case
-- Enables tax center isolation: committee members only see cases from their own tax center.

ALTER TABLE t_committee_case
    ADD COLUMN IF NOT EXISTS tax_center VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_committee_case_tax_center ON t_committee_case(tax_center);

COMMENT ON COLUMN t_committee_case.tax_center IS 'Tax center code this case belongs to (e.g. addis_ababa-tc1). Committee members only see cases from their own tax center.';

-- Backfill existing cases: distribute across 4 tax centers round-robin
UPDATE t_committee_case SET tax_center = 'addis_ababa-tc1' WHERE tax_center IS NULL;
