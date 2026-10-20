/**
 * FindingsPanel - Comprehensive Audit Findings & Assessment Calculation Panel
 * 
 * Features:
 * - Structured tax finding builder (Tax Type, Proclamation basis, Severity)
 * - Financial breakdown: Principal Tax -> Penalty -> Interest -> Total Assessment
 * - Automated statutory penalty & interest calculators (10%, 20%, 50% presets + custom)
 * - Real-time assessment rollup across all audit findings
 * - Team Leader approval governance workflow integration
 */

import { useState, useMemo, useEffect } from 'react';
import {
  AlertTriangle, Plus, Trash2, CheckCircle, Clock, Send,
  ArrowRight, Calculator, DollarSign, Shield, FileText, Scale,
  TrendingUp, Percent, Info, Edit3
} from 'lucide-react';
import { Card, Button, Badge } from '../../../components/ui/index.jsx';

const TAX_TYPES = [
  { id: 'VAT', label: 'Value Added Tax (VAT)', rate: '15%' },
  { id: 'CIT', label: 'Corporate Income Tax (CIT)', rate: '30%' },
  { id: 'WHT', label: 'Withholding Tax (WHT)', rate: '2% - 30%' },
  { id: 'PAYE', label: 'Employment Income Tax (PAYE)', rate: 'Prog. up to 35%' },
  { id: 'CUSTOMS', label: 'Customs Duty & Surtax', rate: 'Tariff Schedule' },
  { id: 'EXCISE', label: 'Excise Tax', rate: 'Excise Proclamation' },
  { id: 'OTHER', label: 'Other Direct / Indirect Tax', rate: 'Applicable Rate' },
];

const PENALTY_PRESETS = [
  { label: '10% (Late Filing/Pay)', rate: 0.10 },
  { label: '20% (Understatement)', rate: 0.20 },
  { label: '50% (Tax Evasion/Fraud)', rate: 0.50 },
];

