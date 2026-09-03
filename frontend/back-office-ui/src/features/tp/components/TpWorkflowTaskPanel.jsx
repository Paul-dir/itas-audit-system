import { useState, useEffect, useCallback } from 'react';
import {
  Clock, CheckCircle2, AlertTriangle, FileText, ShieldAlert, Send,
  ArrowRight, RefreshCw, Eye, AlertOctagon, Scale, Users, BarChart2, X
} from 'lucide-react';
import { Card, Button, Badge, Alert, Modal, Textarea } from '../../../components/ui/index.jsx';

const BASE_API = '/api/v1/backoffice/tp/cases';

/**
 * TpWorkflowTaskPanel — The cross-dashboard TP workflow task inbox.
 *
 * This is the central component that makes the TP workflow actually work
 * across different dashboards. It shows ONLY the tasks that require THIS
 * role's action right now, fetched from the backend.
 *
 * Each role sees different tasks:
 *
 * AUDITOR:
 *   - Cases where IDR response was received (need to acknowledge)
 *   - Cases where TL returned the report for revision
 *   - Cases where fact statement needs to be updated after taxpayer review
 *
 * TEAM_LEADER:
 *   - IDRs awaiting approval (Auditor submitted → TL must approve before it goes to taxpayer)
 *   - Draft audit reports submitted for TL review
 *   - Fact statements ready for TL sign-off
 *   - Exit conference schedules pending TL confirmation
 *
 * PROCESS_OWNER / COMMITTEE:
 *   - Reports approved by TL, now pending Process Owner statutory review
 *   - Planning meeting committee decision pending
 *   - Risk assessment referrals pending committee assessment
 *   - Working hypotheses pending committee review before planning trigger
 *
 * Props:
 *   role: 'auditor' | 'team_leader' | 'process_owner'
 *   user: auth user object
 *   onOpenWorkspace: (caseData, targetPhase) => void  — opens the workspace at right phase
 */
