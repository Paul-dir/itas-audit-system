import { useState, useEffect } from 'react';
import { Plus, ClipboardList, Clock, CheckCircle, FileText, ArrowRight, Eye, Send, Edit, RotateCcw, Activity, AlertOctagon, Settings, Trash2, Edit2, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../../../../context/AppContext.jsx';
import { useAuth } from '../../../../context/AuthContext.jsx';
import { Card, CardHeader, StatCard, Button, Badge, Table, Empty, Modal, Alert } from '../../../../components/ui/index.jsx';
import PlanStatusBadge from '../shared/PlanStatusBadge.jsx';
import CreatePlanModal from './CreatePlanModal.jsx';
import PlanDetailModal from './PlanDetailModal.jsx';
import AmendmentEditModal from './AmendmentEditModal.jsx';
import RiskAnalysisDashboard from './RiskAnalysisDashboard.jsx';
import PlanConfigurationPage from './PlanConfigurationPage.jsx';

export default function PlanningDashboard({ view }) {
  const { state, actions, selectors } = useApp();
  const { user } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [confirmSubmit, setConfirmSubmit] = useState(null);
  const [amendmentEditPlan, setAmendmentEditPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('plans');
  const [error, setError] = useState(null);

  // Refresh plans from backend on mount to pick up any amendments
  useEffect(() => {
    const refreshPlans = async () => {
      try {
        const { default: planService } = await import('../../../../features/ap/services/planService.js');
        const allPlans = await planService.getPlans();
        if (allPlans && allPlans.length > 0) {
          // Update global state with fresh plans from backend
          allPlans.forEach(plan => {
            actions.updatePlanDraft(plan.id, plan);
          });
        }
      } catch (e) {
        console.warn('Failed to refresh plans:', e);
      }
    };
    refreshPlans();
  }, []);

  // Show full configuration page if view is 'plan-configuration' or 'config'
  if (view === 'plan-configuration' || view === 'config') {
    return <PlanConfigurationPage />;
  }

  const stats = selectors.getPlanStats();
  const plans = state.plans;
  const amendmentPlans = plans.filter(p => ['AMENDMENT_REQUIRED', 'SENIOR_MGMT_REJECTED'].includes(p.status));

  const handleSubmit = async (plan) => {
    try {
      if (['AMENDMENT_REQUIRED', 'SENIOR_MGMT_REJECTED'].includes(plan.status)) {
        setConfirmSubmit(null);
        setAmendmentEditPlan(plan);
        return;
      }
      await actions.submitToDirector(plan.id, user.id);
      setConfirmSubmit(null);
    } catch (error) {
      setError(`Failed to submit plan: ${error.message}`);
    }
  };

  const handleAmendmentUpdate = (updatedPlan) => {
    actions.updatePlanDraft(updatedPlan.id, updatedPlan);
    setAmendmentEditPlan(null);
  };

  const columns = [
    { key: 'id', label: 'Plan ID', render: (v) => <span className="font-mono text-xs text-gray-500 dark:text-slate-400">{v}</span> },
    { key: 'planName', label: 'Plan Name', render: (v, row) => (
      <div>
        <p className="font-medium text-gray-900 text-sm">{v}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <p className="text-xs text-gray-400 dark:text-gray-500">FY {row.planYear}</p>
          {row.riskBased && <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-medium rounded-full"><Activity size={9} /> Risk-based</span>}
        </div>
      </div>
    )},
    { key: 'totalCases', label: 'Cases', render: (v) => <span className="font-semibold text-gray-700 tabular-nums">{v?.toLocaleString()}</span> },
    { key: 'status', label: 'Status', render: (v) => <PlanStatusBadge status={v} /> },
    { key: 'createdAt', label: 'Created', render: (v) => <span className="text-xs text-gray-500 dark:text-slate-400">{new Date(v).toLocaleDateString()}</span> },
    { key: '_actions', label: '', render: (_, row) => (
      <div className="flex items-center gap-1.5 justify-end" onClick={e => e.stopPropagation()}>
        <Button size="xs" variant="ghost" icon={Eye} onClick={() => setSelectedPlan(row)}>View</Button>
        {(row.status === 'DRAFT' || row.status === 'REVISION_REQUESTED' || row.status === 'AMENDMENT_REQUIRED' || row.status === 'SENIOR_MGMT_REJECTED') && (
          <Button size="xs" variant="primary" icon={Send} onClick={() => setConfirmSubmit(row)}>
            {(row.status === 'AMENDMENT_REQUIRED' || row.status === 'SENIOR_MGMT_REJECTED') ? 'Resubmit' : 'Submit'}
          </Button>
        )}
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      {/* Tab strip */}
      <div className="flex gap-1 bg-gray-100 dark:bg-slate-800 rounded-xl p-1 w-fit">
        <button onClick={() => setActiveTab('plans')} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'plans' ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200'}`}>
          <ClipboardList size={14} /> Audit Plans
        </button>
        <button onClick={() => setActiveTab('risk')} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'risk' ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200'}`}>
          <Activity size={14} /> Risk Analysis
          <span className="ml-0.5 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-semibold">Live</span>
        </button>
        <button onClick={() => setActiveTab('config')} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'config' ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200'}`}>
          <Settings size={14} /> Planning & Resource Configuration
        </button>
      </div>

      {/* Configuration tab */}
      {activeTab === 'config' && <PlanConfigurationPage />}

      {/* Risk Analysis tab */}
      {activeTab === 'risk' && <RiskAnalysisDashboard onUsePlanDefaults={() => { setActiveTab('plans'); setShowCreate(true); }} />}

      {/* Plans tab */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          {/* Config advisory banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-lg">
                <Settings size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">Planning Parameters Configurable</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Audit types, regional auditor headcount capacity, and effort estimation multipliers can be customized prior to generating plans.
                </p>
              </div>
            </div>
            <Button size="xs" variant="secondary" icon={Settings} onClick={() => setActiveTab('config')}>
              Configure Parameters
            </Button>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Plans" value={stats.total} icon={ClipboardList} color="blue" />
            <StatCard label="Draft" value={stats.draft} icon={Edit} color="gray" />
            <StatCard label="Pending Approval" value={stats.pendingDirector + stats.pendingSenior} icon={Clock} color="yellow" />
            <StatCard label="Finalized" value={stats.finalized} icon={CheckCircle} color="green" />
          </div>

            {/* Amendment Plans Alert */}
            {amendmentPlans.length > 0 && (
              <Card padding={false}>
                <div className="px-6 py-4 bg-amber-50 border-b border-amber-200 dark:bg-slate-700 dark:border-amber-900">
                  <h3 className="text-base font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-2">
                    <AlertOctagon size={18} />
                    Amendment Required
                  </h3>
                </div>
                <div className="divide-y divide-amber-100 dark:divide-slate-600">
                  {amendmentPlans.map(plan => (
                    <div key={plan.id} className="px-6 py-4 hover:bg-amber-50 dark:hover:bg-slate-600">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">{plan.name}</p>
                          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">{plan.amendmentComment}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge color={plan.status === 'SENIOR_MGMT_REJECTED' ? 'red' : 'amber'}>
                              {plan.status === 'SENIOR_MGMT_REJECTED' ? 'Rejected by Senior Mgmt' : 'Amendment Requested'}
                            </Badge>
                            <span className="text-xs text-gray-500">Last updated {new Date(plan.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            icon={Eye}
                            onClick={() => setAmendmentEditPlan(plan)}
                          >
                            Review
                          </Button>
                          <Button 
                            size="sm" 
                            variant="primary" 
                            icon={Edit2}
                            onClick={() => setAmendmentEditPlan(plan)}
                          >
                            Edit & Resubmit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Plans Table */}
            <Card padding={false}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Audit Plans</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Manage and track all national audit plans</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" icon={Activity} onClick={() => setActiveTab('risk')}>View Risk Data</Button>
                  <Button icon={Plus} onClick={() => setShowCreate(true)}>Create Plan</Button>
                </div>
              </div>
              {plans.length === 0 ? <div className="py-8"><Empty icon={FileText} title="No plans yet" description="View the risk analysis first, then create your first audit plan." action={<Button icon={Plus} onClick={() => setShowCreate(true)}>Create Plan</Button>} /></div> : <Table columns={columns} rows={plans} onRowClick={(row) => setSelectedPlan(row)} />}
            </Card>
        </div>
      )}

      {/* Modals */}
      {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}
      <CreatePlanModal open={showCreate} onClose={() => setShowCreate(false)} />
      {selectedPlan && <PlanDetailModal plan={selectors.getPlanById(selectedPlan.id)} onClose={() => setSelectedPlan(null)} />}

      {/* Submit confirmation */}
      <Modal open={!!confirmSubmit} onClose={() => setConfirmSubmit(null)} title={confirmSubmit?.status === 'AMENDMENT_REQUIRED' ? 'Resubmit Amended Plan' : 'Submit Plan for Director Approval'} size="sm"
        footer={<><Button variant="secondary" onClick={() => setConfirmSubmit(null)}>Cancel</Button><Button variant="primary" icon={Send} onClick={() => handleSubmit(confirmSubmit)}>{confirmSubmit?.status === 'AMENDMENT_REQUIRED' ? 'Resubmit' : 'Submit'}</Button></>}>
        {confirmSubmit?.status === 'AMENDMENT_REQUIRED' ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-slate-400">Resubmit the amended plan <strong>{confirmSubmit?.name}</strong> back to the Audit Director?</p>
            {confirmSubmit?.amendmentComment && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-orange-700 mb-1">Director's amendment instructions:</p>
                <p className="text-xs text-orange-600">{confirmSubmit.amendmentComment}</p>
              </div>
            )}
          </div>
        ) : confirmSubmit?.status === 'SENIOR_MGMT_REJECTED' ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-slate-400">Resubmit <strong>{confirmSubmit?.name}</strong> back to the Audit Director after addressing Senior Management's concerns?</p>
            {confirmSubmit?.seniorComment && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-red-700 mb-1">Senior Management rejection reason:</p>
                <p className="text-xs text-red-600">{confirmSubmit.seniorComment}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-slate-400">Submit <strong>{confirmSubmit?.name}</strong> for Audit Director review? You will not be able to edit it while under review.</p>
        )}
      </Modal>

      {/* Amendment Edit Modal */}
      <AmendmentEditModal
        plan={amendmentEditPlan}
        open={!!amendmentEditPlan}
        onClose={() => setAmendmentEditPlan(null)}
        onUpdate={handleAmendmentUpdate}
      />
    </div>
  );
}
