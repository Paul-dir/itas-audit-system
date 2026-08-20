import React, { useState, useEffect } from 'react';
import Card from '../Card';
import Badge from '../Badge';
import PlanDetailsView from './PlanDetailsView';
import RiskEngineView from './RiskEngineView';
import { useData } from '../../services/dataService';
import { seniorManagementApprove, seniorManagementReject, getStatusDisplay, getBadgeClass, directorResubmitRejectedPlan } from '../../utils/businessLogic';

function SeniorManagementView({ currentView }) {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [viewMode, setViewMode] = useState('plans'); // 'plans' or 'risk-engine'
  const { data } = useData();

  useEffect(() => {
    if (currentView === 'risk-engine') {
      setViewMode('risk-engine');
    } else {
      setViewMode('plans');
    }
  }, [currentView]);

  const loadPlans = () => {
    // Show plans submitted to senior management or already approved/rejected
    const seniorPlans = (data?.plans || []).filter(p => 
      p.status === 'SUBMITTED_TO_SENIOR_MANAGEMENT' || 
      p.status === 'SENIOR_MANAGEMENT_APPROVED' ||
      p.status === 'SENIOR_MANAGEMENT_REJECTED'
    );
    setPlans(seniorPlans);
    console.log('Senior Management plans loaded:', seniorPlans.length, 'plans');
  };

  useEffect(() => {
    loadPlans();
  }, [data]);

  const handleApprove = (planId) => {
    const notes = prompt('Enter approval notes (optional):');
    console.log('Senior Management approving plan:', planId, 'with notes:', notes);
    if (seniorManagementApprove(planId, notes || '')) {
      alert('✅ Plan approved by Senior Management!\n\nThe finalized plan is now ready for deployment to audit teams.');
      loadPlans();
      setSelectedPlan(null);
    } else {
      alert('❌ Cannot approve. Plan must be submitted to Senior Management.');
    }
  };

  const handleReject = (planId) => {
    const feedback = prompt('Enter feedback for rejection (required):\n\nBe specific about what needs to be revised:');
    if (feedback && seniorManagementReject(planId, feedback)) {
      alert('⚠️ Plan rejected. The Director will be notified and can revise and resubmit.');
      loadPlans();
      setSelectedPlan(null);
    } else if (!feedback) {
      alert('Feedback is required for rejection.');
    }
  };

  if (viewMode === 'risk-engine') {
    return (
      <div>
        <div className="action-bar">
          <button className="btn btn-outline" onClick={() => setViewMode('plans')}>
            <i className="fas fa-arrow-left"></i> Back to Plans
          </button>
        </div>
        <RiskEngineView userRole="senior_management" />
      </div>
    );
  }

  if (selectedPlan) {
    return (
      <>
        <PlanDetailsView 
          plan={selectedPlan}
          onBack={() => setSelectedPlan(null)}
        />
        <div className="action-bar" style={{ marginTop: '20px' }}>
          <div></div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {selectedPlan.status === 'SUBMITTED_TO_SENIOR_MANAGEMENT' && (
              <>
                <button className="btn btn-success" onClick={() => { handleApprove(selectedPlan.id); }}>
                  <i className="fas fa-check"></i> Approve Plan
                </button>
                <button className="btn btn-danger" onClick={() => { handleReject(selectedPlan.id); }}>
                  <i className="fas fa-times"></i> Reject & Request Revision
                </button>
              </>
            )}
            {selectedPlan.status === 'SENIOR_MANAGEMENT_APPROVED' && (
              <Badge status="Approved" className="senior-approved" />
            )}
            {selectedPlan.status === 'SENIOR_MANAGEMENT_REJECTED' && (
              <Badge status="Rejected" className="rejected" />
            )}
          </div>
        </div>
      </>
    );
  }

  const stats = {
    pending: plans.filter(p => p.status === 'SUBMITTED_TO_SENIOR_MANAGEMENT').length,
    approved: plans.filter(p => p.status === 'SENIOR_MANAGEMENT_APPROVED').length,
    rejected: plans.filter(p => p.status === 'SENIOR_MANAGEMENT_REJECTED').length,
  };

  return (
    <div>
      {/* Plan Selector */}
      {plans && plans.length > 1 && (
        <div className="bg-slate-900 dark:bg-slate-800 p-4 rounded mb-6 border-4 border-blue-500 dark:border-blue-600 flex gap-4 items-center flex-wrap shadow-lg shadow-blue-500/20">
          <label className="text-sm font-bold text-blue-500 dark:text-blue-400 whitespace-nowrap">
            <i className="fas fa-file-alt"></i> QUICK SELECT:
          </label>
          <select
            value={selectedPlan ? selectedPlan.id : ''}
            onChange={(e) => {
              const plan = plans.find(p => p.id === e.target.value);
              if (plan) setSelectedPlan(plan);
            }}
            className="px-4 py-3 rounded border-2 border-blue-500 dark:border-blue-400 text-sm font-bold cursor-pointer bg-slate-950 dark:bg-slate-900 min-w-60 text-slate-400 dark:text-slate-300"
          >
            <option value="">-- Select a plan to review --</option>
            {plans.map(plan => (
              <option key={plan.id} value={plan.id}>
                {plan.id} (v{plan.version}) - {plan.status.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
          <span className="text-xs text-blue-500 dark:text-blue-400 font-semibold">
            {plans.length} plan(s) in review
          </span>
        </div>
      )}

      <div className="cards">
        <Card title="Pending Approval" number={stats.pending} icon="fas fa-hourglass-half" />
        <Card title="Approved" number={stats.approved} icon="fas fa-check-circle" />
        <Card title="Rejected" number={stats.rejected} icon="fas fa-times-circle" />
      </div>

      <div className="section-title"><i className="fas fa-clipboard-check"></i> Audit Plans for Senior Management Review</div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Plan ID</th>
              <th>Fiscal Year</th>
              <th>Total Cases</th>
              <th>Submitted Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {plans.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-10">
                <i className="fas fa-inbox text-gray-400 dark:text-gray-600 text-4xl block mb-4"></i>
                <span>No audit plans for Senior Management review</span>
              </td></tr>
            ) : (
              plans.map(plan => {
                const submissionDate = plan.approvalHistory?.find(h => h.action === 'SUBMITTED_TO_SENIOR_MANAGEMENT')?.date;
                return (
                  <tr key={plan.id}>
                    <td><strong>{plan.id}</strong></td>
                    <td>{plan.fiscalYear}</td>
                    <td>{plan.totalVolume}</td>
                    <td>{submissionDate ? new Date(submissionDate).toLocaleDateString() : '-'}</td>
                    <td><Badge status={getStatusDisplay(plan.status)} className={getBadgeClass(plan.status)} /></td>
                    <td>
                      <button className="btn btn-sm btn-info" onClick={() => setSelectedPlan(plan)}>
                        <i className="fas fa-eye"></i> View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900 text-slate-900 dark:text-slate-100 p-4 rounded mt-5 border border-blue-400 dark:border-blue-600">
        <strong><i className="fas fa-info-circle"></i> Senior Management Review</strong>
        <p className="text-slate-700 dark:text-slate-300 m-2 text-xs leading-relaxed">
          As the Risk Management Committee, your approval is required for all amended audit plans before they can be finalized 
          and sent to auditors at tax centers for cascading to audit cases. Review each plan carefully, check alignment with 
          strategic priorities, and ensure adequate resource allocation before approving.
        </p>
      </div>
    </div>
  );
}

export default SeniorManagementView;
