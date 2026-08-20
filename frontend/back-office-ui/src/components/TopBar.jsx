import React from 'react';
import { useAuth } from '../context/AuthContext';
import { getWorkspaceConfig } from '../config/workspaceConfig';
import { getRoleLabel } from '../config/navigation';

/**
 * Workspace header — title, subtitle, settings, profile, and logout.
 */
function TopBar({ currentRole, onNavigate }) {
  const { logout, getUserInfo } = useAuth();
  const userInfo = getUserInfo();
  const workspace = getWorkspaceConfig(currentRole);

  const initials = (userInfo?.fullName || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex items-center justify-between border-b border-slate-800/80 bg-[#0d131a] px-6 py-5 lg:px-8">
      <div>
        <h1 className="font-serif text-2xl font-bold capitalize text-slate-100">
          {workspace.title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{workspace.subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('configuration')}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800/80 text-slate-400 transition-all duration-200 hover:border-slate-700 hover:bg-[#161f28] hover:text-slate-200"
            title="Settings"
          >
            <i className="fas fa-cog text-sm" />
          </button>
        )}

        {userInfo && (
          <div className="flex items-center gap-3 border-l border-slate-800/80 pl-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-100">
                {userInfo.fullName || 'User'}
              </p>
              <p className="text-xs text-slate-500">{getRoleLabel(userInfo.role)}</p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-slate-100">
              {initials}
            </div>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-lg border border-slate-800/80 px-3.5 py-2 text-xs font-medium text-slate-300 transition-all duration-200 hover:border-slate-700 hover:bg-[#161f28] hover:text-slate-100"
            >
              <i className="fas fa-sign-out-alt" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default TopBar;
