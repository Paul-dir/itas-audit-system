import React, { useState, useEffect } from 'react';
import Card from '../Card';
import Badge from '../Badge';
import { useData } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';

/**
 * MyRequestsView
 * Displays a list and management interface for audit requests submitted by the current user.
 * Features: filtering, sorting, pagination, detail view, and request withdrawal.
 * Design: Dark theme with navy background (#0f1419) and panels (#161D22).
 * Styling: 100% Tailwind CSS with dark mode support via dark: prefix.
 */

function MyRequestsView({ userRole }) {
  const { getUserInfo } = useAuth();
  const { data, updateData } = useData();
  const userInfo = getUserInfo();

  const [allRequests, setAllRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Filters
  const [filterRequestType, setFilterRequestType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    // Using data from hook
    const requests = (data.auditRequests || []).filter(r => r.submittedBy === userInfo?.fullName);

    console.log('📋 MyRequestsView - Requests loaded:', {
      total: requests.length,
      requester: userInfo?.fullName,
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

    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.taxpayerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tin.includes(searchTerm) ||
        r.id.includes(searchTerm)
      );
    }

    // Sort by most recent first
    filtered.sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate));

    setFilteredRequests(filtered);
    setCurrentPage(1);
  }, [allRequests, filterRequestType, filterStatus, searchTerm]);

  // Get unique filter options
  const getRequestTypes = () => ['All', ...new Set(allRequests.map(r => r.requestType))];
  const getStatuses = () => ['All', 'PENDING_REVIEW', 'UNDER_ASSESSMENT', 'APPROVED_SCHEDULED', 'REJECTED', 'CLOSED'];

  // Calculate statistics
  const getStats = () => {
    const statuses = {
      'PENDING_REVIEW': 0,
      'UNDER_ASSESSMENT': 0,
      'APPROVED_SCHEDULED': 0,
      'REJECTED': 0,
      'CLOSED': 0
    };

    allRequests.forEach(r => {
      if (statuses.hasOwnProperty(r.status)) statuses[r.status]++;
    });

    return statuses;
  };

  const handleWithdraw = (request) => {
    if (request.status !== 'PENDING_REVIEW') {
      alert('Only pending requests can be withdrawn');
      return;
    }

    // Using data from hook
    const reqIndex = data.auditRequests.findIndex(r => r.id === request.id);

    if (reqIndex >= 0) {
      data.auditRequests[reqIndex].status = 'CLOSED';
      data.auditRequests[reqIndex].lastModified = new Date().toISOString();
      updateData(data);

      console.log('✓ Request withdrawn:', request.id);
      alert('✓ Request has been withdrawn');
      loadRequests();
      setSelectedRequest(null);
    }
  };

  const stats = getStats();

  const getStatusColor = (status) => {
    const colors = {
      'PENDING_REVIEW': '#ffb74d',
      'UNDER_ASSESSMENT': '#4a8fd9',
      'APPROVED_SCHEDULED': '#4caf50',
      'REJECTED': '#f44336',
      'CLOSED': '#9e9e9e'
    };
    return colors[status] || '#999';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'PENDING_REVIEW': 'Pending Review',
      'UNDER_ASSESSMENT': 'Under Assessment',
      'APPROVED_SCHEDULED': 'Approved & Scheduled',
      'REJECTED': 'Rejected',
      'CLOSED': 'Closed'
    };
    return labels[status] || status;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': '#ff5252',
      'Medium': '#ffc107',
      'Low': '#4caf50'
    };
    return colors[priority] || '#999';
  };

  // Pagination
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  if (selectedRequest) {
    return (
      <div className="min-h-screen bg-ink dark:bg-ink p-8">
        <button
          onClick={() => setSelectedRequest(null)}
          className="mb-6 px-4 py-2 border border-border dark:border-border-dark rounded-sm bg-ink dark:bg-ink text-text-mid dark:text-text-mid text-sm font-semibold cursor-pointer hover:bg-panel dark:hover:bg-panel transition-colors"
        >
          <i className="fas fa-arrow-left mr-2"></i> Back to Requests
        </button>

        <div className="flex items-center gap-3 mb-6 pl-4 border-l-4 border-gold dark:border-gold">
          <h2 className="text-2xl font-bold text-text-hi dark:text-text-hi">
            <i className="fas fa-file-alt mr-3"></i> Request Details
          </h2>
          <Badge status={getStatusLabel(selectedRequest.status)} className="director-approved" />
        </div>

        <div className="bg-panel dark:bg-panel-dark border border-border dark:border-border-dark rounded-sm p-8 mb-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-text-mid dark:text-text-mid text-xs mb-1 uppercase">REQUEST ID</p>
              <p className="text-text-hi dark:text-text-hi text-sm font-semibold font-mono">{selectedRequest.id}</p>
            </div>
            <div>
              <p className="text-text-mid dark:text-text-mid text-xs mb-1 uppercase">STATUS</p>
              <span className="inline-block px-2 py-1 rounded-sm text-xs font-bold text-white" style={{ backgroundColor: getStatusColor(selectedRequest.status) }}>
                {getStatusLabel(selectedRequest.status)}
              </span>
            </div>
          </div>

          <div className="border-t border-border dark:border-border-dark pt-4 mb-4">
            <h3 className="text-text-hi dark:text-text-hi mb-3 text-sm font-semibold">Taxpayer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-text-mid dark:text-text-mid text-xs mb-1 uppercase">TAXPAYER NAME</p>
                <p className="text-text-hi dark:text-text-hi text-sm">{selectedRequest.taxpayerName}</p>
              </div>
              <div>
                <p className="text-text-mid dark:text-text-mid text-xs mb-1 uppercase">TIN</p>
                <p className="text-text-hi dark:text-text-hi text-sm font-mono">{selectedRequest.tin}</p>
              </div>
              <div>
                <p className="text-text-mid dark:text-text-mid text-xs mb-1 uppercase">REQUEST TYPE</p>
                <p className="text-text-hi dark:text-text-hi text-sm">{selectedRequest.requestType}</p>
              </div>
              <div>
                <p className="text-text-mid dark:text-text-mid text-xs mb-1 uppercase">REGION</p>
                <p className="text-text-hi dark:text-text-hi text-sm">{selectedRequest.region}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border dark:border-border-dark pt-4 mb-4">
            <h3 className="text-text-hi dark:text-text-hi mb-3 text-sm font-semibold">Request Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-text-mid dark:text-text-mid text-xs mb-1 uppercase">PRIORITY</p>
                <span className="inline-block px-2 py-1 rounded-sm text-xs font-bold text-white" style={{ backgroundColor: getPriorityColor(selectedRequest.priority) }}>
                  {selectedRequest.priority}
                </span>
              </div>
              <div>
                <p className="text-text-mid dark:text-text-mid text-xs mb-1 uppercase">SUBMITTED DATE</p>
                <p className="text-text-hi dark:text-text-hi text-sm">
                  {new Date(selectedRequest.submittedDate).toLocaleDateString()} {new Date(selectedRequest.submittedDate).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-border dark:border-border-dark pt-4 mb-4">
            <h3 className="text-text-hi dark:text-text-hi mb-3 text-sm font-semibold">Reason & Justification</h3>
            <div className="mb-3">
              <p className="text-text-mid dark:text-text-mid text-xs mb-1 uppercase">REASON</p>
              <p className="text-text-hi dark:text-text-hi text-sm leading-relaxed whitespace-pre-wrap">{selectedRequest.reason}</p>
            </div>
            <div>
              <p className="text-text-mid dark:text-text-mid text-xs mb-1 uppercase">JUSTIFICATION</p>
              <p className="text-text-hi dark:text-text-hi text-sm leading-relaxed whitespace-pre-wrap">{selectedRequest.justification}</p>
            </div>
          </div>

          {selectedRequest.supportingNotes && (
            <div className="border-t border-border dark:border-border-dark pt-4 mb-4">
              <p className="text-text-mid dark:text-text-mid text-xs mb-1 uppercase">SUPPORTING NOTES</p>
              <p className="text-text-hi dark:text-text-hi text-sm leading-relaxed whitespace-pre-wrap">{selectedRequest.supportingNotes}</p>
            </div>
          )}

          {selectedRequest.status === 'APPROVED_SCHEDULED' && selectedRequest.auditCaseId && (
            <div className="bg-green-900 dark:bg-green-900 border border-success dark:border-success rounded-sm p-3 mt-4">
              <p className="text-success dark:text-success text-sm font-medium">
                <i className="fas fa-check mr-2"></i> Audit case created: {selectedRequest.auditCaseId}
              </p>
            </div>
          )}

          {selectedRequest.status === 'PENDING_REVIEW' && (
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => handleWithdraw(selectedRequest)}
                className="px-4 py-2 bg-danger dark:bg-danger text-white border-none rounded-sm text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
              >
                <i className="fas fa-times mr-2"></i> Withdraw Request
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink dark:bg-ink p-8">
      <div className="flex items-center gap-3 mb-8 pl-4 border-l-4 border-gold dark:border-gold">
        <h2 className="text-3xl font-bold text-text-hi dark:text-text-hi">
          <i className="fas fa-list mr-3"></i> My Requests
        </h2>
        <Badge status={`${filteredRequests.length} Requests`} className="director-approved" />
      </div>

      {/* Summary Info */}
      <div className="bg-blue-50 dark:bg-blue-900 border border-blue-500 dark:border-blue-600 rounded-sm p-4 mb-6 text-blue-900 dark:text-blue-100">
        <strong className="text-blue-900 dark:text-blue-100">
          <i className="fas fa-info-circle mr-2"></i> Your Audit Requests
        </strong>
        <p className="text-blue-900 dark:text-blue-100 text-sm leading-relaxed mt-2">
          Track all audit requests you have submitted. Total Requests: <strong>{allRequests.length}</strong> | 
          Displayed: <strong>{filteredRequests.length}</strong>
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card title="Total Submitted" number={allRequests.length} icon="fas fa-inbox" />
        <Card title="Pending Review" number={stats['PENDING_REVIEW']} icon="fas fa-hourglass-half" />
        <Card title="Approved" number={stats['APPROVED_SCHEDULED']} icon="fas fa-check-circle" />
        <Card title="Rejected" number={stats['REJECTED']} icon="fas fa-times-circle" />
      </div>

      {/* Filters */}
      <div className="bg-panel dark:bg-panel-dark border border-border dark:border-border-dark rounded-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search TIN, name, or request ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[180px] px-3 py-2 border border-border dark:border-border-dark rounded-sm bg-ink dark:bg-ink text-text-hi dark:text-text-hi text-sm focus:outline-none focus:border-gold dark:focus:border-gold"
        />

        <select value={filterRequestType} onChange={(e) => setFilterRequestType(e.target.value)}
          className="px-3 py-2 border border-border dark:border-border-dark rounded-sm bg-ink dark:bg-ink text-text-hi dark:text-text-hi text-sm focus:outline-none focus:border-gold">
          {getRequestTypes().map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-border dark:border-border-dark rounded-sm bg-ink dark:bg-ink text-text-hi dark:text-text-hi text-sm focus:outline-none focus:border-gold">
          {getStatuses().map(status => (
            <option key={status} value={status}>{status === 'All' ? 'All Statuses' : getStatusLabel(status)}</option>
          ))}
        </select>

        <button
          onClick={() => {
            setSearchTerm('');
            setFilterRequestType('All');
            setFilterStatus('All');
          }}
          className="px-3 py-2 border border-border dark:border-border-dark rounded-sm bg-ink dark:bg-ink text-text-mid dark:text-text-mid text-sm cursor-pointer hover:bg-panel dark:hover:bg-panel transition-colors"
        >
          Clear Filters
        </button>
      </div>

      {/* Requests Table */}
      {filteredRequests.length === 0 ? (
        <div className="bg-panel dark:bg-panel-dark border border-border dark:border-border-dark rounded-sm p-10 text-center">
          <i className="fas fa-inbox text-text-mid dark:text-text-mid text-4xl mb-3 block"></i>
          <p className="text-text-mid dark:text-text-mid text-sm">No requests found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto mb-6 border border-border dark:border-border-dark rounded-sm">
            <table className="w-full text-sm">
              <thead className="bg-panel dark:bg-panel-dark border-b border-border dark:border-border-dark">
                <tr>
                  <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">REQUEST ID</th>
                  <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">TAXPAYER</th>
                  <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">TIN</th>
                  <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">TYPE</th>
                  <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">PRIORITY</th>
                  <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">SUBMITTED DATE</th>
                  <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">STATUS</th>
                  <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.map(request => (
                  <tr key={request.id} className="border-b border-border dark:border-border-dark hover:bg-panel dark:hover:bg-panel-dark transition-colors">
                    <td className="px-4 py-3"><strong className="text-success dark:text-success">{request.id?.substring(0, 20)}...</strong></td>
                    <td className="px-4 py-3 text-text-hi dark:text-text-hi">{request.taxpayerName}</td>
                    <td className="px-4 py-3 text-text-hi dark:text-text-hi">{request.tin}</td>
                    <td className="px-4 py-3 text-text-hi dark:text-text-hi">{request.requestType}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 rounded-sm text-xs font-bold text-white" style={{ backgroundColor: getPriorityColor(request.priority) }}>
                        {request.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-mid dark:text-text-mid text-xs">
                      {new Date(request.submittedDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 rounded-sm text-xs font-bold text-white" style={{ backgroundColor: getStatusColor(request.status) }}>
                        {getStatusLabel(request.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="px-2 py-1 bg-info dark:bg-info text-white border-none rounded-sm text-xs cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center py-3 text-text-mid dark:text-text-mid text-sm">
            <span>Showing {paginatedRequests.length} of {filteredRequests.length} requests</span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-2 py-1 border border-border dark:border-border-dark rounded-sm text-xs cursor-pointer transition-colors ${
                    currentPage === page 
                      ? 'bg-info dark:bg-info text-white font-semibold' 
                      : 'bg-ink dark:bg-ink text-text-mid dark:text-text-mid hover:bg-panel dark:hover:bg-panel'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Summary */}
      <div className="mt-6 bg-green-900 dark:bg-green-900 border border-success dark:border-success rounded-sm p-4 text-success dark:text-success">
        <strong><i className="fas fa-chart-bar mr-2"></i> Request Summary</strong>
        <p className="text-green-200 dark:text-green-200 text-sm leading-relaxed mt-2">
          Total Submitted: <strong>{allRequests.length}</strong> | 
          Pending: <strong>{stats['PENDING_REVIEW']}</strong> | 
          Approved: <strong>{stats['APPROVED_SCHEDULED']}</strong> | 
          Rejected: <strong>{stats['REJECTED']}</strong>
        </p>
      </div>
    </div>
  );
}

export default MyRequestsView;
