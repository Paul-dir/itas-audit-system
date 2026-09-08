-- V8__store_distribution_data.sql
-- Add distribution JSON storage and regional feedback table

-- Add distribution JSON column to store audit type breakdown
ALTER TABLE ap_annual_audit_plans
    ADD COLUMN IF NOT EXISTS distribution_json JSONB;

ALTER TABLE ap_annual_audit_plans
    ADD COLUMN IF NOT EXISTS sent_to_regions_at TIMESTAMPTZ;

-- Create table for regional director feedback
CREATE TABLE IF NOT EXISTS ap_plan_regional_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id) ON DELETE CASCADE,
    region_id VARCHAR(64) NOT NULL,
    proposed_count INTEGER NOT NULL DEFAULT 0,
    adjusted_count INTEGER DEFAULT NULL,
    justification TEXT DEFAULT NULL,
    submitted_by VARCHAR(100) DEFAULT NULL,
    submitted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_regional_feedback_plan FOREIGN KEY (plan_id) REFERENCES ap_annual_audit_plans(id),
    CONSTRAINT uk_plan_region UNIQUE (plan_id, region_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_regional_feedback_plan ON ap_plan_regional_feedback(plan_id);
CREATE INDEX IF NOT EXISTS idx_regional_feedback_region ON ap_plan_regional_feedback(region_id);
