import React, { useState, useEffect } from 'react';
import { useData } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { submitRegionalFeedback } from '../../utils/businessLogic';
import Badge from '../Badge';

/**
 * RegionalFeedbackCollectionView - Unified Regional Feedback Submission
 * 
 * Workflow:
 * 1. Regional Director receives plans with status AWAITING_REGIONAL_FEEDBACK
 * 2. Reviews allocations and collects feedback from tax centers
 * 3. Submits regional feedback with comments to Audit Director
 * 4. Plan status changes to FEEDBACK_COLLECTED when all regions submit
 */

function RegionalFeedbackCollectionView() {
  const { getUserInfo } = useAuth();
  const userInfo = getUserInfo();
  const { data, updateData, refreshData } = useData();

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [componentLoading, setComponentLoading] = useState(true);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [activeTab, setActiveTab] = useState('awaiting'); // 'awaiting', 'submitted'
  const [taxCenterFeedback, setTaxCenterFeedback] = useState([
    { taxCenter: 'Tax Center A', feedback: '' },
    { taxCenter: 'Tax Center B', feedback: '' },
    { taxCenter: 'Tax Center C', feedback: '' },
    { taxCenter: 'Tax Center D', feedback: '' }
  ]);
  const [realTimeFeedback, setRealTimeFeedback] = useState({}); // Store tax center feedback by planId
  const [showNotifications, setShowNotifications] = useState(true); // Real-time notifications
  const [newFeedbackCount, setNewFeedbackCount] = useState(0); // Counter for new feedback

  const region = userInfo?.orgContext?.assignedRegion || 'North';

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

    // Get ALL plans that this region should be working with
    const allRegionalPlans = (data?.plans || []).filter(plan => {
      // Plan must be in feedback workflow (waiting for feedback OR already collected)
      if (plan.status !== 'AWAITING_REGIONAL_FEEDBACK' && plan.status !== 'FEEDBACK_COLLECTED') return false;
      
      // ✅ FIXED: Don't require regionalAllocation to exist yet
      // Plans can arrive at AWAITING_REGIONAL_FEEDBACK status before allocations are done
      // The regional allocation gets created when Regional Director allocates to tax centers
      // For now, just make sure the plan is in the right status
      return true;
    });

    console.log(`✅ Regional Director (${region}): Found ${allRegionalPlans.length} total plans in feedback workflow`, {
      waitingForFeedback: allRegionalPlans.filter(p => p.status === 'AWAITING_REGIONAL_FEEDBACK').length,
      feedbackCollected: allRegionalPlans.filter(p => p.status === 'FEEDBACK_COLLECTED').length,
      plansWithAllocations: allRegionalPlans.filter(p => p.regionalAllocation?.[region]).length
    });
    setPlans(allRegionalPlans);
    setComponentLoading(false);
  };

  useEffect(() => {
    if (data) {
      loadPlans();
      trackRealTimeFeedback(); // Track new feedback submissions
    }
  }, [data]);

  const trackRealTimeFeedback = () => {
    // Real-time tracking: Monitor tax center feedback across all plans in this region
    const newFeedbackTracking = {};
    let totalNewFeedback = 0;

    (data?.plans || []).forEach(plan => {
      if (!plan.taxCenterFeedback || !plan.taxCenterFeedback[region]) {
        return;
      }

      // Check each tax center's feedback in this region
      Object.entries(plan.taxCenterFeedback[region]).forEach(([tcName, feedback]) => {
        if (feedback && feedback.feedbackDate) {
          const key = `${plan.id}-${tcName}`;
          
          // Check if this is new feedback (not yet seen by regional director)
          const previousFeedback = realTimeFeedback[key];
          const isNewFeedback = !previousFeedback || previousFeedback.feedbackDate !== feedback.feedbackDate;
          
          if (isNewFeedback) {
            totalNewFeedback++;
            console.log(`🔔 NEW TAX CENTER FEEDBACK: ${tcName} submitted for plan ${plan.id}`);
          }
          
          newFeedbackTracking[key] = {
            ...feedback,
            isNew: isNewFeedback,
            planId: plan.id,
            taxCenter: tcName,
            submittedAt: feedback.feedbackDate
          };
        }
      });
    });

    setRealTimeFeedback(newFeedbackTracking);
    setNewFeedbackCount(totalNewFeedback);

    // Log feedback summary
    if (totalNewFeedback > 0) {
      console.log(`📊 REAL-TIME FEEDBACK SUMMARY: ${totalNewFeedback} new submissions from tax centers`);
    }
  };

  const getTabPlans = () => {
    switch(activeTab) {
      case 'awaiting':
        // Plans not yet submitted by this region
        return plans.filter(p => p.regionFeedbackStatus?.[region]?.status !== 'received');
      case 'submitted':
        // Plans already submitted by this region
        return plans.filter(p => p.regionFeedbackStatus?.[region]?.status === 'received');
      default:
        return [];
    }
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    setShowFeedbackForm(false);
    setFeedbackText('');
    
    // ✅ Load allocated tax centers and their existing feedback
    const plan = plans.find(p => p.id === planId);
    if (plan && plan.taxCenterAllocations && plan.taxCenterAllocations[region]) {
      const allocatedTCs = Object.keys(plan.taxCenterAllocations[region]);
      
      const updatedFeedback = allocatedTCs.map(tcName => {
        const feedback = plan.taxCenterFeedback?.[region]?.[tcName];
        let compiledRemarks = '';
        if (feedback && feedback.feedbackByType) {
          // Compile remarks from feedbackByType
          compiledRemarks = Object.entries(feedback.feedbackByType)
            .filter(([_, fb]) => fb.remarks)
            .map(([type, fb]) => `${type}: ${fb.remarks}`)
            .join(' | ');
        }
        return {
          taxCenter: tcName,
          feedback: compiledRemarks || feedback?.notes || feedback?.feedback || '',
          hasRealFeedback: !!feedback
        };
      });
      
      setTaxCenterFeedback(updatedFeedback);
      console.log('✅ Loaded real tax center feedback for region:', updatedFeedback);
    } else {
      setTaxCenterFeedback([]);
    }
  };

  const handleSubmitFeedback = () => {
    if (!selectedPlan) return;

    // Validate that at least regional feedback is provided
    if (!feedbackText.trim()) {
      const confirm = window.confirm(
        'No regional feedback provided. Continue anyway?\n\n(Regional feedback is recommended)'
      );
      if (!confirm) return;
    }

    const plan = data?.plans?.find(p => p.id === selectedPlan);
    if (!plan) return;

    // ✅ Check if already submitted (from component state to save network roundtrip if stale)
    if (plan.regionFeedbackStatus?.[region]?.status === 'received') {
      alert('❌ Feedback already submitted for this region!\n\nCannot submit again.');
      return;
    }

    // ✅ STATUS CHECK: Only allow if in correct status
    if (plan.status !== 'AWAITING_REGIONAL_FEEDBACK') {
      alert(`❌ Cannot submit! Current status: ${plan.status}\n\nRegions can only submit when plan is AWAITING_REGIONAL_FEEDBACK.`);
      return;
    }

    const compiledTaxCenterFeedback = taxCenterFeedback.filter(tc => tc.feedback.trim());

    // ✅ Submit through businessLogic
    const success = submitRegionalFeedback(
      selectedPlan, 
      region, 
      feedbackText, 
      compiledTaxCenterFeedback
    );

    if (!success) {
      alert('❌ Failed to submit feedback or it has already been submitted.');
      loadPlans(); // Reload to sync state
      return;
    }

    refreshData(); // Sync with new localStorage state

    alert(`✅ Feedback submitted to Audit Director!\n\nYour feedback from ${region} has been recorded.\nDirector will review when all regions submit.`);
    
    setSelectedPlan(null);
    setShowFeedbackForm(false);
    setFeedbackText('');
  };

  const getPlanDetails = () => {
    if (!selectedPlan) return null;
    return plans.find(p => p.id === selectedPlan);
  };

  const planDetails = getPlanDetails();

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="detail-header mb-6">
        <h2 className="text-2xl font-bold text-text-hi dark:text-text-hi flex items-center gap-2">
          <i className="fas fa-comments"></i> Feedback Collection
        </h2>
        <p className="text-text-mid dark:text-text-mid mt-2">
          {region} Region • Collect and submit feedback on audit allocations
        </p>
      </div>

      {/* Real-Time Feedback Notifications */}
      {newFeedbackCount > 0 && showNotifications && (
        <div className="mb-6 bg-teal/20 dark:bg-teal/20 border-2 border-teal dark:border-teal rounded-lg p-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="fas fa-bell text-teal dark:text-teal text-xl"></i>
              <div>
                <p className="font-bold text-teal dark:text-teal m-0">
                  🔔 Real-Time Feedback: {newFeedbackCount} new submission(s)
                </p>
                <p className="text-xs text-text-mid dark:text-text-mid m-0 mt-1">
                  Tax centers have submitted feedback - check below for details
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNotifications(false)}
              className="px-3 py-1 rounded text-sm font-bold bg-teal dark:bg-teal text-white hover:bg-teal/80"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Plans List */}
        <div className="lg:col-span-1">
          <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg">
            {/* Tabs */}
            <div className="flex border-b border-border dark:border-border">
              <button
                onClick={() => setActiveTab('awaiting')}
                className={`flex-1 px-4 py-3 font-bold text-center transition-all ${
                  activeTab === 'awaiting'
                    ? 'bg-warning dark:bg-warning text-white'
                    : 'text-text-mid dark:text-text-mid hover:text-text-hi dark:hover:text-text-hi'
                }`}
              >
                Awaiting ({plans.filter(p => p.regionFeedbackStatus?.[region]?.status !== 'received').length})
              </button>
              <button
                onClick={() => setActiveTab('submitted')}
                className={`flex-1 px-4 py-3 font-bold text-center transition-all ${
                  activeTab === 'submitted'
                    ? 'bg-teal dark:bg-teal text-white'
                    : 'text-text-mid dark:text-text-mid hover:text-text-hi dark:hover:text-text-hi'
                }`}
              >
                Submitted ({plans.filter(p => p.regionFeedbackStatus?.[region]?.status === 'received').length})
              </button>
            </div>

            {/* List Header */}
            <div className="px-4 py-3 border-b border-border dark:border-border">
              <h3 className="text-text-hi dark:text-text-hi font-bold m-0">
                {activeTab === 'awaiting' ? 'Plans Awaiting Feedback' : 'Submitted Feedback'}
              </h3>
              <p className="text-xs text-text-mid dark:text-text-mid mt-2 m-0">
                {getTabPlans().length} plan(s) to {activeTab === 'awaiting' ? 'review' : 'view'}
              </p>
            </div>

            {/* Plans List */}
            {componentLoading ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">Loading...</div>
            ) : getTabPlans().length === 0 ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">
                {activeTab === 'awaiting' 
                  ? 'No plans awaiting feedback' 
                  : 'No plans with submitted feedback'}
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
                          : 'bg-teal/20 dark:bg-teal/20 border-l-4 border-teal dark:border-teal'
                        : 'hover:bg-ink dark:hover:bg-ink'
                    }`}
                  >
                    <p className="font-bold text-text-hi dark:text-text-hi m-0">{plan.id}</p>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0 mt-1">{plan.name}</p>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0 mt-1">
                      Year: {plan.fiscalYear} • Cases: {plan.totalCases}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Plan Details & Feedback Form */}
        <div className="lg:col-span-3">
          {planDetails ? (
            <div className="space-y-6">
              {/* Plan Info Card */}
              <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4">
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
                    <Badge status="pending" text={planDetails.status} className="mt-1" />
                  </div>
                </div>
              </div>

              {/* Regional Allocation for This Region */}
              <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">{region} Region Allocation</h3>
                
                {planDetails.regionalAllocation?.[region] ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-ink dark:bg-ink">
                        <tr>
                          <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Audit Type</th>
                          <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">Allocated Cases</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border dark:divide-border">
                        {Object.entries(planDetails.regionalAllocation?.[region] || {}).map(([type, count]) => (
                        <tr key={type}>
                          <td className="p-2 text-text-hi dark:text-text-hi font-bold text-xs">
                            {auditTypeLabels[type] || type}
                          </td>
                          <td className="p-2 text-center text-text-mid dark:text-text-mid">
                            {count}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-ink dark:bg-ink font-bold">
                        <td className="p-2 text-text-hi dark:text-text-hi">TOTAL FOR {region.toUpperCase()}</td>
                        <td className="p-2 text-center text-text-hi dark:text-text-hi">
                          {Object.values(planDetails.regionalAllocation?.[region] || {}).reduce((a, b) => a + b, 0)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  </div>
                ) : (
                  <div className="p-4 bg-orange/10 dark:bg-orange/10 border border-orange dark:border-orange rounded text-center">
                    <p className="text-orange dark:text-orange text-sm font-bold m-0">📋 Allocation Not Ready Yet</p>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0 mt-2">
                      Regional allocation will appear here once the Regional Director allocates this plan to tax centers.
                    </p>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0 mt-2">
                      This typically happens after the plan is received and accepted by the region.
                    </p>
                  </div>
                )}
              </div>

              {/* Feedback Form */}
              {activeTab === 'awaiting' && showFeedbackForm ? (
                <div className="bg-info/10 dark:bg-info/10 border border-info dark:border-info rounded-lg p-4 space-y-4">
                  <h4 className="text-info dark:text-info font-bold m-0 mb-3">
                    <i className="fas fa-comments mr-2"></i>Submit Regional Feedback
                  </h4>

              {/* Tax Centers Status - Show which centers have submitted with real-time data */}
              {planDetails.taxCenterFeedback && planDetails.taxCenterFeedback[region] && Object.keys(planDetails.taxCenterFeedback[region]).length > 0 && (
                <div className="bg-teal/10 dark:bg-teal/10 border border-teal dark:border-teal rounded p-3 mb-4 max-h-64 overflow-y-auto">
                  <p className="text-xs font-bold text-teal dark:text-teal m-0 mb-2">
                    <i className="fas fa-check-circle mr-1"></i>📊 Real-Time Tax Center Feedback ({Object.keys(planDetails.taxCenterFeedback[region]).length}):
                  </p>
                  <div className="space-y-3">
                    {Object.entries(planDetails.taxCenterFeedback[region]).map(([tcName, feedback]) => {
                      const realTimeKey = `${selectedPlan}-${tcName}`;
                      const isNew = realTimeFeedback[realTimeKey]?.isNew;
                      
                      return (
                        <div 
                          key={tcName} 
                          className={`p-3 rounded border-l-4 transition-all ${
                            isNew 
                              ? 'bg-orange/10 dark:bg-orange/10 border-l-orange dark:border-l-orange border border-orange/30 dark:border-orange/30 animate-pulse'
                              : 'bg-ink dark:bg-ink border-l-teal dark:border-l-teal border border-border dark:border-border'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-xs font-bold m-0">
                                {isNew && <span className="text-orange dark:text-orange mr-2">🆕</span>}
                                <span className="text-text-hi dark:text-text-hi">✅ {tcName}</span>
                              </p>
                              
                              {/* Display feedback by audit type if available */}
                              {feedback.feedbackByType && Object.keys(feedback.feedbackByType).length > 0 && (
                                <div className="mt-2 ml-2 text-xs text-text-mid dark:text-text-mid">
                                  <p className="font-bold m-0 mb-1">Feedback by Audit Type:</p>
                                  <div className="space-y-1">
                                    {Object.entries(feedback.feedbackByType).map(([type, fb]) => (
                                      fb.allocated > 0 && (
                                        <div key={type} className="bg-panel dark:bg-panel p-1 rounded">
                                          <strong>{fb.allocated}x</strong> {type.replace(/_/g, ' ')}:
                                          <br />
                                          <span className="text-xs">
                                            Capacity: {fb.capacity} | Resources: {fb.resourceStatus} | Timeline: {fb.timeline}
                                          </span>
                                          {fb.remarks && (
                                            <div className="mt-1 italic text-text-mid dark:text-text-mid">
                                              "{fb.remarks}"
                                            </div>
                                          )}
                                        </div>
                                      )
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Fallback for simple feedback format */}
                              {(!feedback.feedbackByType || Object.keys(feedback.feedbackByType).length === 0) && (
                                <div className="mt-1">
                                  <div className="text-xs">Can deliver: <strong>{feedback.canDeliver || 0}</strong> / Allocated: <strong>{feedback.allocated || 0}</strong></div>
                                  {feedback.notes && <div className="mt-1 italic text-xs">"{feedback.notes}"</div>}
                                </div>
                              )}
                              
                              {/* Submission timestamp */}
                              {feedback.submittedAt && (
                                <div className="text-xs text-text-mid dark:text-text-mid mt-2">
                                  <i className="fas fa-clock mr-1"></i>
                                  {isNew ? '🔔 Just submitted: ' : 'Submitted: '}
                                  {new Date(feedback.submittedAt).toLocaleString()}
                                </div>
                              )}
                            </div>
                            {isNew && (
                              <span className="inline-block px-2 py-1 bg-orange dark:bg-orange text-white rounded text-xs font-bold ml-2">
                                NEW
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

                  {/* Regional Director's Feedback */}
                  <div>
                    <label className="block text-text-hi dark:text-text-hi font-bold text-sm mb-2">
                      Regional Director Feedback (recommended)
                    </label>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Provide overall assessment of allocations, challenges, concerns, etc."
                      className="w-full px-3 py-2 rounded border border-border dark:border-border bg-ink dark:bg-ink text-text-primary dark:text-text-primary text-sm"
                      rows="4"
                    />
                  </div>

                  {/* Tax Center Feedback */}
                  <div>
                    <label className="block text-text-hi dark:text-text-hi font-bold text-sm mb-2">
                      Individual Tax Center Feedback (optional)
                    </label>
                    <div className="space-y-3">
                      {taxCenterFeedback.map((tc, idx) => (
                        <div key={idx}>
                          <label className="text-xs text-text-mid dark:text-text-mid font-bold flex items-center gap-2">
                            {tc.taxCenter}
                            {tc.hasRealFeedback && <span className="bg-teal/20 text-teal px-1.5 rounded-sm">Submitted Feedback</span>}
                          </label>
                          <input
                            type="text"
                            value={tc.feedback}
                            onChange={(e) => {
                              const updated = [...taxCenterFeedback];
                              updated[idx].feedback = e.target.value;
                              setTaxCenterFeedback(updated);
                            }}
                            placeholder="e.g., Allocation is realistic / Need more resources / Field audits too high"
                            className="w-full px-3 py-2 rounded border border-border dark:border-border bg-ink dark:bg-ink text-text-primary dark:text-text-primary text-xs mt-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={handleSubmitFeedback}
                      className="flex-1 px-3 py-2 rounded font-bold text-white text-sm bg-info dark:bg-info hover:bg-info/80 dark:hover:bg-info/80 transition-all"
                    >
                      ✅ Submit Feedback
                    </button>
                    <button
                      onClick={() => {
                        setShowFeedbackForm(false);
                        setFeedbackText('');
                      }}
                      className="px-3 py-2 rounded font-bold bg-gray-600 dark:bg-gray-600 text-white hover:bg-gray-500 dark:hover:bg-gray-500 text-sm transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowFeedbackForm(true)}
                  className="w-full py-3 px-4 rounded font-bold bg-info dark:bg-info text-white hover:bg-info/80 dark:hover:bg-info/80 transition-all"
                >
                  💬 Provide Feedback
                </button>
              )}

              {/* Submitted Feedback View (Read-only) */}
              {activeTab === 'submitted' && planDetails && planDetails.regionFeedbackStatus?.[region] && (
                <div className="bg-teal/10 dark:bg-teal/10 border border-teal dark:border-teal rounded-lg p-4">
                  <h4 className="text-teal dark:text-teal font-bold m-0 mb-3">
                    <i className="fas fa-check-circle mr-2"></i>Your Submitted Feedback
                  </h4>
                  
                  {/* Regional Feedback */}
                  <div className="mb-4 p-3 bg-ink dark:bg-ink rounded border border-border dark:border-border">
                    <p className="text-xs text-text-mid dark:text-text-mid m-0 mb-2 font-bold">REGIONAL DIRECTOR FEEDBACK:</p>
                    <p className="text-sm text-text-primary dark:text-text-primary m-0">
                      {planDetails.regionFeedbackStatus[region].regionalFeedback || '(No feedback provided)'}
                    </p>
                  </div>

                  {/* Tax Center Feedback Summary */}
                  {planDetails.regionFeedbackStatus[region].taxCenterFeedback && 
                   planDetails.regionFeedbackStatus[region].taxCenterFeedback.length > 0 && (
                    <div className="p-3 bg-ink dark:bg-ink rounded border border-border dark:border-border">
                      <p className="text-xs text-text-mid dark:text-text-mid m-0 mb-2 font-bold">TAX CENTER SUMMARY:</p>
                      <div className="space-y-1">
                        {planDetails.regionFeedbackStatus[region].taxCenterFeedback.map((tc, idx) => (
                          <div key={idx} className="text-xs text-text-mid dark:text-text-mid">
                            • {tc.taxCenter}: {tc.feedback}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submission Date */}
                  {planDetails.regionFeedbackStatus[region].receivedDate && (
                    <div className="mt-4 p-3 bg-ink dark:bg-ink rounded text-xs text-text-mid dark:text-text-mid">
                      <i className="fas fa-clock mr-1"></i>
                      Submitted: {new Date(planDetails.regionFeedbackStatus[region].receivedDate).toLocaleString()}
                    </div>
                  )}
                </div>
              )}

              {/* Real-Time Feedback Dashboard */}
              {Object.keys(realTimeFeedback).length > 0 && (
                <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4">
                  <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">
                    <i className="fas fa-stream mr-2"></i>Real-Time Feedback Stream ({Object.keys(realTimeFeedback).length})
                  </h3>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {Object.entries(realTimeFeedback)
                      .sort((a, b) => new Date(b[1].submittedAt) - new Date(a[1].submittedAt))
                      .map(([key, feedback]) => (
                        <div 
                          key={key} 
                          className={`p-3 rounded border-l-4 transition-all ${
                            feedback.isNew
                              ? 'bg-orange/10 dark:bg-orange/10 border-l-orange dark:border-l-orange border border-orange/30 dark:border-orange/30'
                              : 'bg-ink dark:bg-ink border-l-teal dark:border-l-teal border border-border dark:border-border'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-bold text-text-hi dark:text-text-hi m-0 text-sm">
                                {feedback.isNew && <span className="text-orange dark:text-orange mr-2">🆕</span>}
                                {feedback.taxCenter}
                              </p>
                              <p className="text-xs text-text-mid dark:text-text-mid m-0">Plan: {feedback.planId}</p>
                            </div>
                            {feedback.isNew && (
                              <span className="px-2 py-1 bg-orange dark:bg-orange text-white rounded text-xs font-bold">
                                NEW
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-text-mid dark:text-text-mid">
                            <i className="fas fa-clock mr-1"></i>
                            {new Date(feedback.submittedAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Approval History */}
              {planDetails.approvalHistory && planDetails.approvalHistory.length > 0 && (
                <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4">
                  <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Plan History</h3>
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
                Select a plan to provide feedback
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegionalFeedbackCollectionView;
