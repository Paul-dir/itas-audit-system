import React, { useState } from 'react';
import { useAllocation } from '../../context/AllocationContext';

/**
 * DirectorAllocateView - Audit Director creates allocations to regions
 * Shows all allocations and allows creation of new ones
 */

function DirectorAllocateView() {
  const { 
    allocations, 
    currentView, 
    regions, 
    auditTypes,
    createAllocation, 
    navigateTo,
    navigateToRegion,
    getDirectorAllocations 
  } = useAllocation();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [planName, setPlanName] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [auditCounts, setAuditCounts] = useState({});

  const directorAllocations = getDirectorAllocations();

  const handleCreateAllocation = (e) => {
    e.preventDefault();
    
    if (!planName || !selectedRegion) {
      alert('Please fill in plan name and region');
      return;
    }

    // Validate audit counts
    const hasValues = Object.values(auditCounts).some(v => v > 0);
    if (!hasValues) {
      alert('Please allocate at least one audit case');
      return;
    }

    createAllocation(planName, selectedRegion, auditCounts);
    
    // Reset form
    setPlanName('');
    setSelectedRegion('');
    setAuditCounts({});
    setShowCreateForm(false);
    alert(`✅ Allocation created for ${selectedRegion}`);
  };

  const handleAuditCountChange = (auditType, value) => {
    setAuditCounts({
      ...auditCounts,
      [auditType]: parseInt(value) || 0
    });
  };

  const getTotalCases = () => {
    return Object.values(auditCounts).reduce((sum, val) => sum + (val || 0), 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING_AT_REGION':
        return '#FFA500'; // Orange
      case 'ACCEPTED_BY_REGION':
        return '#4CAF50'; // Green
      case 'REJECTED_BY_REGION':
        return '#F44336'; // Red
      case 'SENT_TO_TAX_CENTERS':
        return '#2196F3'; // Blue
      default:
        return '#9E9E9E'; // Gray
    }
  };

  const getStatusLabel = (status) => {
    return status.replace(/_/g, ' ');
  };

  return (
    <div className="allocation-view director-view">
      {/* Header */}
      <div className="allocation-header">
        <h1>📋 Audit Director - Plan Allocations</h1>
        <p>Create and manage audit plan allocations to regions</p>
      </div>

      {/* Main Content */}
      <div className="allocation-content">
        {/* Create Button */}
        <div className="action-bar">
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? '❌ Cancel' : '➕ Create New Allocation'}
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="form-card">
            <h2>Create New Plan Allocation</h2>
            <form onSubmit={handleCreateAllocation}>
              <div className="form-group">
                <label>Plan Name *</label>
                <input
                  type="text"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="e.g., Annual Audit Plan 2027"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Region *</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="form-input"
                >
                  <option value="">-- Select Region --</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Audit Cases Allocation</label>
                <div className="audit-grid">
                  {auditTypes.map(auditType => (
                    <div key={auditType} className="audit-field">
                      <label>{auditType}</label>
                      <input
                        type="number"
                        min="0"
                        value={auditCounts[auditType] || 0}
                        onChange={(e) => handleAuditCountChange(auditType, e.target.value)}
                        className="form-input"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-summary">
                <strong>Total Cases: {getTotalCases()}</strong>
              </div>

              <button type="submit" className="btn btn-success">
                ✅ Create Allocation
              </button>
            </form>
          </div>
        )}

        {/* Allocations List */}
        <div className="allocations-list">
          <h2>All Allocations ({directorAllocations.length})</h2>
          
          {directorAllocations.length === 0 ? (
            <div className="empty-state">
              <p>No allocations yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="allocations-table">
                <thead>
                  <tr>
                    <th>Plan Name</th>
                    <th>Region</th>
                    <th>Total Cases</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {directorAllocations.map(alloc => (
                    <tr key={alloc.id}>
                      <td className="bold">{alloc.planName}</td>
                      <td>{alloc.region}</td>
                      <td>{Object.values(alloc.auditCounts).reduce((a, b) => a + b, 0)}</td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(alloc.status) }}
                        >
                          {getStatusLabel(alloc.status)}
                        </span>
                      </td>
                      <td>{new Date(alloc.createdDate).toLocaleDateString()}</td>
                      <td>
                        <button 
                          className="btn btn-small btn-primary"
                          onClick={() => navigateToRegion(alloc.region)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DirectorAllocateView;
