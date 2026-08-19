import React, { useState, useEffect } from 'react';
import { getDisplayRegionName } from '../../utils/regionNormalizer';
import Card from '../Card';
import Badge from '../Badge';
import { useData } from '../../services/dataService';
import { useRegional } from '../../context/RegionalContext';
import { useAuth } from '../../context/AuthContext';
import { auditConfig } from '../../config/auditConfig';

/**
 * RegionalPlanSubmissionView - Regional Plan Submission Workflow
 * Regional Director submits finalized plans to tax centers for formal acceptance.
 * This represents the formal handoff from regional to tax center level.
 * 
 * @component
 * @returns {React.ReactElement} Plan submission interface
 */
function RegionalPlanSubmissionView() {
  const { assignedRegion } = useRegional();
  const { getUserInfo } = useAuth();
  const { data, updateData } = useData();
  const userInfo = getUserInfo();
  
  // Use authenticated user's assigned region - no selection dropdown
  const selectedRegion = userInfo?.orgContext?.assignedRegion || assignedRegion || 'Oromia';
  
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planDetails, setPlanDetails] = useState(null);
  const [submitted, setSubmitted] = useState({});
  const [loading, setLoading] = useState(true);
  const [allRegions, setAllRegions] = useState([]);
  const [approvedPlans, setApprovedPlans] = useState([]);
  const [selectedTaxCenters, setSelectedTaxCenters] = useState([]);

  useEffect(() => {
    // Load all regions
    // Using data from hook
    const regions = [...new Set(data.plans.flatMap(p => Object.keys(p.regionalAllocation || {})))];
    setAllRegions(regions.length > 0 ? regions : ['Oromia', 'SNNPR', 'Addis Ababa', 'Amhara', 'Tigray']);
    
    // DYNAMIC: Load ALL plans (no status filter - they might have different statuses)
    // Regional director can submit any plan with allocation for their region
    console.log('📊 Loading all plans (dynamic - will filter by region at runtime)');
    setApprovedPlans(data.plans);
  }, []);

  useEffect(() => {
    loadPlans();
  }, [selectedRegion]);

  const loadPlans = () => {
    // Using data from hook
    
    console.log('🔍 REGIONAL SUBMISSION VIEW - Starting load (DYNAMIC - RUNTIME ONLY)...');
    console.log('📍 Selected Region:', selectedRegion);
    console.log('📊 Total Plans in System:', data.plans.length);
    
    // DYNAMIC: Load ALL plans that have allocation for this region
    // NO status checks - status doesn't matter, what matters is:
    // 1. Does the plan have allocation for this region?
    // 2. Can the regional director submit it?
    const plansByRegion = data.plans.filter(p => {
      // Check if this region has allocation (either in regionalAllocation or allocations array)
      let hasRegionalAlloc = false;
      if (p.regionalAllocation && p.regionalAllocation[selectedRegion]) {
        hasRegionalAlloc = true;
      } else if (p.allocations) {
        hasRegionalAlloc = p.allocations.some(a => a.region === selectedRegion);
      }
      
      // ONLY show FINALIZED plans
      const isFinalized = p.status === 'FINALIZED';
      const canSubmit = hasRegionalAlloc && isFinalized;
      
      console.log(`Plan ${p.id}:`, {
        status: p.status,
        hasRegionalAlloc,
        regionalAllocation: !!p.regionalAllocation?.[selectedRegion],
        canSubmit: hasRegionalAlloc
      });
      
      return canSubmit;
    });

    console.log('✅ Plans with allocation for this region:', plansByRegion.length);

    setPlans(plansByRegion);
    
    // Initialize submitted status for all plans
    const submittedStatus = {};
    plansByRegion.forEach(plan => {
      submittedStatus[plan.id] = plan.submittedToTaxCenters?.[selectedRegion]?.status === 'SUBMITTED' || false;
    });
    setSubmitted(submittedStatus);
    
    setLoading(false);
  };

  const handleSelectPlan = (planId) => {
    // Using data from hook
    const plan = data.plans.find(p => p.id === planId);
    setSelectedPlan(planId);
    setPlanDetails(plan);
  };

  const handleSubmitPlanToTaxCenters = () => {
    if (!selectedPlan) {
      alert('Please select a plan first');
      return;
    }

    if (selectedTaxCenters.length === 0) {
      alert('❌ Please select at least one tax center to send the plan to');
      return;
    }

    if (!window.confirm(`Send ${selectedPlan} to ${selectedTaxCenters.length} selected tax center(s) in ${selectedRegion}?\n\nTax Centers: ${selectedTaxCenters.join(', ')}\n\nSelected tax centers will be notified that an approved plan is available for acceptance.`)) {
      return;
    }

    // Using data from hook
    const planIndex = data.plans.findIndex(p => p.id === selectedPlan);

    if (planIndex >= 0) {
      const plan = data.plans[planIndex];

      // Initialize submission tracking
      if (!plan.submittedToTaxCenters) {
        plan.submittedToTaxCenters = {};
      }

      // Calculate and store allocation for each tax center
      if (!plan.taxCenterAllocations) {
        plan.taxCenterAllocations = {};
      }
      if (!plan.taxCenterAllocations[selectedRegion]) {
        plan.taxCenterAllocations[selectedRegion] = {};
      }

      // Get regional allocation
      let regionalTotal = 0;
      if (plan.regionalAllocation && plan.regionalAllocation[selectedRegion]) {
        if (typeof plan.regionalAllocation[selectedRegion] === 'object') {
          regionalTotal = Object.values(plan.regionalAllocation[selectedRegion]).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
        } else {
          regionalTotal = parseInt(plan.regionalAllocation[selectedRegion]) || 0;
        }
      }

      console.log('📤 SUBMITTING TO TAX CENTERS:', {
        planId: selectedPlan,
        region: selectedRegion,
        selectedTaxCenters: selectedTaxCenters,
        regionalTotal: regionalTotal
      });

      // Distribute allocation evenly across selected tax centers
      const numTaxCenters = selectedTaxCenters.length;
      const allocationPerTaxCenter = Math.floor(regionalTotal / numTaxCenters);
      
      selectedTaxCenters.forEach((tc, index) => {
        // For the last tax center, add any remainder
        const allocation = index === numTaxCenters - 1 
          ? regionalTotal - (allocationPerTaxCenter * (numTaxCenters - 1))
          : allocationPerTaxCenter;
        
        // Distribute by audit type if available
        if (plan.regionalAllocation && plan.regionalAllocation[selectedRegion] && typeof plan.regionalAllocation[selectedRegion] === 'object') {
          const auditTypeAllocation = {};
          Object.keys(plan.regionalAllocation[selectedRegion]).forEach(auditType => {
            const typeTotal = parseInt(plan.regionalAllocation[selectedRegion][auditType]) || 0;
            const typePerTC = Math.floor(typeTotal / numTaxCenters);
            auditTypeAllocation[auditType] = index === numTaxCenters - 1
              ? typeTotal - (typePerTC * (numTaxCenters - 1))
              : typePerTC;
          });
          plan.taxCenterAllocations[selectedRegion][tc] = auditTypeAllocation;
        } else {
          plan.taxCenterAllocations[selectedRegion][tc] = allocation;
        }
      });

      // Mark as submitted for this region with specific tax centers
      plan.submittedToTaxCenters[selectedRegion] = {
        status: 'SUBMITTED',
        submittedBy: 'Regional Director',
        submittedDate: new Date().toISOString(),
        submittedTo: selectedTaxCenters,
        taxCentersInRegion: selectedTaxCenters,
        readyForAcceptance: true,
        allocationsSet: true
      };

      console.log('✅ PLAN SUBMISSION RECORD:', {
        submittedToTaxCenters: plan.submittedToTaxCenters[selectedRegion],
        taxCenterAllocations: plan.taxCenterAllocations[selectedRegion]
      });

      // Add approval history
      if (!plan.approvalHistory) plan.approvalHistory = [];
      plan.approvalHistory.push({
        action: 'SUBMITTED_TO_TAX_CENTERS',
        by: 'Regional Director',
        region: selectedRegion,
        date: new Date().toISOString(),
        notes: `Finalized plan officially submitted to ${selectedTaxCenters.length} tax centers in ${selectedRegion}: ${selectedTaxCenters.join(', ')}. Allocations distributed.`,
        taxCenters: selectedTaxCenters,
        version: plan.version
      });

      // CRITICAL: Save data immediately
      console.log('💾 SAVING DATA TO LOCALSTORAGE...');
      await updateData(data);
      console.log('✅ DATA SAVED SUCCESSFULLY');

      // Verify saved data - check the data we just set
      const verifyPlan = data.plans.find(p => p.id === selectedPlan);
      console.log('✔️ VERIFICATION - Data persisted:', {
        planId: selectedPlan,
        submittedToTaxCenters: verifyPlan?.submittedToTaxCenters?.[selectedRegion],
        taxCenterAllocations: verifyPlan?.taxCenterAllocations?.[selectedRegion]
      });

      setSubmitted(prev => ({ ...prev, [selectedPlan]: true }));
      
      alert(`✅ Plan ${selectedPlan} officially submitted to selected tax centers in ${selectedRegion}!\n\nTax Centers: ${selectedTaxCenters.join(', ')}\nAllocations distributed evenly.\n\nThey can now review and accept the plan.`);
      
      setSelectedTaxCenters([]); // Clear selection
      loadPlans();
    }
  };

  const getTaxCentersList = () => {
    // Get tax centers dynamically from audit config for this region
    const regionConfig = auditConfig.regions.find(r => r.name === selectedRegion);
    if (regionConfig && regionConfig.taxCenters) {
      return regionConfig.taxCenters;
    }
    
    // Fallback: generate tax center names
    return [
      `${selectedRegion}-tc1`,
      `${selectedRegion}-tc2`,
      `${selectedRegion}-tc3`
    ];
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
    return <div style={{ padding: '20px' }}>Loading finalized plans...</div>;
  }

  return (
    <div className="min-h-screen bg-ink dark:bg-ink p-8">
      <div className="flex items-center gap-3 pl-4 border-l-4 border-gold dark:border-gold mb-6">
        <h2 className="text-2xl font-bold"><i className="fas fa-share-alt"></i> Submit Approved Plan to Tax Centers</h2>
        <Badge status={`${plans.length} Plans Ready`} className="director-approved" />
      </div>

      <div className="bg-blue-50 dark:bg-blue-900 text-text-hi dark:text-text-hi p-4 rounded-lg mb-6 border border-blue dark:border-blue">
        <strong><i className="fas fa-info-circle"></i> Regional Director - Send Plan to Tax Centers</strong>
        <p className="text-text-mid dark:text-text-mid mt-2 mb-0 text-xs leading-relaxed">
          Select which tax centers in your region should receive this finalized plan. Tax centers will review and accept it for implementation.
        </p>
      </div>

      {/* Region Display (No Selector - From Login) */}
      <div className="mb-6 p-3 bg-panel dark:bg-panel border border-border dark:border-border rounded-lg">
        <div className="flex gap-8 text-sm items-center">
          <div>
            <span className="text-text-mid dark:text-text-mid font-medium">📍 Your Region:</span> <strong className="text-text-hi dark:text-text-hi text-base ml-2">{getDisplayRegionName(selectedRegion)}</strong>
          </div>
          <div className="text-text-mid dark:text-text-mid text-xs">
            (Region assigned from your login)
          </div>
        </div>
      </div>

      {/* Approved Plans for this Region */}
      <div className="section-title mb-3">
        <i className="fas fa-check-circle"></i> Approved Plans for {getDisplayRegionName(selectedRegion)}
      </div>
      {approvedPlans.length === 0 ? (
        <div className="bg-ink dark:bg-ink text-text-hi dark:text-text-hi p-4 rounded-lg mb-6 border border-gold dark:border-gold text-center">
          <p className="text-gold dark:text-gold text-xs m-0">No approved plans available yet</p>
        </div>
      ) : (
        <div className="table-container mb-6 w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-panel dark:bg-panel border-b border-border dark:border-border">
                <th className="text-left p-3 text-text-mid dark:text-text-mid">PLAN ID</th>
                <th className="text-left p-3 text-text-mid dark:text-text-mid">FISCAL YEAR</th>
                <th className="text-left p-3 text-text-mid dark:text-text-mid">VERSION</th>
                <th className="text-left p-3 text-text-mid dark:text-text-mid">STATUS</th>
                <th className="text-left p-3 text-text-mid dark:text-text-mid w-32">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {approvedPlans.map(plan => (
                <tr key={plan.id} className="border-b border-border dark:border-border hover:bg-panel dark:hover:bg-panel">
                  <td className="p-3"><strong className="text-text-hi dark:text-text-hi">{plan.id}</strong></td>
                  <td className="p-3 text-text-mid dark:text-text-mid">{plan.fiscalYear}</td>
                  <td className="p-3 text-text-mid dark:text-text-mid">v{plan.version}</td>
                  <td className="p-3">
                    <Badge status="Approved" className="senior-approved" />
                  </td>
                  <td className="p-3">
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
        <Card title="Finalized Plans" number={plans.length} icon="fas fa-flag-checkered" />
        <Card title="Tax Centers" number={getTaxCentersList().length} icon="fas fa-building" />
        <Card title="Status" number={selectedPlan ? 'Selected' : 'Select Plan'} icon="fas fa-check-circle" />
      </div>

      {plans.length === 0 ? (
        <div className="bg-ink dark:bg-ink text-text-hi dark:text-text-hi p-5 rounded-lg border-2 border-gold dark:border-gold text-center mb-6">
          <i className="fas fa-info-circle text-2xl text-blue dark:text-blue mb-3 block"></i>
          <h3 className="m-2 text-gold dark:text-gold">No Finalized Plans for Your Region</h3>
          <p className="text-gold dark:text-gold m-2 text-xs">
            Finalized plans for {getDisplayRegionName(selectedRegion)} will appear here when the Director finalizes them. You can then select which tax centers should receive each plan.
          </p>
        </div>
      ) : (
        <>
          {/* Plan Selection */}
          <div className="section-title mb-3">
            <i className="fas fa-file-alt"></i> Select Plan to Submit
          </div>
          <div className="table-container mb-6 w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-panel dark:bg-panel border-b border-border dark:border-border">
                  <th className="text-left p-3 text-text-mid dark:text-text-mid">PLAN ID</th>
                  <th className="text-left p-3 text-text-mid dark:text-text-mid">FISCAL YEAR</th>
                  <th className="text-left p-3 text-text-mid dark:text-text-mid">VERSION</th>
                  <th className="text-left p-3 text-text-mid dark:text-text-mid">TOTAL CASES</th>
                  <th className="text-left p-3 text-text-mid dark:text-text-mid">STATUS</th>
                  <th className="text-left p-3 text-text-mid dark:text-text-mid w-40">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {plans.map(plan => (
                  <tr key={plan.id} className="border-b border-border dark:border-border hover:bg-panel dark:hover:bg-panel" style={{ background: selectedPlan === plan.id ? 'rgba(15, 20, 25, 0.5)' : '' }}>
                    <td className="p-3"><strong className="text-text-hi dark:text-text-hi">{plan.id}</strong></td>
                    <td className="p-3 text-text-mid dark:text-text-mid">{plan.fiscalYear}</td>
                    <td className="p-3 text-text-mid dark:text-text-mid">{plan.version}</td>
                    <td className="p-3 text-text-mid dark:text-text-mid">{plan.totalCases || 0}</td>
                    <td className="p-3">
                      {submitted[plan.id] ? (
                        <Badge status="Submitted" className="senior-approved" />
                      ) : (
                        <Badge status="Ready" className="pending" />
                      )}
                    </td>
                    <td className="p-3">
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

              <div className="bg-panel dark:bg-panel p-4 rounded-lg mb-6 border border-border dark:border-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Fiscal Year</p>
                    <p className="text-lg font-bold text-text-hi dark:text-text-hi mt-1">
                      {planDetails.fiscalYear}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Total Cases</p>
                    <p className="text-lg font-bold text-text-hi dark:text-text-hi mt-1">
                      {planDetails.totalCases || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Region Allocation</p>
                    <p className="text-lg font-bold text-teal dark:text-teal mt-1">
                      {typeof planDetails.regionalAllocation?.[selectedRegion] === 'object' 
                        ? Object.values(planDetails.regionalAllocation[selectedRegion]).reduce((sum, val) => sum + (parseInt(val) || 0), 0)
                        : (planDetails.regionalAllocation?.[selectedRegion] || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Plan Version</p>
                    <p className="text-lg font-bold text-text-hi dark:text-text-hi mt-1">
                      v{planDetails.version}
                    </p>
                  </div>
                </div>
              </div>

              {/* Audit Type Allocation */}
              <div className="section-title mb-3">
                <i className="fas fa-chart-bar"></i> Audit Type Allocation for {selectedRegion}
              </div>
              <div className="table-container mb-6 w-full overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-panel dark:bg-panel border-b border-border dark:border-border">
                      <th className="text-left p-3 text-text-mid dark:text-text-mid">AUDIT TYPE</th>
                      <th className="text-center p-3 text-text-mid dark:text-text-mid">ALLOCATED CASES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditTypes.map((auditType, idx) => {
                      const allocated = planDetails.auditTypeAllocation?.[auditType] || 0;
                      return (
                        <tr key={idx} className="border-b border-border dark:border-border">
                          <td className="p-3"><strong className="text-text-hi dark:text-text-hi">{auditTypeLabels[auditType]}</strong></td>
                          <td className="text-center p-3 font-bold text-text-hi dark:text-text-hi">{allocated}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Tax Centers List - SELECT WHICH TO SEND TO */}
              <div className="section-title mb-3">
                <i className="fas fa-building"></i> Select Tax Centers to Send Plan To
              </div>
              <div className="bg-gold/10 dark:bg-gold/10 p-3 rounded-lg mb-4 border border-gold dark:border-gold">
                <p className="text-gold dark:text-gold text-xs m-0">
                  <i className="fas fa-info-circle"></i> Select which tax centers should receive this plan. Only selected tax centers will be able to accept it.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {getTaxCentersList().map(taxCenter => {
                  const isSelected = selectedTaxCenters.includes(taxCenter);
                  const isAlreadySent = planDetails?.submittedToTaxCenters?.[selectedRegion]?.taxCentersInRegion?.includes(taxCenter);
                  
                  return (
                    <div
                      key={taxCenter}
                      onClick={() => {
                        if (submitted[selectedPlan]) return; // Can't change after submission
                        if (isSelected) {
                          setSelectedTaxCenters(selectedTaxCenters.filter(tc => tc !== taxCenter));
                        } else {
                          setSelectedTaxCenters([...selectedTaxCenters, taxCenter]);
                        }
                      }}
                      className={`p-4 rounded-lg border-2 text-center cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-teal/20 dark:bg-teal/20 border-teal dark:border-teal' 
                          : 'bg-panel dark:bg-panel border-border dark:border-border hover:border-teal dark:hover:border-teal'
                      } ${submitted[selectedPlan] ? 'opacity-50 cursor-not-allowed' : ''}`}
                      style={{ cursor: submitted[selectedPlan] ? 'not-allowed' : 'pointer' }}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <i className={`fas fa-building text-3xl ${isSelected ? 'text-teal dark:text-teal' : 'text-text-mid dark:text-text-mid'}`}></i>
                        {isSelected && (
                          <i className="fas fa-check-circle text-2xl text-teal dark:text-teal ml-2"></i>
                        )}
                      </div>
                      <h4 className={`m-2 ${isSelected ? 'text-teal dark:text-teal font-bold' : 'text-text-hi dark:text-text-hi'}`}>
                        {taxCenter}
                      </h4>
                      <p className="text-text-mid dark:text-text-mid m-1 text-xs">
                        {isSelected ? '✓ Selected' : 'Click to select'}
                      </p>
                      {isAlreadySent && (
                        <p className="text-teal dark:text-teal m-1 text-xs font-bold">
                          <i className="fas fa-paper-plane"></i> Already sent
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {selectedTaxCenters.length > 0 && !submitted[selectedPlan] && (
                <div className="bg-teal/10 dark:bg-teal/10 p-3 rounded-lg mb-4 border border-teal dark:border-teal">
                  <p className="text-teal dark:text-teal text-sm m-0 font-bold">
                    <i className="fas fa-check-circle"></i> {selectedTaxCenters.length} Tax Center(s) Selected: {selectedTaxCenters.join(', ')}
                  </p>
                </div>
              )}

              {/* Submission Status */}
              {submitted[selectedPlan] ? (
                <div className="bg-green-50 dark:bg-green-900 text-teal dark:text-teal p-4 rounded-lg border-2 border-teal dark:border-teal mb-6">
                  <strong className="text-teal dark:text-teal">
                    <i className="fas fa-check-circle"></i> ✅ Already Submitted
                  </strong>
                  <p className="text-teal dark:text-teal mt-2 mb-0 text-xs">
                    This plan has been officially submitted to selected tax centers. They can now review and accept it.
                  </p>
                  {planDetails?.submittedToTaxCenters?.[selectedRegion]?.taxCentersInRegion && (
                    <p className="text-teal dark:text-teal mt-2 mb-0 text-xs font-bold">
                      Sent to: {planDetails.submittedToTaxCenters[selectedRegion].taxCentersInRegion.join(', ')}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-ink dark:bg-ink p-4 rounded-lg border-2 border-gold dark:border-gold mb-6">
                  <strong className="text-gold dark:text-gold">
                    <i className="fas fa-exclamation-triangle"></i> Ready to Submit
                  </strong>
                  <p className="text-gold dark:text-gold mt-2 mb-0 text-xs">
                    Select tax centers above, then click Submit to send the plan to them for formal acceptance.
                  </p>
                </div>
              )}

              {/* Action Bar */}
              <div className="action-bar">
                <div></div>
                {!submitted[selectedPlan] ? (
                  <button
                    className="btn btn-success"
                    onClick={handleSubmitPlanToTaxCenters}
                    disabled={selectedTaxCenters.length === 0}
                    style={{ 
                      background: selectedTaxCenters.length === 0 ? '#4f5763' : '#4caf50',
                      opacity: selectedTaxCenters.length === 0 ? 0.6 : 1,
                      cursor: selectedTaxCenters.length === 0 ? 'not-allowed' : 'pointer'
                    }}
                    title={selectedTaxCenters.length === 0 ? 'Select at least one tax center first' : `Submit to ${selectedTaxCenters.length} tax center(s)`}
                  >
                    <i className="fas fa-share-alt"></i> Submit to {selectedTaxCenters.length || 'Selected'} Tax Center{selectedTaxCenters.length !== 1 ? 's' : ''}
                  </button>
                ) : (
                  <button
                    className="btn btn-success"
                    disabled
                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                  >
                    <i className="fas fa-check"></i> Already Submitted
                  </button>
                )}
              </div>
            </>
          )}
        </>
      )}

      <div className="bg-blue-50 dark:bg-blue-900 text-text-hi dark:text-text-hi p-4 rounded-lg border border-blue dark:border-blue mt-6">
        <strong><i className="fas fa-info-circle"></i> Workflow Notes</strong>
        <ul className="m-3 ml-5 text-xs leading-relaxed list-decimal">
          <li>Plans must be FINALIZED by Director first</li>
          <li>This page shows all finalized plans for your region</li>
          <li>Select which tax centers should receive the plan</li>
          <li>Selected tax centers will see the plan in their "Accept Approved Plan" page</li>
          <li>Each tax center must formally accept the plan</li>
          <li>Once a tax center accepts, the Cascade Team can create audit cases</li>
          <li>Each submission is tracked with timestamp for audit trail</li>
        </ul>
      </div>
    </div>
  );
}

export default RegionalPlanSubmissionView;
