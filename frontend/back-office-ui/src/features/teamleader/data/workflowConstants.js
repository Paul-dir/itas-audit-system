/**
 * Audit Execution Workflow Constants
 * Defines all 10 steps, statuses, and decision types for the audit lifecycle
 *
 * Flow:
 * Case Detail → Planning → Entry Conference
 *                                  ↓
 *                        Info Request → Document Collection
 *                                  ↑___________↓ (loop)
 *                                  ↓
 *                            CAAT Analysis
 *                                  ↓
 *                            Audit Testing
 *                                  ↓
 *                               Findings
 *                                  ↓
 *                      Taxpayer Response (30 days)
 *                                  ↓
 *                            Conclusion
 *                                  ↓
 *                         ✅ CONCLUDED (Locked)
 */

// ── WORKFLOW STEPS ──────────────────────────────────────────────────────────

export const WORKFLOW_STEPS = [
  { id: 'CASE_DETAIL',          number: 1,  label: 'Case Detail',              actor: 'Auditor (review)',           icon: 'FileText' },
  { id: 'PLANNING',             number: 2,  label: 'Planning',                 actor: 'Auditor → Team Leader',      icon: 'ClipboardList' },
  { id: 'ENTRY_CONFERENCE',     number: 3,  label: 'Entry Conference',         actor: 'Auditor + Taxpayer → TL',   icon: 'Calendar' },
  { id: 'INFO_REQUEST',         number: 4,  label: 'Information Request',      actor: 'Auditor → Taxpayer',         icon: 'FileSearch' },
  { id: 'DOCUMENT_COLLECTION',  number: 5,  label: 'Document Collection',      actor: 'Taxpayer → Auditor',         icon: 'FolderOpen' },
  { id: 'CAAT_ANALYSIS',        number: 6,  label: 'CAAT / Automated Analysis',actor: 'Auditor (system)',            icon: 'Cpu' },
  { id: 'AUDIT_TESTING',        number: 7,  label: 'Audit Testing',            actor: 'Auditor',                    icon: 'TestTube' },
  { id: 'FINDINGS',             number: 8,  label: 'Findings',                 actor: 'Auditor → Team Leader',      icon: 'AlertTriangle' },
  { id: 'TAXPAYER_RESPONSE',    number: 9,  label: 'Taxpayer Response',        actor: 'Taxpayer → Auditor',         icon: 'MessageSquare' },
  { id: 'CONCLUSION',           number: 10, label: 'Conclusion',               actor: 'Auditor → Team Leader',      icon: 'CheckCircle' },
];

export const WORKFLOW_STEP_IDS = WORKFLOW_STEPS.map(s => s.id);

// ── CASE WORKFLOW STATUS ────────────────────────────────────────────────────

export const CASE_WORKFLOW_STATUS = {
  CASE_DETAIL:              { id: 'CASE_DETAIL',              label: 'Case Detail',              color: 'blue',   step: 1 },
  PLANNING:                 { id: 'PLANNING',                 label: 'Planning',                 color: 'purple', step: 2 },
  PLANNING_REVISION:        { id: 'PLANNING_REVISION',        label: 'Planning Revision',        color: 'orange', step: 2 },
  ENTRY_CONFERENCE:         { id: 'ENTRY_CONFERENCE',         label: 'Entry Conference',         color: 'teal',   step: 3 },
  INFO_GATHERING:           { id: 'INFO_GATHERING',           label: 'Info Gathering',           color: 'cyan',   step: 4 },
  DOCUMENT_COLLECTION:      { id: 'DOCUMENT_COLLECTION',      label: 'Document Collection',      color: 'indigo', step: 5 },
  CAAT_ANALYSIS:            { id: 'CAAT_ANALYSIS',            label: 'CAAT Analysis',            color: 'violet', step: 6 },
  AUDIT_TESTING:            { id: 'AUDIT_TESTING',            label: 'Audit Testing',            color: 'yellow', step: 7 },
  FINDINGS:                 { id: 'FINDINGS',                 label: 'Findings',                 color: 'amber',  step: 8 },
  FINDINGS_REVISION:        { id: 'FINDINGS_REVISION',        label: 'Findings Revision',        color: 'orange', step: 8 },
  TAXPAYER_RESPONSE:        { id: 'TAXPAYER_RESPONSE',        label: 'Taxpayer Response',        color: 'sky',    step: 9 },
  CONCLUSION:               { id: 'CONCLUSION',               label: 'Conclusion',               color: 'emerald',step: 10 },
  CONCLUDED:                { id: 'CONCLUDED',                label: 'Concluded',                color: 'green',  step: 11 },
};

