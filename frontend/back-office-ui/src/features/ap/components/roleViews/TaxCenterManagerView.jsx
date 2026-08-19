import React, { useState } from 'react';
import ProtectedRoute from '../ProtectedRoute';
import RoleLayout from '../layouts/RoleLayout';
import TaxCenterManagerDashboard from '../dashboards/TaxCenterManagerDashboard';
import TaxCenterView from '../views/TaxCenterView';
import CascadePlanToCasesView from '../views/CascadePlanToCasesView';
import AuditCasesListView from '../views/AuditCasesListView';
import TaxCenterAcceptancePlanView from '../views/TaxCenterAcceptancePlanView';
import TaxCenterReceiveAllocationsView from '../views/TaxCenterReceiveAllocationsView';
import ConfigurationView from '../views/ConfigurationView';
import CasePrioritizationView from '../views/CasePrioritizationView';
import CaseAssignmentView from '../views/CaseAssignmentView';
import RequestForAuditView from '../views/RequestForAuditView';
import StoredCasesView from '../views/StoredCasesView';
import AuditCaseTypesConfigView from '../views/AuditCaseTypesConfigView';

function TaxCenterManagerView() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <TaxCenterManagerDashboard />;
      case 'receive-allocations':
        return <TaxCenterReceiveAllocationsView />;
      case 'accept-approved-plan':
        return <TaxCenterAcceptancePlanView />;
      case 'cascade-plan-cases':
        return <CascadePlanToCasesView />;
      case 'audit-cases':
        return <AuditCasesListView />;
      case 'case-prioritization':
        return <CasePrioritizationView />;
      case 'case-assignment':
        return <CaseAssignmentView />;
      case 'requests':
        return <RequestForAuditView />;
      case 'stored-cases':
        return <StoredCasesView />;
      case 'case-types':
        return <AuditCaseTypesConfigView />;
      case 'capacity-status':
      case 'execution-reports':
        return <TaxCenterView currentView={currentView} />;
      case 'configuration':
        return <ConfigurationView />;
      default:
        return <TaxCenterManagerDashboard />;
    }
  };

  return (
    <ProtectedRoute requiredRoles={['tax_center_manager']}>
      <RoleLayout currentView={currentView} onNavigate={setCurrentView}>
        {renderContent()}
      </RoleLayout>
    </ProtectedRoute>
  );
}

export default TaxCenterManagerView;
