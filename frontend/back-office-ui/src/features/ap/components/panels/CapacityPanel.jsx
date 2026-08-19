import React from 'react';

/**
 * CapacityPanel - Right sidebar component showing audit team capacity
 * Displays utilization metrics and allows configuration access
 */

function CapacityPanel({ capacityConfig, onConfigure }) {
  if (!capacityConfig) return null;

  const utilization = ((capacityConfig.totalCapacityHours - capacityConfig.remainingHours) / capacityConfig.totalCapacityHours) * 100;
  
  // Determine utilization color
  let utilizationColor = '#4caf50'; // green < 70%
  if (utilization > 90) utilizationColor = '#ff5252'; // red > 90%
  else if (utilization > 70) utilizationColor = '#ffc107'; // amber 70-90%

  return (
    <div style={{
      width: '280px',
      background: '#0f1419',
      borderRadius: '8px',
      padding: '16px',
      border: '1px solid #30363d',
      height: 'fit-content',
      position: 'sticky',
      top: '20px'
    }}>
      <div style={{ borderBottom: '1px solid #30363d', paddingBottom: '12px', marginBottom: '12px' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '600', color: '#f0f6fc' }}>
          <i className="fas fa-users"></i> AUDIT TEAM CAPACITY
        </h3>
        <small style={{ color: '#8b949e' }}>FY {capacityConfig.fiscalYear}</small>
      </div>

      {/* Capacity Meters */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
          <span style={{ color: '#f0f6fc' }}>Total Capacity:</span>
          <strong style={{ color: '#4caf50' }}>{capacityConfig.totalCapacityHours} hrs</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
          <span style={{ color: '#f0f6fc' }}>Remaining:</span>
          <strong style={{ color: capacityConfig.remainingHours > 0 ? '#4caf50' : '#ff5252' }}>
            {capacityConfig.remainingHours} hrs
          </strong>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          background: '#1c2128',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '8px',
          border: '1px solid #30363d'
        }}>
          <div style={{
            width: `${Math.min(utilization, 100)}%`,
            height: '100%',
            background: utilizationColor,
            transition: 'width 0.3s ease'
          }}></div>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px'
        }}>
          <small style={{ color: '#8b949e' }}>
            Utilization
          </small>
          <small style={{ 
            color: utilizationColor,
            fontWeight: 'bold',
            background: `${utilizationColor}20`,
            padding: '2px 6px',
            borderRadius: '3px'
          }}>
            {utilization.toFixed(0)}%
          </small>
        </div>
      </div>

      {/* Breakdown by Type */}
      <div style={{ borderTop: '1px solid #30363d', paddingTop: '12px', marginTop: '12px' }}>
        <h4 style={{ 
          margin: '0 0 8px 0',
          fontSize: '11px',
          fontWeight: '600',
          color: '#f0f6fc',
          textTransform: 'uppercase'
        }}>
          By Audit Type
        </h4>
        {Object.entries(capacityConfig.allocationByType || {}).map(([type, hours]) => (
          <div key={type} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
            marginBottom: '6px',
            padding: '6px 0',
            borderBottom: '1px solid #1c2128'
          }}>
            <small style={{
              color: '#8b949e',
              textTransform: 'capitalize'
            }}>
              {type.replace(/_/g, ' ')}
            </small>
            <small style={{
              color: '#f0f6fc',
              fontWeight: 'bold',
              background: '#1c2128',
              padding: '2px 6px',
              borderRadius: '3px'
            }}>
              {hours} hrs
            </small>
          </div>
        ))}
      </div>

      {/* Status Indicator */}
      <div style={{
        marginTop: '12px',
        padding: '8px',
        background: '#1c2128',
        borderRadius: '6px',
        textAlign: 'center',
        fontSize: '11px'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: capacityConfig.remainingHours > 0 ? '#4caf50' : '#ff5252'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: capacityConfig.remainingHours > 0 ? '#4caf50' : '#ff5252',
            display: 'inline-block'
          }}></span>
          {capacityConfig.remainingHours > 0 ? 'Capacity Available' : 'At Capacity'}
        </div>
      </div>

      {/* Configure Button */}
      <button
        onClick={onConfigure}
        style={{
          width: '100%',
          marginTop: '12px',
          padding: '8px',
          background: '#4a8fd9',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'background 0.2s'
        }}
        onMouseOver={(e) => e.target.style.background = '#357abd'}
        onMouseOut={(e) => e.target.style.background = '#4a8fd9'}
      >
        <i className="fas fa-cog"></i> Configure
      </button>
    </div>
  );
}

export default CapacityPanel;