// ── HANDOFF STATUS ──────────────────────────────────────────────────────────

export const HANDOFF_STATUS = {
  PENDING:  { id: 'PENDING',  label: 'Pending Import',    color: 'gray'   },
  IMPORTED: { id: 'IMPORTED', label: 'Imported',          color: 'green'  },
  DECLINED: { id: 'DECLINED', label: 'Declined',          color: 'red'    },
};

// ── ASSIGNMENT STATUS ───────────────────────────────────────────────────────

export const ASSIGNMENT_STATUS = {
  PENDING:    { id: 'PENDING',    label: 'Pending',      color: 'gray'   },
  ACCEPTED:   { id: 'ACCEPTED',   label: 'Accepted',     color: 'green'  },
  DECLINED:   { id: 'DECLINED',   label: 'Declined',     color: 'red'    },
  REASSIGNED: { id: 'REASSIGNED', label: 'Reassigned',   color: 'orange' },
};

// ── PLAN STATUS ─────────────────────────────────────────────────────────────

export const PLAN_STATUS = {
  DRAFT:     { id: 'DRAFT',     label: 'Draft',      color: 'gray'   },
  SUBMITTED: { id: 'SUBMITTED', label: 'Submitted',  color: 'blue'   },
  APPROVED:  { id: 'APPROVED',  label: 'Approved',   color: 'green'  },
  REVISION:  { id: 'REVISION',  label: 'Revision',   color: 'orange' },
};

// ── CONFERENCE STATUS ───────────────────────────────────────────────────────

export const CONFERENCE_STATUS = {
  SCHEDULED: { id: 'SCHEDULED', label: 'Scheduled', color: 'blue'   },
  COMPLETED: { id: 'COMPLETED', label: 'Completed', color: 'green'  },
  CANCELLED: { id: 'CANCELLED', label: 'Cancelled', color: 'red'    },
};

// ── DOCUMENT STATUS ─────────────────────────────────────────────────────────

export const DOCUMENT_STATUS = {
  PENDING:  { id: 'PENDING',  label: 'Pending Upload',  color: 'gray'   },
  UPLOADED: { id: 'UPLOADED', label: 'Uploaded',        color: 'blue'   },
  VERIFIED: { id: 'VERIFIED', label: 'Verified',        color: 'green'  },
  REJECTED: { id: 'REJECTED', label: 'Rejected',        color: 'red'    },
  FOLLOWUP: { id: 'FOLLOWUP', label: 'Follow-up',       color: 'orange' },
};

// ── CAAT ANOMALY SEVERITY ───────────────────────────────────────────────────

export const ANOMALY_SEVERITY = {
  HIGH:   { id: 'HIGH',   label: 'High',   color: 'red'    },
  MEDIUM: { id: 'MEDIUM', label: 'Medium', color: 'amber'  },
  LOW:    { id: 'LOW',    label: 'Low',    color: 'blue'   },
};

export const ANOMALY_DECISION = {
  ACCEPT: 'ACCEPT',
  AMEND:  'AMEND',
  REJECT: 'REJECT',
};

// ── FINDING SEVERITY ────────────────────────────────────────────────────────

