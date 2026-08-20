import React, { useState, useEffect } from 'react';
import { useData } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import Badge from '../Badge';

/**
 * SeniorManagementApprovalView - COMPLETELY REBUILT
 * Using NEW method: Simple status-based filtering like DirectorView
 * 
 * NEW WORKFLOW:
 * 1. Senior Management receives plans with status: 'SUBMITTED_TO_SENIOR_MANAGEMENT'
 * 2. Reviews director's recommendation
 * 3. Makes final decision: APPROVE or REJECT
 * 4. Updates status: 'SENIOR_MANAGEMENT_APPROVED' or 'SENIOR_MANAGEMENT_REJECTED'
 */

function SeniorManagementApprovalView() {
  const { getUserInfo } = useAuth();
  const { data, updateData } = useData();
  const userInfo = getUserInfo();

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [decision, setDecision] = useState('APPROVE');
  const [comments, setComments] = useState('');
  const [showDecisionForm, setShowDecisionForm] = useState(false);

  const auditTypes = ['desk_audit', 'field_audit', 'joint_audit', 'transfer_pricing', 'comprehensive', 'issue_audit'];
  const auditTypeLabels = {
    desk_audit: 'Desk Audit',
    field_audit: 'Field Audit',
    joint_audit: 'Joint Audit',
    transfer_pricing: 'Transfer Pricing',
    comprehensive: 'Comprehensive',
    issue_audit: 'Issue Audit'
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = () => {
    setLoading(true);
    // Using data from hook

    // ✅ NEW METHOD: Filter by status field (like DirectorView)
    // Show plans submitted to senior management or already decided
    const decisionPlans = (data.plans || []).filter(plan => {
      return plan.status === 'SUBMITTED_TO_SENIOR_MANAGEMENT' || 
             plan.status === 'SENIOR_MANAGEMENT_APPROVED' ||
             plan.status === 'SENIOR_MANAGEMENT_REJECTED';
    });

    console.log(`✅ Senior Management: Found ${decisionPlans.length} plans for decision`, {
      pending: decisionPlans.filter(p => p.status === 'SUBMITTED_TO_SENIOR_MANAGEMENT').length,
      approved: decisionPlans.filter(p => p.status === 'SENIOR_MANAGEMENT_APPROVED').length,
      rejected: decisionPlans.filter(p => p.status === 'SENIOR_MANAGEMENT_REJECTED').length
    });
    setPlans(decisionPlans);
    setLoading(false);
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    setShowDecisionForm(false);
    setDecision('APPROVE');
    setComments('');
  };

  const handleMakeDecision = () => {
    if (!selectedPlan) return;

    // Using data from hook
    const plan = data.plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    // ✅ DUPLICATE PREVENTION: Check if already decided
    if (plan.status === 'SENIOR_MANAGEMENT_APPROVED' || plan.status === 'SENIOR_MANAGEMENT_REJECTED') {
      alert('❌ Decision already made on this plan!\n\n' +
            `Status: ${plan.status}\n` +
            'Cannot change decision once submitted.');
      return;
    }

    // ✅ STATUS CHECK: Only allow if in correct status
    if (plan.status !== 'SUBMITTED_TO_SENIOR_MANAGEMENT') {
      alert(`❌ Cannot process this plan!\n\nCurrent status: ${plan.status}\nRequired status: SUBMITTED_TO_SENIOR_MANAGEMENT`);
      return;
    }

    // ✅ OPTIONAL COMMENTS: Like regional feedback pattern
    if (!comments.trim()) {
      const confirmWithoutComments = window.confirm(
        'No comments provided. Continue with decision anyway?\n\n(Comments are optional)'
      );
      if (!confirmWithoutComments) return;
    }

    // ✅ Track decision in approval history
    plan.approvalHistory = plan.approvalHistory || [];
    plan.approvalHistory.push({
      action: decision === 'APPROVE' ? 'APPROVED_BY_SENIOR_MANAGEMENT' : 'REJECTED_BY_SENIOR_MANAGEMENT',
      by: userInfo?.fullName || 'Senior Management',
      date: new Date().toISOString(),
      notes: comments || 'Decision made without additional comments',
      version: plan.version
    });

    // ✅ Update plan status
    if (decision === 'APPROVE') {
      plan.status = 'SENIOR_MANAGEMENT_APPROVED';
      plan.approvedDate = new Date().toISOString();
      plan.approvedBy = userInfo?.fullName || 'Senior Management';
    } else {
      plan.status = 'SENIOR_MANAGEMENT_REJECTED';
      plan.rejectionDate = new Date().toISOString();
      plan.rejectionReason = comments || 'Plan rejected';
    }

    plan.lastModified = new Date().toISOString();
    updateData(data);

    console.log('✅ SENIOR MANAGEMENT DECISION:', {
      planId: plan.id,
      decision: decision,
      newStatus: plan.status,
      hasComments: !!comments
    });

    alert(decision === 'APPROVE' ? 
      '✅ Plan APPROVED! The plan is ready for execution.' :
      '❌ Plan REJECTED. The plan has been sent back for revision.'
    );
    
    setSelectedPlan(null);
    setComments('');
    setDecision('APPROVE');
    setShowDecisionForm(false);
    loadPlans();
  };

  const getPlanDetails = () => {
    if (!selectedPlan) return null;
    return plans.find(p => p.id === selectedPlan);
  };

  const planDetails = getPlanDetails();

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="detail-header mb-6">
        <h2 className="text-2xl font-bold text-text-hi dark:text-text-hi flex items-center gap-2">
          <i className="fas fa-gavel"></i> Final Approval
        </h2>
        <p className="text-text-mid dark:text-text-mid mt-2">
          Review and approve audit plans
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Plans List */}
        <div className="lg:col-span-1">
          <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg">
            <div className="px-4 py-3 border-b border-border dark:border-border">
              <h3 className="text-text-hi dark:text-text-hi font-bold m-0">
                Plans Awaiting Decision ({plans.filter(p => p.status === 'SUBMITTED_TO_SENIOR_MANAGEMENT').length})
              </h3>
            </div>

            {loading ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">Loading...</div>
            ) : plans.length === 0 ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">
                No plans pending approval
              </div>
            ) : (
              <div className="divide-y divide-border dark:divide-border max-h-96 overflow-y-auto">
                {plans.map(plan => (
                  <div
                    key={plan.id}
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedPlan === plan.id
                        ? 'bg-teal/20 dark:bg-teal/20 border-l-4 border-teal dark:border-teal'
                        : 'hover:bg-ink dark:hover:bg-ink'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-bold text-text-hi dark:text-text-hi m-0">{plan.id}</p>
                        <p className="text-xs text-text-mid dark:text-text-mid m-0 mt-1">{plan.name}</p>
                        <Badge 
                          status={plan.status === 'SUBMITTED_TO_SENIOR_MANAGEMENT' ? 'pending' : 
                                  plan.status === 'SENIOR_MANAGEMENT_APPROVED' ? 'approved' : 'rejected'}
                          text={plan.status}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Approval Review */}
        <div className="lg:col-span-2">
          {planDetails ? (
            <div>
              {/* Plan Summary */}
              <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4 mb-6">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Plan Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Plan ID</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">{planDetails.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Fiscal Year</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">{planDetails.fiscalYear}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Status</p>
                    <Badge status={planDetails.status} text={planDetails.status} className="mt-1" />
                  </div>
                </div>
              </div>

              {/* Plan Allocations */}
              <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4 mb-6">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Audit Type Allocations</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-ink dark:bg-ink">
                      <tr>
                        <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Audit Type</th>
                        <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">Count</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border dark:divide-border">
                      {auditTypes.map(type => (
                        <tr key={type}>
                          <td className="p-2 text-text-hi dark:text-text-hi font-bold">
                            {auditTypeLabels[type]}
                          </td>
                          <td className="p-2 text-center text-text-mid dark:text-text-mid">
                            {planDetails.auditTypeAllocation?.[type] || 0}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-ink dark:bg-ink font-bold">
                        <td className="p-2 text-text-hi dark:text-text-hi">TOTAL</td>
                        <td className="p-2 text-center text-text-hi dark:text-text-hi">
                          {Object.values(planDetails.auditTypeAllocation || {}).reduce((a, b) => a + b, 0)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Decision Form */}
              {showDecisionForm ? (
                <div className="bg-teal/10 dark:bg-teal/10 border border-teal dark:border-teal rounded p-4">
                  <h4 className="text-teal dark:text-teal font-bold m-0 mb-3">Make Final Decision</h4>
                  
                  {/* Decision */}
                  <div className="mb-4">
                    <label className="block text-text-hi dark:text-text-hi font-bold text-sm mb-2">
                      Decision *
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="APPROVE"
                          checked={decision === 'APPROVE'}
                          onChange={(e) => setDecision(e.target.value)}
                          className="cursor-pointer"
                        />
                        <span className="text-text-hi dark:text-text-hi text-sm font-bold">✅ APPROVE PLAN</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="REJECT"
                          checked={decision === 'REJECT'}
                          onChange={(e) => setDecision(e.target.value)}
                          className="cursor-pointer"
                        />
                        <span className="text-text-hi dark:text-text-hi text-sm font-bold">❌ REJECT PLAN</span>
                      </label>
                    </div>
                  </div>

                  {/* Comments */}
                  <div className="mb-4">
                    <label className="block text-text-hi dark:text-text-hi font-bold text-sm mb-2">
                      Comments *
                    </label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Provide comments on your decision..."
                      className="w-full px-3 py-2 rounded border border-border dark:border-border bg-ink dark:bg-ink text-text-primary dark:text-text-primary text-sm"
                      rows="3"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleMakeDecision}
                      className={`flex-1 px-3 py-2 rounded font-bold text-white text-sm ${
                        decision === 'APPROVE' 
                          ? 'bg-teal dark:bg-teal hover:bg-teal/80 dark:hover:bg-teal/80' 
                          : 'bg-danger dark:bg-danger hover:bg-danger/80 dark:hover:bg-danger/80'
                      }`}
                    >
                      {decision === 'APPROVE' ? '✅ Approve Plan' : '❌ Reject Plan'}
                    </button>
                    <button
                      onClick={() => {
                        setShowDecisionForm(false);
                        setComments('');
                      }}
                      className="px-3 py-2 rounded font-bold bg-gray-600 dark:bg-gray-600 text-white hover:bg-gray-500 dark:hover:bg-gray-500 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowDecisionForm(true)}
                  disabled={planDetails.status !== 'SUBMITTED_TO_SENIOR_MANAGEMENT'}
                  className="w-full py-3 px-4 rounded font-bold bg-teal dark:bg-teal text-white hover:bg-teal/80 dark:hover:bg-teal/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🎯 Make Final Decision
                </button>
              )}
            </div>
          ) : (
            <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-8 text-center">
              <p className="text-text-mid dark:text-text-mid m-0">
                Select a plan to review and approve
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SeniorManagementApprovalView;
