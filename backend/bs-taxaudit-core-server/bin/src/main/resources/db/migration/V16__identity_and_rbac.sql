-- =============================================================================
-- V16__identity_and_rbac.sql
-- Identity, RBAC, and Organizational Hierarchy for the ITAS Audit System.
-- Implements real user management, role-based access control, and org hierarchy
-- required by Section 29 (RBAC), 30 (Data Isolation), and 44 (Security) of
-- the master requirements document.
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. ORGANIZATIONAL HIERARCHY
-- Supports: National Directorate → Regional Office → Branch → Department → Team
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS organizational_units (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        VARCHAR(64)  NOT NULL UNIQUE,
    name        VARCHAR(256) NOT NULL,
    unit_type   VARCHAR(64)  NOT NULL,   -- NATIONAL, REGIONAL, BRANCH, DEPARTMENT, TAX_CENTER
    parent_id   UUID,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_org_parent FOREIGN KEY (parent_id) REFERENCES organizational_units(id)
);
CREATE INDEX IF NOT EXISTS idx_org_units_parent   ON organizational_units(parent_id);
CREATE INDEX IF NOT EXISTS idx_org_units_type     ON organizational_units(unit_type);
CREATE INDEX IF NOT EXISTS idx_org_units_code     ON organizational_units(code);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. ROLES
-- Canonical roles for the system. Each role maps to a dashboard and permission set.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roles (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        VARCHAR(64)  NOT NULL UNIQUE,  -- AUDITOR, TEAM_LEADER, PROCESS_OWNER, etc.
    name        VARCHAR(128) NOT NULL,
    description TEXT,
    is_system   BOOLEAN      NOT NULL DEFAULT FALSE,  -- system roles cannot be deleted
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. PERMISSIONS
-- Fine-grained permissions. Every protected action maps to one permission code.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS permissions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        VARCHAR(128) NOT NULL UNIQUE,  -- e.g. CASE_VIEW, REPORT_APPROVE
    description TEXT,
    module      VARCHAR(64),                   -- TP, AP, ADMIN, etc.
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. ROLE_PERMISSIONS mapping
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id       UUID NOT NULL,
    permission_id UUID NOT NULL,
    granted_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    granted_by    VARCHAR(64),
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rp_role       FOREIGN KEY (role_id)       REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. USERS
-- Core user table. Passwords stored as bcrypt hashes.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username        VARCHAR(64)  NOT NULL UNIQUE,
    email           VARCHAR(256) NOT NULL UNIQUE,
    full_name       VARCHAR(256) NOT NULL,
    keycloak_user_id VARCHAR(256) UNIQUE,     -- Keycloak JWT 'sub' claim (links IdP to local user)
    employee_id     VARCHAR(64),             -- HR system reference
    org_unit_id     UUID,                    -- primary organizational unit
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    last_login_at   TIMESTAMPTZ,
    failed_login_count INT NOT NULL DEFAULT 0,
    locked_until    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_org_unit FOREIGN KEY (org_unit_id) REFERENCES organizational_units(id)
);
CREATE INDEX IF NOT EXISTS idx_users_username  ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email     ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_org_unit  ON users(org_unit_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. USER_ROLES mapping (a user may have multiple roles)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_roles (
    user_id    UUID NOT NULL,
    role_id    UUID NOT NULL,
    assigned_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    assigned_by  VARCHAR(64),
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. TEAMS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS teams (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code            VARCHAR(64)  NOT NULL UNIQUE,
    name            VARCHAR(256) NOT NULL,
    team_type       VARCHAR(64)  NOT NULL DEFAULT 'TP_AUDIT',  -- TP_AUDIT, DESK, COMPREHENSIVE
    org_unit_id     UUID         NOT NULL,
    team_leader_id  UUID,                -- FK to users
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_team_org_unit    FOREIGN KEY (org_unit_id)    REFERENCES organizational_units(id),
    CONSTRAINT fk_team_team_leader FOREIGN KEY (team_leader_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_teams_org_unit  ON teams(org_unit_id);
CREATE INDEX IF NOT EXISTS idx_teams_leader    ON teams(team_leader_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. TEAM_MEMBERS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_members (
    team_id       UUID NOT NULL,
    user_id       UUID NOT NULL,
    role_in_team  VARCHAR(64) NOT NULL DEFAULT 'AUDITOR',  -- AUDITOR, ECONOMIST, LEGAL
    joined_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    left_at       TIMESTAMPTZ,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (team_id, user_id),
    CONSTRAINT fk_tm_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    CONSTRAINT fk_tm_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. USER SESSIONS
-- Tracks active refresh tokens for JWT invalidation support.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL,
    refresh_token_hash VARCHAR(256) NOT NULL UNIQUE,
    ip_address      VARCHAR(64),
    user_agent      TEXT,
    issued_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at      TIMESTAMPTZ NOT NULL,
    revoked_at      TIMESTAMPTZ,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_sessions_user    ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token   ON user_sessions(refresh_token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_active  ON user_sessions(is_active, expires_at);

-- ─────────────────────────────────────────────────────────────────────────────
-- 10. SECURITY AUDIT LOG (append-only, no foreign keys to allow user deletion)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS security_audit_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         VARCHAR(64),          -- stored as string; user may be deleted
    username        VARCHAR(64),
    action          VARCHAR(128) NOT NULL, -- LOGIN, LOGOUT, ACCESS_DENIED, PASSWORD_CHANGE, etc.
    resource_type   VARCHAR(128),
    resource_id     VARCHAR(128),
    ip_address      VARCHAR(64),
    user_agent      TEXT,
    outcome         VARCHAR(32)  NOT NULL, -- SUCCESS, FAILURE, BLOCKED
    detail          JSONB,
    logged_at       TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
    -- This table is INSERT-ONLY. No updates, no deletes from the application.
);
CREATE INDEX IF NOT EXISTS idx_sec_log_user   ON security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_sec_log_action ON security_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_sec_log_time   ON security_audit_log(logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_sec_log_outcome ON security_audit_log(outcome) WHERE outcome = 'FAILURE';
