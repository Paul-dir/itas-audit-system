import React, { useState, useEffect } from 'react';
import { useData } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import Badge from '../Badge';

/**
 * DirectorPlanReview - SINGLE, UNIFIED page for ALL plan review workflows
 * 
 * This replaces multiple scattered views:
 * - OLD: review-queue (plan review)
 * - OLD: amended-plans (accept amendments)
 * - OLD: review-regional-feedback (send to planning/senior management)
 * 
 * NEW: Single workflow showing all plan stages
 * 
 * STAGES:
 * 1. SUBMITTED_TO_DIRECTOR - Review and make decision
 *    → Send to Planning Team for Amendment (REVISION_REQUESTED)
 *    → Submit directly to Senior Management (SUBMITTED_TO_SENIOR_MANAGEMENT)
 * 2. RESUBMITTED_TO_DIRECTOR - Accept amendments
 *    → Accept and approve (DIRECTOR_APPROVED)
 *    → Send back to Planning Team (REVISION_REQUESTED)
 * 3. DIRECTOR_APPROVED - Submit to Senior Management
 *    → Submit recommendation (SUBMITTED_TO_SENIOR_MANAGEMENT)
 */

function DirectorPlanReview() {
  const { getUserInfo } = useAuth();
  const userInfo = getUserInfo();
  const { data, updateData } = useData();

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'amendments', 'approved'
  const [showActionForm, setShowActionForm] = useState(false);
  const [actionType, setActionType] = useState(null); // 'send-to-planning', 'accept-amendments', 'send-to-senior', 'submit-to-regions'
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

  useEffect(() => {
    if (data) {
      loadPlans();
    }
  }, [data]);

  const loadPlans = () => {
    setLoading(true);

    // Get all plans that need director action
    const directorPlans = (data?.plans || []).filter(plan => {
      return plan.status === 'SUBMITTED_TO_DIRECTOR' ||
             plan.status === 'RESUBMITTED_TO_DIRECTOR' ||
             plan.status === 'DIRECTOR_APPROVED';
    });

    console.log(`✅ Director Plan Review: Found ${directorPlans.length} plans`, {
      pending: directorPlans.filter(p => p.status === 'SUBMITTED_TO_DIRECTOR').length,
      amendments: directorPlans.filter(p => p.status === 'RESUBMITTED_TO_DIRECTOR').length,
      approved: directorPlans.filter(p => p.status === 'DIRECTOR_APPROVED').length
    });

    setPlans(directorPlans);
    setLoading(false);
  };

  const getTabPlans = () => {
    switch(activeTab) {
      case 'pending':
        return plans.filter(p => p.status === 'SUBMITTED_TO_DIRECTOR');
      case 'amendments':
        return plans.filter(p => p.status === 'RESUBMITTED_TO_DIRECTOR');
      case 'approved':
        return plans.filter(p => p.status === 'DIRECTOR_APPROVED');
      default:
        return [];
    }
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    setShowActionForm(false);
    setActionType(null);
    setComments('');
  };

  const handleAction = (type) => {
    setActionType(type);
    setShowActionForm(true);
    setComments('');
  };

  const handleConfirmAction = () => {
    if (!comments.trim()) {
      const confirm = window.confirm('No comments provided. Continue anyway?\n\n(Comments are optional)');
      if (!confirm) return;
    }

    if (!selectedPlan) return;

    const updatedData = { ...data };
    const plan = updatedData.plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    // ✅ DUPLICATE PREVENTION
    if (actionType === 'send-to-planning' && plan.directorFeedbackToPlanning?.sentForAmendment) {
      alert('❌ Plan already sent to Planning Team!');
      return;
    }

    if (actionType === 'send-to-senior' && plan.directorRecommendation?.sentToSeniorManagement) {
      alert('❌ Plan already sent to Senior Management!');
      return;
    }

    // ✅ EXECUTE ACTION
    switch(actionType) {
      case 'send-to-planning':
        // Director sends to Planning Team for amendment
        plan.status = 'REVISION_REQUESTED';
        plan.directorFeedbackToPlanning = {
          sentForAmendment: true,
          sentDate: new Date().toISOString(),
          sentBy: userInfo?.fullName || 'Director',
          remarks: comments || 'Please review and amend allocations'
        };
        plan.approvalHistory = plan.approvalHistory || [];
        plan.approvalHistory.push({
          action: 'SENT_TO_PLANNING_TEAM_FOR_AMENDMENT',
          by: userInfo?.fullName || 'Director',
          date: new Date().toISOString(),
          notes: comments || 'Please review and amend allocations',
          version: plan.version
        });
        alert('✅ Plan sent to Planning Team for amendment');
        break;

      case 'accept-amendments':
        // Director accepts amendments from Planning Team
        plan.status = 'DIRECTOR_APPROVED';
        plan.approvalHistory = plan.approvalHistory || [];
        plan.approvalHistory.push({
          action: 'APPROVED_BY_DIRECTOR',
          by: userInfo?.fullName || 'Director',
          date: new Date().toISOString(),
          notes: comments || 'Amendments accepted and approved',
          version: plan.version
        });
        alert('✅ Amendments accepted! Plan is now approved by Director');
        break;

      case 'send-to-senior':
        // Director submits to Senior Management
        plan.status = 'SUBMITTED_TO_SENIOR_MANAGEMENT';
        plan.directorRecommendation = {
          sentToSeniorManagement: true,
          sentDate: new Date().toISOString(),
          sentBy: userInfo?.fullName || 'Director',
          executiveSummary: comments || 'Plan ready for senior management review'
        };
        plan.approvalHistory = plan.approvalHistory || [];
        plan.approvalHistory.push({
          action: 'SENT_TO_SENIOR_MANAGEMENT',
          by: userInfo?.fullName || 'Director',
          date: new Date().toISOString(),
          notes: comments || 'Submitted for final approval',
          version: plan.version
        });
        alert('✅ Plan sent to Senior Management for final approval');
        break;

      case 'send-back-to-planning':
        // Director sends amendments back to Planning Team for more work
        plan.status = 'REVISION_REQUESTED';
        plan.approvalHistory = plan.approvalHistory || [];
        plan.approvalHistory.push({
          action: 'SENT_BACK_TO_PLANNING_TEAM',
          by: userInfo?.fullName || 'Director',
          date: new Date().toISOString(),
          notes: comments || 'Amendments need further review',
          version: plan.version
        });
        alert('❌ Plan sent back to Planning Team for further amendments');
        break;

      case 'submit-to-regions':
        // Director submits approved plan to regions for feedback collection
        plan.status = 'AWAITING_REGIONAL_FEEDBACK';
        plan.distributedToRegionsDate = new Date().toISOString();
        plan.approvalHistory = plan.approvalHistory || [];
        plan.approvalHistory.push({
          action: 'SUBMITTED_TO_REGIONS_FOR_FEEDBACK',
          by: userInfo?.fullName || 'Director',
          date: new Date().toISOString(),
          notes: comments || 'Plan submitted to regions for feedback collection',
          version: plan.version
        });
        alert('✅ Plan submitted to all regions for feedback collection!');
        break;

      default:
        break;
    }

    plan.lastModified = new Date().toISOString();
    updateData(updatedData);

    setSelectedPlan(null);
    setShowActionForm(false);
    setActionType(null);
    setComments('');
    loadPlans();
  };

  const getPlanDetails = () => {
    if (!selectedPlan) return null;
    return plans.find(p => p.id === selectedPlan);
  };

  const tabPlans = getTabPlans();
  const planDetails = getPlanDetails();

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="detail-header mb-6">
        <h2 className="text-2xl font-bold text-text-hi dark:text-text-hi flex items-center gap-2">
          <i className="fas fa-clipboard-list"></i> Plan Review
        </h2>
        <p className="text-text-mid dark:text-text-mid mt-2">
          Review, amend, and approve annual audit plans
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Tabs & Plans List */}
        <div className="lg:col-span-1">
          {/* Tabs */}
          <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg mb-4">
            <div className="flex border-b border-border dark:border-border">
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex-1 px-4 py-3 font-bold text-center transition-all ${
                  activeTab === 'pending'
                    ? 'bg-teal dark:bg-teal text-white'
                    : 'text-text-mid dark:text-text-mid hover:text-text-hi dark:hover:text-text-hi'
                }`}
              >
                Pending ({plans.filter(p => p.status === 'SUBMITTED_TO_DIRECTOR').length})
              </button>
              <button
                onClick={() => setActiveTab('amendments')}
                className={`flex-1 px-4 py-3 font-bold text-center transition-all ${
                  activeTab === 'amendments'
                    ? 'bg-teal dark:bg-teal text-white'
                    : 'text-text-mid dark:text-text-mid hover:text-text-hi dark:hover:text-text-hi'
                }`}
              >
                Amendments ({plans.filter(p => p.status === 'RESUBMITTED_TO_DIRECTOR').length})
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`flex-1 px-4 py-3 font-bold text-center transition-all ${
                  activeTab === 'approved'
                    ? 'bg-teal dark:bg-teal text-white'
                    : 'text-text-mid dark:text-text-mid hover:text-text-hi dark:hover:text-text-hi'
                }`}
              >
                Approved ({plans.filter(p => p.status === 'DIRECTOR_APPROVED').length})
              </button>
            </div>
          </div>

          {/* Plans List */}
          <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg">
            <div className="px-4 py-3 border-b border-border dark:border-border">
              <h3 className="text-text-hi dark:text-text-hi font-bold m-0">
                {activeTab === 'pending' && 'Plans Awaiting Review'}
                {activeTab === 'amendments' && 'Amended Plans'}
                {activeTab === 'approved' && 'Approved Plans'}
              </h3>
            </div>

            {loading ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">Loading...</div>
            ) : tabPlans.length === 0 ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">
                No plans in this stage
              </div>
            ) : (
              <div className="divide-y divide-border dark:divide-border max-h-96 overflow-y-auto">
                {tabPlans.map(plan => (
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
                    <Badge 
                      status={plan.status} 
                      text={plan.status}
                      className="mt-2"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Plan Details & Actions */}
        <div className="lg:col-span-2">
          {planDetails ? (
            <div>
              {/* Plan Info */}
              <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4 mb-6">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Plan Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">ID</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">{planDetails.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Year</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">{planDetails.fiscalYear}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Status</p>
                    <Badge status={planDetails.status} text={planDetails.status} className="mt-1" />
                  </div>
                </div>
              </div>

              {/* Allocations */}
              <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4 mb-6">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Audit Type Allocations</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-ink dark:bg-ink">
                      <tr>
                        <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Type</th>
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
                        <td className="p-2 text-text-hi dark:text-text-hi">Total</td>
                        <td className="p-2 text-center text-text-hi dark:text-text-hi">
                          {Object.values(planDetails.auditTypeAllocation || {}).reduce((a, b) => a + b, 0)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Form or Buttons */}
              {showActionForm ? (
                <div className="bg-teal/10 dark:bg-teal/10 border border-teal dark:border-teal rounded-lg p-4">
                  <h3 className="text-teal dark:text-teal font-bold mb-4">
                    {actionType === 'send-to-planning' && '📝 Send to Planning Team for Amendment'}
                    {actionType === 'accept-amendments' && '✅ Accept Amendments'}
                    {actionType === 'send-to-senior' && '📤 Submit to Senior Management'}
                    {actionType === 'send-back-to-planning' && '↩️ Send Back to Planning Team'}
                    {actionType === 'submit-to-regions' && '🚀 Submit to Regions for Feedback'}
                  </h3>

                  <div className="mb-4">
                    <label className="block text-text-hi dark:text-text-hi font-bold text-sm mb-2">
                      Comments (optional)
                    </label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Add any comments or remarks..."
                      className="w-full px-3 py-2 rounded border border-border dark:border-border bg-ink dark:bg-ink text-text-primary dark:text-text-primary text-sm"
                      rows="3"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleConfirmAction}
                      className="flex-1 px-3 py-2 rounded font-bold bg-teal dark:bg-teal text-white hover:bg-teal/80 dark:hover:bg-teal/80 text-sm"
                    >
                      {actionType === 'send-back-to-planning' ? '↩️ Send Back' : '✅ Confirm'}
                    </button>
                    <button
                      onClick={() => {
                        setShowActionForm(false);
                        setActionType(null);
                        setComments('');
                      }}
                      className="px-3 py-2 rounded font-bold bg-gray-600 dark:bg-gray-600 text-white hover:bg-gray-500 dark:hover:bg-gray-500 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {planDetails.status === 'SUBMITTED_TO_DIRECTOR' && (
                    <>
                      <button
                        onClick={() => handleAction('send-to-planning')}
                        className="w-full py-3 px-4 rounded font-bold bg-orange dark:bg-orange text-white hover:bg-orange/80 dark:hover:bg-orange/80 transition-all"
                      >
                        📝 Send to Planning Team for Amendment
                      </button>
                      <button
                        onClick={() => handleAction('submit-to-regions')}
                        className="w-full py-3 px-4 rounded font-bold bg-warning dark:bg-warning text-white hover:bg-warning/80 dark:hover:bg-warning/80 transition-all"
                      >
                        🚀 Submit to Regions for Feedback
                      </button>
                      <button
                        onClick={() => handleAction('send-to-senior')}
                        className="w-full py-3 px-4 rounded font-bold bg-teal dark:bg-teal text-white hover:bg-teal/80 dark:hover:bg-teal/80 transition-all"
                      >
                        📤 Submit Directly to Senior Management
                      </button>
                    </>
                  )}

                  {planDetails.status === 'RESUBMITTED_TO_DIRECTOR' && (
                    <>
                      <button
                        onClick={() => handleAction('accept-amendments')}
                        className="w-full py-3 px-4 rounded font-bold bg-teal dark:bg-teal text-white hover:bg-teal/80 dark:hover:bg-teal/80 transition-all"
                      >
                        ✅ Accept Amendments
                      </button>
                      <button
                        onClick={() => handleAction('send-back-to-planning')}
                        className="w-full py-3 px-4 rounded font-bold bg-orange dark:bg-orange text-white hover:bg-orange/80 dark:hover:bg-orange/80 transition-all"
                      >
                        ↩️ Send Back for More Amendments
                      </button>
                    </>
                  )}

                  {planDetails.status === 'DIRECTOR_APPROVED' && (
                    <>
                      <button
                        onClick={() => handleAction('submit-to-regions')}
                        className="w-full py-3 px-4 rounded font-bold bg-warning dark:bg-warning text-white hover:bg-warning/80 dark:hover:bg-warning/80 transition-all"
                      >
                        🚀 Submit to Regions for Feedback
                      </button>
                      <button
                        onClick={() => handleAction('send-to-senior')}
                        className="w-full py-3 px-4 rounded font-bold bg-teal dark:bg-teal text-white hover:bg-teal/80 dark:hover:bg-teal/80 transition-all"
                      >
                        📤 Submit to Senior Management
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-8 text-center">
              <p className="text-text-mid dark:text-text-mid m-0">
                Select a plan to view details and take action
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DirectorPlanReview;
