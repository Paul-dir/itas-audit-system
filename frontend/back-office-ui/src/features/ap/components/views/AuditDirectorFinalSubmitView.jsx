import React, { useState, useEffect } from 'react';
import { useData } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { auditConfig } from '../../config/auditConfig';
import Badge from '../Badge';

/**
 * AuditDirectorFinalSubmitView
 * Audit Director reviews planning team amendments and submits to senior management
 * 
 * WORKFLOW:
 * 1. View plans with amendments from planning team
 * 2. Review amendment history: Original → Regional → Amended
 * 3. Prepare executive summary for senior management
 * 4. Make recommendation (APPROVE / NEEDS_REVIEW)
 * 5. Submit to senior management for final approval
 */

function AuditDirectorFinalSubmitView() {
  const { getUserInfo } = useAuth();
  const userInfo = getUserInfo();
  const { data, updateData } = useData();

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [directorComments, setDirectorComments] = useState(''); // ✅ Add comments field
  const [recommendation, setRecommendation] = useState('APPROVE');
  const [finalProposal, setFinalProposal] = useState({});
  const [showSubmitForm, setShowSubmitForm] = useState(false);

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
  }, [data]);

  const loadPlans = () => {
    setLoading(true);

    // ✅ Filter by workflowStatus for consistent routing
    const amendedPlans = (data?.plans || []).filter(plan => {
      return plan.workflowStatus === 'DIRECTOR_FINAL_REVIEW';
    });

    console.log(`✅ Director Final Review: Found ${amendedPlans.length} amended plans`, {
      pendingReview: amendedPlans.filter(p => !p.directorRecommendation?.sentToSeniorManagement).length,
      alreadySubmitted: amendedPlans.filter(p => p.directorRecommendation?.sentToSeniorManagement).length
    });
    setPlans(amendedPlans);
    setLoading(false);
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    setShowSubmitForm(false);
    
    // Initialize final proposal by aggregating amended values across all regions
    const plan = data?.plans?.find(p => p.id === planId);
    
    if (plan && plan.planningTeamAmendment) {
      const regionalAmendments = plan.planningTeamAmendment.amendments || {};
      const proposal = {};
      
      // Aggregate amendments across all regions (same logic as plan creation)
      auditConfig.auditTypes.forEach(auditType => {
        let totalAmended = 0;
        
        auditConfig.regions.forEach(region => {
          const amended = regionalAmendments[region.name]?.[auditType.id]?.amended || 0;
          totalAmended += amended;
        });
        
        proposal[auditType.id] = totalAmended;
      });
      
      setFinalProposal(proposal);
      
      // If already submitted, pre-populate the form
      if (plan.directorRecommendation?.sentToSeniorManagement) {
        setExecutiveSummary(plan.directorRecommendation.executiveSummary || '');
        setDirectorComments(plan.directorRecommendation.directorComments || '');
        setRecommendation(plan.directorRecommendation.recommendation || 'APPROVE');
      } else {
        setExecutiveSummary('');
        setDirectorComments('');
        setRecommendation('APPROVE');
      }
    }
  };

  const handleSubmitToSeniorManagement = () => {
    if (!executiveSummary.trim()) {
      alert('Please provide an executive summary for senior management');
      return;
    }

    if (!selectedPlan) return;

    const planIndex = data.plans.findIndex(p => p.id === selectedPlan);
    if (planIndex < 0) return;

    const updatedData = { ...data };
    const plan = updatedData.plans[planIndex];

    // Update or create director recommendation (allow re-submission)
    plan.directorRecommendation = {
      sentToSeniorManagement: true,
      sentDate: new Date().toISOString(),
      sentBy: userInfo?.fullName || 'Audit Director',
      recommendation: recommendation,
      finalProposal: finalProposal,
      executiveSummary: executiveSummary,
      directorComments: directorComments, // ✅ Add comments field
      amendmentHistory: {
        aggregatedFeedback: plan.directorFeedbackToPlanning?.aggregatedFeedback,
        planningAmendments: plan.planningTeamAmendment?.amendments
      }
    };

    plan.workflowStatus = 'SENIOR_MANAGEMENT_REVIEW';

    console.log('✅ DIRECTOR SUBMITTED TO SENIOR MANAGEMENT:', {
      planId: plan.id,
      sentToSeniorManagement: plan.directorRecommendation.sentToSeniorManagement,
      hasComments: !!directorComments,
      workflowStatus: plan.workflowStatus
    });

    updateData(updatedData);

    alert('✅ Plan submitted to Senior Management for final approval!');
    
    setSelectedPlan(null);
    setExecutiveSummary('');
    setDirectorComments('');
    setRecommendation('APPROVE');
    setFinalProposal({});
    setShowSubmitForm(false);
    loadPlans();
  };

  const getPlanDetails = () => {
    if (!selectedPlan) return null;
    return plans.find(p => p.id === selectedPlan);
  };

  const planDetails = getPlanDetails();
  const planningAmendment = planDetails?.planningTeamAmendment;
  const aggregatedFeedback = planDetails?.directorFeedbackToPlanning?.aggregatedFeedback;

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="detail-header mb-6">
        <h2 className="text-2xl font-bold text-text-hi dark:text-text-hi flex items-center gap-2">
          <i className="fas fa-check-circle"></i> Final Review & Submit
        </h2>
        <p className="text-text-mid dark:text-text-mid mt-2">
          Review amendments and submit to senior management
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Plans List */}
        <div className="lg:col-span-1">
          <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg">
            <div className="px-4 py-3 border-b border-border dark:border-border">
              <h3 className="text-text-hi dark:text-text-hi font-bold m-0">
                Amended Plans ({plans.length})
              </h3>
            </div>

            {loading ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">Loading...</div>
            ) : plans.length === 0 ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">
                No amended plans available
              </div>
            ) : (
              <div className="divide-y divide-border dark:divide-border max-h-96 overflow-y-auto">
                {plans.map(plan => {
                  const isSubmitted = plan.directorRecommendation?.sentToSeniorManagement;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedPlan === plan.id
                          ? 'bg-blue/20 dark:bg-blue/20 border-l-4 border-blue dark:border-blue'
                          : 'hover:bg-ink dark:hover:bg-ink'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-bold text-text-hi dark:text-text-hi m-0">{plan.id}</p>
                          <p className="text-xs text-text-mid dark:text-text-mid m-0 mt-1">{plan.name}</p>
                          {isSubmitted ? (
                            <p className="text-xs text-teal dark:text-teal font-bold m-0 mt-1 flex items-center gap-1">
                              <i className="fas fa-check-circle"></i> Submitted to Senior Management
                            </p>
                          ) : (
                            <p className="text-xs text-orange dark:text-orange font-bold m-0 mt-1 flex items-center gap-1">
                              <i className="fas fa-clock"></i> Pending your review
                            </p>
                          )}
                          {isSubmitted && plan.directorRecommendation?.sentDate && (
                            <p className="text-xs text-text-mid dark:text-text-mid m-0 mt-1">
                              Submitted: {new Date(plan.directorRecommendation.sentDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Final Review */}
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
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Plan Name</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">{planDetails.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Amended By</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">
                      {planningAmendment?.amendedBy}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amendment History Table - Regional Breakdown */}
              <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4 mb-6">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">🌍 Amendment History - Regional Breakdown</h3>
                <p className="text-xs text-text-mid dark:text-text-mid mb-3">
                  Shows how Planning Team amended regional allocations based on feedback
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-ink dark:bg-ink sticky top-0">
                      <tr>
                        <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold min-w-24">Region</th>
                        <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold min-w-20">Audit Type</th>
                        <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold min-w-16">Original</th>
                        <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold min-w-16">TC Proposed</th>
                        <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold min-w-16">Region Proposed</th>
                        <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold min-w-16">Amended</th>
                        <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold min-w-16">Change</th>
                        <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold min-w-32">Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border dark:divide-border">
                      {auditConfig.regions.map(region => (
                        <React.Fragment key={region.id}>
                          {auditConfig.auditTypes.map((auditType, idx) => {
                            const amendment = planningTeamAmendment?.amendments?.[region.name]?.[auditType.id] || {};
                            const change = (amendment.amended || 0) - (amendment.original || 0);
                            const changeClass = change > 0 ? 'text-orange dark:text-orange' : 
                                              change < 0 ? 'text-blue dark:text-blue' : 
                                              'text-text-mid dark:text-text-mid';
                            
                            return (
                              <tr key={`${region.id}-${auditType.id}`} className={idx === 0 ? 'border-t-2 border-text-mid dark:border-text-mid' : ''}>
                                {idx === 0 && (
                                  <td rowSpan={auditConfig.auditTypes.length} className="p-2 text-text-hi dark:text-text-hi font-bold align-top bg-ink/20 dark:bg-ink/20">
                                    {region.name}
                                  </td>
                                )}
                                <td className="p-2 text-text-mid dark:text-text-mid">
                                  {auditType.name}
                                </td>
                                <td className="p-2 text-center text-text-mid dark:text-text-mid">
                                  {amendment.original || 0}
                                </td>
                                <td className="p-2 text-center text-teal dark:text-teal">
                                  {amendment.tcProposed || 0}
                                </td>
                                <td className="p-2 text-center text-blue dark:text-blue font-bold">
                                  {amendment.regionalProposed || 0}
                                </td>
                                <td className="p-2 text-center text-text-hi dark:text-text-hi font-bold">
                                  {amendment.amended || 0}
                                </td>
                                <td className={`p-2 text-center font-bold ${changeClass}`}>
                                  {change > 0 ? `+${change}` : change}
                                </td>
                                <td className="p-2 text-xs text-text-mid dark:text-text-mid">
                                  {amendment.reason || '—'}
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Submit Form */}
              {showSubmitForm ? (
                <div className="bg-teal/10 dark:bg-teal/10 border border-teal dark:border-teal rounded p-4 mb-4">
                  <h4 className="text-teal dark:text-teal font-bold m-0 mb-3">Submit to Senior Management</h4>
                  
                  {/* Executive Summary */}
                  <div className="mb-4">
                    <label className="block text-text-hi dark:text-text-hi font-bold text-sm mb-2">
                      Executive Summary *
                    </label>
                    <textarea
                      value={executiveSummary}
                      onChange={(e) => setExecutiveSummary(e.target.value)}
                      placeholder="Provide a summary for senior management highlighting key changes, rationale, and recommendations..."
                      className="w-full px-3 py-2 rounded border border-border dark:border-border bg-ink dark:bg-ink text-text-primary dark:text-text-primary text-sm"
                      rows="4"
                    />
                  </div>

                  {/* Director Comments */}
                  <div className="mb-4">
                    <label className="block text-text-hi dark:text-text-hi font-bold text-sm mb-2">
                      📝 Director Comments (Optional)
                    </label>
                    <textarea
                      value={directorComments}
                      onChange={(e) => setDirectorComments(e.target.value)}
                      placeholder="Add any additional comments, concerns, or notes for the Senior Management review..."
                      className="w-full px-3 py-2 rounded border border-border dark:border-border bg-ink dark:bg-ink text-text-primary dark:text-text-primary text-sm"
                      rows="3"
                    />
                  </div>

                  {/* Recommendation */}
                  <div className="mb-4">
                    <label className="block text-text-hi dark:text-text-hi font-bold text-sm mb-2">
                      Recommendation
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="APPROVE"
                          checked={recommendation === 'APPROVE'}
                          onChange={(e) => setRecommendation(e.target.value)}
                          className="cursor-pointer"
                        />
                        <span className="text-text-hi dark:text-text-hi text-sm">✅ Recommend Approval</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="NEEDS_REVIEW"
                          checked={recommendation === 'NEEDS_REVIEW'}
                          onChange={(e) => setRecommendation(e.target.value)}
                          className="cursor-pointer"
                        />
                        <span className="text-text-hi dark:text-text-hi text-sm">⚠️ Needs Further Review</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleSubmitToSeniorManagement}
                      className="flex-1 px-3 py-2 rounded font-bold bg-teal dark:bg-teal text-white hover:bg-teal/80 dark:hover:bg-teal/80 text-sm"
                    >
                      📤 {planDetails.directorRecommendation?.sentToSeniorManagement ? 'Update & Resubmit' : 'Submit'} to Senior Management
                    </button>
                    <button
                      onClick={() => {
                        setShowSubmitForm(false);
                        setExecutiveSummary('');
                        setDirectorComments('');
                      }}
                      className="px-3 py-2 rounded font-bold bg-gray-600 dark:bg-gray-600 text-white hover:bg-gray-500 dark:hover:bg-gray-500 text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowSubmitForm(true)}
                  className="w-full py-2 px-4 rounded font-bold bg-teal dark:bg-teal text-white hover:bg-teal/80 dark:hover:bg-teal/80 transition-all"
                >
                  {planDetails.directorRecommendation?.sentToSeniorManagement ? '👁️ View & Edit Submission' : '✅ Prepare Submission to Senior Management'}
                </button>
              )}
            </div>
          ) : (
            <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-8 text-center">
              <p className="text-text-mid dark:text-text-mid m-0">
                Select an amended plan to review and submit
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuditDirectorFinalSubmitView;
