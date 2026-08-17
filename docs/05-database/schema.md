```markdown
# Database Schema

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This document provides the complete PostgreSQL schema for the ITAS Tax Audit & Investigation Management System. All tables follow the 2-letter prefix rule for cluster ownership.

**File:** `src/main/resources/db/migration/V1__initial_schema.sql`

---

## 1. Shared Infrastructure Tables (shared_*)

### 1.1 `shared_audit_trail_entries`
```sql
CREATE TABLE shared_audit_trail_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(64) NOT NULL,
    entity_id UUID NOT NULL,
    actor_id VARCHAR(64) NOT NULL,
    action VARCHAR(64) NOT NULL,
    reason TEXT,
    state_before JSONB,
    state_after JSONB,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_trail_entity ON shared_audit_trail_entries (entity_type, entity_id);
CREATE INDEX idx_audit_trail_actor ON shared_audit_trail_entries (actor_id);
CREATE INDEX idx_audit_trail_occurred_at ON shared_audit_trail_entries (occurred_at);
```

---

### 1.2 `shared_outbox_entries`
```sql
CREATE TABLE shared_outbox_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_type VARCHAR(64) NOT NULL,
    aggregate_id UUID NOT NULL,
    event_type VARCHAR(128) NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    processed_at TIMESTAMPTZ NULL
);

CREATE INDEX idx_outbox_entries_processed ON shared_outbox_entries (processed_at) WHERE processed_at IS NULL;
```

---

### 1.3 `shared_documents`
```sql
CREATE TABLE shared_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(256) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    mime_type VARCHAR(64) NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id UUID NOT NULL,
    uploaded_by VARCHAR(64) NOT NULL,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_documents_entity ON shared_documents (entity_type, entity_id);
```

---

### 1.4 `shared_notifications`
```sql
CREATE TABLE shared_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient VARCHAR(256) NOT NULL,
    channel VARCHAR(32) NOT NULL,
    subject VARCHAR(256),
    content TEXT NOT NULL,
    status VARCHAR(32) NOT NULL,
    sent_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_status ON shared_notifications (status);
```

---

## 2. AP Cluster Tables (ap_*)

### 2.1 `ap_annual_audit_plans`
```sql
CREATE TABLE ap_annual_audit_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INT NOT NULL,
    name VARCHAR(256) NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_by VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_annual_plans_status ON ap_annual_audit_plans (status);
CREATE INDEX idx_annual_plans_year ON ap_annual_audit_plans (year);
```

---

### 2.2 `ap_plan_allocations`
```sql
CREATE TABLE ap_plan_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    annual_plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id) ON DELETE CASCADE,
    level VARCHAR(32) NOT NULL,
    region_code VARCHAR(64),
    tax_center_code VARCHAR(64),
    parent_allocation_id UUID REFERENCES ap_plan_allocations(id),
    audit_type VARCHAR(32) NOT NULL,
    proposed_count INT NOT NULL,
    local_adjusted_count INT,
    local_justification TEXT,
    local_adjusted_by VARCHAR(64),
    local_adjusted_at TIMESTAMPTZ,
    regional_override_count INT,
    regional_override_reason TEXT,
    regional_overridden_by VARCHAR(64),
    regional_overridden_at TIMESTAMPTZ,
    national_override_count INT,
    national_override_reason TEXT,
    national_overridden_by VARCHAR(64),
    national_overridden_at TIMESTAMPTZ,
    final_count INT GENERATED ALWAYS AS (
        COALESCE(national_override_count, regional_override_count, local_adjusted_count, proposed_count)
    ) STORED,
    deployment_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    deployment_confirmed_by VARCHAR(64),
    deployment_confirmed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_plan_allocations_plan ON ap_plan_allocations (annual_plan_id);
