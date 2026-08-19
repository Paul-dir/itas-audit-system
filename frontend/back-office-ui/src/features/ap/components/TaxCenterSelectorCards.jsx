import React, { useState } from 'react';

function TaxCenterSelectorCards({ onTaxCenterSelect, selectedRegion, selectedTaxCenter }) {
  const [hoveredTC, setHoveredTC] = useState(null);

  // Generate 3 tax centers for the region
  const getTaxCentersForRegion = (region) => {
    return [
      { 
        id: `${region}-tc1`, 
        name: `${region} Tax Center 1`,
        managers: 2,
        teams: 2,
        icon: 'fas fa-building',
        color: '#4a8fd9'
      },
      { 
        id: `${region}-tc2`, 
        name: `${region} Tax Center 2`,
        managers: 1,
        teams: 2,
        icon: 'fas fa-office-building',
        color: '#52c77a'
      },
      { 
        id: `${region}-tc3`, 
        name: `${region} Tax Center 3`,
        managers: 1,
        teams: 1,
        icon: 'fas fa-home',
        color: '#4a8fd9'
      }
    ];
  };

  const taxCenters = selectedRegion ? getTaxCentersForRegion(selectedRegion) : [];
  const isSelected = (tcId) => selectedTaxCenter === tcId;

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: '#1a2332' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '600', margin: '0 0 8px 0', color: '#4a8fd9' }}>
          <i className="fas fa-building" style={{ marginRight: '12px', color: '#4a8fd9' }}></i>
          Select Your Tax Center
        </h1>
        <p style={{ fontSize: '15px', color: '#a0aec0', margin: '0', lineHeight: '1.6' }}>
          Choose which tax center you represent in <strong>{selectedRegion}</strong>. You can manage audit allocation and provide feedback from this tax center.
        </p>
      </div>

      {/* Tax Center Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {taxCenters.map((tc) => {
          const selected = isSelected(tc.id);
          const hovered = hoveredTC === tc.id;

          return (
            <div
              key={tc.id}
              onClick={() => onTaxCenterSelect(tc.id)}
              onMouseEnter={() => setHoveredTC(tc.id)}
              onMouseLeave={() => setHoveredTC(null)}
              style={{
                background: '#1e2a3a',
                border: selected ? `3px solid ${tc.color}` : '1px solid #2d3d4d',
                borderRadius: '12px',
                padding: '28px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: hovered 
                  ? `0 16px 32px rgba(0,0,0,0.12), 0 0 0 1px ${tc.color}20`
                  : selected 
                  ? `0 8px 20px rgba(0,0,0,0.1), 0 0 0 1px ${tc.color}40`
                  : '0 2px 4px rgba(0,0,0,0.04)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Top accent bar */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: tc.color,
                opacity: selected ? 1 : 0.3
              }}></div>

              {/* Icon */}
              <div style={{
                width: '56px',
                height: '56px',
                background: `${tc.color}15`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: tc.color,
                fontSize: '28px',
                marginBottom: '16px'
              }}>
                <i className={tc.icon}></i>
              </div>

              {/* Title and Selected Badge */}
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '700', color: '#4a8fd9' }}>
                  {tc.name}
                </h3>
                {selected && (
                  <span style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    color: tc.color,
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    ✓ Selected
                  </span>
                )}
              </div>

              {/* Stats Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '20px',
                paddingBottom: '20px',
                borderBottom: '1px solid #0f1419'
              }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#999', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                    Managers
                  </p>
                  <p style={{ fontSize: '20px', fontWeight: '700', margin: '0', color: tc.color }}>
                    {tc.managers}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#999', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                    Teams
                  </p>
                  <p style={{ fontSize: '20px', fontWeight: '700', margin: '0', color: tc.color }}>
                    {tc.teams}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                style={{
                  width: '100%',
                  padding: '12px',
                  background: selected ? tc.color : 'transparent',
                  color: selected ? '#0f1419' : tc.color,
                  border: `2px solid ${tc.color}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}
                onMouseEnter={(e) => {
                  if (!selected) {
                    e.target.style.background = `${tc.color}08`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selected) {
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                {selected ? '✓ Selected' : 'Select Tax Center'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Info Section */}
      <div style={{
        background: '#1e2a3a',
        border: '1px solid #2d3d4d',
        borderRadius: '12px',
        padding: '24px'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#4a8fd9' }}>
          <i className="fas fa-info-circle" style={{ marginRight: '8px', color: '#4a8fd9' }}></i>
          What You'll Access
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#4a8fd9', margin: '0 0 4px 0' }}>
              <i className="fas fa-tasks" style={{ marginRight: '6px', color: '#4a8fd9' }}></i>
              Audit Allocation
            </p>
            <p style={{ fontSize: '12px', color: '#a0aec0', margin: '0', lineHeight: '1.5' }}>
              View cases allocated to your tax center
            </p>
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#4a8fd9', margin: '0 0 4px 0' }}>
              <i className="fas fa-comments" style={{ marginRight: '6px', color: '#52c77a' }}></i>
              Feedback Form
            </p>
            <p style={{ fontSize: '12px', color: '#a0aec0', margin: '0', lineHeight: '1.5' }}>
              Submit capacity and constraint feedback
            </p>
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#4a8fd9', margin: '0 0 4px 0' }}>
              <i className="fas fa-chart-bar" style={{ marginRight: '6px', color: '#4a8fd9' }}></i>
              Risk Analysis
            </p>
            <p style={{ fontSize: '12px', color: '#a0aec0', margin: '0', lineHeight: '1.5' }}>
              View risk data for your tax center
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaxCenterSelectorCards;
