-- Flyway Migration V6: AP Planning Workflow Tables
-- Creates tables for plan status tracking, regional feedback, and case generation

-- ============================================================================
-- 1. Timeline Tracking - Records all status transitions for audit trail
-- ============================================================================
CREATE TABLE ap_plan_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id) ON DELETE CASCADE,
    status VARCHAR(64) NOT NULL,
    actor_id VARCHAR(64) NOT NULL,
    comment TEXT,
    event_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_ap_plan_timeline_plan_id ON ap_plan_timeline(plan_id);

-- ============================================================================
-- 2. Revisions Tracking - Records amendments, rejections, and comments
-- ============================================================================
CREATE TABLE ap_plan_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    revision_type VARCHAR(32),  -- 'revision', 'amendment', 'senior_rejection', etc
    created_by VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_ap_plan_revisions_plan_id ON ap_plan_revisions(plan_id);

-- ============================================================================
-- 3. Update ap_annual_audit_plans to add comment fields
-- ============================================================================
ALTER TABLE ap_annual_audit_plans ADD COLUMN director_comment TEXT;
ALTER TABLE ap_annual_audit_plans ADD COLUMN senior_comment TEXT;
ALTER TABLE ap_annual_audit_plans ADD COLUMN amendment_comment TEXT;

-- ============================================================================
-- 4. Regional Feedback Collection - Stores feedback from each region
-- ============================================================================
CREATE TABLE ap_regional_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id) ON DELETE CASCADE,
    region_id VARCHAR(64) NOT NULL,
    feedback_text TEXT,
    submitted_by VARCHAR(64),
    submitted_at TIMESTAMPTZ,
    is_overridden BOOLEAN DEFAULT FALSE,
    override_comment TEXT,
    override_by VARCHAR(64),
    override_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_regional_feedback UNIQUE(plan_id, region_id)
);
CREATE INDEX idx_ap_regional_feedback_plan_id ON ap_regional_feedback(plan_id);
CREATE INDEX idx_ap_regional_feedback_region ON ap_regional_feedback(region_id);

-- ============================================================================
-- 5. Regional Deployments - Tracks when regions deploy to tax centers
-- ============================================================================
CREATE TABLE ap_regional_deployments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id) ON DELETE CASCADE,
    region_id VARCHAR(64) NOT NULL,
    deployed_by VARCHAR(64) NOT NULL,
    deployed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(32) DEFAULT 'DEPLOYED',
    CONSTRAINT unique_regional_deployment UNIQUE(plan_id, region_id)
);
CREATE INDEX idx_ap_regional_deployments_plan_id ON ap_regional_deployments(plan_id);

-- ============================================================================
-- 6. Audit Cases - Cases generated from finalized plans
-- ============================================================================
CREATE TABLE ap_audit_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id) ON DELETE CASCADE,
    allocation_id UUID REFERENCES ap_plan_allocations(id),
    case_number VARCHAR(32) UNIQUE NOT NULL,
    taxpayer_id VARCHAR(64) NOT NULL,
    audit_type VARCHAR(32),
    risk_score INTEGER,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING_ASSIGNMENT',
    assigned_team_leader_id VARCHAR(64),
    assigned_auditor_id VARCHAR(64),
    created_by VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);
CREATE INDEX idx_ap_audit_cases_plan_id ON ap_audit_cases(plan_id);
CREATE INDEX idx_ap_audit_cases_status ON ap_audit_cases(status);
CREATE INDEX idx_ap_audit_cases_auditor ON ap_audit_cases(assigned_auditor_id);
CREATE INDEX idx_ap_audit_cases_team_leader ON ap_audit_cases(assigned_team_leader_id);
CREATE INDEX idx_ap_audit_cases_case_number ON ap_audit_cases(case_number);
