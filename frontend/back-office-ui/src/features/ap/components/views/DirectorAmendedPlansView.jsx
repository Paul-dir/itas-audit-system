import React, { useState, useEffect } from 'react';
import { useData } from '../../services/dataService';
import Badge from '../Badge';

/**
 * DirectorAmendedPlansView - REBUILT FOR NEW METHOD
 * Director reviews amended plans from Planning Team
 * 
 * NEW WORKFLOW:
 * 1. Director sees plans with status: 'RESUBMITTED_TO_DIRECTOR'
 * 2. Reviews the amendments Planning Team made
 * 3. Accepts or sends back for more amendments
 * 4. If accepted → status: 'DIRECTOR_APPROVED'
 */

function DirectorAmendedPlansView() {
  const [plans, setPlans] = useState([]);
  const { data, updateData } = useData();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAcceptForm, setShowAcceptForm] = useState(false);
  const [acceptNotes, setAcceptNotes] = useState('');

  const auditTypes = ['desk_audit', 'field_audit', 'joint_audit', 'transfer_pricing', 'comprehensive', 'issue_audit'];
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

    // ✅ NEW METHOD: Filter by status field
    // Show plans that have been amended and resubmitted by Planning Team
    const amendedPlans = (data.plans || []).filter(plan => {
      return plan.status === 'RESUBMITTED_TO_DIRECTOR';
    });

    console.log(`✅ Director Amended Plans: Found ${amendedPlans.length} amended plans awaiting acceptance`);
    setPlans(amendedPlans);
    setLoading(false);
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    setShowAcceptForm(false);
    setAcceptNotes('');
  };

  const handleAcceptAmendments = () => {
    // Using data from hook
    const plan = data.plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    // ✅ OPTIONAL NOTES: Like regional feedback pattern
    if (!acceptNotes.trim()) {
      const confirmWithoutNotes = window.confirm(
        'No notes provided for acceptance. Continue anyway?\n\n(Notes are optional)'
      );
      if (!confirmWithoutNotes) return;
    }

    // ✅ Update status to DIRECTOR_APPROVED - plan is now approved
    plan.status = 'DIRECTOR_APPROVED';
    plan.lastModified = new Date().toISOString();

    // ✅ Track in approval history (like regional feedback pattern)
    plan.approvalHistory = plan.approvalHistory || [];
    plan.approvalHistory.push({
      action: 'APPROVED_BY_DIRECTOR',
      by: 'Director',
      date: new Date().toISOString(),
      notes: acceptNotes || 'Amendments accepted and approved',
      version: plan.version
    });

    console.log('✅ DIRECTOR ACCEPTED AMENDMENTS:', {
      planId: plan.id,
      status: 'DIRECTOR_APPROVED',
      hasNotes: !!acceptNotes
    });

    updateData(data);

    alert('✅ Amendments accepted! Plan is now DIRECTOR_APPROVED.');
    setSelectedPlan(null);
    setShowAcceptForm(false);
    loadPlans();
  };

  const handleSendBackForMoreAmendments = () => {
    const feedback = window.prompt('Enter feedback for Planning Team (what needs to be changed):');
    if (!feedback) return;

    // Using data from hook
    const plan = data.plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    // ✅ Send back to Planning Team for more amendments
    plan.status = 'REVISION_REQUESTED';
    plan.lastModified = new Date().toISOString();

    // ✅ Track in approval history
    plan.approvalHistory = plan.approvalHistory || [];
    plan.approvalHistory.push({
      action: 'SENT_BACK_TO_PLANNING_TEAM',
      by: 'Director',
      date: new Date().toISOString(),
      notes: feedback,
      version: plan.version
    });

    updateData(data);

    alert('Plan sent back to Planning Team for further amendments.');
    setSelectedPlan(null);
    setShowAcceptForm(false);
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
          <i className="fas fa-check-circle"></i> Accept Amended Plans
        </h2>
        <p className="text-text-mid dark:text-text-mid mt-2">
          Review amendments from Planning Team and accept or request changes
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Plans List */}
        <div className="lg:col-span-1">
          <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg">
            <div className="px-4 py-3 border-b border-border dark:border-border">
              <h3 className="text-text-hi dark:text-text-hi font-bold m-0">
                Amended Plans ({plans.length})
              </h3>
            </div>

            {loading ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">Loading...</div>
            ) : plans.length === 0 ? (
              <div className="px-4 py-6 text-text-mid dark:text-text-mid text-center">
                No amended plans awaiting approval
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
                          status="submitted" 
                          text="Amended by Planning Team"
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

        {/* Right: Amendment Review */}
        <div className="lg:col-span-2">
          {planDetails ? (
            <div>
              {/* Plan Info */}
              <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4 mb-6">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Plan Details</h3>
                <div className="grid grid-cols-3 gap-4">
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
                </div>
              </div>

              {/* Amended Allocations */}
              <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4 mb-6">
                <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Amended Audit Type Allocations</h3>
                <p className="text-xs text-text-mid dark:text-text-mid mb-3">
                  These are the allocations Planning Team amended
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-ink dark:bg-ink">
                      <tr>
                        <th className="text-left p-2 text-text-hi dark:text-text-hi font-bold">Audit Type</th>
                        <th className="text-center p-2 text-text-hi dark:text-text-hi font-bold">Count</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border dark:divide-border">
                      {auditTypes.map(type => (
                        <tr key={type}>
                          <td className="p-2 text-text-hi dark:text-text-hi font-bold">
                            {auditTypeLabels[type]}
                          </td>
                          <td className="p-2 text-center text-teal dark:text-teal font-bold">
                            {planDetails.auditTypeAllocation?.[type] || 0}
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

              {/* Approval History */}
              {planDetails.approvalHistory && planDetails.approvalHistory.length > 0 && (
                <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4 mb-6">
                  <h3 className="text-text-hi dark:text-text-hi font-bold mb-3">Amendment History</h3>
                  <div className="space-y-3">
                    {planDetails.approvalHistory.map((record, idx) => (
                      <div key={idx} className="bg-ink dark:bg-ink p-3 rounded border border-border dark:border-border text-sm">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-bold text-text-hi dark:text-text-hi m-0">{record.action}</p>
                          <p className="text-xs text-text-mid dark:text-text-mid m-0">
                            {new Date(record.date).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-xs text-text-mid dark:text-text-mid m-0">By: {record.by}</p>
                        {record.notes && (
                          <p className="text-xs text-text-hi dark:text-text-hi mt-1 m-0">{record.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Decision Form */}
              {showAcceptForm ? (
                <div className="bg-teal/10 dark:bg-teal/10 border border-teal dark:border-teal rounded-lg p-4 mb-6">
                  <h3 className="text-teal dark:text-teal font-bold mb-4">Accept Amendments</h3>
                  
                  <div className="mb-4">
                    <label className="block text-text-hi dark:text-text-hi font-bold text-sm mb-2">
                      Notes (optional)
                    </label>
                    <textarea
                      value={acceptNotes}
                      onChange={(e) => setAcceptNotes(e.target.value)}
                      placeholder="Add any notes about accepting these amendments..."
                      className="w-full px-3 py-2 rounded border border-border dark:border-border bg-ink dark:bg-ink text-text-primary dark:text-text-primary text-sm"
                      rows="3"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleAcceptAmendments}
                      className="flex-1 px-3 py-2 rounded font-bold bg-teal dark:bg-teal text-white hover:bg-teal/80 dark:hover:bg-teal/80 text-sm"
                    >
                      ✅ Accept Amendments
                    </button>
                    <button
                      onClick={() => setShowAcceptForm(false)}
                      className="px-3 py-2 rounded font-bold bg-gray-600 dark:bg-gray-600 text-white hover:bg-gray-500 dark:hover:bg-gray-500 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAcceptForm(true)}
                    className="flex-1 py-3 px-4 rounded font-bold bg-teal dark:bg-teal text-white hover:bg-teal/80 dark:hover:bg-teal/80 transition-all"
                  >
                    ✅ Accept Amendments
                  </button>
                  <button
                    onClick={handleSendBackForMoreAmendments}
                    className="flex-1 py-3 px-4 rounded font-bold bg-orange dark:bg-orange text-white hover:bg-orange/80 dark:hover:bg-orange/80 transition-all"
                  >
                    ↩️ Send Back for Changes
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-8 text-center">
              <p className="text-text-mid dark:text-text-mid m-0">
                Select an amended plan to review and accept
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DirectorAmendedPlansView;
