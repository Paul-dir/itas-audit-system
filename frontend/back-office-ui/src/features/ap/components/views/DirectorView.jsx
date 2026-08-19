import React, { useState, useEffect } from 'react';
import Card from '../Card';
import Badge from '../Badge';
import PlanDetailsView from './PlanDetailsView';
import DirectorAmendedPlansView from './DirectorAmendedPlansView';
import RiskEngineView from './RiskEngineView';
import { useData } from '../../services/dataService';
import { directorApprove, directorRequestRevision, getStatusDisplay, getBadgeClass, submitToSeniorManagement, directorResubmitRejectedPlan } from '../../utils/businessLogic';
import { auditConfig } from '../../config/auditConfig';

/**
 * DirectorView - Director plan approval and management workflow
 * Manages plan review, regional feedback collection, and Senior Management submission
 */
function DirectorView({ currentView }) {
  const [plans, setPlans] = useState([]);
  const { data, updateData } = useData();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [viewMode, setViewMode] = useState('plans'); // 'plans', 'feedback', 'risk-engine', 'approved-plans', 'finalized', 'amended-plans'

  useEffect(() => {
    if (currentView === 'risk-engine') {
      setViewMode('risk-engine');
    } else if (currentView === 'feedback-review') {
      setViewMode('feedback');
    } else if (currentView === 'approved-plans') {
      setViewMode('approved-plans');
    } else if (currentView === 'finalized') {
      setViewMode('finalized');
    } else if (currentView === 'amended-plans') {
      setViewMode('amended-plans');
    } else if (currentView === 'review-queue') {
      setViewMode('plans');
    } else {
      setViewMode('plans');
    }
  }, [currentView]);

  const loadPlans = () => {
    // Using data from hook
    setPlans(data.plans || []);
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleApprove = (planId) => {
    const notes = prompt('Enter approval notes (optional):');
    if (directorApprove(planId, notes || '')) {
      alert('Plan approved! Status: DIRECTOR_APPROVED.\n\nNext: Use "Submit Plan to Regions" to send to regional directors.');
      loadPlans();
      // ✅ Reload the selected plan to show updated status
      // Using data from hook
      const updatedPlan = data.plans.find(p => p.id === planId);
      if (updatedPlan) {
        setSelectedPlan(updatedPlan);
      }
    } else {
      alert('Cannot approve. Plan must be SUBMITTED_TO_DIRECTOR.');
    }
  };

  const handleRequestRevision = (planId) => {
    const feedback = prompt('Enter feedback for revision (required):');
    if (feedback && directorRequestRevision(planId, feedback)) {
      alert('Revision requested. Plan returned to Audit Planning Team.');
      loadPlans();
    } else if (!feedback) {
      alert('Feedback is required.');
    }
  };

  const handleSendToSeniorManagement = (planId) => {
    if (submitToSeniorManagement(planId)) {
      alert('✅ Plan sent to Senior Management for final approval. Status: SUBMITTED_TO_SENIOR_MANAGEMENT');
      loadPlans();
    } else {
      alert('❌ Cannot send to Senior Management. Plan must have FEEDBACK_COLLECTED status.');
    }
  };

  const handleResubmitRejectedPlan = (planId) => {
    const notes = prompt('Enter notes for resubmission (what was revised):');
    if (notes && directorResubmitRejectedPlan(planId, notes)) {
      alert('✅ Plan revised and resubmitted to Senior Management for reconsideration.');
      loadPlans();
      setSelectedPlan(null);
    } else if (!notes) {
      alert('Please enter what was revised in the plan.');
    } else {
      alert('Cannot resubmit. Plan must be SENIOR_MANAGEMENT_REJECTED.');
    }
  };

  if (selectedPlan) {
    const isEditableByDirector = false; // Director can ONLY view and comment, NOT edit
    
    // Determine what actions are available based on plan status
    const canApprove = selectedPlan.status === 'SUBMITTED_TO_DIRECTOR';
    const canRequestRevision = selectedPlan.status === 'SUBMITTED_TO_DIRECTOR';
    const canSendToRegions = selectedPlan.status === 'DIRECTOR_APPROVED';
    const canSendToSeniorManagement = selectedPlan.status === 'FEEDBACK_COLLECTED' || selectedPlan.status === 'DIRECTOR_APPROVED';
    const hasRegionalFeedback = selectedPlan.regionalFeedback && selectedPlan.regionalFeedback.length > 0;
    const isAwaitingRegionalFeedback = selectedPlan.status === 'AWAITING_REGIONAL_FEEDBACK';

    return (
      <>
        <PlanDetailsView 
          plan={selectedPlan}
          onBack={() => setSelectedPlan(null)}
          readOnly={true}
        />
        
        {/* DIRECTOR DECISION PANEL */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                <i className="fas fa-gavel text-sm"></i>
              </div>
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-200">
                  Director Actions & Decisions Panel
                </h3>
                <p className="text-xs text-slate-400">Governance controls and stage authorizations for this audit plan</p>
              </div>
            </div>
            <Badge status={getStatusDisplay(selectedPlan.status)} className={getBadgeClass(selectedPlan.status)} />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {canApprove && (
              <>
                <button 
                  className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 hover:bg-emerald-900/40 hover:border-emerald-500/60 transition-all duration-200 shadow-lg"
                  onClick={() => { handleApprove(selectedPlan.id); setSelectedPlan(null); }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                    <i className="fas fa-check-circle text-2xl"></i>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-extrabold tracking-wider text-emerald-400">APPROVE PLAN</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Validate & authorize for regional phase</p>
                  </div>
                </button>

                <button 
                  className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-950/20 p-5 hover:bg-amber-900/40 hover:border-amber-500/60 transition-all duration-200 shadow-lg"
                  onClick={() => { handleRequestRevision(selectedPlan.id); setSelectedPlan(null); }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                    <i className="fas fa-rotate-left text-2xl"></i>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-extrabold tracking-wider text-amber-400">REQUEST REVISION</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Return to Planning Team with notes</p>
                  </div>
                </button>
              </>
            )}

            {canSendToSeniorManagement && (
              <button 
                className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-5 hover:bg-indigo-900/40 hover:border-indigo-500/60 transition-all duration-200 shadow-lg"
                onClick={() => { 
                  const notes = prompt('Enter notes for Senior Management (optional):');
                  if (notes !== null) {
                    handleSendToSeniorManagement(selectedPlan.id);
                  }
                }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                  <i className="fas fa-[#10B981] fa-arrow-up-from-bracket text-2xl"></i>
                </div>
                <div className="text-center">
                  <p className="text-xs font-extrabold tracking-wider text-indigo-300">ESCALATE TO SR. MANAGEMENT</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Submit with collected feedback</p>
                </div>
              </button>
            )}

            {selectedPlan.status === 'SENIOR_MANAGEMENT_REJECTED' && (
              <button 
                className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/20 p-5 hover:bg-rose-900/40 hover:border-rose-500/60 transition-all duration-200 shadow-lg"
                onClick={() => { handleResubmitRejectedPlan(selectedPlan.id); }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform">
                  <i className="fas fa-arrow-rotate-right text-2xl"></i>
                </div>
                <div className="text-center">
                  <p className="text-xs font-extrabold tracking-wider text-rose-400">RESUBMIT REVISED PLAN</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Re-escalate for final approval</p>
                </div>
              </button>
            )}

            {selectedPlan.status === 'SENIOR_MANAGEMENT_APPROVED' && (
              <button 
                className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 hover:bg-emerald-900/40 hover:border-emerald-500/60 transition-all duration-200 shadow-lg"
                onClick={() => { 
                  // Using data from hook
                  const plan = data.plans.find(p => p.id === selectedPlan.id);
                  if (plan) {
                    const allRegions = auditConfig.regions.map(r => r.name);
                    
                    plan.status = 'FINALIZED';
                    plan.sentToRegions = allRegions;
                    plan.sentToRegionsDate = new Date().toISOString();
                    plan.lastModified = new Date().toISOString();
                    
                    if (!plan.approvalHistory) plan.approvalHistory = [];
                    plan.approvalHistory.push({
                      action: 'FINALIZED_AND_SENT_TO_REGIONS',
                      by: 'Director',
                      date: new Date().toISOString(),
                      notes: `Plan finalized and sent to ${allRegions.length} regions for deployment`,
                      version: plan.version
                    });
                    
                    updateData(data);
                    alert(`✅ Plan finalized and sent to ${allRegions.length} regions!\n\nRegions: ${allRegions.join(', ')}`);
                    setSelectedPlan(null);
                    loadPlans();
                  }
                }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                  <i className="fas fa-trophy text-2xl"></i>
                </div>
                <div className="text-center">
                  <p className="text-xs font-extrabold tracking-wider text-emerald-400">FINALIZE & DEPLOY</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Authorize final plan for execution</p>
                </div>
              </button>
            )}

            {selectedPlan.status === 'FINALIZED' && (
              <div className="col-span-full rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                    <i className="fas fa-check-double text-lg"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-300">Plan Status: Finalized & Fully Authorized</h4>
                    <p className="text-xs text-slate-400 mt-0.5">This plan has passed all governance reviews and is active for nationwide audit operations.</p>
                  </div>
                </div>
                <button 
                  onClick={() => alert(`Exporting execution package for Plan ${selectedPlan.id}`)}
                  className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all"
                >
                  <i className="fas fa-file-export"></i> Export Package
                </button>
              </div>
            )}
          </div>

          {selectedPlan.status === 'SENIOR_MANAGEMENT_REJECTED' && selectedPlan.approvalHistory && selectedPlan.approvalHistory.length > 0 && (
            <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-950/20 p-4">
              <p className="text-xs font-bold text-rose-400 mb-1 flex items-center gap-2">
                <i className="fas fa-circle-exclamation"></i> Rejection Feedback:
              </p>
              <p className="text-xs text-slate-300 font-mono">
                {selectedPlan.approvalHistory[selectedPlan.approvalHistory.length - 1]?.notes || 'No specific feedback provided'}
              </p>
            </div>
          )}
        </div>
      </>
    );
  }

  // If viewing risk engine mode
  if (viewMode === 'risk-engine') {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors" onClick={() => setViewMode('plans')}>
            <i className="fas fa-arrow-left"></i> Back to Plans
          </button>
        </div>
        <RiskEngineView userRole="director" />
      </div>
    );
  }

  // If viewing feedback mode, show message
  if (viewMode === 'feedback') {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors" onClick={() => setViewMode('plans')}>
            <i className="fas fa-arrow-left"></i> Back to Plans
          </button>
        </div>
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-6">
          <h3 className="text-lg font-bold text-slate-100 mb-2">📊 Feedback Collection</h3>
          <p className="text-slate-400">Feedback from regional directors will appear here after plans are sent for allocation and feedback is collected.</p>
        </div>
      </div>
    );
  }

  // If viewing amended plans mode, show the amended plans review view
  if (viewMode === 'amended-plans') {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors" onClick={() => setViewMode('plans')}>
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
        </div>
        <DirectorAmendedPlansView currentView={currentView} />
      </div>
    );
  }

  // Send Feedback to Regions view
  // Approved Plans view
  if (viewMode === 'approved-plans') {
    const approvedPlans = plans.filter(p => p.status === 'DIRECTOR_APPROVED');

    return (
      <div className="space-y-6">
        <div className="mb-6">
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors" onClick={() => setViewMode('plans')}>
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-100"><i className="fas fa-check-circle"></i> Approved Plans</h2>
          <p className="text-sm text-slate-400">{approvedPlans.length} plans</p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-[#161f28]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-900/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Plan ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Fiscal Year</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Total Cases</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Approval Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {approvedPlans.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <i className="fas fa-inbox mb-4 block text-4xl text-slate-600"></i>
                    <br />
                    <span className="text-slate-400">No approved plans yet</span>
                  </td>
                </tr>
              ) : (
                approvedPlans.map(plan => (
                  <tr key={plan.id} className="border-b border-slate-800/50 hover:bg-slate-900/30 transition-colors">
                    <td className="px-6 py-4"><strong className="text-slate-100">{plan.id}</strong></td>
                    <td className="px-6 py-4 text-slate-300">{plan.fiscalYear}</td>
                    <td className="px-6 py-4 text-slate-300">{plan.totalVolume}</td>
                    <td className="px-6 py-4 text-slate-300">{plan.approvalHistory?.find(a => a.action === 'DIRECTOR_APPROVED')?.date?.split('T')[0] || '-'}</td>
                    <td className="px-6 py-4"><Badge status={getStatusDisplay(plan.status)} className={getBadgeClass(plan.status)} /></td>
                    <td className="px-6 py-4">
                      <button className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-3 py-2 text-xs font-medium text-slate-100 hover:bg-slate-600 transition-colors" onClick={() => setSelectedPlan(plan)}>
                        <i className="fas fa-eye"></i> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Finalized Plans view
  if (viewMode === 'finalized') {
    const finalizedPlans = plans.filter(p => p.status === 'FINALIZED');

    return (
      <div className="space-y-6">
        <div className="mb-6">
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors" onClick={() => setViewMode('plans')}>
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-100"><i className="fas fa-flag-checkered"></i> Finalized Plans</h2>
          <p className="text-sm text-slate-400">{finalizedPlans.length} plans</p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-[#161f28]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-900/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Plan ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Fiscal Year</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Total Cases</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Finalized Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {finalizedPlans.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <i className="fas fa-inbox mb-4 block text-4xl text-slate-600"></i>
                    <br />
                    <span className="text-slate-400">No finalized plans yet</span>
                  </td>
                </tr>
              ) : (
                finalizedPlans.map(plan => (
                  <tr key={plan.id} className="border-b border-slate-800/50 hover:bg-slate-900/30 transition-colors">
                    <td className="px-6 py-4"><strong className="text-slate-100">{plan.id}</strong></td>
                    <td className="px-6 py-4 text-slate-300">{plan.fiscalYear}</td>
                    <td className="px-6 py-4 text-slate-300">{plan.totalVolume}</td>
                    <td className="px-6 py-4 text-slate-300">{plan.approvalHistory?.find(a => a.action === 'FINALIZED')?.date?.split('T')[0] || '-'}</td>
                    <td className="px-6 py-4"><Badge status={getStatusDisplay(plan.status)} className={getBadgeClass(plan.status)} /></td>
                    <td className="px-6 py-4">
                      <button className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-3 py-2 text-xs font-medium text-slate-100 hover:bg-slate-600 transition-colors" onClick={() => setSelectedPlan(plan)}>
                        <i className="fas fa-eye"></i> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Main plans view (Dashboard)
  const stats = {
    underReview: plans.filter(p => p.status === 'SUBMITTED_TO_DIRECTOR').length,
    approved: plans.filter(p => p.status === 'DIRECTOR_APPROVED').length,
    awaitingFeedback: plans.filter(p => p.status === 'AWAITING_REGIONAL_FEEDBACK').length,
    feedbackCollected: plans.filter(p => p.status === 'FEEDBACK_COLLECTED').length,
    seniorApproved: plans.filter(p => p.status === 'SENIOR_MANAGEMENT_APPROVED').length,
    finalized: plans.filter(p => p.status === 'FINALIZED').length,
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-100"><i className="fas fa-building"></i> Director Dashboard - Plan Management</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card title="Under Review" number={stats.underReview} icon="fas fa-hourglass-half" />
        <Card title="Approved by Me" number={stats.approved} icon="fas fa-check-circle" />
        <Card title="Awaiting Feedback" number={stats.awaitingFeedback} icon="fas fa-clock" />
        <Card title="Feedback Collected" number={stats.feedbackCollected} icon="fas fa-inbox" />
        <Card title="Senior Mgmt Approved" number={stats.seniorApproved} icon="fas fa-thumbs-up" />
        <Card title="Finalized" number={stats.finalized} icon="fas fa-flag-checkered" />
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <button 
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
          onClick={() => setViewMode('send-feedback')}
          title="Send approved plans to regions for feedback"
        >
          <i className="fas fa-paper-plane"></i> Send to Regions ({stats.approved})
        </button>
        <button 
          className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-600 transition-colors"
          onClick={() => setViewMode('feedback')}
          title="Review feedback from regional directors"
        >
          <i className="fas fa-comments"></i> Review Feedback ({stats.feedbackCollected})
        </button>
        <button 
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          onClick={() => setViewMode('approved-plans')}
          title="View all approved plans"
        >
          <i className="fas fa-check-circle"></i> Approved Plans
        </button>
        <button 
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          onClick={() => setViewMode('finalized')}
          title="View finalized plans"
        >
          <i className="fas fa-flag-checkered"></i> Finalized Plans
        </button>
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <i className="fas fa-clipboard-check text-slate-400"></i>
          <h3 className="text-lg font-semibold text-slate-100">Plans for Review</h3>
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-[#161f28]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-900/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Plan ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Fiscal Year</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Total Cases</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Created Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {plans.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <i className="fas fa-inbox mb-4 block text-4xl text-slate-600"></i>
                    <span className="text-slate-400">No plans submitted for review</span>
                  </td>
                </tr>
              ) : (
                plans.map(plan => (
                  <tr key={plan.id} className="border-b border-slate-800/50 hover:bg-slate-900/30 transition-colors">
                    <td className="px-6 py-4"><strong className="text-slate-100">{plan.id}</strong></td>
                    <td className="px-6 py-4 text-slate-300">{plan.fiscalYear}</td>
                    <td className="px-6 py-4 text-slate-300">{plan.totalVolume}</td>
                    <td className="px-6 py-4 text-slate-300">{plan.createdDate?.split('T')[0] || '-'}</td>
                    <td className="px-6 py-4"><Badge status={getStatusDisplay(plan.status)} className={getBadgeClass(plan.status)} /></td>
                    <td className="px-6 py-4">
                      <button className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-3 py-2 text-xs font-medium text-slate-100 hover:bg-slate-600 transition-colors" onClick={() => setSelectedPlan(plan)}>
                        <i className="fas fa-eye"></i> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DirectorView;
