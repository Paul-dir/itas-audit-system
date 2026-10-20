import { useState, useEffect, useMemo } from 'react';
import {
  Building2, Calendar, CheckCircle2, AlertTriangle, ArrowLeft, ArrowRight,
  Send, RotateCcw, ShieldCheck, Check, Minus, Plus, FileText,
  Clock, Info, Copy, Sparkles, UserCheck
} from 'lucide-react';
import { Modal, Badge, Button, Textarea, Alert } from '../../../../components/ui/index.jsx';
import { AUDIT_TYPES } from '../../data/constants.js';

// Descriptions for audit types in the context of tax center capacity
const AUDIT_TYPE_DESCRIPTIONS = {
  desk_audit: 'Single tax type verification & office-based examination',
  joint_audit: 'Inter-jurisdictional & multi-authority collaborative audits',
  transfer_pricing: 'Cross-border related party transactions & BEPS review',
  comprehensive: 'Full-scope multi-tax comprehensive audit',
  issue_audit: 'Targeted single-issue investigation & VAT cross-checks'
};

export default function TaxCenterCapacityFeedbackModal({
  open,
  onClose,
  allocation,
  taxCenter,
  user,
  onSuccess
}) {
  const [step, setStep] = useState('review'); // 'review' | 'confirm' | 'success' | 'error'
  const [adjustedAllocation, setAdjustedAllocation] = useState({});
  const [feedbackText, setFeedbackText] = useState('');
  const [declaredConfirmation, setDeclaredConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  const allocationId = allocation?.allocationId;

  // Initialize allocation adjustments when allocation changes or modal opens
  useEffect(() => {
    if (allocation) {
      setStep('review');
      setFeedbackText('Full operational capacity confirmed for FY ' + (allocation.planYear || '2029') + ' allocation.');
      setDeclaredConfirmation(false);
      setSubmissionError(null);
      setReceiptData(null);
      setCopiedReceipt(false);

      const adjustments = {};
      const backendAlloc = allocation.allocationsByAuditType || {};
      const normalizedBackend = {};
      Object.keys(backendAlloc).forEach(key => {
        let normKey = key.toLowerCase();
        if (normKey === 'comprehensive_audit') normKey = 'comprehensive';
        normalizedBackend[normKey] = backendAlloc[key];
      });
      AUDIT_TYPES.forEach(at => {
        adjustments[at.id] = normalizedBackend[at.id] ?? 0;
      });
      setAdjustedAllocation(adjustments);
    }
  }, [allocationId, open]);

  // Derived calculations
  const originalTotal = allocation?.proposedCount || 0;
  const totalAdjusted = useMemo(() => {
    return Object.values(adjustedAllocation).reduce((sum, val) => sum + (parseInt(val, 10) || 0), 0);
  }, [adjustedAllocation]);

  const reduction = originalTotal - totalAdjusted;
  const variance = totalAdjusted - originalTotal;
  const reductionPercent = originalTotal > 0 ? Math.round((Math.abs(reduction) / originalTotal) * 100) : 0;
  const absorptionPercent = originalTotal > 0 ? Math.round((totalAdjusted / originalTotal) * 100) : 100;

  // Handlers for adjustments
  const handleValueChange = (auditTypeId, rawValue) => {
    const val = Math.max(0, parseInt(rawValue, 10) || 0);
    setAdjustedAllocation(prev => ({ ...prev, [auditTypeId]: val }));
  };

  const handleIncrement = (auditTypeId) => {
    setAdjustedAllocation(prev => ({
      ...prev,
      [auditTypeId]: (parseInt(prev[auditTypeId], 10) || 0) + 1
    }));
  };

  const handleDecrement = (auditTypeId) => {
    setAdjustedAllocation(prev => ({
      ...prev,
      [auditTypeId]: Math.max(0, (parseInt(prev[auditTypeId], 10) || 0) - 1)
    }));
  };

  const handleResetRow = (auditTypeId) => {
    const orig = allocation?.allocationsByAuditType?.[auditTypeId] ||
                 allocation?.allocationsByAuditType?.[auditTypeId.toUpperCase()] || 0;
    setAdjustedAllocation(prev => ({ ...prev, [auditTypeId]: orig }));
  };

  const handleResetAll = () => {
    const adjustments = {};
    const backendAlloc = allocation?.allocationsByAuditType || {};
    const normalizedBackend = {};
    Object.keys(backendAlloc).forEach(key => {
      let normKey = key.toLowerCase();
      if (normKey === 'comprehensive_audit') normKey = 'comprehensive';
      normalizedBackend[normKey] = backendAlloc[key];
    });
    AUDIT_TYPES.forEach(at => {
      adjustments[at.id] = normalizedBackend[at.id] ?? 0;
    });
    setAdjustedAllocation(adjustments);
    setFeedbackText(`Full operational capacity confirmed for FY ${allocation?.planYear || '2029'} allocation.`);
  };

  // Preset feedback justifications
  const presetSuggestions = [
    { label: '✓ Full capacity confirmed', text: `Full operational capacity confirmed for FY ${allocation?.planYear || '2029'} allocation.` },
    { label: '⚠️ Headcount vacancy constraint', text: `Auditor headcount vacancy currently constrains our intake. Recommended capacity reallocated across available senior staff.` },
    { label: '⏳ Multi-year audit backlog', text: `Branch is actively managing ongoing multi-year audits. Capacity adjusted to safeguard investigation thoroughness.` },
    { label: '🎓 Auditor training scheduled', text: `Mandatory specialized tax audit training scheduled for Q2 requires temporary capacity adjustments.` }
  ];

  const applyPreset = (preset) => {
    setFeedbackText(preset.text);
    setSubmissionError(null);
  };

  // Navigation between steps
  const handleProceedToConfirm = () => {
    if (!feedbackText.trim()) {
      setSubmissionError('Please provide operational comments or select a preset to justify your capacity response.');
      return;
    }
    setSubmissionError(null);
    setStep('confirm');
  };

  const handleSubmit = async () => {
    if (!allocation) return;
    setLoading(true);
    setSubmissionError(null);

    try {
      const response = await fetch(
        `/api/v1/backoffice/ap/tax-center/allocations/${allocation.allocationId}/acknowledge`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Actor-Id': user?.id || 'tax-center-manager'
          },
          body: JSON.stringify({
            taxCenterId: taxCenter,
            feedback: feedbackText,
            adjustedAllocations: adjustedAllocation,
            totalAdjusted,
            originalTotal
          })
        }
      );

      const result = await response.json();
      if (result.status === 'ERROR' || result.error) {
        throw new Error(result.error?.message || result.message || 'Submission failed');
      }

      const receiptRef = `ACK-${allocation.planYear || '2029'}-${(taxCenter || 'TC').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setReceiptData({
        ref: receiptRef,
        planName: allocation.planName,
        planYear: allocation.planYear,
        originalTotal,
        totalAdjusted,
        absorptionPercent,
        timestamp: new Date().toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short'
        }),
        submittedBy: user?.name || user?.id || 'Tax Center Manager',
        adjustments: adjustedAllocation
      });

      setStep('success');
      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      console.error('Failed to submit capacity acknowledgment:', error);
      setSubmissionError(error.message || 'An unexpected error occurred during submission.');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const copyReceiptRef = () => {
    if (receiptData?.ref) {
      navigator.clipboard.writeText(receiptData.ref);
      setCopiedReceipt(true);
      setTimeout(() => setCopiedReceipt(false), 2000);
    }
  };

  if (!open || !allocation) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title=""
      size="xl"
    >
      <div className="-mt-1 space-y-5">
        {/* ═══ ENTERPRISE MODAL HEADER ═══ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
              <Building2 size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Tax Center Capacity Review & Allocation
                </h2>
                <Badge color="blue" size="sm">FY {allocation.planYear || '2029'}</Badge>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1.5">
                <span>Branch:</span>
                <strong className="text-gray-700 dark:text-gray-300 uppercase">
                  {(taxCenter || '').replace(/-/g, ' ')}
                </strong>
                <span>•</span>
                <span>{allocation.planName || 'Annual Audit Plan'}</span>
              </p>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="flex items-center gap-1.5 self-start sm:self-center bg-gray-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-medium">
            <span className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
              step === 'review'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10px] flex items-center justify-center font-bold">1</span>
              Review
            </span>
            <span className="text-gray-300 dark:text-slate-600">›</span>
            <span className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
              step === 'confirm'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              <span className="w-4 h-4 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-[10px] flex items-center justify-center font-bold">2</span>
              Verify
            </span>
            <span className="text-gray-300 dark:text-slate-600">›</span>
            <span className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
              step === 'success'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold'
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-[10px] flex items-center justify-center font-bold">3</span>
              Receipt
            </span>
          </div>
        </div>

        {/* ═══ STEP 1: REVIEW & ADJUST ═══ */}
        {step === 'review' && (
          <div className="space-y-5 animate-fade-in">
            {/* Context Hero Banner */}
            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/60 dark:from-slate-800/80 dark:to-slate-800/40 rounded-xl p-4 border border-blue-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                    Pre-Approval Workload Consultation
                  </span>
                  <Badge color="blue" size="xs">Regional Draft</Badge>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  The Regional Directorate has allocated <strong>{originalTotal.toLocaleString()} audit cases</strong> from plan{' '}
                  <strong>"{allocation.planName}"</strong>. Review your auditor capacity across streams and record any resource adjustments.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="secondary"
                  icon={RotateCcw}
                  onClick={handleResetAll}
                  title="Reset all adjustments to original regional proposal"
                >
                  Reset Targets
                </Button>
              </div>
            </div>

            {/* KPI Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Card 1: Proposed */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-gray-200 dark:border-slate-700 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Regional Target
                  </span>
                  <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    <Building2 size={15} />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-gray-900 dark:text-white">
                    {originalTotal.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500">cases</span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  Proposed by Regional Director
                </p>
              </div>

              {/* Card 2: Current Capacity */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-gray-200 dark:border-slate-700 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Accepted Capacity
                  </span>
                  <div className={`p-1.5 rounded-lg ${
                    reduction === 0
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                      : reduction > 0
                      ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                      : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  }`}>
                    <CheckCircle2 size={15} />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-gray-900 dark:text-white">
                    {totalAdjusted.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500">cases</span>
                  <Badge
                    color={reduction === 0 ? 'green' : reduction > 0 ? 'yellow' : 'purple'}
                    size="xs"
                    className="ml-auto"
                  >
                    {absorptionPercent}% of Target
                  </Badge>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  {reduction === 0
                    ? '100% capacity absorption confirmed'
                    : reduction > 0
                    ? `${reduction} case (${reductionPercent}%) capacity reduction`
                    : `+${Math.abs(reduction)} additional case capacity requested`}
                </p>
              </div>

              {/* Card 3: Net Alignment */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-gray-200 dark:border-slate-700 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Net Alignment
                  </span>
                  <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
                    <ShieldCheck size={15} />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className={`text-2xl font-black ${
                    reduction === 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : reduction > 0
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-indigo-600 dark:text-indigo-400'
                  }`}>
                    {reduction === 0 ? 'Balanced' : reduction > 0 ? `-${reduction}` : `+${Math.abs(reduction)}`}
                  </span>
                  {reduction !== 0 && <span className="text-xs text-gray-500">variance</span>}
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  {reduction === 0
                    ? 'Branch capacity matches regional target'
                    : 'Requires supervisory justification below'}
                </p>
              </div>
            </div>

            {/* Capacity Allocation Matrix Table */}
            <div className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-xs bg-white dark:bg-slate-800">
              <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800/80 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Audit Stream Allocation & Capacity Breakdown
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Adjust numeric cases per audit stream according to available auditor specializations
                  </p>
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {AUDIT_TYPES.length} Streams Active
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      <th className="px-4 py-3">Audit Stream</th>
                      <th className="px-4 py-3 text-center w-36">Regional Target</th>
                      <th className="px-4 py-3 text-center w-52">Branch Capacity</th>
                      <th className="px-4 py-3 text-right w-40">Stream Variance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60">
                    {AUDIT_TYPES.map(at => {
                      const orig = allocation.allocationsByAuditType?.[at.id] ||
                                   allocation.allocationsByAuditType?.[at.id.toUpperCase()] || 0;
                      const curr = adjustedAllocation[at.id] ?? orig;
                      const diff = curr - orig;
                      const isModified = curr !== orig;

                      return (
                        <tr
                          key={at.id}
                          className={`hover:bg-gray-50/80 dark:hover:bg-slate-700/40 transition-colors ${
                            isModified ? 'bg-amber-50/20 dark:bg-amber-900/10' : ''
                          }`}
                        >
                          {/* Stream Name & Badge */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-start gap-2.5">
                              <Badge color={at.color} size="sm" className="mt-0.5">
                                {at.shortName}
                              </Badge>
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white leading-tight">
                                  {at.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                  {AUDIT_TYPE_DESCRIPTIONS[at.id] || 'Tax audit examination stream'}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Regional Target */}
                          <td className="px-4 py-3.5 text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200">
                              {orig.toLocaleString()} cases
                            </span>
                          </td>

                          {/* Branch Capacity Stepper Input */}
                          <td className="px-4 py-3.5 text-center">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleDecrement(at.id)}
                                disabled={curr <= 0}
                                className="w-8 h-8 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
                              >
                                <Minus size={13} />
                              </button>

                              <input
                                type="number"
                                min="0"
                                value={curr}
                                onChange={(e) => handleValueChange(at.id, e.target.value)}
                                className="w-18 px-2.5 py-1 text-center font-bold text-base text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-2xs"
                              />

                              <button
                                type="button"
                                onClick={() => handleIncrement(at.id)}
                                className="w-8 h-8 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors shadow-2xs"
                              >
                                <Plus size={13} />
                              </button>

                              {isModified && (
                                <button
                                  type="button"
                                  onClick={() => handleResetRow(at.id)}
                                  title="Reset to regional proposal"
                                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ml-1"
                                >
                                  <RotateCcw size={12} />
                                </button>
                              )}
                            </div>
                          </td>

                          {/* Variance Badge */}
                          <td className="px-4 py-3.5 text-right">
                            {diff === 0 ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
                                <Check size={12} /> Matched
                              </span>
                            ) : diff < 0 ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-800/40">
                                ▼ {diff} cases
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/40">
                                ▲ +{diff} cases
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                  {/* Summary Totals Row */}
                  <tfoot>
                    <tr className="bg-gray-100/80 dark:bg-slate-900 border-t-2 border-gray-300 dark:border-slate-600 font-bold text-sm">
                      <td className="px-4 py-3 text-gray-900 dark:text-white">
                        Total Audit Capacity
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-extrabold text-gray-900 dark:text-white">
                          {originalTotal.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-extrabold text-base ${
                          reduction === 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : reduction > 0
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-indigo-600 dark:text-indigo-400'
                        }`}>
                          {totalAdjusted.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Badge
                          color={reduction === 0 ? 'green' : reduction > 0 ? 'yellow' : 'purple'}
                          size="sm"
                        >
                          {reduction === 0 ? '100% Balanced' : `${variance > 0 ? '+' : ''}${variance} Cases`}
                        </Badge>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Operational Comments & Presets */}
            <div className="space-y-2 bg-gray-50/60 dark:bg-slate-800/40 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <FileText size={14} className="text-blue-600" />
                  Tax Center Operational Justification & Notes *
                </label>
                <span className="text-[11px] text-gray-500">
                  Required for Regional Director Reconciliation
                </span>
              </div>

              {/* 1-Click Quick Preset Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1 pb-1.5">
                {presetSuggestions.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-2xs"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <Textarea
                rows={3}
                placeholder="Explain auditor availability, pending multi-year audits, staff leave, or operational considerations..."
                value={feedbackText}
                onChange={(e) => {
                  setFeedbackText(e.target.value);
                  if (submissionError) setSubmissionError(null);
                }}
                className="w-full text-sm rounded-lg"
              />

              {submissionError && (
                <Alert type="error" className="mt-2">
                  {submissionError}
                </Alert>
              )}
            </div>

            {/* Step 1 Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={ArrowRight}
                onClick={handleProceedToConfirm}
                disabled={!feedbackText.trim()}
              >
                Proceed to Verification →
              </Button>
            </div>
          </div>
        )}

        {/* ═══ STEP 2: CONFIRM SUBMISSION ═══ */}
        {step === 'confirm' && (
          <div className="space-y-5 animate-fade-in">
            {/* Statutory Endorsement Notice */}
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5">
                <ShieldCheck size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">
                  Official Capacity Acknowledgment & Endorsement
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-400/90 leading-relaxed">
                  You are preparing to formally transmit this branch capacity evaluation for <strong>{(taxCenter || '').replace(/-/g, ' ').toUpperCase()}</strong>.
                  These figures are binding for the Annual Plan reconciliation process and will be recorded under your credentials in the Ministry of Revenues register.
                </p>
              </div>
            </div>

            {/* Side-by-Side Comparison Dossier */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box 1: Regional Plan Target */}
              <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    Regional Target
                  </span>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    Original Proposal
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-gray-500">Total Proposed:</span>
                  <span className="text-xl font-black text-gray-900 dark:text-white">
                    {originalTotal.toLocaleString()} Cases
                  </span>
                </div>
                <div className="space-y-1.5 pt-1 text-xs">
                  {AUDIT_TYPES.map(at => {
                    const orig = allocation.allocationsByAuditType?.[at.id] ||
                                 allocation.allocationsByAuditType?.[at.id.toUpperCase()] || 0;
                    return (
                      <div key={at.id} className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>{at.name}:</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{orig}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Box 2: Accepted Branch Capacity */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border-2 border-blue-500/30 dark:border-blue-500/40 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                    Branch Capacity
                  </span>
                  <Badge
                    color={reduction === 0 ? 'green' : reduction > 0 ? 'yellow' : 'purple'}
                    size="xs"
                  >
                    {absorptionPercent}% of Target
                  </Badge>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-gray-500">Total Confirmed:</span>
                  <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                    {totalAdjusted.toLocaleString()} Cases
                  </span>
                </div>
                <div className="space-y-1.5 pt-1 text-xs">
                  {AUDIT_TYPES.map(at => {
                    const orig = allocation.allocationsByAuditType?.[at.id] ||
                                 allocation.allocationsByAuditType?.[at.id.toUpperCase()] || 0;
                    const curr = adjustedAllocation[at.id] ?? orig;
                    const isDiff = curr !== orig;
                    return (
                      <div key={at.id} className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                        <span>{at.name}:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-gray-900 dark:text-white">{curr}</span>
                          {isDiff && (
                            <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400">
                              ({curr > orig ? `+${curr - orig}` : curr - orig})
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Justification Dossier Quote */}
            <div className="bg-gray-50 dark:bg-slate-800/80 rounded-xl p-4 border border-gray-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <UserCheck size={14} className="text-blue-600" />
                  Tax Center Operational Justification
                </span>
                <span className="text-xs text-gray-500">
                  Manager: <strong className="text-gray-700 dark:text-gray-300">{user?.name || user?.id || 'Tax Center Staff'}</strong>
                </span>
              </div>
              <blockquote className="text-sm italic text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-slate-700">
                "{feedbackText}"
              </blockquote>
            </div>

            {/* Statutory Declaration Checkbox */}
            <label className="flex items-start gap-3 p-3.5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-xl cursor-pointer select-none">
              <input
                type="checkbox"
                checked={declaredConfirmation}
                onChange={(e) => setDeclaredConfirmation(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-slate-600"
              />
              <span className="text-xs text-gray-700 dark:text-gray-300 leading-normal">
                I hereby declare that this capacity statement accurately represents our tax center's staffing and workload constraints for <strong>FY {allocation.planYear || '2029'}</strong>, and submit it for official Regional Directorate review.
              </span>
            </label>

            {submissionError && (
              <Alert type="error">{submissionError}</Alert>
            )}

            {/* Step 2 Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
              <Button
                variant="secondary"
                icon={ArrowLeft}
                onClick={() => setStep('review')}
                disabled={loading}
              >
                ← Back to Adjustments
              </Button>
              <Button
                variant="success"
                icon={Send}
                loading={loading}
                disabled={!declaredConfirmation || loading}
                onClick={handleSubmit}
              >
                {loading ? 'Transmitting Endorsement...' : 'Confirm & Transmit Endorsement'}
              </Button>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: OFFICIAL ACKNOWLEDGMENT RECEIPT (SUCCESS) ═══ */}
        {step === 'success' && receiptData && (
          <div className="space-y-5 py-2 animate-fade-in">
            {/* Celebratory Hero Header */}
            <div className="text-center space-y-2 py-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 p-5">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-extrabold text-emerald-800 dark:text-emerald-300 tracking-tight">
                Capacity Feedback Successfully Transmitted & Recorded
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 max-w-md mx-auto">
                Your branch capacity assessment has been officially logged in the ITAS Annual Plan Register and queued for Regional Director reconciliation.
              </p>
            </div>

            {/* Statutory Digital Receipt Dossier */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 dark:bg-slate-700/60 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <FileText size={14} className="text-emerald-600" />
                  Official Digital Acknowledgment Receipt
                </span>
                <button
                  type="button"
                  onClick={copyReceiptRef}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <Copy size={12} />
                  {copiedReceipt ? 'Copied!' : 'Copy Reference'}
                </button>
              </div>

              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Reference Number</p>
                  <p className="font-mono font-bold text-gray-900 dark:text-white mt-0.5">
                    {receiptData.ref}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Submission Timestamp</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-0.5">
                    {receiptData.timestamp}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Authenticated Staff</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-0.5">
                    {receiptData.submittedBy}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Annual Audit Plan</p>
                  <p className="font-medium text-gray-900 dark:text-white mt-0.5">
                    {receiptData.planName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Accepted Branch Capacity</p>
                  <p className="font-black text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">
                    {receiptData.totalAdjusted} Cases ({receiptData.absorptionPercent}%)
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Governance Status</p>
                  <Badge color="blue" size="xs" className="mt-0.5">
                    Pending Regional Authorization
                  </Badge>
                </div>
              </div>

              {/* Stream Breakdown Summary Chips */}
              <div className="px-4 py-3 bg-gray-50/50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-700">
                <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Confirmed Stream Allocation
                </p>
                <div className="flex flex-wrap gap-2">
                  {AUDIT_TYPES.map(at => {
                    const count = receiptData.adjustments?.[at.id] || 0;
                    return (
                      <span
                        key={at.id}
                        className="inline-flex items-center gap-1.5 text-xs bg-white dark:bg-slate-700 px-2.5 py-1 rounded-md border border-gray-200 dark:border-slate-600 font-medium text-gray-800 dark:text-gray-200"
                      >
                        <Badge color={at.color} size="xs">{at.shortName}</Badge>
                        <strong>{count}</strong>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Next Steps Lifecycle Roadmap */}
            <div className="bg-blue-50/60 dark:bg-slate-800 rounded-xl p-3.5 border border-blue-100 dark:border-slate-700">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-1.5">
                <Clock size={13} />
                Next Steps in the Annual Planning Workflow
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">1</span>
                  <span>Regional Directorate reconciles capacity across all tax centers.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">2</span>
                  <span>Federal Audit Directorate reviews and gives statutory authorization.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">3</span>
                  <span>Cases cascade to your tax center for risk-based auditor assignment.</span>
                </div>
              </div>
            </div>

            {/* Step 3 Action */}
            <div className="flex justify-end pt-2">
              <Button variant="primary" onClick={onClose}>
                Return to Tax Center Dashboard
              </Button>
            </div>
          </div>
        )}

        {/* ═══ STEP 4: SUBMISSION ERROR ═══ */}
        {step === 'error' && (
          <div className="text-center py-6 space-y-4 animate-fade-in">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle size={30} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-red-700 dark:text-red-400">
                Capacity Submission Encountered an Error
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                {submissionError || 'The server could not process the capacity feedback request.'}
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <Button variant="secondary" onClick={() => setStep('review')}>
                ← Return to Review
              </Button>
              <Button variant="danger" onClick={handleSubmit}>
                Retry Submission
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
