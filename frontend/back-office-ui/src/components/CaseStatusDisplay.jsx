import React, { useEffect, useState } from 'react';

/**
 * CaseStatusDisplay Component - Phase 8.3.1
 * 
 * React functional component for displaying enhanced case status information with workflow progression.
 * 
 * Features:
 * - Display current case status with color coding:
 *   - PENDING_ASSIGNMENT = yellow
 *   - APPROVED = green
 *   - TEAM_ASSIGNED = blue
 *   - AUDITOR_ASSIGNED = purple
 * - Show assigned team leader name if status >= TEAM_ASSIGNED (display "Not yet assigned" if null)
 * - Show assigned auditor name if status >= AUDITOR_ASSIGNED (display "Not yet assigned" if null)
 * - Show handoff date and reason if available (formatted timestamp + reason text)
 * - Show assignment date if auditor assigned
 * - Responsive layout: stack on mobile, grid on desktop
 * 
 * Props:
 * - caseData: ApAuditCase object with fields:
 *   - id: UUID
 *   - caseNumber: string
 *   - status: string (PENDING_ASSIGNMENT, APPROVED, TEAM_ASSIGNED, AUDITOR_ASSIGNED)
 *   - assignedTeamLeaderId: UUID (optional)
 *   - assignedTeamLeaderName: string (optional)
 *   - handoffDate: ISO datetime string (optional)
 *   - handoffReason: string (optional)
 *   - assignedAuditorId: UUID (optional)
 *   - assignedAuditorName: string (optional)
 *   - assignedDate: ISO datetime string (optional)
 * - onFetchUserNames: Optional function to fetch user names if IDs provided but names not included
 * 
 * Integration:
 * - Receives ApAuditCase object with new handoff workflow fields
 * - Optionally fetches user names via API if needed
 */
