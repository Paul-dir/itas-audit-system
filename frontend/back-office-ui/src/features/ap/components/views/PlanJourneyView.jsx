import React, { useState, useEffect } from 'react';
import { useData } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import Badge from '../Badge';

/**
 * PlanJourneyView - COMPLETE PLAN JOURNEY VISUALIZATION
 * 
 * Shows the entire workflow of a plan from creation to final approval:
 * 1. Plan Creation (Audit Team)
 * 2. Director Review
 * 3. Regional Distribution & Feedback Collection
 * 4. Tax Center Feedback Collection
 * 5. Regional Aggregation
 * 6. Planning Team Amendment
 * 7. Director Final Review
 * 8. Senior Management Approval
 * 9. Regional Deployment
 */

function PlanJourneyView() {
  const { getUserInfo } = useAuth();
  const { data, updateData } = useData();
  const userInfo = getUserInfo();

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submitNotes, setSubmitNotes] = useState('');

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = () => {
    setLoading(true);
    // Using data from hook
    setPlans(data.plans || []);
    setLoading(false);
  };

  const getPlanDetails = () => {
    if (!selectedPlan) return null;
    return plans.find(p => p.id === selectedPlan);
  };

  const handleSubmitToRegions = () => {
    if (!selectedPlan) return;

    if (!submitNotes.trim()) {
      const confirm = window.confirm(
        'No submission notes provided. Continue anyway?\n\n(Notes are optional)'
      );
      if (!confirm) return;
    }

    // Using data from hook
    const plan = data.plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    // ✅ Check if already submitted
    if (plan.status === 'AWAITING_REGIONAL_FEEDBACK' || 
        plan.status === 'FEEDBACK_COLLECTED' ||
        plan.status === 'REVISION_REQUESTED' ||
        plan.status === 'RESUBMITTED_TO_DIRECTOR' ||
        plan.status === 'DIRECTOR_APPROVED' ||
        plan.status === 'SUBMITTED_TO_SENIOR_MANAGEMENT' ||
        plan.status === 'SENIOR_MANAGEMENT_APPROVED' ||
        plan.status === 'SENIOR_MANAGEMENT_REJECTED' ||
        plan.status === 'DEPLOYED_TO_REGIONS') {
      alert('❌ This plan has already been submitted to regions or is in a later stage!');
      return;
    }

    // ✅ Only allow if SUBMITTED_TO_DIRECTOR or DIRECTOR_APPROVED (fresh approvals)
    if (plan.status !== 'SUBMITTED_TO_DIRECTOR') {
      alert(`❌ Cannot submit! Current status: ${plan.status}\n\nPlans must be in SUBMITTED_TO_DIRECTOR status to submit to regions.`);
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
      hasNotes: !!submitNotes,
      sentBy: userInfo?.fullName || 'Director'
    });

    updateData(data);

    alert('✅ Plan submitted to all regions for feedback collection!');
    setSelectedPlan(null);
    setShowSubmitForm(false);
    setSubmitNotes('');
    loadPlans();
  };

  const auditTypeLabels = {
    desk_audit: 'Desk Audit',
    field_audit: 'Field Audit',
    joint_audit: 'Joint Audit',
    transfer_pricing: 'Transfer Pricing',
    comprehensive: 'Comprehensive',
    issue_audit: 'Issue Audit'
  };

  // Timeline steps for workflow
  const getWorkflowSteps = (plan) => {
    if (!plan) return [];

    const steps = [
      {
        id: 1,
        title: 'Plan Created',
        status: 'COMPLETED',
        description: 'Audit Planning Team creates initial plan with allocations',
        date: plan.createdDate,
        icon: 'fas fa-file-alt',
        color: 'success'
      },
      {
        id: 2,
        title: 'Director Review',
        status: plan.status === 'SUBMITTED_TO_DIRECTOR' ? 'ACTIVE' : 
                (plan.status && ['REVISION_REQUESTED', 'RESUBMITTED_TO_DIRECTOR', 'DIRECTOR_APPROVED', 'SUBMITTED_TO_SENIOR_MANAGEMENT', 'SENIOR_MANAGEMENT_APPROVED', 'SENIOR_MANAGEMENT_REJECTED'].includes(plan.status) ? 'COMPLETED' : 'PENDING'),
        description: 'Director reviews plan and makes initial approval decision',
        date: plan.directorReviewDate,
        icon: 'fas fa-clipboard-check',
        color: 'info'
      },
      {
        id: 3,
        title: 'Submit to Regions',
        status: plan.status && ['AWAITING_REGIONAL_FEEDBACK', 'FEEDBACK_COLLECTED', 'REVISION_REQUESTED', 'RESUBMITTED_TO_DIRECTOR', 'DIRECTOR_APPROVED', 'SUBMITTED_TO_SENIOR_MANAGEMENT', 'SENIOR_MANAGEMENT_APPROVED'].includes(plan.status) ? 'COMPLETED' : 'PENDING',
        description: 'Director sends plan to Regional Directors for feedback collection',
        date: plan.distributedToRegionsDate,
        icon: 'fas fa-share-alt',
        color: 'warning'
      },
      {
        id: 4,
        title: 'Regional Feedback',
        status: plan.status === 'AWAITING_REGIONAL_FEEDBACK' ? 'ACTIVE' : 
                (plan.status && ['FEEDBACK_COLLECTED', 'REVISION_REQUESTED', 'RESUBMITTED_TO_DIRECTOR', 'DIRECTOR_APPROVED', 'SUBMITTED_TO_SENIOR_MANAGEMENT', 'SENIOR_MANAGEMENT_APPROVED'].includes(plan.status) ? 'COMPLETED' : 'PENDING'),
        description: 'Regions collect feedback from tax centers and submit to director',
        date: plan.feedbackCollectedDate,
        icon: 'fas fa-comments',
        color: 'purple'
      },
      {
        id: 5,
        title: 'Planning Team Amendment',
        status: plan.status === 'REVISION_REQUESTED' ? 'ACTIVE' : 
                (plan.status && ['RESUBMITTED_TO_DIRECTOR', 'DIRECTOR_APPROVED', 'SUBMITTED_TO_SENIOR_MANAGEMENT', 'SENIOR_MANAGEMENT_APPROVED'].includes(plan.status) ? 'COMPLETED' : 'PENDING'),
        description: 'Planning Team reviews feedback and amends allocations',
        date: plan.amendmentSubmittedDate,
        icon: 'fas fa-edit',
        color: 'info'
      },
      {
        id: 6,
        title: 'Director Amendment Review',
        status: plan.status === 'RESUBMITTED_TO_DIRECTOR' ? 'ACTIVE' : 
                (plan.status && ['DIRECTOR_APPROVED', 'SUBMITTED_TO_SENIOR_MANAGEMENT', 'SENIOR_MANAGEMENT_APPROVED'].includes(plan.status) ? 'COMPLETED' : 'PENDING'),
        description: 'Director reviews amended plan and approves',
        date: plan.directorAmendmentApprovedDate,
        icon: 'fas fa-check-circle',
        color: 'teal'
      },
      {
        id: 7,
        title: 'Senior Management Review',
        status: plan.status === 'SUBMITTED_TO_SENIOR_MANAGEMENT' ? 'ACTIVE' : 
                (plan.status && ['SENIOR_MANAGEMENT_APPROVED', 'SENIOR_MANAGEMENT_REJECTED'].includes(plan.status) ? 'COMPLETED' : 'PENDING'),
        description: 'Senior Management makes final approval decision',
        date: plan.approvedDate,
        icon: 'fas fa-gavel',
        color: 'success'
      },
      {
        id: 8,
        title: 'Regional Deployment',
        status: plan.status === 'SENIOR_MANAGEMENT_APPROVED' ? 'ACTIVE' : 
                (plan.status === 'DEPLOYED_TO_REGIONS' ? 'COMPLETED' : 'PENDING'),
        description: 'Director submits approved plan to each region for execution',
        date: plan.deployedDate,
        icon: 'fas fa-rocket',
        color: 'warning'
      }
    ];

    return steps;
  };

  const planDetails = getPlanDetails();
  const workflowSteps = planDetails ? getWorkflowSteps(planDetails) : [];

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="detail-header mb-6">
        <h2 className="text-2xl font-bold text-text-hi dark:text-text-hi flex items-center gap-2">
          <i className="fas fa-diagram-project"></i> Plan Journey
        </h2>
        <p className="text-text-mid dark:text-text-mid mt-2">
          Track the complete workflow of audit plans from creation to execution
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Plans List */}
        <div className="lg:col-span-1">
          <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg">
            {/* List Header */}
            <div className="px-4 py-3 border-b border-border dark:border-border">
              <h3 className="text-text-hi dark:text-text-hi font-bold m-0">All Plans</h3>
              <p className="text-xs text-text-mid dark:text-text-mid mt-2 m-0">
                {plans.length} total plans
              </p>
            </div>

            {/* Plans List */}
            {loading ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">Loading...</div>
            ) : plans.length === 0 ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">
                No plans found
              </div>
            ) : (
              <div className="divide-y divide-border dark:divide-border max-h-96 overflow-y-auto">
                {plans.map(plan => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedPlan === plan.id
                        ? 'bg-teal/20 dark:bg-teal/20 border-l-4 border-teal dark:border-teal'
                        : 'hover:bg-ink dark:hover:bg-ink'
                    }`}
                  >
                    <p className="font-bold text-text-hi dark:text-text-hi m-0">{plan.id}</p>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0 mt-1">{plan.name}</p>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0 mt-1">
                      Year: {plan.fiscalYear} • Cases: {plan.totalCases}
                    </p>
                    <div className="mt-2">
                      <Badge status={plan.status} text={plan.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Plan Journey & Details */}
        <div className="lg:col-span-3">
          {planDetails ? (
            <div className="space-y-6">
              {/* Plan Info Card */}
              <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-text-hi dark:text-text-hi font-bold m-0">Plan Information</h3>
                  {/* Submit to Regions Button */}
                  {planDetails.status === 'SUBMITTED_TO_DIRECTOR' && (
                    <button
                      onClick={() => setShowSubmitForm(true)}
                      className="px-3 py-1 bg-orange dark:bg-orange text-white text-xs font-bold rounded hover:bg-orange/80 dark:hover:bg-orange/80 transition-all flex items-center gap-1"
                    >
                      <i className="fas fa-share-alt"></i>
                      Submit to Regions
                    </button>
                  )}
                </div>
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
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Current Status</p>
                    <Badge status={planDetails.status} text={planDetails.status} className="mt-1" />
                  </div>
                </div>
              </div>

              {/* Submit to Regions Form */}
              {showSubmitForm && (
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
                        setShowSubmitForm(false);
                        setSubmitNotes('');
                      }}
                      className="px-3 py-2 rounded font-bold bg-gray-600 dark:bg-gray-600 text-white hover:bg-gray-500 dark:hover:bg-gray-500 text-sm transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Workflow Timeline */}
              <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-4">Workflow Timeline</h3>
                
                <div className="space-y-4">
                  {workflowSteps.map((step, idx) => (
                    <div key={step.id} className="flex gap-4">
                      {/* Timeline marker */}
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all ${
                          step.status === 'COMPLETED' ? 'bg-success dark:bg-success' :
                          step.status === 'ACTIVE' ? 'bg-warning dark:bg-warning animate-pulse' :
                          'bg-border dark:bg-border'
                        }`}>
                          <i className={`${step.icon} text-xs`}></i>
                        </div>
                        {idx < workflowSteps.length - 1 && (
                          <div className={`w-0.5 h-12 mt-2 ${
                            step.status === 'COMPLETED' ? 'bg-success dark:bg-success' : 'bg-border dark:bg-border'
                          }`}></div>
                        )}
                      </div>

                      {/* Timeline content */}
                      <div className="flex-1 pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-bold text-text-hi dark:text-text-hi m-0">{step.title}</p>
                            <p className="text-xs text-text-mid dark:text-text-mid m-0 mt-1">{step.description}</p>
                          </div>
                          <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ml-2 ${
                            step.status === 'COMPLETED' ? 'bg-success/20 dark:bg-success/20 text-success dark:text-success' :
                            step.status === 'ACTIVE' ? 'bg-warning/20 dark:bg-warning/20 text-warning dark:text-warning' :
                            'bg-border/20 dark:bg-border/20 text-text-mid dark:text-text-mid'
                          }`}>
                            {step.status}
                          </span>
                        </div>
                        {step.date && (
                          <p className="text-xs text-text-mid dark:text-text-mid m-0 mt-2">
                            📅 {new Date(step.date).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audit Type Allocations */}
              <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">National Audit Type Allocations</h3>
                
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
                      {Object.entries(planDetails.auditTypeAllocation || {}).map(([type, count]) => (
                        <tr key={type}>
                          <td className="p-2 text-text-hi dark:text-text-hi font-bold text-xs">
                            {auditTypeLabels[type] || type}
                          </td>
                          <td className="p-2 text-center text-text-mid dark:text-text-mid">
                            {count}
                          </td>
                          <td className="p-2 text-center text-text-mid dark:text-text-mid">
                            {planDetails.totalCases > 0 ? ((count / planDetails.totalCases) * 100).toFixed(1) : 0}%
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-ink dark:bg-ink font-bold">
                        <td className="p-2 text-text-hi dark:text-text-hi">TOTAL</td>
                        <td className="p-2 text-center text-text-hi dark:text-text-hi">{planDetails.totalCases}</td>
                        <td className="p-2 text-center text-text-hi dark:text-text-hi">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Regional Allocations */}
              <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Regional Allocations</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-ink dark:bg-ink">
                      <tr>
                        <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Region</th>
                        {Object.keys(planDetails.auditTypeAllocation || {}).map(type => (
                          <th key={type} className="text-center p-2 text-text-hi dark:text-text-hi font-bold text-xs">
                            {auditTypeLabels[type]?.substring(0, 10) || type.substring(0, 10)}
                          </th>
                        ))}
                        <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border dark:divide-border">
                      {Object.entries(planDetails.regionalAllocation || {}).map(([region, allocation]) => {
                        let regionTotal = 0;
                        return (
                          <tr key={region}>
                            <td className="p-2 text-text-hi dark:text-text-hi font-bold">{region}</td>
                            {Object.keys(planDetails.auditTypeAllocation || {}).map(type => {
                              const value = (typeof allocation === 'object' ? allocation[type] : 0) || 0;
                              regionTotal += value;
                              return (
                                <td key={type} className="p-2 text-center text-text-mid dark:text-text-mid">
                                  {value}
                                </td>
                              );
                            })}
                            <td className="p-2 text-center text-text-hi dark:text-text-hi font-bold">
                              {regionTotal}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Regional Feedback Status */}
              {planDetails.regionFeedbackStatus && Object.keys(planDetails.regionFeedbackStatus).length > 0 && (
                <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4">
                  <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Regional Feedback Status</h3>
                  
                  <div className="space-y-3">
                    {Object.entries(planDetails.regionFeedbackStatus).map(([region, feedback]) => (
                      <div key={region} className="bg-ink dark:bg-ink p-3 rounded border border-border dark:border-border">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold text-text-hi dark:text-text-hi m-0">{region}</p>
                          {feedback.status === 'received' ? (
                            <Badge status="approved" text="✅ Feedback Received" />
                          ) : (
                            <Badge status="pending" text="⏳ Awaiting" />
                          )}
                        </div>
                        {feedback.regionalFeedback && (
                          <p className="text-xs text-text-mid dark:text-text-mid m-0">
                            {feedback.regionalFeedback}
                          </p>
                        )}
                        {feedback.receivedDate && (
                          <p className="text-xs text-text-mid dark:text-text-mid m-0 mt-1">
                            📅 Received: {new Date(feedback.receivedDate).toLocaleString()}
                          </p>
                        )}
                        {feedback.taxCenterFeedback && feedback.taxCenterFeedback.length > 0 && (
                          <div className="mt-2 ml-4 border-l border-border dark:border-border pl-3">
                            <p className="text-xs font-bold text-text-mid dark:text-text-mid m-0 mb-2">
                              Tax Center Feedback ({feedback.taxCenterFeedback.length}):
                            </p>
                            <div className="space-y-1">
                              {feedback.taxCenterFeedback.map((tc, idx) => (
                                <div key={idx} className="text-xs text-text-mid dark:text-text-mid">
                                  <strong>{tc.taxCenter}</strong>: {tc.feedback}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Approval History */}
              {planDetails.approvalHistory && planDetails.approvalHistory.length > 0 && (
                <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4">
                  <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Approval History</h3>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {planDetails.approvalHistory.slice().reverse().map((record, idx) => (
                      <div key={idx} className="bg-ink dark:bg-ink p-2 rounded border border-border dark:border-border text-xs">
                        <div className="flex justify-between mb-1">
                          <p className="font-bold text-text-hi dark:text-text-hi m-0">{record.action}</p>
                          <p className="text-text-mid dark:text-text-mid m-0">
                            {new Date(record.date).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-text-mid dark:text-text-mid m-0">By: {record.by}</p>
                        {record.notes && (
                          <p className="text-text-mid dark:text-text-mid m-0 mt-1 italic">{record.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-8 text-center">
              <p className="text-text-mid dark:text-text-mid m-0">
                Select a plan to view its complete journey
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlanJourneyView;
