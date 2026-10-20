-- V18__dev_seed_data.sql
-- Development seed data: roles, permissions, test users (linked to Keycloak sub),
-- org units, teams, and workflow definitions.
-- DO NOT use in production. Update keycloak_user_id values to match your Keycloak realm sub claims.

-- ── Org Units ─────────────────────────────────────────────────────────────────
INSERT INTO organizational_units (id, code, name, unit_type) VALUES
  ('00000000-0000-0000-0000-000000000001', 'MOR-NAT', 'Ministry of Revenue - National Directorate', 'NATIONAL'),
  ('00000000-0000-0000-0000-000000000002', 'MOR-LTO', 'Large Taxpayers Office - Addis Ababa', 'TAX_CENTER')
ON CONFLICT (code) DO NOTHING;

-- ── Roles ─────────────────────────────────────────────────────────────────────
INSERT INTO roles (id, code, name, is_system) VALUES
  ('10000000-0000-0000-0000-000000000001', 'SYSTEM_ADMIN',          'System Administrator',          TRUE),
  ('10000000-0000-0000-0000-000000000002', 'AUDITOR',               'TP Auditor',                    TRUE),
  ('10000000-0000-0000-0000-000000000003', 'TEAM_LEADER',           'TP Audit Team Leader',          TRUE),
  ('10000000-0000-0000-0000-000000000004', 'PROCESS_OWNER',         'Audit Process Owner',           TRUE),
  ('10000000-0000-0000-0000-000000000005', 'REVIEW_COMMITTEE',      'Review Committee Member',       TRUE),
  ('10000000-0000-0000-0000-000000000006', 'AUTHORIZED_OFFICIAL',   'Authorized Official',           TRUE),
  ('10000000-0000-0000-0000-000000000007', 'TAXPAYER',              'Taxpayer (External Portal)',    TRUE)
ON CONFLICT (code) DO NOTHING;

