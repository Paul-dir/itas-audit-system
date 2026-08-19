import { useState } from 'react';
import { Star, CheckCircle, XCircle, Eye, FileText, Clock, Award, BarChart3 } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Card, StatCard, Button, Modal, Textarea, Alert, Table, Empty, Tabs } from '../../components/ui/index.jsx';
import PlanStatusBadge from '../shared/PlanStatusBadge.jsx';
import { DistributionTable } from '../shared/DistributionTable.jsx';
import PlanTimeline from '../shared/PlanTimeline.jsx';
import { REGIONS } from '../../data/constants.js';

export default function SeniorDashboard({ view }) {
  const { state, actions, selectors } = useApp();
  const { user } = useAuth();
  const [reviewPlan, setReviewPlan] = useState(null);
  const [comment, setComment] = useState('');
  const [action, setAction] = useState(null); // 'approve' | 'reject'
  const [loading, setLoading] = useState(false);
  const [viewPlan, setViewPlan] = useState(null);
  const [viewTab, setViewTab] = useState('distribution');
  const [tab, setTab] = useState('pending');

  const pending = state.plans.filter(p => p.status === 'SUBMITTED_TO_SENIOR_MGMT');
  const approved = state.plans.filter(p => p.status === 'SENIOR_MGMT_APPROVED');
  const finalized = state.plans.filter(p => p.status === 'FINALIZED');
  const allPlans = state.plans;

  const stats = selectors.getPlanStats();

  const doAction = () => {
    if (!reviewPlan) return;
    setLoading(true);
    setTimeout(() => {
      if (action === 'approve') {
        actions.approveBySenior(reviewPlan.id, user.id, comment);
      } else {
        actions.rejectBySenior(reviewPlan.id, user.id, comment);
      }
      setLoading(false);
      setReviewPlan(null);
      setComment('');
      setAction(null);
    }, 300);
  };

  const cols = [
    { key: 'id', label: 'ID', render: v => <span className="font-mono text-xs text-gray-400 dark:text-gray-500">{v}</span> },
    { key: 'name', label: 'Plan', render: (v, row) => (
      <div><p className="font-medium text-sm text-gray-900 dark:text-white">{v}</p><p className="text-xs text-gray-400 dark:text-gray-500">FY {row.year}</p></div>
    )},
    { key: 'totalCases', label: 'Cases', render: v => <span className="font-semibold tabular-nums">{v?.toLocaleString()}</span> },
    { key: 'status', label: 'Status', render: v => <PlanStatusBadge status={v} /> },
    { key: '_act', label: '', render: (_, row) => (
      <div className="flex gap-1.5 justify-end" onClick={e => e.stopPropagation()}>
        <Button size="xs" variant="ghost" icon={Eye} onClick={() => setViewPlan(row)}>View</Button>
        {row.status === 'SUBMITTED_TO_SENIOR_MGMT' && (
          <>
            <Button size="xs" variant="success" icon={CheckCircle} onClick={() => { setReviewPlan(row); setAction('approve'); }}>Approve</Button>
            <Button size="xs" variant="danger" icon={XCircle} onClick={() => { setReviewPlan(row); setAction('reject'); }}>Reject</Button>
          </>
        )}
        {/* Approved plans are deployed by the Director — no action needed from Senior Management */}
        {row.status === 'SENIOR_MGMT_APPROVED' && (
          <span className="text-xs text-green-600 font-medium px-2">✓ Awaiting Director deployment</span>
        )}
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pending Approval" value={pending.length} icon={Clock} color="yellow" />
        <StatCard label="Approved" value={approved.length} icon={CheckCircle} color="green" sub="Awaiting Director deployment" />
        <StatCard label="Total Plans" value={allPlans.length} icon={FileText} color="blue" />
        <StatCard label="Finalized" value={finalized.length} icon={Award} color="teal" />
      </div>

      {pending.length > 0 && (
        <Alert type="warning" title={`${pending.length} plan${pending.length > 1 ? 's' : ''} awaiting your approval`}>
          These plans have completed the regional feedback cycle and require Senior Management sign-off.
        </Alert>
      )}

      <Card padding={false}>
        <div className="px-6 pt-4 pb-0 border-b border-gray-100 dark:border-gray-700">
          <Tabs
            tabs={[
              { id: 'pending', label: 'Pending Approval', count: pending.length },
              { id: 'all', label: 'All Plans', count: allPlans.length },
            ]}
            active={tab} onChange={setTab}
          />
        </div>
        <div className="p-4">
          {tab === 'pending' && (
            pending.length === 0
              ? <Empty icon={CheckCircle} title="No plans pending approval" description="You're all caught up." />
              : <Table columns={cols} rows={pending} onRowClick={row => setViewPlan(row)} />
          )}
          {tab === 'all' && (
            allPlans.length === 0
              ? <Empty icon={FileText} title="No plans yet" />
              : <Table columns={cols} rows={allPlans} onRowClick={row => setViewPlan(row)} />
          )}
        </div>
      </Card>

      {/* Approve / Reject modal */}
      <Modal
        open={!!reviewPlan}
        onClose={() => { setReviewPlan(null); setAction(null); setComment(''); }}
        title={action === 'approve' ? `Approve — ${reviewPlan?.name}` : `Reject — ${reviewPlan?.name}`}
        size="xl"
        footer={<>
          <Button variant="secondary" onClick={() => { setReviewPlan(null); setAction(null); setComment(''); }}>Cancel</Button>
          <Button
            variant={action === 'approve' ? 'success' : 'danger'}
            icon={action === 'approve' ? CheckCircle : XCircle}
            loading={loading} onClick={doAction}
            disabled={action === 'reject' && !comment.trim()}
          >
            {action === 'approve' ? 'Approve Plan' : 'Reject Plan'}
          </Button>
        </>}
      >
        {reviewPlan && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-blue-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 dark:text-slate-400">Total Cases</p>
                <p className="text-xl font-bold text-blue-700">{reviewPlan.totalCases?.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 dark:text-slate-400">Regions</p>
                <p className="text-xl font-bold text-green-700">{REGIONS.length}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 dark:text-slate-400">Fiscal Year</p>
                <p className="text-xl font-bold text-purple-700">FY {reviewPlan.year}</p>
              </div>
            </div>
            <DistributionTable distribution={reviewPlan.distribution} />
            <Textarea
              label={action === 'approve' ? 'Approval Note (optional)' : 'Rejection Reason *'}
              placeholder={action === 'approve' ? 'Add any senior management notes...' : 'Explain the reason for rejection...'}
              value={comment} onChange={e => setComment(e.target.value)}
            />
          </div>
        )}
      </Modal>

      {/* View plan modal */}
      {viewPlan && (
        <Modal open={!!viewPlan} onClose={() => setViewPlan(null)} title={viewPlan.name} size="xl">
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <PlanStatusBadge status={viewPlan.status} />
              <span className="text-xs text-gray-400 dark:text-slate-400">FY {viewPlan.year}</span>
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">{viewPlan.totalCases?.toLocaleString()} cases</span>
            </div>
            <Tabs
              tabs={[{ id: 'distribution', label: 'Distribution' }, { id: 'feedback', label: 'Regional Feedback' }, { id: 'timeline', label: 'Timeline' }]}
              active={viewTab} onChange={setViewTab}
            />
            {viewTab === 'distribution' && <DistributionTable distribution={viewPlan.distribution} />}
            {viewTab === 'feedback' && (
              <div className="space-y-3">
                {REGIONS.map(r => {
                  const fb = viewPlan.regionalFeedback?.[r.id];
                  return (
                    <div key={r.id} className={`p-3 rounded-xl border ${fb ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{r.name}</span>
                        {fb ? <span className="text-xs text-green-600 dark:text-green-400">✓ Submitted</span> : <span className="text-xs text-gray-400 dark:text-slate-400">Pending</span>}
                      </div>
                      {fb?.feedback && <p className="text-xs text-gray-600 dark:text-slate-400 italic">"{fb.feedback}"</p>}
                    </div>
                  );
                })}
              </div>
            )}
            {viewTab === 'timeline' && <PlanTimeline plan={viewPlan} />}
          </div>
        </Modal>
      )}
    </div>
  );
}
