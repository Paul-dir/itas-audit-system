import { useState } from 'react';
import { Send, CheckCircle, Clock, AlertCircle, Eye, Edit2 } from 'lucide-react';
import { Modal, Button, Alert, Textarea, Badge } from '../../../../components/ui/index.jsx';
import { AUDIT_TYPES, getTaxCentersForRegion } from '../../data/constants.js';

export default function FeedbackSubmissionModal({ 
  open, 
  plan, 
  region, 
  tcAllocations,
  capacityOverrides,
  feedbackText,
  onFeedbackTextChange,
  onSubmit, 
  loading,
  onClose
}) {
  const [step, setStep] = useState(1);
  const [showTCDetails, setShowTCDetails] = useState(false);
  const [internalCapacityOverrides, setInternalCapacityOverrides] = useState({}); // Store overridden TC Capacity values in this modal
  const [editingCapacity, setEditingCapacity] = useState(null); // Which audit type is being edited
  const [editModalOpen, setEditModalOpen] = useState(false); // Modal for editing
  const [editModalAuditType, setEditModalAuditType] = useState(null); // Which audit type being edited
  const [editModalValue, setEditModalValue] = useState(''); // Value in the edit modal

  if (!plan) return null;

  const regionDist = plan.distribution?.[region] || plan.regionAllocatedCases || {};
  const regionTotal = Object.values(regionDist).reduce((s, v) => s + v, 0);
  const tcFeedback = plan.taxCenterFeedback?.[region] || {};
  const tcFeedbackCount = Object.keys(tcFeedback).length;
  const allTCsSubmitted = tcFeedbackCount === getTaxCentersForRegion(region).length;
  const atLeastOneTCSubmitted = tcFeedbackCount > 0;

  const calculateAggregate = () => {
    const agg = {};
    AUDIT_TYPES.forEach(auditType => {
      // Use override if exists, otherwise calculate from tcAllocations
      if (internalCapacityOverrides[auditType.id] !== undefined) {
        agg[auditType.id] = internalCapacityOverrides[auditType.id];
      } else {
        let total = 0;
        getTaxCentersForRegion(region).forEach(tc => {
          total += tcAllocations[tc.id]?.[auditType.id] || 0;
        });
        agg[auditType.id] = total;
      }
    });
    return agg;
  };

  const handleCapacityEdit = (auditTypeId, newValue) => {
    const parsed = parseInt(newValue) || 0;
    setCapacityOverrides(prev => ({
      ...prev,
      [auditTypeId]: parsed
    }));
    setEditingCapacity(null);
    console.log(`✅ TC Capacity for ${auditTypeId} updated to ${parsed}`);
  };

  const openEditModal = (auditTypeId) => {
    const currentValue = aggregate[auditTypeId] || 0;
    setEditModalAuditType(auditTypeId);
    setEditModalValue(currentValue.toString());
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditModalAuditType(null);
    setEditModalValue('');
  };

  const saveEditModal = () => {
    const parsed = parseInt(editModalValue) || 0;
    setInternalCapacityOverrides(prev => ({
      ...prev,
      [editModalAuditType]: parsed
    }));
    console.log(`✅ TC Capacity for ${editModalAuditType} updated to ${parsed}`);
    closeEditModal();
  };

  const aggregate = calculateAggregate();
  const allColsMatch = () => {
    return AUDIT_TYPES.every(a => {
      const tcTotal = getTaxCentersForRegion(region).reduce((sum, tc) => 
        sum + (tcAllocations[tc.id]?.[a.id] || 0), 0);
      return tcTotal === (regionDist[a.id] || 0);
    });
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const handleSubmit = () => {
    if (!feedbackText.trim()) {
      alert('⚠️ Please provide your regional feedback/analysis before submitting.');
      return;
    }
    // Call the parent onSubmit with internalCapacityOverrides
    onSubmit(internalCapacityOverrides || {});
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        title={
          step === 1 ? '📊 Step 1: Review Tax Center Capacity Assessment' :
          '📝 Step 2: Provide Regional Analysis & Recommendation'
        }
      size="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs font-medium text-gray-500 dark:text-slate-400">Step {step} of 2</span>
          <div className="flex gap-3">
            {step === 1 && (
              <>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button onClick={() => setStep(2)} disabled={!atLeastOneTCSubmitted}>
                  Next: Add Analysis →
                </Button>
              </>
            )}
            {step === 2 && (
              <>
                <Button variant="secondary" onClick={() => setStep(1)}>← Back to Review</Button>
                <Button 
                  variant="primary" 
                  icon={Send} 
                  loading={loading} 
                  onClick={handleSubmit}
                  disabled={!feedbackText.trim()}
                >
                  Submit Feedback
                </Button>
              </>
            )}
          </div>
        </div>
      }
    >
      {/* STEP 1: Review Tax Center Feedback */}
      {step === 1 && (
        <div className="space-y-4">
          {!atLeastOneTCSubmitted && (
            <Alert type="warning" title="Waiting for Tax Center Feedback">
              <p className="text-sm">No tax centers have submitted feedback yet. Check back later or contact your tax centers directly.</p>
            </Alert>
          )}

          {atLeastOneTCSubmitted && !allTCsSubmitted && (
            <Alert type="info" title="Partial Feedback Received">
              <p className="text-sm"><strong>{tcFeedbackCount} of {getTaxCentersForRegion(region).length}</strong> tax centers have provided feedback. You may proceed to provide your regional analysis based on available input, or wait for remaining tax centers.</p>
            </Alert>
          )}

          {allTCsSubmitted && (
            <Alert type="success" title="Complete Feedback Received">
              <p className="text-sm">All <strong>{tcFeedbackCount} tax centers</strong> have submitted their detailed feedback and capacity assessments.</p>
            </Alert>
          )}

          {/* Aggregated Feedback Summary */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden dark:bg-slate-800 dark:border-gray-700 shadow-sm">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-800 px-6 py-4 border-b border-gray-200 dark:border-slate-600">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">📊</span>
                <p className="text-base font-bold text-gray-900 dark:text-white">Aggregated Capacity Assessment</p>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-300 ml-8">Summary of tax center feedback by audit type - click any value to adjust</p>
            </div>

            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-200">Audit Type</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-slate-200">Regional Target</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-slate-200">TC Capacity</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-slate-200">Variance</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-slate-200">Assessment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {AUDIT_TYPES.map(a => {
                  const target = regionDist[a.id] || 0;
                  const capacity = aggregate[a.id] || 0;
                  const gap = capacity - target;
                  const isFeasible = gap >= 0;
                  const isEditing = editingCapacity === a.id;
                  const isOverridden = capacityOverrides[a.id] !== undefined;
                  
                  return (
                    <tr key={a.id} className={`transition-colors ${isOverridden ? 'bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30' : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full" style={{backgroundColor: `var(--color-${a.color}, #e5e7eb)20`}}>
                            <span className="text-xs font-bold" style={{color: `var(--color-${a.color}, #666)`}}>●</span>
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{a.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-bold text-gray-700 dark:text-slate-300">{target.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {(() => {
                          const auditTypeName = a.name;
                          const isOverridden = internalCapacityOverrides[a.id] !== undefined;
                          
                          return (
                            <button
                              onClick={() => openEditModal(a.id)}
                              className={`w-full px-3 py-2 rounded-lg transition-all font-semibold text-sm flex items-center justify-center gap-2 ${
                                isOverridden
                                  ? 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-400 dark:border-blue-600 hover:bg-blue-200 dark:hover:bg-blue-900'
                                  : 'text-gray-700 dark:text-slate-300 bg-gray-50 dark:bg-slate-700/50 border-2 border-transparent hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700'
                              }`}
                              title={`Click to edit ${auditTypeName} capacity`}
                            >
                              {capacity.toLocaleString()}
                              <Edit2 size={14} className="opacity-60" />
                            </button>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-sm font-bold ${gap === 0 ? 'text-green-600 dark:text-green-400' : gap > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                          {gap > 0 ? '+' : ''}{gap.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {gap === 0 && (
                          <Badge color="green" dot>Match</Badge>
                        )}
                        {gap > 0 && (
                          <Badge color="blue" dot>Surplus</Badge>
                        )}
                        {gap < 0 && (
                          <Badge color="red" dot>Shortfall</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 border-t-2 border-gray-200 dark:border-slate-600">
                <tr>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">TOTAL CAPACITY</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white">{regionTotal.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-gray-900 dark:text-white">
                    {Object.values(aggregate).reduce((s, v) => s + v, 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-bold" 
                    style={{ color: regionTotal === Object.values(aggregate).reduce((s, v) => s + v, 0) ? '#059669' : Object.values(aggregate).reduce((s, v) => s + v, 0) > regionTotal ? '#2563eb' : '#dc2626' }}>
                    {Object.values(aggregate).reduce((s, v) => s + v, 0) - regionTotal > 0 ? '+' : ''}
                    {(Object.values(aggregate).reduce((s, v) => s + v, 0) - regionTotal).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {regionTotal === Object.values(aggregate).reduce((s, v) => s + v, 0) ? (
                      <Badge color="green" dot>✓ Balanced</Badge>
                    ) : Object.values(aggregate).reduce((s, v) => s + v, 0) > regionTotal ? (
                      <Badge color="blue" dot>Excess</Badge>
                    ) : (
                      <Badge color="amber" dot>Review</Badge>
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>

            <div className="bg-amber-50 dark:bg-amber-900/20 border-t border-amber-200 dark:border-amber-800 px-6 py-3">
              <p className="text-xs text-amber-900 dark:text-amber-200">
                <strong>💡 Note:</strong> Click any TC Capacity value to adjust based on your assessment. Your edits along with regional analysis will be submitted to the Director for review.
              </p>
            </div>
          </div>

          {/* Tax Center Details Toggle */}
          <button
            onClick={() => setShowTCDetails(!showTCDetails)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-2 transition-colors"
          >
            <Eye size={16} />
            {showTCDetails ? '✕ Hide' : '+ Show'} individual tax center feedback details
          </button>

          {showTCDetails && (
            <div className="space-y-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">Individual Tax Center Assessment</p>
              {getTaxCentersForRegion(region).map(tc => {
                const fb = tcFeedback[tc.id];
                if (!fb) return (
                  <div key={tc.id} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{tc.name}</p>
                      <Badge color="gray" dot>Pending</Badge>
                    </div>
                  </div>
                );
                return (
                  <div key={tc.id} className="bg-white dark:bg-slate-800 rounded-lg border border-green-200 dark:border-green-800 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{tc.name}</p>
                      <Badge color="green" dot>Feedback Received</Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 bg-blue-50 dark:bg-blue-900/20 rounded px-3 py-2 border-l-2 border-blue-400">
                      <strong>Assessment:</strong> <em>"{fb.feedback || '—'}"</em>
                    </p>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Capacity by Audit Type:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {AUDIT_TYPES.map(a => {
                          const original = fb.originalAllocation?.[a.id] || 0;
                          const adjusted = fb.adjustedAllocation?.[a.id] || 0;
                          const hasChanged = original !== adjusted;
                          return (
                            <div key={a.id} className={`flex items-center gap-2 p-2 rounded transition-colors ${hasChanged ? 'bg-amber-50 dark:bg-amber-900/30' : 'bg-slate-50 dark:bg-slate-700/30'}`}>
                              <span className="w-24 font-medium text-slate-600 dark:text-slate-400">{a.shortName}:</span>
                              {hasChanged ? (
                                <div className="flex items-center gap-1">
                                  <span className="line-through text-slate-400 text-xs">{original}</span>
                                  <span className="text-slate-400 text-xs">→</span>
                                  <span className={`font-bold ${adjusted < original ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>{adjusted}</span>
                                </div>
                              ) : (
                                <span className="font-bold text-slate-700 dark:text-slate-300">{adjusted}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* STEP 2: Add Regional Analysis */}
      {step === 2 && (
        <div className="space-y-4">
          <Alert type="info" title="Regional Director's Analysis & Assessment">
            <p className="text-sm">Based on the tax center feedback review, provide your professional assessment of plan feasibility and recommendations for the Audit Director. Include any capacity constraints, staffing considerations, and risk mitigation strategies.</p>
          </Alert>

          <div className="space-y-3">
            <label className="block">
              <span className="text-sm font-bold text-gray-900 dark:text-white">Regional Analysis & Recommendations *</span>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Your professional assessment based on tax center feedback</p>
            </label>
            <Textarea
              value={feedbackText}
              onChange={e => onFeedbackTextChange(e.target.value)}
              placeholder={`Example: "After reviewing feedback from all three tax centers:

Tax Center AA-01 (Central): Confirmed capacity of 15,200 cases with adequate staffing. No constraints identified.

Tax Center AA-02 (East): Noted staffing shortage (1 auditor on training leave through Q4). Recommend allocating 12,000 cases with follow-up in November.

Tax Center AA-03 (West): Surplus capacity available. Can absorb overflow if needed.

Overall Assessment:
• Plan feasibility: 98.5% (64,499 of 64,600 cases accommodated)
• Regional capacity: Adequate with minor adjustments
• Risk mitigation: Contingency of 100 cases available from AA-03

Recommendation: Approve plan with regional oversight on TC AA-02 staffing status."`}
              rows={10}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {feedbackText.length > 0 ? (
                  <span><strong>{feedbackText.length}</strong> characters • <strong>{feedbackText.split(/\s+/).length}</strong> words</span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400">Analysis required to proceed</span>
                )}
              </p>
              <p className="text-xs text-gray-400 dark:text-slate-500">Recommended: 200+ words</p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-xs font-bold text-blue-900 dark:text-blue-100 uppercase tracking-wide mb-3">📋 Assessment Checklist</p>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
                <span><strong>Capacity Analysis:</strong> Review each tax center's stated capacity and constraints</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
                <span><strong>Staffing & Resources:</strong> Note any staffing issues, training, or resource gaps</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
                <span><strong>Feasibility Assessment:</strong> Calculate overall plan feasibility percentage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
                <span><strong>Risk Identification:</strong> Identify any potential risks or bottlenecks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
                <span><strong>Mitigation Strategies:</strong> Propose solutions for identified constraints</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
                <span><strong>Recommendation:</strong> Clear recommendation: Approve / Approve with conditions / Reject</span>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-900 dark:text-amber-100">
              <strong>Important:</strong> This feedback will be reviewed by the Audit Director to finalize the audit plan. Your assessment directly influences plan approval and resource allocation decisions.
            </p>
          </div>
        </div>
      )}
    </Modal>

    {/* Edit Capacity Modal */}
    {editModalOpen && editModalAuditType && (
      <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-slate-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-800 px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit TC Capacity</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                {AUDIT_TYPES.find(a => a.id === editModalAuditType)?.name}
              </p>
            </div>
            <button
              onClick={closeEditModal}
              className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-4">
            {/* Current vs Original */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg p-3">
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wide mb-1">Original Tax Center</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {aggregate[editModalAuditType]?.toLocaleString() || 0}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wide mb-1">Regional Target</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {(regionDist[editModalAuditType] || 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Input Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
                New Capacity Value
              </label>
              <input
                type="number"
                value={editModalValue}
                onChange={(e) => setEditModalValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveEditModal();
                  } else if (e.key === 'Escape') {
                    closeEditModal();
                  }
                }}
                autoFocus
                className="w-full px-4 py-3 rounded-lg border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-center text-2xl font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
                Enter a whole number (no decimals)
              </p>
            </div>

            {/* Variance Preview */}
            {editModalValue && (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-700">
                <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 uppercase tracking-wide mb-2">Variance Preview</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-slate-400">New Capacity:</span>
                    <p className="font-bold text-amber-800 dark:text-amber-200">{parseInt(editModalValue).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-slate-400">vs Target:</span>
                    <p className="font-bold text-amber-800 dark:text-amber-200">{(regionDist[editModalAuditType] || 0).toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-amber-200 dark:border-amber-700">
                  <span className="text-gray-600 dark:text-slate-400">Difference:</span>
                  <p className={`text-lg font-bold ${
                    parseInt(editModalValue) === (regionDist[editModalAuditType] || 0) ? 'text-green-600 dark:text-green-400' :
                    parseInt(editModalValue) > (regionDist[editModalAuditType] || 0) ? 'text-blue-600 dark:text-blue-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {parseInt(editModalValue) > (regionDist[editModalAuditType] || 0) ? '+' : ''}
                    {(parseInt(editModalValue) - (regionDist[editModalAuditType] || 0)).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-slate-700/50 border-t border-gray-200 dark:border-slate-700 flex gap-3 justify-end rounded-b-xl">
            <button
              onClick={closeEditModal}
              className="px-4 py-2 rounded-lg font-semibold text-gray-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveEditModal}
              disabled={!editModalValue}
              className="px-4 py-2 rounded-lg font-semibold text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Save Capacity
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