export default function TpWorkflowTaskPanel({ role, user, onOpenWorkspace }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionModal, setActionModal] = useState(null);
  const [actionComment, setActionComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // Fetch cases relevant to this user/role
      const param = role === 'auditor'
        ? `auditor=${user.id}`
        : role === 'team_leader'
          ? `teamLeader=${user.id}`
          : `committeeId=${user.id}`;

      const r = await fetch(`/api/v1/backoffice/ap/cases?${param}`, {
        headers: { 'X-Actor-Id': user.id }
      });

      if (!r.ok) return;
      const res = await r.json();
      const allCases = res.data || [];

      // Derive actionable tasks based on role and case/phase state
      const derived = [];
      for (const c of allCases) {
        if ((c.auditType || '').toUpperCase() !== 'TRANSFER_PRICING') continue;
        const phase = c.tpCurrentPhase || '';
        const caseStatus = c.status || '';

        if (role === 'team_leader') {
          // IDRs awaiting TL approval — fetch separately
          if (phase === 'FIELD_WORK' || phase === 'ANALYSIS') {
            derived.push({
              id: `${c.id}-idr-approval`,
              type: 'IDR_APPROVAL',
              caseId: c.id,
              caseNumber: c.caseNumber,
              taxpayerName: c.taxpayerName || c.taxpayerId,
              phase: 'FIELD_WORK',
              title: 'IDR Approval Required',
              description: `Auditor submitted an Information & Document Request for ${c.taxpayerName || c.taxpayerId}. Review and approve before it is issued to the taxpayer.`,
              urgency: 'HIGH',
              action: 'APPROVE_IDR',
              targetPhase: 'FIELD_WORK',
              caseData: c,
            });
          }

          // Draft report submitted for TL review
          if (phase === 'REPORT' && caseStatus === 'SUBMITTED_FOR_TL_REVIEW') {
            derived.push({
              id: `${c.id}-report-review`,
              type: 'REPORT_REVIEW',
              caseId: c.id,
              caseNumber: c.caseNumber,
              taxpayerName: c.taxpayerName || c.taxpayerId,
              phase: 'REPORT',
              title: 'Draft TP Report — TL Review Required',
              description: `Auditor submitted draft TP audit report for your technical review. You must review findings, comments, and recommend for Process Owner review or return to auditor.`,
              urgency: 'CRITICAL',
              action: 'REVIEW_REPORT',
              targetPhase: 'REPORT',
              caseData: c,
            });
          }

          // Fact statement pending TL sign-off
          if (phase === 'FIELD_WORK' && caseStatus === 'FACT_STATEMENT_PENDING_TL') {
            derived.push({
              id: `${c.id}-fact-signoff`,
              type: 'FACT_STATEMENT',
              caseId: c.id,
              caseNumber: c.caseNumber,
              taxpayerName: c.taxpayerName || c.taxpayerId,
              phase: 'FIELD_WORK',
              title: 'Fact Statement — Team Leader Sign-Off',
              description: `Fact statement prepared by auditor is ready for your quality review before being sent to taxpayer for acknowledgment.`,
              urgency: 'MEDIUM',
              action: 'SIGNOFF_FACT',
              targetPhase: 'FIELD_WORK',
              caseData: c,
            });
          }

          // Planning meeting committee decision needed
          if (phase === 'PLANNING_MEETING' && caseStatus === 'AWAITING_COMMITTEE_DECISION') {
            derived.push({
              id: `${c.id}-committee-decision`,
              type: 'COMMITTEE_DECISION',
              caseId: c.id,
              caseNumber: c.caseNumber,
              taxpayerName: c.taxpayerName || c.taxpayerId,
              phase: 'PLANNING',
              title: 'Planning Meeting — Committee Decision',
              description: `Committee meeting has been scheduled. Record your decision to proceed to execution or request further planning.`,
              urgency: 'HIGH',
              action: 'RECORD_DECISION',
              targetPhase: 'PLANNING',
              caseData: c,
            });
          }
        }

        if (role === 'process_owner') {
          // Report approved by TL — now needs Process Owner review
          if (phase === 'REPORT' && caseStatus === 'SUBMITTED_FOR_PO_REVIEW') {
            derived.push({
              id: `${c.id}-po-report-review`,
              type: 'PO_REPORT_REVIEW',
              caseId: c.id,
              caseNumber: c.caseNumber,
              taxpayerName: c.taxpayerName || c.taxpayerId,
              phase: 'REPORT',
              title: 'TP Report — Process Owner Statutory Review',
              description: `Team Leader approved the draft TP audit report. You must conduct statutory compliance review under Proclamation 979/2016 and Dir. 43/2015 before final approval.`,
              urgency: 'CRITICAL',
              action: 'PO_REVIEW_REPORT',
              targetPhase: 'REPORT',
              caseData: c,
            });
          }

          // Working hypothesis — committee must approve before triggering planning
          if (phase === 'WORKING_HYPOTHESIS' && caseStatus === 'SUBMITTED_FOR_COMMITTEE') {
            derived.push({
              id: `${c.id}-hyp-review`,
              type: 'HYPOTHESIS_REVIEW',
              caseId: c.id,
              caseNumber: c.caseNumber,
              taxpayerName: c.taxpayerName || c.taxpayerId,
              phase: 'WORKING_HYPOTHESIS',
              title: 'Working Hypothesis — Committee Approval Required',
              description: `TP auditor submitted the initial working hypothesis and revenue-at-risk estimate. Review the business case and decide whether to trigger Audit Planning.`,
              urgency: 'HIGH',
              action: 'REVIEW_HYPOTHESIS',
              targetPhase: 'WORKING_HYPOTHESIS',
              caseData: c,
            });
          }

          // Exit conference schedule — PO must approve/confirm
          if (phase === 'REPORT' && caseStatus === 'EXIT_CONFERENCE_PENDING_PO') {
            derived.push({
              id: `${c.id}-exit-conf`,
              type: 'EXIT_CONFERENCE_APPROVAL',
              caseId: c.id,
              caseNumber: c.caseNumber,
              taxpayerName: c.taxpayerName || c.taxpayerId,
              phase: 'REPORT',
              title: 'Exit Conference — Process Owner Sign-Off',
              description: `Auditor proposed exit conference date/venue. Confirm this before the official notice letter is generated and sent to the taxpayer.`,
              urgency: 'MEDIUM',
              action: 'CONFIRM_EXIT_CONFERENCE',
              targetPhase: 'REPORT',
              caseData: c,
            });
          }

          // Notice ready — PO must authorize dispatch
          if (phase === 'NOTICE' && caseStatus === 'PENDING_PO_NOTICE_AUTHORIZATION') {
            derived.push({
              id: `${c.id}-notice-auth`,
              type: 'NOTICE_AUTHORIZATION',
              caseId: c.id,
              caseNumber: c.caseNumber,
              taxpayerName: c.taxpayerName || c.taxpayerId,
              phase: 'NOTICE',
              title: 'Assessment Notice — Authorized Signatory Required',
              description: `Draft assessment notice generated. You are the authorized official. Review and authorize dispatch to the taxpayer via registered mail / e-Tax portal.`,
              urgency: 'CRITICAL',
              action: 'AUTHORIZE_NOTICE',
              targetPhase: 'NOTICE',
              caseData: c,
            });
          }
        }

        if (role === 'auditor') {
          // TL returned report for revision
          if (phase === 'REPORT' && caseStatus === 'RETURNED_TO_AUDITOR') {
            derived.push({
              id: `${c.id}-report-revision`,
              type: 'REPORT_REVISION',
              caseId: c.id,
              caseNumber: c.caseNumber,
              taxpayerName: c.taxpayerName || c.taxpayerId,
              phase: 'REPORT',
              title: 'Report Returned — Revision Required',
              description: `Your Team Leader returned the draft TP audit report for revision. Review TL comments and update the report before resubmitting.`,
              urgency: 'HIGH',
              action: 'REVISE_REPORT',
              targetPhase: 'REPORT',
              caseData: c,
            });
          }

          // IDR response received — auditor must acknowledge
          if (phase === 'FIELD_WORK' && caseStatus === 'IDR_RESPONSE_RECEIVED') {
            derived.push({
              id: `${c.id}-idr-ack`,
              type: 'IDR_ACKNOWLEDGMENT',
              caseId: c.id,
              caseNumber: c.caseNumber,
              taxpayerName: c.taxpayerName || c.taxpayerId,
              phase: 'FIELD_WORK',
              title: 'Taxpayer Submitted Evidence',
              description: `Taxpayer has uploaded evidence in response to your IDR. Review the submitted documents, acknowledge receipt, and update your findings.`,
              urgency: 'MEDIUM',
              action: 'ACK_IDR_RESPONSE',
              targetPhase: 'FIELD_WORK',
              caseData: c,
            });
          }

          // Overdue IDR — auditor must escalate
          if (phase === 'FIELD_WORK' && caseStatus === 'IDR_OVERDUE') {
            derived.push({
              id: `${c.id}-idr-overdue`,
              type: 'IDR_OVERDUE',
              caseId: c.id,
              caseNumber: c.caseNumber,
              taxpayerName: c.taxpayerName || c.taxpayerId,
              phase: 'FIELD_WORK',
              title: '⚠ IDR OVERDUE — Escalation Required',
              description: `The taxpayer has NOT responded to your Information & Document Request within the statutory deadline. You must consult your Team Leader about escalation options including Estimated Assessment.`,
              urgency: 'CRITICAL',
              action: 'ESCALATE_IDR',
              targetPhase: 'FIELD_WORK',
              caseData: c,
            });
          }
        }
      }

      setTasks(derived);
    } catch (e) {
      console.error('TpWorkflowTaskPanel fetchTasks error:', e);
    } finally {
      setLoading(false);
    }
  }, [user?.id, role]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const urgencyConfig = {
    CRITICAL: { color: 'red',    label: 'CRITICAL',  dot: '🔴' },
    HIGH:     { color: 'orange', label: 'HIGH',       dot: '🟠' },
    MEDIUM:   { color: 'yellow', label: 'MEDIUM',     dot: '🟡' },
    LOW:      { color: 'blue',   label: 'LOW',        dot: '🔵' },
  };

  const typeIcon = {
    IDR_APPROVAL:           <FileText className="w-5 h-5 text-blue-600" />,
    REPORT_REVIEW:          <ShieldAlert className="w-5 h-5 text-amber-600" />,
    PO_REPORT_REVIEW:       <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    FACT_STATEMENT:         <FileText className="w-5 h-5 text-purple-600" />,
    COMMITTEE_DECISION:     <Users className="w-5 h-5 text-indigo-600" />,
    HYPOTHESIS_REVIEW:      <BarChart2 className="w-5 h-5 text-pink-600" />,
    EXIT_CONFERENCE_APPROVAL: <Users className="w-5 h-5 text-teal-600" />,
    NOTICE_AUTHORIZATION:   <Scale className="w-5 h-5 text-rose-600" />,
    REPORT_REVISION:        <AlertTriangle className="w-5 h-5 text-amber-600" />,
    IDR_ACKNOWLEDGMENT:     <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    IDR_OVERDUE:            <AlertOctagon className="w-5 h-5 text-rose-600" />,
  };

  const handleQuickAction = async (task, decision) => {
    setActionLoading(true);
    try {
      let url, body;

      if (task.action === 'APPROVE_IDR') {
        // Find the latest IDR for this case and approve it
        const idrRes = await fetch(`${BASE_API}/${task.caseId}/field-work/information-requests`, {
          headers: { 'X-Actor-Id': user.id }
        });
        if (idrRes.ok) {
          const idrs = await idrRes.json();
          const pending = (idrs || []).find(i => i.status === 'AWAITING_APPROVAL');
          if (pending) {
            await fetch(`${BASE_API}/${task.caseId}/field-work/information-requests/${pending.id}/approve?approved=${decision === 'APPROVE'}&comments=${encodeURIComponent(actionComment)}`, {
              method: 'POST',
              headers: { 'X-Actor-Id': user.id }
            });
          }
        }
      } else if (task.action === 'REVIEW_REPORT' || task.action === 'PO_REVIEW_REPORT') {
        const reportId = task.caseData?.tpAuditReportId;
        if (reportId) {
          const reviewEndpoint = task.action === 'REVIEW_REPORT'
            ? `${BASE_API}/${task.caseId}/report/${reportId}/team-leader-review`
            : `${BASE_API}/${task.caseId}/report/${reportId}/process-owner-review`;
          await fetch(reviewEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Actor-Id': user.id },
            body: JSON.stringify({ decision: decision === 'APPROVE' ? 'APPROVED' : 'RETURNED', comments: actionComment })
          });
        }
      }

      setActionModal(null);
      setActionComment('');
      await fetchTasks();
    } catch (e) {
      console.error('Quick action failed:', e);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <RefreshCw className="w-4 h-4 animate-spin" />
          Loading your TP workflow tasks…
        </div>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card className="p-6 text-center space-y-2">
        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
        <p className="text-sm font-semibold text-slate-800 dark:text-white">No Pending TP Workflow Tasks</p>
        <p className="text-xs text-slate-500">All Transfer Pricing cases are up to date for your role. Check back after auditors submit actions.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">TP Workflow Tasks Requiring Your Action</h3>
          <p className="text-xs text-slate-500 mt-0.5">{tasks.length} pending task{tasks.length !== 1 ? 's' : ''} — must complete to unblock audit progress</p>
        </div>
        <Button size="xs" variant="secondary" icon={RefreshCw} onClick={fetchTasks}>Refresh</Button>
      </div>

      {tasks.map(task => {
        const urg = urgencyConfig[task.urgency] || urgencyConfig.MEDIUM;
        return (
          <div
            key={task.id}
            className={`p-4 rounded-xl border transition-all ${
              task.urgency === 'CRITICAL'
                ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                : task.urgency === 'HIGH'
                  ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-0.5 shrink-0">{typeIcon[task.type] || <Clock className="w-5 h-5 text-slate-500" />}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{task.title}</p>
                    <Badge color={urg.color} size="xs">{urg.dot} {urg.label}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">{task.caseNumber} — {task.taxpayerName}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">{task.description}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0">
                <Button
                  size="xs"
                  variant="primary"
                  icon={ArrowRight}
                  className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
                  onClick={() => onOpenWorkspace && onOpenWorkspace(task.caseData, task.targetPhase)}
                >
                  Open Workspace
                </Button>
                {(task.action === 'APPROVE_IDR' || task.action === 'REVIEW_REPORT' || task.action === 'PO_REVIEW_REPORT') && (
                  <Button
                    size="xs"
                    variant="secondary"
                    icon={Eye}
                    className="whitespace-nowrap"
                    onClick={() => { setActionModal(task); setActionComment(''); }}
                  >
                    Quick Action
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Quick Action Modal */}
      {actionModal && (
        <Modal
          open
          onClose={() => setActionModal(null)}
          title={actionModal.title}
          size="md"
          footer={
            <div className="flex justify-between w-full">
              <Button variant="secondary" onClick={() => setActionModal(null)}>Cancel</Button>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="text-rose-600 border-rose-300 hover:bg-rose-50"
                  onClick={() => handleQuickAction(actionModal, 'REJECT')}
                  loading={actionLoading}
                >
                  ↩ Return / Reject
                </Button>
                <Button
                  variant="primary"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => handleQuickAction(actionModal, 'APPROVE')}
                  loading={actionLoading}
                >
                  ✓ Approve & Forward
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800 text-xs">
              <p className="font-bold text-blue-900 dark:text-blue-300">Case: {actionModal.caseNumber}</p>
              <p className="text-blue-700 dark:text-blue-400 mt-0.5">Taxpayer: {actionModal.taxpayerName}</p>
              <p className="text-blue-700 dark:text-blue-400 mt-0.5">Phase: {actionModal.phase} → Action: {actionModal.action}</p>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{actionModal.description}</p>
            <Textarea
              label="Your Comments / Decision Rationale (required for rejections)"
              rows={3}
              value={actionComment}
              onChange={e => setActionComment(e.target.value)}
              placeholder="Enter your review comments…"
            />
            <Alert type="warning" title="This action is permanent">
              Approving will route this item to the next workflow stage. Rejecting will return it to the submitter with your comments.
            </Alert>
          </div>
        </Modal>
      )}
    </div>
  );
}
