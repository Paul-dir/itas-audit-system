import { REGIONS, AUDIT_TYPES, TAX_CENTERS, getRiskLevel } from './constants.js';
import { generateCasesFromPlan, getTaxpayersForTaxCenter } from './taxpayers.js';

// ============================================================
// SEED USERS
// ============================================================
export const SEED_USERS = [
  { id: '00000000-0000-0000-0001-000000000001', name: 'Planning Auditor', email: 'planning.auditor1@mor.gov.et', role: 'planning_team', region: null, taxCenter: null, password: 'password123' },
  { id: '00000000-0000-0000-0001-000000000002', name: 'Abebe Tadesse', email: 'abebe.tadesse@mor.gov.et', role: 'planning_team', region: null, taxCenter: null, password: 'password123' },
  { id: '00000000-0000-0000-0002-000000000001', name: 'Tesfaye Bekele', email: 'tesfaye.bekele@mor.gov.et', role: 'audit_director', region: null, taxCenter: null, password: 'password123' },
  { id: '00000000-0000-0000-0003-000000000001', name: 'Rahel Hailu', email: 'rahel.hailu@mor.gov.et', role: 'senior_management', region: null, taxCenter: null, password: 'password123' },
  { id: '00000000-0000-0000-0003-000000000002', name: 'Biruk Assefa', email: 'biruk.assefa@mor.gov.et', role: 'senior_management', region: null, taxCenter: null, password: 'password123' },
  { id: '00000000-0000-0000-0004-000000000001', name: 'Getnet Alemu', email: 'getnet.alemu@mor.gov.et', role: 'regional_director', region: 'addis_ababa', taxCenter: null, password: 'password123' },
  { id: '00000000-0000-0000-0004-000000000002', name: 'Tadesse Kebede', email: 'tadesse.kebede@mor.gov.et', role: 'regional_director', region: 'amhara', taxCenter: null, password: 'password123' },
  { id: '00000000-0000-0000-0004-000000000003', name: 'Gemechu Negash', email: 'gemechu.negash@mor.gov.et', role: 'regional_director', region: 'oromia', taxCenter: null, password: 'password123' },
  { id: '00000000-0000-0000-0004-000000000004', name: 'Kassahun Worku', email: 'kassahun.worku@mor.gov.et', role: 'regional_director', region: 'dire_dawa', taxCenter: null, password: 'password123' },
  { id: '00000000-0000-0000-0004-000000000005', name: 'Yonas Mengistu', email: 'yonas.mengistu@mor.gov.et', role: 'regional_director', region: 'snnpr', taxCenter: null, password: 'password123' },
  { id: '00000000-0000-0000-0004-000000000006', name: 'Ibrahim Hassan', email: 'ibrahim.hassan@mor.gov.et', role: 'regional_director', region: 'somali', taxCenter: null, password: 'password123' },
  { id: '00000000-0000-0000-0005-000000000001', name: 'Manager Addis Ababa TC1', email: 'aa1.manager@mor.gov.et', role: 'tax_center_manager', region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', password: 'password123' },
  { id: '00000000-0000-0000-0005-000000000002', name: 'Manager Addis Ababa TC2', email: 'aa2.manager@mor.gov.et', role: 'tax_center_manager', region: 'addis_ababa', taxCenter: 'addis_ababa-tc2', password: 'password123' },
  { id: '00000000-0000-0000-0005-000000000003', name: 'Manager Addis Ababa TC3', email: 'aa3.manager@mor.gov.et', role: 'tax_center_manager', region: 'addis_ababa', taxCenter: 'addis_ababa-tc3', password: 'password123' },
  { id: '00000000-0000-0000-0005-000000000004', name: 'Manager Oromia TC1', email: 'or1.manager@mor.gov.et', role: 'tax_center_manager', region: 'oromia', taxCenter: 'oromia-tc1', password: 'password123' },
  { id: '00000000-0000-0000-0005-000000000005', name: 'Manager Oromia TC2', email: 'or2.manager@mor.gov.et', role: 'tax_center_manager', region: 'oromia', taxCenter: 'oromia-tc2', password: 'password123' },
  { id: '00000000-0000-0000-0005-000000000006', name: 'Manager Oromia TC3', email: 'or3.manager@mor.gov.et', role: 'tax_center_manager', region: 'oromia', taxCenter: 'oromia-tc3', password: 'password123' },
  { id: '00000000-0000-0000-0005-000000000007', name: 'Manager Amhara TC1', email: 'am1.manager@mor.gov.et', role: 'tax_center_manager', region: 'amhara', taxCenter: 'amhara-tc1', password: 'password123' },
  { id: '00000000-0000-0000-0005-000000000008', name: 'Manager Amhara TC2', email: 'am2.manager@mor.gov.et', role: 'tax_center_manager', region: 'amhara', taxCenter: 'amhara-tc2', password: 'password123' },
  { id: '00000000-0000-0000-0005-000000000009', name: 'Manager Amhara TC3', email: 'am3.manager@mor.gov.et', role: 'tax_center_manager', region: 'amhara', taxCenter: 'amhara-tc3', password: 'password123' },
  { id: '00000000-0000-0000-0005-000000000010', name: 'Manager Dire Dawa TC1', email: 'dd1.manager@mor.gov.et', role: 'tax_center_manager', region: 'dire_dawa', taxCenter: 'dire_dawa-tc1', password: 'password123' },
  { id: '00000000-0000-0000-0005-000000000011', name: 'Manager Dire Dawa TC2', email: 'dd2.manager@mor.gov.et', role: 'tax_center_manager', region: 'dire_dawa', taxCenter: 'dire_dawa-tc2', password: 'password123' },
  { id: '00000000-0000-0000-0005-000000000012', name: 'Manager Dire Dawa TC3', email: 'dd3.manager@mor.gov.et', role: 'tax_center_manager', region: 'dire_dawa', taxCenter: 'dire_dawa-tc3', password: 'password123' },
  { id: '00000000-0000-0000-0005-000000000013', name: 'Manager SNNPR TC1', email: 'sn1.manager@mor.gov.et', role: 'tax_center_manager', region: 'snnpr', taxCenter: 'snnpr-tc1', password: 'password123' },
  { id: '00000000-0000-0000-0005-000000000014', name: 'Manager SNNPR TC2', email: 'sn2.manager@mor.gov.et', role: 'tax_center_manager', region: 'snnpr', taxCenter: 'snnpr-tc2', password: 'password123' },
  { id: '00000000-0000-0000-0005-000000000015', name: 'Manager SNNPR TC3', email: 'sn3.manager@mor.gov.et', role: 'tax_center_manager', region: 'snnpr', taxCenter: 'snnpr-tc3', password: 'password123' },
  { id: '00000000-0000-0000-0005-000000000016', name: 'Manager Somali TC1', email: 'so1.manager@mor.gov.et', role: 'tax_center_manager', region: 'somali', taxCenter: 'somali-tc1', password: 'password123' },
  { id: '00000000-0000-0000-0005-000000000017', name: 'Manager Somali TC2', email: 'so2.manager@mor.gov.et', role: 'tax_center_manager', region: 'somali', taxCenter: 'somali-tc2', password: 'password123' },
  { id: '00000000-0000-0000-0005-000000000018', name: 'Manager Somali TC3', email: 'so3.manager@mor.gov.et', role: 'tax_center_manager', region: 'somali', taxCenter: 'somali-tc3', password: 'password123' },
  { id: '20000000-0000-0000-0001-000000000001', name: 'Dr. Abebe Kebede', email: 'aa1.chair@mor.gov.et', role: 'committee_chair', region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', auditType: 'joint_audit', password: 'password123' },
  { id: '20000000-0000-0000-0001-000000000002', name: 'Fatuma Ahmed', email: 'aa1.member@mor.gov.et', role: 'committee', region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', auditType: 'joint_audit', password: 'password123' },
  { id: '10000000-0000-0000-0001-000000000001', name: 'Dawit Tadesse', email: 'aa1.tl@mor.gov.et', role: 'team_leader', region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', auditType: 'joint_audit', password: 'password123' },
  { id: 'a0000001-0000-0000-0001-000000000001', name: 'Sara Mohammed', email: 'aa1.auditor1@mor.gov.et', role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', teamLeader: '10000000-0000-0000-0001-000000000001', auditType: 'joint_audit', expertise: 'Customs & Tariffs Valuation', seniority: 'SENIOR', yearsOfExperience: 10, password: 'password123' },
  { id: 'a0000001-0000-0000-0001-000000000002', name: 'Yonas Berhanu', email: 'aa1.auditor2@mor.gov.et', role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', teamLeader: '10000000-0000-0000-0001-000000000001', auditType: 'joint_audit', expertise: 'Cross-Border & Transfer Pricing', seniority: 'PRINCIPAL', yearsOfExperience: 14, password: 'password123' },
  { id: 'a0000001-0000-0000-0001-000000000003', name: 'Hana Girma', email: 'aa1.auditor3@mor.gov.et', role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', teamLeader: '10000000-0000-0000-0001-000000000001', auditType: 'joint_audit', expertise: 'Domestic VAT & Sales Reconciliation', seniority: 'SENIOR', yearsOfExperience: 9, password: 'password123' },
  { id: 'a0000001-0000-0000-0001-000000000004', name: 'Mulugeta Alemayehu', email: 'aa1.auditor4@mor.gov.et', role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', teamLeader: '10000000-0000-0000-0001-000000000001', auditType: 'joint_audit', expertise: 'Corporate Income Tax & Deductions', seniority: 'MID_LEVEL', yearsOfExperience: 6, password: 'password123' },
  { id: 'a0000001-0000-0000-0001-000000000005', name: 'Tigist Haile', email: 'aa1.auditor5@mor.gov.et', role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', teamLeader: '10000000-0000-0000-0001-000000000001', auditType: 'joint_audit', expertise: 'Forensic & Investigation', seniority: 'SENIOR', yearsOfExperience: 11, password: 'password123' },
  { id: '20000000-0000-0000-0002-000000000001', name: 'Dr. Henok Belay', email: 'aa2.chair@mor.gov.et', role: 'committee_chair', region: 'addis_ababa', taxCenter: 'addis_ababa-tc2', auditType: 'joint_audit', password: 'password123' },
  { id: '20000000-0000-0000-0002-000000000002', name: 'Aster Aweke', email: 'aa2.member@mor.gov.et', role: 'committee', region: 'addis_ababa', taxCenter: 'addis_ababa-tc2', auditType: 'joint_audit', password: 'password123' },
  { id: '10000000-0000-0000-0002-000000000001', name: 'Berhanu Nega', email: 'aa2.tl@mor.gov.et', role: 'team_leader', region: 'addis_ababa', taxCenter: 'addis_ababa-tc2', auditType: 'joint_audit', password: 'password123' },
  { id: 'a0000001-0000-0000-0002-000000000001', name: 'Chaltu Bekele', email: 'aa2.auditor1@mor.gov.et', role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc2', teamLeader: '10000000-0000-0000-0002-000000000001', auditType: 'joint_audit', expertise: 'Customs & Tariffs Valuation', seniority: 'SENIOR', yearsOfExperience: 10, password: 'password123' },
  { id: 'a0000001-0000-0000-0002-000000000002', name: 'Diriba Lema', email: 'aa2.auditor2@mor.gov.et', role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc2', teamLeader: '10000000-0000-0000-0002-000000000001', auditType: 'joint_audit', expertise: 'Cross-Border & Transfer Pricing', seniority: 'PRINCIPAL', yearsOfExperience: 14, password: 'password123' },
  { id: 'a0000001-0000-0000-0002-000000000003', name: 'Fikadu Desta', email: 'aa2.auditor3@mor.gov.et', role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc2', teamLeader: '10000000-0000-0000-0002-000000000001', auditType: 'joint_audit', expertise: 'Domestic VAT & Sales Reconciliation', seniority: 'SENIOR', yearsOfExperience: 9, password: 'password123' },
  { id: 'a0000001-0000-0000-0002-000000000004', name: 'Gemechu Negash', email: 'aa2.auditor4@mor.gov.et', role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc2', teamLeader: '10000000-0000-0000-0002-000000000001', auditType: 'joint_audit', expertise: 'Corporate Income Tax & Deductions', seniority: 'MID_LEVEL', yearsOfExperience: 6, password: 'password123' },
  { id: 'a0000001-0000-0000-0002-000000000005', name: 'Haile Mengistu', email: 'aa2.auditor5@mor.gov.et', role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc2', teamLeader: '10000000-0000-0000-0002-000000000001', auditType: 'joint_audit', expertise: 'Forensic & Investigation', seniority: 'SENIOR', yearsOfExperience: 11, password: 'password123' },
  { id: '20000000-0000-0000-0003-000000000001', name: 'Dr. Ibrahim Hassan', email: 'aa3.chair@mor.gov.et', role: 'committee_chair', region: 'addis_ababa', taxCenter: 'addis_ababa-tc3', auditType: 'joint_audit', password: 'password123' },
  { id: '20000000-0000-0000-0003-000000000002', name: 'Jalene Gemeda', email: 'aa3.member@mor.gov.et', role: 'committee', region: 'addis_ababa', taxCenter: 'addis_ababa-tc3', auditType: 'joint_audit', password: 'password123' },
  { id: '10000000-0000-0000-0003-000000000001', name: 'Kedir Kedir', email: 'aa3.tl@mor.gov.et', role: 'team_leader', region: 'addis_ababa', taxCenter: 'addis_ababa-tc3', auditType: 'joint_audit', password: 'password123' },
  { id: 'a0000001-0000-0000-0003-000000000001', name: 'Lemlem Tesfaye', email: 'aa3.auditor1@mor.gov.et', role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc3', teamLeader: '10000000-0000-0000-0003-000000000001', auditType: 'joint_audit', expertise: 'Customs & Tariffs Valuation', seniority: 'SENIOR', yearsOfExperience: 10, password: 'password123' },
  { id: 'a0000001-0000-0000-0003-000000000002', name: 'Meron Hailu', email: 'aa3.auditor2@mor.gov.et', role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc3', teamLeader: '10000000-0000-0000-0003-000000000001', auditType: 'joint_audit', expertise: 'Cross-Border & Transfer Pricing', seniority: 'PRINCIPAL', yearsOfExperience: 14, password: 'password123' },
  { id: 'a0000001-0000-0000-0003-000000000003', name: 'Nardos Alemu', email: 'aa3.auditor3@mor.gov.et', role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc3', teamLeader: '10000000-0000-0000-0003-000000000001', auditType: 'joint_audit', expertise: 'Domestic VAT & Sales Reconciliation', seniority: 'SENIOR', yearsOfExperience: 9, password: 'password123' },
  { id: 'a0000001-0000-0000-0003-000000000004', name: 'Obsa Banti', email: 'aa3.auditor4@mor.gov.et', role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc3', teamLeader: '10000000-0000-0000-0003-000000000001', auditType: 'joint_audit', expertise: 'Corporate Income Tax & Deductions', seniority: 'MID_LEVEL', yearsOfExperience: 6, password: 'password123' },
  { id: 'a0000001-0000-0000-0003-000000000005', name: 'Robel Wolde', email: 'aa3.auditor5@mor.gov.et', role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc3', teamLeader: '10000000-0000-0000-0003-000000000001', auditType: 'joint_audit', expertise: 'Forensic & Investigation', seniority: 'SENIOR', yearsOfExperience: 11, password: 'password123' },
  { id: '20000000-0000-0000-0004-000000000001', name: 'Dr. Selam Tekle', email: 'or1.chair@mor.gov.et', role: 'committee_chair', region: 'oromia', taxCenter: 'oromia-tc1', auditType: 'joint_audit', password: 'password123' },
  { id: '20000000-0000-0000-0004-000000000002', name: 'Tadesse Assefa', email: 'or1.member@mor.gov.et', role: 'committee', region: 'oromia', taxCenter: 'oromia-tc1', auditType: 'joint_audit', password: 'password123' },
  { id: '10000000-0000-0000-0004-000000000001', name: 'Urga Wakjira', email: 'or1.tl@mor.gov.et', role: 'team_leader', region: 'oromia', taxCenter: 'oromia-tc1', auditType: 'joint_audit', password: 'password123' },
  { id: 'a0000001-0000-0000-0004-000000000001', name: 'Wondwossen Worku', email: 'or1.auditor1@mor.gov.et', role: 'auditor', region: 'oromia', taxCenter: 'oromia-tc1', teamLeader: '10000000-0000-0000-0004-000000000001', auditType: 'joint_audit', expertise: 'Customs & Tariffs Valuation', seniority: 'SENIOR', yearsOfExperience: 10, password: 'password123' },
  { id: 'a0000001-0000-0000-0004-000000000002', name: 'Yared Kifle', email: 'or1.auditor2@mor.gov.et', role: 'auditor', region: 'oromia', taxCenter: 'oromia-tc1', teamLeader: '10000000-0000-0000-0004-000000000001', auditType: 'joint_audit', expertise: 'Cross-Border & Transfer Pricing', seniority: 'PRINCIPAL', yearsOfExperience: 14, password: 'password123' },
  { id: 'a0000001-0000-0000-0004-000000000003', name: 'Zinash Zewde', email: 'or1.auditor3@mor.gov.et', role: 'auditor', region: 'oromia', taxCenter: 'oromia-tc1', teamLeader: '10000000-0000-0000-0004-000000000001', auditType: 'joint_audit', expertise: 'Domestic VAT & Sales Reconciliation', seniority: 'SENIOR', yearsOfExperience: 9, password: 'password123' },
  { id: 'a0000001-0000-0000-0004-000000000004', name: 'Almaz Solomon', email: 'or1.auditor4@mor.gov.et', role: 'auditor', region: 'oromia', taxCenter: 'oromia-tc1', teamLeader: '10000000-0000-0000-0004-000000000001', auditType: 'joint_audit', expertise: 'Corporate Income Tax & Deductions', seniority: 'MID_LEVEL', yearsOfExperience: 6, password: 'password123' },
  { id: 'a0000001-0000-0000-0004-000000000005', name: 'Biruk Melaku', email: 'or1.auditor5@mor.gov.et', role: 'auditor', region: 'oromia', taxCenter: 'oromia-tc1', teamLeader: '10000000-0000-0000-0004-000000000001', auditType: 'joint_audit', expertise: 'Forensic & Investigation', seniority: 'SENIOR', yearsOfExperience: 11, password: 'password123' },
  { id: '20000000-0000-0000-0005-000000000001', name: 'Dr. Dereje Getnet', email: 'or2.chair@mor.gov.et', role: 'committee_chair', region: 'oromia', taxCenter: 'oromia-tc2', auditType: 'joint_audit', password: 'password123' },
  { id: '20000000-0000-0000-0005-000000000002', name: 'Eden Demissie', email: 'or2.member@mor.gov.et', role: 'committee', region: 'oromia', taxCenter: 'oromia-tc2', auditType: 'joint_audit', password: 'password123' },
  { id: '10000000-0000-0000-0005-000000000001', name: 'Fitsum Fanta', email: 'or2.tl@mor.gov.et', role: 'team_leader', region: 'oromia', taxCenter: 'oromia-tc2', auditType: 'joint_audit', password: 'password123' },
  { id: 'a0000001-0000-0000-0005-000000000001', name: 'Getnet Tefera', email: 'or2.auditor1@mor.gov.et', role: 'auditor', region: 'oromia', taxCenter: 'oromia-tc2', teamLeader: '10000000-0000-0000-0005-000000000001', auditType: 'joint_audit', expertise: 'Customs & Tariffs Valuation', seniority: 'SENIOR', yearsOfExperience: 10, password: 'password123' },
  { id: 'a0000001-0000-0000-0005-000000000002', name: 'Hirut Mekonnen', email: 'or2.auditor2@mor.gov.et', role: 'auditor', region: 'oromia', taxCenter: 'oromia-tc2', teamLeader: '10000000-0000-0000-0005-000000000001', auditType: 'joint_audit', expertise: 'Cross-Border & Transfer Pricing', seniority: 'PRINCIPAL', yearsOfExperience: 14, password: 'password123' },
  { id: 'a0000001-0000-0000-0005-000000000003', name: 'Iyasu Abera', email: 'or2.auditor3@mor.gov.et', role: 'auditor', region: 'oromia', taxCenter: 'oromia-tc2', teamLeader: '10000000-0000-0000-0005-000000000001', auditType: 'joint_audit', expertise: 'Domestic VAT & Sales Reconciliation', seniority: 'SENIOR', yearsOfExperience: 9, password: 'password123' },
  { id: 'a0000001-0000-0000-0005-000000000004', name: 'Kalkidan Ayalew', email: 'or2.auditor4@mor.gov.et', role: 'auditor', region: 'oromia', taxCenter: 'oromia-tc2', teamLeader: '10000000-0000-0000-0005-000000000001', auditType: 'joint_audit', expertise: 'Corporate Income Tax & Deductions', seniority: 'MID_LEVEL', yearsOfExperience: 6, password: 'password123' },
  { id: 'a0000001-0000-0000-0005-000000000005', name: 'Lulit Regassa', email: 'or2.auditor5@mor.gov.et', role: 'auditor', region: 'oromia', taxCenter: 'oromia-tc2', teamLeader: '10000000-0000-0000-0005-000000000001', auditType: 'joint_audit', expertise: 'Forensic & Investigation', seniority: 'SENIOR', yearsOfExperience: 11, password: 'password123' },
  { id: '20000000-0000-0000-0006-000000000001', name: 'Dr. Mekdes Geda', email: 'or3.chair@mor.gov.et', role: 'committee_chair', region: 'oromia', taxCenter: 'oromia-tc3', auditType: 'joint_audit', password: 'password123' },
  { id: '20000000-0000-0000-0006-000000000002', name: 'Natnael Tolossa', email: 'or3.member@mor.gov.et', role: 'committee', region: 'oromia', taxCenter: 'oromia-tc3', auditType: 'joint_audit', password: 'password123' },
  { id: '10000000-0000-0000-0006-000000000001', name: 'Rahel Bacha', email: 'or3.tl@mor.gov.et', role: 'team_leader', region: 'oromia', taxCenter: 'oromia-tc3', auditType: 'joint_audit', password: 'password123' },
  { id: 'a0000001-0000-0000-0006-000000000001', name: 'Samuel Dejene', email: 'or3.auditor1@mor.gov.et', role: 'auditor', region: 'oromia', taxCenter: 'oromia-tc3', teamLeader: '10000000-0000-0000-0006-000000000001', auditType: 'joint_audit', expertise: 'Customs & Tariffs Valuation', seniority: 'SENIOR', yearsOfExperience: 10, password: 'password123' },
  { id: 'a0000001-0000-0000-0006-000000000002', name: 'Tariku Shiferaw', email: 'or3.auditor2@mor.gov.et', role: 'auditor', region: 'oromia', taxCenter: 'oromia-tc3', teamLeader: '10000000-0000-0000-0006-000000000001', auditType: 'joint_audit', expertise: 'Cross-Border & Transfer Pricing', seniority: 'PRINCIPAL', yearsOfExperience: 14, password: 'password123' },
  { id: 'a0000001-0000-0000-0006-000000000003', name: 'Worku Zenebe', email: 'or3.auditor3@mor.gov.et', role: 'auditor', region: 'oromia', taxCenter: 'oromia-tc3', teamLeader: '10000000-0000-0000-0006-000000000001', auditType: 'joint_audit', expertise: 'Domestic VAT & Sales Reconciliation', seniority: 'SENIOR', yearsOfExperience: 9, password: 'password123' },
  { id: 'a0000001-0000-0000-0006-000000000004', name: 'Yohannes Bogale', email: 'or3.auditor4@mor.gov.et', role: 'auditor', region: 'oromia', taxCenter: 'oromia-tc3', teamLeader: '10000000-0000-0000-0006-000000000001', auditType: 'joint_audit', expertise: 'Corporate Income Tax & Deductions', seniority: 'MID_LEVEL', yearsOfExperience: 6, password: 'password123' },
  { id: 'a0000001-0000-0000-0006-000000000005', name: 'Zewdu Amare', email: 'or3.auditor5@mor.gov.et', role: 'auditor', region: 'oromia', taxCenter: 'oromia-tc3', teamLeader: '10000000-0000-0000-0006-000000000001', auditType: 'joint_audit', expertise: 'Forensic & Investigation', seniority: 'SENIOR', yearsOfExperience: 11, password: 'password123' },
  { id: '20000000-0000-0000-0007-000000000001', name: 'Dr. Ashenafi Baye', email: 'am1.chair@mor.gov.et', role: 'committee_chair', region: 'amhara', taxCenter: 'amhara-tc1', auditType: 'joint_audit', password: 'password123' },
  { id: '20000000-0000-0000-0007-000000000002', name: 'Bethlehem Gebre', email: 'am1.member@mor.gov.et', role: 'committee', region: 'amhara', taxCenter: 'amhara-tc1', auditType: 'joint_audit', password: 'password123' },
  { id: '10000000-0000-0000-0007-000000000001', name: 'Daniel Habte', email: 'am1.tl@mor.gov.et', role: 'team_leader', region: 'amhara', taxCenter: 'amhara-tc1', auditType: 'joint_audit', password: 'password123' },
  { id: 'a0000001-0000-0000-0007-000000000001', name: 'Eyerusalem Jembere', email: 'am1.auditor1@mor.gov.et', role: 'auditor', region: 'amhara', taxCenter: 'amhara-tc1', teamLeader: '10000000-0000-0000-0007-000000000001', auditType: 'joint_audit', expertise: 'Customs & Tariffs Valuation', seniority: 'SENIOR', yearsOfExperience: 10, password: 'password123' },
  { id: 'a0000001-0000-0000-0007-000000000002', name: 'Fasika Kassaye', email: 'am1.auditor2@mor.gov.et', role: 'auditor', region: 'amhara', taxCenter: 'amhara-tc1', teamLeader: '10000000-0000-0000-0007-000000000001', auditType: 'joint_audit', expertise: 'Cross-Border & Transfer Pricing', seniority: 'PRINCIPAL', yearsOfExperience: 14, password: 'password123' },
  { id: 'a0000001-0000-0000-0007-000000000003', name: 'Girma Legesse', email: 'am1.auditor3@mor.gov.et', role: 'auditor', region: 'amhara', taxCenter: 'amhara-tc1', teamLeader: '10000000-0000-0000-0007-000000000001', auditType: 'joint_audit', expertise: 'Domestic VAT & Sales Reconciliation', seniority: 'SENIOR', yearsOfExperience: 9, password: 'password123' },
  { id: 'a0000001-0000-0000-0007-000000000004', name: 'Habtamu Mamo', email: 'am1.auditor4@mor.gov.et', role: 'auditor', region: 'amhara', taxCenter: 'amhara-tc1', teamLeader: '10000000-0000-0000-0007-000000000001', auditType: 'joint_audit', expertise: 'Corporate Income Tax & Deductions', seniority: 'MID_LEVEL', yearsOfExperience: 6, password: 'password123' },
  { id: 'a0000001-0000-0000-0007-000000000005', name: 'Kassahun Negussie', email: 'am1.auditor5@mor.gov.et', role: 'auditor', region: 'amhara', taxCenter: 'amhara-tc1', teamLeader: '10000000-0000-0000-0007-000000000001', auditType: 'joint_audit', expertise: 'Forensic & Investigation', seniority: 'SENIOR', yearsOfExperience: 11, password: 'password123' },
  { id: '20000000-0000-0000-0008-000000000001', name: 'Dr. Meseret Oumer', email: 'am2.chair@mor.gov.et', role: 'committee_chair', region: 'amhara', taxCenter: 'amhara-tc2', auditType: 'joint_audit', password: 'password123' },
  { id: '20000000-0000-0000-0008-000000000002', name: 'Nebiyu Reda', email: 'am2.member@mor.gov.et', role: 'committee', region: 'amhara', taxCenter: 'amhara-tc2', auditType: 'joint_audit', password: 'password123' },
  { id: '10000000-0000-0000-0008-000000000001', name: 'Rediet Seyoum', email: 'am2.tl@mor.gov.et', role: 'team_leader', region: 'amhara', taxCenter: 'amhara-tc2', auditType: 'joint_audit', password: 'password123' },
  { id: 'a0000001-0000-0000-0008-000000000001', name: 'Samson Tilahun', email: 'am2.auditor1@mor.gov.et', role: 'auditor', region: 'amhara', taxCenter: 'amhara-tc2', teamLeader: '10000000-0000-0000-0008-000000000001', auditType: 'joint_audit', expertise: 'Customs & Tariffs Valuation', seniority: 'SENIOR', yearsOfExperience: 10, password: 'password123' },
  { id: 'a0000001-0000-0000-0008-000000000002', name: 'Tesfaye Wondimu', email: 'am2.auditor2@mor.gov.et', role: 'auditor', region: 'amhara', taxCenter: 'amhara-tc2', teamLeader: '10000000-0000-0000-0008-000000000001', auditType: 'joint_audit', expertise: 'Cross-Border & Transfer Pricing', seniority: 'PRINCIPAL', yearsOfExperience: 14, password: 'password123' },
  { id: 'a0000001-0000-0000-0008-000000000003', name: 'Walelign Yilma', email: 'am2.auditor3@mor.gov.et', role: 'auditor', region: 'amhara', taxCenter: 'amhara-tc2', teamLeader: '10000000-0000-0000-0008-000000000001', auditType: 'joint_audit', expertise: 'Domestic VAT & Sales Reconciliation', seniority: 'SENIOR', yearsOfExperience: 9, password: 'password123' },
  { id: 'a0000001-0000-0000-0008-000000000004', name: 'Yeshi Zerihun', email: 'am2.auditor4@mor.gov.et', role: 'auditor', region: 'amhara', taxCenter: 'amhara-tc2', teamLeader: '10000000-0000-0000-0008-000000000001', auditType: 'joint_audit', expertise: 'Corporate Income Tax & Deductions', seniority: 'MID_LEVEL', yearsOfExperience: 6, password: 'password123' },
  { id: 'a0000001-0000-0000-0008-000000000005', name: 'Zeberga Abate', email: 'am2.auditor5@mor.gov.et', role: 'auditor', region: 'amhara', taxCenter: 'amhara-tc2', teamLeader: '10000000-0000-0000-0008-000000000001', auditType: 'joint_audit', expertise: 'Forensic & Investigation', seniority: 'SENIOR', yearsOfExperience: 11, password: 'password123' },
  { id: '20000000-0000-0000-0009-000000000001', name: 'Dr. Abdi Balcha', email: 'am3.chair@mor.gov.et', role: 'committee_chair', region: 'amhara', taxCenter: 'amhara-tc3', auditType: 'joint_audit', password: 'password123' },
  { id: '20000000-0000-0000-0009-000000000002', name: 'Birtukan Chernet', email: 'am3.member@mor.gov.et', role: 'committee', region: 'amhara', taxCenter: 'amhara-tc3', auditType: 'joint_audit', password: 'password123' },
  { id: '10000000-0000-0000-0009-000000000001', name: 'Dejene Dinkayehu', email: 'am3.tl@mor.gov.et', role: 'team_leader', region: 'amhara', taxCenter: 'amhara-tc3', auditType: 'joint_audit', password: 'password123' },
  { id: 'a0000001-0000-0000-0009-000000000001', name: 'Elsabeth Eshete', email: 'am3.auditor1@mor.gov.et', role: 'auditor', region: 'amhara', taxCenter: 'amhara-tc3', teamLeader: '10000000-0000-0000-0009-000000000001', auditType: 'joint_audit', expertise: 'Customs & Tariffs Valuation', seniority: 'SENIOR', yearsOfExperience: 10, password: 'password123' },
  { id: 'a0000001-0000-0000-0009-000000000002', name: 'Fasil Fikre', email: 'am3.auditor2@mor.gov.et', role: 'auditor', region: 'amhara', taxCenter: 'amhara-tc3', teamLeader: '10000000-0000-0000-0009-000000000001', auditType: 'joint_audit', expertise: 'Cross-Border & Transfer Pricing', seniority: 'PRINCIPAL', yearsOfExperience: 14, password: 'password123' },
  { id: 'a0000001-0000-0000-0009-000000000003', name: 'Genet Gudina', email: 'am3.auditor3@mor.gov.et', role: 'auditor', region: 'amhara', taxCenter: 'amhara-tc3', teamLeader: '10000000-0000-0000-0009-000000000001', auditType: 'joint_audit', expertise: 'Domestic VAT & Sales Reconciliation', seniority: 'SENIOR', yearsOfExperience: 9, password: 'password123' },
  { id: 'a0000001-0000-0000-0009-000000000004', name: 'Hiwot Hunde', email: 'am3.auditor4@mor.gov.et', role: 'auditor', region: 'amhara', taxCenter: 'amhara-tc3', teamLeader: '10000000-0000-0000-0009-000000000001', auditType: 'joint_audit', expertise: 'Corporate Income Tax & Deductions', seniority: 'MID_LEVEL', yearsOfExperience: 6, password: 'password123' },
  { id: 'a0000001-0000-0000-0009-000000000005', name: 'Jemal Jima', email: 'am3.auditor5@mor.gov.et', role: 'auditor', region: 'amhara', taxCenter: 'amhara-tc3', teamLeader: '10000000-0000-0000-0009-000000000001', auditType: 'joint_audit', expertise: 'Forensic & Investigation', seniority: 'SENIOR', yearsOfExperience: 11, password: 'password123' },
  { id: '20000000-0000-0000-0010-000000000001', name: 'Dr. Kaleb Kassa', email: 'dd1.chair@mor.gov.et', role: 'committee_chair', region: 'dire_dawa', taxCenter: 'dire_dawa-tc1', auditType: 'joint_audit', password: 'password123' },
  { id: '20000000-0000-0000-0010-000000000002', name: 'Martha Lemma', email: 'dd1.member@mor.gov.et', role: 'committee', region: 'dire_dawa', taxCenter: 'dire_dawa-tc1', auditType: 'joint_audit', password: 'password123' },
  { id: '10000000-0000-0000-0010-000000000001', name: 'Netsanet Molla', email: 'dd1.tl@mor.gov.et', role: 'team_leader', region: 'dire_dawa', taxCenter: 'dire_dawa-tc1', auditType: 'joint_audit', password: 'password123' },
  { id: 'a0000001-0000-0000-0010-000000000001', name: 'Roman Nida', email: 'dd1.auditor1@mor.gov.et', role: 'auditor', region: 'dire_dawa', taxCenter: 'dire_dawa-tc1', teamLeader: '10000000-0000-0000-0010-000000000001', auditType: 'joint_audit', expertise: 'Customs & Tariffs Valuation', seniority: 'SENIOR', yearsOfExperience: 10, password: 'password123' },
  { id: 'a0000001-0000-0000-0010-000000000002', name: 'Senait Olana', email: 'dd1.auditor2@mor.gov.et', role: 'auditor', region: 'dire_dawa', taxCenter: 'dire_dawa-tc1', teamLeader: '10000000-0000-0000-0010-000000000001', auditType: 'joint_audit', expertise: 'Cross-Border & Transfer Pricing', seniority: 'PRINCIPAL', yearsOfExperience: 14, password: 'password123' },
  { id: 'a0000001-0000-0000-0010-000000000003', name: 'Tolera Roba', email: 'dd1.auditor3@mor.gov.et', role: 'auditor', region: 'dire_dawa', taxCenter: 'dire_dawa-tc1', teamLeader: '10000000-0000-0000-0010-000000000001', auditType: 'joint_audit', expertise: 'Domestic VAT & Sales Reconciliation', seniority: 'SENIOR', yearsOfExperience: 9, password: 'password123' },
  { id: 'a0000001-0000-0000-0010-000000000004', name: 'Winta Sori', email: 'dd1.auditor4@mor.gov.et', role: 'auditor', region: 'dire_dawa', taxCenter: 'dire_dawa-tc1', teamLeader: '10000000-0000-0000-0010-000000000001', auditType: 'joint_audit', expertise: 'Corporate Income Tax & Deductions', seniority: 'MID_LEVEL', yearsOfExperience: 6, password: 'password123' },
  { id: 'a0000001-0000-0000-0010-000000000005', name: 'Yidnekachew Tufa', email: 'dd1.auditor5@mor.gov.et', role: 'auditor', region: 'dire_dawa', taxCenter: 'dire_dawa-tc1', teamLeader: '10000000-0000-0000-0010-000000000001', auditType: 'joint_audit', expertise: 'Forensic & Investigation', seniority: 'SENIOR', yearsOfExperience: 11, password: 'password123' },
  { id: '20000000-0000-0000-0011-000000000001', name: 'Dr. Zeineb Urgessa', email: 'dd2.chair@mor.gov.et', role: 'committee_chair', region: 'dire_dawa', taxCenter: 'dire_dawa-tc2', auditType: 'joint_audit', password: 'password123' },
  { id: '20000000-0000-0000-0011-000000000002', name: 'Adane Wami', email: 'dd2.member@mor.gov.et', role: 'committee', region: 'dire_dawa', taxCenter: 'dire_dawa-tc2', auditType: 'joint_audit', password: 'password123' },
  { id: '10000000-0000-0000-0011-000000000001', name: 'Bizuayehu Yadeta', email: 'dd2.tl@mor.gov.et', role: 'team_leader', region: 'dire_dawa', taxCenter: 'dire_dawa-tc2', auditType: 'joint_audit', password: 'password123' },
  { id: 'a0000001-0000-0000-0011-000000000001', name: 'Desta Zewdie', email: 'dd2.auditor1@mor.gov.et', role: 'auditor', region: 'dire_dawa', taxCenter: 'dire_dawa-tc2', teamLeader: '10000000-0000-0000-0011-000000000001', auditType: 'joint_audit', expertise: 'Customs & Tariffs Valuation', seniority: 'SENIOR', yearsOfExperience: 10, password: 'password123' },
  { id: 'a0000001-0000-0000-0011-000000000002', name: 'Ephrem Addisu', email: 'dd2.auditor2@mor.gov.et', role: 'auditor', region: 'dire_dawa', taxCenter: 'dire_dawa-tc2', teamLeader: '10000000-0000-0000-0011-000000000001', auditType: 'joint_audit', expertise: 'Cross-Border & Transfer Pricing', seniority: 'PRINCIPAL', yearsOfExperience: 14, password: 'password123' },
  { id: 'a0000001-0000-0000-0011-000000000003', name: 'Feven Bedada', email: 'dd2.auditor3@mor.gov.et', role: 'auditor', region: 'dire_dawa', taxCenter: 'dire_dawa-tc2', teamLeader: '10000000-0000-0000-0011-000000000001', auditType: 'joint_audit', expertise: 'Domestic VAT & Sales Reconciliation', seniority: 'SENIOR', yearsOfExperience: 9, password: 'password123' },
  { id: 'a0000001-0000-0000-0011-000000000004', name: 'Gashaw Chala', email: 'dd2.auditor4@mor.gov.et', role: 'auditor', region: 'dire_dawa', taxCenter: 'dire_dawa-tc2', teamLeader: '10000000-0000-0000-0011-000000000001', auditType: 'joint_audit', expertise: 'Corporate Income Tax & Deductions', seniority: 'MID_LEVEL', yearsOfExperience: 6, password: 'password123' },
  { id: 'a0000001-0000-0000-0011-000000000005', name: 'Helen Defar', email: 'dd2.auditor5@mor.gov.et', role: 'auditor', region: 'dire_dawa', taxCenter: 'dire_dawa-tc2', teamLeader: '10000000-0000-0000-0011-000000000001', auditType: 'joint_audit', expertise: 'Forensic & Investigation', seniority: 'SENIOR', yearsOfExperience: 11, password: 'password123' },
  { id: '20000000-0000-0000-0012-000000000001', name: 'Dr. Kibret Ergicho', email: 'dd3.chair@mor.gov.et', role: 'committee_chair', region: 'dire_dawa', taxCenter: 'dire_dawa-tc3', auditType: 'joint_audit', password: 'password123' },
  { id: '20000000-0000-0000-0012-000000000002', name: 'Mahlet Feyisa', email: 'dd3.member@mor.gov.et', role: 'committee', region: 'dire_dawa', taxCenter: 'dire_dawa-tc3', auditType: 'joint_audit', password: 'password123' },
  { id: '10000000-0000-0000-0012-000000000001', name: 'Nigist Guta', email: 'dd3.tl@mor.gov.et', role: 'team_leader', region: 'dire_dawa', taxCenter: 'dire_dawa-tc3', auditType: 'joint_audit', password: 'password123' },
  { id: 'a0000001-0000-0000-0012-000000000001', name: 'Ruth Hiko', email: 'dd3.auditor1@mor.gov.et', role: 'auditor', region: 'dire_dawa', taxCenter: 'dire_dawa-tc3', teamLeader: '10000000-0000-0000-0012-000000000001', auditType: 'joint_audit', expertise: 'Customs & Tariffs Valuation', seniority: 'SENIOR', yearsOfExperience: 10, password: 'password123' },
  { id: 'a0000001-0000-0000-0012-000000000002', name: 'Sintayehu Jaleta', email: 'dd3.auditor2@mor.gov.et', role: 'auditor', region: 'dire_dawa', taxCenter: 'dire_dawa-tc3', teamLeader: '10000000-0000-0000-0012-000000000001', auditType: 'joint_audit', expertise: 'Cross-Border & Transfer Pricing', seniority: 'PRINCIPAL', yearsOfExperience: 14, password: 'password123' },
  { id: 'a0000001-0000-0000-0012-000000000003', name: 'Tsion Keneni', email: 'dd3.auditor3@mor.gov.et', role: 'auditor', region: 'dire_dawa', taxCenter: 'dire_dawa-tc3', teamLeader: '10000000-0000-0000-0012-000000000001', auditType: 'joint_audit', expertise: 'Domestic VAT & Sales Reconciliation', seniority: 'SENIOR', yearsOfExperience: 9, password: 'password123' },
  { id: 'a0000001-0000-0000-0012-000000000004', name: 'Wubet Leta', email: 'dd3.auditor4@mor.gov.et', role: 'auditor', region: 'dire_dawa', taxCenter: 'dire_dawa-tc3', teamLeader: '10000000-0000-0000-0012-000000000001', auditType: 'joint_audit', expertise: 'Corporate Income Tax & Deductions', seniority: 'MID_LEVEL', yearsOfExperience: 6, password: 'password123' },
  { id: 'a0000001-0000-0000-0012-000000000005', name: 'Yishak Merga', email: 'dd3.auditor5@mor.gov.et', role: 'auditor', region: 'dire_dawa', taxCenter: 'dire_dawa-tc3', teamLeader: '10000000-0000-0000-0012-000000000001', auditType: 'joint_audit', expertise: 'Forensic & Investigation', seniority: 'SENIOR', yearsOfExperience: 11, password: 'password123' },
  { id: '20000000-0000-0000-0013-000000000001', name: 'Dr. Zelalem Negeri', email: 'sn1.chair@mor.gov.et', role: 'committee_chair', region: 'snnpr', taxCenter: 'snnpr-tc1', auditType: 'joint_audit', password: 'password123' },
  { id: '20000000-0000-0000-0013-000000000002', name: 'Amha Oromia', email: 'sn1.member@mor.gov.et', role: 'committee', region: 'snnpr', taxCenter: 'snnpr-tc1', auditType: 'joint_audit', password: 'password123' },
  { id: '10000000-0000-0000-0013-000000000001', name: 'Biniyam Reta', email: 'sn1.tl@mor.gov.et', role: 'team_leader', region: 'snnpr', taxCenter: 'snnpr-tc1', auditType: 'joint_audit', password: 'password123' },
  { id: 'a0000001-0000-0000-0013-000000000001', name: 'Elias Senbeta', email: 'sn1.auditor1@mor.gov.et', role: 'auditor', region: 'snnpr', taxCenter: 'snnpr-tc1', teamLeader: '10000000-0000-0000-0013-000000000001', auditType: 'joint_audit', expertise: 'Customs & Tariffs Valuation', seniority: 'SENIOR', yearsOfExperience: 10, password: 'password123' },
  { id: 'a0000001-0000-0000-0013-000000000002', name: 'Fisseha Tola', email: 'sn1.auditor2@mor.gov.et', role: 'auditor', region: 'snnpr', taxCenter: 'snnpr-tc1', teamLeader: '10000000-0000-0000-0013-000000000001', auditType: 'joint_audit', expertise: 'Cross-Border & Transfer Pricing', seniority: 'PRINCIPAL', yearsOfExperience: 14, password: 'password123' },
  { id: 'a0000001-0000-0000-0013-000000000003', name: 'Getachew Utalo', email: 'sn1.auditor3@mor.gov.et', role: 'auditor', region: 'snnpr', taxCenter: 'snnpr-tc1', teamLeader: '10000000-0000-0000-0013-000000000001', auditType: 'joint_audit', expertise: 'Domestic VAT & Sales Reconciliation', seniority: 'SENIOR', yearsOfExperience: 9, password: 'password123' },
  { id: 'a0000001-0000-0000-0013-000000000004', name: 'Hermela Wako', email: 'sn1.auditor4@mor.gov.et', role: 'auditor', region: 'snnpr', taxCenter: 'snnpr-tc1', teamLeader: '10000000-0000-0000-0013-000000000001', auditType: 'joint_audit', expertise: 'Corporate Income Tax & Deductions', seniority: 'MID_LEVEL', yearsOfExperience: 6, password: 'password123' },
  { id: 'a0000001-0000-0000-0013-000000000005', name: 'Kidan Yadessa', email: 'sn1.auditor5@mor.gov.et', role: 'auditor', region: 'snnpr', taxCenter: 'snnpr-tc1', teamLeader: '10000000-0000-0000-0013-000000000001', auditType: 'joint_audit', expertise: 'Forensic & Investigation', seniority: 'SENIOR', yearsOfExperience: 11, password: 'password123' },
  { id: '20000000-0000-0000-0014-000000000001', name: 'Dr. Melaku Zeleke', email: 'sn2.chair@mor.gov.et', role: 'committee_chair', region: 'snnpr', taxCenter: 'snnpr-tc2', auditType: 'joint_audit', password: 'password123' },
  { id: '20000000-0000-0000-0014-000000000002', name: 'Nurit Abinet', email: 'sn2.member@mor.gov.et', role: 'committee', region: 'snnpr', taxCenter: 'snnpr-tc2', auditType: 'joint_audit', password: 'password123' },
  { id: '10000000-0000-0000-0014-000000000001', name: 'Rekik Birhanu', email: 'sn2.tl@mor.gov.et', role: 'team_leader', region: 'snnpr', taxCenter: 'snnpr-tc2', auditType: 'joint_audit', password: 'password123' },
  { id: 'a0000001-0000-0000-0014-000000000001', name: 'Sisay Chemeda', email: 'sn2.auditor1@mor.gov.et', role: 'auditor', region: 'snnpr', taxCenter: 'snnpr-tc2', teamLeader: '10000000-0000-0000-0014-000000000001', auditType: 'joint_audit', expertise: 'Customs & Tariffs Valuation', seniority: 'SENIOR', yearsOfExperience: 10, password: 'password123' },
  { id: 'a0000001-0000-0000-0014-000000000002', name: 'Tamirat Dibaba', email: 'sn2.auditor2@mor.gov.et', role: 'auditor', region: 'snnpr', taxCenter: 'snnpr-tc2', teamLeader: '10000000-0000-0000-0014-000000000001', auditType: 'joint_audit', expertise: 'Cross-Border & Transfer Pricing', seniority: 'PRINCIPAL', yearsOfExperience: 14, password: 'password123' },
  { id: 'a0000001-0000-0000-0014-000000000003', name: 'Weynshet Ejigu', email: 'sn2.auditor3@mor.gov.et', role: 'auditor', region: 'snnpr', taxCenter: 'snnpr-tc2', teamLeader: '10000000-0000-0000-0014-000000000001', auditType: 'joint_audit', expertise: 'Domestic VAT & Sales Reconciliation', seniority: 'SENIOR', yearsOfExperience: 9, password: 'password123' },
  { id: 'a0000001-0000-0000-0014-000000000004', name: 'Yosef Fufa', email: 'sn2.auditor4@mor.gov.et', role: 'auditor', region: 'snnpr', taxCenter: 'snnpr-tc2', teamLeader: '10000000-0000-0000-0014-000000000001', auditType: 'joint_audit', expertise: 'Corporate Income Tax & Deductions', seniority: 'MID_LEVEL', yearsOfExperience: 6, password: 'password123' },
  { id: 'a0000001-0000-0000-0014-000000000005', name: 'Zerihun Gidisa', email: 'sn2.auditor5@mor.gov.et', role: 'auditor', region: 'snnpr', taxCenter: 'snnpr-tc2', teamLeader: '10000000-0000-0000-0014-000000000001', auditType: 'joint_audit', expertise: 'Forensic & Investigation', seniority: 'SENIOR', yearsOfExperience: 11, password: 'password123' },
  { id: '20000000-0000-0000-0015-000000000001', name: 'Dr. Anteneh Hordofa', email: 'sn3.chair@mor.gov.et', role: 'committee_chair', region: 'snnpr', taxCenter: 'snnpr-tc3', auditType: 'joint_audit', password: 'password123' },
  { id: '20000000-0000-0000-0015-000000000002', name: 'Bogale Idossa', email: 'sn3.member@mor.gov.et', role: 'committee', region: 'snnpr', taxCenter: 'snnpr-tc3', auditType: 'joint_audit', password: 'password123' },
  { id: '10000000-0000-0000-0015-000000000001', name: 'Endale Jibat', email: 'sn3.tl@mor.gov.et', role: 'team_leader', region: 'snnpr', taxCenter: 'snnpr-tc3', auditType: 'joint_audit', password: 'password123' },
  { id: 'a0000001-0000-0000-0015-000000000001', name: 'Firew Kumela', email: 'sn3.auditor1@mor.gov.et', role: 'auditor', region: 'snnpr', taxCenter: 'snnpr-tc3', teamLeader: '10000000-0000-0000-0015-000000000001', auditType: 'joint_audit', expertise: 'Customs & Tariffs Valuation', seniority: 'SENIOR', yearsOfExperience: 10, password: 'password123' },
  { id: 'a0000001-0000-0000-0015-000000000002', name: 'Gizachew Lamessa', email: 'sn3.auditor2@mor.gov.et', role: 'auditor', region: 'snnpr', taxCenter: 'snnpr-tc3', teamLeader: '10000000-0000-0000-0015-000000000001', auditType: 'joint_audit', expertise: 'Cross-Border & Transfer Pricing', seniority: 'PRINCIPAL', yearsOfExperience: 14, password: 'password123' },
  { id: 'a0000001-0000-0000-0015-000000000003', name: 'Hilina Mideksa', email: 'sn3.auditor3@mor.gov.et', role: 'auditor', region: 'snnpr', taxCenter: 'snnpr-tc3', teamLeader: '10000000-0000-0000-0015-000000000001', auditType: 'joint_audit', expertise: 'Domestic VAT & Sales Reconciliation', seniority: 'SENIOR', yearsOfExperience: 9, password: 'password123' },
  { id: 'a0000001-0000-0000-0015-000000000004', name: 'Kumsa Nugusa', email: 'sn3.auditor4@mor.gov.et', role: 'auditor', region: 'snnpr', taxCenter: 'snnpr-tc3', teamLeader: '10000000-0000-0000-0015-000000000001', auditType: 'joint_audit', expertise: 'Corporate Income Tax & Deductions', seniority: 'MID_LEVEL', yearsOfExperience: 6, password: 'password123' },
  { id: 'a0000001-0000-0000-0015-000000000005', name: 'Michael Obse', email: 'sn3.auditor5@mor.gov.et', role: 'auditor', region: 'snnpr', taxCenter: 'snnpr-tc3', teamLeader: '10000000-0000-0000-0015-000000000001', auditType: 'joint_audit', expertise: 'Forensic & Investigation', seniority: 'SENIOR', yearsOfExperience: 11, password: 'password123' },
  { id: '20000000-0000-0000-0016-000000000001', name: 'Dr. Nega Roba', email: 'so1.chair@mor.gov.et', role: 'committee_chair', region: 'somali', taxCenter: 'somali-tc1', auditType: 'joint_audit', password: 'password123' },
  { id: '20000000-0000-0000-0016-000000000002', name: 'Saba Sirika', email: 'so1.member@mor.gov.et', role: 'committee', region: 'somali', taxCenter: 'somali-tc1', auditType: 'joint_audit', password: 'password123' },
  { id: '10000000-0000-0000-0016-000000000001', name: 'Solomon Tucho', email: 'so1.tl@mor.gov.et', role: 'team_leader', region: 'somali', taxCenter: 'somali-tc1', auditType: 'joint_audit', password: 'password123' },
  { id: 'a0000001-0000-0000-0016-000000000001', name: 'Tewodros Urgesa', email: 'so1.auditor1@mor.gov.et', role: 'auditor', region: 'somali', taxCenter: 'somali-tc1', teamLeader: '10000000-0000-0000-0016-000000000001', auditType: 'joint_audit', expertise: 'Customs & Tariffs Valuation', seniority: 'SENIOR', yearsOfExperience: 10, password: 'password123' },
  { id: 'a0000001-0000-0000-0016-000000000002', name: 'Wolde Wayessa', email: 'so1.auditor2@mor.gov.et', role: 'auditor', region: 'somali', taxCenter: 'somali-tc1', teamLeader: '10000000-0000-0000-0016-000000000001', auditType: 'joint_audit', expertise: 'Cross-Border & Transfer Pricing', seniority: 'PRINCIPAL', yearsOfExperience: 14, password: 'password123' },
  { id: 'a0000001-0000-0000-0016-000000000003', name: 'Yostina Yadete', email: 'so1.auditor3@mor.gov.et', role: 'auditor', region: 'somali', taxCenter: 'somali-tc1', teamLeader: '10000000-0000-0000-0016-000000000001', auditType: 'joint_audit', expertise: 'Domestic VAT & Sales Reconciliation', seniority: 'SENIOR', yearsOfExperience: 9, password: 'password123' },
  { id: 'a0000001-0000-0000-0016-000000000004', name: 'Zewditu Zelalem', email: 'so1.auditor4@mor.gov.et', role: 'auditor', region: 'somali', taxCenter: 'somali-tc1', teamLeader: '10000000-0000-0000-0016-000000000001', auditType: 'joint_audit', expertise: 'Corporate Income Tax & Deductions', seniority: 'MID_LEVEL', yearsOfExperience: 6, password: 'password123' },
  { id: 'a0000001-0000-0000-0016-000000000005', name: 'Amanuel Alebachew', email: 'so1.auditor5@mor.gov.et', role: 'auditor', region: 'somali', taxCenter: 'somali-tc1', teamLeader: '10000000-0000-0000-0016-000000000001', auditType: 'joint_audit', expertise: 'Forensic & Investigation', seniority: 'SENIOR', yearsOfExperience: 11, password: 'password123' },
  { id: '20000000-0000-0000-0017-000000000001', name: 'Dr. Birhan Belete', email: 'so2.chair@mor.gov.et', role: 'committee_chair', region: 'somali', taxCenter: 'somali-tc2', auditType: 'joint_audit', password: 'password123' },
  { id: '20000000-0000-0000-0017-000000000002', name: 'Eskinder Chane', email: 'so2.member@mor.gov.et', role: 'committee', region: 'somali', taxCenter: 'somali-tc2', auditType: 'joint_audit', password: 'password123' },
  { id: '10000000-0000-0000-0017-000000000001', name: 'Frehiwot Damte', email: 'so2.tl@mor.gov.et', role: 'team_leader', region: 'somali', taxCenter: 'somali-tc2', auditType: 'joint_audit', password: 'password123' },
  { id: 'a0000001-0000-0000-0017-000000000001', name: 'Gosa Endalew', email: 'so2.auditor1@mor.gov.et', role: 'auditor', region: 'somali', taxCenter: 'somali-tc2', teamLeader: '10000000-0000-0000-0017-000000000001', auditType: 'joint_audit', expertise: 'Customs & Tariffs Valuation', seniority: 'SENIOR', yearsOfExperience: 10, password: 'password123' },
  { id: 'a0000001-0000-0000-0017-000000000002', name: 'Hundessa Fentaw', email: 'so2.auditor2@mor.gov.et', role: 'auditor', region: 'somali', taxCenter: 'somali-tc2', teamLeader: '10000000-0000-0000-0017-000000000001', auditType: 'joint_audit', expertise: 'Cross-Border & Transfer Pricing', seniority: 'PRINCIPAL', yearsOfExperience: 14, password: 'password123' },
  { id: 'a0000001-0000-0000-0017-000000000003', name: 'Leul Gashaw', email: 'so2.auditor3@mor.gov.et', role: 'auditor', region: 'somali', taxCenter: 'somali-tc2', teamLeader: '10000000-0000-0000-0017-000000000001', auditType: 'joint_audit', expertise: 'Domestic VAT & Sales Reconciliation', seniority: 'SENIOR', yearsOfExperience: 9, password: 'password123' },
  { id: 'a0000001-0000-0000-0017-000000000004', name: 'Million Hunegnaw', email: 'so2.auditor4@mor.gov.et', role: 'auditor', region: 'somali', taxCenter: 'somali-tc2', teamLeader: '10000000-0000-0000-0017-000000000001', auditType: 'joint_audit', expertise: 'Corporate Income Tax & Deductions', seniority: 'MID_LEVEL', yearsOfExperience: 6, password: 'password123' },
  { id: 'a0000001-0000-0000-0017-000000000005', name: 'Nuredin Kindie', email: 'so2.auditor5@mor.gov.et', role: 'auditor', region: 'somali', taxCenter: 'somali-tc2', teamLeader: '10000000-0000-0000-0017-000000000001', auditType: 'joint_audit', expertise: 'Forensic & Investigation', seniority: 'SENIOR', yearsOfExperience: 11, password: 'password123' },
  { id: '20000000-0000-0000-0018-000000000001', name: 'Dr. Saron Mengesha', email: 'so3.chair@mor.gov.et', role: 'committee_chair', region: 'somali', taxCenter: 'somali-tc3', auditType: 'joint_audit', password: 'password123' },
  { id: '20000000-0000-0000-0018-000000000002', name: 'Surafel Nigusie', email: 'so3.member@mor.gov.et', role: 'committee', region: 'somali', taxCenter: 'somali-tc3', auditType: 'joint_audit', password: 'password123' },
  { id: '10000000-0000-0000-0018-000000000001', name: 'Tibebu Setegn', email: 'so3.tl@mor.gov.et', role: 'team_leader', region: 'somali', taxCenter: 'somali-tc3', auditType: 'joint_audit', password: 'password123' },
  { id: 'a0000001-0000-0000-0018-000000000001', name: 'Wondimu Tarekegn', email: 'so3.auditor1@mor.gov.et', role: 'auditor', region: 'somali', taxCenter: 'somali-tc3', teamLeader: '10000000-0000-0000-0018-000000000001', auditType: 'joint_audit', expertise: 'Customs & Tariffs Valuation', seniority: 'SENIOR', yearsOfExperience: 10, password: 'password123' },
  { id: 'a0000001-0000-0000-0018-000000000002', name: 'Yabsira Wassie', email: 'so3.auditor2@mor.gov.et', role: 'auditor', region: 'somali', taxCenter: 'somali-tc3', teamLeader: '10000000-0000-0000-0018-000000000001', auditType: 'joint_audit', expertise: 'Cross-Border & Transfer Pricing', seniority: 'PRINCIPAL', yearsOfExperience: 14, password: 'password123' },
  { id: 'a0000001-0000-0000-0018-000000000003', name: 'Zena Yimam', email: 'so3.auditor3@mor.gov.et', role: 'auditor', region: 'somali', taxCenter: 'somali-tc3', teamLeader: '10000000-0000-0000-0018-000000000001', auditType: 'joint_audit', expertise: 'Domestic VAT & Sales Reconciliation', seniority: 'SENIOR', yearsOfExperience: 9, password: 'password123' },
  { id: 'a0000001-0000-0000-0018-000000000004', name: 'Kassaye Zewdu', email: 'so3.auditor4@mor.gov.et', role: 'auditor', region: 'somali', taxCenter: 'somali-tc3', teamLeader: '10000000-0000-0000-0018-000000000001', auditType: 'joint_audit', expertise: 'Corporate Income Tax & Deductions', seniority: 'MID_LEVEL', yearsOfExperience: 6, password: 'password123' },
  { id: 'a0000001-0000-0000-0018-000000000005', name: 'Negussie Admasu', email: 'so3.auditor5@mor.gov.et', role: 'auditor', region: 'somali', taxCenter: 'somali-tc3', teamLeader: '10000000-0000-0000-0018-000000000001', auditType: 'joint_audit', expertise: 'Forensic & Investigation', seniority: 'SENIOR', yearsOfExperience: 11, password: 'password123' }
];

// ============================================================
// Deterministic distribution helper
// ============================================================
const buildDistribution = (regionWeights) => {
  // Weights updated to match 5 audit types (Field Audit removed)
  const weights = { desk_audit: 0.35, joint_audit: 0.25, transfer_pricing: 0.15, comprehensive: 0.15, issue_audit: 0.10 };
  const dist = {};
  for (const [regionId, total] of Object.entries(regionWeights)) {
    dist[regionId] = {};
    let remaining = total;
    const types = AUDIT_TYPES.map(a => a.id);
    types.forEach((id, idx) => {
      if (idx === types.length - 1) {
        dist[regionId][id] = remaining;
      } else {
        const count = Math.round(total * weights[id]);
        dist[regionId][id] = count;
        remaining -= count;
      }
    });
  }
  return dist;
};

const buildTaxCenterDistribution = (regionId, regionDist) => {
  if (!regionDist) return {}; // Safety check
  
  const tcs = TAX_CENTERS[regionId];
  if (!tcs || tcs.length === 0) return {}; // Safety check
  
  const tcDist = {};
  for (const tcWeights of [{ w: 0.40, idx: 0 }, { w: 0.35, idx: 1 }, { w: 0.25, idx: 2 }]) {
    const tc = tcs[tcWeights.idx];
    if (!tc) continue; // Skip if tax center doesn't exist
    
    tcDist[tc.id] = {};
    if (tcWeights.idx < 2) {
      AUDIT_TYPES.forEach(a => { 
        tcDist[tc.id][a.id] = Math.round((regionDist[a.id] || 0) * tcWeights.w); 
      });
    } else {
      AUDIT_TYPES.forEach(a => {
        const prev = (tcDist[tcs[0].id]?.[a.id] || 0) + (tcDist[tcs[1].id]?.[a.id] || 0);
        tcDist[tc.id][a.id] = (regionDist[a.id] || 0) - prev;
      });
    }
  }
  return tcDist;
};

// ============================================================
// SEED PLANS
// ============================================================
const makeTimeline = (entries) => entries.map(([status, actor, comment, daysAgo]) => ({
  status, actor, comment, timestamp: new Date(Date.now() - daysAgo * 86400000).toISOString(),
}));

const plan1Dist = buildDistribution({ addis_ababa: 350, amhara: 280, oromia: 320, snnpr: 250, somali: 200 });
const plan2Dist = buildDistribution({ addis_ababa: 400, amhara: 300, oromia: 350, snnpr: 280, somali: 220 });

const buildAllRegionalFeedback = (dist) => {
  const feedback = {};
  REGIONS.forEach(region => {
    feedback[region.id] = {
      feedback: `Region ${region.name} has reviewed the allocation. All tax centers are prepared to execute the plan within budget and staffing constraints.`,
      taxCenterAllocations: buildTaxCenterDistribution(region.id, dist[region.id]),
      submittedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      submittedBy: `u-rd-${region.id.split('_')[0]}`,
    };
  });
  return feedback;
};

export const SEED_PLANS = [
  // Plan 1: Draft
  {
    id: 'AP-2025-001',
    name: 'FY 2025 National Audit Plan — Q1',
    year: 2025,
    description: 'First quarter national audit plan targeting high-risk taxpayers in construction, VAT non-compliance, and transfer pricing sectors.',
    status: 'DRAFT',
    createdBy: 'u-pt-01',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    distribution: plan1Dist,
    totalCases: 1400,
    directorComment: '',
    amendmentComment: '',
    revisions: [],
    regionalFeedback: {},
    seniorComment: '',
    riskBased: true,
    timeline: makeTimeline([
      ['DRAFT', 'u-pt-01', 'Plan created from risk engine analysis', 10],
    ]),
  },
  // Plan 2: Submitted to Director
  {
    id: 'AP-2025-002',
    name: 'FY 2025 National Audit Plan — Q2',
    year: 2025,
    description: 'Second quarter audit plan focused on real estate, import/export, and financial sector compliance.',
    status: 'SUBMITTED_TO_DIRECTOR',
    createdBy: 'u-pt-01',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    distribution: plan2Dist,
    totalCases: 1550,
    directorComment: '',
    amendmentComment: '',
    revisions: [],
    regionalFeedback: {},
    seniorComment: '',
    riskBased: true,
    timeline: makeTimeline([
      ['DRAFT', 'u-pt-01', 'Plan created from risk engine analysis', 20],
      ['SUBMITTED_TO_DIRECTOR', 'u-pt-01', 'Submitted for director review', 18],
    ]),
  },
  // Plan 3: Awaiting Regional Feedback
  {
    id: 'AP-2025-003',
    name: 'FY 2025 National Audit Plan — Q3',
    year: 2025,
    description: 'Third quarter audit plan covering manufacturing, agriculture, and energy sectors.',
    status: 'AWAITING_REGIONAL_FEEDBACK',
    createdBy: 'u-pt-02',
    createdAt: new Date(Date.now() - 35 * 86400000).toISOString(),
    distribution: plan1Dist,
    totalCases: 1400,
    directorComment: 'Approved. The plan is well-structured. Send to regions for their allocations and tax center distribution.',
    amendmentComment: '',
    revisions: [],
    regionalFeedback: {},
    seniorComment: '',
    timeline: makeTimeline([
      ['DRAFT', 'u-pt-02', 'Plan created', 35],
      ['SUBMITTED_TO_DIRECTOR', 'u-pt-02', 'Submitted for director review', 32],
      ['DIRECTOR_APPROVED', 'u-ad-01', 'Approved', 30],
      ['AWAITING_REGIONAL_FEEDBACK', 'u-ad-01', 'Sent to all regions', 29],
    ]),
  },
  // Plan 4: Feedback Collected → submitted to senior mgmt
  {
    id: 'AP-2025-004',
    name: 'FY 2024 Annual Audit Plan',
    year: 2024,
    description: 'Annual audit plan for FY 2024 covering all sectors.',
    status: 'SUBMITTED_TO_SENIOR_MGMT',
    createdBy: 'u-pt-01',
    createdAt: new Date(Date.now() - 80 * 86400000).toISOString(),
    distribution: plan2Dist,
    totalCases: 1550,
    directorComment: 'Excellent plan. Approved and sent to regions.',
    amendmentComment: 'Please increase desk audit allocation for Addis Ababa and reduce joint audit cases in Oromia based on capacity feedback.',
    revisions: [
      {
        comment: 'Increase desk audit allocation for Addis Ababa; reduce joint audit in Oromia.',
        timestamp: new Date(Date.now() - 58 * 86400000).toISOString(),
        by: 'u-ad-01',
        type: 'amendment',
      },
    ],
    regionalFeedback: buildAllRegionalFeedback(plan2Dist),
    seniorComment: '',
    timeline: makeTimeline([
      ['DRAFT', 'u-pt-01', '', 80],
      ['SUBMITTED_TO_DIRECTOR', 'u-pt-01', '', 77],
      ['DIRECTOR_APPROVED', 'u-ad-01', 'Approved', 75],
      ['AWAITING_REGIONAL_FEEDBACK', 'u-ad-01', 'Sent to regions', 74],
      ['FEEDBACK_COLLECTED', 'system', 'All regional feedback received', 60],
      ['AMENDMENT_REQUIRED', 'u-ad-01', 'Increase desk audit for AA; reduce joint in Oromia', 58],
      ['SUBMITTED_TO_DIRECTOR', 'u-pt-01', 'Amended plan resubmitted', 56],
      ['SUBMITTED_TO_SENIOR_MGMT', 'u-ad-01', 'Submitted amended plan for final approval', 55],
    ]),
  },
  // Plan 5: SENIOR_MGMT_APPROVED - Ready for Regional Deployment! ✨
  {
    id: 'AP-2025-TEST',
    name: 'TEST: Regional Deployment Plan',
    year: 2025,
    description: 'Test plan approved by Senior Management - ready for Director to send to regions for deployment.',
    status: 'SENIOR_MGMT_APPROVED',
    createdBy: 'u-pt-02',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    distribution: buildDistribution({ addis_ababa: 90, amhara: 70, oromia: 80, snnpr: 60, somali: 50 }),
    totalCases: 350,
    directorComment: 'Excellent plan with strong risk focus. Approved for regional feedback.',
    amendmentComment: 'Updated based on regional capacity constraints.',
    revisions: [
      {
        comment: 'Adjusted allocation based on regional feedback',
        timestamp: new Date(Date.now() - 6 * 86400000).toISOString(),
        by: 'u-ad-01',
        type: 'amendment',
      },
    ],
    regionalFeedback: buildAllRegionalFeedback(buildDistribution({ addis_ababa: 90, amhara: 70, oromia: 80, snnpr: 60, somali: 50 })),
    seniorComment: 'Approved. Deploy to all regions immediately.',
    timeline: makeTimeline([
      ['DRAFT', 'u-pt-02', 'Plan created from risk analysis', 15],
      ['SUBMITTED_TO_DIRECTOR', 'u-pt-02', 'Submitted for director review', 13],
      ['DIRECTOR_APPROVED', 'u-ad-01', 'Approved', 12],
      ['AWAITING_REGIONAL_FEEDBACK', 'u-ad-01', 'Sent to regions', 11],
      ['FEEDBACK_COLLECTED', 'system', 'Regional feedback collected', 8],
      ['AMENDMENT_REQUIRED', 'u-ad-01', 'Adjustments needed based on feedback', 6],
      ['SUBMITTED_TO_DIRECTOR', 'u-pt-02', 'Amended plan resubmitted', 4],
      ['SUBMITTED_TO_SENIOR_MGMT', 'u-ad-01', 'Submitted for senior approval', 2],
      ['SENIOR_MGMT_APPROVED', 'u-sm-01', 'Approved by Senior Management', 1],
    ]),
  },
];

// ============================================================
// CASE GENERATION - Using Real Taxpayer Data
// ============================================================

export const generateCases = (planId, dist, regionalFeedback = {}) => {
  const cases = [];

  for (const region of REGIONS) {
    const regionDist = dist[region.id] || {};
    const tcs = TAX_CENTERS[region.id] || [];
    const tcAllocations = regionalFeedback[region.id]?.taxCenterAllocations ?? null;

    for (const tc of tcs) {
      // Get allocation for this tax center
      let tcAllocation = {};
      
      if (tcAllocations && tcAllocations[tc.id]) {
        // Use regional feedback allocations
        tcAllocation = tcAllocations[tc.id];
      } else {
        // Distribute evenly among tax centers
        AUDIT_TYPES.forEach(auditType => {
          const totalForType = regionDist[auditType.id] || 0;
          const perTC = Math.floor(totalForType / tcs.length);
          tcAllocation[auditType.id] = perTC;
        });
      }

      // Generate cases for this tax center using real taxpayer data
      const tcCases = generateCasesFromPlan(planId, tc.id, tcAllocation, dist);
      cases.push(...tcCases);
    }
  }

  return cases;
};
