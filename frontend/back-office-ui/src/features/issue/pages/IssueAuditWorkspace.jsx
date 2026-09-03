import React, { useState } from 'react';
import {
  FileText, Shield, ArrowLeft, ArrowRight, CheckCircle2, Clock, Scale,
  UserCheck, AlertTriangle, AlertOctagon, Send, Eye, Building2, MapPin,
  HelpCircle, Calendar, Plus, Trash2, UploadCloud, BookOpen
} from 'lucide-react';
import { Card, Button, Badge, Input, Textarea, Select } from '../../../components/ui/index.jsx';

export default function IssueAuditWorkspace({ caseData, user, initialPhase, onClose, onRefresh }) {
  const [activePhase, setActivePhase] = useState(initialPhase || 'NOTIFICATION');
  const [subPage, setSubPage] = useState(1);

  React.useEffect(() => {
    if (initialPhase) {
      setActivePhase(initialPhase);
      setSubPage(1);
    }
  }, [initialPhase]);

  const SUB_PAGES = {
    NOTIFICATION: [
      { id: 1, title: 'Data Warehouse Case Dossier (FR-04.2-01/03)' },
      { id: 2, title: 'Auditee Statutory Notice & Response (FR-04.6-01 & FR-04.2-02)' },
      { id: 3, title: 'Targeted Issue Scope & Materiality (FR-04.6-02 & FR-04.2-04)' },
      { id: 4, title: 'Industry Benchmarks & Ratios (FR-04.2-05)' },
      { id: 5, title: 'Specific Audit Plan & Team Leader Review (FR-04.2-07/08)' },
      { id: 6, title: 'Entry Conference & Interview Log (FR-04.2.1-01..05)' }
    ],
    EVIDENCE_GATHERING: [
      { id: 1, title: 'Working Papers & Evidence Register (FR-04.2-10 & FR-04.6-03)' },
      { id: 2, title: 'Field Visit & On-Site Verification (FR-04.6-04)' },
      { id: 3, title: 'Cross-Matching & Reconciliations (FR-04.7-20)' },
      { id: 4, title: 'Audit Preparation Report & Fraud Check (FR-04.2-10/12)' }
    ],
    REPORT_DRAFT: [
      { id: 1, title: 'Audit Working Papers Indexing (FR-04.7-01/17)' },
      { id: 2, title: 'Draft Audit Report (FR-04.7-02)' },
      { id: 3, title: 'Tax Adjustment & Estimated Assessment (FR-04.7-24)' },
      { id: 4, title: 'Exit Conference Scheduling & Letters (FR-04.7-04..15)' }
    ],
    REVIEW_CHAIN: [
      { id: 1, title: 'Team Leader Review & Approval (FR-04.7-03/22)' },
      { id: 2, title: 'Process Owner Compliance Audit' },
      { id: 3, title: 'Multi-Level Approval Log (FR-04.7-42)' }
    ],
    DIRECTOR_DECISION: [
      { id: 1, title: 'Final Assessment Notice Generation (FR-04.7-21..28)' },
      { id: 2, title: 'Taxpayer Delivery & Objection Window (FR-04.7-34)' },
      { id: 3, title: 'Audit Case Closure & Yield Report (FR-04.7-39..41)' },
      { id: 4, title: 'Fraud & Intelligence Sub-Process Referral (FR-04.7-35)' }
    ]
  };



  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // Phase 1: Notification & Selection
  const [notificationRequired, setNotificationRequired] = useState(true);
  const [notificationSent, setNotificationSent] = useState(true);
  const [notificationDate, setNotificationDate] = useState('2026-09-03');
  const [notificationChannel, setNotificationChannel] = useState('E-TAX_PORTAL_REGISTERED_MAIL');
  const [identifiedIssue, setIdentifiedIssue] = useState('VAT Withholding & Overhead Disallowance on Intercompany Machinery Leasing');
  const [selectionRationale, setSelectionRationale] = useState('Deduction discrepancy flagged by Automated Risk Engine between declared VAT returns and withholding schedules for FY 2023-2024.');

  // Selected Transactions/Areas list (FR-04.6-02)
  const [selectedTransactions, setSelectedTransactions] = useState([
    { id: 'TX-01', issueTaxType: 'VAT Withholding', transactionDescription: 'Machinery Leasing Agreement #ML-8890 with Subsidiary', rationale: 'Unreconciled 15% VAT withholding on leasing fees', selectingAuditor: user?.name || 'Tax Auditor' },
    { id: 'TX-02', issueTaxType: 'Corporate Income Tax', transactionDescription: 'Overhead Administration Expense Allocation', rationale: 'Non-deductible management overhead claimed under Art. 27', selectingAuditor: user?.name || 'Tax Auditor' }
  ]);

  // Phase 2: Evidence Gathering & Field Visit
  const [evidenceRecords, setEvidenceRecords] = useState([
    { id: 'EV-01', source: 'INTERNAL', transactionAreaId: 'TX-01', documentReference: 'ASYCUDA Customs Entry #2024-C-9901', dateObtained: '2026-09-01', auditorComments: 'Verified customs import valuation against bank LC records.' },
    { id: 'EV-02', source: 'THIRD_PARTY', transactionAreaId: 'TX-01', documentReference: 'Commercial Bank of Ethiopia Swift Wire Confirmation', dateObtained: '2026-09-02', auditorComments: 'Confirmed offshore remittance to foreign lessor account.' },
    { id: 'EV-03', source: 'AUDITEE_UPLOADED', transactionAreaId: 'TX-02', documentReference: 'Taxpayer Ledger & Invoice Schedule #INV-2024-04', dateObtained: '2026-09-03', auditorComments: 'Taxpayer provided signed contract without timesheet breakdown.' }
  ]);

  const [fieldVisitRequired, setFieldVisitRequired] = useState(true);
  const [fieldVisitFindings, setFieldVisitFindings] = useState([
    { id: 'FV-01', location: 'Akaki Kality Manufacturing Plant', visitDate: '2026-09-02', observations: 'Inspected physical machinery on-site; equipment tags match Lease Agreement #ML-8890 but maintenance logs are missing.', transactionAreaId: 'TX-01', supportingEvidenceRef: 'EV-01' }
  ]);

  // Phase 3: Report & Review Chain
  const [reportTitle, setReportTitle] = useState('Issue Audit Report: Disallowance of Leasing VAT Withholding & Overhead Expenses');
  const [reportSummary, setReportSummary] = useState('Targeted issue audit revealed non-compliance in VAT withholding under Proclamation 979/2016 Article 54 and improper overhead deduction. Total recommended tax adjustment: ETB 14,850,000.');
  const [totalAdjustedAmount, setTotalAdjustedAmount] = useState(14850000);
  const [reportStatus, setReportStatus] = useState('DRAFT'); // DRAFT, SUBMITTED_TO_TL, TL_APPROVED, PO_APPROVED, FINALIZED
  const [teamLeaderComments, setTeamLeaderComments] = useState('Report is thorough and well-supported by evidence records EV-01 to EV-03.');
  const [processOwnerComments, setProcessOwnerComments] = useState('Technical tax legal citations verified under Art. 54 and Art. 27.');
  const [directorComments, setDirectorComments] = useState('Approved. Proceed to final report generation.');
  const [followUpDecision, setFollowUpDecision] = useState('REPORT_FINALIZED'); // REPORT_FINALIZED, FRAUD_REFERRAL, COMPREHENSIVE_AUDIT_REFERRAL
  const [referralRef, setReferralRef] = useState('');

  const PHASES = [
    { id: 'NOTIFICATION', label: 'Auditee Notification & Selection', short: 'Notify & Select', icon: Calendar },
    { id: 'EVIDENCE_GATHERING', label: 'Evidence & Field Verification', short: 'Evidence & Verification', icon: FileText },
    { id: 'REPORT_DRAFT', label: 'Audit Findings & Draft Report', short: 'Draft Report', icon: BookOpen },
    { id: 'REVIEW_CHAIN', label: 'Multi-Level Approval Chain', short: 'Review Chain', icon: UserCheck },
    { id: 'DIRECTOR_DECISION', label: 'Director Decision & Follow-Up', short: 'Director Decision', icon: Shield }
  ];


  const handlePost = async (action, extraData = {}) => {
    setLoading(true);
    setMsg(null);
    try {
      const payload = {
        action,
        identifiedIssue,
        notificationRequired,
        notificationSent,
        notificationRecipientChannel: notificationChannel,
        selectedTransactions,
        evidenceRecords,
        fieldVisitFindings,
        reportTitle,
        reportSummary,
        totalAdjustedAmount,
        decision: followUpDecision,
        comments: user?.role === 'team_leader' ? teamLeaderComments : user?.role === 'process_owner' ? processOwnerComments : directorComments,
        ...extraData
      };
      const r = await fetch(`/api/v1/backoffice/issue/cases/${caseData.id || caseData.caseNumber}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Actor-Id': user?.id || 'auditor-01' },
        body: JSON.stringify(payload)
      });
      if (r.ok) {
        setMsg({ type: 'success', text: `Action "${action}" processed successfully.` });
        if (onRefresh) onRefresh();
      } else {
        setMsg({ type: 'error', text: 'Error processing server request.' });
      }
    } catch (e) {
      setMsg({ type: 'error', text: 'Failed to communicate with Issue Audit API server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 p-6 rounded-2xl border border-blue-800/40 text-white shadow-xl flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="xs" onClick={onClose} icon={ArrowLeft} className="text-slate-300 hover:text-white bg-slate-800/60">
              Back to Cases
            </Button>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-mono font-semibold rounded-full">
              ISSUE AUDIT WORKSPACE (FR-04.6)
            </span>
            <Badge color="blue">{activePhase}</Badge>
          </div>
          <h1 className="text-2xl font-bold text-white mt-2 tracking-tight">
            {caseData.taxpayerName || 'Crest Textiles SC'} <span className="text-sm font-normal text-slate-400 font-mono">({caseData.tin || 'TIN: ETH030999'})</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Identified Issue: <span className="text-amber-300 font-semibold">{identifiedIssue}</span>
          </p>
        </div>
        <div className="text-right space-y-1">
          <span className="text-xs text-slate-400 font-mono uppercase">Case Reference</span>
          <p className="text-lg font-bold font-mono text-blue-400">{caseData.caseNumber || 'ETH-ISSUE-2026-901'}</p>
        </div>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl text-xs font-semibold ${msg.type === 'success' ? 'bg-emerald-900/30 border border-emerald-700 text-emerald-300' : 'bg-rose-900/30 border border-rose-700 text-rose-300'}`}>
          {msg.text}
        </div>
      )}

      {/* Sub-Page Navigation Tabs */}
      {SUB_PAGES[activePhase] && (
        <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 flex gap-2 overflow-x-auto">
          {SUB_PAGES[activePhase].map((sp) => (
            <button
              key={sp.id}
              onClick={() => setSubPage(sp.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                subPage === sp.id
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {sp.id}. {sp.title}
            </button>
          ))}
        </div>
      )}



      {/* Phase 1: Auditee Notification & Selection */}
      {activePhase === 'NOTIFICATION' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-5">
            {subPage === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    1. Data Warehouse Case Dossier & Risk Engine Drill-Down (FR-04.2-01 & FR-04.2-03)
                  </h3>
                  <Badge color="blue">SUB-PAGE 1 OF 6</Badge>
                </div>

                {/* Sub-Step 1.1: Data Warehouse Historical Taxpayer Dossier */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold">1.1</span>
                    Prepopulated Taxpayer Master File & Data Warehouse History
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Taxpayer Name / TIN:</span>
                      <p className="text-blue-600 font-mono font-bold mt-0.5">{caseData.taxpayerName || 'Crest Textiles SC'} ({caseData.tin || 'ETH030999'})</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Tax Center / Regional Office:</span>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5">Large Taxpayers Office (LTO) Addis Ababa</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Previous Audit History:</span>
                      <p className="text-amber-600 font-bold mt-0.5">2022 Comprehensive Audit (ETB 3.2M Adjustment)</p>
                    </div>
                  </div>
                </div>

                {/* Sub-Step 1.2: Risk Engine Selection Criteria Drill-Down */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold">1.2</span>
                    Automated Risk Engine Score & Specific Risk Criteria Drill-Down
                  </h4>
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-rose-900 dark:text-rose-200">Rule #R-VAT-88: Overhead Disallowance Discrepancy</span>
                      <Badge color="rose">RISK SCORE: 88.5 / 100</Badge>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                      Discrepancy detected between claimed overhead expenses on Corporate Income Tax return (Art. 27 disallowance) and VAT withholding schedules filed on e-Tax portal.
                    </p>
                  </div>
                </div>

                {/* Sub-Step 1.3: Document Request Trigger (FR-04.2-02) */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold">1.3</span>
                      System-Generated Request for Additional Documents (IDR-01)
                    </h4>
                    <Button size="xs" variant="secondary" icon={UploadCloud} onClick={() => handlePost('REQUEST_DOCUMENTS')}>
                      Transmit IDR-01 Request to e-Tax Portal
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500">Enables auditor to request specific ledgers, lease contracts, and bank swift vouchers via e-Tax portal.</p>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button variant="primary" icon={ArrowRight} className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setSubPage(2)}>
                    Proceed to Auditee Statutory Notice (Sub-Page 2) →
                  </Button>
                </div>
              </div>
            )}



            {subPage === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    2. Auditee Statutory Notification & Response (FR-04.6-01 & FR-04.2-02)
                  </h3>
                  <Badge color="blue">SUB-PAGE 2 OF 6</Badge>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold">2.1</span>
                      Statutory Notice Parameters & Legal Scope
                    </h4>
                    <Badge color={notificationRequired ? 'emerald' : 'slate'}>{notificationRequired ? 'MANDATORY NOTICE' : 'EXEMPT'}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select
                      label="Statutory Notification Requirement"
                      value={notificationRequired ? 'YES' : 'NO'}
                      onChange={(e) => setNotificationRequired(e.target.value === 'YES')}
                      options={[
                        { value: 'YES', label: 'Mandatory Notice (Tax Proclamation 979/2016)' },
                        { value: 'NO', label: 'Immediate Field Verification' }
                      ]}
                    />
                    <Input label="Scheduled Notice Dispatch Date" type="date" value={notificationDate} onChange={(e) => setNotificationDate(e.target.value)} />
                    <Input label="Delivery Channel" value={notificationChannel} onChange={(e) => setNotificationChannel(e.target.value)} />
                  </div>
                  <Textarea
                    label="Identified Non-Compliance Key Issue (To be included in Notice)"
                    rows={2}
                    value={identifiedIssue}
                    onChange={(e) => setIdentifiedIssue(e.target.value)}
                  />
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-2">
                  <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300">Auditee Response Status: <Badge color="emerald" className="ml-2">ACKNOWLEDGED</Badge></p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Taxpayer acknowledged receipt of notice and IDR-01 request on 2026-09-04.</p>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="secondary" icon={ArrowLeft} onClick={() => setSubPage(1)}>← Back</Button>
                  <Button variant="primary" icon={ArrowRight} className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setSubPage(3)}>
                    Proceed to Scope & Materiality (Sub-Page 3) →
                  </Button>
                </div>
              </div>
            )}

            {subPage === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    3. Targeted Issue Scope & Materiality (FR-04.6-02 & FR-04.2-04)
                  </h3>
                  <Badge color="blue">SUB-PAGE 3 OF 6</Badge>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold">3.1</span>
                      Targeted Transaction Testing Area Matrix
                    </h4>
                    <Button size="xs" variant="secondary" icon={Plus} onClick={() => {
                      const newTx = { id: `TX-0${selectedTransactions.length + 1}`, issueTaxType: 'VAT Withholding', transactionDescription: 'New Selected Transaction Item', rationale: 'Risk engine flag', selectingAuditor: user?.name || 'Tax Auditor' };
                      setSelectedTransactions([...selectedTransactions, newTx]);
                    }}>
                      Add Testing Area
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {selectedTransactions.map((tx) => (
                      <div key={tx.id} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <div>
                          <span className="font-mono text-xs font-bold text-blue-600">{tx.id}</span> - <span className="font-bold text-xs">{tx.issueTaxType}</span>: {tx.transactionDescription}
                          <p className="text-xs text-slate-500">{tx.rationale}</p>
                        </div>
                        <Button size="xs" variant="ghost" icon={Trash2} className="text-rose-500" onClick={() => setSelectedTransactions(selectedTransactions.filter(t => t.id !== tx.id))} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">3.2 Materiality & Scope (FR-04.2-04)</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-slate-500">Materiality Threshold:</span><span className="font-bold">ETB 500,000</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Sampling Method:</span><span className="font-bold">100% Substantive</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Resource Days Needed:</span><span className="font-bold">14 Days</span></div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">3.3 Auditor Justification Sign-Off</h4>
                    <Textarea rows={2} value={selectionRationale} onChange={(e) => setSelectionRationale(e.target.value)} />
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="secondary" icon={ArrowLeft} onClick={() => setSubPage(2)}>← Back</Button>
                  <Button variant="primary" icon={ArrowRight} className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setSubPage(4)}>
                    Proceed to Industry Benchmarks (Sub-Page 4) →
                  </Button>
                </div>
              </div>
            )}

            {subPage === 4 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    4. Industry Benchmarks & Ratios (FR-04.2-05)
                  </h3>
                  <Badge color="blue">SUB-PAGE 4 OF 6</Badge>
                </div>
                
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold">4.1</span>
                    Sector Comparison: Manufacturing (Textiles)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                     <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Gross Margin:</span>
                      <p className="text-rose-600 font-bold mt-1">Auditee: 12% | Sector Avg: 24%</p>
                      <p className="text-[10px] text-slate-500 mt-1">Significant deviation detected.</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Overhead / Sales Ratio:</span>
                      <p className="text-rose-600 font-bold mt-1">Auditee: 18% | Sector Avg: 7%</p>
                      <p className="text-[10px] text-slate-500 mt-1">Art. 27 disallowance highly likely.</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Debt-to-Equity:</span>
                      <p className="text-emerald-600 font-bold mt-1">Auditee: 1.5:1 | Sector Limit: 2:1</p>
                      <p className="text-[10px] text-slate-500 mt-1">Within thin cap limits.</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="secondary" icon={ArrowLeft} onClick={() => setSubPage(3)}>← Back</Button>
                  <Button variant="primary" icon={ArrowRight} className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setSubPage(5)}>
                    Proceed to Specific Audit Plan (Sub-Page 5) →
                  </Button>
                </div>
              </div>
            )}

            {subPage === 5 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    5. Specific Audit Plan & Team Leader Review (FR-04.2-07/08)
                  </h3>
                  <Badge color="blue">SUB-PAGE 5 OF 6</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">5.1 Segments & Audit Program</h4>
                    <div className="space-y-2">
                      <div className="p-2 bg-white dark:bg-slate-800 border rounded flex justify-between text-xs"><span className="font-bold">Segment: VAT Withholding</span><Badge color="blue">FY 2023-2024</Badge></div>
                      <div className="p-2 bg-white dark:bg-slate-800 border rounded flex justify-between text-xs"><span className="font-bold">Segment: CIT Overhead Allowability</span><Badge color="blue">FY 2023-2024</Badge></div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">5.2 Target Auditor Setup</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-slate-500">Assigned Auditor:</span><span className="font-bold">{user?.name}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Complexity Weighting:</span><span className="font-bold text-amber-600">HIGH</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Expected Field Days:</span><span className="font-bold">5 Days</span></div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-2">
                  <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300">Team Leader Approval Status: <Badge color="emerald" className="ml-2">PLAN APPROVED</Badge></p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Audit Plan approved by Team Leader on 2026-09-04. Notification sent to auditor.</p>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="secondary" icon={ArrowLeft} onClick={() => setSubPage(4)}>← Back</Button>
                  <Button variant="primary" icon={ArrowRight} className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setSubPage(6)}>
                    Proceed to Entry Conference (Sub-Page 6) →
                  </Button>
                </div>
              </div>
            )}

            {subPage === 6 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-blue-600" />
                    6. Entry Conference & Interview Log (FR-04.2.1-01 to 05)
                  </h3>
                  <Badge color="blue">SUB-PAGE 6 OF 6</Badge>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold">6.1</span>
                      Entrance Interview Scheduling & Security Rules
                    </h4>
                    <Badge color="amber">MEETING HELD</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Scheduled Date & Time:</span>
                      <p className="text-slate-600 mt-0.5">2026-09-06 at 10:00 AM</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Venue (Strict Rule Enforced):</span>
                      <p className="text-slate-600 mt-0.5">LTO Interview Room B (Adjoining Tax Assistance Area)</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold">6.2</span>
                    Interview Findings & Media Capture
                  </h4>
                  <Textarea label="Internal Controls & Premise Inspection Notes" rows={2} defaultValue="Taxpayer CFO confirmed lease contract ML-8890 terms. Internal controls over VAT withholding appear manual and prone to reconciliation errors." />
                  <div className="flex items-center gap-4 mt-2">
                    <Button size="xs" variant="secondary" icon={UploadCloud}>Upload Audio Recording (.mp3)</Button>
                    <span className="text-[10px] text-slate-500">Audio uploaded: entry_conference_0906.mp3</span>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-2">
                  <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300">Taxpayer Confirmation: <Badge color="emerald" className="ml-2">RECEIPT CONFIRMED</Badge></p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Team Leader approved interview log. Taxpayer agent confirmed receipt via e-Service portal on 2026-09-07.</p>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="secondary" icon={ArrowLeft} onClick={() => setSubPage(5)}>← Back</Button>
                  <Button variant="primary" icon={ArrowRight} className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { handlePost('FINALIZE_PREPARATION'); setActivePhase('EVIDENCE_GATHERING'); setSubPage(1); }}>
                    Complete Preparation & Proceed to Evidence Gathering (Phase 2) →
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}



      {/* Phase 2: Evidence Gathering & Field Visit */}
      {activePhase === 'EVIDENCE_GATHERING' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-5">
            {subPage === 1 && (
              <>
                <h3 className="text-base font-bold text-slate-800 dark:text-white border-b pb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Document & Evidence Register (FR-04.6-03)
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">Internal, Third-Party & Auditee Evidence Records</h4>
                    <Button size="xs" variant="secondary" icon={UploadCloud} onClick={() => {
                      const newEv = { id: `EV-0${evidenceRecords.length + 1}`, source: 'AUDITEE_UPLOADED', transactionAreaId: 'TX-01', documentReference: 'Auditee Ledger Record', dateObtained: '2026-09-03', auditorComments: 'Attached by Taxpayer' };
                      setEvidenceRecords([...evidenceRecords, newEv]);
                    }}>
                      Add Evidence Record
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {evidenceRecords.map(ev => (
                      <div key={ev.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <div>
                          <span className="font-mono text-xs font-bold text-purple-600">{ev.id}</span> [<Badge color={ev.source === 'INTERNAL' ? 'blue' : ev.source === 'THIRD_PARTY' ? 'amber' : 'emerald'}>{ev.source}</Badge>] - {ev.documentReference}
                          <p className="text-xs text-slate-500">Related Area: {ev.transactionAreaId} | {ev.auditorComments}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t">
                  <Button variant="primary" icon={ArrowRight} className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setSubPage(2)}>
                    Proceed to On-Site Field Visit →
                  </Button>
                </div>
              </>
            )}

            {subPage === 2 && (
              <>
                <h3 className="text-base font-bold text-slate-800 dark:text-white border-b pb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Field Visit & On-Site Verification Findings (FR-04.6-04)
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">On-Site Observations</h4>
                    <Select
                      value={fieldVisitRequired ? 'YES' : 'NO'}
                      onChange={(e) => setFieldVisitRequired(e.target.value === 'YES')}
                      options={[{ value: 'YES', label: 'Field Visit Conducted' }, { value: 'NO', label: 'Field Visit Not Required' }]}
                    />
                  </div>
                  {fieldVisitRequired && (
                    <div className="space-y-2">
                      {fieldVisitFindings.map(fv => (
                        <div key={fv.id} className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
                          <div className="flex justify-between">
                            <span className="font-bold text-xs text-amber-900 dark:text-amber-300">{fv.location} ({fv.visitDate})</span>
                            <span className="text-xs font-mono">Evidence Ref: {fv.supportingEvidenceRef}</span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">{fv.observations}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex justify-between pt-4 border-t">
                  <Button variant="secondary" icon={ArrowLeft} onClick={() => setSubPage(1)}>← Back</Button>
                  <Button variant="primary" icon={ArrowRight} className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setSubPage(3)}>
                    Proceed to Third-Party Data Cross-Match →
                  </Button>
                </div>
              </>
            )}

            {subPage === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Scale className="w-5 h-5 text-blue-600" />
                    3. Automated System Cross-Matching & Reconciliations (FR-04.7-20)
                  </h3>
                  <Badge color="blue">SUB-PAGE 3 OF 4</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Payroll vs. CIT P&L Expense</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-slate-500">Declared Payroll Tax (12 mo):</span><span className="font-bold">ETB 4,200,000</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">CIT P&L Salary Expense:</span><span className="font-bold">ETB 6,800,000</span></div>
                      <div className="flex justify-between border-t pt-2"><span className="font-bold text-slate-700 dark:text-slate-300">Discrepancy Detected:</span><span className="font-bold text-rose-600">ETB 2,600,000</span></div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">VAT Returns vs. CIT Gross Sales</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-slate-500">Aggregated VAT Gross Sales:</span><span className="font-bold">ETB 45,500,000</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">CIT Declared Gross Sales:</span><span className="font-bold">ETB 45,500,000</span></div>
                      <div className="flex justify-between border-t pt-2"><span className="font-bold text-slate-700 dark:text-slate-300">Discrepancy Detected:</span><Badge color="emerald">MATCHED</Badge></div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="secondary" icon={ArrowLeft} onClick={() => setSubPage(2)}>← Back</Button>
                  <Button variant="primary" icon={ArrowRight} className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setSubPage(4)}>
                    Proceed to Preparation Report →
                  </Button>
                </div>
              </div>
            )}

            {subPage === 4 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    4. Evidence Conclusion & Fraud Review
                  </h3>
                  <Badge color="blue">SUB-PAGE 4 OF 4</Badge>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Fraud & Intelligence Check</h4>
                  </div>
                  <Select label="Potential Fraud Indicators Identified?" defaultValue="NO" options={[{value: 'YES', label: 'Yes - Refer to Intelligence'}, {value: 'NO', label: 'No - Standard Non-Compliance'}]} />
                  <Textarea label="Evidence Summary Notes" rows={2} defaultValue="Sufficient evidence gathered for overhead expense disallowance based on cross-match discrepancies." />
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="secondary" icon={ArrowLeft} onClick={() => setSubPage(3)}>← Back</Button>
                  <Button variant="primary" icon={ArrowRight} className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { handlePost('GATHER_EVIDENCE'); setActivePhase('REPORT_DRAFT'); setSubPage(1); }}>
                    Save Phase 2 & Proceed to Draft Report →
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Phase 3: Report Drafting & Audit Completion */}
      {activePhase === 'REPORT_DRAFT' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-5">
            {subPage === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    1. Audit Working Papers Indexing (FR-04.7-01 & 17)
                  </h3>
                  <Badge color="blue">SUB-PAGE 1 OF 4</Badge>
                </div>
                
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Indexed Working Papers (WP)</h4>
                    <Button size="xs" variant="secondary" icon={UploadCloud}>Index New Working Paper</Button>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 bg-white dark:bg-slate-800 border rounded-xl flex justify-between items-center text-xs">
                      <div><span className="font-bold text-purple-600">WP-01</span> - <span className="font-bold">VAT Withholding Reconciliation</span><p className="text-slate-500">Cross-matched Customs declarations against CBE Swift files.</p></div>
                      <Badge color="emerald">VERIFIED</Badge>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 border rounded-xl flex justify-between items-center text-xs">
                      <div><span className="font-bold text-purple-600">WP-02</span> - <span className="font-bold">Overhead Expense Sampling</span><p className="text-slate-500">Tested 100% of transactions &gt; ETB 500,000.</p></div>
                      <Badge color="emerald">VERIFIED</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button variant="primary" icon={ArrowRight} className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setSubPage(2)}>
                    Proceed to Draft Audit Report (Sub-Page 2) →
                  </Button>
                </div>
              </div>
            )}

            {subPage === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    2. Draft Audit Report (FR-04.7-02)
                  </h3>
                  <Badge color="blue">SUB-PAGE 2 OF 4</Badge>
                </div>
                
                <div className="space-y-4">
                  <Input label="Audit Report Title" value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} />
                  <Textarea label="Report Executive Summary & Legal Findings" rows={5} value={reportSummary} onChange={(e) => setReportSummary(e.target.value)} />
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="secondary" icon={ArrowLeft} onClick={() => setSubPage(1)}>← Back</Button>
                  <Button variant="primary" icon={ArrowRight} className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setSubPage(3)}>
                    Proceed to Tax Adjustment (Sub-Page 3) →
                  </Button>
                </div>
              </div>
            )}

            {subPage === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Scale className="w-5 h-5 text-blue-600" />
                    3. Tax Adjustment & Estimated Assessment (FR-04.7-24)
                  </h3>
                  <Badge color="blue">SUB-PAGE 3 OF 4</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <Input label="Total Recommended Principal Tax Adjustment (ETB)" type="number" value={totalAdjustedAmount} onChange={(e) => setTotalAdjustedAmount(parseFloat(e.target.value) || 0)} />
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-slate-500">Substantial Understatement Penalty (20%):</span><span className="font-bold text-amber-600">ETB {(totalAdjustedAmount * 0.20).toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Late Payment Interest (15% p.a.):</span><span className="font-bold text-amber-600">ETB {(totalAdjustedAmount * 0.15).toLocaleString()}</span></div>
                      <div className="flex justify-between border-t pt-2"><span className="font-bold text-slate-700 dark:text-slate-300">Total Liability:</span><span className="font-bold text-rose-600 text-sm">ETB {(totalAdjustedAmount * 1.35).toLocaleString()}</span></div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800 flex flex-col justify-center items-center text-center space-y-2">
                    <span className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider">Report & Assessment Status</span>
                    <Badge color={reportStatus === 'DRAFT' ? 'amber' : 'emerald'} className="text-lg px-4 py-2">{reportStatus}</Badge>
                    <p className="text-[10px] text-blue-700 dark:text-blue-400 max-w-[200px]">Any modifications to the estimated assessment will be tracked in the audit trail.</p>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="secondary" icon={ArrowLeft} onClick={() => setSubPage(2)}>← Back</Button>
                  <Button variant="primary" icon={ArrowRight} className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setSubPage(4)}>
                    Proceed to Exit Conference (Sub-Page 4) →
                  </Button>
                </div>
              </div>
            )}

            {subPage === 4 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    4. Exit Conference Scheduling & Letters (FR-04.7-04 to 15)
                  </h3>
                  <Badge color="blue">SUB-PAGE 4 OF 4</Badge>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Exit Conference Schedule</h4>
                    <Badge color="amber">PENDING TAXPAYER CONFIRMATION</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input label="Proposed Date & Time" type="datetime-local" defaultValue="2026-09-12T10:00" />
                    <Input label="Venue" defaultValue="LTO Interview Room A" />
                    <Select label="Meeting Agenda Template" options={[{value: 'STD', label: 'Standard Exit Discussion'}, {value: 'DISP', label: 'Disputed Findings Review'}]} />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button size="sm" variant="secondary" icon={FileText}>Generate Request Letter (.pdf)</Button>
                  <Button size="sm" variant="secondary" icon={UploadCloud}>Upload Signed Letter Scan</Button>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="secondary" icon={ArrowLeft} onClick={() => setSubPage(3)}>← Back</Button>
                  <Button variant="primary" icon={Send} className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { handlePost('SUBMIT_TO_TL'); setReportStatus('SUBMITTED_TO_TL'); setActivePhase('REVIEW_CHAIN'); setSubPage(1); }}>
                    Submit Draft & Schedule to Team Leader →
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Phase 4: Multi-Level Review Chain */}
      {activePhase === 'REVIEW_CHAIN' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-5">
            {subPage === 1 && (
              <>
                <h3 className="text-base font-bold text-slate-800 dark:text-white border-b pb-3 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                  Level 1: Team Leader Review & Technical Assessment (FR-04.6-06)
                </h3>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Team Leader Status</span>
                    <Badge color={reportStatus === 'TL_APPROVED' || reportStatus === 'PO_APPROVED' || reportStatus === 'FINALIZED' ? 'emerald' : reportStatus === 'RETURNED_TO_AUDITOR' ? 'rose' : 'amber'}>
                      {reportStatus === 'TL_APPROVED' || reportStatus === 'PO_APPROVED' || reportStatus === 'FINALIZED' ? 'APPROVED' : reportStatus === 'RETURNED_TO_AUDITOR' ? 'RETURNED FOR REVISION' : 'PENDING REVIEW'}
                    </Badge>
                  </div>
                  <Textarea label="Team Leader Technical Comments & Findings" rows={3} value={teamLeaderComments} onChange={(e) => setTeamLeaderComments(e.target.value)} />
                  <div className="flex gap-2 justify-end">
                    <Button size="xs" variant="secondary" className="text-rose-600 border-rose-300 hover:bg-rose-50" onClick={() => { handlePost('REVIEW_TL', { decision: 'RETURNED_FOR_REVISION' }); setReportStatus('RETURNED_TO_AUDITOR'); setActivePhase('REPORT_DRAFT'); setSubPage(1); }}>
                      ↩ Return to Auditor for Revision
                    </Button>
                    <Button size="xs" variant="primary" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { handlePost('REVIEW_TL', { decision: 'APPROVED' }); setReportStatus('TL_APPROVED'); setSubPage(2); }}>
                      ✓ Approve & Forward to Process Owner →
                    </Button>
                  </div>
                </div>
              </>
            )}

            {subPage === 2 && (
              <>
                <h3 className="text-base font-bold text-slate-800 dark:text-white border-b pb-3 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                  Level 2: Process Owner Legal Compliance Review (FR-04.6-07)
                </h3>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">Process Owner Status</span>
                    <Badge color={reportStatus === 'PO_APPROVED' || reportStatus === 'FINALIZED' ? 'emerald' : reportStatus === 'RETURNED_TO_TL' ? 'amber' : 'gray'}>
                      {reportStatus === 'PO_APPROVED' || reportStatus === 'FINALIZED' ? 'APPROVED' : reportStatus === 'RETURNED_TO_TL' ? 'RETURNED TO TL' : 'AWAITING TL APPROVAL'}
                    </Badge>
                  </div>
                  <Textarea label="Process Owner Statutory Legal Comments" rows={3} value={processOwnerComments} onChange={(e) => setProcessOwnerComments(e.target.value)} />
                  <div className="flex gap-2 justify-end">
                    <Button size="xs" variant="secondary" className="text-amber-600 border-amber-300 hover:bg-amber-50" onClick={() => { handlePost('REVIEW_PO', { decision: 'RETURNED_TO_TL' }); setReportStatus('RETURNED_TO_TL'); setSubPage(1); }}>
                      ↩ Reject Back to Team Leader
                    </Button>
                    <Button size="xs" variant="primary" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={reportStatus !== 'TL_APPROVED'} onClick={() => { handlePost('REVIEW_PO', { decision: 'APPROVED' }); setReportStatus('PO_APPROVED'); setSubPage(3); }}>
                      ✓ Approve & Forward to Approval Log →
                    </Button>
                  </div>
                </div>
              </>
            )}

            {subPage === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    3. Multi-Level Audit Trail & Approval Log (FR-04.7-40 & 42)
                  </h3>
                  <Badge color="blue">SUB-PAGE 3 OF 3</Badge>
                </div>
                
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                  <p className="font-bold text-slate-800 dark:text-white uppercase tracking-wider">Audit Case File History:</p>
                  <div className="space-y-2 border-l-2 border-blue-200 dark:border-blue-800 pl-4 ml-2">
                    <p className="text-slate-600 dark:text-slate-400"><span className="font-bold text-slate-800 dark:text-white">1. Draft Submitted:</span> Auditor (2026-09-03 10:14) - Recommended ETB {totalAdjustedAmount.toLocaleString()} adjustment.</p>
                    <p className="text-slate-600 dark:text-slate-400"><span className="font-bold text-slate-800 dark:text-white">2. Team Leader (Level 1):</span> {reportStatus === 'TL_APPROVED' || reportStatus === 'PO_APPROVED' || reportStatus === 'FINALIZED' ? 'Approved' : 'Pending'} {teamLeaderComments && `- "${teamLeaderComments}"`}</p>
                    <p className="text-slate-600 dark:text-slate-400"><span className="font-bold text-slate-800 dark:text-white">3. Process Owner (Level 2):</span> {reportStatus === 'PO_APPROVED' || reportStatus === 'FINALIZED' ? 'Approved' : 'Pending'} {processOwnerComments && `- "${processOwnerComments}"`}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 italic">* Entire history preserved and accessible based on authorization (FR-04.7-42).</p>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="secondary" icon={ArrowLeft} onClick={() => setSubPage(2)}>← Back</Button>
                  <Button variant="primary" icon={ArrowRight} className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { setActivePhase('DIRECTOR_DECISION'); setSubPage(1); }}>
                    Proceed to Director Assessment Generation (Phase 5) →
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Phase 5: Director Decision & Case Closure */}
      {activePhase === 'DIRECTOR_DECISION' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-5">
            {subPage === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    1. Final Assessment Notice Generation (FR-04.7-21 to 28)
                  </h3>
                  <Badge color="blue">SUB-PAGE 1 OF 4</Badge>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Assessment Notice Details</h4>
                    <Button size="xs" variant="secondary" icon={FileText}>Preview Print Template</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Notice ID (FR-04.7-26):</span>
                      <p className="text-blue-600 font-mono font-bold mt-0.5">NTC-ISSUE-2026-0988</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Notice Type:</span>
                      <p className="text-slate-600 mt-0.5">Pre-defined Template (Issue Audit Assessment)</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button size="sm" variant="secondary" icon={UploadCloud}>Batch Print Mail Notices</Button>
                    <Button size="sm" variant="secondary" icon={Send}>Email Notice to Taxpayer (FR-04.7-27/33)</Button>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button variant="primary" icon={ArrowRight} className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setSubPage(2)}>
                    Proceed to Taxpayer Delivery (Sub-Page 2) →
                  </Button>
                </div>
              </div>
            )}

            {subPage === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    2. Taxpayer Delivery & Objection Window (FR-04.7-34/37)
                  </h3>
                  <Badge color="blue">SUB-PAGE 2 OF 4</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Delivery Tracking</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-slate-500">e-Service Confirmation:</span><Badge color="emerald">RECEIVED (2026-09-08)</Badge></div>
                      <div className="flex justify-between"><span className="text-slate-500">Physical Mail Status:</span><Badge color="slate">UNDELIVERED</Badge></div>
                      <div className="flex justify-between"><span className="text-slate-500">30-Day Objection Deadline:</span><span className="font-bold text-rose-600">2026-10-08</span></div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Taxpayer Response</h4>
                    <Select label="Objection Status" defaultValue="PENDING" options={[{value: 'PENDING', label: 'Pending Response'}, {value: 'ACCEPTED', label: 'Assessment Accepted'}, {value: 'OBJECTION', label: 'Internal Review / Appeal Lodged'}]} />
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="secondary" icon={ArrowLeft} onClick={() => setSubPage(1)}>← Back</Button>
                  <Button variant="primary" icon={ArrowRight} className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setSubPage(3)}>
                    Proceed to Yield Report (Sub-Page 3) →
                  </Button>
                </div>
              </div>
            )}

            {subPage === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    3. Audit Case Closure & Yield Report (FR-04.7-39 to 42)
                  </h3>
                  <Badge color="blue">SUB-PAGE 3 OF 4</Badge>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Final Yield vs. Target</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                     <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Initial Declaration:</span>
                      <p className="font-bold mt-1">ETB 1,200,000</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-blue-300">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Confirmed Audit Adjustment:</span>
                      <p className="text-blue-600 font-bold mt-1">ETB {(totalAdjustedAmount * 1.35).toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Audit Yield Ratio:</span>
                      <p className="text-emerald-600 font-bold mt-1">{( ((totalAdjustedAmount * 1.35) / 1200000) * 100 ).toFixed(1)}%</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="secondary" icon={ArrowLeft} onClick={() => setSubPage(2)}>← Back</Button>
                  <Button variant="primary" icon={ArrowRight} className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setSubPage(4)}>
                    Proceed to Case Execution & Fraud Flag (Sub-Page 4) →
                  </Button>
                </div>
              </div>
            )}

            {subPage === 4 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    4. Intelligence Referral & Case Execution (FR-04.7-35)
                  </h3>
                  <Badge color="blue">SUB-PAGE 4 OF 4</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setFollowUpDecision('REPORT_FINALIZED')}
                    className={`p-4 rounded-xl border text-left space-y-2 transition-all ${
                      followUpDecision === 'REPORT_FINALIZED' ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    <p className="text-xs font-bold text-slate-800 dark:text-white">Close & Finalize Audit</p>
                    <p className="text-[11px] text-slate-500">Case complete. Route adjustment to Taxpayer Ledger.</p>
                  </button>

                  <button
                    onClick={() => setFollowUpDecision('FRAUD_REFERRAL')}
                    className={`p-4 rounded-xl border text-left space-y-2 transition-all ${
                      followUpDecision === 'FRAUD_REFERRAL' ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 ring-2 ring-rose-500' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <AlertOctagon className="w-6 h-6 text-rose-600" />
                    <p className="text-xs font-bold text-slate-800 dark:text-white">Tax Fraud Referral (FR-04.7-35)</p>
                    <p className="text-[11px] text-slate-500">Signs of potential fraud. Trigger Intelligence Sub-Process.</p>
                  </button>
                </div>
                
                <Textarea label="Director Decision Rationale & Comments" rows={3} value={directorComments} onChange={(e) => setDirectorComments(e.target.value)} />
                
                <div className="flex justify-between pt-4 border-t">
                  <Button variant="secondary" icon={ArrowLeft} onClick={() => setSubPage(3)}>← Back</Button>
                  <Button
                    variant="primary"
                    icon={CheckCircle2}
                    loading={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 shadow-lg"
                    onClick={() => handlePost('DECISION_DIRECTOR')}
                  >
                    Execute Final Director Decision
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

    </div>
  );
}
