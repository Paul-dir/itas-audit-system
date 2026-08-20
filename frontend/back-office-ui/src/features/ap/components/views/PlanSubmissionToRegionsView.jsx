import React, { useState, useEffect } from 'react';
import { useData } from '../../services/dataService';
import { denormalizeRegionName, getDisplayRegionName } from '../../utils/regionNormalizer';
import { useAuth } from '../../context/AuthContext';
import Card from '../Card';
import Badge from '../Badge';

/**
 * PlanSubmissionToRegionsView
 * Audit Director submits plans to Regional Directors
 * 
 * SIMPLE WORKFLOW:
 * 1. Director selects a plan
 * 2. Director selects regions to send to
 * 3. Director submits plan
 * 4. Plan appears in Regional Director's view immediately
 */

function PlanSubmissionToRegionsView() {
  const { getUserInfo } = useAuth();
  const { data, updateData } = useData();
  const userInfo = getUserInfo();

  // State
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedRegions, setSelectedRegions] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState({});

  // All available regions
  const allRegions = [
    'Addis Ababa',
    'Oromia',
    'Amhara',
    'SNNPR',
    'Somali'
  ];

  // Load plans on mount
  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = () => {
    setLoading(true);
    // Using data from hook
    
    // Get DIRECTOR_APPROVED plans (approved by director, ready to send to regions)
    const availablePlans = (data.plans || []).filter(p => 
      p.status === 'DIRECTOR_APPROVED'
    );
    
    setPlans(availablePlans);
    
    // Build submitted status - only true if already has sentToRegions with values
    // This is the proper way to track submission, not by checking other fields
    const submittedStatus = {};
    availablePlans.forEach(plan => {
      submittedStatus[plan.id] = plan.sentToRegions && plan.sentToRegions.length > 0;
    });
    setSubmitted(submittedStatus);
    
    setLoading(false);
  };

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    setSelectedRegions(new Set()); // Reset regions when plan changes
  };

  const handleRegionToggle = (region) => {
    const normalized = denormalizeRegionName(region);
    const newSet = new Set(selectedRegions);
    
    if (newSet.has(normalized)) {
      newSet.delete(normalized);
    } else {
      newSet.add(normalized);
    }
    
    setSelectedRegions(newSet);
  };

  const handleSubmitPlan = () => {
    if (!selectedPlan) {
      alert('Please select a plan');
      return;
    }

    if (selectedRegions.size === 0) {
      alert('Please select at least one region');
      return;
    }

    // Load current data
    // Using data from hook
    const planIndex = data.plans.findIndex(p => p.id === selectedPlan);

    if (planIndex < 0) {
      alert('Plan not found');
      return;
    }

    const plan = data.plans[planIndex];
    
    // ✅ DUPLICATE PREVENTION: Check if already submitted to regions
    if (plan.sentToRegions && plan.sentToRegions.length > 0) {
      alert('❌ This plan was already submitted to regions!\n\n' +
            `Submitted to: ${plan.sentToRegions.map(r => getDisplayRegionName(r)).join(', ')}\n` +
            `Date: ${new Date(plan.sentToRegionsDate).toLocaleString()}\n\n` +
            'Cannot submit again. Plans can only be sent to regions once.');
      return;
    }

    // ✅ SIMPLE SUBMISSION:
    // Just set sentToRegions array with the normalized region names
    plan.sentToRegions = Array.from(selectedRegions);
    plan.sentToRegionsDate = new Date().toISOString();

    console.log('✅ DIRECTOR SUBMITTED PLAN:', {
      planId: plan.id,
      planName: plan.name,
      sentToRegions: plan.sentToRegions,
      sentToRegionsDate: plan.sentToRegionsDate
    });

    // Save to localStorage
    updateData(data);

    // Update UI
    setSubmitted(prev => ({
      ...prev,
      [selectedPlan]: true
    }));

    // Show success message
    const regionNames = Array.from(selectedRegions)
      .map(r => getDisplayRegionName(r))
      .join(', ');

    alert(`✅ Plan "${plan.name}" submitted to:\n${regionNames}\n\nRegional Directors will see it immediately.`);

    // Reset form
    setSelectedPlan(null);
    setSelectedRegions(new Set());

    // Reload plans
    loadPlans();
  };

  const getSelectedPlanDetails = () => {
    if (!selectedPlan) return null;
    return plans.find(p => p.id === selectedPlan);
  };

  const planDetails = getSelectedPlanDetails();
  const isSubmitted = selectedPlan && submitted[selectedPlan];

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="detail-header mb-6">
        <h2 className="text-2xl font-bold text-text-hi dark:text-text-hi flex items-center gap-2">
          <i className="fas fa-share-square"></i> Submit Plan to Regional Directors
        </h2>
        <p className="text-text-mid dark:text-text-mid mt-2">
          Select a plan and choose regions to send it to
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Plans List */}
        <div className="lg:col-span-1">
          <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg">
            <div className="px-4 py-3 border-b border-border dark:border-border">
              <h3 className="text-text-hi dark:text-text-hi font-bold m-0">
                Available Plans ({plans.length})
              </h3>
            </div>

            {loading ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">Loading...</div>
            ) : plans.length === 0 ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">
                No finalized plans available
              </div>
            ) : (
              <div className="divide-y divide-border dark:divide-border max-h-96 overflow-y-auto">
                {plans.map(plan => (
                  <div
                    key={plan.id}
                    onClick={() => handlePlanSelect(plan.id)}
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
                      {submitted[plan.id] && (
                        <Badge status="Submitted" className="director-approved text-xs" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Submission Form */}
        <div className="lg:col-span-2">
          {planDetails ? (
            <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4">
              {/* Plan Details */}
              <div className="mb-6">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Plan Details</h3>
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

              {/* Regional Allocation Summary */}
              {planDetails.regionalAllocation && (
                <div className="mb-6">
                  <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Regional Allocation</h3>
                  <div className="bg-ink dark:bg-ink rounded p-3 text-xs">
                    {Object.entries(planDetails.regionalAllocation).map(([region, allocation]) => (
                      <div key={region} className="py-2">
                        <p className="font-bold text-text-hi dark:text-text-hi m-0">
                          {getDisplayRegionName(region)}
                        </p>
                        <p className="text-text-mid dark:text-text-mid m-0 mt-1">
                          {Object.entries(allocation)
                            .map(([type, count]) => `${type}: ${count}`)
                            .join(' | ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Region Selection */}
              <div className="mb-6">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">
                  Select Regions to Send To
                </h3>
                <div className="space-y-2">
                  {allRegions.map(region => {
                    const normalized = denormalizeRegionName(region);
                    const isSelected = selectedRegions.has(normalized);

                    return (
                      <label key={region} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-ink dark:hover:bg-ink rounded">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleRegionToggle(region)}
                          className="w-4 h-4"
                        />
                        <span className="text-text-primary dark:text-text-primary">{region}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Status Message */}
              {isSubmitted && (
                <div className="bg-teal/20 dark:bg-teal/20 border border-teal dark:border-teal rounded p-3 mb-4">
                  <p className="text-teal dark:text-teal font-bold m-0 text-sm">
                    ✅ Plan already submitted to regions: {planDetails.sentToRegions?.map(r => getDisplayRegionName(r)).join(', ')}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmitPlan}
                disabled={isSubmitted || selectedRegions.size === 0}
                className={`w-full py-2 px-4 rounded font-bold transition-all ${
                  isSubmitted || selectedRegions.size === 0
                    ? 'bg-gray-600 dark:bg-gray-600 text-gray-400 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-teal dark:bg-teal text-white hover:bg-teal/80 dark:hover:bg-teal/80'
                }`}
              >
                {isSubmitted ? '✅ Already Submitted' : `📤 Submit to ${selectedRegions.size} Region${selectedRegions.size !== 1 ? 's' : ''}`}
              </button>
            </div>
          ) : (
            <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-8 text-center">
              <p className="text-text-mid dark:text-text-mid m-0">
                Select a plan from the list to view details and submit
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlanSubmissionToRegionsView;
