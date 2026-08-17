-- V1__ap_annual_plan.sql

CREATE TABLE ap_annual_audit_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_year INT NOT NULL,
    plan_name VARCHAR(128) NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by VARCHAR(64) NOT NULL
);

CREATE TABLE ap_plan_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id) ON DELETE CASCADE,
    tax_center_code VARCHAR(32) NOT NULL,
    proposed_count INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ap_plan_allocations_plan_id ON ap_plan_allocations(plan_id);
