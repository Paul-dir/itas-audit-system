import React, { useState, useEffect } from 'react';
import { useData } from '../../services/dataService';

/**
 * TreatmentPlanModal Component
 * Form modal for creating and editing treatment plans for audit cases.
 * 
 * Features:
 * - Plan type selection with 7 audit plan types
 * - Multi-field form with validation (description, hours, cost, focus areas)
 * - Focus areas checkbox grid (8 tax compliance topics)
 * - Support for existing plan editing and deletion
 * - Auto-calculates character count for description
 * - Character limits: Description (200-2000 chars)
 * - Full form validation with error messages
 * 
 * @component
 * @param {boolean} isOpen - Controls modal visibility
 * @param {string} caseId - ID of the audit case
 * @param {Function} onClose - Callback to close modal
 * @param {Function} onSave - Callback when plan is saved
 * @returns {React.ReactElement|null} Modal overlay with treatment plan form, null if not open
 */
function TreatmentPlanModal({ isOpen, caseId, onClose, onSave }) {
  const [planType, setPlanType] = useState('');
  const { data, updateData } = useData();
  const [description, setDescription] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [assignedAuditor, setAssignedAuditor] = useState('');
  const [focusAreas, setFocusAreas] = useState({
    'Revenue Recognition': false,
    'Transfer Pricing': false,
    'VAT Compliance': false,
    'Withholding Tax': false,
    'Payroll Tax': false,
    'Asset Valuation': false,
    'Related Party Transactions': false,
    'Documentation Compliance': false
  });
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [existingPlan, setExistingPlan] = useState(null);

  // Load existing plan if editing
  useEffect(() => {
    if (isOpen && caseId) {
      // Using data from hook
      const auditCase = data.auditCases?.find(c => c.id === caseId);
      if (auditCase?.treatmentPlan) {
        const plan = auditCase.treatmentPlan;
        setExistingPlan(plan);
        setPlanType(plan.planType || '');
        setDescription(plan.description || '');
        setEstimatedHours(plan.estimatedHours || '');
        setEstimatedCost(plan.estimatedCost || '');
        setAssignedAuditor(plan.assignedAuditor || '');
        setNotes(plan.notes || '');
        
        // Restore focus areas
        if (plan.keyFocusAreas) {
          const newFocusAreas = { ...focusAreas };
          plan.keyFocusAreas.forEach(area => {
            if (newFocusAreas.hasOwnProperty(area)) {
              newFocusAreas[area] = true;
            }
          });
          setFocusAreas(newFocusAreas);
        }
      }
    }
  }, [isOpen, caseId]);

  const validateForm = () => {
    const newErrors = {};

    if (!planType) newErrors.planType = 'Plan Type is required';
    if (!description || description.length < 200) newErrors.description = 'Description must be at least 200 characters';
    if (description.length > 2000) newErrors.description = 'Description must not exceed 2000 characters';
    if (!estimatedHours || estimatedHours <= 0) newErrors.estimatedHours = 'Estimated hours must be greater than 0';
    if (estimatedCost && estimatedCost < 0) newErrors.estimatedCost = 'Estimated cost must be non-negative';
    
    const selectedAreas = Object.entries(focusAreas).filter(([_, checked]) => checked);
    if (selectedAreas.length === 0) newErrors.focusAreas = 'Select at least one focus area';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    // Using data from hook
    const caseIdx = data.auditCases?.findIndex(c => c.id === caseId);

    if (caseIdx >= 0) {
      const selectedAreas = Object.entries(focusAreas)
        .filter(([_, checked]) => checked)
        .map(([area, _]) => area);

      const treatmentPlan = {
        id: existingPlan?.id || `TP-${caseId}-${Date.now()}`,
        caseId,
        planType,
        description,
        estimatedHours: parseInt(estimatedHours),
        estimatedCost: estimatedCost ? parseInt(estimatedCost) : null,
        assignedAuditor,
        keyFocusAreas: selectedAreas,
        notes,
        attachments: existingPlan?.attachments || [],
        createdDate: existingPlan?.createdDate || new Date().toISOString(),
        createdBy: existingPlan?.createdBy || 'Tax Center Manager',
        lastModified: new Date().toISOString(),
        modifiedBy: 'Tax Center Manager'
      };

      data.auditCases[caseIdx].treatmentPlan = treatmentPlan;
      updateData(data);

      if (onSave) onSave(treatmentPlan);
      handleClose();
    }
  };

  const handleDelete = () => {
    if (!window.confirm('Delete this treatment plan? This action cannot be undone.')) return;

    // Using data from hook
    const caseIdx = data.auditCases?.findIndex(c => c.id === caseId);

    if (caseIdx >= 0) {
      data.auditCases[caseIdx].treatmentPlan = null;
      updateData(data);
      handleClose();
      alert('Treatment plan deleted');
    }
  };

  const handleClose = () => {
    setPlanType('');
    setDescription('');
    setEstimatedHours('');
    setEstimatedCost('');
    setAssignedAuditor('');
    setNotes('');
    setFocusAreas({
      'Revenue Recognition': false,
      'Transfer Pricing': false,
      'VAT Compliance': false,
      'Withholding Tax': false,
      'Payroll Tax': false,
      'Asset Valuation': false,
      'Related Party Transactions': false,
      'Documentation Compliance': false
    });
    setErrors({});
    setExistingPlan(null);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  const planTypes = [
    'Standard Audit Treatment Plan',
    'Comprehensive Audit Plan',
    'Desk Audit Plan',
    'Field Audit Plan',
    'Transfer Pricing Audit Plan',
    'Single Issue Audit Plan',
    'Forensic Audit Plan'
  ];

  return (
    <div 
      onClick={handleBackdropClick} 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 dark:bg-black/80"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="modal-base w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl"
      >
        {/* Header */}
        <div className="modal-header border-b border-border dark:border-border-dark bg-panel dark:bg-panel-dark p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-text-hi dark:text-text-hi-dark m-0">
            {existingPlan ? 'Edit' : 'Attach'} Treatment Plan
          </h2>
          <button
            onClick={handleClose}
            className="bg-transparent border-0 text-text-mid dark:text-text-mid-dark hover:text-text-hi dark:hover:text-text-hi-dark text-xl cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          {/* Plan Type */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-text-hi dark:text-text-hi-dark mb-2">
              Plan Type <span className="text-red-500">*</span>
            </label>
            <select 
              value={planType} 
              onChange={(e) => setPlanType(e.target.value)}
              className={`form-input w-full ${errors.planType ? 'border-red-500' : ''}`}
            >
              <option value="">Select a plan type...</option>
              {planTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.planType && <small className="text-red-500 text-xs mt-1 block">{errors.planType}</small>}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-text-hi dark:text-text-hi-dark mb-2">
              Description ({description.length}/2000 chars) <span className="text-red-500">*</span>
            </label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed description of audit objectives, scope, and methodology..."
              className={`form-input w-full min-h-[100px] font-mono ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && <small className="text-red-500 text-xs mt-1 block">{errors.description}</small>}
          </div>

          {/* Estimated Hours */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-text-hi dark:text-text-hi-dark mb-2">
              Estimated Hours <span className="text-red-500">*</span>
            </label>
            <input 
              type="number" 
              value={estimatedHours} 
              onChange={(e) => setEstimatedHours(e.target.value)}
              placeholder="e.g., 120"
              className={`form-input w-full ${errors.estimatedHours ? 'border-red-500' : ''}`}
            />
            {errors.estimatedHours && <small className="text-red-500 text-xs mt-1 block">{errors.estimatedHours}</small>}
          </div>

          {/* Estimated Cost */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-text-hi dark:text-text-hi-dark mb-2">
              Estimated Cost (ETB)
            </label>
            <input 
              type="number" 
              value={estimatedCost} 
              onChange={(e) => setEstimatedCost(e.target.value)}
              placeholder="Optional - cost in ETB"
              className={`form-input w-full ${errors.estimatedCost ? 'border-red-500' : ''}`}
            />
          </div>

          {/* Key Focus Areas */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-text-hi dark:text-text-hi-dark mb-2">
              Key Focus Areas <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3 mb-2">
              {Object.entries(focusAreas).map(([area, checked]) => (
                <label key={area} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setFocusAreas({ ...focusAreas, [area]: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-text-hi dark:text-text-hi-dark">{area}</span>
                </label>
              ))}
            </div>
            {errors.focusAreas && <small className="text-red-500 text-xs mt-1 block">{errors.focusAreas}</small>}
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-text-hi dark:text-text-hi-dark mb-2">
              Additional Notes
            </label>
            <textarea 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes or comments..."
              className="form-input w-full min-h-[60px] font-mono"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer border-t border-border dark:border-border-dark bg-panel dark:bg-panel-dark p-4 flex items-center justify-between gap-3">
          <div>
            {existingPlan && (
              <button
                onClick={handleDelete}
                className="btn btn-danger"
              >
                <i className="fas fa-trash mr-1"></i>Delete
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn btn-success"
            >
              <i className="fas fa-save mr-1"></i>Save Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TreatmentPlanModal;
