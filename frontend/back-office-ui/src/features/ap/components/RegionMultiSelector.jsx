import React, { useState } from 'react';
import Badge from './Badge';

/**
 * RegionMultiSelector Component
 * Allows Director to select multiple regions via checkboxes
 * Used when submitting feedback to multiple regions at once
 */

function RegionMultiSelector({ 
  regions, 
  onConfirm, 
  onCancel, 
  selectedCount = 0,
  totalCount = 0 
}) {
  const [selectedRegions, setSelectedRegions] = useState(new Set());

  const handleRegionToggle = (regionName) => {
    const newSelected = new Set(selectedRegions);
    if (newSelected.has(regionName)) {
      newSelected.delete(regionName);
    } else {
      newSelected.add(regionName);
    }
    setSelectedRegions(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRegions.size === regions.length) {
      setSelectedRegions(new Set());
    } else {
      setSelectedRegions(new Set(regions.map(r => r.region || r.name)));
    }
  };

  const handleConfirm = () => {
    if (selectedRegions.size === 0) {
      alert('Please select at least one region');
      return;
    }
    onConfirm(Array.from(selectedRegions));
  };

  return (
    <div style={{
      background: '#f8f9fc', color: '#0c4a6e',
      padding: '24px',
      borderRadius: '8px',
      border: '1px solid #2d3d4d',
      marginBottom: '24px'
    }}>
      <div className="section-title">
        <i className="fas fa-map"></i> Select Regions to Submit Feedback
      </div>

      <div style={{
        background: '#e3f2fd', color: '#0c4a6e',
        padding: '12px',
        borderRadius: '4px',
        marginBottom: '16px',
        border: '1px solid #1976d2',
        fontSize: '13px'
      }}>
        <i className="fas fa-info-circle"></i> Select which regions you want to send feedback to. 
        You can select all regions at once or choose specific ones.
      </div>

      {/* Select All Option */}
      <div style={{
        padding: '12px',
        background: '#0f1419',
        border: '1px solid #2d3d4d',
        borderRadius: '4px',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <input
          type="checkbox"
          id="select-all"
          checked={selectedRegions.size === regions.length}
          onChange={handleSelectAll}
          style={{ cursor: 'pointer', width: '18px', height: '18px' }}
        />
        <label htmlFor="select-all" style={{ cursor: 'pointer', flex: 1, margin: 0 }}>
          <strong>Select All Regions ({regions.length})</strong>
        </label>
        {selectedRegions.size === regions.length && (
          <Badge status="All Selected" className="director-approved" />
        )}
      </div>

      {/* Individual Region Checkboxes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '12px'
      }}>
        {regions.map((region, idx) => {
          const regionName = region.region || region.name;
          const isSelected = selectedRegions.has(regionName);
          
          return (
            <div
              key={idx}
              style={{
                padding: '12px',
                background: isSelected ? '#52c77a' : '#0f1419',
                border: `2px solid ${isSelected ? '#52c77a' : '#2d3d4d'}`,
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
              onClick={() => handleRegionToggle(regionName)}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {}}
                style={{ cursor: 'pointer', width: '18px', height: '18px' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  {regionName}
                </div>
                {region.cases && (
                  <div style={{ fontSize: '12px', color: '#a0aec0', marginTop: '2px' }}>
                    {region.cases} cases
                  </div>
                )}
              </div>
              {isSelected && (
                <span style={{ color: '#388e3c', fontSize: '16px' }}>
                  <i className="fas fa-check-circle"></i>
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div style={{
        background: '#f8f9fc', color: '#0c4a6e',
        padding: '12px',
        borderRadius: '4px',
        marginTop: '16px',
        textAlign: 'center',
        fontSize: '13px',
        color: '#a0aec0'
      }}>
        <strong>{selectedRegions.size}</strong> of <strong>{regions.length}</strong> regions selected
      </div>

      {/* Action Buttons */}
      <div className="action-bar" style={{ marginTop: '20px' }}>
        <button className="btn btn-outline" onClick={onCancel}>
          <i className="fas fa-times"></i> Cancel
        </button>
        <button
          className="btn btn-success"
          onClick={handleConfirm}
          disabled={selectedRegions.size === 0}
          title={selectedRegions.size === 0 ? 'Select at least one region' : ''}
        >
          <i className="fas fa-check"></i> Submit Feedback to {selectedRegions.size} Region{selectedRegions.size !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  );
}

export default RegionMultiSelector;
