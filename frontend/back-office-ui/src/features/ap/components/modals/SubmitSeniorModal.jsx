import React, { useState } from 'react';
import { submitToSeniorManagement } from '../../utils/businessLogic';

/**
 * SubmitSeniorModal Component
 * Modal for submitting plans to senior management with optional notes.
 * 
 * Features:
 * - Textarea for providing context and notes
 * - Submit confirmation workflow
 * - Validates plan readiness for executive review
 * 
 * @component
 * @param {Object} plan - Plan object with id for submission
 * @param {Function} onClose - Callback to close modal
 * @returns {React.ReactElement} Modal overlay with submission form
 */
function SubmitSeniorModal({ plan, onClose }) {
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (submitToSeniorManagement(plan.id, notes)) {
      alert('Plan submitted to Senior Management.');
      onClose();
    } else {
      alert('Cannot submit. Plan must be DIRECTOR_APPROVED or FEEDBACK_COLLECTED.');
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
            <i className="fas fa-crown text-purple-400 mr-2"></i>Submit to Senior Management
          </h2>
        </div>

        <div className="p-6">
          <p className="text-text-mid dark:text-text-mid-dark mb-6">
            You are about to submit the plan for executive approval.
          </p>
          
          <div className="mb-6">
            <label className="block text-sm font-semibold text-text-hi dark:text-text-hi-dark mb-2">
              Additional Notes
            </label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide any context..."
              className="form-input min-h-[120px] w-full"
            />
          </div>
        </div>

        <div className="modal-footer border-t border-border dark:border-border-dark bg-panel dark:bg-panel-dark p-4 flex gap-3 justify-end">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button 
            className="btn btn-purple" 
            onClick={handleSubmit}
          >
            Submit to Senior Management
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubmitSeniorModal;
