-- =============================================================================
-- V23__seed_all_system_users_and_org_structure.sql
-- Complete Enterprise User Directory and Master Organizational Hierarchy
-- Harmonizes all 684 Canonical Users across Database, Backend, and Frontend
-- =============================================================================

-- 1. Canonical Roles
INSERT INTO roles (code, name, is_system) VALUES ('SYSTEM_ADMIN', 'System Administrator', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO roles (code, name, is_system) VALUES ('AUDITOR', 'Auditor', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO roles (code, name, is_system) VALUES ('TEAM_LEADER', 'Team Leader', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO roles (code, name, is_system) VALUES ('PROCESS_OWNER', 'Audit Process Owner', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO roles (code, name, is_system) VALUES ('REVIEW_COMMITTEE', 'Review Committee Member', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO roles (code, name, is_system) VALUES ('AUTHORIZED_OFFICIAL', 'Authorized Official', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO roles (code, name, is_system) VALUES ('TAXPAYER', 'Taxpayer (External Portal)', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO roles (code, name, is_system) VALUES ('PLANNING_TEAM', 'Audit Planning Team', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO roles (code, name, is_system) VALUES ('DIRECTOR', 'Audit Director', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO roles (code, name, is_system) VALUES ('SENIOR_MANAGEMENT', 'Senior Management', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO roles (code, name, is_system) VALUES ('REGIONAL_DIRECTOR', 'Regional Director', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO roles (code, name, is_system) VALUES ('TAX_CENTER_MANAGER', 'Tax Center Manager', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO roles (code, name, is_system) VALUES ('COMMITTEE_MEMBER', 'Committee Member', TRUE) ON CONFLICT (code) DO NOTHING;
INSERT INTO roles (code, name, is_system) VALUES ('AUDIT_REQUESTER', 'Audit Requester', TRUE) ON CONFLICT (code) DO NOTHING;

-- 2. Canonical Regions (7 Regions)
INSERT INTO regions (code, name) VALUES ('REG-FED', 'Federal Level Directorate') ON CONFLICT (code) DO NOTHING;
INSERT INTO regions (code, name) VALUES ('REG-AA', 'Addis Ababa Regional Directorate') ON CONFLICT (code) DO NOTHING;
INSERT INTO regions (code, name) VALUES ('REG-BA', 'Amhara Regional Directorate') ON CONFLICT (code) DO NOTHING;
INSERT INTO regions (code, name) VALUES ('REG-BB', 'Oromia Regional Directorate') ON CONFLICT (code) DO NOTHING;
INSERT INTO regions (code, name) VALUES ('REG-AB', 'Dire Dawa Regional Directorate') ON CONFLICT (code) DO NOTHING;
INSERT INTO regions (code, name) VALUES ('REG-CA', 'SNNPR Regional Directorate') ON CONFLICT (code) DO NOTHING;
INSERT INTO regions (code, name) VALUES ('REG-SO', 'Somali Regional Directorate') ON CONFLICT (code) DO NOTHING;

-- 3. Canonical Tax Centers (20 Tax Centers)
INSERT INTO tax_centers (code, region_id, name) VALUES ('federal-lto1', (SELECT id FROM regions WHERE code = 'REG-FED'), 'Federal Large Taxpayers Office 1') ON CONFLICT (code) DO NOTHING;
INSERT INTO tax_centers (code, region_id, name) VALUES ('federal-lto2', (SELECT id FROM regions WHERE code = 'REG-FED'), 'Federal Large Taxpayers Office 2') ON CONFLICT (code) DO NOTHING;
INSERT INTO tax_centers (code, region_id, name) VALUES ('addis_ababa-tc1', (SELECT id FROM regions WHERE code = 'REG-AA'), 'Addis Ababa Tax Center 1') ON CONFLICT (code) DO NOTHING;
INSERT INTO tax_centers (code, region_id, name) VALUES ('addis_ababa-tc2', (SELECT id FROM regions WHERE code = 'REG-AA'), 'Addis Ababa Tax Center 2') ON CONFLICT (code) DO NOTHING;
INSERT INTO tax_centers (code, region_id, name) VALUES ('addis_ababa-tc3', (SELECT id FROM regions WHERE code = 'REG-AA'), 'Addis Ababa Tax Center 3') ON CONFLICT (code) DO NOTHING;
INSERT INTO tax_centers (code, region_id, name) VALUES ('amhara-tc1', (SELECT id FROM regions WHERE code = 'REG-BA'), 'Amhara Tax Center 1') ON CONFLICT (code) DO NOTHING;
INSERT INTO tax_centers (code, region_id, name) VALUES ('amhara-tc2', (SELECT id FROM regions WHERE code = 'REG-BA'), 'Amhara Tax Center 2') ON CONFLICT (code) DO NOTHING;
INSERT INTO tax_centers (code, region_id, name) VALUES ('amhara-tc3', (SELECT id FROM regions WHERE code = 'REG-BA'), 'Amhara Tax Center 3') ON CONFLICT (code) DO NOTHING;
INSERT INTO tax_centers (code, region_id, name) VALUES ('oromia-tc1', (SELECT id FROM regions WHERE code = 'REG-BB'), 'Oromia Tax Center 1') ON CONFLICT (code) DO NOTHING;
INSERT INTO tax_centers (code, region_id, name) VALUES ('oromia-tc2', (SELECT id FROM regions WHERE code = 'REG-BB'), 'Oromia Tax Center 2') ON CONFLICT (code) DO NOTHING;
INSERT INTO tax_centers (code, region_id, name) VALUES ('oromia-tc3', (SELECT id FROM regions WHERE code = 'REG-BB'), 'Oromia Tax Center 3') ON CONFLICT (code) DO NOTHING;
INSERT INTO tax_centers (code, region_id, name) VALUES ('dire_dawa-tc1', (SELECT id FROM regions WHERE code = 'REG-AB'), 'Dire Dawa Tax Center 1') ON CONFLICT (code) DO NOTHING;
INSERT INTO tax_centers (code, region_id, name) VALUES ('dire_dawa-tc2', (SELECT id FROM regions WHERE code = 'REG-AB'), 'Dire Dawa Tax Center 2') ON CONFLICT (code) DO NOTHING;
INSERT INTO tax_centers (code, region_id, name) VALUES ('dire_dawa-tc3', (SELECT id FROM regions WHERE code = 'REG-AB'), 'Dire Dawa Tax Center 3') ON CONFLICT (code) DO NOTHING;
INSERT INTO tax_centers (code, region_id, name) VALUES ('snnpr-tc1', (SELECT id FROM regions WHERE code = 'REG-CA'), 'SNNPR Tax Center 1') ON CONFLICT (code) DO NOTHING;
INSERT INTO tax_centers (code, region_id, name) VALUES ('snnpr-tc2', (SELECT id FROM regions WHERE code = 'REG-CA'), 'SNNPR Tax Center 2') ON CONFLICT (code) DO NOTHING;
INSERT INTO tax_centers (code, region_id, name) VALUES ('snnpr-tc3', (SELECT id FROM regions WHERE code = 'REG-CA'), 'SNNPR Tax Center 3') ON CONFLICT (code) DO NOTHING;
INSERT INTO tax_centers (code, region_id, name) VALUES ('somali-tc1', (SELECT id FROM regions WHERE code = 'REG-SO'), 'Somali Tax Center 1') ON CONFLICT (code) DO NOTHING;
INSERT INTO tax_centers (code, region_id, name) VALUES ('somali-tc2', (SELECT id FROM regions WHERE code = 'REG-SO'), 'Somali Tax Center 2') ON CONFLICT (code) DO NOTHING;
INSERT INTO tax_centers (code, region_id, name) VALUES ('somali-tc3', (SELECT id FROM regions WHERE code = 'REG-SO'), 'Somali Tax Center 3') ON CONFLICT (code) DO NOTHING;

-- 4. Canonical Audit Types (5 Types)
INSERT INTO audit_types (code, name, requires_committee, initial_assignment_role) VALUES ('DESK_AUDIT', 'Desk Audit', FALSE, 'TEAM_LEADER') ON CONFLICT (code) DO UPDATE SET requires_committee = EXCLUDED.requires_committee, initial_assignment_role = EXCLUDED.initial_assignment_role;
INSERT INTO audit_types (code, name, requires_committee, initial_assignment_role) VALUES ('COMPREHENSIVE_AUDIT', 'Comprehensive Audit', FALSE, 'TEAM_LEADER') ON CONFLICT (code) DO UPDATE SET requires_committee = EXCLUDED.requires_committee, initial_assignment_role = EXCLUDED.initial_assignment_role;
INSERT INTO audit_types (code, name, requires_committee, initial_assignment_role) VALUES ('ISSUE_AUDIT', 'Issue Audit', FALSE, 'TEAM_LEADER') ON CONFLICT (code) DO UPDATE SET requires_committee = EXCLUDED.requires_committee, initial_assignment_role = EXCLUDED.initial_assignment_role;
INSERT INTO audit_types (code, name, requires_committee, initial_assignment_role) VALUES ('JOINT_AUDIT', 'Joint Audit', TRUE, 'COMMITTEE') ON CONFLICT (code) DO UPDATE SET requires_committee = EXCLUDED.requires_committee, initial_assignment_role = EXCLUDED.initial_assignment_role;
INSERT INTO audit_types (code, name, requires_committee, initial_assignment_role) VALUES ('TRANSFER_PRICING', 'Transfer Pricing', TRUE, 'COMMITTEE') ON CONFLICT (code) DO UPDATE SET requires_committee = EXCLUDED.requires_committee, initial_assignment_role = EXCLUDED.initial_assignment_role;

-- 5. Canonical Committees
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('FED-JA-COM-001', 'Federal Joint Audit Committee', (SELECT id FROM tax_centers WHERE code = 'federal-lto1'), (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('FED-TP-COM-001', 'Federal Transfer Pricing Committee', (SELECT id FROM tax_centers WHERE code = 'federal-lto1'), (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('FED-DESK-COM-001', 'Federal Desk Audit Committee', (SELECT id FROM tax_centers WHERE code = 'federal-lto1'), (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('FED-COMP-COM-001', 'Federal Comprehensive Audit Committee', (SELECT id FROM tax_centers WHERE code = 'federal-lto1'), (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('FED-ISSUE-COM-001', 'Federal Issue Audit Committee', (SELECT id FROM tax_centers WHERE code = 'federal-lto1'), (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('FEDERAL-LTO1-JA-COM-001', 'Federal Large Taxpayers Office 1 Joint Audit Committee', (SELECT id FROM tax_centers WHERE code = 'federal-lto1'), (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('FEDERAL-LTO1-TP-COM-001', 'Federal Large Taxpayers Office 1 TP Committee', (SELECT id FROM tax_centers WHERE code = 'federal-lto1'), (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('FEDERAL-LTO2-JA-COM-001', 'Federal Large Taxpayers Office 2 Joint Audit Committee', (SELECT id FROM tax_centers WHERE code = 'federal-lto2'), (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('FEDERAL-LTO2-TP-COM-001', 'Federal Large Taxpayers Office 2 TP Committee', (SELECT id FROM tax_centers WHERE code = 'federal-lto2'), (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('ADDIS_ABABA-TC1-JA-COM-001', 'Addis Ababa Tax Center 1 Joint Audit Committee', (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'), (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('ADDIS_ABABA-TC1-TP-COM-001', 'Addis Ababa Tax Center 1 TP Committee', (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'), (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('ADDIS_ABABA-TC2-JA-COM-001', 'Addis Ababa Tax Center 2 Joint Audit Committee', (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'), (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('ADDIS_ABABA-TC2-TP-COM-001', 'Addis Ababa Tax Center 2 TP Committee', (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'), (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('ADDIS_ABABA-TC3-JA-COM-001', 'Addis Ababa Tax Center 3 Joint Audit Committee', (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'), (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('ADDIS_ABABA-TC3-TP-COM-001', 'Addis Ababa Tax Center 3 TP Committee', (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'), (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('AMHARA-TC1-JA-COM-001', 'Amhara Tax Center 1 Joint Audit Committee', (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'), (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('AMHARA-TC1-TP-COM-001', 'Amhara Tax Center 1 TP Committee', (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'), (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('AMHARA-TC2-JA-COM-001', 'Amhara Tax Center 2 Joint Audit Committee', (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'), (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('AMHARA-TC2-TP-COM-001', 'Amhara Tax Center 2 TP Committee', (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'), (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('AMHARA-TC3-JA-COM-001', 'Amhara Tax Center 3 Joint Audit Committee', (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'), (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('AMHARA-TC3-TP-COM-001', 'Amhara Tax Center 3 TP Committee', (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'), (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('OROMIA-TC1-JA-COM-001', 'Oromia Tax Center 1 Joint Audit Committee', (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'), (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('OROMIA-TC1-TP-COM-001', 'Oromia Tax Center 1 TP Committee', (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'), (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('OROMIA-TC2-JA-COM-001', 'Oromia Tax Center 2 Joint Audit Committee', (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'), (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('OROMIA-TC2-TP-COM-001', 'Oromia Tax Center 2 TP Committee', (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'), (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('OROMIA-TC3-JA-COM-001', 'Oromia Tax Center 3 Joint Audit Committee', (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'), (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('OROMIA-TC3-TP-COM-001', 'Oromia Tax Center 3 TP Committee', (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'), (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('DIRE_DAWA-TC1-JA-COM-001', 'Dire Dawa Tax Center 1 Joint Audit Committee', (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'), (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('DIRE_DAWA-TC1-TP-COM-001', 'Dire Dawa Tax Center 1 TP Committee', (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'), (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('DIRE_DAWA-TC2-JA-COM-001', 'Dire Dawa Tax Center 2 Joint Audit Committee', (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'), (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('DIRE_DAWA-TC2-TP-COM-001', 'Dire Dawa Tax Center 2 TP Committee', (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'), (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('DIRE_DAWA-TC3-JA-COM-001', 'Dire Dawa Tax Center 3 Joint Audit Committee', (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'), (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('DIRE_DAWA-TC3-TP-COM-001', 'Dire Dawa Tax Center 3 TP Committee', (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'), (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('SNNPR-TC1-JA-COM-001', 'SNNPR Tax Center 1 Joint Audit Committee', (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'), (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('SNNPR-TC1-TP-COM-001', 'SNNPR Tax Center 1 TP Committee', (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'), (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('SNNPR-TC2-JA-COM-001', 'SNNPR Tax Center 2 Joint Audit Committee', (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'), (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('SNNPR-TC2-TP-COM-001', 'SNNPR Tax Center 2 TP Committee', (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'), (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('SNNPR-TC3-JA-COM-001', 'SNNPR Tax Center 3 Joint Audit Committee', (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'), (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('SNNPR-TC3-TP-COM-001', 'SNNPR Tax Center 3 TP Committee', (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'), (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('SOMALI-TC1-JA-COM-001', 'Somali Tax Center 1 Joint Audit Committee', (SELECT id FROM tax_centers WHERE code = 'somali-tc1'), (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('SOMALI-TC1-TP-COM-001', 'Somali Tax Center 1 TP Committee', (SELECT id FROM tax_centers WHERE code = 'somali-tc1'), (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('SOMALI-TC2-JA-COM-001', 'Somali Tax Center 2 Joint Audit Committee', (SELECT id FROM tax_centers WHERE code = 'somali-tc2'), (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('SOMALI-TC2-TP-COM-001', 'Somali Tax Center 2 TP Committee', (SELECT id FROM tax_centers WHERE code = 'somali-tc2'), (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('SOMALI-TC3-JA-COM-001', 'Somali Tax Center 3 Joint Audit Committee', (SELECT id FROM tax_centers WHERE code = 'somali-tc3'), (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT')) ON CONFLICT (code) DO NOTHING;
INSERT INTO committees (code, name, tax_center_id, audit_type_id) VALUES ('SOMALI-TC3-TP-COM-001', 'Somali Tax Center 3 TP Committee', (SELECT id FROM tax_centers WHERE code = 'somali-tc3'), (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING')) ON CONFLICT (code) DO NOTHING;

-- 6. Insert All System Users
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-pt-01', 'planning.auditor1@mor.gov.et', 'Planning Team Lead', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-pt-02', 'abebe.tadesse@mor.gov.et', 'Planning Team Member 1', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-pt-03', 'hanna.girma@mor.gov.et', 'Planning Team Member 2', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-ad-01', 'tesfaye.bekele@mor.gov.et', 'Tesfaye Bekele (Director)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-ad-02', 'deputy.director@mor.gov.et', 'Deputy Director', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-sm-01', 'rahel.hailu@mor.gov.et', 'Rahel Hailu (Senior Manager)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-sm-02', 'biruk.assefa@mor.gov.et', 'Biruk Assefa (Senior Manager)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-fed-chair', 'fed.committee1@mor.gov.et', 'Federal Joint Committee Chair', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-fed-mem1', 'fed.committee2@mor.gov.et', 'Federal Joint Committee Member 1', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-fed-mem2', 'fed.committee3@mor.gov.et', 'Federal Joint Committee Member 2', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-fed-tpchair', 'fed.tpcommittee1@mor.gov.et', 'Federal TP Committee Chair', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-fed-tpmem1', 'fed.tpcommittee2@mor.gov.et', 'Federal TP Committee Member 1', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-fed-tpmem2', 'fed.tpcommittee3@mor.gov.et', 'Federal TP Committee Member 2', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-fed-deskchair', 'fed.deskcommittee@mor.gov.et', 'Federal Desk Audit Committee Chair', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-fed-deskmem1', 'fed.deskmem1@mor.gov.et', 'Federal Desk Audit Committee Member 1', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-fed-compchair', 'fed.compcommittee@mor.gov.et', 'Federal Comprehensive Audit Committee Chair', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-fed-compmem1', 'fed.compmem1@mor.gov.et', 'Federal Comprehensive Audit Committee Member 1', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-fed-issuechair', 'fed.issuecommittee@mor.gov.et', 'Federal Issue Audit Committee Chair', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-fed-issuemem1', 'fed.issuemem1@mor.gov.et', 'Federal Issue Audit Committee Member 1', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-req-01', 'clearance.officer@mor.gov.et', 'Getachew Zewde (Tax Clearance)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-req-02', 'closure.directorate@mor.gov.et', 'Tigist Worku (Business Closure)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-req-03', 'fraud.intel@mor.gov.et', 'Deriba Alemayehu (Fraud & Intel)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-req-04', 'external.motri@gov.et', 'Ministry of Trade (External)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-rd-fed', 'solomon.worku@mor.gov.et', 'Solomon Worku (Federal LTO)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-rd-aa', 'getnet.alemu@mor.gov.et', 'Getnet Alemu', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-rd-am', 'tadesse.kebede@mor.gov.et', 'Tadesse Kebede', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-rd-or', 'gemechu.negash@mor.gov.et', 'Gemechu Negash', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-rd-dd', 'yonas.mengistu.dd@mor.gov.et', 'Yonas Mengistu (Dire Dawa)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-rd-sn', 'yonas.mengistu@mor.gov.et', 'Yonas Mengistu', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-rd-so', 'ibrahim.hassan@mor.gov.et', 'Ibrahim Hassan', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tcm-federal-lto1', 'u-tcm-federal-lto1@mor.gov.et', 'Tax Center Manager (Federal Large Taxpayers Office 1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-federal-lto1-ja', 'u-com-federal-lto1-ja@mor.gov.et', 'Joint Committee Chair (Federal Large Taxpayers Office 1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-federal-lto1-tp', 'u-com-federal-lto1-tp@mor.gov.et', 'TP Committee Chair (Federal Large Taxpayers Office 1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-federal-lto1-desk-1', 'u-tl-federal-lto1-desk-1@mor.gov.et', 'Mahlet Tesfa (DESK TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto1-desk-1-1', 'u-aud-federal-lto1-desk-1-1@mor.gov.et', 'Ruth Mamo (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto1-desk-1-2', 'u-aud-federal-lto1-desk-1-2@mor.gov.et', 'Tewodros Kassa (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-federal-lto1-desk-2', 'u-tl-federal-lto1-desk-2@mor.gov.et', 'Tolera Alemu (DESK TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto1-desk-2-1', 'u-aud-federal-lto1-desk-2-1@mor.gov.et', 'Tadesse Lemma (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto1-desk-2-2', 'u-aud-federal-lto1-desk-2-2@mor.gov.et', 'Workneh Gebre (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-federal-lto1-joint-1', 'u-tl-federal-lto1-joint-1@mor.gov.et', 'Tewodros Zewde (JOINT TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto1-joint-1-1', 'u-aud-federal-lto1-joint-1-1@mor.gov.et', 'Yodit Tilahun (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto1-joint-1-2', 'u-aud-federal-lto1-joint-1-2@mor.gov.et', 'Samuel Assefa (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-federal-lto1-joint-2', 'u-tl-federal-lto1-joint-2@mor.gov.et', 'Ruth Negash (JOINT TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto1-joint-2-1', 'u-aud-federal-lto1-joint-2-1@mor.gov.et', 'Rahel Negash (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto1-joint-2-2', 'u-aud-federal-lto1-joint-2-2@mor.gov.et', 'Berihun Zewde (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-federal-lto1-tp-1', 'u-tl-federal-lto1-tp-1@mor.gov.et', 'Fatuma Abera (TP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto1-tp-1-1', 'u-aud-federal-lto1-tp-1-1@mor.gov.et', 'Berihun Tesfaye (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto1-tp-1-2', 'u-aud-federal-lto1-tp-1-2@mor.gov.et', 'Tsega Mulugeta (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-federal-lto1-tp-2', 'u-tl-federal-lto1-tp-2@mor.gov.et', 'Kassahun Wolde (TP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto1-tp-2-1', 'u-aud-federal-lto1-tp-2-1@mor.gov.et', 'Dawit Alemayehu (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto1-tp-2-2', 'u-aud-federal-lto1-tp-2-2@mor.gov.et', 'Meron Banti (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-federal-lto1-comp-1', 'u-tl-federal-lto1-comp-1@mor.gov.et', 'Yosef Bekele (COMP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto1-comp-1-1', 'u-aud-federal-lto1-comp-1-1@mor.gov.et', 'Haile Mideksa (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto1-comp-1-2', 'u-aud-federal-lto1-comp-1-2@mor.gov.et', 'Dawit Getachew (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-federal-lto1-comp-2', 'u-tl-federal-lto1-comp-2@mor.gov.et', 'Eleni Kebede (COMP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto1-comp-2-1', 'u-aud-federal-lto1-comp-2-1@mor.gov.et', 'Lalisa Girma (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto1-comp-2-2', 'u-aud-federal-lto1-comp-2-2@mor.gov.et', 'Birtukan Belay (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-federal-lto1-issue-1', 'u-tl-federal-lto1-issue-1@mor.gov.et', 'Abebe Assefa (ISSUE TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto1-issue-1-1', 'u-aud-federal-lto1-issue-1-1@mor.gov.et', 'Selam Bekele (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto1-issue-1-2', 'u-aud-federal-lto1-issue-1-2@mor.gov.et', 'Bereket Kebede (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-federal-lto1-issue-2', 'u-tl-federal-lto1-issue-2@mor.gov.et', 'Tsega Tilahun (ISSUE TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto1-issue-2-1', 'u-aud-federal-lto1-issue-2-1@mor.gov.et', 'Henok Kassa (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto1-issue-2-2', 'u-aud-federal-lto1-issue-2-2@mor.gov.et', 'Seble Worku (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tcm-federal-lto2', 'u-tcm-federal-lto2@mor.gov.et', 'Tax Center Manager (Federal Large Taxpayers Office 2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-federal-lto2-ja', 'u-com-federal-lto2-ja@mor.gov.et', 'Joint Committee Chair (Federal Large Taxpayers Office 2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-federal-lto2-tp', 'u-com-federal-lto2-tp@mor.gov.et', 'TP Committee Chair (Federal Large Taxpayers Office 2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-federal-lto2-desk-1', 'u-tl-federal-lto2-desk-1@mor.gov.et', 'Almaz Getachew (DESK TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto2-desk-1-1', 'u-aud-federal-lto2-desk-1-1@mor.gov.et', 'Tewodros Kassa (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto2-desk-1-2', 'u-aud-federal-lto2-desk-1-2@mor.gov.et', 'Mesfin Worku (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-federal-lto2-desk-2', 'u-tl-federal-lto2-desk-2@mor.gov.et', 'Workneh Mideksa (DESK TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto2-desk-2-1', 'u-aud-federal-lto2-desk-2-1@mor.gov.et', 'Workneh Gebre (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto2-desk-2-2', 'u-aud-federal-lto2-desk-2-2@mor.gov.et', 'Almaz Abera (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-federal-lto2-joint-1', 'u-tl-federal-lto2-joint-1@mor.gov.et', 'Bikila Wakjira (JOINT TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto2-joint-1-1', 'u-aud-federal-lto2-joint-1-1@mor.gov.et', 'Meseret Worku (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto2-joint-1-2', 'u-aud-federal-lto2-joint-1-2@mor.gov.et', 'Eden Kassa (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-federal-lto2-joint-2', 'u-tl-federal-lto2-joint-2@mor.gov.et', 'Kassa Banti (JOINT TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto2-joint-2-1', 'u-aud-federal-lto2-joint-2-1@mor.gov.et', 'Genet Kebede (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto2-joint-2-2', 'u-aud-federal-lto2-joint-2-2@mor.gov.et', 'Birtukan Bekele (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-federal-lto2-tp-1', 'u-tl-federal-lto2-tp-1@mor.gov.et', 'Yonas Bikila (TP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto2-tp-1-1', 'u-aud-federal-lto2-tp-1-1@mor.gov.et', 'Tsega Bikila (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto2-tp-1-2', 'u-aud-federal-lto2-tp-1-2@mor.gov.et', 'Berihun Zewde (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-federal-lto2-tp-2', 'u-tl-federal-lto2-tp-2@mor.gov.et', 'Chaltu Tesfaye (TP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto2-tp-2-1', 'u-aud-federal-lto2-tp-2-1@mor.gov.et', 'Eden Girma (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto2-tp-2-2', 'u-aud-federal-lto2-tp-2-2@mor.gov.et', 'Samuel Assefa (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-federal-lto2-comp-1', 'u-tl-federal-lto2-comp-1@mor.gov.et', 'Chaltu Yohannes (COMP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto2-comp-1-1', 'u-aud-federal-lto2-comp-1-1@mor.gov.et', 'Dawit Getachew (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto2-comp-1-2', 'u-aud-federal-lto2-comp-1-2@mor.gov.et', 'Meron Tesfa (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-federal-lto2-comp-2', 'u-tl-federal-lto2-comp-2@mor.gov.et', 'Yonas Hassan (COMP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto2-comp-2-1', 'u-aud-federal-lto2-comp-2-1@mor.gov.et', 'Birtukan Belay (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto2-comp-2-2', 'u-aud-federal-lto2-comp-2-2@mor.gov.et', 'Genet Tadesse (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-federal-lto2-issue-1', 'u-tl-federal-lto2-issue-1@mor.gov.et', 'Natnael Yohannes (ISSUE TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto2-issue-1-1', 'u-aud-federal-lto2-issue-1-1@mor.gov.et', 'Tekle Zewde (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto2-issue-1-2', 'u-aud-federal-lto2-issue-1-2@mor.gov.et', 'Bikila Negash (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-federal-lto2-issue-2', 'u-tl-federal-lto2-issue-2@mor.gov.et', 'Yodit Mideksa (ISSUE TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto2-issue-2-1', 'u-aud-federal-lto2-issue-2-1@mor.gov.et', 'Mulugeta Assefa (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-federal-lto2-issue-2-2', 'u-aud-federal-lto2-issue-2-2@mor.gov.et', 'Diriba Tilahun (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tcm-addis_ababa-tc1', 'u-tcm-addis_ababa-tc1@mor.gov.et', 'Tax Center Manager (Addis Ababa Tax Center 1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-addis_ababa-tc1-ja', 'u-com-addis_ababa-tc1-ja@mor.gov.et', 'Joint Committee Chair (Addis Ababa Tax Center 1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-addis_ababa-tc1-tp', 'u-com-addis_ababa-tc1-tp@mor.gov.et', 'TP Committee Chair (Addis Ababa Tax Center 1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc1-desk-1', 'u-tl-addis_ababa-tc1-desk-1@mor.gov.et', 'Amanuel Alemayehu (DESK TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc1-desk-1-1', 'u-aud-addis_ababa-tc1-desk-1-1@mor.gov.et', 'Yosef Negash (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc1-desk-1-2', 'u-aud-addis_ababa-tc1-desk-1-2@mor.gov.et', 'Eleni Zewde (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc1-desk-2', 'u-tl-addis_ababa-tc1-desk-2@mor.gov.et', 'Ruth Banti (DESK TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc1-desk-2-1', 'u-aud-addis_ababa-tc1-desk-2-1@mor.gov.et', 'Saron Berhane (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc1-desk-2-2', 'u-aud-addis_ababa-tc1-desk-2-2@mor.gov.et', 'Michael Desta (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc1-joint-1', 'u-tl-addis_ababa-tc1-joint-1@mor.gov.et', 'Haile Berhane (JOINT TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc1-joint-1-1', 'u-aud-addis_ababa-tc1-joint-1-1@mor.gov.et', 'Mamo Abera (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc1-joint-1-2', 'u-aud-addis_ababa-tc1-joint-1-2@mor.gov.et', 'Hassen Gebre (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc1-joint-2', 'u-tl-addis_ababa-tc1-joint-2@mor.gov.et', 'Dawit Desta (JOINT TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc1-joint-2-1', 'u-aud-addis_ababa-tc1-joint-2-1@mor.gov.et', 'Mahlet Worku (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc1-joint-2-2', 'u-aud-addis_ababa-tc1-joint-2-2@mor.gov.et', 'Eyerusalem Kassa (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc1-tp-1', 'u-tl-addis_ababa-tc1-tp-1@mor.gov.et', 'Robel Girma (TP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc1-tp-1-1', 'u-aud-addis_ababa-tc1-tp-1-1@mor.gov.et', 'Abdi Getachew (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc1-tp-1-2', 'u-aud-addis_ababa-tc1-tp-1-2@mor.gov.et', 'Ephrem Mideksa (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc1-tp-2', 'u-tl-addis_ababa-tc1-tp-2@mor.gov.et', 'Natnael Belay (TP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc1-tp-2-1', 'u-aud-addis_ababa-tc1-tp-2-1@mor.gov.et', 'Michael Desta (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc1-tp-2-2', 'u-aud-addis_ababa-tc1-tp-2-2@mor.gov.et', 'Saron Berhane (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc1-comp-1', 'u-tl-addis_ababa-tc1-comp-1@mor.gov.et', 'Lalisa Wakjira (COMP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc1-comp-1-1', 'u-aud-addis_ababa-tc1-comp-1-1@mor.gov.et', 'Almaw Bekele (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc1-comp-1-2', 'u-aud-addis_ababa-tc1-comp-1-2@mor.gov.et', 'Tadesse Kebede (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc1-comp-2', 'u-tl-addis_ababa-tc1-comp-2@mor.gov.et', 'Birtukan Mengistu (COMP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc1-comp-2-1', 'u-aud-addis_ababa-tc1-comp-2-1@mor.gov.et', 'Bereket Kassa (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc1-comp-2-2', 'u-aud-addis_ababa-tc1-comp-2-2@mor.gov.et', 'Solomon Worku (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc1-issue-1', 'u-tl-addis_ababa-tc1-issue-1@mor.gov.et', 'Abebe Mideksa (ISSUE TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc1-issue-1-1', 'u-aud-addis_ababa-tc1-issue-1-1@mor.gov.et', 'Yosef Desta (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc1-issue-1-2', 'u-aud-addis_ababa-tc1-issue-1-2@mor.gov.et', 'Bethlehem Berhane (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc1-issue-2', 'u-tl-addis_ababa-tc1-issue-2@mor.gov.et', 'Almaw Getachew (ISSUE TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc1-issue-2-1', 'u-aud-addis_ababa-tc1-issue-2-1@mor.gov.et', 'Ibrahim Zewde (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc1-issue-2-2', 'u-aud-addis_ababa-tc1-issue-2-2@mor.gov.et', 'Gemechu Negash (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tcm-addis_ababa-tc2', 'u-tcm-addis_ababa-tc2@mor.gov.et', 'Tax Center Manager (Addis Ababa Tax Center 2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-addis_ababa-tc2-ja', 'u-com-addis_ababa-tc2-ja@mor.gov.et', 'Joint Committee Chair (Addis Ababa Tax Center 2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-addis_ababa-tc2-tp', 'u-com-addis_ababa-tc2-tp@mor.gov.et', 'TP Committee Chair (Addis Ababa Tax Center 2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc2-desk-1', 'u-tl-addis_ababa-tc2-desk-1@mor.gov.et', 'Tekle Girma (DESK TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc2-desk-1-1', 'u-aud-addis_ababa-tc2-desk-1-1@mor.gov.et', 'Eleni Zewde (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc2-desk-1-2', 'u-aud-addis_ababa-tc2-desk-1-2@mor.gov.et', 'Nardos Bikila (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc2-desk-2', 'u-tl-addis_ababa-tc2-desk-2@mor.gov.et', 'Bikila Assefa (DESK TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc2-desk-2-1', 'u-aud-addis_ababa-tc2-desk-2-1@mor.gov.et', 'Michael Desta (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc2-desk-2-2', 'u-aud-addis_ababa-tc2-desk-2-2@mor.gov.et', 'Eyerusalem Kifle (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc2-joint-1', 'u-tl-addis_ababa-tc2-joint-1@mor.gov.et', 'Bikila Wolde (JOINT TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc2-joint-1-1', 'u-aud-addis_ababa-tc2-joint-1-1@mor.gov.et', 'Birtukan Mamo (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc2-joint-1-2', 'u-aud-addis_ababa-tc2-joint-1-2@mor.gov.et', 'Genet Kassa (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc2-joint-2', 'u-tl-addis_ababa-tc2-joint-2@mor.gov.et', 'Kassa Abera (JOINT TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc2-joint-2-1', 'u-aud-addis_ababa-tc2-joint-2-1@mor.gov.et', 'Eden Lemma (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc2-joint-2-2', 'u-aud-addis_ababa-tc2-joint-2-2@mor.gov.et', 'Meseret Gebre (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc2-tp-1', 'u-tl-addis_ababa-tc2-tp-1@mor.gov.et', 'Addis Bekele (TP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc2-tp-1-1', 'u-aud-addis_ababa-tc2-tp-1-1@mor.gov.et', 'Abebe Bikila (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc2-tp-1-2', 'u-aud-addis_ababa-tc2-tp-1-2@mor.gov.et', 'Tsega Zewde (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc2-tp-2', 'u-tl-addis_ababa-tc2-tp-2@mor.gov.et', 'Kidist Kebede (TP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc2-tp-2-1', 'u-aud-addis_ababa-tc2-tp-2-1@mor.gov.et', 'Meseret Girma (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc2-tp-2-2', 'u-aud-addis_ababa-tc2-tp-2-2@mor.gov.et', 'Eden Assefa (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc2-comp-1', 'u-tl-addis_ababa-tc2-comp-1@mor.gov.et', 'Genet Tilahun (COMP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc2-comp-1-1', 'u-aud-addis_ababa-tc2-comp-1-1@mor.gov.et', 'Berihun Mengistu (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc2-comp-1-2', 'u-aud-addis_ababa-tc2-comp-1-2@mor.gov.et', 'Rahel Wakjira (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc2-comp-2', 'u-tl-addis_ababa-tc2-comp-2@mor.gov.et', 'Birtukan Mekonnen (COMP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc2-comp-2-1', 'u-aud-addis_ababa-tc2-comp-2-1@mor.gov.et', 'Samuel Gebre (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc2-comp-2-2', 'u-aud-addis_ababa-tc2-comp-2-2@mor.gov.et', 'Yodit Lemma (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc2-issue-1', 'u-tl-addis_ababa-tc2-issue-1@mor.gov.et', 'Fatuma Haile (ISSUE TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc2-issue-1-1', 'u-aud-addis_ababa-tc2-issue-1-1@mor.gov.et', 'Tadesse Girma (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc2-issue-1-2', 'u-aud-addis_ababa-tc2-issue-1-2@mor.gov.et', 'Workneh Belay (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc2-issue-2', 'u-tl-addis_ababa-tc2-issue-2@mor.gov.et', 'Chaltu Worku (ISSUE TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc2-issue-2-1', 'u-aud-addis_ababa-tc2-issue-2-1@mor.gov.et', 'Solomon Bikila (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc2-issue-2-2', 'u-aud-addis_ababa-tc2-issue-2-2@mor.gov.et', 'Getnet Tesfaye (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tcm-addis_ababa-tc3', 'u-tcm-addis_ababa-tc3@mor.gov.et', 'Tax Center Manager (Addis Ababa Tax Center 3)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-addis_ababa-tc3-ja', 'u-com-addis_ababa-tc3-ja@mor.gov.et', 'Joint Committee Chair (Addis Ababa Tax Center 3)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-addis_ababa-tc3-tp', 'u-com-addis_ababa-tc3-tp@mor.gov.et', 'TP Committee Chair (Addis Ababa Tax Center 3)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc3-desk-1', 'u-tl-addis_ababa-tc3-desk-1@mor.gov.et', 'Diriba Belay (DESK TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc3-desk-1-1', 'u-aud-addis_ababa-tc3-desk-1-1@mor.gov.et', 'Nardos Bikila (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc3-desk-1-2', 'u-aud-addis_ababa-tc3-desk-1-2@mor.gov.et', 'Addis Tesfaye (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc3-desk-2', 'u-tl-addis_ababa-tc3-desk-2@mor.gov.et', 'Mulugeta Tadesse (DESK TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc3-desk-2-1', 'u-aud-addis_ababa-tc3-desk-2-1@mor.gov.et', 'Eyerusalem Kifle (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc3-desk-2-2', 'u-aud-addis_ababa-tc3-desk-2-2@mor.gov.et', 'Mahlet Alemayehu (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc3-joint-1', 'u-tl-addis_ababa-tc3-joint-1@mor.gov.et', 'Fikadu Alemu (JOINT TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc3-joint-1-1', 'u-aud-addis_ababa-tc3-joint-1-1@mor.gov.et', 'Berihun Girma (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc3-joint-1-2', 'u-aud-addis_ababa-tc3-joint-1-2@mor.gov.et', 'Rahel Assefa (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc3-joint-2', 'u-tl-addis_ababa-tc3-joint-2@mor.gov.et', 'Sara Tesfa (JOINT TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc3-joint-2-1', 'u-aud-addis_ababa-tc3-joint-2-1@mor.gov.et', 'Samuel Mideksa (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc3-joint-2-2', 'u-aud-addis_ababa-tc3-joint-2-2@mor.gov.et', 'Yodit Yohannes (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc3-tp-1', 'u-tl-addis_ababa-tc3-tp-1@mor.gov.et', 'Eleni Yohannes (TP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc3-tp-1-1', 'u-aud-addis_ababa-tc3-tp-1-1@mor.gov.et', 'Abdi Getachew (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc3-tp-1-2', 'u-aud-addis_ababa-tc3-tp-1-2@mor.gov.et', 'Hassen Tesfa (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc3-tp-2', 'u-tl-addis_ababa-tc3-tp-2@mor.gov.et', 'Nardos Mideksa (TP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc3-tp-2-1', 'u-aud-addis_ababa-tc3-tp-2-1@mor.gov.et', 'Chaltu Belay (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc3-tp-2-2', 'u-aud-addis_ababa-tc3-tp-2-2@mor.gov.et', 'Fatuma Tadesse (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc3-comp-1', 'u-tl-addis_ababa-tc3-comp-1@mor.gov.et', 'Nardos Mamo (COMP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc3-comp-1-1', 'u-aud-addis_ababa-tc3-comp-1-1@mor.gov.et', 'Rahel Wakjira (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc3-comp-1-2', 'u-aud-addis_ababa-tc3-comp-1-2@mor.gov.et', 'Mulugeta Banti (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc3-comp-2', 'u-tl-addis_ababa-tc3-comp-2@mor.gov.et', 'Addis Kassa (COMP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc3-comp-2-1', 'u-aud-addis_ababa-tc3-comp-2-1@mor.gov.et', 'Yodit Lemma (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc3-comp-2-2', 'u-aud-addis_ababa-tc3-comp-2-2@mor.gov.et', 'Natnael Mulugeta (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc3-issue-1', 'u-tl-addis_ababa-tc3-issue-1@mor.gov.et', 'Getnet Desta (ISSUE TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc3-issue-1-1', 'u-aud-addis_ababa-tc3-issue-1-1@mor.gov.et', 'Tirhas Mamo (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc3-issue-1-2', 'u-aud-addis_ababa-tc3-issue-1-2@mor.gov.et', 'Kassahun Tadesse (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-addis_ababa-tc3-issue-2', 'u-tl-addis_ababa-tc3-issue-2@mor.gov.et', 'Gemechu Kifle (ISSUE TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc3-issue-2-1', 'u-aud-addis_ababa-tc3-issue-2-1@mor.gov.et', 'Kassa Alemu (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-addis_ababa-tc3-issue-2-2', 'u-aud-addis_ababa-tc3-issue-2-2@mor.gov.et', 'Mamo Tesfa (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tcm-amhara-tc1', 'u-tcm-amhara-tc1@mor.gov.et', 'Tax Center Manager (Amhara Tax Center 1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-amhara-tc1-ja', 'u-com-amhara-tc1-ja@mor.gov.et', 'Joint Committee Chair (Amhara Tax Center 1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-amhara-tc1-tp', 'u-com-amhara-tc1-tp@mor.gov.et', 'TP Committee Chair (Amhara Tax Center 1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc1-desk-1', 'u-tl-amhara-tc1-desk-1@mor.gov.et', 'Kidist Haile (DESK TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc1-desk-1-1', 'u-aud-amhara-tc1-desk-1-1@mor.gov.et', 'Chaltu Yohannes (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc1-desk-1-2', 'u-aud-amhara-tc1-desk-1-2@mor.gov.et', 'Fatuma Mideksa (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc1-desk-2', 'u-tl-amhara-tc1-desk-2@mor.gov.et', 'Addis Worku (DESK TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc1-desk-2-1', 'u-aud-amhara-tc1-desk-2-1@mor.gov.et', 'Nardos Assefa (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc1-desk-2-2', 'u-aud-amhara-tc1-desk-2-2@mor.gov.et', 'Addis Girma (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc1-joint-1', 'u-tl-amhara-tc1-joint-1@mor.gov.et', 'Nardos Worku (JOINT TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc1-joint-1-1', 'u-aud-amhara-tc1-joint-1-1@mor.gov.et', 'Kassa Assefa (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc1-joint-1-2', 'u-aud-amhara-tc1-joint-1-2@mor.gov.et', 'Mamo Tilahun (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc1-joint-2', 'u-tl-amhara-tc1-joint-2@mor.gov.et', 'Addis Haile (JOINT TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc1-joint-2-1', 'u-aud-amhara-tc1-joint-2-1@mor.gov.et', 'Tolera Yohannes (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc1-joint-2-2', 'u-aud-amhara-tc1-joint-2-2@mor.gov.et', 'Mahlet Hassan (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc1-tp-1', 'u-tl-amhara-tc1-tp-1@mor.gov.et', 'Lalisa Worku (TP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc1-tp-1-1', 'u-aud-amhara-tc1-tp-1-1@mor.gov.et', 'Tewodros Alemayehu (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc1-tp-1-2', 'u-aud-amhara-tc1-tp-1-2@mor.gov.et', 'Mesfin Banti (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc1-tp-2', 'u-tl-amhara-tc1-tp-2@mor.gov.et', 'Dereje Kassa (TP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc1-tp-2-1', 'u-aud-amhara-tc1-tp-2-1@mor.gov.et', 'Workneh Alemu (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc1-tp-2-2', 'u-aud-amhara-tc1-tp-2-2@mor.gov.et', 'Almaz Bekele (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc1-comp-1', 'u-tl-amhara-tc1-comp-1@mor.gov.et', 'Rahel Kassa (COMP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc1-comp-1-1', 'u-aud-amhara-tc1-comp-1-1@mor.gov.et', 'Tewodros Lemma (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc1-comp-1-2', 'u-aud-amhara-tc1-comp-1-2@mor.gov.et', 'Mesfin Gebre (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc1-comp-2', 'u-tl-amhara-tc1-comp-2@mor.gov.et', 'Mulugeta Mamo (COMP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc1-comp-2-1', 'u-aud-amhara-tc1-comp-2-1@mor.gov.et', 'Workneh Wakjira (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc1-comp-2-2', 'u-aud-amhara-tc1-comp-2-2@mor.gov.et', 'Almaz Mengistu (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc1-issue-1', 'u-tl-amhara-tc1-issue-1@mor.gov.et', 'Tirhas Abera (ISSUE TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc1-issue-1-1', 'u-aud-amhara-tc1-issue-1-1@mor.gov.et', 'Eleni Tadesse (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc1-issue-1-2', 'u-aud-amhara-tc1-issue-1-2@mor.gov.et', 'Yosef Belay (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc1-issue-2', 'u-tl-amhara-tc1-issue-2@mor.gov.et', 'Mekdes Wolde (ISSUE TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc1-issue-2-1', 'u-aud-amhara-tc1-issue-2-1@mor.gov.et', 'Yonas Tesfa (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc1-issue-2-2', 'u-aud-amhara-tc1-issue-2-2@mor.gov.et', 'Ibrahim Getachew (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tcm-amhara-tc2', 'u-tcm-amhara-tc2@mor.gov.et', 'Tax Center Manager (Amhara Tax Center 2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-amhara-tc2-ja', 'u-com-amhara-tc2-ja@mor.gov.et', 'Joint Committee Chair (Amhara Tax Center 2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-amhara-tc2-tp', 'u-com-amhara-tc2-tp@mor.gov.et', 'TP Committee Chair (Amhara Tax Center 2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc2-desk-1', 'u-tl-amhara-tc2-desk-1@mor.gov.et', 'Lalisa Bekele (DESK TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc2-desk-1-1', 'u-aud-amhara-tc2-desk-1-1@mor.gov.et', 'Fatuma Mideksa (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc2-desk-1-2', 'u-aud-amhara-tc2-desk-1-2@mor.gov.et', 'Kassahun Getachew (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc2-desk-2', 'u-tl-amhara-tc2-desk-2@mor.gov.et', 'Birtukan Kebede (DESK TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc2-desk-2-1', 'u-aud-amhara-tc2-desk-2-1@mor.gov.et', 'Addis Girma (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc2-desk-2-2', 'u-aud-amhara-tc2-desk-2-2@mor.gov.et', 'Kidist Belay (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc2-joint-1', 'u-tl-amhara-tc2-joint-1@mor.gov.et', 'Amanuel Getachew (JOINT TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc2-joint-1-1', 'u-aud-amhara-tc2-joint-1-1@mor.gov.et', 'Lalisa Kifle (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc2-joint-1-2', 'u-aud-amhara-tc2-joint-1-2@mor.gov.et', 'Birtukan Alemayehu (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc2-joint-2', 'u-tl-amhara-tc2-joint-2@mor.gov.et', 'Meseret Mideksa (JOINT TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc2-joint-2-1', 'u-aud-amhara-tc2-joint-2-1@mor.gov.et', 'Samuel Tesfa (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc2-joint-2-2', 'u-aud-amhara-tc2-joint-2-2@mor.gov.et', 'Eden Alemu (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc2-tp-1', 'u-tl-amhara-tc2-tp-1@mor.gov.et', 'Genet Tesfaye (TP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc2-tp-1-1', 'u-aud-amhara-tc2-tp-1-1@mor.gov.et', 'Tolera Tadesse (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc2-tp-1-2', 'u-aud-amhara-tc2-tp-1-2@mor.gov.et', 'Diriba Mamo (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc2-tp-2', 'u-tl-amhara-tc2-tp-2@mor.gov.et', 'Birtukan Bikila (TP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc2-tp-2-1', 'u-aud-amhara-tc2-tp-2-1@mor.gov.et', 'Kassa Mulugeta (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc2-tp-2-2', 'u-aud-amhara-tc2-tp-2-2@mor.gov.et', 'Bikila Lemma (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc2-comp-1', 'u-tl-amhara-tc2-comp-1@mor.gov.et', 'Kassa Mekonnen (COMP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc2-comp-1-1', 'u-aud-amhara-tc2-comp-1-1@mor.gov.et', 'Mesfin Gebre (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc2-comp-1-2', 'u-aud-amhara-tc2-comp-1-2@mor.gov.et', 'Fikremariam Abera (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc2-comp-2', 'u-tl-amhara-tc2-comp-2@mor.gov.et', 'Bikila Tilahun (COMP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc2-comp-2-1', 'u-aud-amhara-tc2-comp-2-1@mor.gov.et', 'Almaz Mengistu (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc2-comp-2-2', 'u-aud-amhara-tc2-comp-2-2@mor.gov.et', 'Tigist Hassan (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc2-issue-1', 'u-tl-amhara-tc2-issue-1@mor.gov.et', 'Berihun Desta (ISSUE TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc2-issue-1-1', 'u-aud-amhara-tc2-issue-1-1@mor.gov.et', 'Almaw Wolde (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc2-issue-1-2', 'u-aud-amhara-tc2-issue-1-2@mor.gov.et', 'Tadesse Berhane (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc2-issue-2', 'u-tl-amhara-tc2-issue-2@mor.gov.et', 'Rahel Berhane (ISSUE TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc2-issue-2-1', 'u-aud-amhara-tc2-issue-2-1@mor.gov.et', 'Bereket Yohannes (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc2-issue-2-2', 'u-aud-amhara-tc2-issue-2-2@mor.gov.et', 'Solomon Mideksa (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tcm-amhara-tc3', 'u-tcm-amhara-tc3@mor.gov.et', 'Tax Center Manager (Amhara Tax Center 3)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-amhara-tc3-ja', 'u-com-amhara-tc3-ja@mor.gov.et', 'Joint Committee Chair (Amhara Tax Center 3)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-amhara-tc3-tp', 'u-com-amhara-tc3-tp@mor.gov.et', 'TP Committee Chair (Amhara Tax Center 3)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc3-desk-1', 'u-tl-amhara-tc3-desk-1@mor.gov.et', 'Genet Yohannes (DESK TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc3-desk-1-1', 'u-aud-amhara-tc3-desk-1-1@mor.gov.et', 'Kassahun Getachew (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc3-desk-1-2', 'u-aud-amhara-tc3-desk-1-2@mor.gov.et', 'Tirhas Tesfa (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc3-desk-2', 'u-tl-amhara-tc3-desk-2@mor.gov.et', 'Birtukan Hassan (DESK TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc3-desk-2-1', 'u-aud-amhara-tc3-desk-2-1@mor.gov.et', 'Kidist Belay (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc3-desk-2-2', 'u-aud-amhara-tc3-desk-2-2@mor.gov.et', 'Robel Tadesse (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc3-joint-1', 'u-tl-amhara-tc3-joint-1@mor.gov.et', 'Diriba Mekonnen (JOINT TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc3-joint-1-1', 'u-aud-amhara-tc3-joint-1-1@mor.gov.et', 'Tsega Alemayehu (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc3-joint-1-2', 'u-aud-amhara-tc3-joint-1-2@mor.gov.et', 'Berihun Kifle (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc3-joint-2', 'u-tl-amhara-tc3-joint-2@mor.gov.et', 'Mulugeta Tilahun (JOINT TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc3-joint-2-1', 'u-aud-amhara-tc3-joint-2-1@mor.gov.et', 'Eden Tesfaye (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc3-joint-2-2', 'u-aud-amhara-tc3-joint-2-2@mor.gov.et', 'Samuel Bikila (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc3-tp-1', 'u-tl-amhara-tc3-tp-1@mor.gov.et', 'Seble Wolde (TP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc3-tp-1-1', 'u-aud-amhara-tc3-tp-1-1@mor.gov.et', 'Workneh Desta (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc3-tp-1-2', 'u-aud-amhara-tc3-tp-1-2@mor.gov.et', 'Tadesse Berhane (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc3-tp-2', 'u-tl-amhara-tc3-tp-2@mor.gov.et', 'Henok Abera (TP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc3-tp-2-1', 'u-aud-amhara-tc3-tp-2-1@mor.gov.et', 'Tewodros Zewde (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc3-tp-2-2', 'u-aud-amhara-tc3-tp-2-2@mor.gov.et', 'Ruth Negash (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc3-comp-1', 'u-tl-amhara-tc3-comp-1@mor.gov.et', 'Tewodros Mengistu (COMP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc3-comp-1-1', 'u-aud-amhara-tc3-comp-1-1@mor.gov.et', 'Bikila Kassa (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc3-comp-1-2', 'u-aud-amhara-tc3-comp-1-2@mor.gov.et', 'Kassa Mamo (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc3-comp-2', 'u-tl-amhara-tc3-comp-2@mor.gov.et', 'Ruth Wakjira (COMP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc3-comp-2-1', 'u-aud-amhara-tc3-comp-2-1@mor.gov.et', 'Diriba Bekele (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc3-comp-2-2', 'u-aud-amhara-tc3-comp-2-2@mor.gov.et', 'Tolera Alemu (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc3-issue-1', 'u-tl-amhara-tc3-issue-1@mor.gov.et', 'Samuel Haile (ISSUE TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc3-issue-1-1', 'u-aud-amhara-tc3-issue-1-1@mor.gov.et', 'Mekdes Mengistu (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc3-issue-1-2', 'u-aud-amhara-tc3-issue-1-2@mor.gov.et', 'Tirhas Wakjira (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-amhara-tc3-issue-2', 'u-tl-amhara-tc3-issue-2@mor.gov.et', 'Eden Negash (ISSUE TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc3-issue-2-1', 'u-aud-amhara-tc3-issue-2-1@mor.gov.et', 'Bikila Gebre (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-amhara-tc3-issue-2-2', 'u-aud-amhara-tc3-issue-2-2@mor.gov.et', 'Kassa Lemma (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tcm-oromia-tc1', 'u-tcm-oromia-tc1@mor.gov.et', 'Tax Center Manager (Oromia Tax Center 1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-oromia-tc1-ja', 'u-com-oromia-tc1-ja@mor.gov.et', 'Joint Committee Chair (Oromia Tax Center 1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-oromia-tc1-tp', 'u-com-oromia-tc1-tp@mor.gov.et', 'TP Committee Chair (Oromia Tax Center 1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc1-desk-1', 'u-tl-oromia-tc1-desk-1@mor.gov.et', 'Robel Negash (DESK TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc1-desk-1-1', 'u-aud-oromia-tc1-desk-1-1@mor.gov.et', 'Chaltu Mekonnen (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc1-desk-1-2', 'u-aud-oromia-tc1-desk-1-2@mor.gov.et', 'Fatuma Tilahun (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc1-desk-2', 'u-tl-oromia-tc1-desk-2@mor.gov.et', 'Natnael Zewde (DESK TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc1-desk-2-1', 'u-aud-oromia-tc1-desk-2-1@mor.gov.et', 'Nardos Haile (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc1-desk-2-2', 'u-aud-oromia-tc1-desk-2-2@mor.gov.et', 'Addis Negash (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc1-joint-1', 'u-tl-oromia-tc1-joint-1@mor.gov.et', 'Genet Kebede (JOINT TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc1-joint-1-1', 'u-aud-oromia-tc1-joint-1-1@mor.gov.et', 'Birtukan Zewde (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc1-joint-1-2', 'u-aud-oromia-tc1-joint-1-2@mor.gov.et', 'Genet Bikila (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc1-joint-2', 'u-tl-oromia-tc1-joint-2@mor.gov.et', 'Birtukan Bekele (JOINT TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc1-joint-2-1', 'u-aud-oromia-tc1-joint-2-1@mor.gov.et', 'Eden Desta (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc1-joint-2-2', 'u-aud-oromia-tc1-joint-2-2@mor.gov.et', 'Meseret Kifle (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc1-tp-1', 'u-tl-oromia-tc1-tp-1@mor.gov.et', 'Tewodros Berhane (TP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc1-tp-1-1', 'u-aud-oromia-tc1-tp-1-1@mor.gov.et', 'Rahel Mengistu (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc1-tp-1-2', 'u-aud-oromia-tc1-tp-1-2@mor.gov.et', 'Mulugeta Wakjira (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc1-tp-2', 'u-tl-oromia-tc1-tp-2@mor.gov.et', 'Ruth Wolde (TP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc1-tp-2-1', 'u-aud-oromia-tc1-tp-2-1@mor.gov.et', 'Yodit Gebre (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc1-tp-2-2', 'u-aud-oromia-tc1-tp-2-2@mor.gov.et', 'Natnael Lemma (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc1-comp-1', 'u-tl-oromia-tc1-comp-1@mor.gov.et', 'Chaltu Bikila (COMP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc1-comp-1-1', 'u-aud-oromia-tc1-comp-1-1@mor.gov.et', 'Haile Assefa (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc1-comp-1-2', 'u-aud-oromia-tc1-comp-1-2@mor.gov.et', 'Tekle Tilahun (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc1-comp-2', 'u-tl-oromia-tc1-comp-2@mor.gov.et', 'Fatuma Tesfaye (COMP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc1-comp-2-1', 'u-aud-oromia-tc1-comp-2-1@mor.gov.et', 'Rahel Yohannes (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc1-comp-2-2', 'u-aud-oromia-tc1-comp-2-2@mor.gov.et', 'Mulugeta Hassan (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc1-issue-1', 'u-tl-oromia-tc1-issue-1@mor.gov.et', 'Yodit Wakjira (ISSUE TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc1-issue-1-1', 'u-aud-oromia-tc1-issue-1-1@mor.gov.et', 'Tadesse Mekonnen (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc1-issue-1-2', 'u-aud-oromia-tc1-issue-1-2@mor.gov.et', 'Almaw Kebede (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc1-issue-2', 'u-tl-oromia-tc1-issue-2@mor.gov.et', 'Natnael Banti (ISSUE TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc1-issue-2-1', 'u-aud-oromia-tc1-issue-2-1@mor.gov.et', 'Ruth Mengistu (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc1-issue-2-2', 'u-aud-oromia-tc1-issue-2-2@mor.gov.et', 'Amanuel Wakjira (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tcm-oromia-tc2', 'u-tcm-oromia-tc2@mor.gov.et', 'Tax Center Manager (Oromia Tax Center 2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-oromia-tc2-ja', 'u-com-oromia-tc2-ja@mor.gov.et', 'Joint Committee Chair (Oromia Tax Center 2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-oromia-tc2-tp', 'u-com-oromia-tc2-tp@mor.gov.et', 'TP Committee Chair (Oromia Tax Center 2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc2-desk-1', 'u-tl-oromia-tc2-desk-1@mor.gov.et', 'Solomon Lemma (DESK TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc2-desk-1-1', 'u-aud-oromia-tc2-desk-1-1@mor.gov.et', 'Fatuma Tilahun (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc2-desk-1-2', 'u-aud-oromia-tc2-desk-1-2@mor.gov.et', 'Kassahun Assefa (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc2-desk-2', 'u-tl-oromia-tc2-desk-2@mor.gov.et', 'Bereket Mulugeta (DESK TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc2-desk-2-1', 'u-aud-oromia-tc2-desk-2-1@mor.gov.et', 'Addis Negash (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc2-desk-2-2', 'u-aud-oromia-tc2-desk-2-2@mor.gov.et', 'Kidist Zewde (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc2-joint-1', 'u-tl-oromia-tc2-joint-1@mor.gov.et', 'Eyerusalem Bikila (JOINT TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc2-joint-1-1', 'u-aud-oromia-tc2-joint-1-1@mor.gov.et', 'Tadesse Hassan (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc2-joint-1-2', 'u-aud-oromia-tc2-joint-1-2@mor.gov.et', 'Workneh Yohannes (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc2-joint-2', 'u-tl-oromia-tc2-joint-2@mor.gov.et', 'Michael Zewde (JOINT TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc2-joint-2-1', 'u-aud-oromia-tc2-joint-2-1@mor.gov.et', 'Solomon Tilahun (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc2-joint-2-2', 'u-aud-oromia-tc2-joint-2-2@mor.gov.et', 'Getnet Assefa (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc2-tp-1', 'u-tl-oromia-tc2-tp-1@mor.gov.et', 'Fikremariam Wakjira (TP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc2-tp-1-1', 'u-aud-oromia-tc2-tp-1-1@mor.gov.et', 'Saron Worku (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc2-tp-1-2', 'u-aud-oromia-tc2-tp-1-2@mor.gov.et', 'Fikremariam Kassa (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc2-tp-2', 'u-tl-oromia-tc2-tp-2@mor.gov.et', 'Mesfin Banti (TP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc2-tp-2-1', 'u-aud-oromia-tc2-tp-2-1@mor.gov.et', 'Yosef Kebede (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc2-tp-2-2', 'u-aud-oromia-tc2-tp-2-2@mor.gov.et', 'Bethlehem Bekele (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc2-comp-1', 'u-tl-oromia-tc2-comp-1@mor.gov.et', 'Yosef Tesfaye (COMP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc2-comp-1-1', 'u-aud-oromia-tc2-comp-1-1@mor.gov.et', 'Tekle Tilahun (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc2-comp-1-2', 'u-aud-oromia-tc2-comp-1-2@mor.gov.et', 'Bikila Mekonnen (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc2-comp-2', 'u-tl-oromia-tc2-comp-2@mor.gov.et', 'Bethlehem Bikila (COMP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc2-comp-2-1', 'u-aud-oromia-tc2-comp-2-1@mor.gov.et', 'Mulugeta Hassan (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc2-comp-2-2', 'u-aud-oromia-tc2-comp-2-2@mor.gov.et', 'Diriba Mengistu (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc2-issue-1', 'u-tl-oromia-tc2-issue-1@mor.gov.et', 'Tsega Tadesse (ISSUE TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc2-issue-1-1', 'u-aud-oromia-tc2-issue-1-1@mor.gov.et', 'Yosef Banti (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc2-issue-1-2', 'u-aud-oromia-tc2-issue-1-2@mor.gov.et', 'Eleni Wakjira (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc2-issue-2', 'u-tl-oromia-tc2-issue-2@mor.gov.et', 'Abebe Mamo (ISSUE TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc2-issue-2-1', 'u-aud-oromia-tc2-issue-2-1@mor.gov.et', 'Saron Bekele (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc2-issue-2-2', 'u-aud-oromia-tc2-issue-2-2@mor.gov.et', 'Michael Kebede (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tcm-oromia-tc3', 'u-tcm-oromia-tc3@mor.gov.et', 'Tax Center Manager (Oromia Tax Center 3)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-oromia-tc3-ja', 'u-com-oromia-tc3-ja@mor.gov.et', 'Joint Committee Chair (Oromia Tax Center 3)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-oromia-tc3-tp', 'u-com-oromia-tc3-tp@mor.gov.et', 'TP Committee Chair (Oromia Tax Center 3)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc3-desk-1', 'u-tl-oromia-tc3-desk-1@mor.gov.et', 'Fikremariam Hassan (DESK TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc3-desk-1-1', 'u-aud-oromia-tc3-desk-1-1@mor.gov.et', 'Kassahun Assefa (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc3-desk-1-2', 'u-aud-oromia-tc3-desk-1-2@mor.gov.et', 'Tirhas Girma (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc3-desk-2', 'u-tl-oromia-tc3-desk-2@mor.gov.et', 'Saron Yohannes (DESK TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc3-desk-2-1', 'u-aud-oromia-tc3-desk-2-1@mor.gov.et', 'Kidist Zewde (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc3-desk-2-2', 'u-aud-oromia-tc3-desk-2-2@mor.gov.et', 'Robel Bikila (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc3-joint-1', 'u-tl-oromia-tc3-joint-1@mor.gov.et', 'Mesfin Abera (JOINT TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc3-joint-1-1', 'u-aud-oromia-tc3-joint-1-1@mor.gov.et', 'Tirhas Abera (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc3-joint-1-2', 'u-aud-oromia-tc3-joint-1-2@mor.gov.et', 'Kassahun Gebre (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc3-joint-2', 'u-tl-oromia-tc3-joint-2@mor.gov.et', 'Fikremariam Wolde (JOINT TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc3-joint-2-1', 'u-aud-oromia-tc3-joint-2-1@mor.gov.et', 'Kassa Worku (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc3-joint-2-2', 'u-aud-oromia-tc3-joint-2-2@mor.gov.et', 'Mamo Kassa (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc3-tp-1', 'u-tl-oromia-tc3-tp-1@mor.gov.et', 'Michael Getachew (TP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc3-tp-1-1', 'u-aud-oromia-tc3-tp-1-1@mor.gov.et', 'Bereket Kebede (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc3-tp-1-2', 'u-aud-oromia-tc3-tp-1-2@mor.gov.et', 'Solomon Mekonnen (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc3-tp-2', 'u-tl-oromia-tc3-tp-2@mor.gov.et', 'Saron Mideksa (TP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc3-tp-2-1', 'u-aud-oromia-tc3-tp-2-1@mor.gov.et', 'Seble Worku (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc3-tp-2-2', 'u-aud-oromia-tc3-tp-2-2@mor.gov.et', 'Sara Haile (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc3-comp-1', 'u-tl-oromia-tc3-comp-1@mor.gov.et', 'Seble Mideksa (COMP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc3-comp-1-1', 'u-aud-oromia-tc3-comp-1-1@mor.gov.et', 'Bikila Mekonnen (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc3-comp-1-2', 'u-aud-oromia-tc3-comp-1-2@mor.gov.et', 'Kassa Kebede (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc3-comp-2', 'u-tl-oromia-tc3-comp-2@mor.gov.et', 'Sara Getachew (COMP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc3-comp-2-1', 'u-aud-oromia-tc3-comp-2-1@mor.gov.et', 'Diriba Mengistu (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc3-comp-2-2', 'u-aud-oromia-tc3-comp-2-2@mor.gov.et', 'Tolera Wakjira (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc3-issue-1', 'u-tl-oromia-tc3-issue-1@mor.gov.et', 'Kassahun Bekele (ISSUE TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc3-issue-1-1', 'u-aud-oromia-tc3-issue-1-1@mor.gov.et', 'Michael Desta (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc3-issue-1-2', 'u-aud-oromia-tc3-issue-1-2@mor.gov.et', 'Saron Berhane (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-oromia-tc3-issue-2', 'u-tl-oromia-tc3-issue-2@mor.gov.et', 'Fatuma Alemu (ISSUE TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc3-issue-2-1', 'u-aud-oromia-tc3-issue-2-1@mor.gov.et', 'Eleni Zewde (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-oromia-tc3-issue-2-2', 'u-aud-oromia-tc3-issue-2-2@mor.gov.et', 'Yosef Negash (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tcm-dire_dawa-tc1', 'u-tcm-dire_dawa-tc1@mor.gov.et', 'Tax Center Manager (Dire Dawa Tax Center 1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-dire_dawa-tc1-ja', 'u-com-dire_dawa-tc1-ja@mor.gov.et', 'Joint Committee Chair (Dire Dawa Tax Center 1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-dire_dawa-tc1-tp', 'u-com-dire_dawa-tc1-tp@mor.gov.et', 'TP Committee Chair (Dire Dawa Tax Center 1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc1-desk-1', 'u-tl-dire_dawa-tc1-desk-1@mor.gov.et', 'Michael Kassa (DESK TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc1-desk-1-1', 'u-aud-dire_dawa-tc1-desk-1-1@mor.gov.et', 'Eden Berhane (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc1-desk-1-2', 'u-aud-dire_dawa-tc1-desk-1-2@mor.gov.et', 'Meseret Desta (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc1-desk-2', 'u-tl-dire_dawa-tc1-desk-2@mor.gov.et', 'Saron Mamo (DESK TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc1-desk-2-1', 'u-aud-dire_dawa-tc1-desk-2-1@mor.gov.et', 'Tsega Mideksa (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc1-desk-2-2', 'u-aud-dire_dawa-tc1-desk-2-2@mor.gov.et', 'Abebe Getachew (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc1-joint-1', 'u-tl-dire_dawa-tc1-joint-1@mor.gov.et', 'Birtukan Mamo (JOINT TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc1-joint-1-1', 'u-aud-dire_dawa-tc1-joint-1-1@mor.gov.et', 'Tigist Mekonnen (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc1-joint-1-2', 'u-aud-dire_dawa-tc1-joint-1-2@mor.gov.et', 'Almaz Kebede (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc1-joint-2', 'u-tl-dire_dawa-tc1-joint-2@mor.gov.et', 'Genet Kassa (JOINT TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc1-joint-2-1', 'u-aud-dire_dawa-tc1-joint-2-1@mor.gov.et', 'Fikremariam Mengistu (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc1-joint-2-2', 'u-aud-dire_dawa-tc1-joint-2-2@mor.gov.et', 'Mesfin Wakjira (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc1-tp-1', 'u-tl-dire_dawa-tc1-tp-1@mor.gov.et', 'Yosef Desta (TP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc1-tp-1-1', 'u-aud-dire_dawa-tc1-tp-1-1@mor.gov.et', 'Chaltu Belay (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc1-tp-1-2', 'u-aud-dire_dawa-tc1-tp-1-2@mor.gov.et', 'Yonas Girma (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc1-tp-2', 'u-tl-dire_dawa-tc1-tp-2@mor.gov.et', 'Bethlehem Berhane (TP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc1-tp-2-1', 'u-aud-dire_dawa-tc1-tp-2-1@mor.gov.et', 'Abdi Getachew (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc1-tp-2-2', 'u-aud-dire_dawa-tc1-tp-2-2@mor.gov.et', 'Ephrem Mideksa (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc1-comp-1', 'u-tl-dire_dawa-tc1-comp-1@mor.gov.et', 'Kassa Tadesse (COMP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc1-comp-1-1', 'u-aud-dire_dawa-tc1-comp-1-1@mor.gov.et', 'Saron Abera (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc1-comp-1-2', 'u-aud-dire_dawa-tc1-comp-1-2@mor.gov.et', 'Fikremariam Gebre (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc1-comp-2', 'u-tl-dire_dawa-tc1-comp-2@mor.gov.et', 'Mamo Belay (COMP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc1-comp-2-1', 'u-aud-dire_dawa-tc1-comp-2-1@mor.gov.et', 'Yosef Worku (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc1-comp-2-2', 'u-aud-dire_dawa-tc1-comp-2-2@mor.gov.et', 'Bethlehem Kassa (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc1-issue-1', 'u-tl-dire_dawa-tc1-issue-1@mor.gov.et', 'Bereket Lemma (ISSUE TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc1-issue-1-1', 'u-aud-dire_dawa-tc1-issue-1-1@mor.gov.et', 'Seble Girma (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc1-issue-1-2', 'u-aud-dire_dawa-tc1-issue-1-2@mor.gov.et', 'Henok Assefa (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc1-issue-2', 'u-tl-dire_dawa-tc1-issue-2@mor.gov.et', 'Solomon Gebre (ISSUE TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc1-issue-2-1', 'u-aud-dire_dawa-tc1-issue-2-1@mor.gov.et', 'Bereket Mideksa (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc1-issue-2-2', 'u-aud-dire_dawa-tc1-issue-2-2@mor.gov.et', 'Selam Yohannes (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tcm-dire_dawa-tc2', 'u-tcm-dire_dawa-tc2@mor.gov.et', 'Tax Center Manager (Dire Dawa Tax Center 2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-dire_dawa-tc2-ja', 'u-com-dire_dawa-tc2-ja@mor.gov.et', 'Joint Committee Chair (Dire Dawa Tax Center 2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-dire_dawa-tc2-tp', 'u-com-dire_dawa-tc2-tp@mor.gov.et', 'TP Committee Chair (Dire Dawa Tax Center 2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc2-desk-1', 'u-tl-dire_dawa-tc2-desk-1@mor.gov.et', 'Selam Mekonnen (DESK TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc2-desk-1-1', 'u-aud-dire_dawa-tc2-desk-1-1@mor.gov.et', 'Meseret Desta (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc2-desk-1-2', 'u-aud-dire_dawa-tc2-desk-1-2@mor.gov.et', 'Amanuel Kifle (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc2-desk-2', 'u-tl-dire_dawa-tc2-desk-2@mor.gov.et', 'Bereket Tilahun (DESK TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc2-desk-2-1', 'u-aud-dire_dawa-tc2-desk-2-1@mor.gov.et', 'Abebe Getachew (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc2-desk-2-2', 'u-aud-dire_dawa-tc2-desk-2-2@mor.gov.et', 'Almaw Tesfa (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc2-joint-1', 'u-tl-dire_dawa-tc2-joint-1@mor.gov.et', 'Tolera Alemu (JOINT TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc2-joint-1-1', 'u-aud-dire_dawa-tc2-joint-1-1@mor.gov.et', 'Sara Banti (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc2-joint-1-2', 'u-aud-dire_dawa-tc2-joint-1-2@mor.gov.et', 'Fikadu Wakjira (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc2-joint-2', 'u-tl-dire_dawa-tc2-joint-2@mor.gov.et', 'Mahlet Tesfa (JOINT TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc2-joint-2-1', 'u-aud-dire_dawa-tc2-joint-2-1@mor.gov.et', 'Tewodros Bekele (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc2-joint-2-2', 'u-aud-dire_dawa-tc2-joint-2-2@mor.gov.et', 'Mesfin Kebede (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc2-tp-1', 'u-tl-dire_dawa-tc2-tp-1@mor.gov.et', 'Nardos Mengistu (TP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc2-tp-1-1', 'u-aud-dire_dawa-tc2-tp-1-1@mor.gov.et', 'Meseret Girma (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc2-tp-1-2', 'u-aud-dire_dawa-tc2-tp-1-2@mor.gov.et', 'Amanuel Belay (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc2-tp-2', 'u-tl-dire_dawa-tc2-tp-2@mor.gov.et', 'Eleni Wakjira (TP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc2-tp-2-1', 'u-aud-dire_dawa-tc2-tp-2-1@mor.gov.et', 'Abebe Bikila (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc2-tp-2-2', 'u-aud-dire_dawa-tc2-tp-2-2@mor.gov.et', 'Almaw Tesfaye (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc2-comp-1', 'u-tl-dire_dawa-tc2-comp-1@mor.gov.et', 'Rahel Assefa (COMP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc2-comp-1-1', 'u-aud-dire_dawa-tc2-comp-1-1@mor.gov.et', 'Fikremariam Gebre (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc2-comp-1-2', 'u-aud-dire_dawa-tc2-comp-1-2@mor.gov.et', 'Mesfin Lemma (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc2-comp-2', 'u-tl-dire_dawa-tc2-comp-2@mor.gov.et', 'Berihun Girma (COMP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc2-comp-2-1', 'u-aud-dire_dawa-tc2-comp-2-1@mor.gov.et', 'Bethlehem Kassa (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc2-comp-2-2', 'u-aud-dire_dawa-tc2-comp-2-2@mor.gov.et', 'Fikadu Mamo (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc2-issue-1', 'u-tl-dire_dawa-tc2-issue-1@mor.gov.et', 'Abdi Alemayehu (ISSUE TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc2-issue-1-1', 'u-aud-dire_dawa-tc2-issue-1-1@mor.gov.et', 'Ephrem Desta (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc2-issue-1-2', 'u-aud-dire_dawa-tc2-issue-1-2@mor.gov.et', 'Abdi Kifle (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc2-issue-2', 'u-tl-dire_dawa-tc2-issue-2@mor.gov.et', 'Ephrem Kifle (ISSUE TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc2-issue-2-1', 'u-aud-dire_dawa-tc2-issue-2-1@mor.gov.et', 'Yonas Getachew (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc2-issue-2-2', 'u-aud-dire_dawa-tc2-issue-2-2@mor.gov.et', 'Chaltu Tesfa (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tcm-dire_dawa-tc3', 'u-tcm-dire_dawa-tc3@mor.gov.et', 'Tax Center Manager (Dire Dawa Tax Center 3)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-dire_dawa-tc3-ja', 'u-com-dire_dawa-tc3-ja@mor.gov.et', 'Joint Committee Chair (Dire Dawa Tax Center 3)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-dire_dawa-tc3-tp', 'u-com-dire_dawa-tc3-tp@mor.gov.et', 'TP Committee Chair (Dire Dawa Tax Center 3)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc3-desk-1', 'u-tl-dire_dawa-tc3-desk-1@mor.gov.et', 'Yodit Mengistu (DESK TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc3-desk-1-1', 'u-aud-dire_dawa-tc3-desk-1-1@mor.gov.et', 'Meron Girma (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc3-desk-1-2', 'u-aud-dire_dawa-tc3-desk-1-2@mor.gov.et', 'Dawit Assefa (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc3-desk-2', 'u-tl-dire_dawa-tc3-desk-2@mor.gov.et', 'Natnael Wakjira (DESK TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc3-desk-2-1', 'u-aud-dire_dawa-tc3-desk-2-1@mor.gov.et', 'Tsega Mideksa (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc3-desk-2-2', 'u-aud-dire_dawa-tc3-desk-2-2@mor.gov.et', 'Berihun Yohannes (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc3-joint-1', 'u-tl-dire_dawa-tc3-joint-1@mor.gov.et', 'Ruth Bekele (JOINT TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc3-joint-1-1', 'u-aud-dire_dawa-tc3-joint-1-1@mor.gov.et', 'Tolera Desta (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc3-joint-1-2', 'u-aud-dire_dawa-tc3-joint-1-2@mor.gov.et', 'Mahlet Berhane (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc3-joint-2', 'u-tl-dire_dawa-tc3-joint-2@mor.gov.et', 'Tewodros Kebede (JOINT TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc3-joint-2-1', 'u-aud-dire_dawa-tc3-joint-2-1@mor.gov.et', 'Kidist Zewde (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc3-joint-2-2', 'u-aud-dire_dawa-tc3-joint-2-2@mor.gov.et', 'Addis Negash (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc3-tp-1', 'u-tl-dire_dawa-tc3-tp-1@mor.gov.et', 'Kidist Tesfa (TP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc3-tp-1-1', 'u-aud-dire_dawa-tc3-tp-1-1@mor.gov.et', 'Haile Alemayehu (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc3-tp-1-2', 'u-aud-dire_dawa-tc3-tp-1-2@mor.gov.et', 'Tekle Kifle (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc3-tp-2', 'u-tl-dire_dawa-tc3-tp-2@mor.gov.et', 'Addis Getachew (TP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc3-tp-2-1', 'u-aud-dire_dawa-tc3-tp-2-1@mor.gov.et', 'Rahel Tesfaye (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc3-tp-2-2', 'u-aud-dire_dawa-tc3-tp-2-2@mor.gov.et', 'Mulugeta Bikila (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc3-comp-1', 'u-tl-dire_dawa-tc3-comp-1@mor.gov.et', 'Abebe Banti (COMP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc3-comp-1-1', 'u-aud-dire_dawa-tc3-comp-1-1@mor.gov.et', 'Mesfin Lemma (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc3-comp-1-2', 'u-aud-dire_dawa-tc3-comp-1-2@mor.gov.et', 'Tewodros Mulugeta (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc3-comp-2', 'u-tl-dire_dawa-tc3-comp-2@mor.gov.et', 'Tsega Alemayehu (COMP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc3-comp-2-1', 'u-aud-dire_dawa-tc3-comp-2-1@mor.gov.et', 'Fikadu Mamo (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc3-comp-2-2', 'u-aud-dire_dawa-tc3-comp-2-2@mor.gov.et', 'Sara Tadesse (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc3-issue-1', 'u-tl-dire_dawa-tc3-issue-1@mor.gov.et', 'Bethlehem Kassa (ISSUE TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc3-issue-1-1', 'u-aud-dire_dawa-tc3-issue-1-1@mor.gov.et', 'Yonas Banti (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc3-issue-1-2', 'u-aud-dire_dawa-tc3-issue-1-2@mor.gov.et', 'Ibrahim Alemayehu (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-dire_dawa-tc3-issue-2', 'u-tl-dire_dawa-tc3-issue-2@mor.gov.et', 'Yosef Worku (ISSUE TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc3-issue-2-1', 'u-aud-dire_dawa-tc3-issue-2-1@mor.gov.et', 'Ephrem Mulugeta (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-dire_dawa-tc3-issue-2-2', 'u-aud-dire_dawa-tc3-issue-2-2@mor.gov.et', 'Tigist Tesfaye (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tcm-snnpr-tc1', 'u-tcm-snnpr-tc1@mor.gov.et', 'Tax Center Manager (SNNPR Tax Center 1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-snnpr-tc1-ja', 'u-com-snnpr-tc1-ja@mor.gov.et', 'Joint Committee Chair (SNNPR Tax Center 1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-snnpr-tc1-tp', 'u-com-snnpr-tc1-tp@mor.gov.et', 'TP Committee Chair (SNNPR Tax Center 1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc1-desk-1', 'u-tl-snnpr-tc1-desk-1@mor.gov.et', 'Haile Wolde (DESK TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc1-desk-1-1', 'u-aud-snnpr-tc1-desk-1-1@mor.gov.et', 'Eyerusalem Mamo (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc1-desk-1-2', 'u-aud-snnpr-tc1-desk-1-2@mor.gov.et', 'Mahlet Kassa (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc1-desk-2', 'u-tl-snnpr-tc1-desk-2@mor.gov.et', 'Tekle Abera (DESK TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc1-desk-2-1', 'u-aud-snnpr-tc1-desk-2-1@mor.gov.et', 'Hassen Lemma (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc1-desk-2-2', 'u-aud-snnpr-tc1-desk-2-2@mor.gov.et', 'Mamo Gebre (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc1-joint-1', 'u-tl-snnpr-tc1-joint-1@mor.gov.et', 'Tolera Haile (JOINT TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc1-joint-1-1', 'u-aud-snnpr-tc1-joint-1-1@mor.gov.et', 'Samuel Berhane (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc1-joint-1-2', 'u-aud-snnpr-tc1-joint-1-2@mor.gov.et', 'Eden Desta (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc1-joint-2', 'u-tl-snnpr-tc1-joint-2@mor.gov.et', 'Diriba Negash (JOINT TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc1-joint-2-1', 'u-aud-snnpr-tc1-joint-2-1@mor.gov.et', 'Berihun Mideksa (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc1-joint-2-2', 'u-aud-snnpr-tc1-joint-2-2@mor.gov.et', 'Tsega Getachew (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc1-tp-1', 'u-tl-snnpr-tc1-tp-1@mor.gov.et', 'Almaw Tilahun (TP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc1-tp-1-1', 'u-aud-snnpr-tc1-tp-1-1@mor.gov.et', 'Tirhas Tilahun (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc1-tp-1-2', 'u-aud-snnpr-tc1-tp-1-2@mor.gov.et', 'Mekdes Assefa (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc1-tp-2', 'u-tl-snnpr-tc1-tp-2@mor.gov.et', 'Tadesse Assefa (TP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc1-tp-2-1', 'u-aud-snnpr-tc1-tp-2-1@mor.gov.et', 'Robel Negash (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc1-tp-2-2', 'u-aud-snnpr-tc1-tp-2-2@mor.gov.et', 'Natnael Zewde (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc1-comp-1', 'u-tl-snnpr-tc1-comp-1@mor.gov.et', 'Henok Gebre (COMP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc1-comp-1-1', 'u-aud-snnpr-tc1-comp-1-1@mor.gov.et', 'Getnet Mideksa (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc1-comp-1-2', 'u-aud-snnpr-tc1-comp-1-2@mor.gov.et', 'Gemechu Getachew (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc1-comp-2', 'u-tl-snnpr-tc1-comp-2@mor.gov.et', 'Genet Lemma (COMP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc1-comp-2-1', 'u-aud-snnpr-tc1-comp-2-1@mor.gov.et', 'Fikadu Girma (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc1-comp-2-2', 'u-aud-snnpr-tc1-comp-2-2@mor.gov.et', 'Bethlehem Belay (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc1-issue-1', 'u-tl-snnpr-tc1-issue-1@mor.gov.et', 'Yodit Wolde (ISSUE TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc1-issue-1-1', 'u-aud-snnpr-tc1-issue-1-1@mor.gov.et', 'Bereket Gebre (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc1-issue-1-2', 'u-aud-snnpr-tc1-issue-1-2@mor.gov.et', 'Solomon Abera (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc1-issue-2', 'u-tl-snnpr-tc1-issue-2@mor.gov.et', 'Samuel Berhane (ISSUE TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc1-issue-2-1', 'u-aud-snnpr-tc1-issue-2-1@mor.gov.et', 'Seble Mengistu (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc1-issue-2-2', 'u-aud-snnpr-tc1-issue-2-2@mor.gov.et', 'Sara Hassan (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tcm-snnpr-tc2', 'u-tcm-snnpr-tc2@mor.gov.et', 'Tax Center Manager (SNNPR Tax Center 2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-snnpr-tc2-ja', 'u-com-snnpr-tc2-ja@mor.gov.et', 'Joint Committee Chair (SNNPR Tax Center 2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-snnpr-tc2-tp', 'u-com-snnpr-tc2-tp@mor.gov.et', 'TP Committee Chair (SNNPR Tax Center 2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc2-desk-1', 'u-tl-snnpr-tc2-desk-1@mor.gov.et', 'Tolera Banti (DESK TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc2-desk-1-1', 'u-aud-snnpr-tc2-desk-1-1@mor.gov.et', 'Mahlet Kassa (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc2-desk-1-2', 'u-aud-snnpr-tc2-desk-1-2@mor.gov.et', 'Tolera Worku (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc2-desk-2', 'u-tl-snnpr-tc2-desk-2@mor.gov.et', 'Diriba Wakjira (DESK TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc2-desk-2-1', 'u-aud-snnpr-tc2-desk-2-1@mor.gov.et', 'Mamo Gebre (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc2-desk-2-2', 'u-aud-snnpr-tc2-desk-2-2@mor.gov.et', 'Kassa Abera (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc2-joint-1', 'u-tl-snnpr-tc2-joint-1@mor.gov.et', 'Birtukan Mideksa (JOINT TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc2-joint-1-1', 'u-aud-snnpr-tc2-joint-1-1@mor.gov.et', 'Eden Wakjira (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc2-joint-1-2', 'u-aud-snnpr-tc2-joint-1-2@mor.gov.et', 'Samuel Banti (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc2-joint-2', 'u-tl-snnpr-tc2-joint-2@mor.gov.et', 'Lalisa Yohannes (JOINT TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc2-joint-2-1', 'u-aud-snnpr-tc2-joint-2-1@mor.gov.et', 'Birtukan Lemma (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc2-joint-2-2', 'u-aud-snnpr-tc2-joint-2-2@mor.gov.et', 'Lalisa Mulugeta (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc2-tp-1', 'u-tl-snnpr-tc2-tp-1@mor.gov.et', 'Tsega Tesfa (TP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc2-tp-1-1', 'u-aud-snnpr-tc2-tp-1-1@mor.gov.et', 'Sara Wakjira (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc2-tp-1-2', 'u-aud-snnpr-tc2-tp-1-2@mor.gov.et', 'Seble Banti (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc2-tp-2', 'u-tl-snnpr-tc2-tp-2@mor.gov.et', 'Abebe Alemu (TP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc2-tp-2-1', 'u-aud-snnpr-tc2-tp-2-1@mor.gov.et', 'Solomon Lemma (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc2-tp-2-2', 'u-aud-snnpr-tc2-tp-2-2@mor.gov.et', 'Bereket Mulugeta (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc2-comp-1', 'u-tl-snnpr-tc2-comp-1@mor.gov.et', 'Eleni Mengistu (COMP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc2-comp-1-1', 'u-aud-snnpr-tc2-comp-1-1@mor.gov.et', 'Natnael Getachew (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc2-comp-1-2', 'u-aud-snnpr-tc2-comp-1-2@mor.gov.et', 'Robel Mideksa (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc2-comp-2', 'u-tl-snnpr-tc2-comp-2@mor.gov.et', 'Nardos Hassan (COMP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc2-comp-2-1', 'u-aud-snnpr-tc2-comp-2-1@mor.gov.et', 'Mekdes Desta (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc2-comp-2-2', 'u-aud-snnpr-tc2-comp-2-2@mor.gov.et', 'Tirhas Berhane (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc2-issue-1', 'u-tl-snnpr-tc2-issue-1@mor.gov.et', 'Natnael Berhane (ISSUE TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc2-issue-1-1', 'u-aud-snnpr-tc2-issue-1-1@mor.gov.et', 'Bikila Yohannes (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc2-issue-1-2', 'u-aud-snnpr-tc2-issue-1-2@mor.gov.et', 'Kassa Hassan (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc2-issue-2', 'u-tl-snnpr-tc2-issue-2@mor.gov.et', 'Robel Wolde (ISSUE TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc2-issue-2-1', 'u-aud-snnpr-tc2-issue-2-1@mor.gov.et', 'Diriba Wolde (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc2-issue-2-2', 'u-aud-snnpr-tc2-issue-2-2@mor.gov.et', 'Tolera Abera (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tcm-snnpr-tc3', 'u-tcm-snnpr-tc3@mor.gov.et', 'Tax Center Manager (SNNPR Tax Center 3)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-snnpr-tc3-ja', 'u-com-snnpr-tc3-ja@mor.gov.et', 'Joint Committee Chair (SNNPR Tax Center 3)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-snnpr-tc3-tp', 'u-com-snnpr-tc3-tp@mor.gov.et', 'TP Committee Chair (SNNPR Tax Center 3)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc3-desk-1', 'u-tl-snnpr-tc3-desk-1@mor.gov.et', 'Almaw Mamo (DESK TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc3-desk-1-1', 'u-aud-snnpr-tc3-desk-1-1@mor.gov.et', 'Tolera Worku (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc3-desk-1-2', 'u-aud-snnpr-tc3-desk-1-2@mor.gov.et', 'Diriba Haile (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc3-desk-2', 'u-tl-snnpr-tc3-desk-2@mor.gov.et', 'Tadesse Kassa (DESK TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc3-desk-2-1', 'u-aud-snnpr-tc3-desk-2-1@mor.gov.et', 'Kassa Abera (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc3-desk-2-2', 'u-aud-snnpr-tc3-desk-2-2@mor.gov.et', 'Bikila Wolde (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc3-joint-1', 'u-tl-snnpr-tc3-joint-1@mor.gov.et', 'Michael Kassa (JOINT TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc3-joint-1-1', 'u-aud-snnpr-tc3-joint-1-1@mor.gov.et', 'Mahlet Kebede (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc3-joint-1-2', 'u-aud-snnpr-tc3-joint-1-2@mor.gov.et', 'Tolera Mekonnen (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc3-joint-2', 'u-tl-snnpr-tc3-joint-2@mor.gov.et', 'Saron Mamo (JOINT TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc3-joint-2-1', 'u-aud-snnpr-tc3-joint-2-1@mor.gov.et', 'Mamo Worku (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc3-joint-2-2', 'u-aud-snnpr-tc3-joint-2-2@mor.gov.et', 'Kassa Haile (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc3-tp-1', 'u-tl-snnpr-tc3-tp-1@mor.gov.et', 'Rahel Mengistu (TP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc3-tp-1-1', 'u-aud-snnpr-tc3-tp-1-1@mor.gov.et', 'Bethlehem Abera (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc3-tp-1-2', 'u-aud-snnpr-tc3-tp-1-2@mor.gov.et', 'Yosef Wolde (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc3-tp-2', 'u-tl-snnpr-tc3-tp-2@mor.gov.et', 'Berihun Hassan (TP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc3-tp-2-1', 'u-aud-snnpr-tc3-tp-2-1@mor.gov.et', 'Fikremariam Hassan (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc3-tp-2-2', 'u-aud-snnpr-tc3-tp-2-2@mor.gov.et', 'Saron Yohannes (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc3-comp-1', 'u-tl-snnpr-tc3-comp-1@mor.gov.et', 'Samuel Worku (COMP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc3-comp-1-1', 'u-aud-snnpr-tc3-comp-1-1@mor.gov.et', 'Robel Mideksa (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc3-comp-1-2', 'u-aud-snnpr-tc3-comp-1-2@mor.gov.et', 'Kidist Yohannes (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc3-comp-2', 'u-tl-snnpr-tc3-comp-2@mor.gov.et', 'Eden Haile (COMP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc3-comp-2-1', 'u-aud-snnpr-tc3-comp-2-1@mor.gov.et', 'Tirhas Berhane (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc3-comp-2-2', 'u-aud-snnpr-tc3-comp-2-2@mor.gov.et', 'Kassahun Wolde (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc3-issue-1', 'u-tl-snnpr-tc3-issue-1@mor.gov.et', 'Abebe Negash (ISSUE TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc3-issue-1-1', 'u-aud-snnpr-tc3-issue-1-1@mor.gov.et', 'Nardos Bikila (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc3-issue-1-2', 'u-aud-snnpr-tc3-issue-1-2@mor.gov.et', 'Eleni Zewde (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-snnpr-tc3-issue-2', 'u-tl-snnpr-tc3-issue-2@mor.gov.et', 'Almaw Zewde (ISSUE TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc3-issue-2-1', 'u-aud-snnpr-tc3-issue-2-1@mor.gov.et', 'Chaltu Girma (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-snnpr-tc3-issue-2-2', 'u-aud-snnpr-tc3-issue-2-2@mor.gov.et', 'Yonas Assefa (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tcm-somali-tc1', 'u-tcm-somali-tc1@mor.gov.et', 'Tax Center Manager (Somali Tax Center 1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-somali-tc1-ja', 'u-com-somali-tc1-ja@mor.gov.et', 'Joint Committee Chair (Somali Tax Center 1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-somali-tc1-tp', 'u-com-somali-tc1-tp@mor.gov.et', 'TP Committee Chair (Somali Tax Center 1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc1-desk-1', 'u-tl-somali-tc1-desk-1@mor.gov.et', 'Workneh Alemayehu (DESK TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc1-desk-1-1', 'u-aud-somali-tc1-desk-1-1@mor.gov.et', 'Haile Mideksa (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc1-desk-1-2', 'u-aud-somali-tc1-desk-1-2@mor.gov.et', 'Tekle Yohannes (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc1-desk-2', 'u-tl-somali-tc1-desk-2@mor.gov.et', 'Tadesse Kifle (DESK TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc1-desk-2-1', 'u-aud-somali-tc1-desk-2-1@mor.gov.et', 'Rahel Berhane (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc1-desk-2-2', 'u-aud-somali-tc1-desk-2-2@mor.gov.et', 'Mulugeta Wolde (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc1-joint-1', 'u-tl-somali-tc1-joint-1@mor.gov.et', 'Addis Tilahun (JOINT TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc1-joint-1-1', 'u-aud-somali-tc1-joint-1-1@mor.gov.et', 'Diriba Tesfaye (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc1-joint-1-2', 'u-aud-somali-tc1-joint-1-2@mor.gov.et', 'Tolera Bikila (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc1-joint-2', 'u-tl-somali-tc1-joint-2@mor.gov.et', 'Kidist Assefa (JOINT TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc1-joint-2-1', 'u-aud-somali-tc1-joint-2-1@mor.gov.et', 'Robel Belay (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc1-joint-2-2', 'u-aud-somali-tc1-joint-2-2@mor.gov.et', 'Kidist Girma (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc1-tp-1', 'u-tl-somali-tc1-tp-1@mor.gov.et', 'Tigist Haile (TP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc1-tp-1-1', 'u-aud-somali-tc1-tp-1-1@mor.gov.et', 'Eleni Lemma (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc1-tp-1-2', 'u-aud-somali-tc1-tp-1-2@mor.gov.et', 'Yosef Mulugeta (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc1-tp-2', 'u-tl-somali-tc1-tp-2@mor.gov.et', 'Ephrem Negash (TP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc1-tp-2-1', 'u-aud-somali-tc1-tp-2-1@mor.gov.et', 'Yonas Mamo (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc1-tp-2-2', 'u-aud-somali-tc1-tp-2-2@mor.gov.et', 'Ibrahim Tadesse (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc1-comp-1', 'u-tl-somali-tc1-comp-1@mor.gov.et', 'Yonas Desta (COMP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc1-comp-1-1', 'u-aud-somali-tc1-comp-1-1@mor.gov.et', 'Ruth Mamo (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc1-comp-1-2', 'u-aud-somali-tc1-comp-1-2@mor.gov.et', 'Amanuel Tadesse (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc1-comp-2', 'u-tl-somali-tc1-comp-2@mor.gov.et', 'Ibrahim Berhane (COMP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc1-comp-2-1', 'u-aud-somali-tc1-comp-2-1@mor.gov.et', 'Seble Alemu (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc1-comp-2-2', 'u-aud-somali-tc1-comp-2-2@mor.gov.et', 'Henok Tesfa (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc1-issue-1', 'u-tl-somali-tc1-issue-1@mor.gov.et', 'Mekdes Negash (ISSUE TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc1-issue-1-1', 'u-aud-somali-tc1-issue-1-1@mor.gov.et', 'Chaltu Gebre (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc1-issue-1-2', 'u-aud-somali-tc1-issue-1-2@mor.gov.et', 'Yonas Lemma (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc1-issue-2', 'u-tl-somali-tc1-issue-2@mor.gov.et', 'Dereje Zewde (ISSUE TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc1-issue-2-1', 'u-aud-somali-tc1-issue-2-1@mor.gov.et', 'Abdi Kassa (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc1-issue-2-2', 'u-aud-somali-tc1-issue-2-2@mor.gov.et', 'Ephrem Mamo (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tcm-somali-tc2', 'u-tcm-somali-tc2@mor.gov.et', 'Tax Center Manager (Somali Tax Center 2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-somali-tc2-ja', 'u-com-somali-tc2-ja@mor.gov.et', 'Joint Committee Chair (Somali Tax Center 2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-somali-tc2-tp', 'u-com-somali-tc2-tp@mor.gov.et', 'TP Committee Chair (Somali Tax Center 2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc2-desk-1', 'u-tl-somali-tc2-desk-1@mor.gov.et', 'Almaz Berhane (DESK TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc2-desk-1-1', 'u-aud-somali-tc2-desk-1-1@mor.gov.et', 'Tekle Yohannes (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc2-desk-1-2', 'u-aud-somali-tc2-desk-1-2@mor.gov.et', 'Bikila Hassan (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc2-desk-2', 'u-tl-somali-tc2-desk-2@mor.gov.et', 'Tigist Desta (DESK TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc2-desk-2-1', 'u-aud-somali-tc2-desk-2-1@mor.gov.et', 'Mulugeta Wolde (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc2-desk-2-2', 'u-aud-somali-tc2-desk-2-2@mor.gov.et', 'Diriba Abera (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc2-joint-1', 'u-tl-somali-tc2-joint-1@mor.gov.et', 'Meseret Assefa (JOINT TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc2-joint-1-1', 'u-aud-somali-tc2-joint-1-1@mor.gov.et', 'Yodit Negash (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc2-joint-1-2', 'u-aud-somali-tc2-joint-1-2@mor.gov.et', 'Samuel Zewde (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc2-joint-2', 'u-tl-somali-tc2-joint-2@mor.gov.et', 'Eden Tilahun (JOINT TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc2-joint-2-1', 'u-aud-somali-tc2-joint-2-1@mor.gov.et', 'Rahel Berhane (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc2-joint-2-2', 'u-aud-somali-tc2-joint-2-2@mor.gov.et', 'Berihun Desta (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc2-tp-1', 'u-tl-somali-tc2-tp-1@mor.gov.et', 'Workneh Belay (TP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc2-tp-1-1', 'u-aud-somali-tc2-tp-1-1@mor.gov.et', 'Henok Hassan (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc2-tp-1-2', 'u-aud-somali-tc2-tp-1-2@mor.gov.et', 'Seble Yohannes (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc2-tp-2', 'u-tl-somali-tc2-tp-2@mor.gov.et', 'Almaz Tadesse (TP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc2-tp-2-1', 'u-aud-somali-tc2-tp-2-1@mor.gov.et', 'Amanuel Tilahun (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc2-tp-2-2', 'u-aud-somali-tc2-tp-2-2@mor.gov.et', 'Ruth Assefa (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc2-comp-1', 'u-tl-somali-tc2-comp-1@mor.gov.et', 'Amanuel Kifle (COMP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc2-comp-1-1', 'u-aud-somali-tc2-comp-1-1@mor.gov.et', 'Amanuel Tadesse (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc2-comp-1-2', 'u-aud-somali-tc2-comp-1-2@mor.gov.et', 'Meseret Belay (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc2-comp-2', 'u-tl-somali-tc2-comp-2@mor.gov.et', 'Ruth Alemayehu (COMP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc2-comp-2-1', 'u-aud-somali-tc2-comp-2-1@mor.gov.et', 'Henok Tesfa (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc2-comp-2-2', 'u-aud-somali-tc2-comp-2-2@mor.gov.et', 'Genet Getachew (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc2-issue-1', 'u-tl-somali-tc2-issue-1@mor.gov.et', 'Rahel Yohannes (ISSUE TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc2-issue-1-1', 'u-aud-somali-tc2-issue-1-1@mor.gov.et', 'Mesfin Tilahun (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc2-issue-1-2', 'u-aud-somali-tc2-issue-1-2@mor.gov.et', 'Tewodros Mekonnen (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc2-issue-2', 'u-tl-somali-tc2-issue-2@mor.gov.et', 'Mulugeta Hassan (ISSUE TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc2-issue-2-1', 'u-aud-somali-tc2-issue-2-1@mor.gov.et', 'Fikadu Hassan (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc2-issue-2-2', 'u-aud-somali-tc2-issue-2-2@mor.gov.et', 'Sara Mengistu (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tcm-somali-tc3', 'u-tcm-somali-tc3@mor.gov.et', 'Tax Center Manager (Somali Tax Center 3)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-somali-tc3-ja', 'u-com-somali-tc3-ja@mor.gov.et', 'Joint Committee Chair (Somali Tax Center 3)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-com-somali-tc3-tp', 'u-com-somali-tc3-tp@mor.gov.et', 'TP Committee Chair (Somali Tax Center 3)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc3-desk-1', 'u-tl-somali-tc3-desk-1@mor.gov.et', 'Mahlet Mamo (DESK TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc3-desk-1-1', 'u-aud-somali-tc3-desk-1-1@mor.gov.et', 'Bikila Hassan (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc3-desk-1-2', 'u-aud-somali-tc3-desk-1-2@mor.gov.et', 'Kassa Mengistu (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc3-desk-2', 'u-tl-somali-tc3-desk-2@mor.gov.et', 'Eyerusalem Tadesse (DESK TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc3-desk-2-1', 'u-aud-somali-tc3-desk-2-1@mor.gov.et', 'Diriba Abera (DESK Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc3-desk-2-2', 'u-aud-somali-tc3-desk-2-2@mor.gov.et', 'Tolera Gebre (DESK Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc3-joint-1', 'u-tl-somali-tc3-joint-1@mor.gov.et', 'Mulugeta Yohannes (JOINT TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc3-joint-1-1', 'u-aud-somali-tc3-joint-1-1@mor.gov.et', 'Meseret Kebede (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc3-joint-1-2', 'u-aud-somali-tc3-joint-1-2@mor.gov.et', 'Eden Bekele (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc3-joint-2', 'u-tl-somali-tc3-joint-2@mor.gov.et', 'Rahel Mideksa (JOINT TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc3-joint-2-1', 'u-aud-somali-tc3-joint-2-1@mor.gov.et', 'Genet Wakjira (JOINT Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc3-joint-2-2', 'u-aud-somali-tc3-joint-2-2@mor.gov.et', 'Birtukan Banti (JOINT Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc3-tp-1', 'u-tl-somali-tc3-tp-1@mor.gov.et', 'Almaw Kebede (TP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc3-tp-1-1', 'u-aud-somali-tc3-tp-1-1@mor.gov.et', 'Dereje Kebede (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc3-tp-1-2', 'u-aud-somali-tc3-tp-1-2@mor.gov.et', 'Mekdes Bekele (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc3-tp-2', 'u-tl-somali-tc3-tp-2@mor.gov.et', 'Tadesse Mekonnen (TP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc3-tp-2-1', 'u-aud-somali-tc3-tp-2-1@mor.gov.et', 'Tekle Wakjira (TP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc3-tp-2-2', 'u-aud-somali-tc3-tp-2-2@mor.gov.et', 'Bikila Banti (TP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc3-comp-1', 'u-tl-somali-tc3-comp-1@mor.gov.et', 'Tekle Belay (COMP TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc3-comp-1-1', 'u-aud-somali-tc3-comp-1-1@mor.gov.et', 'Meseret Belay (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc3-comp-1-2', 'u-aud-somali-tc3-comp-1-2@mor.gov.et', 'Eden Girma (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc3-comp-2', 'u-tl-somali-tc3-comp-2@mor.gov.et', 'Bikila Girma (COMP TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc3-comp-2-1', 'u-aud-somali-tc3-comp-2-1@mor.gov.et', 'Genet Getachew (COMP Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc3-comp-2-2', 'u-aud-somali-tc3-comp-2-2@mor.gov.et', 'Birtukan Mideksa (COMP Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc3-issue-1', 'u-tl-somali-tc3-issue-1@mor.gov.et', 'Eden Assefa (ISSUE TL-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc3-issue-1-1', 'u-aud-somali-tc3-issue-1-1@mor.gov.et', 'Mesfin Alemayehu (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc3-issue-1-2', 'u-aud-somali-tc3-issue-1-2@mor.gov.et', 'Fikremariam Banti (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-tl-somali-tc3-issue-2', 'u-tl-somali-tc3-issue-2@mor.gov.et', 'Meseret Girma (ISSUE TL-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc3-issue-2-1', 'u-aud-somali-tc3-issue-2-1@mor.gov.et', 'Almaz Alemu (ISSUE Aud-1)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
INSERT INTO users (username, email, full_name, is_active) VALUES ('u-aud-somali-tc3-issue-2-2', 'u-aud-somali-tc3-issue-2-2@mor.gov.et', 'Tigist Bekele (ISSUE Aud-2)', TRUE) ON CONFLICT (username) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;

-- 7. Map User Roles
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-pt-01'), (SELECT id FROM roles WHERE code = 'PLANNING_TEAM')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-pt-02'), (SELECT id FROM roles WHERE code = 'PLANNING_TEAM')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-pt-03'), (SELECT id FROM roles WHERE code = 'PLANNING_TEAM')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-ad-01'), (SELECT id FROM roles WHERE code = 'DIRECTOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-ad-02'), (SELECT id FROM roles WHERE code = 'DIRECTOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-sm-01'), (SELECT id FROM roles WHERE code = 'SENIOR_MANAGEMENT')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-sm-02'), (SELECT id FROM roles WHERE code = 'SENIOR_MANAGEMENT')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-fed-chair'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-fed-mem1'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-fed-mem2'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-fed-tpchair'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-fed-tpmem1'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-fed-tpmem2'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-fed-deskchair'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-fed-deskmem1'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-fed-compchair'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-fed-compmem1'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-fed-issuechair'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-fed-issuemem1'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-req-01'), (SELECT id FROM roles WHERE code = 'AUDIT_REQUESTER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-req-02'), (SELECT id FROM roles WHERE code = 'AUDIT_REQUESTER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-req-03'), (SELECT id FROM roles WHERE code = 'AUDIT_REQUESTER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-req-04'), (SELECT id FROM roles WHERE code = 'AUDIT_REQUESTER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-rd-fed'), (SELECT id FROM roles WHERE code = 'REGIONAL_DIRECTOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-rd-aa'), (SELECT id FROM roles WHERE code = 'REGIONAL_DIRECTOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-rd-am'), (SELECT id FROM roles WHERE code = 'REGIONAL_DIRECTOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-rd-or'), (SELECT id FROM roles WHERE code = 'REGIONAL_DIRECTOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-rd-dd'), (SELECT id FROM roles WHERE code = 'REGIONAL_DIRECTOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-rd-sn'), (SELECT id FROM roles WHERE code = 'REGIONAL_DIRECTOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-rd-so'), (SELECT id FROM roles WHERE code = 'REGIONAL_DIRECTOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tcm-federal-lto1'), (SELECT id FROM roles WHERE code = 'TAX_CENTER_MANAGER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-federal-lto1-ja'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-federal-lto1-tp'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-federal-lto1-desk-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto1-desk-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto1-desk-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-federal-lto1-desk-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto1-desk-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto1-desk-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-federal-lto1-joint-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto1-joint-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto1-joint-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-federal-lto1-joint-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto1-joint-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto1-joint-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-federal-lto1-tp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto1-tp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto1-tp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-federal-lto1-tp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto1-tp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto1-tp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-federal-lto1-comp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto1-comp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto1-comp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-federal-lto1-comp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto1-comp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto1-comp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-federal-lto1-issue-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto1-issue-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto1-issue-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-federal-lto1-issue-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto1-issue-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto1-issue-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tcm-federal-lto2'), (SELECT id FROM roles WHERE code = 'TAX_CENTER_MANAGER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-federal-lto2-ja'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-federal-lto2-tp'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-federal-lto2-desk-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto2-desk-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto2-desk-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-federal-lto2-desk-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto2-desk-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto2-desk-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-federal-lto2-joint-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto2-joint-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto2-joint-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-federal-lto2-joint-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto2-joint-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto2-joint-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-federal-lto2-tp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto2-tp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto2-tp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-federal-lto2-tp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto2-tp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto2-tp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-federal-lto2-comp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto2-comp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto2-comp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-federal-lto2-comp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto2-comp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto2-comp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-federal-lto2-issue-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto2-issue-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto2-issue-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-federal-lto2-issue-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto2-issue-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-federal-lto2-issue-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tcm-addis_ababa-tc1'), (SELECT id FROM roles WHERE code = 'TAX_CENTER_MANAGER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-addis_ababa-tc1-ja'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-addis_ababa-tc1-tp'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc1-desk-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-desk-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-desk-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc1-desk-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-desk-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-desk-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc1-joint-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-joint-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-joint-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc1-joint-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-joint-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-joint-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc1-tp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-tp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-tp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc1-tp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-tp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-tp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc1-comp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-comp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-comp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc1-comp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-comp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-comp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc1-issue-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-issue-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-issue-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc1-issue-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-issue-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-issue-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tcm-addis_ababa-tc2'), (SELECT id FROM roles WHERE code = 'TAX_CENTER_MANAGER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-addis_ababa-tc2-ja'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-addis_ababa-tc2-tp'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc2-desk-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-desk-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-desk-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc2-desk-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-desk-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-desk-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc2-joint-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-joint-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-joint-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc2-joint-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-joint-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-joint-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc2-tp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-tp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-tp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc2-tp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-tp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-tp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc2-comp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-comp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-comp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc2-comp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-comp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-comp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc2-issue-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-issue-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-issue-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc2-issue-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-issue-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-issue-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tcm-addis_ababa-tc3'), (SELECT id FROM roles WHERE code = 'TAX_CENTER_MANAGER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-addis_ababa-tc3-ja'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-addis_ababa-tc3-tp'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc3-desk-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-desk-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-desk-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc3-desk-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-desk-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-desk-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc3-joint-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-joint-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-joint-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc3-joint-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-joint-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-joint-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc3-tp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-tp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-tp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc3-tp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-tp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-tp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc3-comp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-comp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-comp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc3-comp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-comp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-comp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc3-issue-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-issue-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-issue-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc3-issue-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-issue-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-issue-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tcm-amhara-tc1'), (SELECT id FROM roles WHERE code = 'TAX_CENTER_MANAGER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-amhara-tc1-ja'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-amhara-tc1-tp'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc1-desk-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-desk-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-desk-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc1-desk-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-desk-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-desk-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc1-joint-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-joint-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-joint-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc1-joint-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-joint-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-joint-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc1-tp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-tp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-tp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc1-tp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-tp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-tp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc1-comp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-comp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-comp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc1-comp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-comp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-comp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc1-issue-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-issue-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-issue-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc1-issue-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-issue-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-issue-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tcm-amhara-tc2'), (SELECT id FROM roles WHERE code = 'TAX_CENTER_MANAGER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-amhara-tc2-ja'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-amhara-tc2-tp'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc2-desk-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-desk-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-desk-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc2-desk-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-desk-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-desk-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc2-joint-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-joint-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-joint-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc2-joint-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-joint-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-joint-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc2-tp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-tp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-tp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc2-tp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-tp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-tp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc2-comp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-comp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-comp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc2-comp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-comp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-comp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc2-issue-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-issue-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-issue-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc2-issue-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-issue-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-issue-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tcm-amhara-tc3'), (SELECT id FROM roles WHERE code = 'TAX_CENTER_MANAGER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-amhara-tc3-ja'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-amhara-tc3-tp'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc3-desk-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-desk-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-desk-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc3-desk-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-desk-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-desk-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc3-joint-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-joint-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-joint-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc3-joint-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-joint-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-joint-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc3-tp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-tp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-tp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc3-tp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-tp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-tp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc3-comp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-comp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-comp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc3-comp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-comp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-comp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc3-issue-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-issue-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-issue-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-amhara-tc3-issue-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-issue-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-issue-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tcm-oromia-tc1'), (SELECT id FROM roles WHERE code = 'TAX_CENTER_MANAGER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-oromia-tc1-ja'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-oromia-tc1-tp'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc1-desk-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-desk-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-desk-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc1-desk-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-desk-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-desk-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc1-joint-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-joint-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-joint-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc1-joint-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-joint-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-joint-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc1-tp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-tp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-tp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc1-tp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-tp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-tp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc1-comp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-comp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-comp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc1-comp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-comp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-comp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc1-issue-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-issue-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-issue-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc1-issue-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-issue-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-issue-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tcm-oromia-tc2'), (SELECT id FROM roles WHERE code = 'TAX_CENTER_MANAGER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-oromia-tc2-ja'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-oromia-tc2-tp'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc2-desk-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-desk-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-desk-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc2-desk-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-desk-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-desk-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc2-joint-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-joint-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-joint-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc2-joint-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-joint-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-joint-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc2-tp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-tp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-tp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc2-tp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-tp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-tp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc2-comp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-comp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-comp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc2-comp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-comp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-comp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc2-issue-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-issue-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-issue-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc2-issue-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-issue-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-issue-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tcm-oromia-tc3'), (SELECT id FROM roles WHERE code = 'TAX_CENTER_MANAGER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-oromia-tc3-ja'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-oromia-tc3-tp'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc3-desk-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-desk-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-desk-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc3-desk-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-desk-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-desk-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc3-joint-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-joint-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-joint-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc3-joint-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-joint-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-joint-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc3-tp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-tp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-tp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc3-tp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-tp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-tp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc3-comp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-comp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-comp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc3-comp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-comp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-comp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc3-issue-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-issue-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-issue-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-oromia-tc3-issue-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-issue-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-issue-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tcm-dire_dawa-tc1'), (SELECT id FROM roles WHERE code = 'TAX_CENTER_MANAGER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-dire_dawa-tc1-ja'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-dire_dawa-tc1-tp'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc1-desk-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-desk-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-desk-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc1-desk-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-desk-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-desk-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc1-joint-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-joint-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-joint-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc1-joint-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-joint-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-joint-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc1-tp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-tp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-tp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc1-tp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-tp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-tp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc1-comp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-comp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-comp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc1-comp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-comp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-comp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc1-issue-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-issue-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-issue-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc1-issue-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-issue-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-issue-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tcm-dire_dawa-tc2'), (SELECT id FROM roles WHERE code = 'TAX_CENTER_MANAGER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-dire_dawa-tc2-ja'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-dire_dawa-tc2-tp'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc2-desk-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-desk-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-desk-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc2-desk-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-desk-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-desk-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc2-joint-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-joint-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-joint-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc2-joint-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-joint-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-joint-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc2-tp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-tp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-tp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc2-tp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-tp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-tp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc2-comp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-comp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-comp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc2-comp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-comp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-comp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc2-issue-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-issue-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-issue-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc2-issue-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-issue-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-issue-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tcm-dire_dawa-tc3'), (SELECT id FROM roles WHERE code = 'TAX_CENTER_MANAGER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-dire_dawa-tc3-ja'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-dire_dawa-tc3-tp'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc3-desk-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-desk-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-desk-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc3-desk-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-desk-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-desk-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc3-joint-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-joint-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-joint-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc3-joint-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-joint-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-joint-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc3-tp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-tp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-tp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc3-tp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-tp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-tp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc3-comp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-comp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-comp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc3-comp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-comp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-comp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc3-issue-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-issue-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-issue-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc3-issue-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-issue-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-issue-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tcm-snnpr-tc1'), (SELECT id FROM roles WHERE code = 'TAX_CENTER_MANAGER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-snnpr-tc1-ja'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-snnpr-tc1-tp'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc1-desk-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-desk-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-desk-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc1-desk-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-desk-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-desk-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc1-joint-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-joint-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-joint-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc1-joint-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-joint-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-joint-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc1-tp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-tp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-tp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc1-tp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-tp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-tp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc1-comp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-comp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-comp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc1-comp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-comp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-comp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc1-issue-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-issue-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-issue-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc1-issue-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-issue-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-issue-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tcm-snnpr-tc2'), (SELECT id FROM roles WHERE code = 'TAX_CENTER_MANAGER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-snnpr-tc2-ja'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-snnpr-tc2-tp'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc2-desk-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-desk-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-desk-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc2-desk-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-desk-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-desk-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc2-joint-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-joint-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-joint-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc2-joint-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-joint-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-joint-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc2-tp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-tp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-tp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc2-tp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-tp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-tp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc2-comp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-comp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-comp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc2-comp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-comp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-comp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc2-issue-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-issue-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-issue-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc2-issue-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-issue-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-issue-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tcm-snnpr-tc3'), (SELECT id FROM roles WHERE code = 'TAX_CENTER_MANAGER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-snnpr-tc3-ja'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-snnpr-tc3-tp'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc3-desk-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-desk-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-desk-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc3-desk-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-desk-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-desk-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc3-joint-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-joint-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-joint-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc3-joint-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-joint-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-joint-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc3-tp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-tp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-tp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc3-tp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-tp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-tp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc3-comp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-comp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-comp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc3-comp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-comp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-comp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc3-issue-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-issue-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-issue-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-snnpr-tc3-issue-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-issue-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-issue-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tcm-somali-tc1'), (SELECT id FROM roles WHERE code = 'TAX_CENTER_MANAGER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-somali-tc1-ja'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-somali-tc1-tp'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc1-desk-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc1-desk-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc1-desk-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc1-desk-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc1-desk-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc1-desk-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc1-joint-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc1-joint-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc1-joint-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc1-joint-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc1-joint-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc1-joint-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc1-tp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc1-tp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc1-tp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc1-tp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc1-tp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc1-tp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc1-comp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc1-comp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc1-comp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc1-comp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc1-comp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc1-comp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc1-issue-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc1-issue-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc1-issue-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc1-issue-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc1-issue-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc1-issue-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tcm-somali-tc2'), (SELECT id FROM roles WHERE code = 'TAX_CENTER_MANAGER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-somali-tc2-ja'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-somali-tc2-tp'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc2-desk-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc2-desk-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc2-desk-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc2-desk-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc2-desk-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc2-desk-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc2-joint-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc2-joint-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc2-joint-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc2-joint-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc2-joint-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc2-joint-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc2-tp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc2-tp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc2-tp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc2-tp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc2-tp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc2-tp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc2-comp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc2-comp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc2-comp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc2-comp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc2-comp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc2-comp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc2-issue-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc2-issue-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc2-issue-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc2-issue-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc2-issue-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc2-issue-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tcm-somali-tc3'), (SELECT id FROM roles WHERE code = 'TAX_CENTER_MANAGER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-somali-tc3-ja'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-com-somali-tc3-tp'), (SELECT id FROM roles WHERE code = 'COMMITTEE_MEMBER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc3-desk-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc3-desk-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc3-desk-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc3-desk-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc3-desk-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc3-desk-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc3-joint-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc3-joint-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc3-joint-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc3-joint-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc3-joint-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc3-joint-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc3-tp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc3-tp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc3-tp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc3-tp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc3-tp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc3-tp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc3-comp-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc3-comp-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc3-comp-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc3-comp-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc3-comp-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc3-comp-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc3-issue-1'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc3-issue-1-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc3-issue-1-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-tl-somali-tc3-issue-2'), (SELECT id FROM roles WHERE code = 'TEAM_LEADER')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc3-issue-2-1'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES ((SELECT id FROM users WHERE username = 'u-aud-somali-tc3-issue-2-2'), (SELECT id FROM roles WHERE code = 'AUDITOR')) ON CONFLICT DO NOTHING;

-- 8. User Organizational Assignments (1 User = 1 Tax Center)
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-pt-01'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    NULL,
    NULL,
    'PLANNING_TEAM',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-pt-02'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    NULL,
    NULL,
    'PLANNING_TEAM',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-pt-03'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    NULL,
    NULL,
    'PLANNING_TEAM',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-ad-01'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    NULL,
    NULL,
    'DIRECTOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-ad-02'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    NULL,
    NULL,
    'DIRECTOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-sm-01'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    NULL,
    NULL,
    'SENIOR_MANAGEMENT',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-sm-02'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    NULL,
    NULL,
    'SENIOR_MANAGEMENT',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-fed-chair'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    (SELECT id FROM committees WHERE code = 'FED-JA-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-fed-mem1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    (SELECT id FROM committees WHERE code = 'FED-JA-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-fed-mem2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    (SELECT id FROM committees WHERE code = 'FED-JA-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-fed-tpchair'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    (SELECT id FROM committees WHERE code = 'FED-TP-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-fed-tpmem1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    (SELECT id FROM committees WHERE code = 'FED-TP-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-fed-tpmem2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    (SELECT id FROM committees WHERE code = 'FED-TP-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-fed-deskchair'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    (SELECT id FROM committees WHERE code = 'FED-DESK-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-fed-deskmem1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    (SELECT id FROM committees WHERE code = 'FED-DESK-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-fed-compchair'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    (SELECT id FROM committees WHERE code = 'FED-COMP-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-fed-compmem1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    (SELECT id FROM committees WHERE code = 'FED-COMP-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-fed-issuechair'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    (SELECT id FROM committees WHERE code = 'FED-ISSUE-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-fed-issuemem1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    (SELECT id FROM committees WHERE code = 'FED-ISSUE-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-req-01'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    NULL,
    NULL,
    'AUDIT_REQUESTER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-req-02'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    NULL,
    NULL,
    'AUDIT_REQUESTER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-req-03'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    NULL,
    NULL,
    'AUDIT_REQUESTER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-req-04'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    NULL,
    NULL,
    'AUDIT_REQUESTER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-rd-fed'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    NULL,
    NULL,
    'REGIONAL_DIRECTOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-rd-aa'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    NULL,
    NULL,
    'REGIONAL_DIRECTOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-rd-am'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    NULL,
    NULL,
    'REGIONAL_DIRECTOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-rd-or'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    NULL,
    NULL,
    'REGIONAL_DIRECTOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-rd-dd'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    NULL,
    NULL,
    'REGIONAL_DIRECTOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-rd-sn'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    NULL,
    NULL,
    'REGIONAL_DIRECTOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-rd-so'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    NULL,
    NULL,
    'REGIONAL_DIRECTOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tcm-federal-lto1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    NULL,
    NULL,
    'TAX_CENTER_MANAGER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-federal-lto1-ja'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    (SELECT id FROM committees WHERE code = 'FEDERAL-LTO1-JA-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-federal-lto1-tp'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    (SELECT id FROM committees WHERE code = 'FEDERAL-LTO1-TP-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-federal-lto1-desk-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto1-desk-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto1-desk-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-federal-lto1-desk-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto1-desk-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto1-desk-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-federal-lto1-joint-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto1-joint-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto1-joint-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-federal-lto1-joint-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto1-joint-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto1-joint-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-federal-lto1-tp-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto1-tp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto1-tp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-federal-lto1-tp-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto1-tp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto1-tp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-federal-lto1-comp-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto1-comp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto1-comp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-federal-lto1-comp-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto1-comp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto1-comp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-federal-lto1-issue-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto1-issue-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto1-issue-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-federal-lto1-issue-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto1-issue-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto1-issue-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tcm-federal-lto2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    NULL,
    NULL,
    'TAX_CENTER_MANAGER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-federal-lto2-ja'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    (SELECT id FROM committees WHERE code = 'FEDERAL-LTO2-JA-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-federal-lto2-tp'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    (SELECT id FROM committees WHERE code = 'FEDERAL-LTO2-TP-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-federal-lto2-desk-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto2-desk-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto2-desk-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-federal-lto2-desk-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto2-desk-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto2-desk-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-federal-lto2-joint-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto2-joint-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto2-joint-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-federal-lto2-joint-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto2-joint-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto2-joint-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-federal-lto2-tp-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto2-tp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto2-tp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-federal-lto2-tp-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto2-tp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto2-tp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-federal-lto2-comp-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto2-comp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto2-comp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-federal-lto2-comp-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto2-comp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto2-comp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-federal-lto2-issue-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto2-issue-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto2-issue-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-federal-lto2-issue-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto2-issue-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-federal-lto2-issue-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-FED'),
    (SELECT id FROM tax_centers WHERE code = 'federal-lto2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tcm-addis_ababa-tc1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    NULL,
    NULL,
    'TAX_CENTER_MANAGER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-addis_ababa-tc1-ja'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    (SELECT id FROM committees WHERE code = 'ADDIS_ABABA-TC1-JA-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-addis_ababa-tc1-tp'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    (SELECT id FROM committees WHERE code = 'ADDIS_ABABA-TC1-TP-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc1-desk-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-desk-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-desk-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc1-desk-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-desk-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-desk-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc1-joint-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-joint-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-joint-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc1-joint-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-joint-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-joint-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc1-tp-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-tp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-tp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc1-tp-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-tp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-tp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc1-comp-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-comp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-comp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc1-comp-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-comp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-comp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc1-issue-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-issue-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-issue-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc1-issue-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-issue-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc1-issue-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tcm-addis_ababa-tc2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    NULL,
    NULL,
    'TAX_CENTER_MANAGER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-addis_ababa-tc2-ja'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    (SELECT id FROM committees WHERE code = 'ADDIS_ABABA-TC2-JA-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-addis_ababa-tc2-tp'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    (SELECT id FROM committees WHERE code = 'ADDIS_ABABA-TC2-TP-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc2-desk-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-desk-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-desk-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc2-desk-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-desk-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-desk-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc2-joint-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-joint-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-joint-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc2-joint-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-joint-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-joint-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc2-tp-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-tp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-tp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc2-tp-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-tp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-tp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc2-comp-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-comp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-comp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc2-comp-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-comp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-comp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc2-issue-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-issue-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-issue-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc2-issue-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-issue-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc2-issue-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tcm-addis_ababa-tc3'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    NULL,
    NULL,
    'TAX_CENTER_MANAGER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-addis_ababa-tc3-ja'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    (SELECT id FROM committees WHERE code = 'ADDIS_ABABA-TC3-JA-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-addis_ababa-tc3-tp'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    (SELECT id FROM committees WHERE code = 'ADDIS_ABABA-TC3-TP-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc3-desk-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-desk-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-desk-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc3-desk-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-desk-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-desk-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc3-joint-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-joint-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-joint-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc3-joint-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-joint-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-joint-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc3-tp-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-tp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-tp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc3-tp-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-tp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-tp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc3-comp-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-comp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-comp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc3-comp-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-comp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-comp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc3-issue-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-issue-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-issue-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-addis_ababa-tc3-issue-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-issue-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-addis_ababa-tc3-issue-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AA'),
    (SELECT id FROM tax_centers WHERE code = 'addis_ababa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tcm-amhara-tc1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    NULL,
    NULL,
    'TAX_CENTER_MANAGER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-amhara-tc1-ja'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    (SELECT id FROM committees WHERE code = 'AMHARA-TC1-JA-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-amhara-tc1-tp'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    (SELECT id FROM committees WHERE code = 'AMHARA-TC1-TP-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc1-desk-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-desk-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-desk-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc1-desk-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-desk-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-desk-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc1-joint-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-joint-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-joint-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc1-joint-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-joint-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-joint-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc1-tp-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-tp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-tp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc1-tp-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-tp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-tp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc1-comp-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-comp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-comp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc1-comp-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-comp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-comp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc1-issue-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-issue-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-issue-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc1-issue-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-issue-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc1-issue-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tcm-amhara-tc2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    NULL,
    NULL,
    'TAX_CENTER_MANAGER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-amhara-tc2-ja'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    (SELECT id FROM committees WHERE code = 'AMHARA-TC2-JA-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-amhara-tc2-tp'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    (SELECT id FROM committees WHERE code = 'AMHARA-TC2-TP-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc2-desk-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-desk-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-desk-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc2-desk-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-desk-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-desk-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc2-joint-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-joint-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-joint-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc2-joint-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-joint-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-joint-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc2-tp-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-tp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-tp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc2-tp-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-tp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-tp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc2-comp-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-comp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-comp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc2-comp-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-comp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-comp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc2-issue-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-issue-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-issue-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc2-issue-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-issue-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc2-issue-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tcm-amhara-tc3'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    NULL,
    NULL,
    'TAX_CENTER_MANAGER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-amhara-tc3-ja'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    (SELECT id FROM committees WHERE code = 'AMHARA-TC3-JA-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-amhara-tc3-tp'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    (SELECT id FROM committees WHERE code = 'AMHARA-TC3-TP-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc3-desk-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-desk-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-desk-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc3-desk-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-desk-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-desk-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc3-joint-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-joint-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-joint-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc3-joint-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-joint-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-joint-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc3-tp-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-tp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-tp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc3-tp-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-tp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-tp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc3-comp-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-comp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-comp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc3-comp-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-comp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-comp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc3-issue-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-issue-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-issue-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-amhara-tc3-issue-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-issue-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-amhara-tc3-issue-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BA'),
    (SELECT id FROM tax_centers WHERE code = 'amhara-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tcm-oromia-tc1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    NULL,
    NULL,
    'TAX_CENTER_MANAGER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-oromia-tc1-ja'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    (SELECT id FROM committees WHERE code = 'OROMIA-TC1-JA-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-oromia-tc1-tp'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    (SELECT id FROM committees WHERE code = 'OROMIA-TC1-TP-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc1-desk-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-desk-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-desk-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc1-desk-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-desk-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-desk-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc1-joint-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-joint-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-joint-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc1-joint-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-joint-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-joint-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc1-tp-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-tp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-tp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc1-tp-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-tp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-tp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc1-comp-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-comp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-comp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc1-comp-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-comp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-comp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc1-issue-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-issue-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-issue-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc1-issue-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-issue-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc1-issue-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tcm-oromia-tc2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    NULL,
    NULL,
    'TAX_CENTER_MANAGER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-oromia-tc2-ja'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    (SELECT id FROM committees WHERE code = 'OROMIA-TC2-JA-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-oromia-tc2-tp'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    (SELECT id FROM committees WHERE code = 'OROMIA-TC2-TP-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc2-desk-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-desk-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-desk-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc2-desk-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-desk-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-desk-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc2-joint-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-joint-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-joint-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc2-joint-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-joint-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-joint-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc2-tp-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-tp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-tp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc2-tp-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-tp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-tp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc2-comp-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-comp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-comp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc2-comp-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-comp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-comp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc2-issue-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-issue-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-issue-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc2-issue-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-issue-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc2-issue-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tcm-oromia-tc3'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    NULL,
    NULL,
    'TAX_CENTER_MANAGER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-oromia-tc3-ja'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    (SELECT id FROM committees WHERE code = 'OROMIA-TC3-JA-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-oromia-tc3-tp'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    (SELECT id FROM committees WHERE code = 'OROMIA-TC3-TP-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc3-desk-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-desk-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-desk-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc3-desk-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-desk-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-desk-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc3-joint-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-joint-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-joint-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc3-joint-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-joint-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-joint-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc3-tp-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-tp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-tp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc3-tp-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-tp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-tp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc3-comp-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-comp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-comp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc3-comp-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-comp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-comp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc3-issue-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-issue-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-issue-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-oromia-tc3-issue-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-issue-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-oromia-tc3-issue-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-BB'),
    (SELECT id FROM tax_centers WHERE code = 'oromia-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tcm-dire_dawa-tc1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    NULL,
    NULL,
    'TAX_CENTER_MANAGER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-dire_dawa-tc1-ja'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    (SELECT id FROM committees WHERE code = 'DIRE_DAWA-TC1-JA-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-dire_dawa-tc1-tp'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    (SELECT id FROM committees WHERE code = 'DIRE_DAWA-TC1-TP-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc1-desk-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-desk-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-desk-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc1-desk-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-desk-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-desk-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc1-joint-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-joint-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-joint-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc1-joint-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-joint-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-joint-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc1-tp-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-tp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-tp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc1-tp-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-tp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-tp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc1-comp-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-comp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-comp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc1-comp-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-comp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-comp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc1-issue-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-issue-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-issue-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc1-issue-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-issue-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc1-issue-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tcm-dire_dawa-tc2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    NULL,
    NULL,
    'TAX_CENTER_MANAGER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-dire_dawa-tc2-ja'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    (SELECT id FROM committees WHERE code = 'DIRE_DAWA-TC2-JA-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-dire_dawa-tc2-tp'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    (SELECT id FROM committees WHERE code = 'DIRE_DAWA-TC2-TP-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc2-desk-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-desk-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-desk-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc2-desk-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-desk-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-desk-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc2-joint-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-joint-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-joint-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc2-joint-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-joint-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-joint-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc2-tp-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-tp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-tp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc2-tp-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-tp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-tp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc2-comp-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-comp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-comp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc2-comp-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-comp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-comp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc2-issue-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-issue-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-issue-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc2-issue-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-issue-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc2-issue-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tcm-dire_dawa-tc3'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    NULL,
    NULL,
    'TAX_CENTER_MANAGER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-dire_dawa-tc3-ja'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    (SELECT id FROM committees WHERE code = 'DIRE_DAWA-TC3-JA-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-dire_dawa-tc3-tp'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    (SELECT id FROM committees WHERE code = 'DIRE_DAWA-TC3-TP-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc3-desk-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-desk-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-desk-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc3-desk-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-desk-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-desk-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc3-joint-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-joint-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-joint-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc3-joint-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-joint-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-joint-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc3-tp-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-tp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-tp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc3-tp-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-tp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-tp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc3-comp-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-comp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-comp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc3-comp-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-comp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-comp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc3-issue-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-issue-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-issue-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-dire_dawa-tc3-issue-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-issue-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-dire_dawa-tc3-issue-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-AB'),
    (SELECT id FROM tax_centers WHERE code = 'dire_dawa-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tcm-snnpr-tc1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    NULL,
    NULL,
    'TAX_CENTER_MANAGER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-snnpr-tc1-ja'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    (SELECT id FROM committees WHERE code = 'SNNPR-TC1-JA-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-snnpr-tc1-tp'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    (SELECT id FROM committees WHERE code = 'SNNPR-TC1-TP-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc1-desk-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-desk-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-desk-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc1-desk-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-desk-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-desk-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc1-joint-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-joint-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-joint-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc1-joint-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-joint-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-joint-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc1-tp-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-tp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-tp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc1-tp-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-tp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-tp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc1-comp-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-comp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-comp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc1-comp-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-comp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-comp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc1-issue-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-issue-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-issue-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc1-issue-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-issue-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc1-issue-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tcm-snnpr-tc2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    NULL,
    NULL,
    'TAX_CENTER_MANAGER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-snnpr-tc2-ja'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    (SELECT id FROM committees WHERE code = 'SNNPR-TC2-JA-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-snnpr-tc2-tp'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    (SELECT id FROM committees WHERE code = 'SNNPR-TC2-TP-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc2-desk-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-desk-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-desk-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc2-desk-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-desk-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-desk-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc2-joint-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-joint-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-joint-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc2-joint-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-joint-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-joint-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc2-tp-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-tp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-tp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc2-tp-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-tp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-tp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc2-comp-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-comp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-comp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc2-comp-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-comp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-comp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc2-issue-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-issue-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-issue-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc2-issue-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-issue-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc2-issue-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tcm-snnpr-tc3'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    NULL,
    NULL,
    'TAX_CENTER_MANAGER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-snnpr-tc3-ja'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    (SELECT id FROM committees WHERE code = 'SNNPR-TC3-JA-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-snnpr-tc3-tp'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    (SELECT id FROM committees WHERE code = 'SNNPR-TC3-TP-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc3-desk-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-desk-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-desk-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc3-desk-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-desk-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-desk-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc3-joint-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-joint-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-joint-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc3-joint-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-joint-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-joint-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc3-tp-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-tp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-tp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc3-tp-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-tp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-tp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc3-comp-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-comp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-comp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc3-comp-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-comp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-comp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc3-issue-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-issue-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-issue-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-snnpr-tc3-issue-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-issue-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-snnpr-tc3-issue-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-CA'),
    (SELECT id FROM tax_centers WHERE code = 'snnpr-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tcm-somali-tc1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    NULL,
    NULL,
    'TAX_CENTER_MANAGER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-somali-tc1-ja'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    (SELECT id FROM committees WHERE code = 'SOMALI-TC1-JA-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-somali-tc1-tp'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    (SELECT id FROM committees WHERE code = 'SOMALI-TC1-TP-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc1-desk-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc1-desk-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc1-desk-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc1-desk-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc1-desk-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc1-desk-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc1-joint-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc1-joint-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc1-joint-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc1-joint-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc1-joint-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc1-joint-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc1-tp-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc1-tp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc1-tp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc1-tp-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc1-tp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc1-tp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc1-comp-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc1-comp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc1-comp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc1-comp-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc1-comp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc1-comp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc1-issue-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc1-issue-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc1-issue-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc1-issue-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc1-issue-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc1-issue-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc1'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tcm-somali-tc2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    NULL,
    NULL,
    'TAX_CENTER_MANAGER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-somali-tc2-ja'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    (SELECT id FROM committees WHERE code = 'SOMALI-TC2-JA-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-somali-tc2-tp'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    (SELECT id FROM committees WHERE code = 'SOMALI-TC2-TP-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc2-desk-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc2-desk-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc2-desk-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc2-desk-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc2-desk-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc2-desk-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc2-joint-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc2-joint-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc2-joint-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc2-joint-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc2-joint-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc2-joint-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc2-tp-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc2-tp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc2-tp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc2-tp-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc2-tp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc2-tp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc2-comp-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc2-comp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc2-comp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc2-comp-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc2-comp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc2-comp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc2-issue-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc2-issue-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc2-issue-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc2-issue-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc2-issue-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc2-issue-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc2'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tcm-somali-tc3'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    NULL,
    NULL,
    'TAX_CENTER_MANAGER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-somali-tc3-ja'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    (SELECT id FROM committees WHERE code = 'SOMALI-TC3-JA-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-com-somali-tc3-tp'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    (SELECT id FROM committees WHERE code = 'SOMALI-TC3-TP-COM-001'),
    'COMMITTEE_MEMBER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc3-desk-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc3-desk-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc3-desk-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc3-desk-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc3-desk-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc3-desk-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'DESK_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc3-joint-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc3-joint-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc3-joint-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc3-joint-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc3-joint-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc3-joint-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'JOINT_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc3-tp-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc3-tp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc3-tp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc3-tp-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc3-tp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc3-tp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'TRANSFER_PRICING'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc3-comp-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc3-comp-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc3-comp-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc3-comp-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc3-comp-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc3-comp-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'COMPREHENSIVE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc3-issue-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc3-issue-1-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc3-issue-1-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-tl-somali-tc3-issue-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'TEAM_LEADER',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc3-issue-2-1'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
INSERT INTO user_organizational_assignments (user_id, region_id, tax_center_id, audit_type_id, committee_id, role_code, status)
VALUES (
    (SELECT id FROM users WHERE username = 'u-aud-somali-tc3-issue-2-2'),
    (SELECT id FROM regions WHERE code = 'REG-SO'),
    (SELECT id FROM tax_centers WHERE code = 'somali-tc3'),
    (SELECT id FROM audit_types WHERE code = 'ISSUE_AUDIT'),
    NULL,
    'AUDITOR',
    'ACTIVE'
) ON CONFLICT (user_id) WHERE status = 'ACTIVE' DO UPDATE SET
    region_id = EXCLUDED.region_id,
    tax_center_id = EXCLUDED.tax_center_id,
    audit_type_id = EXCLUDED.audit_type_id,
    committee_id = EXCLUDED.committee_id,
    role_code = EXCLUDED.role_code;
