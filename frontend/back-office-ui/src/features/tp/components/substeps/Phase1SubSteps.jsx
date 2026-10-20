import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, FileText, CheckCircle2, AlertTriangle, 
  Layers, BarChart2, DollarSign, Building2, Check, ArrowRight,
  TrendingDown, Globe, Database, Scale, Clock, Info, Plus,
  Trash2, Edit3, Save, AlertOctagon, HelpCircle, ExternalLink,
  ChevronDown, ChevronUp, FileSpreadsheet, Eye, FileCheck, Lock
} from 'lucide-react';
import { Card, Button, Badge, Input, Textarea, Select } from '../../../../components/ui/index.jsx';

// Default controlled transactions for demonstration / fallback
const DEFAULT_TRANSACTIONS = [
  {
    id: 'tx-1',
    type: 'MANAGEMENT_FEES',
    stream: 'Headquarter Central Management & IT Services',
    foreignEntity: 'Crest Global Services Ltd',
    jurisdiction: 'Mauritius (Low Tax Hub)',
    isHaven: true,
    contractRef: 'CGS-MGMT-2021-04',
    contractDate: '2021-01-15',
    totalValue: 38500000,
    currency: 'USD (Converted)',
    method: 'TNMM',
    withholdingStatus: 'WHT Exempt Claimed',
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
    contractRef: 'PTI-SUPPLY-2020-11',
    contractDate: '2020-06-01',
    totalValue: 62400000,
    currency: 'EUR (Converted)',
    method: 'CUP / Resale Price',
    withholdingStatus: 'Customs Duties Paid',
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
    contractRef: 'AIP-LIC-2019-02',
    contractDate: '2019-03-10',
    totalValue: 14800000,
    currency: 'CHF (Converted)',
    method: 'TNMM',
    withholdingStatus: '10% WHT Remitted',
    riskFlag: 'HIGH',
    statutoryBasis: 'Directive No. 43/2015 Art. 12'
  },
  {
    id: 'tx-4',
    type: 'FINANCING',
    stream: 'Shareholder Working Capital Facility (EUR 3.5M)',
    foreignEntity: 'Apex Global Finance DAC',
    jurisdiction: 'Ireland',
    isHaven: false,
    contractRef: 'AGF-LOAN-2022-01',
    contractDate: '2022-02-01',
    totalValue: 24500000,
    currency: 'EUR (Converted)',
    method: 'CUP (Benchmark SOFR+Spread)',
    withholdingStatus: 'Interest WHT Remitted',
    riskFlag: 'HIGH',
    statutoryBasis: 'Art. 79 Procl. 979/2016 Thin Cap Rules'
  }
];

// Default 5-year financials (FY 2020 - FY 2024)
const DEFAULT_FINANCIALS = [
  { year: '2020', turnover: 260000000, cogs: 182000000, sga: 69000000, ebit: 9000000, netProfit: 6300000, taxPaid: 1890000 },
  { year: '2021', turnover: 310000000, cogs: 223000000, sga: 81000000, ebit: 6000000, netProfit: 4200000, taxPaid: 1260000 },
  { year: '2022', turnover: 375000000, cogs: 277500000, sga: 94500000, ebit: 3000000, netProfit: 2100000, taxPaid: 630000 },
  { year: '2023', turnover: 415000000, cogs: 315400000, sga: 101000000, ebit: -1400000, netProfit: -1400000, taxPaid: 0 },
  { year: '2024', turnover: 450000000, cogs: 346500000, sga: 107000000, ebit: -3500000, netProfit: -3500000, taxPaid: 0 }
];

// Default BEPS Risk Pillars
const DEFAULT_PILLARS = [
  {
    id: 'losses',
    title: 'Consecutive Operational Losses in Profitable Global Group',
    weight: 20,
    score: 20,
    max: 20,
    description: 'Taxpayer reported losses in FY 2023 and FY 2024 despite 73% revenue expansion since 2020, while the parent multinational reported record worldwide EBIT.',
    status: 'CRITICAL'
  },
  {
    id: 'management_fees',
    title: 'High Management Fees to Low-Tax Jurisdiction (Mauritius)',
    weight: 20,
    score: 20,
    max: 20,
    description: 'Management fees of ETB 38.5M paid to Mauritius affiliate represent 8.5% of turnover with no documented benefit test or allocation keys.',
    status: 'CRITICAL'
  },
  {
    id: 'royalties_ip',
    title: 'Brand Royalty Payments without Local DEMPE Involvement',
    weight: 20,
    score: 16,
    max: 20,
    description: 'ETB 14.8M trademark fees remitted to Swiss entity. Local entity conducts all local marketing and customer support without cost-sharing adjustment.',
    status: 'HIGH'
  },
  {
    id: 'thin_cap',
    title: 'Thin Capitalization & High Debt-to-Equity Ratio',
    weight: 15,
    score: 11,
    max: 15,
    description: 'Debt-to-equity ratio reached 2.8:1, exceeding conservative safe harbors. Loan interest rates priced at 450 bps above benchmark SOFR.',
    status: 'HIGH'
  },
  {
    id: 'haven_volume',
    title: 'Significant Procurement / Outflows to Low-Tax Hubs',
    weight: 15,
    score: 12,
    max: 15,
    description: '42.3% of total controlled transaction outflows are directed to entities in jurisdictions with effective corporate tax rates below 10%.',
    status: 'HIGH'
  },
  {
    id: 'margin_variance',
    title: 'Operating Margin Deviation from Independent Sector Peers',
    weight: 10,
    score: 8,
    max: 10,
    description: 'Tested taxpayer 5-year average Operating Margin is 0.71%, compared to local independent sector peer interquartile median of 5.85%.',
    status: 'HIGH'
  }
];

// Default Evidentiary Documents
const DEFAULT_DOCUMENTS = [
  { id: 'doc-1', title: 'Schedule 5 Related Party Disclosure Schedule (2024)', category: 'Tax Return Schedule', status: 'VERIFIED', date: '2025-04-28', notes: 'Discloses 4 foreign related parties and aggregate transaction values.' },
  { id: 'doc-2', title: 'Crest Global Services Master File (FY 2024)', category: 'Master File', status: 'RECEIVED', date: '2025-05-15', notes: 'Global structure received; missing detailed intangibles ownership section.' },
  { id: 'doc-3', title: 'Ethiopian Local File Transfer Pricing Study', category: 'Local File', status: 'INCOMPLETE', date: '2025-06-02', notes: 'TNMM benchmark study provided; rejected local comparables without justification.' },
  { id: 'doc-4', title: 'Intercompany Management Agreement (2021)', category: 'Contract', status: 'VERIFIED', date: '2025-06-10', notes: 'Drafted under English law. Lacks itemized service catalogue or timecards.' },
  { id: 'doc-5', title: 'ASYCUDA Customs Import Declarations (2020-2024)', category: 'Customs Record', status: 'RECONCILED', date: '2025-07-04', notes: 'Over-invoicing of imported API materials identified compared to parallel importers.' },
  { id: 'doc-6', title: 'Proof of Benefit Test Documentation (Management Fees)', category: 'Benefit Test', status: 'MISSING', date: '—', notes: 'Auditor requested proof of specific services rendered; taxpayer has not provided.' }
];

