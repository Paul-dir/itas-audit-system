import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import TopBar from '../TopBar';
import Badge from '../Badge';
import Card from '../Card';
import { useData } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';

/**
 * DirectorateRequesterView
 * For internal directorates to submit audit requests
 * - Submit audit requests for specific taxpayers
 * - Track submitted requests
 * - View approval status and created cases
 */

function DirectorateRequesterView() {
  const { getUserInfo } = useAuth();
  const { data, updateData } = useData();
  const userInfo = getUserInfo();

  const [currentView, setCurrentView] = useState('submit');
  const [allRequests, setAllRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Filters
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    taxpayerName: '',
    tin: '',
    requestType: 'Tax Clearance',
    reason: '',
    region: 'Addis Ababa',
    priority: 'Medium',
    notes: ''
  });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    // Using data from hook
    const allReqs = data.auditRequests || [];
    
    // Filter for requests submitted by this directorate
    const myRequests = allReqs.filter(r => 
      r.requesterType === 'Directorate' && 
      (r.submittedBy === userInfo?.fullName || r.directorate === userInfo?.fullName)
    );

    console.log('📋 DirectorateRequesterView - Requests loaded:', {
      total: myRequests.length,
      requests: myRequests.map(r => ({ id: r.id, taxpayer: r.taxpayerName, status: r.status }))
    });

    setAllRequests(myRequests);
  };

  // Apply filters
  useEffect(() => {
    let filtered = allRequests;

    if (filterStatus !== 'All') {
      filtered = filtered.filter(r => r.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.taxpayerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tin.includes(searchTerm) ||
        r.id.includes(searchTerm)
      );
    }

    setFilteredRequests(filtered);
  }, [allRequests, filterStatus, searchTerm]);

  // Submit new request
  const handleSubmitRequest = () => {
    if (!formData.taxpayerName || !formData.tin) {
      alert('Please fill in Taxpayer Name and TIN');
      return;
    }

    // Using data from hook
    if (!data.auditRequests) {
      data.auditRequests = [];
    }

    const newRequest = {
      id: `REQ-DIR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...formData,
      requesterType: 'Directorate',
      directorate: userInfo?.fullName || 'Directorate',
      status: 'Pending Review',
      submittedDate: new Date().toISOString(),
      submittedBy: userInfo?.fullName || 'User',
      lastModified: new Date().toISOString()
    };

    data.auditRequests.push(newRequest);
    updateData(data);

    console.log('✓ Audit request submitted:', newRequest.id);
    alert(`✓ Audit request submitted successfully\nRequest ID: ${newRequest.id}`);

    setFormData({
      taxpayerName: '',
      tin: '',
      requestType: 'Tax Clearance',
      reason: '',
      region: 'Addis Ababa',
      priority: 'Medium',
      notes: ''
    });
    setShowForm(false);
    loadRequests();
  };

  // Get statistics
  const getStats = () => {
    const statuses = {
      'Pending Review': 0,
      'Under Assessment': 0,
      'Approved & Scheduled': 0,
      'Rejected': 0,
      'Closed': 0
    };

    allRequests.forEach(r => {
      if (statuses.hasOwnProperty(r.status)) statuses[r.status]++;
    });

    const requestTypes = {};
    allRequests.forEach(r => {
      requestTypes[r.requestType] = (requestTypes[r.requestType] || 0) + 1;
    });

    return { statuses, requestTypes };
  };

  const stats = getStats();

  const getStatusColor = (status) => {
    const colors = {
      'Pending Review': '#ffb74d',
      'Under Assessment': '#4a8fd9',
      'Approved & Scheduled': '#4caf50',
      'Rejected': '#f44336',
      'Closed': '#9e9e9e'
    };
    return colors[status] || '#999';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': '#ff5252',
      'Medium': '#ffc107',
      'Low': '#4caf50'
    };
    return colors[priority] || '#999';
  };

  if (showForm) {
    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar currentView={currentView} onNavigate={setCurrentView} userRole="directorate_requester" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0f1419' }}>
          <TopBar title="Submit Audit Request" />
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            <div className="detail-header">
              <h2><i className="fas fa-plus-circle"></i> Submit New Audit Request</h2>
              <Badge status="New Request" className="pending" />
            </div>

            <div style={{
              background: '#1c2128',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '24px',
              border: '1px solid #30363d',
              maxWidth: '800px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                    Request Type *
                  </label>
                  <select
                    value={formData.requestType}
                    onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #30363d',
                      borderRadius: '6px',
                      background: '#0f1419',
                      color: '#f0f6fc',
                      fontSize: '13px'
                    }}
                  >
                    <option value="Tax Clearance">Tax Clearance</option>
                    <option value="Business Closure">Business Closure</option>
                    <option value="Compliance Check">Compliance Check</option>
                    <option value="Transfer Verification">Transfer Verification</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #30363d',
                      borderRadius: '6px',
                      background: '#0f1419',
                      color: '#f0f6fc',
                      fontSize: '13px'
                    }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                    Taxpayer Name *
                  </label>
                  <input
                    type="text"
                    value={formData.taxpayerName}
                    onChange={(e) => setFormData({ ...formData, taxpayerName: e.target.value })}
                    placeholder="Enter taxpayer name"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #30363d',
                      borderRadius: '6px',
                      background: '#0f1419',
                      color: '#f0f6fc',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                    TIN *
                  </label>
                  <input
                    type="text"
                    value={formData.tin}
                    onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
                    placeholder="Enter TIN"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #30363d',
                      borderRadius: '6px',
                      background: '#0f1419',
                      color: '#f0f6fc',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                  Region
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    background: '#0f1419',
                    color: '#f0f6fc',
                    fontSize: '13px'
                  }}
                >
                  <option value="Addis Ababa">Addis Ababa</option>
                  <option value="Amhara">Amhara</option>
                  <option value="Oromia">Oromia</option>
                  <option value="SNNPR">SNNPR</option>
                  <option value="Somali">Somali</option>
                  <option value="Dire Dawa">Dire Dawa</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                  Reason for Request *
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Explain why this audit is requested..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    background: '#0f1419',
                    color: '#f0f6fc',
                    fontSize: '13px',
                    minHeight: '80px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional information..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    background: '#0f1419',
                    color: '#f0f6fc',
                    fontSize: '13px',
                    minHeight: '60px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    background: '#0f1419',
                    color: '#8b949e',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRequest}
                  style={{
                    padding: '10px 20px',
                    background: '#4caf50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <i className="fas fa-paper-plane"></i> Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar currentView={currentView} onNavigate={setCurrentView} userRole="directorate_requester" />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0f1419' }}>
        <TopBar title="Directorate Audit Request Management" />

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <div className="detail-header">
            <h2><i className="fas fa-inbox"></i> My Audit Requests</h2>
            <Badge status={`${filteredRequests.length} Requests`} className="director-approved" />
          </div>

          {/* Summary Info */}
          <div style={{ background: '#e3f2fd', color: '#0c4a6e', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #1976d2' }}>
            <strong style={{ color: '#0c4a6e' }}><i className="fas fa-info-circle"></i> Submit Audit Requests</strong>
            <p style={{ color: '#0c4a6e', margin: '8px 0 0 0', fontSize: '13px', lineHeight: '1.6' }}>
              Submit audit requests for specific taxpayers and track their approval status. Once approved by Process Owner, audit cases will be created.
              Total Requests: <strong>{allRequests.length}</strong>
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="cards" style={{ marginBottom: '24px' }}>
            <Card title="Pending Review" number={stats.statuses['Pending Review']} icon="fas fa-hourglass-half" />
            <Card title="Under Assessment" number={stats.statuses['Under Assessment']} icon="fas fa-tasks" />
            <Card title="Approved" number={stats.statuses['Approved & Scheduled']} icon="fas fa-check-circle" />
            <Card title="Rejected" number={stats.statuses['Rejected']} icon="fas fa-times-circle" />
          </div>

          {/* Submit Request Button */}
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={() => setShowForm(true)}
              style={{
                padding: '10px 20px',
                background: '#4caf50',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-plus-circle"></i> Submit New Request
            </button>
          </div>

          {/* Filters */}
          <div style={{
            background: '#1c2128',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <input
              type="text"
              placeholder="Search TIN, name, or request ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                minWidth: '180px',
                padding: '8px 12px',
                border: '1px solid #30363d',
                borderRadius: '6px',
                background: '#0f1419',
                color: '#f0f6fc',
                fontSize: '12px'
              }}
            />

            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #30363d',
                borderRadius: '6px',
                background: '#0f1419',
                color: '#f0f6fc',
                fontSize: '12px'
              }}>
              <option value="All">All Statuses</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Under Assessment">Under Assessment</option>
              <option value="Approved & Scheduled">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Closed">Closed</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('All');
              }}
              style={{
                padding: '8px 12px',
                border: '1px solid #30363d',
                borderRadius: '6px',
                background: '#0f1419',
                color: '#8b949e',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Clear Filters
            </button>
          </div>

          {/* Requests Table */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>REQUEST ID</th>
                  <th>TAXPAYER</th>
                  <th>TIN</th>
                  <th>REQUEST TYPE</th>
                  <th>PRIORITY</th>
                  <th>REGION</th>
                  <th>SUBMITTED</th>
                  <th>STATUS</th>
                  <th>DETAILS</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(request => (
                  <tr key={request.id}>
                    <td><strong style={{ color: '#4caf50' }}>{request.id?.substring(0, 20)}...</strong></td>
                    <td>{request.taxpayerName}</td>
                    <td>{request.tin}</td>
                    <td>{request.requestType}</td>
                    <td>
                      <span style={{
                        background: getPriorityColor(request.priority),
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }}>
                        {request.priority}
                      </span>
                    </td>
                    <td>{request.region}</td>
                    <td style={{ fontSize: '11px', color: '#8b949e' }}>
                      {new Date(request.submittedDate).toLocaleDateString()}
                    </td>
                    <td>
                      <span style={{
                        background: getStatusColor(request.status),
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }}>
                        {request.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '11px' }}>
                      {request.status === 'Approved & Scheduled' && '✓ Case Created'}
                      {request.status === 'Rejected' && `✗ ${request.rejectionReason || 'Rejected'}`}
                      {request.status === 'Pending Review' && '⏳ Awaiting Review'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div style={{
            background: '#1a3a1a',
            color: '#4caf50',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #388e3c',
            marginTop: '24px'
          }}>
            <strong><i className="fas fa-chart-bar"></i> Request Summary</strong>
            <p style={{ color: '#a8d5a8', margin: '8px 0 0 0', fontSize: '13px', lineHeight: '1.6' }}>
              Total Submitted: <strong>{allRequests.length}</strong> | 
              Pending: <strong>{stats.statuses['Pending Review']}</strong> | 
              Approved: <strong>{stats.statuses['Approved & Scheduled']}</strong> | 
              Rejected: <strong>{stats.statuses['Rejected']}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DirectorateRequesterView;
