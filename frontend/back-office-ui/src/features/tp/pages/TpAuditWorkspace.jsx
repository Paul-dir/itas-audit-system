import { useState, useEffect, useCallback } from 'react';
import { 
  ShieldAlert, FileText, Calendar, CheckCircle2, AlertTriangle, 
  Send, Layers, BarChart2, DollarSign, Calculator, ChevronRight,
  ArrowRight, UserCheck, Scale, AlertOctagon, RefreshCw, X, Users
} from 'lucide-react';
import { Card, Button, Badge, Alert, Input, Textarea, Select, Tabs } from '../../../components/ui/index.jsx';
import { formatRevenue } from '../../ap/utils/revenueFormatter.js';

const BASE_API = '/api/v1/backoffice/tp/cases';

const TP_PHASES = [
  { id: 'DETAILED_RISK_ASSESSMENT', label: 'Risk Assessment', icon: ShieldAlert },
  { id: 'WORKING_HYPOTHESIS', label: 'Working Hypothesis', icon: FileText },
  { id: 'PLANNING', label: 'Planning & Meeting', icon: Calendar },
  { id: 'FIELD_WORK', label: 'Field Work', icon: Layers },
  { id: 'ANALYSIS', label: 'Economic Analysis', icon: BarChart2 },
  { id: 'REPORT', label: 'TP Report', icon: FileText },
  { id: 'ASSESSMENT', label: 'Assessment', icon: Calculator },
  { id: 'NOTICE', label: 'Notice & Objection', icon: Scale },
  { id: 'COMPLETION', label: 'Audit Closure', icon: CheckCircle2 }
];

