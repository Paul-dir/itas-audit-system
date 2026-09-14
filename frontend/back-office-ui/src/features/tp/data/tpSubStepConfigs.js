/**
 * Transfer Pricing Audit Execution — Strict 8 Governance Gates & 48 Sub-Steps
 * Statutory framework under Ethiopian Tax Administration Proclamation 979/2016 & TP Directives
 */

export const AUDITOR_PHASES = [
  { 
    id: 'DETAILED_RISK_ASSESSMENT', 
    num: 1, 
    label: '1. Risk Assessment & Evidence', 
    authority: 'TP Team Leader', 
    authorityRole: 'TEAM_LEADER',
    description: 'Establish transfer pricing risk profile, score BEPS flags, and assemble baseline evidence.'
  },
  { 
    id: 'AUDIT_PLANNING', 
    num: 2, 
    label: '2. Audit Planning & Programming', 
    authority: 'TP Team Leader', 
    authorityRole: 'TEAM_LEADER',
    description: 'Formulate audit plan, materiality thresholds, research comparable markets, and hold Entry Conference.'
  },
  { 
    id: 'FIELD_WORK', 
    num: 3, 
    label: '3. Field Work & Facts', 
    authority: 'TP Team Leader', 
    authorityRole: 'TEAM_LEADER',
    description: 'Execute FAR functional analysis, inspect books, issue IDRs, and sign off Statement of Facts.'
  },
  { 
    id: 'ANALYSIS', 
    num: 4, 
    label: '4. Economic Analysis & IQR', 
    authority: 'TP Committee / Process Owner', 
    authorityRole: 'COMMITTEE',
    description: 'Select most appropriate method (MAM), identify tested party, screen comparables, and compute IQR.'
  },
  { 
    id: 'REPORT', 
    num: 5, 
    label: '5. TP Report & Exit Conf.', 
    authority: 'TP Committee / Process Owner', 
    authorityRole: 'COMMITTEE',
    description: 'Draft comprehensive TP audit report, conduct formal Exit Conference, and evaluate taxpayer rebuttal.'
  },
  { 
    id: 'ASSESSMENT', 
    num: 6, 
    label: '6. Assessment & Notice Draft', 
    authority: 'Audit Director & Process Owner', 
    authorityRole: 'DIRECTOR',
    description: 'Compute final tax base adjustments, statutory penalties, late interest, and draft statutory assessment notice.'
  },
  { 
    id: 'NOTICE', 
    num: 7, 
    label: '7. Notice & Objection', 
    authority: 'Objection Review Authority', 
    authorityRole: 'COMMITTEE',
    description: 'Serve statutory notice, track 30-day objection window under Art. 99, and prepare auditor defense rejoinder.'
  },
  { 
    id: 'CLOSURE', 
    num: 8, 
    label: '8. Audit Closure', 
    authority: 'TP Team Leader & Audit Director', 
    authorityRole: 'DIRECTOR',
    description: 'Verify tax collection order, issue clearance certificate, archive dossier, and conclude audit case.'
  }
];

