-- V13: Create t_user table and seed all users
-- Replaces in-memory MockUserRepository with persistent DB storage.
-- Team leader IDs referenced by t_audit_team and ap_audit_cases now point to real records.

CREATE TABLE IF NOT EXISTS t_user (
    user_id          UUID PRIMARY KEY,
    username         VARCHAR(100) UNIQUE NOT NULL,
    email            VARCHAR(150) UNIQUE NOT NULL,
    full_name        VARCHAR(255) NOT NULL,
    user_type        VARCHAR(50) NOT NULL,    -- TEAM_LEADER, AUDITOR, COMMITTEE_MEMBER, COMMITTEE_CHAIR, etc.
    audit_type       VARCHAR(50),             -- desk_audit, field_audit, joint_audit, etc. (for specialists)
    assigned_level   VARCHAR(50) NOT NULL DEFAULT 'TAX_CENTER', -- NATIONAL, REGIONAL, TAX_CENTER
    assigned_location VARCHAR(100),           -- region code or tax center code
    status           VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_t_user_type ON t_user(user_type);
CREATE INDEX IF NOT EXISTS idx_t_user_email ON t_user(email);
CREATE INDEX IF NOT EXISTS idx_t_user_location ON t_user(assigned_location);
CREATE INDEX IF NOT EXISTS idx_t_user_audit_type ON t_user(audit_type);

COMMENT ON TABLE t_user IS 'All system users — team leaders, auditors, committee members. Replaces in-memory MockUserRepository.';
COMMENT ON COLUMN t_user.user_type IS 'Role: TEAM_LEADER, AUDITOR, COMMITTEE_MEMBER, COMMITTEE_CHAIR, etc.';
COMMENT ON COLUMN t_user.audit_type IS 'Specialization: desk_audit, field_audit, joint_audit, comprehensive, transfer_pricing, issue_audit';
COMMENT ON COLUMN t_user.assigned_location IS 'Tax center code (e.g. addis_ababa-tc1) or region code';

-- ============================================================
-- SEED: Team Leaders (4)
-- ============================================================
INSERT INTO t_user (user_id, username, email, full_name, user_type, audit_type, assigned_level, assigned_location) VALUES
('10000000-0000-0000-0000-000000000001', 'henok.belay',      'henok.belay@mor.gov.et',      'Henok Belay',     'TEAM_LEADER', 'desk_audit',       'TAX_CENTER', 'addis_ababa-tc1'),
('10000000-0000-0000-0000-000000000002', 'tigist.alemu',     'tigist.alemu@mor.gov.et',     'Tigist Alemu',    'TEAM_LEADER', 'field_audit',      'TAX_CENTER', 'addis_ababa-tc3'),
('10000000-0000-0000-0000-000000000007', 'fikadu.desta',     'fikadu.desta@mor.gov.et',     'Fikadu Desta',    'TEAM_LEADER', 'desk_audit',       'TAX_CENTER', 'addis_ababa-tc2'),
('10000000-0000-0000-0000-000000000017', 'lalisa.wakjira',   'lalisa.wakjira@mor.gov.et',   'Lalisa Wakjira',  'TEAM_LEADER', 'desk_audit',       'TAX_CENTER', 'oromia-tc1')
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================
-- SEED: Auditors (8 — matching t_auditor UUIDs)
-- ============================================================
INSERT INTO t_user (user_id, username, email, full_name, user_type, audit_type, assigned_level, assigned_location) VALUES
('a0000001-0000-0000-0000-000000000001', 'abebe.kebede',      'abebe.kebede@mor.gov.et',      'Abebe Kebede',      'AUDITOR', NULL, 'TAX_CENTER', 'addis_ababa-tc1'),
('a0000001-0000-0000-0000-000000000002', 'fatuma.ahmed',       'fatuma.ahmed@mor.gov.et',       'Fatuma Ahmed',      'AUDITOR', NULL, 'TAX_CENTER', 'addis_ababa-tc1'),
('a0000001-0000-0000-0000-000000000003', 'dawit.tadesse',      'dawit.tadesse@mor.gov.et',      'Dawit Tadesse',     'AUDITOR', NULL, 'TAX_CENTER', 'addis_ababa-tc2'),
('a0000001-0000-0000-0000-000000000004', 'sara.mohammed',      'sara.mohammed@mor.gov.et',      'Sara Mohammed',     'AUDITOR', NULL, 'TAX_CENTER', 'addis_ababa-tc2'),
('a0000001-0000-0000-0000-000000000005', 'yonas.berhanu',      'yonas.berhanu@mor.gov.et',      'Yonas Berhanu',     'AUDITOR', NULL, 'TAX_CENTER', 'addis_ababa-tc3'),
('a0000001-0000-0000-0000-000000000006', 'hana.girma',         'hana.girma@mor.gov.et',         'Hana Girma',        'AUDITOR', NULL, 'TAX_CENTER', 'addis_ababa-tc3'),
('a0000001-0000-0000-0000-000000000007', 'mulugeta.alemayehu', 'mulugeta.alemayehu@mor.gov.et', 'Mulugeta Alemayehu','AUDITOR', NULL, 'TAX_CENTER', 'oromia-tc1'),
('a0000001-0000-0000-0000-000000000008', 'tigist.haile',       'tigist.haile@mor.gov.et',       'Tigist Haile',      'AUDITOR', NULL, 'TAX_CENTER', 'oromia-tc1')
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================
-- SEED: Committee Members (1 chair + 1 member per tax center)
-- ============================================================
INSERT INTO t_user (user_id, username, email, full_name, user_type, audit_type, assigned_level, assigned_location) VALUES
-- AA-TC1
('20000000-0000-0000-0000-000000000001', 'aa.committee1',             'aa.committee1@mor.gov.et',             'Committee Chair AA-TC1',      'COMMITTEE_CHAIR',  'joint_audit', 'TAX_CENTER', 'addis_ababa-tc1'),
('20000000-0000-0000-0000-000000000002', 'aa-ara.joint_committee.2',  'aa-ara.joint_committee.2@mor.gov.et',  'Committee Member AA-TC1',     'COMMITTEE_MEMBER', 'joint_audit', 'TAX_CENTER', 'addis_ababa-tc1'),
-- AA-TC2
('20000000-0000-0000-0000-000000000006', 'aa.committee2',             'aa.committee2@mor.gov.et',             'Committee Chair AA-TC2',      'COMMITTEE_CHAIR',  'joint_audit', 'TAX_CENTER', 'addis_ababa-tc2'),
('20000000-0000-0000-0000-000000000007', 'aa-ara.joint_committee.7',  'aa-ara.joint_committee.7@mor.gov.et',  'Committee Member AA-TC2',     'COMMITTEE_MEMBER', 'joint_audit', 'TAX_CENTER', 'addis_ababa-tc2'),
-- AA-TC3
('20000000-0000-0000-0000-000000000008', 'aa.committee3',             'aa.committee3@mor.gov.et',             'Committee Chair AA-TC3',      'COMMITTEE_CHAIR',  'joint_audit', 'TAX_CENTER', 'addis_ababa-tc3'),
('20000000-0000-0000-0000-000000000009', 'aa-ara.joint_committee.9',  'aa-ara.joint_committee.9@mor.gov.et',  'Committee Member AA-TC3',     'COMMITTEE_MEMBER', 'joint_audit', 'TAX_CENTER', 'addis_ababa-tc3'),
-- OR-TC1
('20000000-0000-0000-0000-000000000010', 'or.committee1',             'or.committee1@mor.gov.et',             'Committee Chair OR-TC1',      'COMMITTEE_CHAIR',  'joint_audit', 'TAX_CENTER', 'oromia-tc1'),
('20000000-0000-0000-0000-000000000011', 'or-ara.joint_committee.11', 'or-ara.joint_committee.11@mor.gov.et', 'Committee Member OR-TC1',     'COMMITTEE_MEMBER', 'joint_audit', 'TAX_CENTER', 'oromia-tc1')
ON CONFLICT (user_id) DO NOTHING;

-- Update timestamps
UPDATE t_user SET updated_at = NOW();
