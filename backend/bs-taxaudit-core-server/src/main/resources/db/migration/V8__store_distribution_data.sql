-- V8__store_distribution_data.sql
-- Add distribution JSON storage and regional feedback table

-- Add distribution JSON column to store audit type breakdown
ALTER TABLE ap_annual_audit_plans 
ADD COLUMN distribution_json jsonb DEFAULT NULL COMMENT 'Distribution breakdown by region and audit type: {region_id: {audit_type_id: count}}',
ADD COLUMN sent_to_regions_at TIMESTAMP DEFAULT NULL COMMENT 'When plan was routed to regions';

-- Create table for regional director feedback
CREATE TABLE ap_plan_regional_feedback (
    id VARCHAR(36) PRIMARY KEY,
    plan_id VARCHAR(36) NOT NULL,
    region_code VARCHAR(2) NOT NULL,
    proposed_count INTEGER NOT NULL DEFAULT 0,
    adjusted_count INTEGER DEFAULT NULL,
    justification TEXT DEFAULT NULL,
    submitted_by VARCHAR(100) DEFAULT NULL,
    submitted_at TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_regional_feedback_plan FOREIGN KEY (plan_id) REFERENCES ap_annual_audit_plans(id),
    UNIQUE KEY uk_plan_region (plan_id, region_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT 'Regional director feedback on plan allocations';

-- Create index for faster queries
CREATE INDEX idx_regional_feedback_plan ON ap_plan_regional_feedback(plan_id);
CREATE INDEX idx_regional_feedback_region ON ap_plan_regional_feedback(region_code);
