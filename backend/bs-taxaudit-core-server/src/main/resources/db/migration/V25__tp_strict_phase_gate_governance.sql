-- V25__tp_strict_phase_gate_governance.sql
-- Strict Phase Gate and Sub-Step tracking for Transfer Pricing Audit Execution

CREATE TABLE IF NOT EXISTS tp_phase_gates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_case_id UUID NOT NULL,
    phase_id VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    sub_steps_completed JSONB DEFAULT '[]'::jsonb,
    sub_step_data JSONB DEFAULT '{}'::jsonb,
    submitted_at TIMESTAMP WITH TIME ZONE,
    submitted_by VARCHAR(100),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by VARCHAR(100),
    reviewer_role VARCHAR(50),
    review_decision VARCHAR(50),
    review_comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tp_phase_gates_case FOREIGN KEY (audit_case_id) REFERENCES ap_audit_cases(id) ON DELETE CASCADE,
    CONSTRAINT uk_tp_phase_gates_case_phase UNIQUE (audit_case_id, phase_id)
);

CREATE INDEX IF NOT EXISTS idx_tp_phase_gates_case ON tp_phase_gates(audit_case_id);
CREATE INDEX IF NOT EXISTS idx_tp_phase_gates_status ON tp_phase_gates(status);
