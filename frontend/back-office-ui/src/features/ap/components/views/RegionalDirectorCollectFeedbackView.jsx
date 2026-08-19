import React, { useState, useEffect } from 'react';
import { useData } from '../../services/dataService';
import { denormalizeRegionName, getDisplayRegionName } from '../../utils/regionNormalizer';
import { filterPlansForRegion } from '../../utils/regionalDataFilter';
import { useAuth } from '../../context/AuthContext';
import Card from '../Card';
import Badge from '../Badge';

/**
 * RegionalDirectorCollectFeedbackView
 * Regional Director collects feedback from Tax Centers, aggregates it, and sends to Audit Director
 * 
 * WORKFLOW:
 * 1. Shows plans with feedback received from tax centers
 * 2. Aggregates all tax center feedback by audit type
 * 3. Shows table with totals: Original Allocation, TC Proposed, Regional Proposed
 * 4. Pre-fills with default values (average of TC proposals)
 * 5. Regional Director can override any field
 * 6. Sends aggregated feedback to Audit Director
 */

function RegionalDirectorCollectFeedbackView() {
  const { authContext, getUserInfo } = useAuth();
  const { data, updateData } = useData();
  const userInfo = getUserInfo();

  // Get regional director's assigned region
  const directorRegion = authContext?.region || null;

  // State
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regionalFeedback, setRegionalFeedback] = useState({}); // Aggregated feedback by type
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [submitted, setSubmitted] = useState({});

  const auditTypes = ['desk_audit', 'field_audit', 'joint_audit', 'transfer_pricing', 'comprehensive', 'issue_audit'];
  const auditTypeLabels = {
    desk_audit: 'Desk Audit',
    field_audit: 'Field Audit',
    joint_audit: 'Joint Audit',
    transfer_pricing: 'Transfer Pricing',
    comprehensive: 'Comprehensive',
    issue_audit: 'Issue Audit'
  };

  // Load plans when data or region changes
  useEffect(() => {
    loadPlans();
  }, [directorRegion, data]);

  const loadPlans = () => {
    setLoading(true);

    if (!directorRegion) {
      setPlans([]);
      setLoading(false);
      return;
    }

    // ✅ REGIONAL ISOLATION: Only show plans for THIS region
    const allFeedbackPlans = (data.plans || []).filter(plan => {
      // Check if allocation was sent from any region
      const hasAllocationSent = !!plan.allocationSentStatus && 
        Object.keys(plan.allocationSentStatus).length > 0;
      
      // Check if there's feedback from any tax centers
      const hasFeedback = plan.taxCenterFeedback &&
        Object.keys(plan.taxCenterFeedback).length > 0;
      
      return hasAllocationSent && hasFeedback;
    });

    // Filter only plans for this region
    const regionalPlans = filterPlansForRegion(allFeedbackPlans, directorRegion);

    console.log(`✅ Regional Director (${directorRegion}): Found ${regionalPlans.length} plans with feedback out of ${allFeedbackPlans.length} total`);

    setPlans(regionalPlans);

    // Build submitted status
    const submittedStatus = {};
    regionalPlans.forEach(plan => {
      submittedStatus[plan.id] = !!plan.regionalFeedbackStatus?.[directorRegion]?.sentToDirector;
    });
    setSubmitted(submittedStatus);

    setLoading(false);
  };

  const aggregateTaxCenterFeedback = (plan) => {
    const taxCenterFeedback = plan.taxCenterFeedback?.[directorRegion] || {};
    const regionalAllocation = plan.regionalAllocation?.[directorRegion] || {};
    const nationalAllocations = plan.nationalAllocations || {};
    
    const aggregated = {};
    
    auditTypes.forEach(type => {
      // Use regional allocation if available, fallback to national allocations
      const originalAllocated = regionalAllocation[type] || nationalAllocations[type] || 0;
      let totalTCProposed = 0;
      let tcCount = 0;
      const tcFeedbacks = [];
      
      // Collect all TC feedback for this audit type
      Object.entries(taxCenterFeedback).forEach(([tcId, feedback]) => {
        if (feedback.feedbackByType && feedback.feedbackByType[type]) {
          const tcFb = feedback.feedbackByType[type];
          totalTCProposed += tcFb.proposedAmount || tcFb.allocated || 0;
          tcCount++;
          tcFeedbacks.push({
            taxCenter: tcId,
            allocated: tcFb.allocated,
            proposed: tcFb.proposedAmount || tcFb.allocated,
            capacity: tcFb.capacity,
            resources: tcFb.resourceStatus,
            timeline: tcFb.timeline,
            remarks: tcFb.remarks
          });
        }
      });
      
      // Calculate average or use total TC proposed
      const avgTCProposed = tcCount > 0 ? Math.round(totalTCProposed / tcCount) : originalAllocated;
      
      aggregated[type] = {
        originalAllocated: originalAllocated,
        tcProposedTotal: totalTCProposed,
        regionalProposed: totalTCProposed, // Default to sum of TC proposals
        capacity: 'Adequate', // Default
        resourceStatus: 'Available', // Default
        timeline: 'On Schedule', // Default
        remarks: `${tcCount} tax centers provided feedback for this type`,
        taxCenterDetails: tcFeedbacks
      };
    });
    
    return aggregated;
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    setShowFeedbackForm(false);
    
    // Generate aggregated feedback with defaults
    const plan = data.plans.find(p => p.id === planId);
    
    if (plan) {
      const aggregated = aggregateTaxCenterFeedback(plan);
      setRegionalFeedback(aggregated);
    }
  };

  const handleSendFeedback = () => {
    // Validate
    const hasFeedback = Object.values(regionalFeedback).some(fb => 
      fb.remarks && fb.remarks.trim()
    );
    
    if (!hasFeedback) {
      alert('Please provide remarks for at least one audit type');
      return;
    }

    if (!selectedPlan || !directorRegion) return;

    const planIndex = data.plans.findIndex(p => p.id === selectedPlan);

    if (planIndex < 0) {
      alert('Plan not found');
      return;
    }

    const updatedData = { ...data };
    const plan = updatedData.plans[planIndex];
    const allTaxCenterFeedback = plan.taxCenterFeedback?.[directorRegion] || {};

    // ✅ Send aggregated feedback to director
    if (!plan.regionalFeedbackStatus) {
      plan.regionalFeedbackStatus = {};
    }

    plan.regionalFeedbackStatus[directorRegion] = {
      status: 'feedback_collected',
      sentToDirector: true,
      sentDate: new Date().toISOString(),
      sentBy: userInfo?.fullName || 'Regional Director',
      taxCenterCount: Object.keys(allTaxCenterFeedback).length,
      taxCenters: Object.keys(allTaxCenterFeedback),
      feedbackByType: regionalFeedback, // Aggregated table format
      allTaxCenterFeedback: allTaxCenterFeedback // Keep original TC feedback for reference
    };

    console.log('✅ AGGREGATED FEEDBACK SENT TO DIRECTOR:', {
      planId: plan.id,
      region: directorRegion,
      taxCenterCount: Object.keys(allTaxCenterFeedback).length,
      feedbackByType: regionalFeedback
    });

    updateData(updatedData);

    alert(`✅ Aggregated feedback from ${Object.keys(allTaxCenterFeedback).length} tax centers sent to Audit Director!\n\nThey will review the feedback for plan refinement.`);

    setSelectedPlan(null);
    setRegionalFeedback({});
    setShowFeedbackForm(false);
    loadPlans();
  };

  const getPlanDetails = () => {
    if (!selectedPlan) return null;
    return plans.find(p => p.id === selectedPlan);
  };

  const getTaxCenterFeedback = () => {
    const plan = getPlanDetails();
    if (!plan || !directorRegion) return {};
    return plan.taxCenterFeedback?.[directorRegion] || {};
  };

  const planDetails = getPlanDetails();
  const taxCenterFeedback = getTaxCenterFeedback();
  const isAlreadySent = selectedPlan && submitted[selectedPlan];

  if (!directorRegion) {
    return (
      <div className="px-6 py-8">
        <div className="bg-danger/20 dark:bg-danger/20 border border-danger dark:border-danger rounded-lg p-6">
          <p className="text-danger dark:text-danger font-bold m-0">
            ❌ Error: No region assigned
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="detail-header mb-6">
        <h2 className="text-2xl font-bold text-text-hi dark:text-text-hi flex items-center gap-2">
          <i className="fas fa-comments"></i> Collect Tax Center Feedback - {getDisplayRegionName(directorRegion)}
        </h2>
        <p className="text-text-mid dark:text-text-mid mt-2">
          Review feedback from tax centers and send to Audit Director
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Plans List */}
        <div className="lg:col-span-1">
          <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg">
            <div className="px-4 py-3 border-b border-border dark:border-border">
              <h3 className="text-text-hi dark:text-text-hi font-bold m-0">
                Plans with Feedback ({plans.length})
              </h3>
            </div>

            {loading ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">Loading...</div>
            ) : plans.length === 0 ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">
                No tax center feedback received yet
              </div>
            ) : (
              <div className="divide-y divide-border dark:divide-border max-h-96 overflow-y-auto">
                {plans.map(plan => {
                  const feedbackCount = Object.keys(plan.taxCenterFeedback?.[directorRegion] || {}).length;
                  
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
                          <p className="text-xs text-teal dark:text-teal font-bold m-0 mt-1">
                            {feedbackCount} feedback{feedbackCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                        {submitted[plan.id] && (
                          <Badge status="Sent" className="text-xs" style={{ backgroundColor: '#2196F3' }} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Aggregated Feedback & Table */}
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
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Tax Centers</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">
                      {Object.keys(taxCenterFeedback).length} feedback received
                    </p>
                  </div>
                </div>
              </div>

              {/* Aggregated Feedback Table */}
              {showFeedbackForm ? (
                <div className="bg-blue/10 dark:bg-blue/10 border border-blue dark:border-blue rounded p-4 mb-4">
                  <h4 className="text-blue dark:text-blue font-bold m-0 mb-3">Regional Aggregated Feedback</h4>
                  <p className="text-xs text-text-mid dark:text-text-mid mb-3">
                    Aggregated feedback from all tax centers. Review totals and edit your regional proposal.
                    <br />
                    <strong className="text-orange dark:text-orange">💡 Tip:</strong> Edit "Regional Proposed" to suggest final allocation to Audit Director.
                  </p>
                  
                  {/* Regional Feedback Table */}
                  <div className="overflow-x-auto mb-3">
                    <table className="w-full text-sm">
                      <thead className="bg-ink dark:bg-ink">
                        <tr>
                          <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Audit Type</th>
                          <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">Original</th>
                          <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">TC Proposed</th>
                          <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">Regional Proposed</th>
                          <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Capacity</th>
                          <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Resources</th>
                          <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Timeline</th>
                          <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border dark:divide-border">
                        {auditTypes.map(type => {
                          const fb = regionalFeedback[type] || {};
                          const proposed = fb.regionalProposed !== undefined ? fb.regionalProposed : fb.tcProposedTotal;
                          const hasChange = proposed !== fb.tcProposedTotal;
                          
                          return (
                            <tr key={type}>
                              <td className="p-2 text-text-hi dark:text-text-hi font-bold">
                                {auditTypeLabels[type]}
                              </td>
                              <td className="p-2 text-center text-text-mid dark:text-text-mid">
                                {fb.originalAllocated || 0}
                              </td>
                              <td className="p-2 text-center text-teal dark:text-teal font-bold">
                                {fb.tcProposedTotal || 0}
                              </td>
                              <td className="p-2 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  value={proposed}
                                  onChange={(e) => {
                                    const newValue = parseInt(e.target.value) || 0;
                                    setRegionalFeedback({
                                      ...regionalFeedback,
                                      [type]: { ...fb, regionalProposed: newValue }
                                    });
                                  }}
                                  className={`w-20 px-2 py-1 rounded border text-center font-bold ${
                                    hasChange 
                                      ? 'border-orange dark:border-orange bg-orange/10 dark:bg-orange/10 text-orange dark:text-orange'
                                      : 'border-border dark:border-border bg-panel dark:bg-panel text-text-primary dark:text-text-primary'
                                  } text-xs`}
                                />
                                {hasChange && (
                                  <div className="text-xs text-orange dark:text-orange font-bold mt-1">
                                    {proposed > fb.tcProposedTotal ? `+${proposed - fb.tcProposedTotal}` : `${proposed - fb.tcProposedTotal}`}
                                  </div>
                                )}
                              </td>
                              <td className="p-2">
                                <select
                                  value={fb.capacity || 'Adequate'}
                                  onChange={(e) => setRegionalFeedback({
                                    ...regionalFeedback,
                                    [type]: { ...fb, capacity: e.target.value }
                                  })}
                                  className="w-full px-2 py-1 rounded border border-border dark:border-border bg-panel dark:bg-panel text-text-primary dark:text-text-primary text-xs"
                                >
                                  <option value="Adequate">Adequate</option>
                                  <option value="Can Handle">Can Handle</option>
                                  <option value="Insufficient">Insufficient</option>
                                  <option value="Need Review">Need Review</option>
                                </select>
                              </td>
                              <td className="p-2">
                                <select
                                  value={fb.resourceStatus || 'Available'}
                                  onChange={(e) => setRegionalFeedback({
                                    ...regionalFeedback,
                                    [type]: { ...fb, resourceStatus: e.target.value }
                                  })}
                                  className="w-full px-2 py-1 rounded border border-border dark:border-border bg-panel dark:bg-panel text-text-primary dark:text-text-primary text-xs"
                                >
                                  <option value="Available">Available</option>
                                  <option value="Limited">Limited</option>
                                  <option value="Need Support">Need Support</option>
                                  <option value="Critical">Critical</option>
                                </select>
                              </td>
                              <td className="p-2">
                                <select
                                  value={fb.timeline || 'On Schedule'}
                                  onChange={(e) => setRegionalFeedback({
                                    ...regionalFeedback,
                                    [type]: { ...fb, timeline: e.target.value }
                                  })}
                                  className="w-full px-2 py-1 rounded border border-border dark:border-border bg-panel dark:bg-panel text-text-primary dark:text-text-primary text-xs"
                                >
                                  <option value="On Schedule">On Schedule</option>
                                  <option value="Need Extension">Need Extension</option>
                                  <option value="Delayed">Delayed</option>
                                  <option value="At Risk">At Risk</option>
                                </select>
                              </td>
                              <td className="p-2">
                                <input
                                  type="text"
                                  value={fb.remarks || ''}
                                  onChange={(e) => setRegionalFeedback({
                                    ...regionalFeedback,
                                    [type]: { ...fb, remarks: e.target.value }
                                  })}
                                  placeholder="Enter regional remarks..."
                                  className="w-full px-2 py-1 rounded border border-border dark:border-border bg-panel dark:bg-panel text-text-primary dark:text-text-primary text-xs"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleSendFeedback}
                      className="flex-1 px-3 py-2 rounded font-bold bg-teal dark:bg-teal text-white hover:bg-teal/80 dark:hover:bg-teal/80 text-sm"
                    >
                      📤 Send to Audit Director
                    </button>
                    <button
                      onClick={() => {
                        setShowFeedbackForm(false);
                        setRegionalFeedback({});
                      }}
                      className="flex-1 px-3 py-2 rounded font-bold bg-gray-600 dark:bg-gray-600 text-white hover:bg-gray-500 dark:hover:bg-gray-500 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : !isAlreadySent ? (
                <button
                  onClick={() => setShowFeedbackForm(true)}
                  className="w-full py-2 px-4 rounded font-bold bg-blue dark:bg-blue text-white hover:bg-blue/80 dark:hover:bg-blue/80 transition-all mb-6"
                >
                  📊 Review & Send Aggregated Feedback
                </button>
              ) : null}

              {isAlreadySent && (
                <div className="bg-teal/20 dark:bg-teal/20 border border-teal dark:border-teal rounded-lg p-4 mb-6">
                  <p className="text-teal dark:text-teal font-bold m-0">
                    ✅ Feedback already sent to Audit Director
                  </p>
                  <p className="text-text-mid dark:text-text-mid m-0 mt-2 text-sm">
                    The director will review this feedback for plan refinement
                  </p>
                </div>
              )}

              {/* Tax Center Details (Expandable) */}
              <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">
                  Tax Center Feedback Details ({Object.keys(taxCenterFeedback).length})
                </h3>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {Object.entries(taxCenterFeedback).map(([taxCenter, feedback]) => (
                    <details key={taxCenter} className="bg-ink dark:bg-ink rounded border border-border dark:border-border">
                      <summary className="p-3 cursor-pointer hover:bg-panel dark:hover:bg-panel">
                        <span className="text-teal dark:text-teal font-bold text-sm">{taxCenter}</span>
                        <span className="text-xs text-text-mid dark:text-text-mid ml-2">
                          ({new Date(feedback.feedbackDate).toLocaleDateString()})
                        </span>
                      </summary>
                      <div className="p-3 pt-0 text-xs">
                        {feedback.feedbackByType && (
                          <table className="w-full text-xs mt-2">
                            <thead>
                              <tr className="text-left border-b border-border dark:border-border">
                                <th className="py-1">Type</th>
                                <th className="py-1 text-center">Allocated</th>
                                <th className="py-1 text-center">Proposed</th>
                                <th className="py-1">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(feedback.feedbackByType).map(([type, fb]) => (
                                <tr key={type} className="border-b border-border/50 dark:border-border/50">
                                  <td className="py-1">{auditTypeLabels[type]}</td>
                                  <td className="py-1 text-center">{fb.allocated}</td>
                                  <td className="py-1 text-center font-bold text-teal dark:text-teal">
                                    {fb.proposedAmount || fb.allocated}
                                  </td>
                                  <td className="py-1 text-xs">{fb.capacity} / {fb.timeline}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </details>
                  ))}
                </div>

                {Object.keys(taxCenterFeedback).length === 0 && (
                  <p className="text-text-mid dark:text-text-mid text-sm text-center py-4 m-0">
                    No feedback from tax centers yet
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-8 text-center">
              <p className="text-text-mid dark:text-text-mid m-0">
                Select a plan to review tax center feedback and send to Audit Director
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegionalDirectorCollectFeedbackView;
