import React, { useState } from 'react';
import { 
  Layers, FileText, CheckCircle2, AlertTriangle, 
  Building2, Check, ArrowRight, ShieldCheck, Clock,
  Plus, Send, Eye, FileCheck, Info
} from 'lucide-react';
import { Card, Button, Badge, Input, Textarea } from '../../../../components/ui/index.jsx';

export default function Phase3SubSteps({
  subStepId,
  fullState,
  accountingNotes,
  setAccountingNotes,
  factSummary,
  setFactSummary,
  interviewMinutes,
  setInterviewMinutes,
  completedSubSteps,
  onToggleComplete,
  saving,
  executeApiAction,
  onOpenIdrModal
}) {
  const isDone = completedSubSteps.includes(subStepId);

  // States for FAR and Operational Inspections
  const [farFunctions, setFarFunctions] = useState('Local company acts as limited-risk distributor and contract toll-manufacturer. Strategic brand management, R&D formulation, and global procurement decisions are executed exclusively by foreign parent.');
  const [farAssets, setFarAssets] = useState('Taxpayer owns routine manufacturing plant and office computers. Valuable manufacturing formulas, patent rights, and trademarks are owned by Swiss and Singapore affiliates.');
  const [farRisks, setFarRisks] = useState('Contractually, local entity assumes zero inventory obsolescence or foreign exchange risk. All currency losses are absorbed via management fee offset adjustments.');

  // Sub-step 3.1: Information Document Request (IDR) Log
  if (subStepId === '3.1') {
    const idrs = fullState?.informationRequests || [];
    return (
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={15} /> Information Document Request (IDR) Log — Art. 46 Compliance
          </h4>
          <p className="text-xs text-blue-800 dark:text-blue-300 mt-1">
            Track all formal document requests issued to the taxpayer. Under Article 46, taxpayer is granted a statutory 15-day response window.
          </p>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Issued IDR Requests ({idrs.length})</span>
          <Button size="sm" onClick={onOpenIdrModal}>
            <Plus size={14} className="mr-1.5" /> Issue New IDR Request
          </Button>
        </div>

        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold">
              <tr>
                <th className="p-3">IDR Code</th>
                <th className="p-3">Subject / Requested Items</th>
                <th className="p-3">Issued Date</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {idrs.length > 0 ? (
                idrs.map((req, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-blue-600">IDR-{idx + 1}</td>
                    <td className="p-3 font-medium text-slate-900 dark:text-white">{req.requestSubject || req.subject || 'Intercompany Agreements'}</td>
                    <td className="p-3 font-mono">{req.requestDate ? new Date(req.requestDate).toLocaleDateString() : '2026-09-01'}</td>
                    <td className="p-3 font-mono text-amber-600">{req.responseDueDate ? new Date(req.responseDueDate).toLocaleDateString() : '2026-09-16'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">
                        {req.status || 'RECEIVED'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-slate-400">No IDRs issued yet. Click button above to issue.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('3.1', !isDone)}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 3.1 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 3.1 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 3.2: Functional Analysis (FAR - Functions)
  if (subStepId === '3.2') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
          <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
            <Layers size={15} /> Functional Analysis (FAR) — Functions Performed
          </h4>
          <p className="text-xs text-indigo-800 dark:text-indigo-300 mt-1">
            Map operational decision-making, procurement management, sales negotiations, quality control, and R&D functions.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Functions Profile of Tested Taxpayer vs. Foreign Affiliates
          </label>
          <Textarea
            value={farFunctions}
            onChange={(e) => setFarFunctions(e.target.value)}
            rows={5}
          />
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('3.2', !isDone, { farFunctions })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 3.2 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 3.2 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 3.3: Asset Utilization Verification (DEMPE)
  if (subStepId === '3.3') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Building2 size={15} /> Assets Utilized & DEMPE Analysis
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Verify legal vs. economic ownership of valuable intangibles (Development, Enhancement, Maintenance, Protection, Exploitation).
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Tangible & Intangible Asset Ownership Mapping
          </label>
          <Textarea
            value={farAssets}
            onChange={(e) => setFarAssets(e.target.value)}
            rows={5}
          />
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('3.3', !isDone, { farAssets })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 3.3 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 3.3 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 3.4: Risk Allocation & Assumption Assessment
  if (subStepId === '3.4') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle size={15} /> Economic Risk Allocation Analysis
          </h4>
          <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
            Assess whether contractual allocation of market, credit, inventory, and foreign currency risk aligns with economic conduct and financial capacity.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Risk Assumption Evaluation Notes
          </label>
          <Textarea
            value={farRisks}
            onChange={(e) => setFarRisks(e.target.value)}
            rows={5}
          />
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('3.4', !isDone, { farRisks })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 3.4 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 3.4 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 3.5: On-Site Operational Inspection & Personnel Interviews
  if (subStepId === '3.5') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <FileText size={15} /> On-Site Operational Inspection & Staff Interview Log
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Record interview findings with key operational personnel: plant engineers, IT directors, and warehouse supervisors.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Personnel Interview Minutes & Operational Walkthrough Findings
          </label>
          <Textarea
            value={interviewMinutes}
            onChange={(e) => setInterviewMinutes(e.target.value)}
            rows={5}
            placeholder="Document interviews with Operations Director, Quality Assurance Manager, etc..."
          />
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('3.5', !isDone, { interviewMinutes })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 3.5 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 3.5 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 3.6: Formal Statement of Facts Compilation & Sign-Off
  if (subStepId === '3.6') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
          <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={15} /> Formal Statement of Facts Dossier
          </h4>
          <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1">
            Consolidate all functional analysis, asset ownership, and operational findings into the definitive Statement of Facts for supervisory endorsement.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Agreed Statement of Facts Summary
          </label>
          <Textarea
            value={factSummary}
            onChange={(e) => setFactSummary(e.target.value)}
            rows={5}
            placeholder="Comprehensive statement of facts describing tested operations, contractual vs economic reality, and transaction flows..."
          />
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={async () => {
              await executeApiAction('/field-work', {
                accountingMethods: accountingNotes,
                statementOfFacts: factSummary
              }, 'Field work data saved.');
              onToggleComplete('3.6', !isDone, { factSummary });
            }}
            disabled={saving}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 3.6 Completed ✓ (Click to Undo)' : 'Save & Mark Sub-Step 3.6 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
