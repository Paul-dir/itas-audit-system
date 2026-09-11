import {
  LayoutDashboard, ClipboardList, CheckSquare, Map, Building2,
  Users, Search, Star, LogOut, ChevronRight, Activity, Target, Settings,
  Landmark, Scale, FileText,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
const TEAM_LEADER_NAV = {
  JOINT_AUDIT: [
    {
      title: 'OVERVIEW',
      items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }]
    },
    {
      title: 'JOINT AUDIT OPERATIONS',
      items: [
        { id: 'cases', label: 'Assigned Joint Cases', icon: Users },
        { id: 'execution', label: 'Execution Workspace', icon: ClipboardList, badge: '10 Steps' }
      ]
    },
    {
      title: 'SUPERVISORY REVIEWS & MILESTONES',
      items: [
        { id: 'ja-phase-planning', label: 'Planning & Entry Conference', icon: Target },
        { id: 'ja-phase-fieldwork', label: 'Field Investigation Oversight', icon: Building2 },
        { id: 'ja-phase-findings', label: 'Customs & Tax Reconciliation', icon: Activity },
        { id: 'ja-phase-response', label: 'Exit Conference & Response', icon: CheckSquare },
        { id: 'ja-phase-conclusion', label: 'Statutory Joint Assessment', icon: Star }
      ]
    }
  ],
  TRANSFER_PRICING: [
    {
      title: 'OVERVIEW',
      items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }]
    },
    {
      title: 'TP AUDIT OPERATIONS',
      items: [
        { id: 'cases', label: 'Assigned TP Cases', icon: Users },
        { id: 'tp-tasks', label: 'TP Workflow Tasks', icon: Activity }
      ]
    },
    {
      title: 'SUPERVISORY REVIEWS & GATES',
      items: [
        { id: 'phase-1', label: 'Risk Assessment Review', icon: CheckSquare },
        { id: 'phase-3', label: 'Audit Plan & Scope Review', icon: Target },
        { id: 'phase-4', label: 'Fact Statement Sign-Off', icon: Building2 },
        { id: 'phase-5', label: 'Benchmark & IQR Review', icon: Activity },
        { id: 'phase-6', label: 'TP Report Endorsement', icon: FileText },
        { id: 'phase-assessment', label: 'Assessment Sign-Off', icon: Star }
      ]
    }
  ],
  COMPREHENSIVE_AUDIT: [
    {
      title: 'OVERVIEW',
      items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }]
    },
    {
      title: 'COMPREHENSIVE AUDIT OPERATIONS',
      items: [
        { id: 'cases', label: 'Assigned Cases', icon: Users }
      ]
    },
    {
      title: 'SUPERVISORY REVIEWS & GATES',
      items: [
        { id: 'comp-phase-1', label: 'Audit Scope & Notice Review', icon: CheckSquare },
        { id: 'comp-phase-2', label: 'Books Examination Review', icon: Building2 },
        { id: 'comp-phase-3', label: 'Discrepancy & Adjustment Review', icon: Activity },
        { id: 'comp-phase-4', label: 'Comprehensive Report Review', icon: FileText },
        { id: 'comp-phase-5', label: 'Final Assessment Sign-Off', icon: Star }
      ]
    }
  ],
  DESK_AUDIT: [
    {
      title: 'OVERVIEW',
      items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }]
    },
    {
      title: 'DESK AUDIT OPERATIONS',
      items: [
        { id: 'cases', label: 'Assigned Cases', icon: Users }
      ]
    },
    {
      title: 'SUPERVISORY REVIEWS & GATES',
      items: [
        { id: 'desk-phase-1', label: 'Return & Ratio Analysis Review', icon: CheckSquare },
        { id: 'desk-phase-2', label: 'Inquiry & Document Review', icon: Building2 },
        { id: 'desk-phase-3', label: 'Adjustment Determination', icon: Activity },
        { id: 'desk-phase-4', label: 'Desk Assessment Sign-Off', icon: Star }
      ]
    }
  ],
  ISSUE_AUDIT: [
    {
      title: 'OVERVIEW',
      items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }]
    },
    {
      title: 'ISSUE AUDIT OPERATIONS',
      items: [
        { id: 'cases', label: 'Assigned Cases', icon: Users }
      ]
    },
    {
      title: 'SUPERVISORY REVIEWS & GATES',
      items: [
        { id: 'issue-phase-1', label: 'Notification & Issue Selection', icon: CheckSquare },
        { id: 'issue-phase-2', label: 'Evidence & Verification Review', icon: Building2 },
        { id: 'issue-phase-3', label: 'Audit Findings Determination', icon: ClipboardList },
        { id: 'issue-phase-4', label: 'Issue Assessment Sign-Off', icon: Star }
      ]
    }
  ]
};

