import React, { useState, useEffect } from 'react';
import { useData } from '../../services/dataService';
import { getDisplayRegionName } from '../../utils/regionNormalizer';
import { useAuth } from '../../context/AuthContext';
import Badge from '../Badge';

/**
 * AuditDirectorReviewFeedbackView
 * Audit Director reviews all regional feedback and decides next action
 * 
 * WORKFLOW:
 * 1. View plans with regional feedback from all regions
 * 2. See aggregated totals across all regions
 * 3. Review regional proposals vs original allocations
 * 4. Actions:
 *    - Send to Audit Planning Team for amendments
 *    - Send to Senior Management for approval (skip amendments)
 */

function AuditDirectorReviewFeedbackView() {
  const { getUserInfo } = useAuth();
  const userInfo = getUserInfo();
  const { data, updateData } = useData();

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [directorRemarks, setDirectorRemarks] = useState('');
  const [actionType, setActionType] = useState(null); // 'PLANNING' or 'SENIOR'

  const auditTypes = ['desk_audit', 'field_audit', 'joint_audit', 'transfer_pricing', 'comprehensive', 'issue_audit'];
  const auditTypeLabels = {
    desk_audit: 'Desk Audit',
    field_audit: 'Field Audit',
    joint_audit: 'Joint Audit',
    transfer_pricing: 'Transfer Pricing',
    comprehensive: 'Comprehensive',
    issue_audit: 'Issue Audit'
  };

  const regions = ['addis_ababa', 'oromia', 'amhara', 'snnpr', 'somali'];

  useEffect(() => {
    loadPlans();
  }, [data]);

  const loadPlans = () => {
    setLoading(true);

    // Find plans where regional directors have sent feedback
    const feedbackPlans = (data?.plans || []).filter(plan => {
      const hasRegionalFeedback = plan.regionalFeedbackStatus && 
        Object.values(plan.regionalFeedbackStatus).some(status => status.sentToDirector);
      
      // Not yet sent to planning or senior management
      const notYetForwarded = !plan.directorFeedbackToPlanning?.sentForAmendment && 
                              !plan.directorRecommendation?.sentToSeniorManagement;
      
      return hasRegionalFeedback && notYetForwarded;
    });

    console.log(`✅ Audit Director: Found ${feedbackPlans.length} plans with regional feedback`);
    setPlans(feedbackPlans);
    setLoading(false);
  };

  const aggregateRegionalFeedback = (plan) => {
    const aggregated = {};
    
    // ✅ FIX: Use ORIGINAL NATIONAL TOTALS from plan, not sum of regions
    // The plan was already distributed to regions, so summing creates inflated numbers
    
    auditTypes.forEach(type => {
      // Get the ORIGINAL national allocation for this audit type
      const originalNationalTotal = plan.nationalAllocations?.[type] || 0;
      
      let tcProposedTotal = 0;
      let regionalProposedTotal = 0;
      let regionCount = 0;
      const regionDetails = [];
      
      regions.forEach(region => {
        const regionalFeedback = plan.regionalFeedbackStatus?.[region];
        if (regionalFeedback?.sentToDirector && regionalFeedback.feedbackByType?.[type]) {
          const fb = regionalFeedback.feedbackByType[type];
          
          // Sum up regional proposals (these might differ from original distribution)
          tcProposedTotal += fb.tcProposedTotal || 0;
          regionalProposedTotal += fb.regionalProposed || 0;
          regionCount++;
          
          regionDetails.push({
            region: region,
            originalRegional: fb.originalAllocated, // This region's original share
            tcProposed: fb.tcProposedTotal,
            regionalProposed: fb.regionalProposed,
            capacity: fb.capacity,
            resourceStatus: fb.resourceStatus,
            timeline: fb.timeline
          });
        }
      });
      
      aggregated[type] = {
        originalNationalTotal, // ✅ Original national allocation
        tcProposedTotal,       // Sum of what tax centers proposed
        regionalProposedTotal, // Sum of what regions proposed
        regionCount,
        regionDetails
      };
    });
    
    return aggregated;
  };

  const handleSendToPlanning = () => {
    if (!selectedPlan) return;

    const planIndex = data.plans.findIndex(p => p.id === selectedPlan);
    if (planIndex < 0) return;

    const updatedData = { ...data };
    const plan = updatedData.plans[planIndex];
    
    // ✅ DUPLICATE PREVENTION: Check if already sent to planning
    if (plan.directorFeedbackToPlanning?.sentForAmendment) {
      alert('❌ This plan was already sent to Planning Team!\n\n' +
            `Sent by: ${plan.directorFeedbackToPlanning.sentBy}\n` +
            `Date: ${new Date(plan.directorFeedbackToPlanning.sentDate).toLocaleString()}\n\n` +
            'Cannot send again.');
      return;
    }
    
    // ✅ DUPLICATE PREVENTION: Check if already sent to senior management
    if (plan.directorRecommendation?.sentToSeniorManagement) {
      alert('❌ This plan was already sent to Senior Management!\n\n' +
            'Cannot change routing once submitted.');
      return;
    }

    const aggregated = aggregateRegionalFeedback(plan);

    plan.directorFeedbackToPlanning = {
      sentForAmendment: true,
      sentDate: new Date().toISOString(),
      sentBy: userInfo?.fullName || 'Audit Director',
      directorRemarks: directorRemarks,
      aggregatedFeedback: aggregated, // ✅ Contains originalNationalTotal
      regionalFeedbackSummary: plan.regionalFeedbackStatus
    };

    // ✅ CRITICAL: Change status to REVISION_REQUESTED so Planning Team can see it
    plan.status = 'REVISION_REQUESTED';

    // ✅ Track in approval history (like regional feedback pattern)
    plan.approvalHistory = plan.approvalHistory || [];
    plan.approvalHistory.push({
      action: 'SENT_TO_PLANNING_TEAM_FOR_AMENDMENT',
      by: userInfo?.fullName || 'Audit Director',
      date: new Date().toISOString(),
      notes: directorRemarks || 'Please review and amend allocations based on feedback',
      version: plan.version
    });

    console.log('✅ DIRECTOR SENT TO PLANNING TEAM:', {
      planId: plan.id,
      newStatus: 'REVISION_REQUESTED',
      hasRemarks: !!directorRemarks,
      aggregatedFeedback: aggregated,
      hasOriginalNational: Object.entries(aggregated).every(([_, fb]) => fb.originalNationalTotal !== undefined)
    });

    plan.workflowStatus = 'PLANNING_AMENDMENT';

    updateData(updatedData);

    alert('✅ Plan sent to Audit Planning Team for amendments!');
    
    setSelectedPlan(null);
    setDirectorRemarks('');
    setActionType(null);
    loadPlans();
  };

  const handleSendToSeniorManagement = () => {
    if (!selectedPlan) return;

    const planIndex = data.plans.findIndex(p => p.id === selectedPlan);
    if (planIndex < 0) return;

    const updatedData = { ...data };
    const plan = updatedData.plans[planIndex];
    
    // ✅ DUPLICATE PREVENTION: Check if already sent to senior management
    if (plan.directorRecommendation?.sentToSeniorManagement) {
      alert('❌ This plan was already sent to Senior Management!\n\n' +
            `Sent by: ${plan.directorRecommendation.sentBy}\n` +
            `Date: ${new Date(plan.directorRecommendation.sentDate).toLocaleString()}\n\n` +
            'Cannot send again.');
      return;
    }
    
    // ✅ DUPLICATE PREVENTION: Check if already sent to planning
    if (plan.directorFeedbackToPlanning?.sentForAmendment) {
      alert('❌ This plan was already sent to Planning Team!\n\n' +
            'Cannot change routing once submitted.');
      return;
    }

    const aggregated = aggregateRegionalFeedback(plan);

    // Create final proposal based on regional feedback
    const finalProposal = {};
    Object.entries(aggregated).forEach(([type, data]) => {
      finalProposal[type] = data.regionalProposedTotal;
    });

    plan.directorRecommendation = {
      sentToSeniorManagement: true,
      sentDate: new Date().toISOString(),
      sentBy: userInfo?.fullName || 'Audit Director',
      recommendation: 'APPROVE',
      finalProposal: finalProposal,
      aggregatedFeedback: aggregated,
      executiveSummary: directorRemarks || 'Regional feedback reviewed and consolidated.',
      regionalFeedbackSummary: plan.regionalFeedbackStatus
    };

    // ✅ Change status to SUBMITTED_TO_SENIOR_MANAGEMENT
    plan.status = 'SUBMITTED_TO_SENIOR_MANAGEMENT';

    // ✅ Track in approval history (like regional feedback pattern)
    plan.approvalHistory = plan.approvalHistory || [];
    plan.approvalHistory.push({
      action: 'SENT_TO_SENIOR_MANAGEMENT',
      by: userInfo?.fullName || 'Audit Director',
      date: new Date().toISOString(),
      notes: directorRemarks || 'Plan submitted for final approval',
      version: plan.version
    });

    console.log('✅ DIRECTOR SENT TO SENIOR MANAGEMENT:', {
      planId: plan.id,
      status: 'SUBMITTED_TO_SENIOR_MANAGEMENT',
      hasExecutiveSummary: !!directorRemarks
    });

    plan.workflowStatus = 'SENIOR_MANAGEMENT_REVIEW';

    updateData(updatedData);

    alert('✅ Plan sent to Senior Management for final approval!');
    
    setSelectedPlan(null);
    setDirectorRemarks('');
    setActionType(null);
    loadPlans();
  };

  const getPlanDetails = () => {
    if (!selectedPlan) return null;
    return plans.find(p => p.id === selectedPlan);
  };

  const planDetails = getPlanDetails();
  const aggregatedFeedback = planDetails ? aggregateRegionalFeedback(planDetails) : {};
  
  // Count how many regions provided feedback
  const regionsWithFeedback = planDetails ? 
    Object.values(planDetails.regionalFeedbackStatus || {}).filter(s => s.sentToDirector).length : 0;

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="detail-header mb-6">
        <h2 className="text-2xl font-bold text-text-hi dark:text-text-hi flex items-center gap-2">
          <i className="fas fa-chart-line"></i> Review Regional Feedback
        </h2>
        <p className="text-text-mid dark:text-text-mid mt-2">
          Review feedback from all regions and decide next action
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Plans List */}
        <div className="lg:col-span-1">
          <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg">
            <div className="px-4 py-3 border-b border-border dark:border-border">
              <h3 className="text-text-hi dark:text-text-hi font-bold m-0">
                Plans with Regional Feedback ({plans.length})
              </h3>
            </div>

            {loading ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">Loading...</div>
            ) : plans.length === 0 ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">
                No regional feedback pending review
              </div>
            ) : (
              <div className="divide-y divide-border dark:divide-border max-h-96 overflow-y-auto">
                {plans.map(plan => {
                  const feedbackCount = Object.values(plan.regionalFeedbackStatus || {})
                    .filter(s => s.sentToDirector).length;
                  
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
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
                          <p className="text-xs text-teal dark:text-teal font-bold m-0 mt-1">
                            {feedbackCount} region{feedbackCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Feedback Review */}
        <div className="lg:col-span-2">
          {planDetails ? (
            <div>
              {/* Plan Summary */}
              <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4 mb-6">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Plan Summary</h3>
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
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Regions</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">
                      {regionsWithFeedback} / 5 responded
                    </p>
                  </div>
                </div>
              </div>

              {/* Aggregated Feedback Table */}
              <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4 mb-6">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">National Summary (All Regions)</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-ink dark:bg-ink">
                      <tr>
                        <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Audit Type</th>
                        <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">Original</th>
                        <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">TC Proposed</th>
                        <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">Regional Proposed</th>
                        <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">Difference</th>
                        <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">Regions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border dark:divide-border">
                      {auditTypes.map(type => {
                        const fb = aggregatedFeedback[type] || {};
                        const diff = fb.regionalProposedTotal - fb.originalNationalTotal;
                        const diffClass = diff > 0 ? 'text-orange dark:text-orange' : 
                                        diff < 0 ? 'text-blue dark:text-blue' : 
                                        'text-text-mid dark:text-text-mid';
                        
                        return (
                          <tr key={type}>
                            <td className="p-2 text-text-hi dark:text-text-hi font-bold">
                              {auditTypeLabels[type]}
                            </td>
                            <td className="p-2 text-center text-text-mid dark:text-text-mid">
                              {fb.originalNationalTotal || 0}
                            </td>
                            <td className="p-2 text-center text-teal dark:text-teal">
                              {fb.tcProposedTotal || 0}
                            </td>
                            <td className="p-2 text-center text-text-hi dark:text-text-hi font-bold">
                              {fb.regionalProposedTotal || 0}
                            </td>
                            <td className={`p-2 text-center font-bold ${diffClass}`}>
                              {diff > 0 ? `+${diff}` : diff}
                            </td>
                            <td className="p-2 text-center text-text-mid dark:text-text-mid text-xs">
                              {fb.regionCount || 0}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Regional Details (Expandable) */}
              <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4 mb-6">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Regional Breakdown</h3>
                
                <div className="space-y-2">
                  {regions.map(region => {
                    const regionalData = planDetails.regionalFeedbackStatus?.[region];
                    if (!regionalData?.sentToDirector) return null;
                    
                    return (
                      <details key={region} className="bg-ink dark:bg-ink rounded border border-border dark:border-border">
                        <summary className="p-3 cursor-pointer hover:bg-panel dark:hover:bg-panel font-bold text-teal dark:text-teal">
                          {getDisplayRegionName(region)} - {regionalData.taxCenterCount} tax centers
                        </summary>
                        <div className="p-3 pt-0 text-xs">
                          <table className="w-full mt-2">
                            <thead>
                              <tr className="text-left border-b border-border dark:border-border">
                                <th className="py-1">Type</th>
                                <th className="py-1 text-center">Original</th>
                                <th className="py-1 text-center">TC Total</th>
                                <th className="py-1 text-center">Regional</th>
                                <th className="py-1">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {auditTypes.map(type => {
                                const fb = regionalData.feedbackByType?.[type];
                                if (!fb) return null;
                                
                                return (
                                  <tr key={type} className="border-b border-border/50 dark:border-border/50">
                                    <td className="py-1">{auditTypeLabels[type]}</td>
                                    <td className="py-1 text-center">{fb.originalAllocated}</td>
                                    <td className="py-1 text-center">{fb.tcProposedTotal}</td>
                                    <td className="py-1 text-center font-bold text-teal dark:text-teal">
                                      {fb.regionalProposed}
                                    </td>
                                    <td className="py-1 text-xs">{fb.capacity} / {fb.timeline}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </details>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              {!actionType ? (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setActionType('PLANNING')}
                    className="py-3 px-4 rounded font-bold bg-blue dark:bg-blue text-white hover:bg-blue/80 dark:hover:bg-blue/80 transition-all"
                  >
                    📝 Send to Planning Team
                  </button>
                  <button
                    onClick={() => setActionType('SENIOR')}
                    className="py-3 px-4 rounded font-bold bg-teal dark:bg-teal text-white hover:bg-teal/80 dark:hover:bg-teal/80 transition-all"
                  >
                    ✅ Send to Senior Management
                  </button>
                </div>
              ) : (
                <div className="bg-blue/10 dark:bg-blue/10 border border-blue dark:border-blue rounded p-4">
                  <h4 className="text-blue dark:text-blue font-bold m-0 mb-3">
                    {actionType === 'PLANNING' ? 'Send to Planning Team' : 'Send to Senior Management'}
                  </h4>
                  <textarea
                    value={directorRemarks}
                    onChange={(e) => setDirectorRemarks(e.target.value)}
                    placeholder={actionType === 'PLANNING' ? 
                      'Remarks for planning team (e.g., "Please review regional proposals and provide amendments")' :
                      'Executive summary for senior management'
                    }
                    className="w-full px-3 py-2 rounded border border-border dark:border-border bg-ink dark:bg-ink text-text-primary dark:text-text-primary text-sm mb-3"
                    rows="3"
                  />
                  <div className="flex gap-2">
                    {actionType === 'PLANNING' ? (
                      <button
                        onClick={handleSendToPlanning}
                        className="flex-1 px-4 py-2 rounded font-bold bg-blue dark:bg-blue text-white hover:bg-blue/80 dark:hover:bg-blue/80"
                      >
                        📤 Send to Planning Team
                      </button>
                    ) : (
                      <button
                        onClick={handleSendToSeniorManagement}
                        className="flex-1 px-4 py-2 rounded font-bold bg-teal dark:bg-teal text-white hover:bg-teal/80 dark:hover:bg-teal/80"
                      >
                        📤 Send to Senior Management
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setActionType(null);
                        setDirectorRemarks('');
                      }}
                      className="px-4 py-2 rounded font-bold bg-gray-600 dark:bg-gray-600 text-white hover:bg-gray-500 dark:hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-8 text-center">
              <p className="text-text-mid dark:text-text-mid m-0">
                Select a plan to review regional feedback
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuditDirectorReviewFeedbackView;
