import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext.jsx';
import { Card, StatCard, Button, Badge, Alert, Tabs, Modal, Input, Textarea, Select } from '../../../../components/ui/index.jsx';
import {
  Users, CheckCircle2, Clock, AlertTriangle, BarChart2,
  FileText, Scale, ShieldAlert, Layers3, RefreshCw, Landmark, Send, Search, Check, ChevronRight
} from 'lucide-react';
import TpCommitteeApprovalModal from '../../../tp/components/TpCommitteeApprovalModal.jsx';
import TpWorkflowTaskPanel from '../../../tp/components/TpWorkflowTaskPanel.jsx';
import CaseAssignmentToTeamLeaders from '../../components/CaseAssignmentToTeamLeaders.jsx';
import TpAuditWorkspace from '../../../tp/pages/TpAuditWorkspace.jsx';

/**
 * CommitteeDashboard — TP Process Owner / Committee Dashboard
 *
 * This is the dedicated dashboard for the Transfer Pricing Process Owner /
 * Review Committee. It is NOT the same as the TeamLeaderDashboard.
 *
 * Roles served:
 *   - TP Process Owner (committee role with auditType = 'TRANSFER_PRICING')
 *   - Joint Audit Committee (committee role with auditType = 'JOINT_AUDIT')
 *
 * Key responsibilities of the Process Owner:
 *   1. Review working hypotheses before triggering Planning
 *   2. Approve audit plans before field work begins
 *   3. Review and approve draft TP reports (after TL review)
 *   4. Authorize exit conference scheduling
 *   5. Sign the assessment notice as authorized official
 *   6. Trigger fraud investigation if indicators found during review
 *   7. Generate and monitor management reports
 */
