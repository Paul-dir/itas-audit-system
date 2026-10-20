import React from 'react';
import { CheckCircle2, Circle, Clock, Check } from 'lucide-react';
import { Badge } from '../../../components/ui/index.jsx';

export default function PhaseSubStepTracker({
  subSteps = [],
  activeSubStepId,
  onSelectSubStep,
  completedSubSteps = [],
  phaseConfig,
  gate
}) {
  const completedCount = completedSubSteps.length;
  const pct = Math.round((completedCount / (subSteps.length || 6)) * 100);

  return (
    <div className="space-y-4">
      {/* Governance & Progress Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Phase {phaseConfig?.num} Execution
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500 font-medium">
              Approving Authority: <strong className="text-slate-700 dark:text-slate-300">{phaseConfig?.authority}</strong>
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            {phaseConfig?.label}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {phaseConfig?.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              {completedCount} of {subSteps.length} Sub-Steps Done
            </div>
            <div className="text-[11px] text-slate-400 font-medium">{pct}% Completion</div>
          </div>
          <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                pct === 100 ? 'bg-emerald-500' : 'bg-blue-600'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 6 Clickable Sub-Step Pills */}
      <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-thin">
        {subSteps.map((s) => {
          const isDone = completedSubSteps.includes(s.id);
          const isActive = activeSubStepId === s.id;

          return (
            <button
              key={s.id}
              onClick={() => onSelectSubStep(s.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : isDone
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                  : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] ${
                isActive
                  ? 'bg-white text-blue-600 font-bold'
                  : isDone
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {isDone ? <Check size={10} /> : s.id.split('.')[1]}
              </div>
              <span className="truncate max-w-[170px]">{s.title.split(' ')[1] || s.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
