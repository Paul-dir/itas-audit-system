import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, FileText, Scale, CheckCircle2, AlertTriangle, ArrowLeft,
  Send, RotateCcw, Calendar, Building2, MapPin, UserCheck, Eye, Layers,
  Clock, Hash, Sparkles, BookOpen, AlertOctagon, HelpCircle, Check
} from 'lucide-react';
import { Modal, Badge, Button, Textarea, Card, Alert } from '../../../components/ui/index.jsx';

export default function IssueTeamLeaderReviewModal({
  caseData,
  user,
  onClose,
  onRefresh
}) {
  const [loading, setLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [comments, setComments] = useState(
    'Technical review completed. The evidence gathered (customs entry, bank Swift records, and physical inspection) substantiates the VAT withholding discrepancy and Art. 27 overhead expense disallowance. Recommended for Tax Center Director review.'
  );
  const [checklist, setChecklist] = useState({
    issueScopeVerified: true,
    evidenceSufficiency: true,
    fieldVisitDocumented: true,
    penaltyCalculated: true,
    workingPapersIndexed: true
  });
  const [actionError, setActionError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const caseId = caseData?.id || caseData?.caseNumber;

  // Fetch latest saved Issue Audit detail from backend
  useEffect(() => {
    if (!caseId) return;
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/v1/backoffice/issue/cases/${caseId}`);
        if (res.ok) {
          const data = await res.json();
          setDetailData(data);
          if (data.teamLeaderComments) {
            setComments(data.teamLeaderComments);
          }
        }
      } catch (err) {
        console.error('Failed to load issue audit detail:', err);
      }
    };
    fetchDetail();
  }, [caseId]);

  const allChecked = Object.values(checklist).every(Boolean);

  const handleReviewAction = async (decision) => {
    if (!comments.trim()) {
      setActionError('Supervisory technical review comments are required.');
      return;
    }
    if (decision === 'APPROVED' && !allChecked) {
      setActionError('Please complete all Supervisory Quality Assurance checklist items before endorsing.');
      return;
    }

    setLoading(true);
    setActionError(null);
    try {
      const payload = {
        action: 'REVIEW_TL',
        decision, // 'APPROVED' or 'RETURNED_FOR_REVISION'
        comments,
        identifiedIssue: detailData?.identifiedIssue || 'VAT Withholding & Overhead Disallowance Discrepancy',
        totalAdjustedAmount: detailData?.totalAdjustedAmount || 14850000
      };

      const res = await fetch(`/api/v1/backoffice/issue/cases/${caseId}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': user?.id || 'issue-team-leader'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Failed with HTTP status ${res.status}`);
      }

      setSuccessMsg(
        decision === 'APPROVED'
          ? '✓ Issue Audit Report endorsed and successfully routed to Tax Center Director for final follow-up decision.'
          : '↩ Issue Audit Report returned to Auditor with revision directives.'
      );

      if (onRefresh) {
        setTimeout(onRefresh, 1000);
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setActionError(err.message || 'Failed to submit supervisory review decision.');
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
            <div className="p-2.5 rounded-xl bg-teal-600/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400 border border-teal-200 dark:border-teal-500/30">
              <Layers size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Issue Audit — Team Leader Supervisory Review
                </h2>
                <Badge color="teal" size="sm">FR-04.6 Direct Route</Badge>
                <Badge color="blue" size="sm">No Committee • Tax Center Direct</Badge>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Taxpayer: <strong className="text-gray-800 dark:text-gray-200">{caseData.taxpayerName || 'United Services PLC'}</strong>
                {' '}(TIN: <span className="font-mono">{caseData.tin || caseData.taxpayerId}</span>)
                {' '}• Ref: <span className="font-mono text-blue-600 dark:text-blue-400">{caseData.caseNumber}</span>
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <Badge color="purple" dot size="sm">
              {caseData.status === 'SUBMITTED_FOR_TL_REVIEW' ? 'Awaiting Your Sign-Off' : caseData.status}
            </Badge>
            <p className="text-[11px] text-gray-400 mt-1">
              Branch: {caseData.taxCenterCode || 'TC-AA-01'}
            </p>
          </div>
        </div>

        {/* ═══ STATUTORY EXPOSURE BANNER ═══ */}
        <div className="bg-gradient-to-r from-teal-50/80 via-blue-50/60 to-slate-50/80 dark:from-slate-800/80 dark:via-slate-800/50 dark:to-slate-800/30 rounded-xl p-4 border border-teal-100 dark:border-slate-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400 flex items-center gap-1.5">
                <Scale size={13} /> Identified Non-Compliance Issue & Scope (FR-04.6-02)
              </span>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {detailData?.identifiedIssue || 'VAT Withholding & Overhead Disallowance Discrepancy (Art. 54 & Art. 27)'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Auditor Findings: Unreconciled leasing withholding and non-deductible management fee allocation across intercompany branches.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Total Recommended Liability</span>
                <p className="text-xl font-black text-rose-600 dark:text-rose-400">
                  ETB {totalLiability.toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-500">
                  Principal: ETB {adjustedPrincipal.toLocaleString()} + Penalties & Interest
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ AUDIT DOSSIER GRID: EVIDENCE, FIELD VISIT & REPORT ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Selected Transactions & Scope */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <FileText size={14} className="text-blue-600" />
                1. Selected Transactions / Testing Areas (FR-04.6-02)
              </span>
              <Badge color="blue" size="xs">2 Tested Areas</Badge>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-100 dark:border-slate-600">
                <div className="flex justify-between font-bold text-gray-800 dark:text-gray-200">
                  <span>TX-01: Machinery Leasing Agreement #ML-8890</span>
                  <Badge color="purple" size="xs">VAT Withholding</Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Cross-matched against customs entries; 15% VAT withholding was omitted on offshore lease payments.
                </p>
              </div>
              <div className="p-2.5 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-100 dark:border-slate-600">
                <div className="flex justify-between font-bold text-gray-800 dark:text-gray-200">
                  <span>TX-02: Head Office Management Overhead</span>
                  <Badge color="orange" size="xs">CIT Art. 27</Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Non-deductible management fee allocation claimed without verified timesheet breakdown.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Evidence Records Gathered */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                2. Gathered Evidence Records (FR-04.6-03)
              </span>
              <Badge color="green" size="xs">3 Verified Sources</Badge>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-start justify-between p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50">
                <div>
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">EV-01 (Internal Customs)</span>
                  <p className="text-gray-600 dark:text-gray-400 mt-0.5">ASYCUDA Customs Entry #2024-C-9901 confirms import valuation.</p>
                </div>
                <Badge color="green" size="xs">INTERNAL</Badge>
              </div>
              <div className="flex items-start justify-between p-2 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50">
                <div>
                  <span className="font-bold text-blue-800 dark:text-blue-300">EV-02 (Third-Party Bank)</span>
                  <p className="text-gray-600 dark:text-gray-400 mt-0.5">CBE Swift Wire confirmations verified offshore remittance.</p>
                </div>
                <Badge color="blue" size="xs">3RD PARTY</Badge>
              </div>
              <div className="flex items-start justify-between p-2 rounded-lg bg-gray-50 dark:bg-slate-700/50 border border-gray-200/60">
                <div>
                  <span className="font-bold text-gray-800 dark:text-gray-200">EV-03 (Auditee Upload)</span>
                  <p className="text-gray-600 dark:text-gray-400 mt-0.5">Taxpayer general ledger and invoice schedule #INV-2024-04.</p>
                </div>
                <Badge color="gray" size="xs">AUDITEE</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ FIELD VISIT & REPORT NARRATIVE ═══ */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <MapPin size={14} className="text-rose-600" />
              3. Field Visit Verification & Draft Report (FR-04.6-04 & FR-04.6-05)
            </span>
            <Badge color="teal" size="xs">On-Site Verified</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5 bg-gray-50 dark:bg-slate-700/40 p-3 rounded-xl border border-gray-100 dark:border-slate-600">
              <span className="font-bold text-gray-700 dark:text-gray-300">Field Visit Findings:</span>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Location: <strong>Akaki Kality Manufacturing Plant</strong>.
                Equipment tags on physical machinery match Lease Agreement #ML-8890. However, statutory maintenance logs and proof of local deployment were missing, supporting disallowance.
              </p>
            </div>
            <div className="space-y-1.5 bg-gray-50 dark:bg-slate-700/40 p-3 rounded-xl border border-gray-100 dark:border-slate-600">
              <span className="font-bold text-gray-700 dark:text-gray-300">Exit Conference Schedule:</span>
              <p className="text-gray-600 dark:text-gray-400">
                Proposed Date: <strong>2026-09-12 at 10:00 AM</strong> • Venue: <strong>LTO Interview Room A</strong>.
                Taxpayer was notified through registered e-Tax portal dispatch.
              </p>
            </div>
          </div>
        </div>

        {/* ═══ SUPERVISORY QUALITY ASSURANCE CHECKLIST ═══ */}
        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <ShieldCheck size={15} className="text-teal-600" />
            Issue Team Leader Quality Review & Sign-Off Checklist
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              { key: 'issueScopeVerified', label: 'Identified noncompliance issue scope matches risk engine cascade.' },
              { key: 'evidenceSufficiency', label: 'Sufficient internal and 3rd-party banking evidence gathered.' },
              { key: 'fieldVisitDocumented', label: 'Physical on-site inspection findings properly documented.' },
              { key: 'penaltyCalculated', label: 'Statutory 20% penalty and 15% interest verified under Art. 54.' },
              { key: 'workingPapersIndexed', label: 'All working papers (WP-01, WP-02) cross-referenced to report.' },
            ].map(item => (
              <label key={item.key} className="flex items-start gap-2.5 p-2 bg-white dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checklist[item.key] || false}
                  onChange={(e) => setChecklist(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="text-gray-700 dark:text-gray-300 leading-tight">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ═══ TEAM LEADER DIRECTIVES & COMMENTS ═══ */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <UserCheck size={14} className="text-teal-600" />
            Team Leader Technical Comments & Supervisory Directives *
          </label>
          <Textarea
            rows={3}
            placeholder="Record your supervisory assessment, validation notes, or rework instructions..."
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

        {/* ═══ HIERARCHICAL ACTIONS (NO COMMITTEE — DIRECT ROUTE TO DIRECTOR) ═══ */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Close
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="danger"
              icon={RotateCcw}
              loading={loading}
              onClick={() => handleReviewAction('RETURNED_FOR_REVISION')}
              title="Return draft report to auditor for technical corrections"
            >
              ↩ Return to Auditor for Revision
            </Button>

            <Button
              variant="success"
              icon={Send}
              loading={loading}
              disabled={!allChecked}
              onClick={() => handleReviewAction('APPROVED')}
              className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
              title="Sign-off and route directly to Tax Center Director"
            >
              ✓ Endorse & Route to Tax Center Director →
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