export default function TpAuditWorkspace({ caseData, user, onClose, onRefresh, initialPhase }) {
  const [activeTab, setActiveTab] = useState(initialPhase || 'DETAILED_RISK_ASSESSMENT');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (initialPhase) {
      setActiveTab(initialPhase);
    }
  }, [initialPhase]);

  // Form states for phases
  // Phase 1: Risk Assessment
  const [riskLevel, setRiskLevel] = useState('HIGH');
  const [riskDetails, setRiskDetails] = useState('High cross-border management fee payments to offshore parent entity exceeding benchmark thresholds.');
  const [riskComments, setRiskComments] = useState('Requires full interquartile range benchmark study.');

  // Phase 2: Working Hypothesis
  const [hypothesisDesc, setHypothesisDesc] = useState('Taxpayer artificially inflated management fees to shift taxable profits to low-tax jurisdiction.');
  const [identifiedIssue, setIdentifiedIssue] = useState('Excessive Royalty & Service Fee Deductions');
  const [econRationale, setEconRationale] = useState('Service benefit test fails under OECD TP Guidelines.');
  const [revenueAtRisk, setRevenueAtRisk] = useState(caseData?.estimatedRevenue || 12970000);
  const [calcDetails, setCalcDetails] = useState('Calculated based on 15% adjustment to gross service payments over 3 tax years.');

  // Phase 3: Planning
  const [planObj, setPlanObj] = useState('Verify arm\'s length nature of international related party transactions.');
  const [planScope, setPlanScope] = useState('FY 2023 - FY 2025 cross-border management & licensing fees');
  const [planMateriality, setPlanMateriality] = useState('5000000');
  const [meetingDate, setMeetingDate] = useState('2026-09-15');
  const [meetingParticipants, setMeetingParticipants] = useState('TP Audit Committee Chair, Lead TP Auditor, Senior Tax Economist');
  const [meetingAgenda, setMeetingAgenda] = useState('Review audit scope, approve functional analysis parameters and issue Information Document Request (IDR-01)');
  const [samplingMethod, setSamplingMethod] = useState('STRATIFIED');
  const [idrNoticeDays, setIdrNoticeDays] = useState(15);
  const [idrItems, setIdrItems] = useState([
    { id: 1, name: 'Master File & Local File TP Documentation', desc: 'As mandated under Ethiopian Transfer Pricing Directive No. 43/2015 for related party transactions > 500,000 ETB.', checked: true },
    { id: 2, name: 'Executed Intercompany Contracts & Service Agreements', desc: 'Original signed agreements with foreign related entities defining cost allocation keys and fee calculation formulas.', checked: true },
    { id: 3, name: 'Benefit Test Deliverables & Activity Timesheets', desc: 'Evidence demonstrating actual economic benefit received in Ethiopia for management & technical assistance fees.', checked: true },
    { id: 4, name: 'Country-by-Country (CbCR) Reporting Data', desc: 'Global allocation of income, taxes paid, and operating activities across all multinational group tax jurisdictions.', checked: true },
    { id: 5, name: 'Audited Financial Statements of Foreign Associated Enterprise', desc: 'Financial accounts for Mauritius & UK parent entities for FY2023-FY2025.', checked: false }
  ]);
  const [newItemText, setNewItemText] = useState('');

  // Phase 5: Economic Analysis
  const [selectedMethod, setSelectedMethod] = useState('TNMM');
  const [iqrMin, setIqrMin] = useState(4.5);
  const [iqrMax, setIqrMax] = useState(8.2);
  const [taxpayerResult, setTaxpayerResult] = useState(2.1);
  const [varianceAmt, setVarianceAmt] = useState(7800000);

  // Phase 7: Assessment Calculation State Engine
  const [taxAdjustment, setTaxAdjustment] = useState(7800000);
  const [interestRate, setInterestRate] = useState(10);

  // API submit handler helper
  const handlePost = async (endpoint, payload, successMsg) => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`${BASE_API}/${caseData.id}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': user?.id || 'tp-chair'
        },
        body: payload ? JSON.stringify(payload) : null
      });
      if (res.ok) {
        setMsg({ type: 'success', text: successMsg || 'Saved successfully!' });
        if (onRefresh) onRefresh();
      } else {
        const errText = await res.text();
        setMsg({ type: 'error', text: `Failed: ${errText}` });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm w-full flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">

        {/* Main Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {msg && (
            <Alert type={msg.type === 'error' ? 'error' : 'success'} title={msg.text} />
          )}

          {/* Phase 1: Risk Assessment - Enterprise Grade Auditor Workbench */}
          {activeTab === 'DETAILED_RISK_ASSESSMENT' && (
            <div className="space-y-6">
              {/* 1. Taxpayer Profile & Case Context Header Card */}
              <Card className="p-6 bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 border-purple-800/40 text-white shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-mono font-semibold rounded-full">
                        TP RISK MATRIX v4.2
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Case ID: {caseData?.caseNumber || '#2026-TP-AA-0207'}</span>
                      <Badge color="red" className="font-mono">CRITICAL RISK SCORE: {caseData?.riskScore || 99}/150</Badge>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight pt-1">
                      {caseData?.taxpayerName || 'Crest Textiles SC'}
                    </h2>
                    <p className="text-xs text-slate-300 font-mono">
                      TIN: <span className="text-purple-300 font-bold">{caseData?.tin || 'ETH030999'}</span> | Sector: <span className="text-slate-200">{caseData?.sector || 'Textile Manufacturing'}</span> | Region: <span className="text-slate-200">Addis Ababa Large Taxpayers Office</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-6 bg-slate-800/80 backdrop-blur-md p-4 rounded-xl border border-slate-700">
                    <div className="text-right">
                      <p className="text-[11px] uppercase font-mono tracking-wider text-slate-400">Total Tax Revenue at Risk</p>
                      <p className="text-2xl font-extrabold text-emerald-400 font-mono">
                        {formatRevenue(caseData?.estimatedRevenue || revenueAtRisk || 575982000)} ETB
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 2. Automated Multi-Factor Risk Assessment Engine Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-500 uppercase">1. Profitability Variance</p>
                    <Badge color="red">High Risk</Badge>
                  </div>
                  <p className="text-xl font-bold text-slate-800 dark:text-white">1.8% EBIT Margin</p>
                  <p className="text-[11px] text-slate-400">Industry Benchmark Median: <span className="font-semibold text-slate-700 dark:text-slate-200">6.4%</span></p>
                </Card>

                <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-500 uppercase">2. Related Party Service Fees</p>
                    <Badge color="red">Critical Alert</Badge>
                  </div>
                  <p className="text-xl font-bold text-slate-800 dark:text-white">25.0M ETB/yr</p>
                  <p className="text-[11px] text-slate-400">Management Fee % Revenue: <span className="font-semibold text-amber-600">4.34%</span></p>
                </Card>

                <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-500 uppercase">3. Offshore Parent Jurisdiction</p>
                    <Badge color="yellow">Low Tax Hub</Badge>
                  </div>
                  <p className="text-xl font-bold text-slate-800 dark:text-white">Mauritius (Holding)</p>
                  <p className="text-[11px] text-slate-400">Treaty Withholding Rate: <span className="font-semibold text-blue-600">5.0%</span></p>
                </Card>

                <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-500 uppercase">4. Loss Consistency</p>
                    <Badge color="red">3 Consecutive Yrs</Badge>
                  </div>
                  <p className="text-xl font-bold text-slate-800 dark:text-white">-14.2M Net Loss</p>
                  <p className="text-[11px] text-slate-400">Statutory Limitation Window: <span className="font-semibold text-purple-600">Active</span></p>
                </Card>
              </div>

              {/* 3. Detailed Controlled Transactions Breakdown Table */}
              <Card className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-purple-600" />
                      Audited Related Party Controlled Transactions (FY 2022 - 2024)
                    </h3>
                    <p className="text-xs text-slate-500">Cross-border intercompany transactions extracted from Tax Return Schedule 5 & Country-by-Country Data</p>
                  </div>
                  <Badge color="purple" className="font-mono">4 Controlled Streams Identified</Badge>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase font-mono">
                      <tr>
                        <th className="p-3">Transaction Type</th>
                        <th className="p-3">Foreign Related Entity</th>
                        <th className="p-3">Jurisdiction</th>
                        <th className="p-3 text-right">3-Yr Total Value (ETB)</th>
                        <th className="p-3">Tested TP Method</th>
                        <th className="p-3 text-center">Initial Risk Flag</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-semibold text-slate-800 dark:text-white">Management & Technical Assistance Fees</td>
                        <td className="p-3">Crest Global Holdings Ltd</td>
                        <td className="p-3 font-mono">Mauritius</td>
                        <td className="p-3 text-right font-mono font-bold text-purple-600">75,000,000 ETB</td>
                        <td className="p-3">TNMM (Cost Plus Margin)</td>
                        <td className="p-3 text-center"><Badge color="red">HIGH RISK</Badge></td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-semibold text-slate-800 dark:text-white">Raw Material Import Purchasing</td>
                        <td className="p-3">Crest Asian Manufacturing Pte</td>
                        <td className="p-3 font-mono">Singapore</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-700 dark:text-slate-200">320,000,000 ETB</td>
                        <td className="p-3">CUP / Resale Price</td>
                        <td className="p-3 text-center"><Badge color="yellow">MEDIUM RISK</Badge></td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-semibold text-slate-800 dark:text-white">Trademark & Brand Royalty License</td>
                        <td className="p-3">Crest IP Intellectual Capital Corp</td>
                        <td className="p-3 font-mono">Switzerland</td>
                        <td className="p-3 text-right font-mono font-bold text-amber-600">42,500,000 ETB</td>
                        <td className="p-3">Profit Split / CUT</td>
                        <td className="p-3 text-center"><Badge color="red">HIGH RISK</Badge></td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-semibold text-slate-800 dark:text-white">Intercompany Long-Term Loan Interest</td>
                        <td className="p-3">Crest Finance Treasury BV</td>
                        <td className="p-3 font-mono">Netherlands</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-700 dark:text-slate-200">138,482,000 ETB</td>
                        <td className="p-3">CUP (SOFR Spread)</td>
                        <td className="p-3 text-center"><Badge color="blue">MONITORED</Badge></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* 4. Auditor Detailed Findings & Parameters Form */}
              <Card className="p-6 space-y-4">
                <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <ShieldAlert className="w-5 h-5 text-purple-600" />
                  Auditor Detailed Risk Assessment Parameters & Statutory Scope
                </h3>

                <div className="grid grid-cols-2 gap-6">
                  <Select
                    label="Formal Assessed Risk Classification"
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value)}
                    options={[
                      { value: 'CRITICAL', label: 'CRITICAL — Priority 1 Full Scope TP Audit Required' },
                      { value: 'HIGH', label: 'HIGH — High Risk Profit Shifting & Erosion' },
                      { value: 'MEDIUM', label: 'MEDIUM — Moderate Pricing Discrepancy' }
                    ]}
                  />
                  <Input 
                    label="Total Estimated Taxable Adjustment at Risk (ETB)" 
                    type="number"
                    value={revenueAtRisk}
                    onChange={(e) => setRevenueAtRisk(e.target.value)}
                    className="font-mono text-purple-600 font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Textarea 
                    label="Detailed Technical Risk Audit Findings & Red Flag Indicators"
                    rows={4}
                    value={riskDetails}
                    onChange={(e) => setRiskDetails(e.target.value)}
                    placeholder="Document specific transfer pricing risk indicators, benchmarking gaps, and contract inconsistencies..."
                  />
                  <Textarea 
                    label="Lead Auditor Strategy & Supervisory Committee Notes"
                    rows={4}
                    value={riskComments}
                    onChange={(e) => setRiskComments(e.target.value)}
                    placeholder="Enter instructions for functional analysis, economic database queries, and audit team deployment..."
                  />
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500">
                    <span className="font-bold text-purple-600">MoR Compliance:</span> Data persisted in PostgreSQL under Audit Case Audit Log #2026-TP-LOG-88.
                  </p>
                  <Button 
                    variant="primary" 
                    icon={Send} 
                    loading={loading}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5"
                    onClick={() => handlePost('/risk-assessment', { riskLevel, riskDetails, comments: riskComments, revenueAtRisk: parseFloat(revenueAtRisk) }, 'Detailed Risk Assessment parameters saved successfully!')}
                  >
                    Save & Finalize Risk Assessment Step
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Phase 2: Working Hypothesis - Enterprise Issue Framing & Economic Rationale Workbench */}
          {activeTab === 'WORKING_HYPOTHESIS' && (
            <div className="space-y-6">
              {/* 1. Header Context Banner */}
              <Card className="p-6 bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border-blue-800/40 text-white shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-mono font-semibold rounded-full">
                        TP ISSUE FRAMING & HYPOTHESIS ENGINE
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Stage 2 of 9</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight pt-1">
                      Audit Working Hypothesis & Tax Evasion / Erosion Risk Framing
                    </h2>
                    <p className="text-xs text-slate-300">
                      Formulate testable audit hypotheses regarding related party transactions, benefit tests, and artificial profit shifting under OECD Guidelines & Ethiopian Transfer Pricing Directives.
                    </p>
                  </div>
                </div>
              </Card>

              {/* 2. Key Audit Issue & Statutory Legal Basis Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-500 uppercase">Primary Focus Area</p>
                    <Badge color="blue">OECD Action 8-10</Badge>
                  </div>
                  <p className="text-lg font-bold text-slate-800 dark:text-white">Management Service Fee Deductions</p>
                  <p className="text-xs text-slate-500">Substance test failure & non-arm's length mark-up rates across foreign related entities.</p>
                </Card>

                <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-500 uppercase">Statutory Legal Provision</p>
                    <Badge color="purple">MoR Directive No. 43/2015</Badge>
                  </div>
                  <p className="text-lg font-bold text-slate-800 dark:text-white">Arm's Length Principle (Art. 79)</p>
                  <p className="text-xs text-slate-500">Power of the Authority to re-characterize transactions lacking economic commercial reality.</p>
                </Card>

                <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-500 uppercase">Target Audit Period</p>
                    <Badge color="green">3 Taxable Years</Badge>
                  </div>
                  <p className="text-lg font-bold text-slate-800 dark:text-white">FY 2022 / 2023 / 2024</p>
                  <p className="text-xs text-slate-500">Multi-year trend analysis to eliminate cyclical economic fluctuations.</p>
                </Card>
              </div>

              {/* 3. Core Working Hypothesis Form */}
              <Card className="p-6 space-y-5">
                <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Formulate Working Hypothesis Details & Verification Parameters
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Primary TP Issue Identified" 
                    value={identifiedIssue}
                    onChange={(e) => setIdentifiedIssue(e.target.value)}
                    placeholder="e.g. Excessive Royalty & Service Fee Deductions to Low-Tax Affiliates"
                    className="font-medium"
                  />
                  <Input 
                    label="Estimated Tax Adjustment Impact (ETB)" 
                    type="number"
                    value={revenueAtRisk}
                    onChange={(e) => setRevenueAtRisk(e.target.value)}
                    className="font-mono text-blue-600 font-bold"
                  />
                </div>

                <Textarea 
                  label="Detailed Working Hypothesis Description"
                  rows={4}
                  value={hypothesisDesc}
                  onChange={(e) => setHypothesisDesc(e.target.value)}
                  placeholder="Formulate the detailed auditor hypothesis (e.g. Taxpayer artificially inflated management fees paid to parent entity without demonstrating actual economic benefit received...)"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Textarea 
                    label="Economic Rationale & Transfer Pricing Impact"
                    rows={3}
                    value={econRationale}
                    onChange={(e) => setEconRationale(e.target.value)}
                    placeholder="Describe how the controlled arrangement distorts local taxable profits in Ethiopia..."
                  />
                  <Textarea 
                    label="Calculation & Verification Methodology Details"
                    rows={3}
                    value={calcDetails}
                    onChange={(e) => setCalcDetails(e.target.value)}
                    placeholder="Specify proposed methodology (e.g. Cost Plus disallowance or TNMM benchmarking comparison)..."
                  />
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500">
                    <span className="font-bold text-blue-600">Audit Trail:</span> Approved hypothesis will dictate the Document Request List for Phase 3 & Fieldwork verification.
                  </p>
                  <Button 
                    variant="primary" 
                    icon={Send} 
                    loading={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5"
                    onClick={() => handlePost('/working-hypothesis', {
                      hypothesisDescription: hypothesisDesc,
                      identifiedIssue,
                      economicRationale: econRationale,
                      revenueAtRisk: parseFloat(revenueAtRisk),
                      calculationDetails: calcDetails
                    }, 'Working Hypothesis recorded successfully!')}
                  >
                    Submit Working Hypothesis
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Phase 3: Planning & Meeting - Enterprise Planning & Entry Conference Workbench */}
          {activeTab === 'PLANNING' && (
            <div className="space-y-6">
              {/* 1. Header Context Banner */}
              <Card className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-emerald-800/40 text-white shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-mono font-semibold rounded-full">
                        TP AUDIT PLANNING & ENTRY CONFERENCE
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Stage 3 of 9</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight pt-1">
                      Audit Scope Formulation, Materiality Thresholds & Entry Conference Workbench
                    </h2>
                    <p className="text-xs text-slate-300">
                      Establish statutory audit plan parameters (Form FR-04.5.1), schedule the taxpayer's formal Entry Conference, and generate customizable Information Document Requests (IDR-01).
                    </p>
                  </div>
                </div>
              </Card>

              {/* 2. Planning Parameters Grid */}
              <Card className="p-6 space-y-5">
                <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  Statutory Audit Plan Objectives & Scope (MoR Standard FR-04.5.1-01)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Audit Primary Objectives" 
                    value={planObj}
                    onChange={(e) => setPlanObj(e.target.value)}
                    placeholder="Verify arm's length nature of international related party transactions..."
                  />
                  <Input 
                    label="Statutory Scope Taxable Years" 
                    value={planScope}
                    onChange={(e) => setPlanScope(e.target.value)}
                    placeholder="FY 2023 - FY 2025 cross-border management & licensing fees"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input 
                    label="Materiality Threshold Amount (ETB)" 
                    type="number"
                    value={planMateriality}
                    onChange={(e) => setPlanMateriality(e.target.value)}
                    className="font-mono"
                  />
                  <Select
                    label="Sampling & Audit Selection Method (FR-04.5.1-03)"
                    value={samplingMethod}
                    onChange={(e) => setSamplingMethod(e.target.value)}
                    options={[
                      { value: 'STRATIFIED', label: 'Stratified Random Sampling (High-Risk Cross-Border)' },
                      { value: 'SYSTEMATIC', label: 'Systematic Transaction Sampling' },
                      { value: 'JUDGMENTAL', label: '100% Material Value Examination' }
                    ]}
                  />
                  <Input 
                    label="Statutory IDR Response Period (Days)" 
                    type="number"
                    value={idrNoticeDays}
                    onChange={(e) => setIdrNoticeDays(e.target.value)}
                    className="font-mono"
                  />
                </div>
              </Card>

              {/* 3. Entry Conference & Committee Meeting Scheduler */}
              <Card className="p-6 space-y-5">
                <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Users className="w-5 h-5 text-emerald-600" />
                  Taxpayer Entry Conference & Supervisory Committee Schedule (Form FR-04.2.1)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input 
                    label="Entry Conference Date" 
                    type="date"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                  />
                  <div className="col-span-2">
                    <Input 
                      label="Meeting Venue / Tax Office Location" 
                      defaultValue="Large Taxpayers Office (LTO) Conference Room B-4 / Virtual Teams"
                    />
                  </div>
                </div>

                <Input 
                  label="Required Attendees & Taxpayer Representatives" 
                  value={meetingParticipants}
                  onChange={(e) => setMeetingParticipants(e.target.value)}
                  placeholder="TP Audit Committee Chair, Lead TP Auditor, CFO & Tax Director of Taxpayer"
                />

                <Textarea 
                  label="Entry Conference Formal Agenda & Document Handover Terms"
                  rows={3}
                  value={meetingAgenda}
                  onChange={(e) => setMeetingAgenda(e.target.value)}
                  placeholder="Review audit scope, approve functional analysis parameters and issue Information Document Request (IDR-01)..."
                />
              </Card>

              {/* 4. Interactive Initial Information Document Request (IDR-01) Workbench */}
              <Card className="p-6 space-y-4 border border-emerald-200 dark:border-emerald-900/40">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      Initial Information Document Request (IDR-01) Builder
                    </h3>
                    <p className="text-xs text-slate-500">
                      Customize statutory documents required from Taxpayer within <span className="font-bold text-emerald-600">{idrNoticeDays} working days</span> of Entry Conference.
                    </p>
                  </div>
                  <Badge color="emerald" className="font-mono">FORM FR-04.5.2-IDR</Badge>
                </div>

                <div className="space-y-3">
                  {idrItems.map((item) => (
                    <div 
                      key={item.id} 
                      className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                        item.checked 
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60' 
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input 
                          type="checkbox" 
                          checked={item.checked}
                          onChange={() => {
                            setIdrItems(idrItems.map(i => i.id === item.id ? { ...i, checked: !i.checked } : i));
                          }}
                          className="mt-1 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4" 
                        />
                        <div>
                          <p className="font-bold text-xs text-slate-800 dark:text-slate-200">{item.name}</p>
                          <p className="text-slate-500 text-[11px] mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                      <Badge color={item.checked ? 'green' : 'gray'} className="text-[10px] font-mono shrink-0">
                        {item.checked ? 'INCLUDED IN IDR' : 'OPTIONAL'}
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* Add Custom IDR Item Control */}
                <div className="pt-2 flex gap-3">
                  <Input 
                    placeholder="Add custom document requirement (e.g., Transfer Pricing Policy Manual)..."
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    className="text-xs"
                  />
                  <Button 
                    variant="secondary"
                    className="shrink-0 text-xs"
                    onClick={() => {
                      if (!newItemText.trim()) return;
                      setIdrItems([...idrItems, {
                        id: Date.now(),
                        name: newItemText,
                        desc: 'Custom auditor document request.',
                        checked: true
                      }]);
                      setNewItemText('');
                    }}
                  >
                    + Add Item
                  </Button>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500">
                    <span className="font-bold text-emerald-600">Selected Requirements:</span> {idrItems.filter(i => i.checked).length} of {idrItems.length} items configured for IDR-01.
                  </div>
                  <Button 
                    variant="primary" 
                    icon={Send} 
                    loading={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5"
                    onClick={() => handlePost('/planning-meeting', {
                      objectives: planObj,
                      scopeYears: planScope,
                      materialityThreshold: parseFloat(planMateriality) || 5000000,
                      samplingMethod: samplingMethod,
                      meetingDate,
                      participants: meetingParticipants,
                      agenda: meetingAgenda,
                      idrNoticeDays: parseInt(idrNoticeDays) || 15,
                      idrItemsRequested: idrItems.filter(i => i.checked)
                    }, `Audit Plan & IDR-01 Request issued to Taxpayer! (${idrItems.filter(i => i.checked).length} document streams requested)`)}
                  >
                    Issue Audit Plan & IDR-01 Request
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Phase 4: Field Work - Enterprise Audit Verification & Evidence Gathering */}
          {activeTab === 'FIELD_WORK' && (
            <div className="space-y-6">
              {/* 1. Header Context Banner */}
              <Card className="p-6 bg-gradient-to-r from-teal-950 via-slate-900 to-slate-900 border-teal-800/40 text-white shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-mono font-semibold rounded-full">
                        TP FIELD WORK & FUNCTIONAL ANALYSIS (FAR)
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Stage 4 of 9</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight pt-1">
                      On-Site Audit Verification, FAR Analysis & Interview Minutes
                    </h2>
                    <p className="text-xs text-slate-300">
                      Conduct Functions, Assets & Risks (FAR) verification, review intercompany agreement execution, and inspect accounting sub-ledgers.
                    </p>
                  </div>
                </div>
              </Card>

              {/* 2. FAR Matrix Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-5 bg-gradient-to-br from-teal-900/10 to-slate-900 border border-teal-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase">1. Functions Performed</p>
                    <Badge color="teal">Local vs Foreign</Badge>
                  </div>
                  <p className="text-base font-bold text-slate-800 dark:text-white">Routine Textile Assembly</p>
                  <p className="text-xs text-slate-500">Key strategic decisions, R&D, and brand management executed exclusively by offshore parent entity.</p>
                </Card>

                <Card className="p-5 bg-gradient-to-br from-teal-900/10 to-slate-900 border border-teal-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase">2. Assets Employed</p>
                    <Badge color="blue">Tangible Only</Badge>
                  </div>
                  <p className="text-base font-bold text-slate-800 dark:text-white">Plant & Equipment Leasing</p>
                  <p className="text-xs text-slate-500">No valuable unique intangible assets (IP, patents, trademarks) owned by local Ethiopian taxpayer.</p>
                </Card>

                <Card className="p-5 bg-gradient-to-br from-teal-900/10 to-slate-900 border border-teal-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase">3. Risks Assumed</p>
                    <Badge color="yellow">Limited Risk</Badge>
                  </div>
                  <p className="text-lg font-bold text-slate-800 dark:text-white">Contract Manufacturer Risk</p>
                  <p className="text-xs text-slate-500">Market volume and price volatility risks contractually insulated by parent company guarantee.</p>
                </Card>
              </div>

              {/* 3. Field Audit Findings & Interview Record */}
              <Card className="p-6 space-y-5">
                <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Layers className="w-5 h-5 text-teal-600" />
                  Field Audit Verification Log & Key Interview Minutes
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Textarea 
                    label="On-Site Inspection Findings & Accounting Discrepancies"
                    rows={4}
                    defaultValue="On-site review of General Ledger Account #5400 (Management Fees) indicates duplicate billings for regional IT support which was already included in base licensing fee."
                    placeholder="Record physical inspection findings, ERP system extractions, and invoice sampling notes..."
                  />
                  <Textarea 
                    label="Taxpayer Key Staff Interview Minutes & Statements"
                    rows={4}
                    defaultValue="Interview with Finance Manager confirmed that local staff performed all technical operations without advisory input from Mauritius entity during FY 2023."
                    placeholder="Document statements made by Finance Director, Plant Operations Lead, or Tax Counsel..."
                  />
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500">
                    <span className="font-bold text-teal-600">FAR Verification Status:</span> 3 of 4 Intercompany Streams Audited.
                  </p>
                  <Button 
                    variant="primary" 
                    icon={Send} 
                    loading={loading}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5"
                    onClick={() => handlePost('/field-work', {
                      farCompleted: true,
                      fieldNotes: 'Field audit verification and staff interview minutes recorded.'
                    }, 'Field Work & FAR verification log saved successfully!')}
                  >
                    Save Field Work Log
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Phase 5: Economic Analysis */}
          {activeTab === 'ANALYSIS' && (
            <div className="space-y-6">
              {/* 1. Header Context Banner */}
              <Card className="p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border-indigo-800/40 text-white shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-mono font-semibold rounded-full">
                        TP BENCHMARK & INTERQUARTILE RANGE ENGINE
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Stage 5 of 9</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight pt-1">
                      Economic Analysis, Tested Party Selection & Interquartile Range (IQR)
                    </h2>
                    <p className="text-xs text-slate-300">
                      Perform transfer pricing method selection (TNMM, CUP, Profit Split), calculate interquartile range thresholds, and quantify tax adjustments.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Ratio Analysis & Customs Matching */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 space-y-3 bg-slate-50 dark:bg-slate-800/40">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Automated Financial Ratio Analysis (FR-04.5-12)</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      <span>Profitability Ratio (Operating Margin)</span>
                      <span className="font-bold text-red-600">2.1% (Benchmark: 6.5%)</span>
                    </div>
                    <div className="flex justify-between p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      <span>Management Fee / Gross Expense Ratio</span>
                      <span className="font-bold text-purple-600">18.4% (High Risk)</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 space-y-3 bg-slate-50 dark:bg-slate-800/40">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Customs Valuation Database Matching (FR-04.5-16)</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      <span>Import Product HS Code: 8471.30</span>
                      <Badge color="green">Customs DB Linked</Badge>
                    </div>
                    <div className="flex justify-between p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      <span>Taxpayer Price vs Producer Benchmark</span>
                      <span className="font-bold text-amber-600">24% Price Discrepancy</span>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-5 space-y-4">
                <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-indigo-600" />
                  Transfer Pricing Benchmark & Arm's Length Analysis
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <Select 
                    label="Selected Transfer Pricing Method"
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    options={[
                      { value: 'TNMM', label: 'Transactional Net Margin Method (TNMM)' },
                      { value: 'CUP', label: 'Comparable Uncontrolled Price (CUP)' },
                      { value: 'COST_PLUS', label: 'Cost Plus Method' },
                      { value: 'RESALE_PRICE', label: 'Resale Price Method' },
                      { value: 'PROFIT_SPLIT', label: 'Transactional Profit Split Method' }
                    ]}
                  />
                  <Input 
                    label="Taxpayer Tested Profit Margin (%)"
                    type="number"
                    step="0.1"
                    value={taxpayerResult}
                    onChange={(e) => setTaxpayerResult(parseFloat(e.target.value))}
                  />
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Interquartile Range (IQR) Benchmarking</p>
                  <div className="grid grid-cols-3 gap-4">
                    <Input 
                      label="IQR Minimum (25th Percentile %)"
                      type="number"
                      step="0.1"
                      value={iqrMin}
                      onChange={(e) => setIqrMin(parseFloat(e.target.value))}
                    />
                    <Input 
                      label="IQR Maximum (75th Percentile %)"
                      type="number"
                      step="0.1"
                      value={iqrMax}
                      onChange={(e) => setIqrMax(parseFloat(e.target.value))}
                    />
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Arm's Length Status</label>
                      <div className="mt-1">
                        {taxpayerResult >= iqrMin && taxpayerResult <= iqrMax ? (
                          <Badge color="green">Within Arm's Length Range</Badge>
                        ) : (
                          <Badge color="red">Out of Arm's Length Range</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Input 
                  label="Calculated Tax Variance / Adjustment Amount (ETB)"
                  type="number"
                  value={varianceAmt}
                  onChange={(e) => setVarianceAmt(parseFloat(e.target.value))}
                />

                <div className="flex justify-end gap-3">
                  <Button 
                    variant="primary" 
                    icon={Calculator} 
                    loading={loading}
                    onClick={() => handlePost('/analysis/arms-length', {
                      armsLengthRangeMin: iqrMin,
                      armsLengthRangeMax: iqrMax,
                      taxpayerActualResult: taxpayerResult,
                      varianceAmount: varianceAmt,
                      variancePercentage: ((iqrMin - taxpayerResult) / iqrMin) * 100,
                      data: { method: selectedMethod, testedParty: caseData?.taxpayerName }
                    }, 'Arm\'s Length Analysis saved successfully!')}
                  >
                    Save Arm's Length Analysis
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Phase 4: Field Work */}
          {activeTab === 'FIELD_WORK' && (
            <div className="space-y-6">
              {/* Accounting Assessment & Tiered Audit Trail */}
              <Card className="p-5 space-y-4">
                <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-600" />
                  Taxpayer Accounting Assessment & Tiered Audit Trail (FR-04.5-10)
                </h3>
                
                <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-800 space-y-3">
                  <p className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">Source Priority Audit Trail Selection</p>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-purple-300 dark:border-purple-700">
                      <p className="font-bold text-purple-900 dark:text-purple-200">1. PRIMARY (e-Invoicing)</p>
                      <p className="text-slate-500 mt-1">Direct MoR System Integration</p>
                      <Badge color="green" className="mt-2">Active Provider</Badge>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 opacity-80">
                      <p className="font-bold text-slate-700 dark:text-slate-300">2. FALLBACK (Cash Register)</p>
                      <p className="text-slate-500 mt-1">Sales Data Only (if e-invoicing unavailable)</p>
                      <Badge color="gray" className="mt-2">Standby</Badge>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 opacity-80">
                      <p className="font-bold text-slate-700 dark:text-slate-300">3. MANUAL ACCESS</p>
                      <p className="text-slate-500 mt-1">Taxpayer Books & Ledgers</p>
                      <Badge color="gray" className="mt-2">Manual</Badge>
                    </div>
                  </div>
                </div>

                <Textarea 
                  label="Accounting & Financial Reporting Policy Assessment"
                  rows={2}
                  defaultValue="Taxpayer uses IFRS standards. Transfer pricing adjustments recorded via year-end debit notes."
                />

                <div className="flex justify-end">
                  <Button 
                    variant="secondary" 
                    icon={Send} 
                    loading={loading}
                    onClick={() => handlePost('/field-work/accounting-assessment', {
                      accountingMethods: 'IFRS',
                      findings: { debitNoteAdjustments: true, eInvoicingFunctional: true }
                    }, 'Accounting Assessment saved!')}
                  >
                    Save Accounting Assessment
                  </Button>
                </div>
              </Card>

              {/* Versioned Fact Statement */}
              <Card className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Audit Fact Statement (Versioned - FR-04.5.2-03)
                  </h3>
                  <span className="text-xs font-mono px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md">
                    Current Version: v1.0 (DRAFT)
                  </span>
                </div>

                <Textarea 
                  label="Fact Statement Content (Taxpayer Profile, Related Party Transactions & Audit Facts)"
                  rows={4}
                  defaultValue="1. Taxpayer engaged in controlled management services with Parent Co.\n2. Total management fees paid in FY2024: 25,000,000 ETB.\n3. Benefit test documentation incomplete."
                />

                <div className="flex justify-end gap-3">
                  <Button 
                    variant="primary" 
                    icon={Send} 
                    loading={loading}
                    onClick={() => handlePost('/field-work/fact-statement', {
                      data: { summary: 'Fact Statement v1 created for taxpayer review.' },
                      version: 1,
                      status: 'SUBMITTED_TO_TAXPAYER'
                    }, 'Fact Statement v1 submitted to Taxpayer for Review!')}
                  >
                    Submit Fact Statement to Taxpayer (v1)
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Phase 6: TP Report & Multi-Level Sequential Review */}
          {activeTab === 'REPORT' && (
            <div className="space-y-6">
              {/* 1. Header Context Banner */}
              <Card className="p-6 bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 border-purple-800/40 text-white shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-mono font-semibold rounded-full">
                        STATUTORY TP AUDIT REPORT ENGINE
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Stage 6 of 9</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight pt-1">
                      Formal TP Audit Report & Multi-Level Review Chain (Form FR-04.5-20)
                    </h2>
                    <p className="text-xs text-slate-300">
                      Formulate technical findings, substantiate arm's length adjustments, and submit draft report through the mandatory Lead Auditor → Team Leader → Process Owner review gatekeepers.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Multi-Level Review Chain Tracker */}
              <Card className="p-6 space-y-5">
                <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Sequential Approval & Gatekeeper Progress
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-bold text-xs text-purple-900 dark:text-purple-300 uppercase">1. Lead Auditor</p>
                      <Badge color="green">Completed</Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Technical Report Drafted & Verified</p>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-bold text-xs text-blue-900 dark:text-blue-300 uppercase">2. Team Leader Review</p>
                      <Badge color="blue">In Review</Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Gatekeeper Gate FR-04.5-20 Approval</p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 opacity-60">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase">3. Audit Process Owner</p>
                      <Badge color="gray">Queued</Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Final Authorization & Notice Dispatch</p>
                  </div>
                </div>

                <Textarea 
                  label="Executive Technical Summary & Audit Findings"
                  rows={4}
                  defaultValue="Audit confirmed arm's length adjustment of 7,800,000 ETB under TNMM method due to excessive management fees paid to offshore related party in Mauritius. Benefit test failed."
                />

                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500">
                    <span className="font-bold text-purple-600">Compliance:</span> Directives FR-04.5-20 & FR-04.5.2-10 enforced.
                  </p>
                  <Button 
                    variant="primary" 
                    icon={Send} 
                    loading={loading}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5"
                    onClick={() => handlePost('/report/draft', {
                      executiveSummary: 'Audit confirmed arm\'s length adjustment under TNMM.',
                      auditBackground: 'FY2022-2024 Audit',
                      scope: 'Management & Licensing Fees',
                      proceduresPerformed: 'IQR Benchmark & Comparables',
                      findingsAndConclusions: '7,800,000 ETB Adjustment proposed',
                      complianceAssessment: 'NON_COMPLIANT'
                    }, 'Draft TP Report submitted for Team Leader Review!')}
                  >
                    Submit Draft Report to Team Leader (FR-04.5-20)
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Phase 7: Assessment Calculation & Penalty Determination */}
          {activeTab === 'ASSESSMENT' && (
            <div className="space-y-6">
              {/* 1. Header Context Banner */}
              <Card className="p-6 bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border-amber-800/40 text-white shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-mono font-semibold rounded-full">
                        TP TAX & PENALTY ASSESSMENT ENGINE
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Stage 7 of 9</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight pt-1">
                      Transfer Pricing Tax Liability & Statutory Understatement Penalty Engine
                    </h2>
                    <p className="text-xs text-slate-300">
                      Quantify gross taxable adjustment, apply 30% corporate income tax rate, statutory 20% understatement penalty, and compounding interest.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 space-y-5">
                <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Calculator className="w-5 h-5 text-amber-600" />
                  Statutory Tax & Penalty Calculation Breakdown Engine (Proclamation No. 979/2016)
                </h3>

                {(() => {
                  const corpTax = taxAdjustment * 0.30;
                  const penalty = taxAdjustment * 0.20;
                  const interest = (corpTax + penalty) * (interestRate / 100);
                  const totalDemand = corpTax + penalty + interest;

                  return (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                          <p className="text-xs text-slate-500 font-semibold uppercase">1. Arm's Length Tax Adjustment</p>
                          <p className="text-2xl font-bold text-purple-600 font-mono">{formatRevenue(taxAdjustment)} ETB</p>
                          <p className="text-[11px] text-slate-400">Derived from IQR benchmark median</p>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                          <p className="text-xs text-slate-500 font-semibold uppercase">2. Corporate Tax Liability (30%)</p>
                          <p className="text-2xl font-bold text-blue-600 font-mono">{formatRevenue(corpTax)} ETB</p>
                          <p className="text-[11px] text-slate-400">Additional Corporate Tax Payable</p>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                          <p className="text-xs text-slate-500 font-semibold uppercase">3. TP Understatement Penalty (20%)</p>
                          <p className="text-2xl font-bold text-amber-600 font-mono">{formatRevenue(penalty)} ETB</p>
                          <p className="text-[11px] text-slate-400">Statutory Fine (Proclamation 979/2016)</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                        <Input 
                          label="Arm's Length Taxable Adjustment (ETB)" 
                          type="number"
                          value={taxAdjustment}
                          onChange={(e) => setTaxAdjustment(parseFloat(e.target.value) || 0)}
                          className="font-mono"
                        />
                        <Input 
                          label="Compound Interest Factor Rate (%)" 
                          type="number"
                          value={interestRate}
                          onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                          className="font-mono"
                        />
                        <Input 
                          label="Final Total Assessed Tax Demand (ETB)" 
                          value={`${formatRevenue(totalDemand)} ETB`} 
                          readOnly
                          className="font-mono text-xl font-extrabold text-amber-600"
                        />
                      </div>

                      <Textarea 
                        label="Assessment Technical Rationale & Statutory Legal Justification" 
                        rows={3}
                        defaultValue="Adjustment calculated pursuant to Transfer Pricing Directives and OECD arm's length standards for management fees. Interquartile range analysis confirms taxpayer operating margin falls below arms-length minimum threshold."
                      />

                      <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-slate-500">
                          <span className="font-bold text-amber-600">Statutory System Engine:</span> Real-time tax liability recalculation active.
                        </p>
                        <Button 
                          variant="primary" 
                          icon={Send} 
                          loading={loading}
                          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5"
                          onClick={() => handlePost('/assessment/save', {
                            adjustment: taxAdjustment,
                            taxAmount: corpTax,
                            penalty: penalty,
                            interest: interest,
                            total: totalDemand
                          }, `TP Assessment calculation saved successfully! Total Demand: ${formatRevenue(totalDemand)} ETB`)}
                        >
                          Finalize Tax & Penalty Assessment
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </Card>
            </div>
          )}

          {/* Phase 8: Notice Generation & Statutory Objections */}
          {activeTab === 'NOTICE' && (
            <div className="space-y-6">
              {/* 1. Header Context Banner */}
              <Card className="p-6 bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 border-red-800/40 text-white shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-400/30 text-xs font-mono font-semibold rounded-full">
                        FORMAL NOTICE & DISPATCH ENGINE
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Stage 8 of 9</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight pt-1">
                      MoR Standard Assessment Notice Generator (FR-04.5-23 to FR-04.5-27)
                    </h2>
                    <p className="text-xs text-slate-300">
                      Issue formal legal Assessment Notice, initiate 30-day statutory taxpayer objection countdown, or escalate to Tax Fraud Investigation.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 space-y-5">
                <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Scale className="w-5 h-5 text-red-600" />
                  Official Notice Parameters & Statutory Rights
                </h3>

                <div className="p-5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="text-slate-500">Unique Notice Reference ID:</span>
                    <span className="font-bold text-blue-600">TP-2026-00492</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="text-slate-500">Taxpayer TIN & Name:</span>
                    <span className="font-bold">{caseData?.tin || 'ETH030999'} — {caseData?.taxpayerName || 'Crest Textiles SC'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="text-slate-500">Total Demanded Tax & Penalty Demand:</span>
                    <span className="font-bold text-emerald-600">10,140,000.00 ETB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Statutory Taxpayer Objection Window:</span>
                    <span className="text-red-500 font-bold">30 Calendar Days from Delivery</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
                  {/* Fraud Escalation Action (FR-04.5-22 / Req 34) */}
                  <Button 
                    variant="danger" 
                    icon={AlertOctagon} 
                    loading={loading}
                    className="bg-rose-700 hover:bg-rose-800 text-white px-5 py-2"
                    onClick={() => handlePost('/notice/fraud-referral', {
                      reason: 'NO_RESPONSE_WITHIN_DEADLINE',
                      notes: 'Taxpayer failed to respond within statutory timeframe. Escalating to Tax Intelligence & Fraud Investigation.'
                    }, 'Fraud Investigation Referral triggered successfully!')}
                  >
                    Escalate to Tax Fraud Investigation (FR-04.5-22)
                  </Button>

                  <Button 
                    variant="primary" 
                    icon={Send} 
                    loading={loading}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5"
                    onClick={() => handlePost('/notice/generate', {
                      noticeReference: 'TP-2026-00492',
                      assessedTaxes: 7800000,
                      penalties: 1560000,
                      interest: 780000,
                      totalAmount: 10140000
                    }, 'MoR Notice TP-2026-00492 generated and dispatched!')}
                  >
                    Issue Assessment Notice & Start 30-Day Window
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Phase 9: Audit Closure */}
          {activeTab === 'COMPLETION' && (
            <div className="space-y-6">
              <Card className="p-8 text-center space-y-4 bg-gradient-to-b from-slate-900 to-slate-950 text-white border-slate-800">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-2xl font-bold text-white">
                  Transfer Pricing Audit Case Ready for Formal Case Closure
                </h3>
                <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                  All statutory execution stages (Risk Assessment, Working Hypothesis, Entry Conference, Field Verification, Economic Analysis, Technical Audit Report, Tax Assessment, and Statutory Notice Generation) have been completed in compliance with Ethiopian Revenue Proclamation No. 979/2016.
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <Button 
                    variant="success" 
                    icon={CheckCircle2} 
                    loading={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-sm font-bold shadow-lg"
                    onClick={() => handlePost('/close', null, 'Transfer Pricing Audit Case successfully CLOSED!')}
                  >
                    Finalize & Formally Close TP Case #2026-TP-AA-0207
                  </Button>
                </div>
              </Card>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