-- ── Permissions ───────────────────────────────────────────────────────────────
INSERT INTO permissions (id, code, description, module) VALUES
  -- Case
  ('20000000-0000-0000-0000-000000000001', 'CASE_VIEW',                 'View assigned/permitted cases',   'TP'),
  ('20000000-0000-0000-0000-000000000002', 'CASE_VIEW_ALL',             'View all cases in org scope',     'TP'),
  ('20000000-0000-0000-0000-000000000003', 'CASE_CREATE',               'Create new audit case',           'TP'),
  ('20000000-0000-0000-0000-000000000004', 'CASE_ASSIGN',               'Assign case to team/auditor',     'TP'),
  ('20000000-0000-0000-0000-000000000005', 'CASE_CLOSE',                'Close an audit case',             'TP'),
  -- Risk Assessment
  ('20000000-0000-0000-0000-000000000010', 'RISK_ASSESSMENT_VIEW',      'View risk assessment',            'TP'),
  ('20000000-0000-0000-0000-000000000011', 'RISK_ASSESSMENT_EDIT',      'Edit risk assessment',            'TP'),
  -- Hypothesis
  ('20000000-0000-0000-0000-000000000020', 'HYPOTHESIS_VIEW',           'View working hypothesis',         'TP'),
  ('20000000-0000-0000-0000-000000000021', 'HYPOTHESIS_CREATE',         'Create working hypothesis',       'TP'),
  ('20000000-0000-0000-0000-000000000022', 'HYPOTHESIS_APPROVE',        'Approve working hypothesis',      'TP'),
  -- Audit Plan
  ('20000000-0000-0000-0000-000000000030', 'AUDIT_PLAN_CREATE',         'Create/edit audit plan',          'TP'),
  ('20000000-0000-0000-0000-000000000031', 'AUDIT_PLAN_APPROVE',        'Approve audit plan',              'TP'),
  -- Information Request
  ('20000000-0000-0000-0000-000000000040', 'INFO_REQUEST_CREATE',       'Create information request',      'TP'),
  ('20000000-0000-0000-0000-000000000041', 'INFO_REQUEST_APPROVE',      'Approve information request',     'TP'),
  -- Fact Statement
  ('20000000-0000-0000-0000-000000000050', 'FACT_STATEMENT_CREATE',     'Create fact statement',           'TP'),
  ('20000000-0000-0000-0000-000000000051', 'FACT_STATEMENT_RESPOND',    'Respond to fact statement',       'TP'),
  -- Report
  ('20000000-0000-0000-0000-000000000060', 'REPORT_CREATE',             'Create/draft audit report',       'TP'),
  ('20000000-0000-0000-0000-000000000061', 'REPORT_APPROVE',            'Approve audit report',            'TP'),
  -- Notice
  ('20000000-0000-0000-0000-000000000070', 'NOTICE_APPROVE',            'Approve assessment notice',       'TP'),
  ('20000000-0000-0000-0000-000000000071', 'NOTICE_VIEW',               'View assessment notice',          'TP'),
  -- Objection
  ('20000000-0000-0000-0000-000000000080', 'OBJECTION_REVIEW',          'Review taxpayer objection',       'TP'),
  -- Fraud
  ('20000000-0000-0000-0000-000000000090', 'FRAUD_ESCALATE',            'Escalate fraud referral',         'TP'),
  -- Documents
  ('20000000-0000-0000-0000-000000000100', 'DOCUMENT_VIEW',             'View documents',                  'TP'),
  ('20000000-0000-0000-0000-000000000101', 'DOCUMENT_UPLOAD',           'Upload documents',                'TP'),
  -- Admin
  ('20000000-0000-0000-0000-000000000200', 'ROLE_MANAGE',               'Manage roles and permissions',    'ADMIN'),
  ('20000000-0000-0000-0000-000000000201', 'USER_MANAGE',               'Manage users',                    'ADMIN'),
  ('20000000-0000-0000-0000-000000000202', 'WORKFLOW_CONFIGURE',        'Configure workflow definitions',   'ADMIN'),
  -- Taxpayer portal
  ('20000000-0000-0000-0000-000000000300', 'TAXPAYER_PORTAL_ACCESS',    'Access taxpayer portal',          'PORTAL')
ON CONFLICT (code) DO NOTHING;

-- ── Role-Permission assignments ───────────────────────────────────────────────
-- AUDITOR
INSERT INTO role_permissions (role_id, permission_id) SELECT '10000000-0000-0000-0000-000000000002', id FROM permissions
  WHERE code IN ('CASE_VIEW','RISK_ASSESSMENT_VIEW','RISK_ASSESSMENT_EDIT','AUDIT_PLAN_CREATE',
                 'INFO_REQUEST_CREATE','FACT_STATEMENT_CREATE','REPORT_CREATE','DOCUMENT_VIEW','DOCUMENT_UPLOAD')
ON CONFLICT DO NOTHING;
-- TEAM_LEADER
INSERT INTO role_permissions (role_id, permission_id) SELECT '10000000-0000-0000-0000-000000000003', id FROM permissions
  WHERE code IN ('CASE_VIEW','CASE_VIEW_ALL','RISK_ASSESSMENT_VIEW','AUDIT_PLAN_APPROVE',
                 'INFO_REQUEST_APPROVE','FACT_STATEMENT_CREATE','REPORT_APPROVE','FRAUD_ESCALATE','DOCUMENT_VIEW','DOCUMENT_UPLOAD')
ON CONFLICT DO NOTHING;
-- PROCESS_OWNER
INSERT INTO role_permissions (role_id, permission_id) SELECT '10000000-0000-0000-0000-000000000004', id FROM permissions
  WHERE code IN ('CASE_VIEW','CASE_VIEW_ALL','CASE_CREATE','CASE_ASSIGN','CASE_CLOSE',
                 'RISK_ASSESSMENT_VIEW','HYPOTHESIS_VIEW','HYPOTHESIS_CREATE',
                 'AUDIT_PLAN_APPROVE','INFO_REQUEST_APPROVE','REPORT_APPROVE',
                 'OBJECTION_REVIEW','FRAUD_ESCALATE','DOCUMENT_VIEW')
