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
import CommitteeDashboard from './features/ap/pages/committee/CommitteeDashboard.jsx';
import CommitteeCaseAssignment from './features/ap/pages/committee/CommitteeCaseAssignment.jsx';
import RiskAnalysisDashboard from './features/ap/pages/planning/RiskAnalysisDashboard.jsx';
import RiskEngineDashboard from './features/ap/pages/riskengine/RiskEngineDashboard.jsx';
import AuditRequesterDashboard from './features/ap/pages/requester/AuditRequesterDashboard.jsx';
import TaxpayerPortalDashboard from './features/portal/pages/TaxpayerPortalDashboard.jsx';
import {
  CommitteeDashboard as JaCommitteeDashboard,
  CommitteeCases as JaCommitteeCases,
  CaseDetail as JaCaseDetail,
  ResearchWorkspace as JaResearchWorkspace,
  AuditorNomination as JaAuditorNomination,
  SessionManager as JaSessionManager,
  AuditTrail as JaAuditTrail,
  CommitteeProvider
} from './features/ja/index.js';
import { Spinner } from './components/ui/index.jsx';

const TP_PHASE_TITLES = {
  'phase-1':          { title: 'Risk Assessment',               subtitle: 'Detailed TP risk scoring and indicators' },
  'phase-2':          { title: 'Working Hypothesis',            subtitle: 'Formulate audit scope and transfer pricing risk hypothesis' },
  'phase-3':          { title: 'Planning & Meeting',            subtitle: 'Entry conference schedule and initial document request' },
  'phase-4':          { title: 'Field Work',                    subtitle: 'Fact statement verification & document gathering' },
  'phase-5':          { title: 'Economic Analysis',             subtitle: 'Interquartile range (IQR) benchmarking & FAR analysis' },
  'phase-6':          { title: 'TP Report',                     subtitle: 'Draft audit report and multi-level approval chain' },
  'phase-assessment': { title: 'Assessment',                    subtitle: 'Arm’s length tax liability and penalty calculations' },
  'phase-7':          { title: 'Notice & Objection',            subtitle: 'Assessment notice generation and taxpayer objection window' },
  'phase-8':          { title: 'Audit Closure',                 subtitle: 'Final case sign-off and audit file archiving' },
};

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
    dashboard: { title: 'Team Leader Dashboard', subtitle: 'Assign cases and supervise audit team' },
    cases:     { title: 'Assigned Cases',         subtitle: 'Cases under your supervisory team' },
    'tp-tasks': { title: 'TP Workflow Tasks',     subtitle: 'Review gates and pending supervisory actions' },
    ...TP_PHASE_TITLES,
  },
  auditor: {
    dashboard:          { title: 'Auditor Dashboard',            subtitle: 'Your active audit cases' },
    cases:              { title: 'My Cases',                      subtitle: 'Cases assigned to you'   },
    ...TP_PHASE_TITLES,
  },
  committee: {
    dashboard:   { title: 'Committee Dashboard',      subtitle: 'Review and approve audit committee matters' },
    cases:       { title: 'Committee Cases',          subtitle: 'Manage and review all cases' },
    research:    { title: 'Research Workspace',        subtitle: 'Collaborative analysis & research notes' },
    sessions:    { title: 'Session Management',        subtitle: 'Create and manage committee sessions' },
    'audit-trail':{ title: 'Audit Trail',              subtitle: 'Immutable compliance & activity log' },
    reviews:     { title: 'Pending Reviews',          subtitle: 'Cases awaiting your committee review'      },
    'assign-cases': { title: 'Assign Cases to Team Leaders', subtitle: 'Distribute cases from committee to team leaders' },
    deliberations:  { title: 'Committee Deliberations', subtitle: 'Formal session records and statutory voting resolutions' },
    ...TP_PHASE_TITLES,
  },
  committee_member: {
    dashboard:   { title: 'Committee Dashboard',      subtitle: 'Review and approve audit committee matters' },
    cases:       { title: 'Committee Cases',          subtitle: 'Manage and review all cases' },
    research:    { title: 'Research Workspace',        subtitle: 'Collaborative analysis & research notes' },
    sessions:    { title: 'Session Management',        subtitle: 'Create and manage committee sessions' },
    'audit-trail':{ title: 'Audit Trail',              subtitle: 'Immutable compliance & activity log' },
    reviews:     { title: 'Pending Reviews',          subtitle: 'Cases awaiting your committee review'      },
    'assign-cases': { title: 'Assign Cases to Team Leaders', subtitle: 'Distribute cases from committee to team leaders' },
    deliberations:  { title: 'Committee Deliberations', subtitle: 'Formal session records and statutory voting resolutions' },
    ...TP_PHASE_TITLES,
  },
  committee_chair: {
    dashboard:   { title: 'Committee Dashboard',      subtitle: 'Executive Control Center' },
    cases:       { title: 'Committee Cases',          subtitle: 'Manage and review all cases' },
    research:    { title: 'Research Workspace',        subtitle: 'Collaborative analysis & research notes' },
    auditors:    { title: 'Team Formation',            subtitle: 'Select auditors and team leaders for audit cases' },
    sessions:    { title: 'Session Management',        subtitle: 'Create and manage committee sessions' },
    'audit-trail':{ title: 'Audit Trail',              subtitle: 'Immutable compliance & activity log' },
    reviews:     { title: 'Pending Reviews',          subtitle: 'Cases awaiting your committee review'      },
    'assign-cases': { title: 'Assign Cases to Team Leaders', subtitle: 'Distribute cases from committee to team leaders' },
    deliberations:  { title: 'Committee Deliberations', subtitle: 'Formal session records and statutory voting resolutions' },
    ...TP_PHASE_TITLES,
  },
  senior_management: {
    dashboard: { title: 'Senior Management',  subtitle: 'Final approval of national audit plans' },
    approval:  { title: 'Plan Approval',      subtitle: 'Plans awaiting senior management approval' },
  },
  audit_requester: {
    dashboard: { title: 'Directorate Referral Dashboard', subtitle: 'Submit & track statutory audit case referrals' },
    referrals: { title: 'My Referrals & Flags',            subtitle: 'Cases flagged for tax clearance, closure & fraud audit' },
    new_referral: { title: 'Submit Audit Referral',       subtitle: 'Flag taxpayer for desk, comprehensive or TP audit' },
  },
  taxpayer: {
    dashboard: { title: 'Taxpayer Compliance Portal', subtitle: 'View audit cases, statutory notices, and upload requested documents' }
  }
};

