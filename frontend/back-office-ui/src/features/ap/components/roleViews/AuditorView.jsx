import React, { useState } from 'react';
import ProtectedRoute from '../ProtectedRoute';
import RoleLayout from '../layouts/RoleLayout';
import AuditorDashboard from '../dashboards/AuditorDashboard';
import AuditCasesListView from '../views/AuditCasesListView';
import ConfigurationView from '../views/ConfigurationView';

function AuditorView() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <AuditorDashboard />;
      case 'my-cases':
      case 'case-execution':
        return <AuditCasesListView />;
      case 'configuration':
        return <ConfigurationView />;
      default:
        return <AuditorDashboard />;
    }
  };

  return (
    <ProtectedRoute requiredRoles={['auditor']}>
      <RoleLayout currentView={currentView} onNavigate={setCurrentView}>
        {renderContent()}
      </RoleLayout>
    </ProtectedRoute>
  );
}

export default AuditorView;
