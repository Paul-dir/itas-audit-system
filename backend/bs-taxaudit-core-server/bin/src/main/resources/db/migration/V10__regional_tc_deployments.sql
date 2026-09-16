-- V10: Regional Tax Center Deployments
-- 
-- PURPOSE:
-- Tracks when regional directors deploy approved plans to their tax centers
-- This is DIFFERENT from V9 which tracks director sending plans to regions
--
-- TABLE:
-- - ap_regional_tc_deployments: Tracks regional director deployment to tax centers

-- =========================================================================
-- 1. Create Regional TC Deployments Table
-- =========================================================================
CREATE TABLE IF NOT EXISTS ap_regional_tc_deployments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id) ON DELETE CASCADE,

    region_id VARCHAR(64) NOT NULL,

    deployed_by VARCHAR(64) NOT NULL,

    deployed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    status VARCHAR(32) DEFAULT 'DEPLOYED',

    -- Ensure only one deployment per region per plan
    CONSTRAINT uk_regional_tc_deployment_per_plan UNIQUE(plan_id, region_id)
);

CREATE INDEX IF NOT EXISTS idx_ap_regional_tc_deployments_plan_id ON ap_regional_tc_deployments(plan_id);
CREATE INDEX IF NOT EXISTS idx_ap_regional_tc_deployments_region_id ON ap_regional_tc_deployments(region_id);
CREATE INDEX IF NOT EXISTS idx_ap_regional_tc_deployments_deployed_by ON ap_regional_tc_deployments(deployed_by);

