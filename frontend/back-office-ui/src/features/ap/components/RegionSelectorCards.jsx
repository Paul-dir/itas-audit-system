import React, { useState } from 'react';
import Badge from './Badge';

function RegionSelectorCards({ onRegionSelect, currentRegion, assignedRegion, userRole }) {
  const [hoveredRegion, setHoveredRegion] = useState(null);

  const regions = [
    { 
      name: 'Addis Ababa', 
      taxpayers: 420000, 
      skills: 50,
      icon: 'fas fa-city',
      color: '#4a8fd9'
    },
    { 
      name: 'Oromia', 
      taxpayers: 360000, 
      skills: 40,
      icon: 'fas fa-tree',
      color: '#52c77a'
    },
    { 
      name: 'Amhara', 
      taxpayers: 264000, 
      skills: 30,
      icon: 'fas fa-mountain',
      color: '#4a8fd9'
    },
    { 
      name: 'Sidama', 
      taxpayers: 180000, 
      skills: 20,
      icon: 'fas fa-leaf',
      color: '#9C27B0'
    },
    { 
      name: 'Dire Dawa', 
      taxpayers: 144000, 
      skills: 15,
      icon: 'fas fa-road',
      color: '#ff5252'
    },
    { 
      name: 'Somali', 
      taxpayers: 132000, 
      skills: 15,
      icon: 'fas fa-desert',
      color: '#FF5722'
    }
  ];

  const isAssignedRegion = (region) => assignedRegion === region;
  const isSelected = (region) => currentRegion === region;

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: '#1a2332' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '600', margin: '0 0 8px 0', color: '#4a8fd9' }}>
          <i className="fas fa-map-pin" style={{ marginRight: '12px', color: '#4a8fd9' }}></i>
          Select Your Region
        </h1>
        <p style={{ fontSize: '15px', color: '#a0aec0', margin: '0', lineHeight: '1.6' }}>
          Choose a region to access regional audit planning and management. 
          {assignedRegion && ` Your assigned region is ${assignedRegion}.`}
        </p>
      </div>

      {/* Assigned Region Banner (if applicable) */}
      {assignedRegion && (
        <div style={{
          background: 'linear-gradient(135deg, #1a3a1a 0%, #f1f8e9 100%)',
          border: '2px solid #52c77a',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <i className="fas fa-star" style={{ color: '#52c77a', fontSize: '18px' }}></i>
          <div>
            <strong style={{ color: '#2e7d32' }}>Your Primary Region</strong>
            <p style={{ color: '#0c4a6e', margin: '4px 0 0 0', fontSize: '13px', color: '#558b2f' }}>
              {assignedRegion} is your assigned region. You can view other regions for reference.
            </p>
          </div>
        </div>
      )}

      {/* Region Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {regions.map((region) => {
          const assigned = isAssignedRegion(region.name);
          const selected = isSelected(region.name);
          const hovered = hoveredRegion === region.name;

          return (
            <div
              key={region.name}
              onClick={() => onRegionSelect(region.name)}
              onMouseEnter={() => setHoveredRegion(region.name)}
              onMouseLeave={() => setHoveredRegion(null)}
              style={{
                background: '#0f1419fff',
                border: selected ? `3px solid ${region.color}` : assigned ? `2px solid ${region.color}` : '1px solid #2d3d4d',
                borderRadius: '12px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
                boxShadow: hovered 
                  ? `0 12px 24px rgba(0,0,0,0.12), 0 0 0 1px ${region.color}20`
                  : selected 
                  ? `0 6px 16px rgba(0,0,0,0.08), 0 0 0 1px ${region.color}40`
                  : '0 2px 4px rgba(0,0,0,0.04)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Corner Badge */}
              {assigned && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  background: region.color,
                  color: '#0f1419',
                  padding: '6px 12px',
                  borderBottomLeftRadius: '8px',
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '0.5px'
                }}>
                  ASSIGNED
                </div>
              )}

              {/* Icon and Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: `${region.color}15`,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: region.color,
                  fontSize: '24px'
                }}>
                  <i className={region.icon}></i>
                </div>
                <div>
                  <h3 style={{ margin: '0', fontSize: '18px', fontWeight: '600', color: '#4a8fd9' }}>
                    {region.name}
                  </h3>
                  {selected && (
                    <span style={{ fontSize: '12px', color: region.color, fontWeight: '600' }}>
                      ✓ Selected
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid #0f1419'
              }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#999', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Taxpayers
                  </p>
                  <p style={{ fontSize: '16px', fontWeight: '600', margin: '0', color: '#4a8fd9' }}>
                    {(region.taxpayers / 1000).toFixed(0)}K
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#999', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Available Skills
                  </p>
                  <p style={{ fontSize: '16px', fontWeight: '600', margin: '0', color: '#4a8fd9' }}>
                    {region.skills}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                style={{
                  width: '100%',
                  padding: '12px',
                  background: selected ? region.color : 'transparent',
                  color: selected ? '#0f1419' : region.color,
                  border: `2px solid ${region.color}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  letterSpacing: '0.5px'
                }}
                onMouseEnter={(e) => {
                  if (!selected) {
                    e.target.style.background = `${region.color}10`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selected) {
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                {selected ? '✓ Selected' : 'Select Region'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Info Footer */}
      <div style={{
        background: '#1e2a3a',
        border: '1px solid #2d3d4d',
        borderRadius: '12px',
        padding: '20px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '20px',
        marginTop: '40px'
      }}>
        <div style={{ textAlign: 'center', paddingRight: '20px', borderRight: '1px solid #2d3d4d' }}>
          <i className="fas fa-info-circle" style={{ fontSize: '24px', color: '#4a8fd9', marginBottom: '8px', display: 'block' }}></i>
          <p style={{ fontSize: '12px', color: '#a0aec0', margin: '0', lineHeight: '1.6' }}>
            <strong>Region Selection</strong> determines which audit data you'll access and manage.
          </p>
        </div>
        <div style={{ textAlign: 'center', paddingRight: '20px', borderRight: '1px solid #2d3d4d' }}>
          <i className="fas fa-users" style={{ fontSize: '24px', color: '#52c77a', marginBottom: '8px', display: 'block' }}></i>
          <p style={{ fontSize: '12px', color: '#a0aec0', margin: '0', lineHeight: '1.6' }}>
            <strong>Taxpayers</strong> shown are estimates for the audit planning period.
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-shield-alt" style={{ fontSize: '24px', color: '#4a8fd9', marginBottom: '8px', display: 'block' }}></i>
          <p style={{ fontSize: '12px', color: '#a0aec0', margin: '0', lineHeight: '1.6' }}>
            <strong>Available Skills</strong> represent qualified auditors in the region.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegionSelectorCards;
