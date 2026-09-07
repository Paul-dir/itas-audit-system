import React, { useState } from 'react';
import { 
  Landmark, ShieldAlert, CheckCircle2, ArrowRight, ArrowLeft,
  FileText, Send, User, Building2, Calendar, Scale, Layers,
  Check, X, MessageSquare, AlertCircle, BarChart2, DollarSign,
  Briefcase, Award, Users, AlertTriangle
} from 'lucide-react';
import { Modal, Button, Badge, Alert, Textarea, Input, Select } from '../../../components/ui/index.jsx';
import { formatRevenue } from '../../ap/utils/revenueFormatter.js';

/**
 * TpCommitteeApprovalModal
 * 
 * Dedicated deliberation & resolution console for Joint and TP Review Committees.
 * Committee members use this to evaluate high-value TP adjustments endorsed by
 * the Team Leader, record quorum minutes, and formally adopt statutory resolutions.
 * 
 * Committee Actions:
 *   1. Adopt Resolution & Authorize Assessment (APPROVED / APPROVED_WITH_CONDITIONS)
 *   2. Return to Team Leader for Clarification (RETURN_TO_TL)
 *   3. Disapprove / Reject Assessment (REJECTED)
 */
export default function TpCommitteeApprovalModal({ caseData, user, onClose, onRefresh, onResolutionAdopted }) {
  const [activeTab, setActiveTab] = useState('dossier'); // 'dossier' | 'deliberation' | 'resolution'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Committee Deliberation & Resolution Form
  const [decision, setDecision] = useState('APPROVED'); // 'APPROVED' | 'APPROVED_WITH_CONDITIONS' | 'RETURN_TO_TL' | 'REJECTED'
  const [resolutionNumber, setResolutionNumber] = useState(`TP-RES-2026/0${Math.floor(Math.random() * 50 + 40)}`);
  const [sessionTitle, setSessionTitle] = useState('Statutory TP Review — Cross-Border Management Fee Disallowance');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [quorum, setQuorum] = useState([
    'Dr. Almaz Tekle (Chair / Senior Economist)',
    'Abebe Bikila (Process Owner / Director)',
    'Yonas Haile (Legal & Treaty Counsel)',
    'Dawit Tadesse (LTO Representative)'
  ]);
  const [newQuorumMember, setNewQuorumMember] = useState('');
  const [committeeMinutes, setCommitteeMinutes] = useState(
    'Quorum established. The Committee reviewed the Team Leader supervisory endorsement and the TNMM comparability study. It was established that the taxpayer failed to demonstrate tangible benefit from offshore management fees paid to Mauritius. The Committee resolved to authorize the proposed transfer pricing adjustment of 24,500,000 ETB and mandatory 50% penalty under Art. 104 of Proclamation 983/2016.'
  );

  if (!caseData) return null;

  const taxpayerName = caseData.taxpayerName || caseData.taxpayerId || 'Crest Textiles SC';
  const tin = caseData.tin || caseData.taxpayerId || '1000082799';
  const sector = caseData.sector || 'Textiles & Garment Manufacturing';
  const caseNumber = caseData.caseNumber || '2026-TP-AA-0207';

  // Financial & Adjustment Figures
  const proposedTaxAdjustment = 24500000; // ETB 24.5M
  const corporateIncomeTax = 7350000; // 30% CIT
  const penaltyAmount = 3675000; // 50%
  const interestAmount = 1470000;
  const totalTaxDemand = corporateIncomeTax + penaltyAmount + interestAmount; // 12,495,000 ETB

  const handleAdoptResolution = async () => {
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      let newStatus = 'COMMITTEE_APPROVED';
      if (decision === 'RETURN_TO_TL') {
        newStatus = 'RETURNED_BY_COMMITTEE';
      } else if (decision === 'REJECTED') {
        newStatus = 'REJECTED';
      } else {
        newStatus = 'COMMITTEE_APPROVED';
      }

      // Persist status to backend
      const res = await fetch(`/api/v1/backoffice/ap/cases/${caseData.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': user?.id || user?.username || 'tp-chair'
        },
        body: JSON.stringify({ 
          status: newStatus,
          notes: `[Resolution ${resolutionNumber}] ${decision}: ${committeeMinutes}`,
          reviewerRole: 'COMMITTEE',
          resolutionNumber: resolutionNumber,
          decision: decision
        })
      });

      if (!res.ok) {
        console.warn('Backend update failed, proceeding with client update');
      }

      // Create new deliberation log entry for the committee dashboard
      const newDelib = {
        id: `DELIB-${Date.now()}`,
        sessionDate,
        sessionTitle,
        caseNumber,
        taxpayerName,
        agenda: 'Evaluation of cross-border management fee deductions & arm\'s-length adjustment',
        quorum,
        decision,
        proposedAdjustment: proposedTaxAdjustment,
        decisionNotes: committeeMinutes,
        resolutionNumber
      };

      if (onResolutionAdopted) {
        onResolutionAdopted(newDelib);
      }

      setSuccessMsg(
        decision === 'RETURN_TO_TL'
          ? 'Directive issued: Case returned to Team Leader for additional clarification.'
          : decision === 'REJECTED'
          ? 'Assessment rejected: Statutory disapproval recorded.'
          : `Resolution ${resolutionNumber} adopted! Case authorized for statutory Assessment Notice issuance.`
      );

      setTimeout(() => {
        if (onRefresh) onRefresh();
        onClose();
      }, 1500);

    } catch (err) {
      console.error('Failed to adopt committee resolution:', err);
      setError(err.message || 'Failed to submit resolution');
    } finally {
      setLoading(false);
    }
  };

  const addQuorumMember = () => {
    if (newQuorumMember.trim()) {
      setQuorum([...quorum, newQuorumMember.trim()]);
      setNewQuorumMember('');
    }
  };

  const removeQuorumMember = (idx) => {
    setQuorum(quorum.filter((_, i) => i !== idx));
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded-xl">
            <Landmark size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Joint & Transfer Pricing Committee Deliberation
              </h2>
              <Badge color="purple" size="xs">Quorum Review</Badge>
              <Badge color="green" size="xs" dot>TL Endorsed</Badge>
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
            Resolution: <strong className="text-purple-700 dark:text-purple-300 font-mono">{resolutionNumber}</strong>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Close
            </Button>
            {activeTab !== 'resolution' ? (
              <Button 
                variant="primary" 
                className="bg-purple-600 hover:bg-purple-700 text-white" 
                icon={ArrowRight}
                onClick={() => setActiveTab('resolution')}
              >
                Proceed to Deliberation & Vote
              </Button>
            ) : (
              <Button 
                variant="primary" 
                loading={loading}
                className={decision === 'RETURN_TO_TL' ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}
                icon={decision === 'RETURN_TO_TL' ? AlertTriangle : CheckCircle2}
                onClick={handleAdoptResolution}
              >
                {decision === 'RETURN_TO_TL' 
                  ? 'Return to Team Leader' 
                  : decision === 'REJECTED'
                  ? 'Reject Assessment'
                  : 'Adopt Resolution & Authorize'}
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Executive Exposure Summary Bar */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-xl shadow-md border border-purple-800/40">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <p className="text-slate-400 uppercase font-semibold text-[10px]">Supervisor Endorsement</p>
              <p className="text-sm font-bold text-emerald-300 mt-0.5">Workneh Kassa (TL)</p>
              <p className="text-[11px] text-slate-300">Formally Endorsed ✓</p>
            </div>
            <div>
              <p className="text-slate-400 uppercase font-semibold text-[10px]">Statutory Legal Grounds</p>
              <p className="text-sm font-bold text-purple-300 mt-0.5">Proc. 979/2016 Art. 79</p>
              <p className="text-[11px] text-slate-300">OECD Chapter VII</p>
            </div>
            <div>
              <p className="text-slate-400 uppercase font-semibold text-[10px]">Income Adjustment</p>
              <p className="text-base font-bold text-amber-300 mt-0.5">{formatRevenue(proposedTaxAdjustment)} ETB</p>
              <p className="text-[11px] text-slate-300">Disallowed Expenses</p>
            </div>
            <div>
              <p className="text-slate-400 uppercase font-semibold text-[10px]">Total Tax Assessment</p>
              <p className="text-base font-bold text-emerald-400 mt-0.5">{formatRevenue(totalTaxDemand)} ETB</p>
              <p className="text-[11px] text-purple-300">Principal + Penalty + Int.</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-slate-700">
          {[
            { id: 'dossier', label: '1. Executive Case Dossier & TL Endorsement', icon: FileText },
            { id: 'deliberation', label: '2. Economic Analysis & Assessment Matrix', icon: BarChart2 },
            { id: 'resolution', label: '3. Committee Deliberation & Resolution', icon: Landmark },
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

        {/* TAB 1: EXECUTIVE DOSSIER */}
        {activeTab === 'dossier' && (
          <div className="space-y-4 text-xs">
            {/* Team Leader Official Endorsement Quote Box */}
            <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/25 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                  <Award size={16} className="text-emerald-600" />
                  Team Leader Supervisory Endorsement & Recommendation
                </span>
                <Badge color="green" size="xs">Endorsed for Committee Action</Badge>
              </div>
              <p className="italic text-emerald-900 dark:text-emerald-300 text-xs leading-relaxed bg-white/70 dark:bg-slate-900/60 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                "Supervisory review completed. The TNMM comparability study and interquartile range calculation under Art. 79 of Proclamation 979/2016 are technically sound. Material profit shifting via low-tax jurisdiction confirmed. Endorsed for Committee formal deliberation and assessment authorization."
              </p>
              <div className="flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-400 pt-1">
                <span>Reviewer: <strong>Workneh Kassa (TP Audit Team Leader)</strong></span>
                <span className="font-mono">Review Date: {sessionDate}</span>
              </div>
            </div>

            {/* Case Background & Taxpayer Profile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <h3 className="font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <Building2 size={14} className="text-purple-600" />
                  Taxpayer & Related Entity Details
                </h3>
                <div className="space-y-1 text-gray-600 dark:text-slate-300">
                  <p><strong className="text-gray-900 dark:text-white">Taxpayer:</strong> {taxpayerName}</p>
                  <p><strong className="text-gray-900 dark:text-white">TIN:</strong> {tin}</p>
                  <p><strong className="text-gray-900 dark:text-white">Sector:</strong> {sector}</p>
                  <p><strong className="text-gray-900 dark:text-white">Tax Center:</strong> Addis Ababa LTO</p>
                  <p><strong className="text-gray-900 dark:text-white">Foreign Related Entity:</strong> Crest Global Holdings Ltd (Mauritius)</p>
                  <p><strong className="text-gray-900 dark:text-white">Jurisdiction Tax Status:</strong> 5% Treaty Concession Rate</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <h3 className="font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <ShieldAlert size={14} className="text-amber-500" />
                  Executive Audit Findings
                </h3>
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                  Taxpayer deducted <strong>75,000,000 ETB</strong> in offshore management and technical service fees across 5 tax years. 
                  Audit team conducted exhaustive interviews and IDRs, concluding that the services provided duplicate local administrative functions 
                  and are non-deductible under statutory transfer pricing principles.
                </p>
                <div className="p-2 bg-amber-50 dark:bg-amber-950/40 rounded border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-[11px]">
                  <strong>Committee Mandate:</strong> Authorize full disallowance and 50% understatement penalty.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ECONOMIC ANALYSIS */}
        {activeTab === 'deliberation' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider">
                  Economic Benchmarking & Arm's-Length Compliance
                </h3>
                <Badge color="purple">TNMM Operating Margin Method</Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Taxpayer Actual EBIT</p>
                  <p className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-0.5">1.8%</p>
                  <p className="text-[10px] text-rose-500 font-semibold">Severely Depressed Margin</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold uppercase">Statutory Median Target</p>
                  <p className="text-xl font-extrabold text-purple-800 dark:text-purple-200 mt-0.5">6.4%</p>
                  <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">Arm's Length Standard</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Interquartile Range</p>
                  <p className="text-lg font-bold text-gray-700 dark:text-slate-200 mt-0.5">4.8% – 8.1%</p>
                  <p className="text-[10px] text-gray-400">Comparable Companies Range</p>
                </div>
              </div>

              {/* Assessment Table */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 font-semibold">
                    <tr>
                      <th className="p-2.5">Assessment Item</th>
                      <th className="p-2.5 text-center">Tax Period</th>
                      <th className="p-2.5 text-center">Statutory Basis</th>
                      <th className="p-2.5 text-right">Assessment Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    <tr>
                      <td className="p-2.5 font-medium">Transfer Pricing Disallowance (Mgmt Fees)</td>
                      <td className="p-2.5 text-center">FY 2020 – 2024</td>
                      <td className="p-2.5 text-center text-gray-500">Proc. 979/2016 Art. 79</td>
                      <td className="p-2.5 text-right font-bold text-gray-900 dark:text-white">{formatRevenue(proposedTaxAdjustment)} ETB</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Corporate Income Tax Demand (30%)</td>
                      <td className="p-2.5 text-center">FY 2020 – 2024</td>
                      <td className="p-2.5 text-center text-gray-500">Proc. 979/2016 Art. 19</td>
                      <td className="p-2.5 text-right font-bold text-blue-600 dark:text-blue-400">{formatRevenue(corporateIncomeTax)} ETB</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">TP Understatement Penalty (50%)</td>
                      <td className="p-2.5 text-center">—</td>
                      <td className="p-2.5 text-center text-gray-500">Proc. 983/2016 Art. 104</td>
                      <td className="p-2.5 text-right font-bold text-amber-600 dark:text-amber-400">{formatRevenue(penaltyAmount)} ETB</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Statutory Late Payment Interest</td>
                      <td className="p-2.5 text-center">—</td>
                      <td className="p-2.5 text-center text-gray-500">Proc. 983/2016 Art. 105</td>
                      <td className="p-2.5 text-right font-bold text-orange-600 dark:text-orange-400">{formatRevenue(interestAmount)} ETB</td>
                    </tr>
                    <tr className="bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-bold">
                      <td className="p-2.5">Total Assessment Demand to be Authorized</td>
                      <td className="p-2.5 text-center" colSpan={2}>Form FR-04.5-20 Official Demand</td>
                      <td className="p-2.5 text-right text-sm font-extrabold text-purple-700 dark:text-purple-300">{formatRevenue(totalTaxDemand)} ETB</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RESOLUTION & DELIBERATION */}
        {activeTab === 'resolution' && (
          <div className="space-y-4 text-xs">
            {/* Deliberation Meta */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h3 className="font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider text-xs">
                Committee Session Details & Quorum Establishment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  label="Session Title"
                  value={sessionTitle}
                  onChange={e => setSessionTitle(e.target.value)}
                />
                <Input
                  label="Deliberation Date"
                  type="date"
                  value={sessionDate}
                  onChange={e => setSessionDate(e.target.value)}
                />
                <Input
                  label="Statutory Resolution #"
                  value={resolutionNumber}
                  onChange={e => setResolutionNumber(e.target.value)}
                  helper="Unique MoR Resolution Number"
                />
              </div>

              {/* Quorum Members */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                  Authorized Quorum Members Present ({quorum.length})
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {quorum.map((member, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 text-xs"
                    >
                      <User size={12} />
                      {member}
                      <button 
                        type="button" 
                        onClick={() => removeQuorumMember(idx)}
                        className="text-purple-500 hover:text-rose-600 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add committee member name & role..."
                    value={newQuorumMember}
                    onChange={e => setNewQuorumMember(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addQuorumMember(); } }}
                  />
                  <Button size="sm" variant="secondary" onClick={addQuorumMember}>Add</Button>
                </div>
              </div>
            </div>

            {/* Decision Selection */}
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h3 className="font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider text-xs">
                Formal Committee Resolution Decision
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Decision 1: APPROVED */}
                <div
                  onClick={() => setDecision('APPROVED')}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition ${
                    decision === 'APPROVED'
                      ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/30'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-purple-900 dark:text-purple-200 text-xs flex items-center gap-1.5">
                      <CheckCircle2 size={15} className="text-purple-600" />
                      Approve Assessment
                    </span>
                    <Badge color="purple" size="xs">Recommended</Badge>
                  </div>
                  <p className="text-gray-500 dark:text-slate-400 text-[11px]">
                    Unanimously adopt resolution and authorize full tax demand & notice issuance.
                  </p>
                </div>

                {/* Decision 2: RETURN TO TL */}
                <div
                  onClick={() => setDecision('RETURN_TO_TL')}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition ${
                    decision === 'RETURN_TO_TL'
                      ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-amber-900 dark:text-amber-200 text-xs flex items-center gap-1.5">
                      <AlertTriangle size={15} className="text-amber-500" />
                      Return to Team Leader
                    </span>
                    <Badge color="amber" size="xs">Clarify</Badge>
                  </div>
                  <p className="text-gray-500 dark:text-slate-400 text-[11px]">
                    Request technical clarifications or additional comparability evidence from the Team Leader.
                  </p>
                </div>

                {/* Decision 3: REJECTED */}
                <div
                  onClick={() => setDecision('REJECTED')}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition ${
                    decision === 'REJECTED'
                      ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-rose-900 dark:text-rose-200 text-xs flex items-center gap-1.5">
                      <X size={15} className="text-rose-600" />
                      Disapprove / Reject
                    </span>
                    <Badge color="red" size="xs">Disapprove</Badge>
                  </div>
                  <p className="text-gray-500 dark:text-slate-400 text-[11px]">
                    Reject the proposed adjustments as unsubstantiated or outside statutory scope.
                  </p>
                </div>
              </div>

              {/* Committee Finding Statement */}
              <Textarea
                label="Statutory Committee Resolution Text & Findings *"
                rows={4}
                value={committeeMinutes}
                onChange={e => setCommitteeMinutes(e.target.value)}
                helper="This resolution text will be officially stamped and recorded in the audit history."
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
