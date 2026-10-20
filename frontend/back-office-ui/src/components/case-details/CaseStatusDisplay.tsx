import React, { useEffect, useState } from 'react';

/**
 * CaseStatusDisplay Component - Task 8.3.1
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
 *   - auditorCode: string (optional)
 *   - assignedDate: ISO datetime string (optional)
 * - onFetchUserNames: Optional function to fetch user names if IDs provided but names not included
 * - isLoading: Optional boolean indicating if data is loading
 * - error: Optional string with error message
 */

interface UserNameFetchRequest {
  id: string;
  type: 'team-leader' | 'auditor';
}

interface UserNameFetchResponse {
  teamLeaderName?: string;
  auditorName?: string;
  auditorCode?: string;
}

interface CaseStatusDisplayProps {
  caseData?: {
    id?: string;
    caseNumber?: string;
    status?: string;
    assignedTeamLeaderId?: string;
    assignedTeamLeaderName?: string;
    handoffDate?: string;
    handoffReason?: string;
    assignedAuditorId?: string;
    assignedAuditorName?: string;
    auditorCode?: string;
    assignedDate?: string;
  };
  onFetchUserNames?: (namesToFetch: UserNameFetchRequest[]) => Promise<UserNameFetchResponse>;
  isLoading?: boolean;
  error?: string;
}