function CaseStatusDisplay({ caseData, onFetchUserNames }) {
  const [teamLeaderName, setTeamLeaderName] = useState(caseData?.assignedTeamLeaderName || null);
  const [auditorName, setAuditorName] = useState(caseData?.assignedAuditorName || null);

  // Fetch user names if IDs provided but names not available
  useEffect(() => {
    const fetchNames = async () => {
      const namesToFetch = [];
      
      if (caseData?.assignedTeamLeaderId && !caseData?.assignedTeamLeaderName) {
        namesToFetch.push({ id: caseData.assignedTeamLeaderId, type: 'team-leader' });
      }
      
      if (caseData?.assignedAuditorId && !caseData?.assignedAuditorName) {
        namesToFetch.push({ id: caseData.assignedAuditorId, type: 'auditor' });
      }

      if (namesToFetch.length > 0 && onFetchUserNames) {
        try {
          const names = await onFetchUserNames(namesToFetch);
          if (names.teamLeaderName) setTeamLeaderName(names.teamLeaderName);
          if (names.auditorName) setAuditorName(names.auditorName);
        } catch (err) {
          console.error('Error fetching user names:', err);
        }
      }
    };

    fetchNames();
  }, [caseData, onFetchUserNames]);

  if (!caseData) {
    return (
      <div style={{ padding: '20px', color: '#999' }}>
        <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
        No case data available
      </div>
    );
  }

  // Status configuration
  const statusConfig = {
    PENDING_ASSIGNMENT: {
      label: 'Pending Assignment',
      color: '#ff9800',
      bgColor: 'rgba(255, 152, 0, 0.1)',
      borderColor: 'rgba(255, 152, 0, 0.3)',
      icon: 'fa-hourglass-half',
    },
    APPROVED: {
      label: 'Approved',
      color: '#4caf50',
      bgColor: 'rgba(76, 175, 80, 0.1)',
      borderColor: 'rgba(76, 175, 80, 0.3)',
      icon: 'fa-check-circle',
    },
    TEAM_ASSIGNED: {
      label: 'Team Assigned',
      color: '#1976d2',
      bgColor: 'rgba(25, 118, 210, 0.1)',
      borderColor: 'rgba(25, 118, 210, 0.3)',
      icon: 'fa-users',
    },
    AUDITOR_ASSIGNED: {
      label: 'Auditor Assigned',
      color: '#7b1fa2',
      bgColor: 'rgba(123, 31, 162, 0.1)',
      borderColor: 'rgba(123, 31, 162, 0.3)',
      icon: 'fa-user-check',
    },
  };

  const currentStatus = caseData.status || 'PENDING_ASSIGNMENT';
  const config = statusConfig[currentStatus] || statusConfig.PENDING_ASSIGNMENT;

  // Utility function to format timestamp
  const formatTimestamp = (datetime) => {
    if (!datetime) return null;
    try {
      const date = new Date(datetime);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return datetime;
    }
  };

  // Determine which workflow stages are visible
  const statusIndex = {
    PENDING_ASSIGNMENT: 0,
    APPROVED: 1,
    TEAM_ASSIGNED: 2,
    AUDITOR_ASSIGNED: 3,
  };

  const currentStageIndex = statusIndex[currentStatus] || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Main Status Card */}
      <div style={{
        background: config.bgColor,
        border: `2px solid ${config.borderColor}`,
        borderRadius: '8px',
        padding: '20px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px',
        }}>
          <i className={`fas ${config.icon}`} style={{ fontSize: '24px', color: config.color }}></i>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Current Status
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: config.color }}>
              {config.label}
            </div>
          </div>
        </div>
        
        {/* Case Number */}
        <div style={{
          fontSize: '13px',
          color: '#666',
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: `1px solid ${config.borderColor}`,
        }}>
          <strong>Case:</strong> {caseData.caseNumber}
        </div>
      </div>

      {/* Workflow Progression */}
      <div style={{
        background: '#f9f9f9',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '20px',
      }}>
        <div style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#999',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '16px',
        }}>
          <i className="fas fa-stream" style={{ marginRight: '8px' }}></i>
          Workflow Progression
        </div>

        {/* Timeline */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
        }}>
          {/* Stage 1: Approved */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '12px',
            paddingBottom: '12px',
            paddingTop: currentStageIndex === 0 ? '0' : '12px',
            borderBottom: currentStageIndex > 0 ? '1px solid #e0e0e0' : 'none',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: currentStageIndex >= 1 ? '#4caf50' : '#ddd',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '600',
              flexShrink: 0,
            }}>
              <i className="fas fa-check" style={{ fontSize: '12px' }}></i>
            </div>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: currentStageIndex >= 1 ? '#333' : '#999',
              }}>
                Case Approved
              </div>
              <div style={{
                fontSize: '12px',
                color: '#999',
                marginTop: '4px',
              }}>
                Case has been reviewed and approved
              </div>
            </div>
          </div>

          {/* Stage 2: Team Assigned */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '12px',
            paddingBottom: '12px',
            paddingTop: '12px',
            borderBottom: currentStageIndex > 1 ? '1px solid #e0e0e0' : 'none',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: currentStageIndex >= 2 ? '#1976d2' : '#ddd',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '600',
              flexShrink: 0,
            }}>
              {currentStageIndex >= 2 ? <i className="fas fa-check" style={{ fontSize: '12px' }}></i> : '2'}
            </div>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: currentStageIndex >= 2 ? '#333' : '#999',
              }}>
                Handed Off to Team Leader
              </div>
              {currentStageIndex >= 2 ? (
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  marginTop: '4px',
                  lineHeight: '1.5',
                }}>
                  <div>
                    <strong>Team Leader:</strong> {teamLeaderName || 'Not yet assigned'}
                  </div>
                  {caseData.handoffDate && (
                    <div style={{ marginTop: '4px' }}>
                      <strong>Handoff Date:</strong> {formatTimestamp(caseData.handoffDate)}
                    </div>
                  )}
                  {caseData.handoffReason && (
                    <div style={{ marginTop: '4px' }}>
                      <strong>Reason:</strong> {caseData.handoffReason}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{
                  fontSize: '12px',
                  color: '#999',
                  marginTop: '4px',
                }}>
                  Awaiting handoff to team leader
                </div>
              )}
            </div>
          </div>

          {/* Stage 3: Auditor Assigned */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '12px',
            paddingTop: '12px',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: currentStageIndex >= 3 ? '#7b1fa2' : '#ddd',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '600',
              flexShrink: 0,
            }}>
              {currentStageIndex >= 3 ? <i className="fas fa-check" style={{ fontSize: '12px' }}></i> : '3'}
            </div>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: currentStageIndex >= 3 ? '#333' : '#999',
              }}>
                Assigned to Auditor
              </div>
              {currentStageIndex >= 3 ? (
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  marginTop: '4px',
                  lineHeight: '1.5',
                }}>
                  <div>
                    <strong>Auditor:</strong> {auditorName || 'Not yet assigned'}
                  </div>
                  {caseData.assignedDate && (
                    <div style={{ marginTop: '4px' }}>
                      <strong>Assignment Date:</strong> {formatTimestamp(caseData.assignedDate)}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{
                  fontSize: '12px',
                  color: '#999',
                  marginTop: '4px',
                }}>
                  Awaiting auditor assignment
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Badge Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px',
        '@media (max-width: 640px)': {
          gridTemplateColumns: '1fr',
        },
      }}>
        {/* Approval Status */}
        <div style={{
          background: '#f5f5f5',
          border: '1px solid #e0e0e0',
          borderRadius: '6px',
          padding: '12px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#999',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px',
          }}>
            Approval
          </div>
          <div style={{
            fontSize: '14px',
            fontWeight: '700',
            color: currentStageIndex >= 1 ? '#4caf50' : '#999',
          }}>
            <i className="fas fa-check-circle" style={{ marginRight: '6px' }}></i>
            {currentStageIndex >= 1 ? 'Approved' : 'Pending'}
          </div>
        </div>

        {/* Team Assignment Status */}
        <div style={{
          background: '#f5f5f5',
          border: '1px solid #e0e0e0',
          borderRadius: '6px',
          padding: '12px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#999',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px',
          }}>
            Team Leader
          </div>
          <div style={{
            fontSize: '14px',
            fontWeight: '700',
            color: currentStageIndex >= 2 ? '#1976d2' : '#999',
          }}>
            <i className="fas fa-users" style={{ marginRight: '6px' }}></i>
            {currentStageIndex >= 2 ? 'Assigned' : 'Pending'}
          </div>
        </div>

        {/* Auditor Assignment Status */}
        <div style={{
          background: '#f5f5f5',
          border: '1px solid #e0e0e0',
          borderRadius: '6px',
          padding: '12px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#999',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px',
          }}>
            Auditor
          </div>
          <div style={{
            fontSize: '14px',
            fontWeight: '700',
            color: currentStageIndex >= 3 ? '#7b1fa2' : '#999',
          }}>
            <i className="fas fa-user-check" style={{ marginRight: '6px' }}></i>
            {currentStageIndex >= 3 ? 'Assigned' : 'Pending'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaseStatusDisplay;
