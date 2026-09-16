import React, { useState } from 'react';
import { 
  FileText, CheckCircle2, AlertTriangle, 
  Users, Check, ArrowRight, ShieldCheck, Scale,
  MessageSquare, Clock, Send, Info
} from 'lucide-react';
import { Card, Button, Badge, Input, Textarea } from '../../../../components/ui/index.jsx';

export default function Phase5SubSteps({
  subStepId,
  fullState,
  executiveSummary,
  setExecutiveSummary,
  legalGrounds,
  setLegalGrounds,
  exitConfVenue,
  setExitConfVenue,
  exitConfNotes,
  setExitConfNotes,
  completedSubSteps,
  onToggleComplete,
  saving,
  executeApiAction
}) {
  const isDone = completedSubSteps.includes(subStepId);

  const [tlReviewNotes, setTlReviewNotes] = useState('Team Leader supervisory quality check completed: All functional analysis statements are supported by IDR documentary evidence. Benchmarking search strategy independently verified.');
  const [taxpayerRebuttalNotes, setTaxpayerRebuttalNotes] = useState('Taxpayer submitted written rebuttal contesting the rejection of 2 loss-making regional comparables. Auditor technical counter-analysis establishes that the rejected entities operate under restructuring and are not independent arm’s length comparables.');
  const [finalDossierSummary, setFinalDossierSummary] = useState('Final Transfer Pricing Audit Report compiled with complete working papers, Orbis comparable search audit trail, and signed exit conference minutes for Committee formal endorsement.');

  // Sub-step 5.1: Comprehensive TP Audit Report Drafting
  if (subStepId === '5.1') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
          <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
            <FileText size={15} /> Comprehensive TP Audit Report Formulation
          </h4>
          <p className="text-xs text-indigo-800 dark:text-indigo-300 mt-1">
            Consolidate executive summary, FAR functional analysis, economic benchmarking, and proposed arm’s length adjustments.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Executive Summary & Findings
            </label>
            <Textarea
              value={executiveSummary}
              onChange={(e) => setExecutiveSummary(e.target.value)}
              rows={4}
              placeholder="Synthesize taxpayer operations, audited transaction streams, and arm's length adjustment conclusions..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Statutory & Legal Grounds
            </label>
            <Textarea
              value={legalGrounds}
              onChange={(e) => setLegalGrounds(e.target.value)}
              rows={2}
              placeholder="Cite Proclamation 979/2016 Article 79, Transfer Pricing Directive No. 43/2015, and OECD Guidelines..."
            />
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('5.1', !isDone, { executiveSummary, legalGrounds })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 5.1 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 5.1 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 5.2: Supervisory Review with Team Leader
  if (subStepId === '5.2') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={15} /> Supervisory Technical Quality Review
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Conduct pre-exit conference quality review with TP Team Leader to verify that all factual assertions are backed by verifiable evidence.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Team Leader Pre-Conference Review Notes
          </label>
          <Textarea
            value={tlReviewNotes}
            onChange={(e) => setTlReviewNotes(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('5.2', !isDone, { tlReviewNotes })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 5.2 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 5.2 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 5.3: Formal Exit Conference Convening
  if (subStepId === '5.3') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider flex items-center gap-1.5">
            <Users size={15} /> Convene Formal Exit Conference (Article 80)
          </h4>
          <p className="text-xs text-blue-800 dark:text-blue-300 mt-1">
            Hold statutory exit conference with taxpayer management. Present audit findings and proposed adjustments before statutory notice issuance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Exit Conference Venue
            </label>
            <Input
              value={exitConfVenue}
              onChange={(e) => setExitConfVenue(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Auditee Key Attendees
            </label>
            <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-mono">
              Managing Director, CFO, Legal Counsel, External TP Advisor
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('5.3', !isDone, { exitConfVenue })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 5.3 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 5.3 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 5.4: Exit Conference Minutes & Attendance
  if (subStepId === '5.4') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare size={15} /> Exit Conference Minutes & Taxpayer Observations
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Record minutes of the exit meeting including taxpayer oral statements, preliminary counter-arguments, and signed attendance register.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Formal Exit Meeting Minutes
          </label>
          <Textarea
            value={exitConfNotes}
            onChange={(e) => setExitConfNotes(e.target.value)}
            rows={5}
            placeholder="Document verbal objections, taxpayer explanations, and agreed next steps..."
          />
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={async () => {
              await executeApiAction('/exit-conference/record', {
                venue: exitConfVenue,
                auditorNotes: exitConfNotes
              }, 'Exit conference minutes saved.');
              onToggleComplete('5.4', !isDone, { exitConfVenue, exitConfNotes });
            }}
            disabled={saving}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 5.4 Completed ✓ (Click to Undo)' : 'Save & Mark Sub-Step 5.4 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 5.5: Taxpayer Written Rebuttal Evaluation
  if (subStepId === '5.5') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
            <Scale size={15} /> Taxpayer Written Rebuttal Evaluation
          </h4>
          <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
            Review the taxpayer’s formal written submission following the exit conference and articulate the audit team’s technical counter-position.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Technical Evaluation of Taxpayer Rebuttal Arguments
          </label>
          <Textarea
            value={taxpayerRebuttalNotes}
            onChange={(e) => setTaxpayerRebuttalNotes(e.target.value)}
            rows={5}
          />
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('5.5', !isDone, { taxpayerRebuttalNotes })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 5.5 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 5.5 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 5.6: Final Audit Findings Endorsement Dossier
  if (subStepId === '5.6') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
          <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={15} /> Final Audit Findings Endorsement Dossier
          </h4>
          <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1">
            Assemble the final TP report package, incorporating exit conference results and rebuttal counter-arguments, for TP Committee endorsement.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Final Endorsement Dossier Notes
          </label>
          <Textarea
            value={finalDossierSummary}
            onChange={(e) => setFinalDossierSummary(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={async () => {
              await executeApiAction('/report/draft', {
                executiveSummary,
                legalGrounds
              }, 'Final TP audit report saved.');
              onToggleComplete('5.6', !isDone, { finalDossierSummary });
            }}
            disabled={saving}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 5.6 Completed ✓ (Click to Undo)' : 'Save & Mark Sub-Step 5.6 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
