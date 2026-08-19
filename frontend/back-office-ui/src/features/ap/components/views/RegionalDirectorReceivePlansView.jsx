import React, { useState, useEffect } from 'react';
import { useData } from '../../services/dataService';
import { denormalizeRegionName, getDisplayRegionName } from '../../utils/regionNormalizer';
import { filterPlansForRegion } from '../../utils/regionalDataFilter';
import { useAuth } from '../../context/AuthContext';
import Card from '../Card';
import Badge from '../Badge';

/**
 * RegionalDirectorReceivePlansView
 * Regional Director receives plans from Audit Director
 * 
 * WORKFLOW:
 * 1. Regional Director sees their region's submitted plans
 * 2. Can view plan details
 * 3. Can ACCEPT plan → marks as ready for allocation
 * 4. Can REJECT plan → sends back to director
 */

function RegionalDirectorReceivePlansView() {
  const { getUserInfo, authContext } = useAuth();
  const { data, updateData } = useData();
  const userInfo = getUserInfo();

  // Get regional director's assigned region from auth context
  const directorRegion = authContext?.region || null;

  // State
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  // Load plans on mount
  useEffect(() => {
    loadPlans();
  }, [directorRegion]);

  const loadPlans = () => {
    setLoading(true);
    
    if (!directorRegion) {
      setPlans([]);
      setLoading(false);
      return;
    }

    // ✅ REGIONAL ISOLATION: Only show plans allocated to THIS region
    const allSubmittedPlans = (data.plans || []).filter(plan => {
      // Show plans that have been submitted to regions
      const hasSentToRegions = plan.sentToRegions && plan.sentToRegions.length > 0;
      const hasAllocation = plan.regionalAllocation && Object.keys(plan.regionalAllocation).length > 0;
      
      return hasSentToRegions && hasAllocation;
    });

    // Filter only plans for this region
    const regionalPlans = filterPlansForRegion(allSubmittedPlans, directorRegion);

    console.log(`✅ Regional Director (${directorRegion}): Found ${regionalPlans.length} plans out of ${allSubmittedPlans.length} submitted plans`);

    setPlans(regionalPlans);
    setLoading(false);
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    setShowRejectionForm(false);
    setRejectionReason('');
  };

  const handleAcceptPlan = () => {
    if (!selectedPlan || !directorRegion) return;

    // Using data from hook
    const planIndex = data.plans.findIndex(p => p.id === selectedPlan);

    if (planIndex < 0) {
      alert('Plan not found');
      return;
    }

    const plan = data.plans[planIndex];

    // ✅ Mark plan as ACCEPTED by this regional director
    if (!plan.planAcceptanceStatus) {
      plan.planAcceptanceStatus = {};
    }

    plan.planAcceptanceStatus[directorRegion] = {
      status: 'ACCEPTED',
      acceptedDate: new Date().toISOString(),
      acceptedBy: userInfo?.fullName || 'Regional Director',
      rejectionReason: null
    };

    console.log('✅ PLAN ACCEPTED BY REGIONAL DIRECTOR:', {
      planId: plan.id,
      region: directorRegion,
      status: 'ACCEPTED'
    });

    // Save to localStorage
    updateData(data);

    // Update UI
    alert(`✅ Plan "${plan.name}" ACCEPTED for ${getDisplayRegionName(directorRegion)}!\n\nYou can now proceed with allocation to tax centers.`);

    // Reset and reload
    setSelectedPlan(null);
    setShowRejectionForm(false);
    loadPlans();
  };

  const handleRejectPlan = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    if (!selectedPlan || !directorRegion) return;

    // Using data from hook
    const planIndex = data.plans.findIndex(p => p.id === selectedPlan);

    if (planIndex < 0) {
      alert('Plan not found');
      return;
    }

    const plan = data.plans[planIndex];

    // ✅ Mark plan as REJECTED by this regional director
    if (!plan.planAcceptanceStatus) {
      plan.planAcceptanceStatus = {};
    }

    plan.planAcceptanceStatus[directorRegion] = {
      status: 'REJECTED',
      rejectionDate: new Date().toISOString(),
      rejectionReason: rejectionReason,
      rejectedBy: userInfo?.fullName || 'Regional Director'
    };

    console.log('❌ PLAN REJECTED BY REGIONAL DIRECTOR:', {
      planId: plan.id,
      region: directorRegion,
      status: 'REJECTED',
      reason: rejectionReason
    });

    // Save to localStorage
    updateData(data);

    // Update UI
    alert(`❌ Plan "${plan.name}" REJECTED for ${getDisplayRegionName(directorRegion)}!\n\nReason: ${rejectionReason}\n\nThe director will be notified.`);

    // Reset and reload
    setSelectedPlan(null);
    setShowRejectionForm(false);
    setRejectionReason('');
    loadPlans();
  };

  const getSelectedPlanDetails = () => {
    if (!selectedPlan) return null;
    return plans.find(p => p.id === selectedPlan);
  };

  const planDetails = getSelectedPlanDetails();
  const planAcceptance = planDetails && directorRegion ? planDetails.planAcceptanceStatus?.[directorRegion] : null;
  const planStatus = planAcceptance?.status; // 'ACCEPTED', 'REJECTED', or undefined (pending)

  if (!directorRegion) {
    return (
      <div className="px-6 py-8">
        <div className="bg-danger/20 dark:bg-danger/20 border border-danger dark:border-danger rounded-lg p-6">
          <p className="text-danger dark:text-danger font-bold m-0">
            ❌ Error: No region assigned to your account
          </p>
          <p className="text-text-mid dark:text-text-mid mt-2 m-0">
            Contact administrator to assign a region to your regional director account
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
          <i className="fas fa-inbox"></i> Received Plans - {getDisplayRegionName(directorRegion)}
        </h2>
        <p className="text-text-mid dark:text-text-mid mt-2">
          Review and accept plans sent by the Audit Director for your region
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Plans List */}
        <div className="lg:col-span-1">
          <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg">
            <div className="px-4 py-3 border-b border-border dark:border-border">
              <h3 className="text-text-hi dark:text-text-hi font-bold m-0">
                Submitted Plans ({plans.length})
              </h3>
            </div>

            {loading ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">Loading...</div>
            ) : plans.length === 0 ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">
                No plans submitted for your region yet
              </div>
            ) : (
              <div className="divide-y divide-border dark:divide-border max-h-96 overflow-y-auto">
                {plans.map(plan => {
                  const acceptance = plan.planAcceptanceStatus?.[directorRegion];
                  const status = acceptance?.status;
                  
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
                        </div>
                        {status === 'ACCEPTED' && (
                          <Badge status="Accepted" className="director-approved text-xs" />
                        )}
                        {status === 'REJECTED' && (
                          <Badge status="Rejected" className="text-xs" style={{ backgroundColor: '#F44336' }} />
                        )}
                        {!status && (
                          <Badge status="Pending" className="text-xs" style={{ backgroundColor: '#FFA500' }} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Plan Details & Actions */}
        <div className="lg:col-span-2">
          {planDetails ? (
            <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4">
              {/* Plan Info */}
              <div className="mb-6">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Plan Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Plan ID</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">{planDetails.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Plan Name</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">{planDetails.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Status</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">{planDetails.status}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Fiscal Year</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">{planDetails.fiscalYear}</p>
                  </div>
                </div>
              </div>

              {/* Allocation Breakdown - Show ALL regions */}
              <div className="mb-6">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">
                  Regional Allocation Breakdown (All Regions)
                </h3>
                <div className="bg-ink dark:bg-ink rounded p-3 space-y-3">
                  {Object.entries(planDetails.regionalAllocation || {}).map(([region, allocation]) => (
                    <div key={region} className="border border-border dark:border-border rounded p-2">
                      <h4 className="text-teal dark:text-teal font-bold text-sm mb-2">
                        {getDisplayRegionName(region)}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(allocation || {}).map(([type, count]) => (
                          <div key={type} className="flex justify-between">
                            <span className="text-text-mid dark:text-text-mid">{type}:</span>
                            <span className="text-text-hi dark:text-text-hi font-bold">{count}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-border dark:border-border mt-2 pt-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-text-mid dark:text-text-mid font-bold">Total:</span>
                          <span className="text-teal dark:text-teal font-bold">
                            {Object.values(allocation || {}).reduce((a, b) => a + b, 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Display */}
              {planStatus === 'ACCEPTED' && (
                <div className="bg-teal/20 dark:bg-teal/20 border border-teal dark:border-teal rounded p-3 mb-4">
                  <p className="text-teal dark:text-teal font-bold m-0 text-sm">
                    ✅ Plan accepted on {new Date(planAcceptance.acceptedDate).toLocaleDateString()}
                  </p>
                  <p className="text-text-mid dark:text-text-mid m-0 mt-1 text-xs">
                    You can now proceed with allocating cases to tax centers
                  </p>
                </div>
              )}

              {planStatus === 'REJECTED' && (
                <div className="bg-danger/20 dark:bg-danger/20 border border-danger dark:border-danger rounded p-3 mb-4">
                  <p className="text-danger dark:text-danger font-bold m-0 text-sm">
                    ❌ Plan rejected on {new Date(planAcceptance.rejectionDate).toLocaleDateString()}
                  </p>
                  <p className="text-text-mid dark:text-text-mid m-0 mt-2 text-xs">
                    <strong>Reason:</strong> {planAcceptance.rejectionReason}
                  </p>
                </div>
              )}

              {!planStatus && (
                <>
                  {/* Rejection Form */}
                  {showRejectionForm ? (
                    <div className="bg-danger/10 dark:bg-danger/10 border border-danger dark:border-danger rounded p-4 mb-4">
                      <h4 className="text-danger dark:text-danger font-bold m-0 mb-2">Reject Plan</h4>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Enter reason for rejection..."
                        className="w-full px-3 py-2 rounded border border-border dark:border-border bg-ink dark:bg-ink text-text-primary dark:text-text-primary text-sm mb-3"
                        rows="3"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleRejectPlan}
                          className="flex-1 px-3 py-2 rounded font-bold bg-danger dark:bg-danger text-white hover:bg-danger/90 dark:hover:bg-danger/90 text-sm"
                        >
                          ❌ Confirm Rejection
                        </button>
                        <button
                          onClick={() => setShowRejectionForm(false)}
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
                      onClick={handleAcceptPlan}
                      className="flex-1 px-4 py-2 rounded font-bold bg-teal dark:bg-teal text-white hover:bg-teal/80 dark:hover:bg-teal/80 transition-all"
                    >
                      ✅ Accept Plan
                    </button>
                    <button
                      onClick={() => setShowRejectionForm(!showRejectionForm)}
                      className="flex-1 px-4 py-2 rounded font-bold bg-danger dark:bg-danger text-white hover:bg-danger/80 dark:hover:bg-danger/80 transition-all"
                    >
                      ❌ Reject Plan
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-8 text-center">
              <p className="text-text-mid dark:text-text-mid m-0">
                Select a plan from the list to review and accept/reject
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegionalDirectorReceivePlansView;
