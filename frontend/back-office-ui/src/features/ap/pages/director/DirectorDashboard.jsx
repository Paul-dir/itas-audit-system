import { useState } from 'react';
import {
  CheckCircle, XCircle, RotateCcw, Send, Eye, FileText, Clock,
  CheckSquare, Map, AlertCircle, ArrowRight, Edit3, Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Card, StatCard, Button, Modal, Textarea, Alert, Table, Empty, Tabs, Badge } from '../../components/ui/index.jsx';
import PlanStatusBadge from '../shared/PlanStatusBadge.jsx';
import PlanDetailModal from '../planning/PlanDetailModal.jsx';
import { DistributionTable } from '../shared/DistributionTable.jsx';

const PLAN_STATUS_ORDER = [
  'SUBMITTED_TO_DIRECTOR',
  'DIRECTOR_APPROVED',
  'AWAITING_REGIONAL_FEEDBACK',
  'FEEDBACK_COLLECTED',
  'AMENDMENT_REQUIRED',
  'SUBMITTED_TO_SENIOR_MGMT',
  'SENIOR_MGMT_APPROVED',
  'FINALIZED',
];

export default function DirectorDashboard({ view }) {
  const { state, actions, selectors } = useApp();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [reviewPlan, setReviewPlan] = useState(null);
  const [tab, setTab] = useState('pending');
  const [comment, setComment] = useState('');
  const [actionType, setActionType] = useState(null);
  const [loading, setLoading] = useState(false);

  const stats = selectors.getPlanStats();
  // First-time submissions (no amendment revisions yet)
  const pending = state.plans.filter(p => p.status === 'SUBMITTED_TO_DIRECTOR' && !p.revisions?.some(r => r.type === 'amendment'));
  // Resubmissions after amendment cycle
  const amendedResubmissions = state.plans.filter(p => p.status === 'SUBMITTED_TO_DIRECTOR' && p.revisions?.some(r => r.type === 'amendment'));
  const readyToSend = state.plans.filter(p => p.status === 'DIRECTOR_APPROVED');
  const feedbackCollected = state.plans.filter(p => p.status === 'FEEDBACK_COLLECTED');
  const seniorApproved = state.plans.filter(p => p.status === 'SENIOR_MGMT_APPROVED');
  const seniorRejected = state.plans.filter(p => p.status === 'SENIOR_MGMT_REJECTED');
  const approved = state.plans.filter(p =>
    ['DIRECTOR_APPROVED','AWAITING_REGIONAL_FEEDBACK','FEEDBACK_COLLECTED',
     'AMENDMENT_REQUIRED','SUBMITTED_TO_SENIOR_MGMT','SENIOR_MGMT_APPROVED','SENIOR_MGMT_REJECTED','FINALIZED'].includes(p.status)
  );

  const doAction = () => {
    if (!reviewPlan || !actionType) return;
    if ((actionType === 'revise' || actionType === 'amendment') && !comment.trim()) return;
    setLoading(true);
    setTimeout(() => {
      if (actionType === 'approve')    actions.approvePlan(reviewPlan.id, user.id, comment);
      else if (actionType === 'revise') actions.requestRevision(reviewPlan.id, user.id, comment);
      else if (actionType === 'amendment') actions.sendAmendmentToPlanningTeam(reviewPlan.id, user.id, comment);
      else if (actionType === 'submit_senior') actions.submitToSeniorMgmt(reviewPlan.id, user.id);
      else if (actionType === 'send_regions') actions.sendApprovedToRegions(reviewPlan.id, user.id);
      setLoading(false);
      setReviewPlan(null);
      setComment('');
      setActionType(null);
    }, 300);
  };

  const openAction = (plan, type) => {
    setReviewPlan(plan);
    setActionType(type);
    setComment('');
  };

  const planCols = (showActions = true) => [
    { key: 'id', label: 'ID', render: v => <span className="font-mono text-xs text-gray-400 dark:text-gray-500">{v}</span> },
    { key: 'name', label: 'Plan', render: (v, row) => (
      <div>
        <p className="font-medium text-sm text-gray-900 dark:text-white">{v}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">FY {row.year}</p>
      </div>
    )},
    { key: 'totalCases', label: 'Cases', render: v => <span className="font-semibold tabular-nums">{v?.toLocaleString()}</span> },
    { key: 'status', label: 'Status', render: v => <PlanStatusBadge status={v} /> },
    { key: 'createdAt', label: 'Date', render: v => <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(v).toLocaleDateString()}</span> },
    ...(showActions ? [{
      key: '_act', label: '', render: (_, row) => (
        <div className="flex gap-1.5 justify-end flex-wrap" onClick={e => e.stopPropagation()}>
          <Button size="xs" variant="ghost" icon={Eye} onClick={() => setSelectedPlan(row)}>View</Button>

          {/* SUBMITTED_TO_DIRECTOR (first time): approve or request revision */}
          {row.status === 'SUBMITTED_TO_DIRECTOR' && !row.revisions?.some(r => r.type === 'amendment') && (
            <>
              <Button size="xs" variant="success" icon={CheckCircle} onClick={() => openAction(row, 'approve')}>Approve</Button>
              <Button size="xs" variant="warning" icon={RotateCcw} onClick={() => openAction(row, 'revise')}>Revise</Button>
            </>
          )}

          {/* SUBMITTED_TO_DIRECTOR (after amendment): submit to Senior Mgmt or request more revision */}
          {row.status === 'SUBMITTED_TO_DIRECTOR' && row.revisions?.some(r => r.type === 'amendment') && (
            <>
              <Button size="xs" variant="indigo" icon={ArrowRight} onClick={() => openAction(row, 'submit_senior')}>
                → Senior Mgmt
              </Button>
              <Button size="xs" variant="warning" icon={RotateCcw} onClick={() => openAction(row, 'revise')}>
                More Revision
              </Button>
            </>
          )}

          {/* DIRECTOR_APPROVED: send to regions for feedback */}
          {row.status === 'DIRECTOR_APPROVED' && (
            <Button size="xs" variant="primary" icon={Send} onClick={() => openAction(row, 'send_to_regions_pre')}>
              Send to Regions
            </Button>
          )}

          {/* FEEDBACK_COLLECTED: MUST send for amendment — no direct-to-Senior path */}
          {row.status === 'FEEDBACK_COLLECTED' && (
            <Button size="xs" variant="warning" icon={Edit3} onClick={() => openAction(row, 'amendment')}>
              Send for Amendment
            </Button>
          )}

          {/* SENIOR_MGMT_REJECTED: Director handles — resubmit to Senior or send back for amendment */}
          {row.status === 'SENIOR_MGMT_REJECTED' && (
            <>
              <Button size="xs" variant="indigo" icon={ArrowRight} onClick={() => openAction(row, 'submit_senior')}>
                Resubmit to Senior
              </Button>
              <Button size="xs" variant="warning" icon={Edit3} onClick={() => openAction(row, 'amendment')}>
                Send for Amendment
              </Button>
            </>
          )}

          {/* SENIOR_MGMT_APPROVED: Director deploys the plan */}
          {row.status === 'SENIOR_MGMT_APPROVED' && (
            <Button size="xs" variant="success" icon={Zap} onClick={() => openAction(row, 'send_regions')}>
              Deploy to Regions
            </Button>
          )}
        </div>
      )
    }] : []),
  ];

  const ACTION_META = {
    approve:           { title: 'Approve Plan',              variant: 'success', icon: CheckCircle,  commentLabel: 'Approval Note (optional)',       required: false },
    revise:            { title: 'Request Revision',          variant: 'warning', icon: RotateCcw,    commentLabel: 'Revision Instructions *',         required: true  },
    amendment:         { title: 'Send for Amendment',        variant: 'warning', icon: Edit3,        commentLabel: 'Amendment Instructions *',        required: true  },
    submit_senior:     { title: 'Submit to Senior Management',variant: 'primary', icon: ArrowRight,  commentLabel: 'Notes for Senior Management',     required: false },
    send_regions:      { title: 'Send Approved Plan to All Regions', variant: 'success', icon: Zap,  commentLabel: 'Message to Regions (optional)',   required: false },
    send_to_regions_pre: { title: 'Send to Regions for Feedback', variant: 'primary', icon: Send,  commentLabel: 'Notes for Regional Directors',    required: false },
  };

  const meta = ACTION_META[actionType] || {};

  const tabs = [
    { id: 'pending', label: 'Pending Review', count: pending.length + amendedResubmissions.length },
    { id: 'feedback', label: 'Regional Feedback', count: feedbackCollected.length },
    { id: 'senior_rejected', label: 'Senior Rejected', count: seniorRejected.length },
    { id: 'senior_approved', label: 'Ready to Deploy', count: seniorApproved.length },
    { id: 'approved', label: 'All Active Plans', count: approved.length },
  ];

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pending Review"    value={stats.pendingDirector} icon={Clock}      color="yellow" sub="Awaiting your decision"   />
        <StatCard label="Feedback Collected" value={feedbackCollected.length} icon={Map}    color="teal"   sub="Ready for amendment"        />
        <StatCard label="Senior Approved"   value={seniorApproved.length}  icon={CheckSquare} color="green" sub="Ready to send to regions" />
        <StatCard label="Finalized"         value={stats.finalized}        icon={Zap}        color="blue"  sub="Deployed plans"             />
      </div>

      {/* Alert banners */}
      {(pending.length > 0 || amendedResubmissions.length > 0) && (
        <Alert type="info" title={`${pending.length + amendedResubmissions.length} plan${pending.length + amendedResubmissions.length > 1 ? 's' : ''} awaiting your review`}>
          {amendedResubmissions.length > 0 && <span className="font-semibold text-blue-700">{amendedResubmissions.length} amended resubmission(s) ready for Senior Management forwarding. </span>}
          {pending.length > 0 && 'Approve or request revisions on newly submitted audit plans.'}
        </Alert>
      )}
      {feedbackCollected.length > 0 && (
        <Alert type="warning" title={`${feedbackCollected.length} plan${feedbackCollected.length > 1 ? 's have' : ' has'} all regional feedback collected`}>
          Review the regional feedback and send the plan back to the planning team for amendment. The planning team must amend and resubmit before you can forward to Senior Management.
        </Alert>
      )}
      {seniorRejected.length > 0 && (
        <Alert type="error" title={`${seniorRejected.length} plan${seniorRejected.length > 1 ? 's' : ''} rejected by Senior Management`}>
          Review Senior Management's feedback and either send the plan back for amendment or resubmit directly to Senior Management.
        </Alert>
      )}
      {seniorApproved.length > 0 && (
        <Alert type="success" title={`${seniorApproved.length} plan${seniorApproved.length > 1 ? 's' : ''} approved by Senior Management`}>
          Click <strong>"Deploy to Regions"</strong> to deploy the plan — this will distribute cases to all regions and tax centers.
        </Alert>
      )}

      {/* Plan table with tabs */}
      <Card padding={false}>
        <div className="px-6 pt-4 pb-0">
          <Tabs tabs={tabs} active={tab} onChange={setTab} />
        </div>
        <div className="p-4">
          {tab === 'pending' && (
            pending.length === 0 && amendedResubmissions.length === 0
              ? <Empty icon={CheckCircle} title="No pending plans" description="All submitted plans have been reviewed." />
              : <Table columns={planCols(true)} rows={[...pending, ...amendedResubmissions]} onRowClick={row => setSelectedPlan(row)} />
          )}
          {tab === 'feedback' && (
            feedbackCollected.length === 0
              ? <Empty icon={Map} title="No feedback collected yet" description="Plans will appear here once all regions submit their feedback." />
              : <Table columns={planCols(true)} rows={feedbackCollected} onRowClick={row => setSelectedPlan(row)} />
          )}
          {tab === 'senior_rejected' && (
            seniorRejected.length === 0
              ? <Empty icon={AlertCircle} title="No Senior Management rejections" description="Plans rejected by Senior Management will appear here." />
              : <Table columns={planCols(true)} rows={seniorRejected} onRowClick={row => setSelectedPlan(row)} />
          )}
          {tab === 'senior_approved' && (
            seniorApproved.length === 0
              ? <Empty icon={CheckSquare} title="No approved plans awaiting deployment" description="Plans approved by Senior Management will appear here." />
              : <Table columns={planCols(true)} rows={seniorApproved} onRowClick={row => setSelectedPlan(row)} />
          )}
          {tab === 'approved' && (
            approved.length === 0
              ? <Empty icon={FileText} title="No active plans yet" />
              : <Table columns={planCols(true)} rows={approved} onRowClick={row => setSelectedPlan(row)} />
          )}
        </div>
      </Card>

      {/* Action Modal */}
      <Modal
        open={!!reviewPlan && !!actionType}
        onClose={() => { setReviewPlan(null); setActionType(null); setComment(''); }}
        title={`${meta.title || ''} — ${reviewPlan?.name || ''}`}
        size="lg"
        footer={<>
          <Button variant="secondary" onClick={() => { setReviewPlan(null); setActionType(null); setComment(''); }}>Cancel</Button>
          <Button
            variant={meta.variant || 'primary'}
            icon={meta.icon}
            loading={loading}
            onClick={() => {
              // For send_to_regions_pre, call sendToRegions directly
              if (actionType === 'send_to_regions_pre') {
                setLoading(true);
                setTimeout(() => { actions.sendToRegions(reviewPlan.id, user.id); setLoading(false); setReviewPlan(null); setActionType(null); }, 300);
              } else {
                doAction();
              }
            }}
            disabled={meta.required && !comment.trim()}
          >
            {meta.title}
          </Button>
        </>}
      >
        {reviewPlan && (
          <div className="space-y-4">
            {/* Show regional feedback summary for amendment */}
            {actionType === 'amendment' && reviewPlan.regionalFeedback && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Regional Feedback Summary</p>
                {Object.entries(reviewPlan.regionalFeedback).map(([region, fb]) => (
                  <div key={region} className="bg-gray-50 rounded-lg p-3 text-xs dark:bg-slate-700">
                    <p className="font-medium text-gray-700 dark:text-slate-200 capitalize mb-1">{region.replace(/_/g,' ')}</p>
                    <p className="text-gray-600 dark:text-slate-400 italic">"{fb.feedback}"</p>
                  </div>
                ))}
              </div>
            )}

            {/* Distribution summary for approve/revise */}
            {(actionType === 'approve' || actionType === 'revise') && (
              <div className="bg-gray-50 rounded-xl p-4 dark:bg-slate-700">
                <p className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">Distribution Summary</p>
                <DistributionTable distribution={reviewPlan.distribution} />
              </div>
            )}

            {/* Warning for send_regions */}
            {actionType === 'send_regions' && (
              <Alert type="info" title="This action will deploy the plan">
                Sending the approved plan to all regions will automatically distribute audit cases to each tax center.
                This action cannot be undone.
              </Alert>
            )}

            <Textarea
              label={meta.commentLabel || 'Notes'}
              placeholder={
                actionType === 'amendment'
                  ? 'Specify what the planning team should change based on regional feedback...'
                  : actionType === 'revise'
                  ? 'Explain what needs to be changed before approval...'
                  : 'Optional notes...'
              }
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
          </div>
        )}
      </Modal>

      {selectedPlan && <PlanDetailModal plan={selectors.getPlanById(selectedPlan.id)} onClose={() => setSelectedPlan(null)} />}
    </div>
  );
}
