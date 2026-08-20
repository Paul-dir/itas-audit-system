import React, { useState, useEffect } from 'react';
import Card from '../Card';
import Badge from '../Badge';
import { useData } from '../../services/dataService';
import { useRegional } from '../../context/RegionalContext';

/**
 * TaxCenterView - Shows allocation sent by regional director
 * Tax centers provide feedback on their capacity to deliver with Tailwind dark mode support
 */
function TaxCenterView({ currentView }) {
  const { assignedTaxCenter, assignedTaxCenterRegion } = useRegional();
  const { data, updateData } = useData();
  
  const [plan, setPlan] = useState(null);
  const [allPlans, setAllPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [allocation, setAllocation] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [componentLoading, setComponentLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [viewMode, setViewMode] = useState('allocations');

  const loadAllocationData = () => {
    if (!data) return;
    
    if (!data?.plans || data.plans.length === 0) {
      setComponentLoading(false);
      return;
    }

    let taxCenterName = assignedTaxCenter;
    let taxCenterRegion = assignedTaxCenterRegion;

    console.log('TaxCenterView loadAllocationData:', {
      assignedTaxCenter,
      assignedTaxCenterRegion,
      taxCenterName,
      taxCenterRegion
    });

    if (!taxCenterName || !taxCenterRegion) {
      console.warn('Missing tax center assignment:', { taxCenterName, taxCenterRegion });
      setComponentLoading(false);
      return;
    }

    if (taxCenterName.includes('Tax Center')) {
      const parts = taxCenterName.split(' ');
      const tcNum = parts[parts.length - 1];
      taxCenterName = `${taxCenterRegion}-tc${tcNum}`;
    }

    const plansWithAllocations = data.plans.filter(p =>
      p.taxCenterAllocations &&
      p.taxCenterAllocations[taxCenterRegion] &&
      p.taxCenterAllocations[taxCenterRegion][taxCenterName]
    );

    console.log('Found', plansWithAllocations.length, 'plans with allocations for this tax center');
    setAllPlans(plansWithAllocations);

    let planToLoad = null;

    if (selectedPlanId) {
      planToLoad = plansWithAllocations.find(p => p.id === selectedPlanId);
      console.log('Loading user-selected plan:', selectedPlanId);
    } else if (plansWithAllocations.length > 0) {
      planToLoad = plansWithAllocations[0];
      setSelectedPlanId(planToLoad.id);
      console.log('Auto-selecting first plan:', planToLoad.id);
    }

    if (planToLoad) {
      setPlan(planToLoad);
      
      const regionAllocations = planToLoad.taxCenterAllocations[taxCenterRegion];
      const taxCenterAllocation = regionAllocations[taxCenterName];
      
      if (taxCenterAllocation) {
        setAllocation(taxCenterAllocation);
        
        const initialFeedback = {};
        Object.keys(taxCenterAllocation).forEach(auditType => {
          initialFeedback[auditType] = {
            allocated: taxCenterAllocation[auditType],
            canDeliver: taxCenterAllocation[auditType],
            notes: ''
          };
        });
        setFeedback(initialFeedback);

        if (planToLoad.taxCenterFeedback && 
            planToLoad.taxCenterFeedback[taxCenterRegion] &&
            planToLoad.taxCenterFeedback[taxCenterRegion][taxCenterName]) {
          setSubmitted(true);
          setFeedback(planToLoad.taxCenterFeedback[taxCenterRegion][taxCenterName]);
        } else {
          setSubmitted(false);
        }
      }
    }

    setComponentLoading(false);
  };

  useEffect(() => {
    if (data) {
      loadAllocationData();
    }
  }, [data, assignedTaxCenter, assignedTaxCenterRegion, selectedPlanId]);

  const handleFeedbackChange = (auditType, field, value) => {
    setFeedback(prev => ({
      ...prev,
      [auditType]: {
        ...prev[auditType],
        [field]: field === 'canDeliver' ? parseInt(value) || 0 : value
      }
    }));
  };

  const handleSubmitFeedback = () => {
    // Check if user confirmed submission
    if (!window.confirm('Submit feedback to regional director?\n\nThis action cannot be undone.')) {
      return;
    }

    let taxCenterName = assignedTaxCenter;
    let taxCenterRegion = assignedTaxCenterRegion;

    if (!taxCenterName || !taxCenterRegion) {
      alert('❌ Error: Tax center assignment not set properly.');
      return;
    }

    if (taxCenterName.includes('Tax Center')) {
      const parts = taxCenterName.split(' ');
      const tcNum = parts[parts.length - 1];
      taxCenterName = `${taxCenterRegion}-tc${tcNum}`;
    }

    const updatedData = { ...data };
    const planIndex = updatedData.plans.findIndex(p => p.id === plan.id);

    if (planIndex < 0) {
      alert('❌ Error: Plan not found.');
      return;
    }

    // Check if feedback already submitted for this tax center and region
    const existingFeedback = updatedData.plans[planIndex].taxCenterFeedback?.[taxCenterRegion]?.[taxCenterName];
    
    if (existingFeedback && existingFeedback.status === 'submitted') {
      alert('⚠️ Feedback already submitted!\n\n' +
        `This tax center has already submitted feedback for this plan.\n\n` +
        `Submitted on: ${new Date(existingFeedback.submittedAt).toLocaleString()}`);
      setSubmitted(true);
      return;
    }

    // Initialize structures if needed
    if (!updatedData.plans[planIndex].taxCenterFeedback) {
      updatedData.plans[planIndex].taxCenterFeedback = {};
    }
    if (!updatedData.plans[planIndex].taxCenterFeedback[taxCenterRegion]) {
      updatedData.plans[planIndex].taxCenterFeedback[taxCenterRegion] = {};
    }

    // Create feedback record with audit trail
    const feedbackRecord = {
      ...feedback,
      submittedAt: new Date().toISOString(),
      submittedBy: taxCenterName,
      status: 'submitted'
    };

    // Save feedback to plan
    updatedData.plans[planIndex].taxCenterFeedback[taxCenterRegion][taxCenterName] = feedbackRecord;

    // Update state
    updateData(updatedData);
    setSubmitted(true);
    
    console.log('✅ Tax Center Feedback Submitted:', {
      planId: plan.id,
      taxCenter: taxCenterName,
      region: taxCenterRegion,
      submittedAt: feedbackRecord.submittedAt,
      feedback: feedback
    });
    
    alert('✅ Feedback submitted to ' + taxCenterRegion + ' Regional Director!');
  };

  const handleAcknowledgeFinalized = () => {
    if (!window.confirm('Acknowledge receipt of finalized plan for implementation?\n\nThis confirms that your tax center is ready to execute the plan.')) {
      return;
    }

    let taxCenterName = assignedTaxCenter;
    let taxCenterRegion = assignedTaxCenterRegion;

    if (taxCenterName.includes('Tax Center')) {
      const parts = taxCenterName.split(' ');
      const tcNum = parts[parts.length - 1];
      taxCenterName = `${taxCenterRegion}-tc${tcNum}`;
    }

    const updatedData = { ...data };
    const planIndex = updatedData.plans.findIndex(p => p.id === plan.id);

    if (planIndex >= 0) {
      if (!updatedData.plans[planIndex].taxCenterAcknowledgment) {
        updatedData.plans[planIndex].taxCenterAcknowledgment = {};
      }
      if (!updatedData.plans[planIndex].taxCenterAcknowledgment[taxCenterRegion]) {
        updatedData.plans[planIndex].taxCenterAcknowledgment[taxCenterRegion] = {};
      }

      updatedData.plans[planIndex].taxCenterAcknowledgment[taxCenterRegion][taxCenterName] = {
        status: 'ACKNOWLEDGED',
        taxCenter: taxCenterName,
        region: taxCenterRegion,
        acknowledgedDate: new Date().toISOString(),
        acknowledgedBy: 'Tax Center Manager',
        readyForExecution: true
      };

      updateData(updatedData);
      alert(`✅ ${taxCenterName} acknowledged receipt of finalized plan. Ready for implementation!`);
      setSelectedPlanId(null);
    }
  };

  if (componentLoading) {
    return <div className="p-5">Loading allocation data...</div>;
  }

  if (!assignedTaxCenter || !assignedTaxCenterRegion) {
    return (
      <div className="p-6">
        <div className="detail-header">
          <h2>No Tax Center Assignment</h2>
        </div>
        <p className="text-text-primary dark:text-text-primary">You have not been assigned to a tax center yet.</p>
        <p className="text-xs text-text-mid dark:text-text-mid">
          Allocations from regional directors will appear here once you are assigned to a tax center.
        </p>
      </div>
    );
  }

  if (!plan || !allocation) {
    return (
      <div className="p-6">
        <div className="detail-header">
          <h2>No Allocation Available</h2>
        </div>
        <p className="text-text-primary dark:text-text-primary">No allocation has been sent to {assignedTaxCenter} yet.</p>
        <p className="text-xs text-text-mid dark:text-text-mid">
          Waiting for {assignedTaxCenterRegion} regional director to send allocations.
        </p>
      </div>
    );
  }

  const auditTypes = ['desk_audit', 'field_audit', 'joint_audit', 'transfer_pricing', 'comprehensive', 'issue_audit'];
  const auditTypeLabels = {
    desk_audit: 'Desk Audit',
    field_audit: 'Field Audit',
    joint_audit: 'Joint Audit',
    transfer_pricing: 'Transfer Pricing',
    comprehensive: 'Comprehensive',
    issue_audit: 'Issue Audit'
  };

  const getTotalAllocated = () => {
    return Object.values(allocation).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
  };

  const getTotalFeedback = () => {
    return Object.values(feedback).reduce((sum, item) => sum + (parseInt(item.canDeliver) || 0), 0);
  };

  const isFinalized = plan?.status === 'FINALIZED' && plan?.sentToTaxCenters?.[assignedTaxCenterRegion];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="detail-header">
        <h2 className="flex items-center gap-2"><i className="fas fa-building"></i> {assignedTaxCenter}</h2>
        <Badge status={submitted ? 'Feedback Submitted' : 'Awaiting Response'} 
               className={submitted ? 'director-approved' : 'pending'} />
      </div>

      {/* Finalized Plan Notification */}
      {isFinalized && (
        <div className="bg-teal/10 dark:bg-teal/10 text-teal dark:text-teal p-4 rounded mb-6 border-2 border-teal dark:border-teal">
          <strong className="flex items-center gap-2"><i className="fas fa-flag-checkered"></i> Finalized Plan Received</strong>
          <p className="text-teal dark:text-teal mt-2 text-xs leading-relaxed">
            <i className="fas fa-check"></i> Your {assignedTaxCenterRegion} Regional Director has approved and deployed the finalized {plan.name || 'Annual Audit Plan'} for your tax center to execute.
          </p>
        </div>
      )}

      {/* Plan Selector */}
      {allPlans && allPlans.length > 1 && (
        <div className="bg-ink dark:bg-ink text-text-hi dark:text-text-hi p-4 rounded mb-6 border-l-4 border-blue dark:border-blue shadow-md flex gap-4 items-center flex-wrap">
          <label className="text-sm font-bold text-blue dark:text-blue whitespace-nowrap">
            <i className="fas fa-file-alt"></i> CHOOSE PLAN:
          </label>
          <select
            value={selectedPlanId || ''}
            onChange={(e) => {
              const newPlanId = e.target.value;
              console.log('Tax center plan selector changed from', selectedPlanId, 'to', newPlanId);
              setSelectedPlanId(newPlanId);
            }}
            className="mt-0 px-4 py-3 rounded border-2 border-blue dark:border-blue font-bold cursor-pointer bg-ink dark:bg-ink w-60 text-text-mid dark:text-text-mid"
          >
            <option value="">-- Select a plan --</option>
            {allPlans.map(planOption => {
              const isSubmitted = planOption.taxCenterFeedback?.[assignedTaxCenterRegion]?.[assignedTaxCenter];
              return (
                <option key={planOption.id} value={planOption.id}>
                  {planOption.id} (FY {planOption.fiscalYear}) {isSubmitted ? '✓ Submitted' : ''}
                </option>
              );
            })}
          </select>
        </div>
      )}

      {/* Allocation Received */}
      <div className="bg-blue/10 dark:bg-blue/10 text-text-primary dark:text-text-primary p-4 rounded mb-6 border border-blue dark:border-blue">
        <strong className="flex items-center gap-2"><i className="fas fa-inbox"></i> Allocation Received</strong>
        <p className="text-text-mid dark:text-text-mid mt-2 text-xs leading-relaxed">
          You have received an allocation from {assignedTaxCenterRegion} Regional Director for {plan.name || 'Annual Audit Plan'}.
          Total cases: <strong>{getTotalAllocated()}</strong>
        </p>
      </div>

      {/* Plan & Allocation Info */}
      <div className="cards">
        <Card title="Plan ID" number={plan.id} icon="fas fa-id-badge" />
        <Card title="Plan Version" number={plan.version} icon="fas fa-code-branch" />
        <Card title="Total Allocated" number={getTotalAllocated()} icon="fas fa-tasks" />
        <Card title="Region" number={assignedTaxCenterRegion} icon="fas fa-map-pin" />
      </div>

      {/* Allocation Breakdown */}
      <div className="section-title mt-6 mb-3">
        <i className="fas fa-chart-bar"></i> Your Allocation by Audit Type
      </div>
      <div className="table-container mb-6">
        <table className="w-full">
          <thead>
            <tr className="bg-ink dark:bg-ink">
              <th className="text-left text-blue dark:text-blue p-2">AUDIT TYPE</th>
              <th className="text-center text-blue dark:text-blue p-2">ALLOCATED</th>
              <th className="text-center text-blue dark:text-blue p-2">% OF TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {auditTypes.map((auditType, idx) => {
              const allocated = allocation[auditType] || 0;
              const total = getTotalAllocated();
              const percentage = total > 0 ? ((allocated / total) * 100).toFixed(1) : 0;
              return (
                <tr key={idx}>
                  <td className="p-2"><strong>{auditTypeLabels[auditType]}</strong></td>
                  <td className="text-center p-2">{allocated}</td>
                  <td className="text-center p-2">{percentage}%</td>
                </tr>
              );
            })}
            <tr className="bg-ink dark:bg-ink font-bold">
              <td className="p-2">TOTAL</td>
              <td className="text-center p-2">{getTotalAllocated()}</td>
              <td className="text-center p-2">100%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Feedback Section */}
      <div className="bg-ink dark:bg-ink text-text-hi dark:text-text-hi p-4 rounded mb-6 border-l-4 border-gold dark:border-gold">
        <strong className="flex items-center gap-2"><i className="fas fa-comments"></i> Your Response</strong>
        <p className="text-text-mid dark:text-text-mid mt-2 text-xs leading-relaxed">
          Review the allocated cases and let us know if you can deliver them or propose alternatives.
          You can adjust the numbers if your capacity is different.
        </p>
      </div>

      {/* Feedback Table */}
      <div className="section-title mb-3">
        <i className="fas fa-edit"></i> Capacity Feedback
      </div>
      <div className="table-container mb-6">
        <table className="w-full">
          <thead>
            <tr className="bg-ink dark:bg-ink">
              <th className="text-left text-blue dark:text-blue p-2">AUDIT TYPE</th>
              <th className="text-center text-blue dark:text-blue p-2">ALLOCATED</th>
              <th className="text-center text-blue dark:text-blue p-2">CAN DELIVER</th>
              <th className="text-left text-blue dark:text-blue p-2">NOTES</th>
            </tr>
          </thead>
          <tbody>
            {auditTypes.map((auditType, idx) => (
              <tr key={idx}>
                <td className="p-2"><strong>{auditTypeLabels[auditType]}</strong></td>
                <td className="text-center font-bold p-2">
                  {allocation[auditType] || 0}
                </td>
                <td className="text-center p-2">
                  <input
                    type="number"
                    value={feedback[auditType]?.canDeliver || 0}
                    onChange={(e) => handleFeedbackChange(auditType, 'canDeliver', e.target.value)}
                    disabled={submitted}
                    className="w-16 px-2 py-1 border border-border dark:border-border rounded text-center text-sm bg-panel dark:bg-panel text-text-hi dark:text-text-hi disabled:opacity-50"
                    min="0"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={feedback[auditType]?.notes || ''}
                    onChange={(e) => handleFeedbackChange(auditType, 'notes', e.target.value)}
                    disabled={submitted}
                    placeholder="e.g., We can do 10 instead of 15"
                    className="w-full px-2 py-1 border border-border dark:border-border rounded text-xs bg-panel dark:bg-panel text-text-hi dark:text-text-hi disabled:opacity-50"
                  />
                </td>
              </tr>
            ))}
            <tr className="bg-ink dark:bg-ink font-bold">
              <td className="p-2">TOTAL</td>
              <td className="text-center p-2">{getTotalAllocated()}</td>
              <td className="text-center p-2">
                {getTotalFeedback()}
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Variance */}
      <div className="bg-ink dark:bg-ink p-4 rounded mb-6 border border-border dark:border-border">
        <h3 className="flex items-center gap-2"><i className="fas fa-balance-scale"></i> Capacity Analysis</h3>
        <div className="grid grid-cols-3 gap-4 mt-3">
          <div>
            <p className="text-xs text-text-mid dark:text-text-mid m-0">Total Allocated</p>
            <p className="text-2xl font-bold text-blue dark:text-blue m-0 mt-1">
              {getTotalAllocated()}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-mid dark:text-text-mid m-0">You Can Deliver</p>
            <p className="text-2xl font-bold text-blue dark:text-blue m-0 mt-1">
              {getTotalFeedback()}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-mid dark:text-text-mid m-0">Variance</p>
            <p className={`text-2xl font-bold m-0 mt-1 ${
              getTotalFeedback() === getTotalAllocated() ? 'text-teal dark:text-teal' : 'text-danger dark:text-danger'
            }`}>
              {getTotalFeedback() - getTotalAllocated()}
            </p>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {submitted ? (
        <div className="bg-teal/10 dark:bg-teal/10 text-teal dark:text-teal p-4 rounded mt-6 border-2 border-teal dark:border-teal text-center">
          <strong className="flex items-center justify-center gap-2">
            <i className="fas fa-check-circle"></i> ✅ Feedback Submitted
          </strong>
          <p className="text-teal dark:text-teal mt-2 text-xs">
            Your feedback has been sent to {assignedTaxCenterRegion} Regional Director.
          </p>
        </div>
      ) : (
        <div className="bg-gold/10 dark:bg-gold/10 p-4 rounded mt-6 border-2 border-gold dark:border-gold text-center">
          <strong className="flex items-center justify-center gap-2 text-gold dark:text-gold">
            <i className="fas fa-exclamation-triangle"></i> Please review your capacity and submit feedback
          </strong>
        </div>
      )}

      {/* Action Bar */}
      <div className="action-bar mt-6 flex gap-3 justify-end">
        {isFinalized && (
          <button 
            className="btn btn-success bg-teal dark:bg-teal"
            onClick={handleAcknowledgeFinalized}
          >
            <i className="fas fa-check-double"></i> Acknowledge Finalized Plan
          </button>
        )}
        {!submitted ? (
          <button 
            className="btn btn-success"
            onClick={handleSubmitFeedback}
          >
            <i className="fas fa-paper-plane"></i> Submit Feedback to Regional Director
          </button>
        ) : (
          <button 
            className="btn btn-success opacity-50 cursor-not-allowed"
            disabled
          >
            <i className="fas fa-check"></i> Feedback Already Submitted
          </button>
        )}
      </div>
    </div>
  );
}

export default TaxCenterView;
