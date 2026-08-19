import {
  LayoutDashboard, ClipboardList, CheckSquare, Map, Building2,
  Users, Search, Star, LogOut, ChevronRight, Activity, Target,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const NAV = {
  planning_team: [
    { id: 'dashboard',    label: 'Dashboard',      icon: LayoutDashboard },
    { id: 'plans',        label: 'Audit Plans',    icon: ClipboardList   },
    { id: 'risk_analysis',label: 'Risk Analysis',  icon: Activity, badge: 'Live' },
  ],
  audit_director: [
    { id: 'dashboard',  label: 'Dashboard',          icon: LayoutDashboard },
    { id: 'review',     label: 'Plan Review',        icon: CheckSquare    },
    { id: 'deploy',     label: 'Deploy to Regions',  icon: Map            },
  ],
  regional_director: [
    { id: 'dashboard', label: 'Dashboard',      icon: LayoutDashboard },
    { id: 'plans',     label: 'Regional Plans', icon: ClipboardList   },
    { id: 'feedback',  label: 'Submit Feedback',icon: Map             },
  ],
  tax_center_manager: [
    { id: 'dashboard',  label: 'Dashboard',       icon: LayoutDashboard },
    { id: 'cases',      label: 'Case Management', icon: Building2       },
    { id: 'risk_engine',label: 'Risk Engine',     icon: Target, badge: 'New' },
  ],
  team_leader: [
    { id: 'dashboard', label: 'Dashboard',      icon: LayoutDashboard },
    { id: 'cases',     label: 'Assigned Cases', icon: Users           },
  ],
  auditor: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cases',     label: 'My Cases',  icon: Search          },
  ],
  senior_management: [
    { id: 'dashboard',  label: 'Dashboard',     icon: LayoutDashboard },
    { id: 'approval',   label: 'Plan Approval', icon: Star            },
  ],
};

const ROLE_LABELS = {
  planning_team:    'Audit Planning Team',
  audit_director:   'Audit Director',
  regional_director:'Regional Director',
  tax_center_manager:'Tax Center Manager',
  team_leader:      'Team Leader',
  auditor:          'Auditor',
  senior_management:'Senior Management',
};

export default function Sidebar({ activeView, onNavigate }) {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  if (!user) return null;

  const items = NAV[user.role] || [];

  const handleNavClick = (id) => {
    console.log('=== Sidebar Navigation Click ===');
    console.log('View ID:', id);
    console.log('onNavigate function:', onNavigate);
    console.log('User role:', user?.role);
    
    if (onNavigate && typeof onNavigate === 'function') {
      onNavigate(id);
      console.log('Navigation completed to:', id);
    } else {
      console.error('onNavigate is not defined or not a function!', onNavigate);
    }
  };
  
  // Theme-aware colors
  const isDark = theme === 'dark';
  const sidebarBg = isDark ? 'bg-slate-900' : 'bg-slate-900';
  const borderColor = isDark ? 'border-slate-800' : 'border-slate-800';
  const logoBorder = isDark ? 'border-slate-700/60' : 'border-slate-700/60';
  const userCardBg = isDark ? 'bg-slate-800' : 'bg-slate-800';

  return (
    <aside className={`w-64 ${sidebarBg} flex flex-col h-screen fixed left-0 top-0 z-30 border-r ${borderColor}`}>
      {/* Logo */}
      <div className={`px-5 py-5 border-b ${logoBorder}`}>
        <div className="flex items-center gap-3">
          <img
            src="/mor-logo.jpeg"
            alt="MOR"
            className="w-9 h-9 rounded-xl object-cover flex-shrink-0 shadow-lg"
            onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
          />
          <div
            className="w-9 h-9 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
            style={{ display: 'none' }}
          >
            <span className="text-white font-bold text-xs">MOR</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">MOR</p>
            <p className="text-slate-400 text-[10px] leading-tight">Audit Planning System</p>
          </div>
        </div>
      </div>

      {/* User card */}
      <div className={`px-4 py-3 border-b ${logoBorder}`}>
        <div className={`${userCardBg} rounded-lg px-3 py-2.5`}>
          <p className="text-white text-sm font-medium truncate">{user.name}</p>
          <p className="text-slate-400 text-xs mt-0.5 truncate">{ROLE_LABELS[user.role]}</p>
          {user.email && <p className="text-slate-500 text-[10px] mt-0.5 truncate">{user.email}</p>}
          {user.region && <p className="text-blue-400 text-xs mt-0.5 truncate capitalize">{user.region.replace(/_/g, ' ')}</p>}
          {user.taxCenter && <p className="text-slate-500 text-xs mt-0.5 truncate">{user.taxCenter}</p>}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-2 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Menu</p>
        <ul className="space-y-0.5">
          {items.map(item => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon size={16} />
                    {item.label}
                  </span>
                  <span className="flex items-center gap-1">
                    {item.badge && (
                      <span className="text-[9px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full font-semibold border border-green-500/30">
                        {item.badge}
                      </span>
                    )}
                    {active && <ChevronRight size={14} />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4">
        <button
          type="button"
          onClick={() => {
            console.log('Logout clicked');
            logout();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150 cursor-pointer"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
