import React from 'react';
import Badge from './Badge';

/**
 * TaxCenterSwitcher Component
 * Allows switching between different tax centers for testing
 * Shows all tax centers in a region and lets you select which one you're logged in as
 */

function TaxCenterSwitcher({ selectedRegion, TAX_CENTER_MAPPING, currentTaxCenter, onSwitchTaxCenter, userRole }) {
  if (!selectedRegion) {
    return null;
  }

  const taxCentersInRegion = TAX_CENTER_MAPPING[selectedRegion] || [];

  return (
    <div style={{
      background: '#f8f9fc', color: '#0c4a6e',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #2d3d4d',
      marginBottom: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <i className="fas fa-building" style={{ color: '#1976d2', fontSize: '18px' }}></i>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
          Tax Center Selection (for Testing)
        </h3>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px'
      }}>
        {taxCentersInRegion.map((tcId, idx) => {
          const isSelected = currentTaxCenter === tcId;
          const tcNumber = idx + 1;
          
          return (
            <button
              key={tcId}
              onClick={() => {
                onSwitchTaxCenter(tcId);
                localStorage.setItem('test_tax_center', tcId);
              }}
              style={{
                padding: '12px',
                background: isSelected ? '#4a8fd9' : '#0f1419',
                color: isSelected ? '#0f1419' : '#2d3d4d',
                border: `2px solid ${isSelected ? '#4a8fd9' : '#2d3d4d'}`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: isSelected ? 'bold' : 'normal',
                fontSize: '13px',
                transition: 'all 0.2s'
              }}
            >
              <i className={`fas ${isSelected ? 'fa-check-circle' : 'fa-building'}`}></i>
              {' '}
              Tax Center {tcNumber}
              {isSelected && <Badge status="Active" className="director-approved" style={{ marginLeft: '8px' }} />}
            </button>
          );
        })}
      </div>

      <div style={{
        fontSize: '12px',
        color: '#a0aec0',
        marginTop: '12px',
        fontStyle: 'italic'
      }}>
        <i className="fas fa-info-circle"></i> Click a tax center to switch. You'll see only that tax center's allocation and feedback.
      </div>
    </div>
  );
}

export default TaxCenterSwitcher;
