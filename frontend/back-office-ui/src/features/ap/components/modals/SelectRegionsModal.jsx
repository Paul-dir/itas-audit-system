import React, { useState } from 'react';
import { directorSendToRegions } from '../../utils/businessLogic';
import { auditConfig } from '../../config/auditConfig';

/**
 * SelectRegionsModal Component
 * Modal for selecting regions to send director-approved plans for regional review.
 * 
 * Features:
 * - Multi-select checkbox interface for all regions
 * - Shows case count for each region
 * - Select All / Deselect All option
 * - Displays regional capacity and allocation info
 * - Shows workflow explanation for feedback process
 * 
 * @component
 * @param {Object} plan - Plan object with id, version, fiscalYear, regionalAllocation
 * @param {Function} onClose - Callback to close modal
 * @returns {React.ReactElement} Modal overlay with region selection interface
 */
function SelectRegionsModal({ plan, onClose }) {
  const [selectedRegions, setSelectedRegions] = useState([]);
  const regions = auditConfig.regions.map(r => r.name);

  const handleToggle = (region) => {
    if (selectedRegions.includes(region)) {
      setSelectedRegions(selectedRegions.filter(r => r !== region));
    } else {
      setSelectedRegions([...selectedRegions, region]);
    }
  };

  const handleSend = () => {
    if (selectedRegions.length === 0) {
      alert('Please select at least one region');
      return;
    }

    if (directorSendToRegions(plan.id, selectedRegions)) {
      alert(`Plan sent to ${selectedRegions.length} region(s) for feedback!\n\nRegions: ${selectedRegions.join(', ')}`);
      onClose();
    } else {
      alert('Error: Plan must be Director Approved status');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-base w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="modal-header border-b border-border dark:border-border-dark bg-panel dark:bg-panel-dark">
          <h2 className="text-lg font-semibold text-text-hi dark:text-text-hi-dark">
            <i className="fas fa-share-alt text-cyan-400 mr-2"></i>Send Plan to Regional Directors
          </h2>
        </div>

        <div className="p-6">
          <p className="text-text-mid dark:text-text-mid-dark mb-6">
            This plan will be sent to all regional directors for review, allocation, and feedback collection:
          </p>

          {/* Plan Details */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded px-4 py-3 mb-6">
            <div className="mb-3">
              <strong className="text-text-hi dark:text-text-hi-dark">Plan Details:</strong>
            </div>
            <p className="text-sm text-text-mid dark:text-text-mid-dark m-0">
              ID: <span className="font-mono text-text-hi dark:text-text-hi-dark">{plan.id}</span> | 
              Version: <span className="font-mono text-text-hi dark:text-text-hi-dark">{plan.version}</span> | 
              Fiscal Year: <span className="font-mono text-text-hi dark:text-text-hi-dark">{plan.fiscalYear}</span>
            </p>
          </div>

          {/* Region Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-text-hi dark:text-text-hi-dark mb-2 flex items-center gap-2">
              <i className="fas fa-check-circle text-blue-400"></i>Select Regions to Send Plan
            </h3>
            <p className="text-xs text-text-mid dark:text-text-mid-dark mb-4">
              Click to select which regions should receive this plan:
            </p>
            
            {/* Select All Option */}
            <div
              className="p-3 bg-panel dark:bg-panel-dark border border-border dark:border-border-dark hover:border-primary-light dark:hover:border-primary rounded cursor-pointer mb-3 flex items-center gap-3 transition-colors"
              onClick={() => {
                if (selectedRegions.length === regions.length) {
                  setSelectedRegions([]);
                } else {
                  setSelectedRegions([...regions]);
                }
              }}
            >
              <input
                type="checkbox"
                checked={selectedRegions.length === regions.length}
                onChange={() => {}}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="font-semibold text-text-hi dark:text-text-hi-dark flex-1">
                {selectedRegions.length === regions.length ? 'Deselect All' : 'Select All Regions'}
              </span>
            </div>

            {/* Individual Region Checkboxes */}
            <div className="space-y-2">
              {regions.map(region => {
                const isSelected = selectedRegions.includes(region);
                
                // Get total cases for this region from regionalAllocation
                let regionCases = 0;
                if (plan.regionalAllocation && plan.regionalAllocation[region]) {
                  regionCases = Object.values(plan.regionalAllocation[region]).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
                }
                
                return (
                  <div
                    key={region}
                    className={`p-3 border rounded cursor-pointer flex items-center gap-3 transition-all ${
                      isSelected 
                        ? 'bg-green-950/30 border-green-600 dark:border-green-600' 
                        : 'bg-panel dark:bg-panel-dark border-border dark:border-border-dark hover:border-primary-light'
                    }`}
                    onClick={() => handleToggle(region)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-text-hi dark:text-text-hi-dark">
                        {region}
                      </div>
                      <div className="text-xs text-text-mid dark:text-text-mid-dark mt-1">
                        {regionCases} cases
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-green-600 dark:text-green-400 text-lg">
                        <i className="fas fa-check-circle"></i>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-panel dark:bg-panel-dark border border-border dark:border-border-dark rounded px-4 py-3 text-center mb-6">
            <p className="text-xs font-semibold text-text-mid dark:text-text-mid-dark m-0">
              {selectedRegions.length} of {regions.length} regions selected
            </p>
          </div>

          {/* Workflow Info */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded px-4 py-3 mb-6">
            <div className="flex items-start gap-2 mb-2">
              <i className="fas fa-info-circle text-blue-400 mt-1 flex-shrink-0"></i>
              <strong className="text-text-hi dark:text-text-hi-dark">Workflow</strong>
            </div>
            <ol className="text-sm text-text-mid dark:text-text-mid-dark list-decimal list-inside space-y-1">
              <li>Regional directors receive the plan</li>
              <li>They allocate cases to tax centers</li>
              <li>Tax centers provide feedback</li>
              <li>Regional directors collect and submit feedback back to you</li>
            </ol>
          </div>
        </div>

        <div className="modal-footer border-t border-border dark:border-border-dark bg-panel dark:bg-panel-dark p-4 flex gap-3 justify-end">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button 
            className="btn btn-primary" 
            onClick={handleSend}
            disabled={selectedRegions.length === 0}
            title={selectedRegions.length === 0 ? 'Select at least one region' : ''}
          >
            <i className="fas fa-paper-plane mr-1"></i>Send to {selectedRegions.length || 'Selected'} Region{selectedRegions.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SelectRegionsModal;
