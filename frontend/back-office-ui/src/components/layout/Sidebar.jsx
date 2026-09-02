import {
  LayoutDashboard, ClipboardList, CheckSquare, Map, Building2,
  Users, Search, Star, LogOut, ChevronRight, Activity, Target, Settings,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const NAV_SECTIONS = {
  planning_team: [
    {
      title: 'OVERVIEW',
      items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }]
    },
    {
      title: 'AUDIT PLANNING',
      items: [
        { id: 'plans', label: 'Annual Plans', icon: ClipboardList },
        { id: 'regional_allocation', label: 'Regional Allocation', icon: Map },
        { id: 'deployment', label: 'Deployment', icon: Target }
      ]
    },
    {
      title: 'RISK & ANALYTICS',
      items: [
        { id: 'risk_analysis', label: 'Risk Overview', icon: Activity, badge: 'Live' },
        { id: 'risk_distribution', label: 'Risk Distribution', icon: Search }
      ]
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { id: 'config', label: 'Planning Config', icon: Settings }
      ]
    },
    {
      title: 'GOVERNANCE',
      items: [
        { id: 'audit_trail', label: 'Audit Trail', icon: CheckSquare }
      ]
    }
  ],
  audit_director: [
    {
      title: 'OVERVIEW',
      items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }]
    },
    {
      title: 'AUDIT PLANNING',
      items: [
        { id: 'review', label: 'Plan Review', icon: CheckSquare },
        { id: 'deploy', label: 'Regional Deployment', icon: Map }
      ]
    },
    {
      title: 'GOVERNANCE',
      items: [
        { id: 'approvals', label: 'Approvals', icon: Star }
      ]
    }
  ],
  regional_director: [
    {
      title: 'OVERVIEW',
      items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }]
    },
    {
      title: 'AUDIT PLANNING',
      items: [
        { id: 'plans', label: 'Regional Plans', icon: ClipboardList },
        { id: 'feedback', label: 'Capacity Feedback', icon: Map }
      ]
    }
  ],
  tax_center_manager: [
    {
      title: 'OVERVIEW',
      items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }]
    },
    {
      title: 'RISK & ANALYTICS',
      items: [
        { id: 'risk_engine', label: 'Risk Classifier', icon: Target, badge: 'Active' }
      ]
    },
    {
      title: 'AUDIT OPERATIONS',
      items: [
        { id: 'cases', label: 'Case Deployment', icon: Building2 }
      ]
    }
  ],
  team_leader: [
    {
      title: 'OVERVIEW',
      items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }]
    },
    {
      title: 'AUDIT OPERATIONS',
      items: [
        { id: 'cases', label: 'Assigned Cases', icon: Users }
      ]
    }
  ],
  committee: [
    {
      title: 'OVERVIEW',
      items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }]
    },
    {
      title: 'AUDIT OPERATIONS',
      items: [
        { id: 'cases', label: 'Committee Cases', icon: Users }
      ]
    }
  ],
  auditor: [
    {
      title: 'OVERVIEW',
      items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }]
    },
    {
      title: 'AUDIT OPERATIONS',
      items: [
        { id: 'cases', label: 'My Cases', icon: Search }
      ]
    }
  ],
  senior_management: [
    {
      title: 'OVERVIEW',
      items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }]
    },
    {
      title: 'GOVERNANCE',
      items: [
        { id: 'approval', label: 'National Plan Approval', icon: Star }
      ]
    }
  ]
};

const ROLE_LABELS = {
  planning_team:    'Audit Planning Team',
  audit_director:   'Audit Director',
  regional_director:'Regional Director',
  tax_center_manager:'Tax Center Manager',
  team_leader:      'Team Leader',
  committee:        'Joint Audit Committee',
  auditor:          'Auditor',
  senior_management:'Senior Management',
};

export default function Sidebar({ activeView, onNavigate }) {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  if (!user) return null;

  const handleNavClick = (id) => {
    if (onNavigate && typeof onNavigate === 'function') {
      onNavigate(id);
    }
  };

  const isDark = theme === 'dark';

  return (
    <aside className="w-[260px] bg-gray-900 flex flex-col h-screen fixed left-0 top-0 z-30 border-r border-gray-800">
      {/* ── Logo & Brand ── */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img
            src="/mor-logo.jpeg"
            alt="Ministry of Revenues"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-white/10"
            onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
          />
          <div
            className="w-10 h-10 bg-gradient-to-br from-mor-500 to-mor-700 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ display: 'none' }}
          >
            <span className="text-white font-bold text-xs">MOR</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight tracking-tight">MOR</p>
            <p className="text-blue-400 text-[10px] font-medium leading-tight tracking-wide">Ministry of Revenues</p>
          </div>
        </div>
      </div>

      {/* ── User Card ── */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="bg-white/[0.04] rounded-xl px-3.5 py-3 border border-white/[0.05]">
          <p className="text-white text-sm font-semibold truncate">{user.name}</p>
          <p className="text-blue-400 text-xs font-medium mt-0.5 truncate">{ROLE_LABELS[user.role]}</p>
          {user.auditType && <p className="text-emerald-400 text-[10px] font-bold mt-0.5 truncate uppercase">🏷️ {user.auditType.replace(/_/g, ' ')}</p>}
          {user.email && <p className="text-gray-400 text-[10px] mt-0.5 truncate">{user.email}</p>}
          {user.region && <p className="text-blue-300 text-[11px] font-medium mt-1 truncate capitalize">📍 {user.region.replace(/_/g, ' ')}</p>}
          {user.taxCenter && <p className="text-gray-400 text-[11px] mt-0.5 truncate">🏢 {user.taxCenter}</p>}
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-6">
        {(NAV_SECTIONS[user.role] || []).map((section, idx) => (
          <div key={idx}>
            <p className="px-3 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map(item => {
                const Icon = item.icon;
                const active = activeView === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer ${
                        active
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon size={16} strokeWidth={active ? 2 : 1.5} />
                        {item.label}
                      </span>
                      <span className="flex items-center gap-1.5">
                        {item.badge && (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold border border-emerald-500/20">
                            {item.badge}
                          </span>
                        )}
                        {active && <ChevronRight size={14} className="text-white/60" />}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── Logout ── */}
      <div className="px-3 pb-4 border-t border-white/10 pt-3">
        <button
          type="button"
          onClick={() => logout()}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150 cursor-pointer"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
