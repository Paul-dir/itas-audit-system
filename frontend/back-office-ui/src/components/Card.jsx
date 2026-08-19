import React from 'react';

/**
 * Dark-themed card for dashboard metrics and content panels.
 */
function Card({
  title,
  number,
  icon,
  children,
  className = '',
  variant = 'default',
  accent = null,
  header = null,
  body = null,
  footer = null,
}) {
  const accentColors = {
    primary: 'border-l-4 border-primary-500',
    success: 'border-l-4 border-emerald-500',
    warning: 'border-l-4 border-amber-500',
    danger: 'border-l-4 border-red-500',
    gold: 'border-l-4 border-amber-500',
  };

  const variantClasses = {
    default: 'hover:border-slate-700',
    elevated: 'shadow-md hover:shadow-lg',
    interactive: 'hover:border-slate-600 cursor-pointer',
  };

  const baseClasses = `
    rounded-xl border border-slate-800/80 bg-[#161f28]
    transition-all duration-200
    ${accent ? accentColors[accent] : ''}
    ${variantClasses[variant]}
    ${className}
  `;

  if (header || body || footer) {
    return (
      <div className={baseClasses}>
        {header && (
          <div className="border-b border-slate-800/80 px-6 py-4">{header}</div>
        )}
        {body && <div className="px-6 py-4">{body}</div>}
        {footer && (
          <div className="border-t border-slate-800/80 px-6 py-4">{footer}</div>
        )}
      </div>
    );
  }

  if (children) {
    return <div className={`${baseClasses} p-6`}>{children}</div>;
  }

  return (
    <div className={`${baseClasses} p-6`}>
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-2 flex-1 min-w-0">
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 break-words line-clamp-2">
            {title}
          </h3>
          <div className="font-serif text-2xl font-bold text-slate-100 break-words">{number}</div>
        </div>
        {icon && (
          <div className="text-lg text-slate-600 flex-shrink-0">
            <i className={icon} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