function RoleRouter({ user, view }) {
  const role = user.role;

  // Taxpayer Portal route or role
  if (window.location.pathname.startsWith('/portal') || role === 'taxpayer' || role === 'TAXPAYER') {
    return <TaxpayerPortalDashboard />;
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
  if (role === 'team_leader')      return <TeamLeaderDashboard view={view} />;
  if (role === 'auditor')          return <AuditorDashboard view={view} />;
  if (role === 'committee' || role === 'committee_member' || role === 'committee_chair') {
    const isTp = (user?.auditType || '').toUpperCase().includes('TP') ||
                 (user?.auditType || '').toUpperCase().includes('TRANSFER') ||
                 (user?.name || '').toLowerCase().includes('tp');

    if (isTp && (view.startsWith('phase-') || view === 'deliberations' || view === 'assign-cases')) {
      if (view === 'assign-cases') return <CommitteeCaseAssignment />;
      return <CommitteeDashboard view={view} />;
    }

    // Joint Audit Committee (JAC)
    return (
      <CommitteeProvider>
        {view === 'cases' && <JaCommitteeCases />}
        {view === 'research' && <JaResearchWorkspace />}
        {view === 'auditors' && <JaAuditorNomination />}
        {view === 'sessions' && <JaSessionManager />}
        {view === 'audit-trail' && <JaAuditTrail />}
        {(!['cases', 'research', 'auditors', 'sessions', 'audit-trail'].includes(view)) && (
          <JaCommitteeDashboard />
        )}
      </CommitteeProvider>
    );
  }
  if (role === 'audit_requester')  return <AuditRequesterDashboard view={view} />;

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

  // Direct URL prefix check for /portal
  if (window.location.pathname.startsWith('/portal')) {
    return <TaxpayerPortalDashboard />;
  }

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
