import React, { useState, useEffect } from 'react';
import { createNationalPlan, submitPlanToDirector } from '../../utils/businessLogic';

/**
 * CreatePlanModal Component
 * Modal for creating a new national audit plan with regional allocations.
 * 
 * Features:
 * - Fiscal year selection (2020 - current + 5 years)
 * - Planning period date range selection
 * - Regional allocation grid editor with 6 regions
 * - Effort estimate input
 * - Save as draft or submit to director
 * 
 * Auto-populated on mount:
 * - Year: Next fiscal year
 * - Planning period: Current calendar year (Jan 1 - Dec 31)
 * - Default regional allocations with pre-set values
 * 
 * @component
 * @param {Function} onClose - Callback to close modal
 * @returns {React.ReactElement} Modal overlay with plan creation form
 */
function CreatePlanModal({ onClose }) {
  const [year, setYear] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [effort, setEffort] = useState(48000);
  const [allocations, setAllocations] = useState([
    { region: 'Addis Ababa', total: 6000, desk: 2400, field: 2100, tp: 300, issue: 900 },
    { region: 'Oromia', total: 5500, desk: 2200, field: 2100, tp: 300, issue: 900 },
    { region: 'Amhara', total: 3500, desk: 1400, field: 1400, tp: 200, issue: 500 },
    { region: 'Sidama', total: 2000, desk: 800, field: 800, tp: 100, issue: 300 },
    { region: 'Dire Dawa', total: 1500, desk: 600, field: 600, tp: 100, issue: 200 },
    { region: 'Somali', total: 1500, desk: 600, field: 600, tp: 100, issue: 200 }
  ]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setYear((currentYear + 1).toString());
    
    const today = new Date();
    const jan1 = new Date(today.getFullYear(), 0, 1);
    const dec31 = new Date(today.getFullYear(), 11, 31);
    setStartDate(jan1.toISOString().split('T')[0]);
    setEndDate(dec31.toISOString().split('T')[0]);
  }, []);

  const calculateTotal = () => {
    return allocations.reduce((sum, a) => sum + a.total, 0);
  };

  const updateAllocation = (index, field, value) => {
    const newAllocations = [...allocations];
    newAllocations[index][field] = parseInt(value) || 0;
    setAllocations(newAllocations);
  };

  const handleSaveDraft = () => {
    createNationalPlan(year, allocations, effort, startDate, endDate);
    alert('Plan created as DRAFT.');
    onClose();
  };

  const handleSubmit = () => {
    const plan = createNationalPlan(year, allocations, effort, startDate, endDate);
    submitPlanToDirector(plan.id);
    alert('Plan submitted to Director.');
    onClose();
  };

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let y = 2020; y <= currentYear + 5; y++) {
    years.push(y);
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-base w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="modal-header border-b border-border dark:border-border-dark bg-panel dark:bg-panel-dark">
          <h2 className="text-lg font-semibold text-text-hi dark:text-text-hi-dark">
            <i className="fas fa-calendar-plus text-blue-400 mr-2"></i>
            Create National Plan
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Fiscal Year */}
          <div className="form-group">
            <label className="block text-sm font-medium text-text-hi dark:text-text-hi-dark mb-2">
              Fiscal Year
            </label>
            <select 
              value={year} 
              onChange={(e) => setYear(e.target.value)}
              className="form-select w-full"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Planning Period */}
          <div className="form-group">
            <label className="block text-sm font-medium text-text-hi dark:text-text-hi-dark mb-2">
              Planning Period
            </label>
            <div className="flex gap-4">
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className="form-input flex-1"
              />
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                className="form-input flex-1"
              />
            </div>
          </div>

          {/* Regional Allocations */}
          <div className="form-group">
            <label className="block text-sm font-medium text-text-hi dark:text-text-hi-dark mb-3">
              Regional Allocations
            </label>
            <div className="border border-border dark:border-border-dark rounded-lg overflow-hidden">
              {/* Header Row */}
              <div className="grid grid-cols-6 gap-2 p-3 bg-panel dark:bg-panel-dark border-b border-border dark:border-border-dark">
                <span className="text-xs font-bold text-text-mid dark:text-text-mid-dark">Region</span>
                <span className="text-xs font-bold text-text-mid dark:text-text-mid-dark">Total</span>
                <span className="text-xs font-bold text-text-mid dark:text-text-mid-dark">Desk</span>
                <span className="text-xs font-bold text-text-mid dark:text-text-mid-dark">Field</span>
                <span className="text-xs font-bold text-text-mid dark:text-text-mid-dark">TP</span>
                <span className="text-xs font-bold text-text-mid dark:text-text-mid-dark">Issue</span>
              </div>

              {/* Data Rows */}
              <div className="divide-y divide-border dark:divide-border-dark">
                {allocations.map((alloc, index) => (
                  <div key={index} className="grid grid-cols-6 gap-2 p-3 hover:bg-panel/50 dark:hover:bg-panel-dark/50 transition-colors">
                    <input 
                      type="text" 
                      value={alloc.region} 
                      readOnly 
                      className="text-sm text-text-hi dark:text-text-hi-dark bg-transparent font-medium truncate"
                    />
                    <input 
                      type="number" 
                      value={alloc.total} 
                      onChange={(e) => updateAllocation(index, 'total', e.target.value)}
                      className="form-input text-sm"
                    />
                    <input 
                      type="number" 
                      value={alloc.desk} 
                      onChange={(e) => updateAllocation(index, 'desk', e.target.value)}
                      className="form-input text-sm"
                    />
                    <input 
                      type="number" 
                      value={alloc.field} 
                      onChange={(e) => updateAllocation(index, 'field', e.target.value)}
                      className="form-input text-sm"
                    />
                    <input 
                      type="number" 
                      value={alloc.tp} 
                      onChange={(e) => updateAllocation(index, 'tp', e.target.value)}
                      className="form-input text-sm"
                    />
                    <input 
                      type="number" 
                      value={alloc.issue} 
                      onChange={(e) => updateAllocation(index, 'issue', e.target.value)}
                      className="form-input text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Total Display */}
          <div className="form-group p-4 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700/50 rounded-lg">
            <label className="text-sm font-medium text-text-hi dark:text-text-hi-dark">
              Total National Cases: <span className="font-bold text-teal-600 dark:text-teal-400">{calculateTotal()}</span>
            </label>
          </div>

          {/* Effort Estimate */}
          <div className="form-group">
            <label className="block text-sm font-medium text-text-hi dark:text-text-hi-dark mb-2">
              Effort Estimate (hours)
            </label>
            <input 
              type="number" 
              value={effort} 
              onChange={(e) => setEffort(parseInt(e.target.value) || 0)}
              className="form-input w-full"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer border-t border-border dark:border-border-dark bg-panel dark:bg-panel-dark p-4 flex gap-3 justify-end">
          <button 
            onClick={onClose}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveDraft}
            className="btn btn-primary"
          >
            Save Draft
          </button>
          <button 
            onClick={handleSubmit}
            className="btn btn-success"
          >
            Submit to Director
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePlanModal;
