import React, { useState, useEffect } from 'react';
import { useData } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import Badge from '../Badge';

/**
 * AuditPlanningTeamAmendView - COMPLETELY REBUILT
 * Using NEW method: Simple status-based filtering like DirectorView
 * 
 * NEW WORKFLOW:
 * 1. Planning Team receives plans with status: 'REVISION_REQUESTED'
 * 2. Reviews feedback and amends allocations
 * 3. Submits back with status: 'RESUBMITTED_TO_DIRECTOR'
 * 4. Director then reviews amendments
 */

function AuditPlanningTeamAmendView() {
  const { getUserInfo } = useAuth();
  const { data, updateData } = useData();
  const userInfo = getUserInfo();

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAmendForm, setShowAmendForm] = useState(false);
  const [amendments, setAmendments] = useState({});
  const [amendmentReason, setAmendmentReason] = useState('');

  const auditTypeIds = ['desk_audit', 'field_audit', 'joint_audit', 'transfer_pricing', 'comprehensive', 'issue_audit'];
  const auditTypeLabels = {
    desk_audit: 'Desk Audit',
    field_audit: 'Field Audit',
    joint_audit: 'Joint Audit',
    transfer_pricing: 'Transfer Pricing',
    comprehensive: 'Comprehensive',
    issue_audit: 'Issue Audit'
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = () => {
    setLoading(true);
    // Using data from hook

    // ✅ NEW METHOD: Filter by status field (like DirectorView)
    // Show plans that need amendment or have been amended
    const amendmentPlans = (data.plans || []).filter(plan => {
      return plan.status === 'REVISION_REQUESTED' || plan.status === 'RESUBMITTED_TO_DIRECTOR';
    });

    console.log(`✅ Planning Team: Found ${amendmentPlans.length} plans for amendment`, {
      needingAmendment: amendmentPlans.filter(p => p.status === 'REVISION_REQUESTED').length,
      alreadyAmended: amendmentPlans.filter(p => p.status === 'RESUBMITTED_TO_DIRECTOR').length
    });
    setPlans(amendmentPlans);
    setLoading(false);
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    setShowAmendForm(false);
    setAmendments({});
    setAmendmentReason('');
    
    // Initialize amendments from current plan allocations
    // Using data from hook
    const plan = data.plans.find(p => p.id === planId);
    if (plan) {
      const newAmendments = {};
      auditTypeIds.forEach(auditTypeId => {
        newAmendments[auditTypeId] = plan.auditTypeAllocation?.[auditTypeId] || 0;
      });
      setAmendments(newAmendments);
    }
  };

  const handleAmendmentChange = (auditTypeId, value) => {
    setAmendments(prev => ({
      ...prev,
      [auditTypeId]: parseInt(value) || 0
    }));
  };

  const handleSubmitAmendments = () => {
    if (!selectedPlan) return;

    // ✅ OPTIONAL REASON: Like regional feedback pattern
    if (!amendmentReason.trim()) {
      const confirmWithoutReason = window.confirm(
        'No reason provided for amendments. Continue anyway?\n\n(Reason is optional)'
      );
      if (!confirmWithoutReason) return;
    }

    // Using data from hook
    const plan = data.plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    // ✅ Update audit type allocation with amended values
    const previousAllocation = { ...plan.auditTypeAllocation };
    plan.auditTypeAllocation = amendments;

    // ✅ Update status to show it's been amended
    plan.status = 'RESUBMITTED_TO_DIRECTOR';
    plan.lastModified = new Date().toISOString();
    
    // ✅ Track amendment in approval history (like regional feedback pattern)
    plan.approvalHistory = plan.approvalHistory || [];
    plan.approvalHistory.push({
      action: 'AMENDED_AND_RESUBMITTED_TO_DIRECTOR',
      by: userInfo?.fullName || 'Planning Team',
      date: new Date().toISOString(),
      notes: amendmentReason || 'Amendments submitted to director',
      version: plan.version
    });

    console.log('✅ PLANNING TEAM SUBMITTED AMENDMENTS:', {
      planId: plan.id,
      status: 'RESUBMITTED_TO_DIRECTOR',
      hasReason: !!amendmentReason,
      previousAllocation: previousAllocation,
      newAllocation: amendments
    });

    updateData(data);

    alert('✅ Amendments submitted to Audit Director!');
    setSelectedPlan(null);
    setShowAmendForm(false);
    loadPlans();
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
          <i className="fas fa-edit"></i> Amendment Review
        </h2>
        <p className="text-text-mid dark:text-text-mid mt-2">
          Review feedback and amend audit allocations
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Plans List */}
        <div className="lg:col-span-1">
          <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg">
            <div className="px-4 py-3 border-b border-border dark:border-border">
              <h3 className="text-text-hi dark:text-text-hi font-bold m-0">
                Plans for Amendment ({plans.length})
              </h3>
            </div>

            {loading ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">Loading...</div>
            ) : plans.length === 0 ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">
                No plans requiring amendment
              </div>
            ) : (
              <div className="divide-y divide-border dark:divide-border max-h-96 overflow-y-auto">
                {plans.map(plan => (
                  <div
                    key={plan.id}
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedPlan === plan.id
                        ? 'bg-teal/20 dark:bg-teal/20 border-l-4 border-teal dark:border-teal'
                        : 'hover:bg-ink dark:hover:bg-ink'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-bold text-text-hi dark:text-text-hi m-0">{plan.id}</p>
                        <p className="text-xs text-text-mid dark:text-text-mid m-0 mt-1">{plan.name}</p>
                        <Badge 
                          status={plan.status === 'REVISION_REQUESTED' ? 'pending' : 'submitted'} 
                          text={plan.status === 'REVISION_REQUESTED' ? 'Needs Amendment' : 'Amended'}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Amendment Form */}
        <div className="lg:col-span-2">
          {planDetails ? (
            <div>
              {/* Plan Info */}
              <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4 mb-6">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Plan Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Plan ID</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">{planDetails.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Fiscal Year</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">{planDetails.fiscalYear}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Status</p>
                    <Badge status={planDetails.status} text={planDetails.status} className="mt-1" />
                  </div>
                  <div>
                    <p className="text-xs text-text-mid dark:text-text-mid m-0">Total Cases</p>
                    <p className="text-sm text-text-hi dark:text-text-hi font-bold m-0 mt-1">{planDetails.totalCases}</p>
                  </div>
                </div>
              </div>

              {/* Amendment Form */}
              {showAmendForm ? (
                <div className="bg-teal/10 dark:bg-teal/10 border border-teal dark:border-teal rounded-lg p-4 mb-6">
                  <h3 className="text-teal dark:text-teal font-bold mb-4">Amend Allocations</h3>
                  
                  {/* Audit Type Amendments */}
                  <div className="bg-panel dark:bg-panel rounded border border-border dark:border-border p-3 mb-4">
                    <table className="w-full text-sm">
                      <thead className="bg-ink dark:bg-ink">
                        <tr>
                          <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Audit Type</th>
                          <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">Current</th>
                          <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">Amended</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border dark:divide-border">
                        {auditTypeIds.map(auditTypeId => (
                          <tr key={auditTypeId}>
                            <td className="p-2 text-text-hi dark:text-text-hi font-bold">
                              {auditTypeLabels[auditTypeId]}
                            </td>
                            <td className="p-2 text-center text-text-mid dark:text-text-mid">
                              {planDetails.auditTypeAllocation?.[auditTypeId] || 0}
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                value={amendments[auditTypeId] || 0}
                                onChange={(e) => handleAmendmentChange(auditTypeId, e.target.value)}
                                className="w-full px-2 py-1 rounded border border-border dark:border-border bg-ink dark:bg-ink text-text-primary dark:text-text-primary text-center text-sm"
                                min="0"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Reason for Amendment */}
                  <div className="mb-4">
                    <label className="block text-text-hi dark:text-text-hi font-bold text-sm mb-2">
                      Reason for Amendment *
                    </label>
                    <textarea
                      value={amendmentReason}
                      onChange={(e) => setAmendmentReason(e.target.value)}
                      placeholder="Explain why these amendments are needed..."
                      className="w-full px-3 py-2 rounded border border-border dark:border-border bg-ink dark:bg-ink text-text-primary dark:text-text-primary text-sm"
                      rows="3"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleSubmitAmendments}
                      className="flex-1 px-3 py-2 rounded font-bold bg-teal dark:bg-teal text-white hover:bg-teal/80 dark:hover:bg-teal/80 text-sm"
                    >
                      ✅ Submit Amendments
                    </button>
                    <button
                      onClick={() => {
                        setShowAmendForm(false);
                        setAmendmentReason('');
                      }}
                      className="px-3 py-2 rounded font-bold bg-gray-600 dark:bg-gray-600 text-white hover:bg-gray-500 dark:hover:bg-gray-500 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Current Allocations Display */}
                  <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4 mb-6">
                    <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Current Allocations</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-ink dark:bg-ink">
                          <tr>
                            <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Audit Type</th>
                            <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">Count</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border dark:divide-border">
                          {auditTypeIds.map(auditTypeId => (
                            <tr key={auditTypeId}>
                              <td className="p-2 text-text-hi dark:text-text-hi font-bold">
                                {auditTypeLabels[auditTypeId]}
                              </td>
                              <td className="p-2 text-center text-text-mid dark:text-text-mid">
                                {planDetails.auditTypeAllocation?.[auditTypeId] || 0}
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-ink dark:bg-ink font-bold">
                            <td className="p-2 text-text-hi dark:text-text-hi">TOTAL</td>
                            <td className="p-2 text-center text-text-hi dark:text-text-hi">
                              {Object.values(planDetails.auditTypeAllocation || {}).reduce((a, b) => a + b, 0)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Amendment Button */}
                  <button
                    onClick={() => setShowAmendForm(true)}
                    className="w-full py-3 px-4 rounded font-bold bg-teal dark:bg-teal text-white hover:bg-teal/80 dark:hover:bg-teal/80 transition-all"
                  >
                    📝 Amend Allocations
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-8 text-center">
              <p className="text-text-mid dark:text-text-mid m-0">
                Select a plan to review and amend
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuditPlanningTeamAmendView;
