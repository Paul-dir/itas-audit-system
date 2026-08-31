// ═══════════════════════════════════════════════════════════════
// MOR Enterprise UI Component Library v2
// Design: Integration Studio / Professional Dark Theme
// Unified dark & light mode with left accent borders
// ═══════════════════════════════════════════════════════════════
import { forwardRef } from 'react';
import { Loader2, CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';

// ──── BUTTON ────────────────────────────────────────────────
const BTN_BASE = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]';
const BTN_SIZES = {
  xs: 'px-2.5 py-1 text-[11px] rounded-md',
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
};
const BTN_VARIANTS = {
  primary:   'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500/40 shadow-sm',
  secondary: 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 focus:ring-gray-300 dark:bg-[#1c2333] dark:text-gray-300 dark:border-[#2a3348] dark:hover:bg-[#242d3f]',
  danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/40 shadow-sm',
  success:   'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500/40 shadow-sm',
  warning:   'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-400/40 shadow-sm',
  ghost:     'text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:ring-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/5',
  link:      'text-blue-600 hover:underline focus:ring-blue-300 p-0 dark:text-blue-400',
};
export function Button({ variant = 'primary', size = 'md', loading, icon: Icon, children, className = '', ...props }) {
  return (
    <button className={`${BTN_BASE} ${BTN_SIZES[size]} ${BTN_VARIANTS[variant]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? <Loader2 size={13} className="animate-spin" /> : Icon ? <Icon size={13} /> : null}
      {children}
    </button>
  );
}

// ──── BADGE ─────────────────────────────────────────────────
const BADGE_COLORS = {
  gray:   'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-white/5 dark:text-gray-400 dark:border-white/10',
  blue:   'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
  green:  'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  red:    'bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  yellow: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  orange: 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
  purple: 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
  teal:   'bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20',
  indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
};
export function Badge({ color = 'gray', dot, children, className = '', size = 'sm' }) {
  const sizeClass = size === 'xs' ? 'text-[9px] px-1.5 py-[1px]' : size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5';
  return (
    <span className={`inline-flex items-center gap-1 font-semibold tracking-wide rounded-full ${sizeClass} ${BADGE_COLORS[color] || BADGE_COLORS.gray} ${className}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />}
      {children}
    </span>
  );
}

// ──── CARD ──────────────────────────────────────────────────
export function Card({ children, className = '', padding = true, shadow = true, accent }) {
  const accentClass = accent ? {
    blue:   'border-l-[3px] border-l-blue-500 dark:border-l-blue-400',
    green:  'border-l-[3px] border-l-emerald-500 dark:border-l-emerald-400',
    yellow: 'border-l-[3px] border-l-amber-500 dark:border-l-amber-400',
    red:    'border-l-[3px] border-l-red-500 dark:border-l-red-400',
    purple: 'border-l-[3px] border-l-purple-500 dark:border-l-purple-400',
    teal:   'border-l-[3px] border-l-teal-500 dark:border-l-teal-400',
    gray:   'border-l-[3px] border-l-gray-400 dark:border-l-gray-500',
    indigo: 'border-l-[3px] border-l-indigo-500 dark:border-l-indigo-400',
  }[accent] || '' : '';
  return (
    <div className={`bg-white rounded-xl border border-gray-200 ${shadow ? 'shadow-sm' : ''} ${padding ? 'p-5' : ''} dark:bg-[#161b26] dark:border-[#1e2736] transition-all duration-200 ${accentClass} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, actions, icon: Icon }) {
  return (
    <div className="flex items-start justify-between mb-4 pb-3 border-b border-gray-100 dark:border-[#1e2736]">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 bg-blue-50 rounded-lg dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
            <Icon size={16} className="text-blue-600 dark:text-blue-400" />
          </div>
        )}
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// ──── STAT CARD ──────────────────────────────────────────────
// Integration Studio style: left accent border, icon in top-right, uppercase label
const STAT_ACCENTS = {
  blue:   { border: 'border-l-blue-500 dark:border-l-blue-400',   iconBg: 'bg-blue-500/10 dark:bg-blue-500/15',   iconColor: 'text-blue-600 dark:text-blue-400',   valColor: 'text-gray-900 dark:text-white' },
  green:  { border: 'border-l-emerald-500 dark:border-l-emerald-400', iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/15', iconColor: 'text-emerald-600 dark:text-emerald-400', valColor: 'text-gray-900 dark:text-white' },
  yellow: { border: 'border-l-amber-500 dark:border-l-amber-400', iconBg: 'bg-amber-500/10 dark:bg-amber-500/15',  iconColor: 'text-amber-600 dark:text-amber-400',  valColor: 'text-gray-900 dark:text-white' },
  red:    { border: 'border-l-red-500 dark:border-l-red-400',     iconBg: 'bg-red-500/10 dark:bg-red-500/15',     iconColor: 'text-red-600 dark:text-red-400',     valColor: 'text-gray-900 dark:text-white' },
  purple: { border: 'border-l-purple-500 dark:border-l-purple-400', iconBg: 'bg-purple-500/10 dark:bg-purple-500/15', iconColor: 'text-purple-600 dark:text-purple-400', valColor: 'text-gray-900 dark:text-white' },
  teal:   { border: 'border-l-teal-500 dark:border-l-teal-400',   iconBg: 'bg-teal-500/10 dark:bg-teal-500/15',   iconColor: 'text-teal-600 dark:text-teal-400',   valColor: 'text-gray-900 dark:text-white' },
  gray:   { border: 'border-l-gray-400 dark:border-l-gray-500',   iconBg: 'bg-gray-100 dark:bg-white/5',           iconColor: 'text-gray-500 dark:text-gray-400',   valColor: 'text-gray-900 dark:text-white' },
  indigo: { border: 'border-l-indigo-500 dark:border-l-indigo-400', iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/15', iconColor: 'text-indigo-600 dark:text-indigo-400', valColor: 'text-gray-900 dark:text-white' },
};
export function StatCard({ label, value, icon: Icon, color = 'blue', trend, sub, onClick, className = '' }) {
  const a = STAT_ACCENTS[color] || STAT_ACCENTS.blue;
  return (
    <Card
      accent={color}
      className={`relative overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400">{label}</p>
          <p className={`text-2xl font-bold tabular-nums tracking-tight mt-1 ${a.valColor}`}>{value}</p>
          {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
        </div>
        {Icon && (
          <div className={`flex-shrink-0 p-2.5 rounded-lg ${a.iconBg}`}>
            <Icon size={18} className={a.iconColor} strokeWidth={1.8} />
          </div>
        )}
      </div>
    </Card>
  );
}

// ──── QUICK ACTION CARD ──────────────────────────────────────
// Integration Studio style: icon with colored bg, title, description
export function QuickActionCard({ icon: Icon, title, description, color = 'blue', onClick, className = '' }) {
  const a = STAT_ACCENTS[color] || STAT_ACCENTS.blue;
  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-white rounded-xl border border-gray-200 dark:bg-[#161b26] dark:border-[#1e2736] p-4 flex items-center gap-3 hover:shadow-md hover:border-gray-300 dark:hover:border-[#2a3348] transition-all duration-200 group ${className}`}
    >
      <div className={`flex-shrink-0 p-2.5 rounded-lg ${a.iconBg}`}>
        {Icon && <Icon size={18} className={a.iconColor} strokeWidth={1.8} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{title}</p>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{description}</p>}
      </div>
      <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
    </button>
  );
}

// ──── MODAL ─────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, size = 'md', footer }) {
  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-6xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] flex flex-col dark:bg-[#161b26] dark:border dark:border-[#1e2736]`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#1e2736]">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors dark:hover:bg-white/5 text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-4">{children}</div>
        {footer && <div className="px-5 py-3 border-t border-gray-100 dark:border-[#1e2736] flex justify-end gap-2 bg-gray-50 dark:bg-[#111520] rounded-b-xl">{footer}</div>}
      </div>
    </div>
  );
}

// ──── INPUT ─────────────────────────────────────────────────
export const Input = forwardRef(({ label, error, helper, icon: Icon, className = '', ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">{label}</label>}
    <div className="relative">
      {Icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icon size={14} className="text-gray-400 dark:text-gray-500" /></div>}
      <input
        ref={ref}
        className={`block w-full rounded-lg border ${error ? 'border-red-400 focus:ring-red-400/30 focus:border-red-500' : 'border-gray-200 focus:ring-blue-500/30 focus:border-blue-500 dark:border-[#2a3348] dark:focus:ring-blue-400/20 dark:focus:border-blue-500'} ${Icon ? 'pl-9' : 'pl-3'} pr-3 py-2 text-sm focus:outline-none focus:ring-2 bg-white text-gray-900 placeholder-gray-400 dark:bg-[#111520] dark:text-white dark:placeholder-gray-500 transition-all duration-150 ${className}`}
        {...props}
      />
    </div>
    {error && <p className="text-xs font-medium text-red-500 dark:text-red-400">{error}</p>}
    {helper && !error && <p className="text-xs text-gray-400 dark:text-gray-500">{helper}</p>}
  </div>
));

// ──── TEXTAREA ───────────────────────────────────────────────
export const Textarea = forwardRef(({ label, error, helper, className = '', ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">{label}</label>}
    <textarea
      ref={ref}
      rows={4}
      className={`block w-full rounded-lg border ${error ? 'border-red-400 focus:ring-red-400/30 focus:border-red-500' : 'border-gray-200 focus:ring-blue-500/30 focus:border-blue-500 dark:border-[#2a3348] dark:focus:ring-blue-400/20 dark:focus:border-blue-500'} px-3 py-2 text-sm focus:outline-none focus:ring-2 bg-white text-gray-900 placeholder-gray-400 resize-none dark:bg-[#111520] dark:text-white dark:placeholder-gray-500 transition-all duration-150 ${className}`}
      {...props}
    />
    {error && <p className="text-xs font-medium text-red-500 dark:text-red-400">{error}</p>}
    {helper && !error && <p className="text-xs text-gray-400 dark:text-gray-500">{helper}</p>}
  </div>
));

// ──── SELECT ─────────────────────────────────────────────────
export const Select = forwardRef(({ label, error, options = [], placeholder, className = '', children, ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">{label}</label>}
    <select
      ref={ref}
      className={`block w-full rounded-lg border ${error ? 'border-red-400' : 'border-gray-200 dark:border-[#2a3348]'} px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white text-gray-900 dark:bg-[#111520] dark:text-white dark:focus:ring-blue-400/20 dark:focus:border-blue-500 appearance-none transition-all duration-150 ${className}`}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {children || options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    {error && <p className="text-xs font-medium text-red-500 dark:text-red-400">{error}</p>}
  </div>
));

// ──── ALERT ─────────────────────────────────────────────────
const ALERT_STYLES = {
  info:    { bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20',   icon: <Info size={15} className="text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />,    text: 'text-blue-800 dark:text-blue-300'  },
  success: { bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',  icon: <CheckCircle size={15} className="text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />, text: 'text-emerald-800 dark:text-emerald-300' },
  warning: { bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20',  icon: <AlertCircle size={15} className="text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />, text: 'text-amber-800 dark:text-amber-300' },
  error:   { bg: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20',      icon: <XCircle size={15} className="text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />,    text: 'text-red-800 dark:text-red-300'   },
};
export function Alert({ type = 'info', title, children, className = '' }) {
  const s = ALERT_STYLES[type] || ALERT_STYLES.info;
  return (
    <div className={`flex gap-3 p-4 rounded-lg border ${s.bg} ${className}`}>
      {s.icon}
      <div className="min-w-0">
        {title && <p className={`text-sm font-semibold ${s.text} mb-0.5`}>{title}</p>}
        <div className={`text-sm ${s.text} opacity-90`}>{children}</div>
      </div>
    </div>
  );
}

// ──── TABLE ─────────────────────────────────────────────────
// Supports both data-driven (<Table columns={...} rows={...} />) and children mode
export function Table({ columns, rows, onRowClick, children, className = '' }) {
  // Data-driven mode
  if (columns && rows) {
    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-[#1e2736]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-[#111520] border-b border-gray-200 dark:border-[#1e2736]">
              {columns.map((col, i) => (
                <th key={col.key || i} className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr
                key={row.id || rowIdx}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`border-b border-gray-100 dark:border-[#1a2030] last:border-0 ${onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors' : ''}`}
              >
                {columns.map((col, colIdx) => (
                  <td key={col.key || colIdx} className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  // Children mode (legacy)
  return (
    <div className={`overflow-x-auto rounded-lg border border-gray-200 dark:border-[#1e2736] ${className}`}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}
export function Th({ children, className = '' }) {
  return <th className={`px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#111520] border-b border-gray-200 dark:border-[#1e2736] ${className}`}>{children}</th>;
}
export function Td({ children, className = '' }) {
  return <td className={`px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-[#1a2030] last:border-0 ${className}`}>{children}</td>;
}

// ──── EMPTY STATE ───────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {Icon && (
        <div className="p-3 bg-gray-100 dark:bg-white/5 rounded-xl mb-4">
          <Icon size={28} className="text-gray-300 dark:text-gray-600" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
      {description && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ──── SECTION HEADER ────────────────────────────────────────
// Integration Studio style: uppercase label, bold title, subtitle
export function SectionHeader({ label, title, subtitle, actions }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        {label && <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500 mb-1">{label}</p>}
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// ──── EMPTY STATE (alias) ──────────────────────────────────
export { EmptyState as Empty };

// ──── SPINNER ──────────────────────────────────────────────
export function Spinner({ size = 20, className = '' }) {
  return <Loader2 size={size} className={`animate-spin text-blue-500 ${className}`} />;
}

// ──── TABS ─────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange, className = '' }) {
  return (
    <div className={`flex gap-1 border-b border-gray-200 dark:border-[#1e2736] ${className}`}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors -mb-px ${
            active === tab.id
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          {tab.label}{tab.count != null && <span className="ml-1.5 text-[10px] opacity-60">({tab.count})</span>}
        </button>
      ))}
    </div>
  );
}

// ──── CONFIRM MODAL ────────────────────────────────────────
export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', loading }) {
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm" footer={
      <>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
      </>
    }>
      <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
    </Modal>
  );
}
