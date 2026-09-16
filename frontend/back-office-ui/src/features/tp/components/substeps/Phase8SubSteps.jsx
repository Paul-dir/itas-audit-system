import React, { useState } from 'react';
import { 
  CheckCircle2, FileText, AlertTriangle, 
  DollarSign, Check, ArrowRight, ShieldCheck, Scale,
  Lock, Database, Archive, Award, Info
} from 'lucide-react';
import { Card, Button, Badge, Input, Textarea } from '../../../../components/ui/index.jsx';

export default function Phase8SubSteps({
  subStepId,
  fullState,
  completedSubSteps,
  onToggleComplete,
  saving,
  executeApiAction,
  onClose,
  onRefresh
}) {
  const isDone = completedSubSteps.includes(subStepId);

  const [remittanceReceiptNo, setRemittanceReceiptNo] = useState('CBE-REV-2026-993812 / ITAS-PAY-008273');
  const [remittanceVerified, setRemittanceVerified] = useState(true);
  const [clearanceCertNo, setClearanceCertNo] = useState('MoR/LTO/TP-CLEARANCE/2026/049');
  const [riskEngineFeedback, setRiskEngineFeedback] = useState('Taxpayer risk scoring updated in central ITAS Risk Engine: High-risk propensity flag tagged for cross-border management fees to Mauritius and Singapore hubs.');
  const [policyLessons, setPolicyLessons] = useState('Recommendation for TP Policy Directorate: Establish clear safe-harbor markups for routine intra-group logistics services to reduce comparable search controversy.');
  const [archiveChecksum, setArchiveChecksum] = useState('SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  const [closureMemo, setClosureMemo] = useState('All statutory audit procedures, exit conferences, assessment demands, and collection verifications completed under Proclamation 979/2016. Case formally recommended for CONCLUDED status.');

  // Sub-step 8.1: Collection Order & Revenue Remittance Verification
  if (subStepId === '8.1') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
          <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign size={15} /> Collection Order & Remittance Verification
          </h4>
          <p className="text-xs text-indigo-800 dark:text-indigo-300 mt-1">
            Verify that the total assessed tax demand, penalties, and late interest have been deposited into the designated Ministry of Revenues treasury accounts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Treasury Remittance Receipt / Bank Voucher Numbers
            </label>
            <Input
              value={remittanceReceiptNo}
              onChange={(e) => setRemittanceReceiptNo(e.target.value)}
            />
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <div className="font-semibold text-slate-800 dark:text-slate-200">Payment Status:</div>
            <span className="text-emerald-600 font-bold">✓ VERIFIED:</span> Remittance confirmed by MoR Revenue Accounting Division.
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('8.1', !isDone, { remittanceReceiptNo })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 8.1 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 8.1 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 8.2: Tax Clearance / Audit Concluded Certificate
  if (subStepId === '8.2') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Award size={15} /> Statutory Tax Clearance Certificate
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Issue official Certificate of Audit Conclusion releasing the taxpayer from further scrutiny for the closed tax years.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Certificate Reference Number
            </label>
            <Input
              value={clearanceCertNo}
              onChange={(e) => setClearanceCertNo(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Effective Date of Conclusion
            </label>
            <Input
              type="date"
              defaultValue="2026-09-14"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('8.2', !isDone, { clearanceCertNo })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 8.2 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 8.2 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 8.3: Risk Profile & Machine Learning Update
  if (subStepId === '8.3') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider flex items-center gap-1.5">
            <Database size={15} /> Central Risk Engine Intelligence Update
          </h4>
          <p className="text-xs text-blue-800 dark:text-blue-300 mt-1">
            Feed confirmed transfer pricing non-compliance patterns and affiliate connections back into the automated risk engine.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Risk Profile Update Directives
          </label>
          <Textarea
            value={riskEngineFeedback}
            onChange={(e) => setRiskEngineFeedback(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('8.3', !isDone, { riskEngineFeedback })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 8.3 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 8.3 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 8.4: Lessons Learned & Policy Feedback
  if (subStepId === '8.4') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <FileText size={15} /> Lessons Learned & Regulatory Feedback
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Record operational challenges and comparability data gaps to inform future revisions to the Transfer Pricing Directives.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Technical Audit Recommendations
          </label>
          <Textarea
            value={policyLessons}
            onChange={(e) => setPolicyLessons(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('8.4', !isDone, { policyLessons })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 8.4 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 8.4 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 8.5: Complete Digital Audit Dossier Archival
  if (subStepId === '8.5') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Archive size={15} /> 10-Year Statutory Digital Archive Seal
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Seal all electronic workpapers, database queries, signed minutes, and assessment notices into a tamper-evident digital dossier.
          </p>
        </div>

        <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-xl font-mono text-xs text-slate-700 dark:text-slate-300">
          <span className="font-bold">Cryptographic Archive Hash:</span>
          <div className="mt-1 text-blue-600 dark:text-blue-400 break-all">{archiveChecksum}</div>
          <div className="mt-2 text-[11px] text-slate-500">Retention Period: 10 Years (Mandatory under Commercial Code & Proclamation 979/2016)</div>
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('8.5', !isDone, { archiveChecksum })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 8.5 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 8.5 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 8.6: Final Supervisory Sign-Off & Status CONCLUDED
  if (subStepId === '8.6') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
          <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={15} /> Final Executive Audit Closure Sign-Off
          </h4>
          <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1">
            Final supervisory sign-off marking the audit case as permanently CONCLUDED in the central tax administration system.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Final Closure Memorandum
          </label>
          <Textarea
            value={closureMemo}
            onChange={(e) => setClosureMemo(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={async () => {
              await executeApiAction('/close', {}, 'Transfer Pricing Audit formally concluded and archived.');
              onToggleComplete('8.6', !isDone, { closureMemo });
              alert('✅ Transfer Pricing Audit Case successfully concluded and permanently archived!');
              if (onRefresh) onRefresh();
              if (onClose) onClose();
            }}
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
          >
            <CheckCircle2 size={15} className="mr-1.5" />
            Complete Statutory Closure & Mark Case CONCLUDED
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