ON CONFLICT DO NOTHING;
-- REVIEW_COMMITTEE
INSERT INTO role_permissions (role_id, permission_id) SELECT '10000000-0000-0000-0000-000000000005', id FROM permissions
  WHERE code IN ('CASE_VIEW','RISK_ASSESSMENT_VIEW','HYPOTHESIS_VIEW','HYPOTHESIS_APPROVE','DOCUMENT_VIEW')
ON CONFLICT DO NOTHING;
-- AUTHORIZED_OFFICIAL
INSERT INTO role_permissions (role_id, permission_id) SELECT '10000000-0000-0000-0000-000000000006', id FROM permissions
  WHERE code IN ('CASE_VIEW','CASE_VIEW_ALL','REPORT_APPROVE','NOTICE_APPROVE','NOTICE_VIEW',
                 'OBJECTION_REVIEW','DOCUMENT_VIEW')
ON CONFLICT DO NOTHING;
-- TAXPAYER
INSERT INTO role_permissions (role_id, permission_id) SELECT '10000000-0000-0000-0000-000000000007', id FROM permissions
  WHERE code IN ('TAXPAYER_PORTAL_ACCESS','NOTICE_VIEW','FACT_STATEMENT_RESPOND','DOCUMENT_UPLOAD','DOCUMENT_VIEW')
ON CONFLICT DO NOTHING;
-- SYSTEM_ADMIN
INSERT INTO role_permissions (role_id, permission_id) SELECT '10000000-0000-0000-0000-000000000001', id FROM permissions
ON CONFLICT DO NOTHING;

-- Test Users (keycloak_user_id = Keycloak JWT sub claim for each user in the dev realm)
INSERT INTO users (id, username, email, full_name, keycloak_user_id, org_unit_id) VALUES
  ('30000000-0000-0000-0000-000000000001', 'admin',         'admin@mor.gov.et',         'System Admin',       'kc-sub-admin-001',   '00000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000002', 'tadesse.mamo',  'tadesse.mamo@mor.gov.et',  'Tadesse Mamo',       'kc-sub-auditor-001', '00000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000003', 'workneh.kassa', 'workneh.kassa@mor.gov.et', 'Workneh Kassa',      'kc-sub-tl-001',      '00000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000004', 'abebe.bikila',  'abebe.bikila@mor.gov.et',  'Abebe Bikila',       'kc-sub-po-001',      '00000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000005', 'almaz.tekle',   'almaz.tekle@mor.gov.et',   'Dr. Almaz Tekle',    'kc-sub-comm-001',    '00000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000006', 'tigist.haile',  'tigist.haile@mor.gov.et',  'Tigist Haile',       'kc-sub-ao-001',      '00000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000007', 'taxpayer1',     'cfo@cresttextiles.et',     'Crest Textiles CFO', 'kc-sub-tp-001',      NULL)
ON CONFLICT (username) DO NOTHING;

-- ── User-Role assignments ──────────────────────────────────────────────────
INSERT INTO user_roles (user_id, role_id) VALUES
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'), -- admin → SYSTEM_ADMIN
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002'), -- tadesse → AUDITOR
  ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003'), -- workneh → TEAM_LEADER
  ('30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004'), -- abebe → PROCESS_OWNER
  ('30000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005'), -- almaz → REVIEW_COMMITTEE
  ('30000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000006'), -- tigist → AUTHORIZED_OFFICIAL
  ('30000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000007')  -- taxpayer1 → TAXPAYER
ON CONFLICT DO NOTHING;

-- ── Team ──────────────────────────────────────────────────────────────────────
INSERT INTO teams (id, code, name, team_type, org_unit_id, team_leader_id) VALUES
  ('40000000-0000-0000-0000-000000000001', 'LTO-TP-TEAM-01', 'LTO Transfer Pricing Audit Team 1', 'TP_AUDIT',
   '00000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000003')
