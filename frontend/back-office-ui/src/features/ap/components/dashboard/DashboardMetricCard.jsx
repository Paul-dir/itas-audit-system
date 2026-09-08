import React from 'react';

const COLOR_MAP = {
  amber: {
    label: 'text-amber-600 dark:text-amber-500/80',
    value: 'text-amber-600 dark:text-amber-400',
    bar: 'bg-amber-500',
    barTrack: 'bg-amber-200 dark:bg-amber-500/15',
  },
  blue: {
    label: 'text-blue-600 dark:text-blue-400/80',
    value: 'text-blue-600 dark:text-blue-400',
    bar: 'bg-blue-500',
    barTrack: 'bg-blue-200 dark:bg-blue-500/15',
  },
  teal: {
    label: 'text-teal-600 dark:text-teal-400/80',
    value: 'text-teal-600 dark:text-teal-400',
    bar: 'bg-teal-500',
    barTrack: 'bg-teal-200 dark:bg-teal-500/15',
  },
  green: {
    label: 'text-emerald-600 dark:text-emerald-400/80',
    value: 'text-emerald-600 dark:text-emerald-400',
    bar: 'bg-emerald-500',
    barTrack: 'bg-emerald-200 dark:bg-emerald-500/15',
  },
};

/**
 * Summary metric card with colored value and optional progress bar.
 */
function DashboardMetricCard({ title, value, subtitle, color = 'blue', progress = 0 }) {
  const colors = COLOR_MAP[color] || COLOR_MAP.blue;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-800/80 bg-white dark:bg-[#161f28] p-6 transition-all duration-200 hover:border-gray-300 dark:hover:border-slate-700">
      <p className={`mb-3 text-[11px] font-semibold uppercase tracking-widest ${colors.label}`}>
        {title}
      </p>
      <p className={`mb-1 font-serif text-4xl font-bold ${colors.value}`}>{value}</p>
      <p className="mb-4 text-xs text-gray-500 dark:text-slate-500">{subtitle}</p>
      <div className={`h-1 w-full overflow-hidden rounded-full ${colors.barTrack}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}

export default DashboardMetricCard;
