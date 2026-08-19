import React, { useState, useEffect } from 'react';
import { useData } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import Badge from '../Badge';
import { denormalizeRegionName } from '../../utils/regionNormalizer';

/**
 * RegionalFeedbackAggregationView - NEW Proper Regional Feedback Collection & Aggregation
 * 
 * WORKFLOW (CORRECTED):
 * 1. Regional Director has plans with status AWAITING_REGIONAL_FEEDBACK
 * 2. Regional Director sends allocations to tax centers → Status "Sent to Tax Centers"
 * 3. Tax centers receive and submit individual feedback
 * 4. Regional Director COLLECTS all tax center feedback
 * 5. Regional Director AGGREGATES/SUMS feedback by audit type
 * 6. Regional Director submits AGGREGATED SUMMARY to Audit Director
 * 7. Plan status → FEEDBACK_COLLECTED
 */

function RegionalFeedbackAggregationView() {
  const { getUserInfo, authContext } = useAuth();
  const { data, updateData } = useData();
  const userInfo = getUserInfo();

  // Get region from auth context
  const region = authContext?.org_context?.assignedRegion 
    ? denormalizeRegionName(authContext.org_context.assignedRegion)
    : 'addis_ababa';

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [componentLoading, setComponentLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('awaiting'); // 'awaiting', 'collecting', 'submitted'
  const [showAggregationForm, setShowAggregationForm] = useState(false);
  const [regionalComments, setRegionalComments] = useState('');
  const [collectedTaxCenters, setCollectedTaxCenters] = useState([]);

  const auditTypeLabels = {
    desk_audit: 'Desk Audit',
    field_audit: 'Field Audit',
    joint_audit: 'Joint Audit',
    transfer_pricing: 'Transfer Pricing',
    comprehensive: 'Comprehensive',
    issue_audit: 'Issue Audit'
  };

  // Load plans on mount
  useEffect(() => {
    loadPlans();
  }, [data]);

  const loadPlans = () => {
    setComponentLoading(true);

    // Get ALL plans in feedback workflow
    const allRegionalPlans = (data?.plans || []).filter(plan => {
      return plan.status === 'AWAITING_REGIONAL_FEEDBACK' || 
             plan.status === 'FEEDBACK_COLLECTED' ||
             (plan.regionFeedbackStatus && plan.regionFeedbackStatus[region]);
    });

    console.log(`✅ Regional Director (${region}): Found ${allRegionalPlans.length} plans`, {
      awaiting: allRegionalPlans.filter(p => p.status === 'AWAITING_REGIONAL_FEEDBACK').length,
      collecting: allRegionalPlans.filter(p => p.allocationSentStatus?.[region]?.status === 'SENT').length,
      submitted: allRegionalPlans.filter(p => p.regionFeedbackStatus?.[region]?.status === 'received').length
    });

    setPlans(allRegionalPlans);
    setComponentLoading(false);
  };

  const getTabPlans = () => {
    switch(activeTab) {
      case 'awaiting':
        return plans.filter(p => p.status === 'AWAITING_REGIONAL_FEEDBACK');
      case 'collecting':
        return plans.filter(p => p.allocationSentStatus?.[region]?.status === 'SENT' && 
                                  !p.regionFeedbackStatus?.[region]);
      case 'submitted':
        return plans.filter(p => p.regionFeedbackStatus?.[region]?.status === 'received');
      default:
        return [];
    }
  };

  const handleSendAllocationsToTaxCenters = (planId) => {
    if (!planId) return;

    const planIndex = data.plans.findIndex(p => p.id === planId);
    if (planIndex < 0) {
      alert('Plan not found');
      return;
    }

    const updatedData = { ...data };
    const plan = updatedData.plans[planIndex];

    // ✅ Mark that allocations have been SENT to tax centers in this region
    if (!plan.allocationSentStatus) {
      plan.allocationSentStatus = {};
    }

    plan.allocationSentStatus[region] = {
      status: 'SENT',
      sentDate: new Date().toISOString(),
      sentBy: userInfo?.fullName || 'Regional Director'
    };

    console.log('✅ ALLOCATIONS SENT TO TAX CENTERS:', {
      planId: plan.id,
      region: region,
      sentDate: new Date().toISOString()
    });

    updateData(updatedData);
    alert(`✅ Allocations sent to tax centers in ${region}!\n\nTax centers can now review and submit feedback.`);
    setSelectedPlan(null);
    loadPlans();
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    setShowAggregationForm(false);
    setRegionalComments('');
    
    // Load collected tax center feedback
    const plan = plans.find(p => p.id === planId);
    if (plan && plan.taxCenterFeedback && plan.taxCenterFeedback[region]) {
      const taxCenters = Object.entries(plan.taxCenterFeedback[region]).map(([tcName, feedback]) => ({
        name: tcName,
        feedback: feedback,
        submitted: !!feedback.feedbackDate
      }));
      setCollectedTaxCenters(taxCenters);
    } else {
      setCollectedTaxCenters([]);
    }
  };

  // Calculate aggregated feedback by audit type
  const calculateAggregation = (planId) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan || !plan.taxCenterFeedback || !plan.taxCenterFeedback[region]) {
      return {};
    }

    const aggregated = {};
    
    // Initialize audit types
    Object.keys(auditTypeLabels).forEach(type => {
      aggregated[type] = {
        totalAllocated: 0,
        totalProposed: 0,
        capacityStatuses: [],
        resourceStatuses: [],
        timelineStatuses: [],
        remarks: [],
        taxCentersReporting: 0
      };
    });

    // Aggregate feedback from all tax centers
    Object.entries(plan.taxCenterFeedback[region]).forEach(([tcName, feedback]) => {
      if (feedback.feedbackByType) {
        Object.entries(feedback.feedbackByType).forEach(([type, fb]) => {
          if (aggregated[type]) {
            aggregated[type].totalAllocated += fb.allocated || 0;
            aggregated[type].totalProposed += fb.proposedAmount || fb.allocated || 0;
            if (fb.capacity) aggregated[type].capacityStatuses.push(fb.capacity);
            if (fb.resourceStatus) aggregated[type].resourceStatuses.push(fb.resourceStatus);
            if (fb.timeline) aggregated[type].timelineStatuses.push(fb.timeline);
            if (fb.remarks) aggregated[type].remarks.push(`${tcName}: ${fb.remarks}`);
          }
        });
      }
      aggregated.totalTaxCentersSubmitted = (aggregated.totalTaxCentersSubmitted || 0) + 1;
    });

    return aggregated;
  };

  // Get most common status (for summary)
  const getMostCommonStatus = (statuses) => {
    if (statuses.length === 0) return 'Unknown';
    const counts = {};
    statuses.forEach(s => counts[s] = (counts[s] || 0) + 1);
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  const handleSubmitAggregatedFeedback = async () => {
    if (!selectedPlan) return;

    const planIndex = data.plans.findIndex(p => p.id === selectedPlan);
    if (planIndex < 0) return;

    // Validate at least one tax center submitted
    if (collectedTaxCenters.filter(tc => tc.submitted).length === 0) {
      alert('No tax center feedback collected yet. Wait for tax centers to submit.');
      return;
    }

    const aggregation = calculateAggregation(selectedPlan);

    const updatedData = { ...data };
    const plan = updatedData.plans[planIndex];

    // ✅ Store AGGREGATED regional feedback
    if (!plan.regionFeedbackStatus) {
      plan.regionFeedbackStatus = {};
    }

    plan.regionFeedbackStatus[region] = {
      status: 'received',
      regionalComments: regionalComments,
      aggregatedFeedback: aggregation,
      taxCenterCount: collectedTaxCenters.filter(tc => tc.submitted).length,
      receivedDate: new Date().toISOString(),
      submittedBy: userInfo?.fullName || 'Regional Director',
      region: region
    };

    // ✅ UPDATE plan status if ALL regions submitted
    const allRegions = Object.keys(plan.allocationSentStatus || {});
    const allRegionsSubmitted = allRegions.every(r => plan.regionFeedbackStatus?.[r]?.status === 'received');
    
    if (allRegionsSubmitted) {
      plan.status = 'FEEDBACK_COLLECTED';
      console.log('✅ ALL REGIONS SUBMITTED - Plan status updated to FEEDBACK_COLLECTED');
    }

    // ✅ Track in approval history
    plan.approvalHistory = plan.approvalHistory || [];
    plan.approvalHistory.push({
      action: 'REGIONAL_FEEDBACK_AGGREGATED_SUBMITTED',
      by: userInfo?.fullName || 'Regional Director',
      date: new Date().toISOString(),
      region: region,
      taxCenterCount: collectedTaxCenters.filter(tc => tc.submitted).length,
      notes: regionalComments || 'Regional feedback aggregated and submitted',
      version: plan.version
    });

    console.log('✅ AGGREGATED REGIONAL FEEDBACK SUBMITTED:', {
      planId: plan.id,
      region: region,
      taxCentersReporting: collectedTaxCenters.filter(tc => tc.submitted).length,
      aggregatedFeedback: aggregation
    });

    updateData(updatedData);
    alert(`✅ Aggregated feedback from ${collectedTaxCenters.filter(tc => tc.submitted).length} tax centers submitted to Audit Director!\n\nDirector will review summary and feedback.`);
    
    setSelectedPlan(null);
    setShowAggregationForm(false);
    setRegionalComments('');
    loadPlans();
  };

  const getPlanDetails = () => {
    if (!selectedPlan) return null;
    return plans.find(p => p.id === selectedPlan);
  };

  const planDetails = getPlanDetails();
  const aggregation = selectedPlan ? calculateAggregation(selectedPlan) : {};

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="detail-header mb-6">
        <h2 className="text-2xl font-bold text-text-hi dark:text-text-hi flex items-center gap-2">
          <i className="fas fa-inbox"></i> Feedback Aggregation & Submission
        </h2>
        <p className="text-text-mid dark:text-text-mid mt-2">
          {region} Region • Collect tax center feedback, aggregate, and submit to director
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Plans List */}
        <div className="lg:col-span-1">
          <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg">
            {/* Tabs */}
            <div className="flex flex-col border-b border-border dark:border-border">
              <button
                onClick={() => setActiveTab('awaiting')}
                className={`px-4 py-3 font-bold text-center transition-all text-xs ${
                  activeTab === 'awaiting'
                    ? 'bg-warning dark:bg-warning text-white'
                    : 'text-text-mid dark:text-text-mid hover:text-text-hi dark:hover:text-text-hi'
                }`}
              >
                Awaiting ({getTabPlans().length})
              </button>
              <button
                onClick={() => setActiveTab('collecting')}
                className={`px-4 py-3 font-bold text-center transition-all text-xs border-t border-border dark:border-border ${
                  activeTab === 'collecting'
                    ? 'bg-info dark:bg-info text-white'
                    : 'text-text-mid dark:text-text-mid hover:text-text-hi dark:hover:text-text-hi'
                }`}
              >
                Collecting ({getTabPlans().length})
              </button>
              <button
                onClick={() => setActiveTab('submitted')}
                className={`px-4 py-3 font-bold text-center transition-all text-xs border-t border-border dark:border-border ${
                  activeTab === 'submitted'
                    ? 'bg-teal dark:bg-teal text-white'
                    : 'text-text-mid dark:text-text-mid hover:text-text-hi dark:hover:text-text-hi'
                }`}
              >
                Submitted ({getTabPlans().length})
              </button>
            </div>

            {/* Plans List */}
            {componentLoading ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">Loading...</div>
            ) : getTabPlans().length === 0 ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center text-sm">
                No plans in this stage
              </div>
            ) : (
              <div className="divide-y divide-border dark:divide-border max-h-96 overflow-y-auto">
                {getTabPlans().map(plan => (
                  <div
                    key={plan.id}
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedPlan === plan.id
                        ? activeTab === 'awaiting'
                          ? 'bg-warning/20 dark:bg-warning/20 border-l-4 border-warning dark:border-warning'
                          : activeTab === 'collecting'
                          ? 'bg-info/20 dark:bg-info/20 border-l-4 border-info dark:border-info'
                          : 'bg-teal/20 dark:bg-teal/20 border-l-4 border-teal dark:border-teal'
                        : 'hover:bg-ink dark:hover:bg-ink'
                    }`}
                  >
                    <p className="font-bold text-text-hi dark:text-text-hi m-0 text-sm">{plan.id}</p>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0 mt-1">{plan.name}</p>
                    
                    {/* Tax Center Count Badge */}
                    {activeTab === 'collecting' && plan.taxCenterFeedback?.[region] && (
                      <div className="mt-2">
                        <Badge 
                          status="info" 
                          text={`${Object.keys(plan.taxCenterFeedback[region]).length} feedback(s)`}
                          className="text-xs"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Plan Details & Actions */}
        <div className="lg:col-span-3">
          {planDetails ? (
            <div className="space-y-6">
              {/* Plan Info */}
              <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Plan Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Plan ID</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">{planDetails.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Status</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">{planDetails.status}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Allocation Status</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">
                      {planDetails.allocationSentStatus?.[region]?.status || 'Not Sent'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stage 1: Send Allocations */}
              {activeTab === 'awaiting' && (
                <div className="bg-warning/10 dark:bg-warning/10 border border-warning dark:border-warning rounded-lg p-4">
                  <h4 className="text-warning dark:text-warning font-bold m-0 mb-3">
                    <i className="fas fa-paper-plane mr-2"></i>Step 1: Send Allocations to Tax Centers
                  </h4>
                  <p className="text-sm text-text-mid dark:text-text-mid m-0 mb-4">
                    Send this plan's allocations to all tax centers in {region}. They will then submit their feedback.
                  </p>
                  <button
                    onClick={() => handleSendAllocationsToTaxCenters(selectedPlan)}
                    className="w-full px-4 py-2 rounded font-bold bg-warning dark:bg-warning text-white hover:bg-warning/80 dark:hover:bg-warning/80"
                  >
                    📤 Send Allocations to Tax Centers
                  </button>
                </div>
              )}

              {/* Stage 2: Collect Tax Center Feedback */}
              {activeTab === 'collecting' && (
                <div className="space-y-4">
                  {/* Tax Centers Feedback Status */}
                  <div className="bg-info/10 dark:bg-info/10 border border-info dark:border-info rounded-lg p-4">
                    <h4 className="text-info dark:text-info font-bold m-0 mb-3">
                      <i className="fas fa-list-check mr-2"></i>Tax Center Feedback Status
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {collectedTaxCenters.length === 0 ? (
                        <p className="text-xs text-text-mid dark:text-text-mid">Waiting for tax centers to submit feedback...</p>
                      ) : (
                        collectedTaxCenters.map((tc, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-ink dark:bg-ink rounded">
                            <span className="text-xs font-bold text-text-hi dark:text-text-hi">{tc.name}</span>
                            <Badge 
                              status={tc.submitted ? 'approved' : 'pending'} 
                              text={tc.submitted ? '✅ Submitted' : '⏳ Awaiting'}
                              className="text-xs"
                            />
                          </div>
                        ))
                      )}
                    </div>
                    <p className="text-xs text-teal dark:text-teal font-bold m-0 mt-3">
                      {collectedTaxCenters.filter(tc => tc.submitted).length} of {collectedTaxCenters.length} tax centers submitted
                    </p>
                  </div>

                  {/* Aggregated Feedback Summary */}
                  {Object.keys(aggregation).length > 0 && (
                    <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4">
                      <h4 className="text-text-hi dark:text-text-hi font-bold m-0 mb-3">
                        <i className="fas fa-chart-bar mr-2"></i>Aggregated Feedback Summary
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead className="bg-ink dark:bg-ink">
                            <tr>
                              <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Audit Type</th>
                              <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">Allocated</th>
                              <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">Proposed</th>
                              <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Capacity</th>
                              <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Resources</th>
                              <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Timeline</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border dark:divide-border">
                            {Object.entries(aggregation).map(([type, agg]) => (
                              agg.totalAllocated > 0 && (
                                <tr key={type} className="hover:bg-ink/50 dark:hover:bg-ink/50">
                                  <td className="p-2 text-text-hi dark:text-text-hi font-bold">
                                    {auditTypeLabels[type] || type}
                                  </td>
                                  <td className="p-2 text-center text-teal dark:text-teal font-bold">
                                    {agg.totalAllocated}
                                  </td>
                                  <td className="p-2 text-center text-text-hi dark:text-text-hi">
                                    {agg.totalProposed}
                                  </td>
                                  <td className="p-2 text-text-mid dark:text-text-mid text-xs">
                                    {getMostCommonStatus(agg.capacityStatuses)}
                                  </td>
                                  <td className="p-2 text-text-mid dark:text-text-mid text-xs">
                                    {getMostCommonStatus(agg.resourceStatuses)}
                                  </td>
                                  <td className="p-2 text-text-mid dark:text-text-mid text-xs">
                                    {getMostCommonStatus(agg.timelineStatuses)}
                                  </td>
                                </tr>
                              )
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Aggregation Form */}
                  {!showAggregationForm ? (
                    <button
                      onClick={() => setShowAggregationForm(true)}
                      disabled={collectedTaxCenters.filter(tc => tc.submitted).length === 0}
                      className={`w-full px-4 py-2 rounded font-bold transition-all ${
                        collectedTaxCenters.filter(tc => tc.submitted).length === 0
                          ? 'bg-gray-600 dark:bg-gray-600 text-gray-400 dark:text-gray-400 cursor-not-allowed'
                          : 'bg-info dark:bg-info text-white hover:bg-info/80 dark:hover:bg-info/80'
                      }`}
                    >
                      📋 Prepare Aggregated Submission
                    </button>
                  ) : (
                    <div className="bg-info/10 dark:bg-info/10 border border-info dark:border-info rounded-lg p-4">
                      <h4 className="text-info dark:text-info font-bold m-0 mb-3">
                        <i className="fas fa-pen-fancy mr-2"></i>Regional Director Comments (Optional)
                      </h4>
                      <textarea
                        value={regionalComments}
                        onChange={(e) => setRegionalComments(e.target.value)}
                        placeholder="Add any regional-level comments or observations about the tax center feedback..."
                        className="w-full px-3 py-2 rounded border border-border dark:border-border bg-ink dark:bg-ink text-text-primary dark:text-text-primary text-sm"
                        rows="4"
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={handleSubmitAggregatedFeedback}
                          className="flex-1 px-4 py-2 rounded font-bold bg-teal dark:bg-teal text-white hover:bg-teal/80"
                        >
                          ✅ Submit Aggregated Feedback to Director
                        </button>
                        <button
                          onClick={() => {
                            setShowAggregationForm(false);
                            setRegionalComments('');
                          }}
                          className="px-4 py-2 rounded font-bold bg-gray-600 dark:bg-gray-600 text-white hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Stage 3: View Submitted */}
              {activeTab === 'submitted' && planDetails.regionFeedbackStatus?.[region] && (
                <div className="bg-teal/10 dark:bg-teal/10 border border-teal dark:border-teal rounded-lg p-4">
                  <h4 className="text-teal dark:text-teal font-bold m-0 mb-3">
                    <i className="fas fa-check-circle mr-2"></i>Aggregated Feedback Submitted
                  </h4>
                  
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-ink dark:bg-ink p-3 rounded">
                      <p className="text-xs text-text-mid dark:text-text-mid m-0">Tax Centers Reporting</p>
                      <p className="text-lg font-bold text-teal dark:text-teal m-0 mt-1">
                        {planDetails.regionFeedbackStatus[region].taxCenterCount}
                      </p>
                    </div>
                    <div className="bg-ink dark:bg-ink p-3 rounded">
                      <p className="text-xs text-text-mid dark:text-text-mid m-0">Submitted Date</p>
                      <p className="text-xs text-text-hi dark:text-text-hi m-0 mt-1">
                        {new Date(planDetails.regionFeedbackStatus[region].receivedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Regional Comments */}
                  {planDetails.regionFeedbackStatus[region].regionalComments && (
                    <div className="mb-4 p-3 bg-panel dark:bg-panel rounded border border-border dark:border-border">
                      <p className="text-xs font-bold text-text-mid dark:text-text-mid m-0 mb-2">Regional Comments:</p>
                      <p className="text-sm text-text-primary dark:text-text-primary m-0">
                        {planDetails.regionFeedbackStatus[region].regionalComments}
                      </p>
                    </div>
                  )}

                  {/* Status Badge */}
                  <Badge status="director-approved" text="✅ Submitted to Audit Director" />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-8 text-center">
              <p className="text-text-mid dark:text-text-mid m-0">
                {componentLoading ? 'Loading plans...' : 'Select a plan to manage feedback'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegionalFeedbackAggregationView;
