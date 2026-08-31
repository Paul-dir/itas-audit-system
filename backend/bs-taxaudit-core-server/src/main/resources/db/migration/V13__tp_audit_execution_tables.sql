-- V13__tp_audit_execution_tables.sql
-- Create TP-specific child tables for the Audit Execution phase

-- 1. TP Risk Assessment
CREATE TABLE tp_risk_assessment (
    id UUID PRIMARY KEY,
    audit_case_id UUID NOT NULL,
    version INT NOT NULL DEFAULT 1,
    risk_level VARCHAR(50), -- LOW, MEDIUM, HIGH, CRITICAL
    assessment_status VARCHAR(50) NOT NULL, -- DRAFT, IN_PROGRESS, COMPLETED, UNDER_REVIEW, APPROVED
    risk_details JSONB, -- Stores categories, questions, responses, indicators, evidence links
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    CONSTRAINT fk_tp_risk_assessment_case FOREIGN KEY (audit_case_id) REFERENCES ap_audit_cases(id) ON DELETE CASCADE
);

CREATE INDEX idx_tp_risk_assessment_case ON tp_risk_assessment(audit_case_id);

-- 2. TP Working Hypothesis
CREATE TABLE tp_working_hypothesis (
    id UUID PRIMARY KEY,
    audit_case_id UUID NOT NULL,
    hypothesis_description TEXT,
    identified_issue TEXT,
    economic_rationale TEXT,
    revenue_at_risk DECIMAL(19, 2),
    currency VARCHAR(10) DEFAULT 'ETB',
    status VARCHAR(50) NOT NULL, -- DRAFT, SUBMITTED, APPROVED, UNDER_REVIEW
    calculation_details JSONB, -- Stores methodology, inputs, assumptions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    CONSTRAINT fk_tp_working_hypothesis_case FOREIGN KEY (audit_case_id) REFERENCES ap_audit_cases(id) ON DELETE CASCADE
);

CREATE INDEX idx_tp_working_hypothesis_case ON tp_working_hypothesis(audit_case_id);

-- 3. TP Audit Plan
CREATE TABLE tp_audit_plan (
    id UUID PRIMARY KEY,
    audit_case_id UUID NOT NULL,
    objective TEXT,
    scope TEXT,
    materiality_details JSONB, -- Objective, scope, threshold, context
    industry_research JSONB, -- Sector, business model, benchmarks
    sampling_method JSONB, -- Method, population, criteria, size
    planned_procedures JSONB, -- Specific audit procedures to perform
    status VARCHAR(50) NOT NULL, -- DRAFT, SUBMITTED_FOR_REVIEW, APPROVED, IN_EXECUTION, COMPLETED
    approved_by VARCHAR(255),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    CONSTRAINT fk_tp_audit_plan_case FOREIGN KEY (audit_case_id) REFERENCES ap_audit_cases(id) ON DELETE CASCADE
);

CREATE INDEX idx_tp_audit_plan_case ON tp_audit_plan(audit_case_id);
