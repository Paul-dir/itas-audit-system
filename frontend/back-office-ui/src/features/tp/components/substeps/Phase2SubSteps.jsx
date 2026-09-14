import React, { useState, useMemo } from 'react';
import { 
  Calendar, FileText, CheckCircle2, AlertTriangle, 
  Layers, BarChart2, DollarSign, Building2, Check, ArrowRight,
  Scale, Clock, Users, Send, FileCheck, Info, ShieldAlert,
  Plus, Trash2, Edit3, Save, AlertOctagon, HelpCircle,
  ExternalLink, ChevronDown, ChevronUp, Printer, Calculator,
  Sliders, UserCheck, Briefcase, Lock, CheckSquare, Globe,
  Percent, ClipboardList
} from 'lucide-react';
import { Card, Button, Badge, Input, Textarea, Select } from '../../../../components/ui/index.jsx';

// Default target tax years for 5-Year Statute of Limitations check
const DEFAULT_TAX_YEARS = [
  {
    year: 'FY 2020 (EFY 2012)',
    filingDate: '2020-10-31',
    expiryDate: '2025-10-31',
    status: 'APPROACHING_BAR',
    statusLabel: 'Statute Expiry Near (Within 12 Mo)',
    isBarred: false,
    turnover: 260000000,
    citPaid: 1890000,
    whtRemitted: 3850000,
    covered: true
  },
  {
    year: 'FY 2021 (EFY 2013)',
    filingDate: '2021-10-31',
    expiryDate: '2026-10-31',
    status: 'OPEN_VALID',
    statusLabel: 'Open & Within 5-Year Statute',
    isBarred: false,
    turnover: 310000000,
    citPaid: 1260000,
    whtRemitted: 4200000,
    covered: true
  },
  {
    year: 'FY 2022 (EFY 2014)',
    filingDate: '2022-10-31',
    expiryDate: '2027-10-31',
    status: 'OPEN_VALID',
    statusLabel: 'Open & Within 5-Year Statute',
    isBarred: false,
    turnover: 375000000,
    citPaid: 630000,
    whtRemitted: 4800000,
    covered: true
  },
  {
    year: 'FY 2023 (EFY 2015)',
    filingDate: '2023-10-31',
    expiryDate: '2028-10-31',
    status: 'OPEN_VALID',
    statusLabel: 'Open & Within 5-Year Statute',
    isBarred: false,
    turnover: 415000000,
    citPaid: 0,
    whtRemitted: 5200000,
    covered: true
  },
  {
    year: 'FY 2024 (EFY 2016)',
    filingDate: '2024-10-31',
    expiryDate: '2029-10-31',
    status: 'OPEN_VALID',
    statusLabel: 'Open & Within 5-Year Statute',
    isBarred: false,
    turnover: 450000000,
    citPaid: 0,
    whtRemitted: 5600000,
    covered: true
  }
];

// Default controlled transactions for scoping matrix fallback
const DEFAULT_SCOPING_TRANSACTIONS = [
  {
    id: 'tx-1',
    type: 'MANAGEMENT_FEES',
    stream: 'Headquarter Central Management & IT Services',
    foreignEntity: 'Crest Global Services Ltd',
    jurisdiction: 'Mauritius (Low Tax Hub)',
    isHaven: true,
    totalValue: 38500000,
    method: 'TNMM',
    riskFlag: 'CRITICAL',
    statutoryBasis: 'Art. 45 & Art. 79 Procl. 979/2016'
  },
  {
    id: 'tx-2',
    type: 'TANGIBLE_GOODS',
    stream: 'Import of Active Pharmaceutical Ingredients (API)',
    foreignEntity: 'PharmaTech International BV',
    jurisdiction: 'Netherlands',
    isHaven: false,
    totalValue: 62400000,
    method: 'CUP / Resale Price',
    riskFlag: 'HIGH',
    statutoryBasis: 'Art. 79 Procl. 979/2016'
  },
  {
    id: 'tx-3',
    type: 'ROYALTY_IP',
    stream: 'Brand License & Trademark Exploitation Rights',
    foreignEntity: 'Apex IP Holdings Sarl',
    jurisdiction: 'Switzerland',
    isHaven: true,
    totalValue: 14800000,
    method: 'TNMM',
    riskFlag: 'HIGH',
    statutoryBasis: 'Directive No. 43/2015 Art. 12'
  },
  {
    id: 'tx-4',
    type: 'INTERCOMPANY_LOAN',
    stream: 'Subordinated Working Capital Facility (LIBOR+4.5%)',
    foreignEntity: 'AfriCapital Finance LLC',
    jurisdiction: 'Delaware, USA',
    isHaven: false,
    totalValue: 10100000,
    method: 'CUP Interest Benchmark',
    riskFlag: 'MEDIUM',
    statutoryBasis: 'Directive No. 43/2015 Art. 14'
  }
];

// Default team members roster
const DEFAULT_AUDIT_TEAM = [
  {
    role: 'Lead Senior TP Auditor',
    name: 'Alemayehu Tadesse',
    id: 'MOR-AUD-4819',
    focus: 'Case Leadership, Fieldwork, FAR Interviews & Audit Report Drafting',
    hours: 140
  },
  {
    role: 'Transfer Pricing Economist',
    name: 'Bethlehem Haile',
    id: 'MOR-ECO-1092',
    focus: 'Economic Benchmarking, Database Screening (Orbis) & IQR Calculation',
    hours: 90
  },
  {
    role: 'Forensic IT & ERP Specialist',
    name: 'Dawit Getachew',
    id: 'MOR-IT-3321',
    focus: 'SAP/Oracle General Ledger Extraction, Invoicing Reconciliation & Data Mining',
    hours: 60
  },
  {
    role: 'Legal & Tax Treaty Counsel',
    name: 'Rahel Zerihun',
    id: 'MOR-LEG-0844',
    focus: 'DTAA Treaty Provisions, Art. 45 Safe Harbors & Statutory Penalty Framework',
    hours: 40
  },
  {
    role: 'TP Team Leader / Supervisor',
    name: 'Solomon Worku',
    id: 'MOR-TL-0210',
    focus: 'Supervisory Review, Phase Gate Endorsements & Quality Assurance',
    hours: 20
  }
];

// Default Entry Conference Attendees
const DEFAULT_ATTENDEES = [
  { id: 'att-1', name: 'Solomon Worku', title: 'Transfer Pricing Team Leader', organization: 'Ministry of Revenues (LTO)', side: 'AUTHORITY' },
  { id: 'att-2', name: 'Alemayehu Tadesse', title: 'Lead Senior TP Auditor', organization: 'Ministry of Revenues (LTO)', side: 'AUTHORITY' },
  { id: 'att-3', name: 'Bethlehem Haile', title: 'TP Benchmarking Economist', organization: 'Ministry of Revenues (LTO)', side: 'AUTHORITY' },
  { id: 'att-4', name: 'Dr. Marcus Vance', title: 'Managing Director & CEO', organization: 'Taxpayer Enterprise', side: 'TAXPAYER' },
  { id: 'att-5', name: 'Tewodros Kassahun', title: 'Chief Financial Officer (CFO)', organization: 'Taxpayer Enterprise', side: 'TAXPAYER' },
  { id: 'att-6', name: 'Ato Yonas Bekele', title: 'Senior Partner / Tax Counsel (Power of Attorney Verified)', organization: 'Deloitte East Africa (Tax Advisor)', side: 'TAXPAYER' }
];

