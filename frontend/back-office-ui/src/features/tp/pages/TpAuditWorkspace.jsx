import { useState, useEffect, useCallback } from 'react';
import { 
  ShieldAlert, FileText, Calendar, CheckCircle2, AlertTriangle, 
  Send, Layers, BarChart2, DollarSign, Calculator, ChevronRight,
  ArrowRight, ArrowLeft, UserCheck, Scale, AlertOctagon, RefreshCw, X, Users,
  FileCheck, Building2, ShieldCheck, Search, Clock
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
  // Team Leader Case Assignment & Handoff State
  const [caseAssignment, setCaseAssignment] = useState({
    assignedBy: 'Workneh Kassa (TP Audit Team Leader)',
    assignedTo: 'Tadesse Mamo (Lead Senior TP Auditor)',
    assignedDate: '2026-08-15 08:30 AM',
    statutoryDeadline: '2026-11-15 (90 Statutory Days Remaining)',
    mandateReason: 'High risk cross-border profit erosion detected via Schedule 5 screening. Perform full-scope audit across FY 2020-2024.',
    auditScopeYears: 'FY 2020 – FY 2024 (5 Taxable Years)',
    allocatedHours: 480,
    acceptedByAuditor: true,
    acceptanceDate: '2026-08-15 09:15 AM',
    teamMembers: [
      { name: 'Tadesse Mamo', role: 'Lead Senior Auditor', allocation: '100% (Lead Execution)' },
      { name: 'Workneh Kassa', role: 'Team Leader / Supervisor', allocation: '30% (Quality Assurance & Gatekeeper)' },
      { name: 'Dr. Almaz Tekle', role: 'Senior TP Economist', allocation: '50% (Economic & Benchmark Analysis)' },
      { name: 'Yonas Haile', role: 'Legal & Tax Counsel', allocation: '25% (Proclamation & Treaty Review)' }
    ]
  });
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  // Phase 1: Risk Assessment - 5 Sub-Page Enterprise Workflow Engine
  const [riskSubPage, setRiskSubPage] = useState(1);
  const [riskLevel, setRiskLevel] = useState('HIGH');
  const [riskDetails, setRiskDetails] = useState('High cross-border management fee payments to offshore parent entity exceeding benchmark thresholds.');
  const [riskComments, setRiskComments] = useState('Requires full interquartile range benchmark study.');

  // Sub-Page 1: Profiling State
  const [historyWindowMode, setHistoryWindowMode] = useState('5_YEAR'); // '5_YEAR' or '10_YEAR'
  const [selectedYearBreakdown, setSelectedYearBreakdown] = useState(null);

  const [auditedFinancials10Yr] = useState([
    { year: 'FY 2015', turnover: 210000000, grossMargin: 24.2, ebit: 7.8, netProfit: 12400000, taxPaid: 3720000 },
    { year: 'FY 2016', turnover: 235000000, grossMargin: 23.5, ebit: 7.1, netProfit: 11800000, taxPaid: 3540000 },
    { year: 'FY 2017', turnover: 260000000, grossMargin: 22.8, ebit: 6.5, netProfit: 9500000, taxPaid: 2850000 },
    { year: 'FY 2018', turnover: 295000000, grossMargin: 21.4, ebit: 5.4, netProfit: 6200000, taxPaid: 1860000 },
    { year: 'FY 2019', turnover: 340000000, grossMargin: 20.1, ebit: 4.2, netProfit: 2100000, taxPaid: 630000 },
    { year: 'FY 2020', turnover: 375000000, grossMargin: 19.8, ebit: 3.1, netProfit: -1200000, taxPaid: 500000 },
    { year: 'FY 2021', turnover: 395000000, grossMargin: 19.1, ebit: 2.5, netProfit: -2800000, taxPaid: 500000 },
    { year: 'FY 2022', turnover: 420000000, grossMargin: 18.5, ebit: 2.1, netProfit: -4200000, taxPaid: 500000 },
    { year: 'FY 2023', turnover: 490000000, grossMargin: 16.2, ebit: 1.8, netProfit: -5800000, taxPaid: 500000 },
    { year: 'FY 2024', turnover: 575000000, grossMargin: 14.8, ebit: 1.5, netProfit: -6400000, taxPaid: 500000 }
  ]);

  const auditedFinancials = historyWindowMode === '5_YEAR' 
    ? auditedFinancials10Yr.slice(5) 
    : auditedFinancials10Yr;

  const [controlledTransactions, setControlledTransactions] = useState([
    { id: 1, type: 'INTERNATIONAL', stream: 'Management & Technical Services', foreignEntity: 'Crest Global Holdings Ltd', jurisdiction: 'Mauritius (Low-Tax DTA)', totalValue: 75000000, method: 'TNMM', riskFlag: 'CRITICAL' },
    { id: 2, type: 'INTERNATIONAL', stream: 'Raw Material Imports Purchasing', foreignEntity: 'Crest Asian Mfg Pte', jurisdiction: 'Singapore (Offshore Hub)', totalValue: 320000000, method: 'CUP', riskFlag: 'MEDIUM' },
    { id: 3, type: 'INTERNATIONAL', stream: 'Trademark & Brand Royalties', foreignEntity: 'Crest IP Capital Corp', jurisdiction: 'Switzerland (IP Box)', totalValue: 42500000, method: 'CUT', riskFlag: 'HIGH' },
    { id: 4, type: 'INTERNATIONAL', stream: 'Intercompany Financing & Interest', foreignEntity: 'Crest Finance Treasury BV', jurisdiction: 'Netherlands (Treasury)', totalValue: 138482000, method: 'CUP', riskFlag: 'MONITORED' },
    { id: 5, type: 'DOMESTIC', stream: 'Intercompany Finished Fabric Sales', foreignEntity: 'Crest Apparel Hawassa SEZ Ltd', jurisdiction: 'Ethiopia (Hawassa Industrial Park - 10 Yr CIT Holiday)', totalValue: 185000000, method: 'TNMM', riskFlag: 'CRITICAL' },
    { id: 6, type: 'DOMESTIC', stream: 'Domestic Equipment & Machinery Lease', foreignEntity: 'Crest Heavy Equipment Rental SC', jurisdiction: 'Ethiopia (Addis Ababa Affiliate)', totalValue: 28500000, method: 'CUP', riskFlag: 'MEDIUM' }
  ]);

  // Sub-Page 2: Risk Indicators State
  const [riskIndicators, setRiskIndicators] = useState([
    { id: 1, title: 'Operating Margin Below Benchmark', category: 'Financial Ratios', weight: 15, status: 'CRITICAL', detail: 'Taxpayer EBIT 1.8% vs Industry Median 6.4%' },
    { id: 2, title: 'Continuous 3-Year Net Losses', category: 'Profitability', weight: 15, status: 'CRITICAL', detail: 'Accumulated 16.4M ETB loss despite growing turnover' },
    { id: 3, title: 'High Management Fee to Revenue Ratio', category: 'Service Fees', weight: 15, status: 'CRITICAL', detail: 'Fees equal 4.34% of gross revenue paid to Mauritius' },
    { id: 4, title: 'Related Party Payments to Low-Tax Jurisdiction', category: 'Jurisdiction Risk', weight: 15, status: 'HIGH', detail: 'Mauritius holding entity enjoys 5% treaty rate' },
    { id: 5, title: 'Thin Capitalization (Debt/Equity > 2:1)', category: 'Financing', weight: 10, status: 'HIGH', detail: 'Related party debt ratio 3.2:1 exceeds statutory ceiling' },
    { id: 6, title: 'Intangible Asset IP Royalty Transfer', category: 'Intangibles', weight: 10, status: 'HIGH', detail: 'Brand license fees charged with zero local R&D cost-sharing' },
    { id: 7, title: 'Customs Import Price Inflation', category: 'Customs Mismatch', weight: 10, status: 'MEDIUM', detail: 'Raw material import declaration 24% higher than producer DB' },
    { id: 8, title: 'Significant Year-End Tax Adjustments', category: 'Accounting', weight: 5, status: 'MEDIUM', detail: 'Unexplained 12.5M ETB credit memo issued in Q4' },
    { id: 9, title: 'Unhedged Foreign Exchange Risk Transfer', category: 'Financial Risk', weight: 3, status: 'LOW', detail: 'All FX loss allocated to Ethiopian subsidiary' },
    { id: 10, title: 'TP Local File Documentation Deficiency', category: 'Compliance', weight: 2, status: 'MEDIUM', detail: 'Functional analysis lacks employee activity timesheets' }
  ]);
  const [customsMatches, setCustomsMatches] = useState([
    { hsCode: '5208.11', itemDesc: 'Woven Cotton Fabrics (>85%)', taxpayerUnitPrice: 485.00, customsBenchmarkPrice: 375.00, variancePct: 29.3, status: 'PRICE_INFLATED' },
    { hsCode: '8446.30', itemDesc: 'Industrial Weaving Machinery Parts', taxpayerUnitPrice: 12500.00, customsBenchmarkPrice: 10200.00, variancePct: 22.5, status: 'PRICE_INFLATED' }
  ]);

  // Sub-Page 3: Category Questionnaire State
  const [riskCategories, setRiskCategories] = useState([
    { categoryName: 'TP Documentation & Master/Local File', question: 'Does taxpayer maintain statutory TP Master File and Local File compliant with Directive No. 43/2015?', response: 'Local File provided but lacks functional benchmarking and intercompany service benefit test proof.', riskIdentified: true, evidenceReference: 'DocRef-TP-01' },
    { categoryName: 'Functional Analysis & Economic Substance', question: 'Does local Ethiopian entity perform key DEMPE functions or hold economic ownership of intangibles?', response: 'Entity acts as routine contract assembler; all strategic IP and decisions held by offshore parent.', riskIdentified: true, evidenceReference: 'FAR-Inspect-02' },
    { categoryName: 'Economic Analysis & Method Selection', question: 'Is the selected TP Method (TNMM/CUP) appropriate and substantiated with local benchmark study?', response: 'Taxpayer applied Cost Plus 5% without verifying arm\'s length profitability of tested party.', riskIdentified: true, evidenceReference: 'Econ-Audit-03' },
    { categoryName: 'Comparable Selection & Benchmarking', question: 'Are comparables selected independent, geographically relevant, and free of extreme variance?', response: 'Foreign database query used European comparables not adjusted for East African market conditions.', riskIdentified: true, evidenceReference: 'IQR-Benchmark-04' },
    { categoryName: 'Profit Allocation & Base Erosion Impact', question: 'Do related party payments result in systematic profit shifting or zero tax liability in Ethiopia?', response: 'Management & Royalty fees absorb 82% of Ethiopian operating profit over 3 taxable years.', riskIdentified: true, evidenceReference: 'TaxBase-Calc-05' }
  ]);

  // Sub-Page 4: Revenue-at-Risk Simulator State
  const [fy2022Adj, setFy2022Adj] = useState(21500000);
  const [fy2023Adj, setFy2023Adj] = useState(25000000);
  const [fy2024Adj, setFy2024Adj] = useState(28500000);
  const [riskPenaltyRatePct, setRiskPenaltyRatePct] = useState(20);
  const [riskInterestRatePct, setRiskInterestRatePct] = useState(10);

  // Sub-Page 5: Decision & Committee Approval State
  const [selectedAuditPath, setSelectedAuditPath] = useState('FULL_SCOPE_AUDIT');
  const [leadAuditorStrategy, setLeadAuditorStrategy] = useState('Proceed with Priority 1 Full-Scope Transfer Pricing Audit focusing on disallowance of offshore management fee deductions under Art. 79 of Ethiopian Tax Proclamation and OECD Benefit Test. Issue IDR-01 during Entry Conference.');
  const [committeeChair, setCommitteeChair] = useState('Abebe Bikila (Chair - MoR TP Audit Committee)');
  const [committeeApprovalStatus, setCommitteeApprovalStatus] = useState('APPROVED');
  const [showReportPreview, setShowReportPreview] = useState(false);

  // Phase 2: Working Hypothesis - 5 Sub-Page Stepper State
  const [hypothesisSubPage, setHypothesisSubPage] = useState(1);
  const [hypothesisDesc, setHypothesisDesc] = useState('Taxpayer artificially inflated offshore management fees (75M ETB to Mauritius) and brand royalties (42.5M ETB to Switzerland) to shift taxable profits out of Ethiopia, while underpricing domestic sales to tax-exempt Hawassa SEZ affiliate.');
  const [identifiedIssue, setIdentifiedIssue] = useState('Excessive Offshore Management Fees, Unsubstantiated Royalties & Domestic SEZ Arbitrage');
  const [econRationale, setEconRationale] = useState('Management fees fail the OECD 5-Step Benefit Test. Ethiopian entity operating margin (1.5%) falls below the 6.4% arm\'s length interquartile range median.');
  const [revenueAtRisk, setRevenueAtRisk] = useState(caseData?.estimatedRevenue || 30615000);
  const [calcDetails, setCalcDetails] = useState('Calculated based on 80% disallowance of offshore management fees, 100% disallowance of brand royalties, and 15% adjustment to domestic Hawassa SEZ sales across 5 tax years (FY 2020 - FY 2024).');

  // Sub-Page 1 State: Scope & Transaction Selection
  const [hypothesisAuditScope, setHypothesisAuditScope] = useState('FY 2020 - FY 2024 (5 Statutory Taxable Years)');
  const [hypothesisMateriality, setHypothesisMateriality] = useState(5000000);

  // Sub-Page 2 State: OECD 5-Step Benefit Test & DEMPE Matrix
  const [benefitTestMatrix, setBenefitTestMatrix] = useState([
    { id: 1, testName: '1. Real Service Rendered Test', criteria: 'Proof of actual managerial & technical activities delivered to Ethiopian plant', status: 'FAILED', finding: 'No employee timesheets or technical deliverables provided in Local File.', riskLevel: 'CRITICAL' },
    { id: 2, testName: '2. Economic / Commercial Benefit Test', criteria: 'Demonstration of economic value enhanced or cost saved in local operations', status: 'FAILED', finding: 'Local EBIT margin dropped from 7.8% to 1.5% despite fee increases.', riskLevel: 'CRITICAL' },
    { id: 3, testName: '3. Arm\'s Length Price Test', criteria: 'Willingness of independent party to pay 4.34% turnover markup for services', status: 'FAILED', finding: 'Fee structure exceeds independent market benchmarks (1.0% - 1.5%).', riskLevel: 'HIGH' },
    { id: 4, testName: '4. Duplication of Services Check', criteria: 'Verification that local executive management does not duplicate functions', status: 'FAILED', finding: 'Local CFO & Operations Director already perform all daily management.', riskLevel: 'HIGH' },
    { id: 5, testName: '5. Shareholder Cost Disallowance', criteria: 'Exclusion of parent company stewardship and M&A costs from fee pool', status: 'FAILED', finding: 'Fee pool includes Mauritius group M&A acquisition legal costs.', riskLevel: 'CRITICAL' }
  ]);

  const [dempeMatrix, setDempeMatrix] = useState([
    { function: 'Development (R&D)', responsibleEntity: 'Crest IP Capital Corp (Switzerland)', location: 'Zurich, Switzerland', localSubstance: 'Zero Local R&D Personnel' },
    { function: 'Enhancement & Maintenance', responsibleEntity: 'Crest IP Capital Corp (Switzerland)', location: 'Zurich, Switzerland', localSubstance: 'Routine Brand Guidelines Only' },
    { function: 'Protection & IP Registration', responsibleEntity: 'Crest IP Capital Corp (Switzerland)', location: 'Zurich, Switzerland', localSubstance: 'EIPO Trademark Registered under Parent' },
    { function: 'Exploitation & Commercialization', responsibleEntity: 'Crest Textiles SC (Ethiopia)', location: 'Addis Ababa, Ethiopia', localSubstance: 'Ethiopian Entity Executes All Manufacturing & Sales' }
  ]);

  // Sub-Page 3 State: TP Method Selection & Rationale
  const [selectedTestedParty, setSelectedTestedParty] = useState('Crest Textiles SC (Ethiopian Operating Subsidiary)');
  const [primaryTpMethod, setPrimaryTpMethod] = useState('TNMM');
  const [secondaryTpMethod, setSecondaryTpMethod] = useState('CUP');
  const [pliMetric, setPliMetric] = useState('Operating Margin (EBIT / Net Turnover) & Berry Ratio');
  const [methodRationales, setMethodRationales] = useState([
    { method: 'TNMM (Transactional Net Margin Method)', status: 'SELECTED PRIMARY', rationale: 'Most appropriate method for routine manufacturing entity with complex intercompany service streams where reliable independent comparables exist.' },
    { method: 'CUP (Comparable Uncontrolled Price)', status: 'SELECTED SECONDARY', rationale: 'Applied to Raw Material Imports from Singapore by matching against Ethiopian Customs Commission transaction prices.' },
    { method: 'Cost Plus Method', status: 'REJECTED BY AUDITOR', rationale: 'Rejected due to lack of transparent cost allocation keys and inflated overhead cost pools in offshore entity.' },
    { method: 'Resale Price Method', status: 'REJECTED BY AUDITOR', rationale: 'Inapplicable because Ethiopian entity is a manufacturer, not a reseller of finished goods.' },
    { method: 'Profit Split Method', status: 'REJECTED BY AUDITOR', rationale: 'Inapplicable because Ethiopian entity does not hold unique valuable intangibles or share joint economic risks.' }
  ]);

  // Sub-Page 4 State: Multi-Year Base Erosion & Adjustment Calculations
  const [multiYearAdjustments, setMultiYearAdjustments] = useState([
    { year: 'FY 2020', mauritiusFees: 12000000, swissRoyalties: 7500000, sezUnderpricing: 15000000, proposedDisallowance: 25100000, taxImpact30Pct: 7530000 },
    { year: 'FY 2021', mauritiusFees: 13500000, swissRoyalties: 8000000, sezUnderpricing: 16500000, proposedDisallowance: 27500000, taxImpact30Pct: 8250000 },
    { year: 'FY 2022', mauritiusFees: 15000000, swissRoyalties: 8500000, sezUnderpricing: 18000000, proposedDisallowance: 30000000, taxImpact30Pct: 9000000 },
    { year: 'FY 2023', mauritiusFees: 16500000, swissRoyalties: 9000000, sezUnderpricing: 20000000, proposedDisallowance: 33200000, taxImpact30Pct: 9960000 },
    { year: 'FY 2024', mauritiusFees: 18000000, swissRoyalties: 9500000, sezUnderpricing: 22000000, proposedDisallowance: 36500000, taxImpact30Pct: 10950000 }
  ]);

  // Sub-Page 5 State: Strategy & Committee Sign-Off
  const [hypothesisStatus, setHypothesisStatus] = useState('APPROVED');
  const [leadHypothesisAuditor, setLeadHypothesisAuditor] = useState('Tadesse Mamo (Lead TP Senior Auditor)');

  // Phase 3: Planning & Entry Conference - 5 Sub-Page Stepper State
  const [planningSubPage, setPlanningSubPage] = useState(1);
  const [planObj, setPlanObj] = useState('Verify arm\'s length nature of international related party transactions under Ethiopian Transfer Pricing Directive No. 43/2015.');
  const [planScope, setPlanScope] = useState('FY 2020 - FY 2024 (5 Statutory Taxable Years)');
  const [planMateriality, setPlanMateriality] = useState('5000000');
  const [auditHoursBudget, setAuditHoursBudget] = useState(480);
  const [auditTeamSize, setAuditTeamSize] = useState(4);
  const [industrySector, setIndustrySector] = useState('Textile & Apparel Manufacturing (LTO Division)');
  const [samplingMethod, setSamplingMethod] = useState('STRATIFIED');
  
  // Sub-Page 2 State: Benchmark Ratios & Financial Profiling
  const [benchmarkingRatios, setBenchmarkingRatios] = useState([
    { ratioName: 'EBIT Operating Margin (PLI)', taxpayerActual: '1.50%', sectorBenchmark: '6.40%', variance: '-4.90%', riskLevel: 'CRITICAL', status: 'SEVERE UNDERSTATEMENT' },
    { ratioName: 'Berry Ratio (Gross Margin / Operating Expenses)', taxpayerActual: '1.05', sectorBenchmark: '1.45', variance: '-0.40', riskLevel: 'HIGH', status: 'INSUFFICIENT MARKUP' },
    { ratioName: 'Management Fees / Net Turnover %', taxpayerActual: '4.34%', sectorBenchmark: '1.20%', variance: '+3.14%', riskLevel: 'CRITICAL', status: 'EXCESSIVE EROSION' },
    { ratioName: 'Royalty Expenses / Operating Turnover %', taxpayerActual: '2.45%', sectorBenchmark: '0.50%', variance: '+1.95%', riskLevel: 'HIGH', status: 'UNSUBSTANTIATED IP' }
  ]);

  // Sub-Page 3 State: Entry Conference Logistics & Delegation
  const [meetingDate, setMeetingDate] = useState('2026-09-15');
  const [meetingTime, setMeetingTime] = useState('09:30 AM');
  const [entryConferenceVenue, setEntryConferenceVenue] = useState('Large Taxpayers Office (LTO) Conference Room B-4 / Virtual Teams');
  const [taxpayerDelegation, setTaxpayerDelegation] = useState('CFO, Tax & Legal Vice President, External Tax Counsel (EY Ethiopia)');
  const [committeeDelegation, setCommitteeDelegation] = useState('Abebe Bikila (Chair), Tadesse Mamo (Lead Senior Auditor), Workneh Kassa (Senior Economist)');
  const [meetingAgenda, setMeetingAgenda] = useState('Review statutory audit scope, approve FAR parameters, discuss IDR-01 document requests, and establish taxpayer presentation timeline.');

  // Sub-Page 4 State: IDR-01 Document Request Builder
  const [idrNoticeDays, setIdrNoticeDays] = useState(15);
  const [idrItems, setIdrItems] = useState([
    { id: 1, name: 'Master File & Local File TP Documentation', desc: 'As mandated under Ethiopian Transfer Pricing Directive No. 43/2015 for related party transactions > 500,000 ETB.', checked: true, priority: 'STATUTORY' },
    { id: 2, name: 'Executed Intercompany Contracts & Service Agreements', desc: 'Original signed agreements with foreign related entities defining cost allocation keys and fee calculation formulas.', checked: true, priority: 'CRITICAL' },
    { id: 3, name: 'Benefit Test Deliverables & Activity Timesheets', desc: 'Evidence demonstrating actual economic benefit received in Ethiopia for management & technical assistance fees.', checked: true, priority: 'CRITICAL' },
    { id: 4, name: 'Country-by-Country (CbCR) Reporting Data', desc: 'Global allocation of income, taxes paid, and operating activities across all multinational group tax jurisdictions.', checked: true, priority: 'HIGH' },
    { id: 5, name: 'Transfer Pricing Benchmark Study & Search Strategy', desc: 'Econometric database search strategy (Bureau van Dijk Amadeus/Orbis) for comparable companies.', checked: true, priority: 'HIGH' },
    { id: 6, name: 'Audited Financial Statements of Foreign Associated Enterprise', desc: 'Financial accounts for Mauritius & Switzerland entities for FY 2020 - FY 2024.', checked: true, priority: 'MEDIUM' },
    { id: 7, name: 'Hawassa SEZ Tax-Exemption Certificates & Customs Records', desc: 'Statutory certificates supporting duty-free and tax-free sales to SEZ affiliate.', checked: true, priority: 'HIGH' }
  ]);
  const [newItemText, setNewItemText] = useState('');

  // Sub-Page 5 State: Plan Approval & Document Dispatch
  const [planApprovedBy, setPlanApprovedBy] = useState('Abebe Bikila (Chair - MoR TP Audit Committee)');
  const [planApprovalDecision, setPlanApprovalDecision] = useState('APPROVED');
  const [planComments, setPlanComments] = useState('Approved for full-scope audit execution. Issue IDR-01 to Taxpayer CFO during Entry Conference on September 15, 2026.');

  // Phase 4: Field Work - 5 Sub-Page Stepper State
  const [fieldWorkSubPage, setFieldWorkSubPage] = useState(1);
  const [contractsReviewed, setContractsReviewed] = useState([
    { title: 'Mauritius Master Service Agreement', party: 'Crest Global Services Ltd (Mauritius)', feeFormula: 'Cost + 5% Markup (4.34% of Ethiopian Turnover)', status: 'FAILED BENEFIT TEST' },
    { title: 'Swiss Brand & Trademark License Agreement', party: 'Crest IP Capital Corp (Zurich)', feeFormula: '2.45% Royalty on Gross Sales', status: 'DEMPE SUBSTANCE MISMATCH' },
    { title: 'Hawassa SEZ Intercompany Supply Contract', party: 'Hawassa SEZ Enterprise (Affiliate)', feeFormula: 'Transfer Price at 15% Below Market CUP', status: 'DOMESTIC TAX ARBITRAGE' }
  ]);
  const [gatheredDocuments, setGatheredDocuments] = useState([
    { id: 'DOC-01', name: 'Master File TP Documentation', refNo: 'IDR-01/MF-2024', status: 'VOUCHED_OK', notes: 'Group organization structure verified. 12 offshore subsidiaries identified.' },
    { id: 'DOC-02', name: 'Local File & Segmented P&L Accounts', refNo: 'IDR-01/LF-2024', status: 'VOUCHED_OK', notes: 'Segmented financials for Hawassa SEZ operations reconciled to GL.' },
    { id: 'DOC-03', name: 'Mauritius Management Fee Timesheets & Logs', refNo: 'IDR-01/TS-77', status: 'INSUFFICIENT_EVIDENCE', notes: 'Timesheets fail to demonstrate specific economic benefit to Ethiopian entity.' },
    { id: 'DOC-04', name: 'Customs Valuation Declarations & HS Code Records', refNo: 'IDR-01/CUST-88', status: 'VOUCHED_OK', notes: 'Import unit prices for raw cotton yarn compared against ECC database.' },
    { id: 'DOC-05', name: 'Offshore Foreign Enterprise Audited Accounts', refNo: 'IDR-01/FS-CH', status: 'PENDING_TRANSLATION', notes: 'Swiss entity financial statements submitted in French; official translation requested.' }
  ]);
  const [fieldWorkNotes, setFieldWorkNotes] = useState('On-site review of General Ledger Account #5400 (Management Fees) indicates duplicate billings for regional IT support which was already included in base licensing fee.');
  const [interviewMinutes, setInterviewMinutes] = useState('Interview with Finance Manager confirmed that local staff performed all technical operations without advisory input from Mauritius entity during FY 2023.');
  const [factStatementVersion, setFactStatementVersion] = useState(1);
  const [factStatementStatus, setFactStatementStatus] = useState('DRAFT_RECONCILED');

  // Phase 5: Economic Analysis - 5 Sub-Page Stepper State
  const [analysisSubPage, setAnalysisSubPage] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState('TNMM');
  const [econPliMetric, setEconPliMetric] = useState('Operating Margin (EBIT / Net Turnover)');
  const [iqrMin, setIqrMin] = useState(4.1);
  const [iqrMedian, setIqrMedian] = useState(6.8);
  const [iqrMax, setIqrMax] = useState(9.45);
  const [taxpayerResult, setTaxpayerResult] = useState(1.9);
  const [varianceAmt, setVarianceAmt] = useState(185000000);
  const [customsHsCode, setCustomsHsCode] = useState('5205.12 — Raw Cotton Yarn');
  const [customsPriceDiff, setCustomsPriceDiff] = useState('24.7% Price Over-Invoicing');
  const [comparableCompanies, setComparableCompanies] = useState([
    { bvdId: 'ZA771029', name: 'African Textile Mills Ltd', country: 'South Africa', pli: 7.20, status: 'ACCEPTED' },
    { bvdId: 'KE884012', name: 'Rift Valley Spinners Ltd', country: 'Kenya', pli: 6.85, status: 'ACCEPTED' },
    { bvdId: 'EG109482', name: 'Nile Garment Industries SAE', country: 'Egypt', pli: 8.40, status: 'ACCEPTED' },
    { bvdId: 'MU330192', name: 'Mauritian Fabric Corp', country: 'Mauritius', pli: 5.90, status: 'ACCEPTED' },
    { bvdId: 'NG991024', name: 'Lagos Cotton Processing Ltd', country: 'Nigeria', pli: 4.30, status: 'ACCEPTED' }
  ]);
  const [econMultiYearAdjustments, setEconMultiYearAdjustments] = useState([
    { taxYear: 'FY 2020', reportedMargin: 1.80, medianTarget: 6.80, adjustment: 28400000 },
    { taxYear: 'FY 2021', reportedMargin: 2.10, medianTarget: 6.80, adjustment: 31200000 },
    { taxYear: 'FY 2022', reportedMargin: 1.95, medianTarget: 6.80, adjustment: 36800000 },
    { taxYear: 'FY 2023', reportedMargin: 1.70, medianTarget: 6.80, adjustment: 42500000 },
    { taxYear: 'FY 2024', reportedMargin: 1.90, medianTarget: 6.80, adjustment: 46100000 }
  ]);


  // Phase 6: TP Audit Report - 5 Sub-Page Stepper State
  const [reportSubPage, setReportSubPage] = useState(1);
  const [reportVersion, setReportVersion] = useState(1);
  const [executiveSummary, setExecutiveSummary] = useState('Audit confirms arm\'s length transfer pricing tax adjustment of 152,300,000 ETB across FY 2020-2024 pursuant to Art. 79 of Income Tax Proclamation 979/2016 and TP Directive No. 43/2015.');
  const [legalGrounds, setLegalGrounds] = useState('Income Tax Proclamation No. 979/2016 Article 79 (Transfer Pricing) & MoR Transfer Pricing Directive No. 43/2015 Articles 5, 6, 8, & 12.');
  const [scopePeriod, setScopePeriod] = useState('5 Audited Tax Years (FY 2020 to FY 2024)');
  
  const [reportDisallowances, setReportDisallowances] = useState([
    { id: 'STRM-01', streamName: 'Mauritius Related Party Management Fees', category: 'Management Services', amount: 85000000, disallowancePct: 80, taxImpact: 20400000, justification: 'Failed benefit test under Art. 12; duplicate administrative services.' },
    { id: 'STRM-02', streamName: 'Swiss IP Brand Royalty Licensing Payments', category: 'Intangibles', amount: 42300000, disallowancePct: 100, taxImpact: 12690000, justification: 'No economic ownership or local value creation demonstrated.' },
    { id: 'STRM-03', streamName: 'SEZ Intercompany Raw Cotton Yarn Imports', category: 'Tangible Goods', amount: 25000000, disallowancePct: 100, taxImpact: 7500000, justification: 'Cross-matched against Ethiopian Customs ASYCUDA CUP database (+24.7% over-invoicing).' }
  ]);

  const [reportWorkingPapers, setReportWorkingPapers] = useState([
    { ref: 'WP-01', name: 'Statutory Risk Profiling & Financial Ratio Analysis', status: 'VERIFIED & LOCKED', signoff: 'Tadesse Mamo (Lead Senior Auditor)' },
    { ref: 'WP-02', name: 'Working Hypothesis & Benefit Test Verification Matrix', status: 'VERIFIED & LOCKED', signoff: 'Tadesse Mamo (Lead Senior Auditor)' },
    { ref: 'WP-03', name: 'Entry Conference Minutes & Statutory IDR-01 Ledger Extractions', status: 'VERIFIED & LOCKED', signoff: 'Workneh Kassa (Team Leader)' },
    { ref: 'WP-04', name: 'On-Site Functional (FAR) Analysis & Staff Interview Transcripts', status: 'VERIFIED & LOCKED', signoff: 'Tadesse Mamo (Lead Senior Auditor)' },
    { ref: 'WP-05', name: 'Amadeus / Orbis Pan-African Comparables & IQR Calculation Engine Log', status: 'VERIFIED & LOCKED', signoff: 'Workneh Kassa (Team Leader)' },
    { ref: 'WP-06', name: 'Ethiopian Customs ASYCUDA Reference Price CUP Cross-Matching Matrix', status: 'VERIFIED & LOCKED', signoff: 'Abebe Bikila (Process Owner)' }
  ]);

  const [exitConferenceNotes, setExitConferenceNotes] = useState('Exit conference held with Taxpayer CFO and legal counsel on Aug 28, 2026. Taxpayer disputed management fee disallowance; technical responses recorded in WP-07.');
  
  // Sequential Supervisory Review Gatekeepers State
  const [reportStatus, setReportStatus] = useState('SUBMITTED_TO_TL'); // 'DRAFT', 'SUBMITTED_TO_TL', 'TL_APPROVED', 'PO_APPROVED', 'FINAL_AUTHORIZED'
  const [leadAuditorSignOff, setLeadAuditorSignOff] = useState({ name: 'Tadesse Mamo', title: 'Lead TP Senior Auditor', date: '2026-08-30 14:15', status: 'APPROVED', comments: 'Audit report complete and fully supported by working papers WP-01 to WP-06.' });
  const [teamLeaderSignOff, setTeamLeaderSignOff] = useState({ name: 'Workneh Kassa', title: 'TP Audit Team Leader', date: '2026-09-01 09:30', status: 'APPROVED', comments: 'Supervisory review completed. Technical calculations and legal citations verified.' });
  const [processOwnerSignOff, setProcessOwnerSignOff] = useState({ name: 'Abebe Bikila', title: 'LTO Audit Process Owner', date: '2026-09-02 16:45', status: 'APPROVED', comments: 'Final executive review approved. Proceed to Formal Assessment Notice generation.' });

  // Phase 7: Assessment Calculation State Engine - 5 Sub-Page Stepper State
  const [assessmentSubPage, setAssessmentSubPage] = useState(1);
  const [taxAdjustment, setTaxAdjustment] = useState(152300000);
  const [citRatePct, setCitRatePct] = useState(30);
  const [penaltyRatePct, setPenaltyRatePct] = useState(20); // Statutory Art. 108 (20% for substantial understatement)
  const [interestRatePct, setInterestRatePct] = useState(15); // Statutory Art. 110 (15% per annum compounding)
  const [assessmentYears, setAssessmentYears] = useState([
    { year: 'FY 2020', adjustment: 28400000, citTax: 8520000, penalty: 1704000, interest: 1533600, total: 11757600 },
    { year: 'FY 2021', adjustment: 31200000, citTax: 9360000, penalty: 1872000, interest: 1404000, total: 12636000 },
    { year: 'FY 2022', adjustment: 36800000, citTax: 11040000, penalty: 2208000, interest: 1324800, total: 14572800 },
    { year: 'FY 2023', adjustment: 42500000, citTax: 12750000, penalty: 2550000, interest: 1147500, total: 16447500 },
    { year: 'FY 2024', adjustment: 46100000, citTax: 13830000, penalty: 2766000, interest: 829800, total: 17425800 }
  ]);
  const [penaltyReasoning, setPenaltyReasoning] = useState('Substantial tax understatement under Income Tax Proclamation No. 979/2016 Article 108. Disallowed unarm\'s length payments exceeding 25% of reported tax liability.');
  const [interestCalculationBasis, setInterestCalculationBasis] = useState('Commercial Bank of Ethiopia (CBE) prevailing lending rate + 3% statutory margin pursuant to Art. 110.');
  const [assessmentStatus, setAssessmentStatus] = useState('CALCULATED');

  // Phase 8: Notice Generation & Statutory Objections - 5 Sub-Page Stepper State
  const [noticeSubPage, setNoticeSubPage] = useState(1);
  const [noticeReferenceId, setNoticeReferenceId] = useState('MoR/LTO/TP-NTC/2026/0411');
  const [objectionWindowDays, setObjectionWindowDays] = useState(30);
  const [noticeDispatchDate, setNoticeDispatchDate] = useState('2026-09-03');
  const [objectionFilingDeadline, setObjectionFilingDeadline] = useState('2026-10-03');
  const [taxpayerObjectionStatus, setTaxpayerObjectionStatus] = useState('LODGED'); // 'PENDING', 'LODGED', 'REBUTTED', 'SETTLED'
  const [taxpayerObjectionGrounds, setTaxpayerObjectionGrounds] = useState('Taxpayer contends that Mauritius management fees represent genuine technical assistance and disputed the 80% disallowance rate under Article 12.');
  const [auditorRebuttalGrounds, setAuditorRebuttalGrounds] = useState('Rebuttal confirmed: Taxpayer failed to provide contemporaneous timesheets or proof of economic benefit under MoR TP Directive No. 43/2015 Art. 12.');
  const [fraudEscalationStatus, setFraudEscalationStatus] = useState('REFERRAL_RECOMMENDED'); // 'NONE', 'REFERRAL_RECOMMENDED', 'ESCALATED'
  const [fraudReferralNotes, setFraudReferralNotes] = useState('Case flagged for potential referral to Tax Fraud & Criminal Investigation Division due to systematic profit stripping via Mauritius offshore accounts.');

  // Phase 9: Case Completion & Appeals - 5 Sub-Page Stepper State
  const [completionSubPage, setCompletionSubPage] = useState(1);
  const [agreedSettlementAmount, setAgreedSettlementAmount] = useState(59397000); // Negotiated compromise settlement (Base + Partial Penalty/Interest)
  const [arcStatus, setArcStatus] = useState('CONFIRMED'); // Administrative Review Committee settlement status
  const [taxAppealStatus, setTaxAppealStatus] = useState('NOT_APPEALED');
  const [sigtasReceiptNo, setSigtasReceiptNo] = useState('REC-2026-99042');
  const [sigtasPaymentDate, setSigtasPaymentDate] = useState('2026-09-02');
  const [archivalHash, setArchivalHash] = useState('SHA256:8f9b2c01e54a32d18471c99021e84a920b78491c');

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
      {/* Top Workspace Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold rounded-full dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50">
                TRANSFER PRICING AUDIT WORKBENCH
              </span>
              <span className="text-xs text-slate-500 font-mono">Case #{caseData?.caseNumber || '2026-TP-AA-0207'}</span>
              <Badge color="purple" dot className="font-mono">ASSIGNED BY TEAM LEADER</Badge>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {caseData?.taxpayerName || 'Crest Textiles SC'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              TIN: <span className="font-semibold text-slate-800 dark:text-slate-200">{caseData?.tin || 'ETH030999'}</span> | Sector: <span className="font-semibold text-slate-800 dark:text-slate-200">{caseData?.sector || 'Textile Manufacturing'}</span> | Office: <span className="font-semibold text-slate-800 dark:text-slate-200">Addis Ababa LTO</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="secondary" 
              size="sm" 
              icon={UserCheck} 
              className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800"
              onClick={() => setShowAssignmentModal(true)}
            >
              Case Assignment Charter
            </Button>
            {onRefresh && (
              <Button variant="secondary" size="sm" icon={RefreshCw} onClick={onRefresh}>
                Refresh Data
              </Button>
            )}
            {onClose && (
              <Button variant="secondary" size="sm" icon={X} onClick={onClose}>
                Close Workbench
              </Button>
            )}
          </div>
        </div>

        {/* Case Assignment Charter Modal / Card Overlay */}
        {showAssignmentModal && (
          <div className="mt-4 p-5 bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 text-white rounded-xl border border-purple-800/50 shadow-2xl space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-purple-800/40 pb-3">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  MoR TP Audit Case Assignment & Delegation Charter
                </h3>
              </div>
              <Button variant="secondary" size="sm" icon={X} onClick={() => setShowAssignmentModal(false)} className="text-white hover:bg-purple-900/50">Close Charter</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1.5 p-3 bg-purple-900/30 rounded-lg border border-purple-700/40">
                <p className="text-[10px] text-purple-300 font-bold uppercase">Assigning Supervisor:</p>
                <p className="font-bold text-white">{caseAssignment.assignedBy}</p>
                <p className="text-[10px] text-slate-400">Assigned: {caseAssignment.assignedDate}</p>
              </div>

              <div className="space-y-1.5 p-3 bg-blue-900/30 rounded-lg border border-blue-700/40">
                <p className="text-[10px] text-blue-300 font-bold uppercase">Lead Senior Auditor (Primary Assignee):</p>
                <p className="font-bold text-white">{caseAssignment.assignedTo}</p>
                <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Accepted: {caseAssignment.acceptanceDate}
                </p>
              </div>

              <div className="space-y-1.5 p-3 bg-amber-900/30 rounded-lg border border-amber-700/40">
                <p className="text-[10px] text-amber-300 font-bold uppercase">Statutory SLA & Deadline:</p>
                <p className="font-bold text-amber-400 font-mono">{caseAssignment.statutoryDeadline}</p>
                <p className="text-[10px] text-slate-400">Budgeted Audit Time: {caseAssignment.allocatedHours} Hours</p>
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs space-y-1">
              <p className="font-bold text-purple-300 uppercase">Team Leader Audit Mandate & Assignment Instructions:</p>
              <p className="text-slate-300 italic">{caseAssignment.mandateReason}</p>
            </div>

            <div className="pt-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Multidisciplinary Audit Team Composition:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {caseAssignment.teamMembers.map((member, i) => (
                  <div key={i} className="p-2 bg-slate-800/80 rounded border border-slate-700">
                    <p className="font-bold text-white truncate">{member.name}</p>
                    <p className="text-[10px] text-purple-300">{member.role}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">{member.allocation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Container Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm w-full flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">

        {/* Main Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {msg && (
            <Alert type={msg.type === 'error' ? 'error' : 'success'} title={msg.text} />
          )}

          {/* Phase 1: Risk Assessment - Enterprise 5-Page Auditor Workbench */}
          {activeTab === 'DETAILED_RISK_ASSESSMENT' && (
            <div className="space-y-6">
              {/* 1. Taxpayer Profile & Sub-Page Navigation Banner */}
              <Card className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <Badge color="blue" size="sm">TP RISK MATRIX v4.2</Badge>
                      <Badge color="red" dot size="sm">CRITICAL RISK ({caseData?.riskScore || 118}/150)</Badge>
                      <span className="text-xs text-slate-400 font-mono">Directive No. 43/2015</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-0.5">
                      Step 1: Detailed Risk Assessment Execution Process
                    </h2>
                    <p className="text-xs text-slate-500">
                      Multi-dimensional statutory risk investigation, financial trend analysis, controlled transaction matching & tax base erosion simulation.
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/60 p-4 rounded-xl border border-slate-200 dark:border-slate-600 text-right">
                    <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400">Total Tax Revenue at Risk</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {formatRevenue((((parseFloat(fy2022Adj) || 0) + (parseFloat(fy2023Adj) || 0) + (parseFloat(fy2024Adj) || 0)) * 0.30) * (1 + (parseFloat(penaltyRatePct) + parseFloat(interestRatePct)) / 100))} ETB
                    </p>
                  </div>
                </div>

                {/* Sub-Page Stepper Navigation Bar */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80">
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide">
                      Sub-Page Navigation (Step {riskSubPage} of 5)
                    </span>
                    <span className="text-slate-500 font-medium">Workflow Progress: {riskSubPage * 20}% Completed</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-4 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${riskSubPage * 20}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {[
                      { num: 1, label: '1. Profiling & Register' },
                      { num: 2, label: '2. Risk Engine & Analytics' },
                      { num: 3, label: '3. Risk Questionnaire' },
                      { num: 4, label: '4. Base Erosion Simulator' },
                      { num: 5, label: '5. Scope & Pre-Audit Report' }
                    ].map(page => (
                      <button
                        key={page.num}
                        onClick={() => setRiskSubPage(page.num)}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all text-left flex items-center gap-2 border ${
                          riskSubPage === page.num
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold flex-shrink-0 ${
                          riskSubPage === page.num ? 'bg-white text-blue-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {page.num}
                        </span>
                        <span className="truncate">{page.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              {/* ───────────────────────────────────────────────────────────── */}
              {/* SUB-PAGE 1: Taxpayer Identification & Financial / Transaction Profiling */}
              {/* ───────────────────────────────────────────────────────────── */}
              {riskSubPage === 1 && (
                <div className="space-y-6">
                  {/* Entity Context Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card accent="blue" className="p-4 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ultimate Parent Entity</p>
                      <p className="text-base font-bold text-slate-900 dark:text-white">Crest Global Group Holding Ltd</p>
                      <p className="text-xs text-slate-500">Jurisdiction: <span className="font-semibold text-blue-600">Mauritius</span> • DTA WHT Rate: <span className="font-mono font-semibold">5.0%</span></p>
                    </Card>

                    <Card accent="indigo" className="p-4 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Local Ethiopian Enterprise</p>
                      <p className="text-base font-bold text-slate-900 dark:text-white">Crest Textiles SC</p>
                      <p className="text-xs text-slate-500">Ownership: <span className="font-semibold text-slate-800 dark:text-slate-200">99.8% Foreign Owned</span></p>
                    </Card>

                    <Card accent="green" className="p-4 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Filing & Compliance Status</p>
                      <div className="flex items-center gap-2 pt-0.5">
                        <Badge color="red" size="sm">Schedule 5 Deficient</Badge>
                        <Badge color="green" size="sm">CbCR Filed</Badge>
                      </div>
                      <p className="text-xs text-slate-500 pt-0.5">Ethiopian TP Directive No. 43/2015</p>
                    </Card>
                  </div>

                  {/* Multi-Year Audited Financial History */}
                  <Card padding={false} className="overflow-hidden">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <BarChart2 className="w-4 h-4 text-blue-600" />
                          Multi-Year Audited Financial Overview ({historyWindowMode === '5_YEAR' ? 'FY 2020 - FY 2024' : 'FY 2015 - FY 2024'})
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Performance extracted from audited financial statements & Ethiopian Tax Authority returns</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-slate-100 dark:bg-slate-700/60 p-1 rounded-lg border border-slate-200 dark:border-slate-600">
                          <button
                            type="button"
                            onClick={() => setHistoryWindowMode('5_YEAR')}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                              historyWindowMode === '5_YEAR'
                                ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm font-bold'
                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                            }`}
                          >
                            5-Yr Statutory Window
                          </button>
                          <button
                            type="button"
                            onClick={() => setHistoryWindowMode('10_YEAR')}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                              historyWindowMode === '10_YEAR'
                                ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm font-bold'
                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                            }`}
                          >
                            10-Yr Extended Window (Art. 47)
                          </button>
                        </div>
                        <Badge color="red" dot size="sm">Profit Erosion Anomaly</Badge>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 dark:bg-slate-700/80 border-b border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 font-semibold uppercase">
                          <tr>
                            <th className="px-4 py-3">Taxable Year</th>
                            <th className="px-4 py-3 text-right">Gross Turnover (ETB)</th>
                            <th className="px-4 py-3 text-right">Gross Margin %</th>
                            <th className="px-4 py-3 text-right">Operating EBIT %</th>
                            <th className="px-4 py-3 text-right">Declared Net Profit / Loss (ETB)</th>
                            <th className="px-4 py-3 text-right">CIT Paid (ETB)</th>
                            <th className="px-4 py-3 text-center">Monthly Breakdown</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {auditedFinancials.map((fin, idx) => (
                            <tr key={idx} className="hover:bg-blue-50/40 dark:hover:bg-slate-700/50">
                              <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white font-mono">{fin.year}</td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-slate-800 dark:text-slate-200">{formatRevenue(fin.turnover)}</td>
                              <td className="px-4 py-3 text-right font-mono">{fin.grossMargin}%</td>
                              <td className="px-4 py-3 text-right font-mono text-amber-600 font-bold">{fin.ebit}%</td>
                              <td className={`px-4 py-3 text-right font-mono font-bold ${fin.netProfit < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                {formatRevenue(fin.netProfit)}
                              </td>
                              <td className="px-4 py-3 text-right font-mono text-slate-500">{formatRevenue(fin.taxPaid)}</td>
                              <td className="px-4 py-3 text-center">
                                <Button
                                  variant="secondary"
                                  className="text-[10px] px-2.5 py-1"
                                  onClick={() => setSelectedYearBreakdown(fin.year)}
                                >
                                  Inspect 12-Month Data
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Monthly Breakdown Modal Drawer */}
                    {selectedYearBreakdown && (
                      <div className="p-4 bg-blue-50/60 dark:bg-slate-800/80 border-t border-blue-200 dark:border-slate-700 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            Monthly & Quarterly Financial Breakdown for {selectedYearBreakdown} (12 Tax Periods)
                          </h4>
                          <Button
                            variant="secondary"
                            icon={X}
                            className="text-[10px] px-2 py-0.5"
                            onClick={() => setSelectedYearBreakdown(null)}
                          >
                            Close Breakdown
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          {['Q1 (Jul-Sep)', 'Q2 (Oct-Dec)', 'Q3 (Jan-Mar)', 'Q4 (Apr-Jun)'].map((q, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                              <p className="font-bold text-blue-600 text-[11px]">{q}</p>
                              <p className="text-[10px] text-slate-500">Gross Sales: <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{(120 + i*15).toFixed(1)}M ETB</span></p>
                              <p className="text-[10px] text-slate-500">Intercompany Fees: <span className="font-mono font-bold text-red-500">{(18 + i*6).toFixed(1)}M ETB</span></p>
                              <p className="text-[10px] text-slate-500">Quarter EBIT: <span className="font-mono font-semibold text-amber-600">{(1.6 - i*0.2).toFixed(1)}%</span></p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>

                  {/* Controlled Related Party Transactions Table (Domestic + International) */}
                  <Card padding={false} className="overflow-hidden">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-blue-600" />
                          Register of Controlled Related Party Transactions (Domestic & International)
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Cross-border MNE intercompany flows & domestic SEZ affiliate transactions (MoR Directive No. 43/2015 & Schedule 5)</p>
                      </div>
                      <Badge color="orange" dot size="sm">6 Intercompany Streams Registered</Badge>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 dark:bg-slate-700/80 border-b border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 font-semibold uppercase">
                          <tr>
                            <th className="px-4 py-3">Scope / Scope Type</th>
                            <th className="px-4 py-3">Stream / Transaction Type</th>
                            <th className="px-4 py-3">Related Counterparty Enterprise</th>
                            <th className="px-4 py-3">Tax Jurisdiction & Regime</th>
                            <th className="px-4 py-3 text-right">Aggregated Volume (ETB)</th>
                            <th className="px-4 py-3">Tested Method</th>
                            <th className="px-4 py-3 text-center">Risk Rating</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {controlledTransactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-700/50">
                              <td className="px-4 py-3">
                                <Badge color={tx.type === 'INTERNATIONAL' ? 'blue' : 'purple'} size="sm">
                                  {tx.type === 'INTERNATIONAL' ? 'CROSS-BORDER' : 'DOMESTIC / SEZ'}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{tx.stream}</td>
                              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{tx.foreignEntity}</td>
                              <td className="px-4 py-3 font-semibold text-blue-600">{tx.jurisdiction}</td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">{formatRevenue(tx.totalValue)} ETB</td>
                              <td className="px-4 py-3"><Badge color="amber" size="sm">{tx.method}</Badge></td>
                              <td className="px-4 py-3 text-center">
                                <Badge color={tx.riskFlag === 'CRITICAL' ? 'red' : tx.riskFlag === 'HIGH' ? 'orange' : 'blue'} dot size="sm">
                                  {tx.riskFlag}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                      <p className="text-xs text-slate-500">
                        <span className="font-semibold text-blue-600">Verification Note:</span> 4 cross-border streams involve low-tax offshore jurisdictions; 2 domestic streams involve tax-exempt Hawassa Industrial Park SEZ affiliates.
                      </p>
                      <Button
                        variant="primary"
                        icon={ChevronRight}
                        onClick={() => setRiskSubPage(2)}
                      >
                        Proceed to Sub-Page 2: Risk Engine & Analytics
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* SUB-PAGE 2: Automated Risk Engine & Anomaly Analytics */}
              {/* ───────────────────────────────────────────────────────────── */}
              {riskSubPage === 2 && (
                <div className="space-y-6">
                  {/* Automated Risk Engine Overview Card */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card accent="red" className="p-4 space-y-1 col-span-2">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Automated Risk Scoring & Anomaly Analytics Engine</h3>
                      </div>
                      <p className="text-xs text-slate-500">
                        Evaluated against 10 statutory MoR Transfer Pricing Risk Indicators under Directive No. 43/2015 & OECD Guidelines.
                      </p>
                    </Card>

                    <Card accent="amber" className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Overall Risk Score</p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400 font-mono">118 / 150</p>
                        <p className="text-xs text-slate-400">3 Critical Anomaly Alerts</p>
                      </div>
                      <Badge color="red" dot size="sm">CRITICAL TIER</Badge>
                    </Card>
                  </div>

                  {/* 10 Risk Indicators Grid */}
                  <Card className="p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          Evaluated MoR & OECD Transfer Pricing Risk Indicators
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Auditor-verified rule matches & anomaly detections</p>
                      </div>
                      <Badge color="red" dot size="sm">10 Indicators Evaluated</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {riskIndicators.map((ind) => (
                        <div 
                          key={ind.id} 
                          className={`p-4 rounded-xl border transition-all ${
                            ind.status === 'CRITICAL' 
                              ? 'bg-red-50/50 dark:bg-red-950/20 border-l-4 border-l-red-500 border-red-200 dark:border-red-800/60' 
                              : ind.status === 'HIGH'
                              ? 'bg-amber-50/50 dark:bg-amber-950/20 border-l-4 border-l-amber-500 border-amber-200 dark:border-amber-800/60'
                              : 'bg-slate-50 dark:bg-slate-800/40 border-l-4 border-l-blue-400 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{ind.category}</span>
                            <Badge color={ind.status === 'CRITICAL' ? 'red' : ind.status === 'HIGH' ? 'yellow' : 'blue'} dot size="sm">
                              {ind.status} (+{ind.weight} pts)
                            </Badge>
                          </div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white">{ind.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{ind.detail}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Customs Valuation Cross-Matching Table */}
                  <Card padding={false} className="overflow-hidden">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Layers className="w-4 h-4 text-blue-600" />
                          Customs Valuation Database Cross-Matching (Import Price Analytics)
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Cross-checking declared import prices against Ethiopian Customs Commission Pricing DB</p>
                      </div>
                      <Badge color="yellow" dot size="sm">2 Import Price Inflations</Badge>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 dark:bg-slate-700/80 border-b border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 font-semibold uppercase">
                          <tr>
                            <th className="px-4 py-3">HS Tariff Code</th>
                            <th className="px-4 py-3">Item Description</th>
                            <th className="px-4 py-3 text-right">Declared Price (ETB)</th>
                            <th className="px-4 py-3 text-right">Customs Benchmark</th>
                            <th className="px-4 py-3 text-right">Variance %</th>
                            <th className="px-4 py-3 text-center">Finding</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {customsMatches.map((item, idx) => (
                            <tr key={idx} className="hover:bg-blue-50/40 dark:hover:bg-slate-700/50">
                              <td className="px-4 py-3 font-mono font-bold text-blue-600">{item.hsCode}</td>
                              <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{item.itemDesc}</td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-red-600">{item.taxpayerUnitPrice?.toFixed(2) ?? '0.00'} ETB</td>
                              <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-300">{item.customsBenchmarkPrice?.toFixed(2) ?? '0.00'} ETB</td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-amber-600">+{item.variancePct}%</td>
                              <td className="px-4 py-3 text-center"><Badge color="red" size="sm">{item.status}</Badge></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                      <Button
                        variant="secondary"
                        onClick={() => setRiskSubPage(1)}
                      >
                        ← Back to Sub-Page 1
                      </Button>
                      <Button
                        variant="primary"
                        icon={ChevronRight}
                        onClick={() => setRiskSubPage(3)}
                      >
                        Proceed to Sub-Page 3: Risk Questionnaire
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* SUB-PAGE 3: Risk Matrix Questionnaire & Category Analysis */}
              {/* ───────────────────────────────────────────────────────────── */}
              {riskSubPage === 3 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-blue-600" />
                          Statutory 5-Category Transfer Pricing Risk Assessment Questionnaire
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Required under MoR TP Examination Manual (Form TP-FR-01.1)</p>
                      </div>
                      <Badge color="blue" dot size="sm">5 Categories Evaluated</Badge>
                    </div>

                    <div className="space-y-6">
                      {riskCategories.map((cat, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                              Category {idx + 1}: {cat.categoryName}
                            </span>
                            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                              <input 
                                type="checkbox"
                                checked={cat.riskIdentified}
                                onChange={(e) => {
                                  const updated = [...riskCategories];
                                  updated[idx].riskIdentified = e.target.checked;
                                  setRiskCategories(updated);
                                }}
                                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                              />
                              <span className={cat.riskIdentified ? 'text-red-600 font-bold' : 'text-slate-500'}>
                                {cat.riskIdentified ? 'RISK IDENTIFIED' : 'NO MATERIAL RISK'}
                              </span>
                            </label>
                          </div>

                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{cat.question}</p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="col-span-2">
                              <Textarea
                                label="Auditor Findings & Technical Observation"
                                rows={2}
                                value={cat.response}
                                onChange={(e) => {
                                  const updated = [...riskCategories];
                                  updated[idx].response = e.target.value;
                                  setRiskCategories(updated);
                                }}
                                className="text-xs"
                              />
                            </div>
                            <div>
                              <Input
                                label="Evidence Reference File / Attachment"
                                value={cat.evidenceReference}
                                onChange={(e) => {
                                  const updated = [...riskCategories];
                                  updated[idx].evidenceReference = e.target.value;
                                  setRiskCategories(updated);
                                }}
                                className="text-xs font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                      <Button
                        variant="secondary"
                        onClick={() => setRiskSubPage(2)}
                      >
                        ← Back to Sub-Page 2
                      </Button>
                      <Button
                        variant="primary"
                        icon={ChevronRight}
                        onClick={() => setRiskSubPage(4)}
                      >
                        Proceed to Sub-Page 4: Base Erosion Simulator
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* SUB-PAGE 4: Revenue-at-Risk & Tax Base Erosion Simulator */}
              {/* ───────────────────────────────────────────────────────────── */}
              {riskSubPage === 4 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Calculator className="w-4 h-4 text-blue-600" />
                          Multi-Year Tax Base Erosion & Tax Revenue at Risk Simulator
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Calculate potential profit additions, corporate tax (30%), statutory penalties and late interest</p>
                      </div>
                      <Badge color="green" dot size="sm">STATUTORY RATE: 30% CIT</Badge>
                    </div>

                    {/* Multi-Year Base Adjustment Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Input
                        label="FY 2022 Disallowance / Profit Addition (ETB)"
                        type="number"
                        value={fy2022Adj}
                        onChange={(e) => setFy2022Adj(e.target.value)}
                        className="font-mono text-blue-600 font-bold"
                      />
                      <Input
                        label="FY 2023 Disallowance / Profit Addition (ETB)"
                        type="number"
                        value={fy2023Adj}
                        onChange={(e) => setFy2023Adj(e.target.value)}
                        className="font-mono text-blue-600 font-bold"
                      />
                      <Input
                        label="FY 2024 Disallowance / Profit Addition (ETB)"
                        type="number"
                        value={fy2024Adj}
                        onChange={(e) => setFy2024Adj(e.target.value)}
                        className="font-mono text-blue-600 font-bold"
                      />
                    </div>

                    {/* Statutory Penalty & Interest Rate Sliders/Selects */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                      <Select
                        label="Statutory Tax Penalty Rate (Art. 108)"
                        value={riskPenaltyRatePct}
                        onChange={(e) => setRiskPenaltyRatePct(e.target.value)}
                        options={[
                          { value: '20', label: '20% Standard Understatement Penalty' },
                          { value: '30', label: '30% Substantial Negligence Penalty' },
                          { value: '50', label: '50% Severe Tax Evasion Penalty' }
                        ]}
                      />
                      <Input
                        label="Accumulated Interest Rate % (Art. 110)"
                        type="number"
                        value={riskInterestRatePct}
                        onChange={(e) => setRiskInterestRatePct(e.target.value)}
                        className="font-mono"
                      />
                    </div>

                    {/* Automated Tax Calculation Results Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                      <Card accent="blue" className="p-4 space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Base Adjustment</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                          {formatRevenue((parseFloat(fy2022Adj) || 0) + (parseFloat(fy2023Adj) || 0) + (parseFloat(fy2024Adj) || 0))} ETB
                        </p>
                      </Card>

                      <Card accent="indigo" className="p-4 space-y-1">
                        <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Assessed Tax (30% CIT)</p>
                        <p className="text-lg font-bold text-indigo-700 dark:text-indigo-300 font-mono">
                          {formatRevenue((((parseFloat(fy2022Adj) || 0) + (parseFloat(fy2023Adj) || 0) + (parseFloat(fy2024Adj) || 0)) * 0.30))} ETB
                        </p>
                      </Card>

                      <Card accent="amber" className="p-4 space-y-1">
                        <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Penalties & Interest ({riskPenaltyRatePct}% + {riskInterestRatePct}%)</p>
                        <p className="text-lg font-bold text-amber-700 dark:text-amber-300 font-mono">
                          {formatRevenue(((((parseFloat(fy2022Adj) || 0) + (parseFloat(fy2023Adj) || 0) + (parseFloat(fy2024Adj) || 0)) * 0.30) * (parseFloat(riskPenaltyRatePct) + parseFloat(riskInterestRatePct)) / 100))} ETB
                        </p>
                      </Card>

                      <Card accent="green" className="p-4 space-y-1 bg-emerald-50/50 dark:bg-emerald-950/30">
                        <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Total Net Revenue at Risk</p>
                        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                          {formatRevenue((((parseFloat(fy2022Adj) || 0) + (parseFloat(fy2023Adj) || 0) + (parseFloat(fy2024Adj) || 0)) * 0.30) * (1 + (parseFloat(riskPenaltyRatePct) + parseFloat(riskInterestRatePct)) / 100))} ETB
                        </p>
                      </Card>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                      <Button
                        variant="secondary"
                        onClick={() => setRiskSubPage(3)}
                      >
                        ← Back to Sub-Page 3
                      </Button>
                      <Button
                        variant="primary"
                        icon={ChevronRight}
                        onClick={() => {
                          const total = (((parseFloat(fy2022Adj) || 0) + (parseFloat(fy2023Adj) || 0) + (parseFloat(fy2024Adj) || 0)) * 0.30) * (1 + (parseFloat(penaltyRatePct) + parseFloat(interestRatePct)) / 100);
                          setRevenueAtRisk(total);
                          setRiskSubPage(5);
                        }}
                      >
                        Proceed to Sub-Page 5: Scope & Pre-Audit Report
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* SUB-PAGE 5: Audit Scope Recommendation & Risk Assessment Approval */}
              {/* ───────────────────────────────────────────────────────────── */}
              {riskSubPage === 5 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                          Formal Audit Scope Recommendation & Supervisory Committee Approval
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Finalize step 1 risk assessment classification, audit path decision, and formal pre-audit report</p>
                      </div>
                      <Badge color="red" dot size="sm">READY FOR SIGN-OFF</Badge>
                    </div>

                    {/* Audit Decision Selection Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Select
                        label="Formal Audit Selection Decision"
                        value={selectedAuditPath}
                        onChange={(e) => setSelectedAuditPath(e.target.value)}
                        options={[
                          { value: 'FULL_SCOPE_AUDIT', label: 'Priority 1 — Full Scope Cross-Border Transfer Pricing Audit' },
                          { value: 'FOCUSED_ISSUE_AUDIT', label: 'Priority 2 — Targeted Issue Audit (Management Fees Only)' },
                          { value: 'DOCUMENTATION_REVIEW', label: 'Priority 3 — Statutory TP Documentation Verification' },
                          { value: 'DISMISSAL', label: 'Dismiss Case — No Material Risk Identified' }
                        ]}
                      />

                      <Select
                        label="Assessed Formal Risk Level"
                        value={riskLevel}
                        onChange={(e) => setRiskLevel(e.target.value)}
                        options={[
                          { value: 'CRITICAL', label: 'CRITICAL — Critical Risk (> 100 Risk Score)' },
                          { value: 'HIGH', label: 'HIGH — High Profit Erosion Risk' },
                          { value: 'MEDIUM', label: 'MEDIUM — Moderate Risk' }
                        ]}
                      />
                    </div>

                    {/* Lead Auditor Strategy Textarea */}
                    <Textarea
                      label="Lead Auditor Technical Audit Strategy & Issue Scope Rationale"
                      rows={4}
                      value={leadAuditorStrategy}
                      onChange={(e) => setLeadAuditorStrategy(e.target.value)}
                      placeholder="Specify rationale for audit selection, targeted intercompany accounts, and team deployment..."
                    />

                    {/* Supervisory Committee Sign-Off Block */}
                    <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 space-y-4">
                      <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-blue-600" />
                        TP Supervisory Audit Committee Review & Approval Sign-Off
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Committee Chair Representative"
                          value={committeeChair}
                          onChange={(e) => setCommitteeChair(e.target.value)}
                          className="text-xs font-semibold"
                        />
                        <Select
                          label="Committee Approval Decision"
                          value={committeeApprovalStatus}
                          onChange={(e) => setCommitteeApprovalStatus(e.target.value)}
                          options={[
                            { value: 'APPROVED', label: 'APPROVED — Proceed to Phase 2 (Working Hypothesis)' },
                            { value: 'REVISION_REQUESTED', label: 'REVISION REQUESTED — Additional Findings Needed' },
                            { value: 'REJECTED', label: 'REJECTED — Reject Audit Proposal' }
                          ]}
                        />
                      </div>
                    </div>

                    {/* Pre-Audit Report Generation Preview Button */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div>
                        <p className="font-bold text-xs text-slate-900 dark:text-white">Pre-Audit Formal Risk Assessment Report (Form TP-FR-01.1)</p>
                        <p className="text-[11px] text-slate-500">Generate printable statutory risk assessment document for case file</p>
                      </div>
                      <Button
                        variant="secondary"
                        icon={FileText}
                        onClick={() => setShowReportPreview(!showReportPreview)}
                      >
                        {showReportPreview ? 'Hide Report Preview' : 'Preview Statutory Report'}
                      </Button>
                    </div>

                    {/* Formal Statutory Report Preview Drawer */}
                    {showReportPreview && (
                      <div className="p-6 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-800 rounded-xl space-y-4 font-serif">
                        <div className="text-center border-b pb-4 space-y-1">
                          <h4 className="font-bold uppercase tracking-wider text-base text-blue-950 dark:text-blue-300">
                            ETHIOPIAN MINISTRY OF REVENUE — TRANSFER PRICING DIVISION
                          </h4>
                          <p className="text-xs uppercase font-sans text-slate-500">FORM TP-FR-01.1 — FORMAL RISK ASSESSMENT & AUDIT SELECTION REPORT</p>
                        </div>
                        <div className="grid grid-cols-2 text-xs font-sans gap-2">
                          <p><strong>Taxpayer Name:</strong> {caseData?.taxpayerName || 'Crest Textiles SC'}</p>
                          <p><strong>TIN:</strong> {caseData?.tin || 'ETH030999'}</p>
                          <p><strong>Assessed Risk Score:</strong> 118 / 150 (CRITICAL)</p>
                          <p><strong>Revenue at Risk:</strong> {formatRevenue(revenueAtRisk)} ETB</p>
                          <p><strong>Audit Path:</strong> {selectedAuditPath}</p>
                          <p><strong>Approved By:</strong> {committeeChair}</p>
                        </div>
                        <div className="text-xs font-sans pt-2 border-t text-slate-600 dark:text-slate-400">
                          <p><strong>Auditor Strategy:</strong> {leadAuditorStrategy}</p>
                        </div>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                      <Button
                        variant="secondary"
                        onClick={() => setRiskSubPage(4)}
                      >
                        ← Back to Sub-Page 4
                      </Button>
                      <Button 
                        variant="primary" 
                        icon={Send} 
                        loading={loading}
                        onClick={() => handlePost(
                          '/risk-assessment', 
                          { 
                            riskLevel, 
                            riskDetails: {
                              subPageCompleted: 5,
                              riskScore: 118,
                              auditPath: selectedAuditPath,
                              auditedFinancials,
                              controlledTransactions,
                              riskIndicators,
                              customsMatches,
                              riskCategories,
                              revenueAtRisk: parseFloat(revenueAtRisk),
                              committeeChair,
                              committeeApprovalStatus
                            }, 
                            comments: leadAuditorStrategy, 
                            revenueAtRisk: parseFloat(revenueAtRisk) 
                          }, 
                          'Step 1 (Risk Assessment) 5-Page Process Completed & Saved! Ready to proceed to Step 2 (Working Hypothesis).'
                        )}
                      >
                        Save & Finalize Step 1 Process
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Phase 2: Working Hypothesis - Enterprise Issue Framing & 5-Sub-Page Process Engine */}
          {activeTab === 'WORKING_HYPOTHESIS' && (
            <div className="space-y-6">
              {/* 1. Header Context & 5-Sub-Page Stepper */}
              <Card className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <Badge color="purple" size="sm">PHASE 2: HYPOTHESIS FORMULATION</Badge>
                      <Badge color="blue" size="sm">MoR DIRECTIVE NO. 43/2015</Badge>
                      <span className="text-xs text-slate-400 font-mono">OECD Action 8-10 Compliant</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-0.5">
                      Step 2: Working Hypothesis & Transfer Pricing Issue Framing Process
                    </h2>
                    <p className="text-xs text-slate-500">
                      Formulate testable audit hypotheses, evaluate OECD Benefit Tests, establish DEMPE functional ownership, and model base erosion revenue-at-risk.
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/60 p-4 rounded-xl border border-slate-200 dark:border-slate-600 text-right">
                    <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400">Phase 2 Revenue-at-Risk</p>
                    <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                      {formatRevenue(revenueAtRisk)} <span className="text-xs font-normal">ETB</span>
                    </p>
                  </div>
                </div>

                {/* Sub-Page Navigation Stepper Tabs (Sub-Pages 1 to 5) */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 border-t border-slate-200 dark:border-slate-700 pt-4">
                  {[
                    { page: 1, title: '1. Audit Scope & Selection', desc: 'Scope Years & Streams' },
                    { page: 2, title: '2. Benefit Test & DEMPE', desc: 'OECD Substance Check' },
                    { page: 3, title: '3. TP Method Rationale', desc: 'TNMM / CUP Evaluation' },
                    { page: 4, title: '4. Revenue-at-Risk Model', desc: 'Disallowance Calculations' },
                    { page: 5, title: '5. Strategy & Sign-Off', desc: 'Approval & Transition' }
                  ].map((step) => {
                    const isActive = hypothesisSubPage === step.page;
                    const isPassed = hypothesisSubPage > step.page;
                    return (
                      <button
                        key={step.page}
                        type="button"
                        onClick={() => setHypothesisSubPage(step.page)}
                        className={`text-left p-3 rounded-xl border transition-all ${
                          isActive
                            ? 'bg-blue-50 dark:bg-slate-700/80 border-blue-500 text-blue-900 dark:text-white shadow-sm ring-1 ring-blue-500/20'
                            : isPassed
                            ? 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>
                            Sub-Page {step.page}
                          </span>
                          {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        </div>
                        <p className="text-xs font-bold truncate">{step.title}</p>
                        <p className="text-[10px] text-slate-500 truncate">{step.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </Card>

              {/* ───────────────────────────────────────────────────────────── */}
              {/* SUB-PAGE 1: Audit Scope Definition & Transaction Selection */}
              {hypothesisSubPage === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card accent="blue" className="p-4 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Target Audit Period</p>
                      <p className="text-base font-bold text-slate-900 dark:text-white">{hypothesisAuditScope}</p>
                      <p className="text-xs text-slate-500">Statutory examination period (Art. 79 & Art. 47)</p>
                    </Card>

                    <Card accent="indigo" className="p-4 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Materiality Floor</p>
                      <p className="text-base font-bold text-blue-600 font-mono">{formatRevenue(hypothesisMateriality)} ETB</p>
                      <p className="text-xs text-slate-500">Threshold per intercompany stream</p>
                    </Card>

                    <Card accent="purple" className="p-4 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Primary Focus Jurisdiction</p>
                      <p className="text-base font-bold text-slate-900 dark:text-white">Mauritius, Switzerland & Hawassa SEZ</p>
                      <p className="text-xs text-slate-500">Low-tax offshore DTA & tax-free SEZ affiliate</p>
                    </Card>
                  </div>

                  <Card className="p-6 space-y-5">
                    <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Step 2.1: Controlled Intercompany Transactions Selected for Audit Scope
                    </h3>
                    <p className="text-xs text-slate-500">
                      Select which controlled intercompany streams identified in Phase 1 are included in the formal Working Hypothesis testing scope.
                    </p>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 dark:bg-slate-700/80 border-b border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 font-semibold uppercase">
                          <tr>
                            <th className="px-4 py-3">In-Scope Selection</th>
                            <th className="px-4 py-3">Scope / Type</th>
                            <th className="px-4 py-3">Stream / Transaction Type</th>
                            <th className="px-4 py-3">Related Counterparty</th>
                            <th className="px-4 py-3">Jurisdiction</th>
                            <th className="px-4 py-3 text-right">Aggregated Volume (ETB)</th>
                            <th className="px-4 py-3 text-center">Phase 1 Risk</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {controlledTransactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-700/50">
                              <td className="px-4 py-3">
                                <input
                                  type="checkbox"
                                  defaultChecked={tx.riskFlag === 'CRITICAL' || tx.riskFlag === 'HIGH'}
                                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <Badge color={tx.type === 'INTERNATIONAL' ? 'blue' : 'purple'} size="sm">
                                  {tx.type === 'INTERNATIONAL' ? 'CROSS-BORDER' : 'DOMESTIC / SEZ'}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{tx.stream}</td>
                              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{tx.foreignEntity}</td>
                              <td className="px-4 py-3 font-semibold text-blue-600">{tx.jurisdiction}</td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">{formatRevenue(tx.totalValue)} ETB</td>
                              <td className="px-4 py-3 text-center">
                                <Badge color={tx.riskFlag === 'CRITICAL' ? 'red' : tx.riskFlag === 'HIGH' ? 'orange' : 'blue'} dot size="sm">
                                  {tx.riskFlag}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                      <p className="text-xs text-slate-500">
                        <span className="font-bold text-blue-600">Scope Note:</span> Selected 4 high-risk transactions represent 94.2% of total intercompany volume.
                      </p>
                      <Button
                        variant="primary"
                        icon={ChevronRight}
                        onClick={() => setHypothesisSubPage(2)}
                      >
                        Proceed to Sub-Page 2: OECD Benefit Test & DEMPE Analysis
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* SUB-PAGE 2: OECD 5-Step Benefit Test & DEMPE Analysis */}
              {hypothesisSubPage === 2 && (
                <div className="space-y-6">
                  {/* OECD 5-Step Benefit Test Grid */}
                  <Card padding={false} className="overflow-hidden">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                          Sub-Page 2.1: OECD 5-Step Benefit Test Matrix for Offshore Management Services
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Evaluation of management & technical service fees paid to Mauritius parent (75M ETB)</p>
                      </div>
                      <Badge color="red" dot size="sm">5 of 5 Benefit Tests Failed</Badge>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 dark:bg-slate-700/80 border-b border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 font-semibold uppercase">
                          <tr>
                            <th className="px-4 py-3">OECD Benefit Test Standard</th>
                            <th className="px-4 py-3">Verification Criteria</th>
                            <th className="px-4 py-3 text-center">Test Status</th>
                            <th className="px-4 py-3">Auditor Findings & Evidence Summary</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {benefitTestMatrix.map((item) => (
                            <tr key={item.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-700/50">
                              <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{item.testName}</td>
                              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.criteria}</td>
                              <td className="px-4 py-3 text-center">
                                <Badge color="red" dot size="sm">{item.status}</Badge>
                              </td>
                              <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{item.finding}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  {/* DEMPE Functional Ownership Matrix for Intangibles */}
                  <Card padding={false} className="overflow-hidden">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Layers className="w-4 h-4 text-blue-600" />
                          Sub-Page 2.2: DEMPE Functional Responsibility Grid (Trademark Royalties)
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Evaluation of R&D and intangible ownership for 42.5M ETB brand royalty paid to Switzerland</p>
                      </div>
                      <Badge color="orange" dot size="sm">Substance Mismatch</Badge>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 dark:bg-slate-700/80 border-b border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 font-semibold uppercase">
                          <tr>
                            <th className="px-4 py-3">DEMPE Function</th>
                            <th className="px-4 py-3">Contractual Asset Owner</th>
                            <th className="px-4 py-3">Operational Location</th>
                            <th className="px-4 py-3">Local Ethiopian Substance Inspection</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {dempeMatrix.map((dempe, idx) => (
                            <tr key={idx} className="hover:bg-blue-50/40 dark:hover:bg-slate-700/50">
                              <td className="px-4 py-3 font-bold text-blue-600">{dempe.function}</td>
                              <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">{dempe.responsibleEntity}</td>
                              <td className="px-4 py-3 text-slate-500">{dempe.location}</td>
                              <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{dempe.localSubstance}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                      <Button
                        variant="secondary"
                        onClick={() => setHypothesisSubPage(1)}
                      >
                        ← Back to Sub-Page 1
                      </Button>
                      <Button
                        variant="primary"
                        icon={ChevronRight}
                        onClick={() => setHypothesisSubPage(3)}
                      >
                        Proceed to Sub-Page 3: TP Method Selection & Rationale
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* SUB-PAGE 3: TP Method Selection & Economic Rationale */}
              {hypothesisSubPage === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card accent="blue" className="p-4 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Tested Party</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedTestedParty}</p>
                      <p className="text-xs text-slate-500">Routine manufacturer without unique IP</p>
                    </Card>

                    <Card accent="green" className="p-4 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Primary Selected Method</p>
                      <p className="text-base font-bold text-emerald-600">{primaryTpMethod} (Net Margin Method)</p>
                      <p className="text-xs text-slate-500">Tested against local market comparables</p>
                    </Card>

                    <Card accent="purple" className="p-4 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Profit Level Indicator (PLI)</p>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{pliMetric}</p>
                      <p className="text-xs text-slate-500">EBIT Operating Margin benchmarking</p>
                    </Card>
                  </div>

                  <Card padding={false} className="overflow-hidden">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <BarChart2 className="w-4 h-4 text-blue-600" />
                          Sub-Page 3.1: Transfer Pricing Method Evaluation & Rejection Rationale Grid
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Directive No. 43/2015 Article 6 Most Appropriate Method Rule</p>
                      </div>
                      <Badge color="blue">TNMM & CUP Selected</Badge>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 dark:bg-slate-700/80 border-b border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 font-semibold uppercase">
                          <tr>
                            <th className="px-4 py-3">Transfer Pricing Method</th>
                            <th className="px-4 py-3 text-center">Selection Status</th>
                            <th className="px-4 py-3">Technical Economic Rationale & Justification</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {methodRationales.map((m, idx) => (
                            <tr key={idx} className="hover:bg-blue-50/40 dark:hover:bg-slate-700/50">
                              <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{m.method}</td>
                              <td className="px-4 py-3 text-center">
                                <Badge color={m.status.includes('PRIMARY') ? 'green' : m.status.includes('SECONDARY') ? 'blue' : 'gray'} size="sm">
                                  {m.status}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{m.rationale}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                      <Button
                        variant="secondary"
                        onClick={() => setHypothesisSubPage(2)}
                      >
                        ← Back to Sub-Page 2
                      </Button>
                      <Button
                        variant="primary"
                        icon={ChevronRight}
                        onClick={() => setHypothesisSubPage(4)}
                      >
                        Proceed to Sub-Page 4: Revenue-at-Risk Simulator
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* SUB-PAGE 4: Revenue-at-Risk & Adjustment Simulator */}
              {hypothesisSubPage === 4 && (
                <div className="space-y-6">
                  {/* Multi-Year Adjustment Table */}
                  <Card padding={false} className="overflow-hidden">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Calculator className="w-4 h-4 text-blue-600" />
                          Sub-Page 4.1: Multi-Year Base Erosion & Proposed Income Addition Model (FY 2020 - FY 2024)
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Proposed disallowances of management fees, royalties, and domestic SEZ underpricing</p>
                      </div>
                      <Badge color="red" dot size="sm">5-Year Aggregated Model</Badge>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 dark:bg-slate-700/80 border-b border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 font-semibold uppercase">
                          <tr>
                            <th className="px-4 py-3">Taxable Year</th>
                            <th className="px-4 py-3 text-right">Mauritius Service Disallowance (80%)</th>
                            <th className="px-4 py-3 text-right">Swiss Royalty Disallowance (100%)</th>
                            <th className="px-4 py-3 text-right">Hawassa SEZ Sales Adjustment</th>
                            <th className="px-4 py-3 text-right font-bold">Total Proposed Tax Base Addition</th>
                            <th className="px-4 py-3 text-right font-bold text-blue-600">30% CIT Tax Impact</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {multiYearAdjustments.map((adj, idx) => (
                            <tr key={idx} className="hover:bg-blue-50/40 dark:hover:bg-slate-700/50">
                              <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">{adj.year}</td>
                              <td className="px-4 py-3 text-right font-mono text-slate-700 dark:text-slate-300">{formatRevenue(adj.mauritiusFees)}</td>
                              <td className="px-4 py-3 text-right font-mono text-slate-700 dark:text-slate-300">{formatRevenue(adj.swissRoyalties)}</td>
                              <td className="px-4 py-3 text-right font-mono text-slate-700 dark:text-slate-300">{formatRevenue(adj.sezUnderpricing)}</td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-red-600">{formatRevenue(adj.proposedDisallowance)}</td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-blue-600">{formatRevenue(adj.taxImpact30Pct)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  {/* Comprehensive Revenue-at-Risk Summary Engine */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card accent="blue" className="p-4 space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Aggregated Tax Base Addition</p>
                      <p className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">152.3M ETB</p>
                      <p className="text-[10px] text-slate-500">5-Year cumulative profit adjustment</p>
                    </Card>

                    <Card accent="indigo" className="p-4 space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">30% Corporate Income Tax</p>
                      <p className="text-xl font-extrabold text-blue-600 font-mono">45.69M ETB</p>
                      <p className="text-[10px] text-slate-500">Principal CIT tax liability</p>
                    </Card>

                    <Card accent="purple" className="p-4 space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">20% Statutory Understatement Penalty</p>
                      <p className="text-xl font-extrabold text-purple-600 font-mono">9.138M ETB</p>
                      <p className="text-[10px] text-slate-500">Mandated tax penalty</p>
                    </Card>

                    <Card accent="red" className="p-4 space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Total Potential Tax Assessment</p>
                      <p className="text-xl font-extrabold text-red-600 font-mono">59.397M ETB</p>
                      <p className="text-[10px] text-slate-500">Including 10% statutory interest</p>
                    </Card>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <Button
                      variant="secondary"
                      onClick={() => setHypothesisSubPage(3)}
                    >
                      ← Back to Sub-Page 3
                    </Button>
                    <Button
                      variant="primary"
                      icon={ChevronRight}
                      onClick={() => setHypothesisSubPage(5)}
                    >
                      Proceed to Sub-Page 5: Strategy Formulation & Sign-Off
                    </Button>
                  </div>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* SUB-PAGE 5: Strategy Formulation & Supervisory Approval */}
              {hypothesisSubPage === 5 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-5">
                    <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Sub-Page 5.1: Formulate Final Legally & Economically Substantiated Working Hypothesis
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Primary TP Issue Identified"
                        value={identifiedIssue}
                        onChange={(e) => setIdentifiedIssue(e.target.value)}
                        className="font-medium"
                      />
                      <Input
                        label="Total Formulated Revenue-at-Risk (ETB)"
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
                      placeholder="Formulate detailed auditor hypothesis..."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Textarea
                        label="Economic Rationale & Transfer Pricing Impact"
                        rows={3}
                        value={econRationale}
                        onChange={(e) => setEconRationale(e.target.value)}
                      />
                      <Textarea
                        label="Calculation & Verification Methodology Details"
                        rows={3}
                        value={calcDetails}
                        onChange={(e) => setCalcDetails(e.target.value)}
                      />
                    </div>

                    {/* Team Leader & Committee Sign-Off */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-emerald-600" />
                        Audit Committee & Team Leader Working Hypothesis Approval
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          label="Lead TP Auditor"
                          value={leadHypothesisAuditor}
                          onChange={(e) => setLeadHypothesisAuditor(e.target.value)}
                        />
                        <Input
                          label="Committee Chair Sign-Off"
                          value={committeeChair}
                          onChange={(e) => setCommitteeChair(e.target.value)}
                        />
                        <Select
                          label="Approval Status"
                          value={hypothesisStatus}
                          onChange={(e) => setHypothesisStatus(e.target.value)}
                          options={[
                            { value: 'APPROVED', label: 'APPROVED - Proceed to Phase 3 Planning' },
                            { value: 'PENDING_REVISION', label: 'PENDING REVISION - Request Additional Substance' },
                            { value: 'REJECTED', label: 'REJECTED - Scope Insufficient' }
                          ]}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                      <Button
                        variant="secondary"
                        onClick={() => setHypothesisSubPage(4)}
                      >
                        ← Back to Sub-Page 4
                      </Button>
                      <Button
                        variant="primary"
                        icon={Send}
                        loading={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5"
                        onClick={() => handlePost(
                          '/working-hypothesis',
                          {
                            hypothesisDescription: hypothesisDesc,
                            identifiedIssue,
                            economicRationale: econRationale,
                            revenueAtRisk: parseFloat(revenueAtRisk),
                            calculationDetails: {
                              subPageCompleted: 5,
                              auditScope: hypothesisAuditScope,
                              materiality: hypothesisMateriality,
                              benefitTestMatrix,
                              dempeMatrix,
                              primaryTpMethod,
                              secondaryTpMethod,
                              pliMetric,
                              methodRationales,
                              multiYearAdjustments,
                              hypothesisStatus,
                              leadHypothesisAuditor,
                              committeeChair
                            }
                          },
                          'Step 2 (Working Hypothesis) 5-Page Process Completed & Saved! Transitioning to Step 3 (Planning & Meeting)...'
                        )}
                      >
                        Save & Finalize Step 2 Process
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Phase 3: Planning & Meeting - Enterprise Audit Scope Formulation & Entry Conference Workbench */}
          {activeTab === 'PLANNING' && (
            <div className="space-y-6">
              {/* 1. Header Context & 5-Sub-Page Stepper */}
              <Card className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <Badge color="green" size="sm">PHASE 3: AUDIT PLANNING & ENTRY CONFERENCE</Badge>
                      <Badge color="blue" size="sm">FORM FR-04.5.1 / IDR-01</Badge>
                      <span className="text-xs text-slate-400 font-mono">Directive No. 43/2015 Compliant</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-0.5">
                      Step 3: Enterprise Audit Plan Formulation & Entry Conference Workbench
                    </h2>
                    <p className="text-xs text-slate-500">
                      Establish statutory audit plan parameters, benchmark financial ratios, schedule the official Entry Conference, and issue Information Document Request (IDR-01).
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/60 p-4 rounded-xl border border-slate-200 dark:border-slate-600 text-right">
                    <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400">Target Response Period</p>
                    <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                      {idrNoticeDays} <span className="text-xs font-normal">Working Days</span>
                    </p>
                  </div>
                </div>

                {/* Sub-Page Navigation Stepper Tabs (Sub-Pages 1 to 5) */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 border-t border-slate-200 dark:border-slate-700 pt-4">
                  {[
                    { page: 1, title: '1. Scope & Parameters', desc: 'Statutory Form FR-04.5.1' },
                    { page: 2, title: '2. Macro & Benchmarks', desc: 'Financial Ratio Profiling' },
                    { page: 3, title: '3. Entry Conference', desc: 'Venue, Delegation & Agenda' },
                    { page: 4, title: '4. IDR-01 Document Builder', desc: 'Statutory Document Request' },
                    { page: 5, title: '5. Plan Sign-Off & Dispatch', desc: 'Committee Approval & Issue' }
                  ].map((step) => {
                    const isActive = planningSubPage === step.page;
                    const isPassed = planningSubPage > step.page;
                    return (
                      <button
                        key={step.page}
                        type="button"
                        onClick={() => setPlanningSubPage(step.page)}
                        className={`text-left p-3 rounded-xl border transition-all ${
                          isActive
                            ? 'bg-emerald-50 dark:bg-slate-700/80 border-emerald-500 text-emerald-900 dark:text-white shadow-sm ring-1 ring-emerald-500/20'
                            : isPassed
                            ? 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                            Sub-Page {step.page}
                          </span>
                          {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        </div>
                        <p className="text-xs font-bold truncate">{step.title}</p>
                        <p className="text-[10px] text-slate-500 truncate">{step.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </Card>

              {/* ───────────────────────────────────────────────────────────── */}
              {/* SUB-PAGE 1: Statutory Scope Parameters & Resource Allocation (Form FR-04.5.1) */}
              {planningSubPage === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card accent="emerald" className="p-4 space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Target Audit Period</p>
                      <p className="text-base font-bold text-slate-900 dark:text-white">{planScope}</p>
                      <p className="text-[10px] text-slate-500">Statutory examination range</p>
                    </Card>

                    <Card accent="blue" className="p-4 space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Materiality Floor</p>
                      <p className="text-base font-bold text-blue-600 font-mono">{formatRevenue(parseFloat(planMateriality) || 5000000)} ETB</p>
                      <p className="text-[10px] text-slate-500">Per intercompany stream</p>
                    </Card>

                    <Card accent="purple" className="p-4 space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Resource Hours Budget</p>
                      <p className="text-base font-bold text-purple-600 font-mono">{auditHoursBudget} Hours</p>
                      <p className="text-[10px] text-slate-500">{auditTeamSize} Specialized TP Auditors</p>
                    </Card>

                    <Card accent="indigo" className="p-4 space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Selection Strategy</p>
                      <p className="text-base font-bold text-indigo-600 font-mono">{samplingMethod}</p>
                      <p className="text-[10px] text-slate-500">Stratified risk sampling</p>
                    </Card>
                  </div>

                  <Card className="p-6 space-y-5">
                    <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                      Step 3.1: Statutory Audit Plan Objectives & Scope (MoR Standard Form FR-04.5.1-01)
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
                        placeholder="FY 2020 - FY 2024 (5 Statutory Taxable Years)"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Input
                        label="Materiality Threshold Amount (ETB)"
                        type="number"
                        value={planMateriality}
                        onChange={(e) => setPlanMateriality(e.target.value)}
                        className="font-mono text-blue-600 font-bold"
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
                        label="Allocated Audit Resource Budget (Total Hours)"
                        type="number"
                        value={auditHoursBudget}
                        onChange={(e) => setAuditHoursBudget(e.target.value)}
                        className="font-mono text-purple-600 font-bold"
                      />
                    </div>

                    {/* Phase-by-Phase Audit Resource Hours Breakdown */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Planned Hours Allocation per Execution Phase (480 Total Budget Hours)
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs font-mono">
                        <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                          <p className="text-[10px] text-slate-500">1. Planning & Meeting</p>
                          <p className="font-bold text-slate-900 dark:text-white">60 Hours (12.5%)</p>
                        </div>
                        <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                          <p className="text-[10px] text-slate-500">2. Field Work & FAR</p>
                          <p className="font-bold text-emerald-600">180 Hours (37.5%)</p>
                        </div>
                        <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                          <p className="text-[10px] text-slate-500">3. Economic Analysis</p>
                          <p className="font-bold text-blue-600">140 Hours (29.2%)</p>
                        </div>
                        <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                          <p className="text-[10px] text-slate-500">4. Audit Reporting</p>
                          <p className="font-bold text-purple-600">60 Hours (12.5%)</p>
                        </div>
                        <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                          <p className="text-[10px] text-slate-500">5. Notice & Objection</p>
                          <p className="font-bold text-amber-600">40 Hours (8.3%)</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                      <p className="text-xs text-slate-500">
                        <span className="font-bold text-emerald-600">Form FR-04.5.1:</span> Parameters configured under MoR statutory guidelines.
                      </p>
                      <Button
                        variant="primary"
                        icon={ChevronRight}
                        onClick={() => setPlanningSubPage(2)}
                      >
                        Proceed to Sub-Page 2: Macro & Benchmark Financial Profiling
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* SUB-PAGE 2: Macro-Economic Profiling & Benchmark Ratio Analysis */}
              {planningSubPage === 2 && (
                <div className="space-y-6">
                  {/* Industry Context Banner */}
                  <Card className="p-5 bg-gradient-to-br from-emerald-900/10 to-slate-900 border border-emerald-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-emerald-600" />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          Industry Sector & Macro-Economic Risk Intelligence Profile
                        </h3>
                      </div>
                      <Badge color="emerald">LTO LARGE TAXPAYER DIVISION</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <p className="text-slate-400">Assessed Industry Sector:</p>
                        <p className="font-bold text-slate-800 dark:text-white">{industrySector}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Foreign Exchange Volatility:</p>
                        <p className="font-bold text-amber-600">High Risk — Currency Devaluation Adjustment</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Offshore Jurisdiction Profile:</p>
                        <p className="font-bold text-blue-600">Mauritius (DTA 5% WHT) & Switzerland (0% Royalty WHT)</p>
                      </div>
                    </div>
                  </Card>

                  {/* Financial Benchmark Ratios Comparison Table */}
                  <Card padding={false} className="overflow-hidden">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Calculator className="w-4 h-4 text-emerald-600" />
                          Sub-Page 2.1: Financial Benchmark Ratio Profiling Matrix (Taxpayer vs Arm's Length Range)
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Directive No. 43/2015 Article 6 Profitability & Margin Examination</p>
                      </div>
                      <Badge color="red" dot size="sm">4 of 4 Financial Ratios Deviate</Badge>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 dark:bg-slate-700/80 border-b border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 font-semibold uppercase">
                          <tr>
                            <th className="px-4 py-3">Financial Ratio / Metric</th>
                            <th className="px-4 py-3 text-right">Taxpayer Actual</th>
                            <th className="px-4 py-3 text-right">Arm's Length Benchmark</th>
                            <th className="px-4 py-3 text-right">Variance</th>
                            <th className="px-4 py-3 text-center">Risk Level</th>
                            <th className="px-4 py-3">Auditor Findings & Risk Rationale</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {benchmarkingRatios.map((row, idx) => (
                            <tr key={idx} className="hover:bg-emerald-50/40 dark:hover:bg-slate-700/50">
                              <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{row.ratioName}</td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-red-600">{row.taxpayerActual}</td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600">{row.sectorBenchmark}</td>
                              <td className="px-4 py-3 text-right font-mono text-slate-700 dark:text-slate-300">{row.variance}</td>
                              <td className="px-4 py-3 text-center">
                                <Badge color={row.riskLevel === 'CRITICAL' ? 'red' : 'orange'} dot size="sm">
                                  {row.riskLevel}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">{row.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                      <Button
                        variant="secondary"
                        onClick={() => setPlanningSubPage(1)}
                      >
                        ← Back to Sub-Page 1
                      </Button>
                      <Button
                        variant="primary"
                        icon={ChevronRight}
                        onClick={() => setPlanningSubPage(3)}
                      >
                        Proceed to Sub-Page 3: Entry Conference & Delegation Logistics
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* SUB-PAGE 3: Taxpayer Entry Conference Logistics & Agenda (Form FR-04.2.1) */}
              {planningSubPage === 3 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-5">
                    <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                      <Users className="w-5 h-5 text-emerald-600" />
                      Step 3.3: Taxpayer Entry Conference & Supervisory Committee Schedule (Form FR-04.2.1)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Input
                        label="Entry Conference Scheduled Date"
                        type="date"
                        value={meetingDate}
                        onChange={(e) => setMeetingDate(e.target.value)}
                        className="font-semibold"
                      />
                      <Input
                        label="Meeting Time"
                        value={meetingTime}
                        onChange={(e) => setMeetingTime(e.target.value)}
                        className="font-semibold"
                      />
                      <Input
                        label="Statutory Notice Response Window"
                        value={`${idrNoticeDays} Working Days`}
                        disabled
                        className="font-mono text-emerald-600 font-bold"
                      />
                    </div>

                    <Input
                      label="Meeting Venue / Location"
                      value={entryConferenceVenue}
                      onChange={(e) => setEntryConferenceVenue(e.target.value)}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Ministry of Revenue Audit Delegation"
                        value={committeeDelegation}
                        onChange={(e) => setCommitteeDelegation(e.target.value)}
                        className="text-xs"
                      />
                      <Input
                        label="Taxpayer Official Delegation"
                        value={taxpayerDelegation}
                        onChange={(e) => setTaxpayerDelegation(e.target.value)}
                        className="text-xs"
                      />
                    </div>

                    <Textarea
                      label="Formal Entry Conference 5-Point Agenda & Discussion Protocol"
                      rows={4}
                      value={meetingAgenda}
                      onChange={(e) => setMeetingAgenda(e.target.value)}
                      placeholder="Specify formal meeting protocol..."
                    />

                    <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-xs text-emerald-900 dark:text-emerald-300">Formal Entry Conference Notice (Form FR-04.2.1-N)</p>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400">Notice will be served electronically to Taxpayer CFO 7 days prior to meeting date.</p>
                      </div>
                      <Badge color="green" size="sm">NOTICE GENERATED</Badge>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                      <Button
                        variant="secondary"
                        onClick={() => setPlanningSubPage(2)}
                      >
                        ← Back to Sub-Page 2
                      </Button>
                      <Button
                        variant="primary"
                        icon={ChevronRight}
                        onClick={() => setPlanningSubPage(4)}
                      >
                        Proceed to Sub-Page 4: Interactive IDR-01 Document Request Builder
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* SUB-PAGE 4: Initial Information Document Request (IDR-01) Builder */}
              {planningSubPage === 4 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-5 border border-emerald-200 dark:border-emerald-900/40">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <FileText className="w-5 h-5 text-emerald-600" />
                          Step 3.4: Initial Information Document Request (IDR-01) Builder (Form FR-04.5.2-IDR)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Configure statutory documents required from Taxpayer within <span className="font-bold text-emerald-600">{idrNoticeDays} working days</span> of Entry Conference.
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
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-xs text-slate-800 dark:text-slate-200">{item.name}</p>
                                <Badge color={item.priority === 'STATUTORY' ? 'red' : item.priority === 'CRITICAL' ? 'orange' : 'blue'} size="sm">
                                  {item.priority}
                                </Badge>
                              </div>
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
                            checked: true,
                            priority: 'HIGH'
                          }]);
                          setNewItemText('');
                        }}
                      >
                        + Add Item
                      </Button>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                      <Button
                        variant="secondary"
                        onClick={() => setPlanningSubPage(3)}
                      >
                        ← Back to Sub-Page 3
                      </Button>
                      <Button
                        variant="primary"
                        icon={ChevronRight}
                        onClick={() => setPlanningSubPage(5)}
                      >
                        Proceed to Sub-Page 5: Audit Plan Approval & Dispatch
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* SUB-PAGE 5: Audit Plan Committee Approval & Document Dispatch */}
              {planningSubPage === 5 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-5">
                    <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      Step 3.5: Final Audit Plan Committee Sign-Off & IDR-01 Statutory Dispatch
                    </h3>

                    {/* Statutory Summary Card */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 font-sans text-xs">
                      <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                        Audit Plan Summary Record (MoR Form FR-04.5.1-FINAL)
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <p><strong>Scope Period:</strong> {planScope}</p>
                        <p><strong>Materiality Floor:</strong> {formatRevenue(parseFloat(planMateriality) || 5000000)} ETB</p>
                        <p><strong>Allocated Hours:</strong> {auditHoursBudget} Hours</p>
                        <p><strong>Entry Conference:</strong> {meetingDate} ({meetingTime})</p>
                        <p><strong>IDR Response Window:</strong> {idrNoticeDays} Working Days</p>
                        <p><strong>Configured IDR Items:</strong> {idrItems.filter(i => i.checked).length} Document Streams</p>
                      </div>
                    </div>

                    {/* Supervisory Audit Committee Sign-Off Controls */}
                    <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 space-y-4">
                      <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-emerald-600" />
                        TP Supervisory Audit Committee Plan Approval & Sign-Off
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          label="Lead TP Auditor"
                          value={leadHypothesisAuditor}
                          onChange={(e) => setLeadHypothesisAuditor(e.target.value)}
                        />
                        <Input
                          label="Committee Chair Representative"
                          value={planApprovedBy}
                          onChange={(e) => setPlanApprovedBy(e.target.value)}
                        />
                        <Select
                          label="Committee Approval Decision"
                          value={planApprovalDecision}
                          onChange={(e) => setPlanApprovalDecision(e.target.value)}
                          options={[
                            { value: 'APPROVED', label: 'APPROVED — Issue IDR-01 & Proceed to Fieldwork' },
                            { value: 'REVISION_REQUESTED', label: 'REVISION REQUESTED — Adjust Scope or Hours' },
                            { value: 'DISAPPROVED', label: 'DISAPPROVED — Reject Audit Plan' }
                          ]}
                        />
                      </div>

                      <Textarea
                        label="Supervisory Committee Final Instructions & Rationale"
                        rows={3}
                        value={planComments}
                        onChange={(e) => setPlanComments(e.target.value)}
                      />
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                      <Button
                        variant="secondary"
                        onClick={() => setPlanningSubPage(4)}
                      >
                        ← Back to Sub-Page 4
                      </Button>
                      <Button
                        variant="primary"
                        icon={Send}
                        loading={loading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5"
                        onClick={async () => {
                          await handlePost('/audit-plan', {
                            objective: planObj,
                            scope: planScope,
                            materialityDetails: { materialityFloor: parseFloat(planMateriality) || 5000000 },
                            industryResearch: { sector: industrySector, ratios: benchmarkingRatios },
                            samplingMethod: { method: samplingMethod, auditHoursBudget: parseInt(auditHoursBudget) },
                            plannedProcedures: { subPageCompleted: 5, approvalStatus: planApprovalDecision }
                          }, 'Audit Plan (Form FR-04.5.1) Saved Successfully!');

                          await handlePost('/planning-meeting', {
                            scheduledDate: meetingDate,
                            participants: { committeeDelegation, taxpayerDelegation },
                            agenda: meetingAgenda,
                            idrNoticeDays: parseInt(idrNoticeDays) || 15,
                            idrItemsRequested: idrItems.filter(i => i.checked)
                          }, `Step 3 (Planning & Meeting) 5-Page Process Completed & Saved! Entry Conference scheduled and IDR-01 issued (${idrItems.filter(i => i.checked).length} document streams requested). Transitioning to Step 4 (Field Work)...`);
                        }}
                      >
                        Save & Issue Audit Plan & IDR-01 Request
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Phase 4: Field Work - Enterprise 5-Sub-Page Wide Process Stepper */}
          {activeTab === 'FIELD_WORK' && (
            <div className="space-y-6">
              {/* 1. Sub-Page Stepper Header */}
              <Card className="p-6 bg-gradient-to-r from-teal-950 via-slate-900 to-slate-900 border-teal-800/40 text-white shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-mono font-semibold rounded-full">
                        PHASE 4: FIELD WORK & FAR ANALYSIS
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Step {fieldWorkSubPage} of 5</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight pt-1">
                      {fieldWorkSubPage === 1 && "Sub-Page 1: Intercompany Contract Execution & Agreement Audit"}
                      {fieldWorkSubPage === 2 && "Sub-Page 2: Functions Performed Analysis (Local vs Offshore Split)"}
                      {fieldWorkSubPage === 3 && "Sub-Page 3: Assets Employed Evaluation (Tangibles & Intangible IP)"}
                      {fieldWorkSubPage === 4 && "Sub-Page 4: Risk Allocation Matrix & Contract Manufacturer Status"}
                      {fieldWorkSubPage === 5 && "Sub-Page 5: Interview Minutes & Versioned Audit Fact Statement (v1.0)"}
                    </h2>
                    <p className="text-xs text-slate-300">
                      {fieldWorkSubPage === 1 && "Audit signed intercompany agreements, verify pricing formulas, and check contractual risk insulation clauses."}
                      {fieldWorkSubPage === 2 && "Analyze operational functions performed by local personnel versus management decisions directed from abroad."}
                      {fieldWorkSubPage === 3 && "Verify ownership and use of tangible plant equipment and intangible patents, trademarks, and technical know-how."}
                      {fieldWorkSubPage === 4 && "Assess financial, market, and credit risk distribution to confirm limited-risk manufacturer status."}
                      {fieldWorkSubPage === 5 && "Document key staff interview statements, reconcile ERP sub-ledgers, and submit draft Fact Statement (v1.0)."}
                    </p>
                  </div>
                </div>

                {/* Sub-Page Stepper Controls */}
                <div className="grid grid-cols-5 gap-2 pt-6 border-t border-teal-800/30 mt-4">
                  {[
                    { num: 1, label: "Contract Execution", short: "Agreements" },
                    { num: 2, label: "Functions Split", short: "Functions" },
                    { num: 3, label: "Assets & IP", short: "Assets" },
                    { num: 4, label: "Risk Matrix", short: "Risks" },
                    { num: 5, label: "Fact Statement", short: "Fact Statement" },
                  ].map(step => (
                    <button
                      key={step.num}
                      onClick={() => setFieldWorkSubPage(step.num)}
                      className={`flex flex-col items-center p-2.5 rounded-xl border text-left transition-all ${
                        fieldWorkSubPage === step.num
                          ? 'bg-teal-500/20 border-teal-400 text-white font-bold shadow-lg shadow-teal-900/30'
                          : fieldWorkSubPage > step.num
                          ? 'bg-teal-950/40 border-teal-700/50 text-teal-300 hover:bg-teal-900/30'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                          fieldWorkSubPage === step.num ? 'bg-teal-400 text-slate-950' : fieldWorkSubPage > step.num ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {step.num}
                        </span>
                        <span className="text-xs font-semibold truncate">{step.short}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 hidden sm:block truncate">{step.label}</span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Sub-Page 1: Contract Execution & Document Gathering */}
              {fieldWorkSubPage === 1 && (
                <div className="space-y-6">
                  {/* Document Gathering & Vouching Panel */}
                  <Card className="p-6 space-y-4 border border-teal-200 dark:border-teal-900/40">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <FileCheck className="w-5 h-5 text-teal-600" />
                          Document Gathering & Working Papers Vouching Register
                        </h3>
                        <p className="text-xs text-slate-500">
                          Review statutory documents submitted under IDR-01. Reconcile evidence against tax returns and transfer pricing documentation.
                        </p>
                      </div>
                      <Badge color="teal" className="font-mono">FORM TP-FR-04.1</Badge>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold uppercase">
                          <tr>
                            <th className="px-4 py-3">Document Name</th>
                            <th className="px-4 py-3 font-mono">Reference No.</th>
                            <th className="px-4 py-3 text-center">Vouching Status</th>
                            <th className="px-4 py-3">Auditor Findings & Working Paper Remarks</th>
                            <th className="px-4 py-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {gatheredDocuments.map((doc) => (
                            <tr key={doc.id} className="hover:bg-teal-50/30 dark:hover:bg-slate-800/40">
                              <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{doc.name}</td>
                              <td className="px-4 py-3 font-mono text-slate-500">{doc.refNo}</td>
                              <td className="px-4 py-3 text-center">
                                <Badge color={doc.status === 'VOUCHED_OK' ? 'green' : doc.status === 'INSUFFICIENT_EVIDENCE' ? 'red' : 'yellow'} size="sm">
                                  {doc.status.replace('_', ' ')}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{doc.notes}</td>
                              <td className="px-4 py-3 text-right">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => {
                                    setGatheredDocuments(gatheredDocuments.map(d => 
                                      d.id === doc.id ? { ...d, status: d.status === 'VOUCHED_OK' ? 'INSUFFICIENT_EVIDENCE' : 'VOUCHED_OK' } : d
                                    ));
                                  }}
                                >
                                  {doc.status === 'VOUCHED_OK' ? 'Flag Deficit' : 'Vouch Document'}
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  {/* Intercompany Contracts Verification Card */}
                  <Card className="p-6 space-y-4">
                    <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <FileText className="w-5 h-5 text-teal-600" />
                      Audited Intercompany Agreements & Legal Execution Matrix
                    </h3>
                    <div className="space-y-3">
                      {contractsReviewed.map((contract, index) => (
                        <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-800 dark:text-white">{contract.title}</span>
                              <Badge color={contract.status.includes('FAILED') ? 'red' : contract.status.includes('DEMPE') ? 'yellow' : 'purple'}>
                                {contract.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-500">Foreign Associated Counterparty: <span className="font-semibold text-slate-700 dark:text-slate-300">{contract.party}</span></p>
                            <p className="text-xs text-slate-500 font-mono">Contract Formula: {contract.feeFormula}</p>
                          </div>
                          <Button variant="secondary" size="sm" onClick={() => handlePost('/field-work/contract-verify', { title: contract.title }, `Contract "${contract.title}" verified!`)}>
                            Verify Clause
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button variant="primary" icon={ArrowRight} className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => setFieldWorkSubPage(2)}>
                        Proceed to Sub-Page 2 (Functions Split) →
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Sub-Page 2: Functions Split & Interview Log */}
              {fieldWorkSubPage === 2 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <Layers className="w-5 h-5 text-teal-600" />
                          Sub-Page 4.2: Functions Performed Operational Split (Ethiopia vs Offshore Parent)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Directive No. 43/2015 Article 5 Functional Analysis — Operational decision-making vs routine execution split.
                        </p>
                      </div>
                      <Badge color="teal">FAR FUNCTIONS MATRIX</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-teal-50/60 dark:bg-teal-900/20 rounded-xl border border-teal-200 dark:border-teal-800 space-y-3">
                        <h4 className="text-xs font-bold text-teal-900 dark:text-teal-300 uppercase tracking-wider flex items-center justify-between">
                          <span>Local Taxpayer Functions (Addis Ababa / SEZ Plant)</span>
                          <Badge color="teal" size="sm">ROUTINE OPERATOR</Badge>
                        </h4>
                        <ul className="text-xs space-y-2 text-slate-700 dark:text-slate-300">
                          <li className="flex items-start gap-2">
                            <span className="text-teal-600 font-bold">•</span>
                            <span><strong>Garment Manufacturing & Cutting:</strong> 100% executed by local Ethiopian factory floor personnel.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-teal-600 font-bold">•</span>
                            <span><strong>Warehousing & Storage:</strong> Storage of raw cotton yarn and finished goods within Hawassa SEZ premises.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-teal-600 font-bold">•</span>
                            <span><strong>Quality Assurance:</strong> Routine visual inspection of output against parent specification sheets.</span>
                          </li>
                        </ul>
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center justify-between">
                          <span>Offshore Associated Enterprise (Mauritius / Zurich)</span>
                          <Badge color="purple" size="sm">STRATEGIC PRINCIPAL</Badge>
                        </h4>
                        <ul className="text-xs space-y-2 text-slate-700 dark:text-slate-300">
                          <li className="flex items-start gap-2">
                            <span className="text-purple-600 font-bold">•</span>
                            <span><strong>Product Design & R&D:</strong> Global design center in Zurich controls all garment patterns and tech packs.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-purple-600 font-bold">•</span>
                            <span><strong>Brand Marketing & Customer Contracts:</strong> International sales contracts signed directly by Mauritius parent.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-purple-600 font-bold">•</span>
                            <span><strong>Global Supply Chain Sourcing:</strong> Procurement of machinery and raw material suppliers directed from abroad.</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-teal-600" />
                        Taxpayer Key Staff Interview Log & Testimony Summary
                      </h4>
                      <Textarea 
                        rows={3}
                        value={interviewMinutes}
                        onChange={(e) => setInterviewMinutes(e.target.value)}
                        placeholder="Record key staff statements regarding on-ground decision authority..."
                      />
                    </div>

                    <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="secondary" icon={ArrowLeft} onClick={() => setFieldWorkSubPage(1)}>← Back to Sub-Page 1</Button>
                      <Button variant="primary" icon={ArrowRight} className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => setFieldWorkSubPage(3)}>
                        Proceed to Sub-Page 3 (Assets & IP DEMPE) →
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Sub-Page 3: Assets & IP DEMPE Audit */}
              {fieldWorkSubPage === 3 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-teal-600" />
                          Sub-Page 4.3: Assets Employed Evaluation & DEMPE IP Rights Audit
                        </h3>
                        <p className="text-xs text-slate-500">
                          Verify tangible asset valuations and audit OECD DEMPE functions for intercompany brand royalty payments.
                        </p>
                      </div>
                      <Badge color="amber">DEMPE SUBSTANCE AUDIT</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4 space-y-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                          Tangible Fixed Asset Register (Ethiopian Subsidiary)
                        </h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1">
                            <span className="text-slate-500">Plant Equipment Net Value:</span>
                            <span className="font-mono font-bold text-slate-900 dark:text-white">120,400,000 ETB</span>
                          </div>
                          <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1">
                            <span className="text-slate-500">Factory Premises:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">Leased Hawassa SEZ Facility</span>
                          </div>
                          <div className="flex justify-between pb-1">
                            <span className="text-slate-500">Asset Ownership Profile:</span>
                            <span className="font-semibold text-teal-600">Standard Routine Machinery</span>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4 space-y-3 bg-red-50/40 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40">
                        <h4 className="text-xs font-bold text-red-900 dark:text-red-300 uppercase tracking-wider">
                          Intangible Property (IP) DEMPE Functional Matrix
                        </h4>
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between items-center">
                            <span>Development (R&D):</span>
                            <Badge color="red" size="sm">0% Local Execution</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Enhancement:</span>
                            <Badge color="red" size="sm">0% Local Execution</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Maintenance & Protection:</span>
                            <Badge color="orange" size="sm">Legal Counsel Offshore</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Exploitation:</span>
                            <Badge color="green" size="sm">Ethiopian Plant Assembly</Badge>
                          </div>
                        </div>
                      </Card>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs space-y-1">
                      <p className="font-bold text-amber-900 dark:text-amber-300">Auditor DEMPE Conclusion:</p>
                      <p className="text-amber-800 dark:text-amber-400">
                        The 2.45% brand royalty paid to Swiss affiliate is unsubstantiated. Local entity performs zero DEMPE functions, justifying 100% disallowance of royalty deduction under Art. 79 of Tax Proclamation No. 979/2016.
                      </p>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="secondary" icon={ArrowLeft} onClick={() => setFieldWorkSubPage(2)}>← Back to Sub-Page 2</Button>
                      <Button variant="primary" icon={ArrowRight} className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => setFieldWorkSubPage(4)}>
                        Proceed to Sub-Page 4 (Risk Allocation & Characterization) →
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Sub-Page 4: Risk Allocation & Characterization */}
              {fieldWorkSubPage === 4 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-teal-600" />
                          Sub-Page 4.4: Risk Allocation Matrix & Limited-Risk Contract Manufacturer Status
                        </h3>
                        <p className="text-xs text-slate-500">
                          Classify entity economic profile to determine appropriate Transfer Pricing method (TNMM vs CUP).
                        </p>
                      </div>
                      <Badge color="teal">LRCM CHARACTERIZATION</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                        <span className="text-xs font-bold text-slate-500 uppercase">Market & Price Risk</span>
                        <p className="text-sm font-bold text-teal-600">Assumed by Offshore Parent</p>
                        <p className="text-xs text-slate-400">Guaranteed buy-back agreement insulates Ethiopian plant from market demand fluctuations.</p>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                        <span className="text-xs font-bold text-slate-500 uppercase">Raw Material Inventory Risk</span>
                        <p className="text-sm font-bold text-teal-600">Limited Local Risk</p>
                        <p className="text-xs text-slate-400">Raw cotton yarn is consigned by offshore parent trader.</p>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                        <span className="text-xs font-bold text-slate-500 uppercase">Foreign Exchange (FX) Risk</span>
                        <p className="text-sm font-bold text-amber-600">Shared Currency Risk</p>
                        <p className="text-xs text-slate-400">ETB devaluation impacts local operating expenses.</p>
                      </div>
                    </div>

                    <div className="p-4 bg-teal-50/50 dark:bg-teal-950/20 rounded-xl border border-teal-200 dark:border-teal-800/60 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-xs text-teal-900 dark:text-teal-300">Auditor Characterization Verdict:</p>
                        <p className="text-[11px] text-teal-700 dark:text-teal-400">
                          Taxpayer is confirmed as a <strong>Limited-Risk Contract Manufacturer (LRCM)</strong>. Under Directive No. 43/2015 Art. 6, TNMM (Operating Margin on Cost/Sales) is confirmed as the primary tested method.
                        </p>
                      </div>
                      <Badge color="green" size="sm font-mono">LRCM CONFIRMED</Badge>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="secondary" icon={ArrowLeft} onClick={() => setFieldWorkSubPage(3)}>← Back to Sub-Page 3</Button>
                      <Button variant="primary" icon={ArrowRight} className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => setFieldWorkSubPage(5)}>
                        Proceed to Sub-Page 5 (Fact Statement v1.0 & Verification) →
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Sub-Page 5: Fact Statement v1.0 & Reconciliation */}
              {fieldWorkSubPage === 5 && (
                <div className="space-y-6">
                  {/* Detailed Fact Statement Document Preview & Reconciliation Card */}
                  <Card className="p-6 space-y-5 border border-teal-200 dark:border-teal-900/40">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <FileText className="w-5 h-5 text-teal-600" />
                          Sub-Page 4.5: Agreed Statement of Facts & Working Papers Verification (Form TP-FR-04.4)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Reconcile audited facts, intercompany ledger entries, and interviewed statements for joint Auditor-Taxpayer sign-off.
                        </p>
                      </div>
                      <Badge color="teal" className="font-mono">FORM TP-FR-04.4-V{factStatementVersion}.0</Badge>
                    </div>

                    {/* ERP General Ledger Reconciliations Table */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Reconciled Intercompany General Ledger Accounts (FY 2020 - FY 2024)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                          <p className="text-slate-400">GL #5400 (Management Fees):</p>
                          <p className="font-mono font-bold text-red-600">75,000,000 ETB</p>
                          <p className="text-[10px] text-slate-500 mt-1">Failed OECD Benefit Test (0% direct local benefit proved)</p>
                        </div>
                        <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                          <p className="text-slate-400">GL #5410 (Swiss Royalty Expense):</p>
                          <p className="font-mono font-bold text-amber-600">42,500,000 ETB</p>
                          <p className="text-[10px] text-slate-500 mt-1">2.45% rate unsupported by local DEMPE functions</p>
                        </div>
                        <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                          <p className="text-slate-400">GL #4120 (SEZ Supply Contract):</p>
                          <p className="font-mono font-bold text-teal-600">91,500,000 ETB</p>
                          <p className="text-[10px] text-slate-500 mt-1">15% underpriced compared to market CUP benchmark</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Textarea 
                        label="On-Site ERP Ledger Inspection Findings & Vouching Notes" 
                        rows={4} 
                        value={fieldWorkNotes} 
                        onChange={(e) => setFieldWorkNotes(e.target.value)} 
                      />
                      <Textarea 
                        label="Taxpayer Key Staff Interview Minutes & Agreed Fact Statements" 
                        rows={4} 
                        value={interviewMinutes} 
                        onChange={(e) => setInterviewMinutes(e.target.value)} 
                      />
                    </div>

                    <div className="p-4 bg-teal-50/50 dark:bg-teal-950/20 rounded-xl border border-teal-200 dark:border-teal-800/60 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-xs text-teal-900 dark:text-teal-300">Auditor Working Paper Archival Status</p>
                        <p className="text-[11px] text-teal-700 dark:text-teal-400">
                          {gatheredDocuments.filter(d => d.status === 'VOUCHED_OK').length} of {gatheredDocuments.length} document streams vouched & locked for economic benchmarking.
                        </p>
                      </div>
                      <Badge color="green" size="sm">FACT STATEMENT READY</Badge>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="secondary" icon={ArrowLeft} onClick={() => setFieldWorkSubPage(4)}>← Back to Sub-Page 4</Button>
                      <Button 
                        variant="primary" 
                        icon={Send} 
                        loading={loading}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5"
                        onClick={async () => {
                          await handlePost('/field-work', { fieldWorkNotes, interviewMinutes, subPageCompleted: 5 }, 'Phase 4 (Field Work) Completed!');
                          await handlePost('/field-work/fact-statement', { version: factStatementVersion, status: 'SUBMITTED_TO_TAXPAYER', gatheredDocuments }, `Fact Statement v${factStatementVersion}.0 & Working Papers Saved & Submitted to Taxpayer! Transitioning to Phase 5 (Economic Analysis)...`);
                        }}
                      >
                        Save Working Papers & Issue Fact Statement v1.0
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Phase 5: Economic Analysis - Enterprise 5-Sub-Page Wide Process Stepper */}
          {activeTab === 'ANALYSIS' && (
            <div className="space-y-6">
              {/* 1. Sub-Page Stepper Header */}
              <Card className="p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border-indigo-800/40 text-white shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-mono font-semibold rounded-full">
                        PHASE 5: ECONOMIC ANALYSIS & BENCHMARKING
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Step {analysisSubPage} of 5</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight pt-1">
                      {analysisSubPage === 1 && "Sub-Page 1: Tested Party Selection & Transfer Pricing Method Justification"}
                      {analysisSubPage === 2 && "Sub-Page 2: Econometric Database Search & Comparables Selection (Amadeus/Orbis)"}
                      {analysisSubPage === 3 && "Sub-Page 3: Interquartile Range (IQR) & Profit Level Indicator (PLI) Engine"}
                      {analysisSubPage === 4 && "Sub-Page 4: Customs Database Unit Price Cross-Matching (CUP Method)"}
                      {analysisSubPage === 5 && "Sub-Page 5: Transfer Pricing Adjustment Quantifier & Variance Summary"}
                    </h2>
                    <p className="text-xs text-slate-300">
                      {analysisSubPage === 1 && "Select Tested Party (Local Entity) and evaluate the 5 statutory OECD/MoR transfer pricing methods."}
                      {analysisSubPage === 2 && "Apply quantitative and qualitative screening filters on Bureau van Dijk Amadeus/Orbis database."}
                      {analysisSubPage === 3 && "Calculate arm's length interquartile range (25th to 75th percentile) and tested PLI variance."}
                      {analysisSubPage === 4 && "Cross-match raw material import invoices against Ethiopian Customs Commission reference valuation database."}
                      {analysisSubPage === 5 && "Finalize proposed arm's length tax adjustments across all 5 audited taxable years."}
                    </p>
                  </div>
                </div>

                {/* Sub-Page Stepper Controls */}
                <div className="grid grid-cols-5 gap-2 pt-6 border-t border-indigo-800/30 mt-4">
                  {[
                    { num: 1, label: "Method Selection", short: "Method" },
                    { num: 2, label: "Comparables Search", short: "Comparables" },
                    { num: 3, label: "IQR Calculator", short: "IQR Engine" },
                    { num: 4, label: "Customs CUP", short: "Customs Match" },
                    { num: 5, label: "Adjustment Table", short: "Adjustments" },
                  ].map(step => (
                    <button
                      key={step.num}
                      onClick={() => setAnalysisSubPage(step.num)}
                      className={`flex flex-col items-center p-2.5 rounded-xl border text-left transition-all ${
                        analysisSubPage === step.num
                          ? 'bg-indigo-500/20 border-indigo-400 text-white font-bold shadow-lg shadow-indigo-900/30'
                          : analysisSubPage > step.num
                          ? 'bg-indigo-950/40 border-indigo-700/50 text-indigo-300 hover:bg-indigo-900/30'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                          analysisSubPage === step.num ? 'bg-indigo-400 text-slate-950' : analysisSubPage > step.num ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {step.num}
                        </span>
                        <span className="text-xs font-semibold truncate">{step.short}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 hidden sm:block truncate">{step.label}</span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Sub-Page 1: Method Selection & Rationale */}
              {analysisSubPage === 1 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <BarChart2 className="w-5 h-5 text-indigo-600" />
                          Sub-Page 5.1: Tested Party Selection & Transfer Pricing Method Justification (Form TP-FR-05.1)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Directive No. 43/2015 Article 6 — Evaluation of the 5 statutory transfer pricing methods.
                        </p>
                      </div>
                      <Badge color="indigo" className="font-mono">FORM TP-FR-05.1</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select 
                        label="Primary Selected Transfer Pricing Method" 
                        value={selectedMethod} 
                        onChange={(e) => setSelectedMethod(e.target.value)}
                        options={[
                          { value: 'TNMM', label: 'Transactional Net Margin Method (TNMM)' },
                          { value: 'CUP', label: 'Comparable Uncontrolled Price (CUP)' },
                          { value: 'COST_PLUS', label: 'Cost Plus Method (CPM)' },
                          { value: 'RESALE_PRICE', label: 'Resale Price Method (RPM)' },
                          { value: 'PROFIT_SPLIT', label: 'Transactional Profit Split Method (PSM)' }
                        ]}
                      />
                      <Select 
                        label="Tested Profit Level Indicator (PLI) Metric" 
                        value={econPliMetric} 
                        onChange={(e) => setEconPliMetric(e.target.value)}
                        options={[
                          { value: 'Operating Margin (EBIT / Net Turnover)', label: 'Operating Margin (EBIT / Net Turnover)' },
                          { value: 'Berry Ratio (Gross Profit / OPEX)', label: 'Berry Ratio (Gross Profit / OPEX)' },
                          { value: 'ROCE (EBIT / Capital Employed)', label: 'ROCE (EBIT / Capital Employed)' },
                          { value: 'Full Cost Plus (EBIT / Total Costs)', label: 'Full Cost Plus (EBIT / Total Costs)' }
                        ]}
                      />
                    </div>

                    <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/20 rounded-xl border border-indigo-200 dark:border-indigo-800 space-y-2">
                      <p className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
                        Statutory Method Selection Justification (Directive No. 43/2015 Art. 6)
                      </p>
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        TNMM is selected as the most reliable method because the local Ethiopian entity acts as a limited-risk contract manufacturer with routine functional profile, holding zero economic ownership over intangibles. Operating Margin (EBIT / Net Sales) provides the most objective PLI for benchmarking against independent Pan-African textile manufacturers.
                      </p>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="primary" icon={ArrowRight} className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setAnalysisSubPage(2)}>
                        Proceed to Sub-Page 2 (Comparables Screening) →
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Sub-Page 2: Comparables Search & Database Screening */}
              {analysisSubPage === 2 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <BarChart2 className="w-5 h-5 text-indigo-600" />
                          Sub-Page 5.2: Bureau van Dijk Amadeus/Orbis Database Screening Matrix (Form TP-FR-05.2)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Quantitative & qualitative screening strategy to select independent comparable companies.
                        </p>
                      </div>
                      <Badge color="indigo">COMPARABLES MATRIX</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <span className="text-slate-400">Raw Database Result:</span>
                        <p className="font-mono font-bold text-slate-900 dark:text-white">4,820 Companies</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">NACE Code 1311 (Textiles)</p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <span className="text-slate-400">Independence Filter (&gt;50%):</span>
                        <p className="font-mono font-bold text-indigo-600">380 Companies</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">BvD Independence Indicator A</p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <span className="text-slate-400">Multi-Year Data Available:</span>
                        <p className="font-mono font-bold text-indigo-600">112 Companies</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">FY 2020 - FY 2024 Financials</p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <span className="text-slate-400">Final Accepted Set:</span>
                        <p className="font-mono font-bold text-emerald-600">14 Independent Comparables</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Qualitative FAR match</p>
                      </div>
                    </div>

                    {/* Top Accepted Comparables Register */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                        Sample Accepted Comparable Companies (Pan-African Peer Set)
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold uppercase">
                            <tr>
                              <th className="px-3 py-2 font-mono">BvD ID</th>
                              <th className="px-3 py-2">Company Name</th>
                              <th className="px-3 py-2">Jurisdiction</th>
                              <th className="px-3 py-2 text-right">3-Yr Avg Operating Margin (%)</th>
                              <th className="px-3 py-2 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {comparableCompanies.map((c) => (
                              <tr key={c.bvdId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                <td className="px-3 py-2 font-mono text-slate-500">{c.bvdId}</td>
                                <td className="px-3 py-2 font-bold text-slate-900 dark:text-white">{c.name}</td>
                                <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{c.country}</td>
                                <td className="px-3 py-2 text-right font-mono font-bold text-indigo-600">{c.pli?.toFixed(2) ?? '0.00'}%</td>
                                <td className="px-3 py-2 text-center">
                                  <Badge color="green" size="sm">ACCEPTED</Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="secondary" icon={ArrowLeft} onClick={() => setAnalysisSubPage(1)}>← Back to Sub-Page 1</Button>
                      <Button variant="primary" icon={ArrowRight} className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setAnalysisSubPage(3)}>
                        Proceed to Sub-Page 3 (IQR Calculator & Engine) →
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Sub-Page 3: IQR Engine & Tested Party Position */}
              {analysisSubPage === 3 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <Calculator className="w-5 h-5 text-indigo-600" />
                          Sub-Page 5.3: Interquartile Range (IQR) & Tested Party Position Engine (Form TP-FR-05.3)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Directive No. 43/2015 Article 8 — Arm's length statistical interquartile range calculation.
                        </p>
                      </div>
                      <Badge color="red" className="font-mono">IQR DEFICIT DETECTED</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Input label="25th Percentile (Min %)" type="number" step="0.01" value={iqrMin} onChange={(e) => setIqrMin(parseFloat(e.target.value))} />
                      <Input label="Median (50th Percentile %)" type="number" step="0.01" value={iqrMedian} onChange={(e) => setIqrMedian(parseFloat(e.target.value))} />
                      <Input label="75th Percentile (Max %)" type="number" step="0.01" value={iqrMax} onChange={(e) => setIqrMax(parseFloat(e.target.value))} />
                      <Input label="Taxpayer Tested PLI (%)" type="number" step="0.01" value={taxpayerResult} onChange={(e) => setTaxpayerResult(parseFloat(e.target.value))} />
                    </div>

                    {/* IQR Range Visualizer Panel */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Statistical Arm's Length Range Visualizer</span>
                        <span className="font-mono text-indigo-600 font-bold">IQR: {iqrMin}% – {iqrMax}% (Median: {iqrMedian}%)</span>
                      </div>
                      <div className="relative w-full h-8 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden flex items-center">
                        <div className="absolute left-[25%] right-[25%] h-full bg-indigo-500/30 border-l-2 border-r-2 border-indigo-500 flex items-center justify-center text-[10px] font-bold text-indigo-900 dark:text-indigo-200">
                          Arm's Length Range (25th - 75th Percentile)
                        </div>
                        <div 
                          className="absolute h-full w-2 bg-red-600 shadow-lg top-0 z-10 flex items-center justify-center"
                          style={{ left: `${(taxpayerResult / 12) * 100}%` }}
                          title={`Taxpayer Result: ${taxpayerResult}%`}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
                        <span>0.0%</span>
                        <span>25th Pct: {iqrMin}%</span>
                        <span className="font-bold text-indigo-600">50th Median: {iqrMedian}%</span>
                        <span>75th Pct: {iqrMax}%</span>
                        <span>12.0%</span>
                      </div>
                    </div>

                    <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900/40 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-xs text-red-900 dark:text-red-300">Statutory Tax Adjustment Requirement:</p>
                        <p className="text-[11px] text-red-700 dark:text-red-400">
                          Taxpayer Operating Margin of <strong>{(taxpayerResult ?? 0).toFixed(2)}%</strong> is below 25th Percentile ({iqrMin}%). Under Directive No. 43/2015 Art. 8(3), operating profits must be adjusted to the <strong>Median ({(iqrMedian ?? 0).toFixed(2)}%)</strong>.
                        </p>
                      </div>
                      <Badge color="red" size="lg">ADJUSTMENT TO MEDIAN REQUIRED</Badge>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="secondary" icon={ArrowLeft} onClick={() => setAnalysisSubPage(2)}>← Back to Sub-Page 2</Button>
                      <Button variant="primary" icon={ArrowRight} className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setAnalysisSubPage(4)}>
                        Proceed to Sub-Page 4 (Customs Valuation CUP Match) →
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Sub-Page 4: Customs Valuation Database Cross-Matching (CUP Method) */}
              {analysisSubPage === 4 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <BarChart2 className="w-5 h-5 text-indigo-600" />
                          Sub-Page 5.4: Customs Valuation Database Cross-Matching (CUP Method / ECC Database)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Reconcile raw material import prices against Ethiopian Customs Commission ASYCUDA database.
                        </p>
                      </div>
                      <Badge color="indigo">CUP VALUATION MATCH</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Customs Import HS Code & Commodity" value={customsHsCode} onChange={(e) => setCustomsHsCode(e.target.value)} />
                      <Input label="Customs Reference Price Over-Invoicing (%)" value={customsPriceDiff} onChange={(e) => setCustomsPriceDiff(e.target.value)} />
                    </div>

                    <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200 dark:border-indigo-800 space-y-2 text-xs">
                      <p className="font-bold text-indigo-900 dark:text-indigo-300 uppercase">Customs CUP Cross-Matching Verdict:</p>
                      <p className="text-indigo-800 dark:text-indigo-400">
                        Cross-matching import declarations against the ECC ASYCUDA database confirms raw cotton yarn (HS 5205.12) was billed by offshore affiliate at $4.85/kg versus market CUP benchmark of $3.89/kg (+24.7% over-invoicing), creating 42.5M ETB excess cost deduction.
                      </p>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="secondary" icon={ArrowLeft} onClick={() => setAnalysisSubPage(3)}>← Back to Sub-Page 3</Button>
                      <Button variant="primary" icon={ArrowRight} className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setAnalysisSubPage(5)}>
                        Proceed to Sub-Page 5 (Multi-Year Adjustment Quantifier) →
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Sub-Page 5: Multi-Year Base Tax Adjustment Quantifier */}
              {analysisSubPage === 5 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <Calculator className="w-5 h-5 text-indigo-600" />
                          Sub-Page 5.5: Multi-Year Transfer Pricing Base Tax Adjustment Quantifier (Form TP-FR-05.5)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Final statutory arm's length base tax adjustments calculated across all 5 audited tax years.
                        </p>
                      </div>
                      <Badge color="red" className="font-mono">185,000,000 ETB TOTAL ADJUSTMENT</Badge>
                    </div>

                    {/* Multi-Year Breakdown Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold uppercase">
                          <tr>
                            <th className="px-4 py-3">Audited Tax Year</th>
                            <th className="px-4 py-3 text-right">Reported Margin (%)</th>
                            <th className="px-4 py-3 text-right">Arm's Length Median Target (%)</th>
                            <th className="px-4 py-3 text-right">Proposed Tax Base Adjustment (ETB)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {econMultiYearAdjustments.map((row) => (
                            <tr key={row.taxYear} className="hover:bg-indigo-50/30 dark:hover:bg-slate-800/40">
                              <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{row.taxYear}</td>
                              <td className="px-4 py-3 text-right font-mono text-red-600 font-semibold">{row.reportedMargin?.toFixed(2) ?? '0.00'}%</td>
                              <td className="px-4 py-3 text-right font-mono text-indigo-600 font-semibold">{row.medianTarget?.toFixed(2) ?? '0.00'}%</td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                                {formatRevenue(row.adjustment)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-slate-100 dark:bg-slate-800/80 font-bold border-t-2 border-slate-300 dark:border-slate-600">
                          <tr>
                            <td className="px-4 py-3 text-slate-900 dark:text-white" colSpan={3}>Total Cumulative Arm's Length Adjustment (5 Tax Years):</td>
                            <td className="px-4 py-3 text-right font-mono text-base text-red-600">{formatRevenue(varianceAmt)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="secondary" icon={ArrowLeft} onClick={() => setAnalysisSubPage(4)}>← Back to Sub-Page 4</Button>
                      <Button 
                        variant="primary" 
                        icon={Send} 
                        loading={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5"
                        onClick={async () => {
                          await handlePost('/analysis/arms-length', { method: selectedMethod, iqrMin, iqrMedian, iqrMax, taxpayerResult, varianceAmt, econMultiYearAdjustments }, 'Phase 5 (Economic Analysis) Completed & Saved! Transitioning to Phase 6 (TP Report)...');
                        }}
                      >
                        Save & Issue Economic Benchmarking Analysis
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Phase 6: TP Audit Report - Enterprise 5-Sub-Page Wide Process Stepper */}
          {activeTab === 'REPORT' && (
            <div className="space-y-6">
              {/* 1. Sub-Page Stepper Header */}
              <Card className="p-6 bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 border-purple-800/40 text-white shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-mono font-semibold rounded-full">
                        PHASE 6: FORMAL TP AUDIT REPORT ENGINE (FORM FR-04.5-20)
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Step {reportSubPage} of 5</span>
                      <Badge color={reportStatus === 'FINAL_AUTHORIZED' ? 'green' : 'purple'} className="font-mono">
                        v{reportVersion}.0 — {reportStatus.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight pt-1">
                      {reportSubPage === 1 && "Sub-Page 1: Executive Findings Summary & Statutory Legal Framework"}
                      {reportSubPage === 2 && "Sub-Page 2: Intercompany Transaction Stream Disallowance Breakdown"}
                      {reportSubPage === 3 && "Sub-Page 3: Auditor Working Papers & Technical Evidence Index (WP-01 to WP-08)"}
                      {reportSubPage === 4 && "Sub-Page 4: Sequential Gatekeeper Approval Tracker (Lead → TL → Process Owner)"}
                      {reportSubPage === 5 && "Sub-Page 5: Audit Report Document Generation (Form FR-04.5-20) & Dispatch"}
                    </h2>
                    <p className="text-xs text-slate-300">
                      {reportSubPage === 1 && "Formulate statutory audit grounds pursuant to Income Tax Proclamation No. 979/2016 Art. 79 & Directive No. 43/2015."}
                      {reportSubPage === 2 && "Specify exact adjustments for management fees, brand royalties, and SEZ intercompany pricing streams."}
                      {reportSubPage === 3 && "Compile indexed working papers WP-01 through WP-08, e-invoicing data, and ERP ledger extractions."}
                      {reportSubPage === 4 && "Track statutory 3-stage supervisory review gatekeepers with interactive approval controls."}
                      {reportSubPage === 5 && "Generate formal MoR Form FR-04.5-20 Audit Report and dispatch to Taxpayer CFO."}
                    </p>
                  </div>
                </div>

                {/* Sub-Page Stepper Controls */}
                <div className="grid grid-cols-5 gap-2 pt-6 border-t border-purple-800/30 mt-4">
                  {[
                    { num: 1, label: "Findings & Citations", short: "Findings" },
                    { num: 2, label: "Stream Disallowance", short: "Disallowance" },
                    { num: 3, label: "Working Papers Index", short: "Working Papers" },
                    { num: 4, label: "Supervisory Review", short: "Review Chain" },
                    { num: 5, label: "Report Dispatch", short: "Generate Report" },
                  ].map(step => (
                    <button
                      key={step.num}
                      onClick={() => setReportSubPage(step.num)}
                      className={`flex flex-col items-center p-2.5 rounded-xl border text-left transition-all ${
                        reportSubPage === step.num
                          ? 'bg-purple-500/20 border-purple-400 text-white font-bold shadow-lg shadow-purple-900/30'
                          : reportSubPage > step.num
                          ? 'bg-purple-950/40 border-purple-700/50 text-purple-300 hover:bg-purple-900/30'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                          reportSubPage === step.num ? 'bg-purple-400 text-slate-950' : reportSubPage > step.num ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {step.num}
                        </span>
                        <span className="text-xs font-semibold truncate">{step.short}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 hidden sm:block truncate">{step.label}</span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Sub-Page 1: Findings & Statutory Legal Framework */}
              {reportSubPage === 1 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <FileText className="w-5 h-5 text-purple-600" />
                          Sub-Page 6.1: Statutory Grounds & Executive Audit Summary (Form FR-04.5-20)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Formulate legal basis and executive findings pursuant to Income Tax Proclamation 979/2016 Art. 79 & Directive 43/2015.
                        </p>
                      </div>
                      <Badge color="purple" className="font-mono">FORM FR-04.5-20 PART I</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Audited Taxable Period Scope" value={scopePeriod} onChange={(e) => setScopePeriod(e.target.value)} />
                      <Input label="Primary Statutory & Regulatory Citations" value={legalGrounds} onChange={(e) => setLegalGrounds(e.target.value)} />
                    </div>

                    <Textarea 
                      label="Executive Audit Findings Summary & Legal Rationale" 
                      rows={5} 
                      value={executiveSummary} 
                      onChange={(e) => setExecutiveSummary(e.target.value)} 
                    />

                    <div className="p-4 bg-purple-50/60 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-800 space-y-2">
                      <p className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider">
                        Statutory Audit Legal Framework Summary:
                      </p>
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        Under Article 79(1) of Income Tax Proclamation No. 979/2016, where conditions are made between related persons in their commercial or financial relations which differ from those which would be made between independent persons, the Ministry of Revenue may distribute, apportion, or allocate gross income or deductions to reflect arm's length conditions.
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="secondary" icon={RefreshCw} onClick={() => setReportVersion(v => v + 1)}>
                        Increment Draft Version (v{reportVersion + 1}.0)
                      </Button>
                      <Button variant="primary" icon={ArrowRight} className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setReportSubPage(2)}>
                        Proceed to Sub-Page 2 (Disallowance Breakdown) →
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Sub-Page 2: Intercompany Transaction Stream Disallowance Breakdown */}
              {reportSubPage === 2 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <Calculator className="w-5 h-5 text-purple-600" />
                          Sub-Page 6.2: Intercompany Transaction Stream Disallowance Table
                        </h3>
                        <p className="text-xs text-slate-500">
                          Detailed adjustment matrix for management fees, brand royalties, and commodity import pricing.
                        </p>
                      </div>
                      <Badge color="red" className="font-mono">152,300,000 ETB BASE ADJUSTMENT</Badge>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold uppercase">
                          <tr>
                            <th className="px-3 py-2">Stream ID</th>
                            <th className="px-3 py-2">Transaction Stream</th>
                            <th className="px-3 py-2">Category</th>
                            <th className="px-3 py-2 text-right">Reported Payment (ETB)</th>
                            <th className="px-3 py-2 text-right">Disallowance %</th>
                            <th className="px-3 py-2 text-right">Proposed Tax Base Addition</th>
                            <th className="px-3 py-2">Statutory Rationale</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {reportDisallowances.map((strm) => (
                            <tr key={strm.id} className="hover:bg-purple-50/40 dark:hover:bg-slate-800/40">
                              <td className="px-3 py-2 font-mono font-bold text-purple-600">{strm.id}</td>
                              <td className="px-3 py-2 font-bold text-slate-900 dark:text-white">{strm.streamName}</td>
                              <td className="px-3 py-2 text-slate-500">{strm.category}</td>
                              <td className="px-3 py-2 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">{formatRevenue(strm.amount)}</td>
                              <td className="px-3 py-2 text-right font-mono font-bold text-red-600">{strm.disallowancePct}%</td>
                              <td className="px-3 py-2 text-right font-mono font-bold text-purple-700 dark:text-purple-300">{formatRevenue((strm.amount * strm.disallowancePct) / 100)}</td>
                              <td className="px-3 py-2 text-slate-600 dark:text-slate-400 text-[11px] max-w-xs truncate" title={strm.justification}>{strm.justification}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-slate-100 dark:bg-slate-800/80 font-bold border-t-2 border-slate-300 dark:border-slate-600">
                          <tr>
                            <td className="px-3 py-2 text-slate-900 dark:text-white" colSpan={5}>Total Base Adjustment Disallowance:</td>
                            <td className="px-3 py-2 text-right font-mono text-sm text-purple-600">
                              {formatRevenue(reportDisallowances.reduce((acc, d) => acc + (d.amount * d.disallowancePct / 100), 0))} ETB
                            </td>
                            <td className="px-3 py-2 text-right">
                              <Badge color="red">CIT 30% Impact: {formatRevenue(reportDisallowances.reduce((acc, d) => acc + (d.amount * d.disallowancePct / 100), 0) * 0.3)} ETB</Badge>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="secondary" icon={ArrowLeft} onClick={() => setReportSubPage(1)}>← Back to Sub-Page 1</Button>
                      <Button variant="primary" icon={ArrowRight} className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setReportSubPage(3)}>
                        Proceed to Sub-Page 3 (Working Papers Index) →
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Sub-Page 3: Auditor Working Papers & Technical Evidence Index */}
              {reportSubPage === 3 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <Layers className="w-5 h-5 text-purple-600" />
                          Sub-Page 6.3: Auditor Working Papers & Technical Evidence Index (WP-01 to WP-08)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Cross-referenced technical audit working papers backing up all report findings.
                        </p>
                      </div>
                      <Badge color="green" className="font-mono">6 WORKING PAPERS LOCKED</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {reportWorkingPapers.map((wp) => (
                        <div key={wp.ref} className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-purple-600 bg-purple-100 dark:bg-purple-950/60 px-2 py-0.5 rounded">{wp.ref}</span>
                              <span className="text-xs font-bold text-slate-900 dark:text-white">{wp.name}</span>
                            </div>
                            <p className="text-[10px] text-slate-500">Sign-off: {wp.signoff}</p>
                          </div>
                          <Badge color="green" size="sm">{wp.status}</Badge>
                        </div>
                      ))}
                    </div>

                    <Textarea 
                      label="Exit Conference Summary & Taxpayer Technical Rebuttal Notes (WP-07)" 
                      rows={3} 
                      value={exitConferenceNotes} 
                      onChange={(e) => setExitConferenceNotes(e.target.value)} 
                    />

                    <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="secondary" icon={ArrowLeft} onClick={() => setReportSubPage(2)}>← Back to Sub-Page 2</Button>
                      <Button variant="primary" icon={ArrowRight} className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setReportSubPage(4)}>
                        Proceed to Sub-Page 4 (Supervisory Review Gatekeeper Tracker) →
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Sub-Page 4: Sequential Gatekeeper Approval Tracker */}
              {reportSubPage === 4 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-purple-600" />
                          Sub-Page 6.4: Sequential Gatekeeper Approval Tracker (Form FR-04.5-20 Multi-Level Sign-Off)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Mandatory 3-stage hierarchical authorization chain before formal dispatch to Taxpayer CFO.
                        </p>
                      </div>
                      <Badge color="purple" className="font-mono">{reportStatus}</Badge>
                    </div>

                    {/* Interactive Review Gatekeeper Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {/* Gatekeeper 1: Lead Auditor */}
                      <div className="p-4 bg-purple-50/70 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-200 text-[10px] font-bold rounded-full">
                            GATEKEEPER 1
                          </span>
                          <Badge color="green" size="sm">COMPLETED</Badge>
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-purple-950 dark:text-purple-200">1. Lead TP Auditor Sign-Off</h4>
                          <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{leadAuditorSignOff.name}</p>
                          <p className="text-[10px] text-slate-500">{leadAuditorSignOff.title}</p>
                          <p className="text-[10px] text-purple-700 dark:text-purple-400 font-mono mt-0.5">{leadAuditorSignOff.date}</p>
                        </div>
                        <div className="p-2 bg-white dark:bg-slate-900 rounded border border-purple-100 dark:border-purple-900 text-[11px] italic text-slate-600 dark:text-slate-400">
                          "{leadAuditorSignOff.comments}"
                        </div>
                      </div>

                      {/* Gatekeeper 2: Team Leader */}
                      <div className="p-4 bg-blue-50/70 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-200 text-[10px] font-bold rounded-full">
                            GATEKEEPER 2
                          </span>
                          <Badge color={teamLeaderSignOff.status === 'APPROVED' ? 'green' : 'blue'} size="sm">
                            {teamLeaderSignOff.status}
                          </Badge>
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-blue-950 dark:text-blue-200">2. Team Leader Technical Review</h4>
                          <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{teamLeaderSignOff.name}</p>
                          <p className="text-[10px] text-slate-500">{teamLeaderSignOff.title}</p>
                          <p className="text-[10px] text-blue-700 dark:text-blue-400 font-mono mt-0.5">{teamLeaderSignOff.date}</p>
                        </div>
                        <div className="p-2 bg-white dark:bg-slate-900 rounded border border-blue-100 dark:border-blue-900 text-[11px] italic text-slate-600 dark:text-slate-400">
                          "{teamLeaderSignOff.comments}"
                        </div>
                        {teamLeaderSignOff.status !== 'APPROVED' ? (
                          <div className="flex gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="w-1/2 text-rose-600 border-rose-300 hover:bg-rose-50 text-xs"
                              onClick={async () => {
                                await handlePost(`/report/1/team-leader-review`, { decision: 'RETURNED_FOR_REVISION', comments: 'Returned to lead auditor for working paper adjustments.' }, 'Report returned to auditor.');
                                setTeamLeaderSignOff(prev => ({ ...prev, status: 'RETURNED_FOR_REVISION' }));
                                setReportStatus('DRAFT');
                              }}
                            >
                              ↩ Return for Revision
                            </Button>
                            <Button 
                              variant="primary" 
                              size="sm" 
                              className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                              onClick={async () => {
                                await handlePost(`/report/1/team-leader-review`, { decision: 'APPROVE', comments: 'Supervisory review passed.' }, 'Team Leader Sign-off Recorded!');
                                setTeamLeaderSignOff(prev => ({ ...prev, status: 'APPROVED' }));
                                setReportStatus('TL_APPROVED');
                              }}
                            >
                              Authorize Sign-Off
                            </Button>
                          </div>
                        ) : null}
                      </div>

                      {/* Gatekeeper 3: Process Owner */}
                      <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 text-[10px] font-bold rounded-full">
                            GATEKEEPER 3
                          </span>
                          <Badge color={processOwnerSignOff.status === 'APPROVED' ? 'green' : 'amber'} size="sm">
                            {processOwnerSignOff.status}
                          </Badge>
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-emerald-950 dark:text-emerald-200">3. Process Owner Final Authorization</h4>
                          <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{processOwnerSignOff.name}</p>
                          <p className="text-[10px] text-slate-500">{processOwnerSignOff.title}</p>
                          <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">{processOwnerSignOff.date}</p>
                        </div>
                        <div className="p-2 bg-white dark:bg-slate-900 rounded border border-emerald-100 dark:border-emerald-900 text-[11px] italic text-slate-600 dark:text-slate-400">
                          "{processOwnerSignOff.comments}"
                        </div>
                        {processOwnerSignOff.status !== 'APPROVED' && (
                          <div className="flex gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="w-1/2 text-amber-600 border-amber-300 hover:bg-amber-50 text-xs"
                              onClick={async () => {
                                await handlePost(`/report/1/process-owner-review`, { decision: 'RETURNED_TO_TL', comments: 'Returned to Team Leader for technical clarification.' }, 'Report returned to Team Leader.');
                                setProcessOwnerSignOff(prev => ({ ...prev, status: 'RETURNED_TO_TL' }));
                                setReportStatus('TL_APPROVED');
                              }}
                            >
                              ↩ Reject to Team Leader
                            </Button>
                            <Button 
                              variant="primary" 
                              size="sm" 
                              className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                              disabled={teamLeaderSignOff.status !== 'APPROVED'}
                              onClick={async () => {
                                await handlePost(`/report/1/process-owner-review`, { decision: 'APPROVE', comments: 'Process owner final approval granted.' }, 'Process Owner Authorization Granted!');
                                setProcessOwnerSignOff(prev => ({ ...prev, status: 'APPROVED' }));
                                setReportStatus('PO_APPROVED');
                              }}
                            >
                              Grant Final Authorization
                            </Button>
                          </div>
                        )}
                      </div>

                    </div>

                    <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="secondary" icon={ArrowLeft} onClick={() => setReportSubPage(3)}>← Back to Sub-Page 3</Button>
                      <Button variant="primary" icon={ArrowRight} className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setReportSubPage(5)}>
                        Proceed to Sub-Page 5 (Generate & Dispatch Document) →
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Sub-Page 5: Report Document Generation & Formal Dispatch */}
              {reportSubPage === 5 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <Send className="w-5 h-5 text-purple-600" />
                          Sub-Page 6.5: MoR Form FR-04.5-20 Document Generation & Dispatch Engine
                        </h3>
                        <p className="text-xs text-slate-500">
                          Finalize statutory audit report document and register in Document Management System (DMS).
                        </p>
                      </div>
                      <Badge color="purple" className="font-mono">READY FOR DISPATCH</Badge>
                    </div>

                    {/* Document Preview Artifact Box */}
                    <div className="p-5 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 space-y-4 font-mono text-xs shadow-inner">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-purple-400" />
                          <span className="font-bold text-white">MINISTRY OF REVENUE — ETHIOPIA</span>
                        </div>
                        <span className="text-[10px] text-slate-400">FORM FR-04.5-20 (REV 2026)</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-[11px] text-slate-300">
                        <div>
                          <p><span className="text-slate-500">Taxpayer:</span> Crest Textiles SC (TIN: ETH030999)</p>
                          <p><span className="text-slate-500">Audit Scope:</span> FY 2020 – FY 2024 (5 Tax Years)</p>
                          <p><span className="text-slate-500">Lead Auditor:</span> Tadesse Mamo (Senior TP Auditor)</p>
                        </div>
                        <div className="text-right">
                          <p><span className="text-slate-500">Document Ref:</span> MoR/LTO/TP-RPT/2026/089</p>
                          <p><span className="text-slate-500">Total Tax Base Adjustment:</span> <span className="text-purple-400 font-bold">152,300,000 ETB</span></p>
                          <p><span className="text-slate-500">CIT Tax Liability (30%):</span> <span className="text-emerald-400 font-bold">45,690,000 ETB</span></p>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-300 space-y-1">
                        <p className="font-bold text-purple-300 uppercase">Audit Decision Summary:</p>
                        <p>{executiveSummary}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 text-[10px] text-slate-400 border-t border-slate-800">
                        <span>Digital Signatures Verified: Lead Auditor ✔ | Team Leader ✔ | Process Owner ✔</span>
                        <span className="text-emerald-400 font-bold">DMS REF: DMS-2026-TP-9921</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="secondary" icon={ArrowLeft} onClick={() => setReportSubPage(4)}>← Back to Sub-Page 4</Button>
                      <Button 
                        variant="primary" 
                        icon={Send} 
                        loading={loading}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 shadow-lg shadow-purple-900/30"
                        onClick={async () => {
                          await handlePost('/report/draft', { reportStatus: 'FINAL_AUTHORIZED', subPageCompleted: 5, executiveSummary, legalGrounds }, 'Phase 6 (TP Audit Report Form FR-04.5-20) Fully Authorized & Submitted! Transitioning to Phase 7 (Assessment Calculation)...');
                          setReportStatus('FINAL_AUTHORIZED');
                          setActiveTab('ASSESSMENT');
                        }}
                      >
                        Authorize & Issue Form FR-04.5-20 Audit Report
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Phase 7: Assessment Calculation & Penalty Engine - Enterprise 5-Sub-Page Process Stepper */}
          {activeTab === 'ASSESSMENT' && (
            <div className="space-y-6">
              {/* 1. Sub-Page Stepper Header */}
              <Card className="p-6 bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border-amber-800/40 text-white shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-mono font-semibold rounded-full">
                        PHASE 7: STATUTORY ASSESSMENT & PENALTY ENGINE (PROC. 979/2016)
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Step {assessmentSubPage} of 5</span>
                      <Badge color="amber" className="font-mono">{assessmentStatus}</Badge>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight pt-1">
                      {assessmentSubPage === 1 && "Sub-Page 1: Multi-Year Taxable Income Adjustment Engine (FY 2020 – 2024)"}
                      {assessmentSubPage === 2 && "Sub-Page 2: Corporate Income Tax (CIT 30%) Arm's Length Liability Engine"}
                      {assessmentSubPage === 3 && "Sub-Page 3: Statutory Understatement Penalty Engine (Proclamation 979/2016 Art. 108)"}
                      {assessmentSubPage === 4 && "Sub-Page 4: Compounding Late Payment Interest Calculator (Art. 110)"}
                      {assessmentSubPage === 5 && "Sub-Page 5: Final Tax & Penalty Demand Notice Authorization"}
                    </h2>
                    <p className="text-xs text-slate-300">
                      {assessmentSubPage === 1 && "Aggregate multi-year profit adjustments derived from intercompany disallowance findings."}
                      {assessmentSubPage === 2 && "Calculate statutory 30% Corporate Income Tax liability on gross taxable adjustments."}
                      {assessmentSubPage === 3 && "Compute statutory 20% Understatement Penalty under Art. 108 for substantial tax deficiency."}
                      {assessmentSubPage === 4 && "Calculate compounding late payment interest factor under Art. 110 based on MoR benchmark rate."}
                      {assessmentSubPage === 5 && "Authorize final Tax & Penalty Demand and save calculation engine state to Core Server."}
                    </p>
                  </div>
                </div>

                {/* Sub-Page Stepper Controls */}
                <div className="grid grid-cols-5 gap-2 pt-6 border-t border-amber-800/30 mt-4">
                  {[
                    { num: 1, label: "Base Adjustment", short: "Tax Base" },
                    { num: 2, label: "CIT Tax (30%)", short: "CIT Liability" },
                    { num: 3, label: "Penalty (Art. 108)", short: "Penalty" },
                    { num: 4, label: "Late Interest (Art. 110)", short: "Interest" },
                    { num: 5, label: "Final Tax Demand", short: "Final Demand" },
                  ].map(step => (
                    <button
                      key={step.num}
                      onClick={() => setAssessmentSubPage(step.num)}
                      className={`flex flex-col items-center p-2.5 rounded-xl border text-left transition-all ${
                        assessmentSubPage === step.num
                          ? 'bg-amber-500/20 border-amber-400 text-white font-bold shadow-lg shadow-amber-900/30'
                          : assessmentSubPage > step.num
                          ? 'bg-amber-950/40 border-amber-700/50 text-amber-300 hover:bg-amber-900/30'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                          assessmentSubPage === step.num ? 'bg-amber-400 text-slate-950' : assessmentSubPage > step.num ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {step.num}
                        </span>
                        <span className="text-xs font-semibold truncate">{step.short}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 hidden sm:block truncate">{step.label}</span>
                    </button>
                  ))}
                </div>
              </Card>

              {(() => {
                const corpTax = taxAdjustment * (citRatePct / 100);
                const penalty = corpTax * (penaltyRatePct / 100);
                const interest = (corpTax + penalty) * (interestRatePct / 100);
                const totalDemand = corpTax + penalty + interest;

                return (
                  <>
                    {/* Sub-Page 1: Multi-Year Tax Base Adjustment Breakdown */}
                    {assessmentSubPage === 1 && (
                      <div className="space-y-6">
                        <Card className="p-6 space-y-5">
                          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div>
                              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <Calculator className="w-5 h-5 text-amber-600" />
                                Sub-Page 7.1: Multi-Year Arm's Length Base Tax Adjustment Matrix
                              </h3>
                              <p className="text-xs text-slate-500">
                                Year-by-year transfer pricing profit adjustment allocation pursuant to Income Tax Proclamation 979/2016.
                              </p>
                            </div>
                            <Badge color="purple" className="font-mono">5 TAXABLE YEARS AUDITED</Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input 
                              label="Total Base Adjustment Aggregate (ETB)" 
                              type="number" 
                              value={taxAdjustment} 
                              onChange={(e) => setTaxAdjustment(parseFloat(e.target.value) || 0)} 
                            />
                            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800 flex flex-col justify-center">
                              <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 uppercase">Average Annual Uplift</span>
                              <span className="text-lg font-bold text-amber-600 font-mono">{formatRevenue(taxAdjustment / 5)} ETB / Year</span>
                            </div>
                            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-800 flex flex-col justify-center">
                              <span className="text-[11px] font-bold text-purple-900 dark:text-purple-300 uppercase">Statutory Method Used</span>
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">TNMM (Operating Margin) + CUP</span>
                            </div>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold uppercase">
                                <tr>
                                  <th className="px-3 py-2">Taxable Year</th>
                                  <th className="px-3 py-2 text-right">Base Adjustment (ETB)</th>
                                  <th className="px-3 py-2 text-right">CIT Tax (30%)</th>
                                  <th className="px-3 py-2 text-right">Understatement Penalty (20%)</th>
                                  <th className="px-3 py-2 text-right">Late Interest (15%)</th>
                                  <th className="px-3 py-2 text-right">Total Assessment (ETB)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {assessmentYears.map((yr) => (
                                  <tr key={yr.year} className="hover:bg-amber-50/40 dark:hover:bg-slate-800/40">
                                    <td className="px-3 py-2 font-bold text-slate-900 dark:text-white font-mono">{yr.year}</td>
                                    <td className="px-3 py-2 text-right font-mono text-slate-800 dark:text-slate-200">{formatRevenue(yr.adjustment)}</td>
                                    <td className="px-3 py-2 text-right font-mono text-blue-600 font-semibold">{formatRevenue(yr.citTax)}</td>
                                    <td className="px-3 py-2 text-right font-mono text-amber-600 font-semibold">{formatRevenue(yr.penalty)}</td>
                                    <td className="px-3 py-2 text-right font-mono text-purple-600 font-semibold">{formatRevenue(yr.interest)}</td>
                                    <td className="px-3 py-2 text-right font-mono font-bold text-emerald-600">{formatRevenue(yr.total)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                            <Button variant="primary" icon={ArrowRight} className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => setAssessmentSubPage(2)}>
                              Proceed to Sub-Page 2 (CIT Tax 30% Engine) →
                            </Button>
                          </div>
                        </Card>
                      </div>
                    )}

                    {/* Sub-Page 2: CIT Tax Liability Computation */}
                    {assessmentSubPage === 2 && (
                      <div className="space-y-6">
                        <Card className="p-6 space-y-5">
                          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div>
                              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <Calculator className="w-5 h-5 text-amber-600" />
                                Sub-Page 7.2: Corporate Income Tax (CIT 30%) Arm's Length Liability Engine
                              </h3>
                              <p className="text-xs text-slate-500">
                                Primary tax liability computed on additional profits under Income Tax Proclamation No. 979/2016.
                              </p>
                            </div>
                            <Badge color="blue" className="font-mono">STATUTORY RATE 30%</Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input 
                              label="Corporate Income Tax Rate (%)" 
                              type="number" 
                              value={citRatePct} 
                              onChange={(e) => setCitRatePct(parseFloat(e.target.value) || 30)} 
                            />
                            <div className="p-3.5 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800 flex flex-col justify-center">
                              <span className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase">Calculated CIT Tax Principal</span>
                              <span className="text-2xl font-bold text-blue-600 font-mono">{formatRevenue(corpTax)} ETB</span>
                            </div>
                          </div>

                          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                            <p className="font-bold text-slate-800 dark:text-slate-200 uppercase">CIT Computation Breakdown Rationale:</p>
                            <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                              <li>Base Profit Adjustment: <span className="font-mono font-bold">{formatRevenue(taxAdjustment)} ETB</span></li>
                              <li>Statutory Corporate Income Tax Rate: <span className="font-mono font-bold">{citRatePct}%</span></li>
                              <li>Resulting Principal Tax Deficit: <span className="font-mono font-bold text-blue-600">{formatRevenue(corpTax)} ETB</span></li>
                            </ul>
                          </div>

                          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                            <Button variant="secondary" icon={ArrowLeft} onClick={() => setAssessmentSubPage(1)}>← Back to Sub-Page 1</Button>
                            <Button variant="primary" icon={ArrowRight} className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => setAssessmentSubPage(3)}>
                              Proceed to Sub-Page 3 (Statutory Penalty Engine) →
                            </Button>
                          </div>
                        </Card>
                      </div>
                    )}

                    {/* Sub-Page 3: Statutory Understatement Penalty Engine */}
                    {assessmentSubPage === 3 && (
                      <div className="space-y-6">
                        <Card className="p-6 space-y-5">
                          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div>
                              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-amber-600" />
                                Sub-Page 7.3: Statutory Understatement Penalty Engine (Proclamation No. 979/2016 Art. 108)
                              </h3>
                              <p className="text-xs text-slate-500">
                                Mandatory fine applied for substantial tax understatement exceeding statutory thresholds.
                              </p>
                            </div>
                            <Badge color="amber" className="font-mono">ARTICLE 108 PENALTY</Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input 
                              label="Understatement Penalty Rate (%)" 
                              type="number" 
                              value={penaltyRatePct} 
                              onChange={(e) => setPenaltyRatePct(parseFloat(e.target.value) || 20)} 
                            />
                            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800 flex flex-col justify-center">
                              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase">Calculated Understatement Fine</span>
                              <span className="text-2xl font-bold text-amber-600 font-mono">{formatRevenue(penalty)} ETB</span>
                            </div>
                          </div>

                          <Textarea 
                            label="Statutory Penalty Imposition Rationale (Art. 108)" 
                            rows={3} 
                            value={penaltyReasoning} 
                            onChange={(e) => setPenaltyReasoning(e.target.value)} 
                          />

                          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                            <Button variant="secondary" icon={ArrowLeft} onClick={() => setAssessmentSubPage(2)}>← Back to Sub-Page 2</Button>
                            <Button variant="primary" icon={ArrowRight} className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => setAssessmentSubPage(4)}>
                              Proceed to Sub-Page 4 (Compounding Interest Engine) →
                            </Button>
                          </div>
                        </Card>
                      </div>
                    )}

                    {/* Sub-Page 4: Compounding Late Payment Interest Engine */}
                    {assessmentSubPage === 4 && (
                      <div className="space-y-6">
                        <Card className="p-6 space-y-5">
                          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div>
                              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <Calculator className="w-5 h-5 text-amber-600" />
                                Sub-Page 7.4: Compounding Late Payment Interest Calculator (Proclamation No. 979/2016 Art. 110)
                              </h3>
                              <p className="text-xs text-slate-500">
                                Late payment interest calculated from statutory tax due dates across FY 2020 to FY 2024.
                              </p>
                            </div>
                            <Badge color="purple" className="font-mono">ARTICLE 110 INTEREST</Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input 
                              label="Compounding Interest Rate (% p.a.)" 
                              type="number" 
                              value={interestRatePct} 
                              onChange={(e) => setInterestRatePct(parseFloat(e.target.value) || 15)} 
                            />
                            <div className="p-3.5 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-800 flex flex-col justify-center">
                              <span className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase">Calculated Compounding Late Interest</span>
                              <span className="text-2xl font-bold text-purple-600 font-mono">{formatRevenue(interest)} ETB</span>
                            </div>
                          </div>

                          <Textarea 
                            label="Interest Computation Legal Basis & Rate Reference" 
                            rows={3} 
                            value={interestCalculationBasis} 
                            onChange={(e) => setInterestCalculationBasis(e.target.value)} 
                          />

                          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                            <Button variant="secondary" icon={ArrowLeft} onClick={() => setAssessmentSubPage(3)}>← Back to Sub-Page 3</Button>
                            <Button variant="primary" icon={ArrowRight} className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => setAssessmentSubPage(5)}>
                              Proceed to Sub-Page 5 (Final Assessment Demand Authorization) →
                            </Button>
                          </div>
                        </Card>
                      </div>
                    )}

                    {/* Sub-Page 5: Final Tax Demand Summary & Authorization */}
                    {assessmentSubPage === 5 && (
                      <div className="space-y-6">
                        <Card className="p-6 space-y-5">
                          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div>
                              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <Send className="w-5 h-5 text-amber-600" />
                                Sub-Page 7.5: Statutory Tax Assessment Demand Notice Authorization
                              </h3>
                              <p className="text-xs text-slate-500">
                                Authorize final transfer pricing tax demand and persist calculation results to backend server.
                              </p>
                            </div>
                            <Badge color="emerald" className="font-mono">FINAL DEMAND READY</Badge>
                          </div>

                          {/* Executive Assessment Demand Calculation Panel */}
                          <div className="p-5 bg-slate-900 text-white rounded-xl space-y-4 font-mono shadow-inner border border-slate-800">
                            <div className="flex justify-between items-center border-b border-slate-800 pb-3 text-xs">
                              <span className="text-slate-400 font-bold uppercase">Assessment Demand Breakdown</span>
                              <span className="text-amber-400 font-bold">CASE ID: TP-CASE-2026-901</span>
                            </div>

                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between text-slate-300">
                                <span>1. Gross Arm's Length Base Tax Adjustment:</span>
                                <span className="text-purple-300 font-bold">{formatRevenue(taxAdjustment)} ETB</span>
                              </div>
                              <div className="flex justify-between text-slate-300">
                                <span>2. Corporate Income Tax (CIT {citRatePct}%):</span>
                                <span className="text-blue-400 font-bold">{formatRevenue(corpTax)} ETB</span>
                              </div>
                              <div className="flex justify-between text-slate-300">
                                <span>3. Understatement Penalty (Art. 108 @ {penaltyRatePct}%):</span>
                                <span className="text-amber-400 font-bold">{formatRevenue(penalty)} ETB</span>
                              </div>
                              <div className="flex justify-between text-slate-300">
                                <span>4. Compounding Late Payment Interest (Art. 110 @ {interestRatePct}%):</span>
                                <span className="text-purple-400 font-bold">{formatRevenue(interest)} ETB</span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center text-lg font-bold border-t-2 border-slate-800 pt-3 text-emerald-400">
                              <span>CUMULATIVE STATUTORY TAX DEMAND:</span>
                              <span className="text-2xl font-bold">{formatRevenue(totalDemand)} ETB</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                            <Button variant="secondary" icon={ArrowLeft} onClick={() => setAssessmentSubPage(4)}>← Back to Sub-Page 4</Button>
                            <Button 
                              variant="primary" 
                              icon={Send} 
                              loading={loading}
                              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 shadow-lg shadow-amber-900/30"
                              onClick={async () => {
                                await handlePost('/assessment/save', { adjustment: taxAdjustment, corpTax, penalty, interest, totalDemand }, `Phase 7 (Assessment Engine) Completed! Total Tax Demand: ${formatRevenue(totalDemand)} ETB. Transitioning to Phase 8 (Notice Generation)...`);
                                setAssessmentStatus('AUTHORIZED');
                                setActiveTab('NOTICE');
                              }}
                            >
                              Authorize Statutory Assessment & Proceed to Notice (Phase 8) →
                            </Button>
                          </div>
                        </Card>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* Phase 8: Notice Generation & Objections - Enterprise 5-Sub-Page Process Stepper */}
          {activeTab === 'NOTICE' && (
            <div className="space-y-6">
              {/* 1. Sub-Page Stepper Header */}
              <Card className="p-6 bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 border-red-800/40 text-white shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-400/30 text-xs font-mono font-semibold rounded-full">
                        PHASE 8: STATUTORY NOTICE & OBJECTION DISPATCH ENGINE
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Step {noticeSubPage} of 5</span>
                      <Badge color="red" className="font-mono">{taxpayerObjectionStatus}</Badge>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight pt-1">
                      {noticeSubPage === 1 && "Sub-Page 1: MoR Assessment Notice Parameter Configuration (Form FR-04.5-23)"}
                      {noticeSubPage === 2 && "Sub-Page 2: Statutory 30-Day Objection Countdown Tracker (Proclamation 979/2016 Art. 115)"}
                      {noticeSubPage === 3 && "Sub-Page 3: Taxpayer Formal Objection Brief & Technical Rebuttal Engine"}
                      {noticeSubPage === 4 && "Sub-Page 4: Tax Fraud Referral & Criminal Investigation Trigger (Form FR-04.5-22)"}
                      {noticeSubPage === 5 && "Sub-Page 5: Formal Notice Dispatch Authorization & Digital Delivery Log"}
                    </h2>
                    <p className="text-xs text-slate-300">
                      {noticeSubPage === 1 && "Configure official notice reference numbers, taxpayer TIN details, and delivery channels."}
                      {noticeSubPage === 2 && "Initiate statutory 30-day countdown timer for taxpayer objection filing under Art. 115."}
                      {noticeSubPage === 3 && "Review taxpayer objection letters, legal arguments, and auditor technical rebuttal notes."}
                      {noticeSubPage === 4 && "Escalate severe non-compliance cases to MoR Tax Fraud & Criminal Investigation Division."}
                      {noticeSubPage === 5 && "Formally dispatch Assessment Notice and register dispatch proof in Document Vault."}
                    </p>
                  </div>
                </div>

                {/* Sub-Page Stepper Controls */}
                <div className="grid grid-cols-5 gap-2 pt-6 border-t border-red-800/30 mt-4">
                  {[
                    { num: 1, label: "Notice Config", short: "Notice Config" },
                    { num: 2, label: "30-Day Window", short: "30-Day Window" },
                    { num: 3, label: "Taxpayer Objection", short: "Objections" },
                    { num: 4, label: "Fraud Referral", short: "Fraud Referral" },
                    { num: 5, label: "Notice Dispatch", short: "Dispatch Notice" },
                  ].map(step => (
                    <button
                      key={step.num}
                      onClick={() => setNoticeSubPage(step.num)}
                      className={`flex flex-col items-center p-2.5 rounded-xl border text-left transition-all ${
                        noticeSubPage === step.num
                          ? 'bg-red-500/20 border-red-400 text-white font-bold shadow-lg shadow-red-900/30'
                          : noticeSubPage > step.num
                          ? 'bg-red-950/40 border-red-700/50 text-red-300 hover:bg-red-900/30'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                          noticeSubPage === step.num ? 'bg-red-400 text-slate-950' : noticeSubPage > step.num ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {step.num}
                        </span>
                        <span className="text-xs font-semibold truncate">{step.short}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 hidden sm:block truncate">{step.label}</span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Sub-Page 1: Notice Parameter Configuration */}
              {noticeSubPage === 1 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <Scale className="w-5 h-5 text-red-600" />
                          Sub-Page 8.1: MoR Form FR-04.5-23 Assessment Notice Configuration Matrix
                        </h3>
                        <p className="text-xs text-slate-500">
                          Set formal notice reference, statutory filing deadlines, and dispatch parameters.
                        </p>
                      </div>
                      <Badge color="red" className="font-mono">FORM FR-04.5-23</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input label="Notice Reference ID" value={noticeReferenceId} onChange={(e) => setNoticeReferenceId(e.target.value)} />
                      <Input label="Statutory Dispatch Date" type="date" value={noticeDispatchDate} onChange={(e) => setNoticeDispatchDate(e.target.value)} />
                      <Input label="Statutory Objection Window (Days)" type="number" value={objectionWindowDays} onChange={(e) => setObjectionWindowDays(parseInt(e.target.value) || 30)} />
                    </div>

                    <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-3 font-mono text-xs shadow-inner">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-slate-400 font-bold uppercase">Assessment Demand Attached:</span>
                        <span className="text-emerald-400 font-bold">63,052,200 ETB</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-slate-300">
                        <p><span className="text-slate-500">Taxpayer:</span> Crest Textiles SC (ETH030999)</p>
                        <p><span className="text-slate-500">Objection Deadline:</span> <span className="text-amber-400 font-bold">{objectionFilingDeadline}</span></p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="primary" icon={ArrowRight} className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setNoticeSubPage(2)}>
                        Proceed to Sub-Page 2 (Statutory 30-Day Window) →
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Sub-Page 2: 30-Day Statutory Objection Countdown Tracker */}
              {noticeSubPage === 2 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <Clock className="w-5 h-5 text-red-600" />
                          Sub-Page 8.2: Statutory 30-Day Objection Countdown Tracker (Art. 115)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Real-time SLA monitoring for taxpayer administrative objection filing window.
                        </p>
                      </div>
                      <Badge color="red" className="font-mono">COUNTDOWN ACTIVE</Badge>
                    </div>

                    <div className="p-6 bg-slate-900 text-white rounded-xl text-center space-y-3 border border-slate-800">
                      <span className="text-xs font-mono text-red-400 uppercase font-bold tracking-widest">Statutory Time Remaining</span>
                      <p className="text-4xl font-extrabold text-red-500 font-mono tracking-tight">28 DAYS : 14 HRS : 32 MINS</p>
                      <p className="text-xs text-slate-400">
                        Statutory deadline under Income Tax Proclamation No. 979/2016 Article 115 expires on <span className="text-white font-bold">{objectionFilingDeadline}</span>.
                      </p>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="secondary" icon={ArrowLeft} onClick={() => setNoticeSubPage(1)}>← Back to Sub-Page 1</Button>
                      <Button variant="primary" icon={ArrowRight} className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setNoticeSubPage(3)}>
                        Proceed to Sub-Page 3 (Taxpayer Objections) →
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Sub-Page 3: Taxpayer Formal Objection Brief & Technical Rebuttal */}
              {noticeSubPage === 3 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <FileText className="w-5 h-5 text-red-600" />
                          Sub-Page 8.3: Taxpayer Formal Objection Brief & Technical Rebuttal Engine
                        </h3>
                        <p className="text-xs text-slate-500">
                          Process formal objection brief submitted by taxpayer and compose technical auditor rebuttal.
                        </p>
                      </div>
                      <Badge color="amber" className="font-mono">OBJECTION LODGED</Badge>
                    </div>

                    <Textarea 
                      label="Taxpayer Objection Brief Summary (Grounds of Dispute)" 
                      rows={3} 
                      value={taxpayerObjectionGrounds} 
                      onChange={(e) => setTaxpayerObjectionGrounds(e.target.value)} 
                    />

                    <Textarea 
                      label="Lead Auditor Statutory Rebuttal & Legal Opinion" 
                      rows={3} 
                      value={auditorRebuttalGrounds} 
                      onChange={(e) => setAuditorRebuttalGrounds(e.target.value)} 
                    />

                    <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="secondary" icon={ArrowLeft} onClick={() => setNoticeSubPage(2)}>← Back to Sub-Page 2</Button>
                      <Button variant="primary" icon={ArrowRight} className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setNoticeSubPage(4)}>
                        Proceed to Sub-Page 4 (Fraud Referral) →
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Sub-Page 4: Tax Fraud Referral & Criminal Investigation Trigger */}
              {noticeSubPage === 4 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <AlertOctagon className="w-5 h-5 text-rose-600" />
                          Sub-Page 8.4: Tax Fraud Referral & Criminal Investigation Trigger (Form FR-04.5-22)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Escalate cases involving deliberate profit stripping or fraudulent schemes to MoR Criminal Investigation Division.
                        </p>
                      </div>
                      <Badge color="red" className="font-mono">FORM FR-04.5-22</Badge>
                    </div>

                    <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800 space-y-2">
                      <p className="text-xs font-bold text-rose-900 dark:text-rose-300 uppercase">Criminal Referral Assessment Criteria:</p>
                      <p className="text-xs text-slate-700 dark:text-slate-300">{fraudReferralNotes}</p>
                    </div>

                    <Textarea 
                      label="Detailed Fraud Investigation Referral Justification" 
                      rows={3} 
                      value={fraudReferralNotes} 
                      onChange={(e) => setFraudReferralNotes(e.target.value)} 
                    />

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="secondary" icon={ArrowLeft} onClick={() => setNoticeSubPage(3)}>← Back to Sub-Page 3</Button>
                      <div className="flex gap-3">
                        <Button 
                          variant="danger" 
                          icon={AlertOctagon} 
                          className="bg-rose-700 hover:bg-rose-800 text-white shadow-lg"
                          onClick={async () => {
                            await handlePost('/notice/fraud-referral', { status: 'ESCALATED', notes: fraudReferralNotes }, 'Form FR-04.5-22 Criminal Referral Submitted to MoR Tax Fraud Division!');
                            setFraudEscalationStatus('ESCALATED');
                          }}
                        >
                          Trigger Form FR-04.5-22 Criminal Fraud Referral
                        </Button>
                        <Button variant="primary" icon={ArrowRight} className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setNoticeSubPage(5)}>
                          Proceed to Sub-Page 5 (Dispatch Notice) →
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Sub-Page 5: Notice Dispatch Authorization & Digital Delivery */}
              {noticeSubPage === 5 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <Send className="w-5 h-5 text-red-600" />
                          Sub-Page 8.5: Assessment Notice Dispatch Authorization & Automated Delivery Log
                        </h3>
                        <p className="text-xs text-slate-500">
                          Authorize notice dispatch and generate digital delivery receipt in Document Vault.
                        </p>
                      </div>
                      <Badge color="emerald" className="font-mono">READY FOR DISPATCH</Badge>
                    </div>

                    <div className="p-5 bg-slate-900 text-white rounded-xl font-mono text-xs space-y-3 border border-slate-800">
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400 font-bold uppercase">Dispatch Status Summary</span>
                        <span className="text-emerald-400 font-bold">NOTICE REF: {noticeReferenceId}</span>
                      </div>
                      <p><span className="text-slate-500">Target Taxpayer:</span> Crest Textiles SC (TIN: ETH030999)</p>
                      <p><span className="text-slate-500">Delivery Channels:</span> Physical Hand Delivery (LTO Courier) + SIGTAS Portal Electronic Delivery</p>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="secondary" icon={ArrowLeft} onClick={() => setNoticeSubPage(4)}>← Back to Sub-Page 4</Button>
                      <Button 
                        variant="primary" 
                        icon={Send} 
                        loading={loading}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 shadow-lg shadow-red-900/30"
                        onClick={async () => {
                          await handlePost('/notice/generate', { noticeReference: noticeReferenceId, objectionWindowDays }, `Notice ${noticeReferenceId} Issued & Statutory 30-Day Objection Window Started! Transitioning to Phase 9 (Case Completion)...`);
                          setTaxpayerObjectionStatus('PENDING');
                          setActiveTab('COMPLETION');
                        }}
                      >
                        Issue Assessment Notice & Start 30-Day Window (Phase 9) →
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Phase 9: Case Completion & Appeals - Enterprise 5-Sub-Page Process Stepper */}
          {activeTab === 'COMPLETION' && (
            <div className="space-y-6">
              {/* 1. Sub-Page Stepper Header */}
              <Card className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-emerald-800/40 text-white shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-mono font-semibold rounded-full">
                        PHASE 9: AUDIT CASE CLOSURE & APPEALS ENGINE
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Step {completionSubPage} of 5</span>
                      <Badge color="emerald" className="font-mono">{arcStatus}</Badge>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight pt-1">
                      {completionSubPage === 1 && "Sub-Page 1: Administrative Review Committee (ARC) Settlement Workflow"}
                      {completionSubPage === 2 && "Sub-Page 2: Tax Appeal Commission Litigation & Appellate Defense Tracker"}
                      {completionSubPage === 3 && "Sub-Page 3: SIGTAS Tax Payment Settlement & Collection Receipt Verification"}
                      {completionSubPage === 4 && "Sub-Page 4: 10-Year Statutory Audit Trail & Cryptographic Vault Archival"}
                      {completionSubPage === 5 && "Sub-Page 5: Formal Case Closure Certificate & Enterprise System Lock Sign-Off"}
                    </h2>
                    <p className="text-xs text-slate-300">
                      {completionSubPage === 1 && "Process taxpayer administrative compromise settlement through the MoR ARC committee."}
                      {completionSubPage === 2 && "Track Tax Appeal Commission litigation status and legal defense strategy."}
                      {completionSubPage === 3 && "Verify actual tax payment receipt reference via SIGTAS core revenue integration."}
                      {completionSubPage === 4 && "Archive complete working paper package for statutory 10-year retention under Art. 47."}
                      {completionSubPage === 5 && "Execute formal Case Closure Certificate and mark audit case as formally CLOSED."}
                    </p>
                  </div>
                </div>

                {/* Sub-Page Stepper Controls */}
                <div className="grid grid-cols-5 gap-2 pt-6 border-t border-emerald-800/30 mt-4">
                  {[
                    { num: 1, label: "ARC Settlement", short: "ARC Review" },
                    { num: 2, label: "Tax Appeal", short: "Appellate" },
                    { num: 3, label: "SIGTAS Collection", short: "Tax Payment" },
                    { num: 4, label: "Digital Vault", short: "Archival" },
                    { num: 5, label: "Case Closure", short: "Close Case" },
                  ].map(step => (
                    <button
                      key={step.num}
                      onClick={() => setCompletionSubPage(step.num)}
                      className={`flex flex-col items-center p-2.5 rounded-xl border text-left transition-all ${
                        completionSubPage === step.num
                          ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold shadow-lg shadow-emerald-900/30'
                          : completionSubPage > step.num
                          ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/30'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                          completionSubPage === step.num ? 'bg-emerald-400 text-slate-950' : completionSubPage > step.num ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {step.num}
                        </span>
                        <span className="text-xs font-semibold truncate">{step.short}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 hidden sm:block truncate">{step.label}</span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Sub-Page 1: ARC Settlement Workflow */}
              {completionSubPage === 1 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <Scale className="w-5 h-5 text-emerald-600" />
                          Sub-Page 9.1: Administrative Review Committee (ARC) Settlement Workflow
                        </h3>
                        <p className="text-xs text-slate-500">
                          Record agreed compromise settlement approved by MoR ARC leadership.
                        </p>
                      </div>
                      <Badge color="emerald" className="font-mono">ARC SETTLED</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Agreed Compromise Settlement Amount (ETB)" type="number" value={agreedSettlementAmount} onChange={(e) => setAgreedSettlementAmount(parseFloat(e.target.value) || 0)} />
                      <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 flex flex-col justify-center">
                        <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase">Confirmed Settlement Revenue</span>
                        <span className="text-2xl font-bold text-emerald-600 font-mono">{formatRevenue(agreedSettlementAmount)} ETB</span>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                      <p className="font-bold text-slate-800 dark:text-slate-200 uppercase">ARC Settlement Agreement Summary:</p>
                      <p className="text-slate-600 dark:text-slate-400">
                        Taxpayer agreed to withdraw statutory objections upon 50% waiver of Art. 108 understatement penalties, resulting in final recovery of <span className="font-mono font-bold text-emerald-600">{formatRevenue(agreedSettlementAmount)} ETB</span>.
                      </p>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="primary" icon={ArrowRight} className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setCompletionSubPage(2)}>
                        Proceed to Sub-Page 2 (Tax Appeal Commission) →
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Sub-Page 2: Tax Appeal Commission Litigation */}
              {completionSubPage === 2 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-emerald-600" />
                          Sub-Page 9.2: Tax Appeal Commission Litigation & Appellate Tracker
                        </h3>
                        <p className="text-xs text-slate-500">
                          Track appellate court status for contested transfer pricing tax assessments.
                        </p>
                      </div>
                      <Badge color="blue" className="font-mono">NO ACTIVE APPEAL</Badge>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800 text-xs space-y-2">
                      <p className="font-bold text-blue-900 dark:text-blue-300 uppercase">Appellate Review Legal Status:</p>
                      <p className="text-slate-700 dark:text-slate-300">
                        Taxpayer did not file an appeal with the Federal Tax Appeal Commission within the statutory 30-day window. The ARC settlement agreement is legally binding and final.
                      </p>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="secondary" icon={ArrowLeft} onClick={() => setCompletionSubPage(1)}>← Back to Sub-Page 1</Button>
                      <Button variant="primary" icon={ArrowRight} className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setCompletionSubPage(3)}>
                        Proceed to Sub-Page 3 (SIGTAS Payment) →
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Sub-Page 3: SIGTAS Tax Payment Settlement */}
              {completionSubPage === 3 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          Sub-Page 9.3: SIGTAS Core Revenue System Tax Collection Verification
                        </h3>
                        <p className="text-xs text-slate-500">
                          Verify bank transfer and SIGTAS official tax payment receipt integration.
                        </p>
                      </div>
                      <Badge color="emerald" className="font-mono">SIGTAS VERIFIED</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="SIGTAS Receipt Number" value={sigtasReceiptNo} onChange={(e) => setSigtasReceiptNo(e.target.value)} />
                      <Input label="Payment Receipt Date" type="date" value={sigtasPaymentDate} onChange={(e) => setSigtasPaymentDate(e.target.value)} />
                    </div>

                    <div className="p-5 bg-slate-900 text-white rounded-xl font-mono text-xs space-y-2 border border-slate-800">
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400 font-bold uppercase">SIGTAS Collection Ledger</span>
                        <span className="text-emerald-400 font-bold">RECEIPT #: {sigtasReceiptNo}</span>
                      </div>
                      <p><span className="text-slate-500">Tax Revenue Collected:</span> <span className="text-emerald-400 font-bold">{formatRevenue(agreedSettlementAmount)} ETB</span></p>
                      <p><span className="text-slate-500">Bank Account:</span> National Bank of Ethiopia (NBE) MoR Treasury Acct #100008892</p>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="secondary" icon={ArrowLeft} onClick={() => setCompletionSubPage(2)}>← Back to Sub-Page 2</Button>
                      <Button variant="primary" icon={ArrowRight} className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setCompletionSubPage(4)}>
                        Proceed to Sub-Page 4 (Digital Archival) →
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Sub-Page 4: 10-Year Statutory Cryptographic Archival */}
              {completionSubPage === 4 && (
                <div className="space-y-6">
                  <Card className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <Layers className="w-5 h-5 text-emerald-600" />
                          Sub-Page 9.4: 10-Year Statutory Audit Trail & Cryptographic Vault Archival (Art. 47)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Lock working papers WP-01 to WP-07 and generate SHA256 digital vault checksum.
                        </p>
                      </div>
                      <Badge color="purple" className="font-mono">CRYPTOGRAPHICALLY LOCKED</Badge>
                    </div>

                    <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-2 font-mono text-xs border border-slate-800 shadow-inner">
                      <p className="text-slate-400 font-bold uppercase">10-Year Cryptographic Archival Record:</p>
                      <p><span className="text-slate-500">Vault Checksum:</span> <span className="text-purple-300 font-bold">{archivalHash}</span></p>
                      <p><span className="text-slate-500">Statutory Retention:</span> Income Tax Proclamation No. 979/2016 Article 47 (Active until 2036-09-03)</p>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button variant="secondary" icon={ArrowLeft} onClick={() => setCompletionSubPage(3)}>← Back to Sub-Page 3</Button>
                      <Button variant="primary" icon={ArrowRight} className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setCompletionSubPage(5)}>
                        Proceed to Sub-Page 5 (Close Case) →
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Sub-Page 5: Formal Case Closure Sign-Off */}
              {completionSubPage === 5 && (
                <div className="space-y-6">
                  <Card className="p-8 text-center space-y-5 bg-gradient-to-b from-slate-900 to-slate-950 text-white border-slate-800 shadow-2xl">
                    <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      Transfer Pricing Audit Case Ready for Formal Case Closure & Final Lock
                    </h3>
                    <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
                      All 9 statutory execution phases have been fully performed, audited, verified, settled, and archived in full compliance with Ethiopian Revenue Proclamation No. 979/2016 and TP Directive No. 43/2015.
                    </p>

                    <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 max-w-lg mx-auto text-left font-mono text-xs space-y-2">
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400 font-bold uppercase">Case Closure Certificate</span>
                        <span className="text-emerald-400 font-bold">ETH030999</span>
                      </div>
                      <p><span className="text-slate-500">Taxpayer:</span> Crest Textiles SC</p>
                      <p><span className="text-slate-500">Final Net Recovery:</span> <span className="text-emerald-400 font-bold">{formatRevenue(agreedSettlementAmount)} ETB</span></p>
                      <p><span className="text-slate-500">SIGTAS Receipt:</span> {sigtasReceiptNo}</p>
                    </div>

                    <div className="pt-4 flex justify-between items-center border-t border-slate-800">
                      <Button variant="secondary" icon={ArrowLeft} onClick={() => setCompletionSubPage(4)}>← Back to Sub-Page 4</Button>
                      <Button 
                        variant="success" 
                        icon={CheckCircle2} 
                        loading={loading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-sm font-bold shadow-xl shadow-emerald-950"
                        onClick={() => handlePost('/close', { agreedSettlementAmount, sigtasReceiptNo }, 'Transfer Pricing Audit Case #2026-TP-AA-0207 successfully CLOSED!')}
                      >
                        Finalize & Formally Close TP Case #2026-TP-AA-0207
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
