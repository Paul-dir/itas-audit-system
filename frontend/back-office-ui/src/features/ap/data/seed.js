import { REGIONS, AUDIT_TYPES, TAX_CENTERS, getRiskLevel } from './constants.js';
import { generateCasesFromPlan, getTaxpayersForTaxCenter } from './taxpayers.js';

// ============================================================
// SEED USERS
// ============================================================
export const SEED_USERS = [
  // Planning Team
  { id: 'u-pt-01', name: 'Planning Auditor',  email: 'planning.auditor1@mor.gov.et',  role: 'planning_team',     region: null,          taxCenter: null,          password: 'password123' },
  { id: 'u-pt-02', name: 'Abebe Tadesse',     email: 'abebe.tadesse@mor.gov.et',      role: 'planning_team',     region: null,          taxCenter: null,          password: 'password123' },
  { id: 'u-pt-03', name: 'Hanna Girma',       email: 'hanna.girma@mor.gov.et',        role: 'planning_team',     region: null,          taxCenter: null,          password: 'password123' },
  // Audit Director
  { id: 'u-ad-01', name: 'Tesfaye Bekele',    email: 'tesfaye.bekele@mor.gov.et',     role: 'audit_director',    region: null,          taxCenter: null,          password: 'password123' },
  // Senior Management
  { id: 'u-sm-01', name: 'Rahel Hailu',       email: 'rahel.hailu@mor.gov.et',        role: 'senior_management', region: null,          taxCenter: null,          password: 'password123' },
  { id: 'u-sm-02', name: 'Biruk Assefa',      email: 'biruk.assefa@mor.gov.et',       role: 'senior_management', region: null,          taxCenter: null,          password: 'password123' },
  // Regional Directors
  { id: 'u-rd-aa', name: 'Getnet Alemu',      email: 'getnet.alemu@mor.gov.et',       role: 'regional_director', region: 'addis_ababa', taxCenter: null,          password: 'password123' },
  { id: 'u-rd-am', name: 'Tadesse Kebede',    email: 'tadesse.kebede@mor.gov.et',     role: 'regional_director', region: 'amhara',      taxCenter: null,          password: 'password123' },
  { id: 'u-rd-or', name: 'Gemechu Negash',    email: 'gemechu.negash@mor.gov.et',     role: 'regional_director', region: 'oromia',      taxCenter: null,          password: 'password123' },
  { id: 'u-rd-sn', name: 'Yonas Mengistu',    email: 'yonas.mengistu@mor.gov.et',     role: 'regional_director', region: 'snnpr',       taxCenter: null,          password: 'password123' },
  { id: 'u-rd-so', name: 'Ibrahim Hassan',    email: 'ibrahim.hassan@mor.gov.et',     role: 'regional_director', region: 'somali',      taxCenter: null,          password: 'password123' },
  // Tax Center Managers — Addis Ababa
  { id: 'u-tc-aa1', name: 'Mekdes Solomon',  email: 'mekdes.solomon@mor.gov.et',     role: 'tax_center_manager',region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', password: 'password123' },
  { id: 'u-tc-aa2', name: 'Dereje Worku',    email: 'dereje.worku@mor.gov.et',       role: 'tax_center_manager',region: 'addis_ababa', taxCenter: 'addis_ababa-tc2', password: 'password123' },
  { id: 'u-tc-aa3', name: 'Selam Tekle',     email: 'selam.tekle@mor.gov.et',        role: 'tax_center_manager',region: 'addis_ababa', taxCenter: 'addis_ababa-tc3', password: 'password123' },
  // Tax Center Managers — Oromia
  { id: 'u-tc-or1', name: 'Chaltu Girma',    email: 'chaltu.girma@mor.gov.et',       role: 'tax_center_manager',region: 'oromia',      taxCenter: 'oromia-tc1',      password: 'password123' },
  { id: 'u-tc-or2', name: 'Diriba Lema',     email: 'diriba.lema@mor.gov.et',        role: 'tax_center_manager',region: 'oromia',      taxCenter: 'oromia-tc2',      password: 'password123' },
  { id: 'u-tc-or3', name: 'Fatuma Umer',     email: 'fatuma.umer@mor.gov.et',        role: 'tax_center_manager',region: 'oromia',      taxCenter: 'oromia-tc3',      password: 'password123' },
  
  // Team Leaders — AA-TC1 (All audit types covered)
  { id: 'u-tl-aa1a', name: 'Henok Belay',      email: 'henok.belay@mor.gov.et',        role: 'team_leader',       region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', auditType: 'desk_audit',         password: 'password123' },
  { id: 'u-tl-aa1b', name: 'Tigist Alemu',     email: 'tigist.alemu@mor.gov.et',       role: 'team_leader',       region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', auditType: 'field_audit',        password: 'password123' },
  { id: 'u-tl-aa1c', name: 'Melaku Bekele',    email: 'melaku.bekele@mor.gov.et',      role: 'team_leader',       region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', auditType: 'joint_audit',        password: 'password123', isJointCommittee: true },
  { id: 'u-tl-aa1d', name: 'Seble Tesfaye',    email: 'seble.tesfaye@mor.gov.et',      role: 'team_leader',       region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', auditType: 'comprehensive',      password: 'password123' },
  { id: 'u-tl-aa1e', name: 'Dawit Mulugeta',   email: 'dawit.mulugeta@mor.gov.et',     role: 'team_leader',       region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', auditType: 'transfer_pricing',   password: 'password123' },
  { id: 'u-tl-aa1f', name: 'Sara Negash',      email: 'sara.negash@mor.gov.et',        role: 'team_leader',       region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', auditType: 'issue_audit',        password: 'password123' },
  
  // Team Leaders — AA-TC2 (All audit types covered)
  { id: 'u-tl-aa2a', name: 'Fikadu Desta',     email: 'fikadu.desta@mor.gov.et',       role: 'team_leader',       region: 'addis_ababa', taxCenter: 'addis_ababa-tc2', auditType: 'desk_audit',         password: 'password123' },
  { id: 'u-tl-aa2b', name: 'Almaz Worku',      email: 'almaz.worku@mor.gov.et',        role: 'team_leader',       region: 'addis_ababa', taxCenter: 'addis_ababa-tc2', auditType: 'field_audit',        password: 'password123' },
  { id: 'u-tl-aa2c', name: 'Biruk Gebre',      email: 'biruk.gebre@mor.gov.et',        role: 'team_leader',       region: 'addis_ababa', taxCenter: 'addis_ababa-tc2', auditType: 'comprehensive',      password: 'password123' },
  { id: 'u-tl-aa2d', name: 'Hana Abebe',       email: 'hana.abebe@mor.gov.et',         role: 'team_leader',       region: 'addis_ababa', taxCenter: 'addis_ababa-tc2', auditType: 'transfer_pricing',   password: 'password123' },
  { id: 'u-tl-aa2e', name: 'Daniel Kebede',    email: 'daniel.kebede@mor.gov.et',      role: 'team_leader',       region: 'addis_ababa', taxCenter: 'addis_ababa-tc2', auditType: 'issue_audit',        password: 'password123' },
  
  // Team Leaders — AA-TC3 (All audit types covered)
  { id: 'u-tl-aa3a', name: 'Marta Yohannes',   email: 'marta.yohannes@mor.gov.et',     role: 'team_leader',       region: 'addis_ababa', taxCenter: 'addis_ababa-tc3', auditType: 'desk_audit',         password: 'password123' },
  { id: 'u-tl-aa3b', name: 'Getnet Assefa',    email: 'getnet.assefa@mor.gov.et',      role: 'team_leader',       region: 'addis_ababa', taxCenter: 'addis_ababa-tc3', auditType: 'field_audit',        password: 'password123' },
  { id: 'u-tl-aa3c', name: 'Bethlehem Girma',  email: 'bethlehem.girma@mor.gov.et',    role: 'team_leader',       region: 'addis_ababa', taxCenter: 'addis_ababa-tc3', auditType: 'comprehensive',      password: 'password123' },
  { id: 'u-tl-aa3d', name: 'Yosef Lemma',      email: 'yosef.lemma@mor.gov.et',        role: 'team_leader',       region: 'addis_ababa', taxCenter: 'addis_ababa-tc3', auditType: 'transfer_pricing',   password: 'password123' },
  { id: 'u-tl-aa3e', name: 'Eleni Tadesse',    email: 'eleni.tadesse@mor.gov.et',      role: 'team_leader',       region: 'addis_ababa', taxCenter: 'addis_ababa-tc3', auditType: 'issue_audit',        password: 'password123' },
  
  // Team Leaders — OR-TC1
  { id: 'u-tl-or1a', name: 'Lalisa Wakjira',email: 'lalisa.wakjira@mor.gov.et',     role: 'team_leader',       region: 'oromia',      taxCenter: 'oromia-tc1',      auditType: 'desk_audit',   password: 'password123' },
  
  // Auditors — AA-TC1 (Multiple auditors per TL)
  { id: 'u-aud-aa1a', name: 'Kidist Mehari',   email: 'kidist.mehari@mor.gov.et',     role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', teamLeader: 'u-tl-aa1a', password: 'password123' },
  { id: 'u-aud-aa1b', name: 'Robel Tadesse',   email: 'robel.tadesse@mor.gov.et',     role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', teamLeader: 'u-tl-aa1a', password: 'password123' },
  { id: 'u-aud-aa1c', name: 'Natnael Kifle',   email: 'natnael.kifle@mor.gov.et',     role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', teamLeader: 'u-tl-aa1b', password: 'password123' },
  { id: 'u-aud-aa1d', name: 'Yodit Alemayehu', email: 'yodit.alemayehu@mor.gov.et',   role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', teamLeader: 'u-tl-aa1b', password: 'password123' },
  { id: 'u-aud-aa1e', name: 'Samuel Haile',    email: 'samuel.haile@mor.gov.et',      role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', teamLeader: 'u-tl-aa1c', password: 'password123' },
  { id: 'u-aud-aa1f', name: 'Eden Tesfaye',    email: 'eden.tesfaye@mor.gov.et',      role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', teamLeader: 'u-tl-aa1c', password: 'password123' },
  { id: 'u-aud-aa1g', name: 'Fikremariam B.',  email: 'fikremariam.b@mor.gov.et',     role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', teamLeader: 'u-tl-aa1d', password: 'password123' },
  { id: 'u-aud-aa1h', name: 'Saron Getachew',  email: 'saron.getachew@mor.gov.et',    role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', teamLeader: 'u-tl-aa1d', password: 'password123' },
  { id: 'u-aud-aa1i', name: 'Michael Desta',   email: 'michael.desta@mor.gov.et',     role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', teamLeader: 'u-tl-aa1e', password: 'password123' },
  { id: 'u-aud-aa1j', name: 'Eyerusalem M.',   email: 'eyerusalem.m@mor.gov.et',      role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', teamLeader: 'u-tl-aa1e', password: 'password123' },
  { id: 'u-aud-aa1k', name: 'Abdi Kedir',      email: 'abdi.kedir@mor.gov.et',        role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', teamLeader: 'u-tl-aa1f', password: 'password123' },
  { id: 'u-aud-aa1l', name: 'Mahlet Bekele',   email: 'mahlet.bekele@mor.gov.et',     role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc1', teamLeader: 'u-tl-aa1f', password: 'password123' },
  
  // Auditors — AA-TC2 (Multiple auditors per TL)
  { id: 'u-aud-aa2a', name: 'Meseret Hailu',   email: 'meseret.hailu@mor.gov.et',     role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc2', teamLeader: 'u-tl-aa2a', password: 'password123' },
  { id: 'u-aud-aa2b', name: 'Amanuel Girma',   email: 'amanuel.girma@mor.gov.et',     role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc2', teamLeader: 'u-tl-aa2a', password: 'password123' },
  { id: 'u-aud-aa2c', name: 'Ruth Berhane',    email: 'ruth.berhane@mor.gov.et',      role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc2', teamLeader: 'u-tl-aa2b', password: 'password123' },
  { id: 'u-aud-aa2d', name: 'Tesfaye Lemma',   email: 'tesfaye.lemma@mor.gov.et',     role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc2', teamLeader: 'u-tl-aa2b', password: 'password123' },
  { id: 'u-aud-aa2e', name: 'Fasika Tadesse',  email: 'fasika.tadesse@mor.gov.et',    role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc2', teamLeader: 'u-tl-aa2c', password: 'password123' },
  { id: 'u-aud-aa2f', name: 'Bereket Wolde',   email: 'bereket.wolde@mor.gov.et',     role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc2', teamLeader: 'u-tl-aa2c', password: 'password123' },
  { id: 'u-aud-aa2g', name: 'Helen Tesfaye',   email: 'helen.tesfaye@mor.gov.et',     role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc2', teamLeader: 'u-tl-aa2d', password: 'password123' },
  { id: 'u-aud-aa2h', name: 'Daniel Abera',    email: 'daniel.abera@mor.gov.et',      role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc2', teamLeader: 'u-tl-aa2d', password: 'password123' },
  { id: 'u-aud-aa2i', name: 'Meron Hailu',     email: 'meron.hailu@mor.gov.et',       role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc2', teamLeader: 'u-tl-aa2e', password: 'password123' },
  { id: 'u-aud-aa2j', name: 'Yared Bekele',    email: 'yared.bekele@mor.gov.et',      role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc2', teamLeader: 'u-tl-aa2e', password: 'password123' },
  
  // Auditors — AA-TC3 (Multiple auditors per TL)
  { id: 'u-aud-aa3a', name: 'Nardos Alemu',    email: 'nardos.alemu@mor.gov.et',      role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc3', teamLeader: 'u-tl-aa3a', password: 'password123' },
  { id: 'u-aud-aa3b', name: 'Addis Mekonnen',  email: 'addis.mekonnen@mor.gov.et',    role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc3', teamLeader: 'u-tl-aa3a', password: 'password123' },
  { id: 'u-aud-aa3c', name: 'Bethel Tadesse',  email: 'bethel.tadesse@mor.gov.et',    role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc3', teamLeader: 'u-tl-aa3b', password: 'password123' },
  { id: 'u-aud-aa3d', name: 'Dawit Negash',    email: 'dawit.negash@mor.gov.et',      role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc3', teamLeader: 'u-tl-aa3b', password: 'password123' },
  { id: 'u-aud-aa3e', name: 'Hirut Kebede',    email: 'hirut.kebede@mor.gov.et',      role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc3', teamLeader: 'u-tl-aa3c', password: 'password123' },
  { id: 'u-aud-aa3f', name: 'Kaleb Gebre',     email: 'kaleb.gebre@mor.gov.et',       role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc3', teamLeader: 'u-tl-aa3c', password: 'password123' },
  { id: 'u-aud-aa3g', name: 'Rahel Mulugeta',  email: 'rahel.mulugeta@mor.gov.et',    role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc3', teamLeader: 'u-tl-aa3d', password: 'password123' },
  { id: 'u-aud-aa3h', name: 'Yonatan Haile',   email: 'yonatan.haile@mor.gov.et',     role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc3', teamLeader: 'u-tl-aa3d', password: 'password123' },
  { id: 'u-aud-aa3i', name: 'Sofia Tesfaye',   email: 'sofia.tesfaye@mor.gov.et',     role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc3', teamLeader: 'u-tl-aa3e', password: 'password123' },
  { id: 'u-aud-aa3j', name: 'Abraham Girma',   email: 'abraham.girma@mor.gov.et',     role: 'auditor', region: 'addis_ababa', taxCenter: 'addis_ababa-tc3', teamLeader: 'u-tl-aa3e', password: 'password123' },
  
  // Auditors — OR-TC1
  { id: 'u-aud-or1a', name: 'Tolera Banti',    email: 'tolera.banti@mor.gov.et',      role: 'auditor', region: 'oromia', taxCenter: 'oromia-tc1', teamLeader: 'u-tl-or1a', password: 'password123' },
  { id: 'u-aud-or1b', name: 'Chaltu Bekele',   email: 'chaltu.bekele@mor.gov.et',     role: 'auditor', region: 'oromia', taxCenter: 'oromia-tc1', teamLeader: 'u-tl-or1a', password: 'password123' },
];

// ============================================================
// Deterministic distribution helper
// ============================================================
const buildDistribution = (regionWeights) => {
  const weights = { desk_audit: 0.30, field_audit: 0.25, joint_audit: 0.18, transfer_pricing: 0.10, comprehensive: 0.10, issue_audit: 0.07 };
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
  const tcs = TAX_CENTERS[regionId];
  const tcDist = {};
  for (const tcWeights of [{ w: 0.40, idx: 0 }, { w: 0.35, idx: 1 }, { w: 0.25, idx: 2 }]) {
    const tc = tcs[tcWeights.idx];
    tcDist[tc.id] = {};
    if (tcWeights.idx < 2) {
      AUDIT_TYPES.forEach(a => { tcDist[tc.id][a.id] = Math.round(regionDist[a.id] * tcWeights.w); });
    } else {
      AUDIT_TYPES.forEach(a => {
        const prev = (tcDist[tcs[0].id]?.[a.id] || 0) + (tcDist[tcs[1].id]?.[a.id] || 0);
        tcDist[tc.id][a.id] = regionDist[a.id] - prev;
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
