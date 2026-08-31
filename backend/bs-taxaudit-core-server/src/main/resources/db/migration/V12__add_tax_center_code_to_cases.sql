-- Migration V12: Add tax_center_code and estimated_revenue to ap_audit_cases
-- These columns allow direct queries on cases by tax center without join via allocations

-- Add tax_center_code for direct TC-based filtering
ALTER TABLE ap_audit_cases ADD COLUMN IF NOT EXISTS tax_center_code VARCHAR(64);

-- Add estimated_revenue (was in entity but missing from migration)
ALTER TABLE ap_audit_cases ADD COLUMN IF NOT EXISTS estimated_revenue BIGINT;

-- Add region_code for cross-region queries
ALTER TABLE ap_audit_cases ADD COLUMN IF NOT EXISTS region_code VARCHAR(10);

-- Add taxpayer_name for display without taxpayer service join
ALTER TABLE ap_audit_cases ADD COLUMN IF NOT EXISTS taxpayer_name VARCHAR(256);

-- Add sector for display purposes
ALTER TABLE ap_audit_cases ADD COLUMN IF NOT EXISTS sector VARCHAR(128);

-- Add assigned_committee_id (separate from team leader to distinguish roles clearly)
-- Note: We use assigned_team_leader_id for both team leaders AND committee members
-- The audit_type determines which is which (JOINT_AUDIT/TRANSFER_PRICING = committee)

-- Indexes for new columns
CREATE INDEX IF NOT EXISTS idx_ap_audit_cases_tax_center ON ap_audit_cases(tax_center_code);
CREATE INDEX IF NOT EXISTS idx_ap_audit_cases_region ON ap_audit_cases(region_code);
CREATE INDEX IF NOT EXISTS idx_ap_audit_cases_audit_type ON ap_audit_cases(audit_type);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_ap_audit_cases_tc_status ON ap_audit_cases(tax_center_code, status);
CREATE INDEX IF NOT EXISTS idx_ap_audit_cases_tl_status ON ap_audit_cases(assigned_team_leader_id, status);
