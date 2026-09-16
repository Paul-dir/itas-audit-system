-- V9: Director Approval & Regional Deployment Tracking
-- 
-- PURPOSE:
-- 1. Track when director approves a plan (saves approval metadata)
-- 2. Track when director sends plan to each region (creates regional access records)
-- 3. Ensure regions only see plans AFTER director sends them
-- 4. Maintain complete audit trail of all decisions
--
-- TABLES:
-- - ap_director_approvals: Tracks director's approval/rejection/amendment decisions
-- - ap_regional_deployments: Tracks which regions received which plans and when
-- - ap_regional_plan_access: Controls which regions can access which plans

-- =========================================================================
-- 1. Director Approvals Table - Tracks all director decisions
-- =========================================================================
CREATE TABLE IF NOT EXISTS ap_director_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id) ON DELETE CASCADE,
    director_id VARCHAR(64) NOT NULL,
    decision VARCHAR(50) NOT NULL CHECK (decision IN ('APPROVED', 'REJECTED', 'AMENDMENT_REQUIRED')),
    reason TEXT,
    comment TEXT,
    approved_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    version BIGINT DEFAULT 0,
    
    -- Ensure only one approval record per plan (latest decision)
    CONSTRAINT uk_director_approval_per_plan UNIQUE(plan_id)
);

CREATE INDEX IF NOT EXISTS idx_director_approvals_plan ON ap_director_approvals(plan_id);
CREATE INDEX IF NOT EXISTS idx_director_approvals_director ON ap_director_approvals(director_id);
CREATE INDEX IF NOT EXISTS idx_director_approvals_decision ON ap_director_approvals(decision);
CREATE INDEX IF NOT EXISTS idx_director_approvals_approved_at ON ap_director_approvals(approved_at);

-- =========================================================================
-- 2. Regional Deployments Table - Tracks sending plans to regions
-- =========================================================================
-- When director sends an approved plan to regions, a record is created here
-- This is what controls regional access - regions can only see plans they have a deployment record for
CREATE TABLE IF NOT EXISTS ap_regional_deployments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id) ON DELETE CASCADE,
    region_code VARCHAR(10) NOT NULL,
    director_id VARCHAR(64) NOT NULL,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deployment_note TEXT,
    
    -- Regions receive plan data in this structure
    region_allocated_cases JSONB,  -- { audit_type: count, ... }
    
    -- Region status tracking
    received_at TIMESTAMPTZ,
    acknowledged_by VARCHAR(64),
    acknowledged_at TIMESTAMPTZ,
    
    updated_at TIMESTAMPTZ,
    version BIGINT DEFAULT 0,
    
    -- One deployment per region per plan
    CONSTRAINT uk_regional_deployment_per_plan UNIQUE(plan_id, region_code)
);

CREATE INDEX IF NOT EXISTS idx_regional_deployments_plan ON ap_regional_deployments(plan_id);
CREATE INDEX IF NOT EXISTS idx_regional_deployments_region ON ap_regional_deployments(region_code);
CREATE INDEX IF NOT EXISTS idx_regional_deployments_director ON ap_regional_deployments(director_id);
CREATE INDEX IF NOT EXISTS idx_regional_deployments_sent_at ON ap_regional_deployments(sent_at);
CREATE INDEX IF NOT EXISTS idx_regional_deployments_region_plan ON ap_regional_deployments(region_code, plan_id);

-- =========================================================================
-- 3. Regional Plan Access Control Table
-- =========================================================================
-- Materialized view of which regions can access which plans
-- Used for permission checks and filtering
CREATE TABLE IF NOT EXISTS ap_regional_plan_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id) ON DELETE CASCADE,
    region_code VARCHAR(10) NOT NULL,
    access_granted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    access_expires_at TIMESTAMPTZ,
    
    -- Why was this access granted?
    reason VARCHAR(100),  -- 'DIRECTOR_SENT', 'SENIOR_APPROVED', etc.
    
    updated_at TIMESTAMPTZ,
    
    CONSTRAINT uk_regional_access_per_plan UNIQUE(plan_id, region_code)
);

