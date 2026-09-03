import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext.jsx';
import { Card, StatCard, Button, Badge, Alert, Tabs } from '../../../../components/ui/index.jsx';
import {
  Users, CheckCircle2, Clock, AlertTriangle, BarChart2,
  FileText, Scale, ShieldAlert, Layers3, RefreshCw
} from 'lucide-react';
import TpAuditWorkspace from '../../../tp/pages/TpAuditWorkspace.jsx';
import TpWorkflowTaskPanel from '../../../tp/components/TpWorkflowTaskPanel.jsx';

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
  const [tpWorkspaceCase, setTpWorkspaceCase] = useState(null);
  const [tpWorkspacePhase, setTpWorkspacePhase] = useState(null);

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

  // If workspace is open, render fullscreen
  if (tpWorkspaceCase && tpWorkspacePhase) {
    return (
      <TpAuditWorkspace
        caseData={tpWorkspaceCase}
        user={{ ...user, role: 'process_owner' }}
        initialPhase={tpWorkspacePhase}
        onClose={() => { setTpWorkspaceCase(null); setTpWorkspacePhase(null); }}
        onRefresh={() => { fetchCases(); setTpWorkspaceCase(null); setTpWorkspacePhase(null); }}
      />
    );
  }

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

  const tabs = [
    { id: 'tasks',    label: '⚡ Action Required',    count: pendingMyAction },
    { id: 'cases',    label: 'All TP Cases',           count: total },
    { id: 'reports',  label: 'Management Reports',     count: 0 },
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <span>TP Process Owner — Committee Dashboard</span>
            <Badge color="purple">Process Owner</Badge>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isTP ? 'Transfer Pricing Audit Review Committee' : 'Joint Audit Committee'}
            {user?.taxCenter && ` • Tax Center: ${user.taxCenter}`}
          </p>
        </div>
        <Button size="sm" variant="secondary" icon={RefreshCw} onClick={fetchCases} disabled={loading}>
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total TP Cases"     value={total}              icon={Layers3}      color="purple" sub="Under committee" />
        <StatCard label="Pending My Action"  value={pendingMyAction}    icon={AlertTriangle} color="amber"  sub="Blocked on you" />
        <StatCard label="In Execution"       value={inExecution}        icon={Clock}         color="blue"   sub="Auditors working" />
        <StatCard label="Completed"          value={completed}          icon={CheckCircle2}  color="green"  sub="Cases closed" />
      </div>

      {/* Process Owner Responsibilities Banner */}
      <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800">
        <p className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider mb-2">
          Process Owner Workflow Gates — Your Approvals Unblock These Steps:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs text-purple-700 dark:text-purple-400">
          {[
            { icon: <BarChart2 className="w-3 h-3" />, label: '① Hypothesis Review' },
            { icon: <FileText  className="w-3 h-3" />, label: '② Plan Approval' },
            { icon: <ShieldAlert className="w-3 h-3"/>, label: '③ TP Report Review' },
            { icon: <Users     className="w-3 h-3" />, label: '④ Exit Conference Auth' },
            { icon: <Scale     className="w-3 h-3" />, label: '⑤ Notice Authorization' },
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
              The items below are routed to YOUR dashboard because they CANNOT proceed without your
              decision as Process Owner / Authorized Official. Each item is a statutory control point.
              Delays here directly delay the audit and may cause statutory deadline breaches.
            </Alert>
            <TpWorkflowTaskPanel
              role="process_owner"
              user={user}
              onOpenWorkspace={(caseData, targetPhase) => {
                setTpWorkspacePhase(targetPhase);
                setTpWorkspaceCase(caseData);
              }}
            />
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
                              variant="primary"
                              icon={Layers3}
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                              onClick={() => {
                                const phase = c.tpCurrentPhase || 'DETAILED_RISK_ASSESSMENT';
                                setTpWorkspacePhase(phase);
                                setTpWorkspaceCase(c);
                              }}
                            >
                              {needsAction ? 'Action Now' : 'Open'}
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
    </div>
  );
}
