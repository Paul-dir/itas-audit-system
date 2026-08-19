import React, { useState, useEffect } from 'react';
import { useData } from '../../services/dataService';
import { denormalizeRegionName, getDisplayRegionName } from '../../utils/regionNormalizer';
import { useAuth } from '../../context/AuthContext';
import Card from '../Card';
import Badge from '../Badge';

/**
 * TaxCenterReceiveAllocationsView
 * Tax Center Manager receives allocations from Regional Director
 * 
 * WORKFLOW:
 * 1. Tax Center Manager sees allocations sent to their tax center
 * 2. Can view allocation details and plan information
 * 3. Can ACCEPT allocation → ready to work with cases
 * 4. Can PROVIDE FEEDBACK → sends feedback back to regional director
 * 5. Feedback flows back up to director through regional director
 */

function TaxCenterReceiveAllocationsView() {
  const { getUserInfo, authContext } = useAuth();
  const { data, updateData, refreshData } = useData();
  const userInfo = getUserInfo();

  console.log('🔐 TaxCenterReceiveAllocationsView Auth Debug:', {
    userInfo,
    authContext,
    orgContext: authContext?.org_context
  });

  // Get tax center from auth context - use org_context.assignedTaxCenter
  const taxCenter = authContext?.org_context?.assignedTaxCenter || null;
  const taxCenterRegion = authContext?.org_context?.assignedRegion 
    ? denormalizeRegionName(authContext.org_context.assignedRegion)
    : null;

  console.log('📍 TaxCenterReceiveAllocationsView extracted:', { taxCenter, taxCenterRegion });

  // State
  const [allocations, setAllocations] = useState([]);
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [feedbackByType, setFeedbackByType] = useState({}); // Feedback per audit type
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const auditTypes = ['desk_audit', 'field_audit', 'joint_audit', 'transfer_pricing', 'comprehensive', 'issue_audit'];
  const auditTypeLabels = {
    desk_audit: 'Desk Audit',
    field_audit: 'Field Audit',
    joint_audit: 'Joint Audit',
    transfer_pricing: 'Transfer Pricing',
    comprehensive: 'Comprehensive',
    issue_audit: 'Issue Audit'
  };

  // Load allocations on mount and when data/region changes
  useEffect(() => {
    loadAllocations();
  }, [taxCenter, taxCenterRegion, data]);

  const loadAllocations = () => {
    if (!taxCenter || !taxCenterRegion) {
      console.log('❌ Missing tax center or region:', { taxCenter, taxCenterRegion });
      return;
    }

    console.log(`🔍 Looking for allocations for:`, { taxCenter, taxCenterRegion });
    console.log(`📦 Data has ${data?.plans?.length || 0} plans`);

    // Find all allocations sent to this tax center
    const myAllocations = [];

    (data.plans || []).forEach((plan, idx) => {
      if (!plan.taxCenterAllocations) {
        return;
      }
      
      if (plan.taxCenterAllocations?.[taxCenterRegion]) {
        const allocation = plan.taxCenterAllocations[taxCenterRegion];
        
        const availableKeys = Object.keys(allocation);
        console.log(`Plan ${plan.id}: Available tax centers:`, availableKeys);
        
        // Try exact match first
        let matchedTaxCenter = null;
        if (allocation[taxCenter]) {
          matchedTaxCenter = taxCenter;
        } else {
          // Try to find a matching tax center by searching for partial match
          // Handle cases like 'addis_ababa-tc1' vs 'Addis Ababa TC1'
          const normalized = taxCenter.toLowerCase().replace(/[\s-]/g, '');
          const found = availableKeys.find(key => 
            key.toLowerCase().replace(/[\s-]/g, '') === normalized
          );
          if (found) {
            console.log(`✅ Found matching tax center: "${taxCenter}" → "${found}"`);
            matchedTaxCenter = found;
          }
        }
        
        if (matchedTaxCenter) {
          console.log(`✅ Found allocation for "${matchedTaxCenter}" in plan ${plan.id}`);
          
          // 🔍 Read status from persisted plan data
          const allocationReceivedStatus = plan.submittedToTaxCenters?.[taxCenterRegion];
          const feedbackData = plan.taxCenterFeedback?.[taxCenterRegion]?.[matchedTaxCenter];
          
          myAllocations.push({
            planId: plan.id,
            planName: plan.name,
            region: taxCenterRegion,
            taxCenter: matchedTaxCenter,
            allocation: allocation[matchedTaxCenter],
            allocationDate: plan.allocationSentStatus?.[taxCenterRegion]?.sentDate,
            regionalAllocation: plan.regionalAllocation?.[taxCenterRegion] || {},
            totalCases: Object.values(allocation[matchedTaxCenter]).reduce((a, b) => a + b, 0),
            // ✅ PERMANENT STATUS from plan data
            allocationReceivedStatus,
            feedbackData,
            feedbackSubmitted: !!(feedbackData?.feedbackDate),
            feedbackSubmittedDate: feedbackData?.feedbackDate,
            feedbackSubmittedBy: feedbackData?.feedbackBy
          });
          
          // 📋 LOG STATUS PERSISTENCE
          console.log(`📊 Plan ${plan.id} STATUS:`, {
            allocationReceived: !!allocationReceivedStatus,
            receivedDate: allocationReceivedStatus?.submittedDate,
            feedbackSubmitted: !!feedbackData?.feedbackDate,
            feedbackDate: feedbackData?.feedbackDate,
            feedbackBy: feedbackData?.feedbackBy
          });
        } else {
          if (idx === 0) {
            console.log(`❌ No allocation for "${taxCenter}" in plan ${plan.id}`);
            console.log(`   Looked for: "${taxCenter}"`);
            console.log(`   Available: [${availableKeys.join(', ')}]`);
          }
        }
      }
    });

    console.log(`✅ Tax Center Manager: Found ${myAllocations.length} allocations for ${taxCenter}`);

    setAllocations(myAllocations);
  };

  const handleSelectAllocation = (planId) => {
    setSelectedAllocation(planId);
    setShowFeedbackForm(false);
    
    // Generate default feedback table for each audit type
    const allocationDetails = allocations.find(a => a.planId === planId);
    if (allocationDetails) {
      const defaultFeedbackTable = {};
      
      auditTypes.forEach(type => {
        const allocated = allocationDetails.allocation[type] || 0;
        defaultFeedbackTable[type] = {
          allocated: allocated,
          proposedAmount: allocated, // Default: same as allocated, can be edited
          capacity: 'Adequate', // Default: Adequate, Can Handle, Insufficient, Need Review
          resourceStatus: 'Available', // Default: Available, Limited, Need Support, Critical
          timeline: 'On Schedule', // Default: On Schedule, Delayed, Need Extension, At Risk
          remarks: allocated > 0 ? `We can handle ${allocated} ${auditTypeLabels[type]} cases` : 'No cases allocated'
        };
      });
      
      setFeedbackByType(defaultFeedbackTable);
    }
  };

  const handleAcceptAllocation = () => {
    if (!selectedAllocation || !taxCenter || !taxCenterRegion) return;

    const planIndex = data.plans.findIndex(p => p.id === selectedAllocation);

    if (planIndex < 0) {
      alert('Plan not found');
      return;
    }

    // ✅ DEEP COPY the entire data structure to preserve all previous plans' data
    const updatedData = JSON.parse(JSON.stringify(data));
    const plan = updatedData.plans[planIndex];

    // ✅ Mark allocation as ACCEPTED by this tax center
    if (!plan.taxCenterAcceptance) {
      plan.taxCenterAcceptance = {};
    }

    if (!plan.taxCenterAcceptance[taxCenterRegion]) {
      plan.taxCenterAcceptance[taxCenterRegion] = {};
    }

    plan.taxCenterAcceptance[taxCenterRegion][taxCenter] = {
      status: 'ACCEPTED',
      acceptedDate: new Date().toISOString(),
      acceptedBy: userInfo?.fullName || 'Tax Center Manager'
    };

    console.log('✅ ALLOCATION ACCEPTED BY TAX CENTER:', {
      planId: plan.id,
      taxCenter: taxCenter,
      region: taxCenterRegion,
      status: 'ACCEPTED',
      totalPlans: updatedData.plans.length
    });

    updateData(updatedData);

    alert(`✅ Allocation ACCEPTED for Plan ${plan.id}!\n\nYou can now start working with the assigned cases.`);

    setSelectedAllocation(null);
    loadAllocations();
  };

  const handleProvideFeedback = async () => {
    // Validate that at least one feedback has content
    const hasFeedback = Object.values(feedbackByType).some(fb => 
      fb.remarks && fb.remarks.trim()
    );
    
    if (!hasFeedback) {
      alert('Please provide feedback remarks for at least one audit type');
      return;
    }

    if (!selectedAllocation || !taxCenter || !taxCenterRegion) return;

    // We must use the matched tax center key (e.g. 'addis_ababa-tc1') 
    // that matches the regional allocation, NOT the raw user string ('Addis Ababa TC1').
    const currentAlloc = allocations.find(a => a.planId === selectedAllocation);
    const matchedTaxCenterKey = currentAlloc ? currentAlloc.taxCenter : taxCenter;

    // Find the plan to update
    const planIndex = data.plans.findIndex(p => p.id === selectedAllocation);
    if (planIndex < 0) {
      alert('Plan not found');
      return;
    }

    // ✅ DEEP COPY the entire data structure to preserve all previous plans' data
    const updatedData = JSON.parse(JSON.stringify(data));
    const plan = updatedData.plans[planIndex];

    // ✅ Check for duplicate submission FIRST
    if (plan.taxCenterFeedback?.[taxCenterRegion]?.[matchedTaxCenterKey]?.feedbackDate) {
      const submittedDate = new Date(plan.taxCenterFeedback[taxCenterRegion][matchedTaxCenterKey].feedbackDate).toLocaleString();
      console.log('⚠️ DUPLICATE PREVENTED:', { submittedDate });
      alert('⚠️ Feedback for this plan has already been submitted.\n\n' +
        `Submitted on: ${submittedDate}\n\n` +
        'To submit new feedback, please contact your Regional Director.');
      return;
    }

    // ✅ Initialize structure if needed
    if (!plan.taxCenterFeedback) plan.taxCenterFeedback = {};
    if (!plan.taxCenterFeedback[taxCenterRegion]) plan.taxCenterFeedback[taxCenterRegion] = {};

    // ✅ Save the structured feedback with timestamp
    plan.taxCenterFeedback[taxCenterRegion][matchedTaxCenterKey] = {
      feedbackByType: feedbackByType,
      feedbackDate: new Date().toISOString(),
      feedbackBy: userInfo?.fullName || 'Tax Center Manager',
      taxCenter: matchedTaxCenterKey,
      planId: selectedAllocation
    };

    // ✅ Mark for regional director to collect
    if (!plan.regionFeedbackTaxCenters) plan.regionFeedbackTaxCenters = {};
    if (!plan.regionFeedbackTaxCenters[taxCenterRegion]) plan.regionFeedbackTaxCenters[taxCenterRegion] = [];
    if (!plan.regionFeedbackTaxCenters[taxCenterRegion].includes(matchedTaxCenterKey)) {
      plan.regionFeedbackTaxCenters[taxCenterRegion].push(matchedTaxCenterKey);
    }

    console.log('✅ FEEDBACK SAVED:', {
      planId: selectedAllocation,
      region: taxCenterRegion,
      taxCenter: matchedTaxCenterKey,
      feedbackDate: plan.taxCenterFeedback[taxCenterRegion][matchedTaxCenterKey].feedbackDate,
      feedbackBy: userInfo?.fullName,
      totalPlans: updatedData.plans.length,
      allPlanIds: updatedData.plans.map(p => p.id)
    });

    // ✅ Persist to data context with deep copy
    await updateData(updatedData);

    alert(`✅ Feedback submitted successfully!\n\nYour feedback will be reviewed by the Regional Director and forwarded to the Audit Director.`);

    // ✅ Clear form and reload from fresh data to ensure state is in sync
    setSelectedAllocation(null);
    setFeedbackByType({});
    setShowFeedbackForm(false);
    
    // Force reload allocations from saved data
    // This will recalculate feedbackSubmitted from the actual persisted feedback
    await refreshData();
    loadAllocations();
  };

  const getSelectedAllocationDetails = () => {
    if (!selectedAllocation) return null;
    return allocations.find(a => a.planId === selectedAllocation);
  };

  const allocationDetails = getSelectedAllocationDetails();

  if (!taxCenter || !taxCenterRegion) {
    return (
      <div className="px-6 py-8">
        <div className="bg-danger/20 dark:bg-danger/20 border border-danger dark:border-danger rounded-lg p-6">
          <p className="text-danger dark:text-danger font-bold m-0">
            ❌ Error: No tax center assigned
          </p>
          <p className="text-text-mid dark:text-text-mid mt-2 m-0">
            Contact administrator to assign a tax center to your account
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
          <i className="fas fa-inbox"></i> Received Allocations - {taxCenter}
        </h2>
        <p className="text-text-mid dark:text-text-mid mt-2">
          Accept allocations and provide feedback to regional director
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Allocations List */}
        <div className="lg:col-span-1">
          <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg">
            <div className="px-4 py-3 border-b border-border dark:border-border">
              <h3 className="text-text-hi dark:text-text-hi font-bold m-0">
                My Allocations ({allocations.length})
              </h3>
            </div>

            {allocations.length === 0 ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">
                No allocations received yet
              </div>
            ) : (
              <div className="divide-y divide-border dark:divide-border max-h-96 overflow-y-auto">
                {allocations.map(alloc => (
                  <div
                    key={alloc.planId}
                    onClick={() => handleSelectAllocation(alloc.planId)}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedAllocation === alloc.planId
                        ? 'bg-blue/20 dark:bg-blue/20 border-l-4 border-blue dark:border-blue'
                        : 'hover:bg-ink dark:hover:bg-ink'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-bold text-text-hi dark:text-text-hi m-0">{alloc.planId}</p>
                        <p className="text-xs text-text-mid dark:text-text-mid m-0 mt-1">{alloc.planName}</p>
                        <p className="text-xs text-teal dark:text-teal font-bold m-0 mt-1">
                          {alloc.totalCases} cases
                        </p>
                      </div>
                      {alloc.feedbackSubmitted && (
                        <Badge status="approved" text="✅ Feedback Sent" className="text-xs" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Allocation Details & Actions */}
        <div className="lg:col-span-2">
          {allocationDetails ? (
            <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4">
              {/* Plan Info */}
              <div className="mb-6">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Plan Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Plan ID</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">{allocationDetails.planId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Plan Name</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">{allocationDetails.planName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Region</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">
                      {getDisplayRegionName(allocationDetails.region)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Total Cases</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">{allocationDetails.totalCases}</p>
                  </div>
                </div>
              </div>

              {/* My Allocation Breakdown */}
              <div className="mb-6">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">My Allocation Breakdown ({taxCenter})</h3>
                <div className="bg-ink dark:bg-ink rounded p-3">
                  <div className="space-y-2">
                    {auditTypes.map(type => (
                      <div key={type} className="flex justify-between text-sm">
                        <span className="text-text-mid dark:text-text-mid">{auditTypeLabels[type]}:</span>
                        <span className="text-text-hi dark:text-text-hi font-bold">
                          {allocationDetails.allocation[type] || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border dark:border-border mt-3 pt-3 flex justify-between">
                    <span className="text-text-mid dark:text-text-mid font-bold">Total:</span>
                    <span className="text-teal dark:text-teal font-bold">{allocationDetails.totalCases}</span>
                  </div>
                </div>
              </div>

              {/* Regional Allocation Context */}
              <div className="mb-6">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Regional Allocation Context</h3>
                <div className="bg-ink dark:bg-ink rounded p-3 text-xs">
                  <p className="text-text-mid dark:text-text-mid m-0 mb-2">
                    Total allocated to {getDisplayRegionName(allocationDetails.region)} region:
                  </p>
                  <div className="space-y-1">
                    {auditTypes.map(type => (
                      <div key={type} className="flex justify-between">
                        <span className="text-text-mid dark:text-text-mid">{auditTypeLabels[type]}:</span>
                        <span className="text-text-hi dark:text-text-hi">
                          {allocationDetails.regionalAllocation[type] || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feedback Form */}
              {showFeedbackForm ? (
                <div className="bg-blue/10 dark:bg-blue/10 border border-blue dark:border-blue rounded p-4 mb-4">
                  <h4 className="text-blue dark:text-blue font-bold m-0 mb-3">Provide Feedback by Audit Type</h4>
                  <p className="text-xs text-text-mid dark:text-text-mid mb-3">
                    Review and edit feedback for each audit type. Default values are pre-filled based on allocation.
                    <br />
                    <strong className="text-orange dark:text-orange">💡 Tip:</strong> Edit "Proposed" to suggest changes to allocated amounts. Changes will be highlighted in orange.
                  </p>
                  
                  {/* Feedback Table */}
                  <div className="overflow-x-auto mb-3">
                    <table className="w-full text-sm">
                      <thead className="bg-ink dark:bg-ink">
                        <tr>
                          <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Audit Type</th>
                          <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">Allocated</th>
                          <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">Proposed</th>
                          <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Capacity</th>
                          <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Resources</th>
                          <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Timeline</th>
                          <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border dark:divide-border">
                        {auditTypes.map(type => {
                          const fb = feedbackByType[type] || {};
                          const proposed = fb.proposedAmount !== undefined ? fb.proposedAmount : fb.allocated;
                          const hasChange = proposed !== fb.allocated;
                          
                          return (
                            <tr key={type} className={fb.allocated > 0 ? '' : 'opacity-50'}>
                              <td className="p-2 text-text-hi dark:text-text-hi font-bold">
                                {auditTypeLabels[type]}
                              </td>
                              <td className="p-2 text-center text-teal dark:text-teal font-bold">
                                {fb.allocated || 0}
                              </td>
                              <td className="p-2 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  value={proposed}
                                  onChange={(e) => {
                                    const newValue = parseInt(e.target.value) || 0;
                                    setFeedbackByType({
                                      ...feedbackByType,
                                      [type]: { ...fb, proposedAmount: newValue }
                                    });
                                  }}
                                  className={`w-20 px-2 py-1 rounded border text-center font-bold ${
                                    hasChange 
                                      ? 'border-orange dark:border-orange bg-orange/10 dark:bg-orange/10 text-orange dark:text-orange'
                                      : 'border-border dark:border-border bg-panel dark:bg-panel text-text-primary dark:text-text-primary'
                                  } text-xs`}
                                  disabled={fb.allocated === 0}
                                />
                                {hasChange && (
                                  <div className="text-xs text-orange dark:text-orange font-bold mt-1">
                                    {proposed > fb.allocated ? `+${proposed - fb.allocated}` : `${proposed - fb.allocated}`}
                                  </div>
                                )}
                              </td>
                              <td className="p-2">
                                <select
                                  value={fb.capacity || 'Adequate'}
                                  onChange={(e) => setFeedbackByType({
                                    ...feedbackByType,
                                    [type]: { ...fb, capacity: e.target.value }
                                  })}
                                  className="w-full px-2 py-1 rounded border border-border dark:border-border bg-panel dark:bg-panel text-text-primary dark:text-text-primary text-xs"
                                  disabled={fb.allocated === 0}
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
                                  onChange={(e) => setFeedbackByType({
                                    ...feedbackByType,
                                    [type]: { ...fb, resourceStatus: e.target.value }
                                  })}
                                  className="w-full px-2 py-1 rounded border border-border dark:border-border bg-panel dark:bg-panel text-text-primary dark:text-text-primary text-xs"
                                  disabled={fb.allocated === 0}
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
                                  onChange={(e) => setFeedbackByType({
                                    ...feedbackByType,
                                    [type]: { ...fb, timeline: e.target.value }
                                  })}
                                  className="w-full px-2 py-1 rounded border border-border dark:border-border bg-panel dark:bg-panel text-text-primary dark:text-text-primary text-xs"
                                  disabled={fb.allocated === 0}
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
                                  onChange={(e) => setFeedbackByType({
                                    ...feedbackByType,
                                    [type]: { ...fb, remarks: e.target.value }
                                  })}
                                  placeholder="Enter remarks..."
                                  className="w-full px-2 py-1 rounded border border-border dark:border-border bg-panel dark:bg-panel text-text-primary dark:text-text-primary text-xs"
                                  disabled={fb.allocated === 0}
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
                      onClick={handleProvideFeedback}
                      className="flex-1 px-3 py-2 rounded font-bold bg-teal dark:bg-teal text-white hover:bg-teal/80 dark:hover:bg-teal/80 text-sm"
                    >
                      📤 Submit Feedback
                    </button>
                    <button
                      onClick={() => {
                        setShowFeedbackForm(false);
                        setFeedbackByType({});
                      }}
                      className="flex-1 px-3 py-2 rounded font-bold bg-gray-600 dark:bg-gray-600 text-white hover:bg-gray-500 dark:hover:bg-gray-500 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleAcceptAllocation}
                  className="flex-1 px-4 py-2 rounded font-bold bg-teal dark:bg-teal text-white hover:bg-teal/80 dark:hover:bg-teal/80 transition-all"
                >
                  ✅ Accept Allocation
                </button>
                <button
                  onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                  disabled={allocationDetails?.feedbackSubmitted === true}
                  className={`flex-1 px-4 py-2 rounded font-bold transition-all ${
                    allocationDetails?.feedbackSubmitted === true
                      ? 'bg-gray-600 dark:bg-gray-600 text-gray-400 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-blue dark:bg-blue text-white hover:bg-blue/80 dark:hover:bg-blue/80'
                  }`}
                >
                  {allocationDetails?.feedbackSubmitted === true ? '✅ Feedback Submitted' : '💬 Provide Feedback'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-8 text-center">
              <p className="text-text-mid dark:text-text-mid m-0">
                Select an allocation from the list to review and accept or provide feedback
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaxCenterReceiveAllocationsView;
