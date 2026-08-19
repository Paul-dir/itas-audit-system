// ============================================================
// CONSTANTS — single source of truth for all static data
// ============================================================

export const REGIONS = [
  { id: 'addis_ababa', name: 'Addis Ababa', code: 'AA' },
  { id: 'amhara',      name: 'Amhara',      code: 'AM' },
  { id: 'oromia',      name: 'Oromia',      code: 'OR' },
  { id: 'snnpr',       name: 'SNNPR',       code: 'SN' },
  { id: 'somali',      name: 'Somali',      code: 'SO' },
];

export const TAX_CENTERS = {
  addis_ababa: [
    { id: 'addis_ababa-tc1', name: 'Addis Ababa TC1', shortName: 'AA-TC1' },
    { id: 'addis_ababa-tc2', name: 'Addis Ababa TC2', shortName: 'AA-TC2' },
    { id: 'addis_ababa-tc3', name: 'Addis Ababa TC3', shortName: 'AA-TC3' },
  ],
  amhara: [
    { id: 'amhara-tc1', name: 'Amhara TC1', shortName: 'AM-TC1' },
    { id: 'amhara-tc2', name: 'Amhara TC2', shortName: 'AM-TC2' },
    { id: 'amhara-tc3', name: 'Amhara TC3', shortName: 'AM-TC3' },
  ],
  oromia: [
    { id: 'oromia-tc1', name: 'Oromia TC1', shortName: 'OR-TC1' },
    { id: 'oromia-tc2', name: 'Oromia TC2', shortName: 'OR-TC2' },
    { id: 'oromia-tc3', name: 'Oromia TC3', shortName: 'OR-TC3' },
  ],
  snnpr: [
    { id: 'snnpr-tc1', name: 'SNNPR TC1', shortName: 'SN-TC1' },
    { id: 'snnpr-tc2', name: 'SNNPR TC2', shortName: 'SN-TC2' },
    { id: 'snnpr-tc3', name: 'SNNPR TC3', shortName: 'SN-TC3' },
  ],
  somali: [
    { id: 'somali-tc1', name: 'Somali TC1', shortName: 'SO-TC1' },
    { id: 'somali-tc2', name: 'Somali TC2', shortName: 'SO-TC2' },
    { id: 'somali-tc3', name: 'Somali TC3', shortName: 'SO-TC3' },
  ],
};

export const AUDIT_TYPES = [
  { id: 'desk_audit',       name: 'Desk Audit',        color: 'blue',   shortName: 'Desk'   },
  { id: 'field_audit',      name: 'Field Audit',       color: 'green',  shortName: 'Field'  },
  { id: 'joint_audit',      name: 'Joint Audit',       color: 'purple', shortName: 'Joint'  },
  { id: 'transfer_pricing', name: 'Transfer Pricing',  color: 'orange', shortName: 'T.Price'},
  { id: 'comprehensive',    name: 'Comprehensive',     color: 'red',    shortName: 'Comp.'  },
  { id: 'issue_audit',      name: 'Issue Audit',       color: 'teal',   shortName: 'Issue'  },
];

