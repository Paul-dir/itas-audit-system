import React, { useState } from 'react';
import { requestRegionalFeedback } from '../../utils/businessLogic';

/**
 * RequestFeedbackModal Component
 * Modal for sending a plan to regional directors for feedback.
 * 
 * Features:
 * - Multi-select region checkboxes
 * - Shows allocated cases and taxpayer base per region
 * - Validation: requires at least one region selected
 * - Business rule: Plan must be Director Approved to request feedback
 * - Notification system triggers when feedback is sent
 * 
 * @component
 * @param {Object} plan - Plan object containing locations
 * @param {Function} onClose - Callback to close modal
 * @returns {React.ReactElement} Modal overlay with region selection
 */
function RequestFeedbackModal({ plan, onClose }) {
  const [selectedRegions, setSelectedRegions] = useState(
    plan.locations?.map(l => l.name) || []
  );

  const handleToggle = (region) => {
    if (selectedRegions.includes(region)) {
      setSelectedRegions(selectedRegions.filter(r => r !== region));
    } else {
      setSelectedRegions([...selectedRegions, region]);
    }
  };

  const handleSend = () => {
    if (selectedRegions.length === 0) {
      alert('Please select at least one region.');
      return;
    }

    if (window.confirm(`Send plan to ${selectedRegions.length} region(s) for feedback?`)) {
      if (requestRegionalFeedback(plan.id, selectedRegions)) {
        alert(`Feedback request sent to ${selectedRegions.length} region(s). Regions will be notified.`);
        onClose();
      } else {
        alert('Cannot request feedback. Plan must be Director Approved.');
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-base w-full max-w-2xl">
        <div className="modal-header border-b border-border dark:border-border-dark bg-panel dark:bg-panel-dark">
          <h2 className="text-lg font-semibold text-text-hi dark:text-text-hi-dark">
            <i className="fas fa-share-alt text-blue-400 mr-2"></i>Request Regional Feedback
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-text-mid dark:text-text-mid-dark">
            Select regions to send the plan for review and feedback:
          </p>
          
          {/* Region Selection Table */}
          <div className="border border-border dark:border-border-dark rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-panel dark:bg-panel-dark border-b border-border dark:border-border-dark">
                <tr>
                  <th className="px-4 py-2 text-center font-semibold text-text-hi dark:text-text-hi-dark w-16">Select</th>
                  <th className="px-4 py-2 text-left font-semibold text-text-hi dark:text-text-hi-dark">Region</th>
                  <th className="px-4 py-2 text-center font-semibold text-text-hi dark:text-text-hi-dark">Allocated Cases</th>
                  <th className="px-4 py-2 text-center font-semibold text-text-hi dark:text-text-hi-dark">Taxpayer Base</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-border-dark">
                {plan.locations?.map(loc => (
                  <tr key={loc.name} className="hover:bg-panel/50 dark:hover:bg-panel-dark/50 transition-colors">
                    <td className="px-4 py-2 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedRegions.includes(loc.name)}
                        onChange={() => handleToggle(loc.name)}
                        className="w-5 h-5 cursor-pointer rounded border-border dark:border-border-dark"
                      />
                    </td>
                    <td className="px-4 py-2 font-semibold text-text-hi dark:text-text-hi-dark">{loc.name}</td>
                    <td className="px-4 py-2 text-center text-text-mid dark:text-text-mid-dark">{loc.cases}</td>
                    <td className="px-4 py-2 text-center text-text-mid dark:text-text-mid-dark">
                      {loc.taxpayers?.toLocaleString() || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Information Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              <i className="fas fa-info-circle text-blue-500 dark:text-blue-400 mr-2"></i>
              What happens next?
            </h4>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 ml-4">
              <li>• Selected regions will be notified about the plan</li>
              <li>• Regional directors can review and provide feedback</li>
              <li>• You'll be notified when all feedback is collected</li>
              <li>• You can then review and incorporate the feedback</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer border-t border-border dark:border-border-dark bg-panel dark:bg-panel-dark p-4 flex gap-3 justify-end">
          <button 
            onClick={onClose}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button 
            onClick={handleSend}
            disabled={selectedRegions.length === 0}
            className="btn btn-success disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-paper-plane mr-1"></i>
            Send to {selectedRegions.length} Region(s)
          </button>
        </div>
      </div>
    </div>
  );
}

export default RequestFeedbackModal;
