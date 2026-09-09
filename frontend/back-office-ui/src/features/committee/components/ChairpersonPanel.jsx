/**
 * ChairpersonPanel Component
 * Accessible command panel for Committee Chairperson role.
 *
 * WCAG 2.1 AA features:
 *   - role="toolbar" with roving tabindex (arrow-key navigation)
 *   - aria-label and aria-describedby for screen readers
 *   - aria-live region for action feedback
 *   - Visible focus indicators on all interactive elements
 *   - Keyboard instructions announced on focus
 *   - Proper heading hierarchy (h3 > h4)
 *   - All buttons have descriptive accessible names
 */

import { useState, useCallback, useRef } from 'react';
import {
  Users, CheckCircle, Shield, Send, Flag,
  LogOut, Clock, X, AlertCircle, Loader2, ArrowRight,
} from 'lucide-react';
import Card from '../../../components/Card';
import TeamLeaderAppointment from './TeamLeaderAppointment';
import ExecutiveViability from './ExecutiveViability';
import { useChairpersonPanel } from '../hooks/useChairpersonPanel';

/** Keyboard shortcut hints */
const KEYBOARD_HINT = 'Use arrow keys to navigate between actions.';

export default function ChairpersonPanel({ caseData, onActionComplete }) {
  const {
    showTeamLeaderAppointment,
    showExecutiveViability,
    showSLAOverride,
    legalAction,
    legalNotes,
    legalLoading,
    legalResult,
    slaExtensionDays,
    slaReason,
    slaLoading,
    slaResult,
    announceRef,
    announce,
    openTeamLeader,
    closeTeamLeader,
    openViability,
    closeViability,
    openSLAOverride,
    closeSLAOverride,
    setLegalAction,
    setLegalNotes,
    handleLegalAction,
    clearLegalResult,
    setSlaExtensionDays,
    setSlaReason,
    handleSLAOverride,
    clearSLAResult,
  } = useChairpersonPanel();

  const caseId = caseData?.committeeCaseId || caseData?.id;

  // ── Auto-transition: viability approved → open team leader appointment ──
  const handleViabilityDecision = useCallback((decision) => {
    const isApproved = decision === 'VIABLE' || decision === 'CONDITIONALLY_VIABLE';
    if (isApproved) {
      // Brief delay so the success screen is visible before transitioning
      setTimeout(() => {
        closeViability();
        openTeamLeader();
        announce('Case approved. Opening team leader assignment.');
      }, 2600);
    }
  }, [closeViability, openTeamLeader, announce]);

  // ── Roving tabindex for toolbar ───────────────────────────────────
  const [focusIndex, setFocusIndex] = useState(0);
  const toolbarRef = useRef(null);
  const buttonRefs = useRef([]);

  // Rebuild ref list when panel mounts or actions change
  const registerRef = useCallback((index) => (el) => {
    buttonRefs.current[index] = el;
  }, []);

  const focusButton = useCallback((index) => {
    const btn = buttonRefs.current[index];
    if (btn) {
      btn.focus();
      setFocusIndex(index);
    }
  }, []);

  const handleToolbarKeyDown = useCallback((e) => {
    const count = buttonRefs.current.length;
    if (count === 0) return;

    let next = focusIndex;
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        next = (focusIndex + 1) % count;
        focusButton(next);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        next = (focusIndex - 1 + count) % count;
        focusButton(next);
        break;
      case 'Home':
        e.preventDefault();
        focusButton(0);
        break;
      case 'End':
        e.preventDefault();
        focusButton(count - 1);
        break;
      default:
        break;
    }
  }, [focusIndex, focusButton]);

  // ── Check if team lead is assigned ───────────────────────────────
  const hasTeamLead = Boolean(caseData?.teamLeadId);
  const isTeamLeadPhase = caseData?.status === 'TEAM_ASSIGNED';

  // ── Panel actions configuration ───────────────────────────────────
  const actions = [
    {
      id: 'appoint-leader',
      label: 'Appoint Joint Audit Team Leader',
      description: 'Select and designate the official team leader for this case.',
      icon: Users,
      onClick: openTeamLeader,
      variant: 'default',
      disabled: !isTeamLeadPhase && hasTeamLead,
    },
    {
      id: 'viability',
      label: 'Executive Viability Determination',
      description: hasTeamLead ? 'Approve, conditionally approve, or reject case viability.' : '⚠️ Assign a team leader first before determining viability.',
      icon: CheckCircle,
      onClick: hasTeamLead ? openViability : undefined,
      variant: 'default',
      disabled: !hasTeamLead,
    },
    {
      id: 'sla-override',
      label: 'Override SLA Deadline',
      description: 'Extend the case deadline with mandatory justification.',
      icon: Clock,
      onClick: openSLAOverride,
      variant: 'default',
    },
    {
      id: 'send-report',
      label: 'Send Report to Authorities',
      description: 'Dispatch the audit report to external authorities.',
      icon: Send,
      onClick: () => setLegalAction('report'),
      variant: 'default',
    },
    {
      id: 'escalate-fraud',
      label: 'Escalate to Fraud Investigation',
      description: 'Refer case to the fraud investigation unit.',
      icon: Flag,
      onClick: () => setLegalAction('fraud'),
      variant: 'danger',
    },
    {
      id: 'publish-assessment',
      label: 'Publish Final Assessment',
      description: 'Release the official case assessment publicly.',
      icon: LogOut,
      onClick: () => setLegalAction('assessment'),
      variant: 'default',
    },
  ];



  // ── Legal action labels ───────────────────────────────────────────
  const legalLabels = {
    report: { title: 'Send Report to Authorities', Icon: Send },
    fraud: { title: 'Escalate to Fraud Investigation', Icon: Flag },
    assessment: { title: 'Publish Final Assessment', Icon: LogOut },
  };

  return (
    <>
      {/* Screen reader live region (always present, visually hidden) */}
      <div
        ref={announceRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
        {/* Panel heading */}
        <div className="mb-4">
          <h3
            id="chairperson-panel-heading"
            className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"
          >
            <Shield size={20} className="text-purple-600 dark:text-purple-400" aria-hidden="true" />
            Chairperson Command Panel
          </h3>
          <p
            id="chairperson-panel-desc"
            className="text-xs text-gray-500 dark:text-gray-400 mt-1"
          >
            {KEYBOARD_HINT}
          </p>
        </div>

        {/* Toolbar with roving tabindex */}
        <div
          ref={toolbarRef}
          role="toolbar"
          aria-label="Chairperson actions"
          aria-describedby="chairperson-panel-desc"
          aria-orientation="vertical"
          onKeyDown={handleToolbarKeyDown}
          className="space-y-1"
        >
          {actions.map((action, index) => {
            const Icon = action.icon;
            const isDanger = action.variant === 'danger';
            const isDisabled = action.disabled;
            return (
              <button
                key={action.id}
                ref={registerRef(index)}
                tabIndex={index === focusIndex ? 0 : -1}
                onClick={isDisabled ? undefined : action.onClick}
                disabled={isDisabled}
                aria-describedby={`action-desc-${action.id}`}
                className={`
                  w-full px-4 py-2.5 text-left text-sm font-medium rounded-lg
                  transition-all duration-150
                  flex items-center gap-3
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-50
                  dark:focus:ring-offset-purple-900/20
                  ${isDisabled
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                    : isDanger
                      ? 'text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 focus:bg-red-100 dark:focus:bg-red-900/30'
                      : 'text-gray-900 dark:text-white hover:bg-purple-100 dark:hover:bg-purple-800/50 focus:bg-purple-100 dark:focus:bg-purple-800/50'
                  }
                `}
              >
                <Icon size={18} className="flex-shrink-0" aria-hidden="true" />
                <span className="flex-1">{action.label}</span>
                {!isDisabled && (
                  <ArrowRight
                    size={14}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400"
                    aria-hidden="true"
                  />
                )}
                {isDisabled && action.id === 'viability' && (
                  <span className="text-xs text-amber-500 dark:text-amber-400 ml-auto">⚠️</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Descriptions for screen readers (visually hidden) */}
        {actions.map((action) => (
          <div
            key={`desc-${action.id}`}
            id={`action-desc-${action.id}`}
            className="sr-only"
          >
            {action.description}
          </div>
        ))}
      </Card>

      {/* ── Modals ─────────────────────────────────────────────────── */}

      {/* Team Leader Appointment */}
      <TeamLeaderAppointment
        open={showTeamLeaderAppointment}
        onClose={() => { closeTeamLeader(); onActionComplete?.(); }}
        caseData={caseData}
      />

      {/* Executive Viability */}
      <ExecutiveViability
        open={showExecutiveViability}
        onClose={() => { closeViability(); onActionComplete?.(); }}
        caseData={caseData}
        onDecision={handleViabilityDecision}
      />

      {/* ── SLA Override Modal ─────────────────────────────────────── */}
      {showSLAOverride && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="sla-override-title">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeSLAOverride} aria-hidden="true" />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-600 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-800/50 flex items-center justify-center">
                  <Clock size={20} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 id="sla-override-title" className="text-lg font-bold text-gray-900 dark:text-white">Override SLA Deadline</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Case {caseId}</p>
                </div>
              </div>
              <button onClick={closeSLAOverride} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors" aria-label="Close SLA override dialog">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {slaResult ? (
                <div className="text-center py-6">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${slaResult.status === 'ERROR' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                    {slaResult.status === 'ERROR'
                      ? <AlertCircle size={32} className="text-red-600 dark:text-red-400" />
                      : <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
                    }
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {slaResult.status === 'ERROR' ? 'Override Failed' : 'SLA Extended'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {slaResult.status === 'ERROR' ? slaResult.message : `Deadline extended by ${slaExtensionDays} business days.`}
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="sla-days" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Extension (Business Days)
                      </label>
                      <input
                        id="sla-days"
                        type="number"
                        min={1}
                        max={90}
                        value={slaExtensionDays}
                        onChange={(e) => setSlaExtensionDays(Math.max(1, Math.min(90, parseInt(e.target.value) || 1)))}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        aria-describedby="sla-days-help"
                      />
                      <p id="sla-days-help" className="text-xs text-gray-500 dark:text-gray-400 mt-1">Between 1 and 90 business days.</p>
                    </div>
                    <div>
                      <label htmlFor="sla-reason" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Justification
                      </label>
                      <textarea
                        id="sla-reason"
                        value={slaReason}
                        onChange={(e) => setSlaReason(e.target.value)}
                        rows={3}
                        placeholder="Explain why the deadline extension is necessary..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none placeholder-gray-400"
                        aria-required="true"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                    This override will be recorded in the immutable audit trail.
                  </p>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-600 flex items-center justify-end gap-3">
              <button
                onClick={slaResult ? () => { clearSLAResult(); closeSLAOverride(); onActionComplete?.(); } : closeSLAOverride}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                {slaResult ? 'Close' : 'Cancel'}
              </button>
              {!slaResult && (
                <button
                  onClick={() => handleSLAOverride(caseId)}
                  disabled={slaLoading || !slaReason.trim()}
                  className="px-5 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
                >
                  {slaLoading ? (
                    <><Loader2 size={16} className="animate-spin" aria-hidden="true" /> Extending...</>
                  ) : (
                    <><Clock size={16} aria-hidden="true" /> Extend Deadline</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Legal Action Modal ─────────────────────────────────────── */}
      {legalAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="legal-action-title">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={clearLegalResult} aria-hidden="true" />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className={`flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-600 bg-gradient-to-r ${
              legalAction === 'fraud' ? 'from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30' : 'from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  legalAction === 'fraud' ? 'bg-red-100 dark:bg-red-800/50' : 'bg-blue-100 dark:bg-blue-800/50'
                }`}>
                  {legalLabels[legalAction] && (() => {
                    const LegalIcon = legalLabels[legalAction].Icon;
                    return <LegalIcon size={20} className={legalAction === 'fraud' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'} />;
                  })()}
                </div>
                <div>
                  <h2 id="legal-action-title" className="text-lg font-bold text-gray-900 dark:text-white">
                    {legalLabels[legalAction]?.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Case {caseId}</p>
                </div>
              </div>
              <button onClick={clearLegalResult} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors" aria-label="Close legal action dialog">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              {legalResult ? (
                <div className="text-center py-6">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                    legalResult.status === 'SUCCESS' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {legalResult.status === 'SUCCESS'
                      ? <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
                      : <AlertCircle size={32} className="text-red-600 dark:text-red-400" />
                    }
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {legalResult.status === 'SUCCESS' ? 'Action Completed' : 'Action Failed'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {legalResult.message || 'Action has been recorded in the audit trail.'}
                  </p>
                </div>
              ) : (
                <>
                  <label htmlFor="legal-notes" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    {legalAction === 'fraud' ? 'Escalation Reason' : 'Notes / Justification'}
                  </label>
                  <textarea
                    id="legal-notes"
                    value={legalNotes}
                    onChange={(e) => setLegalNotes(e.target.value)}
                    rows={4}
                    placeholder={
                      legalAction === 'fraud'
                        ? 'Describe the fraud indicators and evidence...'
                        : 'Add notes for this action...'
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-400"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    This action will be recorded in the immutable audit trail.
                  </p>
                </>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-600 flex items-center justify-end gap-3">
              <button
                onClick={clearLegalResult}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                {legalResult ? 'Close' : 'Cancel'}
              </button>
              {!legalResult && (
                <button
                  onClick={() => handleLegalAction(caseId)}
                  disabled={legalLoading}
                  className={`px-5 py-2 text-sm font-medium text-white disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2 ${
                    legalAction === 'fraud'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {legalLoading ? (
                    <><Loader2 size={16} className="animate-spin" aria-hidden="true" /> Processing...</>
                  ) : (
                    <>Confirm Action</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
