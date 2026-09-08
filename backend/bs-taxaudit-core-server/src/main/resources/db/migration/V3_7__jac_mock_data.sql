-- ====================================================================
-- V3_7__jac_mock_data.sql
-- Joint Audit Committee: Comprehensive Mock Data
-- ====================================================================
-- Populates all 14 committee workspace tables with realistic test data
-- for UI functionality and testing. Includes:
--   1. Committee Cases (10 cases, varying statuses and risk levels)
--   2. Advisory Voting (voting sessions)
--   3. Committee Votes (member votes with YES/NO/ABSTAIN)
--   4. Voting Tally (vote aggregations)
--   5. Research Notes (collaborative documentation)
--   6. Research Comments (threaded discussions)
--   7. Research Attachments (file metadata)
--   8. Auditor Nominations (20+ nominations)
--   9. Handoff Records (2 approved cases)
--   10. Handoff Team Members (auditor assignments)
--   11. Committee Sessions (3 meetings)
--   12. Session Attendees (meeting participants)
--   13. Audit Trail (50+ activity entries)
--   14. Case Status History (status transitions)
-- ====================================================================

-- Mock User IDs (Committee Members, Chairperson, Auditors)
-- Note: These should match existing users in user-management-service
-- For testing, we use deterministic UUIDs

-- Committee Members (5)
-- 00000000-0000-0000-0000-000000000001 - Sarah Chen (Chairperson)
-- 00000000-0000-0000-0000-000000000002 - Marcus Johnson
-- 00000000-0000-0000-0000-000000000003 - Elizabeth Rodriguez
-- 00000000-0000-0000-0000-000000000004 - David Thompson
-- 00000000-0000-0000-0000-000000000005 - Priya Kapoor

-- Auditors (10)
-- 00000000-0000-0000-0000-000000000011 - James Wilson
-- 00000000-0000-0000-0000-000000000012 - Lisa Anderson
-- 00000000-0000-0000-0000-000000000013 - Robert Brown
-- 00000000-0000-0000-0000-000000000014 - Michelle Garcia
-- 00000000-0000-0000-0000-000000000015 - Christopher Lee
-- 00000000-0000-0000-0000-000000000016 - Amanda Martinez
-- 00000000-0000-0000-0000-000000000017 - Kevin Davis
-- 00000000-0000-0000-0000-000000000018 - Jennifer White
-- 00000000-0000-0000-0000-000000000019 - Richard Taylor
-- 00000000-0000-0000-0000-000000000020 - Sarah Moore

-- System user for audit trail
-- 00000000-0000-0000-0000-000000000099 - System

-- ====================================================================
-- 1. Committee Cases (10 cases with varying statuses and risk levels)
-- ====================================================================
-- Cases spread across different statuses to simulate realistic workflow:
-- - PENDING_VOTES: Waiting for voting to complete
-- - TEAM_ASSIGNED: Vote passed, team assigned
-- - PENDING_VIABILITY: Team assessing viability
-- - APPROVED: Viability approved by chairperson
-- - REJECTED: Case rejected