CREATE INDEX IF NOT EXISTS idx_regional_access_plan ON ap_regional_plan_access(plan_id);
CREATE INDEX IF NOT EXISTS idx_regional_access_region ON ap_regional_plan_access(region_code);
CREATE INDEX IF NOT EXISTS idx_regional_access_granted_at ON ap_regional_plan_access(access_granted_at);
CREATE INDEX IF NOT EXISTS idx_regional_access_region_active ON ap_regional_plan_access(region_code, access_expires_at) 
    WHERE access_expires_at IS NULL;

-- =========================================================================
-- 4. Update ap_annual_audit_plans table
-- =========================================================================
-- Add columns to track sending to regions (different from approval)
ALTER TABLE ap_annual_audit_plans
ADD COLUMN IF NOT EXISTS sent_to_regions_by VARCHAR(64),
ADD COLUMN IF NOT EXISTS sent_to_regions_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS regions_received_count INTEGER DEFAULT 0;

-- =========================================================================
-- 5. Auto-update timestamp functions
-- =========================================================================
CREATE OR REPLACE FUNCTION ap_update_director_approval_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ap_update_director_approval_timestamp ON ap_director_approvals;
CREATE TRIGGER trg_ap_update_director_approval_timestamp
BEFORE UPDATE ON ap_director_approvals
FOR EACH ROW EXECUTE FUNCTION ap_update_director_approval_timestamp();

CREATE OR REPLACE FUNCTION ap_update_regional_deployment_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ap_update_regional_deployment_timestamp ON ap_regional_deployments;
CREATE TRIGGER trg_ap_update_regional_deployment_timestamp
BEFORE UPDATE ON ap_regional_deployments
FOR EACH ROW EXECUTE FUNCTION ap_update_regional_deployment_timestamp();

CREATE OR REPLACE FUNCTION ap_update_regional_access_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ap_update_regional_access_timestamp ON ap_regional_plan_access;
CREATE TRIGGER trg_ap_update_regional_access_timestamp
BEFORE UPDATE ON ap_regional_plan_access
FOR EACH ROW EXECUTE FUNCTION ap_update_regional_access_timestamp();

-- =========================================================================
-- 6. Sync function: When director sends to regions, create access records
-- =========================================================================
-- This ensures that regional deployments automatically grant regional access
CREATE OR REPLACE FUNCTION ap_sync_regional_access_from_deployment()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO ap_regional_plan_access (plan_id, region_code, access_granted_at, reason)
    VALUES (NEW.plan_id, NEW.region_code, NEW.sent_at, 'DIRECTOR_SENT')
    ON CONFLICT (plan_id, region_code) 
    DO UPDATE SET access_granted_at = EXCLUDED.access_granted_at;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ap_sync_regional_access ON ap_regional_deployments;
CREATE TRIGGER trg_ap_sync_regional_access
AFTER INSERT ON ap_regional_deployments
FOR EACH ROW EXECUTE FUNCTION ap_sync_regional_access_from_deployment();

-- =========================================================================
-- 7. Audit log entries for director decisions
-- =========================================================================
-- Add trigger to log director approvals to audit log
CREATE OR REPLACE FUNCTION ap_log_director_approval()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO ap_plan_audit_logs (plan_id, action, actor_id, actor_role, reason, changed_fields)
    VALUES (
        NEW.plan_id,
        'DIRECTOR_' || NEW.decision,
        NEW.director_id,
        'DIRECTOR',
        NEW.reason,
        jsonb_build_object('decision', NEW.decision, 'comment', NEW.comment)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ap_log_director_approval ON ap_director_approvals;
CREATE TRIGGER trg_ap_log_director_approval
AFTER INSERT ON ap_director_approvals
FOR EACH ROW EXECUTE FUNCTION ap_log_director_approval();

-- Add trigger to log regional deployments
CREATE OR REPLACE FUNCTION ap_log_regional_deployment()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO ap_plan_audit_logs (plan_id, action, actor_id, actor_role, reason, changed_fields)
    VALUES (
        NEW.plan_id,
        'REGIONAL_DEPLOYMENT',
        NEW.director_id,
        'DIRECTOR',
        'Plan sent to region ' || NEW.region_code,
        jsonb_build_object('region_code', NEW.region_code, 'allocated_cases', NEW.region_allocated_cases)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ap_log_regional_deployment ON ap_regional_deployments;
CREATE TRIGGER trg_ap_log_regional_deployment
AFTER INSERT ON ap_regional_deployments
FOR EACH ROW EXECUTE FUNCTION ap_log_regional_deployment();

