import { useState } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import { useApp } from './context/AppContext.jsx';
import Layout from './components/layout/Layout.jsx';
import Login from './features/ap/pages/Login.jsx';

// Role-specific dashboard pages
import PlanningDashboard from './features/ap/pages/planning/PlanningDashboard.jsx';
import DirectorDashboard from './features/ap/pages/director/DirectorDashboard.jsx';
import RegionalDashboard from './features/ap/pages/regional/RegionalDashboard.jsx';
import SeniorDashboard from './features/ap/pages/senior/SeniorDashboard.jsx';
import TaxCenterDashboard from './features/ap/pages/taxcenter/TaxCenterDashboard.jsx';
import CaseManagement from './features/ap/pages/taxcenter/CaseManagement.jsx';
import TeamLeaderDashboard from './features/teamleader/pages/TeamLeaderDashboard.jsx';
import TeamLeaderCases from './features/teamleader/pages/TeamLeaderCases.jsx';
import { WorkflowProvider } from './features/teamleader/context/WorkflowContext.jsx';
import AuditorDashboard from './features/ap/pages/auditor/AuditorDashboard.jsx';
import RiskAnalysisDashboard from './features/ap/pages/planning/RiskAnalysisDashboard.jsx';
import RiskEngineDashboard from './features/ap/pages/riskengine/RiskEngineDashboard.jsx';

// Committee pages
import {
  CommitteeDashboard,
  CommitteeCases,
  ResearchWorkspace,
  AuditorNomination as TeamFormation,
  SessionManager,
  AuditTrail,
} from './features/committee/index.js';

import { Spinner } from './components/ui/index.jsx';

const PAGE_TITLES = {
  planning_team: {
    dashboard:     { title: 'Planning Dashboard',    subtitle: 'Manage and track national audit plans'         },
    plans:         { title: 'Audit Plans',            subtitle: 'All audit plans overview'                      },
    risk_analysis: { title: 'Risk Engine Analysis',   subtitle: 'Live taxpayer risk data from the MOR Risk Engine' },
    risk_engine:   { title: 'Risk Engine',            subtitle: 'AI-powered risk assessment and taxpayer mapping'  },
  },
  audit_director: {
    dashboard:   { title: 'Director Dashboard',     subtitle: 'Review and approve audit plans'         },
    review:      { title: 'Plan Review',            subtitle: 'Plans awaiting your decision'           },
    deploy:      { title: 'Deploy Plans',           subtitle: 'Send approved plans to regions'         },
    risk_engine: { title: 'Risk Engine',            subtitle: 'AI-powered risk assessment and taxpayer mapping'  },
  },
  regional_director: {
    dashboard: { title: 'Regional Dashboard',  subtitle: 'Manage your regional allocation'                     },
    plans:     { title: 'Regional Plans',      subtitle: 'Plans assigned to your region'                       },
    feedback:  { title: 'Submit Feedback',     subtitle: 'Provide regional feedback and tax center allocations' },
  },
  tax_center_manager: {
    dashboard:   { title: 'Tax Center Dashboard', subtitle: 'Manage and assign audit cases for your tax center' },
    cases:       { title: 'Case Management',      subtitle: 'Assign and track audit cases'                      },
    risk_engine: { title: 'Risk Engine',          subtitle: 'Map taxpayers to plans and generate cases'         },
  },
  team_leader: {
    dashboard:  { title: 'Team Leader Dashboard',  subtitle: 'Cases from Committee & your audit team portfolio' },
    cases:      { title: 'My Cases',                subtitle: 'Cases from Committee & assigned cases'            },
  },
  auditor: {
    dashboard:  { title: 'Auditor Dashboard', subtitle: 'Your audit workspace and active cases' },
    cases:      { title: 'My Cases',           subtitle: 'Cases assigned to you'   },
  },
  committee: {
    dashboard:   { title: 'Committee Dashboard',      subtitle: 'Executive Control Center' },
    cases:       { title: 'Committee Cases',          subtitle: 'Manage and review all cases' },
    research:    { title: 'Research Workspace',        subtitle: 'Collaborative analysis & research notes' },
    sessions:    { title: 'Session Management',        subtitle: 'Create and manage committee sessions' },
    'audit-trail':{ title: 'Audit Trail',              subtitle: 'Immutable compliance & activity log' },
  },
  committee_chair: {
    dashboard:   { title: 'Committee Dashboard',      subtitle: 'Executive Control Center' },
    cases:       { title: 'Committee Cases',          subtitle: 'Manage and review all cases' },
    research:    { title: 'Research Workspace',        subtitle: 'Collaborative analysis & research notes' },
    auditors:    { title: 'Team Formation',            subtitle: 'Select auditors and team leaders for audit cases' },
    sessions:    { title: 'Session Management',        subtitle: 'Create and manage committee sessions' },
    'audit-trail':{ title: 'Audit Trail',              subtitle: 'Immutable compliance & activity log' },
  },
  senior_management: {
    dashboard: { title: 'Senior Management',  subtitle: 'Final approval of national audit plans' },
    approval:  { title: 'Plan Approval',      subtitle: 'Plans awaiting senior management approval' },
  },
};

