import React, { useState, useEffect } from 'react';
import Card from '../Card';
import Badge from '../Badge';
import { useData } from '../../services/dataService';
import { useRegional } from '../../context/RegionalContext';
import { getDisplayRegionName } from '../../utils/regionNormalizer';

/**
 * RegionalPlanReviewView - Plan Review Interface (Simplified)
 * Only shows plan review, no allocation workflow here.
 * Displays plans sent from director for feedback and regional allocation details.
 * 
 * @component
 * @returns {React.ReactElement} Plan review interface
 */
function RegionalPlanReviewView({ currentView }) {
  const { assignedRegion, selectedRegion: contextSelectedRegion } = useRegional();
  const { data, updateData } = useData();
  
  // Use selected region if available, otherwise assigned region
  const selectedRegion = contextSelectedRegion || assignedRegion;
  
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [regionAllocation, setRegionAllocation] = useState(null);

  useEffect(() => {
    loadPlans();
  }, [selectedRegion]);

  const loadPlans = () => {
    // Using data from hook
    
    if (!data?.plans || data.plans.length === 0) {
      setPlans([]);
      setSelectedPlan(null);
      setRegionAllocation(null);
      return;
    }

    // Get all plans sent from director for feedback
    const sentPlans = data.plans.filter(p => 
      p.status === 'AWAITING_REGIONAL_FEEDBACK' || p.status === 'FEEDBACK_COLLECTED'
    );

    setPlans(sentPlans);

    // Auto-select first plan
    if (sentPlans.length > 0) {
      selectPlan(data, sentPlans[0]);
    }
  };

  const selectPlan = (data, plan) => {
    if (!plan || !selectedRegion) {
      setSelectedPlan(null);
      setRegionAllocation(null);
      return;
    }

    setSelectedPlan(plan);

    // Get regional allocation breakdown
    let regionAlloc = null;
    if (plan.regionalAllocation && plan.regionalAllocation[selectedRegion]) {
      const breakdown = plan.regionalAllocation[selectedRegion];
      const totalCases = Object.values(breakdown).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
      regionAlloc = {
        name: selectedRegion,
        totalCases,
        breakdown
      };
    }
    
    setRegionAllocation(regionAlloc);
  };

  // Show error if no region assigned
  if (!selectedRegion) {
    return (
      <div className="min-h-screen bg-ink dark:bg-ink p-8">
        <div className="flex items-center gap-3 pl-4 border-l-4 border-gold dark:border-gold mb-6">
          <h2 className="text-2xl font-bold"><i className="fas fa-exclamation-circle"></i> No Region Assigned</h2>
        </div>
        <div className="bg-red-900 dark:bg-red-900 p-4 rounded-lg border border-coral dark:border-coral">
          <strong className="text-coral dark:text-coral">⚠️ Error: No Region Assigned</strong>
          <p className="text-coral dark:text-coral mt-2 mb-0 text-xs">
            You are not assigned to any region. Contact your system administrator.
          </p>
        </div>
      </div>
    );
  }

  // Show plan list if no plan selected
  if (!selectedPlan && plans.length > 0) {
    return (
      <div className="min-h-screen bg-ink dark:bg-ink p-8">
        <div className="flex items-center gap-3 pl-4 border-l-4 border-gold dark:border-gold mb-6">
          <h2 className="text-2xl font-bold"><i className="fas fa-inbox"></i> Plans Sent from Director - {getDisplayRegionName(selectedRegion)}</h2>
          <Badge status={`${plans.length} plans`} className="director-approved" />
        </div>

        <div className="table-container w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-panel dark:bg-panel border-b border-border dark:border-border">
                <th className="text-left p-3 text-text-mid dark:text-text-mid">Plan ID</th>
                <th className="text-left p-3 text-text-mid dark:text-text-mid">Fiscal Year</th>
                <th className="text-left p-3 text-text-mid dark:text-text-mid">Total Cases</th>
                <th className="text-left p-3 text-text-mid dark:text-text-mid">Status</th>
                <th className="text-left p-3 text-text-mid dark:text-text-mid">Created Date</th>
                <th className="text-left p-3 text-text-mid dark:text-text-mid">Action</th>
              </tr>
            </thead>
            <tbody>
              {plans.map(p => (
                <tr key={p.id} className="border-b border-border dark:border-border hover:bg-panel dark:hover:bg-panel">
                  <td className="p-3"><strong className="text-text-hi dark:text-text-hi">{p.id}</strong></td>
                  <td className="p-3 text-text-mid dark:text-text-mid">{p.fiscalYear}</td>
                  <td className="p-3 text-text-mid dark:text-text-mid">{p.totalCases || p.totalVolume || '-'}</td>
                  <td className="p-3"><Badge status={p.status} className={p.status === 'FEEDBACK_COLLECTED' ? 'director-approved' : 'feedback'} /></td>
                  <td className="p-3 text-text-mid dark:text-text-mid">{p.createdDate?.split('T')[0] || '-'}</td>
                  <td className="p-3">
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        // Using data from hook
                        selectPlan(data, p);
                      }}
                    >
                      <i className="fas fa-arrow-right"></i> Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Show no plans message
  if (!selectedPlan || !regionAllocation) {
    return (
      <div className="min-h-screen bg-ink dark:bg-ink p-8">
        <div className="flex items-center gap-3 pl-4 border-l-4 border-gold dark:border-gold mb-6">
          <h2 className="text-2xl font-bold"><i className="fas fa-inbox"></i> Plan Review - {getDisplayRegionName(selectedRegion)}</h2>
        </div>
        <div className="bg-blue-900 dark:bg-blue-900 p-4 rounded-lg border border-blue dark:border-blue mt-6">
          <strong className="text-blue dark:text-blue"><i className="fas fa-info-circle"></i> No Plan</strong>
          <p className="text-text-mid dark:text-text-mid mt-2 mb-0 text-xs">
            No approved plan has been received yet.
          </p>
        </div>
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

  return (
    <div className="min-h-screen bg-ink dark:bg-ink p-8">
      <div className="action-bar mb-6">
        <button 
          className="btn btn-outline"
          onClick={() => setSelectedPlan(null)}
        >
          <i className="fas fa-arrow-left"></i> Back to Plans
        </button>
      </div>

      <div className="flex items-center gap-3 pl-4 border-l-4 border-gold dark:border-gold mb-6">
        <h2 className="text-2xl font-bold"><i className="fas fa-tasks"></i> Review Plan from Director - {getDisplayRegionName(selectedRegion)}</h2>
        <Badge status="Review" className="director-approved" />
      </div>

      {/* Step 1: Review Plan */}
      <div className="bg-green-900 dark:bg-green-900 p-4 rounded-lg mb-6 border border-teal dark:border-teal">
        <strong className="text-teal dark:text-teal"><i className="fas fa-check-circle"></i> Step 1: Review Plan from Director</strong>
        <p className="text-text-mid dark:text-text-mid mt-2 mb-0 text-xs leading-relaxed">
          You have received the {selectedPlan.name || 'Annual Audit Plan'} for {getDisplayRegionName(selectedRegion)} region. Total cases: <strong>{regionAllocation.totalCases}</strong>
        </p>
      </div>

      {/* Plan Details Cards */}
      <div className="cards mb-6">
        <Card title="Plan ID" number={selectedPlan.id} icon="fas fa-id-badge" />
        <Card title="Version" number={selectedPlan.version} icon="fas fa-code-branch" />
        <Card title="Total Cases" number={regionAllocation.totalCases} icon="fas fa-tasks" />
        <Card title="Fiscal Year" number={selectedPlan.fiscalYear || '2026'} icon="fas fa-calendar" />
      </div>

      {/* Plan Details Section */}
      <div className="mt-6 bg-panel dark:bg-panel text-text-hi dark:text-text-hi p-4 rounded-lg border border-border dark:border-border mb-6">
        <h3 className="text-text-hi dark:text-text-hi"><i className="fas fa-info-circle"></i> Plan Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
          <div>
            <p className="text-xs text-text-mid dark:text-text-mid m-0">Planning Tactics</p>
            <p className="text-sm m-1">{selectedPlan.strategy || 'Risk-based approach'}</p>
          </div>
          <div>
            <p className="text-xs text-text-mid dark:text-text-mid m-0">Planning Period</p>
            <p className="text-sm m-1">{selectedPlan.startDate?.split('T')[0]} to {selectedPlan.endDate?.split('T')[0]}</p>
          </div>
        </div>
      </div>

      {/* Audit Type Breakdown */}
      <div className="section-title mt-6 mb-3">
        <i className="fas fa-chart-pie"></i> Audit Type Breakdown for {getDisplayRegionName(selectedRegion)}
      </div>
      <div className="table-container mb-6 w-full overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-panel dark:bg-panel border-b-2 border-border dark:border-border">
              <th className="text-left p-3 text-text-mid dark:text-text-mid">AUDIT TYPE</th>
              <th className="text-center p-3 text-text-mid dark:text-text-mid">CASES</th>
              <th className="text-center p-3 text-text-mid dark:text-text-mid">% OF TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {auditTypes.map((auditType, idx) => {
              const cases = regionAllocation.breakdown?.[auditType] || 0;
              const percentage = ((cases / regionAllocation.totalCases) * 100).toFixed(1);
              return (
                <tr key={idx} className="border-b border-border dark:border-border hover:bg-panel dark:hover:bg-panel">
                  <td className="p-3"><strong className="text-text-hi dark:text-text-hi">{auditTypeLabels[auditType]}</strong></td>
                  <td className="text-center p-3 text-text-mid dark:text-text-mid">{cases}</td>
                  <td className="text-center p-3 text-text-mid dark:text-text-mid">{percentage}%</td>
                </tr>
              );
            })}
            <tr className="bg-ink dark:bg-ink font-bold border-t-2 border-border dark:border-border">
              <td className="p-3 text-text-hi dark:text-text-hi">TOTAL</td>
              <td className="text-center p-3 text-text-hi dark:text-text-hi">{regionAllocation.totalCases}</td>
              <td className="text-center p-3 text-text-hi dark:text-text-hi">100%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900 text-text-hi dark:text-text-hi p-4 rounded-lg border border-blue dark:border-blue mt-6">
        <strong><i className="fas fa-info-circle"></i> Next Step</strong>
        <p className="text-text-mid dark:text-text-mid mt-2 mb-0 text-xs leading-relaxed">
          Click "Allocate to Tax Centers" from the sidebar to distribute these audit types to your 3 tax centers.
        </p>
      </div>
    </div>
  );
}

export default RegionalPlanReviewView;
