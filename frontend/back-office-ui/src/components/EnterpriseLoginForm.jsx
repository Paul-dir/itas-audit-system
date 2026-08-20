/**
 * Enterprise Login Form — One-click access, no credentials
 * Simply pick your user and you're logged in with full role isolation.
 * Fully converted to Tailwind CSS with premium enterprise design.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllUsers } from '../data/orgStructure';

const ROLE_ICONS = {
  audit_team: '📋',
  audit_director: '👔',
  regional_director: '🗺️',
  tax_center_manager: '🏛️',
  team_leader: '👥',
  auditor: '🔍',
  senior_management: '🎖️',
  directorate_requester: '📝',
  external_stakeholder: '🤝',
};

function EnterpriseLoginForm() {
  const { login, loading, error: authError } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterTaxCenter, setFilterTaxCenter] = useState('');
  const [filterAuditType, setFilterAuditType] = useState('');
  const [error, setError] = useState(null);

  const allUsers = getAllUsers();

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      !searchTerm ||
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    const matchesRegion = !filterRegion || user.org_context.assignedRegion === filterRegion;
    const matchesTaxCenter = !filterTaxCenter || user.org_context.assignedTaxCenter === filterTaxCenter;
    const matchesAuditType = !filterAuditType || user.org_context.auditType === filterAuditType;
    return matchesSearch && matchesRole && matchesRegion && matchesTaxCenter && matchesAuditType;
  });

  const regions = [...new Set(allUsers.map((u) => u.org_context.assignedRegion).filter(Boolean))].sort();
  const taxCenters = [...new Set(allUsers.filter(u => !filterRegion || u.org_context.assignedRegion === filterRegion).map((u) => u.org_context.assignedTaxCenter).filter(Boolean))].sort();
  const auditTypes = [...new Set(allUsers.map((u) => u.org_context.auditType).filter(Boolean))].sort();

  const handleLogin = async (user) => {
    try {
      setError(null);
      await login(user.email);
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  const getRoleLabel = (role) => {
    const labels = {
      audit_team: 'Audit Planning Team',
      audit_director: 'Audit Director',
      regional_director: 'Regional Director',
      tax_center_manager: 'Tax Center Manager',
      team_leader: 'Team Leader',
      auditor: 'Auditor',
      senior_management: 'Senior Management',
      directorate_requester: 'Directorate Requester',
      external_stakeholder: 'External Stakeholder',
    };
    return labels[role] || role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const roles = [...new Set(allUsers.map((u) => u.role))].sort();

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0a1428] via-[#1c2128] to-[#0f1419] p-5 font-sans">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(76,175,80,0.1)_0%,transparent_50%)]" />

      <div className="relative z-10 w-full max-w-[820px] rounded-2xl border border-gray-700/50 bg-[rgba(28,33,40,0.95)] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-2xl font-bold text-white shadow-lg shadow-green-500/30">
            A
          </div>
          <h1 className="m-0 text-[28px] font-bold tracking-tight text-gray-100">
            Audit Planning System
          </h1>
          <p className="m-0 mb-2 text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">
            Ministry of Revenue — Ethiopia
          </p>
          <p className="m-0 text-xs font-medium text-green-500">
            Click any user to sign in — no password required in this demo
          </p>
        </div>

        {/* Search & Filter Row 1 */}
        <div className="mb-3 flex gap-3">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
              🔍
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setError(null);
              }}
              placeholder="Search by name or email..."
              autoFocus
              className="w-full appearance-none rounded-lg border border-gray-700 bg-[#0f1419] px-3 py-2.5 pl-9 text-sm text-gray-100 outline-none transition-colors focus:border-green-500"
              onFocus={(e) => e.currentTarget.style.borderColor = '#22c55e'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#30363d'}
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => {
              setFilterRole(e.target.value);
              setError(null);
            }}
            className="min-w-[180px] appearance-none rounded-lg border border-gray-700 bg-[#0f1419] px-3 py-2.5 text-sm text-gray-100 outline-none transition-colors focus:border-green-500"
          >
            <option value="" className="bg-[#0f1419] text-gray-100">All Roles</option>
            {roles.map((role) => {
              const count = allUsers.filter((u) => u.role === role).length;
              return (
                <option key={role} value={role} className="bg-[#0f1419] text-gray-100">
                  {getRoleLabel(role)} ({count})
                </option>
              );
            })}
          </select>
        </div>

        {/* Additional Filters Row 2 */}
        <div className="mb-6 flex gap-3">
          <select
            value={filterRegion}
            onChange={(e) => {
              setFilterRegion(e.target.value);
              setFilterTaxCenter(''); // Reset TC when region changes
              setError(null);
            }}
            className="flex-1 appearance-none rounded-lg border border-gray-700 bg-[#0f1419] px-3 py-2 text-sm text-gray-100 outline-none transition-colors focus:border-green-500"
          >
            <option value="" className="bg-[#0f1419] text-gray-100">All Regions</option>
            {regions.map((r) => <option key={r} value={r} className="bg-[#0f1419] text-gray-100">{r}</option>)}
          </select>

          <select
            value={filterTaxCenter}
            onChange={(e) => {
              setFilterTaxCenter(e.target.value);
              setError(null);
            }}
            className="flex-1 appearance-none rounded-lg border border-gray-700 bg-[#0f1419] px-3 py-2 text-sm text-gray-100 outline-none transition-colors focus:border-green-500"
          >
            <option value="" className="bg-[#0f1419] text-gray-100">All Tax Centers</option>
            {taxCenters.map((tc) => <option key={tc} value={tc} className="bg-[#0f1419] text-gray-100">{tc}</option>)}
          </select>

          <select
            value={filterAuditType}
            onChange={(e) => {
              setFilterAuditType(e.target.value);
              setError(null);
            }}
            className="flex-1 appearance-none rounded-lg border border-gray-700 bg-[#0f1419] px-3 py-2 text-sm text-gray-100 outline-none transition-colors focus:border-green-500"
          >
            <option value="" className="bg-[#0f1419] text-gray-100">All Audit Types</option>
            {auditTypes.map((type) => <option key={type} value={type} className="bg-[#0f1419] text-gray-100">{type}</option>)}
          </select>
        </div>

        {/* Error */}
        {(authError || error) && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-700/30 bg-red-900/10 px-4 py-2.5 text-sm text-red-400">
            <span>⚠️</span>
            <span>{authError || error}</span>
          </div>
        )}

        {/* User Grid */}
        {loading ? (
          <div className="px-5 py-16 text-center text-gray-500 dark:text-gray-400 dark:text-gray-500">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-[3px] border-green-500/30 border-t-green-500" />
            <p className="m-0 text-sm">Signing you in...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="px-5 py-12 text-center text-gray-500 dark:text-gray-400 dark:text-gray-500">
            <div className="mb-3 text-4xl opacity-50">🔍</div>
            <p className="m-0 mb-1 text-sm text-gray-100">No users found</p>
            <p className="m-0 text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Try a different search or role filter</p>
          </div>
        ) : (
          <div className="grid max-h-[480px] gap-2.5 overflow-y-auto p-1"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
            {filteredUsers.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleLogin(user)}
                disabled={loading}
                className={`flex cursor-pointer items-center gap-3.5 rounded-xl border border-gray-700 bg-[#0f1419] p-3.5 text-left transition-all hover:border-green-500 hover:bg-green-500/10 hover:shadow-[0_0_0_1px_rgba(76,175,80,0.2)] ${
                  loading ? 'opacity-60' : ''
                }`}
              >
                {/* Avatar */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-bold text-white">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-gray-100">
                    {user.full_name}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                    <span>{ROLE_ICONS[user.role] || '👤'}</span>
                    <span>{getRoleLabel(user.role)}</span>
                  </div>
                  {user.org_context.assignedRegion && (
                    <div className="mt-0.5 truncate text-[10px] text-green-500">
                      📍 {user.org_context.assignedRegion}
                      {user.org_context.assignedTaxCenter &&
                        ` · ${user.org_context.assignedTaxCenter}`}
                    </div>
                  )}
                  {user.org_context.teamName && (
                    <div className="mt-0.5 truncate text-[10px] text-blue-400 font-medium">
                      🛡️ {user.org_context.teamName}
                    </div>
                  )}
                </div>

                {/* Arrow */}
                <div className="shrink-0 text-sm text-green-500 opacity-60">
                  →
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 text-center text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
          {filteredUsers.length > 0 && !loading && (
            <p className="m-0">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
              {searchTerm || filterRole ? ' matching your filters' : ''}
              {' · '}Click any user to sign in
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EnterpriseLoginForm;
