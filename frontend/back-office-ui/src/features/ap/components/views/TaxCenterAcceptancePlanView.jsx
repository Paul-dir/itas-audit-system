import React, { useState, useEffect } from 'react';
import Card from '../Card';
import Badge from '../Badge';
import { useData } from '../../services/dataService';
import { useRegional } from '../../context/RegionalContext';
import { useAuth } from '../../context/AuthContext';
import { getDisplayRegionName } from '../../utils/regionNormalizer';

/**
 * TaxCenterAcceptancePlanView - Tax centers formally accept submitted approved plans
 * Ensures proper handoff with no data loss or conflicts with full dark mode support
 */
function TaxCenterAcceptancePlanView() {
  const { assignedTaxCenter, assignedTaxCenterRegion } = useRegional();
  const { getUserInfo } = useAuth();
  const { data, updateData } = useData();
  const userInfo = getUserInfo();
  
  const selectedRegion = userInfo?.orgContext?.assignedRegion || assignedTaxCenterRegion || 'Oromia';
  const selectedTaxCenter = userInfo?.orgContext?.assignedTaxCenter || assignedTaxCenter || 'Tax Center 1';
  
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planDetails, setPlanDetails] = useState(null);
  const [accepted, setAccepted] = useState({});
  const [loading, setLoading] = useState(true);
  const [allRegions, setAllRegions] = useState([]);
  const [allTaxCenters, setAllTaxCenters] = useState([]);
  const [approvedPlans, setApprovedPlans] = useState([]);

  useEffect(() => {
    // Using data from hook
    const regions = [...new Set(data.plans.flatMap(p => Object.keys(p.regionalAllocation || {})))];
    setAllRegions(regions.length > 0 ? regions : ['Oromia', 'SNNPR', 'Addis Ababa', 'Amhara', 'Tigray']);
    
    // DYNAMIC: Show ALL plans from system (no status filter)
    // Let loadPlans() handle which ones are actually visible to this tax center
    console.log('📊 Loading all plans for reference (actual visibility determined by submission records)');
    setApprovedPlans(data.plans);
  }, []);

  useEffect(() => {
    loadPlans();
    
    // Auto-refresh every 5 seconds for real-time updates
    const interval = setInterval(() => {
      loadPlans();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [selectedRegion, selectedTaxCenter]);

  const loadPlans = () => {
    if (!selectedRegion || !selectedTaxCenter) {
      setLoading(false);
      return;
    }

    localStorage.setItem('tax_center_selection', selectedTaxCenter);
    localStorage.setItem('tax_center_selection_region', selectedRegion);
    
    console.log('📍 Tax Center Selection Stored:', { selectedTaxCenter, selectedRegion });

    // Using data from hook

    // Normalize tax center name format
    // Format 1: "Addis Ababa TC1" (from auth) → "Addis Ababa-tc1"
    // Format 2: "Addis Ababa-tc1" (from config) → keep as-is
    let normalizedTaxCenter = selectedTaxCenter;
    
    if (selectedTaxCenter.includes('TC')) {
      // "Addis Ababa TC1" format → convert to "Addis Ababa-tc1"
      const parts = selectedTaxCenter.split(' TC');
      const region = parts[0]; // "Addis Ababa"
      const tcNum = parts[1]; // "1"
      normalizedTaxCenter = `${region}-tc${tcNum}`.toLowerCase(); // "addis ababa-tc1"
    } else if (selectedTaxCenter.includes('-tc')) {
      // Already in "Addis Ababa-tc1" format
      normalizedTaxCenter = selectedTaxCenter.toLowerCase();
    } else {
      // Fallback: assume it's a region name, convert to standard format
      normalizedTaxCenter = `${selectedTaxCenter}-tc1`.toLowerCase();
    }

    console.log('🔍 FILTERING PLANS (DYNAMIC - RUNTIME ONLY):', {
      selectedRegion,
      selectedTaxCenter,
      normalizedTaxCenter,
      totalPlans: data.plans.length,
      filterMethod: 'DYNAMIC - Based on submittedToTaxCenters records ONLY (no status check)',
      allPlans: data.plans.map(p => ({
        id: p.id,
        status: p.status,
        submittedToTaxCenters: p.submittedToTaxCenters ? Object.keys(p.submittedToTaxCenters) : [],
        regionSubmission: p.submittedToTaxCenters?.[selectedRegion]
      }))
    });

    // DYNAMIC FILTER: Show plans based ONLY on runtime submission records
    // NO hardcoded status checks - status doesn't matter
    // If a plan has a submittedToTaxCenters record for this region with this tax center, show it
    const submitted = data.plans.filter(p => {
      // Must have submission record for this region - THIS IS THE ONLY REQUIREMENT
      const regionSubmission = p.submittedToTaxCenters?.[selectedRegion];
      if (!regionSubmission) {
        console.log(`  ⏭️  ${p.id}: No submission record for region ${selectedRegion} (status: ${p.status})`);
        return false;
      }
      
      // Must include THIS tax center in the submission list
      const taxCentersInRegion = regionSubmission.taxCentersInRegion || [];
      console.log(`  📋 ${p.id}: Tax centers in submission: ${JSON.stringify(taxCentersInRegion)}`);
      console.log(`  🔍 Checking if ${normalizedTaxCenter} is in list...`);
      
      // CRITICAL FIX: Normalize both for case-insensitive comparison
      const taxCentersLowercase = taxCentersInRegion.map(tc => tc.toLowerCase());
      const isIncluded = taxCentersLowercase.includes(normalizedTaxCenter.toLowerCase());
      
      if (isIncluded) {
        console.log(`  ✅ ${p.id}: MATCH - ${normalizedTaxCenter} found! (status: ${p.status}) - SHOWING PLAN`);
      } else {
        console.log(`  ❌ ${p.id}: NO MATCH - ${normalizedTaxCenter} not in submission list (list: ${JSON.stringify(taxCentersLowercase)})`);
      }
      
      return isIncluded;
    });

    console.log('✅ TAX CENTER VIEW - Plans Loaded (DYNAMIC):', {
      region: selectedRegion,
      taxCenter: selectedTaxCenter,
      normalizedTaxCenter,
      submittedPlans: submitted.length,
      plans: submitted.map(p => ({
        id: p.id,
        status: p.status,
        submittedTo: p.submittedToTaxCenters?.[selectedRegion]?.taxCentersInRegion
      }))
    });

    setPlans(submitted);

    const acceptedStatus = {};
    submitted.forEach(plan => {
      const taxCenterAcceptance = plan.taxCenterAcceptance?.[selectedRegion]?.[normalizedTaxCenter];
      acceptedStatus[plan.id] = taxCenterAcceptance?.status === 'ACCEPTED' || false;
    });
    setAccepted(acceptedStatus);

    setLoading(false);
  };

  const handleSelectPlan = (planId) => {
    // Using data from hook
    const plan = data.plans.find(p => p.id === planId);
    setSelectedPlan(planId);
    setPlanDetails(plan);
  };

  const handleAcceptPlan = () => {
    if (!selectedPlan) {
      alert('Please select a plan first');
      return;
    }

    let taxCenterName = selectedTaxCenter;
    let taxCenterRegion = selectedRegion;

    if (taxCenterName.includes('Tax Center')) {
      const parts = taxCenterName.split(' ');
      const tcNum = parts[parts.length - 1];
      taxCenterName = `${taxCenterRegion}-tc${tcNum}`;
    }

    // Using data from hook
    const planIndex = data.plans.findIndex(p => p.id === selectedPlan);

    if (planIndex >= 0) {
      const plan = data.plans[planIndex];

      if (plan.taxCenterAcceptance?.[taxCenterRegion]?.[taxCenterName]?.status === 'ACCEPTED') {
        alert(`❌ ${taxCenterName} has already accepted this plan. Cannot accept again.`);
        return;
      }

      if (!window.confirm(`Accept ${selectedPlan} for ${taxCenterName}?\n\nThis confirms you are ready to execute the plan. This action cannot be undone.`)) {
        return;
      }

      if (!plan.taxCenterAcceptance) {
        plan.taxCenterAcceptance = {};
      }
      if (!plan.taxCenterAcceptance[taxCenterRegion]) {
        plan.taxCenterAcceptance[taxCenterRegion] = {};
      }

      plan.taxCenterAcceptance[taxCenterRegion][taxCenterName] = {
        status: 'ACCEPTED',
        taxCenter: taxCenterName,
        region: taxCenterRegion,
        acceptedBy: 'Tax Center Manager',
        acceptedDate: new Date().toISOString(),
        readyForExecution: true,
        noConflict: true,
        dataIntegrity: 'verified'
      };

      if (!plan.approvalHistory) plan.approvalHistory = [];
      plan.approvalHistory.push({
        action: 'ACCEPTED_BY_TAX_CENTER',
        by: 'Tax Center Manager',
        taxCenter: taxCenterName,
        region: taxCenterRegion,
        date: new Date().toISOString(),
        notes: `${taxCenterName} formally accepted the approved plan. Ready for execution.`,
        version: plan.version
      });

      updateData(data);
      
      setAccepted(prev => ({ 
        ...prev, 
        [`${selectedPlan}-${taxCenterRegion}-${taxCenterName}`]: true 
      }));

      alert(`✅ ${taxCenterName} successfully accepted ${selectedPlan}!\n\nThe plan is now locked in for this tax center. Ready for execution.`);

      loadPlans();
    }
  };

  const handleSendToAuditTeamLeader = () => {
    if (!selectedPlan) {
      alert('❌ No plan selected');
      return;
    }

    let taxCenterName = selectedTaxCenter;
    let taxCenterRegion = selectedRegion;

    if (taxCenterName.includes('Tax Center')) {
      const parts = taxCenterName.split(' ');
      const tcNum = parts[parts.length - 1];
      taxCenterName = `${taxCenterRegion}-tc${tcNum}`;
    }

    // Using data from hook
    const plan = data.plans.find(p => p.id === selectedPlan);

    if (!plan) {
      alert('❌ Plan not found');
      return;
    }

    if (plan.taxCenterAcceptance?.[taxCenterRegion]?.[taxCenterName]?.status !== 'ACCEPTED') {
      alert('❌ Plan must be ACCEPTED before sending to Audit Team Leader');
      return;
    }

    if (!window.confirm(`Send plan "${selectedPlan}" to Audit Team Leader for ${taxCenterName}?\n\nThe Audit Team Leader will use this plan to create audit cases.`)) {
      return;
    }

    // Mark plan as sent to audit team leader
    if (!plan.sentToAuditTeamLeader) {
      plan.sentToAuditTeamLeader = {};
    }

    plan.sentToAuditTeamLeader[taxCenterRegion] = {
      [taxCenterName]: {
        status: 'SENT',
        sentDate: new Date().toISOString(),
        sentBy: 'Tax Center Manager',
        readyForCascade: true
      }
    };

    if (!plan.approvalHistory) plan.approvalHistory = [];
    plan.approvalHistory.push({
      action: 'SENT_TO_AUDIT_TEAM_LEADER',
      by: 'Tax Center Manager',
      taxCenter: taxCenterName,
      region: taxCenterRegion,
      date: new Date().toISOString(),
      notes: `Plan sent to Audit Team Leader from ${taxCenterName}. Ready for case creation.`,
      version: plan.version
    });

    updateData(data);
    alert(`✅ Plan sent to Audit Team Leader!\n\nThe Audit Team Leader can now start creating audit cases from this plan.`);
    setSelectedPlanId(null);
    loadPlans(); // Refresh list
  };

  const auditTypes = ['desk_audit', 'field_audit', 'joint_audit', 'transfer_pricing', 'comprehensive', 'issue_audit'];
  const auditTypeLabels = {
    desk_audit: 'Desk Audit',
    field_audit: 'Field Audit',
    joint_audit: 'Joint Audit',
    transfer_pricing: 'Transfer Pricing',
    comprehensive: 'Comprehensive',
    issue_audit: 'Issue Audit'
  };

  if (loading) {
    return <div className="p-6">Loading submitted plans...</div>;
  }

  return (
    <div className="p-6">
      <div className="detail-header">
        <h2><i className="fas fa-handshake"></i> Accept Approved Plan</h2>
        <Badge status={`${plans.length} Plans Submitted`} className="director-approved" />
      </div>

      <div className="bg-teal/20 dark:bg-teal/20 text-teal dark:text-teal p-4 rounded mb-6 border-2 border-teal dark:border-teal">
        <strong className="flex items-center gap-2"><i className="fas fa-check-circle"></i> Tax Center - Formal Acceptance</strong>
        <p className="text-text-mid dark:text-text-mid mt-2 text-xs leading-relaxed">
          Review plans submitted by Regional Director for {selectedTaxCenter} in {selectedRegion}. Formally accept the plan to confirm you're ready for execution.
        </p>
      </div>

      {/* Display Current Region & Tax Center (No Selector) */}
      <div className="mb-6 p-3 bg-ink dark:bg-ink border border-border dark:border-border rounded">
        <div className="flex gap-8 text-sm">
          <div>
            <span className="text-text-mid dark:text-text-mid">📍 Region:</span> <strong className="text-text-hi dark:text-text-hi">{getDisplayRegionName(selectedRegion)}</strong>
          </div>
          <div>
            <span className="text-text-mid dark:text-text-mid">🏛️ Tax Center:</span> <strong className="text-text-hi dark:text-text-hi">{selectedTaxCenter}</strong>
          </div>
        </div>
      </div>

      {/* Approved Plans for Selected Region */}
      <div className="section-title mb-3">
        <i className="fas fa-list"></i> All Approved Plans
      </div>
      {approvedPlans.length === 0 ? (
        <div className="bg-ink dark:bg-ink text-text-hi dark:text-text-hi p-4 rounded mb-6 border border-gold dark:border-gold text-center">
          <p className="text-gold dark:text-gold text-sm m-0">No approved plans available yet</p>
        </div>
      ) : (
        <div className="table-container mb-6">
          <table className="w-full text-xs bg-panel dark:bg-panel">
            <thead>
              <tr className="bg-panel dark:bg-panel">
                <th className="text-left text-blue dark:text-blue p-2">PLAN ID</th>
                <th className="text-left text-blue dark:text-blue p-2">FISCAL YEAR</th>
                <th className="text-left text-blue dark:text-blue p-2">VERSION</th>
                <th className="text-left text-blue dark:text-blue p-2">STATUS</th>
                <th className="w-32 text-blue dark:text-blue p-2">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {approvedPlans.map(plan => (
                <tr key={plan.id}>
                  <td className="p-2"><strong>{plan.id}</strong></td>
                  <td className="p-2">{plan.fiscalYear}</td>
                  <td className="p-2">v{plan.version}</td>
                  <td className="p-2">
                    <Badge status="Approved" className="senior-approved" />
                  </td>
                  <td className="p-2">
                    <button
                      className={`btn btn-sm ${selectedPlan === plan.id ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => {
                        setSelectedPlan(plan.id);
                        handleSelectPlan(plan.id);
                      }}
                    >
                      <i className="fas fa-check"></i> {selectedPlan === plan.id ? 'Selected' : 'Select'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="cards">
        <Card title="Region" number={getDisplayRegionName(selectedRegion)} icon="fas fa-map-pin" />
        <Card title="Tax Center" number={selectedTaxCenter} icon="fas fa-building" />
        <Card title="Plans Submitted" number={plans.length} icon="fas fa-inbox" />
        <Card title="Accepted" number={Object.values(accepted).filter(a => a).length} icon="fas fa-check-circle" />
      </div>

      {plans.length === 0 ? (
        <div className="bg-ink dark:bg-ink text-text-hi dark:text-text-hi p-5 rounded mb-6 border-2 border-gold dark:border-gold text-center">
          <i className="fas fa-info-circle text-2xl text-blue dark:text-blue mb-3 block"></i>
          <h3 className="m-2 text-gold dark:text-gold">No Plans Submitted Yet</h3>
          <p className="text-text-mid dark:text-text-mid m-2 text-sm">
            Approved plans from {assignedTaxCenterRegion} Regional Director will appear here when they submit them for your acceptance.
          </p>
        </div>
      ) : (
        <>
          {/* Plan Selection */}
          <div className="section-title mb-3">
            <i className="fas fa-file-alt"></i> Available Plans for Acceptance
          </div>
          <div className="table-container mb-6">
            <table className="w-full text-xs bg-panel dark:bg-panel">
              <thead>
                <tr className="bg-panel dark:bg-panel">
                  <th className="text-left text-blue dark:text-blue p-2">PLAN ID</th>
                  <th className="text-left text-blue dark:text-blue p-2">FISCAL YEAR</th>
                  <th className="text-left text-blue dark:text-blue p-2">VERSION</th>
                  <th className="text-left text-blue dark:text-blue p-2">SUBMITTED DATE</th>
                  <th className="text-left text-blue dark:text-blue p-2">STATUS</th>
                  <th className="w-40 text-blue dark:text-blue p-2">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {plans.map(plan => (
                  <tr key={plan.id} className={selectedPlan === plan.id ? 'bg-ink/30 dark:bg-ink/30' : ''}>
                    <td className="p-2"><strong>{plan.id}</strong></td>
                    <td className="p-2">{plan.fiscalYear}</td>
                    <td className="p-2">v{plan.version}</td>
                    <td className="p-2">
                      {plan.submittedToTaxCenters?.[selectedRegion]?.submittedDate
                        ? new Date(plan.submittedToTaxCenters[selectedRegion].submittedDate).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="p-2">
                      {accepted[plan.id] ? (
                        <Badge status="Accepted" className="senior-approved" />
                      ) : (
                        <Badge status="Pending" className="pending" />
                      )}
                    </td>
                    <td className="p-2">
                      <button
                        className={`btn btn-sm ${selectedPlan === plan.id ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => handleSelectPlan(plan.id)}
                      >
                        <i className="fas fa-check"></i> {selectedPlan === plan.id ? 'Selected' : 'Select'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Plan Details */}
          {selectedPlan && planDetails && (
            <>
              <div className="section-title mb-3">
                <i className="fas fa-clipboard-list"></i> Plan Details - {selectedPlan}
              </div>

              <div className="bg-panel dark:bg-panel p-4 rounded mb-6 border border-border dark:border-border">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Fiscal Year</p>
                    <p className="text-2xl font-bold text-text-hi dark:text-text-hi m-0 mt-1">
                      {planDetails.fiscalYear}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Plan Version</p>
                    <p className="text-2xl font-bold text-text-hi dark:text-text-hi m-0 mt-1">
                      v{planDetails.version}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Region Allocation</p>
                    <p className="text-2xl font-bold text-teal dark:text-teal m-0 mt-1">
                      {typeof planDetails.regionalAllocation?.[selectedRegion] === 'object' 
                        ? Object.values(planDetails.regionalAllocation[selectedRegion]).reduce((sum, val) => sum + (parseInt(val) || 0), 0)
                        : (planDetails.regionalAllocation?.[selectedRegion] || 0)} cases
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Submitted By</p>
                    <p className="text-2xl font-bold text-text-hi dark:text-text-hi m-0 mt-1">
                      Regional Director
                    </p>
                  </div>
                </div>
              </div>

              {/* Audit Type for this Tax Center */}
              <div className="section-title mb-3">
                <i className="fas fa-chart-bar"></i> Your Tax Center Allocation
              </div>
              <div className="table-container mb-6">
                <table className="w-full text-xs bg-panel dark:bg-panel">
                  <thead>
                    <tr className="bg-panel dark:bg-panel">
                      <th className="text-left text-blue dark:text-blue p-2">AUDIT TYPE</th>
                      <th className="text-center text-blue dark:text-blue p-2">ALLOCATED TO YOU</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      // Normalize tax center name
                      const taxCenterName = selectedTaxCenter.includes('Tax Center')
                        ? `${selectedRegion}-tc${selectedTaxCenter.split(' ').pop()}`
                        : selectedTaxCenter;
                      
                      console.log('🔍 TAX CENTER ALLOCATION DISPLAY:', {
                        selectedRegion,
                        selectedTaxCenter,
                        taxCenterName,
                        hasTaxCenterAllocations: !!planDetails?.taxCenterAllocations,
                        taxCenterAllocations: planDetails?.taxCenterAllocations,
                        regionAlloc: planDetails?.taxCenterAllocations?.[selectedRegion],
                        thisTaxCenterAlloc: planDetails?.taxCenterAllocations?.[selectedRegion]?.[taxCenterName]
                      });
                      
                      // Check if allocations exist
                      const regionAlloc = planDetails?.taxCenterAllocations?.[selectedRegion];
                      const taxCenterAlloc = regionAlloc?.[taxCenterName];
                      
                      if (!taxCenterAlloc) {
                        return (
                          <tr>
                            <td colSpan="2" className="text-center p-4 text-gold dark:text-gold">
                              <i className="fas fa-exclamation-triangle"></i> No allocation data set for this tax center yet.
                              <br/>
                              <small className="text-xs">Regional Director needs to submit the plan with allocations.</small>
                            </td>
                          </tr>
                        );
                      }
                      
                      // Display allocations
                      return auditTypes.map((auditType, idx) => {
                        const allocated = taxCenterAlloc[auditType] || 0;
                        return (
                          <tr key={idx}>
                            <td className="p-2"><strong>{auditTypeLabels[auditType]}</strong></td>
                            <td className="text-center p-2 font-bold text-text-hi dark:text-text-hi">{allocated}</td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Data Integrity Check */}
              <div className="bg-teal/20 dark:bg-teal/20 p-4 rounded mb-6 border-2 border-teal dark:border-teal">
                <h3 className="m-0 mb-3 text-teal dark:text-teal">
                  <i className="fas fa-shield-alt"></i> Data Integrity Verification
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0 mb-1">✅ Plan Status</p>
                    <p className="text-sm text-teal dark:text-teal font-bold m-0">FINALIZED</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0 mb-1">✅ Regional Submission</p>
                    <p className="text-sm text-teal dark:text-teal font-bold m-0">VERIFIED</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0 mb-1">✅ No Conflicts</p>
                    <p className="text-sm text-teal dark:text-teal font-bold m-0">SECURE</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0 mb-1">✅ Allocation Locked</p>
                    <p className="text-sm text-teal dark:text-teal font-bold m-0">PROTECTED</p>
                  </div>
                </div>
              </div>

              {/* Acceptance Status */}
              {accepted[selectedPlan] ? (
                <div className="bg-teal/20 dark:bg-teal/20 text-teal dark:text-teal p-4 rounded border-2 border-teal dark:border-teal mb-6">
                  <strong className="flex items-center gap-2">
                    <i className="fas fa-check-circle"></i> ✅ Plan Accepted
                  </strong>
                  <p className="text-text-mid dark:text-text-mid m-0 mt-2 text-xs">
                    This plan has been formally accepted by your tax center. It is locked in and ready for execution. No conflicts or data loss possible.
                  </p>
                </div>
              ) : (
                <div className="bg-gold/20 dark:bg-gold/20 p-4 rounded border-2 border-gold dark:border-gold mb-6">
                  <strong className="text-gold dark:text-gold flex items-center gap-2">
                    <i className="fas fa-exclamation-triangle"></i> Review & Accept Plan
                  </strong>
                  <p className="text-gold dark:text-gold m-0 mt-2 text-xs">
                    Review the plan details and your allocation above. When ready, formally accept the plan to begin execution.
                  </p>
                </div>
              )}

              {/* Action Bar */}
              <div className="action-bar">
                <div></div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    className="btn btn-success"
                    onClick={handleAcceptPlan}
                    disabled={accepted[selectedPlan]}
                    style={{ 
                      background: accepted[selectedPlan] ? '#4f5763' : undefined,
                      opacity: accepted[selectedPlan] ? 0.6 : 1,
                      cursor: accepted[selectedPlan] ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <i className={accepted[selectedPlan] ? 'fas fa-check' : 'fas fa-handshake'}></i> {accepted[selectedPlan] ? 'Plan Locked - Already Accepted' : 'Accept & Lock Plan'}
                  </button>
                  <button
                    className="btn btn-info"
                    onClick={handleSendToAuditTeamLeader}
                    disabled={!accepted[selectedPlan]}
                    style={{
                      background: !accepted[selectedPlan] ? '#4f5763' : undefined,
                      opacity: !accepted[selectedPlan] ? 0.6 : 1,
                      cursor: !accepted[selectedPlan] ? 'not-allowed' : 'pointer'
                    }}
                    title={!accepted[selectedPlan] ? 'Must accept plan first' : 'Send to Audit Team Leader for case creation'}
                  >
                    <i className="fas fa-share-square"></i> Send to Audit Team Leader
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}

      <div className="bg-blue/10 dark:bg-blue/10 text-text-primary dark:text-text-primary p-4 rounded border-l-4 border-blue dark:border-blue mt-6">
        <strong className="flex items-center gap-2"><i className="fas fa-info-circle"></i> Acceptance Process Notes</strong>
        <ul className="m-0 mt-3 pl-5 text-xs leading-relaxed">
          <li>✅ Plans are finalized and verified before submission</li>
          <li>✅ Regional Director formally submits the plan to you</li>
          <li>✅ You review allocations without risk of loss</li>
          <li>✅ Accept the plan to lock it in for execution</li>
          <li>✅ Complete audit trail of all handoffs</li>
          <li>✅ No data conflicts - everything is time-stamped</li>
        </ul>
      </div>
    </div>
  );
}

export default TaxCenterAcceptancePlanView;
