import React, { useState } from 'react';
import ProtectedRoute from '../ProtectedRoute';
import RoleLayout from '../layouts/RoleLayout';
import SeniorManagementDashboard from '../dashboards/SeniorManagementDashboard';
import SeniorManagementFinalApproval from '../views/SeniorManagementFinalApproval';
import PlanJourneyView from '../views/PlanJourneyView';
import ConfigurationView from '../views/ConfigurationView';

function SeniorManagementView() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <SeniorManagementDashboard />;
      case 'pending-approval':
        // ✅ NEW: Single unified final approval page
        return <SeniorManagementFinalApproval />;
      case 'plan-journey':
        return <PlanJourneyView />;
      case 'configuration':
        return <ConfigurationView />;
      default:
        return <SeniorManagementDashboard />;
    }
  };

  return (
    <ProtectedRoute requiredRoles={['senior_management']}>
      <RoleLayout currentView={currentView} onNavigate={setCurrentView}>
        {renderContent()}
      </RoleLayout>
    </ProtectedRoute>
  );
}

export default SeniorManagementView;
