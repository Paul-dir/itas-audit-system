import { useState, useEffect } from 'react';
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
import {
  TeamLeaderDashboard as JaTeamLeaderDashboard,
  TeamLeaderCases as JaTeamLeaderCases,
  WorkflowProvider,
} from './features/teamleader/index.js';
import JaAuditorWorkspace from './features/ja/pages/AuditorWorkspace.jsx';
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

const JA_PHASE_TITLES = {
  'ja-phase-planning':   { title: 'Planning & Entry Conference',    subtitle: 'Joint audit scope, team authorization & preliminary audit plan review' },
  'ja-phase-fieldwork':  { title: 'Field Investigation Oversight', subtitle: 'Inter-agency customs data matching, CAAT scripts & fieldwork progress' },
  'ja-phase-findings':   { title: 'Customs & Tax Reconciliation',  subtitle: 'Triangulation of import/export customs clearance vs tax declarations' },
  'ja-phase-response':   { title: 'Exit Conference & Response',    subtitle: 'Formal taxpayer hearings, bipartite minutes & 30-day response review' },
  'ja-phase-conclusion': { title: 'Statutory Joint Assessment',    subtitle: 'Combined tax liability notice, penalty calculation & sign-off' },
  execution:             { title: 'Joint Execution Workspace',     subtitle: '10-Step statutory joint audit execution workflow' },
  workspace:             { title: 'Joint Audit Workspace',          subtitle: '10-step statutory audit execution workflow' },
  'ja-aud-viability':    { title: 'Viability Assessment',           subtitle: 'Pre-audit viability check and risk profile' },
  'ja-aud-fieldwork':    { title: 'On-Site Inspection',             subtitle: 'Field investigation, questionnaires & interviews' },
  'ja-aud-customs':      { title: 'Customs Discrepancy Matching',   subtitle: 'ASYCUDA import/export data matching vs tax filings' },
  'ja-aud-findings':     { title: 'Findings & Working Papers',      subtitle: 'Audit observations, adjustments and supporting evidence' },
  'ja-aud-report':       { title: 'Joint Audit Report',             subtitle: 'Draft and final joint audit assessment report' },
};

const COMP_PHASE_TITLES = {
  'comp-phase-planning':   { title: 'Comprehensive Audit Planning', subtitle: 'Multi-year multi-tax audit plan & materiality scope' },
  'comp-phase-fieldwork':  { title: 'Books & Records Examination',  subtitle: 'Comprehensive on-site books and accounting records audit' },
  'comp-phase-findings':   { title: 'Comprehensive Audit Findings', subtitle: 'Draft assessment across VAT, income tax and withholding' },
  'comp-phase-response':   { title: 'Taxpayer Objection Review',   subtitle: 'Taxpayer response evaluation and rebuttal hearing' },
  'comp-phase-conclusion': { title: 'Final Assessment & Sign-Off', subtitle: 'Statutory assessment notice and case closure' },
};

const DESK_PHASE_TITLES = {
  'desk-phase-screening':  { title: 'Return Cross-Matching',       subtitle: 'Automated return discrepancy screening & third-party data match' },
  'desk-phase-inquiry':    { title: 'Clarification Requests',      subtitle: 'Statutory 15-day information query notices and replies' },
  'desk-phase-findings':   { title: 'Desk Adjustment Findings',    subtitle: 'Disallowed deductions and mathematical error corrections' },
  'desk-phase-conclusion': { title: 'Summary Assessment Order',    subtitle: 'Automated summary tax assessment and closure' },
};

const ISSUE_PHASE_TITLES = {
  'issue-phase-scope':       { title: 'Single Issue Scoping',          subtitle: 'Targeted verification of specific flagged transactions or refunds' },
  'issue-phase-verification':{ title: 'Voucher & Invoice Verification',subtitle: 'Direct supplier/customer verification and banking trails' },
  'issue-phase-findings':    { title: 'Issue Determination',          subtitle: 'Tax adjustment determination on targeted items' },
  'issue-phase-conclusion':  { title: 'Targeted Assessment Notice',   subtitle: 'Issue audit closure and assessment notice generation' },
};