const CaseStatusDisplay: React.FC<CaseStatusDisplayProps> = ({
  caseData,
  onFetchUserNames,
  isLoading = false,
  error,
}) => {
  const [teamLeaderName, setTeamLeaderName] = useState<string | null>(
    caseData?.assignedTeamLeaderName || null
  );
  const [auditorName, setAuditorName] = useState<string | null>(
    caseData?.assignedAuditorName || null
  );
  const [auditorCode, setAuditorCode] = useState<string | null>(
    caseData?.auditorCode || null
  );

  // Fetch user names if IDs provided but names not available
  useEffect(() => {
    const fetchNames = async () => {
      const namesToFetch: UserNameFetchRequest[] = [];

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
          if (names.auditorCode) setAuditorCode(names.auditorCode);
        } catch (err) {
          console.error('Error fetching user names:', err);
        }
      }
    };

    fetchNames();
  }, [caseData, onFetchUserNames]);

  // Loading state
  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
        <i
          className="fas fa-spinner fa-spin"
          style={{ marginRight: '8px', fontSize: '18px' }}
        ></i>
        Loading case information...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        style={{
          padding: '20px',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          border: '1px solid #f44336',
          borderRadius: '8px',
          color: '#d32f2f',
        }}
      >
        <i
          className="fas fa-exclamation-circle"
          style={{ marginRight: '8px', fontSize: '18px' }}
        ></i>
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (!caseData) {
    return (
      <div style={{ padding: '20px', color: '#999' }}>
        <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
        No case data available
      </div>
    );
  }

  // Status configuration
  const statusConfig: Record<
    string,
    {
      label: string;
      color: string;
      bgColor: string;
      borderColor: string;
      icon: string;
    }
  > = {
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
  const formatTimestamp = (datetime: string): string => {
    if (!datetime) return '';
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
  const statusIndex: Record<string, number> = {
    PENDING_ASSIGNMENT: 0,
    APPROVED: 1,
    TEAM_ASSIGNED: 2,
    AUDITOR_ASSIGNED: 3,
  };

  const currentStageIndex = statusIndex[currentStatus] || 0;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  const mainCardStyle: React.CSSProperties = {
    background: config.bgColor,
    border: `2px solid ${config.borderColor}`,
    borderRadius: '8px',
    padding: '20px',
  };

  const cardHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '24px',
    color: config.color,
  };

  const statusLabelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const statusValueStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '700',
    color: config.color,
  };

  const caseNumberStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#666',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: `1px solid ${config.borderColor}`,
  };

  const workflowContainerStyle: React.CSSProperties = {
    background: '#f9f9f9',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '20px',
  };

  const workflowHeaderStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '16px',
  };

  const timelineStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  };

  const stageStyle = (stageIndex: number): React.CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: '12px',
    paddingBottom: '12px',
    paddingTop: stageIndex === 0 ? '0' : '12px',
    borderBottom: currentStageIndex > stageIndex ? '1px solid #e0e0e0' : 'none',
  });

  const stageCircleStyle = (stageIndex: number, isCompleted: boolean): React.CSSProperties => ({
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: isCompleted ? (stageIndex === 1 ? '#4caf50' : stageIndex === 2 ? '#1976d2' : '#7b1fa2') : '#ddd',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
    flexShrink: 0,
  });

  const stageTitleStyle = (isCompleted: boolean): React.CSSProperties => ({
    fontSize: '14px',
    fontWeight: '600',
    color: isCompleted ? '#333' : '#999',
  });

  const stageDescriptionStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#999',
    marginTop: '4px',
  };

  const stageDetailStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#666',
    marginTop: '4px',
    lineHeight: '1.5',
  };

  const badgeGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
  };

  const badgeStyle: React.CSSProperties = {
    background: '#f5f5f5',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    padding: '12px',
    textAlign: 'center',
  };

  const badgeLabelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  };

  return (
    <div style={containerStyle}>
      {/* Main Status Card */}
      <div style={mainCardStyle}>
        <div style={cardHeaderStyle}>
          <i className={`fas ${config.icon}`} style={iconStyle}></i>
          <div>
            <div style={statusLabelStyle}>Current Status</div>
            <div style={statusValueStyle}>{config.label}</div>
          </div>
        </div>

        {/* Case Number */}
        <div style={caseNumberStyle}>
          <strong>Case:</strong> {caseData.caseNumber}
        </div>
      </div>

      {/* Workflow Progression */}
      <div style={workflowContainerStyle}>
        <div style={workflowHeaderStyle}>
          <i className="fas fa-stream" style={{ marginRight: '8px' }}></i>
          Workflow Progression
        </div>

        {/* Timeline */}
        <div style={timelineStyle}>
          {/* Stage 1: Approved */}
          <div style={stageStyle(0)}>
            <div style={stageCircleStyle(1, currentStageIndex >= 1)}>
              <i className="fas fa-check" style={{ fontSize: '12px' }}></i>
            </div>
            <div>
              <div style={stageTitleStyle(currentStageIndex >= 1)}>Case Approved</div>
              <div style={stageDescriptionStyle}>
                Case has been reviewed and approved
              </div>
            </div>
          </div>

          {/* Stage 2: Team Assigned */}
          <div style={stageStyle(1)}>
            <div style={stageCircleStyle(2, currentStageIndex >= 2)}>
              {currentStageIndex >= 2 ? (
                <i className="fas fa-check" style={{ fontSize: '12px' }}></i>
              ) : (
                '2'
              )}
            </div>
            <div>
              <div style={stageTitleStyle(currentStageIndex >= 2)}>Handed Off to Team Leader</div>
              {currentStageIndex >= 2 ? (
                <div style={stageDetailStyle}>
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
                <div style={stageDescriptionStyle}>Awaiting handoff to team leader</div>
              )}
            </div>
          </div>

          {/* Stage 3: Auditor Assigned */}
          <div style={stageStyle(2)}>
            <div style={stageCircleStyle(3, currentStageIndex >= 3)}>
              {currentStageIndex >= 3 ? (
                <i className="fas fa-check" style={{ fontSize: '12px' }}></i>
              ) : (
                '3'
              )}
            </div>
            <div>
              <div style={stageTitleStyle(currentStageIndex >= 3)}>Assigned to Auditor</div>
              {currentStageIndex >= 3 ? (
                <div style={stageDetailStyle}>
                  <div>
                    <strong>Auditor:</strong> {auditorName || 'Not yet assigned'}
                  </div>
                  {auditorCode && (
                    <div style={{ marginTop: '4px' }}>
                      <strong>Auditor Code:</strong> {auditorCode}
                    </div>
                  )}
                  {caseData.assignedDate && (
                    <div style={{ marginTop: '4px' }}>
                      <strong>Assignment Date:</strong> {formatTimestamp(caseData.assignedDate)}
                    </div>
                  )}
                </div>
              ) : (
                <div style={stageDescriptionStyle}>Awaiting auditor assignment</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Badge Summary */}
      <div style={badgeGridStyle}>
        {/* Approval Status */}
        <div style={badgeStyle}>
          <div style={badgeLabelStyle}>Approval</div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: '700',
              color: currentStageIndex >= 1 ? '#4caf50' : '#999',
            }}
          >
            <i className="fas fa-check-circle" style={{ marginRight: '6px' }}></i>
            {currentStageIndex >= 1 ? 'Approved' : 'Pending'}
          </div>
        </div>

        {/* Team Assignment Status */}
        <div style={badgeStyle}>
          <div style={badgeLabelStyle}>Team Leader</div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: '700',
              color: currentStageIndex >= 2 ? '#1976d2' : '#999',
            }}
          >
            <i className="fas fa-users" style={{ marginRight: '6px' }}></i>
            {currentStageIndex >= 2 ? 'Assigned' : 'Pending'}
          </div>
        </div>

        {/* Auditor Assignment Status */}
        <div style={badgeStyle}>
          <div style={badgeLabelStyle}>Auditor</div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: '700',
              color: currentStageIndex >= 3 ? '#7b1fa2' : '#999',
            }}
          >
            <i className="fas fa-user-check" style={{ marginRight: '6px' }}></i>
            {currentStageIndex >= 3 ? 'Assigned' : 'Pending'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStatusDisplay;
