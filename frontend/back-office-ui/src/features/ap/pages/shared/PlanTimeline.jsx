import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const STEPS = [
  { status: 'DRAFT', label: 'Draft' },
  { status: 'SUBMITTED_TO_DIRECTOR', label: 'Submitted to Director' },
  { status: 'DIRECTOR_APPROVED', label: 'Director Approved' },
  { status: 'AWAITING_REGIONAL_FEEDBACK', label: 'Regional Feedback' },
  { status: 'FEEDBACK_COLLECTED', label: 'Feedback Collected' },
  { status: 'SUBMITTED_TO_SENIOR_MGMT', label: 'Senior Management' },
  { status: 'SENIOR_MGMT_APPROVED', label: 'SM Approved' },
  { status: 'FINALIZED', label: 'Finalized' },
];

const ORDER = STEPS.map(s => s.status);

export default function PlanTimeline({ plan }) {
  const currentIdx = ORDER.indexOf(plan.status);

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex items-center gap-0 min-w-max">
        {STEPS.map((step, idx) => {
          const done = idx < currentIdx || (plan.status === 'REVISION_REQUESTED' ? false : idx === currentIdx);
          const active = idx === currentIdx;
          const isRevision = plan.status === 'REVISION_REQUESTED' && idx === ORDER.indexOf('SUBMITTED_TO_DIRECTOR');
          return (
            <div key={step.status} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  isRevision ? 'bg-orange-100 ring-2 ring-orange-400' :
                  done ? 'bg-green-500' :
                  active ? 'bg-blue-500 ring-2 ring-blue-300' :
                  'bg-gray-200'
                }`}>
                  {isRevision
                    ? <AlertCircle size={14} className="text-orange-500" />
                    : done
                    ? <CheckCircle size={13} className="text-white" />
                    : active
                    ? <Clock size={13} className="text-white" />
                    : <span className="w-2 h-2 rounded-full bg-gray-400" />
                  }
                </div>
                <span className={`text-[10px] font-medium whitespace-nowrap ${
                  isRevision ? 'text-orange-600' :
                  done ? 'text-green-600' :
                  active ? 'text-blue-600' :
                  'text-gray-400'
                }`}>
                  {isRevision ? 'Revision Needed' : step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`w-12 h-0.5 mx-0.5 -mt-4 ${idx < currentIdx ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Recent timeline entries */}
      {plan.timeline && plan.timeline.length > 0 && (
        <div className="mt-4 space-y-2">
          {[...plan.timeline].reverse().slice(0, 4).map((entry, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-gray-500 dark:text-slate-400">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0 mt-1.5" />
              <span className="font-medium text-gray-700 dark:text-slate-200">{entry.status.replace(/_/g, ' ')}</span>
              {entry.comment && <span className="text-gray-400 dark:text-gray-500">— {entry.comment}</span>}
              <span className="ml-auto flex-shrink-0">{new Date(entry.timestamp).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
