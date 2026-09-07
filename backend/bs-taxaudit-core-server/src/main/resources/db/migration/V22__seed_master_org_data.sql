-- =============================================================================
-- V22__seed_master_org_data.sql
-- Master Seed Data for Regions, Tax Centers, Audit Types, Committees, Teams, and Users.
-- Supports Region Z (Z-TC-1, Z-TC-2, Z-TC-3), Region Y (Y-TC-1, Y-TC-2, Y-TC-3) and Federal LTO.
-- =============================================================================

-- 1. SEED REGIONS
INSERT INTO regions (id, code, name) VALUES
('b3a59371-6c1f-4b48-8422-38e9c80d0001', 'REG-FED', 'Federal Directorate'),
('b3a59371-6c1f-4b48-8422-38e9c80d0002', 'REG-Z',   'Region Z Directorate'),
('b3a59371-6c1f-4b48-8422-38e9c80d0003', 'REG-Y',   'Region Y Directorate')
ON CONFLICT (code) DO NOTHING;

-- 2. SEED TAX CENTERS
INSERT INTO tax_centers (id, code, region_id, name) VALUES
('c7b64928-1234-4567-89ab-000000000001', 'federal-lto1', 'b3a59371-6c1f-4b48-8422-38e9c80d0001', 'Federal Large Taxpayer Office 1'),
('c7b64928-1234-4567-89ab-000000000002', 'Z-TC-1',       'b3a59371-6c1f-4b48-8422-38e9c80d0002', 'Region Z Tax Center 1'),
('c7b64928-1234-4567-89ab-000000000003', 'Z-TC-2',       'b3a59371-6c1f-4b48-8422-38e9c80d0002', 'Region Z Tax Center 2'),
('c7b64928-1234-4567-89ab-000000000004', 'Z-TC-3',       'b3a59371-6c1f-4b48-8422-38e9c80d0002', 'Region Z Tax Center 3'),
('c7b64928-1234-4567-89ab-000000000005', 'Y-TC-1',       'b3a59371-6c1f-4b48-8422-38e9c80d0003', 'Region Y Tax Center 1'),
('c7b64928-1234-4567-89ab-000000000006', 'Y-TC-2',       'b3a59371-6c1f-4b48-8422-38e9c80d0003', 'Region Y Tax Center 2'),
('c7b64928-1234-4567-89ab-000000000007', 'Y-TC-3',       'b3a59371-6c1f-4b48-8422-38e9c80d0003', 'Region Y Tax Center 3')
ON CONFLICT (code) DO NOTHING;

-- 3. SEED AUDIT TYPES
INSERT INTO audit_types (id, code, name, requires_committee, initial_assignment_role) VALUES
('d1a84029-0000-0000-0000-000000000001', 'DESK_AUDIT',          'Desk Audit',          FALSE, 'TEAM_LEADER'),
('d1a84029-0000-0000-0000-000000000002', 'COMPREHENSIVE_AUDIT', 'Comprehensive Audit', FALSE, 'TEAM_LEADER'),
('d1a84029-0000-0000-0000-000000000003', 'JOINT_AUDIT',         'Joint Audit',         TRUE,  'COMMITTEE'),
('d1a84029-0000-0000-0000-000000000004', 'TRANSFER_PRICING',    'Transfer Pricing',    TRUE,  'COMMITTEE')
ON CONFLICT (code) DO NOTHING;

-- 4. SEED COMMITTEES (Multi-Committee support for Z-TC-1 & Federal)
INSERT INTO committees (id, code, name, tax_center_id, audit_type_id) VALUES
('e2b95130-0000-0000-0000-000000000001', 'Z-TC-1-JA-COM-001', 'Z-TC-1 Joint Audit Committee 1', 'c7b64928-1234-4567-89ab-000000000002', 'd1a84029-0000-0000-0000-000000000003'),
('e2b95130-0000-0000-0000-000000000002', 'Z-TC-1-JA-COM-002', 'Z-TC-1 Joint Audit Committee 2', 'c7b64928-1234-4567-89ab-000000000002', 'd1a84029-0000-0000-0000-000000000003'),
('e2b95130-0000-0000-0000-000000000003', 'Z-TC-1-TP-COM-001', 'Z-TC-1 Transfer Pricing Committee 1', 'c7b64928-1234-4567-89ab-000000000002', 'd1a84029-0000-0000-0000-000000000004'),
('e2b95130-0000-0000-0000-000000000004', 'Z-TC-1-TP-COM-002', 'Z-TC-1 Transfer Pricing Committee 2', 'c7b64928-1234-4567-89ab-000000000002', 'd1a84029-0000-0000-0000-000000000004'),
('e2b95130-0000-0000-0000-000000000005', 'FED-JA-COM-001',    'Federal Joint Audit Committee', 'c7b64928-1234-4567-89ab-000000000001', 'd1a84029-0000-0000-0000-000000000003'),
('e2b95130-0000-0000-0000-000000000006', 'FED-TP-COM-001',    'Federal Transfer Pricing Committee', 'c7b64928-1234-4567-89ab-000000000001', 'd1a84029-0000-0000-0000-000000000004')
ON CONFLICT (code) DO NOTHING;
