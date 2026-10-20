import React, { useState } from 'react';
import { Send, ShieldCheck, X, AlertCircle } from 'lucide-react';
import { Modal, Button, Textarea, Badge } from '../../../components/ui/index.jsx';

export default function PhaseSubmissionModal({
  isOpen,
  onClose,
  phaseConfig,
  onSubmit,
  saving
}) {
  const [remarks, setRemarks] = useState('');

  if (!isOpen || !phaseConfig) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Statutory Governance Workflow
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              Submit {phaseConfig.label} for Formal Approval
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 p-3.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-xs space-y-1">
          <div>Designated Approving Authority: <strong className="text-blue-900 dark:text-blue-200">{phaseConfig.authority}</strong></div>
          <p className="text-blue-800/80 dark:text-blue-300">
            All 6 mandatory sub-steps have been fulfilled. Upon submission, the phase will transition to <strong>Under Review</strong> and the next phase will remain locked until formal endorsement.
          </p>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Auditor Transmittal Remarks & Evidence Notes
          </label>
          <Textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={4}
            placeholder="Summarize key working papers, justification rationale, and specific items for reviewer inspection..."
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={() => onSubmit(phaseConfig.id, phaseConfig.authorityRole, remarks)}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold inline-flex items-center gap-2"
          >
            <Send size={15} />
            {saving ? 'Submitting...' : `Submit to ${phaseConfig.authority}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
