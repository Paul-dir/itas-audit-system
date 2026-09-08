import React, { useState, useEffect } from 'react';
import { useData } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import Badge from '../Badge';

/**
 * SeniorManagementFinalApproval - SINGLE, UNIFIED page for Final Approval
 * 
 * Replaces: SeniorManagementApprovalView (old scattered logic)
 * 
 * WORKFLOW:
 * 1. Show all plans with status: SUBMITTED_TO_SENIOR_MANAGEMENT
 * 2. Allow Senior Management to:
 *    ✅ APPROVE → SENIOR_MANAGEMENT_APPROVED (plan locked)
 *    ❌ REJECT → SENIOR_MANAGEMENT_REJECTED (sent back for revision)
 */

function SeniorManagementFinalApproval() {
  const { getUserInfo } = useAuth();
  const userInfo = getUserInfo();
  const { data, updateData } = useData();

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [componentLoading, setComponentLoading] = useState(true);
  const [showDecisionForm, setShowDecisionForm] = useState(false);
  const [decision, setDecision] = useState('APPROVE');
  const [comments, setComments] = useState('');

  const auditTypes = ['desk_audit', 'field_audit', 'joint_audit', 'transfer_pricing', 'comprehensive', 'issue_audit'];
  const auditTypeLabels = {
    desk_audit: 'Desk Audit',
    field_audit: 'Field Audit',
    joint_audit: 'Joint Audit',
    transfer_pricing: 'Transfer Pricing',
    comprehensive: 'Comprehensive',
    issue_audit: 'Issue Audit'
  };

  const loadPlans = () => {
    setComponentLoading(true);

    // Get all plans submitted to senior management
    const seniorMgmtPlans = (data?.plans || []).filter(plan => {
      return plan.status === 'SUBMITTED_TO_SENIOR_MANAGEMENT' ||
             plan.status === 'SENIOR_MANAGEMENT_APPROVED' ||
             plan.status === 'SENIOR_MANAGEMENT_REJECTED';
    });

    console.log(`✅ Senior Management: Found ${seniorMgmtPlans.length} plans`, {
      pending: seniorMgmtPlans.filter(p => p.status === 'SUBMITTED_TO_SENIOR_MANAGEMENT').length,
      approved: seniorMgmtPlans.filter(p => p.status === 'SENIOR_MANAGEMENT_APPROVED').length,
      rejected: seniorMgmtPlans.filter(p => p.status === 'SENIOR_MANAGEMENT_REJECTED').length
    });

    setPlans(seniorMgmtPlans);
    setComponentLoading(false);
  };

  useEffect(() => {
    if (data) {
      loadPlans();
    }
  }, [data]);

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    setShowDecisionForm(false);
    setDecision('APPROVE');
    setComments('');
  };

  const handleMakeDecision = () => {
    if (!comments.trim()) {
      const confirm = window.confirm('No comments provided. Continue anyway?\n\n(Comments are optional)');
      if (!confirm) return;
    }

    if (!selectedPlan) return;

    const updatedData = { ...data };
    const plan = updatedData.plans.find(p => p.id === selectedPlan);
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
      plan.rejectionReason = comments || 'Plan rejected by Senior Management';
    }

    plan.lastModified = new Date().toISOString();
    updateData(updatedData);

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
  };

  const getPendingPlans = () => plans.filter(p => p.status === 'SUBMITTED_TO_SENIOR_MANAGEMENT');
  const getApprovedPlans = () => plans.filter(p => p.status === 'SENIOR_MANAGEMENT_APPROVED');
  const getRejectedPlans = () => plans.filter(p => p.status === 'SENIOR_MANAGEMENT_REJECTED');

  const planDetails = selectedPlan ? plans.find(p => p.id === selectedPlan) : null;
  const pendingPlans = getPendingPlans();
  const approvedPlans = getApprovedPlans();
  const rejectedPlans = getRejectedPlans();

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="detail-header mb-6">
        <h2 className="text-2xl font-bold text-text-hi dark:text-text-hi flex items-center gap-2">
          <i className="fas fa-gavel"></i> Final Approval
        </h2>
        <p className="text-text-mid dark:text-text-mid mt-2">
          Review and approve annual audit plans for execution
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Plans List */}
        <div className="lg:col-span-1">
          <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg">
            {/* List Header with counts */}
            <div className="px-4 py-3 border-b border-border dark:border-border">
              <h3 className="text-text-hi dark:text-text-hi font-bold m-0">Plans</h3>
              <div className="mt-3 flex gap-2 text-xs">
                <span className="px-2 py-1 rounded bg-orange/20 dark:bg-orange/20 text-orange dark:text-orange font-bold">
                  Pending: {pendingPlans.length}
                </span>
                <span className="px-2 py-1 rounded bg-teal/20 dark:bg-teal/20 text-teal dark:text-teal font-bold">
                  Approved: {approvedPlans.length}
                </span>
                <span className="px-2 py-1 rounded bg-danger/20 dark:bg-danger/20 text-danger dark:text-danger font-bold">
                  Rejected: {rejectedPlans.length}
                </span>
              </div>
            </div>

            {/* Plans List */}
            {componentLoading ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">Loading...</div>
            ) : plans.length === 0 ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">
                No plans submitted for approval
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
                    <p className="font-bold text-text-hi dark:text-text-hi m-0">{plan.id}</p>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0 mt-1">{plan.name}</p>
                    <div className="mt-2">
                      {plan.status === 'SUBMITTED_TO_SENIOR_MANAGEMENT' && (
                        <Badge status="pending" text="Awaiting Decision" />
                      )}
                      {plan.status === 'SENIOR_MANAGEMENT_APPROVED' && (
                        <Badge status="approved" text="Approved" />
                      )}
                      {plan.status === 'SENIOR_MANAGEMENT_REJECTED' && (
                        <Badge status="rejected" text="Rejected" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Plan Details & Decision Form */}
        <div className="lg:col-span-2">
          {planDetails ? (
            <div>
              {/* Plan Info */}
              <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4 mb-6">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Plan Information</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Plan ID</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">{planDetails.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Fiscal Year</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">{planDetails.fiscalYear}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Total Cases</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">{planDetails.totalCases}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Status</p>
                    <Badge status={planDetails.status} text={planDetails.status} className="mt-1" />
                  </div>
                </div>
              </div>

              {/* Audit Allocations */}
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
                          <td className="p-2 text-text-hi dark:text-text-hi font-bold text-xs">
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
                <div className="bg-teal/10 dark:bg-teal/10 border border-teal dark:border-teal rounded-lg p-4">
                  <h4 className="text-teal dark:text-teal font-bold m-0 mb-3">Make Final Decision</h4>
                  
                  {/* Decision Radio */}
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
                      Comments (optional)
                    </label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Add any comments on your decision..."
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

              {/* Approval History */}
              {planDetails.approvalHistory && planDetails.approvalHistory.length > 0 && (
                <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4 mt-6">
                  <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Approval History</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {planDetails.approvalHistory.slice().reverse().map((record, idx) => (
                      <div key={idx} className="bg-ink dark:bg-ink p-2 rounded border border-border dark:border-border text-xs">
                        <div className="flex justify-between mb-1">
                          <p className="font-bold text-text-hi dark:text-text-hi m-0">{record.action}</p>
                          <p className="text-text-mid dark:text-text-mid m-0">
                            {new Date(record.date).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-text-mid dark:text-text-mid m-0">By: {record.by}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-8 text-center">
              <p className="text-text-mid dark:text-text-mid m-0">
                Select a plan to review and make a decision
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SeniorManagementFinalApproval;
