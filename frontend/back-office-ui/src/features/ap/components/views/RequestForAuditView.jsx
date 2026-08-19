import React, { useState, useEffect } from 'react';
import Card from '../Card';
import Badge from '../Badge';
import { useData } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';

/**
 * RequestForAuditView - Process Owner
 * Review and manage audit requests from directorates and external stakeholders
 */

function RequestForAuditView() {
  const { getUserInfo } = useAuth();
  const { data, updateData } = useData();
  const userInfo = getUserInfo();

  const [allRequests, setAllRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);

  // Filters
  const [filterRequestType, setFilterRequestType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRequester, setFilterRequester] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    taxpayerName: '',
    tin: '',
    requestType: 'Tax Clearance',
    reason: '',
    requestedBy: '',
    requesterType: 'Directorate', // Directorate or External
    region: 'Addis Ababa',
    priority: 'Medium',
    attachments: '',
    notes: ''
  });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    // Using data from hook
    const requests = data.auditRequests || [];
    console.log('📋 RequestForAuditView - Requests loaded:', {
      total: requests.length,
      requests: requests.map(r => ({ id: r.id, taxpayer: r.taxpayerName, status: r.status }))
    });
    setAllRequests(requests);
  };

  // Apply filters
  useEffect(() => {
    let filtered = allRequests;

    if (filterRequestType !== 'All') {
      filtered = filtered.filter(r => r.requestType === filterRequestType);
    }

    if (filterStatus !== 'All') {
      filtered = filtered.filter(r => r.status === filterStatus);
    }

    if (filterRequester !== 'All') {
      filtered = filtered.filter(r => r.requesterType === filterRequester);
    }

    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.taxpayerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tin.includes(searchTerm) ||
        r.id.includes(searchTerm)
      );
    }

    setFilteredRequests(filtered);
  }, [allRequests, filterRequestType, filterStatus, filterRequester, searchTerm]);

  // Get unique values for filters
  const getRequestTypes = () => ['All', ...new Set(allRequests.map(r => r.requestType))];
  const getStatuses = () => ['All', 'Pending Review', 'Under Assessment', 'Approved & Scheduled', 'Rejected', 'Closed'];
  const getRequesters = () => ['All', 'Directorate', 'External'];

  // Calculate statistics
  const getStats = () => {
    const statuses = {
      'Pending Review': 0,
      'Under Assessment': 0,
      'Approved & Scheduled': 0,
      'Rejected': 0,
      'Closed': 0
    };

    const requestTypes = {};

    filteredRequests.forEach(r => {
      if (statuses.hasOwnProperty(r.status)) statuses[r.status]++;
      requestTypes[r.requestType] = (requestTypes[r.requestType] || 0) + 1;
    });

    return { statuses, requestTypes };
  };

  // Submit request form
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
      id: `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...formData,
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
      requestedBy: '',
      requesterType: 'Directorate',
      region: 'Addis Ababa',
      priority: 'Medium',
      attachments: '',
      notes: ''
    });
    setShowForm(false);
    loadRequests();
  };

  // Approve request and add to cases
  const handleApproveRequest = (request) => {
    // Using data from hook
    const reqIndex = data.auditRequests.findIndex(r => r.id === request.id);

    if (reqIndex >= 0) {
      data.auditRequests[reqIndex].status = 'Approved & Scheduled';
      data.auditRequests[reqIndex].approvedDate = new Date().toISOString();
      data.auditRequests[reqIndex].approvedBy = userInfo?.fullName || 'Process Owner';

      // Create audit case from request
      const auditCase = {
        id: `CASE-REQ-${request.id.substring(4)}`,
        requestId: request.id,
        planId: 'REQ-BASED',
        region: request.region,
        taxCenter: 'TBD', // To be assigned
        taxpayerName: request.taxpayerName,
        tin: request.tin,
        auditType: 'Issue Audit', // Default for requests
        riskLevel: request.priority === 'High' ? 'High' : request.priority === 'Medium' ? 'Medium' : 'Low',
        revenueAtRisk: 0, // To be determined
        estimatedHours: 45,
        status: 'REQUESTED',
        createdDate: new Date().toISOString(),
        createdFrom: 'AUDIT_REQUEST',
        reason: request.reason
      };

      if (!data.auditCases) {
        data.auditCases = [];
      }
      data.auditCases.push(auditCase);

      updateData(data);

      console.log('✓ Request approved and case created:', auditCase.id);
      alert(`✓ Request approved\nAudit case created: ${auditCase.id}`);

      loadRequests();
    }
  };

  // Reject request
  const handleRejectRequest = (request) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    // Using data from hook
    const reqIndex = data.auditRequests.findIndex(r => r.id === request.id);

    if (reqIndex >= 0) {
      data.auditRequests[reqIndex].status = 'Rejected';
      data.auditRequests[reqIndex].rejectedDate = new Date().toISOString();
      data.auditRequests[reqIndex].rejectionReason = reason;
      data.auditRequests[reqIndex].rejectedBy = userInfo?.fullName || 'Process Owner';

      updateData(data);
      alert('✓ Request rejected');
      loadRequests();
    }
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
      <div style={{ padding: '24px' }}>
        <div className="detail-header">
          <h2><i className="fas fa-plus-circle"></i> Submit Audit Request</h2>
          <Badge status="New Request" className="pending" />
        </div>

        <div style={{
          background: '#1c2128',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '24px',
          border: '1px solid #30363d'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                Requester Type *
              </label>
              <select
                value={formData.requesterType}
                onChange={(e) => setFormData({ ...formData, requesterType: e.target.value })}
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
                <option value="Directorate">Directorate</option>
                <option value="External">External Stakeholder</option>
              </select>
            </div>

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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
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

            <div>
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
              Requested By
            </label>
            <input
              type="text"
              value={formData.requestedBy}
              onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
              placeholder="Name of requester"
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
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div className="detail-header">
        <h2><i className="fas fa-inbox"></i> Requests for Audit</h2>
        <Badge status={`${filteredRequests.length} Requests`} className="director-approved" />
      </div>

      {/* Summary Info */}
      <div style={{ background: '#e3f2fd', color: '#0c4a6e', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #1976d2' }}>
        <strong style={{ color: '#0c4a6e' }}><i className="fas fa-info-circle"></i> Audit Requests Management</strong>
        <p style={{ color: '#0c4a6e', margin: '8px 0 0 0', fontSize: '13px', lineHeight: '1.6' }}>
          Manage audit requests from directorates and external stakeholders. Review, approve, or reject requests to create audit cases.
          Total Requests: <strong>{allRequests.length}</strong> | Displayed: <strong>{filteredRequests.length}</strong>
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
          <i className="fas fa-plus-circle"></i> Submit Audit Request
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

        <select value={filterRequestType} onChange={(e) => setFilterRequestType(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #30363d',
            borderRadius: '6px',
            background: '#0f1419',
            color: '#f0f6fc',
            fontSize: '12px'
          }}>
          {getRequestTypes().map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #30363d',
            borderRadius: '6px',
            background: '#0f1419',
            color: '#f0f6fc',
            fontSize: '12px'
          }}>
          {getStatuses().map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <select value={filterRequester} onChange={(e) => setFilterRequester(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #30363d',
            borderRadius: '6px',
            background: '#0f1419',
            color: '#f0f6fc',
            fontSize: '12px'
          }}>
          {getRequesters().map(requester => (
            <option key={requester} value={requester}>{requester}</option>
          ))}
        </select>

        <button
          onClick={() => {
            setSearchTerm('');
            setFilterRequestType('All');
            setFilterStatus('All');
            setFilterRequester('All');
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
      <div className="table-container" style={{ marginBottom: '24px' }}>
        <table>
          <thead>
            <tr>
              <th>REQUEST ID</th>
              <th>TAXPAYER</th>
              <th>TIN</th>
              <th>REQUEST TYPE</th>
              <th>PRIORITY</th>
              <th>REQUESTER</th>
              <th>REGION</th>
              <th>SUBMITTED DATE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
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
                <td>{request.requesterType}</td>
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
                <td style={{ display: 'flex', gap: '4px' }}>
                  {request.status === 'Pending Review' && (
                    <>
                      <button
                        onClick={() => handleApproveRequest(request)}
                        style={{
                          padding: '4px 8px',
                          background: '#4caf50',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                        title="Approve and create audit case"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request)}
                        style={{
                          padding: '4px 8px',
                          background: '#f44336',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                        title="Reject request"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {request.status !== 'Pending Review' && (
                    <span style={{ fontSize: '11px', color: '#8b949e' }}>
                      {request.status === 'Approved & Scheduled' ? '✓ Case Created' : '—'}
                    </span>
                  )}
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
        border: '1px solid #388e3c'
      }}>
        <strong><i className="fas fa-chart-bar"></i> Request Summary</strong>
        <p style={{ color: '#a8d5a8', margin: '8px 0 0 0', fontSize: '13px', lineHeight: '1.6' }}>
          Total Requests: <strong>{allRequests.length}</strong> | 
          Pending: <strong>{stats.statuses['Pending Review']}</strong> | 
          Approved: <strong>{stats.statuses['Approved & Scheduled']}</strong> | 
          Rejected: <strong>{stats.statuses['Rejected']}</strong>
        </p>
      </div>
    </div>
  );
}

export default RequestForAuditView;
