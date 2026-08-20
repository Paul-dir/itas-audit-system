/**
 * TEAM LEADER CASE MANAGEMENT VIEW - REAL-TIME
 * 
 * Shows real-time case assignments for Team Leader:
 * 1. Cases assigned to this Team Leader
 * 2. Their auditors and case assignments
 * 3. Real-time workload tracking
 * 4. Auto-refreshes every 5 seconds
 */

import React, { useState, useEffect } from 'react';
import Card from '../../Card';
import { useAuth } from '../../../context/AuthContext';
import { useTeamLeaderAssignments } from '../../../hooks/useRealTimeAssignments';

function TeamLeaderCaseManagementView() {
  const { getUserInfo } = useAuth();
  const userInfo = getUserInfo();

  // Use real-time assignments hook - auto-refreshes every 5 seconds
  const { 
    assignedCases, 
    auditors, 
    auditorStats,
    loading,
    error,
    refresh,
    lastRefresh
  } = useTeamLeaderAssignments(userInfo?.id);
  
  const [selectedAuditor, setSelectedAuditor] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Set initial auditor
  useEffect(() => {
    if (auditors.length > 0 && !selectedAuditor) {
      setSelectedAuditor(auditors[0].id);
    }
  }, [auditors, selectedAuditor]);

  // Get cases for selected auditor
  const getAuditorCases = (auditorId) => {
    return assignedCases.filter(c => c.assignedAuditorId === auditorId);
  };

  // Get filtered cases
  const getFilteredCases = () => {
    let filtered = [];

    if (selectedAuditor) {
      filtered = getAuditorCases(selectedAuditor);
    } else {
      filtered = assignedCases;
    }

    if (filterStatus !== 'All') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.id?.includes(searchTerm) ||
        c.taxpayerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.tin?.includes(searchTerm)
      );
    }

    return filtered;
  };

  // Get Team Leader stats
  const getTLStats = () => {
    return {
      total: assignedCases.length,
      routed: assignedCases.filter(c => c.status === 'ASSIGNED_TO_AUDITOR').length,
      pending: assignedCases.filter(c => c.status === 'ASSIGNED_TO_TEAM_LEADER').length
    };
  };

  // Show loading state
  if (loading && assignedCases.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#8b949e' }}>
        <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px', fontSize: '24px' }}></i>
        <p style={{ marginTop: '12px' }}>Loading real-time case assignments...</p>
      </div>
    );
  }

  // Show error state
  if (error && assignedCases.length === 0) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ background: '#ff5252', color: '#fff', padding: '16px', borderRadius: '8px' }}>
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  const filteredCases = getFilteredCases();
  const tlStats = getTLStats();
  const selectedAuditorObj = auditors.find(a => a.id === selectedAuditor);
  const selectedAuditorStats = selectedAuditor ? (auditorStats[selectedAuditor] || { total: 0, active: 0, pending: 0 }) : { total: 0, active: 0, pending: 0 };

  const getRiskColor = (riskLevel) => {
    const colors = {
      'Critical': '#ff5252',
      'High': '#ff9800',
      'Medium': '#ffc107',
      'Low': '#4caf50'
    };
    return colors[riskLevel] || '#999';
  };

  return (
    <div style={{ padding: '24px', display: 'flex', gap: '24px', minHeight: 'calc(100vh - 100px)' }}>
      {/* Left Sidebar - Auditors */}
      <div style={{ width: '280px', overflowY: 'auto', paddingRight: '12px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#f0f6fc', margin: 0, textTransform: 'uppercase' }}>
              <i className="fas fa-users" style={{ marginRight: '8px' }}></i> Your Auditors
            </h3>
            <button
              onClick={refresh}
              title="Refresh data"
              style={{
                background: 'none',
                border: 'none',
                color: '#8b949e',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              <i className="fas fa-sync-alt"></i>
            </button>
          </div>

          {/* Summary Card */}
          <div style={{
            background: '#0f1419',
            border: '1px solid #30363d',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '12px',
            fontSize: '11px'
          }}>
            <div style={{ color: '#8b949e', marginBottom: '8px' }}>
              <strong style={{ color: '#f0f6fc' }}>Total Auditors:</strong> {auditors.length}
            </div>
            <div style={{ color: '#8b949e' }}>
              <strong style={{ color: '#f0f6fc' }}>Total Cases:</strong> {tlStats.total}
            </div>
            <div style={{ color: '#8b949e', marginTop: '8px' }}>
              ✓ Routed: <strong style={{ color: '#4caf50' }}>{tlStats.routed}</strong>
            </div>
            <div style={{ color: '#8b949e' }}>
              ⏳ Pending: <strong style={{ color: '#ff9800' }}>{tlStats.pending}</strong>
            </div>
          </div>

          {/* Auditor List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {auditors.length === 0 ? (
              <div style={{ color: '#8b949e', fontSize: '12px', padding: '12px', background: '#0f1419', borderRadius: '6px' }}>
                No auditors assigned to your team
              </div>
            ) : (
              auditors.map(auditor => {
                const stats = auditorStats[auditor.id] || { total: 0, active: 0, pending: 0 };
                const isSelected = selectedAuditor === auditor.id;
                return (
                  <button
                    key={auditor.id}
                    onClick={() => setSelectedAuditor(auditor.id)}
                    style={{
                      background: isSelected ? '#2196f3' : '#1c2128',
                      border: isSelected ? '2px solid #58a6ff' : '1px solid #30363d',
                      color: isSelected ? '#fff' : '#8b949e',
                      padding: '12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: '600',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ marginBottom: '6px', fontSize: '12px' }}>
                      {auditor.full_name}
                    </div>
                    <div style={{ fontSize: '10px', opacity: 0.8 }}>
                      📊 {stats.total} | ✓ {stats.active}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Last refresh indicator */}
        <div style={{ marginTop: '24px', fontSize: '10px', color: '#8b949e', textAlign: 'center' }}>
          <i className="fas fa-clock" style={{ marginRight: '4px' }}></i>
          Auto-updates every 5s
        </div>
      </div>

      {/* Main Content - Cases */}
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#f0f6fc', marginBottom: '12px' }}>
            <i className="fas fa-briefcase" style={{ marginRight: '12px' }}></i> My Cases
          </h2>
          <p style={{ color: '#8b949e', fontSize: '13px' }}>
            Real-time view of all your cases. Monitor auditor assignments and track progress.
          </p>
        </div>

        {/* Summary Info */}
        <div style={{
          background: '#e3f2fd',
          color: '#0c4a6e',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px',
          border: '1px solid #1976d2'
        }}>
          <strong><i className="fas fa-info-circle"></i> {selectedAuditorObj ? `${selectedAuditorObj.full_name}'s Cases` : 'All Your Cases'} (Real-time)</strong>
          <p style={{ color: '#0c4a6e', margin: '8px 0 0 0', fontSize: '13px', lineHeight: '1.6' }}>
            Total: <strong>{selectedAuditorStats.total}</strong> | 
            Active: <strong>{selectedAuditorStats.active}</strong> |
            Pending: <strong>{selectedAuditorStats.pending}</strong>
          </p>
        </div>

        {/* Statistics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <Card title="Total Cases" number={tlStats.total} icon="fas fa-list-check" />
          <Card title="Your Auditors" number={auditors.length} icon="fas fa-users" />
          <Card title="Cases Routed" number={tlStats.routed} icon="fas fa-check-circle" />
          <Card title="Awaiting Route" number={tlStats.pending} icon="fas fa-hourglass" />
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
            placeholder="Search case ID, TIN, or taxpayer..."
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

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #30363d',
              borderRadius: '6px',
              background: '#0f1419',
              color: '#f0f6fc',
              fontSize: '12px'
            }}
          >
            <option value="All">All Status</option>
            <option value="ASSIGNED_TO_TEAM_LEADER">Awaiting Route</option>
            <option value="ASSIGNED_TO_AUDITOR">Active</option>
            <option value="IN_EXECUTION">In Execution</option>
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
            Clear
          </button>
        </div>

        {/* Cases Table */}
        <div style={{ marginBottom: '24px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#0f1419', borderBottom: '1px solid #30363d' }}>
                <th style={{ padding: '12px', textAlign: 'left', color: '#8b949e', fontWeight: '600' }}>CASE ID</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#8b949e', fontWeight: '600' }}>TIN</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#8b949e', fontWeight: '600' }}>TAXPAYER</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#8b949e', fontWeight: '600' }}>RISK</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#8b949e', fontWeight: '600' }}>STATUS</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#8b949e', fontWeight: '600' }}>ASSIGNED AUDITOR</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#8b949e', fontWeight: '600' }}>REVENUE</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '24px', textAlign: 'center', color: '#8b949e' }}>
                    No cases found
                  </td>
                </tr>
              ) : (
                filteredCases.map((auditCase, idx) => (
                  <tr key={`${auditCase.id}-${idx}`} style={{ borderBottom: '1px solid #30363d' }}>
                    <td style={{ padding: '12px', color: '#4caf50', fontWeight: 'bold' }}>
                      {auditCase.id?.substring(0, 15)}...
                    </td>
                    <td style={{ padding: '12px', color: '#f0f6fc' }}>{auditCase.tin}</td>
                    <td style={{ padding: '12px', color: '#f0f6fc' }}>{auditCase.taxpayerName}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        background: getRiskColor(auditCase.riskLevel),
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }}>
                        {auditCase.riskLevel}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        background: auditCase.status === 'ASSIGNED_TO_AUDITOR' ? '#4caf50' : 
                                   auditCase.status === 'IN_EXECUTION' ? '#2196f3' : '#ff9800',
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }}>
                        {auditCase.status === 'ASSIGNED_TO_AUDITOR' ? '✓ Active' :
                         auditCase.status === 'IN_EXECUTION' ? '🔄 Executing' : '⏳ Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#4caf50', fontWeight: 'bold' }}>
                      {auditCase.assignedAuditor || '—'}
                    </td>
                    <td style={{ padding: '12px', color: '#f0f6fc' }}>
                      {((auditCase.revenueAtRisk || 0) / 1000000).toFixed(1)}M
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div style={{
          background: '#0f1419',
          border: '1px solid #30363d',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#f0f6fc', marginBottom: '12px' }}>
            📊 Auditor Workload Summary (Real-time)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            {auditors.map(auditor => {
              const stats = auditorStats[auditor.id] || { total: 0, active: 0, pending: 0 };
              return (
                <div
                  key={auditor.id}
                  style={{
                    background: '#1c2128',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    padding: '12px',
                    fontSize: '11px'
                  }}
                >
                  <div style={{ color: '#58a6ff', fontWeight: '600', marginBottom: '8px' }}>
                    {auditor.full_name}
                  </div>
                  <div style={{ color: '#8b949e', marginBottom: '4px' }}>
                    Cases: <strong style={{ color: '#f0f6fc' }}>{stats.total}</strong>
                  </div>
                  <div style={{ color: '#8b949e' }}>
                    Active: <strong style={{ color: '#4caf50' }}>{stats.active}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamLeaderCaseManagementView;