export const FINDING_SEVERITY = {
  HIGH:   { id: 'HIGH',   label: 'High',   color: 'red'    },
  MEDIUM: { id: 'MEDIUM', label: 'Medium', color: 'amber'  },
  LOW:    { id: 'LOW',    label: 'Low',    color: 'blue'   },
};

export const FINDING_STATUS = {
  DRAFT:    { id: 'DRAFT',    label: 'Draft',    color: 'gray'   },
  SUBMITTED:{ id: 'SUBMITTED',label: 'Submitted',color: 'blue'   },
  APPROVED: { id: 'APPROVED', label: 'Approved', color: 'green'  },
  REVISION: { id: 'REVISION', label: 'Revision', color: 'orange' },
};

// ── TAXPAYER RESPONSE ───────────────────────────────────────────────────────

export const TAXPAYER_RESPONSE = {
  AGREE:     { id: 'AGREE',     label: 'Agree',      color: 'green'  },
  DISAGREE:  { id: 'DISAGREE',  label: 'Disagree',   color: 'red'    },
  NO_ACTION: { id: 'NO_ACTION', label: 'No Response', color: 'gray'   },
};

// ── CONCLUSION TYPE ─────────────────────────────────────────────────────────

export const CONCLUSION_TYPE = {
  UPHeld:    { id: 'UPHELD',    label: 'Upheld',    color: 'gray'   },
  REDUCED:   { id: 'REDUCED',   label: 'Reduced',   color: 'amber'  },
  OVERTURNED:{ id: 'OVERTURNED', label: 'Overturned', color: 'green'  },
  WITHDRAWN: { id: 'WITHDRAWN', label: 'Withdrawn',  color: 'blue'   },
};

// ── EVIDENCE TYPE ───────────────────────────────────────────────────────────

export const EVIDENCE_TYPES = [
  'Financial Statements',
  'Tax Returns',
  'Bank Statements',
  'Invoices',
  'Purchase Records',
  'Sales Records',
  'Inventory Records',
  'Contracts',
  'Payroll Records',
  'CAAT Analysis Report',
  'Working Paper',
  'Other',
];

// ── CAAT ANALYSIS TYPES ─────────────────────────────────────────────────────

export const CAAT_ANALYSIS_TYPES = [
  { id: 'REVENUE_VS_BANK',      label: 'Revenue vs. Bank Deposits',       description: 'Compare reported revenue with bank deposit records' },
  { id: 'EXPENSE_RATIO',        label: 'Expense Ratio Analysis',          description: 'Analyze expense-to-revenue ratios against industry norms' },
  { id: 'INDUSTRY_BENCHMARK',   label: 'Industry Benchmark Comparison',   description: 'Compare taxpayer metrics against industry averages' },
  { id: 'THREE_WAY_MATCHING',   label: 'Three-way Matching',              description: 'Match purchases ↔ production ↔ inventory records' },
  { id: 'THIRD_PARTY_CROSS',    label: 'Third-party Data Cross-check',    description: 'Cross-reference with external data sources' },
  { id: 'PATTERN_DETECTION',    label: 'Pattern Detection',               description: 'Detect round numbers, duplicate entries, gaps, and anomalies' },
];

// ── HELPER FUNCTIONS ────────────────────────────────────────────────────────

export const getStepById = (id) => WORKFLOW_STEPS.find(s => s.id === id);
export const getStepByNumber = (num) => WORKFLOW_STEPS.find(s => s.number === num);
export const getNextStep = (currentStepId) => {
  const idx = WORKFLOW_STEP_IDS.indexOf(currentStepId);
  return idx < WORKFLOW_STEP_IDS.length - 1 ? WORKFLOW_STEP_IDS[idx + 1] : null;
};
export const getPreviousStep = (currentStepId) => {
  const idx = WORKFLOW_STEP_IDS.indexOf(currentStepId);
  return idx > 0 ? WORKFLOW_STEP_IDS[idx - 1] : null;
};
