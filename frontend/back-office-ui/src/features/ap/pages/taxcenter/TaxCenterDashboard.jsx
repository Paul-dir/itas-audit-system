import { useState } from 'react';
import { Building2, Users, Clock, CheckCircle, Send, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Card, StatCard, Button, Modal, Badge, Alert, Textarea } from '../../components/ui/index.jsx';
import { AUDIT_TYPES } from '../../data/constants.js';
import PlanStatusBadge from '../shared/PlanStatusBadge.jsx';

export default function TaxCenterDashboard({ view }) {
  const { state, actions } = useApp();
  const { user } = useAuth();
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [adjustedAllocation, setAdjustedAllocation] = useState({});
  const [loading, setLoading] = useState(false);
  const [viewPlanModal, setViewPlanModal] = useState(null); // NEW: For viewing deployed plans

  const taxCenter = user.taxCenter;
  const region = user.region;
  
  // Get plans where this tax center has been allocated cases.
  // Checks tcDistributions first (pre-submission distribution from Regional Director)
  // then falls back to regionalFeedback.taxCenterAllocations (legacy/post-submission).
  const getEffectiveTCAllocation = (plan) => {
    // Pre-submission distribution path (new)
    const distAlloc = plan.tcDistributions?.[region]?.allocations?.[taxCenter];
    if (distAlloc) return distAlloc;
    // Post-submission fallback
    return plan.regionalFeedback?.[region]?.taxCenterAllocations?.[taxCenter] || null;
  };

  const plansForTC = state.plans.filter(p => {
    const alloc = getEffectiveTCAllocation(p);
    if (!alloc) return false;
    return Object.values(alloc).reduce((s, v) => s + v, 0) > 0;
  });

  // NEW: Plans that have been deployed to this region (APPROVED_TO_REGIONS or FINALIZED)
  const deployedPlans = state.plans.filter(p => {
    if (!['APPROVED_TO_REGIONS', 'FINALIZED'].includes(p.status)) return false;
    // Check if this region has deployed
    const isDeployed = p.regionalDeployments?.[region];
    if (!isDeployed) return false;
    // Check if this tax center has allocation
    const tcAlloc = p.regionalFeedback?.[region]?.taxCenterAllocations?.[taxCenter];
    if (!tcAlloc) return false;
    return Object.values(tcAlloc).reduce((s, v) => s + v, 0) > 0;
  });

  // Check if feedback submitted
  const awaitingFeedback = plansForTC.filter(p => !p.taxCenterFeedback?.[region]?.[taxCenter]);
  const submittedFeedback = plansForTC.filter(p => p.taxCenterFeedback?.[region]?.[taxCenter]);

  const openFeedback = (plan) => {
    const tcAllocation = getEffectiveTCAllocation(plan);
    setFeedbackModal(plan);
    setFeedbackText('');
    setAdjustedAllocation(tcAllocation || {}); // Default to what was allocated
  };

  const handleSubmit = () => {
    if (!feedbackText.trim()) {
      alert('Please provide feedback');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      actions.submitTaxCenterFeedback(
        feedbackModal.id,
        region,
        taxCenter,
        feedbackText,
        adjustedAllocation,
        user.id
      );
      setLoading(false);
      setFeedbackModal(null);
    }, 300);
  };

  const handleAllocationChange = (auditTypeId, value) => {
    setAdjustedAllocation(prev => ({
      ...prev,
      [auditTypeId]: Math.max(0, parseInt(value) || 0)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard 
          label="Plans Assigned" 
          value={plansForTC.length} 
          icon={Building2} 
          color="blue"
          sub={taxCenter?.replace(/-/g, ' ').toUpperCase()}
        />
        <StatCard 
          label="Deployed Plans" 
          value={deployedPlans.length} 
          icon={CheckCircle} 
          color="green"
          sub={deployedPlans.length > 0 ? 'Ready for execution' : 'No deployments yet'}
        />
        <StatCard 
          label="Awaiting Your Feedback" 
          value={awaitingFeedback.length} 
          icon={Clock} 
          color="yellow"
          sub={awaitingFeedback.length > 0 ? 'Action required' : 'All done'}
        />
        <StatCard 
          label="Feedback Submitted" 
          value={submittedFeedback.length} 
          icon={CheckCircle} 
          color="green"
          sub="This cycle"
        />
      </div>

      {awaitingFeedback.length > 0 && (
        <Alert type="warning" title="Plans require your feedback">
          Review your allocated cases and provide feedback to your regional director.
        </Alert>
      )}

      {deployedPlans.length > 0 && (
        <Alert type="success" title="Approved plans deployed to your tax center">
          {deployedPlans.length} plan(s) have been deployed by your regional director. Audit cases have been generated and are ready for execution.
        </Alert>
      )}

      {/* Deployed Plans - Ready for Execution */}
      {deployedPlans.length > 0 && (
        <Card padding={false}>
          <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-600 bg-green-50 dark:bg-slate-800">
            <h3 className="text-base font-semibold text-green-900 dark:text-green-400">✓ Deployed Plans — Ready for Execution</h3>
            <p className="text-xs text-green-700 dark:text-green-500 mt-0.5">These plans have been approved and deployed. Cases are ready for assignment to team leaders.</p>
          </div>
          <div className="divide-y divide-gray-100">
            {deployedPlans.map(plan => {
              const tcAlloc = plan.regionalFeedback?.[region]?.taxCenterAllocations?.[taxCenter] || {};
              const total = Object.values(tcAlloc).reduce((s, v) => s + v, 0);
              const deployment = plan.regionalDeployments?.[region];
              const isFinalized = plan.status === 'FINALIZED';
              
              return (
                <div key={plan.id} className="flex items-center justify-between px-6 py-4 hover:bg-blue-50 dark:hover:bg-slate-600">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 dark:text-white">{plan.name}</p>
                      <Badge color={isFinalized ? 'green' : 'purple'} dot>
                        {isFinalized ? 'Finalized' : 'Deployed'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {total} cases allocated to {taxCenter.replace(/-/g, ' ').toUpperCase()}
                    </p>
                    {deployment && (
                      <p className="text-xs text-gray-400 mt-1">
                        Deployed by Regional Director on {new Date(deployment.deployedAt).toLocaleDateString()}
                      </p>
                    )}
                    {isFinalized && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                          <CheckCircle size={12} /> Cases Generated
                        </span>
                        <span className="text-xs text-gray-600 dark:text-slate-400">
                          Ready for team leader assignment
                        </span>
                      </div>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    icon={Eye}
                    onClick={() => setViewPlanModal(plan)}
                  >
                    View Details
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Plans awaiting feedback */}
      {awaitingFeedback.length > 0 && (
        <Card padding={false}>
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Pending Feedback</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {awaitingFeedback.map(plan => {
              const tcAlloc = getEffectiveTCAllocation(plan) || {};
              const total = Object.values(tcAlloc).reduce((s, v) => s + v, 0);
              
              return (
                <div key={plan.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{plan.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {total} cases allocated to your tax center
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="primary" 
                    icon={Send}
                    onClick={() => openFeedback(plan)}
                  >
                    Provide Feedback
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Submitted feedback */}
      {submittedFeedback.length > 0 && (
        <Card padding={false}>
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Feedback Submitted</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {submittedFeedback.map(plan => {
              const fb = plan.taxCenterFeedback[region][taxCenter];
              
              return (
                <div key={plan.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{plan.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Submitted {new Date(fb.submittedAt).toLocaleDateString()}
                    </p>
                    {fb.feedback && (
                      <p className="text-sm text-gray-600 mt-1 italic">"{fb.feedback}"</p>
                    )}
                  </div>
                  <Badge color="green" dot>Submitted</Badge>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {plansForTC.length === 0 && (
        <Card>
          <Alert type="info" title="No plans assigned yet">
            Plans will appear here once your regional director allocates cases to your tax center.
          </Alert>
        </Card>
      )}

      {/* Feedback Modal */}
      {feedbackModal && (
        <Modal
          open={!!feedbackModal}
          onClose={() => setFeedbackModal(null)}
          title="Provide Tax Center Feedback"
          size="xl"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setFeedbackModal(null)}>
                Cancel
              </Button>
              <Button 
                variant="success" 
                icon={Send} 
                loading={loading}
                onClick={handleSubmit}
              >
                Submit Feedback
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Alert type="info" title="Review and adjust your allocation">
              Review the cases allocated to your tax center. You can adjust the numbers if needed and provide feedback.
            </Alert>

            {/* Allocation Table */}
            <div className="bg-gray-50 rounded-xl p-4 dark:bg-slate-700">
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-3">Allocated Cases by Audit Type</p>
              <div className="space-y-3">
                {AUDIT_TYPES.map(auditType => (
                  <div key={auditType.id} className="flex items-center gap-3 bg-white dark:bg-slate-600 rounded-lg border border-gray-200 dark:border-slate-500 p-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700 dark:text-slate-200">{auditType.name}</p>
                      <p className="text-xs text-gray-400 dark:text-slate-400">Adjust if capacity constraints exist</p>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={adjustedAllocation[auditType.id] || 0}
                      onChange={(e) => handleAllocationChange(auditType.id, e.target.value)}
                      className="w-24 text-center border border-gray-200 dark:border-slate-500 rounded-lg py-2 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback Text */}
            <Textarea
              label="Feedback / Comments *"
              placeholder="Describe capacity constraints, resource availability, or special considerations..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={4}
            />

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-sm text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-900">
              <strong>Note:</strong> Your adjusted numbers and feedback will be sent to your regional director for review.
            </div>
          </div>
        </Modal>
      )}

      {/* View Deployed Plan Modal */}
      {viewPlanModal && (
        <Modal
          open={!!viewPlanModal}
          onClose={() => setViewPlanModal(null)}
          title={`Plan Details: ${viewPlanModal.name}`}
          size="xl"
          footer={
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setViewPlanModal(null)}>
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Plan Info */}
            <div className="bg-gray-50 rounded-xl p-4 dark:bg-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Fiscal Year</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">FY {viewPlanModal.year}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Status</p>
                  <div className="mt-1">
                    <Badge color={viewPlanModal.status === 'FINALIZED' ? 'green' : 'purple'} dot>
                      {viewPlanModal.status === 'FINALIZED' ? 'Finalized & Deployed' : 'Deployed to Regions'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Tax Center Allocation */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-3">
                Your Tax Center Allocation ({taxCenter.replace(/-/g, ' ').toUpperCase()})
              </p>
              <div className="bg-white dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800 dark:bg-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-slate-200">Audit Type</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-200">Cases Allocated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-600">
                    {AUDIT_TYPES.map(auditType => {
                      const tcAlloc = viewPlanModal.regionalFeedback?.[region]?.taxCenterAllocations?.[taxCenter] || {};
                      const count = tcAlloc[auditType.id] || 0;
                      
                      return (
                        <tr key={auditType.id} className="dark:bg-slate-700">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Badge color={auditType.color}>{auditType.shortName}</Badge>
                              <span className="text-sm text-gray-700 dark:text-slate-200">{auditType.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">{count}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-slate-600 border-t-2 border-gray-300 dark:border-slate-500">
                    <tr>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">Total Cases</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                          {Object.values(
                            viewPlanModal.regionalFeedback?.[region]?.taxCenterAllocations?.[taxCenter] || {}
                          ).reduce((s, v) => s + v, 0)}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Deployment Info */}
            {viewPlanModal.regionalDeployments?.[region] && (
              <div className="bg-green-50 dark:bg-slate-800 rounded-xl p-4 border border-green-200 dark:border-slate-600">
                <p className="text-sm font-semibold text-green-900 dark:text-green-400 mb-2">📋 Deployment Information</p>
                <p className="text-xs text-green-700 dark:text-green-500">
                  Deployed by Regional Director on{' '}
                  {new Date(viewPlanModal.regionalDeployments[region].deployedAt).toLocaleString()}
                </p>
                {viewPlanModal.status === 'FINALIZED' && (
                  <p className="text-xs text-green-700 mt-1">
                    ✓ Audit cases have been generated and are ready for team leader assignment
                  </p>
                )}
              </div>
            )}

            {/* Regional Feedback */}
            {viewPlanModal.regionalFeedback?.[region]?.feedback && (
              <div className="bg-blue-50 dark:bg-slate-800 rounded-xl p-4 border border-blue-200 dark:border-slate-600">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-400 mb-2">💬 Regional Director Feedback</p>
                <p className="text-sm text-blue-800 dark:text-blue-300 italic">
                  "{viewPlanModal.regionalFeedback[region].feedback}"
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
