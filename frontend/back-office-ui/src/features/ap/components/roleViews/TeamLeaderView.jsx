import React, { useState } from 'react';
import ProtectedRoute from '../ProtectedRoute';
import RoleLayout from '../layouts/RoleLayout';
import TeamLeaderDashboard from '../dashboards/TeamLeaderDashboard';
import AuditCasesListView from '../views/AuditCasesListView';
import ConfigurationView from '../views/ConfigurationView';
import CaseAssignmentView from '../views/CaseAssignmentView';
import TeamLeaderCaseManagementView from '../views/assignments/TeamLeaderCaseManagementView';

function TeamLeaderView() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <TeamLeaderDashboard />;
      case 'team-cases':
      case 'team-progress':
        return <AuditCasesListView />;
      case 'case-management':
        return <TeamLeaderCaseManagementView />;
      case 'case-assignment':
        return <CaseAssignmentView />;
      case 'configuration':
        return <ConfigurationView />;
      default:
        return <TeamLeaderDashboard />;
    }
  };

  return (
    <ProtectedRoute requiredRoles={['team_leader']}>
      <RoleLayout currentView={currentView} onNavigate={setCurrentView}>
        {renderContent()}
      </RoleLayout>
    </ProtectedRoute>
  );
}

export default TeamLeaderView;
