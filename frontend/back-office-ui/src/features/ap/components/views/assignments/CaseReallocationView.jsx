import React, { useState, useEffect } from 'react';
import Badge from '../../Badge';
import { useData } from '../../../services/dataService';
import { useAuth } from '../../../context/AuthContext';
import {
  loadTeamLeaders,
  loadAuditors,
  loadAssignment,
  saveAssignment,
  updateTeamLeaderWorkload,
  updateAuditorWorkload,
  loadAuditorsByTaxCenter
} from '../../../utils/assignmentData';
import { ASSIGNMENT_STATES } from '../../../utils/assignmentDataModels';
import { executeTransition } from '../../../utils/assignmentStateMachine';

/**
 * CaseReallocationView - Process Owner
 * Allows re-allocation of cases from one officer to another
 * Process Owner is ONLY role that can re-allocate
 */

function CaseReallocationView() {
  const { getUserInfo } = useAuth();
  const { data, updateData } = useData();
  const userInfo = getUserInfo();

  const [allAssignments, setAllAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [auditors, setAuditors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterTaxCenter, setFilterTaxCenter] = useState('');

  // Reallocation modal state
  const [reallocatingCase, setReallocatingCase] = useState(null);
  const [newTeamLeaderId, setNewTeamLeaderId] = useState('');
  const [newAuditorId, setNewAuditorId] = useState('');
  const [reallocationReason, setReallocationReason] = useState('');

  const [regions, setRegions] = useState([]);
  const [taxCenters, setTaxCenters] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    filterAssignments();
  }, [searchTerm, filterStatus, filterRegion, filterTaxCenter, allAssignments]);

  const loadAllData = () => {
    try {
      setLoading(true);
      // Using data from hook

      // Get all unique regions and tax centers
      const uniqueRegions = [...new Set((data.auditCases || []).map(c => c.region))];
      const uniqueTaxCenters = [...new Set((data.auditCases || []).map(c => c.taxCenter))];

      setRegions(uniqueRegions);
      setTaxCenters(uniqueTaxCenters);

      // Load team leaders for all regions/tax centers
      const allTLs = [];
      uniqueRegions.forEach(region => {
        uniqueTaxCenters.forEach(tc => {
          const tls = loadTeamLeaders(region, tc);
          allTLs.push(...tls);
        });
      });
      setTeamLeaders(allTLs);

      // Load all auditors
      const allAuditors = loadAuditorsByTaxCenter('', '');
      setAuditors(allAuditors);

      // Collect all assignments
      if (data.assignments) {
        setAllAssignments(data.assignments);
      }

      console.log('✓ Loaded:', {
        assignments: data.assignments?.length || 0,
        teamLeaders: allTLs.length,
        auditors: allAuditors.length
      });
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage({ type: 'error', text: 'Error loading data' });
    } finally {
      setLoading(false);
    }
  };

  const filterAssignments = () => {
    let filtered = allAssignments;

    // Status filter
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(a => a.currentState === filterStatus);
    }

    // Region filter
    if (filterRegion) {
      filtered = filtered.filter(a => a.region === filterRegion);
    }

    // Tax center filter
    if (filterTaxCenter) {
      filtered = filtered.filter(a => a.taxCenter === filterTaxCenter);
    }

    // Search term (case ID or TIN)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(a => {
        const auditCase = (data?.auditCases || []).find(c => c.id === a.caseId);
        return a.caseId.toLowerCase().includes(term) ||
          (auditCase && (auditCase.tin?.includes(searchTerm) || auditCase.taxpayerName?.toLowerCase().includes(term)));
      });
    }

    setFilteredAssignments(filtered);
  };

  const handleReallocate = (assignmentId) => {
    try {
      const assignment = allAssignments.find(a => a.id === assignmentId);
      if (!assignment) throw new Error('Assignment not found');

      if (!newTeamLeaderId || !newAuditorId || !reallocationReason) {
        setMessage({ type: 'error', text: 'Please select new team leader, auditor, and provide reason' });
        return;
      }

      const newTL = teamLeaders.find(t => t.id === newTeamLeaderId);
      const newAuditor = auditors.find(a => a.id === newAuditorId);
      const oldTL = teamLeaders.find(t => t.id === assignment.currentOwner) || { fullName: 'Unknown' };

      if (!newTL || !newAuditor) {
        throw new Error('Invalid selection');
      }

      // Save previous assignments in history
      let updatedAssignment = { ...assignment };
      updatedAssignment.assignmentChain = updatedAssignment.assignmentChain || [];
      updatedAssignment.assignmentChain.push({
        timestamp: new Date().toISOString(),
        action: 'REALLOCATED',
        byUser: userInfo.fullName,
        userId: userInfo.id,
        reason: reallocationReason,
        fromUser: oldTL.fullName,
        fromTeamLeaderId: assignment.currentOwner,
        toTeamLeaderId: newTeamLeaderId,
        toAuditorId: newAuditorId,
        status: 'COMPLETED'
      });

      // Update assignment to new team leader and auditor
      updatedAssignment.previousState = updatedAssignment.currentState;
      updatedAssignment.currentState = ASSIGNMENT_STATES.REALLOCATED;
      updatedAssignment.currentOwner = newAuditorId;
      updatedAssignment.currentOwnerRole = 'AUDITOR';
      updatedAssignment.lastUpdated = new Date().toISOString();
      updatedAssignment.reallocatedAt = new Date().toISOString();
      updatedAssignment.reallocatedBy = userInfo.id;

      // Execute transition
      updatedAssignment = executeTransition(
        updatedAssignment,
        ASSIGNMENT_STATES.ASSIGNED_TO_AUDITOR,
        {
          toUser: newAuditorId,
          fromUser: userInfo.fullName,
          reason: `Re-allocated by Process Owner: ${reallocationReason}`
        }
      );

      // Save assignment
      saveAssignment(updatedAssignment);

      // Update workloads
      if (assignment.currentOwner !== newTeamLeaderId) {
        updateTeamLeaderWorkload(assignment.currentOwner, -1); // Decrease old TL
        updateTeamLeaderWorkload(newTeamLeaderId, 1); // Increase new TL
      }

      updateAuditorWorkload(newAuditorId, 1); // Increase new auditor

      // Update local state
      const updatedAssignments = allAssignments.map(a =>
        a.id === assignmentId ? updatedAssignment : a
      );
      setAllAssignments(updatedAssignments);

      setMessage({
        type: 'success',
        text: `✓ Case re-allocated to ${newAuditor.fullName}`
      });

      // Clear modal
      setReallocatingCase(null);
      setNewTeamLeaderId('');
      setNewAuditorId('');
      setReallocationReason('');
    } catch (error) {
      console.error('Error reallocating case:', error);
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleAuditorSelect = (tlId) => {
    setNewTeamLeaderId(tlId);
    setNewAuditorId(''); // Reset auditor when TL changes
  };

  const getAuditorsByTeamLeader = (tlId) => {
    return auditors.filter(a => a.teamLeaderId === tlId);
  };

  const getAssignmentChainDisplay = (assignment) => {
    // Using data from hook
    const auditCase = (data.auditCases || []).find(c => c.id === assignment.caseId);

    const chain = [];
    if (assignment.assignmentChain && assignment.assignmentChain.length > 0) {
      assignment.assignmentChain.forEach(entry => {
        if (entry.action === 'ASSIGNED_BY_TEAM_LEADER' || entry.action === 'ASSIGNED_TO_AUDITOR') {
          chain.push(`${entry.byUser} (${entry.action})`);
        }
      });
    }

    return chain.join(' → ');
  };

  const getStateColor = (state) => {
    switch (state) {
      case ASSIGNMENT_STATES.STORED: return '#9c27b0';
      case ASSIGNMENT_STATES.ASSIGNED_TO_TEAM_LEADER: return '#2196f3';
      case ASSIGNMENT_STATES.ASSIGNED_TO_AUDITOR: return '#ff9800';
      case ASSIGNMENT_STATES.ACCEPTED_BY_AUDITOR: return '#4caf50';
      case ASSIGNMENT_STATES.IN_EXECUTION: return '#f44336';
      case ASSIGNMENT_STATES.REALLOCATED: return '#009688';
      case ASSIGNMENT_STATES.COMPLETED: return '#4caf50';
      default: return '#666';
    }
  };

  if (loading) {
    return <div style={{ padding: '24px' }}>Loading assignments...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <div className="detail-header">
        <h2><i className="fas fa-exchange-alt"></i> Case Re-allocation (Process Owner)</h2>
        <Badge status={`${filteredAssignments.length}/${allAssignments.length} Cases`} className="director-approved" />
      </div>

      {message && (
        <div style={{
          background: message.type === 'success' ? '#c8e6c9' : message.type === 'error' ? '#ffcdd2' : '#fff9c4',
          color: message.type === 'success' ? '#2e7d32' : message.type === 'error' ? '#c62828' : '#f57f17',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '16px',
          fontSize: '12px'
        }}>
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div style={{
        background: '#0f1419',
        border: '1px solid #30363d',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
          gap: '8px',
          marginBottom: '0'
        }}>
          <input
            type="text"
            placeholder="Search Case ID, TIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #30363d',
              borderRadius: '4px',
              background: '#1c2128',
              color: '#f0f6fc',
              fontSize: '11px'
            }}
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #30363d',
              borderRadius: '4px',
              background: '#1c2128',
              color: '#f0f6fc',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Status</option>
            <option value={ASSIGNMENT_STATES.STORED}>Stored</option>
            <option value={ASSIGNMENT_STATES.ASSIGNED_TO_TEAM_LEADER}>TL Assigned</option>
            <option value={ASSIGNMENT_STATES.ASSIGNED_TO_AUDITOR}>Auditor Assigned</option>
            <option value={ASSIGNMENT_STATES.ACCEPTED_BY_AUDITOR}>Accepted</option>
            <option value={ASSIGNMENT_STATES.IN_EXECUTION}>In Execution</option>
            <option value={ASSIGNMENT_STATES.REALLOCATED}>Reallocated</option>
          </select>

          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #30363d',
              borderRadius: '4px',
              background: '#1c2128',
              color: '#f0f6fc',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            <option value="">All Regions</option>
            {regions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <select
            value={filterTaxCenter}
            onChange={(e) => setFilterTaxCenter(e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #30363d',
              borderRadius: '4px',
              background: '#1c2128',
              color: '#f0f6fc',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            <option value="">All Tax Centers</option>
            {taxCenters.map(tc => (
              <option key={tc} value={tc}>{tc}</option>
            ))}
          </select>

          <button
            onClick={loadAllData}
            style={{
              padding: '8px 14px',
              background: '#666',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {filteredAssignments.length === 0 ? (
        <div style={{
          background: '#e3f2fd',
          color: '#0c4a6e',
          padding: '24px',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #1976d2'
        }}>
          <i className="fas fa-inbox" style={{ fontSize: '32px', marginBottom: '12px', display: 'block' }}></i>
          <strong>No assignments found</strong>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px' }}>
            Adjust filters to see available assignments
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredAssignments.map((assignment, idx) => {
            // Using data from hook
            const auditCase = (data.auditCases || []).find(c => c.id === assignment.caseId);
            const currentTL = teamLeaders.find(t => t.id === assignment.currentOwner);
            const tlsForRealloc = teamLeaders.filter(t =>
              t.region === assignment.region && t.taxCenter === assignment.taxCenter
            );

            return (
              <div key={`${assignment.id}-${idx}`} style={{
                background: '#1c2128',
                border: `2px solid ${getStateColor(assignment.currentState)}`,
                borderRadius: '6px',
                overflow: 'hidden'
              }}>
                {/* Header */}
                <div style={{
                  background: '#0f1419',
                  padding: '10px 12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #30363d'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ color: '#f0f6fc' }}>{assignment.caseId.substring(0, 25)}...</strong>
                      <span style={{
                        background: getStateColor(assignment.currentState),
                        color: '#fff',
                        padding: '2px 8px',
                        borderRadius: '3px',
                        fontSize: '9px',
                        fontWeight: 'bold'
                      }}>
                        {assignment.currentState?.replace(/_/g, ' ') || 'UNKNOWN'}
                      </span>
                    </div>
                    <small style={{ color: '#8b949e' }}>
                      {auditCase?.taxpayerName} | TIN: {auditCase?.tin}
                    </small>
                  </div>

                  <button
                    onClick={() => setReallocatingCase(reallocatingCase === assignment.id ? null : assignment.id)}
                    style={{
                      padding: '6px 12px',
                      background: '#ff9800',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Re-allocate
                  </button>
                </div>

                {/* Details */}
                <div style={{ padding: '12px' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '12px',
                    fontSize: '11px',
                    color: '#f0f6fc',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <strong style={{ color: '#8b949e' }}>Current TL:</strong> {currentTL?.fullName || 'Unknown'}
                    </div>
                    <div>
                      <strong style={{ color: '#8b949e' }}>Current Auditor:</strong> {
                        auditors.find(a => a.id === assignment.currentOwner)?.fullName || 'Not Assigned'
                      }
                    </div>
                    <div>
                      <strong style={{ color: '#8b949e' }}>Risk Level:</strong> {auditCase?.riskLevel}
                    </div>
                  </div>

                  {assignment.assignmentChain && assignment.assignmentChain.length > 0 && (
                    <div style={{
                      background: '#1c2128',
                      border: '1px solid #30363d',
                      borderRadius: '4px',
                      padding: '8px',
                      fontSize: '10px',
                      color: '#8b949e',
                      marginBottom: '12px'
                    }}>
                      <strong>Assignment Chain:</strong>
                      <div style={{ marginTop: '4px' }}>
                        {assignment.assignmentChain.slice(-3).map((entry, idx) => (
                          <div key={idx}>
                            {new Date(entry.timestamp).toLocaleDateString()} - {entry.action}: {entry.byUser}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Reallocation Modal */}
                {reallocatingCase === assignment.id && (
                  <div style={{
                    background: '#2d333b',
                    borderTop: '1px solid #30363d',
                    padding: '12px'
                  }}>
                    <h4 style={{ color: '#f0f6fc', fontSize: '12px', marginBottom: '12px' }}>
                      Re-allocate Case
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <label style={{
                          fontSize: '11px',
                          color: '#8b949e',
                          fontWeight: 'bold',
                          display: 'block',
                          marginBottom: '6px'
                        }}>
                          Select New Team Leader:
                        </label>
                        <select
                          value={newTeamLeaderId}
                          onChange={(e) => handleAuditorSelect(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #30363d',
                            borderRadius: '4px',
                            background: '#1c2128',
                            color: '#f0f6fc',
                            fontSize: '11px',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="">Choose Team Leader...</option>
                          {tlsForRealloc.map(tl => (
                            <option key={tl.id} value={tl.id}>
                              {tl.fullName} ({tl.auditType}) - {tl.currentWorkload}/{tl.maxCapacity}
                            </option>
                          ))}
                        </select>
                      </div>

                      {newTeamLeaderId && (
                        <div>
                          <label style={{
                            fontSize: '11px',
                            color: '#8b949e',
                            fontWeight: 'bold',
                            display: 'block',
                            marginBottom: '6px'
                          }}>
                            Select New Auditor:
                          </label>
                          <select
                            value={newAuditorId}
                            onChange={(e) => setNewAuditorId(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #30363d',
                              borderRadius: '4px',
                              background: '#1c2128',
                              color: '#f0f6fc',
                              fontSize: '11px',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="">Choose Auditor...</option>
                            {getAuditorsByTeamLeader(newTeamLeaderId).map(aud => (
                              <option key={aud.id} value={aud.id}>
                                {aud.fullName} ({aud.currentWorkload}/{aud.maxCapacity})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div>
                        <label style={{
                          fontSize: '11px',
                          color: '#8b949e',
                          fontWeight: 'bold',
                          display: 'block',
                          marginBottom: '6px'
                        }}>
                          Reason for Re-allocation (Required):
                        </label>
                        <textarea
                          value={reallocationReason}
                          onChange={(e) => setReallocationReason(e.target.value)}
                          placeholder="Explain why this case is being re-allocated..."
                          style={{
                            width: '100%',
                            height: '60px',
                            padding: '8px',
                            border: '1px solid #30363d',
                            borderRadius: '4px',
                            background: '#1c2128',
                            color: '#f0f6fc',
                            fontSize: '11px',
                            fontFamily: 'inherit',
                            resize: 'none'
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={() => handleReallocate(assignment.id)}
                          disabled={!newTeamLeaderId || !newAuditorId || !reallocationReason}
                          style={{
                            flex: 1,
                            padding: '10px',
                            background: !newTeamLeaderId || !newAuditorId || !reallocationReason ? '#666' : '#ff9800',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: !newTeamLeaderId || !newAuditorId || !reallocationReason ? 'not-allowed' : 'pointer'
                          }}
                        >
                          Confirm Re-allocation
                        </button>

                        <button
                          onClick={() => {
                            setReallocatingCase(null);
                            setNewTeamLeaderId('');
                            setNewAuditorId('');
                            setReallocationReason('');
                          }}
                          style={{
                            flex: 1,
                            padding: '10px',
                            background: '#666',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CaseReallocationView;
