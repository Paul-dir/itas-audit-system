-- V12: Create t_auditor table and seed auditor profiles
-- Replaces hardcoded MOCK_AUDITORS list in TeamFormationUseCase

CREATE TABLE IF NOT EXISTS t_auditor (
    auditor_id           UUID PRIMARY KEY,
    first_name           VARCHAR(100) NOT NULL,
    last_name            VARCHAR(100) NOT NULL,
    expertise            VARCHAR(100) NOT NULL,
    seniority            VARCHAR(50) NOT NULL,
    years_of_experience  INTEGER NOT NULL DEFAULT 0,
    email                VARCHAR(100),
    phone                VARCHAR(50),
    active               BOOLEAN NOT NULL DEFAULT TRUE,
    current_cases        INTEGER NOT NULL DEFAULT 0,
    max_cases            INTEGER NOT NULL DEFAULT 5,
    created_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Seed 8 auditor profiles (matching original MOCK_AUDITORS data)
INSERT INTO t_auditor (auditor_id, first_name, last_name, expertise, seniority, years_of_experience, email, phone, active, current_cases, max_cases) VALUES
('a0000001-0000-0000-0000-000000000001', 'Abebe',    'Kebede',      'Corporate Tax',      'SENIOR',     12, 'abebe.kebede@mor.gov.et',      '+251-911-000001', true, 2, 5),
('a0000001-0000-0000-0000-000000000002', 'Fatuma',    'Ahmed',       'Transfer Pricing',   'PRINCIPAL',  15, 'fatuma.ahmed@mor.gov.et',      '+251-911-000002', true, 3, 5),
('a0000001-0000-0000-0000-000000000003', 'Dawit',     'Tadesse',     'International Tax',  'SENIOR',     10, 'dawit.tadesse@mor.gov.et',     '+251-911-000003', true, 1, 5),
('a0000001-0000-0000-0000-000000000004', 'Sara',      'Mohammed',    'VAT Compliance',     'MID_LEVEL',   7, 'sara.mohammed@mor.gov.et',     '+251-911-000004', true, 2, 5),
('a0000001-0000-0000-0000-000000000005', 'Yonas',     'Berhanu',     'Corporate Tax',      'JUNIOR',      3, 'yonas.berhanu@mor.gov.et',     '+251-911-000005', true, 0, 5),
('a0000001-0000-0000-0000-000000000006', 'Hana',      'Girma',       'Audit Investigation','SENIOR',     11, 'hana.girma@mor.gov.et',        '+251-911-000006', true, 3, 5),
('a0000001-0000-0000-0000-000000000007', 'Mulugeta',  'Alemayehu',   'Transfer Pricing',   'MID_LEVEL',   6, 'mulugeta.alemayehu@mor.gov.et','+251-911-000007', true, 1, 5),
('a0000001-0000-0000-0000-000000000008', 'Tigist',    'Haile',       'International Tax',  'JUNIOR',      2, 'tigist.haile@mor.gov.et',      '+251-911-000008', true, 0, 5)
ON CONFLICT (auditor_id) DO NOTHING;

-- Create indexes for search performance
CREATE INDEX IF NOT EXISTS idx_auditor_expertise ON t_auditor(expertise);
CREATE INDEX IF NOT EXISTS idx_auditor_seniority ON t_auditor(seniority);
CREATE INDEX IF NOT EXISTS idx_auditor_active ON t_auditor(active);
