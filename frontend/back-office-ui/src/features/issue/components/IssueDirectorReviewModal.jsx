import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, FileText, Scale, CheckCircle2, AlertTriangle, ArrowLeft,
  Send, RotateCcw, Building2, UserCheck, AlertOctagon, Layers,
  Clock, Hash, Sparkles, BookOpen, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { Modal, Badge, Button, Textarea, Card, Alert } from '../../../components/ui/index.jsx';

export default function IssueDirectorReviewModal({
  caseData,
  user,
  onClose,
  onRefresh
}) {
  const [loading, setLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [decision, setDecision] = useState('REPORT_FINALIZED'); // REPORT_FINALIZED | FRAUD_REFERRAL | COMPREHENSIVE_AUDIT_REFERRAL | RETURNED_FOR_REVISION
  const [comments, setComments] = useState(
    'Audit findings, third-party bank Swift cross-matches, and Team Leader technical recommendations reviewed and verified under Proclamation 979/2016. Statutory assessment authorized.'
  );
  const [actionError, setActionError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const caseId = caseData?.id || caseData?.caseNumber;

  useEffect(() => {
    if (!caseId) return;
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/v1/backoffice/issue/cases/${caseId}`);
        if (res.ok) {
          const data = await res.json();
          setDetailData(data);
          if (data.directorComments) {
            setComments(data.directorComments);
          }
        }
      } catch (err) {
        console.error('Failed to load issue audit detail:', err);
      }
    };
    fetchDetail();
  }, [caseId]);

  const handleDecisionSubmit = async () => {
    if (!comments.trim()) {
      setActionError('Director follow-up decision rationale is required.');
      return;
    }

    setLoading(true);
    setActionError(null);
    try {
      const payload = {
        action: 'DECISION_DIRECTOR',
        decision,
        comments,
        identifiedIssue: detailData?.identifiedIssue || 'VAT Withholding & Overhead Disallowance Discrepancy',
        totalAdjustedAmount: detailData?.totalAdjustedAmount || 14850000
      };

      const res = await fetch(`/api/v1/backoffice/issue/cases/${caseId}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': user?.id || 'tax-center-director'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Failed with HTTP status ${res.status}`);
      }

      setSuccessMsg(
        decision === 'REPORT_FINALIZED'
          ? '✓ Issue Audit Report finalized. Statutory assessment notice issued with 30-day response period.'
          : decision === 'FRAUD_REFERRAL'
          ? '⚠️ Case officially referred to Intelligence & Tax Fraud Investigation sub-process.'
          : decision === 'COMPREHENSIVE_AUDIT_REFERRAL'
          ? '📈 Case escalated to full Comprehensive Audit scope.'
          : '↩ Case returned to Team Leader for revision.'
      );

      if (onRefresh) {
        setTimeout(onRefresh, 1000);
      }
    } catch (err) {
      console.error('Error submitting director decision:', err);
      setActionError(err.message || 'Failed to submit director follow-up decision.');
    } finally {
      setLoading(false);
    }
  };

  if (!caseData) return null;

  const adjustedPrincipal = detailData?.totalAdjustedAmount || 14850000;
  const penaltyAmount = adjustedPrincipal * 0.20;
  const interestAmount = adjustedPrincipal * 0.15;
  const totalLiability = adjustedPrincipal + penaltyAmount + interestAmount;

  return (
    <Modal
      open={!!caseData}
      onClose={onClose}
      title=""
      size="xl"
    >
      <div className="-mt-1 space-y-5">
        {/* ═══ EXECUTIVE HEADER BAR ═══ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
              <Building2 size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Tax Center Directorate — Issue Audit Final Resolution
                </h2>
                <Badge color="blue" size="sm">FR-04.6-07 Statutory Authority</Badge>
                <Badge color="teal" size="sm">Tax Center Direct Approval</Badge>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Taxpayer: <strong className="text-gray-800 dark:text-gray-200">{caseData.taxpayerName || 'United Services PLC'}</strong>
                {' '}(TIN: <span className="font-mono">{caseData.tin || caseData.taxpayerId}</span>)
                {' '}• Ref: <span className="font-mono text-blue-600 dark:text-blue-400">{caseData.caseNumber}</span>
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <Badge color="green" dot size="sm">
              Team Leader Endorsed
            </Badge>
            <p className="text-[11px] text-gray-400 mt-1">
              Branch: {caseData.taxCenterCode || 'TC-AA-01'}
            </p>
          </div>
        </div>

        {/* ═══ TEAM LEADER TECHNICAL ENDORSEMENT DOSSIER ═══ */}
        <div className="bg-gradient-to-r from-blue-50/80 via-slate-50 to-indigo-50/80 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/40 rounded-xl p-4 border border-blue-100 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
              <UserCheck size={14} className="text-blue-600" />
              Team Leader Official Endorsement & Technical Recommendation
            </span>
            <span className="text-xs text-gray-500">
              Endorsed by: <strong className="text-gray-700 dark:text-gray-300">Issue Team Leader</strong>
            </span>
          </div>
          <blockquote className="text-xs italic text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-slate-700 leading-relaxed">
            "{detailData?.teamLeaderComments || 'Technical review completed. The evidence gathered (customs entry, bank Swift records, and physical inspection) substantiates the VAT withholding discrepancy and Art. 27 overhead expense disallowance. Recommended for Tax Center Director review.'}"
          </blockquote>
          <div className="flex justify-between items-center pt-1 text-xs">
            <span className="text-gray-600 dark:text-gray-400">
              Targeted Issue: <strong className="text-gray-900 dark:text-white">{detailData?.identifiedIssue || 'VAT Withholding & Overhead Disallowance'}</strong>
            </span>
            <span className="font-black text-blue-700 dark:text-blue-400 text-sm">
              Total Recommended Assessment: ETB {totalLiability.toLocaleString()}
            </span>
          </div>
        </div>

        {/* ═══ STATUTORY LIABILITY SUMMARY TABLE ═══ */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-slate-700/60 text-gray-600 dark:text-gray-300 uppercase font-semibold border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-2.5">Assessment Component</th>
                <th className="px-4 py-2.5">Statutory Basis</th>
                <th className="px-4 py-2.5 text-right">Calculated Amount (ETB)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              <tr>
                <td className="px-4 py-2.5 font-medium">Principal Tax Understatement</td>
                <td className="px-4 py-2.5 text-gray-500">VAT Proclamation 979/2016 Art. 54</td>
                <td className="px-4 py-2.5 text-right font-bold">{adjustedPrincipal.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium">Substantial Understatement Penalty</td>
                <td className="px-4 py-2.5 text-gray-500">Tax Administration Proclamation (20%)</td>
                <td className="px-4 py-2.5 text-right font-bold text-amber-600">{penaltyAmount.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium">Late Payment Interest Accrued</td>
                <td className="px-4 py-2.5 text-gray-500">Commercial Bank Lending Rate + 2% (15% p.a.)</td>
                <td className="px-4 py-2.5 text-right font-bold text-amber-600">{interestAmount.toLocaleString()}</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-slate-900 font-bold border-t-2 border-gray-300 dark:border-slate-600">
                <td className="px-4 py-3 text-gray-900 dark:text-white" colSpan={2}>
                  Total Statutory Demand Payable by Taxpayer
                </td>
                <td className="px-4 py-3 text-right text-base text-rose-600 dark:text-rose-400 font-black">
                  ETB {totalLiability.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ═══ STATUTORY FOLLOW-UP DECISION SELECTOR (FR-04.6-07) ═══ */}
        <div className="space-y-3 bg-gray-50/70 dark:bg-slate-800/60 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Scale size={14} className="text-blue-600" />
            Select Statutory Follow-Up Determination (FR-04.6-07)
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Option 1 */}
            <div
              onClick={() => setDecision('REPORT_FINALIZED')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                decision === 'REPORT_FINALIZED'
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs'
                  : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  Finalize & Assess
                </span>
                {decision === 'REPORT_FINALIZED' && <Badge color="green" size="xs">Selected</Badge>}
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Adopt findings and issue final assessment notice. Standard 30-day taxpayer objection window.
              </p>
            </div>

            {/* Option 2 */}
            <div
              onClick={() => setDecision('FRAUD_REFERRAL')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                decision === 'FRAUD_REFERRAL'
                  ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 shadow-xs'
                  : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <AlertOctagon size={15} className="text-rose-600" />
                  Fraud Referral
                </span>
                {decision === 'FRAUD_REFERRAL' && <Badge color="red" size="xs">Selected</Badge>}
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Signs of willful evasion detected. Triggers "Intelligence & Tax Fraud Investigation" sub-process.
              </p>
            </div>

            {/* Option 3 */}
            <div
              onClick={() => setDecision('COMPREHENSIVE_AUDIT_REFERRAL')}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                decision === 'COMPREHENSIVE_AUDIT_REFERRAL'
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-xs'
                  : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <ArrowUpRight size={15} className="text-indigo-600" />
                  Comprehensive Scope
                </span>
                {decision === 'COMPREHENSIVE_AUDIT_REFERRAL' && <Badge color="indigo" size="xs">Selected</Badge>}
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Systemic tax non-compliance identified across multiple tax types. Triggers full Comprehensive Audit.
              </p>
            </div>
          </div>
        </div>

        {/* ═══ DIRECTOR DIRECTIVES & DELIBERATION NOTES ═══ */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <FileText size={14} className="text-blue-600" />
            Tax Center Director Statutory Rationale & Assessment Directives *
          </label>
          <Textarea
            rows={3}
            placeholder="Document legal reasoning, statutory proclamation citations, or referral directives..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full text-xs rounded-lg"
          />
        </div>

        {actionError && (
          <Alert type="error">{actionError}</Alert>
        )}

        {successMsg && (
          <Alert type="success">{successMsg}</Alert>
        )}

        {/* ═══ MODAL ACTIONS ═══ */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Close
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              icon={RotateCcw}
              loading={loading}
              onClick={() => {
                setDecision('RETURNED_FOR_REVISION');
                handleDecisionSubmit();
              }}
              title="Return case to Team Leader with instructions for re-examination"
            >
              ↩ Return to Team Leader
            </Button>

            <Button
              variant="primary"
              icon={Send}
              loading={loading}
              onClick={handleDecisionSubmit}
              className={`${
                decision === 'REPORT_FINALIZED'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : decision === 'FRAUD_REFERRAL'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } text-white shadow-sm`}
            >
              {decision === 'REPORT_FINALIZED'
                ? 'Authorize & Issue Final Assessment Notice'
                : decision === 'FRAUD_REFERRAL'
                ? 'Execute Fraud Referral to Intelligence'
                : 'Execute Comprehensive Audit Referral'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
