import React, { useState, useEffect } from 'react';
import { useAllocation } from '../../context/AllocationContext';

/**
 * RegionalAllocateView - Regional Director receives allocations and distributes to tax centers
 */

function RegionalAllocateView() {
  const {
    allocations,
    currentView,
    selectedRegion,
    selectedAllocation: selectedAllocId,
    taxCenters,
    regions,
    acceptAllocation,
    rejectAllocation,
    allocateToTaxCenters,
    navigateTo,
    navigateToRegion,
    getRegionalAllocations,
    setSelectedAllocation
  } = useAllocation();

  const [myRegion, setMyRegion] = useState(selectedRegion || regions[0]);
  const [selectedAlloc, setSelectedAlloc] = useState(null);
  const [taxCenterDistribution, setTaxCenterDistribution] = useState({});
  const [rejectionReason, setRejectionReason] = useState('');

  const regionalAllocations = getRegionalAllocations(myRegion);

  // Initialize tax center distribution when allocation is selected
  useEffect(() => {
    if (selectedAllocId && allocations.length > 0) {
      const alloc = allocations.find(a => a.id === selectedAllocId);
      if (alloc) {
        setSelectedAlloc(alloc);
        
        // Initialize distribution for this region's tax centers
        const tcList = taxCenters[myRegion] || [];
        const dist = {};
        
        tcList.forEach(tc => {
          dist[tc] = {};
          Object.keys(alloc.auditCounts).forEach(auditType => {
            dist[tc][auditType] = 0;
          });
        });
        
        setTaxCenterDistribution(dist);
      }
    }
  }, [selectedAllocId, allocations, myRegion, taxCenters]);

  const handleAccept = () => {
    if (selectedAllocId) {
      acceptAllocation(selectedAllocId);
      setSelectedAlloc(allocations.find(a => a.id === selectedAllocId));
      alert('✅ Allocation accepted. Now distribute to tax centers.');
    }
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    if (selectedAllocId) {
      rejectAllocation(selectedAllocId, rejectionReason);
      setSelectedAlloc(null);
      setRejectionReason('');
      alert('❌ Allocation rejected');
    }
  };

  const handleDistributionChange = (taxCenter, auditType, value) => {
    setTaxCenterDistribution(prev => ({
      ...prev,
      [taxCenter]: {
        ...prev[taxCenter],
        [auditType]: parseInt(value) || 0
      }
    }));
  };

  const validateDistribution = () => {
    if (!selectedAlloc) return false;

    // Check if total matches for each audit type
    for (const auditType in selectedAlloc.auditCounts) {
      const allocated = Object.values(taxCenterDistribution).reduce(
        (sum, tc) => sum + (tc[auditType] || 0),
        0
      );
      const needed = selectedAlloc.auditCounts[auditType];
      
      if (allocated !== needed) {
        return false;
      }
    }
    return true;
  };

  const handleSendToTaxCenters = () => {
    if (!validateDistribution()) {
      alert('❌ Distribution does not match allocation exactly');
      return;
    }

    if (selectedAllocId) {
      allocateToTaxCenters(selectedAllocId, taxCenterDistribution);
      setSelectedAlloc(null);
      alert('✅ Distribution sent to tax centers');
    }
  };

  const getTotalPerTaxCenter = (taxCenter) => {
    return Object.values(taxCenterDistribution[taxCenter] || {})
      .reduce((a, b) => a + b, 0);
  };

  const getTotalPerAuditType = (auditType) => {
    let total = 0;
    Object.values(taxCenterDistribution).forEach(tc => {
      total += tc[auditType] || 0;
    });
    return total;
  };

  return (
    <div className="allocation-view regional-view">
      {/* Header */}
      <div className="allocation-header">
        <h1>🗺️ Regional Director - Plan Allocation</h1>
        <p>Receive allocations from director and distribute to tax centers</p>
      </div>

      {/* Main Content */}
      <div className="allocation-content">
        {/* Region Selector */}
        <div className="region-selector">
          <label>Select Your Region:</label>
          <select
            value={myRegion}
            onChange={(e) => {
              setMyRegion(e.target.value);
              setSelectedAlloc(null);
              setRejectionReason('');
            }}
            className="form-input"
          >
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* Left Side: Allocations List */}
        <div className="allocations-section">
          <h2>Pending Allocations for {myRegion} ({regionalAllocations.length})</h2>
          
          {regionalAllocations.length === 0 ? (
            <div className="empty-state">
              <p>No allocations for {myRegion}</p>
            </div>
          ) : (
            <div className="allocations-list">
              {regionalAllocations.map(alloc => (
                <div
                  key={alloc.id}
                  className={`allocation-card ${selectedAllocId === alloc.id ? 'active' : ''}`}
                  onClick={() => setSelectedAllocation(alloc.id)}
                >
                  <div className="card-header">
                    <strong>{alloc.planName}</strong>
                    <span className="status-badge" style={{
                      backgroundColor: alloc.status === 'PENDING_AT_REGION' ? '#FFA500' : '#4CAF50'
                    }}>
                      {alloc.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="card-body">
                    <p><strong>Total Cases:</strong> {Object.values(alloc.auditCounts).reduce((a, b) => a + b, 0)}</p>
                    <p><strong>Created:</strong> {new Date(alloc.createdDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Detail Panel */}
        {selectedAlloc && (
          <div className="detail-section">
            <div className="detail-card">
              <h2>{selectedAlloc.planName}</h2>

              {/* Allocation Summary */}
              <div className="summary-box">
                <h3>Allocation Summary</h3>
                <table className="summary-table">
                  <thead>
                    <tr>
                      <th>Audit Type</th>
                      <th>Cases</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(selectedAlloc.auditCounts).map(([type, count]) => (
                      <tr key={type}>
                        <td>{type}</td>
                        <td><strong>{count}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Accept/Reject Buttons */}
              {selectedAlloc.status === 'PENDING_AT_REGION' && (
                <div className="action-buttons">
                  <button className="btn btn-success" onClick={handleAccept}>
                    ✅ Accept Allocation
                  </button>
                  <button className="btn btn-danger" onClick={() => {
                    const reason = prompt('Enter rejection reason:');
                    if (reason) {
                      setRejectionReason(reason);
                    }
                  }}>
                    ❌ Reject Allocation
                  </button>
                </div>
              )}

              {/* Rejection Form */}
              {rejectionReason && (
                <div className="rejection-form">
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter rejection reason..."
                    className="form-input"
                    rows="3"
                  />
                  <div className="button-group">
                    <button className="btn btn-danger" onClick={handleReject}>
                      Confirm Rejection
                    </button>
                    <button className="btn btn-secondary" onClick={() => setRejectionReason('')}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Distribution to Tax Centers */}
              {selectedAlloc.status === 'ACCEPTED_BY_REGION' && (
                <div className="distribution-section">
                  <h3>📦 Distribute to Tax Centers</h3>
                  <div className="table-wrapper">
                    <table className="distribution-table">
                      <thead>
                        <tr>
                          <th>Tax Center</th>
                          {Object.keys(selectedAlloc.auditCounts).map(type => (
                            <th key={type}>{type.split(' ')[0]}</th>
                          ))}
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(taxCenters[myRegion] || []).map(tc => (
                          <tr key={tc}>
                            <td className="bold">{tc}</td>
                            {Object.keys(selectedAlloc.auditCounts).map(auditType => (
                              <td key={auditType}>
                                <input
                                  type="number"
                                  min="0"
                                  value={taxCenterDistribution[tc]?.[auditType] || 0}
                                  onChange={(e) => handleDistributionChange(tc, auditType, e.target.value)}
                                  className="input-cell"
                                />
                              </td>
                            ))}
                            <td className="total">{getTotalPerTaxCenter(tc)}</td>
                          </tr>
                        ))}
                        <tr className="total-row">
                          <td className="bold">Total</td>
                          {Object.keys(selectedAlloc.auditCounts).map(auditType => (
                            <td key={auditType} className="bold">
                              {getTotalPerAuditType(auditType)} / {selectedAlloc.auditCounts[auditType]}
                            </td>
                          ))}
                          <td className="bold">
                            {Object.values(taxCenterDistribution)
                              .reduce((sum, tc) => sum + getTotalPerTaxCenter(tc), 0)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {validateDistribution() && (
                    <div className="validation-message success">
                      ✅ Distribution is valid - all cases allocated correctly
                    </div>
                  )}
                  {!validateDistribution() && Object.keys(taxCenterDistribution).length > 0 && (
                    <div className="validation-message error">
                      ❌ Distribution does not match allocation
                    </div>
                  )}

                  <button
                    className="btn btn-primary"
                    onClick={handleSendToTaxCenters}
                    disabled={!validateDistribution()}
                  >
                    Send to Tax Centers
                  </button>
                </div>
              )}

              {/* Status Message */}
              {selectedAlloc.status === 'SENT_TO_TAX_CENTERS' && (
                <div className="status-message">
                  ✅ Distribution sent to tax centers - awaiting feedback
                </div>
              )}

              {selectedAlloc.status === 'REJECTED_BY_REGION' && (
                <div className="status-message error">
                  ❌ Allocation was rejected: {selectedAlloc.rejectionReason}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegionalAllocateView;