export default function CommitteeDashboard({ view }) {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('tasks');
  const [committeeReviewCase, setCommitteeReviewCase] = useState(null);

  const [tpWorkspaceCase, setTpWorkspaceCase] = useState(null);
  const [tpWorkspacePhase, setTpWorkspacePhase] = useState(null);

  const PHASE_MAP = {
    'phase-1': 'DETAILED_RISK_ASSESSMENT',
    'phase-2': 'WORKING_HYPOTHESIS',
    'phase-3': 'PLANNING',
    'phase-4': 'FIELD_WORK',
    'phase-5': 'ANALYSIS',
    'phase-6': 'REPORT',
    'phase-assessment': 'ASSESSMENT',
    'phase-7': 'NOTICE',
    'phase-8': 'COMPLETION'
  };

  useEffect(() => {
    if (view && PHASE_MAP[view]) {
      const nextPhase = PHASE_MAP[view];
      setTpWorkspacePhase(nextPhase);

      const tpCase = cases.find(c => (c.auditType || '').toUpperCase().includes('TP') || (c.auditType || '').toUpperCase().includes('TRANSFER')) || cases[0] || null;
      if (tpCase) {
        setTpWorkspaceCase(prev => (prev?.id === tpCase.id ? prev : tpCase));
      }
    } else if (view === 'deliberations') {
      setTpWorkspaceCase(null);
      setTpWorkspacePhase(null);
      setTab('deliberation');
    } else if (view === 'assign-cases') {
      setTpWorkspaceCase(null);
      setTpWorkspacePhase(null);
      setTab('assign');
    } else if (view === 'dashboard' || view === 'cases') {
      setTpWorkspaceCase(null);
      setTpWorkspacePhase(null);
    }
  }, [view, cases]);

  const isTP = (user?.auditType || '').toUpperCase().includes('TRANSFER');

  const fetchCases = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/v1/backoffice/ap/cases?committeeId=${user.id}`, {
        headers: { 'X-Actor-Id': user.id }
      });
      if (r.ok) {
        const res = await r.json();
        setCases(res.data || []);
      }
    } catch (e) { console.error('CommitteeDashboard fetchCases:', e); }
    finally { setLoading(false); }
  }, [user?.id]);

  useEffect(() => { fetchCases(); }, [fetchCases]);

  const total        = cases.length;
  const pendingMyAction = cases.filter(c => [
    'SUBMITTED_FOR_COMMITTEE',
    'SUBMITTED_FOR_PO_REVIEW',
    'PENDING_PO_NOTICE_AUTHORIZATION',
    'EXIT_CONFERENCE_PENDING_PO',
    'AWAITING_COMMITTEE_DECISION'
  ].includes(c.status)).length;
  const inExecution  = cases.filter(c => c.status === 'IN_PROGRESS').length;
  const completed    = cases.filter(c => ['COMPLETED', 'CLOSED'].includes(c.status)).length;

  const [deliberationModal, setDeliberationModal] = useState(false);
  const [selectedDelibView, setSelectedDelibView] = useState(null);
  const [delibSuccess, setDelibSuccess] = useState('');
  const [deliberations, setDeliberations] = useState([
    {
      id: 'DELIB-2026-001',
      sessionDate: '2026-09-02',
      sessionTitle: 'Q3 Transfer Pricing Statutory Review — Cross-Border Management Fees',
      caseNumber: '2027-d271bc17-AA-TC-AA-01-0374',
      taxpayerName: 'Phoenix Transportation Ltd',
      agenda: 'Evaluation of management fee deductions and vessel charter agreements',
      quorum: ['Abebe Bikila (Chair)', 'Dr. Almaz Tekle (Senior Economist)', 'Yonas Haile (Legal Counsel)', 'Dawit Tadesse (LTO Rep)'],
      decision: 'APPROVED',
      proposedAdjustment: 24500000,
      decisionNotes: 'Quorum established. The committee unanimously approved the proposed transfer pricing audit scope focusing on disallowance of management fee deductions under Art. 79 of Tax Proclamation 979/2016.',
      resolutionNumber: 'TP-RES-2026/042'
    },
    {
      id: 'DELIB-2026-002',
      sessionDate: '2026-09-04',
      sessionTitle: 'Offshore Intangible Brand Royalty Assessment Hearing',
      caseNumber: '2027-d271bc17-AA-TC-AA-01-0375',
      taxpayerName: 'Alpha Finance Ltd',
      agenda: 'Interquartile range analysis on trademark royalties paid to Swiss affiliate',
      quorum: ['Abebe Bikila (Chair)', 'Dr. Almaz Tekle (Senior Economist)', 'Yonas Haile (Legal Counsel)'],
      decision: 'APPROVED_WITH_CONDITIONS',
      proposedAdjustment: 18200000,
      decisionNotes: 'Approved for full audit. Committee directs the field audit team to request local file DEMPE evidence and intercompany agreements via IDR-01 within 10 days of entry conference.',
      resolutionNumber: 'TP-RES-2026/043'
    }
  ]);

  const [newDelib, setNewDelib] = useState({
    sessionTitle: '',
    caseId: '',
    agenda: '',
    decision: 'APPROVED',
    proposedAdjustment: '',
    statutoryBasis: 'Directive No. 43/2015 & Art. 79 of Proclamation 979/2016',
    decisionNotes: '',
    attendees: ['Committee Chair (Presiding)', 'Senior TP Economist', 'Legal & Treaty Counsel']
  });

  const handleRecordDeliberation = () => {
    if (!newDelib.sessionTitle || !newDelib.decisionNotes) {
      alert('Please enter a session title and formal committee decision notes.');
      return;
    }

    const selectedCaseObj = cases.find(c => c.id === newDelib.caseId) || cases[0];
    const newRecord = {
      id: `DELIB-2026-00${deliberations.length + 1}`,
      sessionDate: new Date().toISOString().split('T')[0],
      sessionTitle: newDelib.sessionTitle,
      caseNumber: selectedCaseObj?.caseNumber || 'CASE-TP-2026',
      taxpayerName: selectedCaseObj?.taxpayerName || 'Selected Taxpayer',
      agenda: newDelib.agenda || 'Statutory Transfer Pricing Review',
      quorum: newDelib.attendees,
      decision: newDelib.decision,
      proposedAdjustment: parseFloat(newDelib.proposedAdjustment) || 0,
      decisionNotes: newDelib.decisionNotes,
      resolutionNumber: `TP-RES-2026/0${44 + deliberations.length}`
    };

    setDeliberations([newRecord, ...deliberations]);
    setDelibSuccess(`✅ Formal Resolution ${newRecord.resolutionNumber} successfully recorded in the statutory register!`);
    setDeliberationModal(false);
    setNewDelib({
      sessionTitle: '',
      caseId: '',
      agenda: '',
      decision: 'APPROVED',
      proposedAdjustment: '',
      statutoryBasis: 'Directive No. 43/2015 & Art. 79 of Proclamation 979/2016',
      decisionNotes: '',
      attendees: ['Committee Chair (Presiding)', 'Senior TP Economist', 'Legal & Treaty Counsel']
    });
  };

  const tabs = [
    { id: 'tasks',        label: '⚡ Action Required',                  count: pendingMyAction },
    { id: 'assign',       label: '📋 Assign Cases to TLs',              count: cases.filter(c => !c.assignedTeamLeaderId || c.status === 'PENDING_ASSIGNMENT').length },
    { id: 'deliberation', label: '🏛️ Committee Deliberations & Votes', count: deliberations.length },
    { id: 'cases',        label: 'All TP Cases',                        count: total },
    { id: 'reports',      label: 'Management Reports',                  count: 6 },
  ];

  const riskColors = { CRITICAL: 'red', HIGH: 'orange', MEDIUM: 'yellow', LOW: 'blue' };
  const phaseLabels = {
    DETAILED_RISK_ASSESSMENT: 'Risk Assessment',
    WORKING_HYPOTHESIS:  'Working Hypothesis',
    PLANNING:            'Planning',
    PLANNING_MEETING:    'Planning Meeting',
    FIELD_WORK:          'Field Work',
    ANALYSIS:            'Economic Analysis',
    REPORT:              'TP Report',
    ASSESSMENT:          'Assessment',
    NOTICE:              'Notice',
    COMPLETION:          'Closed',
  };

  if (tpWorkspaceCase) {
    return (
      <TpAuditWorkspace
        caseData={tpWorkspaceCase}
        user={user}
        initialPhase={tpWorkspacePhase || 'WORKING_HYPOTHESIS'}
        onClose={() => { setTpWorkspaceCase(null); setTpWorkspacePhase(null); }}
        onRefresh={() => {
          fetchCases();
          setTpWorkspaceCase(null);
          setTpWorkspacePhase(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <span>Transfer Pricing Audit Review Committee</span>
            <Badge color="purple">Committee Chair / Member</Badge>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isTP ? 'Federal & Regional Transfer Pricing Audit Committee' : 'Joint Audit Review Committee'}
            {user?.taxCenter && ` • Jurisdiction: ${user.taxCenter}`}
            {user?.username && ` • Actor: ${user.username}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const tpCase = cases.find(c => (c.auditType || '').toUpperCase().includes('TP') || (c.auditType || '').toUpperCase().includes('TRANSFER')) || cases[0] || null;
              if (tpCase) {
                setTpWorkspacePhase('WORKING_HYPOTHESIS');
                setTpWorkspaceCase(tpCase);
              }
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 shadow-xs transition cursor-pointer"
          >
            <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Process Owner / Committee Console</span>
          </button>
          <Button
            size="sm"
            variant="primary"
            icon={Landmark}
            onClick={() => setDeliberationModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Convene Committee Session
          </Button>
          <Button size="sm" variant="secondary" icon={RefreshCw} onClick={fetchCases} disabled={loading}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Committee Cases" value={total} icon={Layers3} color="purple" sub="Under committee jurisdiction" />
        <StatCard label="Pending Gate Approvals" value={pendingMyAction} icon={AlertTriangle} color="amber" sub="Action required to unblock" />
        <StatCard label="Active Deliberations" value={deliberations.length} icon={Landmark} color="blue" sub="Formal resolutions recorded" />
        <StatCard label="Completed / Closed" value={completed} icon={CheckCircle2} color="green" sub="Audit files finalized" />
      </div>

      {delibSuccess && (
        <Alert type="success" title="Committee Registry Notice">
          {delibSuccess}
        </Alert>
      )}

      {/* Process Owner Responsibilities Banner */}
      <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800">
        <p className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider mb-2">
          Statutory Committee Workflow Gates — Your Decisions Govern These Milestones:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs text-purple-700 dark:text-purple-400">
          {[
            { icon: <BarChart2 className="w-3 h-3" />, label: '① Scope & Hypothesis Review' },
            { icon: <FileText  className="w-3 h-3" />, label: '② Audit Plan & IDR Approval' },
            { icon: <ShieldAlert className="w-3 h-3"/>, label: '③ Benchmark IQR Review' },
            { icon: <Users     className="w-3 h-3" />, label: '④ Exit Conference Auth' },
            { icon: <Scale     className="w-3 h-3" />, label: '⑤ Statutory Assessment Sign-Off' },
          ].map((g, i) => (
            <div key={i} className="flex items-center gap-1 font-semibold">
              {g.icon} {g.label}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Tabs */}
      <Card padding={false}>
        <div className="px-6 pt-4 pb-0">
          <Tabs tabs={tabs} active={tab} onChange={setTab} />
        </div>

        {/* ── TP ACTION QUEUE TAB ───────────────────────────────────────────── */}
        {tab === 'tasks' && (
          <div className="p-6 space-y-4">
            <Alert type="warning" title="Process Owner — Workflow Gate Actions Required">
              The items below are routed to the Committee because they CANNOT proceed without formal
              statutory authorization. Each milestone represents a mandatory quality and legal checkpoint.
            </Alert>
            <TpWorkflowTaskPanel
              role="process_owner"
              user={user}
              onOpenWorkspace={(caseData) => {
                setCommitteeReviewCase(caseData);
              }}
            />
          </div>
        )}

        {/* ── ASSIGN CASES TO TEAM LEADERS TAB ─────────────────────────────────── */}
        {tab === 'assign' && (
          <div className="p-2">
            <CaseAssignmentToTeamLeaders
              committee={user?.username || 'tp-committee'}
              auditType="TRANSFER_PRICING"
              taxCenter={user?.taxCenter}
            />
          </div>
        )}

        {/* ── DELIBERATIONS & RESOLUTIONS TAB ─────────────────────────────────── */}
        {tab === 'deliberation' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-purple-600" />
                  <span>Statutory Committee Deliberations & Resolution Registry</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Official registry of formal Transfer Pricing Review Committee sessions, quorum confirmations, and statutory decisions
                </p>
              </div>
              <Button
                variant="primary"
                icon={Landmark}
                onClick={() => setDeliberationModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
              >
                Convene Deliberation Session
              </Button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-slate-700/60 border-b border-gray-200 dark:border-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-xs font-bold text-gray-600 dark:text-slate-300 uppercase">Resolution #</th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-600 dark:text-slate-300 uppercase">Date & Title</th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-600 dark:text-slate-300 uppercase">Case / Taxpayer</th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-600 dark:text-slate-300 uppercase">Quorum Members</th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-600 dark:text-slate-300 uppercase">Decision</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 dark:text-slate-300 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {deliberations.map(d => (
                    <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/40 transition">
                      <td className="px-4 py-3 text-xs font-mono font-bold text-purple-700 dark:text-purple-400">
                        {d.resolutionNumber}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900 dark:text-white text-xs">{d.sessionTitle}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{d.sessionDate}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800 dark:text-slate-200 text-xs">{d.taxpayerName}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{d.caseNumber}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {d.quorum.map((m, idx) => (
                            <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              {m.split('(')[0].trim()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          color={d.decision === 'APPROVED' ? 'green' : d.decision === 'APPROVED_WITH_CONDITIONS' ? 'blue' : 'amber'}
                          size="xs"
                        >
                          {d.decision.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="xs"
                          variant="secondary"
                          onClick={() => setSelectedDelibView(d)}
                        >
                          View Resolution
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ALL CASES TAB ────────────────────────────────────────────────── */}
        {tab === 'cases' && (
          <div className="overflow-x-auto">
            {cases.length === 0 ? (
              <div className="p-12 text-center">
                <Layers3 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No TP cases assigned to your committee yet.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                  <tr>
                    {['Case #', 'Taxpayer / TIN', 'Phase', 'Status', 'Risk', 'Action'].map((h, i) => (
                      <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-slate-200">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {cases.map(c => {
                    const statusDef = { label: c.status, color: 'gray' };
                    const needsAction = ['SUBMITTED_FOR_PO_REVIEW', 'SUBMITTED_FOR_COMMITTEE',
                      'PENDING_PO_NOTICE_AUTHORIZATION', 'EXIT_CONFERENCE_PENDING_PO',
                      'AWAITING_COMMITTEE_DECISION'].includes(c.status);

                    return (
                      <tr key={c.id} className={`hover:bg-blue-50 dark:hover:bg-slate-700/50 ${needsAction ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''}`}>
                        <td className="px-4 py-3 text-xs font-mono font-bold text-blue-700 dark:text-blue-400">{c.caseNumber}</td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{c.taxpayerName || c.taxpayerId}</p>
                          <p className="text-xs text-gray-500">{c.taxpayerId}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge color="blue" size="sm">{phaseLabels[c.tpCurrentPhase] || c.tpCurrentPhase || '—'}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {needsAction && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                            <Badge color={needsAction ? 'amber' : 'gray'} dot size="sm">{c.status}</Badge>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge color={riskColors[c.riskLevel] || 'gray'} dot size="sm">{c.riskLevel || '—'}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5">
                            <Button
                              size="sm"
                              variant="secondary"
                              icon={ClipboardList}
                              className="border-amber-600/40 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                              onClick={() => {
                                setTpWorkspacePhase('WORKING_HYPOTHESIS');
                                setTpWorkspaceCase(c);
                              }}
                            >
                              Working Hypothesis
                            </Button>
                            <Button
                              size="sm"
                              variant="primary"
                              icon={Landmark}
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                              onClick={() => {
                                setCommitteeReviewCase(c);
                              }}
                            >
                              {needsAction ? 'Deliberate & Authorize' : 'Review Dossier'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── MANAGEMENT REPORTS TAB ───────────────────────────────────────── */}
        {tab === 'reports' && (
          <div className="p-6 space-y-4">
            <Alert type="info" title="Management Reports — TP Audit Module">
              Generate statutory management reports as required by MoR reporting obligations.
            </Alert>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: 'Audit Yield Report',
                  desc: 'Aggregate TP audit assessments vs. plan targets. Principal, penalties, and interest by segment.',
                  icon: <BarChart2 className="w-6 h-6 text-blue-600" />,
                  badge: 'FR-04.7-39'
                },
                {
                  title: 'Productivity Report',
                  desc: 'Officer-level performance: cases completed, hours logged, average audit yield per auditor.',
                  icon: <Users className="w-6 h-6 text-purple-600" />,
                  badge: 'FR-04.7-40'
                },
                {
                  title: 'Assessment History',
                  desc: 'Assessments issued, reduced via review, appealed, confirmed at each stage.',
                  icon: <Scale className="w-6 h-6 text-amber-600" />,
                  badge: 'FR-04.7-41'
                },
                {
                  title: 'Cases Referred to Investigation',
                  desc: 'All TP cases where fraud referral was triggered. Status of each investigation.',
                  icon: <ShieldAlert className="w-6 h-6 text-rose-600" />,
                  badge: 'FR-04.7-35'
                },
                {
                  title: 'Taxpayer Audit History',
                  desc: 'Full audit action trail per taxpayer: dates, auditors assigned, status, outcomes.',
                  icon: <FileText className="w-6 h-6 text-teal-600" />,
                  badge: 'FR-04.7-42'
                },
                {
                  title: 'Audit Status Report',
                  desc: 'Current status of all TP audit cases by phase, tax center, and segment.',
                  icon: <Clock className="w-6 h-6 text-slate-600" />,
                  badge: 'FR-04.7-38'
                },
              ].map((r, i) => (
                <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {r.icon}
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{r.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{r.desc}</p>
                      </div>
                    </div>
                    <Badge color="slate" size="xs">{r.badge}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="xs" variant="secondary" icon={FileText}>Generate PDF</Button>
                    <Button size="xs" variant="secondary">Export CSV</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
      {/* ── CONVENE DELIBERATION SESSION MODAL ───────────────────────── */}
      {deliberationModal && (
        <Modal
          open={deliberationModal}
          onClose={() => setDeliberationModal(false)}
          title="🏛️ Convene Statutory Committee Deliberation Session"
          size="lg"
          footer={
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setDeliberationModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={Landmark}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleRecordDeliberation}
              >
                Record Statutory Resolution
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <Alert type="info">
              Formal committee sessions record statutory quorum, deliberations, and binding decisions under Directive No. 43/2015 and Proclamation 979/2016.
            </Alert>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Session Title <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g. Q3 Transfer Pricing Scope & Assessment Review"
                  value={newDelib.sessionTitle}
                  onChange={e => setNewDelib({ ...newDelib, sessionTitle: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Select Case Under Deliberation
                </label>
                <Select
                  value={newDelib.caseId}
                  onChange={e => setNewDelib({ ...newDelib, caseId: e.target.value })}
                >
                  <option value="">Select a case...</option>
                  {cases.slice(0, 30).map(c => (
                    <option key={c.id} value={c.id}>
                      {c.caseNumber} — {c.taxpayerName || c.taxpayerId}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                Agenda / Statutory Matter Examined
              </label>
              <Input
                placeholder="e.g. Cross-border management fee deductions & intercompany brand royalties"
                value={newDelib.agenda}
                onChange={e => setNewDelib({ ...newDelib, agenda: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Committee Decision / Vote
                </label>
                <Select
                  value={newDelib.decision}
                  onChange={e => setNewDelib({ ...newDelib, decision: e.target.value })}
                >
                  <option value="APPROVED">APPROVED (Authorise Full Audit / Notice)</option>
                  <option value="APPROVED_WITH_CONDITIONS">APPROVED WITH CONDITIONS (Require Additional IDR)</option>
                  <option value="DEFERRED">DEFERRED (Require Updated Comparable Study)</option>
                  <option value="DISMISSED">DISMISSED (Close TP Inquiry)</option>
                </Select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Proposed TP Adjustment (ETB)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 24500000"
                  value={newDelib.proposedAdjustment}
                  onChange={e => setNewDelib({ ...newDelib, proposedAdjustment: e.target.value })}
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="font-bold text-slate-800 dark:text-slate-200 mb-1.5">Confirmed Quorum Members Present:</p>
              <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> Committee Chair (Presiding)</span>
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> Senior TP Economist</span>
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> Tax Legal & Treaty Counsel</span>
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> Large Taxpayer Office (LTO) Delegate</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                Formal Committee Resolution Minutes & Rationale <span className="text-red-500">*</span>
              </label>
              <Textarea
                rows={3}
                placeholder="Enter detailed statutory findings, comparable benchmark evaluation, and directions to the field audit team..."
                value={newDelib.decisionNotes}
                onChange={e => setNewDelib({ ...newDelib, decisionNotes: e.target.value })}
              />
            </div>
          </div>
        </Modal>
      )}

      {/* ── VIEW FORMAL RESOLUTION EXTRACT MODAL ───────────────────────── */}
      {selectedDelibView && (
        <Modal
          open={!!selectedDelibView}
          onClose={() => setSelectedDelibView(null)}
          title={`📜 Official Committee Resolution: ${selectedDelibView.resolutionNumber}`}
          size="lg"
          footer={
            <div className="flex justify-between items-center w-full">
              <span className="text-xs text-slate-500 font-mono">Directive No. 43/2015 Compliance Stamp Verified</span>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => window.print()}>
                  Print Extract
                </Button>
                <Button size="sm" variant="primary" onClick={() => setSelectedDelibView(null)}>
                  Close
                </Button>
              </div>
            </div>
          }
        >
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-purple-700 dark:text-purple-400">Federal Democratic Republic of Ethiopia</p>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Ministry of Revenues • Transfer Pricing Review Committee</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">Statutory Decision & Resolution Registry Extract</p>
              </div>
              <div className="text-right font-mono">
                <Badge color="purple">{selectedDelibView.resolutionNumber}</Badge>
                <p className="text-[10px] text-slate-400 mt-1">{selectedDelibView.sessionDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-500 uppercase text-[10px] font-bold">Taxpayer / Enterprise</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{selectedDelibView.taxpayerName}</p>
                <p className="font-mono text-slate-400 text-[11px]">Case Number: {selectedDelibView.caseNumber}</p>
              </div>
              <div>
                <p className="text-slate-500 uppercase text-[10px] font-bold">Official Decision</p>
                <Badge
                  color={selectedDelibView.decision === 'APPROVED' ? 'green' : 'blue'}
                  size="md"
                >
                  {selectedDelibView.decision.replace(/_/g, ' ')}
                </Badge>
                {selectedDelibView.proposedAdjustment > 0 && (
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                    Proposed Adjustment: {selectedDelibView.proposedAdjustment.toLocaleString()} ETB
                  </p>
                )}
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">Quorum Attestation:</p>
              <div className="flex flex-wrap gap-2">
                {selectedDelibView.quorum.map((q, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-medium">
                    ✓ {q}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">Resolution Deliberation Record & Directives:</p>
              <p className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 leading-relaxed">
                {selectedDelibView.decisionNotes}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* Dedicated Committee Deliberation & Resolution Console Modal */}
      {committeeReviewCase && (
        <TpCommitteeApprovalModal
          caseData={committeeReviewCase}
          user={user}
          onClose={() => setCommitteeReviewCase(null)}
          onRefresh={fetchCases}
          onResolutionAdopted={(newDelib) => {
            setDeliberations(prev => [newDelib, ...prev]);
          }}
        />
      )}
    </div>
  );
}
