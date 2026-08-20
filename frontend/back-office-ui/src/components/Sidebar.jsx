import React from 'react';
import { useAuth } from '../context/AuthContext';
import { getNavigationForRole, getRoleLabel } from '../config/navigation';
import { useSidebarStats } from '../hooks/useAuditTeamMetrics';

/**
 * Enterprise sidebar — config-driven navigation, profile, and quick stats.
 */
function Sidebar({ currentRole, currentView, onNavigate }) {
  const { getUserInfo } = useAuth();
  const userInfo = getUserInfo();
  const stats = useSidebarStats();
  const nav = getNavigationForRole(currentRole);

  const initials = (userInfo?.fullName || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleNav = (id) => {
    if (onNavigate) onNavigate(id);
  };

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col border-r border-slate-800/80 bg-[#0a0f14]">
      {/* Logo */}
      <div className="border-b border-slate-800/80 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-sm font-bold text-white shadow-lg">
            A
          </div>
          <div>
            <p className="text-sm font-bold text-slate-100">Audit System</p>
            <p className="text-[10px] text-slate-500">V2.0</p>
          </div>
        </div>
      </div>

      {/* Profile */}
      {userInfo && (
        <div className="mx-4 mt-4 rounded-xl border border-slate-800/80 bg-[#161f28] p-4">
          <div className="mb-3 flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm font-bold text-slate-100">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-100">
                {userInfo.fullName || 'User'}
              </p>
              <span className="mt-1 inline-block rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                {getRoleLabel(userInfo.role)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quick stats */}
      <div className="mx-4 mt-3 grid grid-cols-3 gap-2 rounded-xl border border-slate-800/80 bg-[#161f28] p-3">
        {[
          { value: stats.cases, label: 'Cases', color: 'text-slate-100' },
          { value: stats.plans, label: 'Plans', color: 'text-amber-400' },
          { value: stats.assigned, label: 'Assigned', color: 'text-teal-400' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-slate-800/60 bg-[#0d131a] p-2 text-center"
          >
            <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
            <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="scrollbar-thin flex-1 space-y-5 overflow-y-auto px-3 py-5">
        {nav.categories.map((category) => (
          <div key={category.label}>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
              {category.label}
            </p>
            <div className="space-y-0.5">
              {category.items.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNav(item.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'border-l-2 border-amber-500 bg-amber-500/10 pl-[10px] text-amber-400'
                        : 'border-l-2 border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    <i className={`${item.icon} w-4 text-center text-xs`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer settings */}
      {nav.footer && (
        <div className="border-t border-slate-800/80 p-3">
          <button
            type="button"
            onClick={() => handleNav(nav.footer.id)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              currentView === nav.footer.id
                ? 'border-l-2 border-amber-500 bg-amber-500/10 pl-[10px] text-amber-400'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <i className={`${nav.footer.icon} w-4 text-center text-xs`} />
            <span>{nav.footer.label}</span>
          </button>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