CREATE INDEX idx_plan_allocations_tax_center ON ap_plan_allocations (annual_plan_id, tax_center_code) WHERE level = 'TAX_CENTER' AND deployment_confirmed = TRUE;
CREATE INDEX idx_plan_allocations_audit_type ON ap_plan_allocations (audit_type);
```

---

### 2.3 `ap_plan_versions`
```sql
CREATE TABLE ap_plan_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    annual_plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    status VARCHAR(32) NOT NULL,
    allocations_snapshot JSONB NOT NULL,
    created_by VARCHAR(64) NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_plan_versions_plan ON ap_plan_versions (annual_plan_id);
```

---

### 2.4 `ap_audit_cases`
```sql
CREATE TABLE ap_audit_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_reference_number VARCHAR(64) NOT NULL UNIQUE,
    tin VARCHAR(32) NOT NULL,
    tax_center_code VARCHAR(64),
    region_code VARCHAR(64),
    audit_type VARCHAR(32) NOT NULL,
    source VARCHAR(32) NOT NULL,
    routing VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL,
    assigned_auditor_id VARCHAR(64),
    assigned_team_leader_id VARCHAR(64),
    committee_id UUID,
    annual_plan_id UUID NOT NULL REFERENCES ap_annual_audit_plans(id),
    escalated_from_case_id UUID REFERENCES ap_audit_cases(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_audit_cases_status ON ap_audit_cases (status);
CREATE INDEX idx_audit_cases_tax_center ON ap_audit_cases (tax_center_code);
CREATE INDEX idx_audit_cases_tin ON ap_audit_cases (tin);
CREATE INDEX idx_audit_cases_audit_type ON ap_audit_cases (audit_type);
CREATE INDEX idx_audit_cases_routing ON ap_audit_cases (routing) WHERE routing = 'LOCAL' AND status = 'SELECTED_FOR_AUDIT';
CREATE UNIQUE INDEX idx_audit_cases_unique_active_case ON ap_audit_cases (tin) WHERE status NOT IN ('CLOSED', 'COMPLETED');
```

---

### 2.5 `ap_audit_referrals`
```sql
CREATE TABLE ap_audit_referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_type VARCHAR(32) NOT NULL,
    referring_entity VARCHAR(256) NOT NULL,
    tin VARCHAR(32) NOT NULL,
    reference_details TEXT,
    status VARCHAR(32) NOT NULL,
    resolved_case_id UUID REFERENCES ap_audit_cases(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_referrals_tin ON ap_audit_referrals (tin);
CREATE INDEX idx_audit_referrals_status ON ap_audit_referrals (status);
```

---

### 2.6 `ap_auditor_profiles`
```sql
CREATE TABLE ap_auditor_profiles (
    id VARCHAR(64) PRIMARY KEY,
    full_name VARCHAR(256) NOT NULL,
    tax_center_code VARCHAR(64) NOT NULL,
    role VARCHAR(32) NOT NULL,
    skills JSONB NOT NULL,
    seniority_level INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_auditor_profiles_tax_center ON ap_auditor_profiles (tax_center_code);
```

---

### 2.7 `ap_auditor_workload`
```sql
CREATE TABLE ap_auditor_workload (
    auditor_id VARCHAR(64) PRIMARY KEY REFERENCES ap_auditor_profiles(id),
    active_case_count INT NOT NULL DEFAULT 0,
    max_capacity INT NOT NULL DEFAULT 10,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 2.8 `ap_audit_work_logs`
```sql
CREATE TABLE ap_audit_work_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_case_id UUID NOT NULL REFERENCES ap_audit_cases(id),
    auditor_id VARCHAR(64) NOT NULL,
    work_date DATE NOT NULL,
    hours_logged DECIMAL(5,2) NOT NULL,
    activity_description TEXT,
    percent_case_complete INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_work_logs_case ON ap_audit_work_logs (audit_case_id);
CREATE INDEX idx_work_logs_auditor ON ap_audit_work_logs (auditor_id);
```

```markdown

## 3. EX Cluster Tables (ex_*)

### 3.1 `ex_audit_plans`
```sql
CREATE TABLE ex_audit_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_case_id UUID NOT NULL REFERENCES ap_audit_cases(id),
    materiality_threshold DECIMAL(18,2),
    sampling_config JSONB,
    scope_description TEXT,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ex_audit_plans_case ON ex_audit_plans (audit_case_id);
```

---

### 3.2 `ex_desk_audit_details`
```sql
CREATE TABLE ex_desk_audit_details (
    audit_case_id UUID PRIMARY KEY REFERENCES ap_audit_cases(id),
    outcome VARCHAR(32),
    draft_report_id UUID,
    escalation_recommendation TEXT,
    comprehensive_audit_required BOOLEAN,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 3.2 `ex_desk_audit_evidence`
```sql
CREATE TABLE ex_desk_audit_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_case_id UUID NOT NULL REFERENCES ap_audit_cases(id),
    source_type VARCHAR(32) NOT NULL,
    source_reference VARCHAR(256) NOT NULL,
    gathered_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_desk_evidence_case ON ex_desk_audit_evidence (audit_case_id);
```

---

### 3.3 `ex_comprehensive_audit_details`
```sql
CREATE TABLE ex_comprehensive_audit_details (
    audit_case_id UUID PRIMARY KEY REFERENCES ap_audit_cases(id),
    caat_eligible BOOLEAN,
    caat_run_reference VARCHAR(256),
    execution_report_id UUID,
    draft_report_id UUID,
    multi_zone_consolidation BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 3.4 `ex_caat_runs`
```sql
CREATE TABLE ex_caat_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_case_id UUID NOT NULL REFERENCES ap_audit_cases(id),
    run_reference VARCHAR(256) NOT NULL,
    results JSONB,
    run_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_caat_runs_case ON ex_caat_runs (audit_case_id);
```

---

### 3.5 `ex_benchmark_comparisons`
```sql
CREATE TABLE ex_benchmark_comparisons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_case_id UUID NOT NULL REFERENCES ap_audit_cases(id),
    metric_name VARCHAR(128) NOT NULL,
    taxpayer_value DECIMAL(18,2),
    benchmark_value DECIMAL(18,2),
    variance DECIMAL(18,2),
    data_source VARCHAR(256),
    compared_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_benchmark_case ON ex_benchmark_comparisons (audit_case_id);
```

---

### 3.6 `ex_third_party_matches`
```sql
CREATE TABLE ex_third_party_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_case_id UUID NOT NULL REFERENCES ap_audit_cases(id),
    source_system VARCHAR(64) NOT NULL,
    match_reference VARCHAR(256) NOT NULL,
    match_details JSONB,
    matched_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_third_party_case ON ex_third_party_matches (audit_case_id);
```

---

### 3.7 `ex_query_sheets`
```sql
CREATE TABLE ex_query_sheets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_case_id UUID NOT NULL REFERENCES ap_audit_cases(id),
    sent_at TIMESTAMPTZ NOT NULL,
    response_due_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(32) NOT NULL,
    requested_documents TEXT,
    taxpayer_response TEXT,
    responded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_query_sheets_status ON ex_query_sheets (status, response_due_at);
```

---

### 3.8 `ex_sample_selections`
```sql
CREATE TABLE ex_sample_selections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_case_id UUID NOT NULL REFERENCES ap_audit_cases(id),
    scope VARCHAR(32) NOT NULL,
    population_description TEXT,
    sample_criteria TEXT,
    selected_records JSONB,
    selected_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sample_selections_case ON ex_sample_selections (audit_case_id);
```

---

### 3.9 `ex_zone_reports`
```sql
CREATE TABLE ex_zone_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_case_id UUID NOT NULL REFERENCES ap_audit_cases(id),
    zone_code VARCHAR(32) NOT NULL,
    report_reference VARCHAR(256) NOT NULL,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_zone_reports_case ON ex_zone_reports (audit_case_id);
```

```markdown

## 4. TP Cluster Tables (tp_*)

### 4.1 `tp_risk_assessments`
```sql
CREATE TABLE tp_risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_case_id UUID NOT NULL REFERENCES ap_audit_cases(id),
    overall_risk_level VARCHAR(32),
    risk_categories JSONB,
    status VARCHAR(32) NOT NULL,
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tp_risk_case ON tp_risk_assessments (audit_case_id);
```

---

### 4.2 `tp_working_hypotheses`
```sql
CREATE TABLE tp_working_hypotheses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_case_id UUID NOT NULL REFERENCES ap_audit_cases(id),
    hypothesis_description TEXT,
    identified_issue TEXT,
    revenue_at_risk DECIMAL(18,2),
    currency VARCHAR(8),
    calculation_methodology TEXT,
    supporting_evidence JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tp_hypothesis_case ON tp_working_hypotheses (audit_case_id);
```

---

### 4.3 `tp_audit_plans`
```sql
CREATE TABLE tp_audit_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_case_id UUID NOT NULL REFERENCES ap_audit_cases(id),
    materiality_id UUID,
    sampling_config_id UUID,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 4.4 `tp_field_work_data`
```sql
CREATE TABLE tp_field_work_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_case_id UUID NOT NULL REFERENCES ap_audit_cases(id),
    accounting_assessment JSONB,
    transaction_audit_trails JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 4.5 `tp_fact_statements`
```sql
CREATE TABLE tp_fact_statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_case_id UUID NOT NULL REFERENCES ap_audit_cases(id),
    version INT NOT NULL DEFAULT 1,
    taxpayer_business_profile TEXT,
    organizational_structure TEXT,
    related_party_relationships TEXT,
    controlled_transactions TEXT,
    status VARCHAR(32) NOT NULL,
    taxpayer_comments TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 4.6 `tp_analysis_results`
```sql
CREATE TABLE tp_analysis_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_case_id UUID NOT NULL REFERENCES ap_audit_cases(id),
    selected_method VARCHAR(64),
    method_rationale TEXT,
    arms_length_price DECIMAL(18,2),
    arms_length_range_low DECIMAL(18,2),
    arms_length_range_high DECIMAL(18,2),
    taxpayer_price DECIMAL(18,2),
    variance DECIMAL(18,2),
    analysis_parameters JSONB,
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 4.7 `tp_arm_length_analyses`
```sql
CREATE TABLE tp_arm_length_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_result_id UUID NOT NULL REFERENCES tp_analysis_results(id),
    method VARCHAR(64),
    arms_length_price DECIMAL(18,2),
    arms_length_range_low DECIMAL(18,2),
    arms_length_range_high DECIMAL(18,2),
    taxpayer_price DECIMAL(18,2),
    variance DECIMAL(18,2),
    variance_percentage DECIMAL(5,2),
    comparable_data_sources JSONB,
    supporting_evidence JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 4.8 `tp_audit_reports`
```sql
CREATE TABLE tp_audit_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_case_id UUID NOT NULL REFERENCES ap_audit_cases(id),
    version INT NOT NULL DEFAULT 1,
    status VARCHAR(32) NOT NULL,
    findings TEXT,
    conclusions TEXT,
    approvals JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 5. JA Cluster Tables (ja_*)

### 5.1 `ja_joint_audits`
```sql
CREATE TABLE ja_joint_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_case_id UUID NOT NULL REFERENCES ap_audit_cases(id),
    status VARCHAR(32) NOT NULL,
    committee_id UUID,
    team_leader_id VARCHAR(64),
    shared_workspace_id VARCHAR(256),
    consolidated_report_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 5.2 `ja_committees`
```sql
CREATE TABLE ja_committees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(256) NOT NULL,
    members JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 5.3 `ja_teams`
```sql
CREATE TABLE ja_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    joint_audit_id UUID NOT NULL REFERENCES ja_joint_audits(id),
    authority_id VARCHAR(64) NOT NULL,
    role VARCHAR(32) NOT NULL,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 5.4 `ja_plans`
```sql
CREATE TABLE ja_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    joint_audit_id UUID NOT NULL REFERENCES ja_joint_audits(id),
    materiality TEXT,
    scope TEXT,
    sampling_configuration JSONB,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 5.5 `ja_workspaces`
```sql
CREATE TABLE ja_workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id VARCHAR(256) NOT NULL UNIQUE,
    authority_data_access JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 5.6 `ja_execution_reports`
```sql
CREATE TABLE ja_execution_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    joint_audit_id UUID NOT NULL REFERENCES ja_joint_audits(id),
    findings TEXT,
    conclusions TEXT,
    approvals JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 6. CM Cluster Tables (cm_*)

### 6.1 `cm_audit_notices`
```sql
CREATE TABLE cm_audit_notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_case_id UUID NOT NULL REFERENCES ap_audit_cases(id),
    notice_reference VARCHAR(64) NOT NULL UNIQUE,
    document_id UUID,
    status VARCHAR(32) NOT NULL,
    delivery_channel VARCHAR(32),
    issued_at TIMESTAMPTZ NOT NULL,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_notices_case ON cm_audit_notices (audit_case_id);
```

---

### 6.2 `cm_alternative_delivery`
```sql
CREATE TABLE cm_alternative_delivery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notice_id UUID NOT NULL REFERENCES cm_audit_notices(id),
    channel VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL,
    reason TEXT,
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    delivered_at TIMESTAMPTZ
);

CREATE INDEX idx_alternative_delivery_notice ON cm_alternative_delivery (notice_id);
```

---

### 6.3 `cm_entry_conferences`
```sql
CREATE TABLE cm_entry_conferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_case_id UUID NOT NULL REFERENCES ap_audit_cases(id),
    scheduled_at TIMESTAMPTZ,
    held_at TIMESTAMPTZ,
    venue VARCHAR(256),
    status VARCHAR(32) NOT NULL,
    notes JSONB,
    approved_by VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_entry_conferences_case ON cm_entry_conferences (audit_case_id);
```

```markdown

## 7. RF Cluster Tables (rf_*)

### 7.1 `rf_audit_reports`
```sql
CREATE TABLE rf_audit_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_case_id UUID NOT NULL REFERENCES ap_audit_cases(id),
    status VARCHAR(32) NOT NULL,
    findings TEXT,
    conclusions TEXT,
    final_approver_id VARCHAR(64),
    issued_date DATE,
    assessment_notice_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### 7.2 `rf_approvals`
```sql
CREATE TABLE rf_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES rf_audit_reports(id),
    level VARCHAR(32) NOT NULL,
    approver_id VARCHAR(64) NOT NULL,
    decision VARCHAR(32) NOT NULL,
    comments TEXT,
    approved_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_approvals_report ON rf_approvals (report_id);
```

---

### 7.3 `rf_exit_conferences`
```sql
CREATE TABLE rf_exit_conferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_case_id UUID NOT NULL REFERENCES ap_audit_cases(id),
    scheduled_at TIMESTAMPTZ,
    held_at TIMESTAMPTZ,
    notes TEXT,
    attendees JSONB,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_exit_conferences_case ON rf_exit_conferences (audit_case_id);
```

---

### 7.4 `rf_assessment_notices`
```sql
CREATE TABLE rf_assessment_notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_case_id UUID NOT NULL REFERENCES ap_audit_cases(id),
    notice_reference VARCHAR(64) NOT NULL UNIQUE,
    principal_amount DECIMAL(18,2) NOT NULL,
    penalty_amount DECIMAL(18,2),
    interest_amount DECIMAL(18,2),
    total_amount DECIMAL(18,2) GENERATED ALWAYS AS (
        COALESCE(principal_amount, 0) + COALESCE(penalty_amount, 0) + COALESCE(interest_amount, 0)
    ) STORED,
    status VARCHAR(32) NOT NULL,
    issued_at TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_assessment_notices_case ON rf_assessment_notices (audit_case_id);
```

---

### 7.5 `rf_taxpayer_responses`
```sql
CREATE TABLE rf_taxpayer_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_notice_id UUID NOT NULL REFERENCES rf_assessment_notices(id),
    response_type VARCHAR(32) NOT NULL,
    response_text TEXT,
    supporting_evidence JSONB,
    responded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_taxpayer_responses_notice ON rf_taxpayer_responses (assessment_notice_id);
```

---

## 8. QA Cluster Tables (qa_*)

### 8.1 `qa_reviews`
```sql
CREATE TABLE qa_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_audit_case_id UUID NOT NULL REFERENCES ap_audit_cases(id),
    sampling_method VARCHAR(64) NOT NULL,
    sampling_seed VARCHAR(256),
    status VARCHAR(32) NOT NULL,
    assigned_qa_member_id VARCHAR(64),
    recommendations_addressed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_qa_reviews_status ON qa_reviews (status);
```

---

### 8.2 `qa_recommendations`
```sql
CREATE TABLE qa_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qa_review_id UUID NOT NULL REFERENCES qa_reviews(id),
    description TEXT NOT NULL,
    action_type VARCHAR(32) NOT NULL,
    addressed BOOLEAN DEFAULT FALSE,
    addressed_at TIMESTAMPTZ,
    addressed_by VARCHAR(64),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_qa_recommendations_review ON qa_recommendations (qa_review_id);
```

---

### 8.3 `qa_sampling_seeds`
```sql
CREATE TABLE qa_sampling_seeds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sampling_batch_id VARCHAR(64) NOT NULL UNIQUE,
    algorithm VARCHAR(64) NOT NULL,
    seed_value VARCHAR(512) NOT NULL,
    selected_cases JSONB,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 9. IA Cluster Tables (ia_*)

### 9.1 `ia_issue_audits`
```sql
CREATE TABLE ia_issue_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_case_id UUID NOT NULL REFERENCES ap_audit_cases(id),
    status VARCHAR(32) NOT NULL,
    audit_mode VARCHAR(32) NOT NULL,
    notice_document_id UUID,
    notice_issued_date DATE,
    auditee_response_deadline DATE,
    team_leader_revision_count INT DEFAULT 0,
    process_owner_revision_count INT DEFAULT 0,
    director_outcome VARCHAR(32),
    final_report_document_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_issue_audits_case ON ia_issue_audits (audit_case_id);
```

---

### 9.2 `ia_issue_audit_scopes`
```sql
CREATE TABLE ia_issue_audit_scopes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_audit_id UUID NOT NULL REFERENCES ia_issue_audits(id),
    scope_item_id VARCHAR(64) NOT NULL,
    noncompliance_area VARCHAR(64) NOT NULL,
    tax_type VARCHAR(32),
    period_from DATE,
    period_to DATE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_issue_scope_audit ON ia_issue_audit_scopes (issue_audit_id);
CREATE UNIQUE INDEX idx_issue_scope_item ON ia_issue_audit_scopes (issue_audit_id, scope_item_id);
```

---

### 9.3 `ia_issue_audit_reports`
```sql
CREATE TABLE ia_issue_audit_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_audit_id UUID NOT NULL REFERENCES ia_issue_audits(id),
    version INT NOT NULL DEFAULT 1,
    draft_content TEXT,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_issue_reports_audit ON ia_issue_audit_reports (issue_audit_id);
```

---

### 9.4 `ia_field_visit_findings`
```sql
CREATE TABLE ia_field_visit_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_audit_id UUID NOT NULL REFERENCES ia_issue_audits(id),
    visit_date DATE NOT NULL,
    location VARCHAR(256),
    observations TEXT,
    findings TEXT,
    evidence_references JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_field_visit_audit ON ia_field_visit_findings (issue_audit_id);
```

---

## 10. Schema Summary

| Cluster | Tables | Owner |
| :--- | :--- | :--- |
| **Shared** | 4 | Shared (Pawlos leads) |
| **AP** | 8 | Pawlos |
| **EX** | 9 | Oliad |
| **TP** | 8 | Borifa |
| **JA** | 6 | Yoseph |
| **CM** | 3 | Yoseph |
| **RF** | 5 | Yoseph |
| **QA** | 3 | Oliad |
| **IA** | 4 | Borifa |
| **TOTAL** | **50** | |
