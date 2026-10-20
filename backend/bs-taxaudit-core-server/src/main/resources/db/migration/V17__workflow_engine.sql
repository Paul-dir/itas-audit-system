-- =============================================================================
-- V17__workflow_engine.sql
-- Configurable workflow engine tables supporting Section 21 (Configurable Approval)
-- of the master requirements. Defines workflow definitions, runtime instances,
-- tasks, and in-app notifications.
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. WORKFLOW DEFINITIONS (configuration — what approval chains exist)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workflow_definitions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code            VARCHAR(128) NOT NULL,              -- e.g. TP_AUDIT_REPORT_APPROVAL
    name            VARCHAR(256) NOT NULL,
    audit_type      VARCHAR(64)  NOT NULL DEFAULT 'TRANSFER_PRICING',
    artifact_type   VARCHAR(128) NOT NULL,              -- AUDIT_REPORT, INFO_REQUEST, HYPOTHESIS, etc.
    version         INT          NOT NULL DEFAULT 1,
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    description     TEXT,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (code, version)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. WORKFLOW STEPS (ordered steps within a definition)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workflow_steps (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    definition_id    UUID         NOT NULL,
    step_order       INT          NOT NULL,             -- 1, 2, 3...
    step_name        VARCHAR(128) NOT NULL,
    required_role    VARCHAR(64)  NOT NULL,             -- AUDITOR, TEAM_LEADER, PROCESS_OWNER, etc.
    approval_type    VARCHAR(64)  NOT NULL DEFAULT 'REQUIRED',  -- REQUIRED, OPTIONAL, CONDITIONAL
    condition_type   VARCHAR(64),                       -- AMOUNT_THRESHOLD, RISK_LEVEL, ALWAYS
    condition_value  VARCHAR(128),                      -- e.g. "5000000" for amount threshold
    sla_hours        INT          NOT NULL DEFAULT 72,  -- 3 working days default
    escalate_after_hours INT      NOT NULL DEFAULT 96,  -- escalate if not acted on
    escalate_to_role VARCHAR(64),                       -- role to notify on escalation
    is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_ws_definition FOREIGN KEY (definition_id) REFERENCES workflow_definitions(id) ON DELETE CASCADE,
    UNIQUE (definition_id, step_order)
);
CREATE INDEX IF NOT EXISTS idx_ws_definition ON workflow_steps(definition_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. WORKFLOW INSTANCES (runtime — one per artifact approval lifecycle)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workflow_instances (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    definition_id   UUID         NOT NULL,
    case_id         UUID         NOT NULL,
    artifact_id     UUID         NOT NULL,              -- ID of the report, request, etc.
    artifact_type   VARCHAR(128) NOT NULL,
    current_step_id UUID,                              -- FK to workflow_steps
    status          VARCHAR(64)  NOT NULL DEFAULT 'IN_PROGRESS',
    -- IN_PROGRESS, APPROVED, RETURNED, REJECTED, CANCELLED
    initiated_by    VARCHAR(64)  NOT NULL,             -- user ID
    started_at      TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at    TIMESTAMPTZ,
    CONSTRAINT fk_wi_definition FOREIGN KEY (definition_id) REFERENCES workflow_definitions(id),
    CONSTRAINT fk_wi_case       FOREIGN KEY (case_id)       REFERENCES ap_audit_cases(id)
);
CREATE INDEX IF NOT EXISTS idx_wi_case          ON workflow_instances(case_id);
CREATE INDEX IF NOT EXISTS idx_wi_artifact      ON workflow_instances(artifact_id);
CREATE INDEX IF NOT EXISTS idx_wi_status        ON workflow_instances(status);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. WORKFLOW TASKS (one per step per instance — the actual task assigned to a user)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workflow_tasks (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id      UUID         NOT NULL,
    step_id          UUID         NOT NULL,
    case_id          UUID         NOT NULL,
    artifact_id      UUID         NOT NULL,
    artifact_type    VARCHAR(128) NOT NULL,
    task_title       VARCHAR(256) NOT NULL,
    task_description TEXT,
    assigned_to_user_id VARCHAR(64),                   -- specific user assignment
    assigned_to_role VARCHAR(64)  NOT NULL,            -- role-level assignment
    assigned_to_org_unit_id UUID,                      -- org unit scope
    status           VARCHAR(64)  NOT NULL DEFAULT 'PENDING',
    -- PENDING, COMPLETED, RETURNED, REJECTED, CANCELLED, ESCALATED
    priority         VARCHAR(16)  NOT NULL DEFAULT 'NORMAL',  -- LOW, NORMAL, HIGH, URGENT
    due_at           TIMESTAMPTZ,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at     TIMESTAMPTZ,
    completed_by     VARCHAR(64),
    decision         VARCHAR(64),                      -- APPROVED, RETURNED, REJECTED
    comments         TEXT,
    return_reason    TEXT,                             -- mandatory if RETURNED
    version_reviewed INT,                              -- which version of the artifact was reviewed
    escalated_at     TIMESTAMPTZ,
    escalation_reason TEXT,
    CONSTRAINT fk_wt_instance FOREIGN KEY (instance_id) REFERENCES workflow_instances(id),
    CONSTRAINT fk_wt_step     FOREIGN KEY (step_id)     REFERENCES workflow_steps(id),
    CONSTRAINT fk_wt_case     FOREIGN KEY (case_id)     REFERENCES ap_audit_cases(id)
);
CREATE INDEX IF NOT EXISTS idx_wt_instance        ON workflow_tasks(instance_id);
CREATE INDEX IF NOT EXISTS idx_wt_assigned_user   ON workflow_tasks(assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_wt_assigned_role   ON workflow_tasks(assigned_to_role);
CREATE INDEX IF NOT EXISTS idx_wt_status          ON workflow_tasks(status);
CREATE INDEX IF NOT EXISTS idx_wt_case            ON workflow_tasks(case_id);
CREATE INDEX IF NOT EXISTS idx_wt_due             ON workflow_tasks(due_at) WHERE status = 'PENDING';
-- Compound index for task inbox query (user tasks that are pending, sorted by due date)
CREATE INDEX IF NOT EXISTS idx_wt_inbox           ON workflow_tasks(assigned_to_user_id, status, due_at)
    WHERE status = 'PENDING';

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. NOTIFICATIONS (in-app, append-only insert)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_user_id   VARCHAR(64) NOT NULL,           -- user ID of recipient
    notification_type   VARCHAR(64) NOT NULL,           -- TASK_ASSIGNED, APPROVED, RETURNED, REJECTED, etc.
    title               VARCHAR(256) NOT NULL,
    body                TEXT,
    task_id             UUID,                           -- related task (optional)
    case_id             UUID,                           -- related case (optional)
    artifact_type       VARCHAR(128),
    artifact_id         UUID,
    is_read             BOOLEAN NOT NULL DEFAULT FALSE,
    read_at             TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_notif_recipient ON notifications(recipient_user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notif_case      ON notifications(case_id);
CREATE INDEX IF NOT EXISTS idx_notif_unread    ON notifications(recipient_user_id) WHERE is_read = FALSE;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. SLA TRACKING (for scheduled SLA breach monitoring)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sla_tracking (
    task_id             UUID PRIMARY KEY,
    case_id             UUID NOT NULL,
    assigned_role       VARCHAR(64) NOT NULL,
    due_at              TIMESTAMPTZ NOT NULL,
    warning_sent        BOOLEAN NOT NULL DEFAULT FALSE,
    warning_sent_at     TIMESTAMPTZ,
    escalation_sent     BOOLEAN NOT NULL DEFAULT FALSE,
    escalation_sent_at  TIMESTAMPTZ,
    resolved_at         TIMESTAMPTZ,
    CONSTRAINT fk_sla_task FOREIGN KEY (task_id) REFERENCES workflow_tasks(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_sla_due          ON sla_tracking(due_at) WHERE resolved_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_sla_case         ON sla_tracking(case_id);
