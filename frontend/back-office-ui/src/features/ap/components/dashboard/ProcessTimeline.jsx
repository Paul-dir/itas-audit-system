import React from 'react';
import { STAGE_STATUS } from '../../config/planningProcess';

const STATUS_STYLES = {
  [STAGE_STATUS.COMPLETE]: {
    node: 'border-emerald-500/60 bg-emerald-500/10 text-emerald-400',
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    label: 'Complete',
    line: 'bg-emerald-500/40',
  },
  [STAGE_STATUS.IN_PROGRESS]: {
    node: 'border-amber-500 bg-amber-500/15 text-amber-400 ring-2 ring-amber-500/30 scale-110',
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    label: 'In progress',
    line: 'bg-amber-500/40',
  },
  [STAGE_STATUS.PENDING]: {
    node: 'border-slate-700 bg-slate-800/50 text-slate-500',
    badge: 'bg-slate-800 text-slate-500 border-slate-700',
    label: 'Pending',
    line: 'bg-slate-700',
  },
};

/**
 * Horizontal 6-stage process timeline with connecting lines.
 */
function ProcessTimeline({ title = 'Annual planning process', stages = [], activeStageTitle }) {
  const activeIndex = stages.findIndex((s) => s.status === STAGE_STATUS.IN_PROGRESS);
  const currentStage = activeIndex >= 0 ? activeIndex + 1 : stages.length;
  const totalStages = stages.length;

  return (
    <div className="rounded-xl border border-slate-800/80 bg-[#161f28] p-6 transition-all duration-200">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-serif text-lg font-semibold text-slate-100">{title}</h3>
        <p className="text-sm text-slate-500">
          Currently at{' '}
          <span className="font-medium text-amber-400">{activeStageTitle}</span>
          {' '}— stage {currentStage} of {totalStages}
        </p>
      </div>

      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-0 right-0 top-7 hidden h-px bg-slate-700 lg:block" aria-hidden="true" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {stages.map((stage, index) => {
            const styles = STATUS_STYLES[stage.status] || STATUS_STYLES[STAGE_STATUS.PENDING];
            const isComplete = stage.status === STAGE_STATUS.COMPLETE;
            const iconClass = isComplete ? (stage.completeIcon || 'fas fa-check') : stage.icon;

            return (
              <div key={stage.id} className="relative flex flex-col items-center text-center">
                <div
                  className={`relative z-10 mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all duration-200 ${styles.node}`}
                >
                  <i className={`${iconClass} text-sm`} />
                </div>

                <h4 className="mb-1 text-sm font-semibold text-slate-200">{stage.title}</h4>
                <p className="mb-3 min-h-[2.5rem] text-[11px] leading-relaxed text-slate-500">
                  {stage.description}
                </p>

                <span
                  className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition-all duration-200 ${styles.badge}`}
                >
                  {styles.label}
                </span>

                {index < stages.length - 1 && (
                  <div
                    className={`absolute -right-3 top-7 hidden h-px w-6 lg:block ${styles.line}`}
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProcessTimeline;
