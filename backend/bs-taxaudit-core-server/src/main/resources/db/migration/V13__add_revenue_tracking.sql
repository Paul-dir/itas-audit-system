-- Revenue tracking at regional deployment level
ALTER TABLE ap_regional_deployments ADD COLUMN IF NOT EXISTS estimated_revenue BIGINT DEFAULT 0;
ALTER TABLE ap_regional_deployments ADD COLUMN IF NOT EXISTS revenue_by_audit_type JSONB;

-- Index for revenue queries
CREATE INDEX IF NOT EXISTS idx_cases_estimated_revenue ON ap_audit_cases(estimated_revenue);
CREATE INDEX IF NOT EXISTS idx_allocations_revenue ON ap_plan_allocations(estimated_revenue);
