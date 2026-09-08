-- Drop FK constraint on ap_audit_cases.plan_id so committee-case-generated 
-- audit cases don't require a matching ap_annual_audit_plans row
ALTER TABLE ap_audit_cases DROP CONSTRAINT IF EXISTS ap_audit_cases_plan_id_fkey;

-- Make plan_id nullable (committee cases won't have an audit plan)
ALTER TABLE ap_audit_cases ALTER COLUMN plan_id DROP NOT NULL;