const ALL_AUDIT_PHASE_TITLES = {
  ...TP_PHASE_TITLES,
  ...JA_PHASE_TITLES,
  ...COMP_PHASE_TITLES,
  ...DESK_PHASE_TITLES,
  ...ISSUE_PHASE_TITLES,
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
    ...ALL_AUDIT_PHASE_TITLES,
  },
  auditor: {
    dashboard:          { title: 'Auditor Dashboard',            subtitle: 'Your active audit cases' },
    cases:              { title: 'My Cases',                      subtitle: 'Cases assigned to you'   },
    ...ALL_AUDIT_PHASE_TITLES,
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
    ...ALL_AUDIT_PHASE_TITLES,
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
    ...ALL_AUDIT_PHASE_TITLES,
  },
  committee_chair: {
    dashboard:   { title: 'Joint Committee Chair Dashboard', subtitle: 'Executive Control Center & Team Formation' },
    cases:       { title: 'Committee Cases',          subtitle: 'Manage and review all cases' },
    research:    { title: 'Research Workspace',        subtitle: 'Collaborative analysis & research notes' },
    auditors:    { title: 'Team Formation',            subtitle: 'Select auditors and team leaders for audit cases' },
    sessions:    { title: 'Session Management',        subtitle: 'Create and manage committee sessions' },
    'audit-trail':{ title: 'Audit Trail',              subtitle: 'Immutable compliance & activity log' },
    reviews:     { title: 'Pending Reviews',          subtitle: 'Cases awaiting your committee review'      },
    'assign-cases': { title: 'Assign Cases to Team Leaders', subtitle: 'Distribute cases from committee to team leaders' },
    deliberations:  { title: 'Committee Deliberations', subtitle: 'Formal session records and statutory voting resolutions' },
    ...ALL_AUDIT_PHASE_TITLES,
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

function RoleRouter({ user, view, onNavigate }) {
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

  if (role === 'planning_team')    return <PlanningDashboard view={view} onNavigate={onNavigate} />;
  if (role === 'audit_director')   return <DirectorDashboard view={view} onNavigate={onNavigate} />;
  if (role === 'regional_director') return <RegionalDashboard view={view} onNavigate={onNavigate} />;
  if (role === 'senior_management') return <SeniorDashboard view={view} onNavigate={onNavigate} />;
  if (role === 'tax_center_manager') {
    if (view === 'cases') return <CaseManagement onNavigate={onNavigate} />;
    return <TaxCenterDashboard view={view} onNavigate={onNavigate} />;
  }
  if (role === 'team_leader') {
    const isJoint = (user?.auditType || '').toUpperCase().includes('JOINT') ||
                    (user?.username || '').toLowerCase().includes('ja') ||
                    (user?.username || '').toLowerCase().includes('joint');
    if (isJoint) {
      const isExecutionOrPhase = view === 'cases' || view === 'execution' || view.startsWith('ja-phase-');
      return (
        <WorkflowProvider>
          {isExecutionOrPhase ? (
            <JaTeamLeaderCases view={view} onNavigate={onNavigate} />
          ) : (
            <JaTeamLeaderDashboard onNavigate={onNavigate} />
          )}
        </WorkflowProvider>
      );
    }
    return <TeamLeaderDashboard view={view} onNavigate={onNavigate} />;
  }
  if (role === 'auditor') {
    return (
      <WorkflowProvider>
        <AuditorDashboard view={view} onNavigate={onNavigate} />
      </WorkflowProvider>
    );
  }
  if (role === 'committee' || role === 'committee_member' || role === 'committee_chair') {
    const isTp = (user?.auditType || '').toUpperCase().includes('TP') ||
                 (user?.auditType || '').toUpperCase().includes('TRANSFER') ||
                 (user?.name || '').toLowerCase().includes('tp');

    if (isTp) {
      if (view === 'assign-cases') return <CommitteeCaseAssignment />;
      return <CommitteeDashboard view={view} />;
    }

    // Joint Audit Committee (JAC)
    const isChair = role === 'committee_chair';
    return (
      <CommitteeProvider>
        {view === 'cases' && <JaCommitteeCases />}
        {view === 'research' && <JaResearchWorkspace />}
        {view === 'auditors' && (isChair ? <JaAuditorNomination /> : <JaCommitteeDashboard />)}
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

  // Reset active view whenever user switches or logs in
  useEffect(() => {
    setView('dashboard');
  }, [user?.id, user?.username, user?.role, user?.auditType]);

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
      <RoleRouter user={user} view={view} onNavigate={(v) => setView(v)} />
    </Layout>
  );
}
