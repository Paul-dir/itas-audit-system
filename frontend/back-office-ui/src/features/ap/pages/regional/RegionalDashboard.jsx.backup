import { useState } from 'react';
import { MapPin, Send, CheckCircle, Clock, Eye, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Card, Button, Alert, Badge, StatCard, Modal, Textarea, Tabs, Empty } from '../../components/ui/index.jsx';
import PlanStatusBadge from '../shared/PlanStatusBadge.jsx';
import { DistributionTable, TaxCenterDistributionTable } from '../shared/DistributionTable.jsx';
import { AUDIT_TYPES, REGIONS, getTaxCentersForRegion } from '../../data/constants.js';
import PlanTimeline from '../shared/PlanTimeline.jsx';

export default function RegionalDashboard({ view }) {
  const { state, actions, selectors } = useApp();
  const { user } = useAuth();
  const region = user.region;
  const [feedbackModal, setFeedbackModal] = useState(null); // the plan being given feedback for
  const [feedbackText, setFeedbackText] = useState('');
  const [tcAllocations, setTcAllocations] = useState({});
  const [step, setStep] = useState(1); // 1: review, 2: tc allocations, 3: send to TC, 4: collect TC feedback, 5: final submission
  const [loading, setLoading] = useState(false);
  const [viewPlan, setViewPlan] = useState(null);
  const [viewTab, setViewTab] = useState('overview');
  const [tcFeedbackReviewModal, setTcFeedbackReviewModal] = useState(null);

  const allPlans = state.plans;
  const awaitingFeedback = allPlans.filter(p => p.status === 'AWAITING_REGIONAL_FEEDBACK' && !p.regionalFeedback?.[region]);
  console.log("Regional Dashboard - Awaiting feedback:", awaitingFeedback.length, awaitingFeedback);
  const submitted = allPlans.filter(p => p.status === 'AWAITING_REGIONAL_FEEDBACK' && p.regionalFeedback?.[region]);
  const finalized = allPlans.filter(p => ['FEEDBACK_COLLECTED','SUBMITTED_TO_SENIOR_MGMT','SENIOR_MGMT_APPROVED','FINALIZED'].includes(p.status));

  const regionDist = feedbackModal?.distribution?.[region] || {};
  const regionTotal = Object.values(regionDist).reduce((s, v) => s + v, 0);

  const openFeedback = (plan) => {
    setFeedbackModal(plan);
    setFeedbackText('');
    
    // Check if tax centers have provided feedback
    const tcFeedback = plan.taxCenterFeedback?.[region] || {};
    const hasTCFeedback = Object.keys(tcFeedback).length > 0;
    
    // If tax centers provided feedback, use their adjusted allocations as default
    // Otherwise, auto-distribute evenly
    const regionDist = plan.distribution?.[region] || {};
    const taxCenters = getTaxCentersForRegion(region);
    const autoAllocations = {};
    
    if (hasTCFeedback) {
      // Use tax center adjusted allocations
      taxCenters.forEach(tc => {
        const tcFeedbackData = tcFeedback[tc.id];
        if (tcFeedbackData?.adjustedAllocation) {
          autoAllocations[tc.id] = { ...tcFeedbackData.adjustedAllocation };
        } else {
          // If this TC didn't provide feedback, give them 0
          autoAllocations[tc.id] = {};
          AUDIT_TYPES.forEach(auditType => {
            autoAllocations[tc.id][auditType.id] = 0;
          });
        }
      });
    } else {
      // Auto-distribute evenly across tax centers
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
    setStep(1);
  };

  const allColsMatch = () => {
    return AUDIT_TYPES.every(a => {
      const tcTotal = getTaxCentersForRegion(region).reduce((sum, tc) => sum + (tcAllocations[tc.id]?.[a.id] || 0), 0);
      return tcTotal === (regionDist[a.id] || 0);
    });
  };

  const doSubmit = () => {
    if (!allColsMatch()) return;
    setLoading(true);
    setTimeout(() => {
      actions.submitRegionalFeedback(feedbackModal.id, region, feedbackText, tcAllocations, user.id);
      setLoading(false);
      setFeedbackModal(null);
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Awaiting Your Feedback" value={awaitingFeedback.length} icon={Clock} color="yellow"
          sub={awaitingFeedback.length > 0 ? 'Action required' : 'All done'} />
        <StatCard label="Feedback Submitted" value={submitted.length} icon={CheckCircle} color="green" sub="This cycle" />
        <StatCard label="Finalized Plans" value={finalized.length} icon={MapPin} color="blue" sub="Deployed to your region" />
      </div>

      {awaitingFeedback.length > 0 && (
        <Alert type="warning" title="Plans require your regional feedback">
          Please review the allocation and distribute cases to your tax centers.
        </Alert>
      )}

      {/* Plans needing feedback */}
      {awaitingFeedback.length > 0 && (
        <Card padding={false}>
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">Pending Feedback</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {awaitingFeedback.map(plan => {
              const dist = plan.distribution?.[region] || {};
              const total = Object.values(dist).reduce((s, v) => s + v, 0);
              
              // ✅ Check if tax centers have provided feedback for this region
              const tcFeedback = plan.taxCenterFeedback?.[region] || {};
              const tcFeedbackCount = Object.keys(tcFeedback).length;
              const tcAreReady = tcFeedbackCount > 0;
              
              return (
                <div key={plan.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-900">{plan.name}</p>
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
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">Submitted Feedback</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {submitted.map(plan => {
              const fb = plan.regionalFeedback?.[region];
              return (
                <div key={plan.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-900">{plan.name}</p>
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

      {awaitingFeedback.length === 0 && submitted.length === 0 && (
        <Card>
          <Empty icon={MapPin} title="No plans to action" description="You'll be notified when the director sends a plan for regional feedback." />
        </Card>
      )}

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
            <span className="text-xs text-gray-400">Step {step} of 5</span>
            <div className="flex gap-2">
              {step > 1 && <Button variant="secondary" onClick={() => setStep(s => s - 1)}>← Back</Button>}
              {step === 1 && <Button variant="secondary" onClick={() => setFeedbackModal(null)}>Cancel</Button>}
              {step < 5 && <Button onClick={() => setStep(s => s + 1)}>Next →</Button>}
              {step === 5 && (
                <Button variant="success" icon={Send} loading={loading} onClick={doSubmit} disabled={!allColsMatch()}>
                  Submit Feedback
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
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Regional Allocation Breakdown</p>
                  <div className="grid grid-cols-3 gap-3">
                    {AUDIT_TYPES.map(a => (
                      <div key={a.id} className="bg-white rounded-lg border border-gray-200 px-3 py-2 text-center">
                        <p className="text-xs text-gray-500">{a.name}</p>
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
                <Alert type="info">Distribute all cases across your 3 tax centers. Each audit type column total must match the regional target shown.</Alert>
                <TaxCenterDistributionTable
                  regionId={region}
                  regionDist={regionDist}
                  tcAllocations={tcAllocations}
                  onChange={setTcAllocations}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <Alert type="success" title="Ready to send to tax centers">
                  Your allocation is complete. Review the breakdown below and click "Next" to send to your {getTaxCentersForRegion(region).length} tax centers.
                </Alert>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-semibold text-gray-700">Tax Center Allocations</p>
                  {getTaxCentersForRegion(region).map(tc => {
                    const tcTotal = AUDIT_TYPES.reduce((sum, a) => sum + (tcAllocations[tc.id]?.[a.id] || 0), 0);
                    return (
                      <div key={tc.id} className="bg-white rounded-lg border border-gray-200 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-gray-800">{tc.name}</p>
                          <p className="text-lg font-bold text-blue-600">{tcTotal} cases</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          {AUDIT_TYPES.map(a => (
                            <div key={a.id} className="flex justify-between">
                              <span className="text-gray-600">{a.name.split(' ')[0]}:</span>
                              <span className="font-semibold text-gray-800">{tcAllocations[tc.id]?.[a.id] || 0}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-800">
                  <strong>Next step:</strong> Click "Next" to send these allocations to your tax centers. They will receive their breakdown and can provide feedback.
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
                      <Alert type="info" title="No tax center feedback yet">
                        Tax centers haven't submitted their feedback yet. You can proceed to submit your regional feedback now, or wait for their input to aggregate their adjustments.
                      </Alert>
                    );
                  }
                  
                  return (
                    <>
                      <Alert type="success" title={`${tcCount} tax center(s) provided feedback`}>
                        Review their adjusted allocations and feedback comments below. The allocations have been pre-filled with their adjustments.
                      </Alert>
                      
                      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <p className="text-sm font-semibold text-gray-700">Tax Center Feedback Summary</p>
                        {taxCenters.map(tc => {
                          const tcFeedbackData = tcFeedback[tc.id];
                          
                          if (!tcFeedbackData) {
                            return (
                              <div key={tc.id} className="bg-white rounded-lg border border-gray-200 p-3">
                                <div className="flex items-center justify-between">
                                  <p className="font-semibold text-gray-700">{tc.name}</p>
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
                                <p className="font-semibold text-gray-800">{tc.name}</p>
                                {hasChanges ? (
                                  <Badge color="yellow">Adjusted</Badge>
                                ) : (
                                  <Badge color="green">Accepted</Badge>
                                )}
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
                                      <span className="text-gray-600">{a.name.split(' ')[0]}:</span>
                                      <span className={`font-semibold ${hasChange ? 'text-orange-600' : 'text-gray-800'}`}>
                                        {adjusted}
                                        {hasChange && <span className="ml-1 text-xs">*</span>}
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
                        <strong>Note:</strong> Tax center adjustments have been automatically applied to your allocations. You can review and modify them in the next step if needed.
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
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Summary</p>
                  <p className="text-sm text-gray-600">Total cases allocated: <strong className="text-blue-700">{regionTotal.toLocaleString()}</strong></p>
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
                          <div key={tc.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-gray-700">{tc.name}</p>
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
                              <p className="font-semibold text-gray-900">{tc.name}</p>
                              <p className="text-xs text-gray-500">
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
                          
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs font-semibold text-gray-700 mb-2">Adjusted Allocation by Audit Type:</p>
                            <div className="grid grid-cols-3 gap-3">
                              {AUDIT_TYPES.map(a => (
                                <div key={a.id} className="bg-white rounded border border-gray-200 px-3 py-2 text-center">
                                  <p className="text-xs text-gray-600">{a.name}</p>
                                  <p className="text-lg font-bold text-gray-900">{adjustedAlloc[a.id] || 0}</p>
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
