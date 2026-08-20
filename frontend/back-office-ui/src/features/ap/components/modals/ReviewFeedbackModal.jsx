import React, { useState } from 'react';
import Badge from '../Badge';
import { reviewAndAmendPlan } from '../../utils/businessLogic';

/**
 * ReviewFeedbackModal Component
 * Complex modal for reviewing regional feedback and amending plan allocations.
 * 
 * Features:
 * - Displays feedback summary from all regions
 * - Shows editable amendment allocation table with inline inputs
 * - Calculates totals automatically
 * - Applies suggested changes from regional feedback
 * - Creates new plan version with finalized amendments
 * - Validates that all feedback is collected before finalization
 * 
 * @component
 * @param {Object} plan - Plan object with locations, regionalFeedback, version
 * @param {Function} onClose - Callback to close modal
 * @returns {React.ReactElement} Modal overlay with feedback review interface
 */
function ReviewFeedbackModal({ plan, onClose }) {
  const [amendments, setAmendments] = useState({
    locations: JSON.parse(JSON.stringify(plan.locations || []))
  });

  const handleApplyFeedback = (regionName, feedbackData) => {
    const updated = [...amendments.locations];
    const location = updated.find(l => l.name === regionName);
    if (location && feedbackData.proposedChanges) {
      Object.assign(location, feedbackData.proposedChanges);
    }
    setAmendments({ ...amendments, locations: updated });
  };

  const handleFinalize = () => {
    if (window.confirm('Finalize the plan with incorporated feedback? This will create a new version.')) {
      // Recalculate totals
      const totalVolume = amendments.locations.reduce((sum, l) => sum + l.cases, 0);
      const totalEffort = amendments.locations.reduce((sum, l) => sum + l.totalEffort, 0);
      
      const finalAmendments = {
        ...amendments,
        totalVolume,
        totalEffortHours: totalEffort
      };
      
      if (reviewAndAmendPlan(plan.id, finalAmendments)) {
        alert('Plan finalized successfully! New version created.');
        onClose();
      } else {
        alert('Cannot finalize. Plan must have feedback collected.');
      }
    }
  };

  const hasPendingFeedback = plan.regionalFeedback?.some(f => f.status === 'PENDING');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-base w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="modal-header border-b border-border dark:border-border-dark bg-panel dark:bg-panel-dark">
          <h2 className="text-lg font-semibold text-text-hi dark:text-text-hi-dark">
            <i className="fas fa-comments text-cyan-400 mr-2"></i>Regional Feedback Review
          </h2>
        </div>

        <div className="p-6">
          {hasPendingFeedback && (
            <div className="bg-yellow-950/40 border-l-4 border-yellow-600 text-yellow-100 px-4 py-3 rounded mb-6">
              <i className="fas fa-hourglass-half text-yellow-500 mr-2"></i>
              <strong>Awaiting Feedback</strong> - Some regions haven't submitted their feedback yet.
            </div>
          )}

          {/* Feedback Summary Section */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-text-hi dark:text-text-hi-dark mb-4 flex items-center gap-2">
              <i className="fas fa-list text-blue-400"></i>Feedback Summary
            </h3>
            <div className="border border-border dark:border-border-dark rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-panel dark:bg-panel-dark border-b border-border dark:border-border-dark">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-text-hi dark:text-text-hi-dark">Region</th>
                    <th className="px-4 py-2 text-left font-semibold text-text-hi dark:text-text-hi-dark">Current Allocation</th>
                    <th className="px-4 py-2 text-center font-semibold text-text-hi dark:text-text-hi-dark">Status</th>
                    <th className="px-4 py-2 text-left font-semibold text-text-hi dark:text-text-hi-dark">Submitted</th>
                    <th className="px-4 py-2 text-center font-semibold text-text-hi dark:text-text-hi-dark">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-border-dark">
                  {plan.regionalFeedback?.map(feedback => {
                    const location = plan.locations?.find(l => l.name === feedback.region);
                    return (
                      <tr key={feedback.region} className="hover:bg-panel/50 dark:hover:bg-panel-dark/50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-text-hi dark:text-text-hi-dark">{feedback.region}</td>
                        <td className="px-4 py-3 text-text-mid dark:text-text-mid-dark">{location?.cases || 0} cases</td>
                        <td className="px-4 py-3 text-center">
                          <Badge 
                            status={feedback.status === 'SUBMITTED' ? 'Submitted' : 'Pending'} 
                            className={feedback.status === 'SUBMITTED' ? 'badge-approved' : 'badge-pending'} 
                          />
                        </td>
                        <td className="px-4 py-3 text-text-mid dark:text-text-mid-dark">
                          {feedback.submittedDate ? new Date(feedback.submittedDate).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {feedback.status === 'SUBMITTED' ? (
                            <button 
                              className="btn btn-sm btn-info" 
                              onClick={() => {
                                const detail = feedback.feedback;
                                alert(`Feedback from ${feedback.region}:\n\n${detail?.comments || 'No comments'}\n\nProposed Changes:\nDesk: ${detail?.proposedChanges?.desk || 0}\nField: ${detail?.proposedChanges?.field || 0}\nJoint: ${detail?.proposedChanges?.joint || 0}\nTP: ${detail?.proposedChanges?.tp || 0}\nComp: ${detail?.proposedChanges?.comprehensive || 0}`);
                              }}
                            >
                              <i className="fas fa-eye mr-1"></i>View Details
                            </button>
                          ) : (
                            <span className="text-text-mid dark:text-text-mid-dark text-xs">Awaiting</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Amended Allocation Section */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-text-hi dark:text-text-hi-dark mb-4 flex items-center gap-2">
              <i className="fas fa-edit text-blue-400"></i>Amended Allocation
            </h3>
            <div className="border border-border dark:border-border-dark rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-panel dark:bg-panel-dark border-b border-border dark:border-border-dark">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-text-hi dark:text-text-hi-dark">Region</th>
                    <th className="px-4 py-2 text-center font-semibold text-text-hi dark:text-text-hi-dark">Desk</th>
                    <th className="px-4 py-2 text-center font-semibold text-text-hi dark:text-text-hi-dark">Field</th>
                    <th className="px-4 py-2 text-center font-semibold text-text-hi dark:text-text-hi-dark">Joint</th>
                    <th className="px-4 py-2 text-center font-semibold text-text-hi dark:text-text-hi-dark">TP</th>
                    <th className="px-4 py-2 text-center font-semibold text-text-hi dark:text-text-hi-dark">Comp</th>
                    <th className="px-4 py-2 text-center font-semibold text-text-hi dark:text-text-hi-dark">Total</th>
                    <th className="px-4 py-2 text-center font-semibold text-text-hi dark:text-text-hi-dark">Quick Apply</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-border-dark">
                  {amendments.locations.map((loc, index) => {
                    const feedbackItem = plan.regionalFeedback?.find(f => f.region === loc.name);
                    const hasSubmitted = feedbackItem?.status === 'SUBMITTED';
                    
                    return (
                      <tr key={loc.name} className="hover:bg-panel/50 dark:hover:bg-panel-dark/50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-text-hi dark:text-text-hi-dark">{loc.name}</td>
                        <td className="px-4 py-3 text-center">
                          <input 
                            type="number" 
                            value={loc.desk}
                            onChange={(e) => {
                              const updated = [...amendments.locations];
                              updated[index].desk = parseInt(e.target.value) || 0;
                              updated[index].cases = updated[index].desk + updated[index].field + updated[index].joint + updated[index].tp + updated[index].comprehensive;
                              setAmendments({ ...amendments, locations: updated });
                            }}
                            className="form-input w-16 text-center"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input 
                            type="number" 
                            value={loc.field}
                            onChange={(e) => {
                              const updated = [...amendments.locations];
                              updated[index].field = parseInt(e.target.value) || 0;
                              updated[index].cases = updated[index].desk + updated[index].field + updated[index].joint + updated[index].tp + updated[index].comprehensive;
                              setAmendments({ ...amendments, locations: updated });
                            }}
                            className="form-input w-16 text-center"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input 
                            type="number" 
                            value={loc.joint}
                            onChange={(e) => {
                              const updated = [...amendments.locations];
                              updated[index].joint = parseInt(e.target.value) || 0;
                              updated[index].cases = updated[index].desk + updated[index].field + updated[index].joint + updated[index].tp + updated[index].comprehensive;
                              setAmendments({ ...amendments, locations: updated });
                            }}
                            className="form-input w-16 text-center"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input 
                            type="number" 
                            value={loc.tp}
                            onChange={(e) => {
                              const updated = [...amendments.locations];
                              updated[index].tp = parseInt(e.target.value) || 0;
                              updated[index].cases = updated[index].desk + updated[index].field + updated[index].joint + updated[index].tp + updated[index].comprehensive;
                              setAmendments({ ...amendments, locations: updated });
                            }}
                            className="form-input w-16 text-center"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input 
                            type="number" 
                            value={loc.comprehensive}
                            onChange={(e) => {
                              const updated = [...amendments.locations];
                              updated[index].comprehensive = parseInt(e.target.value) || 0;
                              updated[index].cases = updated[index].desk + updated[index].field + updated[index].joint + updated[index].tp + updated[index].comprehensive;
                              setAmendments({ ...amendments, locations: updated });
                            }}
                            className="form-input w-16 text-center"
                          />
                        </td>
                        <td className="px-4 py-3 text-center font-semibold text-text-hi dark:text-text-hi-dark">{loc.cases}</td>
                        <td className="px-4 py-3 text-center">
                          {hasSubmitted && feedbackItem.feedback?.proposedChanges && (
                            <button 
                              className="btn btn-sm btn-warning"
                              onClick={() => handleApplyFeedback(loc.name, feedbackItem.feedback)}
                              title="Apply this region's proposed changes"
                            >
                              <i className="fas fa-magic mr-1"></i>Apply
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-slate-100 dark:bg-slate-900 font-bold">
                    <td className="px-4 py-3 text-text-hi dark:text-text-hi-dark">TOTAL</td>
                    <td className="px-4 py-3 text-center text-text-hi dark:text-text-hi-dark">{amendments.locations.reduce((sum, l) => sum + l.desk, 0)}</td>
                    <td className="px-4 py-3 text-center text-text-hi dark:text-text-hi-dark">{amendments.locations.reduce((sum, l) => sum + l.field, 0)}</td>
                    <td className="px-4 py-3 text-center text-text-hi dark:text-text-hi-dark">{amendments.locations.reduce((sum, l) => sum + l.joint, 0)}</td>
                    <td className="px-4 py-3 text-center text-text-hi dark:text-text-hi-dark">{amendments.locations.reduce((sum, l) => sum + l.tp, 0)}</td>
                    <td className="px-4 py-3 text-center text-text-hi dark:text-text-hi-dark">{amendments.locations.reduce((sum, l) => sum + l.comprehensive, 0)}</td>
                    <td className="px-4 py-3 text-center text-text-hi dark:text-text-hi-dark">{amendments.locations.reduce((sum, l) => sum + l.cases, 0)}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Version Control Info */}
          <div className="bg-green-950/40 border border-green-700 rounded px-4 py-3 mb-6">
            <i className="fas fa-info-circle text-green-400 mr-2"></i>
            <strong className="text-green-100">Version Control:</strong>
            <span className="text-green-100/80 ml-2">Finalizing will create version {plan.version + 1} of this plan with the amended allocations.</span>
          </div>
        </div>

        <div className="modal-footer border-t border-border dark:border-border-dark bg-panel dark:bg-panel-dark p-4 flex gap-3 justify-end">
          <button className="btn btn-outline" onClick={onClose}>Close</button>
          <button 
            className="btn btn-success" 
            onClick={handleFinalize}
            disabled={hasPendingFeedback}
            title={hasPendingFeedback ? 'Wait for all regional feedback' : 'Finalize plan with amendments'}
          >
            <i className="fas fa-check-double mr-1"></i>Finalize Plan (Create v{plan.version + 1})
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewFeedbackModal;