export default function Phase1SubSteps({
  subStepId,
  onSelectSubStep,
  onProceedToPhase,
  fullState,
  riskLevel,
  setRiskLevel,
  riskComments,
  setRiskComments,
  taxpayerEvidenceNotes,
  setTaxpayerEvidenceNotes,
  completedSubSteps,
  onToggleComplete,
  saving,
  executeApiAction,
  isReadOnly = false
}) {
  const isDone = completedSubSteps.includes(subStepId);

  // ── Sub-Step 1.1 State: Controlled Transactions ────────────────────────────
  const [transactions, setTransactions] = useState(() => {
    const existing = fullState?.riskAssessment?.riskDetails?.controlledTransactions;
    return existing && existing.length > 0 ? existing : DEFAULT_TRANSACTIONS;
  });
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [newTx, setNewTx] = useState({
    type: 'MANAGEMENT_FEES',
    stream: '',
    foreignEntity: '',
    jurisdiction: '',
    isHaven: false,
    contractRef: '',
    contractDate: new Date().toISOString().split('T')[0],
    totalValue: 10000000,
    currency: 'USD',
    method: 'TNMM',
    withholdingStatus: 'WHT Due',
    riskFlag: 'HIGH',
    statutoryBasis: 'Article 79 Proclamation 979/2016'
  });
  const [schedule5Checklist, setSchedule5Checklist] = useState({
    filedOnTime: true,
    allPartiesDisclosed: true,
    contractsAttached: false,
    withholdingReconciled: false
  });

  // KPIs for 1.1
  const totalTxValue = useMemo(() => {
    return transactions.reduce((sum, tx) => sum + Number(tx.totalValue || 0), 0);
  }, [transactions]);

  const havenTxValue = useMemo(() => {
    return transactions.filter(t => t.isHaven).reduce((sum, tx) => sum + Number(tx.totalValue || 0), 0);
  }, [transactions]);

  const latestTurnover = Number(fullState?.caseDetails?.estimatedRevenue || 450000000);
  const txToTurnoverPct = ((totalTxValue / (latestTurnover || 1)) * 100).toFixed(1);
  const havenPct = ((havenTxValue / (totalTxValue || 1)) * 100).toFixed(1);

  const handleAddTransaction = () => {
    if (!newTx.stream || !newTx.foreignEntity) return;
    const item = {
      ...newTx,
      id: `tx-${Date.now()}`,
      totalValue: Number(newTx.totalValue || 0)
    };
    setTransactions(prev => [...prev, item]);
    setShowAddTxModal(false);
    setNewTx({
      type: 'MANAGEMENT_FEES',
      stream: '',
      foreignEntity: '',
      jurisdiction: '',
      isHaven: false,
      contractRef: '',
      contractDate: new Date().toISOString().split('T')[0],
      totalValue: 10000000,
      currency: 'USD',
      method: 'TNMM',
      withholdingStatus: 'WHT Due',
      riskFlag: 'HIGH',
      statutoryBasis: 'Article 79 Proclamation 979/2016'
    });
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // ── Sub-Step 1.2 State: 5-Year Financials ──────────────────────────────────
  const [financials, setFinancials] = useState(() => {
    const existing = fullState?.riskAssessment?.riskDetails?.auditedFinancials;
    return existing && existing.length > 0 ? existing : DEFAULT_FINANCIALS;
  });
  const [finNotes, setFinNotes] = useState(
    'Taxpayer revenues expanded by 73.1% between FY 2020 and FY 2024, yet Operating Profit dropped from +ETB 9.0M to -ETB 3.5M. The severe profit suppression correlates directly with a 310% escalation in intercompany service charges.'
  );

  const handleFinChange = (index, field, value) => {
    setFinancials(prev => {
      const updated = [...prev];
      const val = Number(value) || 0;
      updated[index] = { ...updated[index], [field]: val };
      // Recalculate EBIT and Net profit dynamically
      if (field === 'turnover' || field === 'cogs' || field === 'sga') {
        const turn = field === 'turnover' ? val : updated[index].turnover;
        const c = field === 'cogs' ? val : updated[index].cogs;
        const s = field === 'sga' ? val : updated[index].sga;
        updated[index].ebit = turn - c - s;
        updated[index].netProfit = updated[index].ebit; // simplified pre-tax
      }
      return updated;
    });
  };

  // 5-Year Weighted Average Calculations
  const finSummary = useMemo(() => {
    const totalTurnover = financials.reduce((acc, f) => acc + Number(f.turnover), 0);
    const totalEbit = financials.reduce((acc, f) => acc + Number(f.ebit), 0);
    const totalCogs = financials.reduce((acc, f) => acc + Number(f.cogs), 0);
    const totalSga = financials.reduce((acc, f) => acc + Number(f.sga), 0);
    const totalTax = financials.reduce((acc, f) => acc + Number(f.taxPaid), 0);

    const weightedOm = totalTurnover > 0 ? (totalEbit / totalTurnover) * 100 : 0;
    const weightedNcp = (totalCogs + totalSga) > 0 ? (totalEbit / (totalCogs + totalSga)) * 100 : 0;
    const weightedBerry = totalSga > 0 ? ((totalTurnover - totalCogs) / totalSga) : 0;

    return {
      totalTurnover,
      totalEbit,
      totalTax,
      weightedOm: weightedOm.toFixed(2),
      weightedNcp: weightedNcp.toFixed(2),
      weightedBerry: weightedBerry.toFixed(2),
      sectorMedianOm: 5.85,
      omVariance: (weightedOm - 5.85).toFixed(2)
    };
  }, [financials]);

  // ── Sub-Step 1.3 State: BEPS Risk Matrix ──────────────────────────────────
  const [pillars, setPillars] = useState(() => {
    const existing = fullState?.riskAssessment?.riskDetails?.riskIndicators;
    return existing && existing.length > 0 ? existing : DEFAULT_PILLARS;
  });

  const handlePillarScoreChange = (id, newScore) => {
    setPillars(prev => prev.map(p => {
      if (p.id === id) {
        const score = Math.min(Math.max(Number(newScore) || 0, 0), p.max);
        let status = 'LOW';
        if (score >= p.max * 0.8) status = 'CRITICAL';
        else if (score >= p.max * 0.5) status = 'HIGH';
        else if (score >= p.max * 0.25) status = 'MEDIUM';
        return { ...p, score, status };
      }
      return p;
    }));
  };

  const totalBepsScore = useMemo(() => {
    return pillars.reduce((sum, p) => sum + (Number(p.score) || 0), 0);
  }, [pillars]);

  // ── Sub-Step 1.4 State: Materiality Formulation ──────────────────────────
  const [materialityBase, setMaterialityBase] = useState('TURNOVER');
  const [materialityPct, setMaterialityPct] = useState(1.0);
  const [tolerablePct, setTolerablePct] = useState(70);
  const [scopingNotes, setScopingNotes] = useState(
    'Transactions exceeding the Tolerable Misstatement threshold of ETB 3.15M must be subjected to 100% full substantive examination. Management service fees and API raw material imports represent 80.2% of total intercompany volume and constitute the core audit scope.'
  );

  const calculatedBaseAmount = materialityBase === 'TURNOVER' ? latestTurnover : totalTxValue;
  const planningMaterialityETB = Math.round(calculatedBaseAmount * (materialityPct / 100));
  const tolerableMisstatementETB = Math.round(planningMaterialityETB * (tolerablePct / 100));
  const sadThresholdETB = Math.round(planningMaterialityETB * 0.05);

  // ── Sub-Step 1.5 State: Evidence Dossier & Documentation Checklist ───────
  const [documents, setDocuments] = useState(DEFAULT_DOCUMENTS);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCat, setNewDocCat] = useState('Contract');
  const [newDocNotes, setNewDocNotes] = useState('');
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [cooperationRating, setCooperationRating] = useState('DELAYED');

  const handleAddDoc = () => {
    if (!newDocTitle) return;
    const doc = {
      id: `doc-${Date.now()}`,
      title: newDocTitle,
      category: newDocCat,
      status: 'RECEIVED',
      date: new Date().toISOString().split('T')[0],
      notes: newDocNotes || 'Submitted by taxpayer in response to initial notice.'
    };
    setDocuments(prev => [...prev, doc]);
    setNewDocTitle('');
    setNewDocNotes('');
    setShowAddDoc(false);
  };

  const handleDocStatusToggle = (id, newStatus) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };

  // ── Sub-Step 1.6 State: Working Hypothesis & Recommendation ───────────────
  const [suspectedMechanism, setSuspectedMechanism] = useState(
    'Artificial inflation of active pharmaceutical ingredient (API) import prices from Dutch affiliate combined with non-substantive management and brand licensing fees remitted to zero-tax Mauritius and Swiss conduits, eroding Ethiopian tax base by ~ETB 42.5M annually.'
  );
  const [revenueAtRisk, setRevenueAtRisk] = useState(42500000);
  const [targetYears, setTargetYears] = useState(['2021', '2022', '2023', '2024']);
  const [statutoryGrounds, setStatutoryGrounds] = useState(
    'Proclamation No. 979/2016 Article 79 (Transfer Pricing), Article 45 (Related Party Disclosures), and Transfer Pricing Directive No. 43/2015. Transactions not conducted in accordance with the arm’s length principle warrant complete profit reallocation.'
  );

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER SUB-STEPS
  // ──────────────────────────────────────────────────────────────────────────

  // ── 1.1 Related Party Transaction Scoping ──────────────────────────────────
  if (subStepId === '1.1') {
    return (
      <div className="space-y-6">
        {/* Statutory Context Banner */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
          <div className="flex items-start gap-3">
            <Globe className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                Sub-Step 1.1: Related Party Transaction Scoping & Schedule 5 Registry
              </h4>
              <p className="text-xs text-blue-800 dark:text-blue-300 mt-1 leading-relaxed">
                Pursuant to <strong>Articles 45 & 79 of Proclamation 979/2016</strong> and <strong>Directive No. 43/2015</strong>, identify, categorize, and verify all international and domestic controlled transactions. Examine Schedule 5 disclosures and test for low-tax haven routing.
              </p>
            </div>
          </div>
        </div>

        {/* KPI Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Controlled Volume</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              ETB {totalTxValue.toLocaleString()}
            </div>
            <span className="text-[11px] text-blue-600 font-semibold">{txToTurnoverPct}% of Total Turnover</span>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Low-Tax / Haven Outflows</span>
            <div className="text-lg font-bold text-rose-600 mt-1">
              ETB {havenTxValue.toLocaleString()}
            </div>
            <span className="text-[11px] text-rose-500 font-semibold">{havenPct}% of Controlled Total</span>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Controlled Streams Count</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {transactions.length} Active Streams
            </div>
            <span className="text-[11px] text-slate-500">4 Foreign Related Parties</span>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Highest Risk Stream</span>
            <div className="text-lg font-bold text-amber-600 truncate mt-1">
              Management Fees
            </div>
            <span className="text-[11px] text-amber-500 font-semibold">ETB 38.5M to Mauritius</span>
          </div>
        </div>

        {/* Controlled Transactions Registry Table */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Controlled Transactions Registry (Schedule 5 Reconciliation)
              </h3>
              <p className="text-xs text-slate-500">
                Cross-border payments, intercompany agreements, and transfer pricing methods applied.
              </p>
            </div>
            <Button size="sm" onClick={() => setShowAddTxModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus size={14} className="mr-1.5" />
              Add Controlled Transaction
            </Button>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Stream & Contract</th>
                  <th className="p-3">Related Party & Tax Jurisdiction</th>
                  <th className="p-3 text-right">Value (ETB)</th>
                  <th className="p-3">TP Method</th>
                  <th className="p-3">Withholding Tax Status</th>
                  <th className="p-3">Risk Flag</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{tx.stream}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Ref: {tx.contractRef} • Inception: {tx.contractDate}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{tx.foreignEntity}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] text-slate-500">{tx.jurisdiction}</span>
                        {tx.isHaven && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold">
                            Haven Flag
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      ETB {Number(tx.totalValue).toLocaleString()}
                      <div className="text-[10px] text-slate-400 font-normal">{tx.currency}</div>
                    </td>
                    <td className="p-3 font-semibold text-blue-600 dark:text-blue-400">{tx.method}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {tx.withholdingStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.riskFlag === 'CRITICAL' 
                          ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300' 
                          : tx.riskFlag === 'HIGH'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                      }`}>
                        {tx.riskFlag}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button 
                        onClick={() => handleDeleteTransaction(tx.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Delete record"
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

        {/* Schedule 5 Verification Checklist */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 size={16} className="text-blue-600" />
            Statutory Schedule 5 Verification Checklist
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <label className="flex items-center gap-2.5 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={schedule5Checklist.filedOnTime}
                onChange={(e) => setSchedule5Checklist({ ...schedule5Checklist, filedOnTime: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Schedule 5 submitted within statutory deadline (Art. 45 compliance)</span>
            </label>

            <label className="flex items-center gap-2.5 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={schedule5Checklist.allPartiesDisclosed}
                onChange={(e) => setSchedule5Checklist({ ...schedule5Checklist, allPartiesDisclosed: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>All direct and indirect corporate relationships disclosed</span>
            </label>

            <label className="flex items-center gap-2.5 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={schedule5Checklist.contractsAttached}
                onChange={(e) => setSchedule5Checklist({ ...schedule5Checklist, contractsAttached: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Certified written contracts on file for all intercompany flows</span>
            </label>

            <label className="flex items-center gap-2.5 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={schedule5Checklist.withholdingReconciled}
                onChange={(e) => setSchedule5Checklist({ ...schedule5Checklist, withholdingReconciled: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Withholding taxes on foreign service fees and royalties verified</span>
            </label>
          </div>
        </div>

        {/* Sub-step Completion Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">
            {transactions.length} transactions scoped • Total volume: ETB {totalTxValue.toLocaleString()}
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
                    onClick={() => onSelectSubStep('1.2')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    Proceed to Sub-Step 1.2
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                )}
              </div>
            ) : isDone ? (
              <>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Sub-Step 1.1 Completed & Saved ✓</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await executeApiAction('/risk-assessment', {
                      riskLevel,
                      comments: riskComments,
                      riskDetails: {
                        controlledTransactions: transactions,
                        auditedFinancials: financials,
                        riskIndicators: pillars
                      }
                    }, 'Controlled transactions registry updated.');
                    onToggleComplete('1.1', true, { transactions, schedule5Checklist });
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
                    onClick={() => onSelectSubStep('1.2')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    Proceed to Sub-Step 1.2
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                )}
              </>
            ) : (
              <Button
                size="sm"
                onClick={async () => {
                  await executeApiAction('/risk-assessment', {
                    riskLevel,
                    comments: riskComments,
                    riskDetails: {
                      controlledTransactions: transactions,
                      auditedFinancials: financials,
                      riskIndicators: pillars
                    }
                  }, 'Controlled transactions registry saved.');
                  onToggleComplete('1.1', true, { transactions, schedule5Checklist });
                }}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                <Check size={14} className="mr-1.5" />
                Save Registry & Mark Sub-Step 1.1 Complete
              </Button>
            )}
          </div>
        </div>

        {/* Add Transaction Modal */}
        {showAddTxModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                Add Controlled Transaction Stream
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Transaction Stream Description</label>
                  <Input
                    value={newTx.stream}
                    onChange={(e) => setNewTx({ ...newTx, stream: e.target.value })}
                    placeholder="e.g. Technical Services & Maintenance Support"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Related Entity Name</label>
                    <Input
                      value={newTx.foreignEntity}
                      onChange={(e) => setNewTx({ ...newTx, foreignEntity: e.target.value })}
                      placeholder="e.g. AfriHoldings B.V."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tax Jurisdiction</label>
                    <Input
                      value={newTx.jurisdiction}
                      onChange={(e) => setNewTx({ ...newTx, jurisdiction: e.target.value })}
                      placeholder="e.g. Dubai, UAE"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Annual Value (ETB)</label>
                    <Input
                      type="number"
                      value={newTx.totalValue}
                      onChange={(e) => setNewTx({ ...newTx, totalValue: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Transfer Pricing Method</label>
                    <Select
                      value={newTx.method}
                      onChange={(e) => setNewTx({ ...newTx, method: e.target.value })}
                    >
                      <option value="TNMM">TNMM (Transactional Net Margin)</option>
                      <option value="CUP">CUP (Comparable Uncontrolled Price)</option>
                      <option value="Cost Plus">Cost Plus Method</option>
                      <option value="Resale Price">Resale Price Method</option>
                      <option value="Profit Split">Transactional Profit Split</option>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Risk Flag</label>
                    <Select
                      value={newTx.riskFlag}
                      onChange={(e) => setNewTx({ ...newTx, riskFlag: e.target.value })}
                    >
                      <option value="CRITICAL">CRITICAL</option>
                      <option value="HIGH">HIGH</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="LOW">LOW</option>
                    </Select>
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newTx.isHaven}
                        onChange={(e) => setNewTx({ ...newTx, isHaven: e.target.checked })}
                        className="rounded text-red-600 focus:ring-red-500"
                      />
                      <span>Is Low-Tax / Haven Entity?</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setShowAddTxModal(false)}>Cancel</Button>
                <Button onClick={handleAddTransaction} className="bg-blue-600 text-white font-semibold">
                  Save Transaction
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── 1.2 Multi-Year Financial Ratio Profiling ───────────────────────────────
  if (subStepId === '1.2') {
    return (
      <div className="space-y-6">
        {/* Guidance Header */}
        <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl">
          <div className="flex items-start gap-3">
            <TrendingDown className="text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
                Sub-Step 1.2: Multi-Year Financial Benchmarking & Profit Margin Profiling
              </h4>
              <p className="text-xs text-indigo-800 dark:text-indigo-300 mt-1 leading-relaxed">
                As per <strong>OECD Guidelines Para 3.68</strong> and Ethiopian TP practice, evaluate 5 continuous tax years to establish whether the tested party exhibits chronic profit suppression, volatile margins, or operating losses during periods of revenue expansion.
              </p>
            </div>
          </div>
        </div>

        {/* 5-Year Computed KPI Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">5-Year Weighted Operating Margin</span>
            <div className={`text-xl font-bold mt-1 ${Number(finSummary.weightedOm) < 2.0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {finSummary.weightedOm}%
            </div>
            <span className="text-[11px] text-slate-400">EBIT / Gross Turnover</span>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sector Peer Median Margin</span>
            <div className="text-xl font-bold text-blue-600 mt-1">
              {finSummary.sectorMedianOm}%
            </div>
            <span className="text-[11px] text-slate-400">Independent Sector Standard</span>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Operating Margin Deficit</span>
            <div className="text-xl font-bold text-rose-600 mt-1">
              {finSummary.omVariance}%
            </div>
            <span className="text-[11px] text-rose-500 font-semibold">High Profit Suppression Flag</span>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">5-Year Berry Ratio</span>
            <div className="text-xl font-bold text-amber-600 mt-1">
              {finSummary.weightedBerry}
            </div>
            <span className="text-[11px] text-slate-400">Gross Profit / Operating Expenses</span>
          </div>
        </div>

        {/* 5-Year Financial Data Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Multi-Year Financial Statement Matrix (FY 2020 - FY 2024)
            </h3>
            <span className="text-xs text-slate-500 font-mono">Figures in Ethiopian Birr (ETB)</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Financial Year</th>
                  <th className="p-3 text-right">Turnover (ETB)</th>
                  <th className="p-3 text-right">COGS (ETB)</th>
                  <th className="p-3 text-right">SG&A (ETB)</th>
                  <th className="p-3 text-right">EBIT (ETB)</th>
                  <th className="p-3 text-right">Operating Margin</th>
                  <th className="p-3 text-right">Tax Paid (ETB)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                {financials.map((f, idx) => {
                  const om = f.turnover > 0 ? ((f.ebit / f.turnover) * 100).toFixed(2) : '0.00';
                  const isLoss = f.ebit < 0;

                  return (
                    <tr key={f.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-slate-900 dark:text-white font-sans">{f.year}</td>
                      <td className="p-3 text-right">
                        <input
                          type="number"
                          value={f.turnover}
                          onChange={(e) => handleFinChange(idx, 'turnover', e.target.value)}
                          className="w-28 text-right px-2 py-1 bg-transparent border border-slate-200 dark:border-slate-700 rounded text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3 text-right">
                        <input
                          type="number"
                          value={f.cogs}
                          onChange={(e) => handleFinChange(idx, 'cogs', e.target.value)}
                          className="w-28 text-right px-2 py-1 bg-transparent border border-slate-200 dark:border-slate-700 rounded text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-3 text-right">
                        <input
                          type="number"
                          value={f.sga}
                          onChange={(e) => handleFinChange(idx, 'sga', e.target.value)}
                          className="w-24 text-right px-2 py-1 bg-transparent border border-slate-200 dark:border-slate-700 rounded text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className={`p-3 text-right font-bold ${isLoss ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
                        {f.ebit.toLocaleString()}
                      </td>
                      <td className={`p-3 text-right font-bold ${isLoss ? 'text-rose-600' : 'text-blue-600'}`}>
                        {om}%
                      </td>
                      <td className="p-3 text-right text-slate-500">
                        {f.taxPaid.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Auditor Analytical Commentary */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            Auditor Ratio Analysis & Anomaly Evaluation Notes
          </label>
          <Textarea
            value={finNotes}
            onChange={(e) => setFinNotes(e.target.value)}
            rows={3}
            placeholder="Document key ratio deviations, profit suppression patterns, and anomalies..."
          />
        </div>

        {/* Sub-step Completion Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">
            5 tax years analyzed • Weighted OM: <strong className="text-rose-600">{finSummary.weightedOm}%</strong> (Variance: {finSummary.omVariance}%)
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
                    onClick={() => onSelectSubStep('1.3')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    Proceed to Sub-Step 1.3
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                )}
              </div>
            ) : isDone ? (
              <>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Sub-Step 1.2 Completed & Saved ✓</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await executeApiAction('/risk-assessment', {
                      riskLevel,
                      comments: riskComments,
                      riskDetails: {
                        controlledTransactions: transactions,
                        auditedFinancials: financials,
                        riskIndicators: pillars
                      }
                    }, 'Financial ratios updated.');
                    onToggleComplete('1.2', true, { financials, finSummary, finNotes });
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
                    onClick={() => onSelectSubStep('1.3')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    Proceed to Sub-Step 1.3
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                )}
              </>
            ) : (
              <Button
                size="sm"
                onClick={async () => {
                  await executeApiAction('/risk-assessment', {
                    riskLevel,
                    comments: riskComments,
                    riskDetails: {
                      controlledTransactions: transactions,
                      auditedFinancials: financials,
                      riskIndicators: pillars
                    }
                  }, 'Financial ratios updated.');
                  onToggleComplete('1.2', true, { financials, finSummary, finNotes });
                }}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                <Check size={14} className="mr-1.5" />
                Save Financials & Mark Sub-Step 1.2 Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── 1.3 BEPS Risk Scoring Matrix ──────────────────────────────────────────
  if (subStepId === '1.3') {
    const scoreColor = totalBepsScore >= 85 ? 'text-red-600' : totalBepsScore >= 70 ? 'text-amber-600' : 'text-blue-600';
    const badgeColor = totalBepsScore >= 85 ? 'red' : totalBepsScore >= 70 ? 'amber' : 'blue';

    return (
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                Sub-Step 1.3: BEPS Action 8–10 Risk Scoring Matrix
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                Evaluate statutory transfer pricing risk indicators across 6 primary BEPS pillars under Ethiopian Tax Administration risk guidelines. Adjust pillar weight scores based on factual evidence.
              </p>
            </div>
          </div>
        </div>

        {/* Score Thermometer Header */}
        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Weighted TP Risk Score</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-3xl font-extrabold ${scoreColor}`}>{totalBepsScore}</span>
              <span className="text-slate-400 font-bold">/ 100</span>
              <Badge color={badgeColor} size="md" className="ml-2 font-bold">
                {totalBepsScore >= 85 ? 'CRITICAL RISK' : totalBepsScore >= 70 ? 'HIGH RISK' : 'MEDIUM RISK'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {totalBepsScore >= 80 
                ? 'Score exceeds the 75-point threshold for mandatory full-scope statutory transfer pricing audit.'
                : 'Score indicates moderate risk; requires targeted audit examination.'}
            </p>
          </div>

          <div className="w-full sm:w-64 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-500">Risk Severity Level</span>
              <span className={scoreColor}>{totalBepsScore}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  totalBepsScore >= 85 ? 'bg-red-500' : totalBepsScore >= 70 ? 'bg-amber-500' : 'bg-blue-600'
                }`}
                style={{ width: `${totalBepsScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* 6 Risk Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pillars.map((p) => (
            <div key={p.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {p.title}
                  </h4>
                  <span className="text-[10px] text-slate-400">Max Weight: {p.max} Points</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    p.score >= p.max * 0.8 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {p.score} / {p.max}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {p.description}
              </p>

              <div className="pt-2 flex items-center gap-3">
                <span className="text-[11px] font-semibold text-slate-500">Auditor Score:</span>
                <input
                  type="range"
                  min="0"
                  max={p.max}
                  value={p.score}
                  onChange={(e) => handlePillarScoreChange(p.id, e.target.value)}
                  className="flex-1 accent-blue-600 cursor-pointer"
                />
                <span className="text-xs font-mono font-bold w-6 text-right text-slate-900 dark:text-white">
                  {p.score}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Sub-step Completion Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">
            Composite Score: <strong className={scoreColor}>{totalBepsScore}/100</strong> • Status: {totalBepsScore >= 85 ? 'CRITICAL' : 'HIGH'}
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
                    onClick={() => onSelectSubStep('1.4')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    Proceed to Sub-Step 1.4
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                )}
              </div>
            ) : isDone ? (
              <>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Sub-Step 1.3 Completed & Saved ✓</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await executeApiAction('/risk-assessment', {
                      riskLevel: totalBepsScore >= 85 ? 'CRITICAL' : 'HIGH',
                      comments: riskComments,
                      riskDetails: {
                        controlledTransactions: transactions,
                        auditedFinancials: financials,
                        riskIndicators: pillars
                      }
                    }, 'BEPS risk matrix updated.');
                    onToggleComplete('1.3', true, { pillars, totalBepsScore });
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
                    onClick={() => onSelectSubStep('1.4')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    Proceed to Sub-Step 1.4
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                )}
              </>
            ) : (
              <Button
                size="sm"
                onClick={async () => {
                  await executeApiAction('/risk-assessment', {
                    riskLevel: totalBepsScore >= 85 ? 'CRITICAL' : 'HIGH',
                    comments: riskComments,
                    riskDetails: {
                      controlledTransactions: transactions,
                      auditedFinancials: financials,
                      riskIndicators: pillars
                    }
                  }, 'BEPS risk matrix saved.');
                  onToggleComplete('1.3', true, { pillars, totalBepsScore });
                }}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                <Check size={14} className="mr-1.5" />
                Save BEPS Matrix & Mark Sub-Step 1.3 Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── 1.4 Preliminary Materiality Calculation ───────────────────────────────
  if (subStepId === '1.4') {
    return (
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-4 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl">
          <div className="flex items-start gap-3">
            <Scale className="text-slate-700 dark:text-slate-300 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Sub-Step 1.4: Materiality Threshold Formulation & Audit Scoping
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Determine quantitative materiality benchmarks pursuant to <strong>Article 79 of Proclamation 979/2016</strong> and standard tax audit procedures. Establish planning materiality, tolerable misstatement, and clearly identify transaction streams requiring 100% substantive examination.
              </p>
            </div>
          </div>
        </div>

        {/* Materiality Formulation Controls */}
        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Materiality Formulation Workbench
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Materiality Benchmark Base
              </label>
              <Select
                value={materialityBase}
                onChange={(e) => setMaterialityBase(e.target.value)}
              >
                <option value="TURNOVER">Gross Turnover (ETB {latestTurnover.toLocaleString()})</option>
                <option value="CONTROLLED_VOLUME">Total Related Party Volume (ETB {totalTxValue.toLocaleString()})</option>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Planning Materiality Percentage: {materialityPct}%
              </label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={materialityPct}
                  onChange={(e) => setMaterialityPct(Number(e.target.value))}
                  className="flex-1 accent-blue-600 cursor-pointer"
                />
                <span className="text-xs font-bold font-mono text-blue-600">{materialityPct}%</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Tolerable Misstatement Ratio: {tolerablePct}%
              </label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="range"
                  min="50"
                  max="80"
                  step="5"
                  value={tolerablePct}
                  onChange={(e) => setTolerablePct(Number(e.target.value))}
                  className="flex-1 accent-indigo-600 cursor-pointer"
                />
                <span className="text-xs font-bold font-mono text-indigo-600">{tolerablePct}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Computed Result Threshold Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 text-center border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-900/10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Planning Materiality (PM)</span>
            <div className="text-xl font-extrabold text-blue-700 dark:text-blue-300 mt-1 font-mono">
              ETB {planningMaterialityETB.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400">Baseline for overall case risk</span>
          </Card>

          <Card className="p-4 text-center border-indigo-200 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-900/10">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Tolerable Misstatement (TM)</span>
            <div className="text-xl font-extrabold text-indigo-700 dark:text-indigo-300 mt-1 font-mono">
              ETB {tolerableMisstatementETB.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400">Transactions above this require 100% audit</span>
          </Card>

          <Card className="p-4 text-center border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Summary Audit Differences (SAD)</span>
            <div className="text-xl font-extrabold text-slate-700 dark:text-slate-300 mt-1 font-mono">
              ETB {sadThresholdETB.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400">Trivial difference cut-off (5% PM)</span>
          </Card>
        </div>

        {/* Transaction Scoping Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Automated Audit Scope Evaluation by Transaction Stream
          </h4>
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Transaction Stream</th>
                  <th className="p-3 text-right">Value (ETB)</th>
                  <th className="p-3 text-right">Comparison vs TM</th>
                  <th className="p-3">Statutory Scope Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {transactions.map((tx) => {
                  const exceeds = tx.totalValue > tolerableMisstatementETB;
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-medium text-slate-900 dark:text-white">{tx.stream}</td>
                      <td className="p-3 text-right font-mono font-bold">ETB {Number(tx.totalValue).toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-xs">
                        {exceeds ? (
                          <span className="text-rose-600 font-semibold">Exceeds TM (+{((tx.totalValue / tolerableMisstatementETB) * 100 - 100).toFixed(0)}%)</span>
                        ) : (
                          <span className="text-slate-400">Within TM</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          exceeds 
                            ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {exceeds ? 'Mandatory Substantive 100% Audit' : 'Analytical Review / Sample Testing'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Auditor Scoping Rational */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Auditor Scoping & Materiality Rationale
          </label>
          <Textarea
            value={scopingNotes}
            onChange={(e) => setScopingNotes(e.target.value)}
            rows={3}
          />
        </div>

        {/* Sub-step Completion Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">
            PM: ETB {planningMaterialityETB.toLocaleString()} • Tolerable Misstatement: ETB {tolerableMisstatementETB.toLocaleString()}
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
                    onClick={() => onSelectSubStep('1.5')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    Proceed to Sub-Step 1.5
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                )}
              </div>
            ) : isDone ? (
              <>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Sub-Step 1.4 Completed & Saved ✓</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    onToggleComplete('1.4', true, {
                      planningMaterialityETB,
                      tolerableMisstatementETB,
                      materialityPct,
                      tolerablePct,
                      scopingNotes
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
                    onClick={() => onSelectSubStep('1.5')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    Proceed to Sub-Step 1.5
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                )}
              </>
            ) : (
              <Button
                size="sm"
                onClick={async () => {
                  onToggleComplete('1.4', true, {
                    planningMaterialityETB,
                    tolerableMisstatementETB,
                    materialityPct,
                    tolerablePct,
                    scopingNotes
                  });
                }}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                <Check size={14} className="mr-1.5" />
                Save Materiality & Mark Sub-Step 1.4 Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── 1.5 Taxpayer Evidence Dossier Assembly ─────────────────────────────────
  if (subStepId === '1.5') {
    return (
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/30 dark:to-emerald-950/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
          <div className="flex items-start gap-3">
            <Database className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                Sub-Step 1.5: Taxpayer Evidence Dossier & Documentation Inventory
              </h4>
              <p className="text-xs text-blue-800 dark:text-blue-300 mt-1 leading-relaxed">
                Under <strong>Directive No. 43/2015 Articles 6–9</strong>, verify the availability and completeness of the taxpayer’s Transfer Pricing Local File, Master File, intercompany contracts, benefit test deliverables, and ASYCUDA customs declarations.
              </p>
            </div>
          </div>
        </div>

        {/* Documentation Compliance Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Local File Status</span>
            <div className="text-sm font-bold text-amber-600 mt-1">INCOMPLETE</div>
            <span className="text-[11px] text-slate-400">Missing domestic comparables justification</span>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Master File Status</span>
            <div className="text-sm font-bold text-emerald-600 mt-1">RECEIVED & VERIFIED</div>
            <span className="text-[11px] text-slate-400">Global holding structure cataloged</span>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Cooperation Assessment</span>
            <div className="text-sm font-bold text-rose-600 mt-1">PARTIAL / DELAYED</div>
            <span className="text-[11px] text-slate-400">Management service benefit logs overdue</span>
          </div>
        </div>

        {/* Evidentiary Documents Table */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Evidentiary Documents & Working Paper Inventory
              </h3>
              <p className="text-xs text-slate-500">
                Statutory audit filings, customs manifests, and technical intercompany documentation.
              </p>
            </div>
            <Button size="sm" onClick={() => setShowAddDoc(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus size={14} className="mr-1.5" />
              Log Evidence Document
            </Button>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Document Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Verification Status</th>
                  <th className="p-3">Date Logged</th>
                  <th className="p-3">Auditor Observations</th>
                  <th className="p-3 text-center">Toggle Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{doc.title}</td>
                    <td className="p-3 font-mono text-[11px]">{doc.category}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        doc.status === 'VERIFIED' || doc.status === 'RECONCILED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : doc.status === 'INCOMPLETE'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                          : doc.status === 'MISSING'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 font-mono text-[11px]">{doc.date}</td>
                    <td className="p-3 text-slate-500 max-w-xs">{doc.notes}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          const nextStatus = doc.status === 'VERIFIED' ? 'MISSING' : 'VERIFIED';
                          handleDocStatusToggle(doc.id, nextStatus);
                        }}
                        className="text-xs text-blue-600 hover:underline font-medium"
                      >
                        Change
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Taxpayer Evidence Dossier Summary Textarea */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Auditor Synthesis of Received Evidence Dossier
          </label>
          <Textarea
            value={taxpayerEvidenceNotes}
            onChange={(e) => setTaxpayerEvidenceNotes(e.target.value)}
            rows={3}
            placeholder="Document key missing elements, translation delays, or quality of taxpayer cooperation..."
          />
        </div>

        {/* Sub-step Completion Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">
            {documents.length} evidentiary documents cataloged in electronic case repository
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
                    onClick={() => onSelectSubStep('1.6')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    Proceed to Sub-Step 1.6
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                )}
              </div>
            ) : isDone ? (
              <>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Sub-Step 1.5 Completed & Saved ✓</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    onToggleComplete('1.5', true, { documents, taxpayerEvidenceNotes });
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
                    onClick={() => onSelectSubStep('1.6')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    Proceed to Sub-Step 1.6
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                )}
              </>
            ) : (
              <Button
                size="sm"
                onClick={async () => {
                  onToggleComplete('1.5', true, { documents, taxpayerEvidenceNotes });
                }}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                <Check size={14} className="mr-1.5" />
                Save Dossier & Mark Sub-Step 1.5 Complete
              </Button>
            )}
          </div>
        </div>

        {/* Add Evidence Modal */}
        {showAddDoc && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                Log New Evidentiary Document
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Document Title</label>
                  <Input
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    placeholder="e.g. Schedule 5 Disclosure Statement"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <Select value={newDocCat} onChange={(e) => setNewDocCat(e.target.value)}>
                    <option value="Contract">Intercompany Contract</option>
                    <option value="Local File">Local File Study</option>
                    <option value="Master File">Master File Dossier</option>
                    <option value="Benefit Test">Benefit Test & Deliverables</option>
                    <option value="Customs Record">ASYCUDA Customs Manifest</option>
                    <option value="Financials">Audited Financials</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Auditor Review Notes</label>
                  <Textarea
                    value={newDocNotes}
                    onChange={(e) => setNewDocNotes(e.target.value)}
                    rows={2}
                    placeholder="Notes regarding completeness, authenticity, or missing clauses..."
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setShowAddDoc(false)}>Cancel</Button>
                <Button onClick={handleAddDoc} className="bg-blue-600 text-white font-semibold">
                  Add Document
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── 1.6 Risk Assessment Summary & Working Hypothesis ──────────────────────
  if (subStepId === '1.6') {
    return (
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
          <div className="flex items-start gap-3">
            <FileText className="text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
                Sub-Step 1.6: Comprehensive Risk Assessment Summary & Working Hypothesis
              </h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
                Synthesize findings from sub-steps 1.1 through 1.5 into the formal Phase 1 transmittal package. Formulate the preliminary <strong>Working Hypothesis</strong> and establish the <strong>Estimated Revenue at Risk</strong> for review by the TP Process Owner and Planning Meeting Committee.
              </p>
            </div>
          </div>
        </div>

        {/* Synthesis Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Controlled Flow</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              ETB {totalTxValue.toLocaleString()}
            </div>
            <span className="text-[11px] text-blue-600">{transactions.length} Scoped Streams</span>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">BEPS Risk Matrix Score</span>
            <div className="text-lg font-bold text-rose-600 mt-1">
              {totalBepsScore} / 100
            </div>
            <span className="text-[11px] text-rose-500 font-semibold">Critical Severity Band</span>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">5-Year OM Deficit</span>
            <div className="text-lg font-bold text-rose-600 mt-1">
              {finSummary.omVariance}%
            </div>
            <span className="text-[11px] text-slate-400">vs 5.85% Sector Median</span>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Planning Materiality</span>
            <div className="text-lg font-bold text-blue-600 mt-1">
              ETB {planningMaterialityETB.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400">Tolerable: ETB {tolerableMisstatementETB.toLocaleString()}</span>
          </div>
        </div>

        {/* Auditor Definitive Risk Classification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Auditor Determined Transfer Pricing Risk Classification
            </label>
            <Select
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value)}
              className="font-bold text-sm"
            >
              <option value="CRITICAL">CRITICAL (Score &gt; 85: Multi-million haven outflows &amp; negative OM)</option>
              <option value="HIGH">HIGH (Score 70-84: Substantial management fees &amp; low margins)</option>
              <option value="MEDIUM">MEDIUM (Score 50-69: Moderate controlled flows with standard margins)</option>
              <option value="LOW">LOW (Score &lt; 50: Insignificant related party variance)</option>
            </Select>
            <p className="text-[11px] text-slate-400 mt-1">
              A <strong>CRITICAL</strong> rating mandates full team leader review and prioritizes the case for full audit program formulation.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Estimated Corporate Revenue at Risk (ETB)
            </label>
            <Input
              type="number"
              value={revenueAtRisk}
              onChange={(e) => setRevenueAtRisk(Number(e.target.value))}
              className="font-mono font-bold text-rose-600"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Estimated tax yield at 30% statutory rate: <strong className="text-slate-700 dark:text-slate-200">ETB {Math.round(revenueAtRisk * 0.30).toLocaleString()}</strong>
            </p>
          </div>
        </div>

        {/* Working Hypothesis Formulation (Crucial for Review Committee) */}
        <div className="p-5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider">
              Working Hypothesis Formulation (For Review Committee Planning Meeting)
            </h4>
            <Badge color="blue">Mandatory Review Artifact</Badge>
          </div>
          <p className="text-xs text-blue-800 dark:text-blue-300">
            Formulate the preliminary working hypothesis detailing how the taxpayer is shifting profits, which transactions will be audited, and the initial business case.
          </p>

          <Textarea
            value={suspectedMechanism}
            onChange={(e) => setSuspectedMechanism(e.target.value)}
            rows={3}
            placeholder="Describe the suspected profit shifting mechanism..."
          />
        </div>

        {/* Recommended Audit Scope & Tax Years */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Recommended Tax Audit Scope
            </label>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Tax Years to Include:</span>
              <div className="flex gap-4">
                {['2020', '2021', '2022', '2023', '2024'].map(yr => (
                  <label key={yr} className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={targetYears.includes(yr)}
                      onChange={(e) => {
                        if (e.target.checked) setTargetYears([...targetYears, yr]);
                        else setTargetYears(targetYears.filter(y => y !== yr));
                      }}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>FY {yr}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Statutory Basis & Directives Applied
            </label>
            <Textarea
              value={statutoryGrounds}
              onChange={(e) => setStatutoryGrounds(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        {/* Auditor Transmittal Comments */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Auditor Phase 1 Transmittal Summary & Recommendation to Team Leader
          </label>
          <Textarea
            value={riskComments}
            onChange={(e) => setRiskComments(e.target.value)}
            rows={3}
            placeholder="Summarize the core findings and recommend endorsement of the case to proceed to Phase 2 Audit Planning & Programming..."
          />
        </div>

        {/* Sub-step Completion Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">
            Phase 1 Statutory Risk Assessment Complete • Estimated Revenue at Risk: <strong className="text-rose-600">ETB {Number(revenueAtRisk).toLocaleString()}</strong>
          </div>
          <div className="flex items-center gap-2">
            {isReadOnly ? (
              <div className="flex items-center gap-2">
                <Badge color="slate" className="py-1 px-3 text-xs flex items-center gap-1 font-medium">
                  <Lock size={12} /> Phase 1 Working Papers Formally Locked
                </Badge>
                {onProceedToPhase && (
                  <Button
                    size="sm"
                    onClick={() => {
                      onProceedToPhase('AUDIT_PLANNING');
                      if (onSelectSubStep) onSelectSubStep('2.1');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                  >
                    Proceed to Phase 2: Audit Planning
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                )}
              </div>
            ) : isDone ? (
              <>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Sub-Step 1.6 Completed & Saved ✓</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await executeApiAction('/risk-assessment', {
                      riskLevel,
                      comments: riskComments,
                      riskDetails: {
                        controlledTransactions: transactions,
                        auditedFinancials: financials,
                        riskIndicators: pillars,
                        workingHypothesis: {
                          suspectedMechanism,
                          revenueAtRisk,
                          targetYears,
                          statutoryGrounds
                        },
                        materiality: {
                          planningMaterialityETB,
                          tolerableMisstatementETB
                        },
                        documents
                      }
                    }, 'Phase 1 Risk Assessment updated.');
                    onToggleComplete('1.6', true, {
                      riskLevel,
                      riskComments,
                      revenueAtRisk,
                      suspectedMechanism,
                      targetYears
                    });
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
                      onProceedToPhase('AUDIT_PLANNING');
                      if (onSelectSubStep) onSelectSubStep('2.1');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                  >
                    Proceed to Phase 2: Audit Planning
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                )}
              </>
            ) : (
              <Button
                size="sm"
                onClick={async () => {
                  await executeApiAction('/risk-assessment', {
                    riskLevel,
                    comments: riskComments,
                    riskDetails: {
                      controlledTransactions: transactions,
                      auditedFinancials: financials,
                      riskIndicators: pillars,
                      workingHypothesis: {
                        suspectedMechanism,
                        revenueAtRisk,
                        targetYears,
                        statutoryGrounds
                      },
                      materiality: {
                        planningMaterialityETB,
                        tolerableMisstatementETB
                      },
                      documents
                    }
                  }, 'Phase 1 Risk Assessment and Working Hypothesis saved to database.');
                  onToggleComplete('1.6', true, {
                    riskLevel,
                    riskComments,
                    revenueAtRisk,
                    suspectedMechanism,
                    targetYears
                  });
                }}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                <Check size={14} className="mr-1.5" />
                Finalize & Mark Sub-Step 1.6 Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
