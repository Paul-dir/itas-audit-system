import React from 'react';
import Badge from './Badge';
import { auditConfig } from '../config/auditConfig';

function TaxCenterSelector({ onTaxCenterSelect, selectedRegion, selectedTaxCenter }) {
  // Get tax centers for the selected region
  const getTaxCentersForRegion = (region) => {
    // Generate 3 tax centers per region
    return [
      { id: `${region}-tc1`, name: `${region} Tax Center 1`, managers: 2, teams: 2 },
      { id: `${region}-tc2`, name: `${region} Tax Center 2`, managers: 1, teams: 2 },
      { id: `${region}-tc3`, name: `${region} Tax Center 3`, managers: 1, teams: 1 }
    ];
  };

  const taxCenters = selectedRegion ? getTaxCentersForRegion(selectedRegion) : [];

  return (
    <div>
      <div className="detail-header">
        <h2><i className="fas fa-building"></i> Select Tax Center in {selectedRegion}</h2>
        <Badge status="Tax Center Selection" className="director-approved" />
      </div>

      <div style={{ background: '#0f1419', color: '#f0f6fc', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffb74d' }}>
        <strong><i className="fas fa-info-circle"></i> Tax Center Selection</strong>
        <p style={{ color: '#0c4a6e', margin: '8px 0 0 0', fontSize: '13px', lineHeight: '1.6' }}>
          Select a tax center below to manage its audit allocation and collect feedback.
        </p>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Tax Center</th>
              <th>Managers</th>
              <th>Teams</th>
              <th style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {taxCenters.map((tc, i) => (
              <tr key={i} style={{ background: selectedTaxCenter === tc.id ? '#1a3a1a' : 'transparent' }}>
                <td>
                  <strong>
                    {tc.name}
                    {selectedTaxCenter === tc.id && (
                      <span style={{ color: '#388e3c', marginLeft: '8px' }}>✓ SELECTED</span>
                    )}
                  </strong>
                </td>
                <td>{tc.managers}</td>
                <td>{tc.teams}</td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => onTaxCenterSelect(tc.id)}
                  >
                    <i className="fas fa-arrow-right"></i> Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background: '#e3f2fd', color: '#0c4a6e', padding: '16px', borderRadius: '8px', marginTop: '24px', border: '1px solid #1976d2' }}>
        <strong><i className="fas fa-lightbulb"></i> What You'll See</strong>
        <p style={{ color: '#0c4a6e', margin: '8px 0 0 0', fontSize: '13px', lineHeight: '1.6' }}>
          Once you select a tax center, you'll have access to:
        </p>
        <ul style={{ margin: '8px 0 0 16px', fontSize: '13px', lineHeight: '1.8' }}>
          <li>Tax center's audit allocation</li>
          <li>Feedback from tax center manager</li>
          <li>Capacity assessment</li>
          <li>Risk analysis for that tax center</li>
        </ul>
      </div>
    </div>
  );
}

export default TaxCenterSelector;