// Default Sampling Items for Sub-step 2.4
const DEFAULT_SAMPLE_ITEMS = [
  { id: 'SMP-01', stream: 'Management & IT Services', counterparty: 'Crest Global Services Ltd', ref: 'INV-CGS-2023-11', date: '2023-11-15', amount: 9800000, stratum: 'Tier 1 (100% Substantive)', procedure: '5-Step Benefit Test & Service Delivery Verification' },
  { id: 'SMP-02', stream: 'Management & IT Services', counterparty: 'Crest Global Services Ltd', ref: 'INV-CGS-2024-03', date: '2024-03-20', amount: 11200000, stratum: 'Tier 1 (100% Substantive)', procedure: 'Direct Cost Allocation & Mark-Up Substantiation' },
  { id: 'SMP-03', stream: 'Active Pharmaceutical Ingredients', counterparty: 'PharmaTech International BV', ref: 'DEC-ASYCUDA-78192', date: '2023-08-10', amount: 18400000, stratum: 'Tier 1 (100% Substantive)', procedure: 'Customs Valuation vs CUP Independent Benchmark' },
  { id: 'SMP-04', stream: 'Active Pharmaceutical Ingredients', counterparty: 'PharmaTech International BV', ref: 'DEC-ASYCUDA-84011', date: '2024-02-14', amount: 14200000, stratum: 'Tier 1 (100% Substantive)', procedure: 'Freight, Insurance & Third-Party Supplier Comparison' },
  { id: 'SMP-05', stream: 'Brand License & Trademark', counterparty: 'Apex IP Holdings Sarl', ref: 'AGR-ROY-2023-Q4', date: '2023-12-31', amount: 7400000, stratum: 'Tier 1 (100% Substantive)', procedure: 'DEMPE Functional Analysis & Economic Value Addition' },
  { id: 'SMP-06', stream: 'Intercompany Loan Facility', counterparty: 'AfriCapital Finance LLC', ref: 'LOAN-INT-2023-AN', date: '2023-12-15', amount: 4800000, stratum: 'Tier 2 (Targeted Representative)', procedure: 'LIBOR/SOFR Spread Verification & Thin-Cap Test' },
  { id: 'SMP-07', stream: 'Active Pharmaceutical Ingredients', counterparty: 'PharmaTech International BV', ref: 'DEC-ASYCUDA-91102', date: '2024-05-19', amount: 8900000, stratum: 'Tier 2 (Targeted Representative)', procedure: 'Gross Margin Resale Price Walkthrough Test' }
];

