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
  const [showDetailedFeedback, setShowDetailedFeedback] = useState(false);
  const [selectedTaxCenterForDetail, setSelectedTaxCenterForDetail] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedAggregation, setEditedAggregation] = useState({});

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

  const handleShowDetailedFeedback = () => {
    setShowDetailedFeedback(true);
    setSelectedTaxCenterForDetail(null);
  };

  const getTaxCenterDetailedFeedback = (taxCenterName) => {
    if (!planDetails || !planDetails.taxCenterFeedback || !planDetails.taxCenterFeedback[region]) {
      return null;
    }
    return planDetails.taxCenterFeedback[region][taxCenterName];
  };

  const handleEditTaxCenterFeedback = (taxCenterName, auditType, newValue) => {
    if (!planDetails) return;
    
    const updatedData = { ...data };
    const planIndex = updatedData.plans.findIndex(p => p.id === selectedPlan);
    if (planIndex < 0) return;
    
    const plan = updatedData.plans[planIndex];
    const tcFeedback = plan.taxCenterFeedback?.[region]?.[taxCenterName];
    
    if (!tcFeedback || !tcFeedback.feedbackByType) return;
    
    // Update the specific audit type feedback
    const parsed = parseInt(newValue) || 0;
    tcFeedback.feedbackByType[auditType].proposedAmount = parsed;
    tcFeedback.feedbackByType[auditType].edited = true;
    
    updateData(updatedData);
    
    // Recalculate aggregation in real-time
    const newAgg = calculateAggregation(selectedPlan);
    console.log(`✅ Updated ${taxCenterName} ${auditType} to ${parsed}. New aggregation:`, newAgg);
  };

  const handleEnterEditMode = () => {
    // Copy current aggregation to editable state
    const copy = {};
    Object.entries(aggregation).forEach(([type, agg]) => {
      if (agg.totalAllocated > 0) {
        copy[type] = {
          totalAllocated: agg.totalAllocated,
          totalProposed: agg.totalProposed,
          edited: false
        };
      }
    });
    setEditedAggregation(copy);
    setEditMode(true);
  };

  const handleEditProposedAmount = (type, newValue) => {
    const parsed = parseInt(newValue) || 0;
    setEditedAggregation(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        totalProposed: parsed,
        edited: true
      }
    }));
  };

  const handleExitEditMode = () => {
    setEditMode(false);
    setEditedAggregation({});
  };

  const getEditedAggregation = () => {
    if (!editMode || Object.keys(editedAggregation).length === 0) {
      return aggregation;
    }
    return editedAggregation;
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

    // Check if any tax center feedback was edited
    const plan = data.plans[planIndex];
    const hasTC Edits = Object.entries(plan.taxCenterFeedback?.[region] || {}).some(([tcName, tcFB]) => {
      return Object.entries(tcFB.feedbackByType || {}).some(([type, fb]) => fb.edited);
    });

    // Use current aggregation (which reflects any edits)
    const finalAggregation = calculateAggregation(selectedPlan);

    // Use edited aggregation if in edit mode, otherwise use calculated
    const finalAggregate = editMode && Object.keys(editedAggregation).length > 0 
      ? { ...editedAggregation, ...finalAggregation }  // Merge both edits
      : finalAggregation;

    const updatedData = { ...data };
    const updatedPlan = updatedData.plans[planIndex];

    // ✅ Store AGGREGATED regional feedback
    if (!updatedPlan.regionFeedbackStatus) {
      updatedPlan.regionFeedbackStatus = {};
    }

    // Track all types of edits
    const hasRegionalEdits = editMode && Object.keys(editedAggregation).length > 0 && 
                             Object.values(editedAggregation).some(agg => agg.edited);

    updatedPlan.regionFeedbackStatus[region] = {
      status: 'received',
      regionalComments: regionalComments,
      aggregatedFeedback: finalAggregate,
      taxCenterCount: collectedTaxCenters.filter(tc => tc.submitted).length,
      receivedDate: new Date().toISOString(),
      submittedBy: userInfo?.fullName || 'Regional Director',
      region: region,
      regionalEdits: hasRegionalEdits,  // Regional director override of aggregation
      taxCenterEdits: hasTC Edits,       // Tax center feedback was edited by regional director
      originalAggregation: hasRegionalEdits ? calculateAggregation(selectedPlan) : null
    };

    // ✅ UPDATE plan status if ALL regions submitted
    const allRegions = Object.keys(updatedPlan.allocationSentStatus || {});
    const allRegionsSubmitted = allRegions.every(r => updatedPlan.regionFeedbackStatus?.[r]?.status === 'received');
    
    if (allRegionsSubmitted) {
      updatedPlan.status = 'FEEDBACK_COLLECTED';
      console.log('✅ ALL REGIONS SUBMITTED - Plan status updated to FEEDBACK_COLLECTED');
    }

    // ✅ Track in approval history
    updatedPlan.approvalHistory = updatedPlan.approvalHistory || [];
    updatedPlan.approvalHistory.push({
      action: 'REGIONAL_FEEDBACK_AGGREGATED_SUBMITTED',
      by: userInfo?.fullName || 'Regional Director',
      date: new Date().toISOString(),
      region: region,
      taxCenterCount: collectedTaxCenters.filter(tc => tc.submitted).length,
      notes: regionalComments || 'Regional feedback aggregated and submitted',
      regionalEdits: hasRegionalEdits,
      taxCenterEdits: hasTC Edits,
      version: updatedPlan.version
    });

    console.log('✅ AGGREGATED REGIONAL FEEDBACK SUBMITTED:', {
      planId: updatedPlan.id,
      region: region,
      taxCentersReporting: collectedTaxCenters.filter(tc => tc.submitted).length,
      aggregatedFeedback: finalAggregate,
      regionalEdits: hasRegionalEdits,
      taxCenterEdits: hasTC Edits
    });

    updateData(updatedData);
    
    const editNotes = [];
    if (hasTC Edits) editNotes.push('(with tax center feedback adjustments)');
    if (hasRegionalEdits) editNotes.push('(with regional capacity overrides)');
    
    alert(`✅ Aggregated feedback from ${collectedTaxCenters.filter(tc => tc.submitted).length} tax centers submitted to Audit Director!\n\n${editNotes.join(' ')}`);
    
    setSelectedPlan(null);
    setShowAggregationForm(false);
    setRegionalComments('');
    setEditMode(false);
    setEditedAggregation({});
    loadPlans();
  };

  const getPlanDetails = () => {
    if (!selectedPlan) return null;
    return plans.find(p => p.id === selectedPlan);
  };

  const planDetails = getPlanDetails();
  const aggregation = selectedPlan ? calculateAggregation(selectedPlan) : {};

  // Detailed Feedback Modal
  const DetailedFeedbackModal = () => {
    if (!showDetailedFeedback || !planDetails) return null;

    const feedbackList = collectedTaxCenters.filter(tc => tc.submitted);

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-panel dark:bg-panel rounded-lg max-w-5xl w-full max-h-[80vh] overflow-y-auto mx-4 border border-border dark:border-border">
          {/* Header */}
          <div className="sticky top-0 bg-ink dark:bg-ink border-b border-border dark:border-border p-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-text-hi dark:text-text-hi m-0">
                <i className="fas fa-eye mr-2"></i>Individual Tax Center Feedback
              </h3>
              <p className="text-xs text-text-mid dark:text-text-mid m-0 mt-1">
                Regional Director can edit per-audit-type feedback to optimize allocation
              </p>
            </div>
            <button
              onClick={() => {
                setShowDetailedFeedback(false);
                setSelectedTaxCenterForDetail(null);
              }}
              className="text-text-mid dark:text-text-mid hover:text-text-hi dark:hover:text-text-hi cursor-pointer text-xl"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {feedbackList.length === 0 ? (
              <p className="text-text-mid dark:text-text-mid text-center py-8">No tax center feedback submitted yet</p>
            ) : (
              <div className="space-y-4">
                {feedbackList.map((tc, idx) => {
                  const tcFeedback = getTaxCenterDetailedFeedback(tc.name);
                  if (!tcFeedback) return null;

                  return (
                    <div key={idx} className="border border-border dark:border-border rounded-lg p-4 bg-ink/30 dark:bg-ink/30">
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-border dark:border-border">
                        <h4 className="text-text-hi dark:text-text-hi font-bold m-0">{tc.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge status="approved" text="Submitted" className="text-xs" />
                          <span className="text-xs text-text-mid dark:text-text-mid">
                            Editable below
                          </span>
                        </div>
                      </div>

                      {/* Per-Audit-Type Adjustments - EDITABLE */}
                      {tcFeedback.feedbackByType && Object.keys(tcFeedback.feedbackByType).length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead className="bg-ink dark:bg-ink">
                              <tr>
                                <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Audit Type</th>
                                <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">Allocated</th>
                                <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">Original Proposed</th>
                                <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">Regional Override</th>
                                <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">Change</th>
                                <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Notes</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border dark:divide-border">
                              {Object.entries(tcFeedback.feedbackByType).map(([type, fb]) => {
                                const originalProposed = fb.proposedAmount || fb.allocated;
                                const isEdited = fb.edited;
                                const currentValue = fb.proposedAmount || fb.allocated;
                                const change = currentValue - (fb.allocated || 0);
                                const changeColor = change > 0 ? 'text-info' : change < 0 ? 'text-warning' : 'text-teal';
                                
                                return (
                                  <tr key={type} className={isEdited ? 'bg-warning/20 dark:bg-warning/20' : 'hover:bg-ink dark:hover:bg-ink'}>
                                    <td className="p-2 text-text-hi dark:text-text-hi font-bold">
                                      {auditTypeLabels[type] || type}
                                    </td>
                                    <td className="p-2 text-center text-text-mid dark:text-text-mid">
                                      {fb.allocated}
                                    </td>
                                    <td className="p-2 text-center text-text-mid dark:text-text-mid">
                                      {originalProposed}
                                    </td>
                                    <td className="p-2 text-center">
                                      <input
                                        type="number"
                                        value={currentValue}
                                        onChange={(e) => handleEditTaxCenterFeedback(tc.name, type, e.target.value)}
                                        className={`w-20 px-2 py-1 rounded border text-center font-bold text-text-hi dark:text-text-hi ${
                                          isEdited
                                            ? 'border-warning dark:border-warning bg-warning/10 dark:bg-warning/10'
                                            : 'border-info dark:border-info bg-ink dark:bg-ink'
                                        }`}
                                      />
                                    </td>
                                    <td className={`p-2 text-center font-bold ${changeColor} dark:${changeColor}`}>
                                      {change > 0 ? `+${change}` : change}
                                    </td>
                                    <td className="p-2 text-text-mid dark:text-text-mid text-xs">
                                      {fb.remarks || '—'}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-text-mid dark:text-text-mid text-xs">No per-audit-type feedback recorded</p>
                      )}

                      {/* Overall Comments */}
                      {(tcFeedback.overallComments || tcFeedback.feedback) && (
                        <div className="mt-3 p-2 bg-panel dark:bg-panel rounded border border-border dark:border-border">
                          <p className="text-xs text-text-mid dark:text-text-mid m-0 mb-1 font-bold">Their Comments:</p>
                          <p className="text-xs text-text-primary dark:text-text-primary m-0">
                            {tcFeedback.overallComments || tcFeedback.feedback}
                          </p>
                        </div>
                      )}

                      {/* Submission Date */}
                      <p className="text-xs text-text-mid dark:text-text-mid m-0 mt-2">
                        Submitted: {tcFeedback.feedbackDate ? new Date(tcFeedback.feedbackDate).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Instructions */}
            <div className="mt-4 p-3 bg-info/10 dark:bg-info/10 rounded border border-info dark:border-info">
              <p className="text-xs text-info dark:text-info font-bold m-0 mb-1">
                <i className="fas fa-info-circle mr-1"></i>How to Use
              </p>
              <ul className="text-xs text-text-mid dark:text-text-mid m-0 space-y-1 ml-4">
                <li>✏️ Edit "Regional Override" column to adjust tax center feedback</li>
                <li>📊 Aggregated summary above updates automatically</li>
                <li>⚠️ Edited rows highlight in orange</li>
                <li>💾 Changes saved automatically as you type</li>
                <li>✅ Close this modal when done - your edits persist</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="px-6 py-8">
      <DetailedFeedbackModal />
      
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
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-text-hi dark:text-text-hi font-bold m-0">
                          <i className="fas fa-chart-bar mr-2"></i>Aggregated Capacity by Audit Type
                        </h4>
                        {!editMode ? (
                          <button
                            onClick={handleEnterEditMode}
                            className="px-3 py-1 rounded bg-info/20 dark:bg-info/20 text-info dark:text-info font-bold text-xs hover:bg-info/30 dark:hover:bg-info/30"
                          >
                            <i className="fas fa-edit mr-1"></i>Edit
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={handleExitEditMode}
                              className="px-3 py-1 rounded bg-gray-600 dark:bg-gray-600 text-white font-bold text-xs hover:bg-gray-500"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead className="bg-ink dark:bg-ink">
                            <tr>
                              <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Audit Type</th>
                              <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">Your Target</th>
                              <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">
                                {editMode ? 'Revised Capacity' : 'TC Capacity'}
                              </th>
                              <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">Gap</th>
                              <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border dark:divide-border">
                            {Object.entries(getEditedAggregation()).map(([type, agg]) => {
                              const gap = agg.totalAllocated - agg.totalProposed;
                              const gapPercentage = agg.totalAllocated > 0 ? ((gap / agg.totalAllocated) * 100).toFixed(1) : 0;
                              let statusBadge = '● Match';
                              let statusColor = 'text-teal';
                              if (gap > 0) {
                                statusBadge = `● Surplus +${gap}`;
                                statusColor = 'text-info';
                              } else if (gap < 0) {
                                statusBadge = `● Short ${gap}`;
                                statusColor = 'text-warning';
                              }
                              
                              return (
                                agg.totalAllocated > 0 && (
                                  <tr key={type} className={editMode && agg.edited ? 'bg-info/10 dark:bg-info/10' : 'hover:bg-ink/50 dark:hover:bg-ink/50'}>
                                    <td className="p-2 text-text-hi dark:text-text-hi font-bold">
                                      {auditTypeLabels[type] || type}
                                    </td>
                                    <td className="p-2 text-center text-text-hi dark:text-text-hi font-bold">
                                      {agg.totalAllocated}
                                    </td>
                                    <td className="p-2 text-center">
                                      {editMode ? (
                                        <input
                                          type="number"
                                          value={agg.totalProposed}
                                          onChange={(e) => handleEditProposedAmount(type, e.target.value)}
                                          className="w-16 px-2 py-1 rounded border border-info dark:border-info bg-ink dark:bg-ink text-text-hi dark:text-text-hi font-bold text-center"
                                        />
                                      ) : (
                                        <span className="text-teal dark:text-teal font-bold">{agg.totalProposed}</span>
                                      )}
                                    </td>
                                    <td className="p-2 text-center font-bold" style={{color: gap > 0 ? '#06b6d4' : gap < 0 ? '#f59e0b' : '#10b981'}}>
                                      {gap > 0 ? `+${gap}` : gap}
                                    </td>
                                    <td className={`p-2 font-bold ${statusColor} dark:${statusColor}`}>
                                      {statusBadge}
                                    </td>
                                  </tr>
                                )
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Show individual tax center feedback link */}
                      {!editMode && (
                        <div className="mt-4 pt-3 border-t border-border dark:border-border">
                          <button
                            onClick={handleShowDetailedFeedback}
                            className="text-info dark:text-info font-bold hover:underline text-sm flex items-center gap-2 cursor-pointer"
                          >
                            <i className="fas fa-eye"></i> Show individual tax center feedback
                          </button>
                        </div>
                      )}

                      {/* Edit Mode Info */}
                      {editMode && (
                        <div className="mt-4 pt-3 border-t border-border dark:border-border p-3 bg-info/10 dark:bg-info/10 rounded">
                          <p className="text-xs text-info dark:text-info font-bold m-0 mb-2">
                            <i className="fas fa-info-circle mr-1"></i>Edit Mode: Adjust capacity amounts as needed based on regional analysis
                          </p>
                          <p className="text-xs text-text-mid dark:text-text-mid m-0">
                            Changes are highlighted in blue. Click Cancel to revert or continue to submit with new values.
                          </p>
                        </div>
                      )}
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