const AUDITOR_NAV = {
  JOINT_AUDIT: [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'cases', label: 'My Cases', icon: Search }
      ]
    }
  ],
  TRANSFER_PRICING: [
    {
      title: 'OVERVIEW',
      items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }]
    },
    {
      title: 'AUDIT OPERATIONS',
      items: [
        { id: 'cases', label: 'My Cases', icon: Search }
      ]
    },
    {
      title: 'TP AUDIT EXECUTION',
      items: [
        { id: 'phase-1', label: 'Risk Assessment', icon: CheckSquare },
        { id: 'phase-3', label: 'Planning & Meeting', icon: Target },
        { id: 'phase-4', label: 'Field Work', icon: Building2 },
        { id: 'phase-5', label: 'Economic Analysis', icon: Activity },
        { id: 'phase-6', label: 'TP Report', icon: ClipboardList },
        { id: 'phase-assessment', label: 'Assessment', icon: Star },
        { id: 'phase-7', label: 'Notice & Objection', icon: Star },
        { id: 'phase-8', label: 'Audit Closure', icon: CheckSquare }
      ]
    }
  ],
  COMPREHENSIVE_AUDIT: [
    {
      title: 'OVERVIEW',
      items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }]
    },
    {
      title: 'AUDIT OPERATIONS',
      items: [
        { id: 'cases', label: 'My Cases', icon: Search }
      ]
    },
    {
      title: 'COMPREHENSIVE AUDIT EXECUTION',
      items: [
        { id: 'comp-aud-1', label: 'Audit Scope & Books Examination', icon: CheckSquare },
        { id: 'comp-aud-2', label: 'Bank & Ledger Verification', icon: Building2 },
        { id: 'comp-aud-3', label: 'Tax Adjustment Schedules', icon: Activity },
        { id: 'comp-aud-4', label: 'Audit Report & Notice Drafting', icon: FileText }
      ]
    }
  ],
  DESK_AUDIT: [
    {
      title: 'OVERVIEW',
      items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }]
    },
    {
      title: 'AUDIT OPERATIONS',
      items: [
        { id: 'cases', label: 'My Cases', icon: Search }
      ]
    },
    {
      title: 'DESK AUDIT EXECUTION',
      items: [
        { id: 'desk-aud-1', label: 'Return & Financial Ratio Review', icon: CheckSquare },
        { id: 'desk-aud-2', label: 'Inquiry & Document Verification', icon: Building2 },
        { id: 'desk-aud-3', label: 'Summary & Adjustment Proposal', icon: FileText }
      ]
    }
  ],
  ISSUE_AUDIT: [
    {
      title: 'OVERVIEW',
      items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }]
    },
    {
      title: 'AUDIT OPERATIONS',
      items: [
        { id: 'cases', label: 'My Cases', icon: Search }
      ]
    },
    {
      title: 'ISSUE AUDIT EXECUTION',
      items: [
        { id: 'issue-phase-1', label: 'Auditee Notification & Selection', icon: CheckSquare },
        { id: 'issue-phase-2', label: 'Evidence & On-Site Verification', icon: Building2 },
        { id: 'issue-phase-3', label: 'Audit Findings & Report Drafting', icon: ClipboardList },
        { id: 'issue-phase-4', label: 'Multi-Level Review Chain', icon: Star },
        { id: 'issue-phase-5', label: 'Director Decision & Follow-Up', icon: CheckSquare }
      ]
    }
  ]
};

