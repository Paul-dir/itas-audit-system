import React, { useState } from 'react';
import ProtectedRoute from '../ProtectedRoute';
import RoleLayout from '../layouts/RoleLayout';
import RegionalDirectorDashboard from '../dashboards/RegionalDirectorDashboard';
import RegionalDirectorReceivePlansView from '../views/RegionalDirectorReceivePlansView';
import RegionalDirectorAllocateView from '../views/RegionalDirectorAllocateView';
import RegionalDirectorCollectFeedbackView from '../views/RegionalDirectorCollectFeedbackView';
import ConfigurationView from '../views/ConfigurationView';

function RegionalDirectorView() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <RegionalDirectorDashboard />;
      case 'receive-plans':
        return <RegionalDirectorReceivePlansView />;
      case 'allocate-to-tax-centers':
        return <RegionalDirectorAllocateView />;
      case 'collect-feedback':
        return <RegionalDirectorCollectFeedbackView />;
      case 'configuration':
        return <ConfigurationView />;
      default:
        return <RegionalDirectorDashboard />;
    }
  };

  return (
    <ProtectedRoute requiredRoles={['regional_director']}>
      <RoleLayout currentView={currentView} onNavigate={setCurrentView}>
        {renderContent()}
      </RoleLayout>
    </ProtectedRoute>
  );
}

export default RegionalDirectorView;
