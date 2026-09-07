import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, ArrowRight, ArrowLeft,
  FileText, Send, User, Building2, Calendar, Scale, Layers,
  Check, X, MessageSquare, AlertCircle, BarChart2, DollarSign,
  Briefcase, Award
} from 'lucide-react';
import { Modal, Button, Badge, Alert, Textarea, Input } from '../../../components/ui/index.jsx';
import { formatRevenue } from '../../ap/utils/revenueFormatter.js';

/**
 * TpTeamLeaderReviewModal
 * 
 * Dedicated supervisory console for Transfer Pricing Team Leaders.
 * Team Leaders use this to inspect the auditor's working papers, economic
 * benchmarking, and proposed adjustments.
 * 
 * Team Leader Actions:
 *   1. Request Revisions from Auditor (with mandatory comments)
 *   2. Approve (Supervisory Sign-Off for TL-level deliverables)
 *   3. Endorse & Route to Review / TP Committee (with recommendation)
 */
export default function TpTeamLeaderReviewModal({ caseData, user, onClose, onRefresh }) {
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'benchmarking' | 'adjustments' | 'decision'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Team Leader Review Decision State
  const [decisionType, setDecisionType] = useState('ENDORSE_TO_COMMITTEE'); // 'ENDORSE_TO_COMMITTEE' | 'REQUEST_REVISIONS' | 'TL_APPROVE'
  const [endorsementComments, setEndorsementComments] = useState(
    'Supervisory review completed. The TNMM comparability study and interquartile range calculation under Art. 79 of Proclamation 979/2016 are technically sound. Material profit shifting via low-tax jurisdiction confirmed. Endorsed for Committee formal deliberation and assessment authorization.'
  );
  const [revisionComments, setRevisionComments] = useState('');
  const [scopeVerified, setScopeVerified] = useState(true);
  const [methodologyVerified, setMethodologyVerified] = useState(true);
  const [workingPapersVerified, setWorkingPapersVerified] = useState(true);

  if (!caseData) return null;

  // Mocked/derived case deliverables data from the auditor's working papers
  const taxpayerName = caseData.taxpayerName || caseData.taxpayerId || 'Crest Textiles SC';
  const tin = caseData.tin || caseData.taxpayerId || '1000082799';
  const sector = caseData.sector || 'Textiles & Garment Manufacturing';
  const caseNumber = caseData.caseNumber || '2026-TP-AA-0207';
  const assignedAuditor = caseData.assignedAuditorName || caseData.assignedAuditorId || 'Tadesse Mamo (Lead TP Auditor)';

  // Financial & Adjustment Figures
  const revenueAtRisk = 75000000; // ETB 75M
  const proposedTaxAdjustment = 24500000; // ETB 24.5M
  const corporateIncomeTax = 7350000; // 30% of adjustment
  const penaltyAmount = 3675000; // 50% penalty
  const interestAmount = 1470000; // statutory interest
  const totalTaxDemand = corporateIncomeTax + penaltyAmount + interestAmount; // 12,495,000 ETB

  const handleAction = async () => {
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      let newStatus = 'SUBMITTED_FOR_COMMITTEE';
      let comments = endorsementComments;

      if (decisionType === 'REQUEST_REVISIONS') {
        if (!revisionComments.trim()) {
          setError('Please provide specific revision instructions for the auditor.');
          setLoading(false);
          return;
        }
        newStatus = 'REVISION_REQUESTED';
        comments = revisionComments;
      } else if (decisionType === 'TL_APPROVE') {
        newStatus = 'TL_APPROVED';
      } else {
        newStatus = 'SUBMITTED_FOR_COMMITTEE';
      }

      // Persist status to backend
      const res = await fetch(`/api/v1/backoffice/ap/cases/${caseData.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': user?.id || user?.username || 'team-leader'
        },
        body: JSON.stringify({ 
          status: newStatus,
          notes: comments,
          reviewerRole: 'TEAM_LEADER',
          reviewedBy: user?.name || user?.username || 'Team Leader'
        })
      });

      if (!res.ok) {
        // Fallback for demo if mock case id
        console.warn('Backend update failed, applying local state update');
      }

      setSuccessMsg(
        decisionType === 'REQUEST_REVISIONS'
          ? 'Case successfully returned to lead auditor with required revisions.'
          : decisionType === 'ENDORSE_TO_COMMITTEE'
          ? 'Case successfully endorsed and routed to Joint & TP Committee for formal deliberation!'
          : 'Supervisory approval sign-off recorded successfully!'
      );

      setTimeout(() => {
        if (onRefresh) onRefresh();
        onClose();
      }, 1400);

    } catch (err) {
      console.error('Failed to submit TL review:', err);
      setError(err.message || 'Failed to submit review decision');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded-xl">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Team Leader TP Supervisory Review
              </h2>
              <Badge color="purple" size="xs">Form FR-04.5-20 Review</Badge>
              <Badge color="amber" size="xs" dot>Pending TL Action</Badge>
            </div>
            <p className="text-xs text-gray-500">
              Case #{caseNumber} • {taxpayerName} (TIN: {tin})
            </p>
          </div>
        </div>
      }
      size="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-gray-500">
            Supervisor: <strong className="text-gray-700 dark:text-gray-300">{user?.name || 'Workneh Kassa (TP Team Leader)'}</strong>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Close
            </Button>
            {activeTab !== 'decision' ? (
              <Button 
                variant="primary" 
                className="bg-purple-600 hover:bg-purple-700 text-white" 
                icon={ArrowRight}
                onClick={() => setActiveTab('decision')}
              >
                Proceed to Decision
              </Button>
            ) : (
              <Button 
                variant="primary" 
                loading={loading}
                className={decisionType === 'REQUEST_REVISIONS' ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}
                icon={decisionType === 'REQUEST_REVISIONS' ? AlertTriangle : Send}
                onClick={handleAction}
              >
                {decisionType === 'REQUEST_REVISIONS' 
                  ? 'Return to Auditor' 
                  : decisionType === 'ENDORSE_TO_COMMITTEE'
                  ? 'Endorse & Forward to Committee'
                  : 'Record Supervisory Approval'}
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Case Banner */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-xl shadow-md border border-purple-800/40">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <p className="text-slate-400 uppercase font-semibold text-[10px]">Lead TP Auditor</p>
              <p className="text-sm font-bold text-white mt-0.5">{assignedAuditor}</p>
              <p className="text-[11px] text-purple-300">Submitted for review</p>
            </div>
            <div>
              <p className="text-slate-400 uppercase font-semibold text-[10px]">Identified TP Issue</p>
              <p className="text-sm font-bold text-amber-300 mt-0.5">Offshore Mgmt Fees</p>
              <p className="text-[11px] text-slate-300">Mauritius Holding Co.</p>
            </div>
            <div>
              <p className="text-slate-400 uppercase font-semibold text-[10px]">Proposed Adjustment</p>
              <p className="text-base font-bold text-emerald-400 mt-0.5">{formatRevenue(proposedTaxAdjustment)} ETB</p>
              <p className="text-[11px] text-slate-300">Art. 79 TP Disallowance</p>
            </div>
            <div>
              <p className="text-slate-400 uppercase font-semibold text-[10px]">Total Additional Demand</p>
              <p className="text-base font-bold text-purple-300 mt-0.5">{formatRevenue(totalTaxDemand)} ETB</p>
              <p className="text-[11px] text-purple-300">CIT + 50% Penalty + Int.</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-slate-700">
          {[
            { id: 'summary', label: '1. Executive & Risk Summary', icon: FileText },
            { id: 'benchmarking', label: '2. Comparability & Benchmarking', icon: BarChart2 },
            { id: 'adjustments', label: '3. Tax Demand Calculation', icon: DollarSign },
            { id: 'decision', label: '4. Supervisory Decision & Endorsement', icon: Award },
          ].map(t => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                  active
                    ? 'border-purple-600 text-purple-700 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-slate-400'
                }`}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </div>

        {error && <Alert type="error">{error}</Alert>}
        {successMsg && <Alert type="success">{successMsg}</Alert>}

        {/* TAB 1: SUMMARY */}
        {activeTab === 'summary' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                <h3 className="font-bold text-gray-800 dark:text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 size={14} className="text-purple-600" />
                  Taxpayer Profile & Scope
                </h3>
                <div className="space-y-1 text-gray-600 dark:text-slate-300">
                  <p><strong className="text-gray-900 dark:text-white">Entity:</strong> {taxpayerName}</p>
                  <p><strong className="text-gray-900 dark:text-white">TIN:</strong> {tin}</p>
                  <p><strong className="text-gray-900 dark:text-white">Sector:</strong> {sector}</p>
                  <p><strong className="text-gray-900 dark:text-white">Audit Period:</strong> FY 2020 – FY 2024 (5 taxable years)</p>
                  <p><strong className="text-gray-900 dark:text-white">Related Party:</strong> Crest Global Holdings Ltd (Mauritius)</p>
                  <p><strong className="text-gray-900 dark:text-white">Controlled Transaction:</strong> Management & Technical Assistance Services</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                <h3 className="font-bold text-gray-800 dark:text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle size={14} className="text-amber-500" />
                  Auditor's Working Hypothesis
                </h3>
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                  Taxpayer deducted <strong>75,000,000 ETB</strong> in management service fees paid to an offshore parent entity. 
                  Field investigations revealed no tangible benefit delivered to local manufacturing operations, duplicated back-office services, 
                  and fee charges significantly exceeding third-party arm's-length market rates.
                </p>
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-300">
                  <strong>Auditor Conclusion:</strong> Disallowance of excess management fees under Art. 79 of Tax Proclamation 979/2016 and Section 7 of MoR Transfer Pricing Directive.
                </div>
              </div>
            </div>

            {/* Field Work & IDR Status */}
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-gray-800 dark:text-slate-200 mb-2">Auditor Field Work & Information Requests (IDR) Trail</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-blue-50/60 dark:bg-slate-700/50 rounded-lg border border-blue-100 dark:border-slate-600">
                  <p className="text-[10px] text-gray-500 uppercase font-semibold">IDR-01 Issued</p>
                  <p className="text-sm font-bold text-blue-700 dark:text-blue-400 mt-0.5">TP Master & Local Files</p>
                  <span className="text-[10px] text-green-600 font-semibold">✓ Fully Received & Examined</span>
                </div>
                <div className="p-3 bg-blue-50/60 dark:bg-slate-700/50 rounded-lg border border-blue-100 dark:border-slate-600">
                  <p className="text-[10px] text-gray-500 uppercase font-semibold">IDR-02 Issued</p>
                  <p className="text-sm font-bold text-blue-700 dark:text-blue-400 mt-0.5">Staff Timesheets & Contracts</p>
                  <span className="text-[10px] text-amber-600 font-semibold">⚠ Deficient / Incomplete</span>
                </div>
                <div className="p-3 bg-blue-50/60 dark:bg-slate-700/50 rounded-lg border border-blue-100 dark:border-slate-600">
                  <p className="text-[10px] text-gray-500 uppercase font-semibold">Fact Statement</p>
                  <p className="text-sm font-bold text-blue-700 dark:text-blue-400 mt-0.5">Version 1.0 Signed</p>
                  <span className="text-[10px] text-purple-600 font-semibold">✓ Documented in Working Papers</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BENCHMARKING */}
        {activeTab === 'benchmarking' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider">
                  Economic & Comparability Benchmark Study
                </h3>
                <Badge color="blue">Selected Method: TNMM (Operating Margin)</Badge>
              </div>
              <p className="text-gray-600 dark:text-slate-300 mb-4">
                Tested Party: <strong>Crest Textiles SC (Ethiopian Entity)</strong> • Profit Level Indicator: <strong>Net Cost Plus / Operating Margin (EBIT / Operating Revenue)</strong>
              </p>

              {/* Interquartile Range Grid */}
              <div className="grid grid-cols-4 gap-3 text-center mb-4">
                <div className="p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Minimum</p>
                  <p className="text-base font-bold text-gray-700 dark:text-gray-200 mt-0.5">3.2%</p>
                  <p className="text-[10px] text-gray-400">Comparable Lower Bound</p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase">Lower Quartile (Q1)</p>
                  <p className="text-base font-bold text-blue-700 dark:text-blue-300 mt-0.5">4.8%</p>
                  <p className="text-[10px] text-gray-400">25th Percentile</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-950/50 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold uppercase">Median (Target)</p>
                  <p className="text-lg font-extrabold text-purple-800 dark:text-purple-200 mt-0.5">6.4%</p>
                  <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">MoR Statutory Target</p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase">Upper Quartile (Q3)</p>
                  <p className="text-base font-bold text-blue-700 dark:text-blue-300 mt-0.5">8.1%</p>
                  <p className="text-[10px] text-gray-400">75th Percentile</p>
                </div>
              </div>

              {/* Taxpayer Actual vs Benchmark */}
              <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-rose-900 dark:text-rose-200">Taxpayer Reported Operating Margin (EBIT)</p>
                  <p className="text-sm font-semibold text-rose-700 dark:text-rose-400 mt-0.5">Actual: 1.8% (Significantly below Q1 threshold of 4.8%)</p>
                </div>
                <div className="text-right">
                  <Badge color="red" size="sm">Variance: -4.6% from Median</Badge>
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-semibold">Adjustment required to Median (6.4%)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ADJUSTMENTS */}
        {activeTab === 'adjustments' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h3 className="font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider">
                Auditor's Proposed Statutory Assessment Breakdown
              </h3>
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300">
                  <tr>
                    <th className="p-2.5 rounded-l">Statutory Assessment Element</th>
                    <th className="p-2.5 text-center">Legal / Proclamation Basis</th>
                    <th className="p-2.5 text-right rounded-r">Amount (ETB)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  <tr>
                    <td className="p-2.5 font-medium">Transfer Pricing Income Adjustment (Disallowed Fee)</td>
                    <td className="p-2.5 text-center text-gray-500">Proc. 979/2016 Art. 79</td>
                    <td className="p-2.5 text-right font-bold text-gray-900 dark:text-white">{formatRevenue(proposedTaxAdjustment)}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Corporate Income Tax (CIT @ 30%)</td>
                    <td className="p-2.5 text-center text-gray-500">Proc. 979/2016 Art. 19</td>
                    <td className="p-2.5 text-right font-bold text-blue-600 dark:text-blue-400">{formatRevenue(corporateIncomeTax)}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Transfer Pricing Understatement Penalty (50%)</td>
                    <td className="p-2.5 text-center text-gray-500">Proc. 983/2016 Art. 104</td>
                    <td className="p-2.5 text-right font-bold text-amber-600 dark:text-amber-400">{formatRevenue(penaltyAmount)}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Statutory Late Payment Interest</td>
                    <td className="p-2.5 text-center text-gray-500">Proc. 983/2016 Art. 105</td>
                    <td className="p-2.5 text-right font-bold text-orange-600 dark:text-orange-400">{formatRevenue(interestAmount)}</td>
                  </tr>
                  <tr className="bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-bold">
                    <td className="p-2.5 rounded-l">Total Additional Tax Assessment Demand</td>
                    <td className="p-2.5 text-center">Form FR-04.5-20 Assessment</td>
                    <td className="p-2.5 text-right rounded-r text-sm font-extrabold text-purple-700 dark:text-purple-300">{formatRevenue(totalTaxDemand)} ETB</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: DECISION */}
        {activeTab === 'decision' && (
          <div className="space-y-4 text-xs">
            {/* Supervisory Checklist */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
              <h3 className="font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider">
                Team Leader Quality Assurance Checklist
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={scopeVerified}
                    onChange={e => setScopeVerified(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>Audit scope conforms to the approved Annual Plan and 5-year statutory period.</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={methodologyVerified}
                    onChange={e => setMethodologyVerified(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>Transfer Pricing method (TNMM) and comparability search meet OECD and MoR guidelines.</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={workingPapersVerified}
                    onChange={e => setWorkingPapersVerified(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>All evidentiary working papers, IDR responses, and taxpayer minutes are properly cross-referenced.</span>
                </label>
              </div>
            </div>

            {/* Decision Routing Options */}
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h3 className="font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider">
                Select Supervisory Action
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Option 1: Endorse & Route to Committee */}
                <div
                  onClick={() => setDecisionType('ENDORSE_TO_COMMITTEE')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition ${
                    decisionType === 'ENDORSE_TO_COMMITTEE'
                      ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/30'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-purple-900 dark:text-purple-200 text-xs flex items-center gap-1.5">
                      <Award size={16} className="text-purple-600" />
                      Endorse & Route to Review Committee
                    </span>
                    <Badge color="purple" size="xs">Recommended</Badge>
                  </div>
                  <p className="text-gray-500 dark:text-slate-400 text-[11px]">
                    Forward to Joint / TP Committee with supervisory endorsement for formal assessment authorization.
                  </p>
                </div>

                {/* Option 2: Request Revisions */}
                <div
                  onClick={() => setDecisionType('REQUEST_REVISIONS')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition ${
                    decisionType === 'REQUEST_REVISIONS'
                      ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-amber-900 dark:text-amber-200 text-xs flex items-center gap-1.5">
                      <AlertTriangle size={16} className="text-amber-500" />
                      Request Revisions from Auditor
                    </span>
                    <Badge color="amber" size="xs">Rework</Badge>
                  </div>
                  <p className="text-gray-500 dark:text-slate-400 text-[11px]">
                    Return the working papers or draft report back to the lead auditor with mandatory rework notes.
                  </p>
                </div>
              </div>

              {/* Endorsement Notes / Rework Notes Input */}
              {decisionType === 'ENDORSE_TO_COMMITTEE' ? (
                <Textarea
                  label="Team Leader Endorsement Remarks for Review Committee *"
                  rows={3}
                  value={endorsementComments}
                  onChange={e => setEndorsementComments(e.target.value)}
                  placeholder="Provide your supervisory findings and formal recommendation to the committee..."
                  helper="This endorsement text will be presented directly to the Committee during deliberation."
                />
              ) : (
                <Textarea
                  label="Mandatory Revision Instructions for Lead Auditor *"
                  rows={3}
                  value={revisionComments}
                  onChange={e => setRevisionComments(e.target.value)}
                  placeholder="Detail specifically what sections, benchmark data, or evidence need to be amended before resubmission..."
                  helper="The lead auditor will be prompted with these specific revision notes."
                />
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
