ALTER TABLE ap_annual_audit_plans ADD COLUMN IF NOT EXISTS estimated_revenue NUMERIC(19, 2);
ALTER TABLE ap_annual_audit_plans ADD COLUMN IF NOT EXISTS estimated_revenue_distribution JSONB;

ALTER TABLE ap_plan_allocations ADD COLUMN IF NOT EXISTS estimated_revenue NUMERIC(19, 2);
ALTER TABLE ap_plan_allocations ADD COLUMN IF NOT EXISTS revenue_by_audit_type JSONB;