export default function FindingsPanel({
  caseData,
  findings = [],
  onSubmit,
  onApprove,
  onProceed,
  isTeamLeader = false,
  isAuditor = true,
}) {
  const [localFindings, setLocalFindings] = useState(findings);

  useEffect(() => {
    if (findings && findings.length > 0) {
      setLocalFindings(findings);
      setShowAddForm(false);
    }
  }, [findings]);

  // Form State
  const [title, setTitle] = useState('');
  const [taxType, setTaxType] = useState('VAT');
  const [severity, setSeverity] = useState('MEDIUM');
  const [description, setDescription] = useState('');
  const [legalBasis, setLegalBasis] = useState('');

  // Financial Breakdown State: Principal -> Penalty -> Interest
  const [principalStr, setPrincipalStr] = useState('');
  const [penaltyStr, setPenaltyStr] = useState('');
  const [interestStr, setInterestStr] = useState('');
  const [selectedPenaltyPreset, setSelectedPenaltyPreset] = useState(null);

  const [formError, setFormError] = useState('');
  const [showAddForm, setShowAddForm] = useState(localFindings.length === 0);
  const [submitting, setSubmitting] = useState(false);

  // Computed amounts
  const principal = parseFloat(principalStr.replace(/,/g, '')) || 0;
  const penalty = parseFloat(penaltyStr.replace(/,/g, '')) || 0;
  const interest = parseFloat(interestStr.replace(/,/g, '')) || 0;
  const totalAssessment = principal + penalty + interest;

  // Apply Penalty Preset
  const applyPenaltyPreset = (preset) => {
    setSelectedPenaltyPreset(preset.label);
    if (principal > 0) {
      const computed = Math.round(principal * preset.rate * 100) / 100;
      setPenaltyStr(computed.toString());
    }
  };

  // Quick Interest Calculator (e.g. 25% p.a. standard Ethiopian commercial/statutory default)
  const applyInterestMonths = (months) => {
    if (principal > 0) {
      const annualRate = 0.25;
      const computed = Math.round((principal * annualRate * (months / 12)) * 100) / 100;
      setInterestStr(computed.toString());
    }
  };

  // Add Finding to list
  const handleAddFinding = () => {
    if (!title.trim() && !description.trim()) {
      setFormError('Please enter finding title or description.');
      return;
    }
    if (principal <= 0 && penalty <= 0 && interest <= 0) {
      setFormError('Please enter at least the Principal Tax amount.');
      return;
    }
    setFormError('');

    const newFindingItem = {
      id: `f-${Date.now()}`,
      title: title.trim() || `${taxType} Audit Adjustment`,
      taxType,
      category: taxType,
      severity,
      description: description.trim(),
      legalBasis: legalBasis.trim(),
      principalAmount: principal,
      penaltyAmount: penalty,
      interestAmount: interest,
      amount: totalAssessment,
      finalAmount: totalAssessment,
      financialImpact: totalAssessment,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
    };

    const updated = [...localFindings, newFindingItem];
    setLocalFindings(updated);

    // Reset Form
    setTitle('');
    setDescription('');
    setLegalBasis('');
    setPrincipalStr('');
    setPenaltyStr('');
    setInterestStr('');
    setSelectedPenaltyPreset(null);
    setShowAddForm(false);
  };

  const handleRemoveFinding = (id) => {
    setLocalFindings(prev => prev.filter(f => f.id !== id));
  };

  // Rollup Totals
  const rollups = useMemo(() => {
    return localFindings.reduce(
      (acc, f) => {
        const p = parseFloat(f.principalAmount || f.amount || 0);
        const pen = parseFloat(f.penaltyAmount || 0);
        const int = parseFloat(f.interestAmount || 0);
        const tot = parseFloat(f.finalAmount || f.financialImpact || (p + pen + int));
        return {
          totalPrincipal: acc.totalPrincipal + p,
          totalPenalty: acc.totalPenalty + pen,
          totalInterest: acc.totalInterest + int,
          grandTotal: acc.grandTotal + tot,
        };
      },
      { totalPrincipal: 0, totalPenalty: 0, totalInterest: 0, grandTotal: 0 }
    );
  }, [localFindings]);

  // Workflow Status check
  const allApproved = localFindings.length > 0 && localFindings.every(f => f.status === 'APPROVED');
  const isSubmitted = localFindings.some(f => f.status === 'SUBMITTED');

  const handleSubmitAll = async () => {
    setSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(localFindings);
      }
      setLocalFindings(prev => prev.map(f => ({ ...f, status: 'SUBMITTED' })));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* ── Top Header Banner ── */}
      <Card className="p-5 border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50/40 to-transparent dark:from-amber-950/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-xl">
              <Scale size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Step 7: Audit Findings &amp; Assessment Calculation
                </h3>
                <Badge color="yellow">Requires TL Approval</Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Determine proposed tax liabilities with statutory breakdown: 
                <strong className="text-gray-900 dark:text-white font-semibold"> Principal Tax + Penalty + Interest</strong>.
                Submitted findings must be reviewed and approved by the Team Leader before the 30-day taxpayer response window opens.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {allApproved && (
              <Button
                variant="primary"
                icon={ArrowRight}
                size="md"
                onClick={onProceed}
              >
                Proceed to Taxpayer Response
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* ── Status Banner for Approval ── */}
      {isSubmitted && !allApproved && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock size={18} className="text-blue-600" />
              <div>
                <p className="text-xs font-bold text-blue-900 dark:text-blue-200">
                  Findings Submitted for Team Leader Review
                </p>
                <p className="text-[11px] text-blue-700 dark:text-blue-300">
                  Awaiting formal Team Leader approval. Once approved, the case advances to the statutory 30-day Taxpayer Response gate.
                </p>
              </div>
            </div>
            {isTeamLeader && onApprove && (
              <Button
                variant="success"
                size="sm"
                icon={CheckCircle}
                onClick={onApprove}
              >
                Approve Findings
              </Button>
            )}
          </div>
        </Card>
      )}

      {allApproved && (
        <Card className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle size={18} className="text-emerald-600" />
              <div>
                <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  Findings Approved by Team Leader
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                  Assessment amounts validated. Ready to proceed to Taxpayer Response.
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={ArrowRight}
              onClick={onProceed}
            >
              Proceed to Taxpayer Response
            </Button>
          </div>
        </Card>
      )}

      {/* ── Financial Assessment Summary Rollup Cards ── */}
      {localFindings.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-3.5 border-l-4 border-l-blue-500 bg-white dark:bg-slate-900">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
              1. Principal Tax
            </span>
            <p className="text-base font-extrabold text-blue-700 dark:text-blue-400 mt-1">
              ETB {rollups.totalPrincipal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-gray-500">Base Underreported Tax</span>
          </Card>

          <Card className="p-3.5 border-l-4 border-l-amber-500 bg-white dark:bg-slate-900">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
              2. Total Penalties
            </span>
            <p className="text-base font-extrabold text-amber-700 dark:text-amber-400 mt-1">
              ETB {rollups.totalPenalty.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-gray-500">Statutory Penalties</span>
          </Card>

          <Card className="p-3.5 border-l-4 border-l-purple-500 bg-white dark:bg-slate-900">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
              3. Total Interest
            </span>
            <p className="text-base font-extrabold text-purple-700 dark:text-purple-400 mt-1">
              ETB {rollups.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-gray-500">Accrued Late Interest</span>
          </Card>

          <Card className="p-3.5 border-l-4 border-l-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20">
            <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 tracking-wider block">
              Grand Total Assessment
            </span>
            <p className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
              ETB {rollups.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-300">Principal + Penalty + Interest</span>
          </Card>
        </div>
      )}

      {/* ── Existing Findings List ── */}
      {localFindings.length > 0 && (
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase text-gray-700 dark:text-slate-300 tracking-wider flex items-center gap-1.5">
              <FileText size={15} className="text-amber-600" />
              Recorded Audit Findings ({localFindings.length})
            </h4>
            {!showAddForm && (
              <Button
                variant="secondary"
                size="xs"
                icon={Plus}
                onClick={() => setShowAddForm(true)}
              >
                Add Another Finding
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {localFindings.map((finding, idx) => {
              const p = parseFloat(finding.principalAmount || finding.amount || 0);
              const pen = parseFloat(finding.penaltyAmount || 0);
              const int = parseFloat(finding.interestAmount || 0);
              const tot = parseFloat(finding.finalAmount || finding.financialImpact || (p + pen + int));

              return (
                <div
                  key={finding.id || idx}
                  className="p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {finding.title || finding.description}
                        </p>
                        <Badge color={finding.severity === 'HIGH' ? 'red' : finding.severity === 'MEDIUM' ? 'yellow' : 'blue'}>
                          {finding.severity || 'MEDIUM'}
                        </Badge>
                        <Badge color="gray">{finding.taxType || finding.category || 'VAT'}</Badge>
                        <Badge color={finding.status === 'APPROVED' ? 'green' : finding.status === 'SUBMITTED' ? 'blue' : 'gray'}>
                          {finding.status || 'DRAFT'}
                        </Badge>
                      </div>

                      {finding.description && finding.title && (
                        <p className="text-xs text-gray-600 dark:text-slate-300 mt-1">
                          {finding.description}
                        </p>
                      )}

                      {finding.legalBasis && (
                        <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1 font-mono">
                          ⚖️ Legal Basis: {finding.legalBasis}
                        </p>
                      )}
                    </div>

                    {finding.status !== 'APPROVED' && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFinding(finding.id)}
                        className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                        title="Delete Finding"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  {/* Financial Breakdown Pills: Principal -> Penalty -> Interest -> Total */}
                  <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Principal Tax</span>
                      <p className="font-bold text-gray-900 dark:text-white mt-0.5">
                        ETB {p.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-700 dark:text-amber-400 uppercase font-semibold">Penalty</span>
                      <p className="font-bold text-amber-800 dark:text-amber-300 mt-0.5">
                        ETB {pen.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-purple-700 dark:text-purple-400 uppercase font-semibold">Interest</span>
                      <p className="font-bold text-purple-800 dark:text-purple-300 mt-0.5">
                        ETB {int.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="bg-emerald-100/50 dark:bg-emerald-950/40 p-1.5 rounded-lg">
                      <span className="text-[10px] text-emerald-800 dark:text-emerald-300 uppercase font-bold">Total Assessment</span>
                      <p className="font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">
                        ETB {tot.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit for Approval Action */}
          {!isSubmitted && !allApproved && (
            <div className="flex justify-end pt-3 border-t border-gray-100 dark:border-slate-800">
              <Button
                variant="primary"
                icon={Send}
                size="md"
                loading={submitting}
                onClick={handleSubmitAll}
              >
                Submit Findings for Team Leader Approval
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* ── ADD NEW FINDING FORM ── */}
      {showAddForm && (
        <Card className="p-6 space-y-5 border-2 border-dashed border-gray-300 dark:border-slate-700">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Plus size={16} className="text-amber-600" />
                Add Audit Finding &amp; Assessment Calculation
              </h4>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                Record the underreported tax with automatic decomposition into Principal, Penalty, and Interest.
              </p>
            </div>
            {localFindings.length > 0 && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            )}
          </div>

          {formError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-700 dark:text-red-300">
              {formError}
            </div>
          )}

          {/* Title & Tax Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 tracking-wider mb-1 block">
                Finding Title / Heading *
              </label>
              <input
                type="text"
                placeholder="e.g. Unrecorded Cash Sales &amp; Output VAT Understatement"
                value={title}
                onChange={e => { setTitle(e.target.value); setFormError(''); }}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 tracking-wider mb-1 block">
                Tax Type *
              </label>
              <select
                value={taxType}
                onChange={e => setTaxType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-amber-500 outline-none"
              >
                {TAX_TYPES.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Severity & Legal Basis */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 tracking-wider mb-1 block">
                Audit Severity
              </label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-amber-500 outline-none"
              >
                <option value="HIGH">High Priority / Significant Impact</option>
                <option value="MEDIUM">Medium Priority / Material Discrepancy</option>
                <option value="LOW">Low Priority / Minor Adjustment</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 tracking-wider mb-1 block">
                Legal Basis / Statutory Reference
              </label>
              <input
                type="text"
                placeholder="e.g. Tax Administration Proc. No. 979/2016 Art. 104, VAT Proc. No. 285/2002"
                value={legalBasis}
                onChange={e => setLegalBasis(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 tracking-wider mb-1 block">
              Detailed Audit Findings &amp; Factual Evidence *
            </label>
            <textarea
              placeholder="Explain the audit examination findings, discrepancies identified in general ledgers/bank records, and taxpayer books of account..."
              value={description}
              onChange={e => { setDescription(e.target.value); setFormError(''); }}
              rows={3}
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-amber-500 outline-none"
            />
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              CORE FINANCIAL BREAKDOWN: PRINCIPAL -> PENALTY -> INTEREST
              ══════════════════════════════════════════════════════════════════════ */}
          <div className="p-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700/60 pb-2.5">
              <h5 className="text-xs font-bold uppercase text-gray-800 dark:text-slate-200 tracking-wider flex items-center gap-2">
                <Calculator size={15} className="text-blue-600" />
                Assessment Amount Calculation (Principal ➔ Penalty ➔ Interest)
              </h5>
              <Badge color="blue">ETB Currency</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. Principal Tax Amount */}
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1 block flex items-center gap-1">
                  1. Principal Tax (ETB) *
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={principalStr}
                  onChange={e => { setPrincipalStr(e.target.value); setFormError(''); }}
                  className="w-full px-3 py-2 text-sm font-bold text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">Base unpaid or understated tax</span>
              </div>

              {/* 2. Penalty Amount */}
              <div>
                <label className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1 block flex items-center justify-between">
                  <span>2. Penalty (ETB)</span>
                  {selectedPenaltyPreset && (
                    <span className="text-[9px] font-normal text-amber-600 font-mono">({selectedPenaltyPreset})</span>
                  )}
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={penaltyStr}
                  onChange={e => { setPenaltyStr(e.target.value); setSelectedPenaltyPreset(null); }}
                  className="w-full px-3 py-2 text-sm font-bold text-amber-900 dark:text-amber-200 rounded-lg border border-amber-300 dark:border-amber-700/60 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                  {PENALTY_PRESETS.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => applyPenaltyPreset(p)}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 font-medium transition-colors"
                    >
                      {p.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Interest Amount */}
              <div>
                <label className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-1 block flex items-center justify-between">
                  <span>3. Interest (ETB)</span>
                  <span className="text-[9px] font-normal text-purple-600 font-mono">25% p.a.</span>
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={interestStr}
                  onChange={e => setInterestStr(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-bold text-purple-900 dark:text-purple-200 rounded-lg border border-purple-300 dark:border-purple-700/60 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <div className="flex gap-1.5 mt-1.5">
                  <button
                    type="button"
                    onClick={() => applyInterestMonths(6)}
                    className="px-1.5 py-0.5 rounded text-[10px] bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 font-medium transition-colors"
                  >
                    6 Mos
                  </button>
                  <button
                    type="button"
                    onClick={() => applyInterestMonths(12)}
                    className="px-1.5 py-0.5 rounded text-[10px] bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 font-medium transition-colors"
                  >
                    1 Year
                  </button>
                  <button
                    type="button"
                    onClick={() => applyInterestMonths(24)}
                    className="px-1.5 py-0.5 rounded text-[10px] bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 font-medium transition-colors"
                  >
                    2 Years
                  </button>
                </div>
              </div>
            </div>

            {/* Total Assessment Breakdown Display */}
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                Total Assessed Liability for Finding:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-mono">
                  ETB {principal.toLocaleString()} + ETB {penalty.toLocaleString()} + ETB {interest.toLocaleString()} =
                </span>
                <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">
                  ETB {totalAssessment.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-slate-800">
            {localFindings.length > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            )}
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={handleAddFinding}
            >
              Add Finding to Assessment
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
