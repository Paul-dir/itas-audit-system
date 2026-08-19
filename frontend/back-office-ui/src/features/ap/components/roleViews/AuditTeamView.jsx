import React, { useState } from 'react';
import ProtectedRoute from '../ProtectedRoute';
import RoleLayout from '../layouts/RoleLayout';
import AuditTeamDashboard from '../dashboards/AuditTeamDashboard';
import AuditPlanningView from '../views/AuditPlanningView';
import AuditPlanningTeamAmendView from '../views/AuditPlanningTeamAmendView';
import PlanJourneyView from '../views/PlanJourneyView';
import ConfigurationView from '../views/ConfigurationView';
import CascadePlanToCasesView from '../views/CascadePlanToCasesView';
import PlanConfigurationPage from '../../pages/planning/PlanConfigurationPage.jsx';

/**
 * Audit Team View Container
 * Shows ONLY pages for Audit Planning Team role
 */
function AuditTeamView() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <AuditTeamDashboard />;
      case 'amend-plans':
        return <AuditPlanningTeamAmendView />;
      case 'plan-journey':
        return <PlanJourneyView />;
      case 'plan-configuration':
        return <PlanConfigurationPage />;
      case 'risk-engine':
      case 'create-plan':
      case 'my-plans':
      case 'feedback-review':
      case 'revisions':
      case 'reports':
        return <AuditPlanningView currentView={currentView} />;
      case 'cascade-plan-cases':
        return <CascadePlanToCasesView />;
      case 'configuration':
        return <ConfigurationView />;
      default:
        return <AuditTeamDashboard />;
    }
  };

  return (
    <ProtectedRoute requiredRoles={['audit_team', 'audit_team_leader']}>
      <RoleLayout currentView={currentView} onNavigate={setCurrentView}>
        {renderContent()}
      </RoleLayout>
    </ProtectedRoute>
  );
}

export default AuditTeamView;