export function getEffectiveAuditType(user) {
  if (!user) return 'TRANSFER_PRICING';
  const raw = (user.auditType || '').toUpperCase().replace(/[\s-]+/g, '_');
  if (raw.includes('JOINT') || raw.includes('JA')) return 'JOINT_AUDIT';
  if (raw.includes('TRANSFER') || raw.includes('TP')) return 'TRANSFER_PRICING';
  if (raw.includes('COMPREHENSIVE') || raw.includes('COMP')) return 'COMPREHENSIVE_AUDIT';
  if (raw.includes('DESK')) return 'DESK_AUDIT';
  if (raw.includes('ISSUE')) return 'ISSUE_AUDIT';

  // Heuristics from username / id / email / name
  const str = `${user.username || ''} ${user.id || ''} ${user.email || ''} ${user.name || ''}`.toLowerCase();
  if (str.includes('.ja.') || str.includes('-ja-') || str.includes('joint') || str.includes(' ja ') || str.includes('(ja')) return 'JOINT_AUDIT';
  if (str.includes('.tp.') || str.includes('-tp-') || str.includes('transfer') || str.includes(' tp ') || str.includes('(tp')) return 'TRANSFER_PRICING';
  if (str.includes('.comp.') || str.includes('-comp-') || str.includes('comprehensive') || str.includes(' comp ') || str.includes('(comp')) return 'COMPREHENSIVE_AUDIT';
  if (str.includes('.desk.') || str.includes('-desk-') || str.includes('desk') || str.includes('(desk')) return 'DESK_AUDIT';
  if (str.includes('.issue.') || str.includes('-issue-') || str.includes('issue') || str.includes('(issue')) return 'ISSUE_AUDIT';

  return 'TRANSFER_PRICING';
}

export function getRoleDisplayName(user) {
  if (!user) return 'User';
  const role = user.role;
  const auditType = getEffectiveAuditType(user);

  if (role === 'team_leader') {
    if (auditType === 'JOINT_AUDIT') return 'Joint Audit Team Leader';
    if (auditType === 'TRANSFER_PRICING') return 'Transfer Pricing Team Leader';
    if (auditType === 'COMPREHENSIVE_AUDIT') return 'Comprehensive Audit Team Leader';
    if (auditType === 'DESK_AUDIT') return 'Desk Audit Team Leader';
    if (auditType === 'ISSUE_AUDIT') return 'Issue Audit Team Leader';
    return 'Audit Team Leader';
  }

  if (role === 'auditor') {
    if (auditType === 'JOINT_AUDIT') return 'Joint Audit Auditor';
    if (auditType === 'TRANSFER_PRICING') return 'Transfer Pricing Auditor';
    if (auditType === 'COMPREHENSIVE_AUDIT') return 'Comprehensive Auditor';
    if (auditType === 'DESK_AUDIT') return 'Desk Auditor';
    if (auditType === 'ISSUE_AUDIT') return 'Issue Auditor';
    return 'Auditor';
  }

  if (role === 'committee_chair') {
    if (auditType === 'TRANSFER_PRICING') return 'TP Committee Chair';
    return 'Joint Audit Committee Chair';
  }

  if (role === 'committee_member') {
    if (auditType === 'TRANSFER_PRICING') return 'TP Committee Member';
    return 'Joint Audit Committee Member';
  }

  if (role === 'committee') {
    if (auditType === 'TRANSFER_PRICING') return 'Transfer Pricing Committee';
    return 'Joint Audit Committee';
  }

  const map = {
    planning_team:     'Audit Planning Team',
    audit_director:    'Audit Director',
    regional_director: 'Regional Director',
    tax_center_manager:'Tax Center Manager',
    senior_management: 'Senior Management',
    audit_requester:   'Directorate Audit Requester',
  };

  return map[role] || role;
}

