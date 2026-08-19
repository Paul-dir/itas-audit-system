import React from 'react';

/**
 * Consistent page wrapper for non-dashboard views in the dark workspace.
 */
function PageContainer({ title, subtitle, badge, actions, children, className = '' }) {
  return (
    <div className={`space-y-6 ${className}`}>
      {(title || subtitle || actions) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title && (
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-xl font-semibold text-slate-100">{title}</h2>
                {badge}
              </div>
            )}
            {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="rounded-xl border border-slate-800/80 bg-[#161f28] p-6 transition-all duration-200">
        {children}
      </div>
    </div>
  );
}

export default PageContainer;
