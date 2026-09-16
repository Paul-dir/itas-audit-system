-- =============================================================================
-- V21__org_hierarchy_and_ownership.sql
-- Master Organizational Hierarchy, User Ownership Constraints, and Case Assignments.
-- Implements 1 User = 1 Tax Center rule, Multi-Committee support, and Case Assignment History.
-- =============================================================================

-- 1. REGIONS
CREATE TABLE IF NOT EXISTS regions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        VARCHAR(64)  NOT NULL UNIQUE, -- e.g. REG-Z, REG-Y, REG-FED
    name        VARCHAR(256) NOT NULL,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_regions_code ON regions(code);

-- 2. TAX CENTERS
CREATE TABLE IF NOT EXISTS tax_centers (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        VARCHAR(64)  NOT NULL UNIQUE, -- e.g. Z-TC-1, Z-TC-2, Y-TC-1, federal-lto1
    region_id   UUID         NOT NULL,
    name        VARCHAR(256) NOT NULL,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tc_region FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_tax_centers_code ON tax_centers(code);
CREATE INDEX IF NOT EXISTS idx_tax_centers_region ON tax_centers(region_id);

-- 3. AUDIT TYPES
CREATE TABLE IF NOT EXISTS audit_types (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code                    VARCHAR(64)  NOT NULL UNIQUE, -- DESK_AUDIT, COMPREHENSIVE_AUDIT, JOINT_AUDIT, TRANSFER_PRICING
    name                    VARCHAR(128) NOT NULL,
    requires_committee      BOOLEAN      NOT NULL DEFAULT FALSE,
    initial_assignment_role VARCHAR(64)  NOT NULL DEFAULT 'TEAM_LEADER', -- TEAM_LEADER vs COMMITTEE
    is_active               BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_audit_types_code ON audit_types(code);

-- 4. COMMITTEES
CREATE TABLE IF NOT EXISTS committees (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code          VARCHAR(128) NOT NULL UNIQUE, -- e.g. Z-TC-1-TP-COM-001
    name          VARCHAR(256) NOT NULL,
    tax_center_id UUID         NOT NULL,
    audit_type_id UUID         NOT NULL,
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_com_tc FOREIGN KEY (tax_center_id) REFERENCES tax_centers(id) ON DELETE CASCADE,
    CONSTRAINT fk_com_at FOREIGN KEY (audit_type_id) REFERENCES audit_types(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_committees_tc ON committees(tax_center_id);
CREATE INDEX IF NOT EXISTS idx_committees_at ON committees(audit_type_id);

-- 5. USER ORGANIZATIONAL ASSIGNMENTS (Enforces 1 User = 1 Tax Center)
CREATE TABLE IF NOT EXISTS user_organizational_assignments (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID        NOT NULL,
    region_id      UUID        NOT NULL,
    tax_center_id  UUID        NOT NULL,
    audit_type_id  UUID,
    committee_id   UUID,
    team_id        UUID,
    team_leader_id UUID,
    role_code      VARCHAR(64) NOT NULL,
    status         VARCHAR(32) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, TRANSFERRED
    effective_from TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    effective_to   TIMESTAMPTZ,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_uoa_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_uoa_region FOREIGN KEY (region_id) REFERENCES regions(id),
    CONSTRAINT fk_uoa_tc FOREIGN KEY (tax_center_id) REFERENCES tax_centers(id),
    CONSTRAINT fk_uoa_at FOREIGN KEY (audit_type_id) REFERENCES audit_types(id),
    CONSTRAINT fk_uoa_com FOREIGN KEY (committee_id) REFERENCES committees(id)
);
CREATE INDEX IF NOT EXISTS idx_uoa_user ON user_organizational_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_uoa_tc   ON user_organizational_assignments(tax_center_id);

-- CRITICAL BUSINESS RULE: ONE USER = ONE ACTIVE TAX CENTER ASSIGNMENT
CREATE UNIQUE INDEX IF NOT EXISTS idx_uniq_active_user_tc 
ON user_organizational_assignments(user_id) 
WHERE status = 'ACTIVE';

-- 6. CASE ASSIGNMENTS HISTORY
CREATE TABLE IF NOT EXISTS case_assignments (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id           UUID         NOT NULL,
    region_id         UUID,
    tax_center_id     UUID,
    audit_type_id     UUID,
    committee_id      UUID,
    team_id           UUID,
    team_leader_id    UUID,
    assigned_user_id  UUID,
    assigned_by       VARCHAR(128) NOT NULL,
    assignment_type   VARCHAR(64)  NOT NULL, -- COMMITTEE_ASSIGNMENT, TL_ASSIGNMENT, AUDITOR_ASSIGNMENT
    assignment_reason TEXT,
    effective_from    TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    effective_to      TIMESTAMPTZ,
    status            VARCHAR(32)  NOT NULL DEFAULT 'ACTIVE',
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ca_case FOREIGN KEY (case_id) REFERENCES ap_audit_cases(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_ca_case ON case_assignments(case_id);
CREATE INDEX IF NOT EXISTS idx_ca_assigned_user ON case_assignments(assigned_user_id);
