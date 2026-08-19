import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AssignToTeamLeadersView from './assignments/AssignToTeamLeadersView';
import AssignToAuditorsView from './assignments/AssignToAuditorsView';
import MyAssignmentsView from './assignments/MyAssignmentsView';
import CaseReallocationView from './assignments/CaseReallocationView';

/**
 * CaseAssignmentView - Router Container
 * Routes to appropriate assignment view based on user role
 * 
 * - Tax Center Manager → AssignToTeamLeadersView
 * - Team Leader → AssignToAuditorsView
 * - Auditor → MyAssignmentsView
 * - Process Owner → CaseReallocationView
 */

function CaseAssignmentView() {
  const { getUserInfo } = useAuth();
  const userInfo = getUserInfo();
  const userRole = userInfo?.role?.toUpperCase();

  // Render appropriate view based on role
  const renderView = () => {
    switch (userRole) {
      case 'TAX_CENTER_MANAGER':
        return <AssignToTeamLeadersView />;
      
      case 'TEAM_LEADER':
        return <AssignToAuditorsView />;
      
      case 'AUDITOR':
        return <MyAssignmentsView />;
      
      case 'PROCESS_OWNER':
        return <CaseReallocationView />;
      
      case 'SENIOR_MANAGEMENT':
        // Senior Management can view re-allocation for oversight
        return <CaseReallocationView />;
      
      default:
        return (
          <div style={{ padding: '24px' }}>
            <div style={{
              background: '#ffebee',
              color: '#c62828',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #ef5350'
            }}>
              <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
              <strong>Access Denied</strong>
              <p style={{ margin: '8px 0 0 0', fontSize: '12px' }}>
                Your role ({userRole}) does not have access to case assignment features.
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '12px' }}>
                Available roles: Tax Center Manager, Team Leader, Auditor, Process Owner
              </p>
            </div>
          </div>
        );
    }
  };

  if (!userInfo) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{
          background: '#fff3cd',
          color: '#856404',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #ffc107'
        }}>
          <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
          <strong>Loading User Context</strong>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px' }}>
            Please wait while we load your user information...
          </p>
        </div>
      </div>
    );
  }

  return renderView();
}

export default CaseAssignmentView;