export function getNavigationSections(user) {
  if (!user) return [];
  const role = user.role;
  const auditType = getEffectiveAuditType(user);

  if (role === 'team_leader') {
    return TEAM_LEADER_NAV[auditType] || TEAM_LEADER_NAV.TRANSFER_PRICING;
  }

  if (role === 'auditor') {
    return AUDITOR_NAV[auditType] || AUDITOR_NAV.TRANSFER_PRICING;
  }

  if (['committee', 'committee_chair', 'committee_member'].includes(role)) {
    if (auditType === 'TRANSFER_PRICING') {
      return [
        {
          title: 'OVERVIEW',
          items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }]
        },
        {
          title: 'AUDIT OPERATIONS',
          items: [
            { id: 'cases', label: 'Committee Cases', icon: Users },
            { id: 'assign-cases', label: 'Assign Cases to TLs', icon: Users }
          ]
        },
        {
          title: 'STATUTORY REVIEW GATES',
          items: [
            { id: 'phase-2', label: '① Working Hypothesis & Scope', icon: ClipboardList },
            { id: 'phase-3', label: '② Audit Plan & IDR Approval', icon: Target },
            { id: 'phase-5', label: '③ Benchmark IQR Review', icon: Activity },
            { id: 'phase-6', label: '④ TP Report & Exit Conf.', icon: FileText },
            { id: 'phase-assessment', label: '⑤ Statutory Assessment Sign-Off', icon: Scale }
          ]
        },
        {
          title: 'COMMITTEE GOVERNANCE',
          items: [
            { id: 'deliberations', label: 'Deliberations & Resolutions', icon: Landmark }
          ]
        }
      ];
    }

    // Default to Joint Audit Committee
    return [
      {
        title: 'OVERVIEW',
        items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }]
      },
      {
        title: 'JOINT AUDIT COMMITTEE',
        items: [
          { id: 'cases', label: 'Committee Cases', icon: Users },
          { id: 'research', label: 'Research Workspace', icon: ClipboardList },
          ...(role === 'committee_chair' ? [{ id: 'auditors', label: 'Team Formation', icon: Target }] : []),
          { id: 'sessions', label: 'Session Management', icon: Landmark },
          { id: 'audit-trail', label: 'Audit Trail', icon: CheckSquare }
        ]
      }
    ];
  }

  return NAV_SECTIONS[role] || [];
}

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
  ],
  audit_requester: [
    {
      title: 'OVERVIEW',
      items: [{ id: 'dashboard', label: 'Referral Dashboard', icon: LayoutDashboard }]
    },
    {
      title: 'STATUTORY AUDIT REFERRALS',
      items: [
        { id: 'referrals', label: 'My Referrals & Flags', icon: ClipboardList },
        { id: 'new_referral', label: 'Submit Audit Referral', icon: Target }
      ]
    }
  ]
};

const ROLE_LABELS = {
  planning_team:     'Audit Planning Team',
  audit_director:    'Audit Director',
  regional_director: 'Regional Director',
  tax_center_manager:'Tax Center Manager',
  team_leader:       'Team Leader',
  committee:         'Joint Audit Committee',
  committee_member:  'Joint Audit Committee',
  committee_chair:   'Joint Audit Committee Chair',
  auditor:           'Auditor',
  senior_management: 'Senior Management',
  audit_requester:   'Directorate Audit Requester',
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

  const navSections = getNavigationSections(user);
  const roleDisplay = getRoleDisplayName(user);

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
          <p className="text-blue-400 text-xs font-medium mt-0.5 truncate">{roleDisplay}</p>
          {user.auditType && <p className="text-emerald-400 text-[10px] font-bold mt-0.5 truncate uppercase">🏷️ {user.auditType.replace(/_/g, ' ')}</p>}
          {user.email && <p className="text-gray-400 text-[10px] mt-0.5 truncate">{user.email}</p>}
          {user.region && <p className="text-blue-300 text-[11px] font-medium mt-1 truncate capitalize">📍 {user.region.replace(/_/g, ' ')}</p>}
          {user.taxCenter && <p className="text-gray-400 text-[11px] mt-0.5 truncate">🏢 {user.taxCenter}</p>}
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-6">
        {navSections.map((section, idx) => {
          return (
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
          );
        })}
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
