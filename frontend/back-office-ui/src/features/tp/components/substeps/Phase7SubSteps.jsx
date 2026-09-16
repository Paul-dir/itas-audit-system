import React, { useState } from 'react';
import { 
  Scale, FileText, CheckCircle2, AlertTriangle, 
  DollarSign, Check, ArrowRight, ShieldCheck, Clock,
  Send, Users, MessageSquare, Info
} from 'lucide-react';
import { Card, Button, Badge, Input, Textarea } from '../../../../components/ui/index.jsx';

export default function Phase7SubSteps({
  subStepId,
  fullState,
  completedSubSteps,
  onToggleComplete,
  saving,
  executeApiAction
}) {
  const isDone = completedSubSteps.includes(subStepId);

  const [serviceDate, setServiceDate] = useState('2026-09-10');
  const [deliveryMethod, setDeliveryMethod] = useState('Registered Courier with Signed Return Acknowledgment of Receipt');
  const [depositAmount, setDepositAmount] = useState('3,123,750');
  const [depositReceiptNo, setDepositReceiptNo] = useState('CBE-DEP-2026-991823');
  const [objectionPoints, setObjectionPoints] = useState('Ground 1: Taxpayer challenges the selection of Pan-African comparables instead of Middle Eastern regional distributors.\nGround 2: Taxpayer claims 50% penalty is punitive and requests waiver under Article 112 relief provisions.');
  const [auditorRejoinder, setAuditorRejoinder] = useState('Rejoinder Point 1: Pan-African comparable set selected strictly meets geographic comparability standards under TP Directives.\nRejoinder Point 2: Penalty waiver is not warranted as taxpayer failed to maintain local file documentation within statutory deadlines.');
  const [hearingMinutes, setHearingMinutes] = useState('Formal hearing conducted before Tax Decision / Review Committee. Taxpayer presented oral submissions. Committee deliberated on comparability adjustments.');
  const [finalDecision, setFinalDecision] = useState('Committee Ruling: Objection dismissed. Statutory assessment confirmed in full with revised 15-day collection grace period.');

  // Sub-step 7.1: Formal Notice Service & Proof of Delivery
  if (subStepId === '7.1') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
          <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={15} /> Statutory Notice Service & 30-Day Clock (Article 99)
          </h4>
          <p className="text-xs text-indigo-800 dark:text-indigo-300 mt-1">
            Record the exact date and delivery mechanism of the statutory assessment notice to establish the strict 30-day objection limitation deadline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Date of Service on Taxpayer
            </label>
            <Input
              type="date"
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Proof of Service / Delivery Protocol
            </label>
            <Input
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('7.1', !isDone, { serviceDate, deliveryMethod })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 7.1 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 7.1 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 7.2: Taxpayer Payment or 25% Statutory Deposit Receipt
  if (subStepId === '7.2') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign size={15} /> Article 99(2) 25% Statutory Deposit Verification
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Under Article 99(2), a taxpayer objection is legally inadmissible unless the taxpayer has paid all undisputed tax plus 25% of the disputed tax liability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Deposited Amount (ETB)
            </label>
            <Input
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Bank Deposit Slip / ITAS Receipt Reference
            </label>
            <Input
              value={depositReceiptNo}
              onChange={(e) => setDepositReceiptNo(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('7.2', !isDone, { depositAmount, depositReceiptNo })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 7.2 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 7.2 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 7.3: Objection Grounds Dissection
  if (subStepId === '7.3') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
            <FileText size={15} /> Objection Grounds Dissection
          </h4>
          <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
            Catalog and classify each specific grievance raised in the taxpayer’s formal notice of objection.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Dissected Grounds of Objection
          </label>
          <Textarea
            value={objectionPoints}
            onChange={(e) => setObjectionPoints(e.target.value)}
            rows={5}
          />
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('7.3', !isDone, { objectionPoints })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 7.3 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 7.3 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 7.4: Auditor Technical Defense Rejoinder
  if (subStepId === '7.4') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={15} /> Auditor Technical Defense Rejoinder
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Formulate point-by-point technical and economic rejoinder defending the statutory assessment against the taxpayer’s objection.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Formal Auditor Defense Rejoinder
          </label>
          <Textarea
            value={auditorRejoinder}
            onChange={(e) => setAuditorRejoinder(e.target.value)}
            rows={5}
          />
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('7.4', !isDone, { auditorRejoinder })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 7.4 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 7.4 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 7.5: Objection Review Session / Hearing Minutes
  if (subStepId === '7.5') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider flex items-center gap-1.5">
            <Users size={15} /> Tax Review Committee Hearing Session
          </h4>
          <p className="text-xs text-blue-800 dark:text-blue-300 mt-1">
            Document proceedings and evidence presented during the formal objection review hearing before the Tax Decision Committee.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Committee Hearing Proceedings & Minutes
          </label>
          <Textarea
            value={hearingMinutes}
            onChange={(e) => setHearingMinutes(e.target.value)}
            rows={5}
          />
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('7.5', !isDone, { hearingMinutes })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 7.5 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 7.5 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 7.6: Final Administrative Determination Recording
  if (subStepId === '7.6') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
          <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
            <Scale size={15} /> Final Administrative Objection Determination
          </h4>
          <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1">
            Record the Review Committee’s final statutory decision under Article 100 confirming, amending, or dismissing the objection.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Final Committee Determination Ruling
          </label>
          <Textarea
            value={finalDecision}
            onChange={(e) => setFinalDecision(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={async () => {
              await executeApiAction('/objection/record', {
                groundsSummary: objectionPoints,
                auditorRejoinder: auditorRejoinder,
                committeeDecision: finalDecision
              }, 'Objection determination recorded.');
              onToggleComplete('7.6', !isDone, { finalDecision });
            }}
            disabled={saving}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 7.6 Completed ✓ (Click to Undo)' : 'Save & Mark Sub-Step 7.6 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
