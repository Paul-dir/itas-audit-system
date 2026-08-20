import React from 'react';

function ModuleCard({ module, icon, status, onClick }) {
  const statusConfig = {
    active: { bg: 'bg-emerald-900/30', text: 'text-emerald-400', label: '🟢 ACTIVE' },
    partial: { bg: 'bg-amber-900/30', text: 'text-amber-400', label: '🟡 PARTIAL' },
    attention: { bg: 'bg-red-900/30', text: 'text-red-400', label: '🔴 ALERT' }
  };

  const config = statusConfig[status] || statusConfig.attention;

  return (
    <button
      onClick={onClick}
      className="group relative bg-card-dark border border-border-dark rounded-lg p-6 hover:border-orange-500 hover:shadow-lg hover:shadow-blue/15 transition-all duration-300 transform hover:scale-105 text-left"
    >
      {/* Icon */}
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-text-hi mb-1">
        {module.name}
      </h3>

      {/* Count */}
      <p className="text-sm text-text-mid mb-4">
        Configure {module.count} {typeof module.count === 'string' ? '' : 'items'}
      </p>

      {/* Status Badge */}
      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${config.text} ${config.bg} mb-3`}>
        {config.label}
      </div>

      {/* Description */}
      <p className="text-xs text-text-mid">
        {module.totalRequired} items configured
      </p>

      {/* Arrow Button */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-blue group-hover:text-orange-500 transition-colors duration-200">→</span>
        <span className="text-sm font-medium text-blue group-hover:text-orange-500 transition-colors duration-200">Configure</span>
      </div>
    </button>
  );
}

export default ModuleCard;
