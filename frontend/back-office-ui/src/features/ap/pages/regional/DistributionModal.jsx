import { useState, useEffect } from 'react';
import { Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Modal, Button, Alert, Tabs, Textarea, Badge } from '../../../../components/ui/index.jsx';
import { AUDIT_TYPES, getTaxCentersForRegion } from '../../data/constants.js';
import { TaxCenterDistributionTable } from '../shared/DistributionTable.jsx';

export default function DistributionModal({ 
  open, 
  plan, 
  region, 
  tcAllocations, 
  onTcAllocationsChange, 
  onDistribute, 
  onClose,
  loading 
}) {
  const [step, setStep] = useState(1);
  const [aggregateView, setAggregateView] = useState(false);

  // ✅ AUTO-DIVIDE: Allocate equally between tax centers on first open
  // IMPORTANT: Must be called BEFORE the `if (!plan) return null;` check
  // Otherwise React Rules of Hooks are violated on conditional rendering
  useEffect(() => {
    if (open && plan && region && Object.keys(tcAllocations).length === 0) {
      console.log('📊 Auto-dividing regional allocation equally to tax centers...');
      const regionDist = plan.distribution?.[region] || plan.regionAllocatedCases || {};
      const taxCenters = getTaxCentersForRegion(region);
      
      if (taxCenters.length === 0) {
        console.warn('⚠️ No tax centers found for region:', region);
        return;
      }

      const newAllocations = {};
      taxCenters.forEach(tc => {
        const tcAlloc = {};
        AUDIT_TYPES.forEach(auditType => {
          const regionalAmount = regionDist[auditType.id] || 0;
          // Divide equally: baseAmount + 1 for first N TCs if remainder
          const baseAmount = Math.floor(regionalAmount / taxCenters.length);
          const remainder = regionalAmount % taxCenters.length;
          const tcIndex = taxCenters.indexOf(tc);
          const allocation = baseAmount + (tcIndex < remainder ? 1 : 0);
          tcAlloc[auditType.id] = allocation;
        });
        newAllocations[tc.id] = tcAlloc;
      });

      console.log('✅ Auto-divided allocations created:', Object.keys(newAllocations).length, 'tax centers');
      onTcAllocationsChange(newAllocations);
    }
  }, [open, plan, region, tcAllocations, onTcAllocationsChange]);

  if (!plan) return null;

  const regionDist = plan.distribution?.[region] || plan.regionAllocatedCases || {};
  const regionTotal = Object.values(regionDist).reduce((s, v) => s + v, 0);

  const calculateAggregate = () => {
    const agg = {};
    AUDIT_TYPES.forEach(auditType => {
      const total = getTaxCentersForRegion(region).reduce((sum, tc) => {
        return sum + (tcAllocations[tc.id]?.[auditType.id] || 0);
      }, 0);
      agg[auditType.id] = total;
    });
    return agg;
  };

  const aggregate = calculateAggregate();
  const allColsMatch = () => {
    return AUDIT_TYPES.every(a => {
      const tcTotal = getTaxCentersForRegion(region).reduce((sum, tc) => 
        sum + (tcAllocations[tc.id]?.[a.id] || 0), 0);
      return tcTotal === (regionDist[a.id] || 0);
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        step === 1 ? '📊 Step 1: Review Regional Allocation' :
        step === 2 ? '📤 Step 2: Distribute to Tax Centers' :
        '✓ Step 3: Confirm Distribution'
      }
      size="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-gray-400">Step {step} of 3</span>
          <div className="flex gap-2">
            {step > 1 && <Button variant="secondary" onClick={() => setStep(s => s - 1)}>← Back</Button>}
            {step < 3 && <Button onClick={() => setStep(s => s + 1)}>Next →</Button>}
            {step === 3 && (
              <Button 
                variant={plan?.status === 'SENT_TO_TAX_CENTERS' ? 'secondary' : 'success'}
                icon={plan?.status === 'SENT_TO_TAX_CENTERS' ? CheckCircle : Send} 
                loading={loading} 
                onClick={() => {
                  if (plan?.status !== 'SENT_TO_TAX_CENTERS') {
                    onDistribute();
                    setStep(1); // Reset for next time
                  }
                }}
                disabled={!allColsMatch() || plan?.status === 'SENT_TO_TAX_CENTERS'}
              >
                {plan?.status === 'SENT_TO_TAX_CENTERS' ? '✓ Sent (Read-only)' : 'Confirm & Send to Tax Centers'}
              </Button>
            )}
          </div>
        </div>
      }
    >
      {/* STEP 1: Review Regional Allocation */}
      {step === 1 && (
        <div className="space-y-4">
          <Alert type="info" title={`Your region allocation: ${regionTotal.toLocaleString()} cases`}>
            This is the total allocation sent by the Director for your region. 
            You will now distribute these cases across your {getTaxCentersForRegion(region).length} tax centers.
          </Alert>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 dark:from-blue-900 dark:to-indigo-900 border border-blue-200 dark:border-blue-700">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3">Regional Allocation by Audit Type</p>
            <div className="grid grid-cols-3 gap-3">
              {AUDIT_TYPES.map(a => (
                <div key={a.id} className="bg-white rounded-lg border border-blue-200 px-4 py-3 text-center dark:bg-slate-800 dark:border-blue-700">
                  <p className="text-xs text-blue-600 dark:text-blue-300 font-semibold">{a.name}</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">{regionDist[a.id] || 0}</p>
                  <p className="text-xs text-blue-500 dark:text-blue-400">cases</p>
                </div>
              ))}
            </div>
          </div>

          {plan.directorComment && (
            <Alert type="warning" title="Director's Note">
              {plan.directorComment}
            </Alert>
          )}
        </div>
      )}

      {/* STEP 2: Distribute to Tax Centers */}
      {step === 2 && (
        <div className="space-y-4">
          <Alert type="info">
            Allocate all {regionTotal.toLocaleString()} cases across your {getTaxCentersForRegion(region).length} tax centers. 
            Each audit type column must total exactly the regional target.
          </Alert>

          {/* View Toggle */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 dark:bg-slate-700 border border-gray-200 dark:border-slate-600">
            <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">View Mode:</p>
            <div className="flex gap-2">
              <button
                onClick={() => setAggregateView(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  !aggregateView 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Tax Center Breakdown
              </button>
              <button
                onClick={() => setAggregateView(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  aggregateView 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
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
              onChange={onTcAllocationsChange}
            />
          )}

          {/* Regional Aggregate View */}
          {aggregateView && (
            <div className="space-y-3">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden dark:bg-slate-800 dark:border-gray-700">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-slate-300">Audit Type</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-300">Target</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-300">Allocated</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-300">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                    {AUDIT_TYPES.map(a => {
                      const target = regionDist[a.id] || 0;
                      const allocated = aggregate[a.id] || 0;
                      const matches = target === allocated;
                      return (
                        <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{a.name}</span>
                          </td>
                          <td className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-slate-300">{target}</td>
                          <td className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-slate-300">{allocated}</td>
                          <td className="px-4 py-3 text-center">
                            {matches ? (
                              <Badge color="green" dot>✓ Match</Badge>
                            ) : (
                              <Badge color={allocated > target ? 'blue' : 'amber'} dot>
                                {allocated > target ? '+' : ''}{allocated - target}
                              </Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-slate-700 border-t-2 border-gray-200 dark:border-slate-600">
                    <tr>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">TOTAL</td>
                      <td className="px-4 py-3 text-center text-sm font-bold text-gray-900 dark:text-white">{regionTotal}</td>
                      <td className="px-4 py-3 text-center text-sm font-bold text-gray-900 dark:text-white">
                        {Object.values(aggregate).reduce((s, v) => s + v, 0)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {allColsMatch() ? (
                          <Badge color="green" dot>✓ Ready</Badge>
                        ) : (
                          <Badge color="amber" dot>Adjust</Badge>
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {!allColsMatch() && (
                <Alert type="warning" title="Allocation mismatch">
                  Some audit types don't add up to the regional target. Go back to Tax Center Breakdown view and adjust.
                </Alert>
              )}
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Confirm Distribution */}
      {step === 3 && (
        <div className="space-y-4">
          {plan?.status === 'SENT_TO_TAX_CENTERS' ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 dark:bg-green-900 dark:border-green-700">
              <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">✓ Distribution Already Sent</p>
              <p className="text-sm text-green-800 dark:text-green-200">
                This distribution has already been sent to tax centers. The plan is now in read-only mode.
                Tax centers are reviewing their allocations and will provide feedback.
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 dark:bg-green-900 dark:border-green-700">
              <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">✓ Distribution Ready to Send</p>
              <p className="text-sm text-green-800 dark:text-green-200">
                Your allocation has been validated and is ready to send to all tax centers. 
                They will receive their targets and can provide capacity feedback.
              </p>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4 dark:bg-slate-700">
            <p className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-3">Distribution Summary:</p>
            <div className="space-y-2">
              {getTaxCentersForRegion(region).map(tc => {
                const tcTotal = AUDIT_TYPES.reduce((sum, a) => 
                  sum + (tcAllocations[tc.id]?.[a.id] || 0), 0);
                return (
                  <div key={tc.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-slate-300">{tc.name}</span>
                    <Badge>{tcTotal} cases</Badge>
                  </div>
                );
              })}
            </div>
          </div>

          <Alert type="info" title="What happens next?">
            {plan?.status === 'SENT_TO_TAX_CENTERS' ? (
              <div className="space-y-2">
                <p>Tax centers are currently reviewing their allocations:</p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>Tax centers will review their allocation</li>
                  <li>They will provide capacity feedback on feasibility</li>
                  <li>You will aggregate their feedback once all respond</li>
                  <li>Then you will submit your analysis to the Director</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-2">
                <p>After you send this distribution:</p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>Tax centers will see their allocation</li>
                  <li>They will review and provide capacity feedback</li>
                  <li>You will wait for all tax centers to respond</li>
                  <li>Then you can review and aggregate their feedback</li>
                  <li>Finally, you submit your analysis to the Director</li>
                </ul>
              </div>
            )}
          </Alert>
        </div>
      )}
    </Modal>
  );
}
