/**
 * ExecutiveViability Override Screen
 * Chairperson determines executive viability of a case
 */
import { useState } from 'react';
import { X, CheckCircle, AlertTriangle, XCircle, FileText, ArrowRight, Clock, Shield, Loader2 } from 'lucide-react';
import { committeeAPI } from '../services/api';

const VIABILITY_OPTIONS = [
  {
    value: 'VIABLE',
    label: 'Viable',
    description: 'Case meets all executive viability criteria. Recommended for full audit execution.',
    icon: CheckCircle,
    color: 'green',
    bgClass: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:border-green-400',
    iconClass: 'text-green-600 dark:text-green-400',
    selectedBg: 'bg-green-100 dark:bg-green-900/40 border-green-500',
  },
  {
    value: 'CONDITIONALLY_VIABLE',
    label: 'Conditionally Viable',
    description: 'Case is viable with specific conditions or modifications before execution.',
    icon: AlertTriangle,
    color: 'amber',
    bgClass: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 hover:border-amber-400',
    iconClass: 'text-amber-600 dark:text-amber-400',
    selectedBg: 'bg-amber-100 dark:bg-amber-900/40 border-amber-500',
  },
  {
    value: 'NOT_VIABLE',
    label: 'Not Viable',
    description: 'Case fails executive viability criteria. Recommend closure or reassessment.',
    icon: XCircle,
    color: 'red',
    bgClass: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:border-red-400',
    iconClass: 'text-red-600 dark:text-red-400',
    selectedBg: 'bg-red-100 dark:bg-red-900/40 border-red-500',
  },
];

export default function ExecutiveViability({ open, onClose, caseData, onDecision }) {
  const [selectedViability, setSelectedViability] = useState(null);
  const [justification, setJustification] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSelect = (value) => {
    setSelectedViability(value === selectedViability ? null : value);
  };

  const handleSubmit = async () => {
    if (!selectedViability || !caseData) return;
    setLoading(true);
    setError(null);
    try {
      const caseId = caseData.committeeCaseId || caseData.id;
      await committeeAPI.finalizeViability(
        caseId,
        selectedViability,
        justification || 'Determination submitted by chairperson',
        'chairperson-digital-signature'
      );
      setSubmitted(true);
      // Notify parent of the decision so it can auto-transition (e.g. open team leader appointment)
      const isApproved = selectedViability === 'VIABLE' || selectedViability === 'CONDITIONALLY_VIABLE';
      onDecision?.(selectedViability);
      setTimeout(() => {
        setSubmitted(false);
        setSelectedViability(null);
        setJustification('');
        setLoading(false);
        onClose();
      }, isApproved ? 2500 : 2000);
    } catch (err) {
      console.error('Failed to finalize viability:', err);
      setError(err.message || 'Failed to submit determination');
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedViability(null);
    setJustification('');
    setSubmitted(false);
    setLoading(false);
    setError(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Override Screen */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-600 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center">
              <CheckCircle size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Executive Viability Determination</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Case {caseData?.committeeCaseId || caseData?.id || 'N/A'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {submitted ? (
            /* Success State */
            <div className="flex flex-col items-center py-12">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Determination Submitted</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Viability set to <strong>{selectedViability?.replace(/_/g, ' ')}</strong>
              </p>
              {(selectedViability === 'VIABLE' || selectedViability === 'CONDITIONALLY_VIABLE') && (
                <p className="text-sm text-purple-600 dark:text-purple-400 mt-3 flex items-center gap-2 justify-center">
                  <ArrowRight size={16} />
                  Redirecting to team leader assignment…
                </p>
              )}
            </div>
          ) : (
            <>
              {/* Case Summary */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center flex-shrink-0">
                  <FileText size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{caseData?.taxpayerName || 'Taxpayer'}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {caseData?.createdDate ? new Date(caseData.createdDate).toLocaleDateString() : 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield size={12} />
                      Risk: {caseData?.riskPriority || 'N/A'}
                    </span>
                    {caseData?.totalAmount && (
                      <span>ETB {parseFloat(caseData.totalAmount).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Viability Options */}
              <div className="space-y-3 mb-6">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Determination</h4>
                {VIABILITY_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedViability === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected ? option.selectedBg : option.bgClass
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-white dark:bg-slate-800 shadow-sm' : 'bg-white/50 dark:bg-slate-800/50'
                      }`}>
                        <Icon size={20} className={option.iconClass} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${
                          isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-200'
                        }`}>
                          {option.label}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{option.description}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-white dark:bg-slate-800 border-2 border-current flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-current" style={{ color: option.color === 'green' ? '#16a34a' : option.color === 'amber' ? '#d97706' : '#dc2626' }} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Justification */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Justification & Notes
                </label>
                <textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  rows={4}
                  placeholder="Provide your reasoning for this viability determination..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-gray-400"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Required for audit trail. This determination will be recorded in the case history.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-600">
            {error && (
              <div className="mb-3 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            )}
            <div className="flex items-center justify-between">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedViability || loading}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                ) : (
                  <>Submit Determination <ArrowRight size={16} /></>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