ON CONFLICT (code) DO NOTHING;

INSERT INTO team_members (team_id, user_id, role_in_team) VALUES
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', 'AUDITOR'),
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', 'TEAM_LEADER')
ON CONFLICT DO NOTHING;

-- ── Workflow Definitions ──────────────────────────────────────────────────────
-- TP Audit Report approval chain
INSERT INTO workflow_definitions (id, code, name, audit_type, artifact_type) VALUES
  ('50000000-0000-0000-0000-000000000001', 'TP_AUDIT_REPORT_APPROVAL', 'TP Audit Report Approval', 'TRANSFER_PRICING', 'AUDIT_REPORT'),
  ('50000000-0000-0000-0000-000000000002', 'TP_INFO_REQUEST_APPROVAL', 'TP Information Request Approval', 'TRANSFER_PRICING', 'INFO_REQUEST'),
  ('50000000-0000-0000-0000-000000000003', 'TP_HYPOTHESIS_REVIEW', 'TP Working Hypothesis Review', 'TRANSFER_PRICING', 'WORKING_HYPOTHESIS'),
  ('50000000-0000-0000-0000-000000000004', 'TP_AUDIT_PLAN_APPROVAL', 'TP Audit Plan Approval', 'TRANSFER_PRICING', 'AUDIT_PLAN')
ON CONFLICT (code, version) DO NOTHING;

-- Report approval steps: Auditor → TL → PO → AO (conditional on amount)
INSERT INTO workflow_steps (id, definition_id, step_order, step_name, required_role, approval_type, condition_type, sla_hours) VALUES
  ('51000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 1, 'Team Leader Review',        'TEAM_LEADER',         'REQUIRED',    NULL,              72),
  ('51000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000001', 2, 'Process Owner Review',      'PROCESS_OWNER',       'REQUIRED',    NULL,              72),
  ('51000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000001', 3, 'Authorized Official Final', 'AUTHORIZED_OFFICIAL', 'CONDITIONAL', 'AMOUNT_THRESHOLD', 48)
ON CONFLICT (definition_id, step_order) DO NOTHING;

-- Info request steps: Auditor → TL (→ PO for sensitive)
INSERT INTO workflow_steps (id, definition_id, step_order, step_name, required_role, approval_type, sla_hours) VALUES
  ('51000000-0000-0000-0000-000000000010', '50000000-0000-0000-0000-000000000002', 1, 'Team Leader Approval',  'TEAM_LEADER',   'REQUIRED', 24),
  ('51000000-0000-0000-0000-000000000011', '50000000-0000-0000-0000-000000000002', 2, 'Process Owner Approval','PROCESS_OWNER', 'CONDITIONAL', 48)
ON CONFLICT (definition_id, step_order) DO NOTHING;

-- Hypothesis review steps: PO → Committee
INSERT INTO workflow_steps (id, definition_id, step_order, step_name, required_role, approval_type, sla_hours) VALUES
  ('51000000-0000-0000-0000-000000000020', '50000000-0000-0000-0000-000000000003', 1, 'Review Committee Decision', 'REVIEW_COMMITTEE', 'REQUIRED', 120)
ON CONFLICT (definition_id, step_order) DO NOTHING;

-- Audit plan steps: Auditor → TL → PO
INSERT INTO workflow_steps (id, definition_id, step_order, step_name, required_role, approval_type, sla_hours) VALUES
  ('51000000-0000-0000-0000-000000000030', '50000000-0000-0000-0000-000000000004', 1, 'Team Leader Review',   'TEAM_LEADER',   'REQUIRED', 48),
  ('51000000-0000-0000-0000-000000000031', '50000000-0000-0000-0000-000000000004', 2, 'Process Owner Review', 'PROCESS_OWNER', 'REQUIRED', 48)
ON CONFLICT (definition_id, step_order) DO NOTHING;
