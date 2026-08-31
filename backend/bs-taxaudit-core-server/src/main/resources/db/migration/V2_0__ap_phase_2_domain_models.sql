-- Phase II: AP Cluster - Domain Models Implementation
-- Creates tables for Annual Audit Plan workflow with regional-level allocations

-- Drop old V1 tables if they exist (from old schema)
DROP TABLE IF EXISTS ap_plan_allocations CASCADE;
DROP TABLE IF EXISTS ap_annual_audit_plans CASCADE;
DROP TYPE IF EXISTS ap_plan_status;

-- Annual Audit Plans Table - Main aggregate root
CREATE TABLE IF NOT EXISTS ap_annual_audit_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_year INTEGER NOT NULL,
    plan_name VARCHAR(256) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',  -- Store as VARCHAR for JPA compatibility
    
    -- Planning Team Phase
    created_by VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Director Approval Phase (routes allocations, no modifications)
    submitted_to_director_by VARCHAR(64),
    submitted_to_director_at TIMESTAMPTZ,
    director_approved_by VARCHAR(64),
    director_approved_at TIMESTAMPTZ,
    director_approval_reason TEXT,
    
    -- Regional Director Approval Phase (divides regional allocations into tax center allocations)
    submitted_to_regional_by VARCHAR(64),
    submitted_to_regional_at TIMESTAMPTZ,
    regional_director_approved_by VARCHAR(64),
    regional_director_approved_at TIMESTAMPTZ,
    regional_director_approval_reason TEXT,
    
    -- Tax Center Phase
    sent_to_tax_center_at TIMESTAMPTZ,
    
    -- Distribution Data (JSON storage for frontend)
    distribution_json JSONB,
    
    -- Regions routing
    sent_to_regions_at TIMESTAMPTZ,
    sent_to_regions_by VARCHAR(64),
    regions_received_count INTEGER DEFAULT 0,
    
    -- Metadata
    updated_at TIMESTAMPTZ,
    version BIGINT DEFAULT 0,
    
    -- Unique constraint to prevent duplicate plans per year
    CONSTRAINT uk_ap_plan_year_name UNIQUE(plan_year, plan_name)
);

CREATE INDEX IF NOT EXISTS idx_ap_plans_status ON ap_annual_audit_plans(status);
CREATE INDEX IF NOT EXISTS idx_ap_plans_year ON ap_annual_audit_plans(plan_year);
CREATE INDEX IF NOT EXISTS idx_ap_plans_created_by ON ap_annual_audit_plans(created_by);
CREATE INDEX IF NOT EXISTS idx_ap_plans_created_at ON ap_annual_audit_plans(created_at);

-- Plan Allocations Table - Regional and Tax Center Allocations
-- Dual-purpose table:
-- - Regional Allocations: tax_center_code IS NULL, region_code is set
-- - Tax Center Allocations: tax_center_code IS NOT NULL, region_code is set
CREATE TABLE IF NOT EXISTS ap_plan_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id) ON DELETE CASCADE,
    tax_center_code VARCHAR(64),           -- NULL for regional allocations, set for tax center allocations
    region_code VARCHAR(10) NOT NULL,
    proposed_count INTEGER NOT NULL,
    
    -- Regional Director Division (only for regional allocations being divided into tax centers)
    regional_divided_count INTEGER,
    regional_division_reason TEXT,
    
    -- Tax Center Feedback (only at tax center allocation level)
    tc_adjusted_count INTEGER,
    tc_justification TEXT,
    tc_feedback_submitted BOOLEAN DEFAULT FALSE,
    tc_feedback_submitted_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    
    -- Constraints: One regional allocation per region per plan, one tax center allocation per tax center per plan
    CONSTRAINT uk_ap_allocation_regional UNIQUE(plan_id, region_code, tax_center_code)
);

CREATE INDEX IF NOT EXISTS idx_ap_allocations_plan ON ap_plan_allocations(plan_id);
CREATE INDEX IF NOT EXISTS idx_ap_allocations_region ON ap_plan_allocations(region_code);
CREATE INDEX IF NOT EXISTS idx_ap_allocations_tax_center ON ap_plan_allocations(tax_center_code);
CREATE INDEX IF NOT EXISTS idx_ap_allocations_regional_only ON ap_plan_allocations(plan_id, region_code) 
    WHERE tax_center_code IS NULL;
CREATE INDEX IF NOT EXISTS idx_ap_allocations_tc_feedback ON ap_plan_allocations(tc_feedback_submitted);

-- Plan Audit Log Table - Immutable audit trail
CREATE TABLE IF NOT EXISTS ap_plan_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id) ON DELETE CASCADE,
    action VARCHAR(64) NOT NULL,
    actor_id VARCHAR(64) NOT NULL,
    actor_role VARCHAR(64) NOT NULL,
    reason TEXT,
    changed_fields JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ap_audit_logs_plan ON ap_plan_audit_logs(plan_id);
CREATE INDEX IF NOT EXISTS idx_ap_audit_logs_actor ON ap_plan_audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_ap_audit_logs_created_at ON ap_plan_audit_logs(created_at);

-- Prevent updates/deletes on audit log for compliance
CREATE OR REPLACE FUNCTION ap_prevent_audit_log_update()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Updates and Deletes are forbidden on ap_plan_audit_logs (Compliance Rule)';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ap_prevent_audit_log_update ON ap_plan_audit_logs;
CREATE TRIGGER trg_ap_prevent_audit_log_update
BEFORE UPDATE OR DELETE ON ap_plan_audit_logs
FOR EACH ROW EXECUTE FUNCTION ap_prevent_audit_log_update();

-- Auto-update updated_at timestamp on plans
CREATE OR REPLACE FUNCTION ap_update_plan_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ap_update_plan_timestamp ON ap_annual_audit_plans;
CREATE TRIGGER trg_ap_update_plan_timestamp
BEFORE UPDATE ON ap_annual_audit_plans
FOR EACH ROW EXECUTE FUNCTION ap_update_plan_timestamp();

-- Auto-update updated_at timestamp on allocations
DROP TRIGGER IF EXISTS trg_ap_update_allocation_timestamp ON ap_plan_allocations;
CREATE TRIGGER trg_ap_update_allocation_timestamp
BEFORE UPDATE ON ap_plan_allocations
FOR EACH ROW EXECUTE FUNCTION ap_update_plan_timestamp();