// Only these 4 roles are active in the demo
const ALLOWED_DEMO_ROLES = ['committee', 'committee_chair', 'team_leader', 'auditor'];

function EmptyDemoState() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24 px-8">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-5">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Demo Access Restricted
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
        This role is not enabled in the current demo environment.
        Only <strong>Committee Chair</strong>, <strong>Committee Member</strong>, <strong>Team Leader</strong>, and <strong>Auditor</strong> roles are available.
      </p>
    </div>
  );
}

function RoleRouter({ user, view }) {
  const role = user.role;

  // Block roles outside the allowed demo set
  if (!ALLOWED_DEMO_ROLES.includes(role)) {
    return <EmptyDemoState />;
  }

  // Risk Engine page (accessible to tax center managers)
  if (view === 'risk_engine') {
    if (['tax_center_manager'].includes(role)) {
      return <RiskEngineDashboard />;
    }
  }

  // Standalone risk analysis page (accessible to planning team via sidebar)
  if (view === 'risk_analysis' && role === 'planning_team') {
    return <RiskAnalysisDashboard />;
  }

  if (role === 'planning_team')    return <PlanningDashboard view={view} />;
  if (role === 'audit_director')   return <DirectorDashboard view={view} />;
  if (role === 'regional_director') return <RegionalDashboard view={view} />;
  if (role === 'senior_management') return <SeniorDashboard view={view} />;
  if (role === 'tax_center_manager') {
    if (view === 'cases') return <CaseManagement />;
    return <TaxCenterDashboard view={view} />;
  }
  if (role === 'team_leader') {
    if (view === 'cases') return <TeamLeaderCases />;
    return <TeamLeaderDashboard />;
  }
  if (role === 'auditor') {
    if (view === 'cases') return <AuditorDashboard view={view} />;
    return <AuditorDashboard view={view} />;
  }
  if (role === 'committee' || role === 'committee_chair') {
    if (view === 'cases')       return <CommitteeCases />;
    if (view === 'research')    return <ResearchWorkspace />;
    if (view === 'auditors' && role === 'committee_chair') return <TeamFormation />;
    if (view === 'sessions')    return <SessionManager />;
    if (view === 'audit-trail') return <AuditTrail />;
    return <CommitteeDashboard />;
  }

  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-500">Role not recognized: {role}</p>
    </div>
  );
}

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const { ready } = useApp();
  const [view, setView] = useState('dashboard');

  if (authLoading || !ready) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner size={32} />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading MOR Audit Planning System…</p>
        </div>
      </div>
    );
  }

  if (!user) return <Login />;

  const pageInfo =
    PAGE_TITLES[user.role]?.[view] ||
    PAGE_TITLES[user.role]?.['dashboard'] ||
    { title: 'Dashboard', subtitle: '' };

  return (
    <WorkflowProvider>
      <Layout
        activeView={view}
        onNavigate={(v) => setView(v)}
        title={pageInfo.title}
        subtitle={pageInfo.subtitle}
      >
        <RoleRouter user={user} view={view} />
      </Layout>
    </WorkflowProvider>
  );
}
