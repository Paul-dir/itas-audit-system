import React, { useState } from 'react';
import { useAllocation } from '../../context/AllocationContext';

/**
 * TaxCenterAllocateView - Tax Center Manager receives allocations and provides feedback
 */

function TaxCenterAllocateView() {
  const {
    allocations,
    taxCenters,
    regions,
    submitTaxCenterFeedback,
    getTaxCenterAllocations
  } = useAllocation();

  const [myTaxCenter, setMyTaxCenter] = useState('');
  const [selectedAlloc, setSelectedAlloc] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [capacity, setCapacity] = useState(100);

  // Get all tax centers for dropdown
  const allTaxCenters = [];
  regions.forEach(region => {
    (taxCenters[region] || []).forEach(tc => {
      allTaxCenters.push({ name: tc, region });
    });
  });

  const myAllocations = myTaxCenter 
    ? allocations.filter(a => 
        a.taxCenterAllocations && 
        Object.keys(a.taxCenterAllocations).includes(myTaxCenter) &&
        a.status === 'SENT_TO_TAX_CENTERS'
      )
    : [];

  const handleSubmitFeedback = () => {
    if (!feedback.trim()) {
      alert('Please provide feedback');
      return;
    }

    if (selectedAlloc) {
      submitTaxCenterFeedback(selectedAlloc.id, myTaxCenter, {
        capacity,
        feedback,
        submittedDate: new Date().toISOString()
      });

      alert('✅ Feedback submitted');
      setFeedback('');
      setCapacity(100);
      setSelectedAlloc(null);
    }
  };

  const getTotalCasesForTC = (alloc) => {
    return Object.values(alloc.taxCenterAllocations[myTaxCenter] || {})
      .reduce((a, b) => a + b, 0);
  };

  return (
    <div className="allocation-view tax-center-view">
      {/* Header */}
      <div className="allocation-header">
        <h1>🏢 Tax Center Manager - Allocations</h1>
        <p>Review allocations from regional director and provide feedback</p>
      </div>

      {/* Main Content */}
      <div className="allocation-content">
        {/* Tax Center Selector */}
        <div className="selector-section">
          <label>Select Your Tax Center:</label>
          <select
            value={myTaxCenter}
            onChange={(e) => {
              setMyTaxCenter(e.target.value);
              setSelectedAlloc(null);
            }}
            className="form-input"
          >
            <option value="">-- Select Tax Center --</option>
            {allTaxCenters.map(tc => (
              <option key={tc.name} value={tc.name}>
                {tc.name} ({tc.region})
              </option>
            ))}
          </select>
        </div>

        {myTaxCenter ? (
          <>
            {/* Allocations List */}
            <div className="allocations-section">
              <h2>Allocations for {myTaxCenter} ({myAllocations.length})</h2>

              {myAllocations.length === 0 ? (
                <div className="empty-state">
                  <p>No allocations for {myTaxCenter}</p>
                </div>
              ) : (
                <div className="allocations-list">
                  {myAllocations.map(alloc => {
                    const hasFeedback = alloc.taxCenterFeedback && alloc.taxCenterFeedback[myTaxCenter];
                    return (
                      <div
                        key={alloc.id}
                        className={`allocation-card ${selectedAlloc?.id === alloc.id ? 'active' : ''} ${hasFeedback ? 'with-feedback' : ''}`}
                        onClick={() => !hasFeedback && setSelectedAlloc(alloc)}
                      >
                        <div className="card-header">
                          <strong>{alloc.planName}</strong>
                          <span className="status-badge" style={{
                            backgroundColor: hasFeedback ? '#4CAF50' : '#2196F3'
                          }}>
                            {hasFeedback ? '✅ Feedback Sent' : 'Pending'}
                          </span>
                        </div>
                        <div className="card-body">
                          <p><strong>Total Cases:</strong> {getTotalCasesForTC(alloc)}</p>
                          <div className="breakdown">
                            {Object.entries(alloc.taxCenterAllocations[myTaxCenter] || {}).map(([type, count]) => (
                              count > 0 && (
                                <span key={type} className="breakdown-item">
                                  {type.split(' ')[0]}: {count}
                                </span>
                              )
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Detail Panel */}
            {selectedAlloc && (
              <div className="detail-section">
                <div className="detail-card">
                  <h2>{selectedAlloc.planName}</h2>

                  {/* Allocation Details */}
                  <div className="summary-box">
                    <h3>Your Allocation</h3>
                    <table className="summary-table">
                      <thead>
                        <tr>
                          <th>Audit Type</th>
                          <th>Cases</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(selectedAlloc.taxCenterAllocations[myTaxCenter] || {}).map(([type, count]) => (
                          <tr key={type}>
                            <td>{type}</td>
                            <td><strong>{count}</strong></td>
                          </tr>
                        ))}
                        <tr className="total-row">
                          <td><strong>Total</strong></td>
                          <td><strong>{getTotalCasesForTC(selectedAlloc)}</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Feedback Form */}
                  <div className="feedback-form">
                    <h3>Provide Your Feedback</h3>

                    <div className="form-group">
                      <label>Capacity (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={capacity}
                        onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
                        className="form-input"
                      />
                      <p className="help-text">Can you handle this allocation at full capacity?</p>
                    </div>

                    <div className="form-group">
                      <label>Feedback</label>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Share your team's capacity concerns, any risks, or readiness status..."
                        className="form-input"
                        rows="5"
                      />
                    </div>

                    <button
                      className="btn btn-success"
                      onClick={handleSubmitFeedback}
                    >
                      ✅ Submit Feedback
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <p>Select a tax center to view allocations</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaxCenterAllocateView;
