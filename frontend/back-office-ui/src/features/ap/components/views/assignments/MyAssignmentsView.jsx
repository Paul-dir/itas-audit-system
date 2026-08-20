import React, { useState, useEffect } from 'react';
import Card from '../../Card';
import Badge from '../../Badge';
import { useData } from '../../../services/dataService';
import { useAuth } from '../../../context/AuthContext';
import {
  loadAssignmentsByUser,
  loadAuditor,
  loadAssignment,
  saveAssignment,
  updateAuditorWorkload,
  loadTeamLeader
} from '../../../utils/assignmentData';
import { ASSIGNMENT_STATES } from '../../../utils/assignmentDataModels';
import { executeTransition } from '../../../utils/assignmentStateMachine';

/**
 * MyAssignmentsView - Auditor
 * Shows cases assigned to auditor and allows accept/reject actions
 */

function MyAssignmentsView() {
  const { getUserInfo } = useAuth();
  const { data, updateData } = useData();
  const userInfo = getUserInfo();

  const [assignedCases, setAssignedCases] = useState([]);
  const [acceptedCases, setAcceptedCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [expandedCase, setExpandedCase] = useState(null);
  const [requestReasonText, setRequestReasonText] = useState({});
  const [showReasonModal, setShowReasonModal] = useState(null);

  useEffect(() => {
    loadMyAssignments();
  }, []);

  const loadMyAssignments = () => {
    try {
      setLoading(true);
      const auditorId = userInfo?.id;

      if (!auditorId) {
        setMessage({ type: 'error', text: 'Missing auditor context' });
        return;
      }

      // Load my assignments (ASSIGNED_TO_AUDITOR state)
      const myAssignments = loadAssignmentsByUser(auditorId, 'AUDITOR');
      // Using data from hook

      // Separate pending and accepted
      const pending = [];
      const accepted = [];

      myAssignments.forEach(assignment => {
        const auditCase = (data.auditCases || []).find(c => c.id === assignment.caseId);
        if (auditCase) {
          if (assignment.currentState === ASSIGNMENT_STATES.ASSIGNED_TO_AUDITOR) {
            pending.push({ ...auditCase, assignment });
          } else if (assignment.currentState === ASSIGNMENT_STATES.ACCEPTED_BY_AUDITOR) {
            accepted.push({ ...auditCase, assignment });
          }
        }
      });

      setAssignedCases(pending);
      setAcceptedCases(accepted);

      console.log('✓ Loaded my assignments:', {
        pending: pending.length,
        accepted: accepted.length
      });
    } catch (error) {
      console.error('Error loading assignments:', error);
      setMessage({ type: 'error', text: 'Error loading assignments' });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAssignment = (caseId) => {
    try {
      const caseData = assignedCases.find(c => c.id === caseId);
      if (!caseData) throw new Error('Case not found');

      let assignment = caseData.assignment;

      // Execute transition to ACCEPTED_BY_AUDITOR
      assignment = executeTransition(
        assignment,
        ASSIGNMENT_STATES.ACCEPTED_BY_AUDITOR,
        {
          toUser: userInfo.id,
          fromUser: userInfo.fullName,
          reason: `Auditor accepted assignment`
        }
      );

      // Save assignment
      saveAssignment(assignment);

      // Move case from pending to accepted in local state
      setAssignedCases(assignedCases.filter(c => c.id !== caseId));
      setAcceptedCases([...acceptedCases, { ...caseData, assignment }]);

      setMessage({
        type: 'success',
        text: `✓ Assignment accepted. You can now start execution.`
      });
    } catch (error) {
      console.error('Error accepting assignment:', error);
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleRequestReassignment = (caseId, reason) => {
    try {
      const caseData = assignedCases.find(c => c.id === caseId);
      if (!caseData) throw new Error('Case not found');

      if (!reason || reason.trim().length === 0) {
        setMessage({ type: 'error', text: 'Please provide a reason for reassignment request' });
        return;
      }

      let assignment = caseData.assignment;

      // Add to assignment chain (mark as requested reassignment)
      assignment.assignmentChain = assignment.assignmentChain || [];
      assignment.assignmentChain.push({
        timestamp: new Date().toISOString(),
        action: 'REASSIGNMENT_REQUESTED',
        byUser: userInfo.fullName,
        userId: userInfo.id,
        reason: reason,
        status: 'PENDING_TEAM_LEADER_REVIEW'
      });

      // Keep state same but mark as needing review
      assignment.needsReview = true;
      assignment.lastUpdated = new Date().toISOString();

      // Save assignment
      saveAssignment(assignment);

      // Move case to pending review state in local UI
      setAssignedCases(assignedCases.filter(c => c.id !== caseId));
      setMessage({
        type: 'success',
        text: `✓ Reassignment request sent to your Team Leader for review`
      });

      // Clear modal
      setShowReasonModal(null);
      setRequestReasonText({});
    } catch (error) {
      console.error('Error requesting reassignment:', error);
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleStartExecution = (caseId) => {
    try {
      const caseData = acceptedCases.find(c => c.id === caseId);
      if (!caseData) throw new Error('Case not found');

      let assignment = caseData.assignment;

      // Execute transition to IN_EXECUTION
      assignment = executeTransition(
        assignment,
        ASSIGNMENT_STATES.IN_EXECUTION,
        {
          toUser: userInfo.id,
          fromUser: userInfo.fullName,
          reason: `Auditor started audit execution`
        }
      );

      // Save assignment
      saveAssignment(assignment);

      // Update local state
      setAcceptedCases(acceptedCases.filter(c => c.id !== caseId));
      setMessage({
        type: 'success',
        text: `✓ Audit execution started. Good luck!`
      });
    } catch (error) {
      console.error('Error starting execution:', error);
      setMessage({ type: 'error', text: error.message });
    }
  };

  const getSkillsMatch = (caseData) => {
    const auditor = loadAuditor(userInfo?.id);
    if (!auditor) return null;

    const auditCaseExpertiseAreas = caseData.requiredExpertise || ['VAT', 'Revenue'];
    let matchedSkills = 0;

    if (auditor.expertise) {
      auditor.expertise.forEach(skill => {
        if (auditCaseExpertiseAreas.some(area => area.toLowerCase().includes(skill.area?.toLowerCase()))) {
          matchedSkills++;
        }
      });
    }

    const matchPercent = auditor.expertise
      ? Math.round((matchedSkills / auditCaseExpertiseAreas.length) * 100)
      : 50;

    return {
      percent: matchPercent,
      matched: matchedSkills,
      total: auditCaseExpertiseAreas.length,
      status: matchPercent >= 80 ? 'Excellent' : matchPercent >= 60 ? 'Good' : matchPercent >= 40 ? 'Fair' : 'Needs Review'
    };
  };

  const getSectorMatch = (caseData) => {
    const auditor = loadAuditor(userInfo?.id);
    if (!auditor) return null;

    const caseSector = caseData.businessSector || 'Other';
    const hasExperience = auditor.sectorExperience?.includes(caseSector);

    return {
      sector: caseSector,
      hasExperience: hasExperience
    };
  };

  const getTeamLeaderName = (assignment) => {
    if (!assignment || !assignment.assignmentChain) return 'Unknown';
    const tlAssignment = assignment.assignmentChain.find(a => a.action === 'ASSIGNED_BY_TEAM_LEADER');
    if (tlAssignment) {
      return tlAssignment.byUser;
    }
    return 'Unknown';
  };

  const getAssignmentDate = (assignment) => {
    if (!assignment || !assignment.assignmentChain) return new Date().toISOString();
    const entries = assignment.assignmentChain
      .filter(a => a.action === 'ASSIGNED_BY_TEAM_LEADER' || a.action === 'ASSIGNED_TO_AUDITOR')
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return entries.length > 0 ? entries[0].timestamp : assignment.createdAt;
  };

  const getDaysUntilDue = (assignment) => {
    if (!assignment || !assignment.slaDeadline) return null;
    const today = new Date();
    const deadline = new Date(assignment.slaDeadline);
    const diff = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (loading) {
    return <div style={{ padding: '24px' }}>Loading your assignments...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <div className="detail-header">
        <h2><i className="fas fa-check-square"></i> My Case Assignments</h2>
        <Badge status={`${assignedCases.length + acceptedCases.length} Cases`} className="director-approved" />
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

      {assignedCases.length === 0 && acceptedCases.length === 0 ? (
        <div style={{
          background: '#e3f2fd',
          color: '#0c4a6e',
          padding: '24px',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #1976d2'
        }}>
          <i className="fas fa-inbox" style={{ fontSize: '32px', marginBottom: '12px', display: 'block' }}></i>
          <strong>No assignments yet</strong>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px' }}>
            Cases will appear here when your Team Leader assigns them to you
          </p>
        </div>
      ) : (
        <>
          {/* PENDING ASSIGNMENTS */}
          {assignedCases.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#f0f6fc',
                marginBottom: '12px',
                textTransform: 'uppercase'
              }}>
                <i className="fas fa-hourglass-half" style={{ marginRight: '8px' }}></i>
                Pending Your Response ({assignedCases.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {assignedCases.map(c => {
                  const skillsMatch = getSkillsMatch(c);
                  const sectorMatch = getSectorMatch(c);
                  const daysUntilDue = getDaysUntilDue(c.assignment);

                  return (
                    <div key={c.id} style={{
                      background: '#1c2128',
                      border: '1px solid #30363d',
                      borderRadius: '6px',
                      overflow: 'hidden'
                    }}>
                      {/* Case Header */}
                      <div
                        onClick={() => setExpandedCase(expandedCase === c.id ? null : c.id)}
                        style={{
                          padding: '12px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          background: expandedCase === c.id ? '#2d333b' : 'transparent'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '4px' }}>
                            <strong style={{ color: '#f0f6fc' }}>{c.id.substring(0, 20)}...</strong>
                            <span style={{
                              background: c.riskLevel === 'Critical' ? '#ff5252' :
                                c.riskLevel === 'High' ? '#ff9800' :
                                c.riskLevel === 'Medium' ? '#ffc107' : '#4caf50',
                              color: '#fff',
                              padding: '3px 8px',
                              borderRadius: '3px',
                              fontSize: '10px',
                              fontWeight: 'bold'
                            }}>
                              {c.riskLevel}
                            </span>
                          </div>
                          <small style={{ color: '#8b949e' }}>
                            {c.taxpayerName} (TIN: {c.tin})
                          </small>
                        </div>
                        <div style={{ color: '#8b949e', fontSize: '12px' }}>
                          <i className="fas fa-chevron-down"></i>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedCase === c.id && (
                        <div style={{
                          background: '#0f1419',
                          borderTop: '1px solid #30363d',
                          padding: '12px',
                          borderRadius: '0 0 6px 6px'
                        }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            {/* Left Column: Case Details */}
                            <div>
                              <small style={{ color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>CASE DETAILS:</small>
                              <div style={{ fontSize: '11px', color: '#f0f6fc', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div><strong>Audit Type:</strong> {c.auditType?.replace(/_/g, ' ').toUpperCase()}</div>
                                <div><strong>Complexity:</strong> {c.complexity || 'Not Specified'}</div>
                                <div><strong>Est. Hours:</strong> {c.estimatedHours || 0}</div>
                                <div><strong>Business Sector:</strong> {c.businessSector || 'Other'}</div>
                                <div><strong>Revenue at Risk:</strong> ETB {((c.revenueAtRisk || 0) / 1000000).toFixed(1)}M</div>
                              </div>
                            </div>

                            {/* Right Column: Match & Timeline */}
                            <div>
                              <small style={{ color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>YOUR FIT & TIMELINE:</small>
                              <div style={{ fontSize: '11px', color: '#f0f6fc', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {skillsMatch && (
                                  <div style={{
                                    background: '#1c2128',
                                    border: '1px solid #30363d',
                                    padding: '6px 8px',
                                    borderRadius: '4px'
                                  }}>
                                    <div style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      marginBottom: '4px'
                                    }}>
                                      <strong>Skills Match:</strong>
                                      <span style={{
                                        background: skillsMatch.percent >= 80 ? '#4caf50' : skillsMatch.percent >= 60 ? '#ffc107' : '#ff9800',
                                        color: '#fff',
                                        padding: '2px 8px',
                                        borderRadius: '3px',
                                        fontSize: '10px',
                                        fontWeight: 'bold'
                                      }}>
                                        {skillsMatch.percent}% - {skillsMatch.status}
                                      </span>
                                    </div>
                                    <small style={{ color: '#8b949e' }}>
                                      {skillsMatch.matched}/{skillsMatch.total} skills match
                                    </small>
                                  </div>
                                )}

                                {sectorMatch && (
                                  <div>
                                    <strong>Sector Experience:</strong>
                                    <span style={{
                                      marginLeft: '8px',
                                      color: sectorMatch.hasExperience ? '#4caf50' : '#ff9800'
                                    }}>
                                      {sectorMatch.hasExperience ? '✓' : '⚠️'} {sectorMatch.sector}
                                    </span>
                                  </div>
                                )}

                                {c.assignment && (
                                  <>
                                    <div><strong>Assigned By:</strong> {getTeamLeaderName(c.assignment)}</div>
                                    <div><strong>Assignment Date:</strong> {new Date(getAssignmentDate(c.assignment)).toLocaleDateString()}</div>
                                  </>
                                )}

                                {daysUntilDue !== null && (
                                  <div style={{
                                    color: daysUntilDue <= 7 ? '#ff5252' : daysUntilDue <= 14 ? '#ff9800' : '#4caf50'
                                  }}>
                                    <strong>Due in:</strong> {daysUntilDue} days
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div style={{
                            display: 'flex',
                            gap: '12px',
                            paddingTop: '12px',
                            borderTop: '1px solid #30363d'
                          }}>
                            <button
                              onClick={() => handleAcceptAssignment(c.id)}
                              style={{
                                flex: 1,
                                padding: '10px 14px',
                                background: '#4caf50',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              <i className="fas fa-check"></i> Accept Assignment
                            </button>

                            <button
                              onClick={() => setShowReasonModal(c.id)}
                              style={{
                                flex: 1,
                                padding: '10px 14px',
                                background: '#ff9800',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              <i className="fas fa-redo"></i> Request Reassignment
                            </button>
                          </div>

                          {/* Reassignment Modal */}
                          {showReasonModal === c.id && (
                            <div style={{
                              marginTop: '12px',
                              background: '#2d333b',
                              padding: '12px',
                              borderRadius: '4px',
                              border: '1px solid #30363d'
                            }}>
                              <label style={{
                                fontSize: '11px',
                                color: '#8b949e',
                                fontWeight: 'bold',
                                display: 'block',
                                marginBottom: '6px'
                              }}>
                                Reason for Reassignment:
                              </label>
                              <textarea
                                value={requestReasonText[c.id] || ''}
                                onChange={(e) => setRequestReasonText({
                                  ...requestReasonText,
                                  [c.id]: e.target.value
                                })}
                                placeholder="Please explain why you're requesting reassignment..."
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
                                  resize: 'none',
                                  marginBottom: '8px'
                                }}
                              />
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  onClick={() => handleRequestReassignment(c.id, requestReasonText[c.id])}
                                  style={{
                                    flex: 1,
                                    padding: '8px',
                                    background: '#ff9800',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Submit Request
                                </button>
                                <button
                                  onClick={() => setShowReasonModal(null)}
                                  style={{
                                    flex: 1,
                                    padding: '8px',
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
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ACCEPTED ASSIGNMENTS */}
          {acceptedCases.length > 0 && (
            <div>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#f0f6fc',
                marginBottom: '12px',
                textTransform: 'uppercase'
              }}>
                <i className="fas fa-thumbs-up" style={{ marginRight: '8px' }}></i>
                Accepted Cases ({acceptedCases.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {acceptedCases.map(c => (
                  <div key={c.id} style={{
                    background: '#1c2128',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    padding: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '4px' }}>
                        <strong style={{ color: '#f0f6fc' }}>{c.id.substring(0, 20)}...</strong>
                        <span style={{
                          background: '#4caf50',
                          color: '#fff',
                          padding: '3px 8px',
                          borderRadius: '3px',
                          fontSize: '10px',
                          fontWeight: 'bold'
                        }}>
                          ACCEPTED
                        </span>
                      </div>
                      <small style={{ color: '#8b949e' }}>
                        {c.taxpayerName} (TIN: {c.tin}) | {c.estimatedHours}hrs
                      </small>
                    </div>

                    <button
                      onClick={() => handleStartExecution(c.id)}
                      style={{
                        padding: '8px 14px',
                        background: '#1976d2',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <i className="fas fa-play"></i> Start Execution
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MyAssignmentsView;
