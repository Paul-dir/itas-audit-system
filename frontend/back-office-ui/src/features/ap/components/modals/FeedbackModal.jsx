import React from 'react';
import Badge from '../Badge';
import { reviewRegionalFeedback } from '../../utils/businessLogic';

/**
 * FeedbackModal Component
 * Displays regional feedback on plan submissions with director review actions.
 * 
 * Features:
 * - Shows feedback for selected regions only
 * - Displays proposed adjustments and comments
 * - Shows feedback status (pending, accepted, rejected)
 * - Director can accept or reject feedback with comments
 * - Handles empty feedback state (shows message if no regions selected or no feedback)
 * 
 * @component
 * @param {Object} plan - Plan object containing selectedRegions and allocations
 * @param {Function} onClose - Callback to close modal
 * @returns {React.ReactElement} Modal overlay with feedback review table
 */
function FeedbackModal({ plan, onClose }) {
  const selectedRegions = plan.selectedRegions || [];
  const relevantAllocations = plan.allocations.filter(a => selectedRegions.includes(a.region));

  const handleAccept = (region) => {
    const comment = prompt(`Director comment for ${region}:`);
    if (reviewRegionalFeedback(plan.id, region, 'ACCEPTED', comment || '')) {
      alert('Accepted.');
      onClose();
    }
  };

  const handleReject = (region) => {
    const comment = prompt(`Director comment for ${region}:`);
    if (comment && reviewRegionalFeedback(plan.id, region, 'REJECTED', comment)) {
      alert('Rejected.');
      onClose();
    }
  };

  if (selectedRegions.length === 0) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="modal-base w-full max-w-2xl">
          <div className="modal-header border-b border-border dark:border-border-dark bg-panel dark:bg-panel-dark">
            <h2 className="text-lg font-semibold text-text-hi dark:text-text-hi-dark">
              <i className="fas fa-comments text-blue-400 mr-2"></i>Regional Feedback
            </h2>
          </div>
          <div className="p-6">
            <p className="text-text-mid dark:text-text-mid-dark">
              ⚠️ No regions were selected for feedback. Please go back and select regions.
            </p>
          </div>
          <div className="modal-footer border-t border-border dark:border-border-dark bg-panel dark:bg-panel-dark p-4 flex gap-3 justify-end">
            <button 
              onClick={onClose}
              className="btn btn-outline"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const hasFeedback = relevantAllocations.some(a => a.feedback);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-base w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="modal-header border-b border-border dark:border-border-dark bg-panel dark:bg-panel-dark">
          <h2 className="text-lg font-semibold text-text-hi dark:text-text-hi-dark">
            <i className="fas fa-comments text-blue-400 mr-2"></i>Regional Feedback
          </h2>
        </div>

        <div className="p-6">
          <div className="border border-border dark:border-border-dark rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-panel dark:bg-panel-dark border-b border-border dark:border-border-dark">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-text-hi dark:text-text-hi-dark">Region</th>
                  <th className="px-4 py-2 text-center font-semibold text-text-hi dark:text-text-hi-dark">Original</th>
                  <th className="px-4 py-2 text-center font-semibold text-text-hi dark:text-text-hi-dark">Adjustment</th>
                  <th className="px-4 py-2 text-left font-semibold text-text-hi dark:text-text-hi-dark">Comments</th>
                  <th className="px-4 py-2 text-center font-semibold text-text-hi dark:text-text-hi-dark">Status</th>
                  <th className="px-4 py-2 text-center font-semibold text-text-hi dark:text-text-hi-dark">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-border-dark">
                {!hasFeedback ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-4 text-center text-text-mid dark:text-text-mid-dark">
                      ⏳ No feedback submitted yet from selected regions.
                    </td>
                  </tr>
                ) : (
                  relevantAllocations.map(alloc => {
                    if (!alloc.feedback) {
                      return (
                        <tr key={alloc.region} className="hover:bg-panel/50 dark:hover:bg-panel-dark/50 transition-colors">
                          <td className="px-4 py-2 text-text-hi dark:text-text-hi-dark">{alloc.region}</td>
                          <td className="px-4 py-2 text-center text-text-mid dark:text-text-mid-dark">{alloc.total}</td>
                          <td colSpan="4" className="px-4 py-2 text-center text-text-mid dark:text-text-mid-dark">
                            ⏳ Awaiting feedback
                          </td>
                        </tr>
                      );
                    }

                    const adjMsg = alloc.feedback.adjustments
                      ? `Total: ${alloc.feedback.adjustments.total} (Desk:${alloc.feedback.adjustments.desk})`
                      : 'No changes';

                    const statusBadge = alloc.feedback.status === 'PENDING' 
                      ? <Badge status="Pending" className="badge-pending" />
                      : alloc.feedback.status === 'ACCEPTED'
                      ? <Badge status="✅ Accepted" className="badge-approved" />
                      : <Badge status="❌ Rejected" className="badge-rejected" />;

                    return (
                      <tr key={alloc.region} className="hover:bg-panel/50 dark:hover:bg-panel-dark/50 transition-colors">
                        <td className="px-4 py-2 font-semibold text-text-hi dark:text-text-hi-dark">{alloc.region}</td>
                        <td className="px-4 py-2 text-center text-text-mid dark:text-text-mid-dark">{alloc.total}</td>
                        <td className="px-4 py-2 text-center text-xs text-text-mid dark:text-text-mid-dark">{adjMsg}</td>
                        <td className="px-4 py-2 text-sm text-text-mid dark:text-text-mid-dark">{alloc.feedback.comments || ''}</td>
                        <td className="px-4 py-2 text-center">{statusBadge}</td>
                        <td className="px-4 py-2 text-center">
                          {alloc.feedback.status === 'PENDING' ? (
                            <div className="flex gap-2 justify-center">
                              <button 
                                className="btn btn-sm btn-success"
                                onClick={() => handleAccept(alloc.region)}
                              >
                                ✅ Accept
                              </button>
                              <button 
                                className="btn btn-sm btn-danger"
                                onClick={() => handleReject(alloc.region)}
                              >
                                ❌ Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-text-mid dark:text-text-mid-dark">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="modal-footer border-t border-border dark:border-border-dark bg-panel dark:bg-panel-dark p-4 flex gap-3 justify-end">
          <button 
            onClick={onClose}
            className="btn btn-outline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeedbackModal;