export const PLAN_STATUS = {
  DRAFT:                       { id: 'DRAFT',                       label: 'Draft',                        color: 'gray'   },
  SUBMITTED_TO_DIRECTOR:       { id: 'SUBMITTED_TO_DIRECTOR',       label: 'Pending Director Approval',    color: 'yellow' },
  REVISION_REQUESTED:          { id: 'REVISION_REQUESTED',          label: 'Revision Requested',           color: 'orange' },
  DIRECTOR_APPROVED:           { id: 'DIRECTOR_APPROVED',           label: 'Director Approved',            color: 'blue'   },
  AWAITING_REGIONAL_FEEDBACK:  { id: 'AWAITING_REGIONAL_FEEDBACK',  label: 'Awaiting Regional Feedback',   color: 'purple' },
  FEEDBACK_COLLECTED:          { id: 'FEEDBACK_COLLECTED',          label: 'All Feedback Received',        color: 'teal'   },
  AMENDMENT_REQUIRED:          { id: 'AMENDMENT_REQUIRED',          label: 'Amendment Required',           color: 'orange' },
  SUBMITTED_TO_SENIOR_MGMT:    { id: 'SUBMITTED_TO_SENIOR_MGMT',    label: 'Pending Senior Approval',      color: 'indigo' },
  SENIOR_MGMT_APPROVED:        { id: 'SENIOR_MGMT_APPROVED',        label: 'Senior Management Approved',   color: 'green'  },
  SENIOR_MGMT_REJECTED:        { id: 'SENIOR_MGMT_REJECTED',        label: 'Rejected by Senior Mgmt',      color: 'red'    },
  APPROVED_TO_REGIONS:         { id: 'APPROVED_TO_REGIONS',         label: 'Approved - Deploy to Tax Centers', color: 'purple' },
  FINALIZED:                   { id: 'FINALIZED',                   label: 'Finalized & Deployed',         color: 'green'  },
};

export const ROLES = {
  PLANNING_TEAM:    { id: 'planning_team',    label: 'Audit Planning Team',    icon: 'ClipboardList', level: 2 },
  AUDIT_DIRECTOR:   { id: 'audit_director',   label: 'Audit Director',         icon: 'ShieldCheck',   level: 1 },
  REGIONAL_DIRECTOR:{ id: 'regional_director',label: 'Regional Director',      icon: 'Map',           level: 3 },
  TAX_CENTER_MGR:   { id: 'tax_center_manager',label:'Tax Center Manager',     icon: 'Building',      level: 4 },
  TEAM_LEADER:      { id: 'team_leader',      label: 'Team Leader',            icon: 'Users',         level: 5 },
  AUDITOR:          { id: 'auditor',          label: 'Auditor',                icon: 'Search',        level: 6 },
  SENIOR_MANAGEMENT:{ id: 'senior_management',label: 'Senior Management',      icon: 'Star',          level: 0 },
};

export const CASE_STATUS = {
  PENDING:     { id: 'PENDING',     label: 'Pending Assignment', color: 'gray'   },
  ASSIGNED:    { id: 'ASSIGNED',    label: 'Assigned',           color: 'blue'   },
  IN_PROGRESS: { id: 'IN_PROGRESS', label: 'In Progress',        color: 'yellow' },
  COMPLETED:   { id: 'COMPLETED',   label: 'Completed',          color: 'green'  },
  CLOSED:      { id: 'CLOSED',      label: 'Closed',             color: 'teal'   },
};

export const SECTORS = [
  'Manufacturing', 'Retail', 'Import/Export', 'Construction', 'Finance & Banking',
  'Hospitality', 'Real Estate', 'Telecom', 'Healthcare', 'Agriculture', 'Transport', 'Energy',
];

export const RISK_LEVELS = [
  { id: 'CRITICAL', label: 'Critical', color: 'red',    minScore: 90 },
  { id: 'HIGH',     label: 'High',     color: 'orange', minScore: 70 },
  { id: 'MEDIUM',   label: 'Medium',   color: 'yellow', minScore: 50 },
  { id: 'LOW',      label: 'Low',      color: 'blue',   minScore: 0  },
];

export const getRiskLevel = (score) => {
  if (score >= 90) return 'CRITICAL';
  if (score >= 70) return 'HIGH';
  if (score >= 50) return 'MEDIUM';
  return 'LOW';
};

export const getRegionById = (id) => REGIONS.find(r => r.id === id);
export const getAuditTypeById = (id) => AUDIT_TYPES.find(a => a.id === id);
export const getTaxCentersForRegion = (regionId) => TAX_CENTERS[regionId] || [];
export const getTaxCenterById = (id) => {
  for (const tcs of Object.values(TAX_CENTERS)) {
    const found = tcs.find(tc => tc.id === id);
    if (found) return found;
  }
  return null;
};
