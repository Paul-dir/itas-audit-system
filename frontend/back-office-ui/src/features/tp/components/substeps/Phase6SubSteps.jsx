import React, { useState } from 'react';
import { 
  Calculator, FileText, CheckCircle2, AlertTriangle, 
  DollarSign, Check, ArrowRight, ShieldCheck, Scale,
  Send, Lock, FileCheck, Info
} from 'lucide-react';
import { Card, Button, Badge, Input, Textarea } from '../../../../components/ui/index.jsx';

export default function Phase6SubSteps({
  subStepId,
  fullState,
  varianceAmt,
  assessedTax,
  setAssessedTax,
  penaltyAmount,
  setPenaltyAmount,
  interestAmount,
  setInterestAmount,
  completedSubSteps,
  onToggleComplete,
  saving,
  executeApiAction
}) {
  const isDone = completedSubSteps.includes(subStepId);

  // Suggested values derived from variance
  const calculatedTax = assessedTax || Math.round(varianceAmt * 0.30);
  const calculatedPenalty = penaltyAmount || Math.round(calculatedTax * 0.50);
  const calculatedInterest = interestAmount || Math.round(calculatedTax * 0.20);
  const totalDemand = calculatedTax + calculatedPenalty + calculatedInterest;

  const [legalCheckNotes, setLegalCheckNotes] = useState('Legal and compliance vetting verified: All procedures conform with Articles 27, 79, 98, and 105 of Proclamation 979/2016. No statute of limitation bars detected.');
  const [submissionMemo, setSubmissionMemo] = useState('Statutory notice of transfer pricing assessment submitted for joint digital signature of Transfer Pricing Authorized Official (Committee) and Audit Director.');

  // Sub-step 6.1: Tax Base Adjustment Computation
  if (subStepId === '6.1') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
          <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
            <Calculator size={15} /> Primary Tax Base & Additional Corporate Tax Liability
          </h4>
          <p className="text-xs text-indigo-800 dark:text-indigo-300 mt-1">
            Compute the additional taxable business income resulting from adjusting the tested party’s profit level to the arm’s length median (30% statutory corporate income tax rate).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <span className="text-xs text-slate-500 uppercase font-bold">Total Arm's Length Adjustment (EBIT)</span>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
              ETB {varianceAmt.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400">Audited Taxable Base Increase</span>
          </Card>
          <Card className="p-4 border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-900/10">
            <span className="text-xs text-blue-600 dark:text-blue-400 uppercase font-bold">Principal Corporate Tax Due (30%)</span>
            <Input
              type="number"
              value={calculatedTax}
              onChange={(e) => setAssessedTax(Number(e.target.value))}
              className="mt-1 font-bold text-lg font-mono text-blue-700 dark:text-blue-300"
            />
            <span className="text-[11px] text-blue-500">Statutory 30% CIT rate</span>
          </Card>
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('6.1', !isDone, { principalTax: calculatedTax })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 6.1 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 6.1 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 6.2: Statutory Penalties Calculation under Art. 105
  if (subStepId === '6.2') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
            <Scale size={15} /> Statutory Penalties — Article 105 (Under-Declaration)
          </h4>
          <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
            Under Article 105, apply a 20% penalty for under-declaration, or a 50% penalty if the tax shortfall exceeds 1,000,000 ETB or resulted from intentional aggressive profit shifting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Under-Declaration Penalty Assessment (50% Standard)
            </label>
            <Input
              type="number"
              value={calculatedPenalty}
              onChange={(e) => setPenaltyAmount(Number(e.target.value))}
              className="font-mono font-bold"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Calculated at 50% of principal tax for substantial under-declaration.
            </span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <div className="font-semibold text-slate-800 dark:text-slate-200">Legal Qualification:</div>
            <p className="text-slate-500 mt-1">
              Material discrepancy exceeding ETB 1M threshold with related party management fees into low-tax jurisdiction.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('6.2', !isDone, { penaltyAmount: calculatedPenalty })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 6.2 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 6.2 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 6.3: Statutory Late Payment Interest under Art. 104
  if (subStepId === '6.3') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={15} /> Statutory Late Interest Calculation — Article 104
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Calculate late interest from the date the tax return was due until the assessment notice date based on prevailing commercial lending rate + statutory margin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Statutory Late Payment Interest (ETB)
            </label>
            <Input
              type="number"
              value={calculatedInterest}
              onChange={(e) => setInterestAmount(Number(e.target.value))}
              className="font-mono font-bold"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Compounded annually across open tax years.
            </span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <div className="font-semibold text-slate-800 dark:text-slate-200">Applicable Interest Rate:</div>
            <p className="text-slate-500 mt-1">
              National Bank prime lending rate (14.5%) + 2.0% statutory administration fee.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('6.3', !isDone, { interestAmount: calculatedInterest })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 6.3 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 6.3 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 6.4: Statutory Assessment Notice Drafting (Art. 98)
  if (subStepId === '6.4') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider flex items-center gap-1.5">
            <FileText size={15} /> Statutory Notice of Assessment Draft — Article 98
          </h4>
          <p className="text-xs text-blue-800 dark:text-blue-300 mt-1">
            Format the formal assessment notice detailing the tax periods, adjusted tax base, breakdown of principal tax, penalties, late interest, and 30-day payment demand.
          </p>
        </div>

        <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900 space-y-3">
          <div className="flex justify-between border-b pb-3 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">Principal Corporate Income Tax:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">ETB {calculatedTax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-b pb-3 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">Article 105 Penalties:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">ETB {calculatedPenalty.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-b pb-3 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">Article 104 Late Payment Interest:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">ETB {calculatedInterest.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-2 text-sm font-bold bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl text-blue-900 dark:text-blue-200">
            <span>Total Statutory Assessment Liability:</span>
            <span className="font-mono font-bold text-base">ETB {totalDemand.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('6.4', !isDone, { totalDemand })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 6.4 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 6.4 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 6.5: Legal & Compliance Verification Checklist
  if (subStepId === '6.5') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={15} /> Legal & Procedural Compliance Verification
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Ensure no procedural vulnerabilities exist before submission to executive leadership for digital authorization.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Legal Officer & Compliance Verification Certificate
          </label>
          <Textarea
            value={legalCheckNotes}
            onChange={(e) => setLegalCheckNotes(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('6.5', !isDone, { legalCheckNotes })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 6.5 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 6.5 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 6.6: Submission for Authorized Official Signature
  if (subStepId === '6.6') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
          <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
            <Send size={15} /> Transmit for Digital Executive Signatures
          </h4>
          <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1">
            Package notice of assessment for final digital authorization by the TP Process Owner (Committee) and Audit Director.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Executive Authorization Submission Remarks
          </label>
          <Textarea
            value={submissionMemo}
            onChange={(e) => setSubmissionMemo(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={async () => {
              await executeApiAction('/notice/generate', {
                assessedPrincipalTax: calculatedTax,
                penaltyAmount: calculatedPenalty,
                interestAmount: calculatedInterest
              }, 'Statutory assessment notice generated.');
              onToggleComplete('6.6', !isDone, { submissionMemo, totalDemand });
            }}
            disabled={saving}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 6.6 Completed ✓ (Click to Undo)' : 'Save & Mark Sub-Step 6.6 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
