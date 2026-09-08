import React, { useState, useEffect } from 'react';
import { useData } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import Badge from '../Badge';

/**
 * DirectorInitialApprovalView - Director's Initial Plan Approval & Feedback Review
 * 
 * TWO MAIN WORKFLOWS:
 * 1. APPROVE CREATED PLANS (status: SUBMITTED_TO_DIRECTOR)
 *    - Review initial plan from Planning Team
 *    - Approve or send back for amendment
 * 
 * 2. REVIEW REGIONAL FEEDBACK (status: FEEDBACK_COLLECTED)
 *    - View all regional feedback collected
 *    - Accept feedback and proceed to next step
 *    - Send back to Planning Team if amendments needed
 */

function DirectorInitialApprovalView() {
  const { getUserInfo } = useAuth();
  const userInfo = getUserInfo();
  const { data, updateData } = useData();

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [componentLoading, setComponentLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'feedback'
  const [showActionForm, setShowActionForm] = useState(false);
  const [actionType, setActionType] = useState(null); // 'approve', 'reject-feedback', 'accept-feedback'
  const [comments, setComments] = useState('');
  const [showSubmitToRegionsForm, setShowSubmitToRegionsForm] = useState(false);
  const [submitNotes, setSubmitNotes] = useState('');

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

    // Get plans in approval workflow
    const directorPlans = (data?.plans || []).filter(plan => {
      return plan.status === 'SUBMITTED_TO_DIRECTOR' ||
             plan.status === 'APPROVED_BY_DIRECTOR' ||
             plan.status === 'AWAITING_REGIONAL_FEEDBACK' ||
             plan.status === 'FEEDBACK_COLLECTED';
    });

    console.log(`✅ Director Initial Approval: Found ${directorPlans.length} plans`, {
      pendingApproval: directorPlans.filter(p => p.status === 'SUBMITTED_TO_DIRECTOR').length,
      approved: directorPlans.filter(p => p.status === 'APPROVED_BY_DIRECTOR').length,
      awaitingFeedback: directorPlans.filter(p => p.status === 'AWAITING_REGIONAL_FEEDBACK').length,
      feedbackReady: directorPlans.filter(p => p.status === 'FEEDBACK_COLLECTED').length
    });

    setPlans(directorPlans);
    setComponentLoading(false);
  };

  useEffect(() => {
    if (data) {
      loadPlans();
    }
  }, [data]);

  const getTabPlans = () => {
    switch(activeTab) {
      case 'pending':
        // Show all plans in approval workflow (not yet submitted to regions)
        return plans.filter(p => 
          p.status === 'SUBMITTED_TO_DIRECTOR' || 
          p.status === 'APPROVED_BY_DIRECTOR' ||
          p.status === 'AWAITING_REGIONAL_FEEDBACK'
        );
      case 'feedback':
        return plans.filter(p => p.status === 'FEEDBACK_COLLECTED');
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

    // ✅ DUPLICATE PREVENTION & STATUS CHECKS
    if (actionType === 'approve' && plan.status !== 'SUBMITTED_TO_DIRECTOR') {
      alert(`❌ Cannot approve. Current status: ${plan.status}`);
      return;
    }

    if (actionType === 'accept-feedback' && plan.status !== 'FEEDBACK_COLLECTED') {
      alert(`❌ Cannot accept feedback. Current status: ${plan.status}`);
      return;
    }

    // ✅ EXECUTE ACTION
    switch(actionType) {
      case 'approve':
        // Director approves initial plan
        plan.status = 'APPROVED_BY_DIRECTOR';
        plan.directorApprovalDate = new Date().toISOString();
        plan.approvalHistory = plan.approvalHistory || [];
        plan.approvalHistory.push({
          action: 'APPROVED_BY_DIRECTOR_INITIAL',
          by: userInfo?.fullName || 'Director',
          date: new Date().toISOString(),
          notes: comments || 'Plan approved by director',
          version: plan.version
        });
        alert('✅ Plan approved! Ready to send to regions.');
        break;

      case 'reject-initial':
        // Director sends back for amendment
        plan.status = 'REVISION_REQUESTED';
        plan.approvalHistory = plan.approvalHistory || [];
        plan.approvalHistory.push({
          action: 'SENT_BACK_TO_PLANNING_TEAM',
          by: userInfo?.fullName || 'Director',
          date: new Date().toISOString(),
          notes: comments || 'Plan needs amendments before approval',
          version: plan.version
        });
        alert('❌ Plan sent back to Planning Team for amendments.');
        break;

      case 'accept-feedback':
        // Director accepts regional feedback
        plan.feedbackAcceptedDate = new Date().toISOString();
        plan.feedbackAcceptedBy = userInfo?.fullName || 'Director';
        plan.approvalHistory = plan.approvalHistory || [];
        plan.approvalHistory.push({
          action: 'FEEDBACK_ACCEPTED_BY_DIRECTOR',
          by: userInfo?.fullName || 'Director',
          date: new Date().toISOString(),
          notes: comments || 'Regional feedback reviewed and accepted',
          version: plan.version
        });
        alert('✅ Feedback accepted! Ready to send to Planning Team for amendments.');
        break;

      case 'reject-feedback':
        // Director wants more feedback or changes
        plan.status = 'REVISION_REQUESTED';
        plan.approvalHistory = plan.approvalHistory || [];
        plan.approvalHistory.push({
          action: 'FEEDBACK_REJECTED_SEND_TO_REGIONS',
          by: userInfo?.fullName || 'Director',
          date: new Date().toISOString(),
          notes: comments || 'Need additional feedback from regions',
          version: plan.version
        });
        alert('❌ Plan sent back to regions for additional feedback.');
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
  };

  const handleSubmitToRegions = () => {
    if (!selectedPlan) return;

    if (!submitNotes.trim()) {
      const confirm = window.confirm(
        'No submission notes provided. Continue anyway?\n\n(Notes are optional)'
      );
      if (!confirm) return;
    }

    const updatedData = { ...data };
    const plan = updatedData.plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    // ✅ Allow submission if plan is APPROVED_BY_DIRECTOR
    if (plan.status !== 'APPROVED_BY_DIRECTOR') {
      alert(`❌ Cannot submit! Current status: ${plan.status}\n\nPlans must be APPROVED_BY_DIRECTOR to submit to regions.`);
      return;
    }

    // ✅ Update plan status
    plan.status = 'AWAITING_REGIONAL_FEEDBACK';
    plan.distributedToRegionsDate = new Date().toISOString();
    plan.lastModified = new Date().toISOString();

    // ✅ Track in approval history
    plan.approvalHistory = plan.approvalHistory || [];
    plan.approvalHistory.push({
      action: 'SUBMITTED_TO_REGIONS_FOR_FEEDBACK',
      by: userInfo?.fullName || 'Director',
      date: new Date().toISOString(),
      notes: submitNotes || 'Plan submitted to regions for feedback collection',
      version: plan.version
    });

    console.log('✅ PLAN SUBMITTED TO REGIONS:', {
      planId: plan.id,
      status: 'AWAITING_REGIONAL_FEEDBACK',
      hasNotes: !!submitNotes
    });

    updateData(updatedData);

    alert('✅ Plan submitted to all regions for feedback collection!');
    setSelectedPlan(null);
    setShowSubmitToRegionsForm(false);
    setSubmitNotes('');
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
          <i className="fas fa-clipboard-check"></i> Initial Plan Approval
        </h2>
        <p className="text-text-mid dark:text-text-mid mt-2">
          Approve created plans and review regional feedback
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
                    ? 'bg-warning dark:bg-warning text-white'
                    : 'text-text-mid dark:text-text-mid hover:text-text-hi dark:hover:text-text-hi'
                }`}
              >
                Approval Workflow ({plans.filter(p => p.status === 'SUBMITTED_TO_DIRECTOR' || p.status === 'APPROVED_BY_DIRECTOR' || p.status === 'AWAITING_REGIONAL_FEEDBACK').length})
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`flex-1 px-4 py-3 font-bold text-center transition-all ${
                  activeTab === 'feedback'
                    ? 'bg-info dark:bg-info text-white'
                    : 'text-text-mid dark:text-text-mid hover:text-text-hi dark:hover:text-text-hi'
                }`}
              >
                Feedback Ready ({plans.filter(p => p.status === 'FEEDBACK_COLLECTED').length})
              </button>
            </div>
          </div>

          {/* Plans List */}
          <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg">
            {componentLoading ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">Loading...</div>
            ) : tabPlans.length === 0 ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">
                {activeTab === 'pending' ? 'No plans awaiting approval' : 'No plans with feedback ready'}
              </div>
            ) : (
              <div className="divide-y divide-border dark:divide-border max-h-96 overflow-y-auto">
                {tabPlans.map(plan => (
                  <div
                    key={plan.id}
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedPlan === plan.id
                        ? activeTab === 'pending'
                          ? 'bg-warning/20 dark:bg-warning/20 border-l-4 border-warning dark:border-warning'
                          : 'bg-info/20 dark:bg-info/20 border-l-4 border-info dark:border-info'
                        : 'hover:bg-ink dark:hover:bg-ink'
                    }`}
                  >
                    <p className="font-bold text-text-hi dark:text-text-hi m-0">{plan.id}</p>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0 mt-1">{plan.name}</p>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0 mt-1">
                      Year: {plan.fiscalYear} • Cases: {plan.totalCases}
                    </p>
                    <div className="mt-2">
                      {activeTab === 'pending' ? (
                        <Badge status="pending" text="Awaiting Approval" />
                      ) : (
                        <Badge status="info" text="Feedback Ready" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Plan Details */}
        <div className="lg:col-span-2">
          {planDetails ? (
            <div className="space-y-6">
              {/* Status Alert - Show submission confirmation */}
              {planDetails.status === 'AWAITING_REGIONAL_FEEDBACK' && (
                <div className="bg-success/20 dark:bg-success/20 border-2 border-success dark:border-success rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fas fa-check-circle text-success"></i>
                    <h4 className="text-success dark:text-success font-bold m-0">✅ Plan Submitted to Regions</h4>
                  </div>
                  <p className="text-xs text-text-mid dark:text-text-mid m-0">
                    This plan has been distributed to all regions for feedback collection. 
                    Regions can now view the allocations and submit their feedback.
                  </p>
                  {planDetails.distributedToRegionsDate && (
                    <p className="text-xs text-text-mid dark:text-text-mid m-0 mt-2">
                      📅 Distributed: {new Date(planDetails.distributedToRegionsDate).toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              {/* Plan Info */}
              <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Plan Information</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Plan ID</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">{planDetails.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Year</p>
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

              {/* Audit Type Allocations */}
              <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Audit Type Allocations</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-ink dark:bg-ink">
                      <tr>
                        <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Audit Type</th>
                        <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">Count</th>
                        <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">% of Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border dark:divide-border">
                      {auditTypes.map(type => {
                        const count = planDetails.auditTypeAllocation?.[type] || 0;
                        const percent = planDetails.totalCases > 0 ? ((count / planDetails.totalCases) * 100).toFixed(1) : 0;
                        return (
                          <tr key={type}>
                            <td className="p-2 text-text-hi dark:text-text-hi font-bold text-xs">
                              {auditTypeLabels[type]}
                            </td>
                            <td className="p-2 text-center text-text-mid dark:text-text-mid">{count}</td>
                            <td className="p-2 text-center text-text-mid dark:text-text-mid">{percent}%</td>
                          </tr>
                        );
                      })}
                      <tr className="bg-ink dark:bg-ink font-bold">
                        <td className="p-2 text-text-hi dark:text-text-hi">TOTAL</td>
                        <td className="p-2 text-center text-text-hi dark:text-text-hi">{planDetails.totalCases}</td>
                        <td className="p-2 text-center text-text-hi dark:text-text-hi">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Regional Feedback (if available) */}
              {activeTab === 'feedback' && planDetails.regionFeedbackStatus && Object.keys(planDetails.regionFeedbackStatus).length > 0 && (
                <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4">
                  <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Regional Feedback Summary</h3>
                  
                  <div className="space-y-3">
                    {Object.entries(planDetails.regionFeedbackStatus).map(([region, feedback]) => (
                      <div key={region} className="bg-ink dark:bg-ink p-3 rounded border border-border dark:border-border">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold text-text-hi dark:text-text-hi m-0">{region}</p>
                          <Badge status="approved" text="✅ Received" />
                        </div>
                        {feedback.regionalFeedback && (
                          <p className="text-xs text-text-mid dark:text-text-mid m-0 mb-2">
                            <strong>Director Feedback:</strong> {feedback.regionalFeedback}
                          </p>
                        )}
                        {feedback.taxCenterFeedback && feedback.taxCenterFeedback.length > 0 && (
                          <div className="mt-2 ml-4 border-l border-border dark:border-border pl-3">
                            <p className="text-xs font-bold text-text-mid dark:text-text-mid m-0 mb-1">
                              Tax Centers ({feedback.taxCenterFeedback.length}):
                            </p>
                            <div className="space-y-1">
                              {feedback.taxCenterFeedback.map((tc, idx) => (
                                <div key={idx} className="text-xs text-text-mid dark:text-text-mid">
                                  <strong>{tc.taxCenter}:</strong> {tc.feedback}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {feedback.receivedDate && (
                          <p className="text-xs text-text-mid dark:text-text-mid m-0 mt-2">
                            📅 Received: {new Date(feedback.receivedDate).toLocaleString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Form or Buttons */}
              {showActionForm ? (
                <div className={`rounded-lg p-4 ${
                  activeTab === 'pending' 
                    ? 'bg-warning/10 dark:bg-warning/10 border border-warning dark:border-warning'
                    : 'bg-info/10 dark:bg-info/10 border border-info dark:border-info'
                }`}>
                  <h4 className={`font-bold mb-4 ${
                    activeTab === 'pending' 
                      ? 'text-warning dark:text-warning'
                      : 'text-info dark:text-info'
                  }`}>
                    {actionType === 'approve' && '✅ Approve Plan'}
                    {actionType === 'reject-initial' && '❌ Send Back for Amendment'}
                    {actionType === 'accept-feedback' && '✅ Accept Regional Feedback'}
                    {actionType === 'reject-feedback' && '❌ Request More Feedback'}
                  </h4>

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
                      className={`flex-1 px-3 py-2 rounded font-bold text-white text-sm ${
                        activeTab === 'pending'
                          ? actionType === 'approve'
                            ? 'bg-teal dark:bg-teal hover:bg-teal/80 dark:hover:bg-teal/80'
                            : 'bg-orange dark:bg-orange hover:bg-orange/80 dark:hover:bg-orange/80'
                          : actionType === 'accept-feedback'
                            ? 'bg-teal dark:bg-teal hover:bg-teal/80 dark:hover:bg-teal/80'
                            : 'bg-orange dark:bg-orange hover:bg-orange/80 dark:hover:bg-orange/80'
                      }`}
                    >
                      {actionType === 'approve' || actionType === 'accept-feedback' ? '✅ Confirm' : '❌ Send Back'}
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
              ) : showSubmitToRegionsForm ? (
                <div className="bg-orange/10 dark:bg-orange/10 border border-orange dark:border-orange rounded-lg p-4">
                  <h4 className="text-orange dark:text-orange font-bold m-0 mb-3">
                    <i className="fas fa-share-alt mr-2"></i>Submit Plan to Regions
                  </h4>
                  
                  <div className="mb-4">
                    <label className="block text-text-hi dark:text-text-hi font-bold text-sm mb-2">
                      Submission Notes (optional)
                    </label>
                    <textarea
                      value={submitNotes}
                      onChange={(e) => setSubmitNotes(e.target.value)}
                      placeholder="Add any instructions or notes for regions..."
                      className="w-full px-3 py-2 rounded border border-border dark:border-border bg-ink dark:bg-ink text-text-primary dark:text-text-primary text-sm"
                      rows="3"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleSubmitToRegions}
                      className="flex-1 px-3 py-2 rounded font-bold text-white text-sm bg-orange dark:bg-orange hover:bg-orange/80 dark:hover:bg-orange/80 transition-all"
                    >
                      ✅ Submit to Regions
                    </button>
                    <button
                      onClick={() => {
                        setShowSubmitToRegionsForm(false);
                        setSubmitNotes('');
                      }}
                      className="px-3 py-2 rounded font-bold bg-gray-600 dark:bg-gray-600 text-white hover:bg-gray-500 dark:hover:bg-gray-500 text-sm transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeTab === 'pending' && planDetails.status === 'SUBMITTED_TO_DIRECTOR' && (
                    <>
                      <button
                        onClick={() => handleAction('approve')}
                        className="w-full py-3 px-4 rounded font-bold bg-teal dark:bg-teal text-white hover:bg-teal/80 dark:hover:bg-teal/80 transition-all"
                      >
                        ✅ Approve Plan
                      </button>
                      <button
                        onClick={() => handleAction('reject-initial')}
                        className="w-full py-3 px-4 rounded font-bold bg-orange dark:bg-orange text-white hover:bg-orange/80 dark:hover:bg-orange/80 transition-all"
                      >
                        ❌ Send Back for Amendment
                      </button>
                    </>
                  )}

                  {activeTab === 'pending' && planDetails.status === 'APPROVED_BY_DIRECTOR' && (
                    <button
                      onClick={() => setShowSubmitToRegionsForm(true)}
                      className="w-full py-3 px-4 rounded font-bold bg-success dark:bg-success text-white hover:bg-success/80 dark:hover:bg-success/80 transition-all flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-share-alt"></i>
                      🚀 Submit to Regions for Feedback
                    </button>
                  )}

                  {activeTab === 'feedback' && planDetails.status === 'FEEDBACK_COLLECTED' && (
                    <>
                      <button
                        onClick={() => handleAction('accept-feedback')}
                        className="w-full py-3 px-4 rounded font-bold bg-teal dark:bg-teal text-white hover:bg-teal/80 dark:hover:bg-teal/80 transition-all"
                      >
                        ✅ Accept Feedback & Proceed
                      </button>
                      <button
                        onClick={() => handleAction('reject-feedback')}
                        className="w-full py-3 px-4 rounded font-bold bg-orange dark:bg-orange text-white hover:bg-orange/80 dark:hover:bg-orange/80 transition-all"
                      >
                        ❌ Request More Feedback
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Approval History */}
              {planDetails.approvalHistory && planDetails.approvalHistory.length > 0 && (
                <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4">
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
                {activeTab === 'pending' 
                  ? 'Select a plan to approve'
                  : 'Select a plan to review feedback'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DirectorInitialApprovalView;
