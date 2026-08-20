import React, { useState } from 'react';
import { requestRegionalFeedback } from '../../utils/businessLogic';

/**
 * SendToBranchesModal Component
 * Modal for requesting regional feedback on regional allocation plans.
 * 
 * Features:
 * - Multi-select checkbox for region selection
 * - Defaults to plan's allocated regions
 * - Toggle individual regions on/off
 * - Simple workflow for sending feedback requests
 * 
 * @component
 * @param {Object} plan - Plan object with id and allocations array
 * @param {Function} onClose - Callback to close modal
 * @returns {React.ReactElement} Modal overlay with region selection
 */
function SendToBranchesModal({ plan, onClose }) {
  const [selectedRegions, setSelectedRegions] = useState(
    plan.allocations.map(a => a.region)
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
      alert('Select at least one region.');
      return;
    }

    if (requestRegionalFeedback(plan.id, selectedRegions)) {
      alert(`Feedback requested from ${selectedRegions.length} region(s).`);
      onClose();
    } else {
      alert('Cannot request feedback.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-base w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="modal-header border-b border-border dark:border-border-dark bg-panel dark:bg-panel-dark">
          <h2 className="text-lg font-semibold text-text-hi dark:text-text-hi-dark">
            <i className="fas fa-share-alt text-cyan-400 mr-2"></i>Request Regional Feedback
          </h2>
        </div>

        <div className="p-6">
          <p className="text-text-mid dark:text-text-mid-dark mb-6">
            Select which regions to send the plan for feedback:
          </p>
          
          <div className="space-y-2 mb-6">
            <label className="text-sm font-semibold text-text-hi dark:text-text-hi-dark block mb-3">Regions</label>
            {plan.allocations.map(alloc => (
              <label 
                key={alloc.region}
                className="flex items-center gap-3 p-3 bg-panel dark:bg-panel-dark border border-border dark:border-border-dark hover:border-primary-light rounded cursor-pointer transition-colors"
              >
                <input 
                  type="checkbox" 
                  checked={selectedRegions.includes(alloc.region)}
                  onChange={() => handleToggle(alloc.region)}
                  className="w-4 h-4"
                />
                <span className="text-text-hi dark:text-text-hi-dark font-medium">{alloc.region}</span>
              </label>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded px-4 py-3 mb-6">
            <p className="text-sm text-text-mid dark:text-text-mid-dark m-0">
              <strong className="text-text-hi dark:text-text-hi-dark">{selectedRegions.length}</strong> of <strong className="text-text-hi dark:text-text-hi-dark">{plan.allocations.length}</strong> regions selected
            </p>
          </div>
        </div>

        <div className="modal-footer border-t border-border dark:border-border-dark bg-panel dark:bg-panel-dark p-4 flex gap-3 justify-end">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button 
            className="btn btn-success" 
            onClick={handleSend}
            disabled={selectedRegions.length === 0}
          >
            Send to Selected Regions
          </button>
        </div>
      </div>
    </div>
  );
}

export default SendToBranchesModal;
