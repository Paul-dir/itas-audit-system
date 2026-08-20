import { useState } from 'react';
import { MapPin, Send, CheckCircle, Clock, Eye, Package, ArrowRight, Search } from 'lucide-react';
import { useApp } from '../../../../context/AppContext.jsx';
import { useAuth } from '../../../../context/AuthContext.jsx';
import { Card, Button, Alert, Badge, StatCard, Modal, Textarea, Tabs, Empty, Table, Input } from '../../../../components/ui/index.jsx';
import PlanStatusBadge from '../shared/PlanStatusBadge.jsx';
import { DistributionTable, TaxCenterDistributionTable } from '../shared/DistributionTable.jsx';
import { AUDIT_TYPES, REGIONS, CASE_STATUS, getTaxCentersForRegion } from '../../data/constants.js';
import PlanTimeline from '../shared/PlanTimeline.jsx';
import { useEffect } from 'react';

export default function RegionalDashboard({ view }) {
  const { state, actions, selectors } = useApp();
  const { user } = useAuth();
  const region = user.region;
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [tcAllocations, setTcAllocations] = useState({});
  const [regionalAggregate, setRegionalAggregate] = useState({}); // NEW: For aggregated view
  const [aggregateView, setAggregateView] = useState(false); // NEW: Toggle between TC and aggregate view
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [distributing, setDistributing] = useState(false);
  const [distributed, setDistributed] = useState(false);
  const [viewPlan, setViewPlan] = useState(null);
  const [viewTab, setViewTab] = useState('overview');
  const [tcFeedbackReviewModal, setTcFeedbackReviewModal] = useState(null);
  const [aggregateOverrides, setAggregateOverrides] = useState({}); // Regional Director can override aggregate
  // Case viewer for finalized plans
  const [casePlanFilter, setCasePlanFilter] = useState(null); // planId to filter cases
  const [caseSearch, setCaseSearch] = useState('');
  const [regionalPlans, setRegionalPlans] = useState([]); // ✅ Plans fetched from backend for this region
  const [plansLoading, setPlansLoading] = useState(false);

  // ✅ Fetch plans for this region from backend on component mount
  useEffect(() => {
    const loadRegionalPlans = async () => {
      setPlansLoading(true);
      try {
        const { default: planService } = await import('../../services/planService.js');
        const plans = await planService.getPlansForRegion(region);
        console.log(`✅ Loaded ${plans.length} plans for region ${region}`);
        setRegionalPlans(plans);
      } catch (error) {
        console.error('❌ Failed to load regional plans:', error);
        setRegionalPlans([]);
      } finally {
        setPlansLoading(false);
      }
    };

    if (region) {
      loadRegionalPlans();
    }
  }, [region]);

  const allPlans = regionalPlans; // ✅ Use backend-fetched regional plans instead of state.plans
  const awaitingFeedback = allPlans.filter(p => p.status === 'AWAITING_REGIONAL_FEEDBACK' && !p.regionalFeedback?.[region]);
  const submitted = allPlans.filter(p => p.status === 'AWAITING_REGIONAL_FEEDBACK' && p.regionalFeedback?.[region]);
  
  // NEW: Plans approved by Senior Mgmt - ready for Regional deployment
  const approvedToRegions = allPlans.filter(p => 
    p.status === 'APPROVED_TO_REGIONS' && !p.regionalDeployments?.[region]
  );
  
  // Plans in any post-feedback or final state visible to this region
  const finalizedPlans = allPlans.filter(p =>
    ['FEEDBACK_COLLECTED', 'AMENDMENT_REQUIRED', 'SUBMITTED_TO_SENIOR_MGMT', 'SENIOR_MGMT_APPROVED', 'SENIOR_MGMT_REJECTED', 'APPROVED_TO_REGIONS', 'FINALIZED'].includes(p.status)
  );
  // Cases for this region
  const regionCases = selectors.getCasesForRegion(region);

  const regionDist = feedbackModal?.distribution?.[region] || {};
  const regionTotal = Object.values(regionDist).reduce((s, v) => s + v, 0);

  const openFeedback = (plan) => {
    setFeedbackModal(plan);
    setFeedbackText('');
    setDistributed(false);

    const alreadyDistributed = !!(plan.tcDistributions?.[region]);
    const tcFeedback = plan.taxCenterFeedback?.[region] || {};
    const hasTCFeedback = Object.keys(tcFeedback).length > 0;

    if (hasTCFeedback) {
      const summaryLines = Object.entries(tcFeedback).map(([tcId, fb]) => {
        const tc = getTaxCentersForRegion(region).find(t => t.id === tcId);
        return `${tc?.name || tcId}: "${fb.feedback}"`;
      });
      setFeedbackText(`Consolidated Tax Center Feedback:\n${summaryLines.join('\n')}`);
    }

    const regionDist = plan.distribution?.[region] || {};
    const taxCenters = getTaxCentersForRegion(region);
    const autoAllocations = {};

    if (alreadyDistributed) {
      taxCenters.forEach(tc => {
        const existing = plan.tcDistributions[region].allocations?.[tc.id];
        if (existing) {
          const tcAdjusted = tcFeedback[tc.id]?.adjustedAllocation;
          autoAllocations[tc.id] = tcAdjusted ? { ...tcAdjusted } : { ...existing };
        } else {
          autoAllocations[tc.id] = {};
          AUDIT_TYPES.forEach(a => { autoAllocations[tc.id][a.id] = 0; });
        }
      });
    } else if (hasTCFeedback) {
      taxCenters.forEach(tc => {
        const tcFeedbackData = tcFeedback[tc.id];
        if (tcFeedbackData?.adjustedAllocation) {
          autoAllocations[tc.id] = { ...tcFeedbackData.adjustedAllocation };
        } else {
          autoAllocations[tc.id] = {};
          AUDIT_TYPES.forEach(a => { autoAllocations[tc.id][a.id] = 0; });
        }
      });
    } else {
      taxCenters.forEach((tc, index) => {
        autoAllocations[tc.id] = {};
        AUDIT_TYPES.forEach(auditType => {
          const totalForType = regionDist[auditType.id] || 0;
          const perTC = Math.floor(totalForType / taxCenters.length);
          const remainder = totalForType % taxCenters.length;
          autoAllocations[tc.id][auditType.id] = perTC + (index < remainder ? 1 : 0);
        });
      });
    }

    setTcAllocations(autoAllocations);
    setStep(alreadyDistributed ? 4 : 1);
  };

  const allColsMatch = () => {
    return AUDIT_TYPES.every(a => {
      const tcTotal = getTaxCentersForRegion(region).reduce((sum, tc) => sum + (tcAllocations[tc.id]?.[a.id] || 0), 0);
      return tcTotal === (regionDist[a.id] || 0);
    });
  };

  // NEW: Calculate regional aggregate from tax center allocations
  const calculateRegionalAggregate = () => {
    const aggregate = {};
    AUDIT_TYPES.forEach(auditType => {
      const total = getTaxCentersForRegion(region).reduce((sum, tc) => {
        return sum + (tcAllocations[tc.id]?.[auditType.id] || 0);
      }, 0);
      aggregate[auditType.id] = total;
    });
    return aggregate;
  };

  const allTCsSubmitted = () => {
    if (!feedbackModal) return false;
    const taxCenters = getTaxCentersForRegion(region);
    const tcFeedback = feedbackModal.taxCenterFeedback?.[region] || {};
    return taxCenters.every(tc => tcFeedback[tc.id]);
  };

  const doDistributeToTC = () => {
    setDistributing(true);
    setTimeout(() => {
      actions.distributeToTaxCenters(feedbackModal.id, region, tcAllocations, user.id);
      setDistributing(false);
      setDistributed(true);
      setStep(4);
    }, 300);
  };

  const doSubmit = () => {
    if (!allColsMatch()) {
      alert('❌ Validation Failed!\n\nThe tax center allocations do not match the regional targets.\n\nPlease go back to Step 2 and ensure all columns add up correctly.');
      return;
    }
    if (!feedbackText.trim()) {
      alert('❌ Feedback Required!\n\nPlease provide your regional feedback comments before submitting.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      actions.submitRegionalFeedback(feedbackModal.id, region, feedbackText, tcAllocations, user.id);
      setLoading(false);
      setFeedbackModal(null);
    }, 300);
  };

  // Cases for the case viewer modal
  const visibleCases = regionCases.filter(c => {
    if (casePlanFilter && c.planId !== casePlanFilter) return false;
    if (caseSearch) {
      const q = caseSearch.toLowerCase();
      return c.taxpayerName?.toLowerCase().includes(q) || c.tin?.toLowerCase().includes(q);
    }
    return true;
  });

  const riskColor = { CRITICAL: 'red', HIGH: 'orange', MEDIUM: 'yellow', LOW: 'blue' };
  const caseCols = [
    { key: 'tin', label: 'TIN', render: v => <span className="font-mono text-xs">{v}</span> },
    { key: 'taxpayerName', label: 'Taxpayer', render: (v, row) => (
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{v}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">{row.sector}</p>
      </div>
    )},
    { key: 'auditType', label: 'Audit Type', render: v => {
      const at = AUDIT_TYPES.find(a => a.id === v);
      return <Badge color={at?.color || 'gray'}>{at?.shortName || v}</Badge>;
    }},
    { key: 'riskLevel', label: 'Risk', render: v => <Badge color={riskColor[v] || 'gray'} dot>{v}</Badge> },
    { key: 'taxCenter', label: 'Tax Center', render: v => {
      const tc = getTaxCentersForRegion(region).find(t => t.id === v);
      return <span className="text-xs text-gray-600 dark:text-slate-400">{tc?.shortName || v}</span>;
    }},
    { key: 'status', label: 'Status', render: v => {
      const s = CASE_STATUS[v];
      return s ? <Badge color={s.color} dot>{s.label}</Badge> : <Badge>{v}</Badge>;
    }},
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Awaiting Your Feedback" value={awaitingFeedback.length} icon={Clock} color="yellow"
          sub={awaitingFeedback.length > 0 ? 'Action required' : 'All done'} />
        <StatCard label="Ready to Deploy" value={approvedToRegions.length} icon={Send} color="purple"
          sub={approvedToRegions.length > 0 ? 'Deploy to tax centers' : 'No pending deployments'} />
        <StatCard label="Feedback Submitted" value={submitted.length} icon={CheckCircle} color="green" sub="This cycle" />
        <StatCard label="Region Cases" value={regionCases.length} icon={Package} color="blue"
          sub={regionCases.length > 0 ? 'Click below to view' : 'Deployed on finalization'} />
      </div>

      {awaitingFeedback.length > 0 && (
        <Alert type="warning" title="Plans require your regional feedback">
          Please review the allocation and distribute cases to your tax centers.
        </Alert>
      )}

      {approvedToRegions.length > 0 && (
        <Alert type="success" title="Approved plans ready for deployment">
          {approvedToRegions.length} plan(s) approved by Senior Management. Deploy to your tax centers to generate audit cases.
        </Alert>
      )}

      {/* Plans approved - ready to deploy to tax centers */}
      {approvedToRegions.length > 0 && (
        <Card padding={false}>
          <div className="px-6 py-4 border-b border-gray-100 bg-green-50">
            <h3 className="text-base font-semibold text-green-900">✓ Approved Plans — Deploy to Tax Centers</h3>
            <p className="text-xs text-green-700 mt-0.5">Senior Management approved. Click "Deploy to Tax Centers" to generate audit cases.</p>
          </div>
          <div className="divide-y divide-gray-100">
            {approvedToRegions.map(plan => {
              const dist = plan.distribution?.[region] || {};
              const total = Object.values(dist).reduce((s, v) => s + v, 0);
              const tcAllocations = plan.regionalFeedback?.[region]?.taxCenterAllocations || {};

              return (
                <div key={plan.id} className="flex items-center justify-between px-6 py-4 hover:bg-blue-50 dark:hover:bg-slate-600">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{plan.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {total.toLocaleString()} cases allocated to your region
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                        <CheckCircle size={12} /> Approved by Senior Management
                      </span>
                      <span className="text-xs text-purple-600">
                        → Deploy to your {getTaxCentersForRegion(region).length} tax centers
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" icon={Eye} onClick={() => { setViewPlan(plan); setViewTab('distribution'); }}>
                      View Plan
                    </Button>
                    <Button 
                      size="sm" 
                      variant="success" 
                      icon={Send}
                      onClick={() => {
                        if (confirm(`Deploy this plan to all tax centers in ${region.replace(/_/g, ' ').toUpperCase()}?\n\nThis will generate audit cases from real taxpayer data.`)) {
                          actions.deployToTaxCenters(plan.id, region, user.id);
                        }
                      }}
                    >
                      Deploy to Tax Centers
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Plans needing feedback */}
      {awaitingFeedback.length > 0 && (
        <Card padding={false}>
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Pending Feedback</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {awaitingFeedback.map(plan => {
              const dist = plan.distribution?.[region] || {};
              const total = Object.values(dist).reduce((s, v) => s + v, 0);
              const tcFeedback = plan.taxCenterFeedback?.[region] || {};
              const tcFeedbackCount = Object.keys(tcFeedback).length;
              const tcAreReady = tcFeedbackCount > 0;

              return (
                <div key={plan.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{plan.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {total.toLocaleString()} cases allocated to your region
                    </p>
                    {!tcAreReady && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-amber-600">
                        <Clock size={16} />
                        <span>⏳ Waiting for {getTaxCentersForRegion(region).length} tax centers to provide feedback...</span>
                      </div>
                    )}
                    {tcAreReady && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle size={16} />
                        <span>✓ {tcFeedbackCount} tax center(s) provided feedback</span>
                      </div>
                    )}
                    {plan.directorComment && (
                      <p className="text-xs text-blue-600 mt-0.5 italic">Director: "{plan.directorComment}"</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" icon={Eye} onClick={() => { setViewPlan(plan); setViewTab('distribution'); }}>View</Button>
                    {tcAreReady && (
                      <Button size="sm" variant="outline" onClick={() => setTcFeedbackReviewModal(plan)}>
                        Review TC Feedback
                      </Button>
                    )}
                    <Button size="sm" variant="primary" icon={Send} onClick={() => openFeedback(plan)}>
                      Allocate & Submit
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Plans with submitted feedback */}
      {submitted.length > 0 && (
        <Card padding={false}>
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Submitted Feedback</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {submitted.map(plan => {
              const fb = plan.regionalFeedback?.[region];
              return (
                <div key={plan.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{plan.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Submitted {fb ? new Date(fb.submittedAt).toLocaleDateString() : ''}</p>
                    {fb?.feedback && <p className="text-sm text-gray-600 mt-1 italic">"{fb.feedback}"</p>}
                  </div>
                  <Badge color="green" dot>Submitted</Badge>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ── POST-FEEDBACK PLANS (finalized / in senior review / etc.) ── */}
      {finalizedPlans.length > 0 && (
        <Card padding={false}>
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Plans — Post Feedback</h3>
                <p className="text-xs text-gray-500 mt-0.5">Plans past the regional feedback stage. View plan details and status.</p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {finalizedPlans.map(plan => {
              const planCases = regionCases.filter(c => c.planId === plan.id);
              const pendingCases = planCases.filter(c => c.status === 'PENDING').length;
              const activeCases = planCases.filter(c => ['ASSIGNED', 'IN_PROGRESS'].includes(c.status)).length;
              const doneCases = planCases.filter(c => ['COMPLETED', 'CLOSED'].includes(c.status)).length;
              const dist = plan.distribution?.[region] || {};
              const planTotal = Object.values(dist).reduce((s, v) => s + v, 0);

              return (
                <div key={plan.id} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900 dark:text-white">{plan.planName}</p>
                        <PlanStatusBadge status={plan.status} />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-slate-400">FY {plan.planYear} · {planTotal.toLocaleString()} cases allocated to your region</p>

                      {/* Case stats (only when plan is FINALIZED and cases exist) */}
                      {plan.status === 'FINALIZED' && planCases.length > 0 && (
                        <div className="flex gap-4 mt-2">
                          <span className="text-xs text-gray-500 dark:text-slate-400">
                            <span className="font-semibold text-gray-700 dark:text-slate-200">{planCases.length}</span> total cases
                          </span>
                          {pendingCases > 0 && (
                            <span className="text-xs text-amber-600 font-medium">
                              ⏳ {pendingCases} pending assignment
                            </span>
                          )}
                          {activeCases > 0 && (
                            <span className="text-xs text-blue-600 font-medium">
                              ▶ {activeCases} in progress
                            </span>
                          )}
                          {doneCases > 0 && (
                            <span className="text-xs text-green-600 font-medium">
                              ✓ {doneCases} completed
                            </span>
                          )}
                        </div>
                      )}

                      {plan.status !== 'FINALIZED' && (
                        <p className="text-xs text-indigo-600 mt-1 italic">
                          {plan.status === 'FEEDBACK_COLLECTED' && 'Feedback collected — Director is preparing amendment'}
                          {plan.status === 'AMENDMENT_REQUIRED' && 'Amendment requested — planning team is revising'}
                          {plan.status === 'SUBMITTED_TO_SENIOR_MGMT' && 'Pending Senior Management approval'}
                          {plan.status === 'SENIOR_MGMT_APPROVED' && 'Senior Management approved — awaiting Director deployment'}
                          {plan.status === 'SENIOR_MGMT_REJECTED' && 'Rejected by Senior Management — Director is reviewing'}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <Button size="sm" variant="secondary" icon={Eye}
                        onClick={() => { setViewPlan(plan); setViewTab('distribution'); }}>
                        View Plan
                      </Button>
                      {/* Remove View Cases button - Regional Directors don't view cases directly */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {awaitingFeedback.length === 0 && submitted.length === 0 && finalizedPlans.length === 0 && (
        <Card>
          <Empty icon={MapPin} title="No plans to action" description="You'll be notified when the director sends a plan for regional feedback." />
        </Card>
      )}

      {/* ── CASE VIEWER MODAL ── */}
      <Modal
        open={casePlanFilter !== null || (casePlanFilter === null && regionCases.length > 0 && false)}
        onClose={() => setCasePlanFilter(null)}
        title={casePlanFilter
          ? `Cases — ${allPlans.find(p => p.id === casePlanFilter)?.name || casePlanFilter}`
          : `All Cases — ${region.replace(/_/g, ' ').toUpperCase()} Region`}
        size="xl"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                icon={Search}
                placeholder="Search by taxpayer name or TIN..."
                value={caseSearch}
                onChange={e => setCaseSearch(e.target.value)}
              />
            </div>
            <span className="text-sm text-gray-500 whitespace-nowrap">{visibleCases.length} cases</span>
          </div>

          {/* Summary by tax center */}
          {visibleCases.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {getTaxCentersForRegion(region).map(tc => {
                const tcCases = visibleCases.filter(c => c.taxCenter === tc.id);
                const pending = tcCases.filter(c => c.status === 'PENDING').length;
                return (
                  <div key={tc.id} className="bg-gray-50 rounded-lg p-3 text-center dark:bg-slate-700">
                    <p className="text-xs font-semibold text-gray-600 dark:text-slate-400">{tc.shortName}</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{tcCases.length}</p>
                    {pending > 0 && <p className="text-xs text-amber-600">{pending} pending</p>}
                  </div>
                );
              })}
            </div>
          )}

          {visibleCases.length === 0
            ? <Empty icon={Package} title="No cases found" description="No cases match your search." />
            : <Table columns={caseCols} rows={visibleCases} />
          }
        </div>
      </Modal>

      {/* Feedback modal */}
      <Modal
        open={!!feedbackModal}
        onClose={() => setFeedbackModal(null)}
        title={
          step === 1 ? 'Review Plan Allocation' :
          step === 2 ? 'Distribute to Tax Centers' :
          step === 3 ? 'Send to Tax Centers' :
          step === 4 ? 'Review Tax Center Feedback' :
          'Confirm & Submit'
        }
        size="xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-gray-400 dark:text-gray-500">Step {step} of 5</span>
            <div className="flex gap-2">
              {step > 1 && step !== 4 && <Button variant="secondary" onClick={() => setStep(s => s - 1)}>← Back</Button>}
              {step === 1 && <Button variant="secondary" onClick={() => setFeedbackModal(null)}>Cancel</Button>}
              {step < 3 && <Button onClick={() => setStep(s => s + 1)}>Next →</Button>}
              {step === 3 && (
                <Button variant="primary" icon={Send} loading={distributing} onClick={doDistributeToTC}>
                  Send to Tax Centers
                </Button>
              )}
              {step === 4 && (
                <Button
                  variant={allTCsSubmitted() ? 'primary' : 'warning'}
                  onClick={() => setStep(5)}
                  disabled={!allTCsSubmitted()}
                  title={!allTCsSubmitted() ? 'All tax centers must submit feedback first' : ''}
                >
                  {allTCsSubmitted() ? 'Proceed to Submit →' : 'Waiting for TC Feedback…'}
                </Button>
              )}
              {step === 5 && (
                <Button variant="success" icon={Send} loading={loading} onClick={doSubmit} disabled={!allColsMatch()}>
                  Submit Regional Feedback
                </Button>
              )}
            </div>
          </div>
        }
      >
        {feedbackModal && (
          <div className="space-y-4">
            {step === 1 && (
              <>
                <Alert type="info" title={`Your region (${region.replace(/_/g,' ').toUpperCase()}) allocation`}>
                  {regionTotal.toLocaleString()} total cases assigned to your region. Review the distribution by audit type, then proceed to allocate across tax centers.
                </Alert>
                <div className="bg-gray-50 rounded-xl p-4 dark:bg-slate-700">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Regional Allocation Breakdown</p>
                  <div className="grid grid-cols-3 gap-3">
                    {AUDIT_TYPES.map(a => (
                      <div key={a.id} className="bg-white rounded-lg border border-gray-200 px-3 py-2 text-center">
                        <p className="text-xs text-gray-500 dark:text-slate-400">{a.name}</p>
                        <p className="text-lg font-bold text-gray-800 tabular-nums">{regionDist[a.id] || 0}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {feedbackModal.directorComment && (
                  <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-800">
                    <strong>Director's note:</strong> {feedbackModal.directorComment}
                  </div>
                )}
              </>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <Alert type="info">Distribute all cases across your {getTaxCentersForRegion(region).length} tax centers. Each audit type column total must match the regional target shown.</Alert>
                
                {/* NEW: View Toggle */}
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 dark:bg-slate-700">
                  <p className="text-sm font-medium text-gray-700 dark:text-slate-200">View Mode:</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAggregateView(false)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        !aggregateView 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'bg-white text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      Tax Center Breakdown
                    </button>
                    <button
                      onClick={() => setAggregateView(true)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        aggregateView 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'bg-white text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      Regional Aggregate
                    </button>
                  </div>
                </div>

                {/* Tax Center Breakdown View */}
                {!aggregateView && (
                  <TaxCenterDistributionTable
                    regionId={region}
                    regionDist={regionDist}
                    tcAllocations={tcAllocations}
                    onChange={setTcAllocations}
                  />
                )}

                {/* Regional Aggregate View */}
                {aggregateView && (
                  <div className="space-y-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-slate-700 dark:border-blue-900">
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">📊 Regional Aggregate Summary</p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        This is the consolidated view combining all {getTaxCentersForRegion(region).length} tax centers. 
                        You can <strong>override individual audit type allocations</strong> before submitting to the Director.
                      </p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden dark:bg-slate-800 dark:border-gray-700">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800 dark:bg-slate-700">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-slate-200">Audit Type</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-200">Target</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-200">Aggregated</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-200">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {AUDIT_TYPES.map(a => {
                            const target = regionDist[a.id] || 0;
                            const allocated = Object.values(calculateRegionalAggregate()).length > 0 ? calculateRegionalAggregate()[a.id] || 0 : 0;
                            const matches = target === allocated;
                            return (
                              <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <span className={`inline-block w-3 h-3 rounded`} style={{backgroundColor: `var(--color-${a.color}, #999)`}}></span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{a.name}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-slate-300">{target}</td>
                                <td className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-slate-300">{allocated}</td>
                                <td className="px-4 py-3 text-center">
                                  {matches ? (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
                                      <CheckCircle size={14} /> Match
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
                                      <Clock size={14} /> {allocated > target ? '+' : ''}{allocated - target}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className="bg-gray-50 border-t-2 border-gray-200 dark:border-slate-600 dark:bg-slate-700">
                          <tr>
                            <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">TOTAL</td>
                            <td className="px-4 py-3 text-center text-sm font-bold text-gray-900 dark:text-white">{regionTotal}</td>
                            <td className="px-4 py-3 text-center text-sm font-bold text-gray-900 dark:text-white">
                              {Object.values(calculateRegionalAggregate()).reduce((sum, v) => sum + v, 0)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {allColsMatch() ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                  <CheckCircle size={14} /> Ready
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                                  <Clock size={14} /> Adjust
                                </span>
                              )}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {!allColsMatch() && (
                      <Alert type="warning" title="Allocation mismatch">
                        Some audit types don't match the target. Switch to Tax Center Breakdown view to adjust allocations.
                      </Alert>
                    )}
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <Alert type="success" title="Ready to send to tax centers">
                  Your allocation is complete. Review the breakdown below and click "Send to Tax Centers".
                </Alert>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3 dark:bg-slate-700">
                  <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Tax Center Allocations</p>
                  {getTaxCentersForRegion(region).map(tc => {
                    const tcTotal = AUDIT_TYPES.reduce((sum, a) => sum + (tcAllocations[tc.id]?.[a.id] || 0), 0);
                    return (
                      <div key={tc.id} className="bg-white rounded-lg border border-gray-200 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{tc.name}</p>
                          <p className="text-lg font-bold text-blue-600">{tcTotal} cases</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          {AUDIT_TYPES.map(a => (
                            <div key={a.id} className="flex justify-between">
                              <span className="text-gray-600 dark:text-slate-400">{a.name.split(' ')[0]}:</span>
                              <span className="font-semibold text-gray-800 dark:text-gray-200">{tcAllocations[tc.id]?.[a.id] || 0}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                {(() => {
                  const tcFeedback = feedbackModal?.taxCenterFeedback?.[region] || {};
                  const tcCount = Object.keys(tcFeedback).length;
                  const taxCenters = getTaxCentersForRegion(region);

                  if (tcCount === 0) {
                    return (
                      <Alert type="warning" title="Waiting for Tax Center feedback — action required">
                        You have distributed the plan to your {taxCenters.length} tax centers.
                        They must submit their feedback before you can submit regional feedback.
                        <br /><strong>You cannot proceed until all Tax Centers respond.</strong>
                      </Alert>
                    );
                  }

                  return (
                    <>
                      <Alert type="success" title={`${tcCount} tax center(s) provided feedback`}>
                        Review their adjusted allocations and feedback comments below.
                      </Alert>
                      <div className="bg-gray-50 rounded-xl p-4 space-y-3 dark:bg-slate-700">
                        <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Tax Center Feedback Summary</p>
                        {taxCenters.map(tc => {
                          const tcFeedbackData = tcFeedback[tc.id];
                          if (!tcFeedbackData) {
                            return (
                              <div key={tc.id} className="bg-white rounded-lg border border-gray-200 p-3">
                                <div className="flex items-center justify-between">
                                  <p className="font-semibold text-gray-700 dark:text-slate-200">{tc.name}</p>
                                  <Badge color="gray">No feedback yet</Badge>
                                </div>
                              </div>
                            );
                          }
                          const originalAlloc = tcAllocations[tc.id] || {};
                          const adjustedAlloc = tcFeedbackData.adjustedAllocation || {};
                          const hasChanges = AUDIT_TYPES.some(a =>
                            (originalAlloc[a.id] || 0) !== (adjustedAlloc[a.id] || 0)
                          );
                          return (
                            <div key={tc.id} className="bg-white rounded-lg border border-gray-200 p-3">
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{tc.name}</p>
                                {hasChanges ? <Badge color="yellow">Adjusted</Badge> : <Badge color="green">Accepted</Badge>}
                              </div>
                              {tcFeedbackData.feedback && (
                                <div className="mb-3 p-2 bg-blue-50 rounded text-sm text-blue-900 italic">
                                  <strong>Comment:</strong> {tcFeedbackData.feedback}
                                </div>
                              )}
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                {AUDIT_TYPES.map(a => {
                                  const adjusted = adjustedAlloc[a.id] || 0;
                                  const hasChange = (originalAlloc[a.id] || 0) !== adjusted;
                                  return (
                                    <div key={a.id} className="flex justify-between items-center">
                                      <span className="text-gray-600 dark:text-slate-400">{a.name.split(' ')[0]}:</span>
                                      <span className={`font-semibold ${hasChange ? 'text-orange-600' : 'text-gray-800'}`}>
                                        {adjusted}{hasChange && <span className="ml-1 text-xs">*</span>}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="bg-amber-50 rounded-xl p-3 text-sm text-amber-900">
                        <strong>Note:</strong> Tax center adjustments have been automatically applied to your allocations.
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                {!allColsMatch() && (
                  <Alert type="error" title="Allocation incomplete">Please ensure all audit type column totals match the regional targets before submitting.</Alert>
                )}
                <Alert type="info" title="Final step: Your regional feedback">
                  All allocations have been sent to your tax centers. Now provide your regional feedback for the audit director.
                </Alert>
                <Textarea
                  label="Regional Feedback / Comments *"
                  placeholder="Describe your region's capacity, concerns, or special considerations..."
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                />
                <div className="bg-gray-50 rounded-xl p-4 dark:bg-slate-700">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Summary</p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Total cases allocated: <strong className="text-blue-700">{regionTotal.toLocaleString()}</strong></p>
                  <p className="text-sm text-gray-600 mt-1">Tax centers: <strong>{getTaxCentersForRegion(region).length}</strong></p>
                  <p className="text-sm text-gray-600 mt-1">Allocations sent: <strong>✓ Yes</strong></p>
                  <p className={`text-sm mt-1 font-medium ${allColsMatch() ? 'text-green-600' : 'text-red-600'}`}>
                    {allColsMatch() ? '✓ All column totals validated' : '✗ Column totals do not match targets'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* View plan modal */}
      {viewPlan && (
        <Modal open={!!viewPlan} onClose={() => setViewPlan(null)} title={viewPlan.name} size="xl">
          <div className="space-y-4">
            <Tabs
              tabs={[{ id: 'distribution', label: 'Full Distribution' }, { id: 'timeline', label: 'Timeline' }]}
              active={viewTab} onChange={setViewTab}
            />
            {viewTab === 'distribution' && (
              <div>
                <Alert type="info" className="mb-4">
                  Showing allocation for <strong>{region.replace(/_/g, ' ').toUpperCase()}</strong> region only
                </Alert>
                <DistributionTable
                  distribution={{ [region]: viewPlan.distribution?.[region] || {} }}
                  regions={[REGIONS.find(r => r.id === region)].filter(Boolean)}
                />
              </div>
            )}
            {viewTab === 'timeline' && <PlanTimeline plan={viewPlan} />}
          </div>
        </Modal>
      )}

      {/* Tax Center Feedback Review Modal */}
      {tcFeedbackReviewModal && (
        <Modal
          open={!!tcFeedbackReviewModal}
          onClose={() => setTcFeedbackReviewModal(null)}
          title="Tax Center Feedback Review"
          size="xl"
        >
          <div className="space-y-4">
            {(() => {
              const tcFeedback = tcFeedbackReviewModal.taxCenterFeedback?.[region] || {};
              const tcCount = Object.keys(tcFeedback).length;
              const taxCenters = getTaxCentersForRegion(region);

              if (tcCount === 0) {
                return (
                  <Alert type="info" title="No feedback submitted yet">
                    None of your tax centers have submitted feedback for this plan yet.
                  </Alert>
                );
              }

              return (
                <>
                  <Alert type="success" title={`${tcCount} of ${taxCenters.length} tax center(s) submitted feedback`}>
                    Review their adjusted allocations and comments below.
                  </Alert>
                  <div className="space-y-3">
                    {taxCenters.map(tc => {
                      const tcFeedbackData = tcFeedback[tc.id];
                      if (!tcFeedbackData) {
                        return (
                          <div key={tc.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4 dark:bg-slate-700">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-gray-700 dark:text-slate-200">{tc.name}</p>
                              <Badge color="gray">Pending</Badge>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">No feedback submitted yet</p>
                          </div>
                        );
                      }
                      const adjustedAlloc = tcFeedbackData.adjustedAllocation || {};
                      const totalCases = AUDIT_TYPES.reduce((sum, a) => sum + (adjustedAlloc[a.id] || 0), 0);
                      return (
                        <div key={tc.id} className="bg-white rounded-lg border-2 border-green-200 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{tc.name}</p>
                              <p className="text-xs text-gray-500 dark:text-slate-400">
                                Submitted {new Date(tcFeedbackData.submittedAt).toLocaleDateString()} at {new Date(tcFeedbackData.submittedAt).toLocaleTimeString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge color="green" dot>Submitted</Badge>
                              <p className="text-lg font-bold text-blue-600 mt-1">{totalCases} cases</p>
                            </div>
                          </div>
                          {tcFeedbackData.feedback && (
                            <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                              <p className="text-xs font-semibold text-blue-900 mb-1">Feedback Comment:</p>
                              <p className="text-sm text-blue-900 italic">"{tcFeedbackData.feedback}"</p>
                            </div>
                          )}
                          <div className="bg-gray-50 rounded-lg p-3 dark:bg-slate-700">
                            <p className="text-xs font-semibold text-gray-700 mb-2">Adjusted Allocation by Audit Type:</p>
                            <div className="grid grid-cols-3 gap-3">
                              {AUDIT_TYPES.map(a => (
                                <div key={a.id} className="bg-white rounded border border-gray-200 px-3 py-2 text-center">
                                  <p className="text-xs text-gray-600 dark:text-slate-400">{a.name}</p>
                                  <p className="text-lg font-bold text-gray-900 dark:text-white">{adjustedAlloc[a.id] || 0}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </div>
        </Modal>
      )}
    </div>
  );
}
