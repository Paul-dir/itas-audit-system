import React, { useState, useEffect } from 'react';
import Card from '../Card';
import Badge from '../Badge';
import { useData } from '../../services/dataService';
import { submitRegionalFeedback, getStatusDisplay, getBadgeClass } from '../../utils/businessLogic';
import { useAuth } from '../../context/AuthContext';

function RegionalDirectorView() {
  const { getUserInfo } = useAuth();
  const { data, updateData } = useData();
  const userInfo = getUserInfo();
  const [plan, setPlan] = useState(null);
  const [allocation, setAllocation] = useState(null);
  const [adjustments, setAdjustments] = useState({});
  const [comments, setComments] = useState('');
  const [allPlans, setAllPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  
  // Use user's assigned region (no selection dropdown)
  const region = userInfo?.orgContext?.assignedRegion || 'Oromia';

  // Load ALL awaiting plans dynamically
  const loadAllAwaitingPlans = () => {
    // Using data from hook
    const awaitingPlans = data.plans.filter(p => p.status === 'AWAITING_REGIONAL_FEEDBACK');
    setAllPlans(awaitingPlans);
    console.log('📋 Loaded awaiting plans:', awaitingPlans.length);
  };

  // Load selected plan details
  const loadPlanDetails = (planId) => {
    if (!planId) {
      setPlan(null);
      setAllocation(null);
      return;
    }

    // Using data from hook
    const selectedPlan = data.plans.find(p => p.id === planId);
    
    if (selectedPlan) {
      setPlan(selectedPlan);
      console.log('✅ Selected plan:', selectedPlan.id);
      
      // Get allocation for this region
      const alloc = selectedPlan.allocations?.find(a => a.region === region);
      setAllocation(alloc);
      
      if (alloc) {
        setAdjustments({
          total: alloc.total,
          desk: alloc.desk,
          field: alloc.field,
          tp: alloc.tp,
          issue: alloc.issue
        });
      }
    }
  };

  // Initial load and set up interval for dynamic updates
  useEffect(() => {
    loadAllAwaitingPlans();
    
    // Reload every 5 seconds for real-time updates
    const interval = setInterval(() => {
      loadAllAwaitingPlans();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Load plan details when selectedPlanId changes
  useEffect(() => {
    loadPlanDetails(selectedPlanId);
  }, [selectedPlanId, region]);

  const handleSubmitFeedback = () => {
    if (!plan) {
      alert('No active plan.');
      return;
    }
    
    // ✅ DUPLICATE PREVENTION: Check if feedback already submitted for this region
    if (plan.regionalFeedbackStatus?.[region]?.sentToDirector) {
      alert('❌ Feedback already submitted for this region!\n\n' +
            `Submitted by: ${plan.regionalFeedbackStatus[region].submittedBy || 'Regional Director'}\n` +
            `Date: ${new Date(plan.regionalFeedbackStatus[region].submittedDate).toLocaleString()}\n\n` +
            'Cannot submit feedback again.');
      return;
    }

    const message = prompt('Enter your feedback message:', 'Current allocation acceptable.');
    if (message === null) return;

    if (submitRegionalFeedback(plan.id, region, message, adjustments, comments)) {
      alert('✅ Feedback submitted to the Audit Director.');
      setComments('');
      setSelectedPlanId(null);
      loadAllAwaitingPlans(); // Refresh list
    } else {
      alert('❌ Cannot submit feedback. Plan may not be AWAITING_REGIONAL_FEEDBACK.');
    }
  };

  const handleSendToTaxCenters = () => {
    if (!plan) {
      alert('❌ No plan selected');
      return;
    }

    if (!allocation || allocation.status !== 'ACCEPTED') {
      alert('❌ Plan must be ACCEPTED before sending to tax centers');
      return;
    }

    if (!window.confirm(`Send plan "${plan.id}" to tax centers in ${region}?\n\nThis will notify all tax centers in the region that the plan is ready for them to accept.`)) {
      return;
    }

    // Using data from hook
    const currentPlan = data.plans.find(p => p.id === plan.id);
    
    if (currentPlan) {
      // Mark plan as submitted to tax centers
      if (!currentPlan.submittedToTaxCenters) {
        currentPlan.submittedToTaxCenters = {};
      }

      currentPlan.submittedToTaxCenters[region] = {
        status: 'SUBMITTED',
        submittedDate: new Date().toISOString(),
        submittedBy: `${region} Regional Director`,
        taxCentersInRegion: [
          `${region}-tc1`,
          `${region}-tc2`,
          `${region}-tc3`,
          `${region}-tc4`
        ]
      };

      // Add to approval history
      if (!currentPlan.approvalHistory) currentPlan.approvalHistory = [];
      currentPlan.approvalHistory.push({
        action: 'SENT_TO_TAX_CENTERS',
        by: `${region} Regional Director`,
        date: new Date().toISOString(),
        region: region,
        notes: `Plan sent to ${currentPlan.submittedToTaxCenters[region].taxCentersInRegion.length} tax centers in ${region}`,
        version: currentPlan.version
      });

      updateData(data);
      alert(`✅ Plan sent to all tax centers in ${region}!\n\nTax centers can now review and accept the plan.`);
      setSelectedPlanId(null);
      loadAllAwaitingPlans(); // Refresh list
    }
  };

  const getStatusBadge = () => {
    if (!allocation) return <Badge status="Not Found" className="draft" />;
    
    const statusMap = {
      'PENDING': { text: 'Pending Review', className: 'pending' },
      'FEEDBACK_SUBMITTED': { text: 'Feedback Submitted', className: 'submitted' },
      'ACCEPTED': { text: 'Accepted', className: 'director-approved' },
      'REJECTED': { text: 'Rejected', className: 'rejected' }
    };
    
    const status = statusMap[allocation.status] || { text: 'Unknown', className: 'draft' };
    return <Badge status={status.text} className={status.className} />;
  };

  const canSubmit = allocation && 
    allocation.status !== 'FEEDBACK_SUBMITTED' && 
    allocation.status !== 'ACCEPTED' && 
    allocation.status !== 'REJECTED';

  return (
    <div>
      <div className="action-bar">
        <div className="filters">
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontWeight: '500', color: '#8b949e' }}>📍 Region:</span>
            <span style={{ fontSize: '15px', fontWeight: '600', color: '#f0f6fc' }}>{region}</span>
            <span style={{ fontSize: '12px', color: '#6e7681', marginLeft: '20px' }}>
              ({allPlans.length} plan{allPlans.length !== 1 ? 's' : ''} awaiting review)
            </span>
          </div>
        </div>
        <div></div>
      </div>

      {/* Plan Selector Dropdown */}
      {allPlans.length > 0 && (
        <div className="form-group">
          <label htmlFor="plan-selector"><i className="fas fa-file-alt"></i> Select Plan to Review</label>
          <select
            id="plan-selector"
            value={selectedPlanId || ''}
            onChange={(e) => setSelectedPlanId(e.target.value || null)}
            style={{ padding: '8px 12px', fontSize: '14px' }}
          >
            <option value="">-- Choose a plan --</option>
            {allPlans.map(p => (
              <option key={p.id} value={p.id}>
                {p.id} (FY {p.year}) - v{p.version}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="cards">
        <Card title="My Allocation" number={allocation?.total || 0} icon="fas fa-folder" />
        <Card title="Status" number={getStatusBadge()} icon="fas fa-info-circle" />
      </div>

      <div className="section-title">National Summary</div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {!plan ? (
              <tr><td colSpan="2">No national plan available for review.</td></tr>
            ) : (
              <>
                <tr><td><strong>Plan ID</strong></td><td>{plan.id}</td></tr>
                <tr><td><strong>Year</strong></td><td>{plan.year}</td></tr>
                <tr><td><strong>National Total</strong></td><td>{plan.nationalTotal}</td></tr>
                <tr><td><strong>Status</strong></td><td><Badge status={getStatusDisplay(plan.status)} className={getBadgeClass(plan.status)} /></td></tr>
                <tr><td><strong>Regions</strong></td><td>{plan.allocations.length}</td></tr>
                <tr><td><strong>Effort</strong></td><td>{plan.effort || 'N/A'} hours</td></tr>
                <tr><td><strong>Planning Period</strong></td><td>{plan.planningPeriodStart || 'N/A'} to {plan.planningPeriodEnd || 'N/A'}</td></tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      <div className="section-title">My Regional Allocation</div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Audit Type</th>
              <th>Allocated</th>
              <th>Your Adjustment</th>
            </tr>
          </thead>
          <tbody>
            {!allocation ? (
              <tr><td colSpan="3">No allocation for your region.</td></tr>
            ) : (
              <>
                <tr>
                  <td><strong>Total Cases</strong></td>
                  <td>{allocation.total}</td>
                  <td>
                    <input 
                      type="number" 
                      value={adjustments.total || 0}
                      onChange={(e) => setAdjustments({...adjustments, total: parseInt(e.target.value) || 0})}
                      style={{ width: '100px' }}
                      disabled={!canSubmit}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Desk Audit</td>
                  <td>{allocation.desk}</td>
                  <td>
                    <input 
                      type="number" 
                      value={adjustments.desk || 0}
                      onChange={(e) => setAdjustments({...adjustments, desk: parseInt(e.target.value) || 0})}
                      style={{ width: '100px' }}
                      disabled={!canSubmit}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Field Audit</td>
                  <td>{allocation.field}</td>
                  <td>
                    <input 
                      type="number" 
                      value={adjustments.field || 0}
                      onChange={(e) => setAdjustments({...adjustments, field: parseInt(e.target.value) || 0})}
                      style={{ width: '100px' }}
                      disabled={!canSubmit}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Transfer Pricing</td>
                  <td>{allocation.tp}</td>
                  <td>
                    <input 
                      type="number" 
                      value={adjustments.tp || 0}
                      onChange={(e) => setAdjustments({...adjustments, tp: parseInt(e.target.value) || 0})}
                      style={{ width: '100px' }}
                      disabled={!canSubmit}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Issue Audit</td>
                  <td>{allocation.issue}</td>
                  <td>
                    <input 
                      type="number" 
                      value={adjustments.issue || 0}
                      onChange={(e) => setAdjustments({...adjustments, issue: parseInt(e.target.value) || 0})}
                      style={{ width: '100px' }}
                      disabled={!canSubmit}
                    />
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      <div className="form-group">
        <label><i className="fas fa-comment"></i> Additional Comments</label>
        <textarea 
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Provide detailed feedback..."
          disabled={!canSubmit}
        />
      </div>

      <div className="action-bar">
        <div></div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              if (!plan) {
                alert('❌ No plan selected');
                return;
              }
              // Using data from hook
              const currentPlan = data.plans.find(p => p.id === plan.id);
              if (currentPlan) {
                const alloc = currentPlan.allocations?.find(a => a.region === region);
                if (alloc) {
                  alloc.status = 'ACCEPTED';
                  if (!currentPlan.regionFeedbackStatus) currentPlan.regionFeedbackStatus = {};
                  currentPlan.regionFeedbackStatus[region] = {
                    status: 'received',
                    receivedDate: new Date().toISOString(),
                    adjustments: adjustments,
                    comments: comments
                  };
                  updateData(data);
                  alert('✅ Plan allocation ACCEPTED for your region!');
                  setSelectedPlanId(null);
                  loadAllAwaitingPlans(); // Refresh list
                } else {
                  alert('❌ No allocation found for your region');
                }
              }
            }}
            disabled={!canSubmit || !plan}
            title={!canSubmit || !plan ? 'Already processed or no plan selected' : 'Accept this allocation'}
          >
            <i className="fas fa-check-circle"></i> Accept Allocation
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmitFeedback}
            disabled={!canSubmit}
            title={!canSubmit ? 'Feedback already processed for this region.' : ''}
          >
            <i className="fas fa-paper-plane"></i> Submit Feedback
          </button>
          <button
            className="btn btn-success"
            onClick={handleSendToTaxCenters}
            disabled={!plan || !allocation || allocation.status !== 'ACCEPTED'}
            title={!plan ? 'No plan selected' : allocation?.status !== 'ACCEPTED' ? 'Must accept plan first' : 'Send to all tax centers in region'}
          >
            <i className="fas fa-share-square"></i> Send to Tax Centers
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegionalDirectorView;
