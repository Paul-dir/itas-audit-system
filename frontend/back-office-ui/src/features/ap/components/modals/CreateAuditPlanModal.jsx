import React, { useState, useEffect } from 'react';
import { createAuditPlan, updateAuditPlan } from '../../utils/businessLogic';
import { useData } from '../../services/dataService';
import { auditConfig } from '../../config/auditConfig';

/**
 * CreateAuditPlanModal Component
 * Modal for creating or editing annual audit plans with comprehensive configuration.
 * 
 * Features:
 * - Fiscal year and planning period selection
 * - Audit tactics and notes entry
 * - Audit type volume configuration with effort calculations
 * - Regional distribution grid for case allocation
 * - Skill requirements tracking with gap analysis
 * - Validation: total regional distribution must equal total audit volume
 * - Edit mode: pre-populates form with existing plan data
 * 
 * Calculations:
 * - Total effort = volume × effort per case (auto-calculated)
 * - Capacity status based on available skills vs required effort
 * - Skill gap = required hours - available capacity
 * 
 * @component
 * @param {Object} existingPlan - Optional existing plan for edit mode
 * @param {Function} onClose - Callback to close modal
 * @returns {React.ReactElement} Modal overlay with audit plan form
 */
function CreateAuditPlanModal({ existingPlan, onClose }) {
  const isEdit = !!existingPlan;
  const { data, updateData, refreshData } = useData();
  const taxpayerPool = data?.config?.taxpayerCategories || [];
  
  const [fiscalYear, setFiscalYear] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tactics, setTactics] = useState('');
  const [notes, setNotes] = useState('');

  const [auditTypes, setAuditTypes] = useState(
    auditConfig.auditTypes.map(t => ({ 
      name: t.name, 
      volume: 0, 
      effortPerCase: t.effortPerCase, 
      description: t.description,
      totalEffort: 0 
    }))
  );

  const [locations, setLocations] = useState(
    auditConfig.regions.map(r => ({
      name: r.name,
      taxpayers: r.taxpayers,
      cases: 0,
      ...Object.fromEntries(auditConfig.auditTypes.map((t, i) => [`type_${i}`, 0])),
      availableSkills: r.availableSkills,
      capacityStatus: 'Sufficient',
      totalEffort: 0
    }))
  );

  const [skillRequirements, setSkillRequirements] = useState(
    auditConfig.skillTypes.map(s => ({
      type: s.type,
      requiredHours: 0,
      availableCapacity: s.availableCapacity,
      gap: 0
    }))
  );

  useEffect(() => {
    if (existingPlan) {
      setFiscalYear(existingPlan.fiscalYear || '');
      setStartDate(existingPlan.startDate || '');
      setEndDate(existingPlan.endDate || '');
      setTactics(existingPlan.tactics || '');
      setNotes(existingPlan.notes || '');
      if (existingPlan.auditTypes) setAuditTypes(existingPlan.auditTypes);
      if (existingPlan.locations) setLocations(existingPlan.locations);
      if (existingPlan.skillRequirements) setSkillRequirements(existingPlan.skillRequirements);
    } else {
      const currentYear = new Date().getFullYear();
      setFiscalYear((currentYear + 1).toString());
      const jan1 = new Date(currentYear, 0, 1).toISOString().split('T')[0];
      const dec31 = new Date(currentYear, 11, 31).toISOString().split('T')[0];
      setStartDate(jan1);
      setEndDate(dec31);
      setTactics('Focus on high-risk sectors including manufacturing, import/export, and professional services.');
    }
  }, [existingPlan]);

  const updateAuditType = (index, field, value) => {
    const updated = [...auditTypes];
    updated[index][field] = parseInt(value) || 0;
    if (field === 'volume' || field === 'effortPerCase') {
      updated[index].totalEffort = updated[index].volume * updated[index].effortPerCase;
    }
    setAuditTypes(updated);
    recalculateSkills(updated);
  };

  const updateLocation = (index, field, value) => {
    const updated = [...locations];
    const parsedValue = parseInt(value) || 0;
    updated[index][field] = parsedValue;
    
    // If updating an audit type field, recalculate totals
    if (field.startsWith('type_')) {
      // Calculate total cases
      updated[index].cases = auditConfig.auditTypes.reduce((sum, _, i) => 
        sum + (updated[index][`type_${i}`] || 0), 0
      );
      
      // Calculate total effort based on each audit type's effort per case
      const totalEffort = auditConfig.auditTypes.reduce((sum, type, i) => 
        sum + ((updated[index][`type_${i}`] || 0) * type.effortPerCase), 0
      );
      
      updated[index].totalEffort = totalEffort;
      const requiredSkills = Math.ceil(totalEffort / 2000);
      updated[index].capacityStatus = requiredSkills <= updated[index].availableSkills ? 'Sufficient' : 'Shortage';
    }
    
    setLocations(updated);
  };

  const recalculateSkills = (types) => {
    const totalEffort = types.reduce((sum, t) => sum + t.totalEffort, 0);
    const updated = skillRequirements.map(skill => {
      const skillConfig = auditConfig.skillTypes.find(s => s.type === skill.type);
      const requiredHours = Math.round(totalEffort * (skillConfig?.effortPercentage || 0));
      const gap = requiredHours - skill.availableCapacity;
      return { ...skill, requiredHours, gap };
    });
    setSkillRequirements(updated);
  };

  const calculateTotals = () => {
    const totalVolume = auditTypes.reduce((sum, t) => sum + t.volume, 0);
    const totalEffort = auditTypes.reduce((sum, t) => sum + t.totalEffort, 0);
    const locationTotal = locations.reduce((sum, l) => sum + l.cases, 0);
    
    const locationBreakdown = Object.fromEntries(
      auditConfig.auditTypes.map((_, i) => [
        `type_${i}`,
        locations.reduce((sum, l) => sum + (l[`type_${i}`] || 0), 0)
      ])
    );
    
    return { totalVolume, totalEffort, locationTotal, locationBreakdown };
  };

  const handleSaveDraft = () => {
    const totals = calculateTotals();
    
    if (totals.totalVolume === 0) {
      alert('Please enter at least one audit case volume.');
      return;
    }

    if (totals.locationTotal !== totals.totalVolume) {
      alert(`Location distribution (${totals.locationTotal}) must equal total volume (${totals.totalVolume})`);
      return;
    }

    const planData = {
      fiscalYear,
      startDate,
      endDate,
      duration: calculateDuration(),
      tactics,
      notes,
      auditTypes: auditTypes.map(t => ({ ...t })),
      locations: locations.map(l => ({ ...l })),
      skillRequirements: skillRequirements.map(s => ({ ...s })),
      totalVolume: totals.totalVolume,
      totalEffortHours: totals.totalEffort
    };

    if (isEdit) {
      updateAuditPlan(existingPlan.id, planData);
      alert('Plan updated successfully!');
    } else {
      createAuditPlan(planData);
      alert('Plan saved as draft!');
    }
    refreshData();
    onClose();
  };

  const handleSaveAndSubmit = () => {
    const totals = calculateTotals();
    
    if (totals.totalVolume === 0) {
      alert('Please enter at least one audit case volume.');
      return;
    }

    if (totals.locationTotal !== totals.totalVolume) {
      alert(`Location distribution (${totals.locationTotal}) must equal total volume (${totals.totalVolume})`);
      return;
    }

    const planData = {
      fiscalYear,
      startDate,
      endDate,
      duration: calculateDuration(),
      tactics,
      notes,
      auditTypes: auditTypes.map(t => ({ ...t })),
      locations: locations.map(l => ({ ...l })),
      skillRequirements: skillRequirements.map(s => ({ ...s })),
      totalVolume: totals.totalVolume,
      totalEffortHours: totals.totalEffort,
      submitImmediate: true
    };

    if (isEdit) {
      updateAuditPlan(existingPlan.id, planData);
      alert('Plan updated and submitted to Director!');
    } else {
      createAuditPlan(planData);
      alert('Plan created and submitted to Director!');
    }
    refreshData();
    onClose();
  };

  const calculateDuration = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const totals = calculateTotals();
  const years = [];
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y <= currentYear + 5; y++) years.push(y);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-base w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="modal-header border-b border-border dark:border-border-dark bg-panel dark:bg-panel-dark">
          <h2 className="text-lg font-semibold text-text-hi dark:text-text-hi-dark">
            <i className="fas fa-clipboard-list text-blue-400 mr-2"></i>
            {isEdit ? 'Edit Audit Plan' : 'Create Annual Audit Plan'}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Taxpayer Pool Card */}
          <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-text-hi dark:text-text-hi-dark mb-2">
              <i className="fas fa-users text-teal-600 dark:text-teal-400 mr-2"></i>
              Total Taxpayers
            </h3>
            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
              {taxpayerPool.total.toLocaleString()}
            </div>
          </div>

          {/* Fiscal Year */}
          <div className="form-group">
            <label className="block text-sm font-medium text-text-hi dark:text-text-hi-dark mb-2">
              <i className="fas fa-calendar-alt mr-2"></i>Fiscal Year
            </label>
            <select 
              value={fiscalYear} 
              onChange={(e) => setFiscalYear(e.target.value)}
              className="form-select w-full"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Planning Period */}
          <div className="form-group">
            <label className="block text-sm font-medium text-text-hi dark:text-text-hi-dark mb-2">
              <i className="fas fa-clock mr-2"></i>Planning Period
            </label>
            <div className="flex gap-4 mb-2">
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
            <p className="text-xs text-text-mid dark:text-text-mid-dark">
              Duration: {calculateDuration()} days
            </p>
          </div>

          {/* Annual Audit Tactics */}
          <div className="form-group">
            <label className="block text-sm font-medium text-text-hi dark:text-text-hi-dark mb-2">
              <i className="fas fa-bullseye mr-2"></i>Annual Audit Tactics
            </label>
            <textarea 
              value={tactics}
              onChange={(e) => setTactics(e.target.value)}
              rows="3"
              placeholder="Strategic focus areas and priorities..."
              className="form-input w-full resize-none"
            />
          </div>

          {/* Audit Volume by Type */}
          <div>
            <h3 className="text-sm font-semibold text-text-hi dark:text-text-hi-dark mb-3">
              <i className="fas fa-list-ol mr-2"></i>Total Audit Volume by Type
            </h3>
            <div className="border border-border dark:border-border-dark rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-panel dark:bg-panel-dark border-b border-border dark:border-border-dark">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-text-hi dark:text-text-hi-dark">Audit Type</th>
                    <th className="px-4 py-2 text-left font-semibold text-text-hi dark:text-text-hi-dark">Description</th>
                    <th className="px-4 py-2 text-center font-semibold text-text-hi dark:text-text-hi-dark">Total Cases</th>
                    <th className="px-4 py-2 text-center font-semibold text-text-hi dark:text-text-hi-dark">Effort/Case (hrs)</th>
                    <th className="px-4 py-2 text-right font-semibold text-text-hi dark:text-text-hi-dark">Total Effort (hrs)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-border-dark">
                  {auditTypes.map((type, index) => (
                    <tr key={type.name} className="hover:bg-panel/50 dark:hover:bg-panel-dark/50 transition-colors">
                      <td className="px-4 py-2 font-semibold text-text-hi dark:text-text-hi-dark">{type.name}</td>
                      <td className="px-4 py-2 text-xs text-text-mid dark:text-text-mid-dark">{type.description}</td>
                      <td className="px-4 py-2 text-center">
                        <input 
                          type="number" 
                          value={type.volume}
                          onChange={(e) => updateAuditType(index, 'volume', e.target.value)}
                          className="form-input w-20 text-center"
                          min="0"
                        />
                      </td>
                      <td className="px-4 py-2 text-center text-text-mid dark:text-text-mid-dark">{type.effortPerCase}</td>
                      <td className="px-4 py-2 text-right font-semibold text-text-hi dark:text-text-hi-dark">{type.totalEffort}</td>
                    </tr>
                  ))}
                  <tr className="bg-blue-50 dark:bg-blue-900/20 border-t-2 border-blue-200 dark:border-blue-700/50 font-bold text-blue-900 dark:text-blue-100">
                    <td colSpan="2" className="px-4 py-2">TOTAL AUDIT VOLUME</td>
                    <td className="px-4 py-2 text-center">{totals.totalVolume}</td>
                    <td className="px-4 py-2 text-center">-</td>
                    <td className="px-4 py-2 text-right">{totals.totalEffort}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4 text-sm text-blue-900 dark:text-blue-100">
            <strong>📋 Instructions:</strong> First enter total volume for each audit type above. Then distribute these cases across regions in the Regional Distribution table below.
          </div>

          {/* Regional Distribution */}
          <div>
            <h3 className="text-sm font-semibold text-text-hi dark:text-text-hi-dark mb-3">
              <i className="fas fa-layer-group mr-2"></i>Regional Distribution
            </h3>
            <div className="border border-border dark:border-border-dark rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-panel dark:bg-panel-dark border-b border-border dark:border-border-dark">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-text-hi dark:text-text-hi-dark">Region</th>
                    <th className="px-4 py-2 text-center font-semibold text-text-hi dark:text-text-hi-dark">Taxpayers</th>
                    {auditConfig.auditTypes.map((type, i) => (
                      <th key={`header_${i}`} className="px-4 py-2 text-center font-semibold text-text-hi dark:text-text-hi-dark text-xs">
                        {type.name}
                      </th>
                    ))}
                    <th className="px-4 py-2 text-center font-semibold text-text-hi dark:text-text-hi-dark">Total</th>
                    <th className="px-4 py-2 text-center font-semibold text-text-hi dark:text-text-hi-dark">Effort</th>
                    <th className="px-4 py-2 text-center font-semibold text-text-hi dark:text-text-hi-dark">Skills</th>
                    <th className="px-4 py-2 text-center font-semibold text-text-hi dark:text-text-hi-dark">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-border-dark">
                  {locations.map((loc, index) => (
                    <tr key={loc.name} className="hover:bg-panel/50 dark:hover:bg-panel-dark/50 transition-colors">
                      <td className="px-4 py-2 font-semibold text-text-hi dark:text-text-hi-dark">{loc.name}</td>
                      <td className="px-4 py-2 text-center text-sm text-text-mid dark:text-text-mid-dark">{loc.taxpayers.toLocaleString()}</td>
                      {auditConfig.auditTypes.map((type, typeIndex) => (
                        <td key={`cell_${typeIndex}`} className="px-4 py-2 text-center">
                          <input 
                            type="number" 
                            value={loc[`type_${typeIndex}`] || 0}
                            onChange={(e) => updateLocation(index, `type_${typeIndex}`, e.target.value)}
                            className="form-input w-16 text-center text-sm"
                            min="0"
                          />
                        </td>
                      ))}
                      <td className="px-4 py-2 text-center font-semibold text-text-hi dark:text-text-hi-dark">{loc.cases}</td>
                      <td className="px-4 py-2 text-center text-text-mid dark:text-text-mid-dark">{loc.totalEffort}</td>
                      <td className="px-4 py-2 text-center text-text-mid dark:text-text-mid-dark">{loc.availableSkills}</td>
                      <td className="px-4 py-2 text-center">
                        <span className={`badge ${loc.capacityStatus === 'Sufficient' ? 'badge-approved' : 'badge-rejected'}`}>
                          {loc.capacityStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-blue-50 dark:bg-blue-900/20 border-t-2 border-blue-200 dark:border-blue-700/50 font-bold text-blue-900 dark:text-blue-100">
                    <td colSpan="2" className="px-4 py-2">TOTAL</td>
                    {auditConfig.auditTypes.map((type, i) => (
                      <td key={`total_${i}`} className="px-4 py-2 text-center">
                        {totals.locationBreakdown[`type_${i}`] || 0}
                      </td>
                    ))}
                    <td className="px-4 py-2 text-center">{totals.locationTotal}</td>
                    <td colSpan="3" className="px-4 py-2 text-center">
                      {totals.locationTotal !== totals.totalVolume && (
                        <span className="text-red-600 dark:text-red-400">
                          ⚠️ Must equal {totals.totalVolume}
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="block text-sm font-medium text-text-hi dark:text-text-hi-dark mb-2">
              Additional Notes
            </label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="2"
              placeholder="Any additional details or comments..."
              className="form-input w-full resize-none"
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
            <i className="fas fa-save mr-1"></i>
            {isEdit ? 'Update' : 'Save as Draft'}
          </button>
          <button 
            onClick={handleSaveAndSubmit}
            className="btn btn-success"
          >
            <i className="fas fa-paper-plane mr-1"></i>
            {isEdit ? 'Update & Submit' : 'Save & Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateAuditPlanModal;
