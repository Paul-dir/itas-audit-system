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
import TeamLeaderDashboard from './features/ap/pages/teamleader/TeamLeaderDashboard.jsx';
import AuditorDashboard from './features/ap/pages/auditor/AuditorDashboard.jsx';
import RiskAnalysisDashboard from './features/ap/pages/planning/RiskAnalysisDashboard.jsx';
import RiskEngineDashboard from './features/ap/pages/riskengine/RiskEngineDashboard.jsx';
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
    dashboard: { title: 'Team Leader Dashboard', subtitle: 'Assign cases to your audit team' },
    cases:     { title: 'Assigned Cases',         subtitle: 'Cases under your team'           },
  },
  auditor: {
    dashboard: { title: 'Auditor Dashboard', subtitle: 'Your active audit cases' },
    cases:     { title: 'My Cases',           subtitle: 'Cases assigned to you'   },
  },
  senior_management: {
    dashboard: { title: 'Senior Management',  subtitle: 'Final approval of national audit plans' },
    approval:  { title: 'Plan Approval',      subtitle: 'Plans awaiting senior management approval' },
  },
};

function RoleRouter({ user, view }) {
  const role = user.role;

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
  if (role === 'team_leader')      return <TeamLeaderDashboard view={view} />;
  if (role === 'auditor')          return <AuditorDashboard view={view} />;

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
    <Layout
      activeView={view}
      onNavigate={(v) => setView(v)}
      title={pageInfo.title}
      subtitle={pageInfo.subtitle}
    >
      <RoleRouter user={user} view={view} />
    </Layout>
  );
}
