import React, { useState } from 'react';
import RiskProfilePanel from '../panels/RiskProfilePanel';

/**
 * CaseDetailsModal Component
 * Portal modal showing complete case information with risk profiling and treatment plans.
 * 
 * Features:
 * - Taxpayer information display (name, TIN, business type, tax center)
 * - Audit information (type, estimated hours, revenue at risk, case source)
 * - Risk profile panel integration
 * - Treatment plan display (if attached) with details, costs, and focus areas
 * - Attach plan action for cases without treatment plans
 * - Sticky header and footer for easy navigation
 * 
 * @component
 * @param {boolean} isOpen - Whether modal is visible
 * @param {Object} caseData - Complete case object with all details
 * @param {Function} onClose - Callback to close modal
 * @param {Function} onAttachPlan - Callback when user clicks attach plan
 * @returns {React.ReactElement|null} Modal overlay or null if not open
 */
function CaseDetailsModal({ isOpen, caseData, onClose, onAttachPlan }) {
  const [showTreatmentForm, setShowTreatmentForm] = useState(false);

  if (!isOpen || !caseData) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 dark:bg-black/80"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="modal-base w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-panel dark:bg-panel-dark border border-border dark:border-border-dark"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-border dark:border-border-dark bg-panel dark:bg-panel-dark px-6 py-4 flex justify-between items-start">
          <div>
            <h2 className="text-base font-semibold text-text-hi dark:text-text-hi-dark mb-1">
              {caseData.id}
            </h2>
            <small className="text-text-mid dark:text-text-mid-dark">
              {caseData.taxpayerName}
            </small>
          </div>
          <button
            onClick={onClose}
            className="text-text-mid dark:text-text-mid-dark hover:text-text-hi dark:hover:text-text-hi-dark text-xl leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Taxpayer Information */}
          <div className="card-base p-4 space-y-3">
            <h3 className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">
              <i className="fas fa-user mr-2 text-text-mid dark:text-text-mid-dark"></i>
              Taxpayer Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <small className="text-text-mid dark:text-text-mid-dark block mb-1">NAME</small>
                <strong className="text-text-hi dark:text-text-hi-dark">{caseData.taxpayerName}</strong>
              </div>
              <div>
                <small className="text-text-mid dark:text-text-mid-dark block mb-1">TIN</small>
                <strong className="text-text-hi dark:text-text-hi-dark">{caseData.tin}</strong>
              </div>
              <div>
                <small className="text-text-mid dark:text-text-mid-dark block mb-1">BUSINESS TYPE</small>
                <strong className="text-text-hi dark:text-text-hi-dark">{caseData.businessType || 'N/A'}</strong>
              </div>
              <div>
                <small className="text-text-mid dark:text-text-mid-dark block mb-1">TAX CENTER</small>
                <strong className="text-text-hi dark:text-text-hi-dark">{caseData.taxCenter}</strong>
              </div>
            </div>
          </div>

          {/* Audit Information */}
          <div className="card-base p-4 space-y-3">
            <h3 className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">
              <i className="fas fa-file-alt mr-2 text-text-mid dark:text-text-mid-dark"></i>
              Audit Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <small className="text-text-mid dark:text-text-mid-dark block mb-1">AUDIT TYPE</small>
                <strong className="text-text-hi dark:text-text-hi-dark">{caseData.auditType}</strong>
              </div>
              <div>
                <small className="text-text-mid dark:text-text-mid-dark block mb-1">EST. HOURS</small>
                <strong className="text-text-hi dark:text-text-hi-dark">{caseData.estimatedHours} hrs</strong>
              </div>
              <div>
                <small className="text-text-mid dark:text-text-mid-dark block mb-1">REVENUE AT RISK</small>
                <strong className="text-text-hi dark:text-text-hi-dark">
                  {((caseData.revenueAtRisk || 0) / 1000000).toFixed(1)}M ETB
                </strong>
              </div>
              <div>
                <small className="text-text-mid dark:text-text-mid-dark block mb-1">CASE SOURCE</small>
                <span className={`inline-block px-2 py-1 rounded text-xs font-bold text-white ${
                  caseData.createdFrom === 'AUDIT_REQUEST' 
                    ? 'bg-orange-500' 
                    : 'bg-blue-500'
                }`}>
                  {caseData.createdFrom === 'AUDIT_REQUEST' ? '🔔 Audit Request' : '⚙️ Risk Engine'}
                </span>
              </div>
            </div>
          </div>

          {/* Risk Profile Panel */}
          <RiskProfilePanel caseData={caseData} />

          {/* Treatment Plan Section */}
          {caseData.treatmentPlan && (
            <div className="card-base p-4 space-y-3 border-l-4 border-teal-500">
              <h3 className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">
                <i className="fas fa-file-contract mr-2 text-teal-500"></i>
                Treatment Plan
              </h3>
              <div className="text-xs space-y-3">
                <div>
                  <small className="text-text-mid dark:text-text-mid-dark block mb-1">PLAN TYPE</small>
                  <strong className="text-text-hi dark:text-text-hi-dark">{caseData.treatmentPlan.planType}</strong>
                </div>
                <div>
                  <small className="text-text-mid dark:text-text-mid-dark block mb-1">DESCRIPTION</small>
                  <p className="text-text-mid dark:text-text-mid-dark leading-relaxed">
                    {caseData.treatmentPlan.description}
                  </p>
                </div>
                <div>
                  <small className="text-text-mid dark:text-text-mid-dark block mb-1">ESTIMATED HOURS</small>
                  <strong className="text-text-hi dark:text-text-hi-dark">{caseData.treatmentPlan.estimatedHours} hrs</strong>
                </div>
                {caseData.treatmentPlan.estimatedCost && (
                  <div>
                    <small className="text-text-mid dark:text-text-mid-dark block mb-1">ESTIMATED COST</small>
                    <strong className="text-text-hi dark:text-text-hi-dark">
                      {caseData.treatmentPlan.estimatedCost.toLocaleString()} ETB
                    </strong>
                  </div>
                )}
                {caseData.treatmentPlan.keyFocusAreas && caseData.treatmentPlan.keyFocusAreas.length > 0 && (
                  <div>
                    <small className="text-text-mid dark:text-text-mid-dark block mb-2">KEY FOCUS AREAS</small>
                    <div className="flex flex-wrap gap-2">
                      {caseData.treatmentPlan.keyFocusAreas.map((area, idx) => (
                        <span 
                          key={idx} 
                          className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* No Treatment Plan */}
          {!caseData.treatmentPlan && (
            <div className="card-base p-4 text-center text-text-mid dark:text-text-mid-dark text-xs">
              <i className="fas fa-info-circle mr-2"></i>
              No treatment plan attached yet
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 border-t border-border dark:border-border-dark bg-panel dark:bg-panel-dark px-6 py-3 flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="btn btn-outline text-sm"
          >
            Close
          </button>
          <button
            onClick={() => onAttachPlan && onAttachPlan(caseData.id)}
            className="btn btn-success text-sm"
          >
            <i className="fas fa-plus mr-1"></i>Attach Plan
          </button>
        </div>
      </div>
    </div>
  );
}

export default CaseDetailsModal;