export const PHASE_SUB_STEPS = {
  DETAILED_RISK_ASSESSMENT: [
    {
      id: '1.1',
      title: '1.1 Related Party Transaction Scoping',
      desc: 'Extract and verify Schedule 5 disclosures, cross-border parent/subsidiary contracts, and royalty/service agreements.',
      guidance: 'Review all international and domestic controlled transactions exceeding statutory disclosure thresholds.'
    },
    {
      id: '1.2',
      title: '1.2 Financial Ratio & Operating Margin Profiling',
      desc: 'Compute multi-year operating margins, Berry ratio, and ROCE against sector averages.',
      guidance: 'Analyze 3-5 year financial trends to detect sustained profit suppression in the local affiliate.'
    },
    {
      id: '1.3',
      title: '1.3 Risk Flag & BEPS Factor Matrix',
      desc: 'Score BEPS risk flags (continuous losses in profitable group, high management fees to low-tax jurisdictions, IP migration).',
      guidance: 'Identify base erosion mechanisms under Action 8-10 transfer pricing risk indicators.'
    },
    {
      id: '1.4',
      title: '1.4 Preliminary Materiality Calculation',
      desc: 'Establish preliminary planning materiality and tolerable deviation limits.',
      guidance: 'Set quantitative materiality threshold based on gross turnover and total controlled transaction volume.'
    },
    {
      id: '1.5',
      title: '1.5 Taxpayer Evidence Dossier Assembly',
      desc: 'Collect and catalog initial documentation (local file, audited financial statements, customs declarations).',
      guidance: 'Verify mandatory statutory documentation availability pursuant to Art. 45 requirements.'
    },
    {
      id: '1.6',
      title: '1.6 Risk Assessment Summary & Recommendation',
      desc: 'Formalize preliminary audit scope and recommend embarking on detailed audit program.',
      guidance: 'Synthesize risk findings and submit formal risk assessment dossier to TP Team Leader for review.'
    }
  ],
  AUDIT_PLANNING: [
    {
      id: '2.1',
      title: '2.1 Audit Scope & Tax Periods Definition',
      desc: 'Define tax years under audit, covered transactions, and statutory limitation checks (5-year rule).',
      guidance: 'Verify statutory assessment bar periods under Article 27 of Proclamation 979/2016.'
    },
    {
      id: '2.2',
      title: '2.2 Quantitative Materiality & Sampling Thresholds',
      desc: 'Finalize planning materiality (PM), tolerable misstatement, and sample selection parameters.',
      guidance: 'Document performance materiality (typically 65-75% of overall planning materiality).'
    },
    {
      id: '2.3',
      title: '2.3 Industry & Market Comparability Research',
      desc: 'Research market conditions, regulatory caps (e.g. NBE foreign service fee limits), and macro indicators.',
      guidance: 'Analyze industry dynamics, government price controls, customs tariff lines, and import restrictions.'
    },
    {
      id: '2.4',
      title: '2.4 Audit Program & Timetable Formulation',
      desc: 'Allocate audit man-hours, specialist tasks, and statutory milestone dates.',
      guidance: 'Schedule required auditor audit days, economist support, and preliminary field visit dates.'
    },
    {
      id: '2.5',
      title: '2.5 Taxpayer Engagement & Notice of Audit',
      desc: 'Draft and dispatch formal Notice of Audit under Article 23/78.',
      guidance: 'Notify taxpayer in writing at least 15 working days prior to on-site field work commencement.'
    },
    {
      id: '2.6',
      title: '2.6 Formal Entry Conference Conduct & Minutes',
      desc: 'Host entry conference with taxpayer management; record and upload signed minutes.',
      guidance: 'Document audit scope, designated liaison officers, document transmission protocol, and expected milestones.'
    }
  ],
  FIELD_WORK: [
    {
      id: '3.1',
      title: '3.1 Information Document Request (IDR) Log',
      desc: 'Issue structured IDRs for technical agreements, time-sheets, and board minutes; track 15-day response deadlines.',
      guidance: 'Track formal requests under Article 46. Ensure proof of service and document delivery receipts.'
    },
    {
      id: '3.2',
      title: '3.2 Functional Analysis (FAR - Functions)',
      desc: 'Map operational decision-makers, R&D activities, procurement autonomy, and sales channels.',
      guidance: 'Ascertain whether local entity performs significant economic functions or acts as routine distributor/contractor.'
    },
    {
      id: '3.3',
      title: '3.3 Asset Utilization Verification',
      desc: 'Verify legal vs. economic ownership of valuable intangibles, software licenses, and capital machinery.',
      guidance: 'Differentiate between routine tangible assets and high-value marketing or trade intangibles (DEMPE functions).'
    },
    {
      id: '3.4',
      title: '3.4 Risk Allocation & Assumption Assessment',
      desc: 'Analyze which entity economically bears market risk, credit risk, inventory obsolescence, and foreign exchange risk.',
      guidance: 'Determine financial capacity of the affiliate to bear risk under contractual vs economic reality.'
    },
    {
      id: '3.5',
      title: '3.5 On-Site Operational Inspection & Personnel Interviews',
      desc: 'Record interview notes with plant managers, technical leads, and finance staff.',
      guidance: 'Conduct walkthrough tests of intercompany transaction processing and service delivery verification.'
    },
    {
      id: '3.6',
      title: '3.6 Formal Statement of Facts Compilation',
      desc: 'Draft Statement of Facts and secure taxpayer sign-off on underlying operational facts.',
      guidance: 'Establish agreed factual foundation before undertaking economic benchmarking and IQR calculations.'
    }
  ],
  ANALYSIS: [
    {
      id: '4.1',
      title: '4.1 Most Appropriate Method (MAM) Selection',
      desc: 'Screen and justify methodology (CUP, Resale Price, Cost Plus, TNMM, Profit Split) against TP Directives.',
      guidance: 'Justify rejection of higher-tier transactional methods (CUP/RPM/CPM) in favor of transactional net margin method (TNMM).'
    },
    {
      id: '4.2',
      title: '4.2 Tested Party Identification',
      desc: 'Designate tested party (local entity vs. foreign affiliate) based on least complex functional profile.',
      guidance: 'Select party with reliable financial data and without unique, valuable intangible assets.'
    },
    {
      id: '4.3',
      title: '4.3 Profit Level Indicator (PLI) Selection',
      desc: 'Select PLI (Operating Margin, Full Cost Mark-up, Berry Ratio) based on industry standards.',
      guidance: 'Operating Margin (OM = EBIT / Sales) for sales/distribution; Full Cost Plus (NCP = EBIT / Total Costs) for services/manufacturing.'
    },
    {
      id: '4.4',
      title: '4.4 Comparable Search & Screening Strategy',
      desc: 'Document database search strategy, independence criteria, rejection matrix, and selected comparables.',
      guidance: 'Apply quantitative filters: independence threshold >50%, active operational status, multi-year financial availability.'
    },
    {
      id: '4.5',
      title: '4.5 Economic & Working Capital Adjustments',
      desc: 'Apply standard accounting and working capital adjustments (receivables, inventory, payables).',
      guidance: 'Neutralize working capital financing differences using standard prime commercial interest rates.'
    },
    {
      id: '4.6',
      title: '4.6 Interquartile Range (IQR) & Median Calculation',
      desc: 'Compute 25th percentile, median, and 75th percentile; determine arm’s length adjustment point.',
      guidance: 'Under Article 79, if tested party result falls outside the IQR, adjust to the median of the arm’s length range.'
    }
  ],
  REPORT: [
    {
      id: '5.1',
      title: '5.1 Comprehensive TP Audit Report Drafting',
      desc: 'Consolidate executive summary, FAR analysis, economic benchmarks, and proposed tax adjustments.',
      guidance: 'Draft complete audit report detailing background, legal authority, factual findings, and economic adjustments.'
    },
    {
      id: '5.2',
      title: '5.2 Draft Report Supervisory Review',
      desc: 'Conduct internal technical review with TP Team Leader to address evidentiary gaps.',
      guidance: 'Team leader verifies legal citations, comparability quality, and calculation accuracy before taxpayer meeting.'
    },
    {
      id: '5.3',
      title: '5.3 Formal Exit Conference Convening',
      desc: 'Present preliminary audit findings and proposed adjustments to taxpayer management and tax advisors.',
      guidance: 'Hold formal exit meeting pursuant to Article 80. Provide taxpayer opportunity to present preliminary rebuttal.'
    },
    {
      id: '5.4',
      title: '5.4 Exit Conference Minutes & Attendance',
      desc: 'Upload signed minutes recording taxpayer verbal rebuttals and attendance roster.',
      guidance: 'Ensure taxpayer representative signs attendance register acknowledging receipt of draft findings summary.'
    },
    {
      id: '5.5',
      title: '5.5 Taxpayer Written Rebuttal Evaluation',
      desc: 'Review taxpayer’s 10-day rebuttal submission and prepare auditor technical counter-arguments.',
      guidance: 'Evaluate any new economic evidence or alternative comparables presented by the taxpayer.'
    },
    {
      id: '5.6',
      title: '5.6 Final Audit Findings Endorsement Dossier',
      desc: 'Finalize report package for committee endorsement.',
      guidance: 'Submit finalized report dossier to TP Committee / Process Owner for formal authorization.'
    }
  ],
  ASSESSMENT: [
    {
      id: '6.1',
      title: '6.1 Tax Base Adjustment Computation',
      desc: 'Calculate additional taxable income per tax year resulting from TP arm’s length adjustment.',
      guidance: 'Multiply audited sales/expenses variance by adjustment percentage across all open audit tax years.'
    },
    {
      id: '6.2',
      title: '6.2 Statutory Penalties Calculation',
      desc: 'Apply under-declaration penalties under Tax Administration Proclamation 979/2016.',
      guidance: 'Compute Article 105 penalties (20% for first under-declaration; 50% for substantial or deliberate non-compliance).'
    },
    {
      id: '6.3',
      title: '6.3 Statutory Late Interest Calculation',
      desc: 'Compute statutory interest from original return due dates to assessment date.',
      guidance: 'Apply statutory interest rate under Article 104 compounded according to ministerial regulations.'
    },
    {
      id: '6.4',
      title: '6.4 Statutory Assessment Notice Drafting',
      desc: 'Draft formal assessment notice citing legal provisions, payment deadlines, and bank remittance accounts.',
      guidance: 'Format notice under Article 98 specifying 30-day payment deadline and statutory objection rights.'
    },
    {
      id: '6.5',
      title: '6.5 Legal & Compliance Verification',
      desc: 'Legal officer review ensuring compliance with statutory limitation periods and notice requirements.',
      guidance: 'Verify formal service address and absence of jurisdictional or procedural defects.'
    },
    {
      id: '6.6',
      title: '6.6 Submission for Authorized Official Signature',
      desc: 'Forward notice package for executive sign-off.',
      guidance: 'Submit to Audit Director & TP Process Owner for digital authorization and statutory issuance.'
    }
  ],
  NOTICE: [
    {
      id: '7.1',
      title: '7.1 Formal Notice Service & Proof of Delivery',
      desc: 'Serve notice via registered mail/hand delivery; start Article 99 30-day statutory countdown.',
      guidance: 'Record exact date of service on taxpayer to establish statutory objection deadline.'
    },
    {
      id: '7.2',
      title: '7.2 Taxpayer Payment / Objection Ingestion',
      desc: 'Record whether taxpayer made 25% deposit, full payment, or filed a formal notice of objection.',
      guidance: 'Under Article 99(2), taxpayer must deposit 25% of disputed tax before objection can be entertained.'
    },
    {
      id: '7.3',
      title: '7.3 Objection Grounds Legal & Technical Dissection',
      desc: 'Dissect each ground of objection submitted by taxpayer (methodology, comparables, penalties).',
      guidance: 'Classify objection points: factual disputes, legal interpretation, methodology challenge, or penalty relief.'
    },
    {
      id: '7.4',
      title: '7.4 Auditor Technical Defense Rejoinder',
      desc: 'Prepare comprehensive rejoinder refuting objection arguments or recommending partial adjustment.',
      guidance: 'Provide evidentiary backing for each contested benchmark and legal justification.'
    },
    {
      id: '7.5',
      title: '7.5 Objection Review Session / Reconciliation Hearing',
      desc: 'Attend formal objection hearing before Tax Decision / Review Committee.',
      guidance: 'Present case dossier and answer committee inquiries regarding economic benchmarks and audit evidence.'
    },
    {
      id: '7.6',
      title: '7.6 Final Administrative Determination Recording',
      desc: 'Record committee’s final objection ruling (upheld, amended, or rejected).',
      guidance: 'Record final revised tax liability or dismissal of objection in the case record.'
    }
  ],
  CLOSURE: [
    {
      id: '8.1',
      title: '8.1 Collection Order & Revenue Remittance Verification',
      desc: 'Verify final tax, penalty, and interest payment into Ministry of Revenues accounts.',
      guidance: 'Match bank deposit slips and SIGTAS/ITAS payment receipt transaction codes.'
    },
    {
      id: '8.2',
      title: '8.2 Tax Clearance / Audit Concluded Certificate',
      desc: 'Issue formal certificate stating audit is concluded for the audited tax years.',
      guidance: 'Provide taxpayer with formal written confirmation concluding the transfer pricing audit.'
    },
    {
      id: '8.3',
      title: '8.3 Risk Profile & Machine Learning Update',
      desc: 'Submit case findings, adjustments, and taxpayer behavior to risk engine for future scoring.',
      guidance: 'Update central risk scoring database with verified profit shifting tactics and affiliate details.'
    },
    {
      id: '8.4',
      title: '8.4 Lessons Learned & Directives Feedback',
      desc: 'Document policy gaps or comparable availability issues encountered during the audit.',
      guidance: 'Contribute technical feedback to TP Policy Directorate for future regulatory adjustments.'
    },
    {
      id: '8.5',
      title: '8.5 Complete Digital Audit Dossier Archival',
      desc: 'Package all evidence, workpapers, IDRs, minutes, reports, and notices into an encrypted archival file.',
      guidance: 'Create tamper-evident statutory archive compliant with 10-year evidentiary record retention.'
    },
    {
      id: '8.6',
      title: '8.6 Final Supervisory Sign-Off & Case Status CONCLUDED',
      desc: 'Final supervisor and director sign-off marking the case status as CONCLUDED.',
      guidance: 'Case formally closed in ITAS system. All allocated auditor hours released.'
    }
  ]
};

export function getPreviousPhaseId(phaseId) {
  const idx = AUDITOR_PHASES.findIndex(p => p.id === phaseId);
  return idx > 0 ? AUDITOR_PHASES[idx - 1].id : null;
}

export function getNextPhaseId(phaseId) {
  const idx = AUDITOR_PHASES.findIndex(p => p.id === phaseId);
  return idx >= 0 && idx < AUDITOR_PHASES.length - 1 ? AUDITOR_PHASES[idx + 1].id : null;
}

export function getPhaseConfig(phaseId) {
  return AUDITOR_PHASES.find(p => p.id === phaseId) || AUDITOR_PHASES[0];
}