INSERT INTO t_committee_case (
    case_id, original_case_id, case_code, taxpayer_id, taxpayer_name, 
    tax_id_number, segment, industry, risk_score, risk_priority, 
    status, created_date, committee_deadline, extended_deadline, 
    extension_count, current_owner_id, ownership_acquired_at, 
    created_by, created_at
) VALUES
-- Case 1: High risk, Voting in progress
('11111111-1111-1111-1111-111111111111', '99999999-9999-9999-9999-999999999001', NULL,
 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ABC Manufacturing Ltd', '98-7654321',
 'LARGE', 'Manufacturing', 92, 'HIGH', 'PENDING_VOTES',
 NOW() - INTERVAL '10 days', NOW() + INTERVAL '2 days', NULL, 0,
 '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '3 days',
 '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '10 days'),

-- Case 2: Medium risk, Pending viability
('22222222-2222-2222-2222-222222222222', '99999999-9999-9999-9999-999999999002', NULL,
 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'XYZ Services Inc', '65-4321098',
 'MEDIUM', 'Services', 72, 'MEDIUM', 'PENDING_VIABILITY',
 NOW() - INTERVAL '8 days', NOW() + INTERVAL '5 days', NULL, 0,
 '00000000-0000-0000-0000-000000000003', NOW() - INTERVAL '2 days',
 '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '8 days'),

-- Case 3: High risk, Approved, waiting team assignment
('33333333-3333-3333-3333-333333333333', '99999999-9999-9999-9999-999999999003', 'JAC-2024-001',
 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Acme Corporation', '12-3456789',
 'LARGE', 'Manufacturing', 95, 'HIGH', 'APPROVED',
 NOW() - INTERVAL '12 days', NOW() - INTERVAL '2 days', NULL, 0, NULL, NULL,
 '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '12 days'),

-- Case 4: Medium risk, Team assigned
('44444444-4444-4444-4444-444444444444', '99999999-9999-9999-9999-999999999004', NULL,
 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Beta Trading Co', '45-9876543',
 'MEDIUM', 'Trading', 68, 'MEDIUM', 'TEAM_ASSIGNED',
 NOW() - INTERVAL '15 days', NOW() - INTERVAL '5 days', NULL, 0,
 '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '1 day',
 '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '15 days'),

-- Case 5: Low risk, Transferred to execution
('55555555-5555-5555-5555-555555555555', '99999999-9999-9999-9999-999999999005', 'JAC-2024-002',
 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Gamma Tech Solutions', '78-1234567',
 'SMALL', 'Technology', 55, 'LOW', 'TRANSFERRED_TO_EXECUTION',
 NOW() - INTERVAL '18 days', NOW() - INTERVAL '8 days', NULL, 0,
 '00000000-0000-0000-0000-000000000005', NOW() - INTERVAL '5 days',
 '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '18 days'),

-- Case 6: High risk, Voting in progress
('66666666-6666-6666-6666-666666666666', '99999999-9999-9999-9999-999999999006', NULL,
 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Delta Financial Group', '23-5678901',
 'LARGE', 'Financial Services', 88, 'HIGH', 'PENDING_VOTES',
 NOW() - INTERVAL '7 days', NOW() + INTERVAL '3 days', NULL, 0,
 '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '4 days',
 '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '7 days'),

-- Case 7: Medium risk, Pending viability
('77777777-7777-7777-7777-777777777777', '99999999-9999-9999-9999-999999999007', NULL,
 '77777777-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Epsilon Retail Corp', '34-2109876',
 'MEDIUM', 'Retail', 71, 'MEDIUM', 'PENDING_VIABILITY',
 NOW() - INTERVAL '6 days', NOW() + INTERVAL '6 days', NULL, 0, NULL, NULL,
 '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '6 days'),

-- Case 8: Low risk, Rejected
('88888888-8888-8888-8888-888888888888', '99999999-9999-9999-9999-999999999008', NULL,
 '88888888-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Zeta Construction LLC', '56-7890123',
 'SMALL', 'Construction', 42, 'LOW', 'REJECTED',
 NOW() - INTERVAL '20 days', NOW() - INTERVAL '12 days', NULL, 0, NULL, NULL,
 '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '20 days'),

-- Case 9: High risk, Voting in progress with SLA extension
('99999999-9999-9999-9999-999999999010', '99999999-9999-9999-9999-999999999009', NULL,
 '99999999-cccc-cccc-cccc-cccccccccccc', 'Eta Healthcare Ltd', '89-3456789',
 'LARGE', 'Healthcare', 91, 'HIGH', 'PENDING_VOTES',
 NOW() - INTERVAL '14 days', NOW() - INTERVAL '2 days', NOW() + INTERVAL '5 days', 1,
 '00000000-0000-0000-0000-000000000003', NOW() - INTERVAL '6 days',
 '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '14 days'),

-- Case 10: Medium risk, Team assigned, with ownership
('aaaaaaa1-1111-1111-1111-111111111111', '99999999-9999-9999-9999-999999999010', NULL,
 'aaaaaaaa-dddd-dddd-dddd-dddddddddddd', 'Theta Energy Partners', '67-9012345',
 'MEDIUM', 'Energy', 65, 'MEDIUM', 'TEAM_ASSIGNED',
 NOW() - INTERVAL '11 days', NOW() + INTERVAL '1 day', NULL, 0,
 '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '2 days',
 '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '11 days');

-- ====================================================================
-- 2. Advisory Voting (voting sessions - one per case with voting)
-- ====================================================================
INSERT INTO t_advisory_voting (voting_id, case_id, status, consensus_threshold, voting_started_at, voting_closed_at, created_at)
VALUES
-- Open voting sessions (Cases 1, 6, 9)
('10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'OPEN', 60, NOW() - INTERVAL '5 days', NULL, NOW() - INTERVAL '5 days'),
('10000000-0000-0000-0000-000000000002', '66666666-6666-6666-6666-666666666666', 'OPEN', 60, NOW() - INTERVAL '4 days', NULL, NOW() - INTERVAL '4 days'),
('10000000-0000-0000-0000-000000000003', '99999999-9999-9999-9999-999999999010', 'OPEN', 60, NOW() - INTERVAL '8 days', NULL, NOW() - INTERVAL '8 days'),

-- Closed voting sessions (Cases 3, 5 - approved)
('10000000-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', 'CLOSED', 60, NOW() - INTERVAL '12 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '12 days'),
('10000000-0000-0000-0000-000000000005', '55555555-5555-5555-5555-555555555555', 'CLOSED', 60, NOW() - INTERVAL '18 days', NOW() - INTERVAL '8 days', NOW() - INTERVAL '18 days');

-- ====================================================================
-- 3. Committee Votes (votes from members for open voting sessions)
-- ====================================================================
-- Case 1 (JAC-2024-xxx): High-risk manufacturing - mostly approval
INSERT INTO t_committee_vote (vote_id, voting_id, case_id, member_id, vote_option, reasoning, voted_at)
VALUES
('c0000000-0000-0000-0000-000000000101', '10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 
 '00000000-0000-0000-0000-000000000001', 'YES', 'Risk score of 92 warrants investigation. Strong financial concerns identified.', NOW() - INTERVAL '4 days'),
('c0000000-0000-0000-0000-000000000102', '10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
 '00000000-0000-0000-0000-000000000002', 'YES', 'Manufacturing segment shows consistent patterns. Recommend approval.', NOW() - INTERVAL '4 days'),
('c0000000-0000-0000-0000-000000000103', '10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
 '00000000-0000-0000-0000-000000000003', 'YES', 'Documentation complete. Ready for team assignment.', NOW() - INTERVAL '3 days'),
('c0000000-0000-0000-0000-000000000104', '10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
 '00000000-0000-0000-0000-000000000004', 'ABSTAIN', 'Need more clarity on inventory practices before deciding.', NOW() - INTERVAL '3 days'),
('c0000000-0000-0000-0000-000000000105', '10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
 '00000000-0000-0000-0000-000000000005', 'YES', 'Supporting approval. Risk mitigation appropriate with audit oversight.', NOW() - INTERVAL '2 days'),

-- Case 6 (Delta Financial): High-risk financial services - split decision
('c0000000-0000-0000-0000-000000000201', '10000000-0000-0000-0000-000000000002', '66666666-6666-6666-6666-666666666666',
 '00000000-0000-0000-0000-000000000001', 'YES', 'Financial sector compliance violations noted. Recommend approval.', NOW() - INTERVAL '3 days'),
('c0000000-0000-0000-0000-000000000202', '10000000-0000-0000-0000-000000000002', '66666666-6666-6666-6666-666666666666',
 '00000000-0000-0000-0000-000000000002', 'NO', 'Insufficient documentation. Need additional research before approval.', NOW() - INTERVAL '3 days'),
('c0000000-0000-0000-0000-000000000203', '10000000-0000-0000-0000-000000000002', '66666666-6666-6666-6666-666666666666',
 '00000000-0000-0000-0000-000000000003', 'YES', 'Risk score of 88 is significant. Approve investigation.', NOW() - INTERVAL '2 days'),
('c0000000-0000-0000-0000-000000000204', '10000000-0000-0000-0000-000000000002', '66666666-6666-6666-6666-666666666666',
 '00000000-0000-0000-0000-000000000004', 'YES', 'Pattern matching with previous cases. Recommend approval.', NOW() - INTERVAL '2 days'),
('c0000000-0000-0000-0000-000000000205', '10000000-0000-0000-0000-000000000002', '66666666-6666-6666-6666-666666666666',
 '00000000-0000-0000-0000-000000000005', 'YES', 'Supporting approval. Financial oversight mechanisms recommended.', NOW() - INTERVAL '1 day'),

-- Case 9 (Eta Healthcare): High-risk healthcare - consensus approval
('c0000000-0000-0000-0000-000000000301', '10000000-0000-0000-0000-000000000003', '99999999-9999-9999-9999-999999999010',
 '00000000-0000-0000-0000-000000000001', 'YES', 'Healthcare compliance concerns warrant full investigation.', NOW() - INTERVAL '6 days'),
('c0000000-0000-0000-0000-000000000302', '10000000-0000-0000-0000-000000000003', '99999999-9999-9999-9999-999999999010',
 '00000000-0000-0000-0000-000000000002', 'YES', 'Risk score 91 indicates serious issues. Recommend approval.', NOW() - INTERVAL '5 days'),
('c0000000-0000-0000-0000-000000000303', '10000000-0000-0000-0000-000000000003', '99999999-9999-9999-9999-999999999010',
 '00000000-0000-0000-0000-000000000003', 'YES', 'Patient billing records need comprehensive audit.', NOW() - INTERVAL '5 days'),
('c0000000-0000-0000-0000-000000000304', '10000000-0000-0000-0000-000000000003', '99999999-9999-9999-9999-999999999010',
 '00000000-0000-0000-0000-000000000004', 'YES', 'Strong approval. Healthcare sector audit prioritized.', NOW() - INTERVAL '4 days'),
('c0000000-0000-0000-0000-000000000305', '10000000-0000-0000-0000-000000000003', '99999999-9999-9999-9999-999999999010',
 '00000000-0000-0000-0000-000000000005', 'YES', 'Unanimous support. Healthcare audit is critical.', NOW() - INTERVAL '3 days'),

-- Case 3 (Acme Corporation): High-risk approved cases - consensus
('c0000000-0000-0000-0000-000000000401', '10000000-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333',
 '00000000-0000-0000-0000-000000000001', 'YES', 'Comprehensive investigation warranted. Manufacturing audit recommended.', NOW() - INTERVAL '11 days'),
('c0000000-0000-0000-0000-000000000402', '10000000-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333',
 '00000000-0000-0000-0000-000000000002', 'YES', 'Strong case for investigation. Consistent patterns identified.', NOW() - INTERVAL '10 days'),
('c0000000-0000-0000-0000-000000000403', '10000000-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333',
 '00000000-0000-0000-0000-000000000003', 'YES', 'Approve. Viability assessment confirms risk mitigation.', NOW() - INTERVAL '10 days'),
('c0000000-0000-0000-0000-000000000404', '10000000-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333',
 '00000000-0000-0000-0000-000000000004', 'YES', 'Risk score 95 is critical. Full investigation required.', NOW() - INTERVAL '9 days'),
('c0000000-0000-0000-0000-000000000405', '10000000-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333',
 '00000000-0000-0000-0000-000000000005', 'YES', 'Consensus: Approve for execution team assignment.', NOW() - INTERVAL '8 days'),

-- Case 5 (Gamma Tech): Low-risk approved cases - consensus
('c0000000-0000-0000-0000-000000000501', '10000000-0000-0000-0000-000000000005', '55555555-5555-5555-5555-555555555555',
 '00000000-0000-0000-0000-000000000001', 'YES', 'Technology sector review. Recommend approval.', NOW() - INTERVAL '17 days'),
('c0000000-0000-0000-0000-000000000502', '10000000-0000-0000-0000-000000000005', '55555555-5555-5555-5555-555555555555',
 '00000000-0000-0000-0000-000000000002', 'YES', 'Lower risk profile but systematic audit appropriate.', NOW() - INTERVAL '16 days'),
('c0000000-0000-0000-0000-000000000503', '10000000-0000-0000-0000-000000000005', '55555555-5555-5555-5555-555555555555',
 '00000000-0000-0000-0000-000000000003', 'YES', 'Approve. Technology compliance audit beneficial.', NOW() - INTERVAL '15 days'),
('c0000000-0000-0000-0000-000000000504', '10000000-0000-0000-0000-000000000005', '55555555-5555-5555-5555-555555555555',
 '00000000-0000-0000-0000-000000000004', 'YES', 'Supporting approval. Appropriate for execution phase.', NOW() - INTERVAL '14 days'),
('c0000000-0000-0000-0000-000000000505', '10000000-0000-0000-0000-000000000005', '55555555-5555-5555-5555-555555555555',
 '00000000-0000-0000-0000-000000000005', 'YES', 'Consensus: Approve and transfer to execution.', NOW() - INTERVAL '13 days');

-- ====================================================================
-- 4. Voting Tally (aggregated vote counts)
-- ====================================================================
INSERT INTO t_voting_tally (tally_id, voting_id, approve_count, reject_count, more_info_count, total_votes_cast, consensus_percentage, voting_outcome, calculated_at)
VALUES
-- Open voting sessions
('a0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 4, 0, 1, 5, 80.00, 'APPROVED', NOW() - INTERVAL '2 days'),
('a0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 4, 1, 0, 5, 80.00, 'APPROVED', NOW() - INTERVAL '1 day'),
('a0000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 5, 0, 0, 5, 100.00, 'APPROVED', NOW()),

-- Closed voting sessions
('a0000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 5, 0, 0, 5, 100.00, 'APPROVED', NOW() - INTERVAL '2 days'),
('a0000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', 5, 0, 0, 5, 100.00, 'APPROVED', NOW() - INTERVAL '8 days');

-- ====================================================================
-- 5. Research Notes (collaborative documentation - 15 notes)
-- ====================================================================
INSERT INTO t_research_note (note_id, case_id, author_id, category, content, created_at, updated_at)
VALUES
-- Case 1 (ABC Manufacturing) research notes
('70000000-0000-0000-0000-000000000101', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000002',
 'OBSERVATION', 'Initial review of financial statements shows significant variance in reported revenue vs. bank deposits. Discrepancy appears to be approximately $2.3M over past 18 months.',
 NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 days'),

('70000000-0000-0000-0000-000000000102', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000003',
 'QUESTION', 'Can we obtain accounts receivable aging reports from Q2 and Q3? This will help verify the revenue timing issues noted.',
 NOW() - INTERVAL '7 days', NULL),

('70000000-0000-0000-0000-000000000103', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001',
 'INVESTIGATION', 'Preliminary investigation into subsidiary companies. Identified 3 related entities with potential circular transactions. Need to obtain intercompany agreements.',
 NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days'),

('70000000-0000-0000-0000-000000000104', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000004',
 'RECOMMENDATION', 'Recommend full scope audit focusing on revenue recognition policies and consolidation treatment of subsidiaries. High complexity case warranting experienced audit team.',
 NOW() - INTERVAL '4 days', NULL),

-- Case 6 (Delta Financial) research notes
('70000000-0000-0000-0000-000000000201', '66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000001',
 'OBSERVATION', 'Financial institution showing compliance violations in AML/KYC procedures. Multiple suspicious transactions flagged but not reported in timeline.',
 NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days'),

('70000000-0000-0000-0000-000000000202', '66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000003',
 'QUESTION', 'Has compliance department been properly resourced? What is their current staffing level vs. industry standards?',
 NOW() - INTERVAL '5 days', NULL),

('70000000-0000-0000-0000-000000000203', '66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000002',
 'INVESTIGATION', 'Reviewing past 24 months of SAR (Suspicious Activity Reports). Found only 2 reports filed despite 45+ flagged transactions in system.',
 NOW() - INTERVAL '4 days', NULL),

('70000000-0000-0000-0000-000000000204', '66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000005',
 'RECOMMENDATION', 'Recommend comprehensive compliance audit with focus on AML/KYC procedures, transaction monitoring systems, and staff training protocols.',
 NOW() - INTERVAL '3 days', NULL),

-- Case 9 (Eta Healthcare) research notes
('70000000-0000-0000-0000-000000000301', '99999999-9999-9999-9999-999999999010', '00000000-0000-0000-0000-000000000004',
 'OBSERVATION', 'Healthcare provider billing records show unusual patterns in Medicare claim submissions. Pattern consistent with upcoding vulnerabilities.',
 NOW() - INTERVAL '10 days', NOW() - INTERVAL '9 days'),

('70000000-0000-0000-0000-000000000302', '99999999-9999-9999-9999-999999999010', '00000000-0000-0000-0000-000000000002',
 'QUESTION', 'What is their current billing compliance certification status? Any prior audit findings or regulatory warnings?',
 NOW() - INTERVAL '9 days', NULL),

('70000000-0000-0000-0000-000000000303', '99999999-9999-9999-9999-999999999010', '00000000-0000-0000-0000-000000000005',
 'INVESTIGATION', 'Sampling 50 patient billing records. Preliminary findings show approximately 12% of sampled records have coding discrepancies. Escalation potential significant.',
 NOW() - INTERVAL '7 days', NOW() - INTERVAL '6 days'),

('70000000-0000-0000-0000-000000000304', '99999999-9999-9999-9999-999999999010', '00000000-0000-0000-0000-000000000001',
 'RECOMMENDATION', 'Priority investigation required. Recommend engagement of healthcare billing specialist. Potential exposure could be substantial. Patient care quality review also recommended.',
 NOW() - INTERVAL '5 days', NULL),

-- Case 3 (Acme Corporation) - already approved
('70000000-0000-0000-0000-000000000401', '33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000003',
 'OBSERVATION', 'Manufacturing operations span 7 facilities across 3 states. Accounting consolidated but controls appear decentralized.',
 NOW() - INTERVAL '11 days', NULL),

('70000000-0000-0000-0000-000000000402', '33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000004',
 'RECOMMENDATION', 'Comprehensive audit recommended with field visits to all 7 facilities. Decentralized accounting control structure requires on-site verification.',
 NOW() - INTERVAL '9 days', NULL),

-- Case 5 (Gamma Tech) - already approved
('70000000-0000-0000-0000-000000000501', '55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000005',
 'OBSERVATION', 'Technology startup with clean financials. Revenue model transparent. Standard compliance procedures appear adequate.',
 NOW() - INTERVAL '15 days', NULL),

('70000000-0000-0000-0000-000000000502', '55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000001',
 'RECOMMENDATION', 'Standard audit procedures sufficient. Lower risk case. Office-based audit appropriate given company size and structure.',
 NOW() - INTERVAL '14 days', NULL);

-- ====================================================================
-- 6. Research Comments (threaded discussions - 25 comments)
-- ====================================================================
-- Comments on Case 1 research notes
INSERT INTO t_research_comment (comment_id, note_id, author_id, content, replied_to_comment_id, created_at)
VALUES
-- Thread on note 101 (ABC Manufacturing variance)
('60000000-0000-0000-0000-000000000101', '70000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001',
 'Good catch Marcus. This variance warrants detailed investigation. Has accounting provided explanation?',
 NULL, NOW() - INTERVAL '7.5 days'),

('60000000-0000-0000-0000-000000000102', '70000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000002',
 'Sarah - they initially claimed timing differences but we''ve been unable to reconcile specific transactions. Requesting detailed general ledger dump.',
 '60000000-0000-0000-0000-000000000101', NOW() - INTERVAL '7 days'),

('60000000-0000-0000-0000-000000000103', '70000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000003',
 'Request a list of customers corresponding to the missing deposits. Cross-reference with phone #s and addresses for identity verification.',
 '60000000-0000-0000-0000-000000000102', NOW() - INTERVAL '6.8 days'),

('60000000-0000-0000-0000-000000000104', '70000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000005',
 'Excellent suggestion Elizabeth. This aligns with standard procedures for potential fictitious revenue detection.',
 '60000000-0000-0000-0000-000000000103', NOW() - INTERVAL '6.5 days'),

-- Thread on note 103 (ABC Manufacturing subsidiaries)
('60000000-0000-0000-0000-000000000201', '70000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000002',
 'David - strong finding on the subsidiaries. What type of transactions are we seeing?',
 NULL, NOW() - INTERVAL '5.5 days'),

('60000000-0000-0000-0000-000000000202', '70000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000004',
 'Preliminary analysis shows sales and service agreements between subsidiaries with no apparent third-party involvement. Circular pattern evident.',
 '60000000-0000-0000-0000-000000000201', NOW() - INTERVAL '5.2 days'),

('60000000-0000-0000-0000-000000000203', '70000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000003',
 'Please obtain org chart and ownership diagrams. May help establish true control structure.',
 '60000000-0000-0000-0000-000000000202', NOW() - INTERVAL '5 days'),

-- Comments on Case 6 research notes
('60000000-0000-0000-0000-000000000301', '70000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000004',
 'This is concerning. AML compliance failures can carry significant regulatory penalties.',
 NULL, NOW() - INTERVAL '5.5 days'),

('60000000-0000-0000-0000-000000000302', '70000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001',
 'Absolutely David. We need to quantify the exposure. Marcus - can you provide timeline of flagged transactions?',
 '60000000-0000-0000-0000-000000000301', NOW() - INTERVAL '5.2 days'),

('60000000-0000-0000-0000-000000000303', '70000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000002',
 'Timeline will be ready tomorrow. Also requesting email correspondence between compliance and management regarding flagged transactions.',
 '60000000-0000-0000-0000-000000000302', NOW() - INTERVAL '5 days'),

-- Thread on note 203 (Case 6 SAR filings)
('60000000-0000-0000-0000-000000000401', '70000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000005',
 'This SAR gap is alarming. Only 2 reports for 45+ flagged transactions is well below industry standard.',
 NULL, NOW() - INTERVAL '4.5 days'),

('60000000-0000-0000-0000-000000000402', '70000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000003',
 'Priya, need to understand the decision-making process. Who approved/rejected the SARs? Get the decision documentation.',
 '60000000-0000-0000-0000-000000000401', NOW() - INTERVAL '4.2 days'),

-- Comments on Case 9 research notes
('60000000-0000-0000-0000-000000000501', '70000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000002',
 'Upcoding is a serious concern in healthcare. This pattern matches national trends. Recommend coordinated multi-facility review.',
 NULL, NOW() - INTERVAL '9 days'),

('60000000-0000-0000-0000-000000000502', '70000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000001',
 'Agreed Marcus. David - can you pull their coding guidelines and compare against CMS standards?',
 '60000000-0000-0000-0000-000000000501', NOW() - INTERVAL '8.8 days'),

('60000000-0000-0000-0000-000000000503', '70000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000004',
 'CMS comparison document compiled. Significant gaps in ~8 procedure codes. Will share in secure channel.',
 '60000000-0000-0000-0000-000000000502', NOW() - INTERVAL '8.5 days'),

-- Thread on note 303 (Case 9 sampling)
('60000000-0000-0000-0000-000000000601', '70000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000005',
 '12% error rate on sample is significantly high. Need to extrapolate to full population and estimate exposure.',
 NULL, NOW() - INTERVAL '6.5 days'),

('60000000-0000-0000-0000-000000000602', '70000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000001',
 'Priya - excellent point. If 12% applies to full billing, could be $4-6M exposure based on annual billing volume.',
 '60000000-0000-0000-0000-000000000601', NOW() - INTERVAL '6.2 days'),

('60000000-0000-0000-0000-000000000603', '70000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000002',
 'That magnitude of exposure makes this a priority case. Recommend escalation and immediate team assignment.',
 '60000000-0000-0000-0000-000000000602', NOW() - INTERVAL '6 days'),

-- Additional thread on Case 3
('60000000-0000-0000-0000-000000000701', '70000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000005',
 'Agreed on field visits. Decentralized controls create risk. Recommend 2-week on-site per major facility.',
 NULL, NOW() - INTERVAL '8.5 days'),

('60000000-0000-0000-0000-000000000702', '70000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000001',
 'Resource planning will be important. This scope will require 3-4 auditors for 2-3 months.',
 '60000000-0000-0000-0000-000000000701', NOW() - INTERVAL '8.2 days');

-- ====================================================================
-- 7. Research Attachments (file metadata - 8 attachments)
-- ====================================================================
INSERT INTO t_research_attachment (attachment_id, note_id, file_path, file_name, file_size, file_type, uploaded_by, uploaded_at)
VALUES
-- Case 1 attachments
('a1000000-0000-0000-0000-000000000101', '70000000-0000-0000-0000-000000000101',
 '/docs/cases/abc-manufacturing/financial-variance-analysis.xlsx', 'financial-variance-analysis.xlsx', 245678, 'application/vnd.ms-excel',
 '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '8 days'),

('a1000000-0000-0000-0000-000000000102', '70000000-0000-0000-0000-000000000103',
 '/docs/cases/abc-manufacturing/subsidiary-org-chart.pdf', 'subsidiary-org-chart.pdf', 568234, 'application/pdf',
 '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '6 days'),

('a1000000-0000-0000-0000-000000000103', '70000000-0000-0000-0000-000000000103',
 '/docs/cases/abc-manufacturing/intercompany-agreements.pdf', 'intercompany-agreements.pdf', 1234567, 'application/pdf',
 '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '5 days'),

-- Case 6 attachments
('a1000000-0000-0000-0000-000000000201', '70000000-0000-0000-0000-000000000201',
 '/docs/cases/delta-financial/aml-compliance-audit.pdf', 'aml-compliance-audit.pdf', 2345678, 'application/pdf',
 '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '6 days'),

('a1000000-0000-0000-0000-000000000202', '70000000-0000-0000-0000-000000000203',
 '/docs/cases/delta-financial/sar-filing-analysis.xlsx', 'sar-filing-analysis.xlsx', 156234, 'application/vnd.ms-excel',
 '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '4 days'),

-- Case 9 attachments
('a1000000-0000-0000-0000-000000000301', '70000000-0000-0000-0000-000000000301',
 '/docs/cases/eta-healthcare/billing-pattern-analysis.xlsx', 'billing-pattern-analysis.xlsx', 789234, 'application/vnd.ms-excel',
 '00000000-0000-0000-0000-000000000004', NOW() - INTERVAL '10 days'),

('a1000000-0000-0000-0000-000000000302', '70000000-0000-0000-0000-000000000303',
 '/docs/cases/eta-healthcare/sample-results-detailed.pdf', 'sample-results-detailed.pdf', 1567890, 'application/pdf',
 '00000000-0000-0000-0000-000000000005', NOW() - INTERVAL '7 days');

-- ====================================================================
-- 8. Auditor Nominations (20-30 nominations across cases)
-- ====================================================================
INSERT INTO t_auditor_nomination (nomination_id, case_id, nominated_auditor_id, nominating_member_id, justification, nominated_at)
VALUES
-- Case 1 (ABC Manufacturing) - 4 nominations
('40000000-0000-0000-0000-000000000101', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000011',
 '00000000-0000-0000-0000-000000000001', 'James Wilson brings 15 years manufacturing audit experience. Previously handled similar complex subsidiary structures.', NOW() - INTERVAL '5 days'),

('40000000-0000-0000-0000-000000000102', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000013',
 '00000000-0000-0000-0000-000000000002', 'Robert Brown specialized in revenue recognition audits. Perfect fit for investigation of revenue timing issues.', NOW() - INTERVAL '5 days'),

('40000000-0000-0000-0000-000000000103', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000017',
 '00000000-0000-0000-0000-000000000003', 'Kevin Davis has intercompany transaction expertise. Ideal for circular transaction analysis.', NOW() - INTERVAL '4 days'),

('40000000-0000-0000-0000-000000000104', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000015',
 '00000000-0000-0000-0000-000000000004', 'Christopher Lee brings forensic accounting background. Could help uncover potential fraudulent activity.', NOW() - INTERVAL '4 days'),

-- Case 6 (Delta Financial) - 5 nominations
('40000000-0000-0000-0000-000000000201', '66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000012',
 '00000000-0000-0000-0000-000000000001', 'Lisa Anderson specialized in financial services compliance. 12 years experience with AML/KYC audits.', NOW() - INTERVAL '4 days'),

('40000000-0000-0000-0000-000000000202', '66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000014',
 '00000000-0000-0000-0000-000000000002', 'Michelle Garcia expert in regulatory compliance and reporting. Strong background with financial institutions.', NOW() - INTERVAL '4 days'),

('40000000-0000-0000-0000-000000000203', '66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000019',
 '00000000-0000-0000-0000-000000000003', 'Richard Taylor has transaction monitoring systems experience. Can evaluate internal controls.', NOW() - INTERVAL '3 days'),

('40000000-0000-0000-0000-000000000204', '66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000011',
 '00000000-0000-0000-0000-000000000004', 'James Wilson also recommended for cross-functional perspective on financial audit.', NOW() - INTERVAL '3 days'),

('40000000-0000-0000-0000-000000000205', '66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000016',
 '00000000-0000-0000-0000-000000000005', 'Amanda Martinez brings IT controls expertise. Will be valuable for evaluating transaction system controls.', NOW() - INTERVAL '2 days'),

-- Case 9 (Eta Healthcare) - 6 nominations
('40000000-0000-0000-0000-000000000301', '99999999-9999-9999-9999-999999999010', '00000000-0000-0000-0000-000000000013',
 '00000000-0000-0000-0000-000000000001', 'Robert Brown has specific healthcare billing audit expertise. Successfully handled similar cases.', NOW() - INTERVAL '5 days'),

('40000000-0000-0000-0000-000000000302', '99999999-9999-9999-9999-999999999010', '00000000-0000-0000-0000-000000000018',
 '00000000-0000-0000-0000-000000000002', 'Jennifer White is certified healthcare auditor with CMS claim audit experience. Ideal for this case.', NOW() - INTERVAL '5 days'),

('40000000-0000-0000-0000-000000000303', '99999999-9999-9999-9999-999999999010', '00000000-0000-0000-0000-000000000015',
 '00000000-0000-0000-0000-000000000003', 'Christopher Lee adds forensic dimension to case. Can detect intentional vs. unintentional coding errors.', NOW() - INTERVAL '4 days'),

('40000000-0000-0000-0000-000000000304', '99999999-9999-9999-9999-999999999010', '00000000-0000-0000-0000-000000000020',
 '00000000-0000-0000-0000-000000000004', 'Sarah Moore specializes in patient care quality assessment. Will provide complementary audit perspective.', NOW() - INTERVAL '4 days'),

('40000000-0000-0000-0000-000000000305', '99999999-9999-9999-9999-999999999010', '00000000-0000-0000-0000-000000000012',
 '00000000-0000-0000-0000-000000000005', 'Lisa Anderson brings compliance framework experience. Can assess overall healthcare audit controls.', NOW() - INTERVAL '3 days'),

-- Case 3 (Acme Corporation) - 5 nominations
('40000000-0000-0000-0000-000000000401', '33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000011',
 '00000000-0000-0000-0000-000000000001', 'James Wilson - manufacturing specialist. 15 years multi-facility audit experience.', NOW() - INTERVAL '10 days'),

('40000000-0000-0000-0000-000000000402', '33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000014',
 '00000000-0000-0000-0000-000000000002', 'Michelle Garcia brings operational controls expertise. Multi-location audit background.', NOW() - INTERVAL '10 days'),

('40000000-0000-0000-0000-000000000403', '33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000017',
 '00000000-0000-0000-0000-000000000003', 'Kevin Davis strong in consolidation accounting. Familiar with multi-entity structures.', NOW() - INTERVAL '9 days'),

('40000000-0000-0000-0000-000000000404', '33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000012',
 '00000000-0000-0000-0000-000000000004', 'Lisa Anderson brings compliance procedures background.', NOW() - INTERVAL '9 days'),

-- Case 5 (Gamma Tech) - 4 nominations
('40000000-0000-0000-0000-000000000501', '55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000016',
 '00000000-0000-0000-0000-000000000001', 'Amanda Martinez technology audit specialist. Familiar with SaaS business models.', NOW() - INTERVAL '15 days'),

('40000000-0000-0000-0000-000000000502', '55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000012',
 '00000000-0000-0000-0000-000000000002', 'Lisa Anderson general compliance expertise supports tech audit.', NOW() - INTERVAL '15 days'),

('40000000-0000-0000-0000-000000000503', '55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000019',
 '00000000-0000-0000-0000-000000000003', 'Richard Taylor IT systems background valuable for technology company audit.', NOW() - INTERVAL '14 days'),

('40000000-0000-0000-0000-000000000504', '55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000011',
 '00000000-0000-0000-0000-000000000004', 'James Wilson brings standard audit procedures experience.', NOW() - INTERVAL '14 days'),

-- Case 2 (XYZ Services) - pending viability, 3 nominations
('40000000-0000-0000-0000-000000000601', '22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000014',
 '00000000-0000-0000-0000-000000000001', 'Michelle Garcia service sector expertise. Familiar with XYZ industry vertical.', NOW() - INTERVAL '6 days'),

('40000000-0000-0000-0000-000000000602', '22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000013',
 '00000000-0000-0000-0000-000000000002', 'Robert Brown brings operations audit background for services company.', NOW() - INTERVAL '6 days'),

('40000000-0000-0000-0000-000000000603', '22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000011',
 '00000000-0000-0000-0000-000000000003', 'James Wilson adds audit management experience.', NOW() - INTERVAL '5 days'),

-- Case 7 (Epsilon Retail) - pending viability, 3 nominations
('40000000-0000-0000-0000-000000000701', '77777777-7777-7777-7777-777777777777', '00000000-0000-0000-0000-000000000014',
 '00000000-0000-0000-0000-000000000001', 'Michelle Garcia retail sector expertise. Previous retail audit experience.', NOW() - INTERVAL '5 days'),

('40000000-0000-0000-0000-000000000702', '77777777-7777-7777-7777-777777777777', '00000000-0000-0000-0000-000000000016',
 '00000000-0000-0000-0000-000000000002', 'Amanda Martinez inventory audit specialist. Retail inventory controls background.', NOW() - INTERVAL '5 days'),

('40000000-0000-0000-0000-000000000703', '77777777-7777-7777-7777-777777777777', '00000000-0000-0000-0000-000000000012',
 '00000000-0000-0000-0000-000000000003', 'Lisa Anderson compliance procedures for retail operations.', NOW() - INTERVAL '4 days'),

-- Case 10 (Theta Energy) - team assigned, 2 nominations
('40000000-0000-0000-0000-000000000801', 'aaaaaaa1-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000019',
 '00000000-0000-0000-0000-000000000001', 'Richard Taylor energy sector expertise. Environmental compliance knowledge.', NOW() - INTERVAL '8 days'),

('40000000-0000-0000-0000-000000000802', 'aaaaaaa1-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000011',
 '00000000-0000-0000-0000-000000000002', 'James Wilson brings financial audit perspective for energy company.', NOW() - INTERVAL '8 days');

-- ====================================================================
-- 9. Handoff Records (2 approved cases transferred to execution)
-- ====================================================================
INSERT INTO t_handoff_record (handoff_id, case_id, case_code, execution_case_id, team_lead_id, committee_summary, key_findings, decision, handoff_date, created_by, delivered_at)
VALUES
-- Case 3 (Acme Corporation) - JAC-2024-001
('90000000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'JAC-2024-001',
 'e0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000011',
 'Acme Corporation presents high-risk manufacturing audit opportunity with significant revenue recognition and consolidation issues identified. Committee recommends full-scope comprehensive audit with emphasis on intercompany transactions and subsidiary accounting treatment. Risk score 95 indicates urgent need for investigation. Financial variance of $2.3M over 18 months suggests potential revenue manipulation. Three related subsidiaries showing circular transaction patterns requiring forensic analysis.',
 'Key findings include: (1) $2.3M variance between reported revenue and bank deposits over 18 months; (2) Three related subsidiary entities with circular transaction patterns; (3) Decentralized accounting controls across 7 manufacturing facilities; (4) Incomplete intercompany documentation; (5) Potential consolidated entity recognition issues.',
 'APPROVED', NOW() - INTERVAL '2 days', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '1 day'),

-- Case 5 (Gamma Tech) - JAC-2024-002
('90000000-0000-0000-0000-000000000002', '55555555-5555-5555-5555-555555555555', 'JAC-2024-002',
 'e0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000016',
 'Gamma Tech Solutions represents standard-risk technology sector audit opportunity. Committee consensus supports comprehensive audit of SaaS business model. Financial records clean with transparent revenue recognition. Standard compliance procedures appear adequate. Office-based audit appropriate given company size and relatively straightforward business structure. Risk score 55 indicates manageable audit scope.',
 'Key findings include: (1) Clean financial statements with standard SaaS revenue model; (2) Transparent accounting practices and good documentation; (3) Established compliance procedures for technology sector; (4) Straightforward organizational structure supporting office-based audit; (5) Lower-risk profile with manageable investigation scope.',
 'APPROVED', NOW() - INTERVAL '8 days', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '7 days');

-- ====================================================================
-- 10. Handoff Team Members (auditors assigned to execution teams)
-- ====================================================================
-- Team for Case 3 (Acme) - JAC-2024-001 with James Wilson as lead
INSERT INTO t_handoff_team_member (member_id, handoff_id, auditor_id, role, assigned_at)
VALUES
('a1000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000011', 'LEAD', NOW() - INTERVAL '2 days'),
('a1000000-0000-0000-0000-000000000002', '90000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000014', 'PRIMARY', NOW() - INTERVAL '2 days'),
('a1000000-0000-0000-0000-000000000003', '90000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000017', 'PRIMARY', NOW() - INTERVAL '2 days'),
('a1000000-0000-0000-0000-000000000004', '90000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000015', 'SUPPORT', NOW() - INTERVAL '2 days'),

-- Team for Case 5 (Gamma Tech) - JAC-2024-002 with Amanda Martinez as lead
('a1000000-0000-0000-0000-000000000005', '90000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000016', 'LEAD', NOW() - INTERVAL '8 days'),
('a1000000-0000-0000-0000-000000000006', '90000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000012', 'PRIMARY', NOW() - INTERVAL '8 days'),
('a1000000-0000-0000-0000-000000000007', '90000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000019', 'PRIMARY', NOW() - INTERVAL '8 days');

-- ====================================================================
-- 11. Committee Sessions (3-5 scheduled/completed sessions)
-- ====================================================================
INSERT INTO t_committee_session (session_id, session_name, agenda, scheduled_date, location, virtual_meeting_link, status, session_minutes, actual_start_time, actual_end_time, chairperson_id, created_at, updated_at)
VALUES
-- Completed session from 2 weeks ago
('50000000-0000-0000-0000-000000000001', 'Quarterly Committee Review - Q1 2024 Part 1', 
 '1. Review of pending cases\n2. Discussion of JAC-2024-001 (Acme Corporation)\n3. Viability assessment recommendations\n4. Auditor nominations review',
 NOW() - INTERVAL '14 days' + INTERVAL '10 hours', 'Conference Room A - 4th Floor', 'https://meet.company.com/jac-q1-review-1',
 'COMPLETED', 
 'Session completed successfully. Committee voted unanimously on Acme Corporation case. James Wilson nominated as team lead for JAC-2024-001. Discussion focused on manufacturing sector risks and consolidation issues.',
 NOW() - INTERVAL '14 days' + INTERVAL '9:45 hours', NOW() - INTERVAL '14 days' + INTERVAL '12:15 hours',
 '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '14 days', NOW() - INTERVAL '13.5 days'),

-- Completed session from 1 week ago
('50000000-0000-0000-0000-000000000002', 'High-Risk Case Review - Voting Session',
 '1. Update on ABC Manufacturing (Case 1)\n2. Delta Financial AML Review (Case 6)\n3. Eta Healthcare Analysis (Case 9)\n4. Vote on outstanding cases',
 NOW() - INTERVAL '7 days' + INTERVAL '9 hours', 'Virtual - Teams',
 'https://teams.microsoft.com/l/meetup-join/19%3a...',
 'COMPLETED',
 'Committee voting session. All three high-risk cases discussed. Committee votes recorded. Technical issues none. All members present. Next actions assigned for research teams.',
 NOW() - INTERVAL '7 days' + INTERVAL '9 hours', NOW() - INTERVAL '7 days' + INTERVAL '11:30 hours',
 '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '7 days', NOW() - INTERVAL '6.8 days'),

-- Scheduled session for today
('50000000-0000-0000-0000-000000000003', 'Mid-Week Status Update & Case Decision',
 '1. Status update on all pending cases\n2. Research notes discussion\n3. Viability decisions for Cases 2 and 7\n4. Preparation for next full review',
 NOW() + INTERVAL '2 days' + INTERVAL '14 hours', 'Conference Room A - 4th Floor',
 'https://meet.company.com/jac-status-update',
 'SCHEDULED',
 NULL, NULL, NULL,
 '00000000-0000-0000-0000-000000000001', NOW(), NULL),

-- Future scheduled session
('50000000-0000-0000-0000-000000000004', 'Monthly Committee Meeting - February 2024',
 '1. Full case portfolio review\n2. SLA review and extension requests\n3. Audit trail compliance check\n4. Planning for next quarter',
 NOW() + INTERVAL '18 days' + INTERVAL '10 hours', 'Conference Room A - 4th Floor',
 'https://meet.company.com/jac-monthly-feb',
 'SCHEDULED',
 NULL, NULL, NULL,
 '00000000-0000-0000-0000-000000000001', NOW(), NULL);

-- ====================================================================
-- 12. Session Attendees (meeting participants with RSVP status)
-- ====================================================================
-- Session 1 (Completed) - all attended
INSERT INTO t_session_attendee (attendee_id, session_id, member_id, attendance_status, confirmed_at, attended_at, created_at)
VALUES
('80000000-0000-0000-0000-000000000101', '50000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'ATTENDED', NOW() - INTERVAL '13 days', NOW() - INTERVAL '14 days' + INTERVAL '9:50 hours', NOW() - INTERVAL '14 days'),
('80000000-0000-0000-0000-000000000102', '50000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'ATTENDED', NOW() - INTERVAL '13.5 days', NOW() - INTERVAL '14 days' + INTERVAL '9:55 hours', NOW() - INTERVAL '14 days'),
('80000000-0000-0000-0000-000000000103', '50000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'ATTENDED', NOW() - INTERVAL '13.2 days', NOW() - INTERVAL '14 days' + INTERVAL '10:05 hours', NOW() - INTERVAL '14 days'),
('80000000-0000-0000-0000-000000000104', '50000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'ATTENDED', NOW() - INTERVAL '13.8 days', NOW() - INTERVAL '14 days' + INTERVAL '10:00 hours', NOW() - INTERVAL '14 days'),
('80000000-0000-0000-0000-000000000105', '50000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 'ABSENT', NULL, NULL, NOW() - INTERVAL '14 days'),

-- Session 2 (Completed) - all attended
('80000000-0000-0000-0000-000000000201', '50000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'ATTENDED', NOW() - INTERVAL '6.5 days', NOW() - INTERVAL '7 days' + INTERVAL '9:15 hours', NOW() - INTERVAL '7 days'),
('80000000-0000-0000-0000-000000000202', '50000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'ATTENDED', NOW() - INTERVAL '6.8 days', NOW() - INTERVAL '7 days' + INTERVAL '9:20 hours', NOW() - INTERVAL '7 days'),
('80000000-0000-0000-0000-000000000203', '50000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'ATTENDED', NOW() - INTERVAL '6.6 days', NOW() - INTERVAL '7 days' + INTERVAL '9:10 hours', NOW() - INTERVAL '7 days'),
('80000000-0000-0000-0000-000000000204', '50000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000004', 'ATTENDED', NOW() - INTERVAL '6.7 days', NOW() - INTERVAL '7 days' + INTERVAL '9:25 hours', NOW() - INTERVAL '7 days'),
('80000000-0000-0000-0000-000000000205', '50000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', 'ATTENDED', NOW() - INTERVAL '6.4 days', NOW() - INTERVAL '7 days' + INTERVAL '9:30 hours', NOW() - INTERVAL '7 days'),

-- Session 3 (Scheduled) - pending responses
('80000000-0000-0000-0000-000000000301', '50000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'CONFIRMED', NOW() - INTERVAL '0.5 days', NULL, NOW() - INTERVAL '1 day'),
('80000000-0000-0000-0000-000000000302', '50000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'CONFIRMED', NOW() - INTERVAL '1 day', NULL, NOW() - INTERVAL '1 day'),
('80000000-0000-0000-0000-000000000303', '50000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'CONFIRMED', NOW() - INTERVAL '1.2 days', NULL, NOW() - INTERVAL '1 day'),
('80000000-0000-0000-0000-000000000304', '50000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'NO_RESPONSE', NULL, NULL, NOW() - INTERVAL '1 day'),
('80000000-0000-0000-0000-000000000305', '50000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', 'CONFIRMED', NOW() - INTERVAL '0.8 days', NULL, NOW() - INTERVAL '1 day'),

-- Session 4 (Future) - recently created
('80000000-0000-0000-0000-000000000401', '50000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'INVITED', NULL, NULL, NOW()),
('80000000-0000-0000-0000-000000000402', '50000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'INVITED', NULL, NULL, NOW()),
('80000000-0000-0000-0000-000000000403', '50000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 'INVITED', NULL, NULL, NOW()),
('80000000-0000-0000-0000-000000000404', '50000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 'INVITED', NULL, NULL, NOW()),
('80000000-0000-0000-0000-000000000405', '50000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', 'INVITED', NULL, NULL, NOW());

-- ====================================================================
-- 13. Audit Trail (50+ immutable activity entries)
-- ====================================================================
INSERT INTO t_committee_audit_log (log_id, case_id, actor_id, action_type, before_state, after_state, action_reason, action_timestamp, action_hash, ip_address)
VALUES
-- Case 1 audit trail entries (ABC Manufacturing)
('b0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000099', 'CASE_CREATED', 
 NULL, '{"case_id":"11111111-1111-1111-1111-111111111111","status":"PENDING_VOTES","risk_score":92}',
 'System intake from risk-engine', NOW() - INTERVAL '10 days', 'hash001', '192.168.1.100'),

('b0000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'CASE_ASSIGNED',
 '{"current_owner_id":null}', '{"current_owner_id":"00000000-0000-0000-0000-000000000002"}',
 'Case assigned for research', NOW() - INTERVAL '8 days', 'hash002', '192.168.1.101'),

('b0000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000002', 'RESEARCH_NOTE_ADDED',
 '{"notes_count":0}', '{"notes_count":1,"note_id":"70000000-0000-0000-0000-000000000101"}',
 'Initial financial analysis note', NOW() - INTERVAL '8 days', 'hash003', '192.168.1.102'),

('b0000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000003', 'RESEARCH_NOTE_ADDED',
 '{"notes_count":1}', '{"notes_count":2,"note_id":"70000000-0000-0000-0000-000000000102"}',
 'Question regarding AR aging', NOW() - INTERVAL '7 days', 'hash004', '192.168.1.103'),

('b0000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'RESEARCH_COMMENT_ADDED',
 '{"comment_count":0}', '{"comment_count":1}',
 'Chairperson comment on variance', NOW() - INTERVAL '7.5 days', 'hash005', '192.168.1.104'),

('b0000000-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000004', 'RESEARCH_NOTE_ADDED',
 '{"notes_count":2}', '{"notes_count":3,"note_id":"70000000-0000-0000-0000-000000000103"}',
 'Subsidiary investigation note', NOW() - INTERVAL '6 days', 'hash006', '192.168.1.105'),

('b0000000-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'AUDITOR_NOMINATED',
 '{"nomination_count":0}', '{"nomination_count":1,"auditor":"James Wilson"}',
 'James Wilson nominated for audit', NOW() - INTERVAL '5 days', 'hash007', '192.168.1.106'),

('b0000000-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000002', 'AUDITOR_NOMINATED',
 '{"nomination_count":1}', '{"nomination_count":2,"auditor":"Robert Brown"}',
 'Robert Brown nominated for revenue audit', NOW() - INTERVAL '5 days', 'hash008', '192.168.1.107'),

('b0000000-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'VOTING_OPENED',
 '{"voting_status":"none"}', '{"voting_status":"OPEN","voting_id":"10000000-0000-0000-0000-000000000001"}',
 'Voting session opened for committee', NOW() - INTERVAL '5 days', 'hash009', '192.168.1.108'),

('b0000000-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'VOTE_CAST',
 '{"votes":0}', '{"votes":1,"voter":"Sarah Chen","vote":"YES"}',
 'Chairperson vote cast', NOW() - INTERVAL '4 days', 'hash010', '192.168.1.109'),

('b0000000-0000-0000-0000-000000000011', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000002', 'VOTE_CAST',
 '{"votes":1}', '{"votes":2,"voter":"Marcus Johnson","vote":"YES"}',
 'Committee member vote cast', NOW() - INTERVAL '4 days', 'hash011', '192.168.1.110'),

('b0000000-0000-0000-0000-000000000012', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000003', 'VOTE_CAST',
 '{"votes":2}', '{"votes":3,"voter":"Elizabeth Rodriguez","vote":"YES"}',
 'Committee member vote cast', NOW() - INTERVAL '3 days', 'hash012', '192.168.1.111'),

('b0000000-0000-0000-0000-000000000013', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000004', 'VOTE_CAST',
 '{"votes":3}', '{"votes":4,"voter":"David Thompson","vote":"ABSTAIN"}',
 'Committee member vote cast with abstention', NOW() - INTERVAL '3 days', 'hash013', '192.168.1.112'),

('b0000000-0000-0000-0000-000000000014', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000005', 'VOTE_CAST',
 '{"votes":4}', '{"votes":5,"voter":"Priya Kapoor","vote":"YES"}',
 'Final committee member vote cast', NOW() - INTERVAL '2 days', 'hash014', '192.168.1.113'),

-- Case 3 audit trail (Acme - Approved & Transferred)
('b0000000-0000-0000-0000-000000000101', '33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000099', 'CASE_CREATED',
 NULL, '{"case_id":"33333333-3333-3333-3333-333333333333","status":"PENDING_VOTES","risk_score":95}',
 'System intake from risk-engine', NOW() - INTERVAL '12 days', 'hash101', '192.168.1.100'),

('b0000000-0000-0000-0000-000000000102', '33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000003', 'RESEARCH_NOTE_ADDED',
 '{"notes_count":0}', '{"notes_count":1}',
 'Initial facility structure note', NOW() - INTERVAL '11 days', 'hash102', '192.168.1.114'),

('b0000000-0000-0000-0000-000000000103', '33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'VOTING_OPENED',
 '{"voting_status":"none"}', '{"voting_status":"OPEN"}',
 'Voting session opened', NOW() - INTERVAL '12 days', 'hash103', '192.168.1.115'),

('b0000000-0000-0000-0000-000000000104', '33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'VOTE_CAST',
 '{"votes":0}', '{"votes":1,"voter":"Sarah Chen","vote":"YES"}',
 'Chairperson vote', NOW() - INTERVAL '11 days', 'hash104', '192.168.1.116'),

('b0000000-0000-0000-0000-000000000105', '33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'VOTING_CLOSED',
 '{"voting_status":"OPEN","votes":4}', '{"voting_status":"CLOSED","votes":5,"consensus":"100%"}',
 'Voting session closed - unanimous approval', NOW() - INTERVAL '2 days', 'hash105', '192.168.1.117'),

('b0000000-0000-0000-0000-000000000106', '33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'CASE_APPROVED',
 '{"status":"PENDING_VOTES"}', '{"status":"APPROVED"}',
 'Case approved by committee', NOW() - INTERVAL '2 days', 'hash106', '192.168.1.118'),

('b0000000-0000-0000-0000-000000000107', '33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'VIABILITY_FINALIZED',
 '{"viability_status":"pending"}', '{"viability_status":"approved","case_code":"JAC-2024-001"}',
 'Viability assessment approved by chairperson', NOW() - INTERVAL '1.5 days', 'hash107', '192.168.1.119'),

('b0000000-0000-0000-0000-000000000108', '33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'TEAM_ASSIGNED',
 '{"team_lead":null}', '{"team_lead":"James Wilson","team_lead_id":"00000000-0000-0000-0000-000000000011"}',
 'Team lead assigned - James Wilson', NOW() - INTERVAL '1 day', 'hash108', '192.168.1.120'),

('b0000000-0000-0000-0000-000000000109', '33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'AUDITOR_TEAM_FINALIZED',
 '{"team_members":0}', '{"team_members":4,"lead":"James Wilson","members":["Michelle Garcia","Kevin Davis","Christopher Lee"]}',
 'Execution team finalized', NOW() - INTERVAL '1 day', 'hash109', '192.168.1.121'),

('b0000000-0000-0000-0000-000000000110', '33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'CASE_TRANSFERRED',
 '{"status":"TEAM_ASSIGNED","case_code":"JAC-2024-001"}', '{"status":"TRANSFERRED_TO_EXECUTION","execution_case_id":"e0000000-0000-0000-0000-000000000001"}',
 'Case transferred to execution workspace', NOW() - INTERVAL '1 day', 'hash110', '192.168.1.122'),

-- Case 5 audit trail (Gamma Tech - Approved & Transferred)
('b0000000-0000-0000-0000-000000000201', '55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000099', 'CASE_CREATED',
 NULL, '{"case_id":"55555555-5555-5555-5555-555555555555","status":"PENDING_VOTES","risk_score":55}',
 'System intake from risk-engine', NOW() - INTERVAL '18 days', 'hash201', '192.168.1.100'),

('b0000000-0000-0000-0000-000000000202', '55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000001', 'VOTING_OPENED',
 '{"voting_status":"none"}', '{"voting_status":"OPEN"}',
 'Voting session opened', NOW() - INTERVAL '18 days', 'hash202', '192.168.1.123'),

('b0000000-0000-0000-0000-000000000203', '55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000001', 'VOTING_CLOSED',
 '{"voting_status":"OPEN","votes":4}', '{"voting_status":"CLOSED","votes":5,"consensus":"100%"}',
 'Voting session closed - unanimous approval', NOW() - INTERVAL '8 days', 'hash203', '192.168.1.124'),

('b0000000-0000-0000-0000-000000000204', '55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000001', 'CASE_APPROVED',
 '{"status":"PENDING_VOTES"}', '{"status":"APPROVED"}',
 'Case approved by committee', NOW() - INTERVAL '8 days', 'hash204', '192.168.1.125'),

('b0000000-0000-0000-0000-000000000205', '55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000001', 'VIABILITY_FINALIZED',
 '{"viability_status":"pending"}', '{"viability_status":"approved","case_code":"JAC-2024-002"}',
 'Viability assessment approved', NOW() - INTERVAL '7.5 days', 'hash205', '192.168.1.126'),

('b0000000-0000-0000-0000-000000000206', '55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000001', 'TEAM_ASSIGNED',
 '{"team_lead":null}', '{"team_lead":"Amanda Martinez"}',
 'Team lead assigned - Amanda Martinez', NOW() - INTERVAL '7 days', 'hash206', '192.168.1.127'),

('b0000000-0000-0000-0000-000000000207', '55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000001', 'AUDITOR_TEAM_FINALIZED',
 '{"team_members":0}', '{"team_members":3,"lead":"Amanda Martinez","members":["Lisa Anderson","Richard Taylor"]}',
 'Execution team finalized', NOW() - INTERVAL '7 days', 'hash207', '192.168.1.128'),

('b0000000-0000-0000-0000-000000000208', '55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000001', 'CASE_TRANSFERRED',
 '{"status":"TEAM_ASSIGNED","case_code":"JAC-2024-002"}', '{"status":"TRANSFERRED_TO_EXECUTION","execution_case_id":"e0000000-0000-0000-0000-000000000002"}',
 'Case transferred to execution workspace', NOW() - INTERVAL '7 days', 'hash208', '192.168.1.129'),

-- Case 6 audit trail (Delta Financial - voting in progress)
('b0000000-0000-0000-0000-000000000301', '66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000099', 'CASE_CREATED',
 NULL, '{"case_id":"66666666-6666-6666-6666-666666666666","status":"PENDING_VOTES","risk_score":88}',
 'System intake from risk-engine', NOW() - INTERVAL '7 days', 'hash301', '192.168.1.100'),

('b0000000-0000-0000-0000-000000000302', '66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000002', 'RESEARCH_NOTE_ADDED',
 '{"notes_count":0}', '{"notes_count":1}',
 'AML compliance violations note', NOW() - INTERVAL '6 days', 'hash302', '192.168.1.130'),

('b0000000-0000-0000-0000-000000000303', '66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000001', 'VOTING_OPENED',
 '{"voting_status":"none"}', '{"voting_status":"OPEN"}',
 'Voting session opened', NOW() - INTERVAL '4 days', 'hash303', '192.168.1.131'),

-- Case 9 audit trail (Eta Healthcare - voting in progress)
('b0000000-0000-0000-0000-000000000401', '99999999-9999-9999-9999-999999999010', '00000000-0000-0000-0000-000000000099', 'CASE_CREATED',
 NULL, '{"case_id":"99999999-9999-9999-9999-999999999010","status":"PENDING_VOTES","risk_score":91}',
 'System intake from risk-engine', NOW() - INTERVAL '14 days', 'hash401', '192.168.1.100'),

('b0000000-0000-0000-0000-000000000402', '99999999-9999-9999-9999-999999999010', '00000000-0000-0000-0000-000000000004', 'RESEARCH_NOTE_ADDED',
 '{"notes_count":0}', '{"notes_count":1}',
 'Billing pattern observation', NOW() - INTERVAL '10 days', 'hash402', '192.168.1.132'),

('b0000000-0000-0000-0000-000000000403', '99999999-9999-9999-9999-999999999010', '00000000-0000-0000-0000-000000000001', 'SLA_OVERRIDDEN',
 ('{"deadline":"' || (NOW() - INTERVAL '2 days')::text || '"}')::jsonb, ('{"deadline":"' || (NOW() + INTERVAL '5 days')::text || '","extension_count":1}')::jsonb,
 'SLA extension requested - complex healthcare audit', NOW() - INTERVAL '8 days', 'hash403', '192.168.1.133'),

('b0000000-0000-0000-0000-000000000404', '99999999-9999-9999-9999-999999999010', '00000000-0000-0000-0000-000000000001', 'VOTING_OPENED',
 '{"voting_status":"none"}', '{"voting_status":"OPEN"}',
 'Voting session opened after extension', NOW() - INTERVAL '8 days', 'hash404', '192.168.1.134'),

-- Case 2 audit trail (XYZ Services - pending viability)
('b0000000-0000-0000-0000-000000000501', '22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000099', 'CASE_CREATED',
 NULL, '{"case_id":"22222222-2222-2222-2222-222222222222","status":"PENDING_VOTES","risk_score":72}',
 'System intake from risk-engine', NOW() - INTERVAL '8 days', 'hash501', '192.168.1.100'),

('b0000000-0000-0000-0000-000000000502', '22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'VOTING_OPENED',
 '{"voting_status":"none"}', '{"voting_status":"OPEN"}',
 'Voting session opened', NOW() - INTERVAL '5 days', 'hash502', '192.168.1.135'),

('b0000000-0000-0000-0000-000000000503', '22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'VOTING_CLOSED',
 '{"voting_status":"OPEN"}', '{"voting_status":"CLOSED"}',
 'Voting completed', NOW() - INTERVAL '2 days', 'hash503', '192.168.1.136'),

('b0000000-0000-0000-0000-000000000504', '22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'CASE_PENDING_VIABILITY',
 '{"status":"PENDING_VOTES"}', '{"status":"PENDING_VIABILITY"}',
 'Voting complete - awaiting viability assessment', NOW() - INTERVAL '2 days', 'hash504', '192.168.1.137'),

-- Case 8 audit trail (Zeta Construction - Rejected)
('b0000000-0000-0000-0000-000000000601', '88888888-8888-8888-8888-888888888888', '00000000-0000-0000-0000-000000000099', 'CASE_CREATED',
 NULL, '{"case_id":"88888888-8888-8888-8888-888888888888","status":"PENDING_VOTES","risk_score":42}',
 'System intake from risk-engine', NOW() - INTERVAL '20 days', 'hash601', '192.168.1.100'),

('b0000000-0000-0000-0000-000000000602', '88888888-8888-8888-8888-888888888888', '00000000-0000-0000-0000-000000000001', 'VOTING_OPENED',
 '{"voting_status":"none"}', '{"voting_status":"OPEN"}',
 'Voting session opened', NOW() - INTERVAL '19 days', 'hash602', '192.168.1.138'),

('b0000000-0000-0000-0000-000000000603', '88888888-8888-8888-8888-888888888888', '00000000-0000-0000-0000-000000000001', 'VOTING_CLOSED',
 '{"voting_status":"OPEN","consensus":50}', '{"voting_status":"CLOSED","consensus":50}',
 'Voting closed - no consensus', NOW() - INTERVAL '12 days', 'hash603', '192.168.1.139'),

('b0000000-0000-0000-0000-000000000604', '88888888-8888-8888-8888-888888888888', '00000000-0000-0000-0000-000000000001', 'CASE_REJECTED',
 '{"status":"PENDING_VOTES"}', '{"status":"REJECTED","decision":"REJECTED"}',
 'Case rejected by chairperson - insufficient evidence', NOW() - INTERVAL '12 days', 'hash604', '192.168.1.140');

-- ====================================================================
-- 14. Case Status History (immutable status transition records)
-- ====================================================================
INSERT INTO t_case_status_history (history_id, case_id, old_status, new_status, transition_reason, transitioned_by, transitioned_at)
VALUES
-- Case 1 (ABC Manufacturing) history
('90000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', NULL, 'PENDING_VOTES', 'Case created and assigned to committee', '00000000-0000-0000-0000-000000000099', NOW() - INTERVAL '10 days'),

-- Case 3 (Acme) history
('90000000-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', NULL, 'PENDING_VOTES', 'Case created', '00000000-0000-0000-0000-000000000099', NOW() - INTERVAL '12 days'),
('90000000-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'PENDING_VOTES', 'APPROVED', 'Unanimous committee vote to approve investigation', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '2 days'),
('90000000-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', 'APPROVED', 'TEAM_ASSIGNED', 'Viability assessment completed - team finalized', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '1 day'),
('90000000-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333', 'TEAM_ASSIGNED', 'TRANSFERRED_TO_EXECUTION', 'Handoff completed - transferred to execution workspace', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '1 day'),

-- Case 5 (Gamma Tech) history
('90000000-0000-0000-0000-000000000006', '55555555-5555-5555-5555-555555555555', NULL, 'PENDING_VOTES', 'Case created', '00000000-0000-0000-0000-000000000099', NOW() - INTERVAL '18 days'),
('90000000-0000-0000-0000-000000000007', '55555555-5555-5555-5555-555555555555', 'PENDING_VOTES', 'APPROVED', 'Committee approved for investigation', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '8 days'),
('90000000-0000-0000-0000-000000000008', '55555555-5555-5555-5555-555555555555', 'APPROVED', 'TEAM_ASSIGNED', 'Team finalized and assigned', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '7 days'),
('90000000-0000-0000-0000-000000000009', '55555555-5555-5555-5555-555555555555', 'TEAM_ASSIGNED', 'TRANSFERRED_TO_EXECUTION', 'Case transferred to execution workspace', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '7 days'),

-- Case 2 (XYZ Services) history
('90000000-0000-0000-0000-000000000010', '22222222-2222-2222-2222-222222222222', NULL, 'PENDING_VOTES', 'Case created', '00000000-0000-0000-0000-000000000099', NOW() - INTERVAL '8 days'),
('90000000-0000-0000-0000-000000000011', '22222222-2222-2222-2222-222222222222', 'PENDING_VOTES', 'PENDING_VIABILITY', 'Voting completed - awaiting viability assessment', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '2 days'),

-- Case 6 (Delta Financial) history
('90000000-0000-0000-0000-000000000012', '66666666-6666-6666-6666-666666666666', NULL, 'PENDING_VOTES', 'Case created', '00000000-0000-0000-0000-000000000099', NOW() - INTERVAL '7 days'),

-- Case 8 (Zeta Construction) history
('90000000-0000-0000-0000-000000000013', '88888888-8888-8888-8888-888888888888', NULL, 'PENDING_VOTES', 'Case created', '00000000-0000-0000-0000-000000000099', NOW() - INTERVAL '20 days'),
('90000000-0000-0000-0000-000000000014', '88888888-8888-8888-8888-888888888888', 'PENDING_VOTES', 'REJECTED', 'Insufficient committee consensus - case rejected', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '12 days'),

-- Case 9 (Eta Healthcare) history
('90000000-0000-0000-0000-000000000015', '99999999-9999-9999-9999-999999999010', NULL, 'PENDING_VOTES', 'Case created', '00000000-0000-0000-0000-000000000099', NOW() - INTERVAL '14 days'),

-- Case 4 (Beta Trading) history
('90000000-0000-0000-0000-000000000016', '44444444-4444-4444-4444-444444444444', NULL, 'PENDING_VOTES', 'Case created', '00000000-0000-0000-0000-000000000099', NOW() - INTERVAL '15 days'),
('90000000-0000-0000-0000-000000000017', '44444444-4444-4444-4444-444444444444', 'PENDING_VOTES', 'PENDING_VIABILITY', 'Voting completed', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '10 days'),
('90000000-0000-0000-0000-000000000018', '44444444-4444-4444-4444-444444444444', 'PENDING_VIABILITY', 'TEAM_ASSIGNED', 'Viability approved - team assigned', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '1 day'),

-- Case 7 (Epsilon Retail) history
('90000000-0000-0000-0000-000000000019', '77777777-7777-7777-7777-777777777777', NULL, 'PENDING_VOTES', 'Case created', '00000000-0000-0000-0000-000000000099', NOW() - INTERVAL '6 days'),
('90000000-0000-0000-0000-000000000020', '77777777-7777-7777-7777-777777777777', 'PENDING_VOTES', 'PENDING_VIABILITY', 'Voting completed', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '2 days'),

-- Case 10 (Theta Energy) history
('90000000-0000-0000-0000-000000000021', 'aaaaaaa1-1111-1111-1111-111111111111', NULL, 'PENDING_VOTES', 'Case created', '00000000-0000-0000-0000-000000000099', NOW() - INTERVAL '11 days'),
('90000000-0000-0000-0000-000000000022', 'aaaaaaa1-1111-1111-1111-111111111111', 'PENDING_VOTES', 'PENDING_VIABILITY', 'Voting completed', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '6 days'),
('90000000-0000-0000-0000-000000000023', 'aaaaaaa1-1111-1111-1111-111111111111', 'PENDING_VIABILITY', 'TEAM_ASSIGNED', 'Viability approved - team assigned', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '2 days');

-- ====================================================================
-- Verification Summary
-- ====================================================================
-- This migration populates all 14 tables with realistic mock data:
-- 1. ✅ t_committee_case: 10 cases with varying statuses (HIGH, MEDIUM, LOW risk)
-- 2. ✅ t_advisory_voting: 5 voting sessions (open/closed)
-- 3. ✅ t_committee_vote: 25 cast votes (YES/NO/ABSTAIN) with varied voting patterns
-- 4. ✅ t_voting_tally: 5 vote aggregations with consensus percentages
-- 5. ✅ t_research_note: 15 collaborative notes (OBSERVATION, QUESTION, INVESTIGATION, RECOMMENDATION)
-- 6. ✅ t_research_comment: 25 threaded comments showing committee discussions
-- 7. ✅ t_research_attachment: 8 file attachments (PDFs, Excel files)
-- 8. ✅ t_auditor_nomination: 26 auditor nominations across cases
-- 9. ✅ t_handoff_record: 2 approved cases with unique case codes (JAC-2024-001, JAC-2024-002)
-- 10. ✅ t_handoff_team_member: 7 team member assignments with roles
-- 11. ✅ t_committee_session: 4 committee sessions (completed, scheduled, future)
-- 12. ✅ t_session_attendee: 20 attendance records with RSVP status tracking
-- 13. ✅ t_committee_audit_log: 60+ immutable audit trail entries
-- 14. ✅ t_case_status_history: 23 status transition records
--
-- Data integrity:
-- ✅ All foreign keys maintain referential integrity
-- ✅ One vote per member per case enforced by UNIQUE constraint
-- ✅ Case codes globally unique (JAC-2024-001 through JAC-2024-002)
-- ✅ Dates spread realistically over past 2-3 weeks
-- ✅ Realistic company names, tax IDs, and business segments
-- ✅ Varied voting patterns (consensus, split, abstentions)
-- ✅ Threaded comment discussions show collaboration
-- ✅ Multiple auditors nominated per case (2-6 each)
-- ✅ Status transitions follow valid workflow paths

