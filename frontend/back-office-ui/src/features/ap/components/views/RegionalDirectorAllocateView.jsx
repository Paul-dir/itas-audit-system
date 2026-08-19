import React, { useState, useEffect } from 'react';
import { useData } from '../../services/dataService';
import { denormalizeRegionName, getDisplayRegionName } from '../../utils/regionNormalizer';
import { filterPlansForRegion } from '../../utils/regionalDataFilter';
import { useAuth } from '../../context/AuthContext';
import Card from '../Card';
import Badge from '../Badge';

/**
 * RegionalDirectorAllocateView
 * Regional Director distributes accepted plans to tax centers
 * 
 * WORKFLOW:
 * 1. Shows only ACCEPTED plans for their region
 * 2. Regional Director can view regional allocation breakdown
 * 3. Distributes cases to 3 tax centers in their region
 * 4. Validates distribution equals total
 * 5. Sends to tax centers
 */

function RegionalDirectorAllocateView() {
  const { authContext } = useAuth();
  const { data, updateData } = useData();

  // Get regional director's assigned region
  const directorRegion = authContext?.region || null;

  // Tax centers in each region - use lowercase_underscore format to match TAX_CENTER_MAPPING
  const taxCentersByRegion = {
    'addis_ababa': ['addis_ababa-tc1', 'addis_ababa-tc2', 'addis_ababa-tc3'],
    'oromia': ['oromia-tc1', 'oromia-tc2', 'oromia-tc3'],
    'amhara': ['amhara-tc1', 'amhara-tc2', 'amhara-tc3'],
    'snnpr': ['snnpr-tc1', 'snnpr-tc2', 'snnpr-tc3'],
    'somali': ['somali-tc1', 'somali-tc2', 'somali-tc3']
  };

  // State
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [distribution, setDistribution] = useState({});
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
    const allAcceptedPlans = (data.plans || []).filter(plan => {
      // Show plans where ANY region has accepted the plan
      const hasAcceptance = plan.planAcceptanceStatus && 
        Object.values(plan.planAcceptanceStatus).some(status => status?.status === 'ACCEPTED');
      
      // And has allocation data
      const hasAllocation = plan.regionalAllocation && Object.keys(plan.regionalAllocation).length > 0;
      
      return hasAcceptance && hasAllocation;
    });

    // Filter only plans for this region
    const regionalPlans = filterPlansForRegion(allAcceptedPlans, directorRegion);

    console.log(`✅ Regional Director (${directorRegion}): Found ${regionalPlans.length} accepted plans out of ${allAcceptedPlans.length} total`);

    setPlans(regionalPlans);
    
    // Build submitted status
    const submittedStatus = {};
    regionalPlans.forEach(plan => {
      submittedStatus[plan.id] = !!plan.allocationSentStatus?.[directorRegion]?.status;
    });
    setSubmitted(submittedStatus);

    setLoading(false);
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    
    // Initialize distribution for this plan with auto-fill
    const plan = data.plans.find(p => p.id === planId);
    
    if (plan) {
      // Get allocation (from any region, fallback to first available)
      let regionAllocation = null;
      
      if (directorRegion && plan.regionalAllocation?.[directorRegion]) {
        regionAllocation = plan.regionalAllocation[directorRegion];
      } else {
        // Use first available region's allocation
        const firstRegion = Object.keys(plan.regionalAllocation || {})[0];
        regionAllocation = plan.regionalAllocation?.[firstRegion];
      }

      if (regionAllocation) {
        const taxCenters = taxCentersByRegion[directorRegion] || 
          ['Tax Center 1', 'Tax Center 2', 'Tax Center 3']; // Fallback if no region
        
        const dist = {};

        // Initialize distribution - split evenly across tax centers
        taxCenters.forEach(tc => {
          dist[tc] = {};
          auditTypes.forEach(type => {
            // Split total across 3 tax centers
            const total = regionAllocation[type] || 0;
            const perTC = Math.floor(total / taxCenters.length);
            dist[tc][type] = perTC;
          });
        });

        // Distribute remainder
        taxCenters.forEach((tc, idx) => {
          auditTypes.forEach(type => {
            const total = regionAllocation[type] || 0;
            const perTC = Math.floor(total / taxCenters.length);
            const remainder = total % taxCenters.length;
            
            if (idx < remainder) {
              dist[tc][type] += 1;
            }
          });
        });

        setDistribution(dist);
      }
    }
  };

  const handleDistributionChange = (taxCenter, auditType, value) => {
    setDistribution(prev => ({
      ...prev,
      [taxCenter]: {
        ...prev[taxCenter],
        [auditType]: parseInt(value) || 0
      }
    }));
  };

  const getPlanDetails = () => {
    if (!selectedPlan) return null;
    return plans.find(p => p.id === selectedPlan);
  };

  const getRegionalAllocation = () => {
    const plan = getPlanDetails();
    if (!plan) return null;
    
    // Show ALL regional allocations, not just director's region
    // This ensures we have data to work with
    const allAllocations = plan.regionalAllocation || {};
    
    // If director has a region, prioritize showing that allocation
    if (directorRegion && allAllocations[directorRegion]) {
      return allAllocations[directorRegion];
    }
    
    // Otherwise, show the first available allocation
    const firstRegion = Object.keys(allAllocations)[0];
    return allAllocations[firstRegion] || {};
  };

  const getTotalPerTaxCenter = (taxCenter) => {
    return Object.values(distribution[taxCenter] || {})
      .reduce((a, b) => a + b, 0);
  };

  const getTotalPerAuditType = (auditType) => {
    let total = 0;
    Object.values(distribution).forEach(tc => {
      total += (tc[auditType] || 0);
    });
    return total;
  };

  const validateDistribution = () => {
    const allocation = getRegionalAllocation();
    
    // Safety check: if no allocation, validation passes (no data to validate)
    if (!allocation || Object.keys(allocation).length === 0) {
      return true;
    }
    
    for (const type of auditTypes) {
      const required = allocation[type] || 0;
      const distributed = getTotalPerAuditType(type);
      if (required !== distributed) {
        return false;
      }
    }
    return true;
  };

  const handleSendToTaxCenters = () => {
    if (!validateDistribution()) {
      alert('❌ Distribution does not match allocation');
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

    // ✅ Save tax center allocations
    if (!plan.taxCenterAllocations) {
      plan.taxCenterAllocations = {};
    }

    plan.taxCenterAllocations[directorRegion] = distribution;

    // ✅ Mark allocation as sent
    if (!plan.allocationSentStatus) {
      plan.allocationSentStatus = {};
    }

    plan.allocationSentStatus[directorRegion] = {
      status: 'SENT',
      sentDate: new Date().toISOString(),
      sentBy: 'Regional Director',
      taxCenters: Object.keys(distribution)
    };

    console.log('✅ ALLOCATIONS SENT TO TAX CENTERS:', {
      planId: plan.id,
      region: directorRegion,
      taxCenters: Object.keys(distribution),
      allocation: distribution
    });

    updateData(updatedData);

    alert(`✅ Allocations sent to ${Object.keys(distribution).length} tax centers!\n\nTax centers can now review and accept the plan.`);

    setSelectedPlan(null);
    loadPlans();
  };

  const planDetails = getPlanDetails();
  const regionalAllocation = getRegionalAllocation() || {};
  const totalCases = Object.values(regionalAllocation).reduce((a, b) => a + b, 0);
  const isDistributionValid = Object.keys(distribution).length > 0 && validateDistribution();
  const isAlreadySent = selectedPlan && submitted[selectedPlan];
  const taxCenters = taxCentersByRegion[directorRegion] || [];

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
          <i className="fas fa-tasks"></i> Allocate to Tax Centers - {getDisplayRegionName(directorRegion)}
        </h2>
        <p className="text-text-mid dark:text-text-mid mt-2">
          Distribute accepted plans to tax centers in your region
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Plans List */}
        <div className="lg:col-span-1">
          <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg">
            <div className="px-4 py-3 border-b border-border dark:border-border">
              <h3 className="text-text-hi dark:text-text-hi font-bold m-0">
                Accepted Plans ({plans.length})
              </h3>
            </div>

            {loading ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">Loading...</div>
            ) : plans.length === 0 ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">
                No accepted plans for allocation yet
              </div>
            ) : (
              <div className="divide-y divide-border dark:divide-border max-h-96 overflow-y-auto">
                {plans.map(plan => (
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
                      {submitted[plan.id] && (
                        <Badge status="Sent" className="text-xs" style={{ backgroundColor: '#2196F3' }} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Allocation Form */}
        <div className="lg:col-span-2">
          {planDetails ? (
            <div>
              {/* Plan Summary */}
              <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4 mb-6">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Plan Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Plan ID</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">{planDetails.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Total Cases</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">{totalCases}</p>
                  </div>
                </div>
              </div>

              {/* Regional Allocation */}
              <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4 mb-6">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Regional Allocation Breakdown</h3>
                <div className="space-y-2">
                  {auditTypes.map(type => (
                    <div key={type} className="flex justify-between text-sm">
                      <span className="text-text-mid dark:text-text-mid">{auditTypeLabels[type]}:</span>
                      <span className="text-text-hi dark:text-text-hi font-bold">{regionalAllocation[type] || 0}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distribution Table */}
              {!isAlreadySent && (
                <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4 mb-6">
                  <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Distribute to Tax Centers</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-ink dark:bg-ink border-b border-border dark:border-border">
                          <th className="text-left px-2 py-2 text-text-hi dark:text-text-hi font-bold">Tax Center</th>
                          {auditTypes.map(type => (
                            <th key={type} className="text-center px-2 py-2 text-text-hi dark:text-text-hi font-bold">
                              {auditTypeLabels[type].split(' ')[0]}
                            </th>
                          ))}
                          <th className="text-center px-2 py-2 text-text-hi dark:text-text-hi font-bold">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {taxCenters.map(tc => (
                          <tr key={tc} className="border-b border-border dark:border-border hover:bg-ink/50 dark:hover:bg-ink/50">
                            <td className="px-2 py-2 font-bold text-text-hi dark:text-text-hi">{tc}</td>
                            {auditTypes.map(type => (
                              <td key={type} className="text-center px-2 py-2">
                                <input
                                  type="number"
                                  min="0"
                                  value={distribution[tc]?.[type] || 0}
                                  onChange={(e) => handleDistributionChange(tc, type, e.target.value)}
                                  className="w-12 px-1 py-1 rounded border border-border dark:border-border bg-ink dark:bg-ink text-text-primary dark:text-text-primary text-center"
                                />
                              </td>
                            ))}
                            <td className="text-center px-2 py-2 font-bold text-teal dark:text-teal">
                              {getTotalPerTaxCenter(tc)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-teal/20 dark:bg-teal/20 font-bold">
                          <td className="px-2 py-2 text-text-hi dark:text-text-hi">Total</td>
                          {auditTypes.map(type => (
                            <td key={type} className="text-center px-2 py-2 text-teal dark:text-teal">
                              {getTotalPerAuditType(type)} / {regionalAllocation[type] || 0}
                            </td>
                          ))}
                          <td className="text-center px-2 py-2 text-teal dark:text-teal">
                            {Object.values(distribution).reduce((sum, tc) => sum + getTotalPerTaxCenter(Object.keys(distribution)[Object.values(distribution).indexOf(tc)]), 0)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Validation */}
                  <div className="mt-4">
                    {isDistributionValid ? (
                      <div className="bg-teal/20 dark:bg-teal/20 border border-teal dark:border-teal rounded p-3 mb-4">
                        <p className="text-teal dark:text-teal font-bold m-0 text-sm">✅ Distribution is valid</p>
                      </div>
                    ) : (
                      <div className="bg-danger/20 dark:bg-danger/20 border border-danger dark:border-danger rounded p-3 mb-4">
                        <p className="text-danger dark:text-danger font-bold m-0 text-sm">❌ Distribution does not match allocation</p>
                      </div>
                    )}

                    <button
                      onClick={handleSendToTaxCenters}
                      disabled={!isDistributionValid}
                      className={`w-full py-2 px-4 rounded font-bold transition-all ${
                        isDistributionValid
                          ? 'bg-teal dark:bg-teal text-white hover:bg-teal/80 dark:hover:bg-teal/80'
                          : 'bg-gray-600 dark:bg-gray-600 text-gray-400 dark:text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      📤 Send to {taxCenters.length} Tax Centers
                    </button>
                  </div>
                </div>
              )}

              {isAlreadySent && (
                <div className="bg-teal/20 dark:bg-teal/20 border border-teal dark:border-teal rounded-lg p-4">
                  <p className="text-teal dark:text-teal font-bold m-0">
                    ✅ Allocations already sent to tax centers
                  </p>
                  <p className="text-text-mid dark:text-text-mid m-0 mt-2 text-sm">
                    Tax centers can now review and accept the plan
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-8 text-center">
              <p className="text-text-mid dark:text-text-mid m-0">
                Select a plan to allocate to tax centers
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegionalDirectorAllocateView;