export default function Phase2SubSteps({
  subStepId,
  onSelectSubStep,
  onProceedToPhase,
  fullState,
  planObj,
  setPlanObj,
  planScope,
  setPlanScope,
  materialityThreshold,
  setMaterialityThreshold,
  planningMaterialityPct,
  setPlanningMaterialityPct,
  tolerableMisstatement,
  setTolerableMisstatement,
  qualitativeFactors,
  setQualitativeFactors,
  industryResearch,
  setIndustryResearch,
  samplingMethod,
  setSamplingMethod,
  allocatedHours,
  setAllocatedHours,
  timelineDays,
  setTimelineDays,
  completedSubSteps,
  onToggleComplete,
  saving,
  executeApiAction,
  isReadOnly = false
}) {
  const isDone = completedSubSteps.includes(subStepId);

  // Derive controlled transactions from Phase 1 or fallback
  const transactions = useMemo(() => {
    const existing = fullState?.riskAssessment?.riskDetails?.controlledTransactions;
    return existing && existing.length > 0 ? existing : DEFAULT_SCOPING_TRANSACTIONS;
  }, [fullState]);

  const totalTxValue = useMemo(() => {
    return transactions.reduce((acc, tx) => acc + (Number(tx.totalValue) || 0), 0);
  }, [transactions]);

  // ── State for Sub-Step 2.1: Scope & Statutory Notice ──────────────────────────
  const [taxYears, setTaxYears] = useState(DEFAULT_TAX_YEARS);
  const [coveredTaxes, setCoveredTaxes] = useState({
    cit: true,
    dividendWht: true,
    royaltyWht: true,
    customsRecon: true,
    stampDuty: false
  });
  const [invokeFraudException, setInvokeFraudException] = useState(false);
  const [fraudJustification, setFraudJustification] = useState('');
  const [noticeRef, setNoticeRef] = useState('MOR/LTO/TP-AUD/2024/0088');
  const [noticeDate, setNoticeDate] = useState('2024-11-04');
  const [scheduledAuditStart, setScheduledAuditStart] = useState('2024-11-25');
  const [dispatchMethod, setDispatchMethod] = useState('HAND_DELIVERY_BAILIFF');
  const [recipientOfficer, setRecipientOfficer] = useState('Managing Director & Chief Financial Officer');
  const [deliveryReceiptNumber, setDeliveryReceiptNumber] = useState('REC-MOR-2024-7741');
  const [noticeDraftNotes, setNoticeDraftNotes] = useState(
    'Formal Statutory Notice of Transfer Pricing Audit pursuant to Article 27 of Tax Administration Proclamation No. 983/2016 and Article 23 of Federal Income Tax Proclamation No. 979/2016 served on taxpayer management.'
  );
  const [showNoticeModal, setShowNoticeModal] = useState(false);

  // ── State for Sub-Step 2.2: Planning Materiality ──────────────────────────────
  const [materialityBase, setMaterialityBase] = useState('TURNOVER'); // TURNOVER, CONTROLLED_TX, ASSETS
  const turnoverBaseValue = 450000000; // From FY 2024 financials
  const effectiveBaseValue = materialityBase === 'TURNOVER' ? turnoverBaseValue : totalTxValue;
  
  // Benchmark percentage (default 1.0% of turnover or 3.5% of controlled tx)
  const currentMaterialityPct = planningMaterialityPct || (materialityBase === 'TURNOVER' ? 1.0 : 3.5);
  const computedPlanningMateriality = Math.round(effectiveBaseValue * (currentMaterialityPct / 100));
  const effectivePlanningMateriality = materialityThreshold || computedPlanningMateriality;
  
  const tolerablePct = 70; // 70% of planning materiality
  const computedTolerableMisstatement = Math.round(effectivePlanningMateriality * (tolerablePct / 100));
  const effectiveTolerableMisstatement = tolerableMisstatement || computedTolerableMisstatement;
  const clearlyTrivialCutoff = Math.round(effectivePlanningMateriality * 0.05);

  const [qualitativeChecklist, setQualitativeChecklist] = useState({
    havenAffiliates: true,
    consecutiveLosses: true,
    unilateralMgmtFees: true,
    intangibleTransfers: true,
    thinCapExceeded: false,
    customsDiscrepancies: true
  });

  // ── State for Sub-Step 2.3: Industry & Economic Sector Research ───────────────
  const [isicCode, setIsicCode] = useState('2100 - Manufacture of Pharmaceuticals & Medicinal Chemical Products');
  const [functionalProfile, setFunctionalProfile] = useState('LIMITED_RISK_MANUFACTURER_DISTRIBUTOR');
  const [commercialDb, setCommercialDb] = useState('BUREAU_VAN_DIJK_ORBIS');
  const [regionFilter, setRegionFilter] = useState('SUB_SAHARAN_AFRICA_AND_MENA');
  const [independenceFilter, setIndependenceFilter] = useState('B_PLUS_OR_HIGHER');
  const [prelimIqrLower, setPrelimIqrLower] = useState(4.85);
  const [prelimIqrMedian, setPrelimIqrMedian] = useState(6.80);
  const [prelimIqrUpper, setPrelimIqrUpper] = useState(9.40);
  const [testedPli, setTestedPli] = useState('OPERATING_MARGIN');
  const [macroEconomicNotes, setMacroEconomicNotes] = useState(
    industryResearch || 
    'Pharmaceutical sector operates under National Bank of Ethiopia (NBE) foreign exchange priority queues and Directive FXD/83/2021. Raw material inputs (APIs) imported from Netherlands affiliate at prices 18-24% above global spot indexes. Domestic retail selling prices are partially subject to Ministry of Health essential medicine price ceilings, contributing to margin compression.'
  );

  // ── State for Sub-Step 2.4: Audit Sampling & Transaction Stratification ───────
  const [sampleMethodology, setSampleMethodology] = useState(
    samplingMethod || 'STRATIFIED_KEY_ITEM_AND_MUS'
  );
  const [confidenceLevel, setConfidenceLevel] = useState('95%');
  const [expectedMisstatementRate, setExpectedMisstatementRate] = useState(2.5);
  const [sampleItems, setSampleItems] = useState(DEFAULT_SAMPLE_ITEMS);
  const [showAddSampleModal, setShowAddSampleModal] = useState(false);
  const [newSample, setNewSample] = useState({
    stream: 'Management & IT Services',
    counterparty: 'Crest Global Services Ltd',
    ref: '',
    date: '2024-01-15',
    amount: 5000000,
    stratum: 'Tier 1 (100% Substantive)',
    procedure: 'Benefit Test & Cost Base Substantiation'
  });

  // ── State for Sub-Step 2.5: Team Formation & Timeline ─────────────────────────
  const [auditTeam, setAuditTeam] = useState(DEFAULT_AUDIT_TEAM);
  const totalAllocatedHours = useMemo(() => auditTeam.reduce((acc, member) => acc + (member.hours || 0), 0), [auditTeam]);
  const [totalBudgetedHours, setTotalBudgetedHours] = useState(allocatedHours || 350);
  const [targetTimelineDays, setTargetTimelineDays] = useState(timelineDays || 90);
  const [auditPhasesSchedule, setAuditPhasesSchedule] = useState([
    { phase: 'Phase 1: Risk Assessment & Hypothesis', days: 15, dates: 'Day 1 – Day 15', status: 'COMPLETED' },
    { phase: 'Phase 2: Planning & Programming', days: 10, dates: 'Day 16 – Day 25', status: 'IN_PROGRESS' },
    { phase: 'Phase 3: Fieldwork & FAR Verification', days: 25, dates: 'Day 26 – Day 50', status: 'PENDING' },
    { phase: 'Phase 4: Economic Analysis & Benchmarking', days: 20, dates: 'Day 51 – Day 70', status: 'PENDING' },
    { phase: 'Phase 5: Draft Report & Exit Conference', days: 10, dates: 'Day 71 – Day 80', status: 'PENDING' },
    { phase: 'Phase 6: Final Assessment & Gate Defense', days: 10, dates: 'Day 81 – Day 90', status: 'PENDING' }
  ]);

  // ── State for Sub-Step 2.6: Entry Conference Minutes ──────────────────────────
  const [entryConfVenue, setEntryConfVenue] = useState('Ministry of Revenues Large Taxpayers Office (LTO) Executive Boardroom');
  const [entryConfDate, setEntryConfDate] = useState('2024-11-26');
  const [entryConfChair, setEntryConfChair] = useState('Solomon Worku (TP Team Leader)');
  const [entryConfSecretary, setEntryConfSecretary] = useState('Alemayehu Tadesse (Lead Senior TP Auditor)');
  const [attendees, setAttendees] = useState(DEFAULT_ATTENDEES);
  const [showAddAttendeeModal, setShowAddAttendeeModal] = useState(false);
  const [newAttendee, setNewAttendee] = useState({ name: '', title: '', organization: '', side: 'TAXPAYER' });
  const [protocolAgreed, setProtocolAgreed] = useState({
    rightsExplained: true,
    fifteenDayIdrDeadline: true,
    spocAppointed: true,
    confidentialityUnderArt10: true,
    digitalPortalUsed: true
  });
  const [entryConfMinutes, setEntryConfMinutes] = useState(
    'Entry conference convened at 10:00 AM at the MoR LTO Executive Boardroom pursuant to Tax Administration Proclamation No. 983/2016. The TP Audit Team formally presented the audit mandate, statutory legal grounds under Article 79 of Proclamation 979/2016 and Directive No. 43/2015, and confirmed target audit tax years 2020 through 2024. Taxpayer legal counsel Ato Yonas Bekele confirmed receipt of the Article 27 statutory notice and presented registered Power of Attorney. Key discussion items agreed: (1) 15 working days turnaround for formal Information Document Requests (IDRs); (2) CFO Ato Tewodros designated as taxpayer single point of contact; (3) On-site operational walkthrough tests scheduled for December 4-6, 2024.'
  );

  // Sync back to parent state if props provided
  const handleMaterialityUpdate = (val) => {
    setMaterialityThreshold(val);
  };

  const handleTolerableUpdate = (val) => {
    setTolerableMisstatement(val);
  };

  // ═════════════════════════════════════════════════════════════════════════════
  // SUB-STEP 2.1: Audit Scope & Statutory Notice Formulation
  // ═════════════════════════════════════════════════════════════════════════════
  if (subStepId === '2.1') {
    return (
      <div className="space-y-6">
        {/* Statutory Banner */}
        <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl">
          <div className="flex items-start gap-3">
            <Scale className="text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
                Sub-Step 2.1: Audit Scope & Statutory Notice Formulation
              </h4>
              <p className="text-xs text-indigo-800 dark:text-indigo-300 mt-1 leading-relaxed">
                Pursuant to <strong>Article 27 & 28 of Tax Administration Proclamation No. 983/2016</strong> and <strong>Article 23 of Proclamation No. 979/2016</strong>, verify that all target tax years fall strictly within the 5-year statutory limitation period, define audit boundaries, and issue the formal 15-day statutory Notice of Audit.
              </p>
            </div>
          </div>
        </div>

        {/* 5-Year Statute of Limitations Verification Matrix */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Clock size={16} className="text-indigo-600" />
                Statute of Limitations Bar Verification Matrix (5-Year Statutory Rule)
              </h5>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Article 28(1): The Tax Authority cannot issue an assessment later than 5 years after the date the return was filed, unless Article 28(4) fraud applies.
              </p>
            </div>
            <Badge variant="outline" className="text-indigo-600 border-indigo-200">
              5 Statutory Years In-Scope
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Target Tax Year</th>
                  <th className="p-3">Return Filing Date</th>
                  <th className="p-3">Statutory 5-Yr Bar Date</th>
                  <th className="p-3 text-right">Reported Turnover</th>
                  <th className="p-3 text-right">CIT Paid</th>
                  <th className="p-3">Limitation Status</th>
                  <th className="p-3 text-center">In-Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {taxYears.map((yr, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{yr.year}</td>
                    <td className="p-3 font-mono text-[11px]">{yr.filingDate}</td>
                    <td className="p-3 font-mono text-[11px] text-indigo-600 font-bold">{yr.expiryDate}</td>
                    <td className="p-3 text-right font-mono">ETB {yr.turnover.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono">{yr.citPaid > 0 ? `ETB ${yr.citPaid.toLocaleString()}` : <span className="text-rose-500 font-semibold">Loss (0)</span>}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        yr.status === 'OPEN_VALID' 
                          ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' 
                          : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                      }`}>
                        <CheckCircle2 size={12} />
                        {yr.statusLabel}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={yr.covered}
                        onChange={(e) => {
                          const updated = [...taxYears];
                          updated[idx].covered = e.target.checked;
                          setTaxYears(updated);
                        }}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Article 28(4) Fraud Exception Bar */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="fraudToggle"
                checked={invokeFraudException}
                onChange={(e) => setInvokeFraudException(e.target.checked)}
                className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
              />
              <label htmlFor="fraudToggle" className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                Invoke Article 28(4) Fraud / Willful Evasion Exception (Removes 5-Year Statute Bar)
              </label>
            </div>
            {invokeFraudException && (
              <span className="text-rose-600 font-bold text-[11px] animate-pulse">
                REQUIRES MOR DIRECTOR GENERAL APPROVAL
              </span>
            )}
          </div>
          {invokeFraudException && (
            <div className="p-3 bg-rose-50/50 dark:bg-rose-950/20 border-t border-rose-200 dark:border-rose-900">
              <label className="block text-[11px] font-semibold text-rose-900 dark:text-rose-300 uppercase mb-1">
                Statutory Grounds & Evidentiary Prima Facie Justification for Fraud Exception
              </label>
              <Textarea
                value={fraudJustification}
                onChange={(e) => setFraudJustification(e.target.value)}
                rows={2}
                placeholder="Document concrete evidence of willful concealment, deliberate false transfer pricing filings, or sham contracts..."
              />
            </div>
          )}
        </div>

        {/* Audit Scope Boundaries & Covered Taxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={15} className="text-blue-600" />
              Covered Tax Categories
            </h5>
            <p className="text-[11px] text-slate-500">Select statutory tax heads encompassed by this transfer pricing examination:</p>
            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={coveredTaxes.cit}
                  onChange={(e) => setCoveredTaxes({ ...coveredTaxes, cit: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span>Corporate Income Tax (CIT) – Business Profit Tax (Art. 19)</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={coveredTaxes.dividendWht}
                  onChange={(e) => setCoveredTaxes({ ...coveredTaxes, dividendWht: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span>Dividend Withholding Tax on Constructive Dividends (Art. 55 – 10%)</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={coveredTaxes.royaltyWht}
                  onChange={(e) => setCoveredTaxes({ ...coveredTaxes, royaltyWht: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span>Royalties & Technical Management Fees Withholding (Art. 51/52 – 10%)</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={coveredTaxes.customsRecon}
                  onChange={(e) => setCoveredTaxes({ ...coveredTaxes, customsRecon: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span>ASYCUDA Customs Valuation & Import Price Reconciliation</span>
              </label>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck size={15} className="text-indigo-600" />
              Statutory Notice of Audit Dispatch Record
            </h5>
            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase">Notice Reference Number</label>
                <Input value={noticeRef} onChange={(e) => setNoticeRef(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase">Notice Issue Date</label>
                  <Input type="date" value={noticeDate} onChange={(e) => setNoticeDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase">Scheduled Audit Start</label>
                  <Input type="date" value={scheduledAuditStart} onChange={(e) => setScheduledAuditStart(e.target.value)} />
                </div>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                <span>Statutory 15-Day Advance Notice:</span>
                <span className="text-emerald-600 font-bold">✓ 21 Days Advance (COMPLIANT)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Scope & Objective Textarea */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Audit Scope & Controlled Transactions Covered
            </label>
            <Textarea
              value={planScope}
              onChange={(e) => setPlanScope(e.target.value)}
              rows={4}
              placeholder="e.g. Target years FY 2020-2024. Comprehensive examination of (1) Offshore management and IT service charges from Mauritius affiliate; (2) Active Pharmaceutical Ingredient (API) import pricing from Netherlands affiliate; (3) Swiss brand royalty exploitation fees; (4) Intercompany loan interest rate benchmarks under Art. 79."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Audit Objective & Statutory Mandate
            </label>
            <Textarea
              value={planObj}
              onChange={(e) => setPlanObj(e.target.value)}
              rows={4}
              placeholder="e.g. Determine whether the conditions in the taxpayer's controlled transactions differ from those that would be agreed between independent persons in comparable circumstances, verify application of arm's length principle under Article 79 of Proclamation 979/2016 and Directive No. 43/2015, and determine required profit adjustments."
            />
          </div>
        </div>

        {/* Formal Statutory Notice Preview Card */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Send className="text-blue-600" size={22} />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Formal Statutory Notice of Audit (Form MOR/TP-NOT-01)
              </div>
              <div className="text-[11px] text-slate-500">
                Ref: {noticeRef} • Issued pursuant to Article 27 Procl. 983/2016 • Addressed to: {recipientOfficer}
              </div>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowNoticeModal(true)}
            className="text-xs flex items-center gap-1.5"
          >
            <Printer size={14} />
            Preview Statutory Notice
          </Button>
        </div>

        {/* Sub-step Completion Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">
            5 target years verified within 5-year statute • Notice Ref: {noticeRef}
          </div>
          <div className="flex items-center gap-2">
            {isReadOnly ? (
              <div className="flex items-center gap-2">
                <Badge color="slate" className="py-1 px-3 text-xs flex items-center gap-1 font-medium">
                  <Lock size={12} /> Working Paper Locked (Statutory Record)
                </Badge>
                {onSelectSubStep && (
                  <Button
                    size="sm"
                    onClick={() => onSelectSubStep('2.2')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    Proceed to Sub-Step 2.2
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                )}
              </div>
            ) : isDone ? (
              <>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Sub-Step 2.1 Completed & Saved ✓</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await executeApiAction('/audit-plan', {
                      objective: planObj,
                      scope: planScope,
                      materialityDetails: {
                        planningMateriality: effectivePlanningMateriality,
                        tolerableMisstatement: effectiveTolerableMisstatement
                      }
                    }, 'Scope parameters updated.');
                    onToggleComplete('2.1', true, { planScope, planObj, taxYears, coveredTaxes, noticeRef, noticeDate });
                  }}
                  disabled={saving}
                  className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
                >
                  <Save size={13} className="mr-1.5" />
                  Update & Re-Save
                </Button>
                {onSelectSubStep && (
                  <Button
                    size="sm"
                    onClick={() => onSelectSubStep('2.2')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    Proceed to Sub-Step 2.2
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                )}
              </>
            ) : (
              <Button
                size="sm"
                onClick={async () => {
                  await executeApiAction('/audit-plan', {
                    objective: planObj,
                    scope: planScope,
                    materialityDetails: {
                      planningMateriality: effectivePlanningMateriality,
                      tolerableMisstatement: effectiveTolerableMisstatement
                    }
                  }, 'Audit scope and statutory notice record saved.');
                  onToggleComplete('2.1', true, { planScope, planObj, taxYears, coveredTaxes, noticeRef, noticeDate });
                }}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                <Check size={14} className="mr-1.5" />
                Save Scope & Mark Sub-Step 2.1 Complete
              </Button>
            )}
          </div>
        </div>

        {/* Notice Preview Modal */}
        {showNoticeModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="text-center pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Federal Democratic Republic of Ethiopia</div>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">Ministry of Revenues • Large Taxpayers Office (LTO)</div>
                <div className="text-xs text-indigo-600 font-semibold mt-1">TRANSFER PRICING AUDIT DIVISION</div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Notice Ref:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{noticeRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date of Issuance:</span>
                  <span className="font-mono">{noticeDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Addressed To:</span>
                  <span className="font-semibold">{recipientOfficer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Taxpayer TIN:</span>
                  <span className="font-mono">0004829104</span>
                </div>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-2 leading-relaxed">
                <p className="font-bold text-slate-900 dark:text-white">
                  SUBJECT: FORMAL STATUTORY NOTICE OF TRANSFER PRICING AUDIT UNDER ARTICLE 27 OF PROCLAMATION NO. 983/2016
                </p>
                <p>
                  Please be informed that pursuant to powers vested in the Ministry of Revenues under Article 27 of Tax Administration Proclamation No. 983/2016 and Article 23 of Federal Income Tax Proclamation No. 979/2016, your enterprise has been selected for a Transfer Pricing Audit covering tax years <strong>2020, 2021, 2022, 2023, and 2024</strong>.
                </p>
                <p>
                  The examination shall encompass all cross-border transactions conducted with related persons, including headquarter management fees, active pharmaceutical ingredient imports, trademark and brand licensing royalties, and intercompany financial facilities.
                </p>
                <p>
                  On-site audit procedures are scheduled to commence on <strong>{scheduledAuditStart}</strong>. You are requested to prepare the Transfer Pricing Local File, Master File, intercompany contracts, and audited financials for inspection.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <Button size="sm" onClick={() => setShowNoticeModal(false)}>
                  Close Notice Preview
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // SUB-STEP 2.2: Planning Materiality & Tolerable Misstatement Thresholds
  // ═════════════════════════════════════════════════════════════════════════════
  if (subStepId === '2.2') {
    return (
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
          <div className="flex items-start gap-3">
            <DollarSign className="text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
                Sub-Step 2.2: Planning Materiality & Tolerable Misstatement Thresholds
              </h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
                Establish the quantitative benchmark for <strong>Overall Planning Materiality (PM)</strong>, determine <strong>Performance Materiality / Tolerable Misstatement (TM)</strong>, and evaluate qualitative risk multipliers to formulate the transaction audit scoping cut-off.
              </p>
            </div>
          </div>
        </div>

        {/* Quantitative Materiality Formulation Workbench */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Calculator size={16} className="text-emerald-600" />
              Quantitative Materiality Benchmark Formulation
            </h5>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Benchmark Base:</span>
              <select
                value={materialityBase}
                onChange={(e) => setMaterialityBase(e.target.value)}
                className="text-xs bg-slate-100 dark:bg-slate-800 border-slate-300 rounded px-2.5 py-1 text-slate-900 dark:text-white"
              >
                <option value="TURNOVER">Gross Turnover (FY 2024: ETB 450,000,000)</option>
                <option value="CONTROLLED_TX">Controlled Transactions Total (ETB {totalTxValue.toLocaleString()})</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Benchmark Rate (%)</span>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={currentMaterialityPct}
                  onChange={(e) => setPlanningMaterialityPct(parseFloat(e.target.value))}
                  className="flex-1 accent-emerald-600 cursor-pointer"
                />
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-white w-12 text-right">
                  {currentMaterialityPct}%
                </span>
              </div>
              <div className="text-[10px] text-slate-500 mt-2">Standard MoR audit range: 0.5% – 2.0% of revenue</div>
            </div>

            <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                Planning Materiality (PM)
              </span>
              <div className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mt-1">
                ETB {effectivePlanningMateriality.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-600 mt-1">Overall materiality threshold for cumulative misstatement</div>
            </div>

            <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                Tolerable Misstatement (TM)
              </span>
              <div className="text-xl font-bold text-blue-800 dark:text-blue-200 mt-1">
                ETB {effectiveTolerableMisstatement.toLocaleString()}
              </div>
              <div className="text-[10px] text-blue-600 mt-1">Performance materiality (70% of PM) – Individual audit cut-off</div>
            </div>
          </div>

          <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center justify-between text-xs text-amber-800 dark:text-amber-200">
            <span className="font-semibold">Clearly Trivial / De Minimis Misstatement Threshold (5% of PM):</span>
            <strong className="font-mono text-sm">ETB {clearlyTrivialCutoff.toLocaleString()}</strong>
          </div>
        </div>

        {/* Qualitative Materiality Checklist */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
          <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert size={15} className="text-amber-600" />
            Qualitative Materiality Multipliers & Mandatory Audit Triggers
          </h5>
          <p className="text-[11px] text-slate-500">Transactions meeting any of these criteria require 100% substantive examination regardless of dollar value:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <label className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={qualitativeChecklist.havenAffiliates}
                onChange={(e) => setQualitativeChecklist({ ...qualitativeChecklist, havenAffiliates: e.target.checked })}
                className="mt-0.5 rounded text-rose-600"
              />
              <span>Counterparty situated in tax haven / low-tax regime (Mauritius, Delaware, Switzerland)</span>
            </label>
            <label className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={qualitativeChecklist.consecutiveLosses}
                onChange={(e) => setQualitativeChecklist({ ...qualitativeChecklist, consecutiveLosses: e.target.checked })}
                className="mt-0.5 rounded text-rose-600"
              />
              <span>Consecutive multi-year losses in profitable global group (FY 2023 & FY 2024)</span>
            </label>
            <label className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={qualitativeChecklist.unilateralMgmtFees}
                onChange={(e) => setQualitativeChecklist({ ...qualitativeChecklist, unilateralMgmtFees: e.target.checked })}
                className="mt-0.5 rounded text-rose-600"
              />
              <span>Unilateral management fees lacking contemporaneous proof of economic benefit</span>
            </label>
            <label className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={qualitativeChecklist.intangibleTransfers}
                onChange={(e) => setQualitativeChecklist({ ...qualitativeChecklist, intangibleTransfers: e.target.checked })}
                className="mt-0.5 rounded text-rose-600"
              />
              <span>High-value trademark and brand IP licensing to offshore IP holding companies</span>
            </label>
          </div>
        </div>

        {/* Transaction Scoping Matrix */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <ClipboardList size={16} className="text-blue-600" />
              Controlled Transactions Audit Scoping Matrix
            </h5>
            <span className="text-xs text-slate-500">
              Cut-off: TM = ETB {effectiveTolerableMisstatement.toLocaleString()}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Controlled Stream</th>
                  <th className="p-3">Counterparty & Haven Flag</th>
                  <th className="p-3 text-right">Value (ETB)</th>
                  <th className="p-3 text-right">% of Controlled Flow</th>
                  <th className="p-3 text-right">Comparison vs TM</th>
                  <th className="p-3">Assigned Audit Treatment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {transactions.map((tx) => {
                  const exceedsTM = tx.totalValue > effectiveTolerableMisstatement;
                  const isMustAudit = exceedsTM || tx.isHaven;
                  const pctOfFlow = totalTxValue > 0 ? ((tx.totalValue / totalTxValue) * 100).toFixed(1) : '0';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">{tx.stream}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <span>{tx.foreignEntity} ({tx.jurisdiction})</span>
                          {tx.isHaven && (
                            <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 text-[10px] font-bold">HAVEN</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-right font-mono font-bold">ETB {Number(tx.totalValue).toLocaleString()}</td>
                      <td className="p-3 text-right font-mono">{pctOfFlow}%</td>
                      <td className="p-3 text-right font-mono">
                        {exceedsTM ? (
                          <span className="text-rose-600 font-bold">Exceeds TM (+{Math.round((tx.totalValue / effectiveTolerableMisstatement) * 100 - 100)}%)</span>
                        ) : (
                          <span className="text-slate-400">Within TM</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          isMustAudit 
                            ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300' 
                            : 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                        }`}>
                          {isMustAudit ? '100% SUBSTANTIVE TESTING' : 'REPRESENTATIVE SAMPLING'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sub-step Completion Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">
            PM: ETB {effectivePlanningMateriality.toLocaleString()} • TM: ETB {effectiveTolerableMisstatement.toLocaleString()}
          </div>
          <div className="flex items-center gap-2">
            {isReadOnly ? (
              <div className="flex items-center gap-2">
                <Badge color="slate" className="py-1 px-3 text-xs flex items-center gap-1 font-medium">
                  <Lock size={12} /> Working Paper Locked (Statutory Record)
                </Badge>
                {onSelectSubStep && (
                  <Button
                    size="sm"
                    onClick={() => onSelectSubStep('2.3')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    Proceed to Sub-Step 2.3
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                )}
              </div>
            ) : isDone ? (
              <>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Sub-Step 2.2 Completed & Saved ✓</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await executeApiAction('/audit-plan', {
                      objective: planObj,
                      scope: planScope,
                      materialityDetails: {
                        planningMateriality: effectivePlanningMateriality,
                        tolerableMisstatement: effectiveTolerableMisstatement,
                        benchmarkRate: currentMaterialityPct,
                        clearlyTrivial: clearlyTrivialCutoff,
                        qualitativeChecklist
                      }
                    }, 'Materiality thresholds updated.');
                    onToggleComplete('2.2', true, {
                      planningMateriality: effectivePlanningMateriality,
                      tolerableMisstatement: effectiveTolerableMisstatement,
                      currentMaterialityPct
                    });
                  }}
                  disabled={saving}
                  className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
                >
                  <Save size={13} className="mr-1.5" />
                  Update & Re-Save
                </Button>
                {onSelectSubStep && (
                  <Button
                    size="sm"
                    onClick={() => onSelectSubStep('2.3')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    Proceed to Sub-Step 2.3
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                )}
              </>
            ) : (
              <Button
                size="sm"
                onClick={async () => {
                  await executeApiAction('/audit-plan', {
                    objective: planObj,
                    scope: planScope,
                    materialityDetails: {
                      planningMateriality: effectivePlanningMateriality,
                      tolerableMisstatement: effectiveTolerableMisstatement,
                      benchmarkRate: currentMaterialityPct,
                      clearlyTrivial: clearlyTrivialCutoff,
                      qualitativeChecklist
                    }
                  }, 'Planning materiality thresholds saved.');
                  onToggleComplete('2.2', true, {
                    planningMateriality: effectivePlanningMateriality,
                    tolerableMisstatement: effectiveTolerableMisstatement,
                    currentMaterialityPct
                  });
                }}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                <Check size={14} className="mr-1.5" />
                Save Materiality & Mark Sub-Step 2.2 Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // SUB-STEP 2.3: Industry & Economic Sector Research
  // ═════════════════════════════════════════════════════════════════════════════
  if (subStepId === '2.3') {
    return (
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
          <div className="flex items-start gap-3">
            <Building2 className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                Sub-Step 2.3: Industry & Economic Sector Research
              </h4>
              <p className="text-xs text-blue-800 dark:text-blue-300 mt-1 leading-relaxed">
                Characterize the taxpayer's functional profile within the multinational value chain, account for Ethiopian macroeconomic factors (NBE foreign exchange rationing, ETB devaluation), and configure commercial database search parameters (Bureau van Dijk Orbis) for preliminary arm's length benchmarking.
              </p>
            </div>
          </div>
        </div>

        {/* Industry & Functional Profile Classification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase size={15} className="text-blue-600" />
              Taxpayer Functional Characterization
            </h5>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">ISIC / NACE Industry Activity Code</label>
              <Input value={isicCode} onChange={(e) => setIsicCode(e.target.value)} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Functional Characterization Model</label>
              <Select
                value={functionalProfile}
                onChange={(e) => setFunctionalProfile(e.target.value)}
                options={[
                  { value: 'LIMITED_RISK_MANUFACTURER_DISTRIBUTOR', label: 'Limited-Risk Manufacturer & Routine Distributor' },
                  { value: 'CONTRACT_TOLL_MANUFACTURER', label: 'Contract / Toll Manufacturer (Cost-Plus Model)' },
                  { value: 'FULL_FLEDGED_ENTREPRENEUR', label: 'Full-Fledged Entrepreneurial Manufacturer' },
                  { value: 'COMMISSIONAIRE_AGENT', label: 'Marketing Agent / Commissionaire' }
                ]}
              />
            </div>
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300">
              <strong>Statutory Assessment:</strong> Limited risk entities bear routine market and inventory risks, and should earn stable, non-negative operating margins (OM) in line with independent comparables.
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Globe size={15} className="text-indigo-600" />
              Commercial Database & Search Filters
            </h5>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Commercial Comparables Database</label>
              <Select
                value={commercialDb}
                onChange={(e) => setCommercialDb(e.target.value)}
                options={[
                  { value: 'BUREAU_VAN_DIJK_ORBIS', label: 'Bureau van Dijk / Moody\'s Orbis (Primary)' },
                  { value: 'TP_CATALYST', label: 'TP Catalyst (BvD Transfer Pricing Module)' },
                  { value: 'THOMSON_REUTERS_ONESOURCE', label: 'Thomson Reuters ONESOURCE' },
                  { value: 'AMADEUS', label: 'Amadeus European Database' }
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Geographic Region</label>
                <Input value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Independence Indicator</label>
                <Input value={independenceFilter} onChange={(e) => setIndependenceFilter(e.target.value)} />
              </div>
            </div>
            <div className="text-[11px] text-slate-500">
              Filters: Independent companies with B+ rating (no shareholder &gt;25%), active operations, and 5 years continuous financial reporting.
            </div>
          </div>
        </div>

        {/* Preliminary Sector Benchmark Range (IQR) */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart2 size={16} className="text-blue-600" />
              Preliminary Sector Arm's Length Interquartile Range (IQR)
            </h5>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              PLI: Operating Margin (OM = EBIT / Sales)
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Lower Quartile (25th)</span>
              <div className="text-xl font-bold text-slate-700 dark:text-slate-300 mt-1">{prelimIqrLower}%</div>
              <span className="text-[10px] text-slate-400">Minimum Arm's Length Boundary</span>
            </div>

            <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                Sector Median (50th)
              </span>
              <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{prelimIqrMedian}%</div>
              <span className="text-[10px] text-emerald-600 font-semibold">Statutory Target Median</span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Upper Quartile (75th)</span>
              <div className="text-xl font-bold text-slate-700 dark:text-slate-300 mt-1">{prelimIqrUpper}%</div>
              <span className="text-[10px] text-slate-400">High Range Performer</span>
            </div>

            <div className="p-4 bg-rose-50/60 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                Taxpayer 5-Yr Weighted
              </span>
              <div className="text-xl font-bold text-rose-700 dark:text-rose-300 mt-1">1.34%</div>
              <span className="text-[10px] text-rose-600 font-bold">Deficit: -5.46% vs Median</span>
            </div>
          </div>
        </div>

        {/* Macroeconomic & Sector Research Synthesis */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Industry Dynamics, Value Chain Analysis & Macroeconomic Research Notes
          </label>
          <Textarea
            value={macroEconomicNotes}
            onChange={(e) => {
              setMacroEconomicNotes(e.target.value);
              setIndustryResearch(e.target.value);
            }}
            rows={4}
            placeholder="Document sector regulatory markups, NBE foreign service approval limits, customs tariff structures, and FX liquidity impacts..."
          />
        </div>

        {/* Sub-step Completion Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">
            Sector: ISIC 2100 • Database: {commercialDb} • Median OM: {prelimIqrMedian}%
          </div>
          <div className="flex items-center gap-2">
            {isReadOnly ? (
              <div className="flex items-center gap-2">
                <Badge color="slate" className="py-1 px-3 text-xs flex items-center gap-1 font-medium">
                  <Lock size={12} /> Working Paper Locked (Statutory Record)
                </Badge>
                {onSelectSubStep && (
                  <Button
                    size="sm"
                    onClick={() => onSelectSubStep('2.4')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    Proceed to Sub-Step 2.4
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                )}
              </div>
            ) : isDone ? (
              <>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Sub-Step 2.3 Completed & Saved ✓</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await executeApiAction('/audit-plan', {
                      objective: planObj,
                      scope: planScope,
                      industryResearch: {
                        isicCode,
                        functionalProfile,
                        commercialDb,
                        regionFilter,
                        macroEconomicNotes,
                        preliminaryIqr: { lower: prelimIqrLower, median: prelimIqrMedian, upper: prelimIqrUpper }
                      }
                    }, 'Industry research parameters updated.');
                    onToggleComplete('2.3', true, { isicCode, functionalProfile, commercialDb, macroEconomicNotes });
                  }}
                  disabled={saving}
                  className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
                >
                  <Save size={13} className="mr-1.5" />
                  Update & Re-Save
                </Button>
                {onSelectSubStep && (
                  <Button
                    size="sm"
                    onClick={() => onSelectSubStep('2.4')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    Proceed to Sub-Step 2.4
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                )}
              </>
            ) : (
              <Button
                size="sm"
                onClick={async () => {
                  await executeApiAction('/audit-plan', {
                    objective: planObj,
                    scope: planScope,
                    industryResearch: {
                      isicCode,
                      functionalProfile,
                      commercialDb,
                      regionFilter,
                      macroEconomicNotes,
                      preliminaryIqr: { lower: prelimIqrLower, median: prelimIqrMedian, upper: prelimIqrUpper }
                    }
                  }, 'Industry research record saved.');
                  onToggleComplete('2.3', true, { isicCode, functionalProfile, commercialDb, macroEconomicNotes });
                }}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                <Check size={14} className="mr-1.5" />
                Save Industry Study & Mark Sub-Step 2.3 Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // SUB-STEP 2.4: Audit Sampling & Transaction Stratification
  // ═════════════════════════════════════════════════════════════════════════════
  if (subStepId === '2.4') {
    const totalSampleValue = sampleItems.reduce((sum, item) => sum + item.amount, 0);
    const sampleCoveragePct = totalTxValue > 0 ? ((totalSampleValue / totalTxValue) * 100).toFixed(1) : '0';

    return (
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/20 border border-purple-200 dark:border-purple-800 rounded-2xl">
          <div className="flex items-start gap-3">
            <Sliders className="text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h4 className="text-sm font-bold text-purple-900 dark:text-purple-200 uppercase tracking-wider">
                Sub-Step 2.4: Audit Sampling & Transaction Stratification
              </h4>
              <p className="text-xs text-purple-800 dark:text-purple-300 mt-1 leading-relaxed">
                Design the statistical and judgmental sampling program under <strong>INTOSAI Financial Audit Guidelines</strong>. Stratify transactions into 100% key-item examination (Tier 1), representative sampling via Monetary Unit Sampling (Tier 2), and analytical review (Tier 3).
              </p>
            </div>
          </div>
        </div>

        {/* Sampling Parameters Workbench */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Calculator size={16} className="text-purple-600" />
            Statistical Sampling Engine & Stratification Parameters
          </h5>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Sampling Methodology</label>
              <Select
                value={sampleMethodology}
                onChange={(e) => {
                  setSampleMethodology(e.target.value);
                  setSamplingMethod(e.target.value);
                }}
                options={[
                  { value: 'STRATIFIED_KEY_ITEM_AND_MUS', label: '100% Key-Item + Monetary Unit Sampling (MUS)' },
                  { value: 'SYSTEMATIC_RANDOM_INTERVAL', label: 'Systematic Random Sampling (Equal Interval)' },
                  { value: 'TARGETED_HIGH_RISK_CENSUS', label: '100% Census (All Controlled Transactions)' }
                ]}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Statistical Confidence Level</label>
              <Select
                value={confidenceLevel}
                onChange={(e) => setConfidenceLevel(e.target.value)}
                options={[
                  { value: '95%', label: '95% Confidence (High Audit Risk)' },
                  { value: '90%', label: '90% Confidence (Standard)' },
                  { value: '80%', label: '80% Confidence (Low Risk)' }
                ]}
              />
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Population Flow</span>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                ETB {totalTxValue.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500">{transactions.length} Scoped Streams</span>
            </div>

            <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800">
              <span className="text-[10px] font-bold uppercase text-purple-700 dark:text-purple-300">Selected Audit Sample</span>
              <div className="text-base font-bold text-purple-900 dark:text-purple-200 mt-0.5">
                ETB {totalSampleValue.toLocaleString()}
              </div>
              <span className="text-[10px] text-purple-700 font-bold">{sampleCoveragePct}% Population Coverage</span>
            </div>
          </div>
        </div>

        {/* Stratified Sample Audit Schedule */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <FileCheck size={16} className="text-purple-600" />
                Stratified Sample Items Audit Schedule
              </h5>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Individual contract and invoice vouchers selected for on-site substantiation and price benchmarking.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setShowAddSampleModal(true)}
              className="text-xs bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5"
            >
              <Plus size={14} />
              Add Sample Item
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Sample ID</th>
                  <th className="p-3">Transaction Stream</th>
                  <th className="p-3">Counterparty & Doc Ref</th>
                  <th className="p-3 text-right">Amount (ETB)</th>
                  <th className="p-3">Sampling Stratum</th>
                  <th className="p-3">Assigned Audit Test</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {sampleItems.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-purple-600">{s.id}</td>
                    <td className="p-3 font-medium text-slate-900 dark:text-white">{s.stream}</td>
                    <td className="p-3">
                      <div>{s.counterparty}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{s.ref} • {s.date}</div>
                    </td>
                    <td className="p-3 text-right font-mono font-bold">ETB {s.amount.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.stratum.includes('Tier 1')
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                          : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                      }`}>
                        {s.stratum}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{s.procedure}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSampleItems(sampleItems.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sub-step Completion Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">
            {sampleItems.length} vouchers selected • Total Sample: ETB {totalSampleValue.toLocaleString()} ({sampleCoveragePct}%)
          </div>
          <div className="flex items-center gap-2">
            {isReadOnly ? (
              <div className="flex items-center gap-2">
                <Badge color="slate" className="py-1 px-3 text-xs flex items-center gap-1 font-medium">
                  <Lock size={12} /> Working Paper Locked (Statutory Record)
                </Badge>
                {onSelectSubStep && (
                  <Button
                    size="sm"
                    onClick={() => onSelectSubStep('2.5')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    Proceed to Sub-Step 2.5
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                )}
              </div>
            ) : isDone ? (
              <>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Sub-Step 2.4 Completed & Saved ✓</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await executeApiAction('/audit-plan', {
                      objective: planObj,
                      scope: planScope,
                      samplingMethod: {
                        methodology: sampleMethodology,
                        confidenceLevel,
                        expectedMisstatementRate,
                        sampleCount: sampleItems.length,
                        sampleTotalValue: totalSampleValue,
                        coveragePercentage: sampleCoveragePct,
                        sampleItems
                      }
                    }, 'Sampling program updated.');
                    onToggleComplete('2.4', true, { sampleMethodology, confidenceLevel, sampleItems });
                  }}
                  disabled={saving}
                  className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
                >
                  <Save size={13} className="mr-1.5" />
                  Update & Re-Save
                </Button>
                {onSelectSubStep && (
                  <Button
                    size="sm"
                    onClick={() => onSelectSubStep('2.5')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    Proceed to Sub-Step 2.5
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                )}
              </>
            ) : (
              <Button
                size="sm"
                onClick={async () => {
                  await executeApiAction('/audit-plan', {
                    objective: planObj,
                    scope: planScope,
                    samplingMethod: {
                      methodology: sampleMethodology,
                      confidenceLevel,
                      expectedMisstatementRate,
                      sampleCount: sampleItems.length,
                      sampleTotalValue: totalSampleValue,
                      coveragePercentage: sampleCoveragePct,
                      sampleItems
                    }
                  }, 'Sampling design and sample schedule saved.');
                  onToggleComplete('2.4', true, { sampleMethodology, confidenceLevel, sampleItems });
                }}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                <Check size={14} className="mr-1.5" />
                Save Sampling & Mark Sub-Step 2.4 Complete
              </Button>
            )}
          </div>
        </div>

        {/* Add Sample Item Modal */}
        {showAddSampleModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Sample Voucher Item</h3>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Transaction Stream</label>
                <Input value={newSample.stream} onChange={(e) => setNewSample({ ...newSample, stream: e.target.value })} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Counterparty Entity</label>
                <Input value={newSample.counterparty} onChange={(e) => setNewSample({ ...newSample, counterparty: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Invoice / Customs Ref</label>
                  <Input value={newSample.ref} onChange={(e) => setNewSample({ ...newSample, ref: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Amount (ETB)</label>
                  <Input type="number" value={newSample.amount} onChange={(e) => setNewSample({ ...newSample, amount: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Stratum</label>
                <Select
                  value={newSample.stratum}
                  onChange={(e) => setNewSample({ ...newSample, stratum: e.target.value })}
                  options={[
                    { value: 'Tier 1 (100% Substantive)', label: 'Tier 1 (100% Key-Item Examination)' },
                    { value: 'Tier 2 (Targeted Representative)', label: 'Tier 2 (Targeted Representative Sample)' },
                    { value: 'Tier 3 (Analytical Review)', label: 'Tier 3 (Analytical De Minimis)' }
                  ]}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Assigned Audit Test Procedure</label>
                <Input value={newSample.procedure} onChange={(e) => setNewSample({ ...newSample, procedure: e.target.value })} />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowAddSampleModal(false)}>Cancel</Button>
                <Button
                  size="sm"
                  onClick={() => {
                    if (!newSample.ref) return;
                    const nextId = `SMP-0${sampleItems.length + 1}`;
                    setSampleItems([...sampleItems, { ...newSample, id: nextId }]);
                    setShowAddSampleModal(false);
                    setNewSample({
                      stream: 'Management & IT Services',
                      counterparty: 'Crest Global Services Ltd',
                      ref: '',
                      date: '2024-01-15',
                      amount: 5000000,
                      stratum: 'Tier 1 (100% Substantive)',
                      procedure: 'Benefit Test & Cost Base Substantiation'
                    });
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Add to Sample Schedule
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // SUB-STEP 2.5: Audit Resource Allocation, Team Formation & Timeline
  // ═════════════════════════════════════════════════════════════════════════════
  if (subStepId === '2.5') {
    return (
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-4 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950/30 dark:to-blue-950/20 border border-teal-200 dark:border-teal-800 rounded-2xl">
          <div className="flex items-start gap-3">
            <Users className="text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h4 className="text-sm font-bold text-teal-900 dark:text-teal-200 uppercase tracking-wider">
                Sub-Step 2.5: Audit Resource Allocation, Team Formation & Timeline
              </h4>
              <p className="text-xs text-teal-800 dark:text-teal-300 mt-1 leading-relaxed">
                Appoint the multi-disciplinary transfer pricing audit engagement team, budget auditor man-hours across all statutory phases, and configure the 90-day operational milestone timeline pursuant to Ministry of Revenues Audit Directives.
              </p>
            </div>
          </div>
        </div>

        {/* Audit Team Roster Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <UserCheck size={16} className="text-teal-600" />
                Designated Multi-Disciplinary TP Audit Engagement Team
              </h5>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Statutorily authorized auditors, econometricians, and IT specialists formally assigned to this case.
              </p>
            </div>
            <Badge variant="outline" className="text-teal-600 border-teal-200">
              Total Budgeted: {totalAllocatedHours} Man-Hours
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Team Role</th>
                  <th className="p-3">Assigned Officer Name</th>
                  <th className="p-3">Employee ID</th>
                  <th className="p-3">Primary Technical Responsibilities</th>
                  <th className="p-3 text-right">Budgeted Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {auditTeam.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                        {m.role}
                      </div>
                    </td>
                    <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{m.name}</td>
                    <td className="p-3 font-mono text-[11px] text-slate-400">{m.id}</td>
                    <td className="p-3 text-slate-500">{m.focus}</td>
                    <td className="p-3 text-right font-mono font-bold text-teal-700 dark:text-teal-300">
                      {m.hours} hrs
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 90-Day Milestone Execution Schedule */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar size={16} className="text-indigo-600" />
              90-Day Statutory Audit Execution Milestone Schedule
            </h5>
            <div className="text-xs text-slate-500">
              Statutory Completion Target: <strong>{targetTimelineDays} Days</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {auditPhasesSchedule.map((ph, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-indigo-600 font-bold">{ph.dates}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ph.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-700'
                      : ph.status === 'IN_PROGRESS'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {ph.status}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">{ph.phase}</div>
                <div className="text-[11px] text-slate-400">Duration: {ph.days} Statutory Working Days</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-step Completion Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">
            {auditTeam.length} specialists appointed • {totalAllocatedHours} budgeted audit hours • {targetTimelineDays} days
          </div>
          <div className="flex items-center gap-2">
            {isReadOnly ? (
              <div className="flex items-center gap-2">
                <Badge color="slate" className="py-1 px-3 text-xs flex items-center gap-1 font-medium">
                  <Lock size={12} /> Working Paper Locked (Statutory Record)
                </Badge>
                {onSelectSubStep && (
                  <Button
                    size="sm"
                    onClick={() => onSelectSubStep('2.6')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    Proceed to Sub-Step 2.6
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                )}
              </div>
            ) : isDone ? (
              <>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Sub-Step 2.5 Completed & Saved ✓</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await executeApiAction('/audit-plan', {
                      objective: planObj,
                      scope: planScope,
                      plannedProcedures: {
                        allocatedHours: totalAllocatedHours,
                        timelineDays: targetTimelineDays,
                        auditTeam,
                        auditPhasesSchedule
                      }
                    }, 'Resource and team configuration updated.');
                    onToggleComplete('2.5', true, { auditTeam, totalAllocatedHours, targetTimelineDays });
                  }}
                  disabled={saving}
                  className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
                >
                  <Save size={13} className="mr-1.5" />
                  Update & Re-Save
                </Button>
                {onSelectSubStep && (
                  <Button
                    size="sm"
                    onClick={() => onSelectSubStep('2.6')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    Proceed to Sub-Step 2.6
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                )}
              </>
            ) : (
              <Button
                size="sm"
                onClick={async () => {
                  await executeApiAction('/audit-plan', {
                    objective: planObj,
                    scope: planScope,
                    plannedProcedures: {
                      allocatedHours: totalAllocatedHours,
                      timelineDays: targetTimelineDays,
                      auditTeam,
                      auditPhasesSchedule
                    }
                  }, 'Team allocation and 90-day timeline saved.');
                  onToggleComplete('2.5', true, { auditTeam, totalAllocatedHours, targetTimelineDays });
                }}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                <Check size={14} className="mr-1.5" />
                Save Team & Mark Sub-Step 2.5 Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // SUB-STEP 2.6: Formal Entry Conference Minutes & Protocol
  // ═════════════════════════════════════════════════════════════════════════════
  if (subStepId === '2.6') {
    return (
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/30 dark:to-blue-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
          <div className="flex items-start gap-3">
            <Users className="text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
                Sub-Step 2.6: Formal Entry Conference Minutes & Protocol
              </h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
                Convene and record the formal <strong>Entry Conference</strong> under <strong>Article 40 of Tax Administration Proclamation No. 983/2016 (Taxpayer Bill of Rights)</strong>. Formalize the Information Document Request (IDR) protocol, record representation credentials, and capture signed conference minutes to complete Phase 2.
              </p>
            </div>
          </div>
        </div>

        {/* Conference Logistics & Venue */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
          <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Calendar size={15} className="text-emerald-600" />
            Conference Logistics & Official Leadership
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Conference Date</label>
              <Input type="date" value={entryConfDate} onChange={(e) => setEntryConfDate(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Conference Venue</label>
              <Input value={entryConfVenue} onChange={(e) => setEntryConfVenue(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Conference Chairperson</label>
              <Input value={entryConfChair} onChange={(e) => setEntryConfChair(e.target.value)} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Official Minutes Record Keeper</label>
              <Input value={entryConfSecretary} onChange={(e) => setEntryConfSecretary(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Attendee Representation Registry */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Users size={16} className="text-emerald-600" />
                Entry Conference Attendance & Power of Attorney Registry
              </h5>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Official representation registry for Ministry of Revenues and Taxpayer delegations.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setShowAddAttendeeModal(true)}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
            >
              <Plus size={14} />
              Add Attendee
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Attendee Name</th>
                  <th className="p-3">Official Title</th>
                  <th className="p-3">Organization</th>
                  <th className="p-3">Delegation</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {attendees.map((a, idx) => (
                  <tr key={a.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{a.name}</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">{a.title}</td>
                    <td className="p-3 text-slate-500">{a.organization}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        a.side === 'AUTHORITY'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      }`}>
                        {a.side === 'AUTHORITY' ? 'TAX AUTHORITY' : 'TAXPAYER DELEGATION'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setAttendees(attendees.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Agreed Statutory Ground Rules & IDR Protocol */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
          <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <CheckSquare size={15} className="text-emerald-600" />
            Statutory Protocol & Ground Rules Formally Agreed
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <label className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={protocolAgreed.rightsExplained}
                onChange={(e) => setProtocolAgreed({ ...protocolAgreed, rightsExplained: e.target.checked })}
                className="mt-0.5 rounded text-emerald-600"
              />
              <span>Taxpayer Bill of Rights under Article 40 of Procl. 983/2016 explained and acknowledged</span>
            </label>
            <label className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={protocolAgreed.fifteenDayIdrDeadline}
                onChange={(e) => setProtocolAgreed({ ...protocolAgreed, fifteenDayIdrDeadline: e.target.checked })}
                className="mt-0.5 rounded text-emerald-600"
              />
              <span>Standard 15 working days turnaround for Information Document Requests (IDRs) confirmed</span>
            </label>
            <label className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={protocolAgreed.spocAppointed}
                onChange={(e) => setProtocolAgreed({ ...protocolAgreed, spocAppointed: e.target.checked })}
                className="mt-0.5 rounded text-emerald-600"
              />
              <span>Single Point of Contact (SPOC) established for document transmission (CFO Ato Tewodros)</span>
            </label>
            <label className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={protocolAgreed.confidentialityUnderArt10}
                onChange={(e) => setProtocolAgreed({ ...protocolAgreed, confidentialityUnderArt10: e.target.checked })}
                className="mt-0.5 rounded text-emerald-600"
              />
              <span>Confidentiality of taxpayer proprietary commercial data under Article 10 reaffirmed</span>
            </label>
          </div>
        </div>

        {/* Formal Entry Conference Minutes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Formal Entry Conference Minutes & Sign-off Synthesis
          </label>
          <Textarea
            value={entryConfMinutes}
            onChange={(e) => setEntryConfMinutes(e.target.value)}
            rows={5}
          />
        </div>

        {/* Sub-step Completion Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">
            Entry Conference convened • {attendees.length} attendees recorded • Ground rules signed
          </div>
          <div className="flex items-center gap-2">
            {isReadOnly ? (
              <div className="flex items-center gap-2">
                <Badge color="slate" className="py-1 px-3 text-xs flex items-center gap-1 font-medium">
                  <Lock size={12} /> Phase 2 Working Papers Formally Locked
                </Badge>
                {onProceedToPhase && (
                  <Button
                    size="sm"
                    onClick={() => {
                      onProceedToPhase('FIELD_WORK');
                      if (onSelectSubStep) onSelectSubStep('3.1');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                  >
                    Proceed to Phase 3: Field Work
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                )}
              </div>
            ) : isDone ? (
              <>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Sub-Step 2.6 Completed & Saved ✓</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await executeApiAction('/audit-plan', {
                      objective: planObj,
                      scope: planScope,
                      materialityDetails: {
                        planningMateriality: effectivePlanningMateriality,
                        tolerableMisstatement: effectiveTolerableMisstatement,
                        benchmarkRate: currentMaterialityPct
                      },
                      industryResearch: {
                        isicCode,
                        functionalProfile,
                        macroEconomicNotes
                      },
                      samplingMethod: {
                        methodology: sampleMethodology,
                        sampleCount: sampleItems.length
                      },
                      plannedProcedures: {
                        allocatedHours: totalAllocatedHours,
                        timelineDays: targetTimelineDays,
                        entryConfVenue,
                        entryConfDate,
                        attendees,
                        protocolAgreed
                      }
                    }, 'Comprehensive TP Audit Plan re-saved to database.');
                    onToggleComplete('2.6', true, { entryConfVenue, entryConfDate, entryConfMinutes, attendees });
                  }}
                  disabled={saving}
                  className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
                >
                  <Save size={13} className="mr-1.5" />
                  Update & Re-Save
                </Button>
                {onProceedToPhase && (
                  <Button
                    size="sm"
                    onClick={() => {
                      onProceedToPhase('FIELD_WORK');
                      if (onSelectSubStep) onSelectSubStep('3.1');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                  >
                    Proceed to Phase 3: Field Work
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                )}
              </>
            ) : (
              <Button
                size="sm"
                onClick={async () => {
                  await executeApiAction('/audit-plan', {
                    objective: planObj,
                    scope: planScope,
                    materialityDetails: {
                      planningMateriality: effectivePlanningMateriality,
                      tolerableMisstatement: effectiveTolerableMisstatement,
                      benchmarkRate: currentMaterialityPct
                    },
                    industryResearch: {
                      isicCode,
                      functionalProfile,
                      macroEconomicNotes
                    },
                    samplingMethod: {
                      methodology: sampleMethodology,
                      sampleCount: sampleItems.length
                    },
                    plannedProcedures: {
                      allocatedHours: totalAllocatedHours,
                      timelineDays: targetTimelineDays,
                      entryConfVenue,
                      entryConfDate,
                      attendees,
                      protocolAgreed
                    }
                  }, 'Comprehensive TP Audit Plan and Entry Conference Minutes saved to database.');
                  onToggleComplete('2.6', true, { entryConfVenue, entryConfDate, entryConfMinutes, attendees });
                }}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                <Check size={14} className="mr-1.5" />
                Finalize Audit Plan & Mark Sub-Step 2.6 Complete
              </Button>
            )}
          </div>
        </div>

        {/* Add Attendee Modal */}
        {showAddAttendeeModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Entry Conference Attendee</h3>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Full Name</label>
                <Input value={newAttendee.name} onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Official Job Title</label>
                <Input value={newAttendee.title} onChange={(e) => setNewAttendee({ ...newAttendee, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Organization / Representation</label>
                <Input value={newAttendee.organization} onChange={(e) => setNewAttendee({ ...newAttendee, organization: e.target.value })} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Delegation Side</label>
                <Select
                  value={newAttendee.side}
                  onChange={(e) => setNewAttendee({ ...newAttendee, side: e.target.value })}
                  options={[
                    { value: 'TAXPAYER', label: 'Taxpayer Delegation' },
                    { value: 'AUTHORITY', label: 'Ministry of Revenues Audit Team' }
                  ]}
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowAddAttendeeModal(false)}>Cancel</Button>
                <Button
                  size="sm"
                  onClick={() => {
                    if (!newAttendee.name) return;
                    setAttendees([...attendees, { ...newAttendee, id: `att-${attendees.length + 1}` }]);
                    setShowAddAttendeeModal(false);
                    setNewAttendee({ name: '', title: '', organization: '', side: 'TAXPAYER' });
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Save Attendee
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
