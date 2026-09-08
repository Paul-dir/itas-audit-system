import { useState } from 'react';
import { Search, Users, Mail, Shield, Building2, X } from 'lucide-react';
import { SEED_USERS } from '../data/seed.js';

// Committee roles + all DB auditors from t_auditor table
const ALLOWED_DEMO_EMAILS = new Set([
  // Committee roles (1 chair + 1 member per tax center)
  'aa.committee1@mor.gov.et',              // Chair AA-TC1
  'aa-ara.joint_committee.2@mor.gov.et',   // Member AA-TC1
  'aa.committee2@mor.gov.et',              // Chair AA-TC2
  'aa-ara.joint_committee.7@mor.gov.et',   // Member AA-TC2
  'aa.committee3@mor.gov.et',              // Chair AA-TC3
  'aa-ara.joint_committee.9@mor.gov.et',   // Member AA-TC3
  'or.committee1@mor.gov.et',              // Chair OR-TC1
  'or-ara.joint_committee.11@mor.gov.et',  // Member OR-TC1
  // Team Leaders (from t_user table — 4)
  'henok.belay@mor.gov.et',              // AA-TC1, desk_audit
  'tigist.alemu@mor.gov.et',             // AA-TC3, field_audit
  'fikadu.desta@mor.gov.et',             // AA-TC2, desk_audit
  'lalisa.wakjira@mor.gov.et',           // OR-TC1, desk_audit
  // DB auditors (synced from t_auditor table V12)
  'abebe.kebede@mor.gov.et',               // Corporate Tax, SENIOR
  'fatuma.ahmed@mor.gov.et',               // Transfer Pricing, PRINCIPAL
  'dawit.tadesse@mor.gov.et',              // International Tax, SENIOR
  'sara.mohammed@mor.gov.et',              // VAT Compliance, MID_LEVEL
  'yonas.berhanu@mor.gov.et',              // Corporate Tax, JUNIOR
  'hana.girma@mor.gov.et',                 // Audit Investigation, SENIOR
  'mulugeta.alemayehu@mor.gov.et',          // Transfer Pricing, MID_LEVEL
  'tigist.haile@mor.gov.et',               // International Tax, JUNIOR
]);

const ROLE_INFO = {
  planning_team: { label: 'Planning Team', color: 'bg-blue-50 border-blue-200 text-blue-700', icon: '📋' },
  audit_director: { label: 'Audit Director', color: 'bg-purple-50 border-purple-200 text-purple-700', icon: '👔' },
  senior_management: { label: 'Senior Management', color: 'bg-amber-50 border-amber-200 text-amber-700', icon: '⭐' },
  regional_director: { label: 'Regional Director', color: 'bg-green-50 border-green-200 text-green-700', icon: '🌍' },
  tax_center_manager: { label: 'Tax Center Manager', color: 'bg-teal-50 border-teal-200 text-teal-700', icon: '🏢' },
  team_leader: { label: 'Team Leader', color: 'bg-indigo-50 border-indigo-200 text-indigo-700', icon: '👥' },
  auditor: { label: 'Auditor', color: 'bg-rose-50 border-rose-200 text-rose-700', icon: '🔍' },
};

export default function UserDirectory({ onSelectUser, onClose }) {
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Only show the 4 curated demo accounts
  const demoUsers = SEED_USERS.filter(u => ALLOWED_DEMO_EMAILS.has(u.email));

  // Get unique roles
  const roles = [...new Set(demoUsers.map(u => u.role))];

  // Filter users
  const filteredUsers = demoUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      (user.region && user.region.toLowerCase().includes(search.toLowerCase())) ||
      (user.taxCenter && user.taxCenter.toLowerCase().includes(search.toLowerCase()));
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  // Group by role
  const usersByRole = filteredUsers.reduce((acc, user) => {
    if (!acc[user.role]) acc[user.role] = [];
    acc[user.role].push(user);
    return acc;
  }, {});

  const handleUserClick = (user) => {
    if (onSelectUser) {
      onSelectUser(user.email);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Directory</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{demoUsers.length} curated demo accounts</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            )}
          </div>

          {/* Demo password banner */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
            <p className="text-xs text-blue-900 font-medium mb-1">🎭 Demo Mode</p>
            <p className="text-xs text-blue-700">
              All users share password:{' '}
              <code className="bg-blue-100 px-2 py-1 rounded font-mono text-blue-900 font-semibold">password123</code>
            </p>
          </div>

          {/* Search and filter */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Search by name, email, region, or tax center..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>
                  {ROLE_INFO[role]?.label || role}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* User list */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500">No users found matching your search</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(usersByRole).map(([role, users]) => (
                <div key={role}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{ROLE_INFO[role]?.icon}</span>
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      {ROLE_INFO[role]?.label || role}
                    </h3>
                    <span className="text-xs text-gray-400 dark:text-gray-500">({users.length})</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {users.map(user => (
                      <button
                        key={user.id}
                        onClick={() => handleUserClick(user)}
                        className="text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 
                                   hover:border-gray-300 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {user.name}
                          </p>
                          <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${ROLE_INFO[user.role]?.color}`}>
                            {ROLE_INFO[user.role]?.label}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                            <Mail size={12} />
                            <span className="font-mono">{user.email}</span>
                          </div>
                          {user.region && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                              <Building2 size={12} />
                              <span className="capitalize">{user.region.replace(/_/g, ' ')}</span>
                              {user.taxCenter && (
                                <span className="text-gray-400 dark:text-gray-500">• {user.taxCenter.toUpperCase()}</span>
                              )}
                            </div>
                          )}
                          {user.expertise && (
                            <div className="flex items-center gap-2 text-xs">
                              <Shield size={12} className="text-blue-500" />
                              <span className="text-blue-600 font-medium">{user.expertise}</span>
                              <span className="text-gray-400">• {user.seniority} ({user.yearsOfExperience}y)</span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <p className="text-xs text-gray-500 text-center">
            Click any user to auto-fill login credentials
          </p>
        </div>
      </div>
    </div>
  );
}
