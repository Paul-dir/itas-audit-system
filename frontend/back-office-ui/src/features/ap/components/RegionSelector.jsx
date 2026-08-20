import React from 'react';
import Card from './Card';
import Badge from './Badge';
import { auditConfig } from '../config/auditConfig';

function RegionSelector({ onRegionSelect, currentRegion, userRole, assignedRegion }) {
  // Regional directors can see all regions, but one is marked as their assigned region
  const regionsToShow = auditConfig.regions;

  return (
    <div>
      <div className="detail-header">
        <h2><i className="fas fa-map-pin"></i> Select Region</h2>
        <Badge status="Region Selection" className="director-approved" />
      </div>

      {userRole === 'regional' && (
        <div style={{ background: '#1a3a1a', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #388e3c' }}>
          <strong><i className="fas fa-info-circle"></i> Regional Director</strong>
          <p style={{ color: '#0c4a6e', margin: '8px 0 0 0', fontSize: '13px', lineHeight: '1.6' }}>
            Your assigned region is <strong>{assignedRegion}</strong> (marked with ✓). You can view other regions for reference, but your primary work is in your assigned region.
          </p>
        </div>
      )}

      {userRole !== 'regional' && (
        <div style={{ background: '#1a2332', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #4a8fd9' }}>
          <strong style={{ color: '#4a8fd9' }}><i className="fas fa-info-circle"></i> Region Selection</strong>
          <p style={{ color: '#0c4a6e', margin: '8px 0 0 0', fontSize: '13px', lineHeight: '1.6', color: '#2d3d4d' }}>
            Select a region below to view detailed information specific to that region.
          </p>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Region</th>
              <th>Taxpayers</th>
              <th>Available Skills</th>
              <th style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {regionsToShow.map((region, i) => {
              const isAssigned = userRole === 'regional' && region.name === assignedRegion;
              return (
                <tr key={i} style={{ background: isAssigned ? '#1a3a1a' : 'transparent' }}>
                  <td>
                    <strong>
                      {region.name}
                      {isAssigned && (
                        <span style={{ color: '#388e3c', marginLeft: '8px' }}>✓ YOUR REGION</span>
                      )}
                    </strong>
                  </td>
                  <td>{(region.taxpayers * 12).toLocaleString()}</td>
                  <td>{region.availableSkills}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => onRegionSelect(region.name)}
                    >
                      <i className="fas fa-arrow-right"></i> Select
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ background: '#e3f2fd', color: '#0c4a6e', padding: '16px', borderRadius: '8px', marginTop: '24px', border: '1px solid #1976d2' }}>
        <strong><i className="fas fa-lightbulb"></i> What You'll See</strong>
        <p style={{ color: '#0c4a6e', margin: '8px 0 0 0', fontSize: '13px', lineHeight: '1.6' }}>
          Once you select a region, you'll have access to:
        </p>
        <ul style={{ margin: '8px 0 0 16px', fontSize: '13px', lineHeight: '1.8' }}>
          <li>Regional risk analysis and metrics</li>
          <li>Audit type distribution</li>
          <li>Tax type breakdown</li>
          <li>Tax center details</li>
          <li>Individual taxpayer information</li>
        </ul>
      </div>
    </div>
  );
}

export default RegionSelector;
