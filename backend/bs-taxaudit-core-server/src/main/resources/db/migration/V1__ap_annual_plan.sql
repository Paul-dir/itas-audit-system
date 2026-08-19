-- V1__ap_annual_plan.sql
-- Sprint 01: Annual Audit Plan Creation
-- Creates tables for annual audit plans and allocations at tax center level

-- Create ap_annual_audit_plans table
CREATE TABLE ap_annual_audit_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_year INT NOT NULL,
    plan_name VARCHAR(256) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
    created_by VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    version BIGINT NOT NULL DEFAULT 0
);

-- Create ap_plan_allocations table
CREATE TABLE ap_plan_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    annual_plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id) ON DELETE CASCADE,
    tax_center_code VARCHAR(64) NOT NULL,
    proposed_count INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_annual_plans_status ON ap_annual_audit_plans(status);
CREATE INDEX idx_annual_plans_year ON ap_annual_audit_plans(plan_year);
CREATE INDEX idx_plan_allocations_plan ON ap_plan_allocations(annual_plan_id);
CREATE INDEX idx_plan_allocations_tax_center ON ap_plan_allocations(annual_plan_id, tax_center_code);

-- Add comments for documentation
COMMENT ON TABLE ap_annual_audit_plans IS 'Audit Planning: Annual audit plans defining target quotas per tax center';
COMMENT ON COLUMN ap_annual_audit_plans.id IS 'Unique identifier (UUID)';
COMMENT ON COLUMN ap_annual_audit_plans.plan_year IS 'Fiscal year for the plan (e.g., 2026)';
COMMENT ON COLUMN ap_annual_audit_plans.plan_name IS 'Plan name (e.g., FY2026 National Audit Plan)';
COMMENT ON COLUMN ap_annual_audit_plans.status IS 'Plan status: DRAFT, SUBMITTED, APPROVED, ACTIVE';
COMMENT ON COLUMN ap_annual_audit_plans.created_by IS 'Actor who created the plan (from X-Actor-Id header)';
COMMENT ON COLUMN ap_annual_audit_plans.created_at IS 'Timestamp when plan was created';
COMMENT ON COLUMN ap_annual_audit_plans.updated_at IS 'Timestamp of last update';
COMMENT ON COLUMN ap_annual_audit_plans.version IS 'Version number for optimistic locking';

COMMENT ON TABLE ap_plan_allocations IS 'Audit Planning: Case allocations per tax center for a plan';
COMMENT ON COLUMN ap_plan_allocations.id IS 'Unique identifier (UUID)';
COMMENT ON COLUMN ap_plan_allocations.annual_plan_id IS 'Foreign key to ap_annual_audit_plans';
COMMENT ON COLUMN ap_plan_allocations.tax_center_code IS 'Tax center code (e.g., TC-AA-001)';
COMMENT ON COLUMN ap_plan_allocations.proposed_count IS 'Proposed number of audit cases';
COMMENT ON COLUMN ap_plan_allocations.created_at IS 'Timestamp when allocation was created';
COMMENT ON COLUMN ap_plan_allocations.updated_at IS 'Timestamp of last update';
