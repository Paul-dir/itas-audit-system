import React from 'react';

/**
 * PlanSelector - Reusable plan selector component
 * Used across regional views to allow switching between plans
 */
function PlanSelector({ 
  selectedPlan, 
  plans, 
  selectedRegion, 
  onPlanChange,
  compact = false 
}) {
  if (!plans || plans.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <label style={{ fontSize: '13px', fontWeight: '500', color: '#2d3d4d' }}>
          <i className="fas fa-file-alt"></i> Plan:
        </label>
        <select
          value={selectedPlan || ''}
          onChange={(e) => onPlanChange(e.target.value)}
          style={{
            padding: '6px 10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '13px',
            cursor: 'pointer',
            background: '#0f1419',
            minWidth: '120px'
          }}
        >
          <option value="">Select a plan...</option>
          {plans.map(plan => (
            <option key={plan.id} value={plan.id}>
              {plan.id} - FY {plan.fiscalYear}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div style={{
      background: '#1a2332',
      padding: '12px 16px',
      borderRadius: '6px',
      marginBottom: '16px',
      border: '1px solid #2d3d4d',
      display: 'flex',
      gap: '12px',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1 }}>
        <label style={{ fontSize: '14px', fontWeight: '500', color: '#2d3d4d' }}>
          <i className="fas fa-file-alt"></i> Working with Plan:
        </label>
        <select
          value={selectedPlan || ''}
          onChange={(e) => onPlanChange(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: '2px solid #1976d2',
            fontSize: '14px',
            cursor: 'pointer',
            background: '#0f1419',
            fontWeight: '500',
            minWidth: '150px'
          }}
        >
          <option value="">Select a plan...</option>
          {plans.map(plan => (
            <option key={plan.id} value={plan.id}>
              {plan.id} - FY {plan.fiscalYear} {plans.length > 1 ? '✓' : ''}
            </option>
          ))}
        </select>
      </div>
      {plans.length > 1 && (
        <div style={{
          background: '#0f1419', color: '#f0f6fc',
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#f57f17',
          fontWeight: '500'
        }}>
          {plans.length} plans available
        </div>
      )}
    </div>
  );
}

export default PlanSelector;
