import React from 'react';

const VALUE_COLORS = {
  blue: 'text-blue-600 dark:text-blue-400',
  teal: 'text-teal-600 dark:text-teal-400',
  amber: 'text-amber-600 dark:text-amber-400',
  green: 'text-emerald-600 dark:text-emerald-400',
};

/**
 * Bottom row of three simple metric items.
 */
function BottomStatsBar({ items = [] }) {
  return (
    <div className="grid grid-cols-1 divide-y divide-gray-200 dark:divide-slate-800/80 rounded-xl border border-gray-200 dark:border-slate-800/80 bg-white dark:bg-[#161f28] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {items.map((item) => (
        <div key={item.id} className="px-8 py-6 text-center transition-all duration-200">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-gray-500 dark:text-slate-500">
            {item.label}
          </p>
          <p className={`font-serif text-3xl font-bold ${VALUE_COLORS[item.color] || VALUE_COLORS.blue}`}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export default BottomStatsBar;
