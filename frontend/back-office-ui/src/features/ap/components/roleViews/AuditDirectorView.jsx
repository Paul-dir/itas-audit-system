import React, { useState } from 'react';
import ProtectedRoute from '../ProtectedRoute';
import RoleLayout from '../layouts/RoleLayout';
import AuditDirectorDashboard from '../dashboards/AuditDirectorDashboard';
import DirectorInitialApprovalView from '../views/DirectorInitialApprovalView';
import DirectorPlanReview from '../views/DirectorPlanReview';
import PlanJourneyView from '../views/PlanJourneyView';
import ApprovedPlansDeploymentView from '../views/ApprovedPlansDeploymentView';
import PlanSubmissionToRegionsView from '../views/PlanSubmissionToRegionsView';
import ConfigurationView from '../views/ConfigurationView';

function AuditDirectorView() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <AuditDirectorDashboard />;
      case 'initial-approval':
        // ✅ NEW: Initial plan approval & feedback review
        return <DirectorInitialApprovalView />;
      case 'review-queue':
        // ✅ Unified plan review page
        return <DirectorPlanReview />;
      case 'plan-journey':
        return <PlanJourneyView />;
      case 'deployment':
        return <ApprovedPlansDeploymentView userRole="director" />;
      case 'submit-plan-to-regions':
        return <PlanSubmissionToRegionsView />;
      case 'configuration':
        return <ConfigurationView />;
      default:
        return <AuditDirectorDashboard />;
    }
  };

  return (
    <ProtectedRoute requiredRoles={['audit_director']}>
      <RoleLayout currentView={currentView} onNavigate={setCurrentView}>
        {renderContent()}
      </RoleLayout>
    </ProtectedRoute>
  );
}

export default AuditDirectorView;
