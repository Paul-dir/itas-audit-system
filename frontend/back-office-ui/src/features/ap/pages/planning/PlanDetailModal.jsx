import { useState } from 'react';
import { Modal, Tabs, Button, Badge, Alert } from '../../components/ui/index.jsx';
import { DistributionTable } from '../shared/DistributionTable.jsx';
import PlanStatusBadge from '../shared/PlanStatusBadge.jsx';
import PlanTimeline from '../shared/PlanTimeline.jsx';
import { REGIONS } from '../../data/constants.js';
import { CheckCircle, MessageSquare, MapPin } from 'lucide-react';

export default function PlanDetailModal({ plan, onClose }) {
  const [tab, setTab] = useState('overview');
  if (!plan) return null;

  const feedbackCount = Object.keys(plan.regionalFeedback || {}).length;
  const pendingRegions = REGIONS.filter(r => !plan.regionalFeedback?.[r.id]);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'distribution', label: 'Distribution' },
    { id: 'feedback', label: 'Regional Feedback', count: feedbackCount },
    { id: 'timeline', label: 'Timeline' },
  ];

  return (
    <Modal open={!!plan} onClose={onClose} title={plan.name} size="xl">
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <PlanStatusBadge status={plan.status} />
          <span className="text-xs text-gray-400 dark:text-slate-400">ID: {plan.id}</span>
          <span className="text-xs text-gray-400 dark:text-slate-400">FY {plan.year}</span>
          <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
            {plan.totalCases?.toLocaleString()} cases
          </span>
        </div>

        {plan.description && <p className="text-sm text-gray-600 dark:text-slate-400">{plan.description}</p>}

        {plan.directorComment && (
          <Alert type={plan.status === 'REVISION_REQUESTED' ? 'warning' : 'info'} title="Director's Note">
            {plan.directorComment}
          </Alert>
        )}

        <Tabs tabs={tabs} active={tab} onChange={setTab} />

        <div className="pt-2">
          {tab === 'overview' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4 space-y-3 dark:bg-slate-700">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-200">Plan Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500 dark:text-slate-400">Year</span><span className="font-medium dark:text-white">FY {plan.year}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 dark:text-slate-400">Total Cases</span><span className="font-medium text-blue-700 dark:text-blue-400">{plan.totalCases?.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 dark:text-slate-400">Regions</span><span className="font-medium dark:text-white">{REGIONS.length}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 dark:text-slate-400">Status</span><PlanStatusBadge status={plan.status} /></div>
                  <div className="flex justify-between"><span className="text-gray-500 dark:text-slate-400">Created</span><span className="text-xs text-gray-600 dark:text-slate-400">{new Date(plan.createdAt).toLocaleDateString()}</span></div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4 space-y-3 dark:bg-slate-700">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-200">Regional Progress</h4>
                {plan.status === 'AWAITING_REGIONAL_FEEDBACK' && (
                  <div className="space-y-1.5">
                    {REGIONS.map(r => (
                      <div key={r.id} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-slate-400">{r.name}</span>
                        {plan.regionalFeedback?.[r.id]
                          ? <span className="text-green-600 dark:text-green-400 flex items-center gap-1"><CheckCircle size={12} /> Done</span>
                          : <span className="text-orange-500 dark:text-orange-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" /> Pending</span>}
                      </div>
                    ))}
                  </div>
                )}
                {plan.status !== 'AWAITING_REGIONAL_FEEDBACK' && (
                  <p className="text-xs text-gray-400 dark:text-slate-400">Regional feedback step not reached yet.</p>
                )}
              </div>
            </div>
          )}

          {tab === 'distribution' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 dark:text-slate-400">Case distribution by region and audit type</p>
              <DistributionTable distribution={plan.distribution} />
            </div>
          )}

          {tab === 'feedback' && (
            <div className="space-y-4">
              {feedbackCount === 0 && (
                <Alert type="info">No regional feedback submitted yet.</Alert>
              )}
              {REGIONS.map(region => {
                const fb = plan.regionalFeedback?.[region.id];
                return (
                  <div key={region.id} className="border border-gray-200 dark:border-slate-600 rounded-xl overflow-hidden">
                    <div className={`flex items-center justify-between px-4 py-3 ${fb ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-slate-700'}`}>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className={fb ? 'text-green-500 dark:text-green-400' : 'text-gray-400 dark:text-slate-500'} />
                        <span className="font-medium text-sm text-gray-800 dark:text-slate-200">{region.name}</span>
                      </div>
                      {fb
                        ? <Badge color="green" dot>Submitted {new Date(fb.submittedAt).toLocaleDateString()}</Badge>
                        : <Badge color="gray" dot>Pending</Badge>
                      }
                    </div>
                    {fb && (
                      <div className="px-4 py-3 bg-white dark:bg-slate-700">
                        <p className="text-xs text-gray-600 dark:text-slate-400">{fb.feedback}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'timeline' && (
            <PlanTimeline plan={plan} />
          )}
        </div>
      </div>
    </Modal>
  );
}
